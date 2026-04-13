import React, { useState } from 'react';
import { BadgeModal } from '../components/BadgeModal';

export const ActiveVerificationChallenge: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'success' | 'fail'>('idle');
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  const simulateSuccess = () => {
    setStatus('success');
    setTimeout(() => {
      setStatus('idle');
      setShowBadgeModal(true);
    }, 1500);
  };

  const simulateFail = () => {
    setStatus('fail');
    setTimeout(() => setStatus('idle'), 3000);
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
        .status-alert {
          animation: slide-up 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* Main Content Area: Split Screen */}
      <main className="flex-1 flex flex-col items-center px-4 pt-4 pb-12 min-h-[calc(100vh-136px)]">
        
        {/* Split Screen Container */}
        <div className="flex flex-col md:flex-row w-full max-w-7xl h-[60vh] gap-4 mb-8">
          {/* LEFT HALF: Camera Feed */}
          <section className="flex-1 relative overflow-hidden bg-[#e5e2dc] rounded-[2rem] border-4 border-[#70f8e8] shadow-2xl">
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
            <div className="absolute top-8 left-8 bg-[#007168]/90 text-white px-4 py-2 rounded-full flex items-center gap-2 font-bold animate-pulse">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              ● Phát hiện!
            </div>

            {/* Simulation Feedback Overlays */}
            {status === 'success' && (
              <div className="absolute inset-0 bg-green-500/20 backdrop-blur-[2px] flex items-center justify-center z-50 status-alert">
                <div className="bg-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 scale-125">
                  <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
                  <span className="font-black text-green-800 tracking-tight">XUẤT SẮC!</span>
                </div>
              </div>
            )}
            {status === 'fail' && (
              <div className="absolute inset-0 bg-red-500/20 backdrop-blur-[2px] flex items-center justify-center z-50 status-alert">
                <div className="bg-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 scale-125">
                  <span className="material-symbols-outlined text-red-600 text-3xl">error</span>
                  <span className="font-black text-red-800 tracking-tight">THỬ LẠI CHÚT NHA!</span>
                </div>
              </div>
            )}
          </section>

          {/* RIGHT HALF: Story Preview */}
          <section className="flex-1 relative overflow-hidden bg-[#3f0b73] rounded-[2rem] flex items-center justify-center shadow-2xl">
            <div className="absolute inset-0 opacity-60">
              <img
                className="w-full h-full object-cover"
                alt="Epic cinematic scene"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAu3Oubn12PnJUNbtqrxU5mQa4Yi9j29oAp2bpn4aSuutji2nSKm-V3W7ST6QEqhYZe-k6XQkROwuzdSD3UaGNTQlbRCkvyn4OlCxvuVxL0Bms2nNeARGKeAkH4DzRjSjdt5uwHN-mTiPxIMYG-XTzJ-UQke4BqgGaow75wsIF1glQYwo7rUZfIiUhEzBEZaILcKhfnejVAKIBok1sjP8REHITk6bwn5oW1Jdomq_dV-qo1P3C1u8NNhdx-C9_ETLHqs3XDjlyZmlMK"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#7a4eb0]/40 to-transparent"></div>
            </div>
            <div className="relative z-10 text-center p-8">
              <div className="glass-panel p-6 rounded-[1.5rem] border border-white/20 shadow-2xl">
                <h3 className="text-2xl md:text-3xl font-black text-[#4e3000] drop-shadow-lg leading-tight mb-2">
                  ✦ Thế giới đang chờ đợi con!
                </h3>
                <p className="text-[#4e3000] font-bold opacity-80 uppercase text-[10px] tracking-widest leading-none">Cảnh tiếp theo</p>
              </div>
            </div>
          </section>
        </div>

        {/* Demo Controls: Placed below the split screen */}
        <div className="w-full max-w-2xl bg-white p-6 rounded-[1.5rem] shadow-lg border border-[#bbb9b4]/20">
          <h4 className="text-center font-bold text-[#656461] mb-4 text-sm tracking-widest uppercase">
            Bảng điều khiển Giả lập (Cho giám khảo)
          </h4>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button 
              onClick={simulateSuccess}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-full text-sm font-black uppercase tracking-widest shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">check_circle</span>
              Giả lập Thành công
            </button>
            <button 
              onClick={simulateFail}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-full text-sm font-black uppercase tracking-widest shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">cancel</span>
              Giả lập Thất bại
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
