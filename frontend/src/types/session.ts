/**
 * Session types — matches backend Session State Schema from AGENTS.md
 */

export interface Badge {
  name: string;
  reason: string;
  challengeId?: string;
  awardedAt?: string;
}

export interface CompletedChallenge {
  challengeId: string;
  exercise: string;
  reps: number;
  verified: boolean;
  badgeAwarded?: string;
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

export interface SessionState {
  // Runtime (ADK state)
  childName: string;
  sessionStarted: boolean;
  storyTheme: string;
  mode: SessionMode;
  currentScene: number;
  badges: Badge[];
  scenes: string[];
  completedChallenges: CompletedChallenge[];
  pendingChallenge: PendingChallenge | null;
  narrativeDirection: string;

  // Long-term memory (loaded from Firestore)
  isReturningUser: boolean;
  previousBadges: Badge[];
  favoriteTheme: string | null;
  totalSessions: number;
}

export const DEFAULT_SESSION_STATE: SessionState = {
  childName: '',
  sessionStarted: false,
  storyTheme: '',
  mode: 'live',
  currentScene: 0,
  badges: [],
  scenes: [],
  completedChallenges: [],
  pendingChallenge: null,
  narrativeDirection: '',
  isReturningUser: false,
  previousBadges: [],
  favoriteTheme: null,
  totalSessions: 0,
};
