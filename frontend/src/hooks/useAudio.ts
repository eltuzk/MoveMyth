import { useState, useRef, useEffect, useCallback } from 'react';

interface UseAudioReturn {
  isPlaying: boolean;
  playBlob: (blob: Blob) => Promise<void>;
  stopAudio: () => void;
}

/**
 * Custom hook to handle audio playback of Blobs (TTS responses).
 * Manages object URL cleanup and provides a Promise-based play interface.
 */
export function useAudio(): UseAudioReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);
  
  // Storage for promise controls
  const resolveRef = useRef<(() => void) | null>(null);
  const rejectRef = useRef<((reason?: unknown) => void) | null>(null);

  // Initialize audio element once and set up listeners
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleEnded = () => {
      setIsPlaying(false);
      if (resolveRef.current) {
        resolveRef.current();
        resolveRef.current = null;
        rejectRef.current = null;
      }
    };

    // Use underscore to indicate unused parameter
    const handleError = (_: Event) => {
      setIsPlaying(false);
      if (rejectRef.current) {
        rejectRef.current(new Error('Audio playback error'));
        resolveRef.current = null;
        rejectRef.current = null;
      }
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Cleanup on unmount
    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
      }
    };
  }, []);

  /**
   * Stops any currently playing audio and resets state.
   */
  const stopAudio = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      
      // Cleanup any pending promise
      if (rejectRef.current) {
        rejectRef.current(new Error('Playback stopped'));
        resolveRef.current = null;
        rejectRef.current = null;
      }
    }
  }, []);

  /**
   * Plays a blob as audio. Resolves when playback finishes normally.
   * Rejects if playback is interrupted or fails.
   */
  const playBlob = useCallback(async (blob: Blob): Promise<void> => {
    // 1. Stop any currently playing audio
    stopAudio();

    // 2. Revoke previous object URL to avoid memory leaks
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }

    const audio = audioRef.current;
    if (!audio) {
      throw new Error('Audio element not initialized');
    }

    // 3. Create new object URL from blob
    const url = URL.createObjectURL(blob);
    urlRef.current = url;
    audio.src = url;

    // 4. Return a Promise that resolves when audio ends
    return new Promise((resolve, reject) => {
      resolveRef.current = resolve;
      rejectRef.current = reject;

      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          setIsPlaying(false);
          reject(err);
          resolveRef.current = null;
          rejectRef.current = null;
        });
    });
  }, [stopAudio]);

  return {
    isPlaying,
    playBlob,
    stopAudio,
  };
}
