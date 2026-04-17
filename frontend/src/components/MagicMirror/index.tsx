/**
 * MagicMirror — Camera + WebSocket component.
 *
 * Displays the child's camera feed (the "Magic Mirror") and handles
 * WebSocket connection for sending video frames to Vision Verifier.
 * Wrapped with MagicCameraFrame for animated magical border.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCamera } from '../../hooks/useCamera';
import { MagicCameraFrame } from '../MagicCameraFrame';

type InputMode = 'camera' | 'upload';

interface UploadedPreview {
  kind: 'image' | 'video';
  url: string;
  name: string;
}

interface MagicMirrorProps {
  onFaceFrameReady?: (dataUrl: string) => void;
  /** Controls the magical border state from parent (e.g., verifying/pass/fail) */
  frameVariant?: 'idle' | 'verifying' | 'pass' | 'fail';
}

function MagicMirror({ onFaceFrameReady, frameVariant = 'idle' }: MagicMirrorProps) {
  const {
    videoRef,
    isActive,
    startCamera,
    stopCamera,
    captureFrameDataUrl,
    error,
  } = useCamera({
    width: 320,
    height: 240,
    facingMode: 'user',
  });

  const [mode, setMode] = useState<InputMode>('camera');
  const [uploadedPreview, setUploadedPreview] = useState<UploadedPreview | null>(null);
  const [uploadedImageDataUrl, setUploadedImageDataUrl] = useState<string | null>(null);
  const [capturedFaceDataUrl, setCapturedFaceDataUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const uploadVideoRef = useRef<HTMLVideoElement | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  const revokeUploadedUrl = useCallback(() => {
    if (uploadedPreview) URL.revokeObjectURL(uploadedPreview.url);
  }, [uploadedPreview]);

  useEffect(() => {
    return () => { revokeUploadedUrl(); };
  }, [revokeUploadedUrl]);

  const switchMode = (nextMode: InputMode) => {
    setMode(nextMode);
    setUploadError(null);
    if (nextMode === 'upload') stopCamera();
  };

  const notifyFaceReady = (dataUrl: string) => {
    setCapturedFaceDataUrl(dataUrl);
    onFaceFrameReady?.(dataUrl);
  };

  const readFileAsDataUrl = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') { resolve(result); return; }
      reject(new Error('Không đọc được file ảnh'));
    };
    reader.onerror = () => reject(new Error('Không đọc được file ảnh'));
    reader.readAsDataURL(file);
  });

  const handleUploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setCapturedFaceDataUrl(null);
    revokeUploadedUrl();

    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setUploadedPreview(null);
      setUploadedImageDataUrl(null);
      setUploadError('Chỉ hỗ trợ file ảnh hoặc video.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (file.type.startsWith('image/')) {
      setUploadedPreview({ kind: 'image', url: previewUrl, name: file.name });
      try {
        const dataUrl = await readFileAsDataUrl(file);
        setUploadedImageDataUrl(dataUrl);
      } catch (readError) {
        setUploadError(readError instanceof Error ? readError.message : 'Không đọc được ảnh.');
        setUploadedImageDataUrl(null);
      }
      return;
    }

    setUploadedPreview({ kind: 'video', url: previewUrl, name: file.name });
    setUploadedImageDataUrl(null);
  };

  const captureFromCamera = () => {
    const dataUrl = captureFrameDataUrl();
    if (!dataUrl) {
      setUploadError('Chưa thể chụp ảnh từ camera. Hãy bật camera và thử lại.');
      return;
    }
    setUploadError(null);
    notifyFaceReady(dataUrl);
  };

  const captureFromUploadedVideo = () => {
    const videoEl = uploadVideoRef.current;
    if (!videoEl) { setUploadError('Không tìm thấy video để lấy khung hình.'); return; }

    const width = videoEl.videoWidth || 320;
    const height = videoEl.videoHeight || 240;
    if (!width || !height) { setUploadError('Video chưa sẵn sàng. Hãy bấm phát video rồi thử lại.'); return; }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) { setUploadError('Trình duyệt không hỗ trợ đọc khung hình video.'); return; }

    ctx.drawImage(videoEl, 0, 0, width, height);
    notifyFaceReady(canvas.toDataURL('image/jpeg', 0.8));
    setUploadError(null);
  };

  const useUploadedImage = () => {
    if (!uploadedImageDataUrl) { setUploadError('Ảnh tải lên chưa sẵn sàng. Vui lòng chọn lại file.'); return; }
    setUploadError(null);
    notifyFaceReady(uploadedImageDataUrl);
  };

  const openFilePicker = () => { uploadInputRef.current?.click(); };

  const resetUploadedFile = () => {
    revokeUploadedUrl();
    setUploadedPreview(null);
    setUploadedImageDataUrl(null);
    setCapturedFaceDataUrl(null);
    setUploadError(null);
    if (uploadInputRef.current) uploadInputRef.current.value = '';
  };

  return (
    <MagicCameraFrame variant={frameVariant}>
      {/* Mode Selector */}
      <div className="grid grid-cols-2 gap-2 p-3 bg-magic-800/85 backdrop-blur-sm">
        {(['camera', 'upload'] as InputMode[]).map((m) => (
          <motion.button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className={`py-2 px-3 rounded-lg font-body text-sm font-semibold transition-colors ${
              mode === m
                ? 'bg-magic-400 text-white'
                : 'bg-magic-900/60 text-magic-200 hover:bg-magic-900/80'
            }`}
          >
            {m === 'camera' ? 'Quay mặt trực tiếp' : 'Tải file ảnh/video'}
          </motion.button>
        ))}
      </div>

      {/* Camera / Upload Feed — animate on mode switch */}
      <div className="aspect-[4/3] relative overflow-hidden bg-magic-900">
        <AnimatePresence mode="wait">
          {mode === 'camera' ? (
            <motion.div
              key="camera-mode"
              className="absolute inset-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {isActive ? (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-magic-200 p-8 text-center">
                  <motion.span
                    className="text-6xl mb-4"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    🪞
                  </motion.span>
                  <p className="font-display text-xl font-semibold mb-2">Gương Phép Thuật</p>
                  <p className="font-body text-sm text-magic-300 mb-4">
                    Bật camera trước để bé quay mặt và bắt đầu thử thách!
                  </p>
                  {error && <p className="text-orange-300 text-xs mb-2">{error}</p>}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="upload-mode"
              className="absolute inset-0 bg-magic-950/30 flex items-center justify-center p-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {!uploadedPreview && (
                <div className="text-center text-magic-100">
                  <p className="font-display text-xl font-semibold mb-2">Tải ảnh hoặc video</p>
                  <p className="font-body text-sm text-magic-200">Chọn file có khuôn mặt bé để xác minh nhanh.</p>
                </div>
              )}
              {uploadedPreview?.kind === 'image' && (
                <img src={uploadedPreview.url} alt={uploadedPreview.name} className="w-full h-full object-cover rounded-xl" />
              )}
              {uploadedPreview?.kind === 'video' && (
                <video ref={uploadVideoRef} src={uploadedPreview.url} className="w-full h-full object-cover rounded-xl" controls playsInline />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="p-4 bg-magic-800/80 backdrop-blur-sm">
        <AnimatePresence mode="wait">
          {mode === 'camera' ? (
            <motion.div
              key="camera-controls"
              className="space-y-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <motion.button
                type="button"
                onClick={isActive ? stopCamera : startCamera}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full py-3 px-6 rounded-xl font-display font-semibold text-lg transition-colors duration-300 ${
                  isActive
                    ? 'bg-orange-400/80 hover:bg-orange-400 text-white'
                    : 'bg-magic-500 hover:bg-magic-400 text-white hover:shadow-lg hover:shadow-magic-500/30'
                }`}
              >
                {isActive ? 'Tắt camera' : 'Bật camera trước'}
              </motion.button>

              <motion.button
                type="button"
                onClick={captureFromCamera}
                disabled={!isActive}
                whileHover={isActive ? { scale: 1.02 } : {}}
                whileTap={isActive ? { scale: 0.97 } : {}}
                className="w-full py-2.5 px-5 rounded-xl font-body font-semibold text-white bg-forest-500 hover:bg-forest-400 disabled:bg-gray-500/70 disabled:cursor-not-allowed transition-colors"
              >
                Chụp khuôn mặt
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="upload-controls"
              className="space-y-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <input ref={uploadInputRef} type="file" accept="image/*,video/*" onChange={handleUploadFile} className="hidden" />

              <div className="rounded-xl border border-magic-300/25 bg-magic-900/35 p-3">
                <div className="flex items-center gap-2">
                  <motion.button
                    type="button"
                    onClick={openFilePicker}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    className="shrink-0 rounded-lg bg-magic-500 hover:bg-magic-400 px-4 py-2 text-sm font-body font-semibold text-white transition-colors"
                  >
                    Chọn ảnh/video
                  </motion.button>
                  <p className="text-sm text-magic-100 truncate">
                    {uploadedPreview ? uploadedPreview.name : 'Chưa có file nào được chọn'}
                  </p>
                </div>
                {uploadedPreview && (
                  <button type="button" onClick={resetUploadedFile} className="mt-2 text-xs text-magic-200 hover:text-white transition-colors">
                    Đổi hoặc xoá file
                  </button>
                )}
              </div>

              {uploadedPreview?.kind === 'image' && (
                <motion.button
                  type="button"
                  onClick={useUploadedImage}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-2.5 px-5 rounded-xl font-body font-semibold text-white bg-forest-500 hover:bg-forest-400 transition-colors"
                >
                  Dùng ảnh này để xác minh
                </motion.button>
              )}

              {uploadedPreview?.kind === 'video' && (
                <motion.button
                  type="button"
                  onClick={captureFromUploadedVideo}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-2.5 px-5 rounded-xl font-body font-semibold text-white bg-forest-500 hover:bg-forest-400 transition-colors"
                >
                  Lấy khung hình hiện tại
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {uploadError && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-orange-300 text-xs mt-3"
          >
            {uploadError}
          </motion.p>
        )}

        <AnimatePresence>
          {capturedFaceDataUrl && (
            <motion.div
              key="captured"
              className="mt-4 bg-magic-950/30 rounded-xl p-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-magic-100 text-sm font-body mb-2">Ảnh khuôn mặt sẵn sàng để gửi verify</p>
              <img src={capturedFaceDataUrl} alt="Captured face" className="w-24 h-24 object-cover rounded-lg border border-magic-200/20" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MagicCameraFrame>
  );
}

export default MagicMirror;
