/**
 * useCamera — Camera stream hook with single-init pattern.
 *
 * Camera starts automatically on mount via a single useEffect with [] deps.
 * This prevents the "play() interrupted by a new load request" AbortError
 * that occurs when the effect runs twice due to state-triggered re-renders.
 *
 * captureFrameDataUrl() returns full "data:image/jpeg;base64,..." string.
 * captureFrame()        returns raw base64 string (no prefix).
 */

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseCameraOptions {
  width?: number;
  height?: number;
  facingMode?: 'user' | 'environment';
}

interface UseCameraReturn {
  /** Attach to <video ref={videoRef}> */
  videoRef: React.RefObject<HTMLVideoElement | null>;
  /** True once the stream is playing */
  isActive: boolean;
  /** Capture current frame as "data:image/jpeg;base64,..." */
  captureFrameDataUrl: () => string | null;
  /** Capture current frame as raw base64 (no data-URL prefix) */
  captureFrame: () => string | null;
  /** Any camera error message */
  error: string | null;
}

export function useCamera({
  width = 640,
  height = 480,
  facingMode = 'user',
}: UseCameraOptions = {}): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -------------------------------------------------------------------------
  // Single-init effect — empty deps means this runs EXACTLY ONCE on mount.
  // Do NOT add any state dependencies here — that would re-run initCamera()
  // and cause "play() interrupted by a new load request" AbortError.
  // -------------------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: width },
            height: { ideal: height },
            facingMode: { ideal: facingMode },
          },
          audio: false,
        });

        if (cancelled) {
          // Component unmounted before stream was ready — clean up immediately
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        const videoEl = videoRef.current;

        if (videoEl) {
          videoEl.srcObject = stream;
          try {
            await videoEl.play();
            if (!cancelled) setIsActive(true);
          } catch (e: unknown) {
            // AbortError fires when a re-render calls load() before play() resolves.
            // It is harmless — the stream is still playing after the interruption.
            if (e instanceof Error && e.name !== 'AbortError') {
              console.error('[useCamera] play() error:', e.message);
              if (!cancelled) setError(e.message);
            }
            // Even on AbortError the video usually recovers — mark active anyway
            if (!cancelled) setIsActive(true);
          }
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : 'Camera access denied';
          console.error('[useCamera] getUserMedia error:', message);
          setError(message);
        }
      }
    }

    initCamera();

    // Cleanup: stop all tracks when component unmounts
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      const videoEl = videoRef.current;
      if (videoEl) {
        videoEl.pause();
        videoEl.srcObject = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← MUST remain empty — see comment above

  // -------------------------------------------------------------------------
  // Frame capture helpers
  // -------------------------------------------------------------------------

  const captureFrameDataUrl = useCallback((): string | null => {
    const videoEl = videoRef.current;
    if (!videoEl || !streamRef.current) return null;

    const canvas = document.createElement('canvas');
    canvas.width = videoEl.videoWidth || width;
    canvas.height = videoEl.videoHeight || height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(videoEl, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.8);
  }, [width, height]);

  const captureFrame = useCallback((): string | null => {
    const dataUrl = captureFrameDataUrl();
    return dataUrl ? (dataUrl.split(',')[1] ?? null) : null;
  }, [captureFrameDataUrl]);

  return { videoRef, isActive, captureFrameDataUrl, captureFrame, error };
}
