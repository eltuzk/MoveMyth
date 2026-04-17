/**
 * StoryScene — Story narrative display component.
 *
 * Displays the current story scene text narrated by Lio,
 * along with scene illustrations when available.
 * Narrative text fades in per scene change using Framer Motion.
 */

import { useSession } from '../../contexts/SessionContext';
import { motion, AnimatePresence } from 'framer-motion';

function StoryScene() {
  const { state } = useSession();
  const { scenes, currentScene, storyTheme, sessionStarted } = state;

  const currentSceneText = scenes[currentScene] || null;

  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur-sm shadow-xl border border-magic-100 overflow-hidden">
      {/* Scene Header */}
      <div className="bg-gradient-to-r from-magic-500 to-fairy-500 p-4">
        <div className="flex items-center gap-3">
          <motion.span
            className="text-3xl"
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
          >
            📖
          </motion.span>
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
        <AnimatePresence mode="wait">
          {!sessionStarted ? (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="text-center text-magic-400"
            >
              <motion.span
                className="text-5xl block mb-4"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                🧚
              </motion.span>
              <p className="font-display text-lg font-semibold">
                Lio đang chờ bạn!
              </p>
              <p className="font-body text-sm mt-2 text-magic-300">
                Bật Gương Phép Thuật và giơ dấu hiệu ma thuật để bắt đầu
              </p>
            </motion.div>
          ) : currentSceneText ? (
            <motion.div
              key={`scene-${currentScene}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="space-y-4 w-full"
            >
              <motion.p
                className="font-body text-lg text-gray-700 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                {currentSceneText}
              </motion.p>
              <motion.div
                className="flex items-center gap-2 text-sm text-magic-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <span>🎬</span>
                <span>Cảnh {currentScene + 1} / {scenes.length}</span>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center text-magic-400"
            >
              <motion.span
                className="text-4xl block mb-3"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                ✨
              </motion.span>
              <p className="font-body text-sm">
                Lio đang kể chuyện...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default StoryScene;
