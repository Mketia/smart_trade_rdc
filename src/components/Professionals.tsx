import React, { useState, useEffect } from 'react';
import { Search, Briefcase, Truck, Star, MapPin, Mail, Phone, ChevronRight, Loader2 } from 'lucide-react';

interface ProfessionalsProps {
}

export const Professionals: React.FC<ProfessionalsProps> = () => {
    const [filterType, setFilterType] = useState<'all' | 'customs_agent' | 'logistics'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const res = await fetch('/api/professionals');
        if (res.ok) {
          const data = await res.json();
          setProfessionals(data);
        }
      } catch (err) {
        console.error('Failed to fetch professionals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfessionals();
  }, []);

  const filteredProfessionals = professionals.filter((prof) => {
    const matchesType = filterType === 'all' || prof.type === filterType;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = prof.name.toLowerCase().includes(searchLower) ||
                          prof.company.toLowerCase().includes(searchLower) ||
                          (prof.specialties && prof.specialties.some((s: string) => s.toLowerCase().includes(searchLower)));
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white font-display">
            Professional Network
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl">
            Connect directly with verified customs agents, clearing clerks, and logistics companies across the DRC to streamline your investment and trade operations.
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name, company, or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-brand-500 transition-colors text-zinc-900 dark:text-zinc-100"
          />
        </div>
        <div className="flex gap-2 bg-zinc-100 dark:bg-zinc-900/50 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 shrink-0 overflow-x-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              filterType === 'all' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('customs_agent')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              filterType === 'customs_agent' ? 'bg-white dark:bg-zinc-800 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            Customs Agents
          </button>
          <button
            onClick={() => setFilterType('logistics')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              filterType === 'logistics' ? 'bg-white dark:bg-zinc-800 text-accent-600 dark:text-accent-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <Truck className="h-3.5 w-3.5" />
            Logistics & Transit
          </button>
        </div>
      </div>

      {/* Professionals List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
          <Loader2 className="h-8 w-8 animate-spin mb-4 text-brand-500" />
          <p>Loading directory...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredProfessionals.length > 0 ? (
            filteredProfessionals.map((prof) => (
              <div key={prof._id} className="glass-panel p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow bg-white/50 dark:bg-zinc-900/50 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4 items-center">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        prof.type === 'customs_agent' 
                          ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400' 
                          : 'bg-accent-500/10 text-accent-600 dark:text-accent-400'
                      }`}>
                        {prof.type === 'customs_agent' ? <Briefcase className="h-6 w-6" /> : <Truck className="h-6 w-6" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-zinc-900 dark:text-white leading-tight flex items-center gap-2">
                          {prof.name}
                          {prof.verified && (
                            <span className="bg-brand-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                              Verified
                            </span>
                          )}
                        </h3>
                        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">{prof.company}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1 text-amber-500 mb-0.5">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{prof.rating}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400">({prof.reviews} reviews)</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-zinc-400 mt-0.5 shrink-0" />
                      <span className="text-sm text-zinc-600 dark:text-zinc-300">{prof.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {prof.specialties.map((spec: string) => (
                        <span key={spec} className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[10px] rounded-md font-medium border border-zinc-200 dark:border-zinc-700">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-850 flex gap-2">
                  <a href={`mailto:${prof.email}`} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-bold transition-colors">
                    <Mail className="h-4 w-4" />
                    Email
                  </a>
                  <a href={`tel:${prof.phone}`} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-bold transition-colors">
                    <Phone className="h-4 w-4" />
                    Call
                  </a>
                  <button className="flex-none w-10 flex items-center justify-center rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-colors shadow-sm cursor-pointer">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
              <Search className="h-8 w-8 mx-auto mb-3 text-zinc-300 dark:text-zinc-600" />
              <p>No professionals found matching your search criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
