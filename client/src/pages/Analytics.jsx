import React, { useState, useEffect } from 'react';
import { BarChart3, Calendar, Filter, Download, Zap, Droplets, Trash2, CloudRain } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { usageService } from '../services/usageService';

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('30days');

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await usageService.getAnalytics();
      if (res.success) {
        setAnalytics(res);
      }
    } catch (err) {
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const summary = analytics?.summary || {};
  const breakdown = analytics?.breakdown || {};

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
              </div>
              <h1 className="text-2xl font-bold font-display text-white mt-1 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-eco-400" />
                Sustainability Analytics
              </h1>
              <p className="text-xs text-slate-400">Interactive charts and emissions breakdown across electricity, water, waste, and transport.</p>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
              {['7days', '30days', '90days', 'all'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded-lg font-medium capitalize transition-colors ${
                    timeframe === tf ? 'bg-eco-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tf === 'all' ? 'All Time' : tf.replace('days', ' Days')}
                </button>
              ))}
            </div>
          </div>

          {/* Breakdown Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-4 rounded-2xl border border-cyan-500/30 space-y-2">
              <span className="text-xs text-slate-400 flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-cyan-400" /> Total Net CO2
              </span>
              <p className="text-2xl font-bold font-display text-white">{summary.totalCO2 || 0} kg</p>
              <span className="text-[10px] text-slate-400">Net footprint total</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 space-y-2">
              <span className="text-xs text-slate-400 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" /> Electricity Impact
              </span>
              <p className="text-2xl font-bold font-display text-white">{breakdown.electricityEmissions || 0} kg</p>
              <span className="text-[10px] text-amber-400">{summary.totalElectricity || 0} kWh consumed</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-blue-500/30 space-y-2">
              <span className="text-xs text-slate-400 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-400" /> Water Impact
              </span>
              <p className="text-2xl font-bold font-display text-white">{breakdown.waterEmissions || 0} kg</p>
              <span className="text-[10px] text-blue-400">{summary.totalWater || 0} Liters used</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-rose-500/30 space-y-2">
              <span className="text-xs text-slate-400 flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-400" /> Waste Impact
              </span>
              <p className="text-2xl font-bold font-display text-white">{breakdown.wasteEmissions || 0} kg</p>
              <span className="text-[10px] text-rose-400">{summary.totalWaste || 0} kg generated</span>
            </div>
          </div>

          {/* Interactive Recharts visualizer */}
          <AnalyticsCharts chartData={analytics?.chartData} />
        </main>
      </div>

      <Footer />
    </div>
  );
}
