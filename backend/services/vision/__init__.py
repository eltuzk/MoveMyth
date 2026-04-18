# Vision service package
"""
Service wrapper for Gemini Vision API (google-genai).

Supports two verification contexts:
  - magic_sign_check : pass / fail
  - challenge_verify  : pass / retry / fail
"""

import base64
import re
from google import genai
from google.genai import types


# ---------------------------------------------------------------------------
# Prompts
# ---------------------------------------------------------------------------

_MAGIC_SIGN_PROMPT = (
    "Look at this image. Is the person making a peace sign or V-sign with their fingers "
    "(index and middle finger raised, other fingers folded)? "
    "Answer with exactly one word: PASS or FAIL. "
    "Also provide a confidence score from 0.0 to 1.0."
)

_CHALLENGE_PROMPTS: dict[str, str] = {
    "jump": (
        "Look at this image. Is the person jumping or in the middle of a jump? "
        "Signs of jumping: feet off the ground, bent knees upon landing, arms raised, body elevated. "
        "Answer with exactly one word: PASS (clearly jumping), RETRY (possibly jumping but unclear), or FAIL (not jumping). "
        "Also provide a confidence score from 0.0 to 1.0."
    ),
    "raise_hands": (
        "Look at this image. Is the person raising both arms above their head? "
        "Answer with exactly one word: PASS (both arms clearly raised above head), "
        "RETRY (one arm raised or arms at shoulder height), or FAIL (arms not raised). "
        "Also provide a confidence score from 0.0 to 1.0."
    ),
    "spin": (
        "Look at this image. Is the person spinning or turning around? "
        "Signs of spinning: body rotated away from camera, arms extended outward, motion blur. "
        "Answer with exactly one word: PASS (clearly spinning or turned), "
        "RETRY (body partially turned, unclear), or FAIL (facing forward, not spinning). "
        "Also provide a confidence score from 0.0 to 1.0."
    ),
}


# ---------------------------------------------------------------------------
# Response parsing
# ---------------------------------------------------------------------------

def _parse_vision_response(text: str) -> tuple[str, float]:
    """
    Extract the verdict word (PASS / RETRY / FAIL) and confidence score
    from arbitrary Gemini response text.

    Returns (verdict_upper, confidence).
    Raises ValueError if neither can be extracted.
    """
    text_upper = text.upper()

    # Determine verdict — order matters: check RETRY before FAIL/PASS to avoid
    # substring collisions.
    if "PASS" in text_upper:
        verdict = "PASS"
    elif "RETRY" in text_upper:
        verdict = "RETRY"
    elif "FAIL" in text_upper:
        verdict = "FAIL"
    else:
        raise ValueError(f"No verdict found in Gemini response: {text!r}")

    # Extract confidence — look for a decimal number between 0 and 1
    match = re.search(r"\b(0(?:\.\d+)?|1(?:\.0+)?)\b", text)
    if match:
        confidence = float(match.group(1))
    else:
        # Fallback: map verdict to a sensible default
        confidence = {"PASS": 0.9, "RETRY": 0.6, "FAIL": 0.2}.get(verdict, 0.5)

    return verdict, confidence


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

async def verify_image(
    image_bytes: bytes,
    expected_action: str,
    context: str,
) -> dict:
    """
    Call Gemini Vision to verify a physical action or magic sign.

    Args:
        image_bytes:     Raw JPEG image bytes.
        expected_action: e.g. "jump", "raise_hands", "spin" (ignored for magic_sign_check).
        context:         "magic_sign_check" or "challenge_verify".

    Returns:
        {
            "result": "pass" | "retry" | "fail",
            "confidence": float,
            "message": str,
        }

    Raises:
        ValueError:  If context is unknown or prompt cannot be resolved.
        Exception:   Propagated from Gemini API on failure.
    """
    # 1. Choose prompt
    if context == "magic_sign_check":
        prompt = _MAGIC_SIGN_PROMPT
    elif context == "challenge_verify":
        prompt = _CHALLENGE_PROMPTS.get(expected_action)
        if prompt is None:
            raise ValueError(f"Unsupported expected_action: {expected_action!r}")
    else:
        raise ValueError(f"Unknown context: {context!r}")

    # 2. Call Gemini Vision
    client = genai.Client()

    image_part = types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg")

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite-preview",
        contents=[image_part, prompt],
    )

    response_text = response.text or ""

    # 3. Parse response
    verdict, confidence = _parse_vision_response(response_text)

    # 4. Map to result using context-specific thresholds
    if context == "magic_sign_check":
        result = "pass" if confidence >= 0.5 else "fail"
    else:  # challenge_verify
        if confidence >= 0.75:
            result = "pass"
        elif confidence >= 0.45:
            result = "retry"
        else:
            result = "fail"

    # Build a short human-readable message
    action_label = expected_action.replace("_", " ") if context == "challenge_verify" else "magic sign"
    verdict_messages = {
        "pass": f"Child appears to be {action_label}",
        "retry": f"Child may be {action_label} but image is unclear",
        "fail": f"Child does not appear to be {action_label}",
    }
    message = verdict_messages.get(result, response_text[:120])

    return {
        "result": result,
        "confidence": round(confidence, 4),
        "message": message,
    }
