import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface TopBarProps {
  screenKey: string;
}

const BREADCRUMB_MAP: Record<string, { prev: string[], current: string }> = {
  'home': { prev: [], current: 'Thư viện' },
  'onboarding': { prev: [], current: 'Tạo hồ sơ' },
  'magic-sign': { prev: [], current: 'Kích hoạt phép thuật' },
  'story-launch': { prev: [], current: 'Bắt đầu câu chuyện' },
  'story': { prev: [], current: 'Lio kể chuyện' },
  'challenge-voice': { prev: [], current: 'Chọn câu trả lời' },
  'challenge-demo': { prev: [], current: 'Lio làm mẫu' },
  'verify': { prev: [], current: 'Xác minh' },
  'complete': { prev: [], current: 'Tổng kết phiên chơi' },
  'parent': { prev: [], current: 'Phụ huynh' }
};

export const TopBar: React.FC<TopBarProps> = ({ screenKey }) => {
  const navigate = useNavigate();
  const isHome = screenKey === 'home';
  const breadcrumb = BREADCRUMB_MAP[screenKey] || { prev: ['Hành trình'], current: 'MoveMyth' };

  return (
    <div className="sticky top-0 z-[100] w-full h-[56px] bg-[#2d1b69] px-6 py-3 flex items-center justify-between shadow-md text-white font-['Be_Vietnam_Pro'] shrink-0">
      {/* Left */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="font-bold text-lg tracking-wide shrink-0 hover:text-[#f8a826] transition-colors"
        aria-label="Go to home"
      >
        MoveMyth
      </button>

      {/* Center */}
      {isHome ? (
        <div className="hidden md:flex items-center w-[320px] bg-white rounded-full px-4 py-1.5 gap-2 group border border-transparent focus-within:border-[#f8a826] transition-all">
          <span className="material-symbols-outlined text-slate-400 text-lg group-focus-within:text-[#7a4eb0]">search</span>
          <input
            type="text"
            placeholder="Tìm câu chuyện..."
            className="w-full bg-transparent border-none outline-none text-slate-700 text-sm font-medium placeholder:text-slate-400"
          />
        </div>
      ) : (
        <div className="hidden md:flex items-center text-sm font-bold text-white/90 tracking-wide uppercase">
          {breadcrumb.current}
        </div>
      )}

      {/* Right */}
      <div className="flex items-center gap-4 shrink-0">
        {isHome ? (
          <>
            <button className="material-symbols-outlined hover:text-[#f8a826] transition-colors relative">
              notifications
              <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border border-[#2d1b69]"></span>
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#f8a826]">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Explorer" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </>
        ) : (
          <>
            <button className="material-symbols-outlined hover:text-[#f8a826] transition-colors">
              settings
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#c596fe]">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Explorer" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
