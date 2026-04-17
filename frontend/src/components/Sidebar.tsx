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
  isExpanded: controlledExpanded,
  onExpandChange,
}) => {
  const [internalExpanded, setInternalExpanded] = React.useState(false);
  const isExpanded = controlledExpanded ?? internalExpanded;

  const navigate = useNavigate();
  const location = useLocation();

  const handleHover = (expanded: boolean) => {
    setInternalExpanded(expanded);
    onExpandChange?.(expanded);
  };

  return (
    <aside
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      className={`fixed left-0 top-[56px] z-[150] h-[calc(100vh-56px)] overflow-hidden bg-white border-r border-[#ece7f5] shadow-[4px_0_24px_rgba(73,25,125,0.05)] transition-[width] duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${
        isExpanded ? 'w-[200px]' : 'w-[72px]'
      }`}
    >
      <nav className="flex h-full flex-col gap-2 px-3 py-6">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex h-[48px] w-full items-center rounded-2xl px-3 text-left transition-all duration-300 ease-out focus:outline-none group ${
                isActive
                  ? 'bg-[#7a4eb0] text-white shadow-[0_8px_16px_rgba(122,78,176,0.2)]'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <div className="flex shrink-0 items-center justify-center w-6">
                <span
                  className="material-symbols-outlined text-[24px] transition-transform duration-300 group-hover:scale-110"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "''" }}
                >
                  {item.icon}
                </span>
              </div>
              <span
                className={`ml-4 whitespace-nowrap text-[13px] font-bold tracking-tight transition-all duration-300 ${
                  isExpanded 
                    ? 'translate-x-0 opacity-100 visible' 
                    : '-translate-x-4 opacity-0 invisible'
                }`}
              >
                {item.label}
              </span>
              
              {isActive && !isExpanded && (
                <div className="absolute left-0 w-1.5 h-6 bg-[#7a4eb0] rounded-r-full" />
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};