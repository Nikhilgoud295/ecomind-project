import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Bell, Key, Database, Cpu, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [reportFrequency, setReportFrequency] = useState('weekly');
  const [msg, setMsg] = useState('');

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setMsg('System settings saved successfully!');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-slate-100">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6 overflow-hidden">
          {/* Header */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Configuration & Integration
              </span>
            </div>
            <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
              <SettingsIcon className="w-6 h-6 text-eco-400" />
              Platform Settings
            </h1>
            <p className="text-xs text-slate-400">Configure notifications, security credentials, and AI engine parameters.</p>
          </div>

          {msg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{msg}</span>
            </div>
          )}

          {/* System Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  Google Gemini AI SDK Status
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Active / Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">Model: @google/genai (Gemini 1.5 Flash)</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <Database className="w-4 h-4 text-teal-400" />
                  Supabase Database Status
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30">
                  Connected
                </span>
              </div>
              <p className="text-xs text-slate-400">PostgreSQL with Row Level Security (RLS)</p>
            </div>
          </div>

          {/* Preferences Form */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-eco-400" />
              Notification & Audit Preferences
            </h3>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div>
                  <h4 className="text-xs font-semibold text-white">AI Threshold Alerts</h4>
                  <p className="text-[11px] text-slate-400">Receive alert notifications when weekly emissions exceed standard eco benchmarks.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="w-4 h-4 accent-eco-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div>
                  <h4 className="text-xs font-semibold text-white">Automated Audit Compilation</h4>
                  <p className="text-[11px] text-slate-400">Select frequency for automated sustainability report compilation.</p>
                </div>
                <select
                  value={reportFrequency}
                  onChange={(e) => setReportFrequency(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                >
                  <option value="daily">Daily Summary</option>
                  <option value="weekly">Weekly Aggregate</option>
                  <option value="monthly">Monthly ESG Audit</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-eco-600 to-teal-500 text-white font-medium text-xs shadow-glow-eco"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
