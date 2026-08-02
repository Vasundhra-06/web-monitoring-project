import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Activity, Database, Zap, AlertTriangle, RefreshCw } from 'lucide-react';

const Admin: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [message, setMessage] = useState('');

  const fetchStats = async () => {
    try {
      const res = await apiClient.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch admin stats", err);
      setMessage("Error: Unauthorized or backend offline");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleTriggerScrapers = async () => {
    setTriggering(true);
    setMessage('');
    try {
      const res = await apiClient.post('/admin/scrapers/trigger');
      setMessage(`Success: ${res.data.message} (Task ID: ${res.data.task_id})`);
    } catch (err) {
      setMessage("Failed to trigger scrapers.");
    } finally {
      setTriggering(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading admin dashboard...</div>;
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-h1 font-bold mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">System health and background task management</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${message.startsWith('Error') || message.startsWith('Failed') ? 'bg-red-500/10 text-red-400 border border-red-500/50' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/50'}`}>
          {message}
        </div>
      )}

      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 border-t-4 border-t-blue-500">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Opportunities</p>
                <h3 className="text-3xl font-bold text-white mt-1">{stats.total_opportunities}</h3>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
                <Database size={24} />
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6 border-t-4 border-t-emerald-500">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-slate-400 text-sm font-medium">Scraped Today</p>
                <h3 className="text-3xl font-bold text-white mt-1">{stats.opportunities_today}</h3>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500">
                <Activity size={24} />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 border-t-4 border-t-purple-500">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-slate-400 text-sm font-medium">Active Sources</p>
                <h3 className="text-3xl font-bold text-white mt-1">{stats.active_sources} <span className="text-sm text-slate-500 font-normal">/ {stats.total_sources}</span></h3>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
                <Zap size={24} />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 border-t-4 border-t-slate-500">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-slate-400 text-sm font-medium">System Status</p>
                <h3 className="text-xl font-bold text-emerald-400 mt-2">{stats.system_status}</h3>
              </div>
              <div className="p-3 bg-slate-800 rounded-lg text-slate-400">
                <AlertTriangle size={24} />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-8 glass-card p-6">
        <h2 className="text-xl font-bold text-white mb-4">Manual Operations</h2>
        <p className="text-slate-400 mb-6">Use these tools to manually intervene in the automated background processing engine.</p>
        
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={handleTriggerScrapers}
            disabled={triggering}
            className="btn btn-primary flex items-center gap-2"
          >
            <RefreshCw size={18} className={triggering ? 'animate-spin' : ''} />
            {triggering ? 'Triggering...' : 'Force Run All Scrapers'}
          </button>
          
          <button onClick={fetchStats} className="btn bg-slate-800 hover:bg-slate-700 text-white border border-slate-700">
            Refresh Stats
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
