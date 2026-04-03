# MoveMyth

**Interactive storytelling platform for children (4–10 years old)** — Stories only continue when kids complete movement challenges verified through camera.

## How It Works

1. **Lio** — the AI storyteller — narrates an adventure using voice
2. At key moments, Lio challenges the child to do a physical exercise (jump, raise hand, spin...)
3. The **Vision Verifier** watches through the camera to confirm the movement
4. Once verified, the child earns a **badge** and the story continues!

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI + Python 3.11+ |
| AI Agents | Google ADK 0.4.x + Gemini |
| Frontend | React 19 + TypeScript + Vite 6 |
| Styling | Tailwind CSS 3 |
| Realtime | WebSocket |
| Session DB | Redis 7 |
| Persistent DB | Google Firestore |

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Redis 7

### Backend
```bash
cd backend
cp .env.example .env
# Fill in your GEMINI_API_KEY and other vars

pip install -e ".[dev]"
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Docker (all services)
```bash
docker compose up --build
```

## Project Structure

```
├── backend/          # FastAPI + Google ADK agents
│   ├── agents/       # AI agents (Lio, Pipeline)
│   ├── services/     # Vision, Memory
│   ├── routes/       # API endpoints + WebSocket
│   └── schemas/      # Pydantic models
├── frontend/         # React + TypeScript + Vite
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── contexts/
│       └── types/
└── docker-compose.yml
```

## Team

## Key Rules

1. **Challenge Gate**: `award_badge` is NEVER called before `pending_challenge` is verified
2. **No Raw Media Storage**: Video frames are processed in-memory only, never persisted
3. **Child-safe Content**: All AI output passes through Guardian safety checks
4. **Graceful Degradation**: Vision timeout → retry button; API timeout → wait message + 1 retry
5. **Environment Parity**: Must work on both Windows (local) and Cloud Run
