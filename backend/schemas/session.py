"""
Session Pydantic schemas.

Matches the Session State Schema defined in AGENTS.md.
"""

from typing import Literal

from pydantic import BaseModel, Field


class Badge(BaseModel):
    """A badge earned by completing a movement challenge."""
    name: str
    reason: str
    challenge_id: str | None = None
    awarded_at: str | None = None


class CompletedChallenge(BaseModel):
    """Record of a completed movement challenge."""
    challenge_id: str
    exercise: str
    reps: int
    verified: bool = True
    badge_awarded: str | None = None


class PendingChallenge(BaseModel):
    """A movement challenge currently in progress."""
    challenge_id: str
    exercise: str
    reps: int
    instruction: str
    verified: bool = False
    rep_count: int = 0


class SessionState(BaseModel):
    """
    Complete session state schema from AGENTS.md.
    Combines runtime ADK state and long-term Firestore data.
    """
    # Runtime (ADK state)
    child_name: str = ""
    session_started: bool = False
    story_theme: str = ""
    mode: Literal["live", "agent"] = "live"
    current_scene: int = 0
    badges: list[Badge] = Field(default_factory=list)
    scenes: list[str] = Field(default_factory=list)
    completed_challenges: list[CompletedChallenge] = Field(default_factory=list)
    pending_challenge: PendingChallenge | None = None
    narrative_direction: str = ""

    # Long-term memory (loaded from Firestore on session create)
    is_returning_user: bool = False
    previous_badges: list[Badge] = Field(default_factory=list)
    favorite_theme: str | None = None
    total_sessions: int = 0


class StartSessionResponse(BaseModel):
    """Response for POST /api/session/start."""
    session_id: str


class EndSessionResponse(BaseModel):
    """Response for POST /api/session/{id}/end."""
    status: str = "saved"


class UserHistoryResponse(BaseModel):
    """Response for GET /api/user/{user_id}/history."""
    total_sessions: int = 0
    all_badges: list[Badge] = Field(default_factory=list)
    favorite_theme: str | None = None
