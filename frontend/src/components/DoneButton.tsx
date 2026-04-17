/**
 * DoneButton — Primary action button for the MoveMyth child interface.
 *
 * Large, accessible, magnetically-pulsing button. Shows a loading
 * state (bouncing dots) while API calls are in-flight.
 */

import { motion } from 'framer-motion';
import { BouncingDots } from './BouncingDots';

interface DoneButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  label?: string;
  loadingMessage?: string | string[];
  /** Size variant — default is 'lg' */
  size?: 'md' | 'lg';
  className?: string;
}

export function DoneButton({
  onClick,
  isLoading = false,
  disabled = false,
  label = 'Xong rồi! ✨',
  loadingMessage = ['Lio đang xem...', 'Phép thuật đang hoạt động...', 'Chờ Lio chút nhé!'],
  size = 'lg',
  className = '',
}: DoneButtonProps) {
  const isDisabled = isLoading || disabled;
  const height = size === 'lg' ? 'min-h-[64px]' : 'min-h-[52px]';
  const textSize = size === 'lg' ? 'text-xl' : 'text-lg';

  return (
    <motion.button
      onClick={!isDisabled ? onClick : undefined}
      // Idle pulse to attract attention
      animate={isDisabled ? {} : { scale: [1, 1.03, 1] }}
      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      // Hover / tap micro-interactions
      whileHover={isDisabled ? {} : { scale: 1.06 }}
      whileTap={isDisabled ? {} : { scale: 0.95 }}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className={[
        'relative w-full rounded-full font-display font-bold text-white shadow-xl',
        'transition-opacity duration-200 select-none',
        height,
        textSize,
        isDisabled
          ? 'opacity-70 cursor-not-allowed'
          : 'cursor-pointer',
        className,
      ].join(' ')}
      style={{
        background: isDisabled
          ? 'linear-gradient(135deg, #86c96a, #78b861)'
          : 'linear-gradient(135deg, #58CC02, #4CAF50)',
        boxShadow: isDisabled
          ? 'none'
          : '0 8px 24px rgba(88, 204, 2, 0.35)',
      }}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-3 px-6 py-2">
          <BouncingDots message={loadingMessage} color="green" />
        </div>
      ) : (
        <span className="px-8">{label}</span>
      )}
    </motion.button>
  );
}

export default DoneButton;
