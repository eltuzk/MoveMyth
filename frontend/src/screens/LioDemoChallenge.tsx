import React from 'react';
import { useNavigate } from 'react-router-dom';

export const LioDemoChallenge: React.FC = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/verify');
  };

  return (
    <>
      <style>{`
        .mist-overlay {
          background: radial-gradient(circle at 50% 50%, rgba(122, 78, 176, 0.15) 0%, rgba(14, 14, 12, 0) 70%);
        }
        .sparkle-effect {
          background-image: radial-gradient(circle, #f8a826 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>


      {/* Atmospheric Background Layer */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[#0e0e0c]"></div>
        <div className="absolute inset-0 sparkle-effect opacity-20"></div>
        <div className="absolute inset-0 mist-overlay"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#7a4eb0]/20 to-transparent"></div>
      </div>

      {/* Camera PiP Window - adjusted for sticky header */}
      <div className="fixed top-20 right-8 z-50">
        <div className="relative w-24 h-32 md:w-32 md:h-44 bg-[#f6f3ee] rounded-[1rem] overflow-hidden border-4 border-[#70f8e8] shadow-[0_0_20px_rgba(112,248,232,0.3)]">
          <img
            className="w-full h-full object-cover grayscale-[0.2]"
            alt="Real-time camera feed"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSZXdY_X-9A1ms4MIg5QfTiQfBaOdbcNkojHVkuUZRB6cp7vmB2CstxrSSaqTaYJQNS1tiyrt8ogpwu8aSBiPyFbVk1j_7B6x-uS1b0AkePKNXK0EplOhRBPXb2O4KKdhb4R8HhFlH71G6JeQqv3wvdG8eV43p-FdLr-Umrf2Qio9hpvwtQjhSld0d_E-gTK9LA5ypifWZRNSGRn_nWnou--wpVMxDmVObfmGm6KdvT2oVbJ0-_QaW95n8Q617fgJzLioDhiBxyRb2"
          />
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-md">
            <div className="w-2 h-2 bg-[#c12048] rounded-full animate-pulse"></div>
            <span className="text-[10px] text-white font-bold uppercase tracking-widest">LIVE</span>
          </div>
        </div>
      </div>

      {/* Main Content Stage */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-24 min-h-[calc(100vh-56px)]">
        <div className="relative flex flex-col md:flex-row items-center gap-8 max-w-6xl w-full">
          {/* Large Lio Mascot Section */}
          <div className="relative flex-1 flex justify-center">
            <div className="absolute inset-0 flex items-center justify-center -z-10 blur-3xl opacity-30">
              <div className="w-96 h-96 bg-[#7a4eb0] rounded-full"></div>
            </div>
            <div className="relative group">
              <img
                className="w-[260px] md:w-[400px] drop-shadow-[0_20px_50px_rgba(122,78,176,0.5)] transform hover:scale-105 transition-transform duration-500"
                alt="Lio jumping high excitedly"
                src="/avt_Lio.png"
              />
            </div>
          </div>

          {/* Speech Bubble & CTA Section */}
          <div className="flex-1 flex flex-col items-center md:items-start space-y-6">
            <div className="relative bg-[#fffcf7]/95 backdrop-blur-lg p-6 rounded-[1.5rem] border border-white/50 shadow-[0_32px_32px_-4px_rgba(73,25,125,0.2)] max-w-md">
              <div className="absolute bottom-1/2 -left-4 translate-y-1/2 w-8 h-8 bg-[#fffcf7] rotate-45 hidden md:block"></div>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#fffcf7] rotate-45 block md:hidden"></div>
              <div className="space-y-3 text-center md:text-left">
                <p className="text-[#7a4eb0] text-xl md:text-2xl font-extrabold tracking-tight">
                  Nhảy như Lio nha!
                </p>
                <p className="text-[#383835] text-base md:text-lg leading-relaxed opacity-90 mb-4">
                  Nhảy 5 lần để vượt qua cây cầu! Con đã sẵn sàng chưa?
                </p>
                <div className="inline-flex bg-[#f8a826] text-[#4e3000] px-4 py-2 rounded-full shadow border border-amber-400 gap-2 items-center">
                  <span className="material-symbols-outlined text-base">flash_on</span>
                  <span className="font-bold text-xs uppercase tracking-wider">Thử thách: Nhảy 5 lần</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button 
              onClick={handleNext}
              className="bg-[#f8a826] text-[#4e3000] px-10 py-4 rounded-full font-black text-lg shadow-xl shadow-amber-500/30 hover:scale-105 transition-transform active:scale-95 flex items-center gap-3 z-50 mt-8"
            >
              Con xong rồi!
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </main>
    </>
  );
};
