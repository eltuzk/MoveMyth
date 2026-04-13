import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { icon: 'library_books', label: 'Thư viện', path: '/' },
  { icon: 'play_circle', label: 'Đang chơi', path: '/story' },
  { icon: 'military_tech', label: 'Huy hiệu', path: '/badge' },
  { icon: 'family_restroom', label: 'Dành cho ba mẹ', path: '/parent' },
];

interface SidebarProps {
  isExpanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isExpanded = false,
  onExpandChange,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      onMouseEnter={() => onExpandChange?.(true)}
      onMouseLeave={() => onExpandChange?.(false)}
      className={`fixed left-0 top-[56px] z-50 h-[calc(100vh-56px)] overflow-hidden bg-white border-r border-[#ece7f5] shadow-[10px_0_24px_rgba(73,25,125,0.08)] transition-[width] duration-250 ease-in-out ${
        isExpanded ? 'w-[200px]' : 'w-[64px]'
      }`}
    >
      <nav className="flex h-full flex-col gap-3 px-2 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex h-12 w-full items-center rounded-full px-3 text-left transition-all duration-200 focus:outline-none ${
                isActive
                  ? 'bg-[#7a4eb0] text-white shadow-[0_10px_24px_rgba(122,78,176,0.24)]'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <span
                className="material-symbols-outlined shrink-0 text-[24px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "''" }}
              >
                {item.icon}
              </span>
              <span
                className={`ml-3 whitespace-nowrap text-sm font-bold transition-all duration-200 ${
                  isExpanded ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'
                } ${isActive ? 'text-white' : 'text-slate-500'}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};