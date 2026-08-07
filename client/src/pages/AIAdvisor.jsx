import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Bot, ShieldCheck, Flame, CloudRain, FileUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import AIRecommendationCards from '../components/AIRecommendationCards';
import { aiService } from '../services/aiService';
import { auditStore } from '../services/auditStore';

export default function AIAdvisor() {
  const [summary, setSummary] = useState(() => auditStore.getSummary());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reanalyzing, setReanalyzing] = useState(false);

  useEffect(() => {
    fetchLatestAIReport();
  }, []);

  const fetchLatestAIReport = async () => {
    setLoading(true);
    const userSummary = auditStore.getSummary();
    setSummary(userSummary);

    if (userSummary.hasData && userSummary.logs.length > 0) {
      const latestLog = userSummary.logs[0];
      try {
        const res = await aiService.analyzeSustainability(latestLog);
        if (res.success) {
          setReport(res.analysis);
        }
      } catch (err) {
        console.warn('AI analysis fallback:', err);
      }
    }
    setLoading(false);
  };

  const handleReanalyze = async () => {
    setReanalyzing(true);
    const userSummary = auditStore.getSummary();
    setSummary(userSummary);

    if (userSummary.hasData && userSummary.logs.length > 0) {
      const latestLog = userSummary.logs[0];
      try {
        const res = await aiService.analyzeSustainability(latestLog);
        if (res.success) {
          setReport(res.analysis);
        }
      } catch (err) {
        console.warn('AI analysis re-analyze error:', err);
      }
    }
    setReanalyzing(false);
  };

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
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-eco-500/20 text-eco-400 border border-eco-500/30 flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5" /> Powered by Gemini 1.5 AI Flash
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {summary.hasData ? `Analyzing User Log #${summary.logs[0]?.id || ''}` : 'Awaiting Audit Data'}
                </span>
              </div>
              <h1 className="text-2xl font-bold font-display text-white mt-1 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-emerald-400" />
                Gemini AI Sustainability Advisor
              </h1>
              <p className="text-xs text-slate-400">
                Actionable reduction recommendations generated strictly from your user-entered audit metrics.
              </p>
            </div>

            <button
              onClick={handleReanalyze}
              disabled={reanalyzing || !summary.hasData}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-eco-600 to-teal-500 hover:from-eco-500 hover:to-teal-400 text-white font-medium text-xs shadow-glow-eco flex items-center gap-2 transition-all disabled:opacity-40 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${reanalyzing ? 'animate-spin' : ''}`} />
              Re-Analyze User Log
            </button>
          </div>

          {/* Prompt if no user data logged yet */}
          {!summary.hasData && (
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-3 shadow-2xl">
              <CloudRain className="w-10 h-10 text-slate-500 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold font-display text-white">No Carbon Audit Data Available for AI Analysis</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Gemini AI needs your resource consumption figures to calculate tailored emission reduction strategies.
                </p>
              </div>
              <Link
                to="/add-data"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-eco-600 hover:bg-eco-500 text-white font-bold text-xs shadow-glow-eco transition-all"
              >
                <FileUp className="w-4 h-4" /> Log Resource Data Now
              </Link>
            </div>
          )}

          {/* Report Display */}
          {summary.hasData && report && (
            <div className="animate-fade-in space-y-6">
              <AIRecommendationCards analysis={report} />
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
