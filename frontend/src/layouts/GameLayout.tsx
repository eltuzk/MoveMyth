import React from 'react';
import { TopBar } from '../components/TopBar';
import { LioBar } from '../components/LioBar';

import { Sidebar } from '../components/Sidebar';

export interface GameLayoutProps {
  children: React.ReactNode;
  screenKey: string;
  lioSpeechText?: string;
  isLioListening?: boolean;
  customFooter?: React.ReactNode;
  showFooter?: boolean;
}

export const GameLayout: React.FC<GameLayoutProps> = ({ 
  children, 
  screenKey,
  lioSpeechText,
  isLioListening,
  customFooter,
  showFooter = true
}) => {
  return (
    <div className="flex flex-col h-screen relative font-['Be_Vietnam_Pro'] bg-[#fffcf7] overflow-hidden">
      <TopBar screenKey={screenKey} />
      <Sidebar />
      
      {/* 
        Container for main content. 
        pl-[72px] ensure space for the Sidebar.
        pb-[80px] ensure space for the footer area.
      */}
      <div className={`flex-1 overflow-x-hidden overflow-y-auto relative w-full pl-[72px] ${showFooter ? 'pb-[140px]' : 'pb-0'}`}>
        {children}
      </div>

      {showFooter && (
        <div className="absolute bottom-0 left-[72px] right-0 z-[100] pb-2">
          {customFooter ? (
            customFooter
          ) : (
            <LioBar speechText={lioSpeechText} isListening={isLioListening} />
          )}
        </div>
      )}
    </div>
  );
};
