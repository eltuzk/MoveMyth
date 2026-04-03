/**
 * WebSocket message types — matches API Contracts from CONTEXT.md
 */

// =============================================================================
// Lio WebSocket Messages (/ws/lio/{session_id})
// =============================================================================

// --- Frontend → Backend ---

export interface AudioInputMessage {
  type: 'audio_input';
  data: string; // base64 PCM
}

// --- Backend → Frontend ---

export interface LioSpeakingMessage {
  type: 'lio_speaking';
  audioData: string; // base64
}

export interface ChallengeIssuedMessage {
  type: 'challenge_issued';
  challengeId: string;
  exercise: string;
  reps: number;
  instruction: string;
}

export interface BadgeAwardedMessage {
  type: 'badge_awarded';
  badge: string;
  reason: string;
}

export interface SceneUpdateMessage {
  type: 'scene_update';
  scene: string;
  triggerImageGen: boolean;
}

// --- Union type for all Lio backend messages ---
export type LioServerMessage =
  | LioSpeakingMessage
  | ChallengeIssuedMessage
  | BadgeAwardedMessage
  | SceneUpdateMessage;

// =============================================================================
// Vision WebSocket Messages (/ws/vision/{session_id})
// =============================================================================

// --- Frontend → Backend ---

export interface FrameMessage {
  type: 'frame';
  data: string; // base64 JPEG 320x240
}

export interface StartVerificationMessage {
  type: 'start_verification';
  exercise: string;
  reps: number;
  id: string; // challenge_id
}

export interface CheckMagicSignMessage {
  type: 'check_magic_sign';
}

// --- Backend → Frontend ---

export interface MagicSignResultMessage {
  type: 'magic_sign_result';
  verified: boolean;
  confidence: number;
}

export interface ProgressMessage {
  type: 'progress';
  repCount: number;
  required: number;
}

export interface VerificationResultMessage {
  type: 'verification_result';
  verified: boolean;
  repCount: number;
  challengeId: string;
}

// --- Union type for all Vision backend messages ---
export type VisionServerMessage =
  | MagicSignResultMessage
  | ProgressMessage
  | VerificationResultMessage;

// --- Shared ---

export interface ErrorMessage {
  type: 'error';
  message: string;
}
