# MoveMyth — Agent Architecture

## Tổng quan hệ thống

MoveMyth là nền tảng kể chuyện tương tác cho trẻ em (4–10 tuổi), nơi câu chuyện chỉ tiếp tục khi trẻ hoàn thành thử thách vận động được xác minh qua camera.

Hệ thống gồm 2 chế độ:
- **Live Mode**: Lio ứng biến hoàn toàn theo thời gian thực
- **Agent Mode**: Pipeline chuẩn bị trước câu chuyện, Lio dẫn truyện từ kịch bản

---

## Agents

### Lio — Root Agent (Live Mode)
- **File**: `backend/agents/lio/agent.py`
- **Model**: `gemini-2.5-flash` (Gemini Live, realtime voice + vision)
- **Vai trò**: Điều phối toàn bộ phiên chơi — nghe giọng nói, đọc camera, kể chuyện, giao thử thách
- **Tools**:
  | Tool | Mô tả |
  |------|-------|
  | `say_hello` | Chào hỏi + xác minh magic sign, KHÔNG cho qua nếu sign chưa detected |
  | `do_physical_exercise` | Giao thử thách vận động, tạo `pending_challenge` trong state |
  | `draw_story_scene` | Kích hoạt sinh minh họa cho cảnh truyện hiện tại |
  | `award_badge` | Trao badge — CHỈ được gọi sau khi `pending_challenge.verified = True` |
  | `adapt_narrative` | Điều chỉnh hướng truyện dựa trên phản hồi của trẻ |
- **Rule bất di bất dịch**: KHÔNG gọi `award_badge` khi `pending_challenge` chưa verified. KHÔNG tiếp tục kể chuyện khi đang có challenge pending.

---

### Adventure Seeker — Research Agent (Agent Mode)
- **File**: `backend/agents/pipeline/adventure_seeker.py`
- **Model**: `gemini-2.5-flash-lite` + Google Search
- **Vai trò**: Nghiên cứu lore, bối cảnh văn hóa, ý tưởng vận động phù hợp với theme
- **Input**: `{ theme, age_group }`
- **Output JSON**: `{ world_building, supporting_characters, movement_ideas, vocabulary }`

---

### Guardian of Balance — Safety Agent (Agent Mode)
- **File**: `backend/agents/pipeline/guardian.py`
- **Model**: `gemini-2.5-flash-lite`
- **Vai trò**: Kiểm duyệt nội dung — an toàn, mật độ vận động, phù hợp độ tuổi
- **Output JSON**: `{ safety_check, movement_density_score, age_appropriate, overall: "approve"|"revise"|"reject", revision_notes }`
- **Rule**: Chỉ `approve` khi safety=pass, movement_density≥3, age=pass

---

### Storysmith — Writer Agent (Agent Mode)
- **File**: `backend/agents/pipeline/storysmith.py`
- **Model**: `gemini-2.5-pro`
- **Vai trò**: Viết narrative arc 4 hồi hoàn chỉnh với movement points lồng ghép
- **Input**: research từ Adventure Seeker + revision_notes từ Guardian
- **Output JSON**: `{ title, estimated_duration_minutes, acts: [...], ending_summary }`
- **Mỗi act có thể có** `movement_point: { exercise, reps, badge_reward }` hoặc `null`

---

### Orchestrator — Pipeline Coordinator (Agent Mode)
- **File**: `backend/agents/pipeline/orchestrator.py`
- **Type**: `SequentialAgent` chứa `LoopAgent`
- **Flow**: `Adventure Seeker → [Guardian → EscalationChecker] (tối đa 3 vòng) → Storysmith`
- **EscalationChecker**: Đọc `guardian_result.overall` → set `should_continue` để LoopAgent biết dừng hay retry

---

## Services

### Vision Verifier
- **File**: `backend/services/vision/verifier.py`
- **Model**: `gemini-2.5-flash` (Vision)
- **Vai trò**: Nhận JPEG frame base64, xác minh trẻ có đang thực hiện đúng action không
- **Supported actions**: `magic_sign`, `jump`, `raise_hand`, `spin`
- **Output**: `{ verified: bool, confidence: float, note: str }`

### Memory / Session Store
- **Files**: `backend/services/memory/`
- **Lớp 1 — Session State** (ADK, in-memory): Trạng thái trong 1 phiên chơi
- **Lớp 2 — Long-term Memory** (Firestore): Lưu tiến trình qua nhiều phiên
- **Firestore collections**: `sessions/{sessionId}`, `users/{userId}`

---

## Data Flow

```
[Trẻ em]
    │ giọng nói + camera
    ▼
[Frontend — Magic Mirror]
    │ WebSocket frames + audio
    ▼
[Backend — routes/lio.py]
    │ stream tới Gemini Live
    ▼
[Lio Root Agent]
    ├── tool: do_physical_exercise ──► pending_challenge in state
    │                                        │
    │                                        ▼
    │                              [Vision Verifier WS]
    │                                        │ verified=True
    │                                        ▼
    └── tool: award_badge ◄─────── challenge cleared
    │
    ▼
[Firestore — save badge, sync state]
    │
    ▼
[Frontend — hiển thị badge + tiếp tục truyện]
```

---

## Session State Schema

```python
{
    # Runtime (ADK state)
    "child_name": str,
    "session_started": bool,
    "story_theme": str,
    "mode": "live" | "agent",
    "current_scene": int,
    "badges": list[dict],
    "scenes": list[str],
    "completed_challenges": list[dict],
    "pending_challenge": dict | None,   # None khi không có challenge đang chờ
    "narrative_direction": str,

    # Long-term memory (load từ Firestore khi tạo session)
    "is_returning_user": bool,
    "previous_badges": list[dict],
    "favorite_theme": str | None,
    "total_sessions": int,
}
```
