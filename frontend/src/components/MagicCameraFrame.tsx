/**
 * MagicCameraFrame — Animated "magic mirror" border wrapper.
 *
 * Wraps any camera feed to give it a magical feel:
 * - Rotating gradient border (CSS pseudo-element via inline style trick)
 * - Corner sparkles
 * - Variant states: idle | verifying | pass | fail
 */

import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { ReactNode } from 'react';

type FrameVariant = 'idle' | 'verifying' | 'pass' | 'fail';

interface MagicCameraFrameProps {
  children: ReactNode;
  variant?: FrameVariant;
  className?: string;
}

/** Border glow color per variant */
const VARIANT_STYLES: Record<FrameVariant, { shadow: string; borderColor: string }> = {
  idle:      { shadow: '0 0 24px rgba(206, 130, 255, 0.45)', borderColor: 'rgba(206,130,255,0.7)' },
  verifying: { shadow: '0 0 32px rgba(255, 150, 0, 0.65)',   borderColor: 'rgba(255,150,0,0.9)' },
  pass:      { shadow: '0 0 32px rgba(88, 204, 2, 0.7)',     borderColor: 'rgba(88,204,2,0.95)' },
  fail:      { shadow: '0 0 28px rgba(255, 150, 0, 0.55)',   borderColor: 'rgba(255,150,0,0.7)' },
};

/** Sparkle corner positions */
const CORNERS = [
  { top: '-10px', left: '-10px' },
  { top: '-10px', right: '-10px' },
  { bottom: '-10px', left: '-10px' },
  { bottom: '-10px', right: '-10px' },
];

/** Shake keyframes for fail state */
const shakeVariants: Variants = {
  idle: { x: 0 },
  fail: {
    x: [0, -8, 8, -6, 6, -4, 4, 0],
    transition: { duration: 0.5, ease: 'easeInOut' as const },
  },
};

/** Pass flash for pass state */
const flashVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit:   { opacity: 0, transition: { duration: 0.4 } },
};

export function MagicCameraFrame({
  children,
  variant = 'idle',
  className = '',
}: MagicCameraFrameProps) {
  const { shadow, borderColor } = VARIANT_STYLES[variant];

  return (
    <motion.div
      animate={variant === 'fail' ? 'fail' : 'idle'}
      variants={shakeVariants}
      className={['relative rounded-2xl overflow-visible', className].join(' ')}
      style={{ padding: 4 }}
    >
      {/* Animated rotating border layer */}
      <div
        className="absolute inset-0 rounded-2xl camera-frame-border"
        style={{
          boxShadow: shadow,
          border: `3px solid ${borderColor}`,
          transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
          borderRadius: '1rem',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />

      {/* Corner sparkles */}
      {CORNERS.map((pos, i) => (
        <motion.span
          key={i}
          className="absolute text-lg select-none pointer-events-none z-20"
          style={{ ...pos }}
          animate={{
            opacity: variant === 'pass' ? [0.5, 1, 0.5] : [0.3, 0.7, 0.3],
            scale:   variant === 'pass' ? [1, 1.4, 1]   : [0.9, 1.1, 0.9],
          }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
        >
          {variant === 'pass' ? '✅' : variant === 'fail' ? '🌟' : '✨'}
        </motion.span>
      ))}

      {/* Verifying: pulsing ring overlay */}
      {variant === 'verifying' && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none z-10"
          style={{ border: '3px solid rgba(255,150,0,0.5)' }}
          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.01, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}

      {/* Pass: green flash overlay */}
      <AnimatePresence>
        {variant === 'pass' && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none z-10"
            style={{ background: 'rgba(88, 204, 2, 0.15)' }}
            variants={flashVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative rounded-2xl overflow-hidden z-0">
        {children}
      </div>
    </motion.div>
  );
}

export default MagicCameraFrame;
