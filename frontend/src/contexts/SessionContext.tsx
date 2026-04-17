/**
 * SessionContext — React Context for MVP session state management.
 *
 * Holds all state that needs to flow across screens:
 *   sessionId, segment, challenge, childName, segmentIndex, badges
 *
 * Actions are kept minimal — each screen updates what it owns.
 */

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from 'react';
import {
  type SessionState,
  DEFAULT_SESSION_STATE,
} from '../types/session';
import type { Segment, Challenge, Badge } from '../types/api';

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

type SessionAction =
  | {
      type: 'SET_SESSION';
      payload: { sessionId: string; segment: Segment; challenge: Challenge };
    }
  | { type: 'SET_CHILD_NAME'; payload: string }
  | {
      type: 'SET_SEGMENT';
      payload: { segment: Segment; challenge: Challenge; segmentIndex: number };
    }
  | { type: 'ADD_BADGE'; payload: Badge }
  | { type: 'SET_STORY_COMPLETE' }
  | { type: 'RESET_SESSION' };

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'SET_SESSION':
      return {
        ...state,
        sessionId: action.payload.sessionId,
        segment: action.payload.segment,
        challenge: action.payload.challenge,
        segmentIndex: action.payload.segment.segment_index,
        sessionStarted: true,
      };

    case 'SET_CHILD_NAME':
      return { ...state, childName: action.payload };

    case 'SET_SEGMENT':
      return {
        ...state,
        segment: action.payload.segment,
        challenge: action.payload.challenge,
        segmentIndex: action.payload.segmentIndex,
      };

    case 'ADD_BADGE':
      return { ...state, badges: [...state.badges, action.payload] };

    case 'SET_STORY_COMPLETE':
      return { ...state, storyComplete: true };

    case 'RESET_SESSION':
      return DEFAULT_SESSION_STATE;

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface SessionContextValue {
  state: SessionState;
  dispatch: React.Dispatch<SessionAction>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sessionReducer, DEFAULT_SESSION_STATE);

  return (
    <SessionContext.Provider value={{ state, dispatch }}>
      {children}
    </SessionContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
