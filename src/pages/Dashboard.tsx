import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Globe, Activity, Bell, Plus, ExternalLink, ArrowRight, Zap } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { opportunities, sources, notifications, currentUser } = useAppStore();
  const navigate = useNavigate();

  const activeSourcesCount = sources.filter(s => s.status === 'Active').length;
  const highPriorityCount = opportunities.filter(o => o.priority === 'High').length;
  const unreadAlertsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="animate-fade-in space-y-6 max-w-6xl mx-auto pb-10">
      {/* Top Welcome Card */}
      <div className="glass-card p-6 border border-white/15 rounded-3xl relative overflow-hidden bg-gradient-to-r from-[#0B0F19] via-slate-900 to-slate-900">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-teal-500/15 to-pink-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-teal-400 bg-teal-500/15 px-3 py-1 rounded-full border border-teal-500/30">
                Web Watcher Active
              </span>
              <span className="text-xs text-slate-400">Real-Time Sync</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Good Day, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-pink-400">{currentUser?.full_name || 'Vasundhra'}</span> 👋
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">Here is your live web monitoring breakdown across your targets and feeds.</p>
          </div>

          <button onClick={() => navigate('/sources')} className="btn btn-primary text-xs shadow-lg shadow-teal-500/25 whitespace-nowrap">
            <Plus size={16} />
            <span>Add New Target</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid (Teal & Pink Aesthetics) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Sources */}
        <div className="glass-panel p-4 border border-teal-500/30 hover:border-teal-400 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Sources</span>
            <div className="p-2 rounded-xl bg-teal-500/15 text-teal-400 border border-teal-500/30">
              <Globe size={18} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-white">{activeSourcesCount}</h3>
            <p className="text-[11px] text-teal-400 mt-0.5">Monitored Sites & Channels</p>
          </div>
        </div>

        {/* Card 2: Total Opportunities */}
        <div className="glass-panel p-4 border border-white/10 hover:border-pink-500/30 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Indexed Targets</span>
            <div className="p-2 rounded-xl bg-pink-500/15 text-pink-400 border border-pink-500/30">
              <Activity size={18} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-white">{opportunities.length}</h3>
            <p className="text-[11px] text-pink-400 mt-0.5">Matched Opportunities</p>
          </div>
        </div>

        {/* Card 3: High Priority */}
        <div className="glass-panel p-4 border border-white/10 hover:border-rose-500/30 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">High Priority</span>
            <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <Zap size={18} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-white">{highPriorityCount}</h3>
            <p className="text-[11px] text-rose-400 mt-0.5">Urgent Notifications</p>
          </div>
        </div>

        {/* Card 4: Unread Alerts */}
        <div className="glass-panel p-4 border border-white/10 hover:border-amber-500/30 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Unread Alerts</span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Bell size={18} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-white">{unreadAlertsCount}</h3>
            <p className="text-[11px] text-amber-400 mt-0.5">Pending Inbox Items</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Recent Feed & Sources Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Detected Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="text-teal-400" size={18} />
              <span>Recent Detected Opportunities</span>
            </h2>
            <button onClick={() => navigate('/search')} className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1">
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {opportunities.length > 0 ? (
              opportunities.slice(0, 4).map(opp => (
                <div key={opp.id} className="glass-panel p-4 border border-white/10 hover:border-teal-500/30 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`badge ${opp.priority === 'High' ? 'badge-danger' : 'badge-success'}`}>
                        {opp.priority}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate font-medium">{opp.source_name}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white hover:text-teal-300 transition-colors truncate">{opp.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-1">{opp.summary}</p>
                  </div>

                  <a 
                    href={opp.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-secondary text-xs py-1.5 px-3 shrink-0 flex items-center gap-1.5"
                  >
                    <span>View</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              ))
            ) : (
              <div className="glass-panel p-8 text-center text-slate-400 text-xs">
                No opportunities indexed yet. Add a web source or Telegram channel to begin.
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Active Sources List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="text-pink-400" size={18} />
              <span>Monitored Sources</span>
            </h2>
            <button onClick={() => navigate('/sources')} className="text-xs text-pink-400 hover:text-pink-300 font-semibold">
              Manage
            </button>
          </div>

          <div className="space-y-3">
            {sources.length > 0 ? (
              sources.slice(0, 4).map(src => (
                <div key={src.id} className="glass-panel p-3.5 border border-white/10 flex items-center justify-between">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{src.name}</h4>
                    <p className="text-[10px] text-slate-400 truncate">{src.url}</p>
                  </div>
                  <span className={`badge shrink-0 text-[10px] ${src.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                    {src.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="glass-panel p-6 text-center text-slate-400 text-xs space-y-2">
                <p>No active monitoring targets.</p>
                <button onClick={() => navigate('/sources')} className="btn btn-primary text-xs w-full py-2">
                  + Add Source
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
