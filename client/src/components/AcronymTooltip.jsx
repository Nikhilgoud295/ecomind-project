import React, { useState } from 'react';
import { ShieldCheck, FileCheck, Info } from 'lucide-react';

const acronymData = {
  SEBI: {
    fullForm: 'Securities and Exchange Board of India',
    tag: 'Statutory Regulator',
    desc: 'The apex statutory regulator governing Indian securities and capital markets, mandating ESG compliance & statutory sustainability reporting.',
    color: 'from-blue-600 via-indigo-500 to-teal-400',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    icon: ShieldCheck
  },
  BRSR: {
    fullForm: 'Business Responsibility and Sustainability Reporting',
    tag: 'ESG Disclosure Standard',
    desc: 'The mandatory ESG framework mandated by SEBI for top listed enterprises to report Scope 1, 2 & 3 carbon footprint, water stewardship, and governance.',
    color: 'from-eco-600 via-emerald-500 to-teal-400',
    badgeBg: 'bg-eco-500/20 text-eco-300 border-eco-500/30',
    icon: FileCheck
  }
};

export default function AcronymTooltip({ term = 'SEBI', customText }) {
  const [hovered, setHovered] = useState(false);
  const normalizedKey = term.toUpperCase().includes('BRSR') ? 'BRSR' : 'SEBI';
  const info = acronymData[normalizedKey];
  const Icon = info.icon;

  return (
    <span
      className="relative inline-block cursor-help z-30"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="font-bold text-emerald-300 underline decoration-emerald-400/60 decoration-dashed underline-offset-4 hover:text-white hover:decoration-emerald-300 transition-all duration-300">
        {customText || term}
      </span>

      {/* Pop-Up Card Modal on Cursor Hover */}
      {hovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-72 p-4 rounded-2xl glass-panel bg-slate-900/95 border border-slate-700/80 shadow-2xl z-50 animate-fade-in backdrop-blur-xl pointer-events-none space-y-2.5 text-left">
          <div className="flex items-start gap-2.5 border-b border-slate-800 pb-2.5">
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${info.color} p-0.5 shadow-md flex-shrink-0 flex items-center justify-center`}>
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Icon className="w-4 h-4 text-emerald-300" />
              </div>
            </div>
            <div className="space-y-0.5">
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full border ${info.badgeBg}`}>
                {info.tag}
              </span>
              <h4 className="text-xs font-bold text-white leading-snug">{info.fullForm} ({normalizedKey})</h4>
            </div>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
            {info.desc}
          </p>

          <div className="text-[9px] text-slate-500 font-mono flex items-center gap-1">
            <Info className="w-3 h-3 text-emerald-400" /> Hover to view statutory definition
          </div>

          {/* Pointer Triangle */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-r border-b border-slate-700/80 rotate-45" />
        </div>
      )}
    </span>
  );
}
