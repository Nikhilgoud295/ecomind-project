import React, { useState } from 'react';
import { ShieldCheck, FileCheck, Info, Sparkles } from 'lucide-react';

const acronymData = {
  SEBI: {
    fullForm: 'Securities and Exchange Board of India',
    tag: 'Statutory Regulator',
    desc: 'The apex statutory regulatory authority overseeing capital markets in India, mandating mandatory ESG compliance and statutory sustainability disclosures.',
    color: 'from-blue-600 via-indigo-500 to-teal-400',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    icon: ShieldCheck
  },
  BRSR: {
    fullForm: 'Business Responsibility and Sustainability Reporting',
    tag: 'ESG Disclosure Framework',
    desc: 'The official statutory ESG reporting format mandated by SEBI for top 1,000 listed entities to disclose Scope 1, 2 & 3 carbon footprint, water stewardship, and governance.',
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
      className="relative inline-block cursor-help z-40 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Zoomed Word Text */}
      <span className={`inline-block font-extrabold underline decoration-emerald-400 decoration-dashed underline-offset-4 transition-all duration-300 transform select-none ${
        hovered 
          ? 'scale-125 -translate-y-1 text-emerald-300 decoration-emerald-300 drop-shadow-[0_0_18px_rgba(16,185,129,0.95)]' 
          : 'scale-100 text-emerald-400 hover:text-emerald-300'
      }`}>
        {customText || term}
      </span>

      {/* Meaning Pop-Up Card Positioned Directly ON TOP of the Word */}
      {hovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 p-4 rounded-2xl glass-panel bg-slate-900/95 border border-slate-700/90 shadow-2xl z-50 animate-fade-in backdrop-blur-xl pointer-events-none space-y-2.5 text-left transform origin-bottom transition-all duration-300">
          <div className="flex items-start gap-2.5 border-b border-slate-800 pb-2.5">
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${info.color} p-0.5 shadow-md flex-shrink-0 flex items-center justify-center`}>
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Icon className="w-4 h-4 text-emerald-300 animate-pulse" />
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

          <div className="text-[9px] text-slate-400 font-mono flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400 animate-spin" style={{ animationDuration: '4s' }} /> Statutory ESG Definition
          </div>

          {/* Pointer Triangle Pointing Down to the Zoomed Word */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-r border-b border-slate-700/90 rotate-45" />
        </div>
      )}
    </span>
  );
}
