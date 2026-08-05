import React from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, Lightbulb, Zap, Droplets, Trash2, ArrowRight, Award, Flame } from 'lucide-react';
import { getScoreBadge } from '../utils/calculations';

export default function AIRecommendationCards({ report }) {
  if (!report) {
    return (
      <div className="glass-panel p-8 rounded-2xl text-center space-y-3">
        <Sparkles className="w-8 h-8 text-eco-400 mx-auto animate-pulse" />
        <h3 className="text-base font-semibold text-white">No AI Analysis Generated Yet</h3>
        <p className="text-xs text-slate-400">Submit your resource usage logs to trigger Gemini AI sustainability analysis.</p>
      </div>
    );
  }

  const {
    sustainability_score = 80,
    summary = 'Overall resource usage shows moderate environmental impact with room for grid decarbonization.',
    strengths = [],
    problems = [],
    recommendations = [],
    carbon_reduction_tips = [],
    water_saving_tips = [],
    energy_saving_tips = [],
    waste_reduction_plan = [],
    priority_actions = [],
  } = report;

  const scoreBadge = getScoreBadge(sustainability_score);

  return (
    <div className="space-y-6">
      {/* Score Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-eco-500/30 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-dark-bg border border-eco-500/40 flex flex-col items-center justify-center shadow-glow-eco">
            <span className="text-3xl font-bold font-display text-emerald-400">{sustainability_score}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Score</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${scoreBadge.color}`}>
                {scoreBadge.label}
              </span>
              <span className="text-xs text-slate-400 font-medium">Gemini 1.5 Analysis</span>
            </div>
            <h3 className="text-lg font-bold font-display text-white">AI Sustainability Assessment</h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">{summary}</p>
          </div>
        </div>
      </div>

      {/* Priority Action Items */}
      {priority_actions.length > 0 && (
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/20 to-slate-900">
          <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-3 uppercase tracking-wider">
            <Flame className="w-4 h-4 text-amber-400" />
            Top Priority Action Items
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {priority_actions.map((action, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <ArrowRight className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-slate-200 font-medium">{action}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths vs Problems Identified */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Key Sustainability Strengths
          </h4>
          <ul className="space-y-2">
            {strengths.map((item, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2.5 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5"></div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Problems */}
        <div className="glass-panel p-5 rounded-2xl border border-rose-500/20 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Efficiency Hotspots & Concerns
          </h4>
          <ul className="space-y-2">
            {problems.map((item, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2.5 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5"></div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Specialized Actionable Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Carbon Reduction */}
        <div className="glass-panel p-4 rounded-xl border border-cyan-500/20 space-y-3">
          <h5 className="text-xs font-bold text-cyan-400 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Carbon Reduction
          </h5>
          <ul className="space-y-2 text-xs text-slate-300">
            {carbon_reduction_tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Water Saving */}
        <div className="glass-panel p-4 rounded-xl border border-blue-500/20 space-y-3">
          <h5 className="text-xs font-bold text-blue-400 flex items-center gap-2">
            <Droplets className="w-4 h-4" />
            Water Conservation
          </h5>
          <ul className="space-y-2 text-xs text-slate-300">
            {water_saving_tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Energy Saving */}
        <div className="glass-panel p-4 rounded-xl border border-amber-500/20 space-y-3">
          <h5 className="text-xs font-bold text-amber-400 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Energy Efficiency
          </h5>
          <ul className="space-y-2 text-xs text-slate-300">
            {energy_saving_tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
