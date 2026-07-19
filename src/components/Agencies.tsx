import React, { useState, useEffect } from 'react';
import { Search, Building2, MapPin, Mail, Phone, Loader2, ShieldCheck } from 'lucide-react';

interface Agency {
  _id: string;
  name: string;
  location: string;
  description?: string;
  email?: string;
  phone?: string;
  verified?: boolean;
}

interface AgenciesProps {
}

export const Agencies: React.FC<AgenciesProps> = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const res = await fetch('/api/agencies');
        if (res.ok) {
          const data = await res.json();
          setAgencies(data.agencies || []);
        }
      } catch (err) {
        console.error('Failed to fetch agencies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAgencies();
  }, []);

  const filteredAgencies = agencies.filter((agency) => {
    const searchLower = searchQuery.toLowerCase();
    return agency.name.toLowerCase().includes(searchLower) ||
      agency.location.toLowerCase().includes(searchLower);
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white font-display">
            Recommended Clearing Agencies
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl">
            Work with a trusted customs clearing agency (agence en douane) at the Goma-Gisenyi corridor to handle your import and export declarations.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Search by agency name or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-brand-500 transition-colors text-zinc-900 dark:text-zinc-100"
        />
      </div>

      {/* Agencies List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
          <Loader2 className="h-8 w-8 animate-spin mb-4 text-brand-500" />
          <p>Loading recommended agencies...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgencies.length > 0 ? (
            filteredAgencies.map((agency) => (
              <div key={agency._id} className="glass-panel p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow bg-white/50 dark:bg-zinc-900/50 flex flex-col justify-between">
                <div>
                  <div className="flex gap-3 items-start mb-3">
                    <div className="h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 bg-brand-500/10 text-brand-600 dark:text-brand-400">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-zinc-900 dark:text-white leading-tight flex items-center gap-1.5">
                        {agency.name}
                        {agency.verified && (
                          <ShieldCheck className="h-4 w-4 text-brand-500" />
                        )}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-zinc-400 mt-0.5 shrink-0" />
                      <span className="text-sm text-zinc-600 dark:text-zinc-300">{agency.location}</span>
                    </div>
                    {agency.description && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {agency.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-850 flex gap-2">
                  <a
                    href={agency.email ? `mailto:${agency.email}` : undefined}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                      agency.email
                        ? 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                        : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-300 dark:text-zinc-700 cursor-not-allowed pointer-events-none'
                    }`}
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </a>
                  <a
                    href={agency.phone ? `tel:${agency.phone}` : undefined}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                      agency.phone
                        ? 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                        : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-300 dark:text-zinc-700 cursor-not-allowed pointer-events-none'
                    }`}
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
              <Search className="h-8 w-8 mx-auto mb-3 text-zinc-300 dark:text-zinc-600" />
              <p>No agencies found matching your search criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
