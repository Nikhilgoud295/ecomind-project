import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Bot, ShieldCheck, Flame } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import AIRecommendationCards from '../components/AIRecommendationCards';
import { aiService } from '../services/aiService';

export default function AIAdvisor() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reanalyzing, setReanalyzing] = useState(false);

  useEffect(() => {
    fetchLatestAIReport();
  }, []);

  const fetchLatestAIReport = async () => {
    try {
      setLoading(true);
      const res = await aiService.getLatestReport();
      if (res.success) {
        setReport(res.report);
      }
    } catch (err) {
      console.error('Error fetching AI report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReanalyze = async () => {
    try {
      setReanalyzing(true);
      const res = await aiService.analyzeSustainability({
        electricity_kwh: 18.5,
        water_liters: 140,
        waste_kg: 3.2,
        fuel_liters: 2.0,
        public_transport_km: 12.0,
        renewable_energy_pct: 35,
        recycling_pct: 50,
      });

      if (res.success) {
        setReport(res.analysis);
      }
    } catch (err) {
      console.error('Error triggering re-analysis:', err);
    } finally {
      setReanalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-slate-100">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6 overflow-hidden">
          {/* Header */}
          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5" /> Google Gemini 1.5 Integration
                </span>
              </div>
              <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-eco-400" />
                AI Sustainability Advisor
              </h1>
              <p className="text-xs text-slate-300">
                Personalized AI optimization strategies, carbon reduction plans, energy efficiency tips, and priority action lists.
              </p>
            </div>

            <button
              onClick={handleReanalyze}
              disabled={reanalyzing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-eco-600 to-teal-500 hover:from-eco-500 hover:to-teal-400 text-white font-medium text-xs shadow-glow-eco flex items-center gap-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${reanalyzing ? 'animate-spin' : ''}`} />
              {reanalyzing ? 'Consulting Gemini...' : 'Re-Run AI Analysis'}
            </button>
          </div>

          {/* AI Recommendation Component */}
          {loading ? (
            <div className="glass-panel p-12 rounded-3xl text-center space-y-3">
              <Sparkles className="w-8 h-8 text-eco-400 mx-auto animate-spin" />
              <p className="text-xs text-slate-400">Loading your Gemini AI sustainability report...</p>
            </div>
          ) : (
            <AIRecommendationCards report={report} />
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
