import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Globe, Plus, Play, Pause, Trash2, Search as SearchIcon, ExternalLink, Send, Rss, Newspaper, Code, Video } from 'lucide-react';

const Sources: React.FC = () => {
  const { sources, toggleSourceStatus, addSource, deleteSource } = useAppStore();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newSourceType, setNewSourceType] = useState('Website');

  const tabs = ['All', 'Website', 'Telegram', 'RSS', 'News', 'GitHub', 'YouTube'];

  const filteredSources = sources.filter(s => {
    const matchesTab = activeTab === 'All' || activeTab === s.type;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.url.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Telegram': return <Send size={18} className="text-pink-400" />;
      case 'RSS': return <Rss size={18} className="text-amber-400" />;
      case 'News': return <Newspaper size={18} className="text-teal-400" />;
      case 'GitHub': return <Code size={18} className="text-purple-400" />;
      case 'YouTube': return <Video size={18} className="text-rose-500" />;
      default: return <Globe size={18} className="text-teal-400" />;
    }
  };

  const handleSubmitSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName || !newSourceUrl) return;
    await addSource({
      name: newSourceName,
      type: newSourceType,
      url: newSourceUrl
    });
    setNewSourceName('');
    setNewSourceUrl('');
    setNewSourceType('Website');
    setIsModalOpen(false);
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-6xl mx-auto pb-10">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h2 font-extrabold text-white flex items-center gap-2">
            <Globe className="text-teal-400" size={26} />
            <span>Monitored Web Sources</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">Manage active scrapers, Telegram feeds, and custom targets</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary shadow-lg shadow-teal-500/20 whitespace-nowrap w-full sm:w-auto">
          <Plus size={18} />
          <span>Add New Source</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <SearchIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-teal-400" />
          <input 
            type="text" 
            placeholder="Search sources by name or URL..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10 text-xs"
          />
        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-teal-500 to-pink-500 text-white shadow-md'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Sleek Panel Cards Grid (Replaces Formal Rows/Columns for Perfect Mobile Scaling) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSources.length > 0 ? (
          filteredSources.map(source => (
            <div key={source.id} className="glass-panel flex flex-col justify-between gap-4 border border-white/10 hover:border-teal-500/40 transition-all relative overflow-hidden group">
              {/* Top Row: Type Icon, Name, and Status */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 shrink-0">
                      {getTypeIcon(source.type)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white truncate group-hover:text-teal-400 transition-colors">{source.name}</h3>
                      <span className="text-[11px] text-slate-400 font-medium">{source.type}</span>
                    </div>
                  </div>
                  <span className={`badge shrink-0 ${source.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                    {source.status}
                  </span>
                </div>

                <a 
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs text-slate-400 hover:text-teal-300 truncate block mt-1 transition-colors flex items-center gap-1"
                >
                  <span className="truncate">{source.url}</span>
                  <ExternalLink size={12} className="shrink-0 text-slate-500" />
                </a>
              </div>

              {/* Bottom Row: Stats & Action Buttons */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4 text-[11px] text-slate-400">
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Updates</span>
                    <span className="font-bold text-white">{source.updates_today || 2} new</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Last Scan</span>
                    <span className="font-medium text-slate-300">
                      {source.last_scan ? new Date(source.last_scan).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Active'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => toggleSourceStatus(source.id)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-teal-500/20 text-slate-300 hover:text-teal-400 border border-white/5 transition-colors"
                    title={source.status === 'Active' ? "Pause Source" : "Resume Source"}
                  >
                    {source.status === 'Active' ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button 
                    onClick={() => deleteSource(source.id)} 
                    className="p-2 rounded-xl bg-white/5 hover:bg-pink-500/20 text-slate-300 hover:text-pink-400 border border-white/5 transition-colors"
                    title="Delete Source"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full glass-card p-10 text-center space-y-3">
            <Globe size={40} className="mx-auto text-slate-600" />
            <h3 className="text-base font-bold text-white">No Sources Added Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">Add target website URLs or Telegram channel links to begin real-time web monitoring.</p>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary text-xs mt-2">
              <Plus size={16} />
              <span>Add Your First Source</span>
            </button>
          </div>
        )}
      </div>

      {/* Add Source Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card w-full max-w-md p-6 sm:p-8 border border-white/15 rounded-3xl relative space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="text-teal-400" size={20} />
              <span>Add Monitoring Source</span>
            </h2>
            
            <form onSubmit={handleSubmitSource} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Source Name</label>
                <input 
                  type="text" 
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                  className="input-field" 
                  placeholder="e.g. Tm / Telegram Channel / GeeksforGeeks" 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Target URL or Telegram Link</label>
                <input 
                  type="url" 
                  value={newSourceUrl}
                  onChange={(e) => setNewSourceUrl(e.target.value)}
                  className="input-field" 
                  placeholder="https://example.com or https://t.me/channel" 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Platform Type</label>
                <select 
                  value={newSourceType}
                  onChange={(e) => setNewSourceType(e.target.value)}
                  className="input-field bg-slate-900"
                >
                  <option value="Website">Website</option>
                  <option value="Telegram">Telegram</option>
                  <option value="RSS">RSS</option>
                  <option value="News">News</option>
                  <option value="GitHub">GitHub</option>
                  <option value="YouTube">YouTube</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary text-xs"
                >
                  Add Source & Start Monitoring
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sources;
