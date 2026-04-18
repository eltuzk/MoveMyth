import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SessionProvider } from './contexts/SessionContext'
import { HomeLandingScreen } from './screens/HomeLandingScreen'
import { CharacterSetupOnboarding } from './screens/CharacterSetupOnboarding'
import { MagicSignActivation } from './screens/MagicSignActivation'
import { ActiveStorytellingView } from './screens/ActiveStorytellingView'
import { ActiveVerificationChallenge } from './screens/ActiveVerificationChallenge'
import { AdventureCompleteSummary } from './screens/AdventureCompleteSummary'
import { VoiceChoiceChallenge } from './screens/VoiceChoiceChallenge'
import { LioDemoChallenge } from './screens/LioDemoChallenge'
import { ParentDashboard } from './screens/ParentDashboard'

import { BaseLayout } from './layouts/BaseLayout'
import { GameLayout } from './layouts/GameLayout'
import { StandaloneLayout } from './layouts/StandaloneLayout'


function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BaseLayout screenKey="home"><HomeLandingScreen /></BaseLayout>} />
          <Route path="/onboarding" element={<GameLayout screenKey="onboarding"><CharacterSetupOnboarding /></GameLayout>} />
          <Route path="/magic-sign" element={<GameLayout screenKey="magic-sign"><MagicSignActivation /></GameLayout>} />
          <Route path="/story" element={<GameLayout screenKey="story" showFooter={false}><ActiveStorytellingView /></GameLayout>} />
          <Route path="/challenge/voice" element={<GameLayout screenKey="challenge-voice"><VoiceChoiceChallenge /></GameLayout>} />
          <Route path="/challenge/demo" element={<StandaloneLayout screenKey="challenge-demo"><LioDemoChallenge /></StandaloneLayout>} />
          <Route 
            path="/verify" 
            element={
              <GameLayout 
                screenKey="verify" 
                showFooter={false}
              >
                <ActiveVerificationChallenge />
              </GameLayout>
            } 
          />
          <Route path="/complete" element={<GameLayout screenKey="complete" showFooter={false}><AdventureCompleteSummary /></GameLayout>} />
          <Route path="/parent" element={<BaseLayout screenKey="parent"><ParentDashboard /></BaseLayout>} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  )
}

export default App
