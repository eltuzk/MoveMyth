/**
 * client.ts — MoveMyth API client.
 *
 * Wraps all 6 backend endpoints with typed request/response.
 * All functions throw on non-2xx responses — callers must try/catch.
 *
 * Backend base URL: http://localhost:8000
 */

import type {
  StartResponse,
  SttResponse,
  VerifyResponse,
  VerifyContext,
  VerifyResult,
  AdaptResponse,
  BadgeResponse,
} from '../types/api';

const API_BASE = 'http://localhost:8000';

// ---------------------------------------------------------------------------
// Helper: throw structured error on non-ok responses
// ---------------------------------------------------------------------------

async function assertOk(res: Response, label: string): Promise<void> {
  if (!res.ok) {
    let body = '';
    try {
      const json = await res.json();
      body = json.message ?? JSON.stringify(json);
    } catch {
      body = res.statusText;
    }
    throw new Error(`[${label}] HTTP ${res.status}: ${body}`);
  }
}

// ---------------------------------------------------------------------------
// 1. POST /api/story/start
// ---------------------------------------------------------------------------

/**
 * Initialise a new play session.
 * Returns session_id, segment 0, and selected_challenge.
 */
export async function startStory(storyId: string): Promise<StartResponse> {
  const res = await fetch(`${API_BASE}/api/story/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ story_id: storyId }),
  });
  await assertOk(res, 'startStory');
  return res.json();
}

// ---------------------------------------------------------------------------
// 2. POST /api/story/tts  →  audio/wav binary
// ---------------------------------------------------------------------------

/**
 * Convert text to speech.
 * Backend auto-substitutes {child_name} if the session has a name.
 * Returns a Blob (audio/wav) — use playAudioBlob() to play it.
 */
export async function textToSpeech(text: string, sessionId: string): Promise<Blob> {
  const res = await fetch(`${API_BASE}/api/story/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, session_id: sessionId }),
  });
  await assertOk(res, 'textToSpeech');
  return res.blob();
}

// ---------------------------------------------------------------------------
// 3. POST /api/story/stt  (multipart/form-data)
// ---------------------------------------------------------------------------

/**
 * Send audio blob to STT. Backend transcribes and saves child_name to session.
 * Do NOT set Content-Type header — browser sets multipart boundary automatically.
 */
export async function speechToText(
  audioBlob: Blob,
  sessionId: string,
): Promise<SttResponse> {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');
  formData.append('session_id', sessionId);

  const res = await fetch(`${API_BASE}/api/story/stt`, {
    method: 'POST',
    body: formData,
    // NO Content-Type header — browser sets multipart boundary
  });
  await assertOk(res, 'speechToText');
  return res.json();
}

// ---------------------------------------------------------------------------
// 4. POST /api/vision/verify
// ---------------------------------------------------------------------------

/**
 * Verify whether the child performed the required action via camera image.
 *
 * context:
 *   "magic_sign_check"  → result in { pass | fail }
 *   "challenge_verify"  → result in { pass | retry | fail }
 */
export async function verifyAction(
  sessionId: string,
  imageBase64: string,      // full data URL: "data:image/jpeg;base64,..."
  expectedAction: string,
  context: VerifyContext,
): Promise<VerifyResponse> {
  const res = await fetch(`${API_BASE}/api/vision/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: sessionId,
      image_base64: imageBase64,
      expected_action: expectedAction,
      context,
    }),
  });
  await assertOk(res, 'verifyAction');
  return res.json();
}

// ---------------------------------------------------------------------------
// 5. POST /api/story/adapt
// ---------------------------------------------------------------------------

/**
 * Returns Lio's narrative response based on vision verify result.
 * On "pass": also returns next_segment_data + next_challenge.
 * Side effect (server-side on pass): increments session.current_segment, appends badge.
 */
export async function adaptNarrative(
  sessionId: string,
  verifyResult: VerifyResult,
  segmentIndex: number,
): Promise<AdaptResponse> {
  const res = await fetch(`${API_BASE}/api/story/adapt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: sessionId,
      verify_result: verifyResult,
      segment_index: segmentIndex,
    }),
  });
  await assertOk(res, 'adaptNarrative');
  return res.json();
}

// ---------------------------------------------------------------------------
// 6. GET /api/story/badge
// ---------------------------------------------------------------------------

/**
 * Returns the badge most recently earned.
 * Call immediately after receiving next_action === "award_badge" from adaptNarrative.
 */
export async function getBadge(sessionId: string): Promise<BadgeResponse> {
  const res = await fetch(
    `${API_BASE}/api/story/badge?session_id=${encodeURIComponent(sessionId)}`,
  );
  await assertOk(res, 'getBadge');
  return res.json();
}
