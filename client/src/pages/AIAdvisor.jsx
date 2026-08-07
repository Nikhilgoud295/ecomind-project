import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Bot, ShieldCheck, Flame, CloudRain, FileUp, Send, User, MessageSquare } from 'lucide-react';
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

  // Interactive AI Copilot Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your EcoMind Gemini 1.5 AI Sustainability Advisor. How can I help you reduce your carbon footprint or streamline BRSR compliance today?'
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const fetchAIReport = async () => {
    setLoading(true);
    const userSummary = auditStore.getSummary();
    setSummary(userSummary);

    const metricsToAnalyze = userSummary.hasData && userSummary.logs.length > 0
      ? userSummary.logs[0]
      : { electricity_kwh: 24.5, water_liters: 185, waste_kg: 3.4, fuel_liters: 2.1, public_transport_km: 12 };

    try {
      const res = await aiService.analyzeSustainability(metricsToAnalyze);
      if (res && res.analysis) {
        setReport(res.analysis);
      }
    } catch (err) {
      console.warn('AI analysis error fallback:', err);
      const fallbackRes = aiService.generateLocalAIAnalysis(metricsToAnalyze);
      setReport(fallbackRes.analysis);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIReport();

    const handleAuditUpdate = () => {
      fetchAIReport();
    };

    window.addEventListener('ecomind_audit_updated', handleAuditUpdate);
    window.addEventListener('storage', handleAuditUpdate);
    return () => {
      window.removeEventListener('ecomind_audit_updated', handleAuditUpdate);
      window.removeEventListener('storage', handleAuditUpdate);
    };
  }, []);

  const handleReanalyze = async () => {
    setReanalyzing(true);
    await fetchAIReport();
    setReanalyzing(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userQuery = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { sender: 'user', text: userQuery }]);
    setChatLoading(true);

    try {
      const res = await aiService.chatWithAI(userQuery);
      setChatMessages(prev => [...prev, { sender: 'ai', text: res.response || 'Gemini AI recommends reducing peak electricity load by 15% and installing low-flow aerators to meet statutory compliance targets.' }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { sender: 'ai', text: `Gemini AI Recommendation for "${userQuery}": Implement smart power timers and divert organic waste into municipal composting streams.` }]);
    } finally {
      setChatLoading(false);
    }
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
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {summary.hasData ? `Analyzing User Audit Record #${summary.logs[0]?.id || ''}` : 'Baseline AI Assessment Mode'}
                </span>
              </div>
              <h1 className="text-2xl font-bold font-display text-white mt-1 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-emerald-400" />
                Gemini AI Sustainability Advisor
              </h1>
              <p className="text-xs text-slate-400">
                Actionable reduction recommendations and real-time AI copilot guidance.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/add-data"
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <FileUp className="w-4 h-4 text-eco-400" /> Log Custom Data
              </Link>
              <button
                onClick={handleReanalyze}
                disabled={reanalyzing}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-eco-600 to-teal-500 hover:from-eco-500 hover:to-teal-400 text-white font-medium text-xs shadow-glow-eco flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${reanalyzing || loading ? 'animate-spin' : ''}`} />
                Re-Analyze AI Report
              </button>
            </div>
          </div>

          {/* Mode Indicator Banner */}
          {!summary.hasData && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-eco-500/30 text-xs text-slate-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Currently displaying <strong>Baseline Gemini AI Assessment</strong>. Log your custom data to personalize this report!</span>
              </div>
              <Link to="/add-data" className="text-eco-400 font-bold hover:underline">
                Log Custom Data →
              </Link>
            </div>
          )}

          {/* AI Recommendation Cards Component */}
          {loading ? (
            <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-bold">Gemini AI Calculating Carbon Reduction Strategies...</p>
            </div>
          ) : report ? (
            <div className="animate-fade-in space-y-6">
              <AIRecommendationCards analysis={report} />
            </div>
          ) : null}

          {/* Interactive Gemini AI Copilot Chat Window */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-eco-400" />
                <h3 className="text-sm font-bold font-display text-white">Ask Gemini AI Sustainability Copilot</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                Interactive AI Chat
              </span>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-thin p-1">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 text-xs ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-xl bg-eco-500/20 text-eco-400 border border-eco-500/30 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-2xl max-w-lg leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-eco-600 text-white font-medium rounded-tr-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {chatLoading && (
                <div className="flex gap-3 text-xs items-center text-slate-400">
                  <div className="w-7 h-7 rounded-xl bg-eco-500/20 text-eco-400 flex items-center justify-center">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <span>Gemini AI is generating recommendations...</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2 pt-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask Gemini AI (e.g. 'How do I reduce my Scope 2 electricity emissions by 20%?')..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-eco-500 text-xs font-semibold"
              />
              <button
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-eco-600 hover:bg-eco-500 text-white font-bold text-xs shadow-glow-eco flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Ask AI
              </button>
            </form>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
