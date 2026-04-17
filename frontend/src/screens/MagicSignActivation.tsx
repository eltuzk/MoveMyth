/**
 * MagicSignActivation — PHASE 1 (Magic Sign) + Session Init
 *
 * On mount:
 *   1. Start camera
 *   2. Call startStory("forest") → save session to context
 *
 * On button press:
 *   1. Call unlockAudio() (one-time gesture unlock for mobile)
 *   2. captureFrameDataUrl() → verifyAction(..., "magic_sign_check")
 *   3. pass → navigate('/welcome')
 *   4. fail → show retry message inline
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// MagicCameraFrame removed — its z-0 children wrapper buries the video behind z-10 border overlays.
import { useCamera } from '../hooks/useCamera';
import { useSession } from '../contexts/SessionContext';
import { startStory, verifyAction } from '../api/client';
import { unlockAudio } from '../utils/audio';

type VerifyState = 'idle' | 'loading' | 'fail' | 'pass';

export const MagicSignActivation: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useSession();

  const { videoRef, isActive, captureFrameDataUrl, error: cameraError } = useCamera({
    width: 640,
    height: 480,
    facingMode: 'user',
  });

  const [verifyState, setVerifyState] = useState<VerifyState>('idle');
  const [verifyMessage, setVerifyMessage] = useState('');
  const [sessionError, setSessionError] = useState<string | null>(null);
  const sessionInitRef = useRef(false);

  // -------------------------------------------------------------------------
  // 1. Init session on mount (camera auto-starts via useCamera hook)
  // -------------------------------------------------------------------------
  useEffect(() => {
    // Only init once; if session already exists in context, skip
    if (sessionInitRef.current || state.sessionId) return;
    sessionInitRef.current = true;

    (async () => {
      try {
        const data = await startStory('forest');
        dispatch({
          type: 'SET_SESSION',
          payload: {
            sessionId: data.session_id,
            segment: data.segment,
            challenge: data.selected_challenge,
          },
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Không thể kết nối server';
        setSessionError(msg);
        console.error('[MagicSignActivation] startStory error:', err);
      }
    })();
  }, [state.sessionId, dispatch]);

  // -------------------------------------------------------------------------
  // 2. Verify peace sign
  // -------------------------------------------------------------------------
  const handleVerify = useCallback(async () => {
    if (verifyState === 'loading') return;
    if (!state.sessionId) {
      setSessionError('Session chưa sẵn sàng. Đợi chút nhé!');
      return;
    }

    // Unlock AudioContext on first user gesture
    await unlockAudio();

    const imageDataUrl = captureFrameDataUrl();
    if (!imageDataUrl) {
      setVerifyMessage('Không chụp được ảnh. Kiểm tra camera nhé!');
      setVerifyState('fail');
      return;
    }

    setVerifyState('loading');
    setVerifyMessage('');

    try {
      const result = await verifyAction(
        state.sessionId,
        imageDataUrl,
        'peace_sign',
        'magic_sign_check',
      );

      if (result.result === 'pass') {
        setVerifyState('pass');
        // Small delay so child sees the success state before navigating
        setTimeout(() => navigate('/welcome'), 700);
      } else {
        setVerifyState('fail');
        setVerifyMessage('Thử lại ký hiệu phép thuật nhé! ✌️');
        setTimeout(() => setVerifyState('idle'), 2500);
      }
    } catch (err) {
      console.error('[MagicSignActivation] verifyAction error:', err);
      setVerifyState('fail');
      setVerifyMessage('Lỗi kết nối. Thử lại nhé!');
      setTimeout(() => setVerifyState('idle'), 2500);
    }
  }, [verifyState, state.sessionId, captureFrameDataUrl, navigate]);

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  const isLoading = verifyState === 'loading';

  const borderColor =
    verifyState === 'pass'
      ? '#58CC02'
      : verifyState === 'fail'
      ? '#FF9600'
      : verifyState === 'loading'
      ? '#CE82FF'
      : '#70f8e8';

  return (
    <>
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 min-h-[calc(100vh-136px)]">

        {/* Session error banner */}
        <AnimatePresence>
          {sessionError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 w-full max-w-md bg-orange-50 border border-orange-200 rounded-2xl px-5 py-3 flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-orange-500">warning</span>
              <p className="text-sm font-semibold text-orange-700">{sessionError}</p>
              <button
                onClick={() => { setSessionError(null); sessionInitRef.current = false; }}
                className="ml-auto text-xs underline text-orange-600"
              >
                Thử lại
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ritual Interaction Container */}
        <div className="relative w-full max-w-4xl flex items-center justify-center gap-6 mb-8">
          {/* Left: Gesture Reference Card */}
          <motion.div
            className="hidden lg:flex flex-col items-center justify-center p-4 bg-[#fcf9f4] rounded-[1rem] w-[140px] h-[140px] shadow-sm transform -rotate-3 border border-[#bbb9b4]/15"
            whileHover={{ scale: 1.06, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <motion.div
              className="text-5xl mb-2 select-none"
              animate={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
            >
              ✌️
            </motion.div>
            <p className="text-[14px] font-bold text-center leading-tight text-[#7a4eb0]">Dấu hiệu hòa bình!</p>
          </motion.div>

          {/* Center: Live Camera Feed */}
          <div className="w-full max-w-[500px]">
            <div className="relative rounded-2xl overflow-hidden" style={{ padding: 0 }}>
              <div
                className="relative w-full h-[340px] bg-[#0e0e0c] overflow-hidden"
                style={{
                  border: `3px solid ${borderColor}`,
                  transition: 'border-color 0.3s ease',
                  boxShadow: `0 0 20px ${borderColor}44`,
                }}
              >
                {/* Live video feed */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' /* mirror for selfie */ }}
                />

                {/* Camera error fallback */}
                {cameraError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a] text-white text-sm px-4 text-center">
                    <p>📷 {cameraError}</p>
                  </div>
                )}

                {/* Vignette for portal feel */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(circle, transparent 40%, rgba(27,0,57,0.4) 100%)' }}
                />

                {/* Status Dot */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2">
                  <motion.span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: isActive ? '#58CC02' : '#c12048' }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-white text-xs font-bold tracking-wide">
                    {isActive ? '● LIVE' : '● Đang kết nối...'}
                  </span>
                </div>

                {/* Target Guide */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <div className="w-48 h-48 border-2 border-dashed border-white/50 rounded-full" />
                </motion.div>

                {/* Verify result overlay */}
                <AnimatePresence>
                  {verifyState === 'pass' && (
                    <motion.div
                      key="pass-overlay"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: 'rgba(88,204,2,0.18)', backdropFilter: 'blur(2px)' }}
                    >
                      <motion.div
                        initial={{ scale: 0.5, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3"
                      >
                        <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
                        <span className="font-black text-green-800">PHÉP THUẬT HOẠT ĐỘNG!</span>
                      </motion.div>
                    </motion.div>
                  )}
                  {verifyState === 'fail' && (
                    <motion.div
                      key="fail-overlay"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: 'rgba(255,150,0,0.12)', backdropFilter: 'blur(2px)' }}
                    >
                      <motion.div
                        initial={{ scale: 0.5, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3"
                      >
                        <span className="text-2xl">✌️</span>
                        <span className="font-black" style={{ color: '#7a4eb0' }}>{verifyMessage || 'Thử lại nhé!'}</span>
                      </motion.div>
                    </motion.div>
                  )}
                  {verifyState === 'loading' && (
                    <motion.div
                      key="loading-overlay"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: 'rgba(198,150,254,0.1)', backdropFilter: 'blur(1px)' }}
                    >
                      <div className="bg-white/90 px-8 py-5 rounded-2xl shadow-xl flex flex-col items-center gap-3">
                        <div className="flex gap-2">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: ['#58CC02', '#FF9600', '#CE82FF'][i] }}
                              animate={{ y: [0, -10, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                            />
                          ))}
                        </div>
                        <span className="font-bold text-sm text-[#383835]">Lio đang xem...</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right: Status Bubble */}
          <motion.div
            className="absolute lg:relative -top-16 lg:top-0 right-0 lg:right-auto bg-white/80 backdrop-blur-lg p-5 rounded-[1rem] shadow-[0px_32px_32px_-4px_rgba(73,25,125,0.08)] border border-[#bbb9b4]/10 w-[240px] z-10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <div className="flex items-start gap-3 mb-3">
              <motion.span
                className="material-symbols-outlined text-[#7a4eb0]"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
              >
                auto_awesome
              </motion.span>
              <div>
                <p className="text-sm font-bold text-[#383835]">
                  {isLoading ? 'Đang nhận...' : 'Làm dấu ✌️'}
                </p>
                <p className="text-xs text-[#656461]">Giữ nguyên tư thế của con nhé!</p>
              </div>
            </div>
            <div className="w-full h-2 bg-[#eae8e2] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #007168, #58CC02)' }}
                initial={{ width: '20%' }}
                animate={{ width: isLoading ? '90%' : ['20%', '85%', '65%', '90%'] }}
                transition={{ duration: isLoading ? 2 : 4, repeat: isLoading ? 0 : Infinity, ease: 'easeInOut' }}
              />
            </div>
            <div className="flex gap-1.5 mt-3 items-center justify-center">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#CE82FF' }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTA Button */}
        <motion.button
          onClick={handleVerify}
          disabled={isLoading || verifyState === 'pass'}
          whileHover={isLoading ? {} : { scale: 1.05 }}
          whileTap={isLoading ? {} : { scale: 0.95 }}
          animate={isLoading || verifyState === 'pass' ? {} : { scale: [1, 1.02, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="bg-[#f8a826] text-[#4e3000] px-10 py-4 rounded-full font-black text-lg shadow-xl shadow-amber-500/30 flex items-center gap-3 relative z-10 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
              Lio đang xem...
            </>
          ) : verifyState === 'pass' ? (
            <>
              <span className="material-symbols-outlined">check_circle</span>
              Tuyệt vời!
            </>
          ) : (
            <>
              Kích hoạt phép thuật ✨
              <span className="material-symbols-outlined">arrow_forward</span>
            </>
          )}
        </motion.button>

        {/* Session init status hint */}
        {!state.sessionId && !sessionError && (
          <p className="mt-3 text-xs text-[#9a9895]">Đang chuẩn bị hành trình...</p>
        )}
      </main>
    </>
  );
};
