import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, FileUp, LineChart, Sparkles, FileText, Newspaper, User, Settings, ShieldCheck, Award } from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/add-data', label: 'Upload & Record', icon: FileUp },
    { path: '/analytics', label: 'Analytics & Trends', icon: LineChart },
    { path: '/ai-advisor', label: 'AI Advisor', icon: Sparkles, badge: 'Gemini' },
    { path: '/rewards', label: 'Rewards & Badges', icon: Award, badge: 'Top 1%' },
    { path: '/eco-news', label: 'Intelligence Hub', icon: ShieldCheck, badge: 'Enterprise' },
    { path: '/reports', label: 'Reports Export', icon: FileText },
  ];

  const secondaryItems = [
    { path: '/profile', label: 'User Profile', icon: User },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-800/80 min-h-[calc(100vh-4rem)] p-4 hidden lg:flex flex-col justify-between transition-all">
      <div className="space-y-6">
        <div>
          <h3 className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Navigation Core
          </h3>
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:translate-x-1.5 ${
                      isActive
                        ? 'bg-gradient-to-r from-eco-600 to-teal-600 text-white shadow-glow-eco font-bold scale-[1.02]'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-eco-400 group-hover:scale-125 group-hover:rotate-6 transition-transform duration-300" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 group-hover:bg-emerald-500/40 transition-colors">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div>
          <h3 className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Preferences & Account
          </h3>
          <nav className="space-y-1.5">
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:translate-x-1.5 ${
                      isActive
                        ? 'bg-slate-800 text-white font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-eco-400" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sustainability Appreciation Card Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-eco-500/30 space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
          <Award className="w-4 h-4 text-emerald-300" />
          <span>Tier 1 Sustainability</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-snug">
          You've earned <strong>1,420 Eco-Points</strong> and 4 performance badges!
        </p>
        <NavLink
          to="/rewards"
          className="block text-[11px] font-extrabold text-eco-400 hover:text-eco-300 hover:underline"
        >
          View Rewards Core →
        </NavLink>
      </div>
    </aside>
  );
}
