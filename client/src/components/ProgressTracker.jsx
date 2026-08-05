import React from 'react';
import { Target, TrendingDown, Sun, RefreshCw, Award } from 'lucide-react';

export default function ProgressTracker({ summary }) {
  const {
    avgRenewablePct = 34,
    avgRecyclingPct = 51,
    sustainabilityScore = 82,
    co2ChangePct = -8.5,
  } = summary || {};

  const targets = [
    {
      title: 'Net Zero Carbon Target',
      current: `${Math.abs(co2ChangePct)}%`,
      goal: '15% reduction/mo',
      percentage: Math.min(100, Math.round((Math.abs(co2ChangePct) / 15) * 100)),
      icon: TrendingDown,
      color: 'from-emerald-500 to-teal-400',
    },
    {
      title: 'Renewable Energy Adoption',
      current: `${avgRenewablePct}%`,
      goal: '50% clean power',
      percentage: Math.min(100, Math.round((avgRenewablePct / 50) * 100)),
      icon: Sun,
      color: 'from-amber-400 to-yellow-500',
    },
    {
      title: 'Zero Waste Recycling Rate',
      current: `${avgRecyclingPct}%`,
      goal: '70% diversion',
      percentage: Math.min(100, Math.round((avgRecyclingPct / 70) * 100)),
      icon: RefreshCw,
      color: 'from-emerald-400 to-cyan-500',
    },
  ];

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
          <Target className="w-4 h-4 text-eco-400" />
          Sustainability Target Milestones
        </h3>
        <span className="text-xs text-slate-400 font-medium">Q3 2026 Objectives</span>
      </div>

      <div className="space-y-4">
        {targets.map((target, idx) => {
          const Icon = target.icon;
          return (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-eco-400" />
                  {target.title}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">{target.current}</span>
                  <span className="text-slate-500">/ Goal: {target.goal}</span>
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${target.color} transition-all duration-500`}
                  style={{ width: `${target.percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
