"""
Story endpoints — MVP implementation.

Routes:
  POST /api/story/start        → initialise session, return segment 0 + selected challenge
  POST /api/generate-story     → legacy stub (Agent Mode, out of scope for MVP)
"""

import json
import uuid
from pathlib import Path

from fastapi import APIRouter, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from services.story import SessionState, sessions, select_challenge
from services.tts import generate_speech

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
