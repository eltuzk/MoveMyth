import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MagicCameraFrame } from '../components/MagicCameraFrame';

export const MagicSignActivation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Main Content — flex-1 ensures it takes required space */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 min-h-[calc(100vh-136px)]">
        {/* Ritual Interaction Container */}
        <div className="relative w-full max-w-4xl flex items-center justify-center gap-6 mb-8">
          {/* Left: Gesture Reference Card */}
          <motion.div
            className="hidden lg:flex flex-col items-center justify-center p-4 bg-[#fcf9f4] rounded-[1rem] w-[140px] h-[140px] shadow-sm transform -rotate-3 border border-[#bbb9b4]/15"
            whileHover={{ scale: 1.06, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <motion.div
              className="text-5xl mb-2 select-none"
              animate={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
            >
              ✌️
            </motion.div>
            <p className="text-[14px] font-bold text-center leading-tight text-[#7a4eb0]">Dấu hiệu hòa bình!</p>
          </motion.div>

          {/* Center: Magic Camera Feed — wrapped with MagicCameraFrame */}
          <div className="w-full max-w-[500px]">
            <MagicCameraFrame variant="verifying">
              <div className="relative w-full h-[340px] bg-[#0e0e0c]">
                {/* Camera Feed */}
                <img
                  alt="Real-time camera feed of a child making a V-sign"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsGFZbOyX48hJIL2TStW2cdTia5e_8g7BK8aB8yroE5oDq69N5hSl2hVh8LW-hbMtO6THz28CwKNTSOrB8vuYkw55CueWAcMUPhFhV1odsfn862HYgwwqemQVLRHOS4dX5h9sVvfrTjqA9dQY47A4m96LIJ7o5We54VVPrShDYbYMf72EMpyfu1UgLZQBgdcdD8eQQJnnmgBcICU-7uUpH57g3g7D5-eWZm8nfrctojVBfZA7BHI2wcMtIbNW9YQwX8L7eoCpYwe7t"
                />
                {/* Vignette for Portal Feel */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(circle, transparent 40%, rgba(27, 0, 57, 0.4) 100%)' }}
                />
                {/* Status Dot */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2">
                  <motion.span
                    className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_#c12048]"
                    style={{ backgroundColor: '#c12048' }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-white text-xs font-bold tracking-wide">● Đang nhận...</span>
                </div>
                {/* Camera Overlay: Target Guide */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <div className="w-48 h-48 border-2 border-dashed border-white/50 rounded-full"></div>
                </motion.div>
              </div>
            </MagicCameraFrame>
          </div>

          {/* Right: Status Bubble */}
          <motion.div
            className="absolute lg:relative -top-16 lg:top-0 right-0 lg:right-auto bg-white/80 backdrop-blur-lg p-5 rounded-[1rem] shadow-[0px_32px_32px_-4px_rgba(73,25,125,0.08)] border border-[#bbb9b4]/10 w-[240px] z-10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <div className="flex items-start gap-3 mb-3">
              <motion.span
                className="material-symbols-outlined text-[#7a4eb0]"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
              >
                auto_awesome
              </motion.span>
              <div>
                <p className="text-sm font-bold text-[#383835]">Đang nhận...</p>
                <p className="text-xs text-[#656461]">Giữ nguyên tư thế của con nhé!</p>
              </div>
            </div>
            {/* Animated progress bar */}
            <div className="w-full h-2 bg-[#eae8e2] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #007168, #58CC02)' }}
                initial={{ width: '20%' }}
                animate={{ width: ['20%', '85%', '65%', '90%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            {/* Bouncing dots hint */}
            <div className="flex gap-1.5 mt-3 items-center justify-center">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#CE82FF' }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Demo continue button */}
        <motion.button 
          onClick={() => navigate('/welcome')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="bg-[#f8a826] text-[#4e3000] px-10 py-4 rounded-full font-black text-lg shadow-xl shadow-amber-500/30 flex items-center gap-3 relative z-10"
        >
          Tiếp tục
          <span className="material-symbols-outlined">arrow_forward</span>
        </motion.button>
      </main>
    </>
  );
};
