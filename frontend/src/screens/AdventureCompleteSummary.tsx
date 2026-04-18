import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

export const AdventureCompleteSummary: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Fireworks effect on mount
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

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

      <div className="relative z-10 flex flex-col h-screen overflow-hidden">
        {/* Main centered content */}
        <main className="flex-1 flex flex-col justify-start items-center px-4 pt-16 w-full h-[calc(100vh-100px)]">
          <div className="w-full max-w-3xl relative flex flex-col">
            
            {/* Header Section */}
            <div className="mb-4 text-center">
              <h1 className="text-3xl md:text-5xl font-black text-[#49197d] tracking-tight text-shadow-glow mb-1">
                Hành trình hoàn tất! 🏆
              </h1>
              <p className="text-base text-[#656461] font-medium italic">Con là một nhà thám hiểm tài ba thực thụ!</p>
            </div>

            {/* Main Summary Card */}
            <div className="bg-white rounded-[1.5rem] shadow-[32px_0_32px_-4px_rgba(73,25,125,0.08)] px-6 py-6 border border-purple-100/50 relative">
              <div className="absolute top-0 right-0 p-4">
                <span className="material-symbols-outlined text-[#f8a826] text-3xl opacity-40">auto_awesome</span>
              </div>
              
              <div className="flex flex-col items-center text-center">
                {/* Lio Avatar */}
                <div className="w-16 h-16 rounded-full bg-[#c596fe]/20 flex items-center justify-center mb-4 overflow-hidden border-2 border-[#c596fe]/30 shadow-inner block">
                  <img
                    alt="Lio the mascot waving"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtlURl52xJn7paeRTmLNz-fb8qwMXNA7aNjDxtp8ZlTt78qKRE6SiI218TJGuQ4GdXsabPt3idVlsLjjZIzifwGl7cYfoBszPsFka58I85MGYCMu5eKKBlAm8rcUw9GyQw4QF3W1l4pzOPvg10fEisNWrJnVdxO-MMD4_35W5ImSSbXarKUhrPa33428PrAgETPR0vOHG6FuNhTtuBcKkECsathwv9PwN81KxVwqdRm42qJQpImGUSSE4TQoLNL02H6mdxUQbxzS3R"
                  />
                </div>
                
                <h2 className="text-xl md:text-2xl font-bold text-[#383835] mb-2">Bí mật của Khu Rừng Thầm Thì</h2>
                <p className="text-base text-[#656461] leading-relaxed max-w-2xl mb-5">
                  Con đã giúp Lio tìm thấy viên pha lê bị mất và cứu cả khu rừng! Lòng dũng cảm của con đã làm phép thuật cổ xưa sống lại.
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-6">
                  <div className="bg-[#fcf9f4] rounded-[1rem] p-4 flex flex-col items-center border border-[#bbb9b4]/10">
                    <span className="material-symbols-outlined text-[#7a4eb0] text-2xl mb-1 mt-1">directions_run</span>
                    <span className="text-xl font-black text-[#383835]">15 Nhảy</span>
                    <span className="text-xs text-[#656461] font-medium uppercase tracking-wider">Vận động</span>
                  </div>
                  <div className="bg-[#fcf9f4] rounded-[1rem] p-4 flex flex-col items-center border border-[#bbb9b4]/10">
                    <span className="material-symbols-outlined text-[#007168] text-2xl mb-1 mt-1">auto_stories</span>
                    <span className="text-xl font-black text-[#383835]">5 Phần</span>
                    <span className="text-xs text-[#656461] font-medium uppercase tracking-wider">Câu chuyện</span>
                  </div>
                  <div className="bg-[#fcf9f4] rounded-[1rem] p-4 flex flex-col items-center border border-[#bbb9b4]/10">
                    <span className="material-symbols-outlined text-[#8b5a00] text-2xl mb-1 mt-1">schedule</span>
                    <span className="text-xl font-black text-[#383835]">12 Phút</span>
                    <span className="text-xs text-[#656461] font-medium uppercase tracking-wider">Thời gian</span>
                  </div>
                </div>

                {/* Journey Timeline */}
                <div className="w-full overflow-hidden block">
                  <h3 className="text-lg font-bold text-[#383835] mb-3 text-left flex items-center gap-2">
                    Hành trình của con <span className="text-[#f8a826] material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                  </h3>
                  <div className="flex flex-nowrap justify-between w-full items-center gap-2 pb-2">
                    {[
                      { alt: 'Forest entrance', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEW1PZYliargXTbKjv8qZrTz5_MOc2X_28GV1z0CuKj8FVtf9QuI4r3QPEltsGpkLktFwrJJOBSlTg5-6aKF7uTb7nZqR-HpnuDedODhN6VW0fLZYd8cF3waKBI_gPe9lvKgp8t3oEm55GzCueUCU7ahvRZQN3-mxSDdEEnXv9qEZRwViNN_fS3TMTIBVbuBGRwEdtWh_A0YJJQPGBi6rbdNXo85mvel_cha-zyZplojNCZbRDoGKNHnAse-kqeBapPkAYM9rSYq_t' },
                      { alt: 'Lio meets a friend', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsF0dAWqqNmKRK80tGWOVn08sIiAp-Llsh7dSqBufBSMXKBk-GvhEdsuez3oBSpxsoahR8X6DnqvKoWD0WJoE69nfsQIHX6RgY9JKwcnEHVkQL8rVnYisu1XTyKO1R2M-rZ1oH6KfbCeVWzODAut-KJz1YAg6zdrQtBLRYr-PtBDBlaaFhc31i6LegpIDpI2ys5a6CfXS11do9CWs0IC0xfuI9QloVM0UzV7Zkvm0Ewl6UnHK9AMLSAnwupkJwz-pB9CGMnmsTDU6T' },
                      { alt: 'Finding the crystal', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO_M6DyzJm1_FuD60xUQurcEcQIbnOrbdP0VZ75ee574bfwnxbFekRQVmYccWQ48fEwisONLrygwRHctqj7Lq4K-mUpdHS4gpUwTAQmIOJ0fcplXInreK_eixnTuGFsIi89qymawNOk22r_P6NVw7KmBSFsJKN0iuXDLbquSycvJ09agJxjGmTwv_Ze0kPBsybFFHZqtX6lx0WahFfouz55cZWkw6eC6iZTWB0oWooeMUVTgYXwIP8LGgf4VKMN1xqLc1ptlzdp4qk' },
                      { alt: 'Saving the forest', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ16KCPb8pOXZROM8XI-aURI99IalBNZ1-RZqZQ3XYaklq0tCqkbe4DaVJNetoGSYfO3Nd-mUo_nf0yOsNSYCn5ReXqVLpYiw1MLKsLvr2GzJOrmngXzEeKBwJYLovRv5sYwpwJXWx0aTXTyb-iQTkyjcysQMriGyCzFmYUnoeULWhNP7hVYQ_jw5kU1EWD8JzN7oKb8o9Ri6jh6EIcQWAgH_wCyChsIXArkA3YAZQlUTNy9ORxn0_GFQnSbSx8ULKPgRUxKaW02_0' },
                      { alt: 'The celebration', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBH7jqGO5scGQP3QSsTulPkAfTsO4epUCYFJAO34ZZKhXHQhtB4k6SHpgzGb6U-oUPTj4_xdZl7c7Plbl-R7OfuiZkhY0A3mL_McvdYvj3MwrkhxuygjkGSSo0gCGyoQSPyGfl2nxb9bqUCEmzgtmmrbS6sNekhNYybLSSBhxHJVAGGWMnkbHxgpm-9xIOUV-iIpqtyX0KIcyXBPNaSfRy7F5-b_NNQtoKAl2Y0BXnnknF_IKubtaULtyMhUjClDvDe_siZnMA-wtGi' },
                    ].map((scene, i) => (
                      <React.Fragment key={i}>
                        <div className="flex-shrink-0 flex flex-col items-center relative">
                          <div className="w-14 h-14 rounded-full border-[3px] border-[#007168] p-1 bg-[#f6f3ee] relative shadow-sm">
                            <img alt={scene.alt} className="w-full h-full object-cover rounded-full" src={scene.src} />
                            <div className="absolute -top-1 -right-1 bg-[#007168] text-white rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#fffcf7] shadow-sm">
                              <span className="material-symbols-outlined text-[10px] font-bold font-black">check</span>
                            </div>
                          </div>
                        </div>
                        {i < 4 && <div className="hidden sm:block flex-grow h-px border-t-[2px] border-dotted border-[#bbb9b4] mx-1"></div>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        {/* Custom Praise Lio Bar */}
        <div className="w-full flex justify-center py-4 px-6 fixed bottom-0 z-[100] pb-6">
          <div className="bg-[#f2f1ef]/95 backdrop-blur-xl border border-white/60 shadow-[0_10px_40px_rgba(0,0,0,0.12)] rounded-full px-8 py-3 flex items-center gap-5 max-w-5xl w-full">
            {/* Lio Avatar */}
            <div className="shrink-0">
              <div className="w-16 h-16 rounded-full border-[3px] border-white shadow-md overflow-hidden bg-white">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuArQ6txpD8QdO7FWcqMH4N3U1IKbQaBGfK3cSz-i5sreNilnWiK32RtYGOGkJEewxsPkBEZrIoxETSczD2dfUm6touH8YqG9wtWwHbT9cRPdBrIEes_p-PFRUshR8-lgZw1poGaqe31Aqg9l875ogjnVUicoYKXADDNsjh4Ed3qAg8vunsy0Gn4LpVDewGfyhE8W6SjfPbrgjxfMn_GdyjorLhBu0Y5LlOC26gArwxLlP-nrlMzUSEtoYZE7h9GmqS_GP_EYb16EROR" 
                  alt="Lio" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Praise Message */}
            <div className="flex-1 flex flex-col justify-center px-2">
              <span className="text-[#007168] font-bold text-lg">
                Con đã hoàn thành xuất sắc! Lio rất tự hào về con! 🎉
              </span>
            </div>

            {/* Proceed Action Button */}
            <button 
              onClick={handleHome}
              className="bg-[#7a4eb0] text-white px-8 py-3 rounded-full flex items-center gap-2 shadow-lg hover:bg-[#6c429e] hover:scale-105 active:scale-95 transition-all group shrink-0"
            >
              <span className="font-black text-lg">Tiếp tục</span>
              <span className="material-symbols-outlined text-[24px] group-hover:translate-x-1 transition-transform font-bold">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
