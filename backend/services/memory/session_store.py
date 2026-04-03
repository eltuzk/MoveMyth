"""
Session Store — Redis-backed session state (Layer 1)

Manages in-session state using Redis. This is the runtime state
that exists for the duration of a play session.

Session State Schema (from AGENTS.md):
{
    "child_name": str,
    "session_started": bool,
    "story_theme": str,
    "mode": "live" | "agent",
    "current_scene": int,
    "badges": list[dict],
    "scenes": list[str],
    "completed_challenges": list[dict],
    "pending_challenge": dict | None,
    "narrative_direction": str,
    "is_returning_user": bool,
    "previous_badges": list[dict],
    "favorite_theme": str | None,
    "total_sessions": int,
}
"""

import json
from typing import Any

from config.settings import REDIS_URL

# Default session state matching AGENTS.md schema
DEFAULT_SESSION_STATE: dict[str, Any] = {
    # Runtime (ADK state)
    "child_name": "",
    "session_started": False,
    "story_theme": "",
    "mode": "live",
    "current_scene": 0,
    "badges": [],
    "scenes": [],
    "completed_challenges": [],
    "pending_challenge": None,
    "narrative_direction": "",
    # Long-term memory (loaded from Firestore on session create)
    "is_returning_user": False,
    "previous_badges": [],
    "favorite_theme": None,
    "total_sessions": 0,
}


class SessionStore:
    """
    Redis-backed session state manager.

    Usage:
        store = SessionStore()
        await store.connect()
        await store.create_session("session-123")
        state = await store.get_state("session-123")
        await store.update_state("session-123", {"child_name": "Minh"})
    """

    def __init__(self):
        self.redis_url = REDIS_URL
        self._redis = None

    async def connect(self):
        """Initialize Redis connection."""
        # TODO: Create Redis connection from REDIS_URL
        # import redis.asyncio as redis
        # self._redis = redis.from_url(self.redis_url)
        pass

    async def disconnect(self):
        """Close Redis connection."""
        if self._redis:
            await self._redis.close()

    async def create_session(self, session_id: str) -> dict[str, Any]:
        """
        Create a new session with default state.

        Args:
            session_id: Unique session identifier

        Returns:
            The initial session state
        """
        state = DEFAULT_SESSION_STATE.copy()
        # TODO: Store in Redis as JSON
        # await self._redis.set(f"session:{session_id}", json.dumps(state))
        return state

    async def get_state(self, session_id: str) -> dict[str, Any] | None:
        """
        Retrieve session state from Redis.

        Args:
            session_id: Session to retrieve

        Returns:
            Session state dict, or None if not found
        """
        # TODO: Get from Redis
        # raw = await self._redis.get(f"session:{session_id}")
        # return json.loads(raw) if raw else None
        return None

    async def update_state(self, session_id: str, updates: dict[str, Any]) -> dict[str, Any]:
        """
        Partially update session state.

        Args:
            session_id: Session to update
            updates: Dict of fields to update

        Returns:
            Updated session state
        """
        state = await self.get_state(session_id)
        if state is None:
            state = DEFAULT_SESSION_STATE.copy()
        state.update(updates)
        # TODO: Save back to Redis
        # await self._redis.set(f"session:{session_id}", json.dumps(state))
        return state

    async def delete_session(self, session_id: str):
        """Remove session state from Redis."""
        # TODO: Delete from Redis
        # await self._redis.delete(f"session:{session_id}")
        pass
