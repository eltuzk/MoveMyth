# MoveMyth — Movement-Gated Interactive Storytelling

<p align="center">
  <strong>The story only continues when the child actually moves.</strong><br>
  AI Storyteller <em>Lio</em> narrates, assigns challenges, verifies via camera — turning screen time into move time.
</p>

> GDGoC Hackathon Vietnam 2026 — "Agentic AI: Agents of Change"

---

## Problem

Children aged 5–8 spend an average of **3 hours 5 minutes per day** on screen media (Common Sense Media, 2020), mostly passive video consumption. The **WHO recommends at least 60 minutes of daily physical activity** for children. No existing product combines real-time AI storytelling + camera-verified physical actions + adaptive difficulty in a single experience.

## Solution

**MoveMyth** turns children into the main character of the story. Physical actions are not optional add-ons — they are the **mandatory gate** for the plot to continue.

### Core Loop

```
Magic Sign → Lio narrates → Physical challenge → Camera verifies → Badge → Next segment
```

1. Child performs a **Magic Sign** (✌️) in front of the camera to start the adventure
2. **Lio** — the AI storyteller — narrates the story using voice synthesis
3. At dramatic moments, Lio assigns a **physical challenge** (jump, raise hands, spin)
4. **Gemini Vision** verifies the action via camera — the child can't just say "I did it"
5. Pass → earn a **badge** → story continues to the next segment
6. Fail → Lio encourages and offers an **easier challenge** (adaptive difficulty)

## Agentic AI

MoveMyth is not a chatbot — it is an **agentic system** with:

| Capability | Implementation |
|---|---|
| **Tool Use** | Lio uses 6 tools: `say_hello`, `do_physical_exercise`, `award_badge`, `adapt_narrative`, `say_name_prompt`, `hear_child` |
| **Context Awareness** | Challenges selected based on story theme; child's name personalizes all narration |
| **Planning** | 3-segment narrative arc with movement points placed at dramatic peaks |
| **Feedback Loop** | Vision verify → 3-way branching (pass/retry/fail) → adaptive difficulty adjustment |
| **Memory** | Session state tracks name, progress, badges, and challenge history |

## System Architecture

```
┌──────────────────────────────────────────────────┐
│                   FRONTEND                       │
│         React 19 + TypeScript + Vite             │
│  Camera (getUserMedia) │ Mic │ Audio Playback    │
└──────────────┬──────────────────┬────────────────┘
               │    HTTP REST     │
┌──────────────▼──────────────────▼────────────────┐
│                   BACKEND                        │
│              FastAPI + Python 3.11               │
│                                                  │
│  POST /api/story/start    → Initialize session   │
│  POST /api/story/tts      → Gemini TTS (Kore)    │
│  POST /api/story/stt      → Gemini STT           │
│  POST /api/vision/verify  → Gemini Vision        │
│  POST /api/story/adapt    → Branch narrative     │
│  GET  /api/story/badge    → Award badge          │
│                                                  │
│  Session State: In-memory dict                   │
│  Stories: Pre-generated JSON (3 segments each)   │
└──────────────────────┬───────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────┐
│              GOOGLE GEMINI API                   │
│  TTS: gemini-3.1-flash-tts (voice "Kore")        │
│  STT: gemini-3.1-flash-lite                      │
│  Vision: gemini-3.1-flash-lite                   │
└──────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite 6 + Tailwind CSS 3 |
| Backend | Python 3.11 + FastAPI |
| AI | Google Gemini API (`google-genai` SDK) |
| TTS | Gemini Flash TTS — voice "Kore", PCM → WAV |
| Vision | Gemini Flash Lite — single-frame verify (jump, raise_hands, spin) |
| STT | Gemini Flash Lite — audio transcription |
| Animation | Framer Motion + canvas-confetti |
| Session | In-memory Python dict (MVP) |

## Project Structure

```
MoveMyth/
├── backend/
│   ├── main.py              # FastAPI app + CORS
│   ├── routes/
│   │   ├── story.py         # /api/story/* endpoints
│   │   └── vision.py        # /api/vision/verify
│   ├── services/
│   │   ├── gemini_tts.py    # Gemini TTS wrapper
│   │   ├── gemini_stt.py    # Gemini STT wrapper
│   │   └── gemini_vision.py # Gemini Vision wrapper
│   ├── models/
│   │   └── session.py       # SessionState dataclass
│   ├── stories/
│   │   ├── forest.json      # "The Enchanted Forest" (3 segments)
│   │   └── ocean.json       # "The Deep Ocean" (3 segments)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/client.ts         # Typed API client (6 functions)
│   │   ├── screens/              # Route-based screens
│   │   ├── components/           # Shared UI components
│   │   ├── hooks/                # useCamera, useAudio, useMicrophone
│   │   ├── contexts/             # SessionContext (global state)
│   │   └── types/                # TypeScript interfaces
│   └── package.json
├── AGENTS.md          # Agent logic & endpoint specs
├── CONTEXT.md         # Project context & constraints
└── STORY_SCHEMA.md    # Story JSON schema
```

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Gemini API Key ([Google AI Studio](https://aistudio.google.com/apikey))

### Backend

```bash
cd backend
cp .env.example .env
# Add your GEMINI_API_KEY to .env

pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Verify: open `http://localhost:8000/docs` — you should see Swagger UI with all 6 endpoints.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` to start the adventure!

## Demo Flow

1. **Home** → Click "Start Story"
2. **Magic Sign** → Camera activates, perform ✌️ → Gemini Vision confirms
3. **Story** → Lio narrates "The Enchanted Forest" using synthesized voice
4. **Challenge** → "Jump 3 times!" → Camera captures frame → Vision verifies
5. **Result**:
   - Pass → Badge 🌟 + confetti celebration → Next segment
   - Retry → "Almost there! Try again!"
   - Fail → Lio offers an easier challenge (adaptive difficulty)
6. **Complete** → 3 badges earned → Adventure Hero 🏆

## Agentic AI — Evaluation Criteria

| Agentic Criterion | MoveMyth Implementation |
|---|---|
| Goal Setting | Lio constructs a narrative arc with embedded movement points |
| Planning | Sequential pipeline: greet → narrate → challenge → verify → adapt → badge |
| Tool Use | 6 tools (TTS, STT, Vision, Badge, Adapt, Start) |
| Feedback Loop | Vision verify → 3-way response branching → adaptive difficulty |
| Context Awareness | Challenge selected by theme; child's name personalizes everything |
| Memory | Session state: name, segment index, badges, challenge history |

---

<p align="center">
  <em>MoveMyth — When technology doesn't keep children seated, it gets them moving.</em>
</p>