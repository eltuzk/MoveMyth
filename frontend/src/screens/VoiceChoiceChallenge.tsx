import React from 'react';
import { useNavigate } from 'react-router-dom';

export const VoiceChoiceChallenge: React.FC = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/challenge/demo');
  };

  return (
    <>
      <style>{`
        .mic-pulse {
          box-shadow: 0 0 0 0 rgba(122, 78, 176, 0.7);
          animation: mic-anim 2s infinite;
        }
        @keyframes mic-anim {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(122, 78, 176, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(122, 78, 176, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(122, 78, 176, 0); }
        }
        .status-pulse {
          animation: status-glow 1.5s ease-in-out infinite alternate;
        }
        @keyframes status-glow {
          from { opacity: 0.6; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1.1); }
        }
      `}</style>

      {/* Full-bleed Background */}
      <div className="fixed inset-0 z-0">
        <img
          className="w-full h-full object-cover"
          alt="Enchanted magical forest path"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnyzUp2J8sSvoPDamf6_H1VnWoibiQUP82GTUkaUV_NQIMPLk00WvQCjmUpCBvP7fY80z9m7srTeA7g6pyU5PL93TztEoGDyTm8ni1bWuY6s7A9g0ggGo_TZegCcU6u9SBOty5uomnsSmFlsnuxIZ-RedNhe0Xz012I6_V-jqkv8J-XzIkqoXn59OVo7-cqzgcXjT_7QucUG1WslZ-TfeAh2-NQ-3z44ZRMl26nw5slXz3ZLjh1tj-bGDfoaj512Gf28ZRT7_S9Drp"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#7a4eb0]/10 via-transparent to-[#7a4eb0]/20 pointer-events-none"></div>
      </div>

      {/* Main Content: Interaction Overlay */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 min-h-[calc(100vh-136px)] pt-10 pb-10">
        {/* Floating Mascot */}
        <div className="mb-8 pointer-events-none">
          <div className="relative">
            <img
              className="w-48 h-48 object-contain drop-shadow-[0_20px_20px_rgba(73,25,125,0.3)] transform -rotate-6"
              alt="Friendly purple dragon mascot"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHhPSCiEwz79-HG3j-Wmi-f8ga-oqql6fCOH9oavrVagkSC-gWnR9F4VVdAxCwYJece1g_jxZGKiLXPD1VDESO7yd1q_x3sgNK50B6-KnR2lGIL2-Dqxff5sEKEeYfagONiMd3p58mZoewabF3SFE6rdXE1AX09dzbnePWvKzc3_TchfxoDh1lq_7cgS1ep32TQSvaBu_r0vAIX9_j--v7J15SRMg7GOHluVrSKQnfUekEjk1teDMvK_yAIAZ2AxFbwmr9dwiR0HqY"
            />
          </div>
        </div>

        {/* Decision Panel */}
        <div className="w-full max-w-2xl bg-[#fffcf7]/95 backdrop-blur-xl rounded-[1.5rem] p-8 shadow-[0_32px_32px_-4px_rgba(73,25,125,0.1)] flex flex-col items-center text-center relative border border-white/50 mb-10">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#fffcf7] rotate-45 rounded-sm"></div>
          <h1 className="font-bold text-[#383835] leading-tight mb-8 text-xl">
            "Con muốn chàng hiệp sĩ dùng thanh kiếm ánh sáng hay chiếc khiên thần kỳ để vượt qua hang động?"
          </h1>
          {/* Mic Button */}
          <div className="relative mb-6">
            <button className="w-24 h-24 bg-[#7a4eb0] rounded-full flex items-center justify-center text-white mic-pulse transition-transform hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(122,78,176,0.4)]">
              <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
            </button>
          </div>
          <p className="text-[#656461] font-medium animate-pulse">
            Đang lắng nghe... Con hãy thử nói nhé!
          </p>
          <p className="text-[#a07fc9] italic mt-2 text-sm">
            "Con chọn chiếc khiên..."
          </p>
        </div>

        {/* Demo continue button */}
        <button 
          onClick={handleNext}
          className="bg-[#f8a826] text-[#4e3000] px-10 py-4 rounded-full font-black text-lg shadow-xl shadow-amber-500/30 hover:scale-105 transition-transform active:scale-95 flex items-center gap-3 z-50"
        >
          Tiếp tục
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </main>
    </>
  );
};
