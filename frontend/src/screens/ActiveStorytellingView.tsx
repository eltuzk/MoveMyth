import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ActiveStorytellingView: React.FC = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/challenge/voice');
  };

  return (
    <>
      <style>{`
        .watercolor-overlay {
          background-image: linear-gradient(to bottom, rgba(73, 25, 125, 0.1), transparent 30%, transparent 70%, rgba(27, 0, 57, 0.8));
        }
      `}</style>

      {/* FULL BLEED BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <img
          alt="The Enchanted Grove"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyAjFZaZMd-bwIyYoVJOuiadjJoJIZ-mgNwffUzk9wxMsOKrWN-NxwwjazdsJO8WcN1zU0KET-EKe-hs0H2L_a8nTksksxGGPHWqvEG2JkwaS7nxgRWhT9ZLkX9yFsV0XOZrzAq4R7kUbVOLIlkVlLWf76beC0BBruokwljxSf9DZeUo0RE1J3WGi0t81MQg2ms0pMkMc7nSgCemld2p3jE1TDNL0pcFL1xYSO6_jDn8IkT89igdUUl1yYywxdM3BpCddBYRQns4sa"
        />
        <div className="absolute inset-0 watercolor-overlay pointer-events-none"></div>
      </div>

      {/* CENTER: LIO CHARACTER FLOATING — scrollable middle area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center pt-20 pb-48 overflow-y-auto min-h-[calc(100vh-136px)] gap-12">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Glow Effect behind Lio */}
          <div className="absolute inset-0 bg-[#7a4eb0]/20 blur-[64px] rounded-full"></div>
          {/* Lio Mascot */}
          <img
            alt="Lio Mascot"
            className="w-48 h-48 object-contain drop-shadow-[0_20px_50px_rgba(73,25,125,0.3)] animate-pulse"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDt5M_I20RrgvLBYtoABzpUWieqcmrtY2i2_N-9XvwH6SLE3iVCjkvs3pkMjnk6u73tTwMZlxYywvH6NhdYbM9pR9I5d_Mv4nNhZyjmDosPJwV-ZxCt5szabzAGq6i2bVKMGeEFvknE3tH3HvKwzkqq7I4-HE27ivJJG7Xz8jHbAlt0ZzVoux4E43PXcL4vI1BidVBq-WtQOy-1B2buO4ynnCRJCHk1LNVYYomt8-2XjCtQ-VgwqfeAVEBCcN_UB7Cd2sN2EHpwR8xw"
          />
        </div>

        {/* Demo Navigation: Compact fixed panel on the right */}
        <div className="fixed right-6 bottom-[88px] z-[150] bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-slate-200 flex flex-col gap-3">
          <button 
            onClick={() => navigate('/challenge/voice')}
            className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center p-0"
            title="Qua phần Challenge"
          >
            <span className="material-symbols-outlined text-[28px]">rocket_launch</span>
          </button>
          <button 
            onClick={() => navigate('/complete')}
            className="w-12 h-12 bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center p-0"
            title="Qua phần Endgame"
          >
            <span className="material-symbols-outlined text-[28px]">emoji_events</span>
          </button>
        </div>
      </main>
    </>
  );
};
