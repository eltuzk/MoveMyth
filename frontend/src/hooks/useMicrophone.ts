/**
 * useMicrophone — React hook for microphone recording via MediaRecorder.
 *
 * Usage:
 *   const { startRecording, stopRecording, audioBlob, isRecording, error } = useMicrophone();
 *
 *   await startRecording();   // start mic
 *   await stopRecording();    // stop mic → audioBlob is populated
 */

import { useState, useRef, useCallback, useEffect } from 'react';

interface UseMicrophoneReturn {
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  audioBlob: Blob | null;
  isRecording: boolean;
  error: string | null;
  clearError: () => void;
  clearBlob: () => void;
}

export function useMicrophone(): UseMicrophoneReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      // Stop any in-progress recording on unmount
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const startRecording = useCallback(async (): Promise<void> => {
    setError(null);
    setAudioBlob(null);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;

      // Prefer webm/opus; fall back to whatever the browser supports
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : '';

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start();
      if (mountedRef.current) setIsRecording(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Microphone access denied';
      if (mountedRef.current) setError(message);
      throw err;
    }
  }, []);

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        resolve(null);
        return;
      }

      recorder.onstop = () => {
        // Stop all mic tracks
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;

        const mimeType = recorder.mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: mimeType });

        if (mountedRef.current) {
          setAudioBlob(blob);
          setIsRecording(false);
        }
        resolve(blob);
      };

      recorder.stop();
    });
  }, []);

  const clearError = useCallback(() => setError(null), []);
  const clearBlob = useCallback(() => setAudioBlob(null), []);

  return {
    startRecording,
    stopRecording,
    audioBlob,
    isRecording,
    error,
    clearError,
    clearBlob,
  };
}
