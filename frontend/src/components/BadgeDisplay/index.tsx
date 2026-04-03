/**
 * BadgeDisplay — Badge awarded celebration UI.
 *
 * Shows all badges earned during the session in a horizontal strip.
 * Animates when a new badge is awarded.
 */

import { useSession } from '../../contexts/SessionContext';

function BadgeDisplay() {
  const { state } = useSession();
  const { badges } = state;

  if (badges.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="bg-gradient-to-t from-magic-900/90 to-transparent backdrop-blur-sm p-4 pt-8">
        <div className="container mx-auto">
          <p className="font-display text-sm text-magic-200 mb-3 text-center">
            🏅 Huy hiệu của bạn
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            {badges.map((badge, index) => (
              <div
                key={`${badge.name}-${index}`}
                className="group relative bg-magic-700/60 rounded-xl px-4 py-2 border border-magic-500/30 hover:border-magic-400/60 transition-all duration-300 hover:scale-105 cursor-default"
              >
                <span className="text-2xl block text-center">🏆</span>
                <p className="font-display text-xs text-magic-200 text-center mt-1">
                  {badge.name.replace(/_/g, ' ')}
                </p>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-magic-800 rounded-lg text-xs text-magic-100 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                  {badge.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BadgeDisplay;
