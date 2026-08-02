import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, Search, User } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const Header: React.FC = () => {
  const { notifications, currentUser } = useAppStore();
  const navigate = useNavigate();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="glass sticky top-0 z-10 flex items-center justify-between px-4 py-3 md:px-6 md:py-4" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
      <div className="flex items-center gap-4">
        <button className="md:hidden text-slate-400 hover:text-white transition-colors">
          <Menu size={24} />
        </button>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-full text-slate-400 w-64 focus-within:w-80 focus-within:text-white focus-within:border-blue-500/50 transition-all">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search everywhere..." 
            className="bg-transparent border-none outline-none text-sm w-full"
          />
        </div>
        <h1 className="md:hidden text-lg font-bold text-white">AI Watcher</h1>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/notifications')}
          className="relative text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800/50 cursor-pointer"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-slate-900"></span>
          )}
        </button>
        
        <div 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 pl-4 border-l border-slate-700 cursor-pointer hover:opacity-85 transition-opacity"
        >
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-white leading-none">{currentUser?.full_name || 'Vasundhra'}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white font-bold shadow-lg">
            <User size={18} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
