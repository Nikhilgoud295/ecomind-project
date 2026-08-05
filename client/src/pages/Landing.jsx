import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Sparkles, BarChart3, ShieldCheck, ArrowRight, Zap, Globe, Cpu, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-slate-100 selection:bg-eco-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        {/* Background Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-eco-600/20 via-teal-500/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-eco-500/30 text-xs font-semibold text-eco-400">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Next-Gen Sustainability Intelligence Powered by Google Gemini</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-white leading-tight">
              Monitor, Analyze & Reduce Your <span className="gradient-text">Environmental Footprint</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              EcoMind AI transforms fragmented electricity, water, waste, and transport metrics into actionable carbon intelligence. Receive instant, personalized AI optimization strategies for a greener tomorrow.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-eco-600 via-emerald-500 to-teal-500 hover:from-eco-500 hover:to-teal-400 text-white font-semibold shadow-glow-eco transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-base"
              >
                Start Free Audit
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl glass-panel border border-slate-700/80 text-slate-200 hover:text-white hover:border-slate-500 font-semibold transition-all flex items-center justify-center gap-2 text-base"
              >
                Explore Live Demo
              </Link>
            </div>

            {/* Micro Badges */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-eco-400" /> GHG Protocol Aligned</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-eco-400" /> Real-time Gemini 1.5 Analysis</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-eco-400" /> Export PDF/CSV Reports</span>
            </div>
          </div>

          {/* Product Dashboard Preview Showcase Card */}
          <div className="mt-16 relative mx-auto max-w-5xl">
            <div className="glass-panel p-2 sm:p-4 rounded-3xl border border-slate-700/60 shadow-2xl bg-slate-900/90">
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-dark-bg p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-xs font-mono text-slate-500 ml-2">https://app.ecomind.ai/dashboard</span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Live Score: 88/100
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400">Net CO2 Emissions</span>
                    <p className="text-xl font-bold text-white mt-1">75.8 kg CO2e</p>
                    <span className="text-[10px] text-emerald-400">-8.5% this week</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400">Electricity</span>
                    <p className="text-xl font-bold text-white mt-1">81.7 kWh</p>
                    <span className="text-[10px] text-amber-400">Grid power</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400">Water Consumption</span>
                    <p className="text-xl font-bold text-white mt-1">615 Liters</p>
                    <span className="text-[10px] text-blue-400">Clean supply</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400">Renewable Energy</span>
                    <p className="text-xl font-bold text-white mt-1">34% Share</p>
                    <span className="text-[10px] text-teal-400">Solar + Wind</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-20 border-t border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold font-display text-white">All-in-One Sustainability Operating System</h2>
            <p className="text-sm text-slate-400">Built specifically for organizations and households aiming for net-zero carbon goals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-eco-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-white">Multi-Resource Tracking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Effortlessly log electricity (kWh), water (liters), solid waste (kg), fuel usage, public transit km, renewable energy, and recycling rates.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-eco-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-white">Google Gemini AI Advisor</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Leverage @google/genai SDK to analyze submitted consumption metrics and receive structured JSON advisory plans, priority items, and reduction strategies.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-eco-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-white">Exportable PDF & CSV Reports</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate daily, weekly, and monthly audit reports with one click. Download client-side formatted PDF documents and CSV spreadsheets for compliance.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
