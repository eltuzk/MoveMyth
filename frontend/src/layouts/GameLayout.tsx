import React from 'react';
import { TopBar } from '../components/TopBar';
import { LioBar } from '../components/LioBar';

export interface GameLayoutProps {
  children: React.ReactNode;
  screenKey: string;
  lioSpeechText?: string;
  isLioListening?: boolean;
}

export const GameLayout: React.FC<GameLayoutProps> = ({ 
  children, 
  screenKey,
  lioSpeechText,
  isLioListening
}) => {
  return (
    <div className="flex flex-col h-screen relative font-['Be_Vietnam_Pro'] bg-[#fffcf7] overflow-hidden">
      <TopBar screenKey={screenKey} />
      
      {/* 
        Container for main content. 
        It scrolls independently and has padding to avoid overlapping the LioBar.
      */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto relative w-full pb-[80px]">
        {children}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-[100]">
        <LioBar speechText={lioSpeechText} isListening={isLioListening} />
      </div>
    </div>
  );
};
