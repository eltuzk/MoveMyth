/**
 * StoryLaunchWelcome — PHASE 2 (Greeting TTS) + PHASE 3 (STT Name Capture)
 *
 * Flow:
 *   1. On mount: call TTS for greeting → play audio
 *   2. Show mic button; on click start recording
 *   3. On stop recording: call STT → display transcribed name
 *   4. "Bắt đầu" navigates to /story
 */

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '../contexts/SessionContext';
import { useAudio } from '../hooks/useAudio';
import { useMicrophone } from '../hooks/useMicrophone';
import { textToSpeech, speechToText } from '../api/client';

type Phase = 'greeting' | 'listening' | 'done' | 'error';

const GREETING_TEXT =
  'Xin chào! Lio rất vui được gặp bạn hôm nay! Bạn tên gì nào?';

export const StoryLaunchWelcome: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useSession();
  const { playBlob, isPlaying } = useAudio();
  const { startRecording, stopRecording, isRecording } = useMicrophone();

  const [phase, setPhase] = useState<Phase>('greeting');
  const [childName, setChildName] = useState(state.childName || '');
  const [error, setError] = useState<string | null>(null);
  const greetingDoneRef = useRef(false);

  // -------------------------------------------------------------------------
  // 1. Play greeting TTS on mount (once)
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (greetingDoneRef.current || !state.sessionId) return;
    greetingDoneRef.current = true;

    (async () => {
      try {
        const blob = await textToSpeech(GREETING_TEXT, state.sessionId!);
        await playBlob(blob);
        // After greeting ends, auto-prompt mic (but don't auto-record)
      } catch (err) {
        console.error('[Welcome] greeting TTS error:', err);
        // Non-fatal: still show UI even if TTS fails
      }
    })();
  }, [state.sessionId, playBlob]);

  // -------------------------------------------------------------------------
  // 2. Mic interaction
  // -------------------------------------------------------------------------
  const handleMicPress = async () => {
    if (isRecording) {
      // Stop recording → STT
      try {
        const blob = await stopRecording();
        if (!blob || !state.sessionId) return;

        setPhase('listening');
        const result = await speechToText(blob, state.sessionId);
        const name = result.text.trim() || 'bạn nhỏ';

        dispatch({ type: 'SET_CHILD_NAME', payload: name });
        setChildName(name);
        setPhase('done');
      } catch (err) {
        console.error('[Welcome] STT error:', err);
        setError('Không nghe rõ. Nhấn mic và nói lại nhé!');
        setPhase('error');
      }
    } else {
      // Start recording
      try {
        setError(null);
        setPhase('greeting');
        await startRecording();
      } catch (err) {
        console.error('[Welcome] mic error:', err);
        setError('Không thể mở micro. Kiểm tra quyền truy cập nhé!');
        setPhase('error');
      }
    }
  };

  const handleStart = () => {
    navigate('/story');
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  const micColor = isRecording
    ? 'linear-gradient(135deg, #c12048, #e04060)'
    : 'linear-gradient(135deg, #7a4eb0, #9b6ed0)';

  const micShadow = isRecording
    ? '0 10px 30px rgba(193,32,72,0.45)'
    : '0 10px 30px rgba(122,78,176,0.4)';

  return (
    <>
      <style>{`
        .glow-aura {
          filter: drop-shadow(0 0 40px rgba(197, 150, 254, 0.4));
        }
        .intro-card {
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(12px);
          box-shadow: 0 24px 48px rgba(73, 25, 125, 0.08);
        }
      `}</style>

      <main className="mx-auto flex min-h-[calc(100vh-136px)] w-full max-w-7xl flex-1 flex-col items-center justify-center gap-14 overflow-x-hidden px-8 py-8 md:flex-row md:gap-16">

        {/* Left Column: Greeting + Mic */}
        <div className="z-10 flex w-full flex-1 flex-col items-center space-y-8 text-center md:max-w-[560px] md:items-start md:text-left">
          <header className="space-y-4">
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-[#3f0b73] md:text-6xl">
              Chào mừng đến với MoveMyth!
            </h1>

            {/* Lio speaking indicator */}
            <AnimatePresence mode="wait">
              {isPlaying && (
                <motion.div
                  key="speaking"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-center gap-3 text-[#7a4eb0]"
                >
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-[#7a4eb0]"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold">Lio đang nói...</span>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-xl font-medium text-[#656461] md:text-2xl">
              Khám phá thế giới kỳ diệu cùng Lio
            </p>
          </header>

          {/* Greeting card */}
          <div className="intro-card w-full max-w-xl rounded-[1.5rem] p-6 md:p-8">
            <p className="text-base leading-8 text-[#5f5a67] md:text-lg mb-6">
              Lio đã sẵn sàng dẫn bạn vào cuộc phiêu lưu! Trước tiên,{' '}
              <strong className="text-[#7a4eb0]">hãy nói tên của bạn</strong> để Lio chào hỏi nhé!
            </p>

            {/* Mic button */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative flex items-center justify-center w-24 h-24">
                {/* Recording ripples */}
                <AnimatePresence>
                  {isRecording && (
                    <>
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={`ripple-${i}`}
                          className="absolute inset-0 rounded-full border-2"
                          style={{ borderColor: 'rgba(193,32,72,0.4)' }}
                          initial={{ scale: 1, opacity: 0.7 }}
                          animate={{ scale: 2.5 + i * 0.4, opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.45, ease: 'easeOut' }}
                        />
                      ))}
                    </>
                  )}
                </AnimatePresence>

                <motion.button
                  id="mic-button"
                  onClick={handleMicPress}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  animate={isRecording ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                  transition={isRecording ? { duration: 0.9, repeat: Infinity } : {}}
                  className="relative w-24 h-24 rounded-full flex items-center justify-center text-white z-10"
                  style={{ background: micColor, boxShadow: micShadow }}
                  aria-label={isRecording ? 'Dừng ghi âm' : 'Bắt đầu ghi âm'}
                >
                  <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isRecording ? 'stop_circle' : 'mic'}
                  </span>
                </motion.button>
              </div>

              {/* Status text */}
              <AnimatePresence mode="wait">
                {phase === 'greeting' && !isRecording && (
                  <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-[#656461] font-medium text-center">
                    Nhấn mic và nói tên của bạn nhé!
                  </motion.p>
                )}
                {isRecording && (
                  <motion.p key="recording" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="font-medium text-center" style={{ color: '#c12048' }}>
                    <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                      ● Đang lắng nghe...
                    </motion.span>
                    <br />
                    <span className="text-xs text-[#9a9895]">Nhấn lại để dừng</span>
                  </motion.p>
                )}
                {phase === 'listening' && (
                  <motion.p key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-[#7a4eb0] font-medium text-center">
                    Lio đang nghe...
                  </motion.p>
                )}
                {phase === 'done' && childName && (
                  <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="text-center">
                    <p className="text-[#007168] font-semibold">✅ Lio đã nghe rõ!</p>
                    <motion.p
                      className="text-[#7a4eb0] font-black text-2xl mt-1"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      Xin chào, {childName}! 👋
                    </motion.p>
                  </motion.div>
                )}
                {phase === 'error' && (
                  <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                    <p className="text-orange-600 font-semibold text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Start button — always visible but prominent after name captured */}
          <motion.button
            onClick={handleStart}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            animate={phase === 'done' ? { scale: [1, 1.03, 1] } : {}}
            transition={phase === 'done' ? { duration: 2, repeat: Infinity } : {}}
            className="flex w-fit items-center gap-3 rounded-full px-12 py-5 text-xl font-bold shadow-[0_8px_0_#d98e16] transition-all active:translate-y-1 active:shadow-none"
            style={{
              background: phase === 'done' ? '#f8a826' : '#d4b896',
              color: '#4e3000',
            }}
          >
            Bắt đầu
            <span className="material-symbols-outlined font-bold">arrow_forward</span>
          </motion.button>
        </div>

        {/* Right Column: Lio mascot */}
        <div className="relative flex w-full flex-1 items-center justify-center md:max-w-[560px]">
          <div className="absolute inset-0 scale-125 rounded-full bg-[#c596fe]/20 blur-[80px]" />
          <div className="glow-aura relative z-10 w-full max-w-[520px] transition-transform duration-500 hover:scale-105">
            <img
              className="h-auto w-full drop-shadow-2xl"
              alt="Lio the cheerful purple mascot"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRV2nTJGgfk-H9PH6THEy746aXi2rG1rxcTlFTLrJn1n0gE1ShNFLnqd5ia4UfCQFiC_0COmpZ3sxLfm0zaRrsjG43eZq2MyJD-EY1O2FxkNKFVPE8XBvjbqan8A2q3YR0op1mKzVWOnBqs0vsnB3AfKfZyiZDOmSmkyVecH7oZlnEXNCgirbJ82bzZCA5S-FwqxwQ45oCmRVimnbtabRyPbqe6rNao04gWsw8Dr4KHkzlDLdVRUMYxsE0TogEAGBMzURJIrArLcPv"
            />
          </div>
        </div>
      </main>
    </>
  );
};
