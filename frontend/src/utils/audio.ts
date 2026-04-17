/**
 * audio.ts — Audio playback utilities for MoveMyth.
 *
 * playAudioBlob: plays a Blob (e.g. TTS response) and resolves when done.
 * unlockAudio:   plays a silent 0.1s audio to unlock the AudioContext on
 *                mobile browsers (must be called inside a user gesture handler).
 */

// ---------------------------------------------------------------------------
// Play an audio Blob returned by the TTS endpoint
// ---------------------------------------------------------------------------

export function playAudioBlob(blob: Blob): Promise<void> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);

    const cleanup = () => URL.revokeObjectURL(url);

    audio.onended = () => {
      cleanup();
      resolve();
    };

    audio.onerror = (e) => {
      cleanup();
      reject(new Error(`Audio playback error: ${JSON.stringify(e)}`));
    };

    audio.play().catch((err) => {
      cleanup();
      reject(err);
    });
  });
}

// ---------------------------------------------------------------------------
// Unlock AudioContext on mobile (call from a button click handler)
// ---------------------------------------------------------------------------

/**
 * Plays a very short, silent audio sample to satisfy the browser's
 * "user gesture required to play audio" policy on iOS/Android.
 *
 * Call this once from the first button the child taps (e.g. the
 * magic-sign verify button or the start button).
 */
export async function unlockAudio(): Promise<void> {
  try {
    // Minimal silent WAV: 44-byte RIFF header + 0 data bytes
    const silentWav =
      'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAAABkYXRhAAAAAA==';
    const audio = new Audio(silentWav);
    audio.volume = 0;
    await audio.play();
  } catch {
    // Silently ignore — unlock fails in some envs but is non-critical
  }
}
