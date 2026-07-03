import React from 'react';
import { ArrowRight, Shield, Calculator, MessageSquare, Zap, Target, Users } from 'lucide-react';

interface LandingPageProps {
  setCurrentTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setCurrentTab }) => {
  
  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden rounded-[3rem] bg-zinc-950 dark:bg-black text-white shadow-2xl mx-2 border border-zinc-900/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.2),transparent_50%)]" />
        
        {/* Animated grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDEwaDQwTTAgMjBoNDBNMCAzMGg0ME0xMCAwdjQwTTIwIDB2NDBNejAgMHY0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiLz48L3N2Zz4=')] opacity-50" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="live-dot" />
            <span className="text-xs font-bold text-zinc-300 tracking-wider uppercase">Live in the Democratic Republic of Congo</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] font-display">
            Invest and Trade in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">DRC</span> with Confidence
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 leading-relaxed">
            We eliminate information asymmetry for investors and traders. Access real-time tax transparency, duty estimations, official incentive guidelines, and a network of professionals across the DRC.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setCurrentTab('home')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              Enter the Portal
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* The Problem & Solution */}
      <section className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white font-display leading-tight">
              Bridging the Gap in <br />
              <span className="text-brand-600 dark:text-brand-400">Investment Bureaucracy</span>
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              For decades, investors and cross-border traders have struggled with a lack of transparency regarding customs duties, business taxes, and legal exemptions in the DRC. This opacity leads to unexpected costs, delays, and discouraged investments.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 mt-0.5">
                  <Target className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Hidden costs and unpredictable tariffs limit investment volume.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 mt-0.5">
                  <Zap className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Lack of clarity on investment procedures and available tax incentives.</p>
              </li>
            </ul>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/20 to-accent-500/20 blur-3xl rounded-full" />
            <div className="relative glass-panel p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl">
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-4">The Solution</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                A centralized, real-time digital platform providing exact cost estimations, automated incentive detection, and multilingual AI assistance.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                  <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Cost Predictability</span>
                  <span className="text-brand-600 font-black">100%</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                  <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Real-time Tax Updates</span>
                  <span className="text-accent-500 font-black">Instant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-zinc-50 dark:bg-zinc-900/30 py-24 border-y border-zinc-150 dark:border-zinc-850">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white font-display">
              Everything You Need to Trade Smart
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Powerful tools designed specifically for the unique environment of the Great Lakes trade ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mb-6">
                <Calculator className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-3">Investment & Customs Estimator</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Input your cargo or capital value to calculate exact duties, VAT, and withholding taxes instantly before committing to an investment.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-accent-500/10 text-accent-500 flex items-center justify-center mb-6">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-3">Tax Incentives Directory</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Discover if your business qualifies for agricultural exemptions or local investment tax holidays to legally optimize your financial plan.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-6">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-3">Smart AI Assistant</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                What steps do you need to follow? How much will it cost? Our AI bot guides you through exact procedures before investing or trading.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-3">Professional Network</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Connect directly with verified customs agents, clerks, and local logistics companies to help transit and process your operations seamlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="bg-gradient-to-br from-brand-900 to-zinc-900 rounded-[3rem] p-8 md:p-16 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <Users className="w-64 h-64" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black mb-12 font-display">Built For Every Operator</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-brand-400 font-bold mb-2">Foreign Investors</h4>
                <p className="text-sm text-zinc-400 leading-relaxed">Understand the exact tax landscape, VAT rates, and exonerations before committing capital to the DRC's growing market.</p>
              </div>
              <div>
                <h4 className="text-accent-400 font-bold mb-2">Corporate Importers</h4>
                <p className="text-sm text-zinc-400 leading-relaxed">Calculate heavy commercial cargo costs with precise modeling and receive real-time updates when tariffs change.</p>
              </div>
              <div>
                <h4 className="text-indigo-400 font-bold mb-2">SME Traders</h4>
                <p className="text-sm text-zinc-400 leading-relaxed">Cross borders with confidence knowing your duty-free limits and quickly find logistics partners to handle your goods.</p>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="font-bold text-lg">Ready to optimize your trade?</h4>
                <p className="text-sm text-zinc-400">Join thousands of operators using SmartTrade RDC.</p>
              </div>
              <button
                onClick={() => setCurrentTab('home')}
                className="whitespace-nowrap px-8 py-3 rounded-xl bg-white text-brand-900 font-black hover:bg-zinc-100 transition-colors shadow-lg cursor-pointer"
              >
                Access Portal
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
