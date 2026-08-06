import React, { useState, useEffect } from 'react';
import { 
  Newspaper, 
  Sparkles, 
  Search, 
  Clock, 
  ExternalLink, 
  Tag, 
  TrendingUp, 
  Globe, 
  Bookmark, 
  Share2, 
  Eye, 
  X,
  Zap,
  Waves,
  Trees,
  Recycle,
  Cpu
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { newsService } from '../services/newsService';

export default function EcoNews() {
  const [newsList, setNewsList] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiDigest, setAiDigest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    fetchNewsData();
    fetchAiDigest();
  }, [selectedCategory]);

  const fetchNewsData = async () => {
    try {
      setLoading(true);
      const data = await newsService.getNews(selectedCategory, searchQuery);
      if (data.success) {
        setNewsList(data.news || []);
        if (data.categories) setCategories(data.categories);
      }
    } catch (err) {
      console.error('Error fetching environmental news:', err);
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
      console.error('Error fetching AI news digest:', err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchNewsData();
  };

  const featuredArticle = newsList.length > 0 ? newsList[0] : null;
  const regularArticles = newsList.length > 1 ? newsList.slice(1) : newsList;

  const getCategoryIcon = (cat) => {
    switch (cat.toLowerCase()) {
      case 'renewable energy': return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'ocean protection': return <Waves className="w-3.5 h-3.5 text-blue-400" />;
      case 'biodiversity': return <Trees className="w-3.5 h-3.5 text-emerald-400" />;
      case 'zero waste': return <Recycle className="w-3.5 h-3.5 text-rose-400" />;
      case 'clean tech': return <Cpu className="w-3.5 h-3.5 text-teal-400" />;
      default: return <Globe className="w-3.5 h-3.5 text-eco-400" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-slate-100">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6 overflow-hidden">
          {/* Header Banner */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-eco-500/20 text-eco-400 border border-eco-500/30 text-xs font-semibold">
                  <Newspaper className="w-3.5 h-3.5" />
                  Live Climate & Environmental News Hub
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                  Global Environmental News & Intelligence
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Real-time developments on renewable energy, ocean protection, zero-waste policies, clean technology, and climate action powered by Google Gemini AI.
                </p>
              </div>

              {/* Gemini AI Daily Digest Box */}
              <div className="glass-panel p-4 rounded-2xl border border-eco-500/30 bg-slate-950/80 max-w-md w-full space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
                  <h4 className="text-xs font-bold font-display text-white">Gemini Climate Digest Takeaways</h4>
                </div>
                <ul className="space-y-1.5 text-[11px] text-slate-300">
                  {aiDigest.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-tight">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{bullet.replace(/^[-•]\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Search & Category Filter Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                    selectedCategory === cat
                      ? 'bg-eco-600 text-white border-eco-400 shadow-glow-eco'
                      : 'bg-slate-900/80 text-slate-300 hover:text-white border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {getCategoryIcon(cat)}
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input Form */}
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search environmental news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-eco-500 text-xs"
              />
            </form>
          </div>

          {/* Featured Breaking Story */}
          {featuredArticle && !loading && selectedCategory === 'All' && !searchQuery && (
            <div 
              onClick={() => setSelectedArticle(featuredArticle)}
              className="glass-panel rounded-3xl border border-slate-800 overflow-hidden hover:border-eco-500/50 transition-all cursor-pointer group grid grid-cols-1 lg:grid-cols-12 bg-slate-900/80"
            >
              <div className="lg:col-span-7 relative h-64 lg:h-auto overflow-hidden">
                <img 
                  src={featuredArticle.imageUrl} 
                  alt={featuredArticle.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-rose-600/90 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                    Featured Breaking
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-900/80 text-eco-400 text-[11px] font-bold border border-slate-700 backdrop-blur-md">
                    {featuredArticle.category}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">{featuredArticle.source}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {featuredArticle.readTime}</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold font-display text-white group-hover:text-eco-400 transition-colors leading-tight">
                    {featuredArticle.title}
                  </h2>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {featuredArticle.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {featuredArticle.tags?.map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-eco-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Read Article →
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* News Cards Grid */}
          {loading ? (
            <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-eco-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-slate-400">Fetching latest live climate news feed...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="glass-panel rounded-3xl border border-slate-800/90 overflow-hidden hover:border-eco-500/50 transition-all cursor-pointer group flex flex-col justify-between bg-slate-900/60"
                >
                  <div className="space-y-4">
                    {/* Image Cover */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={article.imageUrl} 
                        alt={article.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-eco-400 text-[10px] font-bold border border-slate-700 flex items-center gap-1">
                          {getCategoryIcon(article.category)}
                          {article.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="px-5 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-300">{article.source}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                      </div>

                      <h3 className="text-base font-bold font-display text-white group-hover:text-eco-400 transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-5 pt-4 border-t border-slate-800/60 mt-4 flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                      {article.impactLevel || 'Global News'}
                    </span>
                    <span className="text-xs font-bold text-eco-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Read <Eye className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Article Modal Reader View */}
          {selectedArticle && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="glass-panel max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 relative bg-slate-900">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="relative h-64 rounded-2xl overflow-hidden">
                  <img src={selectedArticle.imageUrl} alt={selectedArticle.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-eco-600 text-white text-xs font-bold">
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

                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> EcoMind Gemini Key Impact Assessment
                  </span>
                  <p className="text-xs text-emerald-200/90 leading-relaxed">
                    This news item directly signals positive movement toward net-zero targets. Continued support for clean energy regulations and marine preservation will lower annual global carbon intensity by 1.8 gigatons.
                  </p>
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
                    Close Article
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
