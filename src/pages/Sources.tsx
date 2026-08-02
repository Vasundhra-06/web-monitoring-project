import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Globe, Plus, Play, Pause, Trash2, Search as SearchIcon, Filter, ChevronDown } from 'lucide-react';

const Sources: React.FC = () => {
  const { sources, toggleSourceStatus, addSource, deleteSource } = useAppStore();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newSourceType, setNewSourceType] = useState('Website');

  const tabs = ['All', 'Websites', 'Telegram', 'RSS', 'News', 'GitHub', 'YouTube'];

  const filteredSources = sources.filter(s => {
    const matchesTab = activeTab === 'All' || activeTab === s.type + 's' || activeTab === s.type;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

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
    <div className="animate-fade-in space-y-6">
      {/* Header with Only the Add New Source Button */}
      <div className="flex justify-end">
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary whitespace-nowrap">
          <Plus size={18} />
          <span>Add New Source</span>
        </button>
      </div>

      <div className="glass-card">
        {/* Search Input and Type Dropdown Filter Side-by-Side */}
        <div className="flex items-center justify-between border-b border-slate-700/50 p-4 gap-4">
          <div className="flex items-center gap-3">
            {/* Search Box */}
            <div className="relative">
              <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search sources..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:border-blue-500 outline-none transition-colors w-full md:w-60"
              />
            </div>

            {/* Dropdown Filter */}
            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="btn btn-secondary flex items-center gap-2 py-2 px-4 text-sm font-medium border-slate-700 bg-slate-800/40 hover:bg-slate-800/80"
              >
                <Filter size={16} className="text-slate-400" />
                <span>Type: {activeTab}</span>
                <ChevronDown size={14} className="text-slate-500" />
              </button>
              
              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                  <div className="absolute left-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-20 animate-fade-in">
                    {tabs.map(tab => (
                      <button
                        key={tab}
                        onClick={() => {
                          setActiveTab(tab);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          activeTab === tab 
                            ? 'bg-blue-600/20 text-blue-400 font-bold' 
                            : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700/50 text-slate-400 text-sm">
                <th className="p-4 font-medium">Source Name</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Last Scan</th>
                <th className="p-4 font-medium">Updates Today</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSources.length > 0 ? (
                filteredSources.map(source => (
                  <tr key={source.id} className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                          <Globe size={16} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-200">{source.name}</div>
                          <div className="text-xs text-slate-500 truncate max-w-[150px] md:max-w-xs">{source.url}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`badge ${source.status === 'Active' ? 'badge-success' : source.status === 'Paused' ? 'badge-warning' : 'badge-danger'}`}>
                        {source.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-300">{source.type}</td>
                    <td className="p-4 text-sm text-slate-400">
                      {source.last_scan ? new Date(source.last_scan).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Never'}
                    </td>
                    <td className="p-4 text-sm text-slate-300 font-medium">
                      {source.updates_today}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => toggleSourceStatus(source.id)}
                          className="btn-icon" 
                          title={source.status === 'Active' ? "Pause Source" : "Resume Source"}
                        >
                          {source.status === 'Active' ? <Pause size={18} /> : <Play size={18} />}
                        </button>
                        <button onClick={() => deleteSource(source.id)} className="btn-icon text-slate-400 hover:text-red-400" title="Delete Source">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No sources found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(2, 6, 23, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="glass-card" style={{
            maxWidth: '450px',
            width: '100%',
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <h2 className="text-xl font-bold text-white">Add New Monitoring Source</h2>
            
            <form onSubmit={handleSubmitSource} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Source Name</label>
                <input 
                  type="text" 
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                  className="input-field" 
                  placeholder="e.g. GeeksforGeeks Jobs" 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Source URL</label>
                <input 
                  type="url" 
                  value={newSourceUrl}
                  onChange={(e) => setNewSourceUrl(e.target.value)}
                  className="input-field" 
                  placeholder="https://example.com" 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Platform Type</label>
                <select 
                  value={newSourceType}
                  onChange={(e) => setNewSourceType(e.target.value)}
                  className="input-field"
                  style={{
                    backgroundColor: 'var(--color-bg)',
                    color: 'var(--color-text-main)',
                    border: '1px solid var(--color-border)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    width: '100%',
                    outline: 'none'
                  }}
                >
                  <option value="Website">Website</option>
                  <option value="Telegram">Telegram</option>
                  <option value="RSS">RSS</option>
                  <option value="News">News</option>
                  <option value="GitHub">GitHub</option>
                  <option value="YouTube">YouTube</option>
                </select>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--color-border)'
              }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  Add Source
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
