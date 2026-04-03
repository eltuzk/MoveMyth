"""
WebSocket endpoint for Lio agent communication.
WS /ws/lio/{session_id}

Frontend → Backend:
  { "type": "audio_input", "data": "<base64 PCM>" }

Backend → Frontend:
  { "type": "lio_speaking", "audio_data": "<base64>" }
  { "type": "challenge_issued", "challenge_id": "...", "exercise": "jump", "reps": 5, "instruction": "..." }
  { "type": "badge_awarded", "badge": "brave_jumper", "reason": "..." }
  { "type": "scene_update", "scene": "...", "trigger_image_gen": true }
"""

import json

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter(tags=["websocket"])


@router.websocket("/ws/lio/{session_id}")
async def lio_websocket(websocket: WebSocket, session_id: str):
    """
    Main WebSocket for Lio agent — handles voice input/output
    and story events.
    """
    await websocket.accept()
    print(f"[WS Lio] Session {session_id} connected")

    try:
        while True:
            raw = await websocket.receive_text()
            message = json.loads(raw)
            msg_type = message.get("type")

            if msg_type == "audio_input":
                # TODO: Stream audio to Gemini Live API via Lio agent
                # TODO: Send back lio_speaking, challenge_issued, badge_awarded, scene_update
                pass
            else:
                await websocket.send_json({"type": "error", "message": f"Unknown type: {msg_type}"})

    except WebSocketDisconnect:
        print(f"[WS Lio] Session {session_id} disconnected")
    except Exception as e:
        print(f"[WS Lio] Error in session {session_id}: {e}")
        await websocket.close(code=1011)
