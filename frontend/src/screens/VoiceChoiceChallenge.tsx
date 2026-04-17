import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

type RecordingState = 'idle' | 'recording' | 'done';

export const VoiceChoiceChallenge: React.FC = () => {
  const navigate = useNavigate();
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [transcribedText] = useState('"Con chọn chiếc khiên..."');

  const handleNext = () => { navigate('/challenge/demo'); };

  const toggleRecording = () => {
    if (recordingState === 'idle') {
      setRecordingState('recording');
      // Auto-stop after 4 seconds for demo
      setTimeout(() => setRecordingState('done'), 4000);
    } else {
      setRecordingState('idle');
    }
  };

  return (
    <>
      {/* Full-bleed Background */}
      <div className="fixed inset-0 z-0">
        <img
          className="w-full h-full object-cover"
          alt="Enchanted magical forest path"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnyzUp2J8sSvoPDamf6_H1VnWoibiQUP82GTUkaUV_NQIMPLk00WvQCjmUpCBvP7fY80z9m7srTeA7g6pyU5PL93TztEoGDyTm8ni1bWuY6s7A9g0ggGo_TZegCcU6u9SBOty5uomnsSmFlsnuxIZ-RedNhe0Xz012I6_V-jqkv8J-XzIkqoXn59OVo7-cqzgcXjT_7QucUG1WslZ-TfeAh2-NQ-3z44ZRMl26nw5slXz3ZLjh1tj-bGDfoaj512Gf28ZRT7_S9Drp"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#7a4eb0]/10 via-transparent to-[#7a4eb0]/20 pointer-events-none"></div>
      </div>

      {/* Main Content: Interaction Overlay */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 min-h-[calc(100vh-136px)] pt-10 pb-10">
        {/* Floating Mascot */}
        <motion.div
          className="mb-8 pointer-events-none"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img
            className="w-48 h-48 object-contain drop-shadow-[0_20px_20px_rgba(73,25,125,0.3)] transform -rotate-6"
            alt="Friendly purple dragon mascot"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHhPSCiEwz79-HG3j-Wmi-f8ga-oqql6fCOH9oavrVagkSC-gWnR9F4VVdAxCwYJece1g_jxZGKiLXPD1VDESO7yd1q_x3sgNK50B6-KnR2lGIL2-Dqxff5sEKEeYfagONiMd3p58mZoewabF3SFE6rdXE1AX09dzbnePWvKzc3_TchfxoDh1lq_7cgS1ep32TQSvaBu_r0vAIX9_j--v7J15SRMg7GOHluVrSKQnfUekEjk1teDMvK_yAIAZ2AxFbwmr9dwiR0HqY"
          />
        </motion.div>

        {/* Decision Panel */}
        <div className="w-full max-w-2xl bg-[#fffcf7]/95 backdrop-blur-xl rounded-[1.5rem] p-8 shadow-[0_32px_32px_-4px_rgba(73,25,125,0.1)] flex flex-col items-center text-center relative border border-white/50 mb-10">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#fffcf7] rotate-45 rounded-sm"></div>
          <motion.h1
            className="font-bold text-[#383835] leading-tight mb-8 text-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            "Con muốn chàng hiệp sĩ dùng thanh kiếm ánh sáng hay chiếc khiên thần kỳ để vượt qua hang động?"
          </motion.h1>

          {/* Mic Button with ripple effect */}
          <div className="relative mb-6 flex items-center justify-center w-24 h-24">
            {/* Ripple rings — only when recording */}
            <AnimatePresence>
              {recordingState === 'recording' && (
                <>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={`ripple-${i}`}
                      className="absolute inset-0 rounded-full border-2"
                      style={{ borderColor: 'rgba(122,78,176,0.5)' }}
                      initial={{ scale: 1, opacity: 0.7 }}
                      animate={{ scale: 2.5 + i * 0.4, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        delay: i * 0.45,
                        ease: 'easeOut',
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            <motion.button
              id="mic-button"
              onClick={toggleRecording}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              animate={
                recordingState === 'recording'
                  ? { scale: [1, 1.04, 1] }
                  : { scale: 1 }
              }
              transition={
                recordingState === 'recording'
                  ? { duration: 0.9, repeat: Infinity }
                  : {}
              }
              className="relative w-24 h-24 rounded-full flex items-center justify-center text-white transition-colors z-10"
              style={{
                background:
                  recordingState === 'recording'
                    ? 'linear-gradient(135deg, #c12048, #e04060)'
                    : 'linear-gradient(135deg, #7a4eb0, #9b6ed0)',
                boxShadow:
                  recordingState === 'recording'
                    ? '0 10px 30px rgba(193,32,72,0.45)'
                    : '0 10px 30px rgba(122,78,176,0.4)',
              }}
              aria-label={recordingState === 'recording' ? 'Dừng ghi âm' : 'Bắt đầu ghi âm'}
            >
              <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {recordingState === 'recording' ? 'stop_circle' : 'mic'}
              </span>
            </motion.button>
          </div>

          {/* Status text */}
          <AnimatePresence mode="wait">
            {recordingState === 'idle' && (
              <motion.p
                key="idle-text"
                className="text-[#656461] font-medium"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                Nhấn mic để bắt đầu nói nhé!
              </motion.p>
            )}
            {recordingState === 'recording' && (
              <motion.p
                key="recording-text"
                className="font-medium"
                style={{ color: '#c12048' }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                  ● Đang lắng nghe...
                </motion.span>
              </motion.p>
            )}
            {recordingState === 'done' && (
              <motion.div
                key="done-text"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                className="text-center"
              >
                <p className="text-[#007168] font-semibold mb-1">✅ Đã ghi âm xong!</p>
                <motion.p
                  className="text-[#a07fc9] italic text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  {transcribedText}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Demo continue button */}
        <motion.button 
          onClick={handleNext}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#f8a826] text-[#4e3000] px-10 py-4 rounded-full font-black text-lg shadow-xl shadow-amber-500/30 flex items-center gap-3 z-50"
        >
          Tiếp tục
          <span className="material-symbols-outlined">arrow_forward</span>
        </motion.button>
      </main>
    </>
  );
};
