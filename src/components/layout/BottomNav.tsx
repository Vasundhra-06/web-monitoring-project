import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Globe, Search, Bell, User } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const BottomNav: React.FC = () => {
  const notifications = useAppStore(state => state.notifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { name: 'Home', path: '/', icon: LayoutDashboard },
    { name: 'Sources', path: '/sources', icon: Globe },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'Alerts', path: '/notifications', icon: Bell, badge: unreadCount },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="glass md:hidden fixed bottom-0 left-0 right-0 z-20 flex justify-between items-center px-6 py-3" style={{ borderRadius: 0, borderBottom: 'none', borderLeft: 'none', borderRight: 'none', paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}>
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 ${isActive ? 'text-blue-500' : 'text-slate-400 hover:text-slate-200'}`
          }
        >
          <div className="relative">
            <item.icon size={22} />
            {item.badge !== undefined && item.badge > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                {item.badge > 9 ? '9+' : item.badge}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
