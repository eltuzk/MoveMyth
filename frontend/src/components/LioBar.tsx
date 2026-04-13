import React from 'react';

export interface LioBarProps {
  speechText?: string;
  isListening?: boolean;
}

export const LioBar: React.FC<LioBarProps> = ({ 
  speechText = "Look at that, Little Explorer!", 
  isListening = true 
}) => {
  return (
    <div className="sticky bottom-0 z-[100] w-full bg-white border-t border-[#bbb9b4]/20 rounded-t-[20px] shadow-[0_-4px_16px_rgba(0,0,0,0.02)] px-6 py-4 flex items-center justify-between shrink-0 font-['Be_Vietnam_Pro']" style={{ height: '80px' }}>
      {/* Left Base: Avatar & Speech */}
      <div className="flex items-center gap-4 flex-1">
        {/* Avatar */}
        <div className="w-[52px] h-[52px] rounded-full bg-[#fcf9f4] border border-[#bbb9b4]/20 p-1 flex-shrink-0">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuArQ6txpD8QdO7FWcqMH4N3U1IKbQaBGfK3cSz-i5sreNilnWiK32RtYGOGkJEewxsPkBEZrIoxETSczD2dfUm6touH8YqG9wtWwHbT9cRPdBrIEes_p-PFRUshR8-lgZw1poGaqe31Aqg9l875ogjnVUicoYKXADDNsjh4Ed3qAg8vunsy0Gn4LpVDewGfyhE8W6SjfPbrgjxfMn_GdyjorLhBu0Y5LlOC26gArwxLlP-nrlMzUSEtoYZE7h9GmqS_GP_EYb16EROR" 
            alt="Lio PIP" 
            className="w-full h-full object-cover rounded-full" 
          />
        </div>

        {/* Text Container */}
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <span className="text-[10px] font-bold text-[#007168] tracking-wider uppercase">
            LIO ĐANG {isListening ? 'NGHE' : 'NÓI'}...
          </span>
          <p className="text-[#383835] text-[16px] font-medium truncate">
            {speechText}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4 shrink-0 pl-4 border-l border-[#bbb9b4]/10">
        {/* Waveform */}
        <div className="hidden sm:flex items-center gap-1 opacity-50">
          <div className="w-[3px] h-[8px] bg-[#7a4eb0] rounded-full animate-pulse"></div>
          <div className="w-[3px] h-[16px] bg-[#7a4eb0] rounded-full animate-pulse delay-75"></div>
          <div className="w-[3px] h-[12px] bg-[#7a4eb0] rounded-full animate-pulse delay-150"></div>
          <div className="w-[3px] h-[8px] bg-[#7a4eb0] rounded-full animate-pulse delay-75"></div>
        </div>

        {/* Mic Button */}
        <button className="w-[40px] h-[40px] rounded-full bg-[#7a4eb0] text-white flex items-center justify-center hover:bg-[#613696] active:scale-95 transition-all">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            mic
          </span>
        </button>
      </div>
    </div>
  );
};
