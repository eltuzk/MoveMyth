import { useState, useCallback, useRef, useEffect } from 'react';
import { useCamera } from '../hooks/useCamera';
import { useAudio } from '../hooks/useAudio';
import {
  startStory,
  callTTS,
  callSTT,
  verifyVision,
  adaptNarrative,
  getBadge,
} from '../api/client';
import type {
  Challenge,
  Segment,
  Badge,
  VerifyResult,
} from '../api/client';

// ─── State Machine ────────────────────────────────────────────────────────────

type AppState =
  | 'IDLE'
  | 'MAGIC_SIGN'   // camera open, waiting for peace sign
  | 'GREETING'     // /story/start called, TTS greeting, then STT for name
  | 'STORY'        // TTS narration, then TTS challenge
  | 'CHALLENGE'    // waiting for child to act + press button
  | 'VERIFY'       // POST /vision/verify in progress
  | 'ADAPT'        // POST /story/adapt in progress + TTS response
  | 'BADGE'        // GET /story/badge, show popup
  | 'DONE';        // all 3 segments complete

// ─── Component ────────────────────────────────────────────────────────────────

export default function MagicMirror() {
  // ── App state machine ──────────────────────────────────────────────────────
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [statusText, setStatusText] = useState<string>('');

  // ── Session state ──────────────────────────────────────────────────────────
  const [sessionId, setSessionId] = useState<string>('');
  const [childName, setChildName] = useState<string>('');
  const [currentSegment, setCurrentSegment] = useState<number>(0);
  const [currentChallenge, setCurrentChallenge] = useState<Pick<
    Challenge,
    'action' | 'display_text' | 'tts_text'
  > | null>(null);
  const [narrativeText, setNarrativeText] = useState<string>('');
  const [lastBadge, setLastBadge] = useState<Badge | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [retryFn, setRetryFn] = useState<(() => void) | null>(null);

  // Ref to carry next segment data into runBadge's setTimeout closure
  const pendingNextSegment = useRef<{ segment: Segment; challenge: Challenge } | null>(null);

  // ── Hooks ──────────────────────────────────────────────────────────────────
  const camera = useCamera({ width: 480, height: 360 });
  const audio = useAudio();

  // ── Mic recording state ────────────────────────────────────────────────────
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // ── Helpers ────────────────────────────────────────────────────────────────

  /** Play TTS text and wait for playback to finish. Ignores "Playback stopped" rejections. */
  const speak = useCallback(
    async (text: string, sid: string) => {
      try {
        const blob = await callTTS(text, sid);
        await audio.playBlob(blob);
      } catch (err) {
        if (err instanceof Error && err.message === 'Playback stopped') return;
        throw err;
      }
    },
    [audio]
  );

  /** Record from microphone. */
  const startRecording = useCallback(async (): Promise<void> => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioChunksRef.current = [];
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    recorder.start();
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback((): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder) {
        reject(new Error('No active recorder'));
        return;
      }

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        recorder.stream.getTracks().forEach((t) => t.stop());
        mediaRecorderRef.current = null;
        setIsRecording(false);
        resolve(blob);
      };

      recorder.stop();
    });
  }, []);

  /** Shared error handler. */
  const handleError = useCallback((err: unknown, retryFnArg?: () => void) => {
    const msg =
      err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định';
    console.error('[MagicMirror]', err);
    setErrorMessage(msg);
    if (retryFnArg) setRetryFn(() => retryFnArg);
    else setRetryFn(null);
  }, []);

  // ── State Transitions ──────────────────────────────────────────────────────

  /** IDLE → MAGIC_SIGN */
  const handleStart = useCallback(async () => {
    setErrorMessage('');
    setAppState('MAGIC_SIGN');
    setStatusText('Hãy dùng ký hiệu phép thuật để bắt đầu! ✌️');
    await camera.startCamera();
  }, [camera]);

  /** MAGIC_SIGN → capture + verify */
  const handleMagicSignCheck = useCallback(async () => {
    setErrorMessage('');
    setStatusText('Đang kiểm tra ký hiệu...');
    try {
      const frame = camera.captureFrame();
      if (!frame) throw new Error('Không thể chụp khung hình từ camera');

      const res = await verifyVision({
        sessionId: '',           // no session yet — backend ignores for magic_sign_check
        imageBase64: frame,
        expectedAction: 'peace_sign',
        context: 'magic_sign_check',
      });

      if (res.result === 'pass') {
        await runGreeting();
      } else {
        setStatusText('Thử lại ký hiệu phép thuật nhé! ✌️');
      }
    } catch (err) {
      handleError(err, handleMagicSignCheck);
    }
  }, [camera]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * STORY: TTS narration → TTS challenge → CHALLENGE.
   * Always receives segment + challenge explicitly — no stale closure risk.
   */
  const runStory = useCallback(
    async (sid: string, seg: Segment, challenge: Challenge) => {
      setAppState('STORY');
      setStatusText('Câu chuyện đang bắt đầu...');
      setNarrativeText(seg.narrative_text);
      setCurrentChallenge(challenge);

      try {
        await speak(seg.narration_tts, sid);
        await speak(challenge.tts_text, sid);
        setAppState('CHALLENGE');
        setStatusText('Đến lượt bạn! Thực hiện thử thách nào! 💪');
      } catch (err) {
        handleError(err);
      }
    },
    [speak, handleError]
  );

  /** GREETING: /story/start → TTS greeting → STT name → TTS welcome → STORY */
  const runGreeting = useCallback(async () => {
    setAppState('GREETING');
    setStatusText('Đang tải câu chuyện...');
    try {
      const data = await startStory('forest');
      const sid = data.session_id;

      setSessionId(sid);
      setCurrentSegment(data.segment.segment_index);

      // Greet the child and ask for their name
      setStatusText('Lio đang chào bạn...');
      await speak('Xin chào! Mình là Lio! Bạn tên là gì?', sid);

      // Record child's name
      setStatusText('Nhấn mic để nói tên của bạn 🎤');
      // Store data in ref so handleStopRecording can access it without stale closure
      pendingNextSegment.current = {
        segment: data.segment,
        challenge: data.selected_challenge,
      };
      await startRecording();
    } catch (err) {
      handleError(err, runGreeting);
    }
  }, [speak, startRecording, handleError]);

  /** Called when child presses "Dừng" mic button after saying their name */
  const handleStopRecording = useCallback(async () => {
    try {
      const blob = await stopRecording();
      setStatusText('Đang nhận diện tên...');

      // Grab session id from DOM-stable ref approach: read from sessionId state
      // sessionId is set before startRecording is called so it's fresh here
      const sid = sessionId;
      const sttRes = await callSTT(blob, sid);
      const name = sttRes.text.trim();
      setChildName(name);

      setStatusText(`Xin chào ${name || 'bạn'}!`);
      await speak(
        `Xin chào ${name || 'bạn'}! Chúng ta bắt đầu hành trình thôi!`,
        sid
      );

      // Use segment 0 data stored in ref during runGreeting
      const pending = pendingNextSegment.current;
      if (!pending) throw new Error('Segment 0 data missing — runGreeting may have failed');
      pendingNextSegment.current = null;

      await runStory(sid, pending.segment, pending.challenge);
    } catch (err) {
      handleError(err);
    }
  }, [stopRecording, sessionId, speak, handleError, runStory]);

  /** CHALLENGE → capture → VERIFY */
  const handleChallengeCapture = useCallback(async () => {
    setErrorMessage('');
    try {
      const frame = camera.captureFrame();
      if (!frame) throw new Error('Không thể chụp khung hình từ camera');

      setAppState('VERIFY');
      setStatusText('Đang kiểm tra hành động...');

      const res = await verifyVision({
        sessionId,
        imageBase64: frame,
        expectedAction: currentChallenge?.action ?? 'raise_hands',
        context: 'challenge_verify',
      });

      await runAdapt(res.result as VerifyResult);
    } catch (err) {
      handleError(err, handleChallengeCapture);
    }
  }, [camera, sessionId, currentChallenge]); // eslint-disable-line react-hooks/exhaustive-deps

  /** ADAPT: /story/adapt → TTS → handle next_action */
  const runAdapt = useCallback(
    async (result: VerifyResult) => {
      setAppState('ADAPT');
      setStatusText('Lio đang phản hồi...');
      try {
        const adaptRes = await adaptNarrative({
          sessionId,
          verifyResult: result,
          segmentIndex: currentSegment,
        });

        await speak(adaptRes.tts_text, sessionId);

        if (adaptRes.next_action === 'award_badge') {
          // Store next segment for runBadge's setTimeout closure
          if (adaptRes.next_segment_data && adaptRes.next_challenge) {
            pendingNextSegment.current = {
              segment: adaptRes.next_segment_data,
              challenge: adaptRes.next_challenge,
            };
          } else {
            pendingNextSegment.current = null;
          }
          // FIX: sync segment index from backend response, not self-increment
          if (adaptRes.next_segment_data) {
            setCurrentSegment(adaptRes.next_segment_data.segment_index);
          }
          await runBadge(sessionId);
        } else if (adaptRes.next_action === 'retry_challenge') {
          setStatusText('Thử lại nào! Bạn làm được! 💪');
          setAppState('CHALLENGE');
        } else if (adaptRes.next_action === 'downgrade_challenge') {
          if (adaptRes.downgraded_challenge) {
            setCurrentChallenge(adaptRes.downgraded_challenge);
          }
          setStatusText('Thử thử thách mới nào! 🌟');
          setAppState('CHALLENGE');
        }
      } catch (err) {
        handleError(err, () => runAdapt(result));
      }
    },
    [sessionId, currentSegment, speak, handleError] // eslint-disable-line react-hooks/exhaustive-deps
  );

  /** BADGE: /story/badge → show popup → continue or DONE */
  const runBadge = useCallback(
    async (sid: string) => {
      setAppState('BADGE');
      setStatusText('');
      try {
        const badgeRes = await getBadge(sid);
        setLastBadge(badgeRes.badge);

        setTimeout(() => {
          setLastBadge(null);
          const pending = pendingNextSegment.current;
          if (pending) {
            pendingNextSegment.current = null;
            runStory(sid, pending.segment, pending.challenge);
          } else {
            setAppState('DONE');
            setStatusText('🎉 Bạn đã hoàn thành hành trình!');
          }
        }, 3000);
      } catch (err) {
        handleError(err);
      }
    },
    [handleError, runStory]
  );

  // ── Cleanup camera on DONE ─────────────────────────────────────────────────
  useEffect(() => {
    if (appState === 'DONE') {
      camera.stopCamera();
    }
  }, [appState]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🪄 MoveMyth — Magic Mirror</h1>

      {/* Error Banner */}
      {errorMessage && (
        <div style={styles.errorBanner}>
          <span>⚠️ {errorMessage}</span>
          {retryFn && (
            <button
              style={styles.retryButton}
              onClick={() => {
                setErrorMessage('');
                retryFn();
              }}
            >
              Thử lại
            </button>
          )}
        </div>
      )}

      {/* ── IDLE ── */}
      {appState === 'IDLE' && (
        <div style={styles.section}>
          <p style={styles.subtitle}>Sẵn sàng cho hành trình phép thuật chưa?</p>
          <button id="btn-start" style={styles.primaryButton} onClick={handleStart}>
            Bắt đầu ✨
          </button>
        </div>
      )}

      {/* ── MAGIC_SIGN ── */}
      {appState === 'MAGIC_SIGN' && (
        <div style={styles.section}>
          <p style={styles.subtitle}>{statusText}</p>
          <div style={styles.videoWrapper}>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              ref={camera.videoRef}
              autoPlay
              playsInline
              muted
              style={styles.video}
            />
          </div>
          {camera.error && (
            <p style={styles.errorInline}>Camera lỗi: {camera.error}</p>
          )}
          <button
            id="btn-magic-check"
            style={styles.primaryButton}
            onClick={handleMagicSignCheck}
            disabled={!camera.isActive}
          >
            ✌️ Kiểm tra ký hiệu
          </button>
        </div>
      )}

      {/* ── GREETING ── */}
      {appState === 'GREETING' && (
        <div style={styles.section}>
          <p style={styles.subtitle}>{statusText}</p>
          {isRecording ? (
            <>
              <div style={styles.recordingIndicator}>🔴 Đang ghi âm...</div>
              <button
                id="btn-stop-recording"
                style={styles.primaryButton}
                onClick={handleStopRecording}
              >
                ⏹ Dừng
              </button>
            </>
          ) : (
            <div style={styles.spinner}>⏳</div>
          )}
        </div>
      )}

      {/* ── STORY ── */}
      {appState === 'STORY' && (
        <div style={styles.section}>
          <p style={styles.subtitle}>{statusText}</p>
          {narrativeText && (
            <div style={styles.narrativeBox}>
              <p>{narrativeText}</p>
            </div>
          )}
          <div style={styles.spinner}>🎙️ Đang đọc câu chuyện...</div>
        </div>
      )}

      {/* ── CHALLENGE ── */}
      {appState === 'CHALLENGE' && (
        <div style={styles.section}>
          <p style={styles.subtitle}>Thử thách của bạn:</p>
          {currentChallenge && (
            <div style={styles.challengeBox}>
              <p style={styles.challengeText}>{currentChallenge.display_text}</p>
              <span style={styles.challengeAction}>
                🎯 Hành động: <strong>{currentChallenge.action}</strong>
              </span>
            </div>
          )}
          <div style={styles.videoWrapper}>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              ref={camera.videoRef}
              autoPlay
              playsInline
              muted
              style={styles.video}
            />
          </div>
          {camera.error && (
            <p style={styles.errorInline}>Camera lỗi: {camera.error}</p>
          )}
          <button
            id="btn-done"
            style={styles.primaryButton}
            onClick={handleChallengeCapture}
            disabled={!camera.isActive}
          >
            ✅ Xong rồi!
          </button>
        </div>
      )}

      {/* ── VERIFY ── */}
      {appState === 'VERIFY' && (
        <div style={styles.section}>
          <div style={styles.spinner}>🔍</div>
          <p style={styles.subtitle}>{statusText}</p>
        </div>
      )}

      {/* ── ADAPT ── */}
      {appState === 'ADAPT' && (
        <div style={styles.section}>
          <div style={styles.spinner}>🦁</div>
          <p style={styles.subtitle}>{statusText}</p>
        </div>
      )}

      {/* ── BADGE ── */}
      {appState === 'BADGE' && lastBadge && (
        <div style={styles.section}>
          <div style={styles.badgePopup}>
            <div style={styles.badgeEmoji}>{lastBadge.emoji}</div>
            <p style={styles.badgeLabel}>{lastBadge.label}</p>
            <p style={styles.badgeCaption}>Huy hiệu mới! 🎉</p>
          </div>
        </div>
      )}

      {/* ── DONE ── */}
      {appState === 'DONE' && (
        <div style={styles.section}>
          <div style={styles.doneEmoji}>🏆</div>
          <h2 style={styles.doneTitle}>Hoàn thành! 🎉</h2>
          {childName && (
            <p style={styles.subtitle}>
              Cảm ơn {childName} đã tham gia hành trình phép thuật cùng Lio!
            </p>
          )}
          <button
            id="btn-restart"
            style={styles.primaryButton}
            onClick={() => {
              setAppState('IDLE');
              setSessionId('');
              setChildName('');
              setCurrentSegment(0);
              setCurrentChallenge(null);
              setNarrativeText('');
              setLastBadge(null);
              setErrorMessage('');
              setRetryFn(null);
              pendingNextSegment.current = null;
            }}
          >
            Chơi lại 🔄
          </button>
        </div>
      )}

      {/* Debug: state indicator (remove in production) */}
      <div style={styles.debugBadge}>State: {appState}</div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px 16px',
    fontFamily: 'sans-serif',
    backgroundColor: '#0f0f1a',
    color: '#f0f0ff',
    position: 'relative',
  },
  title: {
    fontSize: '1.6rem',
    marginBottom: '24px',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '1.1rem',
    textAlign: 'center',
    marginBottom: '16px',
    color: '#c8c8f0',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '520px',
    gap: '16px',
  },
  primaryButton: {
    padding: '14px 32px',
    fontSize: '1rem',
    fontWeight: 700,
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#6c63ff',
    color: '#fff',
    transition: 'opacity 0.2s',
  },
  retryButton: {
    marginLeft: '12px',
    padding: '6px 16px',
    fontSize: '0.85rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#ff6b6b',
    color: '#fff',
  },
  errorBanner: {
    width: '100%',
    maxWidth: '520px',
    backgroundColor: '#3d1515',
    border: '1px solid #ff4444',
    borderRadius: '10px',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    color: '#ffaaaa',
  },
  errorInline: {
    color: '#ff8888',
    fontSize: '0.85rem',
  },
  videoWrapper: {
    width: '100%',
    borderRadius: '14px',
    overflow: 'hidden',
    border: '2px solid #6c63ff',
  },
  video: {
    width: '100%',
    display: 'block',
    backgroundColor: '#111',
    transform: 'scaleX(-1)',
  },
  narrativeBox: {
    backgroundColor: '#1a1a2e',
    border: '1px solid #444',
    borderRadius: '12px',
    padding: '16px',
    width: '100%',
    textAlign: 'center',
    lineHeight: 1.6,
  },
  challengeBox: {
    backgroundColor: '#1e1a3a',
    border: '2px solid #6c63ff',
    borderRadius: '12px',
    padding: '20px',
    width: '100%',
    textAlign: 'center',
  },
  challengeText: {
    fontSize: '1.1rem',
    marginBottom: '8px',
    lineHeight: 1.5,
  },
  challengeAction: {
    fontSize: '0.9rem',
    color: '#c8c8f0',
  },
  recordingIndicator: {
    fontSize: '1.2rem',
    color: '#ff6b6b',
  },
  spinner: {
    fontSize: '2rem',
    textAlign: 'center',
    padding: '20px',
  },
  badgePopup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#1e1a3a',
    border: '3px solid #f9c74f',
    borderRadius: '20px',
    padding: '40px 60px',
    textAlign: 'center',
    boxShadow: '0 0 40px rgba(249,199,79,0.3)',
  },
  badgeEmoji: {
    fontSize: '5rem',
    marginBottom: '12px',
  },
  badgeLabel: {
    fontSize: '1.4rem',
    fontWeight: 700,
    color: '#f9c74f',
    marginBottom: '4px',
  },
  badgeCaption: {
    fontSize: '1rem',
    color: '#c8c8f0',
  },
  doneEmoji: {
    fontSize: '5rem',
    textAlign: 'center',
  },
  doneTitle: {
    fontSize: '2rem',
    textAlign: 'center',
    color: '#f9c74f',
  },
  debugBadge: {
    position: 'fixed',
    bottom: '12px',
    right: '12px',
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#aaa',
    fontSize: '0.75rem',
    padding: '4px 10px',
    borderRadius: '8px',
    pointerEvents: 'none',
  },
};
