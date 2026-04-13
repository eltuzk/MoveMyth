import React from 'react';
import { TopBar } from '../components/TopBar';

import { Sidebar } from '../components/Sidebar';

export interface StandaloneLayoutProps {
  children: React.ReactNode;
  screenKey: string;
}

export const StandaloneLayout: React.FC<StandaloneLayoutProps> = ({ children, screenKey }) => {
  return (
    <div className="flex flex-col h-screen relative font-['Be_Vietnam_Pro'] bg-[#fffcf7] overflow-hidden">
      <TopBar screenKey={screenKey} />
      <Sidebar />
      {/* 
        Container for main content. 
        pl-[72px] ensure space for the Sidebar.
      */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto relative w-full pb-safe pl-[72px]">
        {children}
      </div>
    </div>
  );
};
