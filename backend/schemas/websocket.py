"""
WebSocket message schemas.

Matches API Contracts from CONTEXT.md for both Lio and Vision WebSockets.
"""

from typing import Literal

from pydantic import BaseModel


# =============================================================================
# Lio WebSocket Messages
# =============================================================================

# --- Frontend → Backend ---

class AudioInputMessage(BaseModel):
    """Audio input from the child."""
    type: Literal["audio_input"] = "audio_input"
    data: str  # base64 PCM


# --- Backend → Frontend ---

class LioSpeakingMessage(BaseModel):
    """Lio's voice output."""
    type: Literal["lio_speaking"] = "lio_speaking"
    audio_data: str  # base64


class ChallengeIssuedMessage(BaseModel):
    """A new movement challenge for the child."""
    type: Literal["challenge_issued"] = "challenge_issued"
    challenge_id: str
    exercise: str
    reps: int
    instruction: str


class BadgeAwardedMessage(BaseModel):
    """Badge awarded after completing a challenge."""
    type: Literal["badge_awarded"] = "badge_awarded"
    badge: str
    reason: str


class SceneUpdateMessage(BaseModel):
    """Story scene update."""
    type: Literal["scene_update"] = "scene_update"
    scene: str
    trigger_image_gen: bool = False


# =============================================================================
# Vision WebSocket Messages
# =============================================================================

# --- Frontend → Backend ---

class FrameMessage(BaseModel):
    """Camera frame for vision processing."""
    type: Literal["frame"] = "frame"
    data: str  # base64 JPEG 320x240


class StartVerificationMessage(BaseModel):
    """Start verifying a specific exercise."""
    type: Literal["start_verification"] = "start_verification"
    exercise: str
    reps: int
    id: str  # challenge_id


class CheckMagicSignMessage(BaseModel):
    """Request magic sign detection."""
    type: Literal["check_magic_sign"] = "check_magic_sign"


# --- Backend → Frontend ---

class MagicSignResultMessage(BaseModel):
    """Result of magic sign detection."""
    type: Literal["magic_sign_result"] = "magic_sign_result"
    verified: bool
    confidence: float


class ProgressMessage(BaseModel):
    """Exercise progress update."""
    type: Literal["progress"] = "progress"
    rep_count: int
    required: int


class VerificationResultMessage(BaseModel):
    """Final verification result for a challenge."""
    type: Literal["verification_result"] = "verification_result"
    verified: bool
    rep_count: int
    challenge_id: str


# --- Shared ---

class ErrorMessage(BaseModel):
    """Error message for unknown or invalid messages."""
    type: Literal["error"] = "error"
    message: str
