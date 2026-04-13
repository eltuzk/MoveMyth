import React from 'react';
import { TopBar } from '../components/TopBar';

export interface BaseLayoutProps {
  children: React.ReactNode;
  screenKey: string;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({ children, screenKey }) => {
  return (
    <div className="flex flex-col min-h-screen relative font-['Be_Vietnam_Pro'] bg-[#fffcf7] overflow-x-hidden">
      <TopBar screenKey={screenKey} />
      {/* 
        Container for main content. 
        It occupies remaining height to ensure full page layout.
      */}
      <div className="flex-1 flex flex-col relative w-full h-full pb-safe">
        {children}
      </div>
    </div>
  );
};
