"""
Story endpoints — MVP implementation.

Routes:
  POST /api/story/start        → initialise session, return segment 0 + selected challenge
  POST /api/story/tts          → text-to-speech audio bytes
  POST /api/story/stt          → speech-to-text; saves child_name to session
  POST /api/story/adapt        → adapt narrative based on verify result; state transition on pass
  GET  /api/story/badge        → return latest badge earned by session
"""

import json
import uuid
from pathlib import Path

from fastapi import APIRouter, Response, UploadFile, File, Form, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from services.story import SessionState, sessions, select_challenge
from services.tts import generate_speech
from services.stt import transcribe_audio

router = APIRouter(tags=["story"])

# Resolve the stories directory relative to this file:
#   backend/routes/story.py  → backend/ → backend/stories/
_STORIES_DIR = Path(__file__).resolve().parent.parent / "stories"


# ---------------------------------------------------------------------------
# POST /api/story/start
# ---------------------------------------------------------------------------

class StoryStartRequest(BaseModel):
    """Request body for POST /api/story/start."""
    story_id: str


@router.post("/story/start")
async def story_start(request: StoryStartRequest):
    """
    Initialise a new play session for the requested story.

    Steps (per AGENTS.md):
      1. Generate session_id (UUID)
      2. Load story JSON; 404 if not found
      3. Select segment 0
      4. Create and store SessionState
      5. Call select_challenge(segment, theme)
      6. Return segment 0 data + selected challenge
    """
    # 1 — session id
    session_id = str(uuid.uuid4())

    # 2 — load story JSON
    story_path = _STORIES_DIR / f"{request.story_id}.json"
    if not story_path.exists():
        return {
            "error": "story_not_found",
            "message": "Story ID does not exist",
            "status_code": 404,
        }

    with story_path.open(encoding="utf-8") as f:
        story = json.load(f)

    # 3 — segment 0
    segment = story["segments"][0]

    # 4 — create and persist session state
    session = SessionState(
        session_id=session_id,
        story_id=request.story_id,
        current_segment=0,
    )

    # 5 — challenge selection
    selected_challenge = select_challenge(segment, story["theme"])
    session.current_challenge = selected_challenge["action"]

    # 6 — store session (after challenge is set)
    sessions[session_id] = session

    return {
        "session_id": session_id,
        "child_name": "",
        "segment": {
            "segment_index": segment["segment_index"],
            "narrative_text": segment["narrative_text"],
            "narration_tts": segment["narration_tts"],
        },
        "selected_challenge": {
            "action": selected_challenge["action"],
            "display_text": selected_challenge["display_text"],
            "tts_text": selected_challenge["tts_text"],
            "difficulty": selected_challenge["difficulty"],
            "fallback_action": selected_challenge["fallback_action"],
        },
    }


# ---------------------------------------------------------------------------
# POST /api/story/tts
# ---------------------------------------------------------------------------

class StoryTTSRequest(BaseModel):
    """Request body for POST /api/story/tts."""
    text: str
    session_id: str


@router.post("/story/tts")
async def story_tts(request: StoryTTSRequest):
    """
    Converts text to speech audio. If child_name exists in session, it will be substituted automatically.
    """
    if request.session_id not in sessions:
        return JSONResponse(
            status_code=404,
            content={
                "error": "session_not_found",
                "message": "Session ID does not exist or has expired",
                "status_code": 404,
            }
        )

    session = sessions[request.session_id]

    # Replace child_name if present
    text_to_speak = request.text
    if session.child_name:
        text_to_speak = text_to_speak.replace("{child_name}", session.child_name)

    try:
        audio_bytes = await generate_speech(text_to_speak)
    except Exception as e:
        return JSONResponse(
            status_code=503,
            content={
                "error": "gemini_api_error",
                "message": f"Gemini API error: {str(e)}",
                "status_code": 503,
            }
        )

    return Response(content=audio_bytes, media_type="audio/wav")

# ---------------------------------------------------------------------------
# POST /api/story/stt
# ---------------------------------------------------------------------------

@router.post("/story/stt")
async def story_stt(
    audio: UploadFile = File(...),
    session_id: str = Form(...)
):
    """
    Converts audio blob to text (used for capturing child's name).
    Saves the transcribed name directly into session state.
    """
    if session_id not in sessions:
        return JSONResponse(
            status_code=404,
            content={
                "error": "session_not_found",
                "message": "Session ID does not exist or has expired",
                "status_code": 404,
            }
        )

    session = sessions[session_id]

    try:
        audio_bytes = await audio.read()
        transcribed_text = await transcribe_audio(audio_bytes, mime_type=audio.content_type or "audio/webm")
        if not transcribed_text:
            raise ValueError("Empty transcription")
    except Exception as e:
        return JSONResponse(
            status_code=503,
            content={
                "error": "stt_failed",
                "message": f"STT failed: {str(e)}",
                "status_code": 503,
            }
        )

    session.child_name = transcribed_text.strip()
    print(f"[STT] session={session_id} child_name={session.child_name!r}")

    return {
        "text": session.child_name,
        "saved_as_child_name": True
    }


# ---------------------------------------------------------------------------
# POST /api/story/adapt
# ---------------------------------------------------------------------------

_VALID_VERIFY_RESULTS = {"pass", "retry", "fail"}


class StoryAdaptRequest(BaseModel):
    """Request body for POST /api/story/adapt."""
    session_id: str
    verify_result: str   # "pass" | "retry" | "fail"
    segment_index: int


@router.post("/story/adapt")
async def story_adapt(request: StoryAdaptRequest):
    """
    Returns Lio's narrative response based on vision verify result.

    Pure logic — no Gemini API call.

    On 'pass':
      - Appends badge to session.badges
      - Increments current_segment and loop_count
      - Returns next_segment_data + next_challenge if not the final segment

    On 'retry':
      - No state change
      - Returns retry_challenge action

    On 'fail':
      - Sets session.current_challenge to easy challenge action
      - Returns downgraded_challenge
    """
    # 1 — validate session
    if request.session_id not in sessions:
        return JSONResponse(
            status_code=404,
            content={
                "error": "session_not_found",
                "message": "Session ID does not exist or has expired",
                "status_code": 404,
            },
        )

    # 2 — validate verify_result
    if request.verify_result not in _VALID_VERIFY_RESULTS:
        return JSONResponse(
            status_code=400,
            content={
                "error": "invalid_verify_result",
                "message": f"verify_result must be one of: pass, retry, fail. Got: '{request.verify_result}'",
                "status_code": 400,
            },
        )

    session = sessions[request.session_id]

    # 3 — load story JSON
    story_path = _STORIES_DIR / f"{session.story_id}.json"
    if not story_path.exists():
        return JSONResponse(
            status_code=404,
            content={
                "error": "story_not_found",
                "message": f"Story '{session.story_id}' not found",
                "status_code": 404,
            },
        )

    with story_path.open(encoding="utf-8") as f:
        story = json.load(f)

    # 4 — fetch segment and adapt response text
    segment = story["segments"][request.segment_index]
    adapt = segment["adapt_responses"][request.verify_result]

    # ---- Branch on verify_result ----

    if request.verify_result == "pass":
        # State transition (per AGENTS.md — only place this happens)
        session.badges.append(story["badge_map"][str(request.segment_index)])
        session.current_segment = request.segment_index + 1
        session.loop_count += 1

        is_last = request.segment_index >= story["total_segments"] - 1
        next_segment_data = None
        next_challenge = None

        if not is_last:
            next_seg = story["segments"][request.segment_index + 1]
            child_name = session.child_name or ""
            next_segment_data = {
                "segment_index": next_seg["segment_index"],
                "narrative_text": next_seg["narrative_text"].replace("{child_name}", child_name),
                "narration_tts": next_seg["narration_tts"].replace("{child_name}", child_name),
            }
            next_challenge = select_challenge(next_seg, story["theme"])

        return {
            "tts_text": adapt["tts_text"],
            "display_text": adapt["display_text"],
            "next_action": "award_badge",
            "next_segment_data": next_segment_data,
            "next_challenge": next_challenge,
            "downgraded_challenge": None,
        }

    elif request.verify_result == "retry":
        return {
            "tts_text": adapt["tts_text"],
            "display_text": adapt["display_text"],
            "next_action": "retry_challenge",
            "next_segment_data": None,
            "next_challenge": None,
            "downgraded_challenge": None,
        }

    else:  # fail
        # Find the easy challenge for downgrade
        easy_challenge = next(
            (c for c in segment["challenge_options"] if c.get("difficulty") == "easy"),
            None,
        )
        if easy_challenge is None:
            # Safety fallback: return the first option
            easy_challenge = segment["challenge_options"][0]

        session.current_challenge = easy_challenge["action"]

        return {
            "tts_text": adapt["tts_text"],
            "display_text": adapt["display_text"],
            "next_action": "downgrade_challenge",
            "next_segment_data": None,
            "next_challenge": None,
            "downgraded_challenge": easy_challenge,
        }


# ---------------------------------------------------------------------------
# GET /api/story/badge
# ---------------------------------------------------------------------------

@router.get("/story/badge")
async def story_badge(session_id: str = Query(...)):
    """
    Returns the badge most recently earned by the session.

    Must be called immediately after receiving next_action == "award_badge"
    from /api/story/adapt, which has already appended the badge to session.badges.
    """
    if session_id not in sessions:
        return JSONResponse(
            status_code=404,
            content={
                "error": "session_not_found",
                "message": "Session ID does not exist or has expired",
                "status_code": 404,
            },
        )

    session = sessions[session_id]

    if not session.badges:
        return JSONResponse(
            status_code=400,
            content={
                "error": "no_badges",
                "message": "No badges have been earned yet in this session",
                "status_code": 400,
            },
        )

    # adapt_narrative already incremented current_segment before this is called
    latest_badge = session.badges[-1]
    segment_completed = session.current_segment - 1

    return {
        "badge": latest_badge,
        "segment_completed": segment_completed,
        "total_badges": len(session.badges),
    }
