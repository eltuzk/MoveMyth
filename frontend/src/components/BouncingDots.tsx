/**
 * BouncingDots — Animated loading indicator for children's app.
 *
 * Shows 3 staggered bouncing dots with an optional rotating message.
 * Replaces boring spinners when API calls are in-flight.
 */

import { motion } from 'framer-motion';
import type { Easing } from 'framer-motion';
import { useEffect, useState } from 'react';

interface BouncingDotsProps {
  /** Static message OR array of messages to cycle through */
  message?: string | string[];
  /** Cycle interval in ms when message is an array (default: 2000) */
  cycleMs?: number;
  /** Dot color — defaults to green (#58CC02) */
  color?: 'green' | 'orange' | 'purple';
}

const COLOR_MAP: Record<string, string> = {
  green: '#58CC02',
  orange: '#FF9600',
  purple: '#CE82FF',
};

const EASE: Easing = 'easeInOut';

const DOT_ANIM = {
  animate: { y: [0, -12, 0] },
  transition: (i: number) => ({
    duration: 0.6,
    repeat: Infinity,
    delay: i * 0.15,
    ease: EASE,
  }),
};

export function BouncingDots({
  message = 'Đang tải...',
  cycleMs = 2000,
  color = 'green',
}: BouncingDotsProps) {
  const messages = Array.isArray(message) ? message : [message];
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    if (messages.length <= 1) return;
    const id = setInterval(() => {
      setMsgIdx((i) => (i + 1) % messages.length);
    }, cycleMs);
    return () => clearInterval(id);
  }, [messages.length, cycleMs]);

  const dotColor = COLOR_MAP[color] ?? COLOR_MAP.green;

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Dots */}
      <div className="flex gap-3 items-end">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{ backgroundColor: dotColor, width: 14, height: 14, borderRadius: '50%' }}
            animate={DOT_ANIM.animate}
            transition={DOT_ANIM.transition(i)}
          />
        ))}
      </div>

      {/* Message with fade transition */}
      <motion.p
        key={msgIdx}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.3 }}
        className="text-sm font-body font-semibold"
        style={{ color: dotColor }}
      >
        {messages[msgIdx]}
      </motion.p>
    </div>
  );
}

export default BouncingDots;
