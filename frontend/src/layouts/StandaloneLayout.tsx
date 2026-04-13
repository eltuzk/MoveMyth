import React from 'react';
import { TopBar } from '../components/TopBar';

export interface StandaloneLayoutProps {
  children: React.ReactNode;
  screenKey: string;
}

export const StandaloneLayout: React.FC<StandaloneLayoutProps> = ({ children, screenKey }) => {
  return (
    <div className="flex flex-col h-screen relative font-['Be_Vietnam_Pro'] bg-[#fffcf7] overflow-hidden">
      <TopBar screenKey={screenKey} />
      {/* 
        Container for main content. 
        It scrolls independently.
      */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto relative w-full pb-safe">
        {children}
      </div>
    </div>
  );
};
