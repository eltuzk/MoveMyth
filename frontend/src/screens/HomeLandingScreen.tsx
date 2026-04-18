import React from 'react';
import { useNavigate } from 'react-router-dom';

export const HomeLandingScreen: React.FC = () => {
  const navigate = useNavigate();

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
        .badge-easy { 
            background: var(--success); 
            color: white; 
            box-shadow: 0 4px 12px rgba(76, 175, 130, 0.4);
            border: 1.5px solid rgba(255,255,255,0.2);
        }
        .badge-medium { 
            background: var(--accent); 
            color: white; 
            box-shadow: 0 4px 12px rgba(245, 166, 35, 0.4);
            border: 1.5px solid rgba(255,255,255,0.2);
        }
        .duration {
            position: absolute;
            bottom: 1rem;
            right: 1rem;
            background: #fff;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 800;
            color: var(--text-dark);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border: 1px solid rgba(0,0,0,0.05);
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

      `}</style>
      
      <div className="w-full flex-1 px-8 py-10">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="mb-12 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <h2 className="mb-2 text-4xl font-black tracking-tight text-[#1A1A2E]">Chọn cuộc phiêu lưu của con</h2>
              <p className="max-w-xl text-lg leading-relaxed text-slate-500">
                Bước vào thế giới nơi mọi chuyển động của con đều tạo ra phép thuật. Lio sẽ dẫn con đi đâu hôm nay?
              </p>
            </div>
            
            <div className="flex items-center gap-4 xl:self-start">
              <div className="flex items-center gap-3 rounded-full border-2 border-[#f8a826] bg-[#fffcf0] px-5 py-2.5 shadow-md">
                <span className="material-symbols-outlined text-[#f8a826] font-bold">stars</span>
                <span className="font-black text-[#7a4eb0]">Cấp độ Phép thuật 12</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            <div className="story-card" onClick={handleStart}>
              <div className="card-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800')" }}>
                <span className="badge badge-easy"><span className="material-symbols-outlined text-sm">eco</span> Dễ</span>
                <span className="duration">15 Phút</span>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold">Khu Rừng Thì Thầm</h3>
                <p className="mb-6 line-clamp-3 text-sm text-slate-500">
                  Nhảy như chú thỏ và khiêu vũ giữa những tán lá để đánh thức các linh hồn rừng xanh khỏi giấc ngủ dài.
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
                <span className="badge badge-medium"><span className="material-symbols-outlined text-sm">rocket_launch</span> Trung bình</span>
                <span className="duration">20 Phút</span>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold">Cuộc Phiêu Lưu Của Cáo Vũ Trụ</h3>
                <p className="mb-6 line-clamp-3 text-sm text-slate-500">
                  Bay vào bụi sao! Sử dụng đôi tay để lái qua các vành đai tiểu hành tinh và vươn tới Cung Trăng.
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
                <span className="badge badge-easy"><span className="material-symbols-outlined text-sm">water_drop</span> Dễ</span>
                <span className="duration">10 Phút</span>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold">Khám Phá Đại Dương Sâu Thẳm</h3>
                <p className="mb-6 line-clamp-3 text-sm text-slate-500">
                  Bơi như chú rùa và né những bong bóng khổng lồ để tìm rương kho báu ẩn sâu trong cung điện san hô.
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


      </div>

      {/* Lio's Magic Tip Bar - Fixed at Bottom */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] w-full max-w-4xl px-8">
        <div className="bg-white/90 backdrop-blur-xl border border-white/60 shadow-[0_20px_50px_rgba(73,25,125,0.12)] rounded-full px-8 py-4 flex items-center gap-6">
          <div className="shrink-0">
            <div className="w-20 h-20 rounded-full border-2 border-[#7a4eb0]/30 overflow-hidden bg-[#92C5E9] flex items-center justify-center shadow-md">
              <img src="/avt_Lio.png" alt="Lio" className="w-full h-full object-cover rounded-full" />
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            <span className="text-[11px] font-black text-[#7a4eb0] tracking-[0.2em] uppercase mb-0.5">
              BÍ KÍP PHÉP THUẬT CỦA LIO
            </span>
            <p className="text-[#383835] font-bold text-lg italic leading-tight">
              "Hãy vươn vai thật đã, dang tay thật rộng để đánh thức sự tập trung nhé!"
            </p>
          </div>

          <button className="bg-[#8B4513] text-white px-10 py-4 rounded-full font-black shadow-lg hover:bg-[#703810] transition-all hover:scale-105 active:scale-95 flex items-center justify-center leading-none group">
            <span className="text-lg uppercase tracking-widest italic">Thử ngay</span>
          </button>
        </div>
      </div>
    </>
  );
};