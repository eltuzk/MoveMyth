"""
Session management endpoints.
POST /api/session/start      → { session_id }
POST /api/session/{id}/end   → { status: "saved" }
"""

import uuid

from fastapi import APIRouter

router = APIRouter(prefix="/session", tags=["session"])


@router.post("/start")
async def start_session():
    """Create a new play session and return its ID."""
    session_id = str(uuid.uuid4())
    # TODO: Initialize session state in Redis with default schema from AGENTS.md
    # TODO: Load long-term memory from Firestore if returning user
    return {"session_id": session_id}


@router.post("/{session_id}/end")
async def end_session(session_id: str):
    """End a play session and persist data to Firestore."""
    # TODO: Save session summary to Firestore
    # TODO: Clean up Redis session state
    return {"status": "saved"}
