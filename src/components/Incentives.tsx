import React, { useState, useEffect } from 'react';
import { Shield, Search, Filter, CheckSquare, Square, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Incentive {
  _id: string;
  title: string;
  authority: string;
  description: string;
  benefits: string;
  requirements: string[];
}

interface IncentivesProps {
  }

export const Incentives: React.FC<IncentivesProps> = () => {

  const [incentives, setIncentives] = useState<Incentive[]>([]);
  const [loading, setLoading] = useState(true);

  // Catalog State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAuthority, setSelectedAuthority] = useState<string>('all');

  // Quiz State
  const [quizIncentiveId, setQuizIncentiveId] = useState<string>('');
  const [checkedRequirements, setCheckedRequirements] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchIncentives = async () => {
      try {
        const res = await fetch('/api/incentives');
        if (res.ok) {
          const data = await res.json();
          const list: Incentive[] = data.incentives || [];
          setIncentives(list);
          if (list.length > 0) {
            setQuizIncentiveId(list[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch incentives:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchIncentives();
  }, []);

  // Filter incentives
  const filteredIncentives = incentives.filter((inc) => {
    const matchesSearch =
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.authority.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAuthority =
      selectedAuthority === 'all' ||
      (selectedAuthority === 'drc' && inc.authority.includes('DRC')) ||
      (selectedAuthority === 'rwa' && inc.authority.includes('Rwanda')) ||
      (selectedAuthority === 'eac' && inc.authority.includes('EAC'));

    return matchesSearch && matchesAuthority;
  });

  const activeQuizIncentive = incentives.find(inc => inc._id === quizIncentiveId) || incentives[0];

  const handleToggleRequirement = (reqKey: string) => {
    const newChecked = {
      ...checkedRequirements,
      [reqKey]: !checkedRequirements[reqKey]
    };
    setCheckedRequirements(newChecked);

    // If checking the last missing box, trigger confetti!
    const allReqs = activeQuizIncentive?.requirements || [];
    const allTicked = allReqs.every((r: string) => newChecked[r] === true);
    // Only fire confetti if they actually checked the box that completes it
    if (allTicked && !checkedRequirements[reqKey]) {
      confetti({
        particleCount: 60,
        spread: 40,
        origin: { y: 0.8 },
        colors: ['#10b981', '#fbbf24', '#ffffff']
      });
    }
  };

  const handleIncentiveChangeForQuiz = (id: string) => {
    setQuizIncentiveId(id);
    setCheckedRequirements({}); // Reset checklist on switch
  };

  const currentQuizRequirements = activeQuizIncentive?.requirements || [];
  const tickedCount = currentQuizRequirements.filter((r: string) => checkedRequirements[r]).length;
  const isFullyQualified = currentQuizRequirements.length > 0 && tickedCount === currentQuizRequirements.length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-brand-500" />
        <p>Loading incentives directory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search & Incentives Catalog */}
      <div className="glass-panel rounded-3xl p-5 md:p-6 shadow-sm border border-zinc-100 dark:border-zinc-900">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-brand-500/10 text-brand-500">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white leading-tight">
              Tax Incentives & Exemptions Directory
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Understand and verify the legal exemptions and tax holidays available for cross-border trade and investments in the Great Lakes region.
            </p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search incentives by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-500 text-zinc-800 dark:text-zinc-200"
            />
          </div>

          <div className="relative flex-none sm:w-56">
            <Filter className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
            <select
              value={selectedAuthority}
              onChange={(e) => setSelectedAuthority(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none text-zinc-700 dark:text-zinc-350"
            >
              <option value="all">All Authorities</option>
              <option value="eac">EAC Regional Only</option>
              <option value="drc">DRC (DGDA) Only</option>
              <option value="rwa">Rwanda (RRA/RDB) Only</option>
            </select>
          </div>
        </div>

        {/* Incentives grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {filteredIncentives.length > 0 ? (
            filteredIncentives.map((inc) => (
              <div
                key={inc._id}
                className="p-5 rounded-2xl border border-zinc-100 dark:border-zinc-850 bg-zinc-50/20 dark:bg-zinc-900/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 tracking-wider">
                      {inc.authority}
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white mt-2">
                    {inc.title}
                  </h3>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                    {inc.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-dashed border-zinc-150 dark:border-zinc-800">
                  <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                    Benefit Rate:
                  </div>
                  <div className="text-xs font-bold text-brand-600 dark:text-brand-400 mt-0.5">
                    {inc.benefits}
                  </div>

                  <button
                    onClick={() => handleIncentiveChangeForQuiz(inc._id)}
                    className="w-full mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-brand-500 bg-white dark:bg-zinc-900 px-3 py-2 text-[10px] font-bold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                  >
                    Check Eligibility Checklist
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-zinc-400 text-xs font-medium border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
              No incentives found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* Interactive Eligibility Checker Quiz */}
      {activeQuizIncentive && (
        <div className="glass-panel rounded-3xl p-5 md:p-6 shadow-sm border border-zinc-100 dark:border-zinc-900">
          <h3 className="text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2 mb-2">
            <CheckSquare className="h-5 w-5 text-brand-500" />
            Incentive Eligibility Checker
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
            Answer a few questions to see if your trade consignment or business qualifies for major tax breaks.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Selector & Checklist */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Select Incentive to check:
                </label>
                <select
                  value={quizIncentiveId}
                  onChange={(e) => handleIncentiveChangeForQuiz(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-500 text-zinc-800 dark:text-zinc-200"
                >
                  {incentives.map((inc) => (
                    <option key={inc._id} value={inc._id}>
                      {inc.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2.5">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Eligibility Requirements:
                </label>

                {currentQuizRequirements?.map((reqKey: string) => {
                  const checked = checkedRequirements[reqKey] || false;
                  return (
                    <button
                      key={reqKey}
                      type="button"
                      onClick={() => handleToggleRequirement(reqKey)}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                        checked
                          ? 'border-brand-500/30 bg-brand-500/5 text-brand-700 dark:text-brand-300'
                          : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 text-zinc-650 dark:text-zinc-400'
                      }`}
                    >
                      {checked ? (
                        <CheckCircle className="h-4.5 w-4.5 text-brand-500 flex-none mt-0.5" />
                      ) : (
                        <Square className="h-4.5 w-4.5 text-zinc-400 flex-none mt-0.5" />
                      )}
                      <span className="leading-relaxed">{reqKey}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Results feedback panel */}
            <div className="flex flex-col justify-center">
              <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-2xl p-5 md:p-6 text-center space-y-4">
                <span className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  Checklist Assessment
                </span>

                <div className="flex justify-center">
                  {isFullyQualified ? (
                    <div className="h-16 w-16 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-500">
                      <CheckCircle className="h-10 w-10" />
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-accent-500/10 flex items-center justify-center text-accent-500">
                      <AlertTriangle className="h-10 w-10" />
                    </div>
                  )}
                </div>

                <div>
                  <span className="block text-base font-extrabold text-zinc-900 dark:text-white">
                    {isFullyQualified ? 'You meet all eligibility criteria!' : 'You do not meet all criteria. Review the missing conditions below.'}
                  </span>
                  <span className="block text-xs text-zinc-500 mt-1">
                    Requirement progress: {tickedCount} / {currentQuizRequirements.length} satisfied
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-1.5">
                  <div
                    className="bg-brand-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${currentQuizRequirements.length > 0 ? (tickedCount / currentQuizRequirements.length) * 100 : 0}%` }}
                  />
                </div>

                <div className="text-[11px] text-zinc-500 leading-normal pt-2">
                  {isFullyQualified ? (
                    <span className="text-brand-600 font-bold dark:text-brand-400 block">
                      You can now apply this incentive in the Customs Cost Estimator to set your import duty to 0%.
                    </span>
                  ) : (
                    <span>
                      Ensure you obtain the necessary certificates or meet threshold guidelines to unlock these savings at the border posts.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
