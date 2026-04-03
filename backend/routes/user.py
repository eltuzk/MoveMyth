"""
User history endpoint.
GET /api/user/{user_id}/history → { total_sessions, all_badges, favorite_theme }
"""

from fastapi import APIRouter

router = APIRouter(prefix="/user", tags=["user"])


@router.get("/{user_id}/history")
async def get_user_history(user_id: str):
    """Retrieve a user's play history from Firestore."""
    # TODO: Query Firestore users/{userId} collection
    return {
        "total_sessions": 0,
        "all_badges": [],
        "favorite_theme": None,
    }
