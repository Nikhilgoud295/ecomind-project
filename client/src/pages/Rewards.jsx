import React, { useState } from 'react';
import { Award, Trophy, Star, ShieldCheck, Download, Sparkles, CheckCircle2, Zap, Droplets, Leaf, Flame, TreePine, Gift, ChevronRight, Share2, Medal, Printer, Lock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { authService } from '../services/authService';

export default function Rewards() {
  const currentUser = authService.getCurrentUser();
  const userName = currentUser?.name || 'Nikhil Goud';
  
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [claimedReward, setClaimedReward] = useState('');

  // Performance Appreciation Metrics & Badges (Realistic New User Starting XP)
  const ecoPoints = 120;
  const currentLevel = 1;
  const nextLevelXP = 500;
  const currentXP = 120;
  const levelTitle = "Eco Starter Pioneer";

  // STRICT CERTIFICATE UNLOCK XP LIMIT
  const minCertificateXP = 500;
  const isCertificateUnlocked = currentXP >= minCertificateXP;

  const badges = [
    {
      id: 'badge_1',
      title: 'Welcome Eco Pioneer',
      category: 'Onboarding',
      desc: 'Completed initial account enrolment & sustainability profile setup.',
      unlocked: true,
      date: 'Earned upon registration',
      color: 'from-emerald-600 to-teal-500',
      icon: Leaf,
      points: '+50 Eco-Points'
    },
    {
      id: 'badge_2',
      title: 'First Data Logged',
      category: 'Tracking',
      desc: 'Logged initial electricity or water consumption audit entry.',
      unlocked: true,
      date: 'Earned today',
      color: 'from-amber-500 to-emerald-500',
      icon: Zap,
      points: '+70 Eco-Points'
    },
    {
      id: 'badge_3',
      title: 'Carbon Reduction Champion',
      category: 'Emissions',
      desc: 'Achieve >5% reduction in weekly carbon footprint.',
      unlocked: false,
      date: 'Unlock at 250 XP',
      color: 'from-slate-700 to-slate-800',
      icon: Trophy,
      points: '+100 Eco-Points'
    },
    {
      id: 'badge_4',
      title: 'Hydro Conservation Guardian',
      category: 'Water',
      desc: 'Retrofit tap aerators or log water-saving practices.',
      unlocked: false,
      date: 'Unlock at 350 XP',
      color: 'from-slate-700 to-slate-800',
      icon: Droplets,
      points: '+120 Eco-Points'
    },
    {
      id: 'badge_5',
      title: 'BRSR ESG Filing Master',
      category: 'Compliance',
      desc: 'Complete statutory ESG disclosure audit readiness.',
      unlocked: false,
      date: 'Unlock at 500 XP',
      color: 'from-slate-700 to-slate-800',
      icon: ShieldCheck,
      points: '+150 Eco-Points'
    },
    {
      id: 'badge_6',
      title: 'Zero-Waste Innovator',
      category: 'Waste',
      desc: 'Divert >45% organic and e-waste from landfills.',
      unlocked: false,
      date: 'Unlock at 750 XP',
      color: 'from-slate-700 to-slate-800',
      icon: TreePine,
      points: '+200 Eco-Points'
    }
  ];

  const rewardStore = [
    {
      id: 'r_1',
      title: 'Plant 1 Real Tree (Geo-Tagged)',
      desc: 'Partnered with Global Reforestation Alliance. Geo-coordinates included.',
      cost: 100,
      icon: TreePine,
      tag: 'Environmental Impact'
    },
    {
      id: 'r_2',
      title: 'Official Eco Profile Badge',
      desc: 'Verified EcoMind AI sustainability badge for email & LinkedIn profile.',
      cost: 150,
      icon: Award,
      tag: 'Profile Recognition'
    },
    {
      id: 'r_3',
      title: 'Certified Carbon Offset Token (10kg)',
      desc: 'Retire 10kg CO2e via Gold Standard verified renewable credits.',
      cost: 200,
      icon: Zap,
      tag: 'Verified Certificate'
    }
  ];

  const handleRedeem = (title, cost) => {
    if (ecoPoints >= cost) {
      setClaimedReward(`🎉 Successfully redeemed "${title}"! Check your profile for claim details.`);
      setTimeout(() => setClaimedReward(''), 6000);
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-slate-100 selection:bg-eco-500 selection:text-white">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6 overflow-hidden">
          {/* Header Banner: Starter Level & Performance Appreciation */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-eco-500/40 bg-gradient-to-r from-slate-900 via-dark-bg to-slate-900 shadow-glow-eco relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-eco-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                  <Trophy className="w-4 h-4 text-emerald-300" />
                  <span>Performance Appreciation Core</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                  Welcome, <span className="gradient-text">{userName}</span>!
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  Start your sustainability journey as an <strong>{levelTitle}</strong>. Log data and reduce emissions to earn XP, unlock certificates, and level up!
                </p>

                {/* Level XP Progress Bar */}
                <div className="space-y-1.5 pt-2 max-w-md">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">Level {currentLevel} ({levelTitle})</span>
                    <span className="text-emerald-400 font-mono">{currentXP} / {nextLevelXP} XP</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800 p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-eco-500 via-emerald-400 to-teal-300 shadow-glow-eco transition-all duration-1000"
                      style={{ width: `${(currentXP / nextLevelXP) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Eco Points Counter Card with STRICT XP UNLOCK LIMIT */}
              <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-950/80 border border-eco-500/40 text-center min-w-[220px] shadow-2xl space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-eco-500 to-teal-400 p-0.5 flex items-center justify-center shadow-glow-eco">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Star className="w-6 h-6 text-emerald-400 fill-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Starting Eco-Points</span>
                  <span className="text-3xl font-extrabold text-white font-mono">{ecoPoints}</span>
                </div>

                {/* CERTIFICATE BUTTON WITH STRICT XP LIMIT ENFORCEMENT */}
                {isCertificateUnlocked ? (
                  <button
                    onClick={() => setShowCertificateModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-eco-600 hover:bg-eco-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-glow-eco transition-all transform hover:scale-105"
                  >
                    <Award className="w-4 h-4" /> Download Certificate
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setClaimedReward(`🔒 Certificate Locked: Requires 500 XP to unlock your official Certificate of Sustainability Appreciation (Current: ${currentXP}/500 XP). Log emission reduction data to earn ${minCertificateXP - currentXP} more XP!`);
                      setTimeout(() => setClaimedReward(''), 7000);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-800 hover:border-amber-500/50 font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    title="Unlocks at 500 XP (Level 2)"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>Certificate Unlocks at 500 XP</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {claimedReward && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-3 animate-fade-in">
              <Lock className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <span className="leading-snug">{claimedReward}</span>
            </div>
          )}

          {/* Performance Appreciation Badges Showcase Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
                  <Medal className="w-5 h-5 text-eco-400" /> Performance Badges & Trophies
                </h3>
                <p className="text-xs text-slate-400">Awarded automatically based on your real-time carbon reduction milestones</p>
              </div>
              <span className="text-xs font-bold text-emerald-400 font-mono px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                2 of 6 Unlocked
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.map((b) => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.id}
                    className={`glass-panel p-5 rounded-3xl border transition-all duration-300 space-y-3 relative overflow-hidden group ${
                      b.unlocked
                        ? 'border-slate-800 hover:border-eco-500/50 bg-slate-900/80 hover:bg-slate-900'
                        : 'border-slate-800/40 bg-slate-950/40 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${b.color} p-0.5 shadow-md flex items-center justify-center`}>
                        <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                          <Icon className={`w-6 h-6 ${b.unlocked ? 'text-emerald-300' : 'text-slate-600'}`} />
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border font-mono ${
                        b.unlocked
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}>
                        {b.points}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-eco-400 font-semibold uppercase tracking-wider block">{b.category}</span>
                      <h4 className="text-base font-bold text-white font-display group-hover:text-emerald-300 transition-colors">
                        {b.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{b.desc}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-mono">{b.date}</span>
                      {b.unlocked ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                        </span>
                      ) : (
                        <span className="text-slate-500 font-bold flex items-center gap-1">
                          <Lock className="w-3 h-3 text-slate-500" /> Locked
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Redeem Eco-Rewards Store */}
          <div className="space-y-4 pt-4">
            <div>
              <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
                <Gift className="w-5 h-5 text-eco-400" /> Redeem Sustainability Rewards
              </h3>
              <p className="text-xs text-slate-400">Use your accumulated Eco-Points to claim real-world environmental impact rewards</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {rewardStore.map((r) => {
                const Icon = r.icon;
                return (
                  <div key={r.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-eco-500/40 transition-all flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-eco-500/20 text-eco-400 border border-eco-500/30 flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {r.tag}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white font-display">{r.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{r.desc}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-sm font-extrabold text-emerald-400 font-mono">{r.cost} Points</span>
                      <button
                        onClick={() => handleRedeem(r.title, r.cost)}
                        disabled={ecoPoints < r.cost}
                        className="px-3.5 py-1.5 rounded-xl bg-eco-600 hover:bg-eco-500 text-white font-bold text-xs shadow-glow-eco transition-all disabled:opacity-40"
                      >
                        Redeem Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* Official Certificate of Appreciation Printable Modal */}
      {showCertificateModal && isCertificateUnlocked && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-3xl w-full p-8 rounded-3xl border border-eco-500/50 bg-slate-900 shadow-2xl space-y-6 relative animate-fade-in max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white text-xl font-bold p-2"
            >
              ✕
            </button>

            {/* Certificate Canvas Frame */}
            <div id="printable-certificate" className="p-8 rounded-2xl bg-slate-950 border-4 border-eco-500/40 text-center space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Leaf className="w-6 h-6 text-eco-400" />
                  <span className="text-lg font-bold font-display text-white">EcoMind AI</span>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold border border-emerald-500/30 px-3 py-1 rounded-full bg-emerald-500/10">
                  Ref: CERT-2026-ECO-500
                </span>
              </div>

              <div className="space-y-3 py-4">
                <span className="text-xs font-mono font-bold text-eco-400 uppercase tracking-widest block">
                  Official Certificate of Environmental Appreciation
                </span>
                <h2 className="text-3xl font-extrabold font-display text-white">PROUDLY PRESENTED TO</h2>
                <h3 className="text-4xl font-extrabold gradient-text font-display underline decoration-eco-400 underline-offset-8 py-2">
                  {userName}
                </h3>
                <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed pt-2">
                  In recognition of achieving Level 2 Sustainability Status, reducing net carbon emissions, and demonstrating statutory ESG compliance.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">Date of Issue</span>
                  <span className="text-white font-bold">{new Date().toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Sustainability Status</span>
                  <span className="text-emerald-400 font-bold">Level 2 Champion</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Issuing Body</span>
                  <span className="text-white font-bold">EcoMind AI ESG Committee</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handlePrintCertificate}
                className="px-5 py-2.5 rounded-xl bg-eco-600 hover:bg-eco-500 text-white font-bold text-xs shadow-glow-eco flex items-center gap-2 transition-all"
              >
                <Printer className="w-4 h-4" /> Print / Save PDF Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
