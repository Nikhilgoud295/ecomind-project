import React from 'react';
import { Zap, Droplets, Trash2, CloudRain, ShieldAlert, ArrowDownRight, ArrowUpRight, Award } from 'lucide-react';
import { getScoreBadge } from '../utils/calculations';

export default function DashboardCards({ summary }) {
  const {
    sustainabilityScore = 82,
    totalCO2 = 75.8,
    totalElectricity = 81.7,
    totalWater = 615,
    totalWaste = 13.6,
    co2ChangePct = -8.5,
  } = summary || {};

  const badge = getScoreBadge(sustainabilityScore);

  const cards = [
    {
      title: 'Sustainability Score',
      value: `${sustainabilityScore}/100`,
      subtext: badge.label,
      icon: Award,
      color: 'from-emerald-500/20 to-teal-500/10',
      iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      badgeClass: badge.color,
    },
    {
      title: 'Carbon Footprint',
      value: `${totalCO2} kg`,
      unit: 'CO2e',
      subtext: `${co2ChangePct <= 0 ? `${co2ChangePct}% vs last week` : `+${co2ChangePct}% vs last week`}`,
      isGood: co2ChangePct <= 0,
      icon: CloudRain,
      color: 'from-cyan-500/20 to-blue-500/10',
      iconColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
    },
    {
      title: 'Electricity Consumption',
      value: `${totalElectricity}`,
      unit: 'kWh',
      subtext: 'Grid power log aggregate',
      icon: Zap,
      color: 'from-amber-500/20 to-yellow-500/10',
      iconColor: 'text-amber-400',
      borderColor: 'border-amber-500/30',
    },
    {
      title: 'Water Usage',
      value: `${totalWater}`,
      unit: 'Liters',
      subtext: 'Clean water consumption',
      icon: Droplets,
      color: 'from-blue-500/20 to-sky-500/10',
      iconColor: 'text-blue-400',
      borderColor: 'border-blue-500/30',
    },
    {
      title: 'Waste Generated',
      value: `${totalWaste}`,
      unit: 'kg',
      subtext: 'Solid waste generated',
      icon: Trash2,
      color: 'from-rose-500/20 to-orange-500/10',
      iconColor: 'text-rose-400',
      borderColor: 'border-rose-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`glass-panel glass-panel-hover p-4 rounded-2xl border ${card.borderColor} bg-gradient-to-br ${card.color} relative overflow-hidden`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">{card.title}</span>
              <div className={`p-2 rounded-xl bg-slate-900/60 border border-slate-800 ${card.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-2xl font-bold font-display text-white tracking-tight">{card.value}</span>
              {card.unit && <span className="text-xs text-slate-400 font-medium">{card.unit}</span>}
            </div>

            <div className="flex items-center gap-1">
              {card.badgeClass ? (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${card.badgeClass}`}>
                  {card.subtext}
                </span>
              ) : (
                <div className="flex items-center gap-1 text-xs">
                  {card.isGood !== undefined && (
                    card.isGood ? (
                      <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
                    )
                  )}
                  <span className={card.isGood ? 'text-emerald-400' : card.isGood === false ? 'text-rose-400' : 'text-slate-400'}>
                    {card.subtext}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
