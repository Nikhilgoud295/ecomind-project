import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, FileUp, LineChart, Sparkles, FileText, Newspaper, User, Settings, ShieldCheck } from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/add-data', label: 'Upload & Record', icon: FileUp },
    { path: '/analytics', label: 'Analytics & Trends', icon: LineChart },
    { path: '/ai-advisor', label: 'AI Advisor', icon: Sparkles, badge: 'Gemini' },
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
                    `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:translate-x-1.5 ${
                      isActive
                        ? 'bg-slate-800 text-white border border-slate-700 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-eco-400 group-hover:scale-125 transition-transform duration-300" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Eco Rating Badge Widget */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-eco-500/30 hover:border-eco-500/60 transition-all duration-300 hover:scale-[1.02]">
        <div className="flex items-center gap-2.5 mb-2">
          <ShieldCheck className="w-5 h-5 text-eco-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-200">ISO 14064 Compliant</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Emissions computed in compliance with GHG protocol standard standards.
        </p>
      </div>
    </aside>
  );
}
