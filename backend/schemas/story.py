"""
Story Pydantic schemas.

Matches the Storysmith output structure from AGENTS.md.
"""

from pydantic import BaseModel, Field


class MovementPoint(BaseModel):
    """A movement challenge embedded within a story act."""
    exercise: str  # jump, raise_hand, spin
    reps: int
    badge_reward: str


class StoryAct(BaseModel):
    """One act in the 4-act narrative structure."""
    act_number: int
    title: str
    narrative: str
    movement_point: MovementPoint | None = None


class Story(BaseModel):
    """
    Complete story output from Storysmith.
    Contains a 4-act narrative arc with optional movement points.
    """
    title: str
    estimated_duration_minutes: int = 15
    acts: list[StoryAct] = Field(default_factory=list)
    ending_summary: str = ""


class GenerateStoryRequest(BaseModel):
    """Request for story generation via Agent Mode pipeline."""
    theme: str
    age_group: str = "4-10"


class GenerateStoryResponse(BaseModel):
    """Response wrapping the generated story."""
    story: Story
