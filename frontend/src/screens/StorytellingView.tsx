import React from 'react';

export const StorytellingView: React.FC = () => {
  return (
    <>
      <style>{`
        .storytelling-body {
          font-family: 'Be Vietnam Pro', sans-serif;
          background-color: #fffcf7;
          color: #383835;
          overflow: hidden;
          height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .watercolor-overlay {
          background:
            radial-gradient(circle at 20% 30%, rgba(197, 150, 254, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(112, 248, 232, 0.1) 0%, transparent 50%);
        }
        .speech-bubble-tail {
          clip-path: polygon(100% 0, 0 0, 100% 100%);
        }
      `}</style>

      <div className="storytelling-body">
        {/* Header */}
        <header className="w-full sticky top-0 bg-[#fffcf7] z-[100] flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-purple-800">MoveMyth</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-purple-700 hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </header>

        {/* Main Content Canvas */}
        <main className="flex-grow relative overflow-hidden flex flex-col items-center justify-center px-4 md:px-20 watercolor-overlay">
          {/* Immersive Background */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <img
              alt="Watercolor magical forest"
              className="w-full h-full object-cover opacity-60 mix-blend-multiply blur-[2px]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJIQfvsSe9ibBC1Vd3sfrXcVN1SGlztzITKuuYEz6Z7e7Ts7MibIsp95HaptvaXUCAXc4_AJzwYctNlX27C3yfa6kFOUVoooTJTDRYSW6m6IG7bWc0eBoQ5AcVHfrrk4Ln4y3GWqxotHYWTEVM6lDSXRsaTUdo_mGGsgPKWYAhPD10aUJM453RiWhgwaLJXXZIQbUhLe5hs0SWbGd3N9M1hVvegPNPdsRgIv9CTK3Lw010tKDhgj8nFxFJ0SaqjBl22omawxll98uo"
            />
            {/* Sparkle Overlays */}
            <div className="absolute top-1/4 left-1/4 text-[#f8a826] opacity-40">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            </div>
            <div className="absolute bottom-1/3 right-1/4 text-[#f8a826] opacity-30">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>colors_spark</span>
            </div>
            <div className="absolute top-1/2 right-10 text-[#c596fe] opacity-40">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>magic_button</span>
            </div>
          </div>

          {/* Camera PiP Window */}
          <div className="absolute top-8 right-8 z-50">
            <div className="w-40 h-52 md:w-56 md:h-72 rounded-[1rem] overflow-hidden border-4 border-[#70f8e8] shadow-[0_0_20px_rgba(112,248,232,0.4)] bg-[#e5e2dc] relative">
              <img
                alt="Camera feed placeholder"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcoqp_dN8RHuOgPPSkmh4kHMRHlRVrUKzwGIyVHvFPnlWPoE-wb3MNZNe2izqMaLzyX-X8XRAPoybaam5TsRj4bx8qQFHJQ45EqitmTcbHzJnwWgPdCbV86THVXK1cLceg0fUHBetE0AH05_kvjuyIt57EzB2zKsT6q2iqBZwwGFm7xrfEbVA1lEPx-zwPBjby2Cd1OudIdOdS1_qcBpBgDuH2IBuqSLN3oZye0eeG3awUNzw6aKggOUjalT0ZqhYf26b9D1QLVsUm"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full">
                <div className="w-2 h-2 rounded-full bg-[#c12048] animate-pulse"></div>
                <span className="text-[10px] text-white font-bold tracking-widest uppercase">LIVE</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>

          {/* Narrative Text Card */}
          <section className="max-w-3xl w-full z-20">
            <div className="bg-white/80 backdrop-blur-lg rounded-[1rem] p-10 md:p-16 shadow-[0_32px_64px_rgba(73,25,125,0.12)] border border-[#bbb9b4]/15 text-center relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#f8a826] text-[#4e3000] px-6 py-2 rounded-full font-bold shadow-lg whitespace-nowrap">
                Part 1: The Crystal Grove
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-[#383835] leading-tight mb-8">
                Then, with a gentle <span className="text-[#7a4eb0] italic">whoosh</span>, the trees began to dance...
              </h1>
              <p className="text-xl md:text-2xl text-[#656461] font-medium leading-relaxed">
                Lio looked up and saw the emerald leaves glowing with a soft, pulsing light. "Are you ready for the adventure?" he whispered.
              </p>
              <div className="mt-12 flex justify-center gap-6">
                <button className="group relative px-8 py-4 bg-[#7a4eb0] text-white rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_8px_20px_rgba(122,78,176,0.3)]">
                  Tap to Discover
                  <span className="absolute -top-2 -right-2 text-[#f8a826] opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  </span>
                </button>
              </div>
            </div>
          </section>

          {/* Lio & Speech Bubble */}
          <div className="absolute bottom-32 left-8 md:left-20 z-40 flex items-end gap-2 group">
            <div className="relative w-32 h-32 md:w-48 md:h-48">
              <img
                alt="Lio the purple creature"
                className="w-full h-full object-contain drop-shadow-2xl"
                src="/avt_Lio.png"
              />
            </div>
            <div className="mb-12 md:mb-20 -ml-4 relative">
              <div className="bg-white border border-[#bbb9b4]/15 p-6 rounded-[1rem] rounded-bl-none shadow-[0_16px_32px_rgba(73,25,125,0.08)] max-w-xs">
                <p className="text-[#383835] font-semibold text-lg leading-snug">
                  "Look at the sparkles! Can you reach up and touch them?"
                </p>
              </div>
              <div className="absolute -bottom-4 left-0 w-8 h-4 bg-white speech-bubble-tail border-r border-b border-[#bbb9b4]/15"></div>
            </div>
          </div>
        </main>

        {/* Bottom Navigation Shell */}
        <nav className="fixed bottom-0 w-full flex justify-around items-center px-8 pb-8 z-50">
          <div className="fixed bottom-4 left-4 right-4 rounded-[3rem] h-20 z-50 bg-white/80 backdrop-blur-lg flex justify-around items-center shadow-[0_8px_32px_rgba(73,25,125,0.08)]">
            <a className="flex flex-col items-center justify-center bg-purple-100 text-purple-800 rounded-full w-16 h-16 shadow-[0_0_15px_#c596fe] hover:scale-105 transition-transform" href="#">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
              <span className="font-semibold text-xs mt-0.5">Story</span>
            </a>
            <a className="flex flex-col items-center justify-center text-purple-300 hover:scale-105 transition-transform" href="#">
              <span className="material-symbols-outlined">headset</span>
              <span className="font-semibold text-xs mt-0.5">Listen</span>
            </a>
            <a className="flex flex-col items-center justify-center text-purple-300 hover:scale-105 transition-transform" href="#">
              <span className="material-symbols-outlined">extension</span>
              <span className="font-semibold text-xs mt-0.5">Play</span>
            </a>
          </div>
        </nav>
      </div>
    </>
  );
};
