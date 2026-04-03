"""
Lio Agent Tools

Tools available to the Lio root agent during a play session.
Each tool interacts with session state and services.
"""

import uuid
from typing import Any


def say_hello(child_name: str) -> dict[str, Any]:
    """
    Chào hỏi trẻ và xác minh magic sign qua camera.

    KHÔNG cho qua nếu magic sign chưa được detected.
    Phải gọi Vision Verifier để xác nhận magic sign trước khi bắt đầu.

    Args:
        child_name: Tên của trẻ

    Returns:
        dict với greeting message và trạng thái magic sign
    """
    # TODO: Trigger Vision Verifier to check magic sign
    # TODO: Update session state with child_name and session_started
    return {
        "message": f"Xin chào {child_name}! Hãy giơ dấu hiệu phép thuật nào!",
        "magic_sign_verified": False,  # TODO: Get from Vision Verifier
    }


def do_physical_exercise(exercise: str, reps: int, instruction: str) -> dict[str, Any]:
    """
    Giao thử thách vận động cho trẻ.
    Tạo pending_challenge trong session state.

    Args:
        exercise: Loại bài tập (jump, raise_hand, spin)
        reps: Số lần lặp lại
        instruction: Hướng dẫn bằng lời cho trẻ

    Returns:
        dict với challenge_id và thông tin challenge
    """
    challenge_id = str(uuid.uuid4())
    # TODO: Set pending_challenge in session state
    # TODO: Notify Vision Verifier WebSocket to start monitoring
    return {
        "challenge_id": challenge_id,
        "exercise": exercise,
        "reps": reps,
        "instruction": instruction,
        "status": "pending",
    }


def draw_story_scene(scene_description: str) -> dict[str, Any]:
    """
    Kích hoạt sinh minh họa cho cảnh truyện hiện tại.

    Args:
        scene_description: Mô tả cảnh truyện cần vẽ

    Returns:
        dict với trạng thái yêu cầu sinh ảnh
    """
    # TODO: Trigger image generation service
    # TODO: Send scene_update via WebSocket
    return {
        "status": "generating",
        "scene_description": scene_description,
    }


def award_badge(badge_name: str, reason: str) -> dict[str, Any]:
    """
    Trao badge cho trẻ sau khi hoàn thành thử thách.

    CHỈ được gọi sau khi pending_challenge.verified = True.
    KHÔNG BAO GIỜ gọi khi chưa verified.

    Args:
        badge_name: Tên badge (VD: brave_jumper, star_spinner)
        reason: Lý do trao badge

    Returns:
        dict với thông tin badge
    """
    # TODO: Verify pending_challenge.verified == True in session state
    # TODO: Add badge to session state badges list
    # TODO: Clear pending_challenge
    # TODO: Save badge to Firestore
    return {
        "badge": badge_name,
        "reason": reason,
        "awarded": True,
    }


def adapt_narrative(direction: str, child_feedback: str) -> dict[str, Any]:
    """
    Điều chỉnh hướng truyện dựa trên phản hồi của trẻ.

    Args:
        direction: Hướng truyện mới (VD: "more adventure", "add a dragon")
        child_feedback: Phản hồi của trẻ

    Returns:
        dict với hướng truyện đã cập nhật
    """
    # TODO: Update narrative_direction in session state
    return {
        "narrative_direction": direction,
        "acknowledged_feedback": child_feedback,
    }
