# AGENTS.md — MoveMyth Agent Logic
> Last updated: 2026-04-10
> Scope: MVP One Complete Loop only

---

## Overview

For MVP, **Lio** is implemented as a structured request-response agent — not a live streaming agent.
The full multi-agent pipeline (Adventure Seeker, Guardian, Storysmith, Orchestrator) is out of scope for MVP.

Lio's "intelligence" in MVP comes from:
1. Pre-generated story JSON (see `STORY_SCHEMA.md`)
2. Context-aware challenge selection logic
3. `adapt_narrative` — 3 response variants based on vision verify result
4. Session state tracking across the loop

---

## Lio — Root Agent (MVP Implementation)

**Model:** Gemini API (text + vision + speech, single API key)
**Implementation:** FastAPI endpoints, not a persistent agent process
**State:** In-memory session dict (see `CONTEXT.md`)

### Tools (MVP)

| Tool | Endpoint | Description |
|---|---|---|
| `say_hello` | `POST /api/story/start` | Greet child, ask name, return segment 0 |
| `do_physical_exercise` | `POST /api/vision/verify` | Verify child's physical action via camera |
| `award_badge` | `GET /api/story/badge` | Return badge for completed segment |
| `adapt_narrative` | `POST /api/story/adapt` | Return Lio's response based on verify result |
| `say_name_prompt` | `POST /api/story/tts` | Convert any text to speech |
| `hear_child` | `POST /api/story/stt` | Convert child's voice to text |

> `draw_story_scene` (image generation) is out of scope for MVP.

---

## Endpoint Specs

### POST /api/story/start

Initializes a session and returns the first story segment.

**Request:**
```json
{
  "story_id": "forest"
}
```

**Response:**
```json
{
  "session_id": "uuid-string",
  "child_name": "",
  "segment": {
    "segment_index": 0,
    "narrative_text": "...",
    "narration_tts": "..."
  },
  "selected_challenge": {
    "action": "jump",
    "display_text": "...",
    "tts_text": "...",
    "difficulty": "normal",
    "fallback_action": "raise_hands"
  }
}
```

**Logic:**
1. Generate `session_id` (UUID)
2. Load story JSON from `backend/stories/{story_id}.json`
3. Store in `sessions[session_id]`
4. Call `select_challenge(segment, theme)` to pick one challenge from `challenge_options`
5. Store selected challenge in session state
6. Return segment 0 data + selected challenge

---

### POST /api/story/stt

Converts audio blob to text (used for capturing child's name).
**Also saves the transcribed name directly into session state** — frontend does not need to re-send it.

**Request:** `multipart/form-data`
- `audio`: audio file (webm or wav)
- `session_id`: string

**Response:**
```json
{
  "text": "An",
  "saved_as_child_name": true
}
```

**Logic:**
1. Receive audio blob
2. Call Gemini STT API → get transcribed text
3. `sessions[session_id].child_name = text.strip()`
4. Return transcribed text + confirmation

From this point on, all TTS calls that include `{child_name}` in text will be substituted by the backend automatically using `sessions[session_id].child_name`. Frontend does not need to manage or re-send the name.

---

### POST /api/story/tts

Converts text to speech audio.

**Request:**
```json
{
  "text": "Xin chào An! Lio rất vui được gặp bạn hôm nay!",
  "session_id": "uuid-string"
}
```

**Response:** Audio bytes (`audio/wav` or `audio/mpeg`)
- Return as binary response with correct `Content-Type`
- Frontend creates Blob URL and plays via `<audio>` element

**Logic:**
1. Substitute `{child_name}` in text if session has a name
2. Call Gemini TTS API
3. Return audio bytes directly

---

### POST /api/vision/verify

Verifies whether the child performed the required action.

**Request:**
```json
{
  "session_id": "uuid-string",
  "image_base64": "data:image/jpeg;base64,...",
  "expected_action": "jump",
  "context": "magic_sign_check"
}
```

`context` values:
- `"magic_sign_check"` — verify magic sign at start. **Result enum: `pass` or `fail` only** (no `retry`).
- `"challenge_verify"` — verify physical challenge. **Result enum: `pass`, `retry`, or `fail`**.

These two contexts have different result enums. Do not mix them.

**Response:**
```json
{
  "result": "pass",
  "confidence": 0.92,
  "message": "Child appears to be jumping"
}
```

---

#### Context: `magic_sign_check`

Only two outcomes: `pass` or `fail`. No `retry`.

Vision prompt:
```
Look at this image. Is the person making a peace sign or V-sign with their fingers (index and middle finger raised, other fingers folded)?
Answer with exactly one word: PASS or FAIL.
Also provide a confidence score from 0.0 to 1.0.
```

Result logic:
- confidence >= 0.5 → `pass`
- confidence < 0.5 → `fail`

If `fail`: FE shows "Thử lại ký hiệu phép thuật nhé!" and lets child retry. No `adapt_narrative` call needed.

---

#### Context: `challenge_verify`

Three outcomes: `pass`, `retry`, `fail`. Based on confidence threshold.

Vision prompts per `expected_action`:

**`jump`:**
```
Look at this image. Is the person jumping or in the middle of a jump?
Signs of jumping: feet off the ground, bent knees upon landing, arms raised, body elevated.
Answer with exactly one word: PASS (clearly jumping), RETRY (possibly jumping but unclear), or FAIL (not jumping).
Also provide a confidence score from 0.0 to 1.0.
```

**`raise_hands`:**
```
Look at this image. Is the person raising both arms above their head?
Answer with exactly one word: PASS (both arms clearly raised above head), RETRY (one arm raised or arms at shoulder height), or FAIL (arms not raised).
Also provide a confidence score from 0.0 to 1.0.
```

**`spin`:**
```
Look at this image. Is the person spinning or turning around?
Signs of spinning: body rotated away from camera, arms extended outward, motion blur.
Answer with exactly one word: PASS (clearly spinning or turned), RETRY (body partially turned, unclear), or FAIL (facing forward, not spinning).
Also provide a confidence score from 0.0 to 1.0.
```

Result logic (same threshold for all challenge actions):
- confidence >= 0.75 → `pass`
- confidence >= 0.45 → `retry`
- confidence < 0.45 → `fail`

The `retry` result means "we're not sure — encourage child to try again with the same challenge." It is purely confidence-based and has nothing to do with attempt count. Attempt counting (if any) is the frontend's responsibility.

---

### POST /api/story/adapt

Returns Lio's narrative response based on vision verify result.
**When result is `pass`, also returns full next segment data so frontend can continue the loop without an extra API call.**

**Request:**
```json
{
  "session_id": "uuid-string",
  "verify_result": "pass",
  "segment_index": 0
}
```

**Response (verify_result == "pass", not final segment):**
```json
{
  "tts_text": "Tuyệt vời! Phép thuật của bạn đã mở cây cầu rồi!",
  "display_text": "Cây cầu mở rồi! 🌉",
  "next_action": "award_badge",
  "next_segment_data": {
    "segment_index": 1,
    "narrative_text": "...",
    "narration_tts": "..."
  },
  "next_challenge": {
    "action": "spin",
    "display_text": "...",
    "tts_text": "...",
    "difficulty": "normal",
    "fallback_action": "raise_hands"
  },
  "downgraded_challenge": null
}
```

**Response (verify_result == "pass", final segment index 2):**
```json
{
  "tts_text": "Chúc mừng! Bạn đã hoàn thành hành trình!",
  "display_text": "Bạn là Anh Hùng! 🏆",
  "next_action": "award_badge",
  "next_segment_data": null,
  "next_challenge": null,
  "downgraded_challenge": null
}
```

**Response (verify_result == "retry"):**
```json
{
  "tts_text": "Gần được rồi! Thêm một lần nữa nhé!",
  "display_text": "Thử lại nào! 💪",
  "next_action": "retry_challenge",
  "next_segment_data": null,
  "next_challenge": null,
  "downgraded_challenge": null
}
```

**Response (verify_result == "fail"):**
```json
{
  "tts_text": "Không sao! Lio có thử thách dễ hơn cho bạn!",
  "display_text": "Lio đổi thử thách cho bạn! ✨",
  "next_action": "downgrade_challenge",
  "next_segment_data": null,
  "next_challenge": null,
  "downgraded_challenge": {
    "action": "raise_hands",
    "display_text": "...",
    "tts_text": "...",
    "difficulty": "easy",
    "fallback_action": "raise_hands"
  }
}
```

`next_action` values:
- `"award_badge"` — result is `pass` → FE calls `/api/story/badge`, shows popup, then uses `next_segment_data` + `next_challenge` to continue loop
- `"retry_challenge"` — result is `retry` → FE shows retry UI, child tries same challenge again
- `"downgrade_challenge"` — result is `fail` → FE shows `downgraded_challenge`, child tries easier action

**State transition (server-side, on `pass` only):**
```python
# Step 1: append badge to session before incrementing segment
session.badges.append(story["badge_map"][str(segment_index)])

# Step 2: increment current_segment
session.current_segment = segment_index + 1

# Step 3: increment loop_count
session.loop_count += 1
```

This is the only place `current_segment` and `badges` are mutated. No other endpoint touches them.

**Logic:**
```python
def adapt_narrative(session, story, verify_result, segment_index):
    segment = story["segments"][segment_index]
    adapt = segment["adapt_responses"][verify_result]

    if verify_result == "pass":
        # State transition
        session.badges.append(story["badge_map"][str(segment_index)])
        session.current_segment = segment_index + 1
        session.loop_count += 1

        # Prepare next segment if not last
        is_last = segment_index >= story["total_segments"] - 1
        next_segment_data = None
        next_challenge = None
        if not is_last:
            next_seg = story["segments"][segment_index + 1]
            next_segment_data = {
                "segment_index": next_seg["segment_index"],
                "narrative_text": next_seg["narrative_text"].replace("{child_name}", session.child_name),
                "narration_tts": next_seg["narration_tts"].replace("{child_name}", session.child_name),
            }
            next_challenge = select_challenge(next_seg, story["theme"])

        return {
            "tts_text": adapt["tts_text"],
            "display_text": adapt["display_text"],
            "next_action": "award_badge",
            "next_segment_data": next_segment_data,
            "next_challenge": next_challenge,
            "downgraded_challenge": None
        }

    elif verify_result == "retry":
        return {
            "tts_text": adapt["tts_text"],
            "display_text": adapt["display_text"],
            "next_action": "retry_challenge",
            "next_segment_data": None,
            "next_challenge": None,
            "downgraded_challenge": None
        }

    elif verify_result == "fail":
        easy_challenge = next(
            c for c in segment["challenge_options"] if c["difficulty"] == "easy"
        )
        session.current_challenge = easy_challenge["action"]
        return {
            "tts_text": adapt["tts_text"],
            "display_text": adapt["display_text"],
            "next_action": "downgrade_challenge",
            "next_segment_data": None,
            "next_challenge": None,
            "downgraded_challenge": easy_challenge
        }
```

---

### GET /api/story/badge

Returns the badge most recently earned (i.e. the last entry in `session.badges`).
Call this endpoint immediately after receiving `next_action == "award_badge"` from `/api/story/adapt`.
By the time this is called, `adapt_narrative` has already appended the badge to `session.badges`.

**Request:** `?session_id=uuid-string`

**Response:**
```json
{
  "badge": {
    "id": "brave_start",
    "label": "Dũng Cảm Bắt Đầu",
    "emoji": "🌟"
  },
  "segment_completed": 0,
  "total_badges": 1
}
```

**Logic:**
```python
# session.badges already updated by adapt_narrative before this is called
latest_badge = session.badges[-1]
segment_completed = session.current_segment - 1  # adapt already incremented it
return {
    "badge": latest_badge,
    "segment_completed": segment_completed,
    "total_badges": len(session.badges)
}
```

---

## Challenge Selection Logic

Called in `/api/story/start` and whenever a new segment begins.

```python
def select_challenge(segment: dict, theme: str) -> dict:
    """
    Select one challenge from challenge_options based on story theme.
    For MVP: always select the first 'normal' difficulty challenge.
    If no 'normal' exists, fall back to first option.
    """
    normal_challenges = [
        c for c in segment["challenge_options"]
        if c["difficulty"] == "normal"
    ]
    return normal_challenges[0] if normal_challenges else segment["challenge_options"][0]
```

> For MVP this is deterministic. Post-MVP: use story theme + child history to pick more contextually.

---

## Session Flow (Full Loop)

```
FE: POST /api/story/start { story_id }
BE: → create session, load story, select challenge
BE: → return segment 0 + challenge

FE: POST /api/story/tts { text: greeting + child_name_prompt }
FE: plays audio

FE: POST /api/story/stt { audio: mic_recording }
BE: → transcribe audio, save child_name to session, return { text, saved_as_child_name }

FE: POST /api/story/tts { text: narration_tts (segment 0) }
FE: plays story narration

FE: POST /api/story/tts { text: challenge.tts_text }
FE: plays challenge instruction

FE: [child performs action]
FE: POST /api/vision/verify { image_base64, expected_action, context: "challenge_verify" }
BE: → return pass/retry/fail

FE: POST /api/story/adapt { verify_result, segment_index: 0 }
BE: → return tts_text + next_action

FE: POST /api/story/tts { text: adapt_response.tts_text }
FE: plays Lio's response

if next_action == "award_badge":
  FE: GET /api/story/badge?session_id=...
  FE: shows badge popup
  FE: moves to segment 1, repeats loop

if next_action == "retry_challenge":
  FE: shows retry UI, child tries again

if next_action == "downgrade_challenge":
  FE: shows downgraded_challenge, child tries again
```

---

## Error Handling

All endpoints must return structured errors:

```json
{
  "error": "session_not_found",
  "message": "Session ID does not exist or has expired",
  "status_code": 404
}
```

Common error codes:
- `session_not_found` — invalid or missing session_id
- `story_not_found` — story_id does not match any JSON file
- `gemini_api_error` — upstream API failure
- `invalid_image` — base64 decode failed or image too small
- `stt_failed` — could not transcribe audio

For `gemini_api_error`, return HTTP 503 so FE can show a retry button without crashing the loop.