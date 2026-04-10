# CONTEXT.md — MoveMyth MVP
> Last updated: 2026-04-10
> Scope: MVP One Complete Loop (Vòng 2 — GDGoC Hackathon Vietnam 2026)

---

## Project Overview

**MoveMyth** is a movement-gated interactive storytelling platform for children aged 4–10.
AI storyteller **Lio** tells a story, assigns physical challenges, verifies them via camera, and continues the story only when the child completes the action.

**Repo org:** OmniaVincimus
**MVP deadline:** 2026-04-17

---

## Team & Roles

| Name | Role |
|---|---|
| Hoàng Khôi Nguyên | Frontend |
| Phan Thế Hiển | Backend |
| Lê Vũ Thiêm Hoàng | Fullstack |
| Trần Lân | Frontend |

---

## Tech Stack

### Backend
- **Language:** Python 3.11
- **Framework:** FastAPI
- **AI:** Google Gemini API (single API key covers all: TTS, STT, Vision)
  - TTS: `gemini-2.5-flash` or `gemini-2.5-pro`
  - STT: Gemini Speech-to-Text
  - Vision: `gemini-2.5-flash` (vision capability)
- **Session storage:** In-memory Python dict (no database for MVP)
  - Key: `session_id` (UUID string, generated at `/api/story/start`)
  - Stored in module-level dict: `sessions: dict[str, SessionState]`
- **Agent framework:** Google ADK (available but minimal usage in MVP)
- **Environment variables:** `GEMINI_API_KEY`, `GOOGLE_CLOUD_PROJECT` (GCP project ID, not an API key)

### Frontend
- **Framework:** React 19 + TypeScript
- **Build tool:** Vite
- **Styling:** Tailwind CSS v3
- **Key browser APIs:** `getUserMedia` (camera + mic), `MediaRecorder` (audio recording), `Audio` (TTS playback)

### Infrastructure (MVP — local only)
- Backend runs on `http://localhost:8000`
- Frontend runs on `http://localhost:5173`
- No cloud deployment for MVP
- No WebSockets (use regular HTTP polling/fetch)
- No authentication

---

## Project Structure

```
/
├── AGENTS.md           # Agent logic, tools, adapt_narrative spec
├── CONTEXT.md          # This file
├── STORY_SCHEMA.md     # Story JSON format spec
├── backend/
│   ├── main.py         # FastAPI app entry point
│   ├── routers/
│   │   ├── story.py    # /api/story/* endpoints
│   │   └── vision.py   # /api/vision/* endpoints
│   ├── services/
│   │   ├── tts.py      # Gemini TTS wrapper
│   │   ├── stt.py      # Gemini STT wrapper
│   │   └── vision.py   # Gemini Vision wrapper
│   ├── models/
│   │   └── session.py  # SessionState dataclass
│   ├── stories/
│   │   ├── forest.json # Pre-generated story (forest theme)
│   │   └── ocean.json  # Pre-generated story (ocean theme)
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── App.tsx
    │   ├── pages/
    │   │   └── MagicMirror.tsx   # Single main screen
    │   ├── components/
    │   │   ├── CameraFeed.tsx
    │   │   ├── StoryDisplay.tsx
    │   │   ├── ChallengeCard.tsx
    │   │   ├── BadgePopup.tsx
    │   │   └── MicButton.tsx
    │   ├── hooks/
    │   │   ├── useCamera.ts
    │   │   └── useAudio.ts
    │   └── api/
    │       └── client.ts         # API calls to backend
    └── package.json
```

---

## MVP Core Loop (One Complete Loop)

```
1. Magic Sign check (camera → /api/vision/verify, context: magic_sign_check → pass/fail only)
2. Lio greets + asks name (POST /api/story/tts)
3. Child says name (mic → POST /api/story/stt → backend saves child_name to session)
4. Lio narrates story segment (POST /api/story/tts with narration_tts text)
5. Lio assigns challenge (POST /api/story/tts with selected_challenge.tts_text)
6. Child performs action → presses "Xong rồi!" → camera captures photo
7. POST /api/vision/verify (context: challenge_verify) → pass / retry / fail
8. POST /api/story/adapt → tts_text + next_action + next_segment_data (if pass)
9. POST /api/story/tts (Lio speaks adapt response)
10. If next_action == "award_badge":
    → GET /api/story/badge → show badge popup
    → use next_segment_data + next_challenge from adapt response to continue loop
11. Loop repeats for segments 1 and 2 (no extra API call needed to fetch them)
```

---

## API Endpoints (MVP only)

| Method | Path | Description |
|---|---|---|
| POST | `/api/story/start` | Start session, return segment 0 + one selected challenge (not array) |
| POST | `/api/story/stt` | Audio → text; also saves name to session state |
| POST | `/api/story/tts` | Text → audio bytes; substitutes `{child_name}` from session |
| POST | `/api/vision/verify` | Image → pass/fail (magic_sign) or pass/retry/fail (challenge) |
| POST | `/api/story/adapt` | Narrative response + next segment data when pass |
| GET | `/api/story/badge` | Return latest badge (already saved by adapt) |
| GET | `/health` | Health check |

Full request/response schemas are defined per endpoint in `routers/story.py` and `routers/vision.py`.

---

## Session State Schema

```python
@dataclass
class SessionState:
    session_id: str
    child_name: str = ""
    story_id: str = ""          # "forest" or "ocean"
    current_segment: int = 0    # 0..2 = active segment index, 3 = all segments finished
    current_challenge: str = "" # active challenge action
    badges: list[dict] = field(default_factory=list)  # list of badge objects {id, label, emoji}
    loop_count: int = 0         # number of completed challenge loops
```

---

## In-Scope Features (build these)

- Magic Sign verification via camera
- TTS audio playback (Lio speaks)
- STT for child's name input
- Story segment display + narration
- Vision verify: pass / retry / fail with challenge downgrade
- adapt_narrative: 3 response variants
- Badge popup on pass
- Loop runs 3 times without crashing

## Out-of-Scope (do NOT generate code for these)

- Gemini Live real-time streaming
- Multi-agent pipeline (Adventure Seeker, Guardian, Storysmith, Orchestrator)
- Per-scene image generation
- Veo animation
- Firestore / Redis
- WebSockets
- Cloud Run deployment
- Authentication / OAuth
- Parent dashboard
- Avatar personalization from photo
- Agent Mode / Live Mode toggle
- Multi-language support
- Cross-session memory

---

## Key Constraints

- **Latency:** Keep each API call under 3s where possible. Vision verify and TTS are the slowest — show loading states on FE.
- **Camera:** All camera usage is single-frame capture (no video stream to backend). Capture → base64 → POST.
- **Audio:** TTS response is audio bytes. FE creates a Blob URL and plays via `<audio>` element.
- **Vision actions:** Only 3 supported actions for MVP: `jump`, `raise_hands`, `spin`.
- **Stories:** Only 2 pre-generated stories. No dynamic story generation in MVP.
- **Error handling:** All endpoints must return structured errors. FE must handle timeout and API errors gracefully without crashing the loop.