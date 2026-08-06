import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, FileUp, Sparkles, FileText, ArrowRight, Clock, Trash2, Calendar, Zap, Droplets, Leaf } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import DashboardCards from '../components/DashboardCards';
import AnalyticsCharts from '../components/AnalyticsCharts';
import ProgressTracker from '../components/ProgressTracker';
import EcoGlobe3D from '../components/EcoGlobe3D';
import { usageService } from '../services/usageService';
import { authService } from '../services/authService';

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, usageRes] = await Promise.all([
        usageService.getAnalytics(),
        usageService.getUsage({ limit: 5 }),
      ]);

      if (analyticsRes.success) setAnalytics(analyticsRes);
      if (usageRes.success) setRecentLogs(usageRes.usage || []);
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLog = async (id) => {
    try {
      await usageService.deleteUsage(id);
      fetchDashboardData();
    } catch (err) {
      console.error('Error deleting log:', err);
    }
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
                  {currentUser?.organization || 'Individual Eco Track'}
                </span>
                <span className="text-xs text-slate-400">Live Carbon Ledger</span>
              </div>
              <h1 className="text-2xl font-bold font-display text-white">
                Welcome Back, {currentUser?.name || 'Sustainability Officer'} 👋
              </h1>
              <p className="text-xs text-slate-300">
                Your real-time sustainability metrics and Gemini AI advisory reports are updated.
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

          {/* Metric Dashboard Cards */}
          <DashboardCards summary={analytics?.summary} />

          {/* Interactive 3D WebGL Eco Globe Command Center */}
          <EcoGlobe3D title="3D Global Sustainability & Resource Command Globe" />

          {/* Charts & Target Progress Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AnalyticsCharts chartData={analytics?.chartData} />
            </div>
            <div>
              <ProgressTracker summary={analytics?.summary} />
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

            {recentLogs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No resource usage recorded yet. Click 'Record Resource Data' to add your first log.</div>
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
                    {recentLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3 font-medium text-slate-200 flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {log.date}
                        </td>
                        <td className="p-3 text-slate-300">{log.electricity_kwh} kWh</td>
                        <td className="p-3 text-slate-300">{log.water_liters} L</td>
                        <td className="p-3 text-slate-300">{log.waste_kg} kg</td>
                        <td className="p-3 font-bold text-emerald-400">{log.calculated_co2_kg} kg CO2e</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteLog(log.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
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
