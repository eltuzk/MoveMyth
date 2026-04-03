import { SessionProvider } from './contexts/SessionContext'
import MagicMirror from './components/MagicMirror'
import StoryScene from './components/StoryScene'
import BadgeDisplay from './components/BadgeDisplay'
import ChallengeOverlay from './components/ChallengeOverlay'

function App() {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-gradient-to-br from-magic-50 via-fairy-50 to-forest-50">
        {/* Header */}
        <header className="p-4 text-center">
          <h1 className="font-display text-4xl font-bold text-magic-600">
            🧚 MoveMyth
          </h1>
          <p className="font-body text-magic-400 mt-1">
            Câu chuyện phép thuật đang chờ bạn!
          </p>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Camera / Magic Mirror */}
          <section className="order-1">
            <MagicMirror />
          </section>

          {/* Story Scene */}
          <section className="order-2">
            <StoryScene />
          </section>
        </main>

        {/* Badge Display */}
        <BadgeDisplay />

        {/* Challenge Overlay (shows on top when active) */}
        <ChallengeOverlay />
      </div>
    </SessionProvider>
  )
}

export default App
