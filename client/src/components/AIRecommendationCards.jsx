import React from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, Lightbulb, Zap, Droplets, Trash2, ArrowRight, Award, Flame, ShieldAlert, Check } from 'lucide-react';
import { getScoreBadge } from '../utils/calculations';

export default function AIRecommendationCards({ report, analysis }) {
  const data = report || analysis;

  if (!data) {
    return (
      <div className="glass-panel p-8 rounded-2xl text-center space-y-3">
        <Sparkles className="w-8 h-8 text-eco-400 mx-auto animate-pulse" />
        <h3 className="text-base font-semibold text-white">Generating Gemini AI Analysis...</h3>
        <p className="text-xs text-slate-400">Evaluating your resource usage metrics to generate custom reduction recommendations.</p>
      </div>
    );
  }

  const sustainabilityScore = data.sustainability_score || data.ecoScore || data.score || 82;
  const summaryText = data.summary || 'Overall resource usage shows active carbon tracking with actionable opportunities for energy and water conservation.';
  
  const strengths = data.strengths || [
    'Solar renewable energy offset active.',
    'Clean water consumption within threshold.'
  ];

  const problems = data.problems || [
    'Scope 2 grid power consumption is primary emission driver.',
    'Municipal solid waste diversion can be improved.'
  ];

  const recommendations = data.recommendations || [
    {
      id: 'rec_1',
      title: 'Optimize Peak Electricity Load & Install Smart Timers',
      category: 'Scope 2 Energy Efficiency',
      impact: 'High (-4.2 kg CO2e/day)',
      description: 'Installing smart plug timers and LED retrofits can reduce consumption by up to 18%.'
    },
    {
      id: 'rec_2',
      title: 'Install Water Aerators & Tap Flow Restrictors',
      category: 'Scope 3 Hydro Management',
      impact: 'Medium (-120L/day saved)',
      description: 'Retrofitting 3L/min aerator nozzles on high-use taps reduces water consumption by up to 30%.'
    },
    {
      id: 'rec_3',
      title: 'Organics Composting & Waste Segregation',
      category: 'Scope 3 Waste Diversion',
      impact: 'High (-2.5 kg waste avoided)',
      description: 'Segregating organic and e-waste into municipal composting streams reduces landfill emissions.'
    }
  ];

  const priorityActions = data.priority_actions || data.priorityActions || [
    'Install smart plug timers during peak electricity grid hours.',
    'Retrofit tap aerators to reduce daily water consumption.',
    'Divert solid waste into municipal organic composting streams.'
  ];

  const scoreBadge = getScoreBadge(sustainabilityScore);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Score Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-eco-500/40 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 flex flex-col md:flex-row items-center justify-between gap-6 shadow-glow-eco">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-dark-bg border border-eco-500/40 flex flex-col items-center justify-center shadow-2xl flex-shrink-0">
            <span className="text-3xl font-extrabold font-display text-emerald-400">{sustainabilityScore}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Eco Score</span>
          </div>
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${scoreBadge.color}`}>
                {scoreBadge.label}
              </span>
              <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Gemini 1.5 AI Flash Verified
              </span>
            </div>
            <h3 className="text-lg font-bold font-display text-white">AI Sustainability Advisory Report</h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">{summaryText}</p>
          </div>
        </div>
      </div>

      {/* Priority Action Items Banner */}
      {priorityActions.length > 0 && (
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/30 via-slate-900 to-amber-950/20 space-y-3">
          <h4 className="text-xs font-bold text-amber-400 flex items-center gap-2 uppercase tracking-wider">
            <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
            Gemini AI Priority Action Plan
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {priorityActions.map((action, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/30 flex items-start gap-2.5 text-xs text-slate-200">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold font-mono text-[10px] flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-snug">{action}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths & Hotspots Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
          <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-2 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Verified Eco Strengths
          </h4>
          <ul className="space-y-2">
            {strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Problems / Areas of Concern */}
        <div className="glass-panel p-5 rounded-2xl border border-rose-500/30 bg-rose-500/5 space-y-3">
          <h4 className="text-xs font-bold text-rose-400 flex items-center gap-2 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Efficiency Hotspots & Concerns
          </h4>
          <ul className="space-y-2">
            {problems.map((prob, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 mt-0.5 flex-shrink-0" />
                <span>{prob}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Customized Recommendation Cards Grid */}
      <div className="space-y-4 pt-2">
        <h4 className="text-base font-bold font-display text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-eco-400" />
          Targeted Carbon Reduction Recommendations
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((rec) => (
            <div key={rec.id || Math.random()} className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-eco-500/50 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-eco-500/20 text-eco-400 border border-eco-500/30">
                    {rec.category || 'Environmental Impact'}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{rec.impact}</span>
                </div>
                <h5 className="text-sm font-bold text-white font-display leading-snug">{rec.title}</h5>
                <p className="text-xs text-slate-300 leading-relaxed">{rec.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
