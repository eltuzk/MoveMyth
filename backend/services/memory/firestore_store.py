"""
Firestore Store — Long-term memory (Layer 2)

Persists user progress across multiple play sessions.

Collections:
  - sessions/{sessionId}: Session summaries and badges earned
  - users/{userId}: User profile, total sessions, all badges, favorite theme
"""

from typing import Any

from config.settings import GOOGLE_CLOUD_PROJECT


class FirestoreStore:
    """
    Firestore-backed long-term memory for cross-session persistence.

    Usage:
        store = FirestoreStore()
        await store.save_session_summary("session-123", {...})
        history = await store.get_user_history("user-456")
    """

    def __init__(self):
        self.project = GOOGLE_CLOUD_PROJECT
        self._db = None

    async def connect(self):
        """Initialize Firestore client."""
        # TODO: Initialize Firestore async client
        # from google.cloud.firestore_v1 import AsyncClient
        # self._db = AsyncClient(project=self.project)
        pass

    async def save_session_summary(self, session_id: str, summary: dict[str, Any]):
        """
        Save session summary to sessions/{sessionId}.

        Args:
            session_id: Session identifier
            summary: Session data including badges, theme, duration
        """
        # TODO: Write to Firestore sessions collection
        # doc_ref = self._db.collection("sessions").document(session_id)
        # await doc_ref.set(summary)
        pass

    async def get_user_history(self, user_id: str) -> dict[str, Any]:
        """
        Retrieve user's play history from users/{userId}.

        Args:
            user_id: User identifier

        Returns:
            User history including total_sessions, all_badges, favorite_theme
        """
        # TODO: Read from Firestore users collection
        # doc_ref = self._db.collection("users").document(user_id)
        # doc = await doc_ref.get()
        # return doc.to_dict() if doc.exists else default
        return {
            "total_sessions": 0,
            "all_badges": [],
            "favorite_theme": None,
        }

    async def update_user_profile(self, user_id: str, updates: dict[str, Any]):
        """
        Update user profile in users/{userId}.

        Args:
            user_id: User identifier
            updates: Fields to update (e.g., increment total_sessions, add badges)
        """
        # TODO: Merge update to Firestore users collection
        # doc_ref = self._db.collection("users").document(user_id)
        # await doc_ref.set(updates, merge=True)
        pass

    async def load_returning_user_data(self, user_id: str) -> dict[str, Any]:
        """
        Load long-term memory fields for a returning user.
        Used to populate session state on session start.

        Args:
            user_id: User identifier

        Returns:
            Dict with is_returning_user, previous_badges, favorite_theme, total_sessions
        """
        history = await self.get_user_history(user_id)
        return {
            "is_returning_user": history.get("total_sessions", 0) > 0,
            "previous_badges": history.get("all_badges", []),
            "favorite_theme": history.get("favorite_theme"),
            "total_sessions": history.get("total_sessions", 0),
        }
