import React from 'react';
import { useNavigate } from 'react-router-dom';

export const MagicSignActivation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .magic-camera-border {
          box-shadow: 0 0 0 4px rgba(122, 78, 176, 0.15), 0 0 30px rgba(197, 150, 254, 0.4);
        }
        .vignette-overlay {
          background: radial-gradient(circle, transparent 40%, rgba(27, 0, 57, 0.4) 100%);
        }
        .glow-active {
          filter: drop-shadow(0 0 10px rgba(197, 150, 254, 0.8));
        }
      `}</style>

      {/* Main Content — flex-1 ensures it takes required space */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 min-h-[calc(100vh-136px)]">
        {/* Ritual Interaction Container */}
        <div className="relative w-full max-w-4xl flex items-center justify-center gap-6 mb-8">
          {/* Left: Gesture Reference Card */}
          <div className="hidden lg:flex flex-col items-center justify-center p-4 bg-[#fcf9f4] rounded-[1rem] w-[140px] h-[140px] shadow-sm transform -rotate-3 border border-[#bbb9b4]/15">
            <div className="text-5xl mb-2">✌️</div>
            <p className="text-[14px] font-bold text-center leading-tight text-[#7a4eb0]">Dấu hiệu hòa bình!</p>
          </div>

          {/* Center: Magic Camera Feed */}
          <div className="relative w-full max-w-[500px] h-[340px] rounded-[1rem] overflow-hidden magic-camera-border bg-[#0e0e0c] group">
            {/* Camera Feed */}
            <img
              alt="Real-time camera feed of a child making a V-sign"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsGFZbOyX48hJIL2TStW2cdTia5e_8g7BK8aB8yroE5oDq69N5hSl2hVh8LW-hbMtO6THz28CwKNTSOrB8vuYkw55CueWAcMUPhFhV1odsfn862HYgwwqemQVLRHOS4dX5h9sVvfrTjqA9dQY47A4m96LIJ7o5We54VVPrShDYbYMf72EMpyfu1UgLZQBgdcdD8eQQJnnmgBcICU-7uUpH57g3g7D5-eWZm8nfrctojVBfZA7BHI2wcMtIbNW9YQwX8L7eoCpYwe7t"
            />
            {/* Vignette for Portal Feel */}
            <div className="absolute inset-0 vignette-overlay pointer-events-none"></div>
            {/* Status Dot */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#c12048] rounded-full shadow-[0_0_8px_#c12048]"></span>
              <span className="text-white text-xs font-bold tracking-wide">● Đang nhận...</span>
            </div>
            {/* Camera Overlay: Target Guide */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
              <div className="w-48 h-48 border-2 border-dashed border-white/50 rounded-full"></div>
            </div>
          </div>

          {/* Right: Status Bubble */}
          <div className="absolute lg:relative -top-16 lg:top-0 right-0 lg:right-auto bg-white/80 backdrop-blur-lg p-5 rounded-[1rem] shadow-[0px_32px_32px_-4px_rgba(73,25,125,0.08)] border border-[#bbb9b4]/10 w-[240px] z-10">
            <div className="flex items-start gap-3 mb-3">
              <span className="material-symbols-outlined text-[#7a4eb0]">auto_awesome</span>
              <div>
                <p className="text-sm font-bold text-[#383835]">Đang nhận...</p>
                <p className="text-xs text-[#656461]">Giữ nguyên tư thế của con nhé!</p>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-[#eae8e2] rounded-full overflow-hidden">
              <div className="w-[65%] h-full bg-[#007168] transition-all duration-1000"></div>
            </div>
          </div>
        </div>
        
        {/* Demo continue button */}
        <button 
          onClick={() => navigate('/welcome')}
          className="bg-[#f8a826] text-[#4e3000] px-10 py-4 rounded-full font-black text-lg shadow-xl shadow-amber-500/30 hover:scale-105 transition-transform active:scale-95 flex items-center gap-3 relative z-10"
        >
          Tiếp tục
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </main>
    </>
  );
};
