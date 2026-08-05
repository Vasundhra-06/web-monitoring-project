import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, User, LogOut } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const Header: React.FC = () => {
  const { notifications, currentUser, logout } = useAppStore();
  const [globalQuery, setGlobalQuery] = useState('');
  const navigate = useNavigate();
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(globalQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="glass-dock sticky top-0 z-40 flex items-center justify-between px-4 py-3 md:px-6 md:py-3.5 border-b border-white/10">
      {/* Brand & Mobile Title */}
      <div className="flex items-center gap-3">
        <div className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-pink-500 flex items-center justify-center font-extrabold text-white text-xs shadow-md">
            AI
          </div>
          <h1 className="text-base font-extrabold text-white tracking-wide">Watcher</h1>
        </div>

        {/* Global Search Bar (Desktop & Tablet) */}
        <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-950/60 border border-white/10 rounded-full text-slate-400 w-56 md:w-72 focus-within:w-80 focus-within:border-teal-500/50 transition-all">
          <Search size={16} className="text-teal-400" />
          <input 
            type="text" 
            placeholder="Search opportunities..." 
            value={globalQuery}
            onChange={(e) => setGlobalQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-white w-full placeholder-slate-500"
          />
        </form>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {/* Notification Bell with Badge Icon */}
        <button 
          onClick={() => navigate('/notifications')}
          className="relative text-slate-300 hover:text-teal-400 transition-colors p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5"
          title="Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[9px] font-extrabold text-white shadow-lg shadow-pink-500/50 animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
        
        {/* User Profile Card */}
        <div className="flex items-center gap-2 pl-3 border-l border-white/10">
          <div 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
              <User size={16} />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-white leading-none">{currentUser?.full_name || 'Vasundhra'}</p>
              <p className="text-[10px] text-teal-400 font-medium leading-tight mt-0.5">{currentUser?.email || 'User Portal'}</p>
            </div>
          </div>

          {/* Quick Logout Icon */}
          <button 
            onClick={handleLogout}
            title="Logout"
            className="hidden sm:flex text-slate-400 hover:text-pink-400 p-1.5 rounded-lg hover:bg-pink-500/10 transition-colors ml-1"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
