/**
 * useCamera — Camera stream access hook via getUserMedia.
 *
 * Provides camera stream, canvas capture for sending frames,
 * and cleanup on unmount.
 */

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseCameraOptions {
  /** Desired video width */
  width?: number;
  /** Desired video height */
  height?: number;
  /** Whether to start camera automatically */
  autoStart?: boolean;
}

interface UseCameraReturn {
  /** Ref to attach to a <video> element */
  videoRef: React.RefObject<HTMLVideoElement | null>;
  /** Whether the camera stream is active */
  isActive: boolean;
  /** Start the camera */
  startCamera: () => Promise<void>;
  /** Stop the camera */
  stopCamera: () => void;
  /** Capture current frame as base64 JPEG */
  captureFrame: () => string | null;
  /** Any error that occurred */
  error: string | null;
}

export function useCamera({
  width = 320,
  height = 240,
  autoStart = false,
}: UseCameraOptions = {}): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: width }, height: { ideal: height } },
        audio: false,
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsActive(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Camera access denied';
      setError(message);
      console.error('[useCamera] Error:', message);
    }
  }, [width, height]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  }, []);

  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !isActive) return null;

    // Create canvas lazily
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }

    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(videoRef.current, 0, 0, width, height);

    // Return base64 JPEG (without the data:image/jpeg;base64, prefix)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
    return dataUrl.split(',')[1] || null;
  }, [isActive, width, height]);

  // Auto-start if requested
  useEffect(() => {
    if (autoStart) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [autoStart, startCamera, stopCamera]);

  return { videoRef, isActive, startCamera, stopCamera, captureFrame, error };
}
