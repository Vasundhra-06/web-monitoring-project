import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Globe, Search, Bell, User, Settings, LogOut } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const BottomNav: React.FC = () => {
  const { notifications, logout } = useAppStore();
  const navigate = useNavigate();
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { name: 'Home', path: '/', icon: LayoutDashboard },
    { name: 'Sources', path: '/sources', icon: Globe },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'Alerts', path: '/notifications', icon: Bell, badge: unreadCount },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-dock md:hidden fixed bottom-3 left-3 right-3 z-50 rounded-2xl flex justify-around items-center px-2 py-2 border border-white/15 shadow-2xl">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) => 
            `flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ${
              isActive 
                ? 'text-teal-400 bg-teal-500/15 border border-teal-500/30' 
                : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <div className="relative">
            <item.icon size={20} />
            {item.badge !== undefined && item.badge > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-pink-500 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border border-slate-900 animate-pulse">
                {item.badge > 9 ? '9+' : item.badge}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold mt-0.5">{item.name}</span>
        </NavLink>
      ))}

      <button
        onClick={handleLogout}
        className="flex flex-col items-center justify-center p-2 rounded-xl text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 transition-all"
        title="Logout"
      >
        <LogOut size={20} />
        <span className="text-[10px] font-semibold mt-0.5">Exit</span>
      </button>
    </nav>
  );
};

export default BottomNav;
