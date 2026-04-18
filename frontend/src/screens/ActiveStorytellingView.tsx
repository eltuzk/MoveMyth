/**
 * ActiveStorytellingView — Full Story Loop (PHASE 4 → PHASE 7, repeating)
 *
 * Internal phase state machine:
 *   "narrating"  → play segment narration TTS, show story text
 *   "challenge"  → show challenge card + camera + DoneButton
 *   "verifying"  → API calls in flight (verify + adapt)
 *   "badge"      → BadgeModal shown
 *   "error"      → inline error banner with retry
 *
 * SessionContext provides: sessionId, segment, challenge, segmentIndex
 * After each pass, SessionContext is updated with next segment & challenge.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '../contexts/SessionContext';
import { useAudio } from '../hooks/useAudio';
import { DoneButton } from '../components/DoneButton';
import { BadgeModal } from '../components/BadgeModal';
import {
  textToSpeech,
  verifyAction,
  adaptNarrative,
  getBadge,
} from '../api/client';
import type { Challenge, Badge, AdaptResponse } from '../types/api';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type LoopPhase = 'narrating' | 'challenge' | 'verifying' | 'badge' | 'error';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const ActiveStorytellingView: React.FC = () => {
  const navigate = useNavigate();
  const { state: realState, dispatch } = useSession();
  const { playBlob, isPlaying } = useAudio();
  
  const demoVideoMap: Record<string, string> = {
    '0_jump':          '/jump.mp4',
    '0_raise_hands':   '/raise_hands.mp4',
    '1_spin':          '/spin.mp4',
    '1_raise_hands':   '/raise_and_wave.mp4',
    '2_jump':          '/jump_and_raise.mp4',
    '2_raise_hands':   '/raise_hands.mp4',
  };

  // QUICK PREVIEW BYPASS FOR DEV/TESTING
  const state = (!realState.sessionId && import.meta.env.DEV) 
    ? {
        ...realState,
        sessionId: 'mock-session-id',
        childName: 'Minh',
        segmentIndex: 0,
        segment: {
          segment_index: 0,
          narrative_text: 'Xin chào {child_name}! Lio đang cùng con khám phá khu rừng thần tiên. LioBar hoạt động tốt!',
          narration_tts: 'Xin chào Minh! Lio đang cùng con khám phá khu rừng thần tiên.',
        },
        challenge: {
          action: 'jump',
          display_text: 'Nhảy lên 3 lần để kích hoạt cầu phép thuật!',
          tts_text: 'Bé hãy nhảy 3 lần để mở cầu phép thuật nhé!',
          difficulty: 'normal',
          fallback_action: 'raise_hands',
        }
      }
    : realState;

  // Camera: managed inline so we can start/stop based on phase.
  // The <video> element is only in the DOM during challenge/verifying phases,
  // so we can't rely on useCamera's mount-time [] effect.
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // -------------------------------------------------------------------------
  // Local state
  // -------------------------------------------------------------------------
  const [phase, setPhase] = useState<LoopPhase>(import.meta.env.DEV ? 'challenge' : 'narrating');
  const [errorMessage, setErrorMessage] = useState('');
  const [retryFn, setRetryFn] = useState<(() => void) | null>(null);

  // Current challenge (may be downgraded during a loop iteration)
  const activeChallenge = phase === 'challenge' ? state.challenge : null;

  // Video mapping for challenge actions
  const CHALLENGE_VIDEOS: Record<string, string> = {
    jump: '/Lio_Jump.mp4',
    raise_hands: '/Lio_RaiseHand.mp4',
    spin: '/Lio_Spin.mp4',
  };

  const challengeVideo = activeChallenge ? CHALLENGE_VIDEOS[activeChallenge.action] : null;

  // Badge shown in modal
  const [badgeData, setBadgeData] = useState<Badge | null>(null);
  const [hasMoreSegments, setHasMoreSegments] = useState(true);

  // Adapt response cached for badge-dismiss handler
  const adaptRef = useRef<AdaptResponse | null>(null);

  // Guard so narration only fires once per segment
  const narratedRef = useRef(false);
  const lastSegmentIndexRef = useRef<number | null>(null);

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  const showError = useCallback((msg: string, retry: () => void) => {
    setErrorMessage(msg);
    setRetryFn(() => retry);
    setPhase('error');
  }, []);

  // -------------------------------------------------------------------------
  // Camera: start when entering challenge/verifying, stop otherwise
  // -------------------------------------------------------------------------

  useEffect(() => {
    const needsCamera = phase === 'challenge' || phase === 'verifying';

    if (needsCamera) {
      // Only start if not already streaming
      if (!streamRef.current) {
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }, audio: false })
          .then((stream) => {
            streamRef.current = stream;
            const videoEl = videoRef.current;
            if (videoEl) {
              videoEl.srcObject = stream;
              videoEl.play().catch((e: unknown) => {
                if (e instanceof Error && e.name !== 'AbortError') {
                  console.error('[Story] camera play error:', e.message);
                }
              });
            }
          })
          .catch((err: unknown) => {
            const msg = err instanceof Error ? err.message : 'Camera access denied';
            console.error('[Story] getUserMedia error:', msg);
            setCameraError(msg);
          });
      }
    } else {
      // Stop camera during narrating / badge / error phases
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    }

    return () => {
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [phase]);

  // Capture a JPEG frame from the local videoRef
  const captureFrameDataUrl = useCallback((): string | null => {
    const videoEl = videoRef.current;
    if (!videoEl || !streamRef.current) return null;
    const canvas = document.createElement('canvas');
    canvas.width = videoEl.videoWidth || 640;
    canvas.height = videoEl.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(videoEl, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  // -------------------------------------------------------------------------
  // Phase: NARRATING
  // -------------------------------------------------------------------------

  const runNarration = useCallback(async () => {
    const { sessionId, segment } = state;
    if (!sessionId || !segment) return;

    // Guard: don't re-narrate same segment
    if (lastSegmentIndexRef.current === segment.segment_index && narratedRef.current) return;
    lastSegmentIndexRef.current = segment.segment_index;
    narratedRef.current = true;

    try {
      const blob = await textToSpeech(segment.narration_tts, sessionId);
      await playBlob(blob);
      // Auto-transition to challenge after narration ends
      setPhase('challenge');
    } catch (err) {
      console.error('[Story] narration TTS error:', err);
      showError('Lỗi phát âm thanh. Thử lại nhé!', runNarration);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.sessionId, state.segment, playBlob, showError]);

  // -------------------------------------------------------------------------
  // Phase: CHALLENGE (play challenge TTS + show camera)
  // -------------------------------------------------------------------------

  const runChallengeTTS = useCallback(async (challenge: Challenge) => {
    const { sessionId } = state;
    if (!sessionId) return;
    try {
      const blob = await textToSpeech(challenge.tts_text, sessionId);
      await playBlob(blob);
    } catch (err) {
      // Non-fatal: still show the challenge card even without audio
      console.error('[Story] challenge TTS error:', err);
    }
  }, [state.sessionId, playBlob]);

  // -------------------------------------------------------------------------
  // Phase: VERIFYING — capture → verify → adapt → TTS → decide
  // -------------------------------------------------------------------------

  const handleDone = useCallback(async () => {
    if (phase !== 'challenge' || !state.sessionId || !activeChallenge) return;

    setPhase('verifying');

    const imageDataUrl = captureFrameDataUrl();
    if (!imageDataUrl) {
      showError('Không chụp được ảnh. Kiểm tra camera nhé!', () => setPhase('challenge'));
      return;
    }

    try {
      // 1. Verify action
      const verifyResult = await verifyAction(
        state.sessionId,
        imageDataUrl,
        activeChallenge.action,
        'challenge_verify',
      );

      // 2. Adapt narrative
      const adaptResult = await adaptNarrative(
        state.sessionId,
        verifyResult.result,
        state.segmentIndex,
      );
      adaptRef.current = adaptResult;

      // 3. Play adapt TTS
      try {
        const ttsBlob = await textToSpeech(adaptResult.tts_text, state.sessionId);
        await playBlob(ttsBlob);
      } catch {
        // Non-fatal
      }

      // 4. Branch on next_action
      if (adaptResult.next_action === 'award_badge') {
        // Fetch badge
        const badgeResp = await getBadge(state.sessionId);
        dispatch({ type: 'ADD_BADGE', payload: badgeResp.badge });
        setBadgeData(badgeResp.badge);
        setHasMoreSegments(adaptResult.next_segment_data !== null);
        setPhase('badge');
      } else if (adaptResult.next_action === 'retry_challenge') {
        // Same challenge — loop back
        setPhase('challenge');
      } else {
        // downgrade_challenge
        const downgraded = adaptResult.downgraded_challenge!;
        setActiveChallenge(downgraded);
        await runChallengeTTS(downgraded);
        setPhase('challenge');
      }
    } catch (err) {
      console.error('[Story] verify/adapt error:', err);
      showError(
        'Lio gặp sự cố. Thử lại nhé!',
        () => setPhase('challenge'),
      );
    }
  }, [
    phase,
    state.sessionId,
    state.segmentIndex,
    activeChallenge,
    captureFrameDataUrl,
    playBlob,
    dispatch,
    showError,
    runChallengeTTS,
  ]);

  // -------------------------------------------------------------------------
  // Badge modal dismissed
  // -------------------------------------------------------------------------

  const handleBadgeDismiss = useCallback(() => {
    setBadgeData(null);
    const adaptResult = adaptRef.current;

    if (!adaptResult || !adaptResult.next_segment_data) {
      dispatch({ type: 'SET_STORY_COMPLETE' });
      navigate('/complete');
      return;
    }

    // Update context with next segment
    dispatch({
      type: 'SET_SEGMENT',
      payload: {
        segment: adaptResult.next_segment_data,
        challenge: adaptResult.next_challenge!,
        segmentIndex: adaptResult.next_segment_data.segment_index,
      },
    });
    setActiveChallenge(adaptResult.next_challenge!);
    narratedRef.current = false;
    setPhase('narrating');
  }, [dispatch, navigate]);

  // -------------------------------------------------------------------------
  // Effects: orchestrate phase transitions
  // -------------------------------------------------------------------------

  // Narrating phase — run when phase becomes 'narrating'
  useEffect(() => {
    if (phase === 'narrating') {
      runNarration();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, state.segment?.segment_index]);

  // Challenge phase — play challenge TTS once
  const challengeTTSDoneRef = useRef(false);
  useEffect(() => {
    if (phase === 'challenge' && activeChallenge && !challengeTTSDoneRef.current) {
      challengeTTSDoneRef.current = true;
      runChallengeTTS(activeChallenge);
    }
    if (phase !== 'challenge') {
      challengeTTSDoneRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, activeChallenge?.action]);

  // Sync activeChallenge when context updates (segment change)
  useEffect(() => {
    if (state.challenge && phase === 'narrating') {
      setActiveChallenge(state.challenge);
    }
  }, [state.challenge, phase]);

  // Guard: no session → back to home
  useEffect(() => {
    if (!state.sessionId) {
      navigate('/');
    }
  }, [state.sessionId, navigate]);

  // -------------------------------------------------------------------------
  // Render helpers
  // -------------------------------------------------------------------------

  const { segment, childName } = state;

  // -------------------------------------------------------------------------
  // Global Lio Bar Dynamic Content
  // -------------------------------------------------------------------------
  const showLioBar = phase === 'narrating' || phase === 'challenge' || phase === 'verifying';
  let lioLabel = '';
  let lioText = '';

  if (phase === 'narrating') {
    lioLabel = 'Lio đang kể chuyện...';
    lioText = segment?.narrative_text?.replace('{child_name}', childName || 'bạn') || '';
  } else if (phase === 'challenge') {
    lioLabel = 'Mục tiêu của con 🌟';
    lioText = activeChallenge?.tts_text || activeChallenge?.display_text || '';
  } else if (phase === 'verifying') {
    lioLabel = '✨ Phép thuật đang hoạt động...';
    lioText = 'Lio đang dùng phép thuật kiểm tra động tác, ráng giữ nguyên vị trí nhé...';
  }

  // Camera border color by phase
  const cameraBorder =
    phase === 'verifying'
      ? '#FF9600'
      : phase === 'challenge'
        ? '#70f8e8'
        : '#444';

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <>
      <style>{`
        .watercolor-overlay {
          background-image: linear-gradient(to bottom, rgba(73,25,125,0.1),transparent 30%,transparent 70%,rgba(27,0,57,0.8));
        }
        .glass-panel {
          background: rgba(255,252,247,0.85);
          backdrop-filter: blur(16px);
        }
        .skeleton-overlay {
          stroke: #70f8e8;
          stroke-width: 4;
          stroke-linecap: round;
          filter: drop-shadow(0 0 8px #70f8e8);
        }
      `}</style>

      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img
          alt="Enchanted forest story background"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyAjFZaZMd-bwIyYoVJOuiadjJoJIZ-mgNwffUzk9wxMsOKrWN-NxwwjazdsJO8WcN1zU0KET-EKe-hs0H2L_a8nTksksxGGPHWqvEG2JkwaS7nxgRWhT9ZLkX9yFsV0XOZrzAq4R7kUbVOLIlkVlLWf76beC0BBruokwljxSf9DZeUo0RE1J3WGi0t81MQg2ms0pMkMc7nSgCemld2p3jE1TDNL0pcFL1xYSO6_jDn8IkT89igdUUl1yYywxdM3BpCddBYRQns4sa"
        />
        <div className="absolute inset-0 watercolor-overlay pointer-events-none" />
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center px-4 pt-4 pb-12 min-h-[calc(100vh-136px)]">

        {/* ------------------------------------------------------------------ */}
        {/* PHASE: NARRATING */}
        {/* ------------------------------------------------------------------ */}
        <AnimatePresence>
          {showLioBar && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-10 left-[72px] right-0 z-[100] flex justify-center pointer-events-none px-8"
            >
              <div className="bg-[#f2f1ef]/95 backdrop-blur-xl border border-white/60 shadow-[0_15px_50px_rgba(0,0,0,0.2)] rounded-[24px] px-8 py-6 flex items-center gap-6 w-full max-w-5xl pointer-events-auto min-h-[140px]">

                {/* Left: Lio Avatar (Static) */}
                <div className="shrink-0 self-center relative flex justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-white relative z-10">
                    <img 
                      src="/avt_Lio.png" 
                      alt="Lio" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Center: Story Text */}
                <div className="flex-1 flex flex-col justify-center min-w-0 pr-4">
                  <AnimatePresence mode="wait">
                    <motion.span 
                      key={lioLabel}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[10px] md:text-[11px] font-black text-[#7a4eb0] tracking-[0.15em] uppercase mb-1.5 md:mb-2 block"
                    >
                      {lioLabel}
                    </motion.span>
                  </AnimatePresence>
                  
                  <AnimatePresence mode="wait">
                    <motion.span 
                      key={lioText}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-[#383835] font-bold text-base md:text-xl leading-relaxed whitespace-normal break-words block"
                    >
                      {lioText}
                    </motion.span>
                  </AnimatePresence>
                </div>

                {/* Right: Actions & Audio */}
                <div className="shrink-0 flex items-center justify-end gap-3 md:gap-4">
                  
                  {/* Audio Waveform */}
                  <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-[#7a4eb0]/10 rounded-full border border-[#7a4eb0]/20">
                    {isPlaying ? (
                      <div className="flex items-center gap-1">
                        {[
                          { h: ['8px', '20px', '8px'], dur: 0.6, del: 0 },
                          { h: ['12px', '28px', '12px'], dur: 0.5, del: 0.2 },
                          { h: ['10px', '22px', '10px'], dur: 0.7, del: 0.1 },
                          { h: ['8px', '18px', '8px'], dur: 0.55, del: 0.3 }
                        ].map((anim, i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 bg-[#7a4eb0] rounded-full flex-shrink-0"
                            animate={{ height: anim.h }}
                            transition={{ duration: anim.dur, repeat: Infinity, delay: anim.del, ease: 'easeInOut' }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        {[0, 1, 2, 3].map((i) => (
                          <div key={i} className="w-1.5 h-2 bg-[#7a4eb0]/40 rounded-full" />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Xong Rồi Button (Only in Challenge / Verifying Phase) */}
                  <AnimatePresence mode="wait">
                    {phase === 'challenge' && (
                      <motion.button
                        key="done-btn"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDone}
                        className="bg-[#58CC02] text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-black text-sm md:text-lg shadow-xl shadow-[#58CC02]/30 flex items-center gap-2 border-[3px] border-white/20 whitespace-nowrap pointer-events-auto"
                      >
                        Bắt đầu thực hiện thử thách
                      </motion.button>
                    )}
                    
                    {phase === 'verifying' && (
                      <motion.div
                        key="verifying-btn"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-[#e5e5e5] text-[#a1a1a1] px-6 md:px-8 py-3 md:py-4 rounded-full font-black text-sm md:text-lg shadow-inner flex items-center gap-2 border-[3px] border-white/20 whitespace-nowrap cursor-not-allowed pointer-events-auto"
                      >
                        <span className="material-symbols-outlined animate-spin mr-1 text-sm md:text-base">refresh</span>
                        Lio đang xem...
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ------------------------------------------------------------------ */}
        {/* PHASE: CHALLENGE + VERIFYING */}
        {/* ------------------------------------------------------------------ */}
        <AnimatePresence>
          {(phase === 'challenge' || phase === 'verifying') && (
            <motion.div
              key="challenge-phase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center w-full gap-4"
            >
              {/* Split screen */}
              <div className="flex flex-col md:flex-row w-full max-w-7xl h-[60vh] gap-4">
                {/* LEFT: Camera Feed */}
                <section
                  className="flex-1 relative overflow-hidden bg-[#e5e2dc] rounded-[2rem] shadow-2xl"
                  style={{
                    border: `4px solid ${cameraBorder}`,
                    transition: 'border-color 0.4s ease',
                    boxShadow: `0 0 24px ${cameraBorder}44`,
                  }}
                >
                  {/* Live video — onLoadedMetadata handles the race where
                      getUserMedia resolved before this element mounted */}
                  <video
                    ref={(el) => {
                      videoRef.current = el;
                      // If stream is already ready, attach it now
                      if (el && streamRef.current && !el.srcObject) {
                        el.srcObject = streamRef.current;
                        el.play().catch((e: unknown) => {
                          if (e instanceof Error && e.name !== 'AbortError') {
                            console.error('[Story] video.play() error:', e.message);
                          }
                        });
                      }
                    }}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ transform: 'scaleX(-1)' }}
                  />

                  {/* Camera error */}
                  {cameraError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a] text-white text-sm px-4 text-center">
                      <p>📷 {cameraError}</p>
                    </div>
                  )}

                  {/* Skeleton overlay */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 600">
                    <circle className="skeleton-overlay fill-none" cx="200" cy="180" r="30" />
                    <line className="skeleton-overlay" x1="200" x2="200" y1="210" y2="350" />
                    <line className="skeleton-overlay" x1="200" x2="140" y1="240" y2="300" />
                    <line className="skeleton-overlay" x1="200" x2="260" y1="240" y2="300" />
                    <line className="skeleton-overlay" x1="200" x2="160" y1="350" y2="450" />
                    <line className="skeleton-overlay" x1="200" x2="240" y1="350" y2="450" />
                  </svg>

                  {/* Live badge */}
                  <motion.div
                    className="absolute top-8 left-8 bg-[#007168]/90 text-white px-4 py-2 rounded-full flex items-center gap-2 font-bold"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <span className="w-2 h-2 bg-white rounded-full" />
                    ● LIVE
                  </motion.div>

                  {/* Verifying overlay */}
                  <AnimatePresence>
                    {phase === 'verifying' && (
                      <motion.div
                        key="verifying-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ background: 'rgba(255,150,0,0.1)', backdropFilter: 'blur(2px)' }}
                      >
                        <motion.div
                          initial={{ scale: 0.8, y: 10 }}
                          animate={{ scale: 1, y: 0 }}
                          className="bg-white/90 px-8 py-5 rounded-2xl shadow-xl flex flex-col items-center gap-3"
                        >
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
                          <span className="font-bold text-sm text-[#383835]">
                            Phép thuật đang hoạt động...
                          </span>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </section>

                {/* RIGHT: Challenge card */}
                <section className="flex-1 relative overflow-hidden bg-[#3f0b73] rounded-[2rem] flex items-center justify-center shadow-2xl">
                  <div className="absolute inset-0">
                    {(() => {
                      const videoKey = `${state.segmentIndex}_${activeChallenge?.action}`;
                      const videoSrc = demoVideoMap[videoKey];
                      return videoSrc ? (
                        <video
                          key={videoKey}
                          src={videoSrc}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          className="w-full h-full object-cover"
                          alt="Story scene"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAu3Oubn12PnJUNbtqrxU5mQa4Yi9j29oAp2bpn4aSuutji2nSKm-V3W7ST6QEqhYZe-k6XQkROwuzdSD3UaGNTQlbRCkvyn4OlCxvuVxL0Bms2nNeARGKeAkH4DzRjSjdt5uwHN-mTiPxIMYG-XTzJ-UQke4BqgGaow75wsIF1glQYwo7rUZfIiUhEzBEZaILcKhfnejVAKIBok1sjP8REHITk6bwn5oW1Jdomq_dV-qo1P3C1u8NNhdx-C9_ETLHqs3XDjlyZmlMK"
                        />
                      );
                    })()}

                  </div>

                </section>
              </div>

              {/* Done Button section removed entirely as requested */}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ------------------------------------------------------------------ */}
        {/* PHASE: ERROR */}
        {/* ------------------------------------------------------------------ */}
        <AnimatePresence>
          {phase === 'error' && (
            <motion.div
              key="error-phase"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center flex-1 gap-6"
            >
              <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-10 text-center shadow-2xl max-w-md">
                <div className="text-5xl mb-4">😅</div>
                <h2 className="text-xl font-black text-[#383835] mb-2">Ồ không!</h2>
                <p className="text-[#656461] mb-6">{errorMessage}</p>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setPhase('challenge');
                    retryFn?.();
                  }}
                  className="bg-[#f8a826] text-[#4e3000] px-10 py-4 rounded-full font-black text-lg shadow-xl flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">replay</span>
                  Thử lại
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Badge Modal */}
      {badgeData && (
        <BadgeModal
          isOpen={!!badgeData}
          onClose={handleBadgeDismiss}
          hasMoreScenes={hasMoreSegments}
          badge={{
            emoji: badgeData.emoji,
            label: badgeData.label,
          }}
        />
      )}
    </>
  );
};
