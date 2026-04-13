import React from 'react';
import { useNavigate } from 'react-router-dom';

export const CharacterSetupOnboarding: React.FC = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/magic-sign');
  };

  return (
    <>
      <style>{`
        .sparkle-border {
          position: relative;
          background: linear-gradient(#fffcf7, #fffcf7) padding-box,
                      linear-gradient(135deg, #f8a826, #c596fe, #70f8e8) border-box;
          border: 4px solid transparent;
        }
      `}</style>

      <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[calc(100vh-136px)]">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center flex-1">
          {/* Left Column: Form */}
          <div className="space-y-8">
            <div className="space-y-3">
              <h1 className="text-5xl font-black text-[#6B3FA0] tracking-tight leading-tight">
                Chào bạn mới!
              </h1>
              <p className="text-lg text-[#656461] font-medium leading-relaxed max-w-md">
                Hãy cho MoveMyth biết tên của bạn để chúng mình bắt đầu cuộc phiêu lưu nhé.
              </p>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black tracking-widest text-[#8B8BA0] uppercase ml-6">
                TÊN CỦA BẠN
              </label>
              <div className="relative group">
                <input
                  className="w-full bg-[#fcf9f4] border-none rounded-full py-6 px-8 text-xl font-semibold text-[#383835] placeholder:text-[#82807c] shadow-[0_8px_30px_rgb(73,25,125,0.04)] focus:ring-4 focus:ring-[#c596fe]/30 transition-all outline-none"
                  placeholder="Nhập tên tại đây..."
                  type="text"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#f8a826] text-[#4e3000] p-3 rounded-full shadow-lg hover:scale-105 transition-transform active:scale-95">
                  <span className="material-symbols-outlined block" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
                </button>
              </div>
            </div>
            
            <button 
              onClick={handleNext}
              className="bg-[#6B3FA0] text-white px-10 py-4 rounded-full font-black text-lg shadow-xl shadow-[#6B3FA0]/30 hover:scale-105 transition-transform active:scale-95 flex items-center gap-3 w-fit"
            >
              Tiếp tục
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>

          {/* Right Column: Avatar Upload */}
          <div className="flex flex-col items-center gap-8">
            <div className="sparkle-border w-72 h-72 rounded-[1rem] overflow-hidden shadow-[0_20px_50px_rgba(73,25,125,0.1)] flex items-center justify-center bg-[#eae8e2]">
              <img
                alt="Character Portrait"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqk87iv_jHCcfhzO3yhpkyBVQMbM1-B130-Oal62uY591tKWfHOLp00oddeKVKzSe_-39WSsZEVl14XhuoGgJ02QyTQYshnbjA2tbw5wvaRYBzJEA4zReTAehk2Ae8cIL8QpkGzd_yQR6xSlyh4RTq--Xlo8Dwqax5IPyGGoVQdOYKwhVtfaMJLPGc1bHQrsNjiZJ0q-_Jiu978kPnNYuC0F86Ml0U5zdPdtLiJ9i4Z4U98lmUKNXS3vpTBOFkVN8wJTZlBlUU_buN"
              />
            </div>
            <div className="flex gap-4 w-full justify-center">
              <button className="flex items-center gap-2 border-2 border-[#6B3FA0] text-[#6B3FA0] font-bold py-3 px-8 rounded-full hover:bg-[#7a4eb0]/5 transition-colors">
                <span className="material-symbols-outlined text-xl">photo_camera</span>
                Chụp ảnh
              </button>
              <button className="flex items-center gap-2 border-2 border-[#6B3FA0] text-[#6B3FA0] font-bold py-3 px-8 rounded-full hover:bg-[#7a4eb0]/5 transition-colors">
                <span className="material-symbols-outlined text-xl">upload</span>
                Tải ảnh lên
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
