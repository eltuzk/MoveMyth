import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { BadgeModal } from '../components/BadgeModal';
import { LioBar } from '../components/LioBar';

type StatusType = 'idle' | 'loading' | 'success' | 'fail';

const STATUS_MESSAGES = {
  loading: ['Lio đang xem...', 'Phép thuật đang hoạt động...', 'Sắp xong rồi!'],
};

/** Overlay variants for success / fail feedback */
const overlayVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit:    { opacity: 0, transition: { duration: 0.35 } },
};

const pillVariants: Variants = {
  hidden:  { scale: 0.6, y: 20, opacity: 0 },
  visible: { scale: 1, y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 22 } },
  exit:    { scale: 0.8, y: -10, opacity: 0, transition: { duration: 0.25 } },
};

export const ActiveVerificationChallenge: React.FC = () => {
  const [status, setStatus] = useState<StatusType>('idle');
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [jumps, setJumps] = useState(3);
  const totalJumps = 5;

  const handleDone = () => {
    if (status !== 'idle') return;
    setStatus('loading');

    // Simulate a verify API call (1.8s)
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setShowBadgeModal(true);
      }, 1800);
    }, 1800);
  };

  const simulateSuccess = () => {
    if (jumps < totalJumps) {
      setJumps(prev => prev + 1);
    }
    setStatus('success');
    setTimeout(() => {
      setStatus('idle');
      if (jumps + 1 >= totalJumps) {
        setShowBadgeModal(true);
      }
    }, 1500);
  };

  const simulateFail = () => {
    setStatus('fail');
    setTimeout(() => setStatus('idle'), 3000);
  };

  const handleManualDone = () => {
    setShowBadgeModal(true);
  };

  return (
    <>
      <style>{`
        .skeleton-overlay {
          stroke: #70f8e8;
          stroke-width: 4;
          stroke-linecap: round;
          filter: drop-shadow(0 0 8px #70f8e8);
        }
        .glass-panel {
          background: rgba(255, 252, 247, 0.85);
          backdrop-filter: blur(16px);
        }
      `}</style>

<<<<<<< HEAD
      {/* Main Content Area: Split Screen */}
      <main className="flex-1 flex flex-col items-center px-4 pt-4 pb-12 min-h-[calc(100vh-136px)]">
        
        {/* Split Screen Container */}
        <div className="flex flex-col md:flex-row w-full max-w-7xl h-[60vh] gap-4 mb-8">
          {/* LEFT HALF: Camera Feed */}
          <section
            className="flex-1 relative overflow-hidden bg-[#e5e2dc] rounded-[2rem] shadow-2xl"
            style={{
              border: status === 'success'
                ? '4px solid #58CC02'
                : status === 'fail'
                ? '4px solid #FF9600'
                : status === 'loading'
                ? '4px solid #FF9600'
                : '4px solid #70f8e8',
              transition: 'border-color 0.4s ease',
              boxShadow: status === 'success'
                ? '0 0 32px rgba(88,204,2,0.4)'
                : status === 'loading'
                ? '0 0 32px rgba(255,150,0,0.4)'
                : '0 0 20px rgba(112,248,232,0.25)',
            }}
          >
            <img
              className="w-full h-full object-cover grayscale-[0.2]"
              alt="Young child jumping happily"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDG07qQ7e49es7_x5VIXQd8Pe3JGg9op0R2ix2FJBPp-kpcj2UTLNvLe9j3LmmrCloLEkFNnAhI4wSoe1zmKITAaXRKO5MOgc0owLbUved8inFrFurAcVnWiCoWYAjfbz_9Tc6LaeQQK-MBkNDTilpMgD52OlMKkZH436RoQGbJvY3o3p0hQ27jKpLJMTzCW7lrsdHJerd4LrSmeVuN8hDN4rDUach_kprP7bQn_nAS5xzsaEdbsezeFVC2aLDM1gTeYzaxTT4Se4Hy"
            />
            {/* Skeleton Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 600">
              <circle className="skeleton-overlay fill-none" cx="200" cy="180" r="30"></circle>
              <line className="skeleton-overlay" x1="200" x2="200" y1="210" y2="350"></line>
              <line className="skeleton-overlay" x1="200" x2="140" y1="240" y2="300"></line>
              <line className="skeleton-overlay" x1="200" x2="260" y1="240" y2="300"></line>
              <line className="skeleton-overlay" x1="200" x2="160" y1="350" y2="450"></line>
              <line className="skeleton-overlay" x1="200" x2="240" y1="350" y2="450"></line>
            </svg>

            {/* Status Badge */}
            <motion.div
              className="absolute top-8 left-8 bg-[#007168]/90 text-white px-4 py-2 rounded-full flex items-center gap-2 font-bold"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span className="w-2 h-2 bg-white rounded-full"></span>
              ● Phát hiện!
            </motion.div>

            {/* Status overlays — animated with AnimatePresence */}
            <AnimatePresence>
              {status === 'success' && (
                <motion.div
                  key="success-overlay"
                  className="absolute inset-0 flex items-center justify-center z-50"
                  variants={overlayVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={{ background: 'rgba(88,204,2,0.15)', backdropFilter: 'blur(2px)' }}
                >
                  <motion.div
                    className="bg-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3"
                    variants={pillVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
                    <span className="font-black text-green-800 tracking-tight">XUẤT SẮC!</span>
                  </motion.div>
                </motion.div>
              )}

              {status === 'fail' && (
                <motion.div
                  key="fail-overlay"
                  className="absolute inset-0 flex items-center justify-center z-50"
                  variants={overlayVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={{ background: 'rgba(255,150,0,0.12)', backdropFilter: 'blur(2px)' }}
                >
                  <motion.div
                    className="bg-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3"
                    variants={pillVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <span className="text-2xl">🌟</span>
                    <span className="font-black tracking-tight" style={{ color: '#7a4eb0' }}>THỬ LẠI CHÚT NHA!</span>
                  </motion.div>
                </motion.div>
              )}

              {status === 'loading' && (
                <motion.div
                  key="loading-overlay"
                  className="absolute inset-0 flex items-center justify-center z-50"
                  variants={overlayVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={{ background: 'rgba(255,150,0,0.08)', backdropFilter: 'blur(1px)' }}
                >
                  <motion.div
                    className="bg-white/90 px-8 py-5 rounded-2xl shadow-xl flex flex-col items-center gap-3"
                    variants={pillVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="flex gap-2">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: i === 0 ? '#58CC02' : i === 1 ? '#FF9600' : '#CE82FF' }}
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-sm" style={{ color: '#383835' }}>Lio đang xem...</span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
=======
      <style>{`
        .skeleton-overlay {
          stroke: #70f8e8;
          stroke-width: 4;
          stroke-linecap: round;
          filter: drop-shadow(0 0 8px #70f8e8);
        }
        .glass-panel {
          background: rgba(255, 252, 247, 0.85);
          backdrop-filter: blur(16px);
        }
        .status-alert {
          animation: slide-up 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Apple AI Style Rotating Rainbow Border with Soft Blur */
        .ai-glow-container {
          position: relative;
          padding: 8px;
          border-radius: 3.6rem;
          background: transparent;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ai-glow-container::before {
          content: '';
          position: absolute;
          inset: -150px;
          background: conic-gradient(
            from 0deg,
            #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000
          );
          animation: rotate-gradient 4s linear infinite;
          z-index: 0;
          filter: blur(15px);
          opacity: 0.8;
        }

        .ai-glow-inner {
          position: relative;
          z-index: 1;
          height: 100%;
          width: 100%;
          background: #e5e2dc;
          border-radius: 3.1rem;
          overflow: hidden;
          box-shadow: inset 0 0 20px rgba(255,255,255,0.5);
        }

        @keyframes rotate-gradient {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Main Content Area: Split Screen */}
      <main className="flex-1 flex flex-col items-center px-4 pt-4 h-full overflow-hidden">
        
        {/* Split Screen Container - Takes all available space */}
        <div className="flex flex-col md:flex-row w-full max-w-7xl flex-1 gap-6 min-h-0 mb-4">
          {/* LEFT HALF: Camera Feed with AI Glow Border */}
          <div className="flex-1 h-full ai-glow-container">
            <div className="ai-glow-inner">
              <img
                className="w-full h-full object-cover grayscale-[0.2]"
                alt="Young child jumping happily"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDG07qQ7e49es7_x5VIXQd8Pe3JGg9op0R2ix2FJBPp-kpcj2UTLNvLe9j3LmmrCloLEkFNnAhI4wSoe1zmKITAaXRKO5MOgc0owLbUved8inFrFurAcVnWiCoWYAjfbz_9Tc6LaeQQK-MBkNDTilpMgD52OlMKkZH436RoQGbJvY3o3p0hQ27jKpLJMTzCW7lrsdHJerd4LrSmeVuN8hDN4rDUach_kprP7bQn_nAS5xzsaEdbsezeFVC2aLDM1gTeYzaxTT4Se4Hy"
              />
              {/* Skeleton Overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice">
                <circle className="skeleton-overlay fill-none" cx="200" cy="180" r="30"></circle>
                <line className="skeleton-overlay" x1="200" x2="200" y1="210" y2="350"></line>
                <line className="skeleton-overlay" x1="200" x2="140" y1="240" y2="300"></line>
                <line className="skeleton-overlay" x1="200" x2="260" y1="240" y2="300"></line>
                <line className="skeleton-overlay" x1="200" x2="160" y1="350" y2="450"></line>
                <line className="skeleton-overlay" x1="200" x2="240" y1="350" y2="450"></line>
              </svg>
              <div className="absolute top-8 left-8 bg-[#007168]/90 text-white px-6 py-3 rounded-full flex items-center gap-3 font-bold animate-pulse text-lg">
                <span className="w-3 h-3 bg-white rounded-full"></span>
                ● Phát hiện!
              </div>

              {status === 'success' && (
                <div className="absolute inset-0 bg-green-500/20 backdrop-blur-[2px] flex items-center justify-center z-50 status-alert">
                  <div className="bg-white px-12 py-6 rounded-full shadow-2xl flex items-center gap-4 scale-150">
                    <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
                    <span className="font-black text-green-800 tracking-tight text-xl">XUẤT SẮC!</span>
                  </div>
                </div>
              )}
              {status === 'fail' && (
                <div className="absolute inset-0 bg-red-500/20 backdrop-blur-[2px] flex items-center justify-center z-50 status-alert">
                  <div className="bg-white px-12 py-6 rounded-full shadow-2xl flex items-center gap-4 scale-150">
                    <span className="material-symbols-outlined text-red-600 text-4xl">error</span>
                    <span className="font-black text-red-800 tracking-tight text-xl">THỬ LẠI CHÚT NHA!</span>
                  </div>
                </div>
              )}
            </div>
          </div>
>>>>>>> 1a1b055 (feat: standardize character bar UI and add firework celebration)

          {/* RIGHT HALF: Story Preview */}
          <section className="flex-1 relative overflow-hidden bg-[#3f0b73] rounded-[3rem] flex items-center justify-center shadow-2xl h-full">
            <div className="absolute inset-0 opacity-60">
              <img
                className="w-full h-full object-cover"
                alt="Epic cinematic scene"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAu3Oubn12PnJUNbtqrxU5mQa4Yi9j29oAp2bpn4aSuutji2nSKm-V3W7ST6QEqhYZe-k6XQkROwuzdSD3UaGNTQlbRCkvyn4OlCxvuVxL0Bms2nNeARGKeAkH4DzRjSjdt5uwHN-mTiPxIMYG-XTzJ-UQke4BqgGaow75wsIF1glQYwo7rUZfIiUhEzBEZaILcKhfnejVAKIBok1sjP8REHITk6bwn5oW1Jdomq_dV-qo1P3C1u8NNhdx-C9_ETLHqs3XDjlyZmlMK"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#7a4eb0]/40 to-transparent"></div>
            </div>
            <div className="relative z-10 text-center p-8">
              <div className="glass-panel p-10 rounded-[2.5rem] border border-white/20 shadow-2xl">
                <h3 className="text-3xl md:text-5xl font-black text-[#4e3000] drop-shadow-xl leading-tight mb-4">
                  ✦ Thế giới đang chờ đợi con!
                </h3>
                <p className="text-[#4e3000] font-bold opacity-80 uppercase text-xs tracking-[0.3em] leading-none">Cảnh tiếp theo</p>
              </div>
            </div>
          </section>
        </div>

        {/* Customized Bottom Bar */}
        <div className="w-full mt-auto">
          <LioBar 
             speechText="Nhảy thật cao để con rồng bay lên!"
             showProgress={true}
             currentProgress={jumps}
             totalProgress={totalJumps}
             progressLabel="LẦN NHẢY"
             onAction={handleManualDone}
             actionLabel="Xong!"
          />
        </div>

        {/* Demo Controls */}
        <div className="fixed right-6 bottom-[120px] z-[150] bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-slate-200 flex flex-col gap-3">
          <button 
            onClick={simulateSuccess}
            className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center p-0"
            title="Nhảy thành công (Cộng điểm)"
          >
            <span className="material-symbols-outlined text-[28px]">add_circle</span>
          </button>
          <button 
            onClick={simulateFail}
            className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center p-0"
            title="Giả lập Thất bại"
          >
            <span className="material-symbols-outlined text-[28px]">cancel</span>
          </button>
        </div>
        </div>

      </main>

      <BadgeModal 
        isOpen={showBadgeModal} 
        onClose={() => setShowBadgeModal(false)}
        hasMoreScenes={true} 
      />
    </>
  );
};
