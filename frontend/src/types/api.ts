/**
 * api.ts — TypeScript types for all MoveMyth backend API responses.
 *
 * These match the exact JSON shapes returned by the FastAPI backend.
 * Source of truth: AGENTS.md § "Endpoint Specs"
 */

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

export interface Segment {
  segment_index: number;
  narrative_text: string;
  narration_tts: string;
}

export interface Challenge {
  action: string;
  display_text: string;
  tts_text: string;
  difficulty: string;
  fallback_action: string;
}

export interface Badge {
  id: string;
  label: string;
  emoji: string;
}

// ---------------------------------------------------------------------------
// POST /api/story/start
// ---------------------------------------------------------------------------

export interface StartResponse {
  session_id: string;
  child_name: string;
  segment: Segment;
  selected_challenge: Challenge;
}

// ---------------------------------------------------------------------------
// POST /api/story/tts  →  audio/wav binary (Blob, not JSON)
// ---------------------------------------------------------------------------

// No response type needed; caller receives a Blob.

// ---------------------------------------------------------------------------
// POST /api/story/stt
// ---------------------------------------------------------------------------

export interface SttResponse {
  text: string;
  saved_as_child_name: boolean;
}

// ---------------------------------------------------------------------------
// POST /api/vision/verify
// ---------------------------------------------------------------------------

export type VerifyResult = 'pass' | 'retry' | 'fail';
export type VerifyContext = 'magic_sign_check' | 'challenge_verify';

export interface VerifyResponse {
  result: VerifyResult;
  confidence: number;
  message: string;
}

// ---------------------------------------------------------------------------
// POST /api/story/adapt
// ---------------------------------------------------------------------------

export type NextAction = 'award_badge' | 'retry_challenge' | 'downgrade_challenge';

export interface AdaptResponse {
  tts_text: string;
  display_text: string;
  next_action: NextAction;
  next_segment_data: Segment | null;
  next_challenge: Challenge | null;
  downgraded_challenge: Challenge | null;
}

// ---------------------------------------------------------------------------
// GET /api/story/badge
// ---------------------------------------------------------------------------

export interface BadgeResponse {
  badge: Badge;
  segment_completed: number;
  total_badges: number;
}

// ---------------------------------------------------------------------------
// Backend error shape (for non-2xx responses)
// ---------------------------------------------------------------------------

export interface ApiError {
  error: string;
  message: string;
  status_code: number;
}
