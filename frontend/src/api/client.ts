// ─────────────────────────────────────────────────────────────────────────────
// MoveMyth — Backend API Client
// All calls target http://localhost:8000 (local MVP backend).
// No axios — fetch only. All functions are async.
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = "http://localhost:8000";

// ─── Response Types ───────────────────────────────────────────────────────────

export interface Challenge {
  action: string;
  display_text: string;
  tts_text: string;
  difficulty: "normal" | "easy";
  fallback_action: string;
}

export interface Segment {
  segment_index: number;
  narrative_text: string;
  narration_tts: string;
}

export interface StartStoryResponse {
  session_id: string;
  child_name: string;
  segment: Segment;
  selected_challenge: Challenge;
}

export interface STTResponse {
  text: string;
  saved_as_child_name: boolean;
}

export type VerifyResult = "pass" | "retry" | "fail";

export interface VerifyVisionResponse {
  result: VerifyResult;
  confidence: number;
  message: string;
}

export type NextAction = "award_badge" | "retry_challenge" | "downgrade_challenge";

export interface Badge {
  id: string;
  label: string;
  emoji: string;
}

export interface AdaptNarrativeResponse {
  tts_text: string;
  display_text: string;
  next_action: NextAction;
  next_segment_data: Segment | null;
  next_challenge: Challenge | null;
  downgraded_challenge: Challenge | null;
}

export interface GetBadgeResponse {
  badge: Badge;
  segment_completed: number;
  total_badges: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Parses a structured backend error or falls back to a generic message.
 * Backend error shape: { error: string, message: string, status_code: number }
 */
async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (body?.message) return body.message;
    if (body?.error) return body.error;
  } catch {
    // body was not JSON — fall through
  }
  return `HTTP ${res.status}: ${res.statusText}`;
}

async function handleJsonResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const message = await parseErrorMessage(res);
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

// ─── API Functions ────────────────────────────────────────────────────────────

/**
 * POST /api/story/start
 * Initializes a new session and returns segment 0 + selected challenge.
 */
export async function startStory(storyId: string): Promise<StartStoryResponse> {
  const res = await fetch(`${BASE_URL}/api/story/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ story_id: storyId }),
  });
  return handleJsonResponse<StartStoryResponse>(res);
}

/**
 * POST /api/story/tts
 * Converts text to speech. Returns raw audio as a Blob (audio/wav or audio/mpeg).
 * Frontend should create an object URL and play via <audio>.
 */
export async function callTTS(text: string, sessionId: string): Promise<Blob> {
  const res = await fetch(`${BASE_URL}/api/story/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, session_id: sessionId }),
  });

  if (!res.ok) {
    const message = await parseErrorMessage(res);
    throw new Error(message);
  }

  return res.blob();
}

/**
 * POST /api/story/stt
 * Sends an audio Blob via multipart/form-data for transcription.
 * Backend saves the transcribed text as child_name in session state.
 */
export async function callSTT(
  audioBlob: Blob,
  sessionId: string
): Promise<STTResponse> {
  const form = new FormData();
  form.append("audio", audioBlob, "recording.webm");
  form.append("session_id", sessionId);

  const res = await fetch(`${BASE_URL}/api/story/stt`, {
    method: "POST",
    body: form,
    // Do NOT set Content-Type manually — browser sets it with boundary automatically.
  });
  return handleJsonResponse<STTResponse>(res);
}

/**
 * POST /api/vision/verify
 * Verifies whether the child performed the required physical action.
 *
 * context values:
 *   "magic_sign_check"  → result is "pass" | "fail" only
 *   "challenge_verify"  → result is "pass" | "retry" | "fail"
 */
export async function verifyVision(params: {
  sessionId: string;
  imageBase64: string;
  expectedAction: string;
  context: "magic_sign_check" | "challenge_verify";
}): Promise<VerifyVisionResponse> {
  const { sessionId, imageBase64, expectedAction, context } = params;

  const res = await fetch(`${BASE_URL}/api/vision/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: sessionId,
      image_base64: imageBase64,
      expected_action: expectedAction,
      context,
    }),
  });
  return handleJsonResponse<VerifyVisionResponse>(res);
}

/**
 * POST /api/story/adapt
 * Returns Lio's narrative response for the given verify result.
 * On "pass", also returns next_segment_data + next_challenge so the loop
 * can continue without an extra round-trip.
 */
export async function adaptNarrative(params: {
  sessionId: string;
  verifyResult: VerifyResult;
  segmentIndex: number;
}): Promise<AdaptNarrativeResponse> {
  const { sessionId, verifyResult, segmentIndex } = params;

  const res = await fetch(`${BASE_URL}/api/story/adapt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: sessionId,
      verify_result: verifyResult,
      segment_index: segmentIndex,
    }),
  });
  return handleJsonResponse<AdaptNarrativeResponse>(res);
}

/**
 * GET /api/story/badge?session_id=...
 * Returns the badge most recently earned (already appended by adapt_narrative).
 * Call immediately after receiving next_action == "award_badge".
 */
export async function getBadge(sessionId: string): Promise<GetBadgeResponse> {
  const url = `${BASE_URL}/api/story/badge?session_id=${encodeURIComponent(sessionId)}`;
  const res = await fetch(url);
  return handleJsonResponse<GetBadgeResponse>(res);
}
