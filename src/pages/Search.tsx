import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Briefcase, Search as SearchIcon, Filter, Bookmark, ExternalLink } from 'lucide-react';

const Search: React.FC = () => {
  const { opportunities, toggleSaveOpportunity } = useAppStore();
  const [query, setQuery] = useState('');

  const filteredResults = opportunities.filter(opp => {
    const matchesSearch = 
      opp.title.toLowerCase().includes(query.toLowerCase()) ||
      opp.organization.toLowerCase().includes(query.toLowerCase()) ||
      opp.summary.toLowerCase().includes(query.toLowerCase()) ||
      opp.source_name.toLowerCase().includes(query.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="animate-fade-in space-y-6 max-w-5xl mx-auto">
      <div className="text-center mb-10 mt-6">
        <h1 className="text-h1 font-bold mb-4">Discover Opportunities</h1>
        <div className="relative max-w-2xl mx-auto">
          <SearchIcon size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />
          <input 
            type="text" 
            placeholder="Search by company, role, or keywords... (e.g. Flutter)" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-800/80 border border-blue-500/30 text-white rounded-full py-4 pl-12 pr-4 text-lg focus:outline-none focus:border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.15)] transition-all"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center text-slate-400 text-sm mb-4">
          <span>Found {filteredResults.length} matching results</span>
          <select className="bg-transparent border-none outline-none cursor-pointer">
            <option>Sort by: Newest</option>
            <option>Sort by: Priority</option>
            <option>Sort by: Deadline</option>
          </select>
        </div>

        {filteredResults.length > 0 ? (
          filteredResults.map(opp => (
            <div key={opp.id} className="glass-card p-5 group flex flex-col md:flex-row gap-5">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center flex-shrink-0 text-blue-400">
                <Briefcase size={28} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`badge ${opp.priority === 'High' ? 'badge-danger' : opp.priority === 'Medium' ? 'badge-warning' : 'badge-primary'}`}>
                    {opp.priority} Priority
                  </span>
                  <span className="badge bg-slate-800 text-slate-300 border border-slate-700">{opp.type}</span>
                  <span className="text-xs text-slate-500 ml-auto">Added {new Date(opp.date_added).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors">{opp.title}</h3>
                <p className="text-slate-400 font-medium mb-3">{opp.organization}</p>
                <p className="text-slate-300 text-sm line-clamp-2 leading-relaxed">{opp.summary}</p>
                
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">Deadline:</span>
                    <span className="font-medium text-slate-300">{opp.deadline}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">Source:</span>
                    <span className="font-medium text-slate-300 truncate max-w-[200px]">{opp.source_name}</span>
                  </div>
                </div>
              </div>
              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-3 md:pl-4 md:border-l border-slate-700/50">
                <button 
                  onClick={() => toggleSaveOpportunity(opp.id)}
                  className={`btn-icon w-10 h-10 ${opp.saved ? 'bg-blue-600/20 text-blue-500' : 'bg-slate-800 hover:bg-slate-700 text-slate-400'}`}
                  title={opp.saved ? "Unsave" : "Save"}
                >
                  <Bookmark size={20} fill={opp.saved ? "currentColor" : "none"} />
                </button>
                <a href={opp.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full md:w-auto">
                  <span>Apply</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card p-12 text-center">
            <SearchIcon size={48} className="mx-auto text-slate-600 mb-4" />
            <h3 className="text-h3 text-slate-300 mb-2">No results found</h3>
            <p className="text-slate-500">Try adjusting your search terms or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
