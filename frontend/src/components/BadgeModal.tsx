import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export interface BadgeModalProps {
  isOpen: boolean;
  onClose?: () => void;
  hasMoreScenes?: boolean;
  badge?: { emoji: string; label: string; description?: string };
}

function fireCelebrationConfetti() {
  confetti({
    particleCount: 130,
    spread: 75,
    origin: { x: 0.5, y: 0.6 },
    colors: ['#58CC02', '#FF9600', '#CE82FF', '#FFD700', '#4FC3F7'],
    ticks: 220,
    gravity: 0.85,
    scalar: 1.15,
  });
  setTimeout(() => {
    confetti({ particleCount: 45, angle: 60,  spread: 60, origin: { x: 0, y: 0.65 } });
    confetti({ particleCount: 45, angle: 120, spread: 60, origin: { x: 1, y: 0.65 } });
  }, 220);
}

export const BadgeModal: React.FC<BadgeModalProps> = ({
  isOpen,
  onClose,
  hasMoreScenes = true,
  badge = { emoji: '🏆', label: 'Dũng Cảm Bắt Đầu', description: 'Bạn đã xuất sắc kích hoạt phép thuật! Huy hiệu này minh chứng cho sự can đảm của một Nhà Thám Hiểm đích thực!' },
}) => {
  const navigate = useNavigate();
  const [hasFired, setHasFired] = useState(false);

  useEffect(() => {
    if (isOpen && !hasFired) {
      const t = setTimeout(() => {
        fireCelebrationConfetti();
        setHasFired(true);
      }, 180);
      return () => clearTimeout(t);
    }
    if (!isOpen) setHasFired(false);
  }, [isOpen, hasFired]);

  const handleContinue = () => {
    onClose?.();
    if (hasMoreScenes) navigate('/story');
    else navigate('/complete');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="badge-overlay"
          className="fixed inset-0 z-[300] flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleContinue}
          style={{ background: 'rgba(14,14,12,0.65)', backdropFilter: 'blur(10px)' }}
        >
          {/* Warm background flash */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,200,0,0.35), transparent 70%)' }}
          />

          <motion.div
            key="badge-card"
            className="relative w-full max-w-[400px] bg-white rounded-[28px] overflow-hidden text-center"
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.75, opacity: 0, y: -16 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            style={{ boxShadow: '0 24px 64px -12px rgba(73,25,125,0.3)' }}
          >
            {/* Gradient top strip */}
            <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg, #58CC02, #FF9600, #CE82FF)' }} />

            <div className="px-8 pt-8 pb-8">
              {/* Badge emoji with spring entrance */}
              <motion.div
                className="relative mx-auto mb-6 w-28 h-28"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.12 }}
              >
                {/* Glow ring */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{ opacity: [0.35, 0.75, 0.35], scale: [1, 1.28, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ background: 'radial-gradient(circle, rgba(255,180,0,0.45), transparent 70%)' }}
                />
                <div
                  className="w-full h-full rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #fff9e6, #fff3cc)', boxShadow: '0 6px 24px rgba(255,150,0,0.28)' }}
                >
                  <motion.span
                    className="text-6xl select-none"
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  >
                    {badge.emoji}
                  </motion.span>
                </div>

                {/* Corner sparkles */}
                <motion.span className="absolute -top-2 -right-3 text-2xl select-none"
                  animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                >✨</motion.span>
                <motion.span className="absolute bottom-0 -left-4 text-xl select-none"
                  animate={{ scale: [0.7, 1.2, 0.7], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.7, repeat: Infinity, delay: 0.4 }}
                >⭐</motion.span>
              </motion.div>

              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.4 }}
                className="font-display text-2xl font-bold uppercase tracking-wide mb-1"
                style={{ color: '#383835' }}
              >
                {badge.label}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.52, duration: 0.38 }}
                className="font-body text-sm leading-relaxed mb-8 px-2"
                style={{ color: '#656461' }}
              >
                {badge.description ?? 'Bạn thật dũng cảm! Tiếp tục hành trình nhé!'}
              </motion.p>

              {/* CTA button */}
              <motion.button
                onClick={handleContinue}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.68, duration: 0.35 }}
                className="w-full py-4 rounded-full font-display font-bold text-lg flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #f8a826, #FF9600)',
                  boxShadow: '0 8px 24px rgba(248,168,38,0.38)',
                  color: '#4e3000',
                }}
              >
                Tiếp tục hành trình
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
