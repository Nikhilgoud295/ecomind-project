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
  FileCheck,
  Layers,
  ChevronDown
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Card3DTilt from '../components/Card3DTilt';
import EcoGlobe3D from '../components/EcoGlobe3D';
import { newsService } from '../services/newsService';
import { authService } from '../services/authService';

export default function EcoNews() {
  const [activeMainTab, setActiveMainTab] = useState('feed'); // 'feed' | 'calendar' | 'recommendations' | 'benchmarks' | 'learning'
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
  const [showGlobe3D, setShowGlobe3D] = useState(false);

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
    <div className="min-h-screen flex flex-col bg-dark-bg text-slate-100 font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6 overflow-hidden">
          {/* Top Clean Header */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/30">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-eco-500/15 text-eco-400 border border-eco-500/30 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  EcoMind Enterprise Intelligence Hub
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight mt-2">
                  Sustainability, Compliance & ESG Intelligence
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                  Clear, actionable updates on SEBI BRSR Core, MCA regulations, green subsidies, carbon credits, and statutory filing cutoffs.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowGlobe3D(!showGlobe3D)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition-all"
              >
                <Globe className="w-4 h-4 text-eco-400" />
                {showGlobe3D ? 'Hide 3D World Globe' : 'Show 3D World Globe 🌐'}
              </button>
            </div>

            {/* Optional 3D Globe Section */}
            {showGlobe3D && (
              <div className="pt-2 animate-fade-in">
                <EcoGlobe3D title="3D Global Sustainability & Regulatory Hotspots" />
              </div>
            )}

            {/* Context & Industry Filter Line */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Briefcase className="w-4 h-4 text-eco-400" />
                <span>Organization:</span>
                <span className="font-bold text-white px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">
                  {currentUser?.organization || 'Enterprise Org'}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Industry Filter:
                </span>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-bold focus:border-eco-500 focus:outline-none"
                >
                  {industries.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Spacious Main Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveMainTab('feed')}
              className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap border ${
                activeMainTab === 'feed'
                  ? 'bg-gradient-to-r from-eco-600 to-emerald-600 text-white border-eco-400 shadow-glow-eco'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border-transparent'
              }`}
            >
              <Globe className="w-4 h-4" />
              Intelligence Feed
            </button>

            <button
              onClick={() => setActiveMainTab('calendar')}
              className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap border ${
                activeMainTab === 'calendar'
                  ? 'bg-gradient-to-r from-eco-600 to-emerald-600 text-white border-eco-400 shadow-glow-eco'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border-transparent'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              Compliance Calendar
            </button>

            <button
              onClick={() => setActiveMainTab('recommendations')}
              className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap border ${
                activeMainTab === 'recommendations'
                  ? 'bg-gradient-to-r from-eco-600 to-emerald-600 text-white border-eco-400 shadow-glow-eco'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border-transparent'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              AI Strategic Opportunities
            </button>

            <button
              onClick={() => setActiveMainTab('benchmarks')}
              className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap border ${
                activeMainTab === 'benchmarks'
                  ? 'bg-gradient-to-r from-eco-600 to-emerald-600 text-white border-eco-400 shadow-glow-eco'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border-transparent'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Industry Benchmarks
            </button>

            <button
              onClick={() => setActiveMainTab('learning')}
              className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap border ${
                activeMainTab === 'learning'
                  ? 'bg-gradient-to-r from-eco-600 to-emerald-600 text-white border-eco-400 shadow-glow-eco'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border-transparent'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Learning Center
            </button>
          </div>

          {/* TAB 1: INTELLIGENCE FEED (Spacious 2-Column Layout) */}
          {activeMainTab === 'feed' && (
            <div className="space-y-6">
              {/* Category Filter Pills & Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                        selectedCategory === cat
                          ? 'bg-eco-600 text-white border-eco-400 shadow-md'
                          : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search ESG, SEBI, MCA rules..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-medium focus:border-eco-500 focus:outline-none"
                  />
                </form>
              </div>

              {/* Feed Grid - Spacious 2 Columns */}
              {loading ? (
                <div className="glass-panel p-16 rounded-3xl border border-slate-800 text-center space-y-3">
                  <div className="w-10 h-10 border-2 border-eco-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-sm font-semibold text-slate-300">Loading intelligence updates...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {newsList.map((item) => {
                    const isBookmarked = bookmarkedIds.includes(item.id);
                    return (
                      <Card3DTilt key={item.id}>
                        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden hover:border-eco-500/60 transition-all group flex flex-col justify-between bg-slate-900/80 relative h-full p-6 space-y-5">
                          <div className="space-y-4">
                            {/* Card Header Info */}
                            <div className="flex items-center justify-between">
                              <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${getCategoryBadgeColor(item.category)}`}>
                                {item.category}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400 font-semibold">{item.readTime}</span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); toggleBookmark(item.id); }}
                                  className={`p-2 rounded-xl border transition-colors ${
                                    isBookmarked ? 'bg-amber-500 text-white border-amber-400' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                                  }`}
                                >
                                  <Bookmark className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* HD Image Cover */}
                            <div className="relative h-52 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950/60 to-slate-950 flex items-center justify-center border border-slate-800">
                              <img 
                                src={item.imageUrl} 
                                alt={item.title} 
                                onError={handleImageError}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>

                            {/* Title & Source */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                <span className="font-bold text-slate-200">{item.source}</span>
                                <span>•</span>
                                <span>{new Date(item.date).toLocaleDateString()}</span>
                              </div>

                              <h3 className="text-lg font-bold font-display text-white group-hover:text-eco-400 transition-colors leading-snug">
                                {item.title}
                              </h3>

                              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                {item.summary}
                              </p>
                            </div>

                            {/* AI 3-Point Summary Box - High Contrast & Spacious */}
                            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2.5">
                              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                                <Sparkles className="w-4 h-4 text-emerald-400" />
                                <span>Gemini AI Key Takeaway Summary</span>
                              </div>
                              <ul className="space-y-2 text-xs text-slate-200">
                                {item.aiPoints?.map((pt, idx) => (
                                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                    <span>{pt}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Card Footer */}
                          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800">
                              {item.impactLevel}
                            </span>
                            <button
                              onClick={() => setSelectedArticle(item)}
                              className="px-4 py-2 rounded-xl bg-eco-600 hover:bg-eco-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-glow-eco"
                            >
                              Read Full Story <ChevronRight className="w-4 h-4" />
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
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
                <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
                  <CalendarIcon className="w-6 h-6 text-eco-400" />
                  Statutory Compliance Calendar & Audit Deadlines
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Track upcoming filing cutoffs for SEBI, MCA, CPCB, and ISO environmental audits.
                </p>
              </div>

              <div className="space-y-4">
                {calendarEvents.map((evt) => {
                  const hasReminder = reminders.includes(evt.id);
                  return (
                    <div 
                      key={evt.id} 
                      className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-800 hover:border-eco-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-slate-900/80"
                    >
                      <div className="space-y-3 max-w-3xl">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
                            {evt.authority}
                          </span>
                          <span className={`px-3 py-1 rounded-lg text-xs font-extrabold ${
                            evt.urgency === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            Urgency: {evt.urgency}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-white">{evt.title}</h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{evt.description}</p>
                        
                        <div className="p-3.5 rounded-xl bg-slate-950 text-xs text-eco-300 border border-slate-800 flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-eco-400 flex-shrink-0" />
                          <span><strong>Action Required:</strong> {evt.actionRequired}</span>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 border-slate-800 pt-4 sm:pt-0 gap-4">
                        <div className="text-right">
                          <span className="text-xs text-slate-400 uppercase font-semibold block">Filing Cutoff Date</span>
                          <span className="text-base font-mono font-extrabold text-rose-400">{evt.dueDate}</span>
                        </div>

                        <button
                          onClick={() => toggleReminder(evt.id)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                            hasReminder
                              ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                          }`}
                        >
                          {hasReminder ? (
                            <>
                              <Check className="w-4 h-4" /> Calendar Reminder Set
                            </>
                          ) : (
                            <>
                              <CalendarIcon className="w-4 h-4 text-eco-400" /> Set Reminder
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
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 to-emerald-950/40">
                <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
                  AI Strategic Recommendations & Cost-Saving Grants
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Personalized opportunities, subsidies, carbon credit monetization, and compliance actions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {aiRecommendations.map((rec, idx) => (
                  <div 
                    key={idx} 
                    className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition-all space-y-4 bg-slate-900/80 relative flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {rec.category}
                        </span>
                        <DollarSign className="w-5 h-5 text-emerald-400" />
                      </div>

                      <h3 className="text-base font-bold text-white leading-snug">{rec.title}</h3>

                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                        <span className="text-slate-400 text-[11px] block">Estimated Impact / Savings:</span>
                        <span className="font-bold text-emerald-400 text-sm">{rec.savings}</span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        <strong>Action Step:</strong> {rec.action}
                      </p>
                    </div>

                    <button 
                      onClick={() => alert(`Initiating action plan for: ${rec.title}`)}
                      className="w-full py-3 rounded-xl bg-eco-600 hover:bg-eco-500 text-white font-bold text-xs shadow-glow-eco flex items-center justify-center gap-1.5 transition-colors"
                    >
                      Execute Opportunity <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: INDUSTRY BENCHMARKS */}
          {activeMainTab === 'benchmarks' && (
            <div className="space-y-6">
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
                <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-eco-400" />
                  Industry Sustainability Benchmarks (Peer Comparison)
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Compare your organization’s daily resource intensity and carbon footprint against national industry averages.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(benchmarksData).map(([key, benchmark]) => (
                  <div key={key} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5 bg-slate-900/80">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="text-base font-bold text-white">{benchmark.industryName}</h3>
                      <TrendingUp className="w-5 h-5 text-eco-400" />
                    </div>

                    <div className="space-y-3 text-xs sm:text-sm">
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

                      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                        <span className="font-semibold text-slate-200">Industry Avg Net Footprint:</span>
                        <span className="font-mono font-bold text-emerald-400 text-sm">{benchmark.avgCarbonFootprintKg} kg CO2e</span>
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
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
                <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-eco-400" />
                  ESG, BRSR & Net-Zero Learning Center
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  AI-generated explainers on ISO 14001 certification, SEBI BRSR 9 Principles, and GHG accounting frameworks.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {learningArticles.map((art) => (
                  <div key={art.id} className="glass-panel rounded-3xl border border-slate-800 overflow-hidden space-y-4 bg-slate-900/80 p-6 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="h-44 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950/60 to-slate-950 flex items-center justify-center border border-slate-800">
                        <img src={art.imageUrl} alt={art.title} onError={handleImageError} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="px-3 py-1 rounded-lg bg-eco-500/20 text-eco-400 font-bold border border-eco-500/30">
                          {art.topic}
                        </span>
                        <span className="text-slate-400">{art.readTime}</span>
                      </div>

                      <h3 className="text-base font-bold text-white leading-snug">{art.title}</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">{art.summary}</p>

                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase">Key Takeaways:</span>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {art.takeaways?.map((t, i) => (
                            <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                              <span className="text-eco-400 font-bold">•</span>
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
                    <Sparkles className="w-4 h-4" /> AI Key Takeaway Summary
                  </span>
                  <ul className="space-y-1.5 text-xs text-emerald-200">
                    {selectedArticle.aiPoints?.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
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
                    className="px-5 py-2.5 rounded-xl bg-eco-600 hover:bg-eco-500 text-white font-bold text-xs transition-colors"
                  >
                    Close Document
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
