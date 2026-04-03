/**
 * ChallengeOverlay — Exercise challenge overlay UI.
 *
 * Shows as a full-screen overlay when there's a pending movement challenge.
 * Displays exercise instructions, progress bar, and retry button.
 *
 * Rule 4 (Graceful Degradation):
 * - If Vision Verifier fails after 30 seconds → show "Thử lại" button
 */

import { useSession } from '../../contexts/SessionContext';

/** Map exercise names to emoji + Vietnamese label */
const EXERCISE_DISPLAY: Record<string, { emoji: string; label: string }> = {
  jump: { emoji: '🦘', label: 'Nhảy' },
  raise_hand: { emoji: '🙋', label: 'Giơ tay' },
  spin: { emoji: '🌀', label: 'Xoay người' },
  magic_sign: { emoji: '✋', label: 'Dấu hiệu phép thuật' },
};

function ChallengeOverlay() {
  const { state } = useSession();
  const { pendingChallenge } = state;

  if (!pendingChallenge || pendingChallenge.verified) return null;

  const display = EXERCISE_DISPLAY[pendingChallenge.exercise] || {
    emoji: '💪',
    label: pendingChallenge.exercise,
  };

  const progress = pendingChallenge.reps > 0
    ? (pendingChallenge.repCount / pendingChallenge.reps) * 100
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-magic-900/80 backdrop-blur-md">
      <div className="bg-white/95 rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
        {/* Exercise Icon */}
        <div className="text-7xl mb-4 animate-bounce-slow">
          {display.emoji}
        </div>

        {/* Title */}
        <h2 className="font-display text-2xl font-bold text-magic-700 mb-2">
          Thử thách vận động!
        </h2>

        {/* Instruction */}
        <p className="font-body text-gray-600 mb-6">
          {pendingChallenge.instruction}
        </p>

        {/* Exercise details */}
        <div className="bg-magic-50 rounded-xl p-4 mb-6">
          <p className="font-display text-lg font-semibold text-magic-600">
            {display.label} × {pendingChallenge.reps}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm font-body text-magic-500 mb-1">
            <span>Tiến độ</span>
            <span>
              {pendingChallenge.repCount} / {pendingChallenge.reps}
            </span>
          </div>
          <div className="w-full bg-magic-100 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-magic-500 to-fairy-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Retry button — Rule 4: Graceful Degradation */}
        <button
          className="mt-4 px-6 py-2 text-sm font-body text-magic-400 hover:text-magic-600 transition-colors"
          onClick={() => {
            // TODO: Restart vision verification for this challenge
            console.log('Retry challenge:', pendingChallenge.challengeId);
          }}
        >
          🔄 Thử lại
        </button>
      </div>
    </div>
  );
}

export default ChallengeOverlay;
