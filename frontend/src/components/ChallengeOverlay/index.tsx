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
import { motion, AnimatePresence } from 'framer-motion';

/** Map exercise names to emoji + Vietnamese label */
const EXERCISE_DISPLAY: Record<string, { emoji: string; label: string }> = {
  jump:       { emoji: '🦘', label: 'Nhảy' },
  raise_hand: { emoji: '🙋', label: 'Giơ tay' },
  spin:       { emoji: '🌀', label: 'Xoay người' },
  magic_sign: { emoji: '✋', label: 'Dấu hiệu phép thuật' },
};

function ChallengeOverlay() {
  const { state } = useSession();
  const { pendingChallenge } = state;

  const isVisible = Boolean(pendingChallenge && !pendingChallenge.verified);
  const display = EXERCISE_DISPLAY[pendingChallenge?.exercise ?? ''] ?? {
    emoji: '💪',
    label: pendingChallenge?.exercise ?? '',
  };

  const progress =
    pendingChallenge && pendingChallenge.reps > 0
      ? (pendingChallenge.repCount / pendingChallenge.reps) * 100
      : 0;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="challenge-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-magic-900/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Card slides up + scales */}
          <motion.div
            className="bg-white/95 rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 text-center"
            initial={{ y: 100, opacity: 0, scale: 0.85 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.05 }}
            style={{ boxShadow: '0 24px 64px -12px rgba(73,25,125,0.25)' }}
          >
            {/* Exercise Icon — bounces in loop */}
            <motion.div
              className="text-7xl mb-4 inline-block select-none"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              {display.emoji}
            </motion.div>

            {/* Title */}
            <motion.h2
              className="font-display text-2xl font-bold text-magic-700 mb-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Thử thách vận động!
            </motion.h2>

            {/* Instruction */}
            <motion.p
              className="font-body text-gray-600 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.32 }}
            >
              {pendingChallenge!.instruction}
            </motion.p>

            {/* Exercise details */}
            <motion.div
              className="bg-magic-50 rounded-xl p-4 mb-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.42 }}
              style={{ boxShadow: '0 0 0 2px rgba(124,58,237,0.12)' }}
            >
              <p className="font-display text-lg font-semibold text-magic-600">
                {display.label} × {pendingChallenge!.reps}
              </p>
            </motion.div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm font-body text-magic-500 mb-1">
                <span>Tiến độ</span>
                <span>
                  {pendingChallenge!.repCount} / {pendingChallenge!.reps}
                </span>
              </div>
              <div className="w-full bg-magic-100 rounded-full h-4 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-magic-500 to-fairy-500 h-full rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Retry button — Rule 4: Graceful Degradation */}
            <motion.button
              className="mt-4 px-6 py-2 text-sm font-body text-magic-400 hover:text-magic-600 transition-colors rounded-xl"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                // TODO: Restart vision verification for this challenge
                console.log('Retry challenge:', pendingChallenge!.challengeId);
              }}
            >
              🔄 Thử lại
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ChallengeOverlay;
