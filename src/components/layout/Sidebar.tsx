import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Globe, Search, Bell, User, Settings } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const Sidebar: React.FC = () => {
  const notifications = useAppStore(state => state.notifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Sources', path: '/sources', icon: Globe },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="glass hidden md:flex flex-col w-64 h-screen sticky top-0 left-0 p-4 z-20" style={{ borderRadius: 0, borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}>
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xl shadow-[0_0_15px_rgba(37,99,235,0.5)]">
          AI
        </div>
        <div>
          <h2 className="text-h3 leading-tight font-bold">Watcher</h2>
          <p className="text-small text-blue-400">Universal Monitor</p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'}`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-700/50">
        <NavLink
          to="/settings"
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'}`
          }
        >
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
