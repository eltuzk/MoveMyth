"""
Vision Verifier Service

Receives JPEG frame (base64) and verifies whether the child is
performing the expected physical action.

Model: gemini-3.1-flash-lite-preview (Vision)

Supported actions: magic_sign, jump, raise_hand, spin

Output: { verified: bool, confidence: float, note: str }

Rule 2: Frames are processed in-memory ONLY — never persisted.
"""

import base64
from dataclasses import dataclass

from config.settings import MODEL_VISION, SUPPORTED_ACTIONS


@dataclass
class VerificationResult:
    """Result of a vision verification check."""
    verified: bool
    confidence: float
    note: str


class VisionVerifier:
    """
    Verifies physical exercises using Gemini Vision.

    Usage:
        verifier = VisionVerifier()
        result = await verifier.verify_action(frame_b64, "jump")
    """

    def __init__(self):
        self.model = MODEL_VISION
        # TODO: Initialize Gemini client for vision tasks

    async def verify_action(self, frame_base64: str, action: str) -> VerificationResult:
        """
        Verify if the child is performing the expected action.

        Args:
            frame_base64: Base64 encoded JPEG frame (320x240)
            action: Expected action (magic_sign, jump, raise_hand, spin)

        Returns:
            VerificationResult with verified status, confidence score, and note

        Rule 2: Frame data is NOT stored — processed in-memory and discarded.
        """
        if action not in SUPPORTED_ACTIONS:
            return VerificationResult(
                verified=False,
                confidence=0.0,
                note=f"Unsupported action: {action}. Supported: {SUPPORTED_ACTIONS}",
            )

        # Decode frame (in-memory only — Rule 2)
        try:
            _frame_bytes = base64.b64decode(frame_base64)
        except Exception:
            return VerificationResult(
                verified=False,
                confidence=0.0,
                note="Invalid base64 frame data",
            )

        # TODO: Send frame to Gemini Vision model with action-specific prompt
        # TODO: Parse structured response for verified/confidence/note
        # TODO: Immediately discard frame_bytes after processing (Rule 2)

        return VerificationResult(
            verified=False,
            confidence=0.0,
            note="TODO: Implement Gemini Vision verification",
        )

    async def check_magic_sign(self, frame_base64: str) -> VerificationResult:
        """
        Shortcut for verifying the magic sign gesture.

        Args:
            frame_base64: Base64 encoded JPEG frame

        Returns:
            VerificationResult for magic_sign action
        """
        return await self.verify_action(frame_base64, "magic_sign")
