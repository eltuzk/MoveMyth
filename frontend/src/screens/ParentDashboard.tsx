import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ParentDashboard: React.FC = () => {
  const navigate = useNavigate();

  const unlockedBadges = [
    { icon: 'forest', gradient: 'from-green-400 to-emerald-600', label: 'Forest King' },
    { icon: 'star', gradient: 'from-blue-400 to-indigo-600', label: 'Star Jumper' },
    { icon: 'waves', gradient: 'from-cyan-400 to-blue-500', label: 'Ocean Diver' },
  ];
  const lockedBadges = [
    { icon: 'volcano', label: 'Lava Leaper' },
    { icon: 'ac_unit', label: 'Snow Spirit' },
    { icon: 'shield', label: 'Royal Guardian' },
  ];

  return (
    <>
      <style>{`
        .glass-panel {
          background: rgba(255, 252, 247, 0.8);
          backdrop-filter: blur(16px);
        }
      `}</style>
      
      {/* Background layer */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#FAF7F2] to-[#FFE4C4] pointer-events-none"></div>

      <div className="relative z-10 flex flex-1 flex-col px-6 pt-8 pb-6 max-w-7xl mx-auto w-full">
        {/* Back to Home Button added for demo flow */}
        <button 
          onClick={() => navigate('/')}
          className="self-start mb-4 text-[#7a4eb0] font-bold hover:bg-purple-100/50 px-4 py-2 rounded-full transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Về Thư viện Hành trình
        </button>

        {/* Hero Section */}
        <header className="mb-6 text-center md:text-left">
          <h1 className="text-4xl md:text-[3.25rem] leading-tight font-extrabold tracking-tight text-[#383835] mb-1">Chào mừng trở lại, Paul!</h1>
          <p className="text-base md:text-lg text-[#656461] font-medium">Cùng xem các nhà thám hiểm nhỏ đang vận động thế nào nhé.</p>
        </header>

        {/* Child Switcher */}
        <div className="flex justify-center md:justify-start gap-3 mb-6">
          <button className="px-7 py-2.5 rounded-full bg-[#c12048] text-white font-bold shadow-lg flex items-center gap-2 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-sm">child_care</span>
            Paul
          </button>
          <button className="px-7 py-2.5 rounded-full bg-[#f0eee8] text-[#656461] font-semibold hover:bg-[#eae8e2] transition-colors active:scale-95">
            Maya
          </button>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 w-full">
          {/* Child Stats Card */}
          <section className="md:col-span-8 bg-white rounded-[1rem] p-6 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-[#c596fe] p-1">
                  <img
                    alt="Child Avatar"
                    className="w-full h-full rounded-full object-cover"
                    src="/avt_kid.png"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#f8a826] text-[#4e3000] px-3 py-1 rounded-full text-[10px] font-black shadow-md">LVL 12</div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-[#383835] mb-3">Hành trình của Paul</h2>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Vận động', value: '30p', color: 'text-[#7a4eb0]' },
                    { label: 'Động tác', value: '45', color: 'text-[#007168]' },
                    { label: 'Truyện', value: '2', color: 'text-[#8b5a00]' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="bg-[#fcf9f4] p-3 rounded-[1rem]">
                      <span className="block text-xs font-bold text-[#82807c] uppercase tracking-widest mb-1">{label}</span>
                      <span className={`text-xl font-black ${color}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Circular Progress */}
              <div className="relative flex flex-col items-center justify-center">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle className="text-[#eae8e2]" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="10"></circle>
                  <circle className="text-[#7a4eb0]" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="83.7" strokeLinecap="round" strokeWidth="10"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-black">20/30</span>
                  <span className="text-[10px] font-bold text-[#82807c] uppercase">Mục tiêu</span>
                </div>
              </div>
            </div>
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#7a4eb0]/5 rounded-full blur-3xl"></div>
          </section>

          {/* Parent Controls */}
          <section className="md:col-span-4 bg-white rounded-[1rem] p-5 shadow-sm">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#7a4eb0]">settings_accessibility</span>
              Quản lý Phụ huynh
            </h3>
            <div className="space-y-2">
              {[
                { icon: 'security', label: 'Nội dung phù hợp' },
                { icon: 'auto_stories', label: 'Cài đặt câu chuyện' },
                { icon: 'videocam', label: 'Quyền Camera' },
              ].map(({ icon, label }) => (
                <button key={label} className="w-full flex items-center justify-between p-3 rounded-[1rem] hover:bg-[#fcf9f4] transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#656461] group-hover:text-[#7a4eb0] transition-colors">{icon}</span>
                    <span className="font-semibold text-[#383835]">{label}</span>
                  </div>
                  <span className="material-symbols-outlined text-[#82807c]">chevron_right</span>
                </button>
              ))}
            </div>
          </section>

          {/* Recent Activity */}
          <section className="md:col-span-5 bg-white rounded-[1rem] p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[#007168]">history</span>
                Hoạt động gần đây
              </h3>
              <a className="text-[#7a4eb0] text-sm font-bold hover:underline" href="#">Xem tất cả</a>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-[1rem] bg-[#c596fe] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[#3f0b73]">park</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-bold">Bí mật Khu rừng Thầm thì</h4>
                    <span className="text-xs font-bold text-[#82807c] uppercase">Hôm nay</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-[#70f8e8]/30 text-[#005c55] text-[10px] font-black rounded uppercase">Nhận huy hiệu</span>
                    <span className="px-2 py-0.5 bg-[#eae8e2] text-[#656461] text-[10px] font-black rounded uppercase">+12 Động tác</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-[1rem] bg-[#f8a826] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[#4e3000]">nights_stay</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-bold">Đồng cỏ Ánh trăng</h4>
                    <span className="text-xs font-bold text-[#82807c] uppercase">Hôm qua</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-[#eae8e2] text-[#656461] text-[10px] font-black rounded uppercase">+8 Động tác</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Badge Collection */}
          <section className="md:col-span-7 bg-white rounded-[1rem] p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8b5a00]">military_tech</span>
                Bộ sưu tập Huy hiệu
              </h3>
              <span className="text-sm font-bold text-[#656461]">Đã mở khóa 3 / 12</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
              {unlockedBadges.map(({ icon, gradient, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 p-1 group cursor-pointer">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-tr ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <span className="material-symbols-outlined text-white text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                  </div>
                  <span className="text-[10px] font-bold text-center leading-tight">{label}</span>
                </div>
              ))}
              {lockedBadges.map(({ icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 p-1 opacity-40 grayscale">
                  <div className="w-14 h-14 rounded-full bg-[#eae8e2] flex items-center justify-center border-2 border-dashed border-[#82807c]">
                    <span className="material-symbols-outlined text-[#656461] text-[28px]">{icon}</span>
                  </div>
                  <span className="text-[10px] font-bold text-center leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Floating Lio (Optional, keeping it) */}
      <div className="fixed bottom-4 right-4 z-40 hidden xl:flex flex-col items-end">
        <div className="glass-panel p-4 rounded-[1rem] border border-[#bbb9b4]/15 shadow-2xl mb-2 max-w-[240px] relative">
          <p className="text-sm font-medium leading-relaxed">
            "Paul đang làm rất tốt! Chỉ còn 10 phút nữa là cậu bé sẽ đạt mục tiêu ngày rồi."
          </p>
          <div className="absolute bottom-[-10px] right-8 w-5 h-5 bg-white/80 backdrop-blur-md border-r border-b border-[#bbb9b4]/15 rotate-45"></div>
        </div>
        <div className="w-[110px] h-[110px] rounded-full bg-gradient-to-br from-white to-[#f5f3ef] border-4 border-white shadow-[0_15px_35px_rgba(122,78,176,0.2),inset_0_2px_4px_rgba(0,0,0,0.05)] p-0 flex items-center justify-center overflow-hidden">
          <img
            alt="Lio Mascot"
            className="w-full h-full object-cover scale-125 hover:scale-140 transition-transform duration-300 pointer-events-auto cursor-pointer"
            src="/avt_Lio.png"
          />
        </div>
      </div>
    </>
  );
};
