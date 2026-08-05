import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Globe, Search, Bell, User, Settings, LogOut } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const Sidebar: React.FC = () => {
  const { notifications, logout } = useAppStore();
  const navigate = useNavigate();
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Sources', path: '/sources', icon: Globe },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="glass-dock hidden md:flex flex-col items-center w-20 h-screen sticky top-0 left-0 py-6 z-30 border-r border-white/10">
      {/* Brand Icon Logo */}
      <NavLink to="/" className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-pink-500 flex items-center justify-center font-extrabold text-white text-xl shadow-lg shadow-teal-500/20 mb-8 hover:scale-105 transition-transform" title="Universal AI Watcher">
        AI
      </NavLink>

      {/* Icon Navigation Menu */}
      <nav className="flex-1 flex flex-col items-center gap-4 w-full px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            title={item.name}
            className={({ isActive }) => 
              `relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 group ${
                isActive 
                  ? 'bg-gradient-to-tr from-teal-500/20 to-pink-500/20 text-teal-400 border border-teal-500/40 shadow-lg shadow-teal-500/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <item.icon size={22} />
            {item.badge !== undefined && item.badge > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full border border-slate-900 animate-pulse">
                {item.badge > 9 ? '9+' : item.badge}
              </span>
            )}
            
            {/* Tooltip Hover Tag */}
            <span className="absolute left-16 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap shadow-xl border border-white/10 z-50">
              {item.name}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Action Icon */}
      <div className="mt-auto pt-4 border-t border-white/10 w-full flex justify-center px-3">
        <button
          onClick={handleLogout}
          title="Logout"
          className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 transition-all duration-200 group relative"
        >
          <LogOut size={22} />
          <span className="absolute left-16 bg-slate-900 text-pink-400 text-xs font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap shadow-xl border border-pink-500/20 z-50">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
