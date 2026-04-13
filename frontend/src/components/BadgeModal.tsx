import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface BadgeModalProps {
  isOpen: boolean;
  onClose?: () => void;
  hasMoreScenes?: boolean;
}

export const BadgeModal: React.FC<BadgeModalProps> = ({ 
  isOpen, 
  onClose,
  hasMoreScenes = true 
}) => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleContinue = () => {
    if (onClose) onClose();
    if (hasMoreScenes) {
      navigate('/story');
    } else {
      navigate('/complete');
    }
  };

  return (
    <>
      <style>{`
        .badge-modal-overlay {
          font-family: 'Be Vietnam Pro', sans-serif;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(14, 14, 12, 0.6);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .badge-modal-card {
          background: white;
          border-radius: 24px;
          max-width: 420px;
          width: 100%;
          padding: 32px;
          box-shadow: 0 24px 48px -12px rgba(73, 25, 125, 0.25);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          overflow: hidden;
          animation: modalPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes modalPop {
          0% { opacity: 0; transform: scale(0.8) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* Subtle CSS Confetti */
        .confetti {
          position: absolute;
          width: 8px;
          height: 8px;
          background-color: #f8a826;
          border-radius: 2px;
          opacity: 0;
        }

        @keyframes confettiFall {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(200px) rotate(360deg); opacity: 0; }
        }

        .show-confetti .confetti {
          animation: confettiFall 2s ease-in forwards;
        }

        .c1 { left: 10%; background: #c596fe; animation-delay: 0.1s; animation-duration: 2.2s; }
        .c2 { left: 20%; background: #007168; animation-delay: 0.3s; animation-duration: 1.8s; }
        .c3 { left: 30%; background: #c12048; animation-delay: 0.2s; animation-duration: 2.5s; }
        .c4 { left: 40%; background: #f8a826; animation-delay: 0.5s; animation-duration: 2.0s; }
        .c5 { left: 50%; background: #7a4eb0; animation-delay: 0.0s; animation-duration: 2.1s; }
        .c6 { left: 60%; background: #c596fe; animation-delay: 0.4s; animation-duration: 1.9s; }
        .c7 { left: 70%; background: #007168; animation-delay: 0.2s; animation-duration: 2.3s; }
        .c8 { left: 80%; background: #c12048; animation-delay: 0.6s; animation-duration: 2.2s; }
        .c9 { left: 90%; background: #f8a826; animation-delay: 0.1s; animation-duration: 1.7s; }
      `}</style>

      <div className="badge-modal-overlay" onClick={handleContinue}>
        <div className={`badge-modal-card ${showConfetti ? 'show-confetti' : ''}`} onClick={(e) => e.stopPropagation()}>
          {/* Confetti Elements */}
          <div className="confetti c1"></div><div className="confetti c2"></div>
          <div className="confetti c3"></div><div className="confetti c4"></div>
          <div className="confetti c5"></div><div className="confetti c6"></div>
          <div className="confetti c7"></div><div className="confetti c8"></div>
          <div className="confetti c9"></div>

          {/* Badge Content */}
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-[#7a4eb0]/10 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-6xl drop-shadow-md">🏆</span>
            </div>
            {/* Sparkles */}
            <span className="absolute -top-2 -right-2 text-2xl text-[#f8a826] animate-bounce">✨</span>
            <span className="absolute bottom-0 -left-4 text-xl text-[#c596fe] animate-bounce delay-100">✨</span>
          </div>

          <h2 className="text-2xl font-black text-[#383835] mb-2 uppercase tracking-wide">
            Dũng cảm bắt đầu!
          </h2>
          <p className="text-[#656461] text-sm leading-relaxed mb-8 px-4">
            Bạn đã xuất sắc kích hoạt phép thuật trên Cầu Cầu Vồng. Huy hiệu này minh chứng cho sự can đảm của một Nhà Thám Hiểm đích thực!
          </p>

          <button 
            onClick={handleContinue}
            className="w-full bg-[#f8a826] text-[#4e3000] py-4 rounded-full font-black text-lg shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Tiếp tục hành trình
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </>
  );
};
