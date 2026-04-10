"""
MoveMyth — FastAPI Application Entrypoint
"""

from dotenv import load_dotenv
load_dotenv()

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.health import router as health_router
from routes.session import router as session_router
from routes.user import router as user_router
from routes.story import router as story_router
from routes.vision import router as vision_router
from routes.ws_lio import router as ws_lio_router
from routes.ws_vision import router as ws_vision_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown lifecycle events."""
    # --- Startup ---
    # TODO: Initialize Redis connection pool
    # TODO: Initialize Firestore client
    print("🧚 MoveMyth backend starting up...")
    yield
    # --- Shutdown ---
    # TODO: Close Redis connection pool
    print("🧚 MoveMyth backend shutting down...")


app = FastAPI(
    title="MoveMyth API",
    description="Interactive storytelling platform with movement challenges for kids",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Register Routers ---
app.include_router(health_router)
app.include_router(story_router, prefix="/api")
app.include_router(vision_router, prefix="/api")
app.include_router(ws_lio_router)
app.include_router(ws_vision_router)
