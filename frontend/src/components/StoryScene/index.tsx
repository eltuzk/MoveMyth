/**
 * StoryScene — Story narrative display component.
 *
 * Displays the current story scene text narrated by Lio,
 * along with scene illustrations when available.
 */

import { useSession } from '../../contexts/SessionContext';

function StoryScene() {
  const { state } = useSession();
  const { scenes, currentScene, storyTheme, sessionStarted } = state;

  const currentSceneText = scenes[currentScene] || null;

  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur-sm shadow-xl border border-magic-100 overflow-hidden">
      {/* Scene Header */}
      <div className="bg-gradient-to-r from-magic-500 to-fairy-500 p-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📖</span>
          <div>
            <h2 className="font-display text-xl font-bold text-white">
              Câu Chuyện Của Lio
            </h2>
            {storyTheme && (
              <p className="text-white/80 text-sm font-body">
                Chủ đề: {storyTheme}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Scene Content */}
      <div className="p-6 min-h-[200px] flex items-center justify-center">
        {!sessionStarted ? (
          <div className="text-center text-magic-400">
            <span className="text-5xl block mb-4 animate-float">🧚</span>
            <p className="font-display text-lg font-semibold">
              Lio đang chờ bạn!
            </p>
            <p className="font-body text-sm mt-2 text-magic-300">
              Bật Gương Phép Thuật và giơ dấu hiệu ma thuật để bắt đầu
            </p>
          </div>
        ) : currentSceneText ? (
          <div className="space-y-4">
            <p className="font-body text-lg text-gray-700 leading-relaxed">
              {currentSceneText}
            </p>
            <div className="flex items-center gap-2 text-sm text-magic-400">
              <span>🎬</span>
              <span>Cảnh {currentScene + 1} / {scenes.length}</span>
            </div>
          </div>
        ) : (
          <div className="text-center text-magic-400">
            <span className="text-4xl block mb-3 animate-bounce-slow">✨</span>
            <p className="font-body text-sm">
              Lio đang kể chuyện...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StoryScene;
