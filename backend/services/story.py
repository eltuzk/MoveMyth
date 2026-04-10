"""
Story service — MVP in-memory session state and challenge selection logic.

Per CONTEXT.md:
  - Session storage: module-level dict, key = session_id (UUID string)
  - SessionState: plain dataclass (no database for MVP)

Per AGENTS.md (select_challenge):
  - Always pick the first "normal" difficulty challenge in segment.
  - If none exists, fall back to challenge_options[0].
"""

from __future__ import annotations

from dataclasses import dataclass, field


# ---------------------------------------------------------------------------
# Session state
# ---------------------------------------------------------------------------

@dataclass
class SessionState:
    """
    In-memory session state for one play session.

    Matches the schema defined in CONTEXT.md § Session State Schema.
    """
    session_id: str
    story_id: str = ""
    child_name: str = ""
    current_segment: int = 0      # 0..2 = active segment index; 3 = finished
    current_challenge: str = ""   # active challenge action string
    badges: list[dict] = field(default_factory=list)
    loop_count: int = 0


# Module-level in-memory store.  All endpoints import `sessions` from here.
sessions: dict[str, SessionState] = {}


# ---------------------------------------------------------------------------
# Challenge selection
# ---------------------------------------------------------------------------

def select_challenge(segment: dict, theme: str) -> dict:
    """
    Select one challenge from segment["challenge_options"].

    MVP logic (deterministic):
      1. Collect all challenges with difficulty == "normal".
      2. Return the first one if any exist.
      3. Otherwise return challenge_options[0].

    `theme` is accepted for future use but not consulted in MVP.
    """
    options: list[dict] = segment["challenge_options"]
    normal_challenges = [c for c in options if c.get("difficulty") == "normal"]
    return normal_challenges[0] if normal_challenges else options[0]
