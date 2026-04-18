"""
MoveMyth — Application Settings

Load environment variables from .env file.
Rule 5: Use pathlib for cross-platform path compatibility.
"""

from pathlib import Path
from dotenv import load_dotenv
import os

# Load .env from backend directory
_env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=_env_path)

# --- API Keys ---
GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
GOOGLE_CLOUD_PROJECT: str = os.getenv("GOOGLE_CLOUD_PROJECT", "")

# --- Redis ---
REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")

# --- Gemini Models ---
MODEL_LIO = "gemini-3.1-flash-lite-preview"
MODEL_VISION = "gemini-3.1-flash-lite-preview"
MODEL_ADVENTURE_SEEKER = "gemini-3.1-flash-lite-preview"
MODEL_GUARDIAN = "gemini-3.1-flash-lite-preview"
MODEL_STORYSMITH = "gemini-2.5-pro"

# --- App Constants ---
VISION_TIMEOUT_SECONDS = 30
MAX_GUARDIAN_RETRIES = 3
SUPPORTED_ACTIONS = ["magic_sign", "jump", "raise_hand", "spin"]

# --- Paths (Rule 5: always use pathlib) ---
PROJECT_ROOT = Path(__file__).resolve().parent.parent
