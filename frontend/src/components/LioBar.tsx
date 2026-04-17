export interface LioBarProps {
  speechText?: string;
  isListening?: boolean;
  showProgress?: boolean;
  currentProgress?: number;
  totalProgress?: number;
  progressLabel?: string;
  onAction?: () => void;
  actionIcon?: string;
  actionLabel?: string;
}

export const LioBar: React.FC<LioBarProps> = ({ 
  speechText = "Look at that, Little Explorer!", 
  isListening = true,
  showProgress = false,
  currentProgress = 0,
  totalProgress = 0,
  progressLabel = "TIẾN ĐỘ",
  onAction,
  actionIcon = "mic",
  actionLabel = "Xong!"
}) => {
  return (
    <div className="w-full flex justify-center py-6 px-6 pointer-events-none sticky bottom-0 z-[100]">
      <div className="bg-[#f2f1ef]/95 backdrop-blur-xl border border-white/60 shadow-[0_20px_80px_rgba(0,0,0,0.15)] rounded-full px-10 py-4 flex items-center gap-6 max-w-7xl w-full pointer-events-auto">
        
        {/* Lio Avatar */}
        <div className="shrink-0">
          <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuArQ6txpD8QdO7FWcqMH4N3U1IKbQaBGfK3cSz-i5sreNilnWiK32RtYGOGkJEewxsPkBEZrIoxETSczD2dfUm6touH8YqG9wtWwHbT9cRPdBrIEes_p-PFRUshR8-lgZw1poGaqe31Aqg9l875ogjnVUicoYKXADDNsjh4Ed3qAg8vunsy0Gn4LpVDewGfyhE8W6SjfPbrgjxfMn_GdyjorLhBu0Y5LlOC26gArwxLlP-nrlMzUSEtoYZE7h9GmqS_GP_EYb16EROR" 
              alt="Lio" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Speech Bubble */}
        <div className="relative bg-white px-8 py-4 rounded-[2rem] border border-white/50 flex items-center ml-2 shadow-sm max-w-lg">
          <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-white rotate-45 border-l border-b border-white/50"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-[#007168] tracking-[0.15em] uppercase mb-1">
              Lio Đang {isListening ? 'Nghe' : 'Nói'}...
            </span>
            <span className="text-[#7a4eb0] font-bold text-lg leading-tight">
              {speechText}
            </span>
          </div>
        </div>

        <div className="flex-1"></div>

        {/* Conditional Progress Area */}
        {showProgress && (
          <div className="flex flex-col items-end px-6 border-r border-[#bbb9b4]/20 mr-2">
            <span className="text-[11px] font-black text-[#8B8BA0] uppercase tracking-widest mb-1">
              CURRENT PROGRESS
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-[#b58e3d] italic leading-none">
                {currentProgress}/{totalProgress}
              </span>
              <span className="text-sm font-black text-[#b58e3d] leading-none uppercase">
                {progressLabel}
              </span>
            </div>
          </div>
        )}

        {/* Main Action Button */}
        <button 
          onClick={onAction}
          className={`${
            showProgress ? 'bg-[#007b63]' : 'bg-[#7a4eb0]'
          } text-white px-8 py-4 rounded-full flex items-center gap-3 shadow-lg hover:scale-105 active:scale-95 transition-all group`}
        >
          <span className="font-black text-xl">{showProgress ? actionLabel : 'Đang nghe...'}</span>
          <span className="material-symbols-outlined text-[28px] group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>
            {showProgress ? 'check_circle' : actionIcon}
          </span>
        </button>
      </div>
    </div>
  );
};
