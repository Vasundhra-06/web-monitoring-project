import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Activity, Bell, Briefcase, Globe, Star, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { opportunities, sources, notifications, currentUser, clearNotifications } = useAppStore();
  const navigate = useNavigate();
  
  const highPriority = opportunities.filter(o => o.priority === 'High');
  const activeSources = sources.filter(s => s.status === 'Active');
  const unreadNotifications = notifications.filter(n => !n.read);
  
  const stats = [
    { 
      label: 'Total Updates', 
      value: opportunities.length, 
      icon: Activity, 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10',
      path: '/search',
      tooltip: 'Total extracted items from all monitored feeds'
    },
    { 
      label: 'Active Sources', 
      value: activeSources.length, 
      icon: Globe, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500/10',
      path: '/sources',
      tooltip: 'Number of active website and feed scrapers'
    },
    { 
      label: 'High Priority', 
      value: highPriority.length, 
      icon: Star, 
      color: 'text-amber-500', 
      bg: 'bg-amber-500/10',
      path: '/search',
      tooltip: 'High priority opportunities extracted by AI'
    },
    { 
      label: 'Unread Alerts', 
      value: unreadNotifications.length, 
      icon: Bell, 
      color: 'text-red-500', 
      bg: 'bg-red-500/10',
      path: '/notifications',
      tooltip: 'New unread notifications (Click to view and mark as read)'
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 22) return 'Good Evening';
    return 'Good Night';
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-h2 font-bold mb-1">{getGreeting()}, {currentUser?.full_name || 'Vasundhra'} 👋</h1>
          <p className="text-muted">Here is what's happening today.</p>
        </div>
      </div>

      {/* Interactive Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            onClick={() => navigate(stat.path)}
            title={stat.tooltip}
            className="glass-card p-4 flex flex-col gap-3 cursor-pointer hover:scale-[1.02] hover:border-blue-500/40 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all duration-200"
          >
            <div className="flex justify-between items-start">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className="text-[10px] text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded-full">Navigate ➔</span>
            </div>
            <div>
              <p className="text-h2 leading-none font-bold mb-1 text-slate-100">{stat.value}</p>
              <p className="text-small font-medium text-slate-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: High Priority Alerts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-h3">High Priority Alerts</h3>
              <button onClick={() => navigate('/search')} className="text-small text-blue-400 hover:text-blue-300">View All</button>
            </div>
            <div className="space-y-4">
              {highPriority.slice(0, 3).map(opp => (
                <div key={opp.id} className="flex gap-4 p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-300">
                    <Briefcase size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge badge-danger">High Priority</span>
                      <span className="text-xs text-slate-400">{opp.type}</span>
                    </div>
                    <h4 className="font-bold truncate text-slate-100">{opp.title}</h4>
                    <p className="text-sm text-slate-400 truncate">{opp.organization}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <span className="text-xs text-slate-500">Deadline: {opp.deadline}</span>
                    <button onClick={() => navigate('/search')} className="text-sm text-blue-500 hover:text-blue-400 font-medium">Review</button>
                  </div>
                </div>
              ))}
              {highPriority.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  No high-priority alerts found yet. Active scrapers will display high-priority matches here.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Recent Notifications (Horizontal Layout) */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-h3 flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-500" />
                Recent Notifications
              </h3>
              <div className="flex items-center gap-3">
                <button 
                  onClick={clearNotifications}
                  className="text-small text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear
                </button>
                <span className="text-slate-600">|</span>
                <button onClick={() => navigate('/notifications')} className="text-small text-blue-400 hover:text-blue-300">View All</button>
              </div>
            </div>
            
            <div className="space-y-3">
              {notifications.slice(0, 4).map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-4 rounded-xl border transition-all duration-200 ${notification.read ? 'border-slate-800 bg-slate-900/10 opacity-70' : 'border-slate-700/60 bg-slate-800/30 hover:bg-slate-800/40'} flex gap-3 items-start`}
                >
                  <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${notification.read ? 'bg-slate-600' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-2 mb-1">
                      <h4 className="font-bold text-sm text-slate-200 truncate">{notification.title}</h4>
                      <time className="text-[10px] text-slate-500 shrink-0">
                        {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </time>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed break-words">{notification.message}</p>
                  </div>
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  No notifications yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
