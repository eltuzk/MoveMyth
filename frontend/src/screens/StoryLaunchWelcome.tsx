import React from 'react';
import { useNavigate } from 'react-router-dom';

export const StoryLaunchWelcome: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/story');
  };

  return (
    <>
      <style>{`
        .glow-aura {
          filter: drop-shadow(0 0 40px rgba(197, 150, 254, 0.4));
        }
        .intro-card {
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(12px);
          box-shadow: 0 24px 48px rgba(73, 25, 125, 0.08);
        }
      `}</style>

      <main className="mx-auto flex min-h-[calc(100vh-136px)] w-full max-w-7xl flex-1 flex-col items-center justify-center gap-14 overflow-x-hidden px-8 py-8 md:flex-row md:gap-16">
        <div className="z-10 flex w-full flex-1 flex-col items-center space-y-8 text-center md:max-w-[560px] md:items-start md:text-left">
          <header className="space-y-4">
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-[#3f0b73] md:text-6xl">
              Chào mừng đến với MoveMyth!
            </h1>
            <p className="text-xl font-medium text-[#656461] md:text-2xl">
              Khám phá thế giới kỳ diệu cùng Lio
            </p>
          </header>

          <div className="intro-card w-full max-w-xl rounded-[1.5rem] p-6 md:p-8">
            <p className="text-base leading-8 text-[#5f5a67] md:text-lg">
              Lio đã sẵn sàng dẫn bạn vào một cuộc phiêu lưu nhỏ đầy phép thuật,
              nơi mỗi bước di chuyển sẽ làm câu chuyện sống dậy. Chỉ cần bấm bắt
              đầu, chúng ta sẽ cùng vào hành trình ngay.
            </p>
          </div>

          <button
            onClick={handleStart}
            className="flex w-fit items-center gap-3 rounded-full bg-[#f8a826] px-12 py-5 text-xl font-bold text-[#4e3000] shadow-[0_8px_0_#d98e16] transition-all active:translate-y-1 active:shadow-none"
          >
            Bắt đầu
            <span className="material-symbols-outlined font-bold">arrow_forward</span>
          </button>
        </div>

        <div className="relative flex w-full flex-1 items-center justify-center md:max-w-[560px]">
          <div className="absolute inset-0 scale-125 rounded-full bg-[#c596fe]/20 blur-[80px]"></div>
          <div className="glow-aura relative z-10 w-full max-w-[520px] transition-transform duration-500 hover:scale-105">
            <img
              className="h-auto w-full drop-shadow-2xl"
              alt="Lio the cheerful purple mascot"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRV2nTJGgfk-H9PH6THEy746aXi2rG1rxcTlFTLrJn1n0gE1ShNFLnqd5ia4UfCQFiC_0COmpZ3sxLfm0zaRrsjG43eZq2MyJD-EY1O2FxkNKFVPE8XBvjbqan8A2q3YR0op1mKzVWOnBqs0vsnB3AfKfZyiZDOmSmkyVecH7oZlnEXNCgirbJ82bzZCA5S-FwqxwQ45oCmRVimnbtabRyPbqe6rNao04gWsw8Dr4KHkzlDLdVRUMYxsE0TogEAGBMzURJIrArLcPv"
            />
          </div>
        </div>
      </main>
    </>
  );
};
