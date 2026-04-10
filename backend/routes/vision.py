"""
Vision endpoints — MVP implementation.

Routes:
  POST /api/vision/verify  → verify a physical action or magic sign via camera image
"""

import base64

from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from services.story import sessions
from services.vision import verify_image

router = APIRouter(tags=["vision"])


# ---------------------------------------------------------------------------
# Request model
# ---------------------------------------------------------------------------

class VisionVerifyRequest(BaseModel):
    """Request body for POST /api/vision/verify."""
    session_id: str
    image_base64: str          # data:image/jpeg;base64,... or raw base64 string
    expected_action: str       # "jump" | "raise_hands" | "spin"
    context: str               # "magic_sign_check" | "challenge_verify"


# ---------------------------------------------------------------------------
# POST /api/vision/verify
# ---------------------------------------------------------------------------

@router.post("/vision/verify")
async def vision_verify(request: VisionVerifyRequest):
    """
    Verify whether the child performed the required action.

    Context: magic_sign_check → result in {pass, fail}
    Context: challenge_verify → result in {pass, retry, fail}
    """
    # 1. Validate session
    if request.session_id not in sessions:
        return JSONResponse(
            status_code=404,
            content={
                "error": "session_not_found",
                "message": "Session ID does not exist or has expired",
                "status_code": 404,
            },
        )

    # 2. Decode image_base64
    try:
        raw_b64 = request.image_base64
        # Strip "data:image/...;base64," prefix if present
        if ";" in raw_b64 and "base64," in raw_b64:
            raw_b64 = raw_b64.split("base64,", 1)[1]
        image_bytes = base64.b64decode(raw_b64)
        if len(image_bytes) < 100:
            raise ValueError("Image bytes too small — likely an invalid image")
    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={
                "error": "invalid_image",
                "message": f"Failed to decode image: {str(e)}",
                "status_code": 400,
            },
        )

    # 3 – 6. Call vision service (prompt selection, Gemini call, parse, threshold)
    try:
        result = await verify_image(
            image_bytes=image_bytes,
            expected_action=request.expected_action,
            context=request.context,
        )
    except ValueError as e:
        # Bad context or unsupported action
        return JSONResponse(
            status_code=400,
            content={
                "error": "invalid_image",
                "message": str(e),
                "status_code": 400,
            },
        )
    except Exception as e:
        return JSONResponse(
            status_code=503,
            content={
                "error": "gemini_api_error",
                "message": f"Gemini API error: {str(e)}",
                "status_code": 503,
            },
        )

    # 7. Return result
    return result
