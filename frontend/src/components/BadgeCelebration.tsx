/**
 * BadgeCelebration — Full-screen WOW badge moment.
 *
 * Fires canvas-confetti burst + spring-animates the badge emoji.
 * Auto-dismisses after 4 seconds or on tap.
 */

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface Badge {
  emoji: string;
  label: string;
  id?: string;
}

interface BadgeCelebrationProps {
  isOpen: boolean;
  badge?: Badge;
  onDismiss: () => void;
  /** Auto-dismiss after this many ms. Default: 4000. Set 0 to disable. */
  autoDismissMs?: number;
}

function fireConfetti() {
  // Primary burst from bottom center
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { x: 0.5, y: 0.65 },
    colors: ['#58CC02', '#FF9600', '#CE82FF', '#FFD700', '#FF6B6B', '#4FC3F7'],
    ticks: 200,
    gravity: 0.9,
    scalar: 1.1,
  });
  // Side bursts
  setTimeout(() => {
    confetti({ particleCount: 40, angle: 60,  spread: 55, origin: { x: 0, y: 0.6 }, colors: ['#FF9600', '#CE82FF'] });
    confetti({ particleCount: 40, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors: ['#58CC02', '#FFD700'] });
  }, 200);
}

export function BadgeCelebration({
  isOpen,
  badge = { emoji: '🏆', label: 'Tuyệt vời!' },
  onDismiss,
  autoDismissMs = 4000,
}: BadgeCelebrationProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Fire confetti after a short delay so modal is visible first
    const confettiTimer = setTimeout(fireConfetti, 150);

    // Auto-dismiss
    if (autoDismissMs > 0) {
      timerRef.current = setTimeout(onDismiss, autoDismissMs);
    }

    return () => {
      clearTimeout(confettiTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen, autoDismissMs, onDismiss]);

  return (
    <AnimatePresence>
      {isOpen && (
        // Backdrop
        <motion.div
          key="badge-backdrop"
          className="fixed inset-0 z-[200] flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onDismiss}
          style={{ background: 'rgba(14, 14, 12, 0.65)', backdropFilter: 'blur(8px)' }}
        >
          {/* Background flash */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,200,0,0.35), transparent 70%)' }}
          />

          {/* Card */}
          <motion.div
            key="badge-card"
            className="relative w-full max-w-sm rounded-3xl overflow-hidden text-center"
            initial={{ scale: 0.4, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22, mass: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            style={{ background: 'white', padding: '40px 32px 36px' }}
          >
            {/* Decorative top gradient strip */}
            <div
              className="absolute top-0 left-0 right-0 h-2 rounded-t-3xl"
              style={{ background: 'linear-gradient(90deg, #58CC02, #FF9600, #CE82FF)' }}
            />

            {/* Badge emoji with spring entrance */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
              className="relative inline-block mb-5"
            >
              {/* Glow ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ opacity: [0.4, 0.85, 0.4], scale: [1, 1.25, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ background: 'radial-gradient(circle, rgba(255,180,0,0.5), transparent 70%)' }}
              />

              <div
                className="relative w-28 h-28 rounded-full flex items-center justify-center mx-auto"
                style={{ background: 'linear-gradient(135deg, #fff9e6, #fff3cc)', boxShadow: '0 8px 32px rgba(255,150,0,0.3)' }}
              >
                <motion.span
                  className="text-6xl select-none"
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {badge.emoji}
                </motion.span>
              </div>

              {/* Orbiting sparkles */}
              {['✨', '⭐', '🌟'].map((star, i) => (
                <motion.span
                  key={i}
                  className="absolute text-xl select-none pointer-events-none"
                  style={{
                    top: i === 0 ? '-8px' : i === 1 ? '50%' : 'auto',
                    bottom: i === 2 ? '-8px' : 'auto',
                    left: i === 1 ? '-16px' : '50%',
                    right: i === 0 ? '-14px' : 'auto',
                    transform: 'translateX(-50%)',
                  }}
                  animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                >
                  {star}
                </motion.span>
              ))}
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="font-display text-3xl font-bold mb-1"
              style={{ color: '#383835' }}
            >
              Tuyệt vời! 🎉
            </motion.h2>

            {/* Badge label */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="font-body text-lg font-semibold mb-5"
              style={{ color: '#7a4eb0' }}
            >
              {badge.label}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.4 }}
              className="font-body text-sm mb-8"
              style={{ color: '#656461' }}
            >
              Bạn đã hoàn thành thử thách! Tiếp tục hành trình nhé!
            </motion.p>

            {/* Continue button */}
            <motion.button
              onClick={onDismiss}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.35 }}
              className="w-full py-4 rounded-full font-display font-bold text-lg text-white"
              style={{
                background: 'linear-gradient(135deg, #FF9600, #f8a826)',
                boxShadow: '0 8px 24px rgba(248,168,38,0.4)',
                color: '#4e3000',
              }}
            >
              Tiếp tục hành trình →
            </motion.button>

            {/* Tap anywhere hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="mt-4 text-xs font-body"
              style={{ color: '#999' }}
            >
              Nhấn bất kỳ đâu để tiếp tục
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BadgeCelebration;
