/**
 * session.ts — MVP session types.
 *
 * Replaced old WebSocket-era types with the MVP API shapes.
 * All shapes re-exported from types/api.ts for convenience.
 */

export type { Segment, Challenge, Badge } from './api';

// Legacy exports kept as empty-compat stubs so existing imports don't break
// before we clean them up. Remove after full integration.
export interface CompletedChallenge {
  challengeId: string;
  exercise: string;
  reps: number;
  verified: boolean;
}

export interface PendingChallenge {
  challengeId: string;
  exercise: string;
  reps: number;
  instruction: string;
  verified: boolean;
  repCount: number;
}

export type SessionMode = 'live' | 'agent';

/**
 * Frontend session state — MVP version.
 * SessionContext holds these fields and distributes them to all screens.
 */
export interface SessionState {
  // API-provided session ID (null before /api/story/start completes)
  sessionId: string | null;

  // Story progress
  childName: string;
  segment: import('./api').Segment | null;
  challenge: import('./api').Challenge | null;
  segmentIndex: number;
  badges: import('./api').Badge[];

  // UI flags
  sessionStarted: boolean;
  storyComplete: boolean;
}

export const DEFAULT_SESSION_STATE: SessionState = {
  sessionId: null,
  childName: '',
  segment: null,
  challenge: null,
  segmentIndex: 0,
  badges: [],
  sessionStarted: false,
  storyComplete: false,
};
