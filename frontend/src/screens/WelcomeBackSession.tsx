import React from 'react';
import { useNavigate } from 'react-router-dom';

export const WelcomeBackSession: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .welcome-back-body {
          font-family: 'Be Vietnam Pro', sans-serif;
          background-color: #fffcf7;
          color: #383835;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .glass-card {
          background: rgba(255, 252, 247, 0.8);
          backdrop-filter: blur(16px);
        }
        .tinted-shadow {
          box-shadow: 0 32px 32px -4px rgba(73, 25, 125, 0.08);
        }
      `}</style>

      <div className="welcome-back-body">
        {/* Header */}
        <header className="flex justify-between items-center w-full sticky top-0 z-50 bg-[#fffcf7] px-6 py-4">
          <div 
            onClick={() => navigate('/')}
            className="text-2xl font-black text-[#6B3FA0] tracking-tighter cursor-pointer"
          >
            MoveMyth
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/parent')}
              className="material-symbols-outlined text-[#6B3FA0] text-2xl hover:opacity-80 transition-opacity"
            >
              account_circle
            </button>
          </div>
        </header>

        <main className="w-full max-w-5xl px-6 pt-8 pb-24 flex flex-col items-center relative">
          {/* Lio + Speech Bubble */}
          <div className="relative w-full flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
            <div className="relative z-10 w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
              <img
                alt="Lio the mascot waving"
                className="w-full h-full object-contain drop-shadow-xl"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBYjHXYvUmniYNa9pzeo0qFPG_nQCqK0lRuKx6W0jQBnZ-NMMKQhZp01r7LOzoENkJ8U0lsYIJ3d0Au3Vr8qlP5NbEhGEP4_LnZnR0xwz1sqAx19OEB5vj-wCGd-IYAJ5QHrndhp3v5QbkZ2AdWZ2cQS9Ussu5PC5grqlbLIxyw_Si-B1QMfAxQOwX_5Xj2U-E_klUG7t4l89Nu8dKAAb8s9nJaf1i0s8-2JKi9eNQ3SzO3DWdMzrjv_okuDPZdDE5h4CAFAt3ncHH"
              />
              {/* Speech Bubble */}
              <div className="absolute -top-4 -right-12 glass-card p-6 rounded-[1rem] border-2 border-[#bbb9b4]/15 tinted-shadow max-w-[240px]">
                <p className="text-[#383835] font-medium leading-relaxed">Chào mừng trở lại, Nhà thám hiểm! 🎉</p>
                <div className="absolute bottom-0 left-4 w-4 h-4 bg-[#fffcf7]/80 rotate-45 translate-y-2 border-r border-b border-[#bbb9b4]/15"></div>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* LEFT: Previous Session Recap */}
            <section className="md:col-span-7 space-y-6">
              <div className="bg-[#fcf9f4] rounded-[1rem] p-8 tinted-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span className="material-symbols-outlined text-9xl">history_edu</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-[#7a4eb0] mb-6">Lần trước chúng ta đã...</h2>
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-48 h-32 rounded-[1rem] overflow-hidden bg-[#eae8e2] flex-shrink-0">
                    <img
                      className="w-full h-full object-cover"
                      alt="Magical forest illustration"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXEOGwQcpgJYbWWWldURg9jPqm9ZkGf1IvJJbefp_oCbJnUYgqZBdT_9Sjym8ioRlJiM-RBHkV8iTWbFRrbFPcHdISHvV-0cUW23lJaY_SFjtNPjcc-xKcnzEBMIQA-c8PxBzkV2oPHn3g5XFjMR988NbCUiXI34gajwkDIzPQPXAnDNzn4_NoN216zDb3jSZR7sQUxn4Z7s1OkU_qT-H8T3R0dn6l1M9KWmvYiQruJwLNXM0X8iOtzNb3AH4gU29XXnJijDjS-Z7f"
                    />
                  </div>
                  <div className="flex flex-col justify-center space-y-3">
                    <div className="flex items-center gap-3 bg-[#eae8e2] px-4 py-2 rounded-full w-fit">
                      <span className="material-symbols-outlined text-[#7a4eb0]">directions_run</span>
                      <span className="font-medium font-black">Nhảy 15 lần 🎯</span>
                    </div>
                    <div className="flex items-center gap-3 bg-[#eae8e2] px-4 py-2 rounded-full w-fit">
                      <span className="material-symbols-outlined text-[#8b5a00]" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                      <span className="font-medium font-black">Nhận 2 huy hiệu 🏅</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* RIGHT: Actions */}
            <section className="md:col-span-5 flex flex-col gap-4">
              <button 
                onClick={() => navigate('/welcome')}
                className="w-full py-6 px-8 rounded-full bg-[#f8a826] text-[#4e3000] text-xl font-extrabold flex items-center justify-center gap-3 shadow-lg hover:opacity-90 active:scale-[0.98] transition-all group"
              >
                Tiếp tục hành trình
                <span className="material-symbols-outlined font-bold group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
              <button 
                onClick={() => navigate('/')}
                className="w-full py-5 px-8 rounded-full bg-[#7a4eb0]/10 text-[#7a4eb0] font-bold flex items-center justify-center gap-3 hover:bg-[#7a4eb0]/15 active:scale-[0.98] transition-all"
              >
                <span className="material-symbols-outlined">auto_stories</span>
                Chọn cuộc phiêu lưu mới
              </button>
              {/* Tip Card */}
              <div className="mt-4 p-6 rounded-[1rem] bg-[#70f8e8]/20 border border-[#bbb9b4]/10 flex items-start gap-4">
                <div className="bg-[#70f8e8] p-3 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#005c55]">tips_and_updates</span>
                </div>
                <div>
                  <h4 className="font-bold text-[#005c55]">Mẹo nhỏ hôm nay</h4>
                  <p className="text-sm text-[#656461] leading-snug italic">Lio thích nhất là cùng bạn vận động trước khi nghe kể chuyện đấy!</p>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-6 left-6 right-6 z-50">
          <div className="bg-[#fffcf7]/90 backdrop-blur-md rounded-[2rem] tinted-shadow flex justify-around items-center py-3 px-6 border border-[#bbb9b4]/15">
            <button 
              onClick={() => navigate('/')}
              className="flex flex-col items-center gap-1 text-[#6B3FA0] font-bold"
            >
              <div className="bg-[#6B3FA0]/10 p-2 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
              </div>
            </button>
            <button className="flex flex-col items-center gap-1 text-stone-400">
              <span className="material-symbols-outlined">auto_stories</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-stone-400">
              <span className="material-symbols-outlined">military_tech</span>
            </button>
            <button 
              onClick={() => navigate('/parent')}
              className="flex flex-col items-center gap-1 text-stone-400"
            >
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </nav>

        {/* Desktop Side Nav */}
        <aside className="hidden md:flex flex-col w-72 h-screen fixed left-0 top-0 z-40 bg-[#fffcf7] rounded-r-[3rem] tinted-shadow p-8">
          <div className="mb-10 flex flex-col items-center text-center">
            <div 
              onClick={() => navigate('/parent')}
              className="w-16 h-16 rounded-full bg-[#c596fe]/30 mb-4 overflow-hidden border-2 border-[#7a4eb0]/20 cursor-pointer hover:scale-105 transition-transform active:scale-95"
            >
              <img
                alt="Lio mascot"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqIa0dZEn4Q7E7nelj-sJs0Tc6RfW5EvWLmoVLxitaBUM7VngJ0GlvUDc1uAD-_Gi-EFwbsoCt6fpGCF5Ljp-P0UYSD3D2fhc9Wcg3M-X4ah6uwBm7kCDOqSLeSilK_tlESswALMZYn4RZzO_jbCCIYHCC8NVVhDTglxtoisKjjOe2V8TkQBgMbUbVOwqdcEva9WY1LwKr8D8HIJGEmvIUki4YeqmKpizFegdXQL4REDZWZlQ5vaKmBBZjqSqvRPWdr9TcLGLQR2jb"
              />
            </div>
            <h3 className="font-bold text-[#6B3FA0]">Chào, Nhà thám hiểm!</h3>
            <p className="text-xs text-stone-500 italic">Sẵn sàng cho câu chuyện mới chưa?</p>
          </div>
          <nav className="flex-1 space-y-2">
            {[
              { icon: 'home', label: 'Trang chủ', active: true, path: '/' },
              { icon: 'auto_stories', label: 'Thư viện', active: false, path: '/' },
              { icon: 'military_tech', label: 'Thành tích', active: false, path: '/parent' },
              { icon: 'settings', label: 'Cài đặt', active: false, path: '/parent' },
            ].map(({ icon, label, active, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className={`flex items-center gap-4 px-6 py-3 rounded-full w-full transition-all duration-300 ${active ? 'text-[#6B3FA0] font-black bg-[#6B3FA0]/10' : 'text-stone-400 hover:bg-[#6B3FA0]/5 font-bold'}`}
              >
                <span className="material-symbols-outlined" style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </nav>
          <button 
            onClick={() => navigate('/welcome')}
            className="mt-auto py-5 px-6 rounded-full bg-[#7a4eb0] text-white font-black shadow-lg shadow-purple-500/30 hover:opacity-90 active:scale-95 transition-all"
          >
            Bắt đầu thám hiểm
          </button>
        </aside>
      </div>
    </>
  );
};
