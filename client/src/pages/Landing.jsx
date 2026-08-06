import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Sparkles, BarChart3, ShieldCheck, ArrowRight, Zap, Globe, Cpu, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Landing() {
  const quotes = [
    {
      text: "The Earth is what we all have in common. Small daily actions create massive global impact.",
      author: "Wendell Berry",
      role: "Environmental Thinker"
    },
    {
      text: "What you do makes a difference, and you have to decide what kind of difference you want to make.",
      author: "Dr. Jane Goodall",
      role: "UN Messenger of Peace"
    },
    {
      text: "The greatest threat to our planet is the belief that someone else will save it.",
      author: "Robert Swan",
      role: "Polar Explorer & Climate Advocate"
    },
    {
      text: "We do not inherit the Earth from our ancestors; we borrow it from our children.",
      author: "Native American Proverb",
      role: "Indigenous Wisdom"
    }
  ];

  const [activeQuoteIdx, setActiveQuoteIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveQuoteIdx((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [quotes.length]);

  // Sentence split into word blocks
  const headingWords = [
    { text: 'Monitor,', isGradient: false },
    { text: 'Analyze', isGradient: false },
    { text: '&', isGradient: false },
    { text: 'Reduce', isGradient: false },
    { text: 'Your', isGradient: false },
    { text: 'Environmental', isGradient: true },
    { text: 'Footprint', isGradient: true }
  ];

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

            {/* SINGLE LETTER & SPECIAL SEPARATOR CHARACTER ANIMATED HEADING */}
            <h1 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-white leading-tight flex flex-wrap justify-center items-center gap-x-2 gap-y-2 py-3 select-none">
              {headingWords.map((wordObj, wIdx) => (
                <React.Fragment key={`w_block_${wIdx}`}>
                  {/* Single Letter Container */}
                  <span className={`inline-flex ${wordObj.isGradient ? 'gradient-text' : ''}`}>
                    {wordObj.text.split('').map((char, cIdx) => (
                      <span
                        key={`c_${wIdx}_${cIdx}`}
                        className="inline-block transition-all duration-200 transform hover:scale-150 hover:-translate-y-2.5 hover:text-emerald-300 hover:drop-shadow-[0_0_20px_rgba(16,185,129,0.95)] cursor-pointer py-1 px-[1px]"
                      >
                        {char}
                      </span>
                    ))}
                  </span>

                  {/* Special Sparkle Separator Letter Between Words */}
                  {wIdx < headingWords.length - 1 && (
                    <span
                      className="inline-block text-eco-400 text-xs sm:text-sm transition-all duration-300 transform hover:scale-175 hover:rotate-180 hover:text-emerald-300 cursor-pointer drop-shadow-[0_0_12px_rgba(16,185,129,0.9)] px-1"
                      title="EcoMind Sparkle"
                    >
                      ✦
                    </span>
                  )}
                </React.Fragment>
              ))}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              EcoMind AI transforms fragmented electricity, water, waste, and transport metrics into actionable carbon intelligence. Receive instant, personalized AI optimization strategies for a greener tomorrow.
            </p>

            {/* Inspiring Sustainability Quote Card Component */}
            <div className="pt-2">
              <div className="glass-panel max-w-2xl mx-auto p-5 rounded-3xl border border-eco-500/40 bg-slate-900/80 shadow-glow-eco relative overflow-hidden transition-all duration-500">
                <div className="relative z-10 space-y-3">
                  <p className="text-sm sm:text-base font-display italic text-emerald-200 font-medium leading-relaxed">
                    "{quotes[activeQuoteIdx].text}"
                  </p>

                  <div className="flex items-center justify-center gap-2 text-xs">
                    <span className="font-bold text-white">— {quotes[activeQuoteIdx].author}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-eco-500/20 text-eco-400 border border-eco-500/30">
                      {quotes[activeQuoteIdx].role}
                    </span>
                  </div>
                </div>

                {/* Carousel Indicator Dots */}
                <div className="flex items-center justify-center gap-1.5 pt-3">
                  {quotes.map((_, qIdx) => (
                    <button
                      key={qIdx}
                      onClick={() => setActiveQuoteIdx(qIdx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeQuoteIdx === qIdx ? 'w-6 bg-eco-400' : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Micro Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-eco-400" /> GHG Protocol Aligned</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-eco-400" /> Real-time Gemini 1.5 Analysis</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-eco-400" /> Export PDF/CSV Reports</span>
            </div>
          </div>

          {/* Product Dashboard Preview Showcase Card */}
          <div className="mt-14 relative mx-auto max-w-5xl">
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
      <section className="py-20 bg-slate-950/60 border-t border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-eco-400 uppercase tracking-widest">Enterprise Features</span>
            <h2 className="text-3xl font-bold font-display text-white">Comprehensive Sustainability Toolkit</h2>
            <p className="text-sm text-slate-400">Everything you need to quantify impact and achieve carbon neutrality.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4 hover:border-eco-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-eco-500/20 text-eco-400 flex items-center justify-center border border-eco-500/30 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-display">Real-Time Footprint Analytics</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Log resource consumption seamlessly across Scope 1, 2, and 3 emissions categories with instant carbon equivalent calculations.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4 hover:border-teal-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-display">Gemini AI Strategy Advisor</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Receive contextual AI recommendations prioritized by return on investment, carbon reduction potential, and ease of implementation.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4 hover:border-emerald-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-display">Audit-Ready Reporting</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Generate formatted PDF and CSV compliance reports aligned with international GHG Protocol standards for ESG disclosure.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
