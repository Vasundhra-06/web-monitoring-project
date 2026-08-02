import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Bell, Check, Info, AlertTriangle, ShieldAlert } from 'lucide-react';

const Notifications: React.FC = () => {
  const { notifications, markNotificationRead } = useAppStore();

  const getIcon = (priority: string) => {
    switch (priority) {
      case 'High': return <ShieldAlert size={20} className="text-red-500" />;
      case 'Warning': return <AlertTriangle size={20} className="text-amber-500" />;
      default: return <Info size={20} className="text-blue-500" />;
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500">
          <Bell size={24} />
        </div>
        <div>
          <h1 className="text-h2 font-bold mb-1">Notifications</h1>
          <p className="text-muted">Stay updated with new alerts and system statuses.</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {notifications.length > 0 ? (
          <div className="divide-y divide-slate-700/50">
            {notifications.map(notif => (
              <div 
                key={notif.id} 
                className={`p-4 md:p-6 flex gap-4 transition-colors ${notif.read ? 'bg-transparent opacity-75' : 'bg-slate-800/30'}`}
              >
                <div className="flex-shrink-0 mt-1">
                  {getIcon(notif.priority)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1 md:gap-4 mb-2">
                    <h3 className={`font-bold text-lg ${notif.read ? 'text-slate-300' : 'text-slate-100'}`}>
                      {notif.title}
                    </h3>
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      {new Date(notif.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-400 mb-4">{notif.message}</p>
                  
                  {!notif.read && (
                    <button 
                      onClick={() => markNotificationRead(notif.id)}
                      className="btn btn-secondary text-sm py-1.5 px-3"
                    >
                      <Check size={14} />
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500">
            <Bell size={48} className="mx-auto text-slate-600 mb-4 opacity-50" />
            <p>You have no notifications at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
