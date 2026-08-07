import React, { useState, useEffect } from 'react';
import { Award, Trophy, Star, ShieldCheck, Download, Sparkles, CheckCircle2, Zap, Droplets, Leaf, Flame, TreePine, Gift, ChevronRight, Share2, Medal, Printer, Lock, Check, Waves, Volume2, VolumeX, Palette } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import WaterFlowBackground from '../components/WaterFlowBackground';
import { playWaterDropSound, playWaterSplashSequence } from '../utils/waterAudio';
import { authService } from '../services/authService';
import { auditStore } from '../services/auditStore';

export default function Rewards() {
  const currentUser = authService.getCurrentUser();
  const userName = currentUser?.name || 'User';
  const userEmail = currentUser?.email ? currentUser.email.toLowerCase().trim() : 'default';

  // Water Theme State & Sound State
  const [waterTheme, setWaterTheme] = useState('aqua'); // aqua, bioluminescent, emerald, gold
  const [isWaterSoundOn, setIsWaterSoundOn] = useState(false);

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
      color: 'from-cyan-600 to-teal-500',
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
      color: 'from-cyan-500 to-blue-600',
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

    // Trigger Liquid Splash Acoustic Sound!
    playWaterSplashSequence();

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
      playWaterDropSound(300);
      setCelebrationMsg(`ℹ️ You have already claimed "${reward.title}"!`);
      return;
    }

    if (userPoints < reward.cost) {
      playWaterDropSound(250);
      setCelebrationMsg(`🔒 Insufficient Eco-Points! "${reward.title}" requires ${reward.cost} points (Current: ${userPoints} pts). Log more audit data to earn points!`);
      return;
    }

    // Deduct cost and mark claimed
    setUserPoints(prev => prev - reward.cost);
    setClaimedRewards(prev => [...prev, reward.id]);

    triggerCelebrationAnimation(`🎁 REWARD REDEEMED! Successfully claimed "${reward.title}" (-${reward.cost} Eco-Points deducted). Check your profile for claim details!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white relative overflow-x-hidden">
      {/* 🌊 Interactive Water Flowing Background Canvas */}
      <WaterFlowBackground theme={waterTheme} interactive={true} particleDensity={140} />

      <Navbar />

      {/* ========================================================================= */}
      {/* 🌿 PHASE 1: BIG LEAF FULL-SCREEN COVER OVERLAY (1 SECOND) */}
      {/* ========================================================================= */}
      {isLeafAnimating && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-2xl transition-all duration-500 overflow-hidden pointer-events-auto">
          <div className="animate-big-leaf flex flex-col items-center justify-center space-y-4">
            <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-cyan-500 via-teal-400 to-blue-500 p-2 shadow-2xl flex items-center justify-center shadow-[0_0_50px_#00f2fe]">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center p-6 border-4 border-cyan-500/50">
                <Droplets className="w-32 h-32 sm:w-40 sm:h-40 text-cyan-400 fill-cyan-400/20 animate-pulse" />
              </div>
            </div>

            <div className="text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Verifying Fluid Impact</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                💧 CLAIMING WATER SUSTAINABILITY REWARD...
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
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/50 via-teal-950/40 to-slate-950/60 animate-dj-flash" />

          {/* 5 HORIZONTAL DJ CONCERT SPOTLIGHT BEAMS RADIATING FROM TOP HEADER */}
          <div className="absolute top-0 w-full h-[120vh] overflow-hidden">
            <div className="absolute top-0 left-[10%] w-8 sm:w-16 h-[120vh] bg-gradient-to-b from-cyan-400 via-cyan-400/30 to-transparent blur-md origin-top animate-laser-red" />
            <div className="absolute top-0 left-[30%] w-10 sm:w-20 h-[120vh] bg-gradient-to-b from-teal-400 via-teal-400/30 to-transparent blur-md origin-top animate-laser-green" />
            <div className="absolute top-0 left-[50%] w-12 sm:w-24 h-[120vh] bg-gradient-to-b from-blue-400 via-blue-400/30 to-transparent blur-md origin-top animate-laser-blue" />
            <div className="absolute top-0 left-[70%] w-10 sm:w-20 h-[120vh] bg-gradient-to-b from-emerald-400 via-emerald-400/30 to-transparent blur-md origin-top animate-laser-yellow" />
            <div className="absolute top-0 left-[90%] w-8 sm:w-16 h-[120vh] bg-gradient-to-b from-indigo-500 via-indigo-500/30 to-transparent blur-md origin-top animate-laser-red" />
          </div>

          {/* 5 HORIZONTAL TOP SPOTLIGHT FIXTURE BULBS */}
          <div className="absolute top-0 w-full flex justify-between px-6 sm:px-16 z-20">
            <div className="flex flex-col items-center">
              <div className="w-12 h-4 bg-slate-900 border-b-2 border-slate-700 rounded-b-lg shadow-lg"></div>
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-cyan-400 shadow-[0_0_50px_#00f2fe] animate-pulse border-2 border-white/40"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-4 bg-slate-900 border-b-2 border-slate-700 rounded-b-lg shadow-lg"></div>
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-teal-400 shadow-[0_0_50px_#2dd4bf] animate-pulse border-2 border-white/40"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-5 bg-slate-900 border-b-2 border-slate-700 rounded-b-lg shadow-lg"></div>
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-blue-400 shadow-[0_0_60px_#60a5fa] animate-pulse border-2 border-white/50"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-4 bg-slate-900 border-b-2 border-slate-700 rounded-b-lg shadow-lg"></div>
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-emerald-400 shadow-[0_0_50px_#34d399] animate-pulse border-2 border-white/40"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-4 bg-slate-900 border-b-2 border-slate-700 rounded-b-lg shadow-lg"></div>
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-indigo-500 shadow-[0_0_50px_#6366f1] animate-pulse border-2 border-white/40"></div>
            </div>
          </div>

          {/* Celebration Banner Card */}
          <div className="relative z-50 mt-20 p-6 sm:p-8 rounded-3xl bg-slate-950/95 border-2 border-cyan-500/80 text-center space-y-3 shadow-2xl max-w-lg mx-4 animate-bounce">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-extrabold border border-cyan-500/40">
              <Sparkles className="w-4 h-4 text-cyan-400" /> FLUID WATER CELEBRATION ACTIVE!
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              🎉 REWARD CLAIMED SUCCESSFULLY!
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 font-semibold">{celebrationMsg}</p>
          </div>
        </div>
      )}

      {/* Main Page Layout */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6 z-10">
        <Sidebar />

        <main className="flex-1 space-y-6 overflow-hidden">

          {/* 🌊 WATER FLOWING INTERACTIVE CONTROL TOOLBAR */}
          <div className="p-4 rounded-3xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 shadow-[0_8px_32px_rgba(0,242,254,0.12)]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 animate-pulse">
                <Waves className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">Interactive Flow Experience</span>
                <span className="text-sm font-extrabold text-white font-display">Fluid Dynamics & Hydro Controls</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Sound Effect Quick Button */}
              <button
                type="button"
                onClick={() => {
                  playWaterDropSound(523.25);
                  setIsWaterSoundOn(!isWaterSoundOn);
                }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isWaterSoundOn
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_12px_rgba(0,242,254,0.3)]'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {isWaterSoundOn ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
                <span>Hydro Chimes</span>
              </button>

              {/* Water Theme Switcher */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => { setWaterTheme('aqua'); playWaterDropSound(440); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${waterTheme === 'aqua' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  Aqua
                </button>
                <button
                  type="button"
                  onClick={() => { setWaterTheme('bioluminescent'); playWaterDropSound(587.33); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${waterTheme === 'bioluminescent' ? 'bg-purple-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  Bio Night
                </button>
                <button
                  type="button"
                  onClick={() => { setWaterTheme('emerald'); playWaterDropSound(392); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${waterTheme === 'emerald' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  Emerald
                </button>
                <button
                  type="button"
                  onClick={() => { setWaterTheme('gold'); playWaterDropSound(659.25); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${waterTheme === 'gold' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  Gold Tide
                </button>
              </div>
            </div>
          </div>

          {/* Header Banner with Liquid Glassmorphism */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/40 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 shadow-[0_16px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold">
                  <Droplets className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span>Fluid Sustainability & Performance Hub</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                  Welcome, <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">{userName}</span>!
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  Start your sustainability journey as an <strong>{levelTitle}</strong>. Log water and carbon audits to earn XP, unlock certificates, and trigger fluid rewards!
                </p>

                {/* Level XP Liquid Wave Progress Bar */}
                <div className="space-y-1.5 pt-2 max-w-md">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">Level {currentLevel} ({levelTitle})</span>
                    <span className="text-cyan-400 font-mono">{currentXP} / {nextLevelXP} XP</span>
                  </div>
                  <div className="w-full h-3.5 rounded-full bg-slate-950 overflow-hidden border border-cyan-500/30 p-0.5 relative">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-500 shadow-[0_0_20px_#00f2fe] transition-all duration-1000"
                      style={{ width: `${(currentXP / nextLevelXP) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Eco Points Counter Card */}
              <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-950/80 border border-cyan-500/40 text-center min-w-[220px] shadow-2xl space-y-2 backdrop-blur-xl">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 p-0.5 flex items-center justify-center shadow-[0_0_25px_rgba(0,242,254,0.4)]">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Star className="w-6 h-6 text-cyan-400 fill-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Available Eco-Points</span>
                  <span className="text-3xl font-extrabold text-white font-mono">{userPoints}</span>
                </div>

                {/* CERTIFICATE BUTTON WITH STRICT XP LIMIT ENFORCEMENT */}
                {isCertificateUnlocked ? (
                  <button
                    onClick={() => {
                      playWaterSplashSequence();
                      setShowCertificateModal(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all transform hover:scale-105 cursor-pointer"
                  >
                    <Award className="w-4 h-4" /> Download Certificate
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      playWaterDropSound(280);
                      setCelebrationMsg(`🔒 Certificate Locked: Requires 500 XP to unlock your official Certificate of Sustainability Appreciation (Current: ${currentXP}/500 XP). Log emission reduction data to earn ${minCertificateXP - currentXP} more XP!`);
                      setTimeout(() => setCelebrationMsg(''), 7000);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/50 font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-cyan-400" /> Certificate Locked (500 XP)
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Status Message Alert */}
          {celebrationMsg && !isDJAnimating && (
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-2.5 shadow-lg animate-fade-in backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>{celebrationMsg}</span>
            </div>
          )}

          {/* Performance Badges Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <Medal className="w-5 h-5 text-cyan-400" />
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
                    onClick={() => playWaterDropSound(400 + Math.random() * 200)}
                    className={`glass-panel p-5 rounded-3xl border transition-all duration-300 relative space-y-3 cursor-pointer ${
                      isClaimed
                        ? 'border-cyan-500/40 bg-gradient-to-br from-cyan-950/30 to-slate-900 shadow-[0_0_20px_rgba(0,242,254,0.15)]'
                        : canClaim
                        ? 'border-teal-500/50 bg-gradient-to-br from-teal-950/20 to-slate-900 hover:scale-[1.02] shadow-[0_0_15px_rgba(45,212,191,0.2)]'
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
                        {isClaimed && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-800/60 text-xs">
                      <span className="text-cyan-400 font-bold font-mono">{b.badgePointsText}</span>

                      {isClaimed ? (
                        <span className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 font-bold text-[11px] border border-cyan-500/40 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Claimed
                        </span>
                      ) : canClaim ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClaimBadge(b);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-[11px] shadow-[0_0_15px_rgba(0,242,254,0.4)] flex items-center gap-1 transition-all transform hover:scale-105 cursor-pointer"
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
                <Gift className="w-6 h-6 text-cyan-400" />
                Redeem Sustainability Rewards
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Use your accumulated Eco-Points to claim real-world environmental & hydro-conservation impact rewards.
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
                        ? 'border-cyan-500/40 bg-gradient-to-br from-cyan-950/40 to-slate-900 shadow-[0_0_20px_rgba(0,242,254,0.2)]'
                        : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-cyan-500/40'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
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
                      <span className="text-base font-extrabold text-cyan-400 font-mono">{r.cost} Points</span>

                      {isRedeemed ? (
                        <span className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-500/40 flex items-center gap-1">
                          <Check className="w-4 h-4" /> Redeemed
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRedeemReward(r)}
                          disabled={!hasEnoughPoints}
                          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                            hasEnoughPoints
                              ? 'bg-gradient-to-r from-cyan-600 via-teal-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(0,242,254,0.3)] transform hover:scale-105'
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
