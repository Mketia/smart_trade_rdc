import React from 'react';
import { ExternalLink, Landmark, ShieldCheck, Mail, MapPin, Phone } from 'lucide-react';

interface FooterProps {
  }

export const Footer: React.FC<FooterProps> = () => {
    const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-brand-900/10 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 py-10 px-4 mt-auto">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 text-left">
          
          {/* Column 1: Mission / Vision */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider font-display flex items-center gap-1.5">
              <span>SmartTrade RDC</span>
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
              A digital trade facilitation portal dedicated to improving tax transparency, customs duty modeling, and simplified trade regime awareness across the Democratic Republic of Congo.
            </p>
          </div>

          {/* Column 2: Support Helpdesk */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-800 dark:text-white uppercase tracking-wider font-display flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-brand-500" />
              <span>Border Helpdesk</span>
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-zinc-400 flex-none" />
                <span>Petite Barrière, Goma / Rubavu</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-zinc-400 flex-none" />
                <a href="tel:+250798263372" className="hover:text-brand-500 transition-colors">+250 798 263 372</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-zinc-400 flex-none" />
                <a href="mailto:support@smarttrade-rdc.org" className="hover:text-brand-500 transition-colors">support@smarttrade-rdc.org</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Regional Custom authorities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-800 dark:text-white uppercase tracking-wider font-display flex items-center gap-1.5">
              <Landmark className="h-4 w-4 text-zinc-400" />
              <span>Official Portals</span>
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a
                  href="https://rra.gov.rw"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-zinc-500 hover:text-brand-500 dark:text-zinc-400 dark:hover:text-brand-400 transition-colors"
                >
                  <span>Rwanda Revenue Authority (RRA)</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://rdb.rw"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-zinc-500 hover:text-brand-500 dark:text-zinc-400 dark:hover:text-brand-400 transition-colors"
                >
                  <span>Rwanda Development Board (RDB)</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://dgda.gouv.cd"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-zinc-500 hover:text-brand-500 dark:text-zinc-400 dark:hover:text-brand-400 transition-colors"
                >
                  <span>DGDA (Douanes RDC)</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://investindrc.cd"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-zinc-500 hover:text-brand-500 dark:text-zinc-400 dark:hover:text-brand-400 transition-colors"
                >
                  <span>ANAPI (Investissements RDC)</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-800 dark:text-white uppercase tracking-wider font-display flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-accent-500" />
              <span>Legal Disclaimer</span>
            </h4>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-normal font-sans">
              Disclaimer: This platform provides estimations for trade planning. Official taxes are determined at the border by customs officers.
            </p>
          </div>
        </div>

        {/* Bottom copyright details */}
        <div className="border-t border-brand-900/10 dark:border-zinc-800 pt-4 text-[10px] text-zinc-400 dark:text-zinc-500 text-center sm:text-left">
          &copy; {year} SmartTrade RDC. Designed for cross-border traders and regional investors in the Great Lakes region.
        </div>
      </div>
    </footer>
  );
};
