import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, FileUp, Sparkles, FileText, ArrowRight, Clock, Trash2, Calendar, Zap, Droplets, Leaf, ShieldAlert, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import DashboardCards from '../components/DashboardCards';
import AnalyticsCharts from '../components/AnalyticsCharts';
import ProgressTracker from '../components/ProgressTracker';
import EcoGlobe3D from '../components/EcoGlobe3D';
import { authService } from '../services/authService';
import { auditStore } from '../services/auditStore';

export default function Dashboard() {
  const [summary, setSummary] = useState(() => auditStore.getSummary());
  const currentUser = authService.getCurrentUser();

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

  const handleDeleteLog = (id) => {
    auditStore.deleteRecord(id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-slate-100">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6 overflow-hidden">
          {/* Welcome Header */}
          <div className="glass-panel p-6 rounded-3xl border border-eco-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-eco-500/20 text-eco-400 border border-eco-500/30">
                  {currentUser?.organization || 'EcoMind Enterprise'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {summary.hasData ? `${summary.recordCount} Audit Logs Recorded` : 'Zero Logs (Awaiting Input)'}
                </span>
              </div>
              <h1 className="text-2xl font-bold font-display text-white">
                Welcome Back, {currentUser?.name || 'User'} 👋
              </h1>
              <p className="text-xs text-slate-300">
                {summary.hasData
                  ? 'Your real-time sustainability metrics and Gemini AI advisory reports are updated from your audit entries.'
                  : 'Start by recording your resource usage below to calculate your dynamic carbon footprint.'}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Link
                to="/add-data"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-eco-600 to-teal-500 hover:from-eco-500 hover:to-teal-400 text-white font-medium text-xs shadow-glow-eco flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <FileUp className="w-4 h-4" />
                Upload & Add Data
              </Link>
              <Link
                to="/ai-advisor"
                className="px-4 py-2.5 rounded-xl glass-panel border border-slate-700 hover:border-eco-500/40 text-slate-200 hover:text-white font-medium text-xs flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Ask Gemini AI
              </Link>
            </div>
          </div>

          {/* Onboarding Empty State Card (If no user data logged yet) */}
          {!summary.hasData && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border-2 border-dashed border-eco-500/40 space-y-3 animate-fade-in text-center shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-eco-500/20 text-eco-400 border border-eco-500/30 flex items-center justify-center mx-auto">
                <FileUp className="w-6 h-6 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-display text-white">No Environmental Audit Data Logged Yet</h3>
                <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                  Your carbon footprint (CO2e), scope breakdowns, and BRSR statutory reports are calculated strictly based on your logged resource entries.
                </p>
              </div>
              <Link
                to="/add-data"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-eco-600 to-teal-500 hover:from-eco-500 hover:to-teal-400 text-white font-bold text-xs shadow-glow-eco transition-all transform hover:scale-105"
              >
                <FileUp className="w-4 h-4" /> Log Your First Resource Audit Entry
              </Link>
            </div>
          )}

          {/* Core Dashboard Metric Cards (Strictly User Data) */}
          <DashboardCards summary={summary} />

          {/* Interactive 3D WebGL Eco Globe Command Center */}
          <EcoGlobe3D title="3D Global Sustainability & Resource Command Globe" />

          {/* Charts & Target Progress Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AnalyticsCharts summary={summary} />
            </div>
            <div>
              <ProgressTracker summary={summary} />
            </div>
          </div>

          {/* Recent Resource Logs Table */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-eco-400" />
                <h3 className="text-sm font-bold font-display text-white">Recent Resource Tracking Logs</h3>
              </div>
              <Link to="/analytics" className="text-xs text-eco-400 hover:underline flex items-center gap-1 font-medium">
                View Full History <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {summary.logs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                <p>No resource logs recorded by current user.</p>
                <Link to="/add-data" className="text-eco-400 font-bold hover:underline">
                  Click here to log electricity, water, or waste data →
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/60 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Electricity</th>
                      <th className="p-3">Water</th>
                      <th className="p-3">Waste</th>
                      <th className="p-3">Net CO2 Footprint</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {summary.logs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3 font-medium text-slate-200 flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {log.date}
                        </td>
                        <td className="p-3 text-slate-300">{log.electricity_kwh} kWh</td>
                        <td className="p-3 text-slate-300">{log.water_liters} L</td>
                        <td className="p-3 text-slate-300">{log.waste_kg} kg</td>
                        <td className="p-3 font-bold text-emerald-400">{log.total_co2_kg} kg CO2e</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteLog(log.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
