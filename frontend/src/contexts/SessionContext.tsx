/**
 * SessionContext — React Context for session state management.
 *
 * Uses Context API (sufficient for MVP per user decision).
 * Provides session state and actions to all child components.
 */

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from 'react';
import {
  type SessionState,
  type Badge,
  type PendingChallenge,
  DEFAULT_SESSION_STATE,
} from '../types/session';

// --- Actions ---
type SessionAction =
  | { type: 'START_SESSION'; payload: { sessionId: string; childName: string } }
  | { type: 'SET_THEME'; payload: string }
  | { type: 'SET_CHALLENGE'; payload: PendingChallenge }
  | { type: 'UPDATE_PROGRESS'; payload: { repCount: number } }
  | { type: 'COMPLETE_CHALLENGE' }
  | { type: 'AWARD_BADGE'; payload: Badge }
  | { type: 'UPDATE_SCENE'; payload: string }
  | { type: 'RESET_SESSION' };

// --- Reducer ---
function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'START_SESSION':
      return {
        ...state,
        sessionStarted: true,
        childName: action.payload.childName,
      };

    case 'SET_THEME':
      return { ...state, storyTheme: action.payload };

    case 'SET_CHALLENGE':
      return { ...state, pendingChallenge: action.payload };

    case 'UPDATE_PROGRESS':
      if (!state.pendingChallenge) return state;
      return {
        ...state,
        pendingChallenge: {
          ...state.pendingChallenge,
          repCount: action.payload.repCount,
        },
      };

    case 'COMPLETE_CHALLENGE':
      if (!state.pendingChallenge) return state;
      return {
        ...state,
        pendingChallenge: { ...state.pendingChallenge, verified: true },
        completedChallenges: [
          ...state.completedChallenges,
          {
            challengeId: state.pendingChallenge.challengeId,
            exercise: state.pendingChallenge.exercise,
            reps: state.pendingChallenge.reps,
            verified: true,
          },
        ],
      };

    case 'AWARD_BADGE':
      return {
        ...state,
        badges: [...state.badges, action.payload],
        pendingChallenge: null, // Clear pending challenge after badge award
      };

    case 'UPDATE_SCENE':
      return {
        ...state,
        currentScene: state.currentScene + 1,
        scenes: [...state.scenes, action.payload],
      };

    case 'RESET_SESSION':
      return DEFAULT_SESSION_STATE;

    default:
      return state;
  }
}

// --- Context ---
interface SessionContextValue {
  state: SessionState;
  dispatch: React.Dispatch<SessionAction>;
  sessionId: string | null;
}

const SessionContext = createContext<SessionContextValue | null>(null);

// --- Provider ---
interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [state, dispatch] = useReducer(sessionReducer, DEFAULT_SESSION_STATE);

  // TODO: Set sessionId from API call to /api/session/start
  const sessionId: string | null = null;

  return (
    <SessionContext.Provider value={{ state, dispatch, sessionId }}>
      {children}
    </SessionContext.Provider>
  );
}

// --- Hook ---
export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
