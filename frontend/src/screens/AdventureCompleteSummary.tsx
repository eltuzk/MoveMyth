import React from 'react';
import { useNavigate } from 'react-router-dom';

export const AdventureCompleteSummary: React.FC = () => {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate('/');
  };

  return (
    <>
      <style>{`
        .glass-card {
          background: rgba(255, 252, 247, 0.8);
          backdrop-filter: blur(16px);
        }
        .text-shadow-glow {
          text-shadow: 0 0 20px rgba(122, 78, 176, 0.2);
        }
      `}</style>
      
      {/* Background layer */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#FAF7F2] to-[#FFF0D6] pointer-events-none"></div>

      <div className="relative z-10 flex-1 flex flex-col min-h-[calc(100vh-136px)] pt-6">
        {/* Scrollable middle content */}
        <main className="flex-1 pb-16">
          <div className="max-w-4xl mx-auto px-6 py-8 md:py-12 relative">
            {/* Mascot Overlap */}
            <div className="absolute -top-12 right-0 md:right-8 w-32 md:w-48 z-10 drop-shadow-2xl transform rotate-12">
              <img
                alt="Lio the fox mascot celebrating"
                className="w-full h-auto"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDSKLb22rWwwsbjRyFgxZmvIHc0qoKEI1o9XMeTM3AUU05SxH6IGNzcP2NZ4ZLVytf5bg_WzIptHI8tHOzHPCRJ8W97qP8ceH6cDQ0rF3awb5sXpsRfEiSqh7pSxuGES5MRgf96cMSatXvOFN9EN1UCFJclRJizMYPosXz5em07g-SeLVTDT9mKNIyKyCBfeJmh56A8Wadd-g9qxXbG0A2Uo8WTpuJ6VvPWlSqu36pYMaK71K5g8b9nPIbomTD8StoKzk0UG-59qW-"
              />
            </div>

            {/* Header Section */}
            <div className="mb-10 relative">
              <h1 className="text-4xl md:text-6xl font-black text-[#49197d] tracking-tight text-shadow-glow mb-2">
                Hành trình hoàn tất! 🏆
              </h1>
              <p className="text-lg text-[#656461] font-medium italic">Con là một nhà thám hiểm tài ba thực thụ!</p>
            </div>

            {/* Main Summary Card */}
            <div className="bg-white rounded-[1.5rem] shadow-[32px_0_32px_-4px_rgba(73,25,125,0.08)] p-8 md:p-12 relative overflow-hidden border border-purple-100/50">
              <div className="absolute top-0 right-0 p-4">
                <span className="material-symbols-outlined text-[#f8a826] text-4xl opacity-40">auto_awesome</span>
              </div>
              <div className="flex flex-col items-center text-center">
                {/* Lio Avatar */}
                <div className="w-24 h-24 rounded-full bg-[#c596fe]/20 flex items-center justify-center mb-6 overflow-hidden border-2 border-[#c596fe]/30 shadow-inner">
                  <img
                    alt="Lio the mascot waving"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtlURl52xJn7paeRTmLNz-fb8qwMXNA7aNjDxtp8ZlTt78qKRE6SiI218TJGuQ4GdXsabPt3idVlsLjjZIzifwGl7cYfoBszPsFka58I85MGYCMu5eKKBlAm8rcUw9GyQw4QF3W1l4pzOPvg10fEisNWrJnVdxO-MMD4_35W5ImSSbXarKUhrPa33428PrAgETPR0vOHG6FuNhTtuBcKkECsathwv9PwN81KxVwqdRm42qJQpImGUSSE4TQoLNL02H6mdxUQbxzS3R"
                  />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#383835] mb-4">Bí mật của Khu Rừng Thầm Thì</h2>
                <p className="text-lg text-[#656461] leading-relaxed max-w-2xl mb-10">
                  Con đã giúp Lio tìm thấy viên pha lê bị mất và cứu cả khu rừng! Lòng dũng cảm của con đã làm phép thuật cổ xưa sống lại.
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-10">
                  <div className="bg-[#fcf9f4] rounded-[1.2rem] p-6 flex flex-col items-center border border-[#bbb9b4]/10 transition-all hover:shadow-md hover:border-[#7a4eb0]/30 group">
                    <span className="material-symbols-outlined text-[#7a4eb0] text-3xl mb-2 group-hover:scale-110 transition-transform">directions_run</span>
                    <span className="text-2xl font-black text-[#383835]">15 Nhảy</span>
                    <span className="text-sm text-[#656461] font-medium uppercase tracking-wider">Vận động</span>
                  </div>
                  <div className="bg-[#fcf9f4] rounded-[1.2rem] p-6 flex flex-col items-center border border-[#bbb9b4]/10 transition-all hover:shadow-md hover:border-[#007168]/30 group">
                    <span className="material-symbols-outlined text-[#007168] text-3xl mb-2 group-hover:scale-110 transition-transform">auto_stories</span>
                    <span className="text-2xl font-black text-[#383835]">5 Phần</span>
                    <span className="text-sm text-[#656461] font-medium uppercase tracking-wider">Câu chuyện</span>
                  </div>
                  <div className="bg-[#fcf9f4] rounded-[1.2rem] p-6 flex flex-col items-center border border-[#bbb9b4]/10 transition-all hover:shadow-md hover:border-[#f8a826]/30 group">
                    <span className="material-symbols-outlined text-[#8b5a00] text-3xl mb-2 group-hover:scale-110 transition-transform">schedule</span>
                    <span className="text-2xl font-black text-[#383835]">12 Phút</span>
                    <span className="text-sm text-[#656461] font-medium uppercase tracking-wider">Thời gian</span>
                  </div>
                </div>

                {/* Journey Timeline */}
                <div className="w-full mb-10">
                  <h3 className="text-xl font-bold text-[#383835] mb-8 text-left flex items-center gap-2">
                    Hành trình của con <span className="text-[#f8a826] material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                  </h3>
                  <div className="flex flex-nowrap md:justify-between items-center gap-4 overflow-x-auto pb-6">
                    {[
                      { alt: 'Forest entrance', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEW1PZYliargXTbKjv8qZrTz5_MOc2X_28GV1z0CuKj8FVtf9QuI4r3QPEltsGpkLktFwrJJOBSlTg5-6aKF7uTb7nZqR-HpnuDedODhN6VW0fLZYd8cF3waKBI_gPe9lvKgp8t3oEm55GzCueUCU7ahvRZQN3-mxSDdEEnXv9qEZRwViNN_fS3TMTIBVbuBGRwEdtWh_A0YJJQPGBi6rbdNXo85mvel_cha-zyZplojNCZbRDoGKNHnAse-kqeBapPkAYM9rSYq_t' },
                      { alt: 'Lio meets a friend', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsF0dAWqqNmKRK80tGWOVn08sIiAp-Llsh7dSqBufBSMXKBk-GvhEdsuez3oBSpxsoahR8X6DnqvKoWD0WJoE69nfsQIHX6RgY9JKwcnEHVkQL8rVnYisu1XTyKO1R2M-rZ1oH6KfbCeVWzODAut-KJz1YAg6zdrQtBLRYr-PtBDBlaaFhc31i6LegpIDpI2ys5a6CfXS11do9CWs0IC0xfuI9QloVM0UzV7Zkvm0Ewl6UnHK9AMLSAnwupkJwz-pB9CGMnmsTDU6T' },
                      { alt: 'Finding the crystal', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO_M6DyzJm1_FuD60xUQurcEcQIbnOrbdP0VZ75ee574bfwnxbFekRQVmYccWQ48fEwisONLrygwRHctqj7Lq4K-mUpdHS4gpUwTAQmIOJ0fcplXInreK_eixnTuGFsIi89qymawNOk22r_P6NVw7KmBSFsJKN0iuXDLbquSycvJ09agJxjGmTwv_Ze0kPBsybFFHZqtX6lx0WahFfouz55cZWkw6eC6iZTWB0oWooeMUVTgYXwIP8LGgf4VKMN1xqLc1ptlzdp4qk' },
                      { alt: 'Saving the forest', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ16KCPb8pOXZROM8XI-aURI99IalBNZ1-RZqZQ3XYaklq0tCqkbe4DaVJNetoGSYfO3Nd-mUo_nf0yOsNSYCn5ReXqVLpYiw1MLKsLvr2GzJOrmngXzEeKBwJYLovRv5sYwpwJXWx0aTXTyb-iQTkyjcysQMriGyCzFmYUnoeULWhNP7hVYQ_jw5kU1EWD8JzN7oKb8o9Ri6jh6EIcQWAgH_wCyChsIXArkA3YAZQlUTNy9ORxn0_GFQnSbSx8ULKPgRUxKaW02_0' },
                      { alt: 'The celebration', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBH7jqGO5scGQP3QSsTulPkAfTsO4epUCYFJAO34ZZKhXHQhtB4k6SHpgzGb6U-oUPTj4_xdZl7c7Plbl-R7OfuiZkhY0A3mL_McvdYvj3MwrkhxuygjkGSSo0gCGyoQSPyGfl2nxb9bqUCEmzgtmmrbS6sNekhNYybLSSBhxHJVAGGWMnkbHxgpm-9xIOUV-iIpqtyX0KIcyXBPNaSfRy7F5-b_NNQtoKAl2Y0BXnnknF_IKubtaULtyMhUjClDvDe_siZnMA-wtGi' },
                    ].map((scene, i) => (
                      <React.Fragment key={i}>
                        <div className="flex-shrink-0 flex flex-col items-center relative">
                          <div className="w-20 h-20 rounded-full border-4 border-[#007168] p-1 bg-[#f6f3ee] relative shadow-md">
                            <img alt={scene.alt} className="w-full h-full object-cover rounded-full" src={scene.src} />
                            <div className="absolute -top-1 -right-1 bg-[#007168] text-white rounded-full w-6 h-6 flex items-center justify-center border-2 border-[#fffcf7] shadow-sm">
                              <span className="material-symbols-outlined text-xs font-bold font-black">check</span>
                            </div>
                          </div>
                        </div>
                        {i < 4 && <div className="hidden md:block flex-grow h-px border-t-2 border-dotted border-[#bbb9b4] mx-2"></div>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Bottom CTAs */}
                <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
                  <button 
                    onClick={handleHome}
                    className="px-8 py-4 rounded-full border-2 border-[#7a4eb0] text-[#7a4eb0] font-bold text-lg hover:bg-[#7a4eb0]/5 transition-all active:scale-90 min-w-[200px]"
                  >
                    Chơi lại (Demo)
                  </button>
                  <button 
                    onClick={handleHome}
                    className="px-8 py-4 rounded-full bg-[#f8a826] text-[#4e3000] font-black text-lg shadow-xl shadow-amber-500/30 hover:scale-105 transition-transform active:scale-95 min-w-[200px] flex items-center justify-center gap-2"
                  >
                    Hoàn tất quá trình
                    <span className="material-symbols-outlined">task_alt</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
