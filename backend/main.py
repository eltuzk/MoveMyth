"""
MoveMyth — FastAPI Application Entrypoint (MVP)
"""

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.health import router as health_router
from routes.story import router as story_router
from routes.vision import router as vision_router

app = FastAPI(
    title="MoveMyth MVP API",
    description="Interactive storytelling platform with movement challenges for kids",
    version="1.0.0",
)

# CORS — allow all origins in dev (no auth cookies used)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Register Routers ---
app.include_router(health_router)
app.include_router(story_router, prefix="/api")
app.include_router(vision_router, prefix="/api")
