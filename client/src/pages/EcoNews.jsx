import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Sparkles, 
  Search, 
  Clock, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  AlertCircle, 
  Globe, 
  Bookmark, 
  Share2, 
  Eye, 
  X,
  Zap,
  BookOpen,
  Award,
  BarChart3,
  TrendingUp,
  Scale,
  DollarSign,
  Briefcase,
  ShieldCheck,
  Check,
  ChevronRight,
  Filter,
  FileCheck
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Card3DTilt from '../components/Card3DTilt';
import EcoGlobe3D from '../components/EcoGlobe3D';
import { newsService } from '../services/newsService';
import { authService } from '../services/authService';

export default function EcoNews() {
  const [activeMainTab, setActiveMainTab] = useState('feed'); // 'feed' | 'calendar' | 'learning' | 'benchmarks' | 'recommendations'
  const [newsList, setNewsList] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [learningArticles, setLearningArticles] = useState([]);
  const [benchmarksData, setBenchmarksData] = useState({});
  const [aiRecommendations, setAiRecommendations] = useState([]);
  
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiDigest, setAiDigest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(['intel_01', 'intel_04']);
  const [reminders, setReminders] = useState(['evt_01']);

  const currentUser = authService.getCurrentUser();

  const industries = [
    'All',
    'Industrial & Manufacturing',
    'Technology & SaaS',
    'Retail & Commercial',
    'Energy & Infrastructure'
  ];

  useEffect(() => {
    fetchIntelligenceData();
    fetchAiDigest();
    fetchAiRecommendations();
  }, [selectedCategory, selectedIndustry]);

  const fetchIntelligenceData = async () => {
    try {
      setLoading(true);
      const data = await newsService.getNews(selectedCategory, searchQuery, selectedIndustry);
      if (data.success) {
        setNewsList(data.intelligence || []);
        if (data.categories) setCategories(data.categories);
        if (data.calendarEvents) setCalendarEvents(data.calendarEvents);
        if (data.learningArticles) setLearningArticles(data.learningArticles);
        if (data.benchmarks) setBenchmarksData(data.benchmarks);
      }
    } catch (err) {
      console.error('Error fetching intelligence hub data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAiDigest = async () => {
    try {
      const data = await newsService.getAiDigest();
      if (data.success) {
        setAiDigest(data.digest || []);
      }
    } catch (err) {
      console.error('Error fetching AI digest:', err);
    }
  };

  const fetchAiRecommendations = async () => {
    try {
      const data = await newsService.getAiRecommendations({
        organization: currentUser?.organization || 'Enterprise',
        industry: selectedIndustry
      });
      if (data.success) {
        setAiRecommendations(data.recommendations || []);
      }
    } catch (err) {
      console.error('Error fetching AI recommendations:', err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchIntelligenceData();
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1000&q=80';
  };

  const toggleBookmark = (id) => {
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleReminder = (id) => {
    setReminders(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getCategoryBadgeColor = (cat) => {
    switch (cat.toLowerCase()) {
      case 'sebi & brsr': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'mca & companies act': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'environmental regulations': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'government schemes': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'carbon credits': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      default: return 'bg-eco-500/20 text-eco-400 border-eco-500/30';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-slate-100">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6 overflow-hidden">
          {/* Header Banner */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5 bg-gradient-to-r from-slate-900 via-slate-900/95 to-emerald-950/40 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-eco-500/20 text-eco-400 border border-eco-500/30 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  EcoMind Enterprise Intelligence Hub
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                  Sustainability, ESG & Regulatory Intelligence
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Real-time updates on <span className="text-purple-400 font-semibold">SEBI BRSR Core</span>, <span className="text-blue-400 font-semibold">MCA Filings</span>, <span className="text-amber-400 font-semibold">Government Subsidies</span>, <span className="text-emerald-400 font-semibold">Carbon Credit Monetization</span>, and compliance deadlines.
                </p>
              </div>

              {/* Gemini AI Executive Summary Card */}
              <div className="glass-panel p-4.5 rounded-2xl border border-eco-500/30 bg-slate-950/90 max-w-md w-full space-y-2.5 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
                    <h4 className="text-xs font-bold font-display text-white">Daily AI Executive Briefing</h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Live</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-slate-300">
                  {aiDigest.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-snug">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{bullet.replace(/^[-•]\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Organization Profile Personalization Filter */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Briefcase className="w-4 h-4 text-eco-400" />
                <span>Organization Context:</span>
                <span className="font-bold text-white px-2.5 py-0.5 rounded-lg bg-slate-800 border border-slate-700">
                  {currentUser?.organization || 'Enterprise Org'}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Industry:
                </span>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:border-eco-500 focus:outline-none"
                >
                  {industries.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 3D WebGL Interactive Eco Globe Component */}
          <EcoGlobe3D title="3D Global Climate & Regulatory Intelligence Globe" />

          {/* Main Intelligence Hub Navigation Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-950/80 p-2 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveMainTab('feed')}
              className={`p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                activeMainTab === 'feed'
                  ? 'bg-eco-600 text-white border-eco-400 shadow-glow-eco'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border-transparent'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Intelligence Feed</span>
            </button>

            <button
              onClick={() => setActiveMainTab('calendar')}
              className={`p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                activeMainTab === 'calendar'
                  ? 'bg-eco-600 text-white border-eco-400 shadow-glow-eco'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border-transparent'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Compliance Calendar</span>
            </button>

            <button
              onClick={() => setActiveMainTab('recommendations')}
              className={`p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                activeMainTab === 'recommendations'
                  ? 'bg-eco-600 text-white border-eco-400 shadow-glow-eco'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border-transparent'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Opportunities</span>
            </button>

            <button
              onClick={() => setActiveMainTab('benchmarks')}
              className={`p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                activeMainTab === 'benchmarks'
                  ? 'bg-eco-600 text-white border-eco-400 shadow-glow-eco'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border-transparent'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Industry Benchmarks</span>
            </button>

            <button
              onClick={() => setActiveMainTab('learning')}
              className={`p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 col-span-2 sm:col-span-1 border ${
                activeMainTab === 'learning'
                  ? 'bg-eco-600 text-white border-eco-400 shadow-glow-eco'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border-transparent'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Learning Center</span>
            </button>
          </div>

          {/* TAB 1: INTELLIGENCE FEED */}
          {activeMainTab === 'feed' && (
            <div className="space-y-6">
              {/* Category Chips & Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                        selectedCategory === cat
                          ? 'bg-slate-800 text-white border-eco-500 shadow-md'
                          : 'bg-slate-900/60 text-slate-400 hover:text-white border-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search ESG, SEBI, MCA updates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-eco-500 focus:outline-none"
                  />
                </form>
              </div>

              {/* Feed Grid */}
              {loading ? (
                <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
                  <div className="w-8 h-8 border-2 border-eco-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs text-slate-400">Fetching live enterprise intelligence updates...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {newsList.map((item) => {
                    const isBookmarked = bookmarkedIds.includes(item.id);
                    return (
                      <Card3DTilt key={item.id}>
                        <div
                          className="glass-panel rounded-3xl border border-slate-800 overflow-hidden hover:border-eco-500/50 transition-all group flex flex-col justify-between bg-slate-900/60 relative h-full"
                        >
                          <div className="space-y-4">
                            {/* Image Cover */}
                            <div className="relative h-44 overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950/60 to-slate-950 flex items-center justify-center">
                              <img 
                                src={item.imageUrl} 
                                alt={item.title} 
                                onError={handleImageError}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute top-3 left-3 flex items-center gap-2">
                                <span className={`px-2.5 py-1 rounded-lg backdrop-blur-md text-[10px] font-extrabold border ${getCategoryBadgeColor(item.category)}`}>
                                  {item.category}
                                </span>
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); toggleBookmark(item.id); }}
                                className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md border transition-colors ${
                                  isBookmarked ? 'bg-amber-500 text-white border-amber-400' : 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-white'
                                }`}
                              >
                                <Bookmark className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Content */}
                            <div className="px-5 space-y-3">
                              <div className="flex items-center justify-between text-[11px] text-slate-400">
                                <span className="font-semibold text-slate-300">{item.source}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.readTime}</span>
                              </div>

                              <h3 className="text-base font-bold font-display text-white group-hover:text-eco-400 transition-colors line-clamp-2 leading-snug">
                                {item.title}
                              </h3>

                              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                {item.summary}
                              </p>

                              {/* 3 AI Key Takeaway Bullet Points */}
                              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" /> AI 3-Point Summary:
                                </span>
                                <ul className="space-y-1 text-[11px] text-slate-300">
                                  {item.aiPoints?.slice(0, 3).map((pt, idx) => (
                                    <li key={idx} className="flex items-start gap-1.5 leading-tight">
                                      <span className="text-eco-400 font-bold">•</span>
                                      <span>{pt}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>

                          {/* Card Footer */}
                          <div className="p-5 pt-4 border-t border-slate-800/60 mt-4 flex items-center justify-between">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {item.impactLevel}
                            </span>
                            <button
                              onClick={() => setSelectedArticle(item)}
                              className="text-xs font-bold text-eco-400 hover:text-eco-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                            >
                              Read Full Details <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </Card3DTilt>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COMPLIANCE CALENDAR */}
          {activeMainTab === 'calendar' && (
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-eco-400" />
                    Statutory Compliance Calendar & Filing Cutoffs
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Track upcoming SEBI, MCA, CPCB, and ISO environmental audit filing deadlines. Set alerts to ensure zero non-compliance penalties.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {calendarEvents.map((evt) => {
                  const hasReminder = reminders.includes(evt.id);
                  return (
                    <div 
                      key={evt.id} 
                      className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-eco-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/70"
                    >
                      <div className="space-y-2 max-w-2xl">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                            {evt.authority}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            evt.urgency === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            Urgency: {evt.urgency}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white">{evt.title}</h3>
                        <p className="text-xs text-slate-300 leading-relaxed">{evt.description}</p>
                        
                        <div className="p-3 rounded-xl bg-slate-950 text-xs text-eco-300 border border-slate-800 flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-eco-400 flex-shrink-0" />
                          <span><strong>Action Required:</strong> {evt.actionRequired}</span>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0 gap-3">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Filing Cutoff Date</span>
                          <span className="text-sm font-mono font-bold text-rose-400">{evt.dueDate}</span>
                        </div>

                        <button
                          onClick={() => toggleReminder(evt.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                            hasReminder
                              ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                          }`}
                        >
                          {hasReminder ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> Reminder Set
                            </>
                          ) : (
                            <>
                              <CalendarIcon className="w-3.5 h-3.5" /> Set Calendar Reminder
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: AI STRATEGIC OPPORTUNITIES */}
          {activeMainTab === 'recommendations' && (
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 to-emerald-950/40">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                    AI Strategic Recommendations & Cost-Saving Grants
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Personalized opportunities, subsidies, carbon credit monetization, and compliance steps generated for your organization context.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {aiRecommendations.map((rec, idx) => (
                  <div 
                    key={idx} 
                    className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition-all space-y-4 bg-slate-900/60 relative flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {rec.category}
                        </span>
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                      </div>

                      <h3 className="text-base font-bold text-white leading-snug">{rec.title}</h3>

                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                        <span className="text-slate-400 text-[10px] block">Financial / Impact Benefit:</span>
                        <span className="font-bold text-emerald-400">{rec.savings}</span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        <strong>Action Step:</strong> {rec.action}
                      </p>
                    </div>

                    <button 
                      onClick={() => alert(`Initiating action plan for: ${rec.title}`)}
                      className="w-full py-2.5 rounded-xl bg-eco-600 hover:bg-eco-500 text-white font-bold text-xs shadow-glow-eco flex items-center justify-center gap-1.5 transition-colors"
                    >
                      Execute Opportunity <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: INDUSTRY BENCHMARKS */}
          {activeMainTab === 'benchmarks' && (
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-3xl border border-slate-800">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-eco-400" />
                  Industry Sustainability Benchmarks (Peer Comparison)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Compare your organization’s daily resource intensity and carbon footprint against national industry averages.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(benchmarksData).map(([key, benchmark]) => (
                  <div key={key} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 bg-slate-900/60">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="text-sm font-bold text-white">{benchmark.industryName}</h3>
                      <TrendingUp className="w-4 h-4 text-eco-400" />
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Avg Electricity:</span>
                        <span className="font-mono font-bold text-amber-400">{benchmark.avgElectricityKwhPerDay} kWh/day</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Avg Water Usage:</span>
                        <span className="font-mono font-bold text-blue-400">{benchmark.avgWaterLitersPerDay} L/day</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Avg Waste Generated:</span>
                        <span className="font-mono font-bold text-rose-400">{benchmark.avgWasteKgPerDay} kg/day</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Avg Renewable Share:</span>
                        <span className="font-mono font-bold text-teal-400">{benchmark.avgRenewablePct}%</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                        <span className="font-semibold text-slate-200">Industry Avg Net Footprint:</span>
                        <span className="font-mono font-bold text-emerald-400">{benchmark.avgCarbonFootprintKg} kg CO2e</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: LEARNING CENTER */}
          {activeMainTab === 'learning' && (
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-3xl border border-slate-800">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-eco-400" />
                  ESG, BRSR & Net-Zero Learning Center
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  AI-generated explainers on ISO 14001 certification, SEBI BRSR 9 Principles, and GHG accounting frameworks.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {learningArticles.map((art) => (
                  <div key={art.id} className="glass-panel rounded-3xl border border-slate-800 overflow-hidden space-y-4 bg-slate-900/60 p-5 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950/60 to-slate-950 flex items-center justify-center">
                        <img src={art.imageUrl} alt={art.title} onError={handleImageError} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex items-center justify-between text-[10px]">
                        <span className="px-2.5 py-0.5 rounded bg-eco-500/20 text-eco-400 font-bold border border-eco-500/30">
                          {art.topic}
                        </span>
                        <span className="text-slate-400">{art.readTime}</span>
                      </div>

                      <h3 className="text-base font-bold text-white leading-snug">{art.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{art.summary}</p>

                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase">Key Takeaways:</span>
                        <ul className="space-y-1 text-[11px] text-slate-300">
                          {art.takeaways?.map((t, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-eco-400">•</span>
                              <span>{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Article Modal Reader View */}
          {selectedArticle && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="glass-panel max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 relative bg-slate-900">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="relative h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950/60 to-slate-950 flex items-center justify-center">
                  <img src={selectedArticle.imageUrl} alt={selectedArticle.title} onError={handleImageError} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getCategoryBadgeColor(selectedArticle.category)}`}>
                      {selectedArticle.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="font-bold text-white">{selectedArticle.source}</span>
                    <span>•</span>
                    <span>{new Date(selectedArticle.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{selectedArticle.readTime}</span>
                  </div>

                  <h2 className="text-2xl font-bold font-display text-white leading-snug">
                    {selectedArticle.title}
                  </h2>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {selectedArticle.content || selectedArticle.summary}
                  </p>
                </div>

                {/* 3-Point AI Summary */}
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> AI 3-Point Takeaway Breakdown
                  </span>
                  <ul className="space-y-1.5 text-xs text-emerald-200">
                    {selectedArticle.aiPoints?.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-eco-400 font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {selectedArticle.tags?.map(t => (
                      <span key={t} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300">#{t}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="px-5 py-2 rounded-xl bg-eco-600 hover:bg-eco-500 text-white font-bold text-xs transition-colors"
                  >
                    Close Intelligence Document
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
