import React from 'react';
import { Zap, Droplets, Trash2, CloudRain, ShieldAlert, ArrowDownRight, ArrowUpRight, Award, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getScoreBadge } from '../utils/calculations';

export default function DashboardCards({ summary }) {
  const hasData = summary?.hasData ?? false;

  const {
    sustainabilityScore = hasData ? summary.sustainabilityScore : 0,
    totalCO2 = hasData ? summary.totalCO2 : 0,
    totalElectricity = hasData ? summary.totalElectricity : 0,
    totalWater = hasData ? summary.totalWater : 0,
    totalWaste = hasData ? summary.totalWaste : 0,
    co2ChangePct = hasData ? summary.co2ChangePct : 0,
  } = summary || {};

  const badge = getScoreBadge(sustainabilityScore);

  const cards = [
    {
      title: 'Sustainability Score',
      value: hasData ? `${sustainabilityScore}/100` : '0/100',
      subtext: hasData ? badge.label : 'Awaiting Audit Entry',
      icon: Award,
      color: 'from-emerald-500/20 to-teal-500/10',
      iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      badgeClass: hasData ? badge.color : 'bg-slate-800 text-slate-400',
    },
    {
      title: 'Carbon Footprint',
      value: hasData ? `${totalCO2} kg` : '0.0 kg',
      unit: 'CO2e',
      subtext: hasData ? (co2ChangePct <= 0 ? `${co2ChangePct}% vs last period` : `+${co2ChangePct}% vs last period`) : 'No logs recorded',
      isGood: co2ChangePct <= 0,
      icon: CloudRain,
      color: 'from-cyan-500/20 to-blue-500/10',
      iconColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
    },
    {
      title: 'Electricity Consumption',
      value: hasData ? `${totalElectricity}` : '0',
      unit: 'kWh',
      subtext: hasData ? 'User audit aggregate' : 'No electricity logged',
      icon: Zap,
      color: 'from-amber-500/20 to-yellow-500/10',
      iconColor: 'text-amber-400',
      borderColor: 'border-amber-500/30',
    },
    {
      title: 'Water Usage',
      value: hasData ? `${totalWater}` : '0',
      unit: 'Liters',
      subtext: hasData ? 'Clean water log aggregate' : 'No water logged',
      icon: Droplets,
      color: 'from-blue-500/20 to-sky-500/10',
      iconColor: 'text-blue-400',
      borderColor: 'border-blue-500/30',
    },
    {
      title: 'Waste Generated',
      value: hasData ? `${totalWaste}` : '0',
      unit: 'kg',
      subtext: hasData ? 'Solid waste log aggregate' : 'No waste logged',
      icon: Trash2,
      color: 'from-rose-500/20 to-pink-500/10',
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
            className={`glass-panel p-5 rounded-3xl border ${card.borderColor} bg-gradient-to-br ${card.color} space-y-3 relative overflow-hidden transition-all duration-300 hover:scale-[1.02] shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{card.title}</span>
              <div className={`p-2 rounded-xl bg-slate-950/60 border border-slate-800 ${card.iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold font-display text-white">{card.value}</span>
                {card.unit && <span className="text-xs font-medium text-slate-400">{card.unit}</span>}
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                {card.badgeClass ? (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${card.badgeClass}`}>
                    {card.subtext}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">{card.subtext}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
