import React, { useState, useEffect } from 'react';
import { Award, Trophy, Star, ShieldCheck, Download, Sparkles, CheckCircle2, Zap, Droplets, Leaf, Flame, TreePine, Gift, ChevronRight, Share2, Medal, Printer, Lock, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { authService } from '../services/authService';
import { auditStore } from '../services/auditStore';

export default function Rewards() {
  const currentUser = authService.getCurrentUser();
  const userName = currentUser?.name || 'User';
  const userEmail = currentUser?.email ? currentUser.email.toLowerCase().trim() : 'default';

  // Per-User Storage Keys
  const pointsKey = `ecomind_user_points_${userEmail}`;
  const claimedBadgesKey = `ecomind_claimed_badges_${userEmail}`;
  const claimedRewardsKey = `ecomind_claimed_rewards_${userEmail}`;

  // User Points & Claimed States (Starts 100% Unclaimed for New Accounts)
  const [userPoints, setUserPoints] = useState(() => {
    const saved = localStorage.getItem(pointsKey);
    return saved !== null ? parseInt(saved, 10) : 120;
  });

  const [claimedBadges, setClaimedBadges] = useState(() => {
    try {
      const saved = localStorage.getItem(claimedBadgesKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [claimedRewards, setClaimedRewards] = useState(() => {
    try {
      const saved = localStorage.getItem(claimedRewardsKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [celebrationMsg, setCelebrationMsg] = useState('');

  // Celebration Animation States
  const [isLeafAnimating, setIsLeafAnimating] = useState(false); // Phase 1: Big Leaf Screen Cover (1 sec)
  const [isDJAnimating, setIsDJAnimating] = useState(false);     // Phase 2: 5 Horizontal DJ Lights (5 sec)

  // Sync points with local storage and dispatch events for Navbar points badge
  useEffect(() => {
    localStorage.setItem(pointsKey, userPoints.toString());
    localStorage.setItem(claimedBadgesKey, JSON.stringify(claimedBadges));
    localStorage.setItem(claimedRewardsKey, JSON.stringify(claimedRewards));
    window.dispatchEvent(new Event('ecomind_points_updated'));
    window.dispatchEvent(new Event('storage'));
  }, [userPoints, claimedBadges, claimedRewards, pointsKey, claimedBadgesKey, claimedRewardsKey]);

  // Check user audit count for badge unlocks
  const userAuditSummary = auditStore.getSummary();
  const hasLoggedData = userAuditSummary.hasData && userAuditSummary.recordCount > 0;

  // Level & XP Metrics
  const currentLevel = 1;
  const nextLevelXP = 500;
  const currentXP = 120 + (claimedBadges.length * 50);
  const levelTitle = "Eco Starter Pioneer";

  // Strict Certificate Unlock (500 XP)
  const minCertificateXP = 500;
  const isCertificateUnlocked = currentXP >= minCertificateXP;

  // Badges Definitions (No hardcoded pre-claimed state for new users!)
  const badgeDefinitions = [
    {
      id: 'badge_1',
      title: 'Welcome Eco Pioneer',
      category: 'Onboarding',
      desc: 'Completed initial account enrolment & sustainability profile setup.',
      unlocked: true,
      pointsReward: 50,
      color: 'from-emerald-600 to-teal-500',
      icon: Leaf,
      badgePointsText: '+50 Eco-Points'
    },
    {
      id: 'badge_2',
      title: 'First Data Logged',
      category: 'Tracking',
      desc: 'Logged initial electricity, water, or waste consumption audit entry.',
      unlocked: hasLoggedData || claimedBadges.includes('badge_2'),
      pointsReward: 70,
      color: 'from-amber-500 to-emerald-500',
      icon: Zap,
      badgePointsText: '+70 Eco-Points'
    },
    {
      id: 'badge_3',
      title: 'Carbon Reduction Champion',
      category: 'Emissions',
      desc: 'Achieve >5% reduction in weekly carbon footprint.',
      unlocked: currentXP >= 250,
      pointsReward: 100,
      color: 'from-slate-700 to-slate-800',
      icon: Trophy,
      badgePointsText: '+100 Eco-Points'
    },
    {
      id: 'badge_4',
      title: 'Hydro Conservation Guardian',
      category: 'Water',
      desc: 'Retrofit tap aerators or log water-saving practices.',
      unlocked: currentXP >= 350,
      pointsReward: 120,
      color: 'from-slate-700 to-slate-800',
      icon: Droplets,
      badgePointsText: '+120 Eco-Points'
    },
    {
      id: 'badge_5',
      title: 'BRSR ESG Filing Master',
      category: 'Compliance',
      desc: 'Complete statutory ESG disclosure audit readiness.',
      unlocked: currentXP >= 500,
      pointsReward: 150,
      color: 'from-slate-700 to-slate-800',
      icon: ShieldCheck,
      badgePointsText: '+150 Eco-Points'
    },
    {
      id: 'badge_6',
      title: 'Zero-Waste Innovator',
      category: 'Waste',
      desc: 'Divert >45% organic and e-waste from landfills.',
      unlocked: currentXP >= 750,
      pointsReward: 200,
      color: 'from-slate-700 to-slate-800',
      icon: TreePine,
      badgePointsText: '+200 Eco-Points'
    }
  ];

  // Rewards Store Definitions
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

  // Trigger Master Celebration Sequence: 1 Sec Big Leaf Screen Cover -> 5 Sec 5-DJ-Spotlight Laser Lights
  const triggerCelebrationAnimation = (message) => {
    setCelebrationMsg(message);

    // Phase 1: 1 Second Big Leaf Screen Cover
    setIsLeafAnimating(true);
    setIsDJAnimating(false);

    setTimeout(() => {
      // End Leaf Cover & Start Phase 2: 5 Seconds 5-DJ-Spotlight Laser Lights
      setIsLeafAnimating(false);
      setIsDJAnimating(true);

      setTimeout(() => {
        // End DJ Laser Lights Celebration after 5 seconds
        setIsDJAnimating(false);
      }, 5000);
    }, 1000);
  };

  // Claim Performance Badge Handler
  const handleClaimBadge = (badge) => {
    if (claimedBadges.includes(badge.id)) return;

    const newClaimed = [...claimedBadges, badge.id];
    setClaimedBadges(newClaimed);
    setUserPoints(prev => prev + badge.pointsReward);

    triggerCelebrationAnimation(`🎉 BADGE UNLOCKED! Claimed "${badge.title}" (+${badge.pointsReward} Eco-Points added to your balance!)`);
  };

  // Redeem Reward Store Handler
  const handleRedeemReward = (reward) => {
    if (claimedRewards.includes(reward.id)) {
      setCelebrationMsg(`ℹ️ You have already claimed "${reward.title}"!`);
      return;
    }

    if (userPoints < reward.cost) {
      setCelebrationMsg(`🔒 Insufficient Eco-Points! "${reward.title}" requires ${reward.cost} points (Current: ${userPoints} pts). Log more audit data to earn points!`);
      return;
    }

    // Deduct cost and mark claimed
    setUserPoints(prev => prev - reward.cost);
    setClaimedRewards(prev => [...prev, reward.id]);

    triggerCelebrationAnimation(`🎁 REWARD REDEEMED! Successfully claimed "${reward.title}" (-${reward.cost} Eco-Points deducted). Check your profile for claim details!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-slate-100 selection:bg-eco-500 selection:text-white relative">
      <Navbar />

      {/* ========================================================================= */}
      {/* 🌿 PHASE 1: BIG LEAF FULL-SCREEN COVER OVERLAY (1 SECOND) */}
      {/* ========================================================================= */}
      {isLeafAnimating && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-2xl transition-all duration-500 overflow-hidden pointer-events-auto">
          <div className="animate-big-leaf flex flex-col items-center justify-center space-y-4">
            <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-eco-600 via-emerald-400 to-teal-300 p-2 shadow-2xl flex items-center justify-center shadow-glow-eco">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center p-6 border-4 border-eco-500/50">
                <Leaf className="w-32 h-32 sm:w-40 sm:h-40 text-emerald-400 fill-emerald-400/20 animate-pulse" />
              </div>
            </div>

            <div className="text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Verifying Eco Impact</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                🌿 CLAIMING SUSTAINABILITY REWARD...
              </h2>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🎆 PHASE 2: 5 HORIZONTAL TOP DJ SPOTLIGHTS & LASERS (5 SECONDS DURATION) */}
      {/* ========================================================================= */}
      {isDJAnimating && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden flex flex-col items-center justify-start pt-12">
          {/* DJ Strobe Flash Overlay Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/50 via-purple-950/40 to-slate-950/60 animate-dj-flash" />

          {/* 5 HORIZONTAL DJ CONCERT SPOTLIGHT BEAMS RADIATING FROM TOP HEADER */}
          <div className="absolute top-0 w-full h-[120vh] overflow-hidden">
            {/* Beam 1: Rose Pink (Left 10%) */}
            <div className="absolute top-0 left-[10%] w-8 sm:w-16 h-[120vh] bg-gradient-to-b from-rose-500 via-rose-500/30 to-transparent blur-md origin-top animate-laser-red" />
            
            {/* Beam 2: Emerald Green (Left 30%) */}
            <div className="absolute top-0 left-[30%] w-10 sm:w-20 h-[120vh] bg-gradient-to-b from-emerald-400 via-emerald-400/30 to-transparent blur-md origin-top animate-laser-green" />
            
            {/* Beam 3: Electric Cyan (Center 50%) */}
            <div className="absolute top-0 left-[50%] w-12 sm:w-24 h-[120vh] bg-gradient-to-b from-cyan-400 via-cyan-400/30 to-transparent blur-md origin-top animate-laser-blue" />
            
            {/* Beam 4: Amber Gold (Left 70%) */}
            <div className="absolute top-0 left-[70%] w-10 sm:w-20 h-[120vh] bg-gradient-to-b from-amber-400 via-amber-400/30 to-transparent blur-md origin-top animate-laser-yellow" />
            
            {/* Beam 5: Deep Purple (Left 90%) */}
            <div className="absolute top-0 left-[90%] w-8 sm:w-16 h-[120vh] bg-gradient-to-b from-purple-500 via-purple-500/30 to-transparent blur-md origin-top animate-laser-red" />
          </div>

          {/* 5 HORIZONTAL TOP SPOTLIGHT FIXTURE BULBS MOUNTED AT THE TOP OF WEBSITE */}
          <div className="absolute top-0 w-full flex justify-between px-6 sm:px-16 z-20">
            {/* Spotlight 1 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-4 bg-slate-900 border-b-2 border-slate-700 rounded-b-lg shadow-lg"></div>
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-rose-500 shadow-[0_0_50px_#f43f5e] animate-pulse border-2 border-white/40"></div>
            </div>

            {/* Spotlight 2 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-4 bg-slate-900 border-b-2 border-slate-700 rounded-b-lg shadow-lg"></div>
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-emerald-400 shadow-[0_0_50px_#10b981] animate-pulse border-2 border-white/40"></div>
            </div>

            {/* Spotlight 3 (Center) */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-5 bg-slate-900 border-b-2 border-slate-700 rounded-b-lg shadow-lg"></div>
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-cyan-400 shadow-[0_0_60px_#06b6d4] animate-pulse border-2 border-white/50"></div>
            </div>

            {/* Spotlight 4 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-4 bg-slate-900 border-b-2 border-slate-700 rounded-b-lg shadow-lg"></div>
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-amber-400 shadow-[0_0_50px_#f59e0b] animate-pulse border-2 border-white/40"></div>
            </div>

            {/* Spotlight 5 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-4 bg-slate-900 border-b-2 border-slate-700 rounded-b-lg shadow-lg"></div>
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-purple-500 shadow-[0_0_50px_#a855f7] animate-pulse border-2 border-white/40"></div>
            </div>
          </div>

          {/* Celebration Banner Card */}
          <div className="relative z-50 mt-20 p-6 sm:p-8 rounded-3xl bg-slate-950/95 border-2 border-emerald-500/80 text-center space-y-3 shadow-2xl max-w-lg mx-4 animate-bounce">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold border border-emerald-500/40">
              <Sparkles className="w-4 h-4 text-emerald-400" /> 5-SECOND DJ CELEBRATION ACTIVE!
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              🎉 REWARD CLAIMED SUCCESSFULLY!
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 font-semibold">{celebrationMsg}</p>
          </div>
        </div>
      )}

      {/* Main Page Layout */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6 overflow-hidden">
          {/* Header Banner */}
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

              {/* Eco Points Counter Card */}
              <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-950/80 border border-eco-500/40 text-center min-w-[220px] shadow-2xl space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-eco-500 to-teal-400 p-0.5 flex items-center justify-center shadow-glow-eco">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Star className="w-6 h-6 text-emerald-400 fill-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Available Eco-Points</span>
                  <span className="text-3xl font-extrabold text-white font-mono">{userPoints}</span>
                </div>

                {/* CERTIFICATE BUTTON WITH STRICT XP LIMIT ENFORCEMENT */}
                {isCertificateUnlocked ? (
                  <button
                    onClick={() => setShowCertificateModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-eco-600 hover:bg-eco-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-glow-eco transition-all transform hover:scale-105 cursor-pointer"
                  >
                    <Award className="w-4 h-4" /> Download Certificate
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setCelebrationMsg(`🔒 Certificate Locked: Requires 500 XP to unlock your official Certificate of Sustainability Appreciation (Current: ${currentXP}/500 XP). Log emission reduction data to earn ${minCertificateXP - currentXP} more XP!`);
                      setTimeout(() => setCelebrationMsg(''), 7000);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-800 hover:border-amber-500/50 font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-400" /> Certificate Locked (500 XP)
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Status Message Alert */}
          {celebrationMsg && !isDJAnimating && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2.5 shadow-lg animate-fade-in">
              <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{celebrationMsg}</span>
            </div>
          )}

          {/* Performance Badges Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <Medal className="w-5 h-5 text-eco-400" />
                Performance Appreciation Badges ({claimedBadges.length} / {badgeDefinitions.length} Earned)
              </h2>
              <span className="text-xs text-slate-400 font-mono">Claim points upon unlocking</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {badgeDefinitions.map((b) => {
                const Icon = b.icon;
                const isClaimed = claimedBadges.includes(b.id);
                const canClaim = b.unlocked && !isClaimed;

                return (
                  <div
                    key={b.id}
                    className={`glass-panel p-5 rounded-3xl border transition-all duration-300 relative space-y-3 ${
                      isClaimed
                        ? 'border-emerald-500/40 bg-gradient-to-br from-emerald-950/30 to-slate-900 shadow-glow-eco'
                        : canClaim
                        ? 'border-amber-500/50 bg-gradient-to-br from-amber-950/20 to-slate-900 hover:scale-[1.02]'
                        : 'border-slate-800/80 bg-slate-950/40 opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-2xl bg-gradient-to-tr ${b.color} text-white shadow-lg`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                        {b.category}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-white font-display flex items-center gap-1.5">
                        {b.title}
                        {isClaimed && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-800/60 text-xs">
                      <span className="text-emerald-400 font-bold font-mono">{b.badgePointsText}</span>

                      {isClaimed ? (
                        <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-[11px] border border-emerald-500/40 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Claimed
                        </span>
                      ) : canClaim ? (
                        <button
                          type="button"
                          onClick={() => handleClaimBadge(b)}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-eco-600 to-teal-500 hover:from-eco-500 hover:to-teal-400 text-white font-bold text-[11px] shadow-glow-eco flex items-center gap-1 transition-all transform hover:scale-105 cursor-pointer"
                        >
                          <Gift className="w-3.5 h-3.5" /> Claim Reward
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Locked
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Redeem Sustainability Rewards Store */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div>
              <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
                <Gift className="w-6 h-6 text-eco-400" />
                Redeem Sustainability Rewards
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Use your accumulated Eco-Points to claim real-world environmental impact rewards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rewardStore.map((r) => {
                const Icon = r.icon;
                const isRedeemed = claimedRewards.includes(r.id);
                const hasEnoughPoints = userPoints >= r.cost;

                return (
                  <div
                    key={r.id}
                    className={`p-6 rounded-3xl border transition-all duration-300 space-y-4 relative flex flex-col justify-between ${
                      isRedeemed
                        ? 'border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 to-slate-900 shadow-glow-eco'
                        : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-eco-500/40'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="p-3 rounded-2xl bg-eco-500/20 text-eco-400 border border-eco-500/30">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-950 text-slate-400 border border-slate-800">
                          {r.tag}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-white font-display">{r.title}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">{r.desc}</p>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-slate-800/80">
                      <span className="text-base font-extrabold text-emerald-400 font-mono">{r.cost} Points</span>

                      {isRedeemed ? (
                        <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/40 flex items-center gap-1">
                          <Check className="w-4 h-4" /> Redeemed
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRedeemReward(r)}
                          disabled={!hasEnoughPoints}
                          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                            hasEnoughPoints
                              ? 'bg-gradient-to-r from-eco-600 via-emerald-500 to-teal-500 hover:from-eco-500 hover:to-teal-400 text-white shadow-glow-eco transform hover:scale-105'
                              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                          }`}
                        >
                          <Gift className="w-4 h-4" /> Redeem Now
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
