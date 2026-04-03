"""
Story generation endpoint (Agent Mode only).
POST /api/generate-story → { story }
"""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(tags=["story"])


class GenerateStoryRequest(BaseModel):
    """Request body for story generation."""
    theme: str
    age_group: str = "4-10"


@router.post("/generate-story")
async def generate_story(request: GenerateStoryRequest):
    """
    Generate a complete story via the Agent Mode pipeline:
    Adventure Seeker → Guardian (loop) → Storysmith
    """
    # TODO: Run orchestrator pipeline with request.theme and request.age_group
    return {
        "story": {
            "title": "",
            "estimated_duration_minutes": 0,
            "acts": [],
            "ending_summary": "",
        }
    }
