import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { User, LogOut, Cpu } from 'lucide-react';

const Profile: React.FC = () => {
  const { sources, savedCount, notifications, currentUser } = useAppStore();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  };

  const stats = [
    { label: 'Watched Sources', value: sources.length },
    { label: 'Saved Opportunities', value: savedCount },
    { label: 'Total Notifications', value: notifications.length },
  ];

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6 flex flex-col min-h-[calc(100vh-10rem)]">
      {/* Top Profile Header Card */}
      <div className="glass-card p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2" />
        
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shrink-0">
          <User size={48} />
        </div>
        
        <div className="text-center md:text-left flex-1">
          <h1 className="text-h2 font-bold mb-4">{currentUser?.full_name || 'Vasundhra'}</h1>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center md:text-left">
                <p className="text-xl font-bold text-slate-100">{stat.value}</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About AI Watcher - Descriptive lines */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2 border-b border-slate-700/50 pb-3">
          <Cpu className="text-emerald-400" size={20} />
          <h3 className="text-lg font-bold text-slate-200">About AI Watcher</h3>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          <strong>Universal AI Watcher</strong> is an intelligent monitoring portal designed to keep track of job boards, opportunities, and custom web sources in real-time. By utilizing background Celery worker tasks and scraping triggers, it identifies, indexes, and prioritizes newly listed opportunities.
        </p>
        <p className="text-slate-300 text-sm leading-relaxed">
          Through advanced AI synthesis, matches are automatically evaluated and sent directly as notifications, ensuring you never miss a high-priority update. Configure your custom sources, RSS feeds, and monitoring targets in the Settings panel to adapt the scanner to your needs.
        </p>
      </div>

      {/* Log Out button pushed to the bottom of the page */}
      <div className="mt-auto pt-6 flex justify-center">
        <button 
          onClick={handleLogout}
          className="btn btn-secondary text-red-400 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40 py-3 px-8 flex items-center gap-2 w-full max-w-sm justify-center"
        >
          <LogOut size={18} />
          <span className="font-bold">Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
