import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Bell, Check, Trash2, Zap, CheckCircle2 } from 'lucide-react';

const Notifications: React.FC = () => {
  const { notifications, markNotificationRead, clearNotifications } = useAppStore();

  // Filter out administrative notifications so only real target alerts show
  const filteredNotifications = notifications.filter(n => n.title !== 'New Source Added' && n.title !== 'Source Removed');
  const unreadCount = filteredNotifications.filter(n => !n.read).length;

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High': return <span className="badge badge-danger">High Priority Alert</span>;
      case 'Medium': return <span className="badge badge-warning">Medium Alert</span>;
      default: return <span className="badge badge-success">Info</span>;
    }
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h2 font-extrabold text-white flex items-center gap-2">
            <Bell className="text-pink-400" size={26} />
            <span>Opportunity Notifications</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">Real-time alerts and scraper matches from your monitored sites</p>
        </div>

        {filteredNotifications.length > 0 && (
          <button 
            onClick={clearNotifications}
            className="btn btn-secondary text-xs text-rose-400 hover:bg-rose-500/10 border-rose-500/30 whitespace-nowrap"
          >
            <Trash2 size={16} />
            <span>Clear All Notifications</span>
          </button>
        )}
      </div>

      {/* Unread Alert Indicator */}
      {unreadCount > 0 && (
        <div className="glass-panel p-3 bg-pink-500/10 border-pink-500/30 text-pink-400 text-xs flex items-center justify-between font-semibold">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-pink-400 animate-bounce" />
            <span>You have {unreadCount} unread opportunity alert{unreadCount > 1 ? 's' : ''}.</span>
          </div>
        </div>
      )}

      {/* Notifications List (Sleek Glass Panels) */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notif => (
            <div 
              key={notif.id} 
              className={`glass-panel p-5 border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                !notif.read ? 'border-teal-500/40 bg-slate-900/90 shadow-lg shadow-teal-500/5' : 'border-white/10 opacity-75'
              }`}
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {getPriorityBadge(notif.priority)}
                  <span className="text-[11px] text-slate-400">
                    {new Date(notif.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                  )}
                </div>

                <h3 className="text-sm font-bold text-white">{notif.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{notif.message}</p>
              </div>

              {!notif.read && (
                <button 
                  onClick={() => markNotificationRead(notif.id)}
                  className="btn btn-secondary text-xs py-1.5 px-3 hover:border-teal-400 hover:text-teal-400 shrink-0 self-end sm:self-center"
                >
                  <Check size={14} />
                  <span>Mark as Read</span>
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="glass-card p-12 text-center space-y-3">
            <CheckCircle2 size={44} className="mx-auto text-teal-400" />
            <h3 className="text-base font-bold text-white">All Caught Up!</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">No pending opportunity alerts in your notification feed.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
