"""
Orchestrator — Pipeline Coordinator (Agent Mode)

SequentialAgent that runs the story generation pipeline:
Adventure Seeker → [Guardian → EscalationChecker] (max 3 loops) → Storysmith

EscalationChecker reads guardian_result.overall and sets should_continue
to control the LoopAgent.
"""

from google.adk import SequentialAgent, LoopAgent, Agent

from config.settings import MODEL_GUARDIAN, MAX_GUARDIAN_RETRIES
from agents.pipeline.adventure_seeker import adventure_seeker_agent
from agents.pipeline.guardian import guardian_agent
from agents.pipeline.storysmith import storysmith_agent


def check_escalation(guardian_result: dict) -> dict:
    """
    EscalationChecker callback.
    Reads guardian_result.overall and decides whether to continue the loop.

    Returns:
        dict with should_continue flag
    """
    overall = guardian_result.get("overall", "revise")

    if overall == "approve":
        return {"should_continue": False, "reason": "Guardian approved the content"}
    elif overall == "reject":
        return {"should_continue": False, "reason": "Guardian rejected — escalating"}
    else:  # "revise"
        return {"should_continue": True, "reason": "Guardian requests revision"}


# --- Guardian Review Loop (max 3 iterations) ---
# TODO: Wire up LoopAgent with guardian_agent + check_escalation
# guardian_loop = LoopAgent(
#     name="guardian_review_loop",
#     max_iterations=MAX_GUARDIAN_RETRIES,
#     sub_agents=[guardian_agent],
# )

# --- Full Pipeline ---
# TODO: Wire up SequentialAgent with the complete flow
# orchestrator = SequentialAgent(
#     name="story_pipeline",
#     description="Complete story generation pipeline",
#     sub_agents=[
#         adventure_seeker_agent,
#         guardian_loop,
#         storysmith_agent,
#     ],
# )

# Placeholder until ADK API is finalized
orchestrator = None
