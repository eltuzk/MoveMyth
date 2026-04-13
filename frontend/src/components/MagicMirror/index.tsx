/**
 * MagicMirror — Camera + WebSocket component.
 *
 * Displays the child's camera feed (the "Magic Mirror") and handles
 * WebSocket connection for sending video frames to Vision Verifier.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useCamera } from '../../hooks/useCamera';

type InputMode = 'camera' | 'upload';

interface UploadedPreview {
  kind: 'image' | 'video';
  url: string;
  name: string;
}

interface MagicMirrorProps {
  onFaceFrameReady?: (dataUrl: string) => void;
}

function MagicMirror({ onFaceFrameReady }: MagicMirrorProps) {
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
    if (uploadedPreview) {
      URL.revokeObjectURL(uploadedPreview.url);
    }
  }, [uploadedPreview]);

  useEffect(() => {
    return () => {
      revokeUploadedUrl();
    };
  }, [revokeUploadedUrl]);

  const switchMode = (nextMode: InputMode) => {
    setMode(nextMode);
    setUploadError(null);

    if (nextMode === 'upload') {
      stopCamera();
    }
  };

  const notifyFaceReady = (dataUrl: string) => {
    setCapturedFaceDataUrl(dataUrl);
    onFaceFrameReady?.(dataUrl);
  };

  const readFileAsDataUrl = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        resolve(result);
        return;
      }
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
    if (!videoEl) {
      setUploadError('Không tìm thấy video để lấy khung hình.');
      return;
    }

    const width = videoEl.videoWidth || 320;
    const height = videoEl.videoHeight || 240;
    if (!width || !height) {
      setUploadError('Video chưa sẵn sàng. Hãy bấm phát video rồi thử lại.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setUploadError('Trình duyệt không hỗ trợ đọc khung hình video.');
      return;
    }

    ctx.drawImage(videoEl, 0, 0, width, height);
    notifyFaceReady(canvas.toDataURL('image/jpeg', 0.8));
    setUploadError(null);
  };

  const useUploadedImage = () => {
    if (!uploadedImageDataUrl) {
      setUploadError('Ảnh tải lên chưa sẵn sàng. Vui lòng chọn lại file.');
      return;
    }

    setUploadError(null);
    notifyFaceReady(uploadedImageDataUrl);
  };

  const openFilePicker = () => {
    uploadInputRef.current?.click();
  };

  const resetUploadedFile = () => {
    revokeUploadedUrl();
    setUploadedPreview(null);
    setUploadedImageDataUrl(null);
    setCapturedFaceDataUrl(null);
    setUploadError(null);

    if (uploadInputRef.current) {
      uploadInputRef.current.value = '';
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden bg-magic-900 shadow-xl animate-pulse-glow">
      {/* Mirror Frame */}
      <div className="absolute inset-0 rounded-2xl border-4 border-magic-400/30 pointer-events-none z-10" />

      {/* Mode Selector */}
      <div className="grid grid-cols-2 gap-2 p-3 bg-magic-800/85 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => switchMode('camera')}
          className={`py-2 px-3 rounded-lg font-body text-sm font-semibold transition-all ${
            mode === 'camera'
              ? 'bg-magic-400 text-white'
              : 'bg-magic-900/60 text-magic-200 hover:bg-magic-900/80'
          }`}
        >
          Quay mặt trực tiếp
        </button>
        <button
          type="button"
          onClick={() => switchMode('upload')}
          className={`py-2 px-3 rounded-lg font-body text-sm font-semibold transition-all ${
            mode === 'upload'
              ? 'bg-magic-400 text-white'
              : 'bg-magic-900/60 text-magic-200 hover:bg-magic-900/80'
          }`}
        >
          Tải file ảnh/video
        </button>
      </div>

      {/* Camera Feed */}
      <div className="aspect-[4/3] relative">
        {mode === 'camera' ? (
          isActive ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-magic-200 p-8 text-center">
              <span className="text-6xl mb-4">🪞</span>
              <p className="font-display text-xl font-semibold mb-2">
                Gương Phép Thuật
              </p>
              <p className="font-body text-sm text-magic-300 mb-4">
                Bật camera trước để bé quay mặt và bắt đầu thử thách!
              </p>
              {error && (
                <p className="text-red-400 text-xs mb-2">{error}</p>
              )}
            </div>
          )
        ) : (
          <div className="w-full h-full bg-magic-950/30 flex items-center justify-center p-4">
            {!uploadedPreview && (
              <div className="text-center text-magic-100">
                <p className="font-display text-xl font-semibold mb-2">Tải ảnh hoặc video</p>
                <p className="font-body text-sm text-magic-200">Chọn file có khuôn mặt bé để xác minh nhanh.</p>
              </div>
            )}
            {uploadedPreview?.kind === 'image' && (
              <img
                src={uploadedPreview.url}
                alt={uploadedPreview.name}
                className="w-full h-full object-cover rounded-xl"
              />
            )}
            {uploadedPreview?.kind === 'video' && (
              <video
                ref={uploadVideoRef}
                src={uploadedPreview.url}
                className="w-full h-full object-cover rounded-xl"
                controls
                playsInline
              />
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 bg-magic-800/80 backdrop-blur-sm">
        {mode === 'camera' ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={isActive ? stopCamera : startCamera}
              className={`w-full py-3 px-6 rounded-xl font-display font-semibold text-lg transition-all duration-300 ${
                isActive
                  ? 'bg-red-500/80 hover:bg-red-500 text-white'
                  : 'bg-magic-500 hover:bg-magic-400 text-white hover:shadow-lg hover:shadow-magic-500/30'
              }`}
            >
              {isActive ? 'Tắt camera' : 'Bật camera trước'}
            </button>

            <button
              type="button"
              onClick={captureFromCamera}
              disabled={!isActive}
              className="w-full py-2.5 px-5 rounded-xl font-body font-semibold text-white bg-forest-500 hover:bg-forest-400 disabled:bg-gray-500/70 disabled:cursor-not-allowed transition-colors"
            >
              Chụp khuôn mặt
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              ref={uploadInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleUploadFile}
              className="hidden"
            />

            <div className="rounded-xl border border-magic-300/25 bg-magic-900/35 p-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openFilePicker}
                  className="shrink-0 rounded-lg bg-magic-500 hover:bg-magic-400 px-4 py-2 text-sm font-body font-semibold text-white transition-colors"
                >
                  Chọn ảnh/video
                </button>

                <p className="text-sm text-magic-100 truncate">
                  {uploadedPreview ? uploadedPreview.name : 'Chưa có file nào được chọn'}
                </p>
              </div>

              {uploadedPreview && (
                <button
                  type="button"
                  onClick={resetUploadedFile}
                  className="mt-2 text-xs text-magic-200 hover:text-white transition-colors"
                >
                  Đổi hoặc xoá file
                </button>
              )}
            </div>

            {uploadedPreview?.kind === 'image' && (
              <button
                type="button"
                onClick={useUploadedImage}
                className="w-full py-2.5 px-5 rounded-xl font-body font-semibold text-white bg-forest-500 hover:bg-forest-400 transition-colors"
              >
                Dùng ảnh này để xác minh
              </button>
            )}

            {uploadedPreview?.kind === 'video' && (
              <button
                type="button"
                onClick={captureFromUploadedVideo}
                className="w-full py-2.5 px-5 rounded-xl font-body font-semibold text-white bg-forest-500 hover:bg-forest-400 transition-colors"
              >
                Lấy khung hình hiện tại
              </button>
            )}
          </div>
        )}

        {uploadError && (
          <p className="text-red-300 text-xs mt-3">{uploadError}</p>
        )}

        {capturedFaceDataUrl && (
          <div className="mt-4 bg-magic-950/30 rounded-xl p-3">
            <p className="text-magic-100 text-sm font-body mb-2">Ảnh khuôn mặt sẵn sàng để gửi verify</p>
            <img
              src={capturedFaceDataUrl}
              alt="Captured face"
              className="w-24 h-24 object-cover rounded-lg border border-magic-200/20"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default MagicMirror;
