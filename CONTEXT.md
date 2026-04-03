# MoveMyth — Project Context

## Tech Stack

| Layer | Công nghệ | Version |
|-------|-----------|---------|
| Backend framework | FastAPI | 0.115.x |
| Backend runtime | Python | 3.11+ |
| AI Agent framework | Google ADK | 0.4.x |
| AI Models | Google Gemini | gemini-2.5-flash / gemini-2.5-pro |
| Realtime voice+vision | Gemini Live API | gemini-2.5-flash |
| Frontend framework | React + TypeScript | 19 + 5.x |
| Frontend build | Vite | 6.x |
| Styling | Tailwind CSS | 4.x |
| Realtime transport | WebSocket | native |
| Session DB | Redis | 7.x |
| Persistent DB | Google Firestore | — |
| Cloud | Google Cloud Platform | — |
| Container | Docker | — |

---

## Environment Variables

Tất cả secrets đặt trong `backend/.env` — KHÔNG hardcode bất kỳ key nào vào code.

```env
GEMINI_API_KEY=           # Google AI Studio key
GOOGLE_CLOUD_PROJECT=     # GCP project ID (movemyth-dev)
REDIS_URL=redis://localhost:6379
```

Đọc trong Python:
```python
from dotenv import load_dotenv
import os
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
```

---

## Naming Conventions

### Python (Backend)
- Files: `snake_case.py`
- Classes: `PascalCase`
- Functions / variables: `snake_case`
- Constants: `UPPER_SNAKE_CASE`
- ADK agents: tên lowercase, không dấu cách (VD: `"lio"`, `"guardian_of_balance"`)

### TypeScript (Frontend)
- Components: `PascalCase` trong folder cùng tên (`MagicMirror/index.tsx`)
- Hooks: `useCamelCase.ts`
- Context: `PascalCaseContext.tsx`
- Variables / functions: `camelCase`
- Types / Interfaces: `PascalCase`, prefix `I` không bắt buộc

### Git branches
```
main              # stable, chỉ merge khi tested
feat/lio-agent    # Lê Vũ Thiêm Hoàng
feat/vision       # Phan Thế Hiển
feat/pipeline     # Phan Thế Hiển
feat/frontend     # Hoàng Khôi Nguyên + Trần Lân
```

---

## Project Rules — ĐỌC TRƯỚC KHI CODE

### Rule 1: Challenge Gate
`award_badge` KHÔNG BAO GIỜ được gọi khi `pending_challenge` còn trong state.
Lio KHÔNG tiếp tục kể chuyện khi `pending_challenge != None`.

### Rule 2: No Raw Media Storage
KHÔNG lưu video frame, audio recording vào Firestore hay bất kỳ storage nào.
Vision Verifier chỉ xử lý frame in-memory rồi discard ngay.

### Rule 3: Child-safe Content
Mọi output từ AI đều phải qua Guardian trước khi đến tay trẻ (Agent Mode).
Live Mode dùng Gemini safety settings mức cao nhất.

### Rule 4: Graceful Degradation
Nếu Vision Verifier fail sau 30 giây → hiển thị nút "Thử lại" cho trẻ.
Nếu Gemini API timeout → Lio nói câu chờ, retry 1 lần, không crash app.

### Rule 5: Environment Parity
Code phải chạy được ở local (Windows) lẫn Cloud Run.
Không dùng path separator `\` — luôn dùng `os.path.join()` hoặc `pathlib`.

---

## API Contracts

### WebSocket `/ws/lio/{session_id}`
**Frontend → Backend**
```json
{ "type": "audio_input", "data": "<base64 PCM>" }
```
**Backend → Frontend**
```json
{ "type": "lio_speaking", "audio_data": "<base64>" }
{ "type": "challenge_issued", "challenge_id": "...", "exercise": "jump", "reps": 5, "instruction": "..." }
{ "type": "badge_awarded", "badge": "brave_jumper", "reason": "..." }
{ "type": "scene_update", "scene": "...", "trigger_image_gen": true }
```

### WebSocket `/ws/vision/{session_id}`
**Frontend → Backend**
```json
{ "type": "frame", "data": "<base64 JPEG 320x240>" }
{ "type": "start_verification", "exercise": "jump", "reps": 5, "id": "challenge_id" }
{ "type": "check_magic_sign" }
```
**Backend → Frontend**
```json
{ "type": "magic_sign_result", "verified": true, "confidence": 0.92 }
{ "type": "progress", "rep_count": 3, "required": 5 }
{ "type": "verification_result", "verified": true, "rep_count": 5, "challenge_id": "..." }
```

### REST Endpoints
```
GET  /health                          → { status: "ok" }
POST /api/session/start               → { session_id }
POST /api/session/{id}/end            → { status: "saved" }
GET  /api/user/{user_id}/history      → { total_sessions, all_badges, favorite_theme }
POST /api/generate-story              → { story } (Agent Mode only)
```

---

## Gemini Model Usage

| Tác vụ | Model | Lý do |
|--------|-------|-------|
| Lio realtime voice+vision | `gemini-2.5-flash` (Live) | Latency thấp nhất |
| Vision verification | `gemini-2.5-flash` | Nhanh, đủ accurate |
| Adventure Seeker | `gemini-2.5-flash-lite` | Chi phí thấp, task đơn giản |
| Guardian of Balance | `gemini-2.5-flash-lite` | Chi phí thấp, structured output |
| Storysmith | `gemini-2.5-pro` | Chất lượng narrative cao nhất |

---

## MVP Scope (Vòng 2 — deadline 17/4)

Chỉ build những thứ sau, không thêm:

**Must have:**
- [ ] Magic sign detection hoạt động qua camera
- [ ] Lio kể chuyện bằng giọng nói (Gemini Live)
- [ ] Giao 1 thử thách vận động và xác minh được
- [ ] Trao badge sau khi xác minh thành công
- [ ] Session state persist trong phiên

**Nice to have (nếu còn thời gian):**
- [ ] Agent Mode pipeline (Adventure Seeker → Guardian → Storysmith)
- [ ] Firestore cross-session memory
- [ ] Sinh minh họa truyện

**OUT OF SCOPE cho MVP:**
- Multi-language support
- Mobile app
- Parent dashboard
- Avatar customization từ ảnh thật
