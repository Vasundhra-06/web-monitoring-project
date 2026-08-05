import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Search as SearchIcon, Bookmark, ExternalLink, SlidersHorizontal, Sparkles } from 'lucide-react';

const Search: React.FC = () => {
  const { opportunities, toggleSaveOpportunity, sources } = useAppStore();
  const [query, setQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qParam = params.get('q');
    if (qParam) {
      setQuery(qParam);
    }
  }, [location]);

  const filteredResults = opportunities.filter(opp => {
    const q = query.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      opp.title.toLowerCase().includes(q) ||
      opp.organization.toLowerCase().includes(q) ||
      opp.summary.toLowerCase().includes(q) ||
      opp.source_name.toLowerCase().includes(q);
      
    const matchesPriority = selectedPriority === 'All' || opp.priority === selectedPriority;
    const matchesType = selectedType === 'All' || opp.type === selectedType;

    return matchesSearch && matchesPriority && matchesType;
  });

  return (
    <div className="animate-fade-in space-y-6 max-w-5xl mx-auto pb-10">
      {/* Search Header */}
      <div className="text-center mb-8 mt-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 flex items-center justify-center gap-2">
          <Sparkles className="text-pink-400" size={28} />
          <span>Discover Monitored Opportunities</span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
          Search real-time matches indexed from your added web sources, Telegram channels, and scrapers.
        </p>

        {/* Search Input Bar */}
        <div className="relative max-w-2xl mx-auto mt-6">
          <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400" />
          <input 
            type="text" 
            placeholder="Search by company, source (e.g. Tm / Telegram), role, or keyword..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-teal-500/30 text-white rounded-full py-3.5 pl-12 pr-12 text-sm focus:outline-none focus:border-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.15)] transition-all"
          />
          <button 
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full transition-all ${
              isFilterPanelOpen ? 'bg-pink-500 text-white' : 'bg-teal-500 hover:bg-teal-600 text-white'
            }`}
            title="Toggle Filter Options"
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>

        {/* Filter Dropdown Bar */}
        {isFilterPanelOpen && (
          <div className="glass-panel max-w-2xl mx-auto mt-3 p-4 border border-teal-500/30 flex flex-wrap gap-4 items-center justify-between text-xs animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold">Priority:</span>
              {['All', 'High', 'Medium', 'Low'].map(p => (
                <button
                  key={p}
                  onClick={() => setSelectedPriority(p)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    selectedPriority === p ? 'bg-teal-500 text-white' : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold">Source Filter:</span>
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-slate-900 border border-white/10 text-white rounded-lg px-2.5 py-1 text-xs"
              >
                <option value="All">All Types</option>
                <option value="Job / Grant">Job / Grant</option>
                <option value="Telegram">Telegram Feed</option>
                <option value="Website">Website Update</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Quick Source Filter Badges */}
      {sources.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs text-slate-500 font-medium shrink-0">Quick Sources:</span>
          {sources.map(src => (
            <button
              key={src.id}
              onClick={() => setQuery(src.name)}
              className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all ${
                query.toLowerCase() === src.name.toLowerCase()
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-teal-400 border border-white/5'
              }`}
            >
              {src.name}
            </button>
          ))}
          {query && (
            <button onClick={() => setQuery('')} className="text-xs text-pink-400 underline font-medium shrink-0 ml-2">
              Clear filter
            </button>
          )}
        </div>
      )}

      {/* Results Header */}
      <div className="flex justify-between items-center text-slate-400 text-xs px-1">
        <span>Found <strong className="text-teal-400">{filteredResults.length}</strong> matching opportunity entries</span>
      </div>

      {/* Results List (Sleek Glass Panels) */}
      <div className="space-y-4">
        {filteredResults.length > 0 ? (
          filteredResults.map(opp => (
            <div key={opp.id} className="glass-panel p-5 border border-white/10 hover:border-teal-500/40 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group">
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`badge ${opp.priority === 'High' ? 'badge-danger' : opp.priority === 'Medium' ? 'badge-warning' : 'badge-success'}`}>
                    {opp.priority} Priority
                  </span>
                  <span className="badge bg-white/5 text-slate-300 border border-white/10">{opp.type}</span>
                  <span className="text-[11px] text-teal-400 font-medium bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">
                    Source: {opp.source_name}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-teal-400 transition-colors">{opp.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{opp.summary}</p>
                
                <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                  <span>Deadline: <strong className="text-slate-200">{opp.deadline}</strong></span>
                  <span>Added: {new Date(opp.date_added).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button 
                  onClick={() => toggleSaveOpportunity(opp.id)}
                  className={`p-2.5 rounded-xl border transition-all ${
                    opp.saved ? 'bg-pink-500/20 text-pink-400 border-pink-500/40' : 'bg-white/5 text-slate-400 hover:text-white border-white/10'
                  }`}
                  title={opp.saved ? "Unsave Opportunity" : "Save Opportunity"}
                >
                  <Bookmark size={18} fill={opp.saved ? "currentColor" : "none"} />
                </button>
                <a 
                  href={opp.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary text-xs flex items-center gap-1.5 py-2 px-3"
                >
                  <span>Open Target</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card p-12 text-center space-y-3">
            <SearchIcon size={44} className="mx-auto text-slate-600" />
            <h3 className="text-base font-bold text-white">No Matching Opportunities Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {query ? `No results found for "${query}". Try adjusting your keywords or adding more sources.` : 'No opportunity entries indexed yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
