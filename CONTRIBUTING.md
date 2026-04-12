# Contributing Guide

## Prerequisites

- **Frontend:** Node.js >= 18, npm >= 9
- **Backend:** Python >= 3.11
- **Others:** Git, Docker (optional, for containerized development)

## Git Workflow

### Branch Strategy

```
main              ← Production (protected)
  │
develop           ← Integration branch (protected)
  │
feature/*         ← New features
bugfix/*          ← Bug fixes
hotfix/*          ← Urgent fixes for production
```

### Quy trình làm việc

```bash
# 1. Clone repo (lần đầu)
git clone <repo-url>
cd MoveMyth

# 2. Luôn bắt đầu từ develop mới nhất
git checkout develop
git pull origin develop

# 3. Tạo branch mới
git checkout -b feature/ten-tinh-nang
# hoặc: git checkout -b bugfix/ten-loi

# 4. Code và commit thường xuyên
git add .
git commit -m "feat: add story narration component"

# 5. Push branch lên remote
git push origin feature/ten-tinh-nang

# 6. Tạo Pull Request trên GitHub
#    - Base: develop
#    - Compare: feature/ten-tinh-nang

# 7. Sau khi PR được merge, xóa branch local
git checkout develop
git pull origin develop
git branch -d feature/ten-tinh-nang
```

### Commit Message Convention

Format: `type: message`

| Type | Mô tả |
|------|-------|
| `feat` | Tính năng mới |
| `fix` | Sửa lỗi |
| `refactor` | Refactor code |
| `docs` | Documentation |
| `test` | Thêm/sửa tests |
| `chore` | Config, dependencies |

Ví dụ:
```
feat: add physical challenge verify logic
fix: resolve session state timeout
docs: update AGENTS.md with new tools
```

### Code Review

- Mỗi PR cần ít nhất 1 approval
- CI phải pass (lint, typecheck, tests)
- Resolve tất cả comments trước khi merge

## Getting Started

### Backend Setup (FastAPI)
```bash
cd backend
# Tạo môi trường ảo (khuyến nghị)
python -m venv venv
source venv/bin/activate # Windows: .\venv\Scripts\activate

# Cài đặt dependencies
pip install -e ".[dev]"

# Chạy server
uvicorn main:app --reload --port 8000
```

### Frontend Setup (React + Vite)
```bash
cd frontend
# Cài đặt dependencies
npm install

# Chạy server
npm run dev # http://localhost:5173
```

## Project Structure

```
MoveMyth/
├── frontend/           # React + Vite + Tailwind
│   └── src/
│       ├── components/     # Reusable UI components (Lio, Badges, etc.)
│       ├── contexts/       # Session & Auth contexts
│       ├── hooks/          # Custom hooks (useVision, useAudio, etc.)
│       └── types/          # TypeScript interfaces (Story, Challenge)
├── backend/            # FastAPI + Python
│   ├── agents/         # Lio's core logic (vision, adaptive narrative)
│   ├── routes/         # API endpoints (/api/story, /api/vision)
│   ├── schemas/        # Pydantic models for request/response validation
│   ├── services/       # Business logic (session management, TTS/STT)
│   └── stories/        # Pre-generated story JSON files
└── docker-compose.yml  # Run both services together
```

## Development Workflow

### Adding a New Story Segment
1. Update existing story JSON in `backend/stories/`.
2. Ensure types are updated in `frontend/src/types/` if schema changes.

### Adding a New API Endpoint
1. Define Pydantic schema in `backend/schemas/`.
2. Create route in `backend/routes/`.
3. Register in `backend/main.py`.

### Adding a New Frontend Component
1. Create component in `frontend/src/components/`.
2. Export and use in pages or higher-level components.

## Testing & Quality

### Backend
```bash
cd backend
# Run tests
pytest
# Linting
ruff check .
```

### Frontend
```bash
cd frontend
# TypeScript check
npm run typecheck
# Linting
npm run lint
```

## Code Style

- **Strict TypeScript:** Luôn khai báo types rõ ràng trong frontend.
- **Pythonic Code:** Tuân thủ PEP8, sử dụng Ruff để format/lint.
- **Lio Persona:** Mọi text hiển thị (narrative) cần tuân theo tone giọng của nhân vật Lio đã quy định trong `AGENTS.md`.

## Commands Reference

| Command | Description |
|---------|-------------|
| `cd frontend && npm run dev` | Chạy frontend |
| `cd backend && uvicorn main:app --reload` | Chạy backend |
| `docker-compose up` | Chạy cả 2 bằng Docker |
| `pytest` | Chạy unit test backend |
| `npm run build` | Build frontend production |
