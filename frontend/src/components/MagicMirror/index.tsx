/**
 * MagicMirror — Camera + WebSocket component.
 *
 * Displays the child's camera feed (the "Magic Mirror") and handles
 * WebSocket connection for sending video frames to Vision Verifier.
 */

import { useCamera } from '../../hooks/useCamera';

function MagicMirror() {
  const { videoRef, isActive, startCamera, stopCamera, error } = useCamera({
    width: 320,
    height: 240,
  });

  return (
    <div className="relative rounded-2xl overflow-hidden bg-magic-900 shadow-xl animate-pulse-glow">
      {/* Mirror Frame */}
      <div className="absolute inset-0 rounded-2xl border-4 border-magic-400/30 pointer-events-none z-10" />

      {/* Camera Feed */}
      <div className="aspect-[4/3] relative">
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
            <span className="text-6xl mb-4">🪞</span>
            <p className="font-display text-xl font-semibold mb-2">
              Gương Phép Thuật
            </p>
            <p className="font-body text-sm text-magic-300 mb-4">
              Bật camera để bắt đầu cuộc phiêu lưu!
            </p>
            {error && (
              <p className="text-red-400 text-xs mb-2">{error}</p>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 bg-magic-800/80 backdrop-blur-sm">
        <button
          onClick={isActive ? stopCamera : startCamera}
          className={`w-full py-3 px-6 rounded-xl font-display font-semibold text-lg transition-all duration-300 ${
            isActive
              ? 'bg-red-500/80 hover:bg-red-500 text-white'
              : 'bg-magic-500 hover:bg-magic-400 text-white hover:shadow-lg hover:shadow-magic-500/30'
          }`}
        >
          {isActive ? '⏹ Tắt Camera' : '✨ Bật Gương Phép Thuật'}
        </button>
      </div>
    </div>
  );
}

export default MagicMirror;
