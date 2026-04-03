"""
Health check endpoint.
GET /health → { status: "ok" }
"""

from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check():
    """Health check — returns ok if the service is running."""
    return {"status": "ok"}
