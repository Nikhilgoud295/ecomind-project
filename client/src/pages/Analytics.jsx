import React, { useState, useEffect } from 'react';
import { BarChart3, Calendar, Filter, Download, Zap, Droplets, Trash2, CloudRain, ShieldCheck, FileUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { auditStore } from '../services/auditStore';

export default function Analytics() {
  const [summary, setSummary] = useState(() => auditStore.getSummary());

  const syncAuditData = () => {
    setSummary(auditStore.getSummary());
  };

  useEffect(() => {
    syncAuditData();
    window.addEventListener('ecomind_audit_updated', syncAuditData);
    window.addEventListener('storage', syncAuditData);
    return () => {
      window.removeEventListener('ecomind_audit_updated', syncAuditData);
      window.removeEventListener('storage', syncAuditData);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-slate-100">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6 overflow-hidden">
          {/* Header */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Data Visualizer & GHG Metrics
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {summary.hasData ? `${summary.recordCount} Log Entries Analyzed` : '0 Entries Logged'}
                </span>
              </div>
              <h1 className="text-2xl font-bold font-display text-white mt-1 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-eco-400" />
                Sustainability Analytics
              </h1>
              <p className="text-xs text-slate-400">
                Interactive charts and emissions breakdown calculated strictly from your logged resource entries.
              </p>
            </div>

            <Link
              to="/add-data"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-eco-600 to-teal-500 hover:from-eco-500 hover:to-teal-400 text-white font-medium text-xs shadow-glow-eco flex items-center gap-2 transition-all"
            >
              <FileUp className="w-4 h-4" /> Add Usage Record
            </Link>
          </div>

          {/* Prompt if no user data logged */}
          {!summary.hasData && (
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-2">
              <CloudRain className="w-8 h-8 text-slate-500 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Analytics Data Available Yet</h3>
              <p className="text-xs text-slate-400">Log electricity, water, or waste entries in "Upload & Add Data" to view custom analytics graphs.</p>
            </div>
          )}

          {/* Scope Breakdown Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-rose-500/30 bg-rose-500/5 space-y-2">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">Scope 1 (Direct Fuel)</span>
              <span className="text-2xl font-extrabold text-white font-mono">{summary.hasData ? `${summary.scope1} kg` : '0.0 kg'}</span>
              <span className="text-[11px] text-slate-400 block">Fuel, generator & gas emissions</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Scope 2 (Electricity Grid)</span>
              <span className="text-2xl font-extrabold text-white font-mono">{summary.hasData ? `${summary.scope2} kg` : '0.0 kg'}</span>
              <span className="text-[11px] text-slate-400 block">Purchased grid power emissions</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Scope 3 (Water, Waste, Transport)</span>
              <span className="text-2xl font-extrabold text-white font-mono">{summary.hasData ? `${summary.scope3} kg` : '0.0 kg'}</span>
              <span className="text-[11px] text-slate-400 block">Supply chain & waste disposal emissions</span>
            </div>
          </div>

          {/* Dynamic Recharts Component */}
          <AnalyticsCharts summary={summary} />
        </main>
      </div>

      <Footer />
    </div>
  );
}
