/**
 * useAudio — React hook for TTS audio playback.
 *
 * Usage:
 *   const { playBlob, isPlaying, error } = useAudio();
 *   await playBlob(someTtsBlob);   // resolves when audio ends
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { playAudioBlob } from '../utils/audio';

interface UseAudioReturn {
  /** Play an audio Blob. Returns a promise that resolves when playback ends. */
  playBlob: (blob: Blob) => Promise<void>;
  /** True while audio is playing. */
  isPlaying: boolean;
  /** Last playback error, if any. */
  error: string | null;
  /** Clear the last error. */
  clearError: () => void;
}

export function useAudio(): UseAudioReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track whether the hook is still mounted to avoid state updates after unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const playBlob = useCallback(async (blob: Blob): Promise<void> => {
    if (!mountedRef.current) return;
    setError(null);
    setIsPlaying(true);
    try {
      await playAudioBlob(blob);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Audio playback failed';
      if (mountedRef.current) {
        setError(message);
      }
      throw err; // re-throw so callers can handle if needed
    } finally {
      if (mountedRef.current) {
        setIsPlaying(false);
      }
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { playBlob, isPlaying, error, clearError };
}
