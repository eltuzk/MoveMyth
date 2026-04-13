import React from 'react';
import { TopBar } from '../components/TopBar';

import { Sidebar } from '../components/Sidebar';

export interface BaseLayoutProps {
  children: React.ReactNode;
  screenKey: string;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({ children, screenKey }) => {
  return (
    <div className="flex flex-col min-h-screen relative font-['Be_Vietnam_Pro'] bg-[#fffcf7] overflow-x-hidden">
      <TopBar screenKey={screenKey} />
      <Sidebar />
      {/* 
        Container for main content. 
        pl-[72px] ensures content is not covered by the collapsed sidebar.
      */}
      <div className="flex-1 flex flex-col relative w-full h-full pb-safe pl-[72px]">
        {children}
      </div>
    </div>
  );
};
