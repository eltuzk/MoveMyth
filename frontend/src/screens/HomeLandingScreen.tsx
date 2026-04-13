import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';

export const HomeLandingScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = React.useState(false);

  const handleStart = () => {
    navigate('/onboarding');
  };

  return (
    <>
      <style>{`
        :root {
            --primary: #6B3FA0;
            --accent: #F5A623;
            --background: #FAF7F2;
            --secondary: #2EC4B6;
            --success: #4CAF82;
            --text-dark: #1A1A2E;
            --text-muted: #8B8BA0;
        }
        .story-card {
            background: #fff;
            border-radius: 28px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(107, 63, 160, 0.05);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
            min-width: 0;
        }
        .story-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(107, 63, 160, 0.12);
        }
        .card-image {
            height: 200px;
            background-size: cover;
            background-position: center;
            position: relative;
        }
        .badge {
            position: absolute;
            top: 1rem;
            left: 1rem;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .badge-easy { background: rgba(76, 175, 130, 0.1); color: var(--success); }
        .badge-medium { background: rgba(245, 166, 35, 0.1); color: var(--accent); }
        .duration {
            position: absolute;
            bottom: 1rem;
            right: 1rem;
            background: rgba(255,255,255,0.9);
            padding: 2px 8px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 700;
        }
        .play-btn {
            background: var(--accent);
            width: 44px;
            height: 44px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            box-shadow: 0 4px 12px rgba(245, 166, 35, 0.3);
            transition: transform 0.2s;
        }
        .play-btn:hover {
            transform: scale(1.1);
        }
        .start-quest-btn {
            background: var(--primary);
            color: #fff;
            padding: 12px 24px;
            border-radius: 100px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 8px 20px rgba(107, 63, 160, 0.3);
            transition: transform 0.2s;
        }
        .start-quest-btn:hover {
            transform: translateY(-2px);
        }
      `}</style>
      
      <Sidebar
        isExpanded={isSidebarExpanded}
        onExpandChange={setIsSidebarExpanded}
      />

      <div
        className="flex-1 overflow-x-hidden px-8 py-10 transition-[margin-left] duration-250 ease-in-out"
        style={{
          marginLeft: isSidebarExpanded ? '200px' : '64px',
          width: isSidebarExpanded ? 'calc(100% - 200px)' : 'calc(100% - 64px)',
        }}
      >
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="mb-12 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <h2 className="mb-2 text-4xl font-black tracking-tight text-[#1A1A2E]">Choose Your Adventure</h2>
              <p className="max-w-xl text-lg leading-relaxed text-slate-500">
                Step into a world where your movements power the magic. Where will Lio guide you today?
              </p>
            </div>
            
            <div className="flex items-center gap-4 xl:self-start">
              <div className="flex items-center gap-3 rounded-full border border-slate-100 bg-white px-5 py-2.5 shadow-sm">
                <span className="material-symbols-outlined text-amber-500">stars</span>
                <span className="font-bold text-slate-700">Magic Level 12</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            <div className="story-card" onClick={handleStart}>
              <div className="card-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800')" }}>
                <span className="badge badge-easy"><span className="material-symbols-outlined text-sm">eco</span> Easy</span>
                <span className="duration">15 Min</span>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold">The Whispering Woods</h3>
                <p className="mb-6 line-clamp-3 text-sm text-slate-500">
                  Hop like a bunny and dance through the leaves to help the forest spirits wake up from their long nap.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 font-bold text-rose-500">
                    <span className="material-symbols-outlined text-sm">favorite</span>
                    <span>1.2k</span>
                  </div>
                  <button className="play-btn" onClick={(e) => { e.stopPropagation(); handleStart(); }}>
                    <span className="material-symbols-outlined">play_arrow</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="story-card" onClick={handleStart}>
              <div className="card-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800')" }}>
                <span className="badge badge-medium"><span className="material-symbols-outlined text-sm">rocket_launch</span> Medium</span>
                <span className="duration">20 Min</span>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold">Space Fox Adventure</h3>
                <p className="mb-6 line-clamp-3 text-sm text-slate-500">
                  Launch into the stardust! Use your arms to steer through asteroid fields and reach the Moon Palace.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 font-bold text-rose-500">
                    <span className="material-symbols-outlined text-sm">favorite</span>
                    <span>842</span>
                  </div>
                  <button className="play-btn" onClick={(e) => { e.stopPropagation(); handleStart(); }}>
                    <span className="material-symbols-outlined">play_arrow</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="story-card" onClick={handleStart}>
              <div className="card-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800')" }}>
                <span className="badge badge-easy"><span className="material-symbols-outlined text-sm">water_drop</span> Easy</span>
                <span className="duration">10 Min</span>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold">Ocean Deep Discovery</h3>
                <p className="mb-6 line-clamp-3 text-sm text-slate-500">
                  Swim like a turtle and dodge giant bubbles to find the hidden treasure chest deep in the coral palace.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 font-bold text-rose-500">
                    <span className="material-symbols-outlined text-sm">favorite</span>
                    <span>2.5k</span>
                  </div>
                  <button className="play-btn" onClick={(e) => { e.stopPropagation(); handleStart(); }}>
                    <span className="material-symbols-outlined">play_arrow</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-12 right-12 z-50">
          <button className="start-quest-btn" onClick={handleStart}>
            <span className="material-symbols-outlined">auto_fix_high</span>
            <span>Start Quest</span>
          </button>
        </div>
      </div>
    </>
  );
};