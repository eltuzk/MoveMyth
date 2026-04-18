import React from 'react';
import { useNavigate } from 'react-router-dom';

export const RefinedParentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const badges = [
    { icon: 'park', color: 'from-green-400 to-emerald-600', label: 'Forest King', earned: true },
    { icon: 'rocket_launch', color: 'from-red-400 to-rose-600', label: 'Star Jumper', earned: true },
    { icon: 'water_drop', color: 'from-cyan-400 to-blue-500', label: 'Ocean Diver', earned: true },
    { icon: 'volcano', color: '', label: 'Lava Leaper', earned: false },
    { icon: 'ac_unit', color: '', label: 'Snow Spirit', earned: false },
    { icon: 'castle', color: '', label: 'Royal Guardian', earned: false },
  ];

  const handleBack = () => {
    // If we have history, go back; otherwise go home
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <style>{`
        .refined-dash-body {
          font-family: 'Be Vietnam Pro', sans-serif;
          background: linear-gradient(135deg, #FAF7F2 0%, #FFE4C4 100%);
          min-height: 100vh;
          color: #383835;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
      `}</style>

      <div className="refined-dash-body">
        {/* Top Nav */}
        <nav className="sticky top-0 w-full z-50 bg-white/40 backdrop-blur-md h-20 px-8 flex justify-between items-center border-b border-white/20">
          <div className="flex items-center gap-12">
            <div 
              onClick={() => navigate('/')} 
              className="text-2xl font-black text-[#8B4513] tracking-tighter cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[#8B4513]">auto_awesome</span>
              MoveMyth
            </div>
            <div className="hidden md:flex gap-8 items-center h-full">
              <a className="text-[#8B4513] border-b-2 border-[#8B4513] pb-1 font-bold" href="#">Dashboard</a>
              <a className="text-[#656461] hover:text-[#7a4eb0] transition-colors font-medium" href="#">Activity</a>
              <a className="text-[#656461] hover:text-[#7a4eb0] transition-colors font-medium" href="#">Badges</a>
              <a className="text-[#656461] hover:text-[#7a4eb0] transition-colors font-medium" href="#">Settings</a>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 bg-[#8B4513]/10 text-[#8B4513] px-5 py-2 rounded-full font-bold hover:bg-[#8B4513]/20 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Quay lại
            </button>
            <button className="p-2 hover:bg-white/50 rounded-full transition-all relative">
              <span className="material-symbols-outlined text-[#656461]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-[#8B4513]/10">
              <img
                alt="Parent Profile"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdl_MV6RJ-Cjq0c-PMDyp3Z_NGFUZAE4xJBNmqYXIRA45SjeGQvfHoKZIu52hwakNWCPVAvOvdxglSoJZETOfPFZbYmRpnYIjn0IB184oXArbxZf9q6hAyXn-zehfXyDvS2JVTOFCCbAF4x1ashc8ZsEb_qNeER7P46XlXyTJeZED9_ROtHiHAOH_MYD39uyk8MxlGNW_LMbYU3ew5eOXH4-1LS-EugQ_IgMCa2ar2-nd3VW3js6a7j69i80DVMnnCalSS1FfrJ3d8"
              />
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-5xl font-black text-[#383835] tracking-tight mb-2">Chào phụ huynh! 👋</h1>
              <p className="text-lg text-[#656461] font-medium italic">Theo dõi hành trình thám hiểm của các bé nào.</p>
            </div>
            {/* Child Switcher */}
            <div className="flex items-center bg-white/40 p-1.5 rounded-full shadow-inner border border-white/20">
              <button className="px-6 py-2.5 rounded-full bg-[#FF7F50] text-white font-bold shadow-md flex items-center gap-2 active:scale-95 transition-transform">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">L</div>
                Leo
              </button>
              <button className="px-6 py-2.5 rounded-full text-[#656461] font-bold hover:bg-white/40 flex items-center gap-2 transition-all">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] text-blue-500">M</div>
                Maya
              </button>
              <button className="p-2.5 rounded-full text-[#656461] hover:bg-white/40 transition-all">
                <span className="material-symbols-outlined text-sm">add</span>
              </button>
            </div>
          </div>

          {/* Middle Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Leo's Journey Card */}
            <section className="lg:col-span-7 bg-white/60 rounded-[2.5rem] p-8 shadow-sm flex flex-col md:flex-row items-center gap-10 relative overflow-hidden border border-white/30">
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden p-0.5">
                  <img
                    alt="Child Avatar"
                    className="w-full h-full rounded-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgNkSVb5uUx6rzqIoJ7yP8w09NXPzVBWfySzl6FVVBQjm6El4-xMGYywDCf8_0TinzfmDBFlyq77mG2KKZQSmVxwg6WZ-EBmATBkLoxFlKLECW-5IXcpqYAZUsXO9PLP5hfBZ1wkMhS5oKbvv9An3JXs56Zfn-Yw_NplrveL9e5650k5CwqQY0Xqn4q9Z8uJFiS8LQYUGSUHwDCGX9ofMbCus97igqfCfcw8Olgh9BbWb3mCgwTfGilbCE2UylglbQBimwe1kVLGyp"
                  />
                </div>
                <div className="absolute bottom-0 right-0 bg-[#E07A5F] text-white px-2.5 py-1 rounded-[1rem] text-[10px] font-black shadow-lg">CẤP ĐỘ 12</div>
              </div>
              <div className="flex-1 space-y-6">
                <div>
                  <h2 className="text-4xl font-black text-[#383835] mb-1">Leo</h2>
                  <div className="flex items-center gap-2 text-[#007168] font-bold text-sm">
                    <span className="material-symbols-outlined text-lg">park</span>
                    Nhà thám hiểm rừng xanh
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  {[{ label: 'Vận động', value: '30p' }, { label: 'Động tác', value: '45' }, { label: 'Câu chuyện', value: '2' }].map(({ label, value }) => (
                    <div key={label} className="text-center md:text-left">
                      <span className="block text-[10px] font-black text-[#82807c] uppercase tracking-widest mb-1">{label}</span>
                      <span className="text-2xl font-black text-[#383835]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 pr-4">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-[#f1ece1]" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                    <circle className="text-[#FFC107]" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="83.7" strokeLinecap="round" strokeWidth="8"></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black">20</span>
                    <span className="text-[9px] font-bold text-[#82807c]">/30 PHÚT</span>
                  </div>
                </div>
                <span className="text-[10px] font-black text-[#82807c] uppercase tracking-wider">Mục tiêu ngày</span>
              </div>
            </section>

            {/* Parent Controls */}
            <section className="lg:col-span-5 space-y-4">
              {[
                { icon: 'lock', bg: 'bg-orange-100', iconColor: 'text-orange-400', title: 'Kiểm soát nội dung', sub: 'Quản lý các câu chuyện phù hợp' },
                { icon: 'menu_book', bg: 'bg-yellow-100', iconColor: 'text-yellow-500', title: 'Sở thích câu chuyện', sub: 'Chủ đề: Động vật, Không gian, Phép thuật' },
                { icon: 'videocam', bg: 'bg-teal-100', iconColor: 'text-teal-500', title: 'Quyền camera', sub: 'Quản lý quyền truy cập theo dõi vận động' },
              ].map(({ icon, bg, iconColor, title, sub }) => (
                <div key={title} className="bg-white/60 hover:bg-white/80 transition-all rounded-[2rem] p-5 flex items-center justify-between shadow-sm cursor-pointer group border border-white/20">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-[1rem] ${bg} flex items-center justify-center shadow-inner`}>
                      <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#383835]">{title}</h4>
                      <p className="text-xs text-[#656461]">{sub}</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#82807c] group-hover:translate-x-1 transition-transform">chevron_right</span>
                </div>
              ))}
            </section>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Recent Activity */}
            <section className="lg:col-span-4 flex flex-col gap-6">
              <h3 className="text-xl font-black flex items-center gap-2 ml-4">Hoạt động gần đây</h3>
              <div className="bg-white/60 rounded-[2.5rem] p-8 shadow-sm flex-1 relative border border-white/20">
                <div className="space-y-10 relative">
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-200"></div>
                  {[
                    { dot: 'bg-[#FF7F50]', title: 'Bí mật Khu Rừng Thầm Thì', time: 'Hôm nay, 4:15 CH', badge: 'Huy hiệu Lá', moves: '15 Nhảy' },
                    { dot: 'bg-[#bbb9b4]', title: 'Đồng cỏ Ánh Trăng', time: 'Hôm qua, 5:30 CH', badge: 'Huy hiệu Cú', moves: '10 Xoay' },
                  ].map(({ dot, title, time, badge, moves }) => (
                    <div key={title} className="relative pl-10">
                      <div className={`absolute left-0 top-1 w-6 h-6 rounded-full ${dot} border-4 border-white shadow-sm`}></div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-[#383835]">{title}</h4>
                          <span className="text-[10px] font-bold text-[#82807c] uppercase">{time}</span>
                        </div>
                        <div className="flex gap-3">
                          <span className="flex items-center gap-1 text-[10px] font-black text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full uppercase">
                            <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                            {badge}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-black text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full uppercase">
                            <span className="material-symbols-outlined text-xs">directions_run</span>
                            {moves}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Badge Collection */}
            <section className="lg:col-span-8 flex flex-col gap-6">
              <div className="flex justify-between items-center ml-4">
                <h3 className="text-xl font-black">Bộ sưu tập Huy hiệu</h3>
                <a className="text-sm font-black text-[#E07A5F] hover:underline" href="#">Xem tất cả</a>
              </div>
              <div className="bg-white/60 rounded-[2.5rem] p-10 shadow-sm grid grid-cols-4 gap-y-12 border border-white/20">
                {badges.map(({ icon, color, label, earned }) => (
                  <div key={label} className={`flex flex-col items-center gap-3 ${!earned ? 'opacity-40' : ''}`}>
                    {earned ? (
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${color} flex items-center justify-center shadow-md border-2 border-white transform hover:scale-110 transition-transform cursor-pointer`}>
                        <span className="material-symbols-outlined text-3xl text-white" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl text-gray-400">{icon}</span>
                      </div>
                    )}
                    <div className="text-center">
                      <p className="text-xs font-black text-[#383835]">{label}</p>
                      <span className="text-[8px] font-black text-[#82807c] uppercase tracking-wider">{earned ? 'Đã đạt' : 'Khóa'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>

        {/* Floating Mascot */}
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end group">
          <div className="bg-white/90 backdrop-blur-md p-5 rounded-[1.5rem] shadow-2xl mb-4 max-w-[280px] relative border border-white/40 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100">
            <p className="text-sm font-bold text-[#383835] leading-snug">
              "Leo đang làm rất tốt! Chỉ còn 10 phút nữa là cậu bé sẽ đạt mục tiêu ngày rồi."
            </p>
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white/90 rotate-45 border-r border-b border-white/40"></div>
          </div>
          <div className="w-[110px] h-[110px] rounded-full bg-gradient-to-br from-white to-[#f5f3ef] border-4 border-white shadow-[0_15px_35px_rgba(122,78,176,0.2),inset_0_2px_4px_rgba(0,0,0,0.05)] p-0 flex items-center justify-center overflow-hidden">
            <img
              alt="Lio Mascot"
              className="w-full h-full object-cover scale-125 hover:scale-140 transition-transform duration-300 pointer-events-auto cursor-pointer"
              src="/avt_Lio.png"
            />
          </div>
        </div>
      </div>
    </>
  );
};
