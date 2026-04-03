"""
WebSocket endpoint for Vision Verifier.
WS /ws/vision/{session_id}

Frontend → Backend:
  { "type": "frame", "data": "<base64 JPEG 320x240>" }
  { "type": "start_verification", "exercise": "jump", "reps": 5, "id": "challenge_id" }
  { "type": "check_magic_sign" }

Backend → Frontend:
  { "type": "magic_sign_result", "verified": true, "confidence": 0.92 }
  { "type": "progress", "rep_count": 3, "required": 5 }
  { "type": "verification_result", "verified": true, "rep_count": 5, "challenge_id": "..." }
"""

import json

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter(tags=["websocket"])


@router.websocket("/ws/vision/{session_id}")
async def vision_websocket(websocket: WebSocket, session_id: str):
    """
    Vision verification WebSocket — receives camera frames and
    verifies physical exercises.
    Rule 2: Frames processed in-memory only, never persisted.
    """
    await websocket.accept()
    print(f"[WS Vision] Session {session_id} connected")

    try:
        while True:
            raw = await websocket.receive_text()
            message = json.loads(raw)
            msg_type = message.get("type")

            if msg_type == "frame":
                # TODO: Buffer frame for current verification task
                # Rule 2: Process in-memory, discard immediately after
                pass

            elif msg_type == "start_verification":
                # TODO: Start verification loop for the given exercise
                exercise = message.get("exercise")
                reps = message.get("reps")
                challenge_id = message.get("id")
                print(f"[WS Vision] Starting verification: {exercise} x{reps} (id={challenge_id})")

            elif msg_type == "check_magic_sign":
                # TODO: Run magic sign detection on latest frame
                pass

            else:
                await websocket.send_json({"type": "error", "message": f"Unknown type: {msg_type}"})

    except WebSocketDisconnect:
        print(f"[WS Vision] Session {session_id} disconnected")
    except Exception as e:
        print(f"[WS Vision] Error in session {session_id}: {e}")
        await websocket.close(code=1011)
