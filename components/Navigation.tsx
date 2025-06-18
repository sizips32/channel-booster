
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, LightBulbIcon, PencilSquareIcon, VideoCameraIcon, ChartBarIcon } from './icons/MiniIcons'; // Using mini icons

const Navigation: React.FC = () => {
  const navItems = [
    { path: '/dashboard', label: '대시보드', icon: <HomeIcon className="w-5 h-5 mr-3" /> },
    { path: '/planning', label: '콘텐츠 기획', icon: <LightBulbIcon className="w-5 h-5 mr-3" /> },
    // { path: '/production', label: '영상 제작 (시뮬)', icon: <VideoCameraIcon className="w-5 h-5 mr-3" /> }, // Removed as direct navigation here might be confusing. Access via Kanban.
    // { path: '/scheduler', label: '스케줄러', icon: <PencilSquareIcon className="w-5 h-5 mr-3" /> }, // Out of scope
    // { path: '/analysis', label: '채널 분석', icon: <ChartBarIcon className="w-5 h-5 mr-3" /> }, // Out of scope
  ];

  const activeClassName = "bg-indigo-600 text-white";
  const inactiveClassName = "text-slate-100 hover:bg-slate-600 hover:text-white"; // Updated for better contrast and hover

  return (
    <div className="w-64 bg-slate-800 p-4 space-y-2 flex flex-col">
      <nav className="flex-grow">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive ? activeClassName : inactiveClassName}`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto p-2 text-xs text-slate-400 border-t border-slate-700">
        <p>알파 버전</p>
        <p>&copy; 2024 Channel Booster</p>
      </div>
    </div>
  );
};

export default Navigation;