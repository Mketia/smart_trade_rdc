import React, { useState } from 'react';
import { EXCHANGE_RATES, convertCurrency } from "../lib/currency";
import { ArrowRightLeft, TrendingUp, Users, Activity, CheckCircle, Shield, Calculator } from 'lucide-react';

interface DashboardProps {
    setCurrentTab: (tab: string) => void;
  stats: {
    calculationsRun: number;
    incentivesApplied: number;
    satisfactionScore: number;
  };
}

export const Dashboard: React.FC<DashboardProps> = ({ setCurrentTab, stats }) => {
  
  // Currency Converter State
  const [convAmount, setConvAmount] = useState<number>(100);
  const [fromCurr, setFromCurr] = useState<keyof typeof EXCHANGE_RATES>('USD');
  const [toCurr, setToCurr] = useState<keyof typeof EXCHANGE_RATES>('RWF');

  const convertedValue = convertCurrency(convAmount, fromCurr, toCurr);

  const swapCurrencies = () => {
    setFromCurr(toCurr);
    setToCurr(fromCurr);
  };

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-500 to-accent-500 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_40%)]" />
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
            <span className="live-dot" />
            DRC Investment & Trade Hub
          </span>
          <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight leading-none text-white">
            Welcome to Gomaâ€“Gisenyi Trade Portal
          </h1>
          <p className="mt-3 text-sm md:text-base text-white/85 font-normal leading-relaxed">
            Real-time decision support for border crossing, customs cost simulation, and regulatory tax incentives awareness.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentTab('estimator')}
              className="flex items-center gap-1.5 rounded-xl bg-white hover:bg-zinc-100 px-4 py-2.5 text-xs font-bold text-brand-700 shadow-md transition-all cursor-pointer"
            >
              <Calculator className="h-4 w-4" />
              Customs Cost Estimator
            </button>
            <button
              onClick={() => setCurrentTab('incentives')}
              className="flex items-center gap-1.5 rounded-xl bg-white/15 hover:bg-white/25 px-4 py-2.5 text-xs font-bold text-white border border-white/30 transition-all cursor-pointer"
            >
              <Shield className="h-4 w-4 text-white" />
              Tax Incentives
            </button>
          </div>
        </div>
      </div>

      {/* News Ticker */}
      <div className="w-full bg-brand-500/5 dark:bg-brand-500/10 border border-brand-500/10 dark:border-brand-500/20 rounded-2xl py-3 px-4 overflow-hidden flex items-center gap-4">
        <span className="flex-none bg-brand-500 text-[10px] font-extrabold text-white px-2 py-0.5 rounded-md uppercase tracking-wider font-display">
          Live Updates
        </span>
        <div className="flex-1 relative overflow-hidden h-5">
          <div className="absolute whitespace-nowrap animate-marquee text-xs font-medium text-brand-800 dark:text-brand-300">
            CORRIDOR UPDATES: EAC Simplified Trade Regime (STR) threshold remains at $2,000. â€¢ Rubavu/Gisenyi electronic single window is online. â€¢ OCC fee in DRC is 1.5% CIF. â€¢ DRC seed imports exemption is fully active.
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="glass-panel rounded-2xl p-4 shadow-sm glass-card-hover flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Simulations Run Today
            </span>
            <div className="p-1.5 rounded-lg bg-brand-500/10 text-brand-500">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-zinc-900 dark:text-white font-display">
              {stats.calculationsRun}
            </span>
            <span className="block text-[10px] text-zinc-400 mt-1 font-semibold">
              +14% since yesterday
            </span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="glass-panel rounded-2xl p-4 shadow-sm glass-card-hover flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Active Incentives Applied
            </span>
            <div className="p-1.5 rounded-lg bg-accent-500/10 text-accent-500">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-zinc-900 dark:text-white font-display">
              {stats.incentivesApplied}
            </span>
            <span className="block text-[10px] text-zinc-400 mt-1 font-semibold">
              Saved $4,210 in duties
            </span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="glass-panel rounded-2xl p-4 shadow-sm glass-card-hover flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              User Satisfaction Rating
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-zinc-900 dark:text-white font-display">
              {stats.satisfactionScore.toFixed(1)} / 5.0
            </span>
            <span className="block text-[10px] text-zinc-400 mt-1 font-semibold">
              Based on survey feedback
            </span>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="glass-panel rounded-2xl p-4 shadow-sm glass-card-hover flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Daily Corridor Crossings
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-zinc-900 dark:text-white font-display">
              15,400+
            </span>
            <span className="block text-[10px] text-zinc-400 mt-1 font-semibold">
              Mainly small-scale agriculture
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Split: Border Status and Currency Exchange */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Border Corridor Status */}
        <div className="glass-panel rounded-3xl p-5 md:p-6 shadow-sm border border-zinc-100 dark:border-zinc-900 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2 mb-3">
              <span className="live-dot" />
              Corridor Operations Status
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans mb-4">
              Goma (DRC) - Gisenyi (Rwanda) border crossings (Petite BarriÃ¨re & Grande BarriÃ¨re) are operating normally.
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500 font-semibold">Petite Barrière (Small traders)</span>
                <span className="text-brand-600 font-bold bg-brand-500/10 px-2 py-0.5 rounded">OPEN (06:00 - 18:00)</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500 font-semibold">Grande Barrière (Heavy commercial)</span>
                <span className="text-brand-600 font-bold bg-brand-500/10 px-2 py-0.5 rounded">OPEN (24 HOURS)</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5">
                <span className="text-zinc-500 font-semibold">Avg. Crossing Wait Time</span>
                <span className="text-zinc-800 dark:text-zinc-200 font-bold">12 - 25 Minutes</span>
              </div>
            </div>
          </div>

        </div>

        {/* Currency Converter */}
        <div className="glass-panel rounded-3xl p-5 md:p-6 shadow-sm border border-zinc-100 dark:border-zinc-900">
          <h3 className="text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2 mb-3">
            <ArrowRightLeft className="h-5 w-5 text-brand-500" />
            Quick Currency Calculator
          </h3>
          <div className="space-y-4">
            {/* Input amount */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Amount to Convert
              </label>
              <input
                type="number"
                value={convAmount}
                onChange={(e) => setConvAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 text-sm font-semibold focus:outline-none focus:border-brand-500 text-zinc-800 dark:text-white"
              />
            </div>

            {/* Currency selectors split */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  From
                </label>
                <select
                  value={fromCurr}
                  onChange={(e) => setFromCurr(e.target.value as keyof typeof EXCHANGE_RATES)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-2.5 py-2 text-xs font-semibold focus:outline-none text-zinc-700 dark:text-zinc-300"
                >
                  <option value="USD">USD ($)</option>
                  <option value="RWF">RWF (Frw)</option>
                  <option value="CDF">CDF (FC)</option>
                </select>
              </div>

              <button
                onClick={swapCurrencies}
                className="flex-none mt-5 p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 hover:text-brand-500 text-zinc-500 transition-colors cursor-pointer"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </button>

              <div className="flex-1">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  To
                </label>
                <select
                  value={toCurr}
                  onChange={(e) => setToCurr(e.target.value as keyof typeof EXCHANGE_RATES)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-2.5 py-2 text-xs font-semibold focus:outline-none text-zinc-700 dark:text-zinc-300"
                >
                  <option value="USD">USD ($)</option>
                  <option value="RWF">RWF (Frw)</option>
                  <option value="CDF">CDF (FC)</option>
                </select>
              </div>
            </div>

            {/* Results Panel */}
            <div className="bg-brand-500/5 dark:bg-brand-500/10 border border-dashed border-brand-500/10 dark:border-brand-500/20 rounded-xl p-3.5 text-center mt-2">
              <span className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Converted Amount
              </span>
              <span className="text-xl font-black text-brand-600 dark:text-brand-400 font-display mt-0.5 block">
                {convertedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurr}
              </span>
              <div className="text-[9px] text-zinc-400 mt-1 font-semibold">
                1 {fromCurr} = {(EXCHANGE_RATES[toCurr] / EXCHANGE_RATES[fromCurr]).toFixed(4)} {toCurr}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Live Exchange Rate Feed Table */}
      <div className="glass-panel rounded-3xl p-5 md:p-6 shadow-sm border border-zinc-100 dark:border-zinc-900">
        <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-brand-500" />
          Live Exchange Rates (USD Base)
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800/80">
            <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">1 USD</span>
            <span className="text-base font-extrabold text-zinc-800 dark:text-zinc-200 mt-1 block">1,295.00 RWF</span>
          </div>
          <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800/80">
            <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">1 USD</span>
            <span className="text-base font-extrabold text-zinc-800 dark:text-zinc-200 mt-1 block">2,800.00 CDF</span>
          </div>
          <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800/80">
            <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">1,000 RWF</span>
            <span className="text-base font-extrabold text-zinc-800 dark:text-zinc-200 mt-1 block">2,162.16 CDF</span>
          </div>
        </div>
        <div className="text-[10px] text-zinc-400 mt-3 text-right font-medium">
          Rates updated: June 2026 (Official Source: DGDA & RRA)
        </div>
      </div>
    </div>
  );
};
