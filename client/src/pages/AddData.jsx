import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUp, Edit3, Sparkles, CheckCircle2, ArrowRight, Layers, FileText } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import ResourceForm from '../components/ResourceForm';
import DocumentUpload from '../components/DocumentUpload';
import AIRecommendationCards from '../components/AIRecommendationCards';
import { usageService } from '../services/usageService';
import { aiService } from '../services/aiService';

export default function AddData() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' | 'document'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiReportResult, setAiReportResult] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    setSuccessMessage('');
    setAiReportResult(null);

    try {
      // 1. Submit Usage Record
      const usageRes = await usageService.addUsage(formData);

      if (usageRes.success) {
        setSuccessMessage('Resource usage record saved successfully!');

        // 2. Trigger Gemini AI analysis on the submitted data
        try {
          const aiRes = await aiService.analyzeSustainability({
            usageId: usageRes.usage.id,
            ...formData,
          });

          if (aiRes.success) {
            setAiReportResult(aiRes.analysis);
          }
        } catch (aiErr) {
          console.warn('AI analysis call warning:', aiErr);
        }
      }
    } catch (err) {
      console.error('Error saving resource usage:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-slate-100">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6 overflow-hidden">
          {/* Main Command Header */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5 bg-gradient-to-r from-slate-900 via-slate-900/95 to-emerald-950/30">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-eco-500/20 text-eco-400 border border-eco-500/30 text-xs font-semibold">
                  <Layers className="w-3.5 h-3.5" />
                  Select Data Input Method
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight mt-2 flex items-center gap-2.5">
                  {activeTab === 'manual' ? (
                    <>
                      <Edit3 className="w-7 h-7 text-eco-400" />
                      Manual Resource Usage Entry
                    </>
                  ) : (
                    <>
                      <FileUp className="w-7 h-7 text-eco-400" />
                      Document & Utility Bill Upload
                    </>
                  )}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Choose between <span className="text-eco-400 font-semibold">Manual Input Form</span> or <span className="text-teal-400 font-semibold">AI Document Upload</span> to log your daily electricity, water, waste, and transport metrics.
                </p>
              </div>
            </div>

            {/* High-Contrast Clear Mode Selector Bar */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Choose Mode:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/80 p-2 rounded-2xl border border-slate-800">
                {/* Manual Entry Button */}
                <button
                  type="button"
                  onClick={() => setActiveTab('manual')}
                  className={`p-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-3 border ${
                    activeTab === 'manual'
                      ? 'bg-gradient-to-r from-eco-600 to-emerald-600 text-white border-eco-400 shadow-glow-eco scale-[1.01]'
                      : 'bg-slate-900/60 text-slate-300 hover:text-white border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Edit3 className={`w-4 h-4 ${activeTab === 'manual' ? 'text-white' : 'text-eco-400'}`} />
                  <span>✍️ Manual Data Entry Form</span>
                  {activeTab === 'manual' && (
                    <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-white/20 text-white ml-auto">
                      Active
                    </span>
                  )}
                </button>

                {/* Document Upload Button */}
                <button
                  type="button"
                  onClick={() => setActiveTab('document')}
                  className={`p-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-3 border ${
                    activeTab === 'document'
                      ? 'bg-gradient-to-r from-teal-600 to-eco-600 text-white border-teal-400 shadow-glow-eco scale-[1.01]'
                      : 'bg-slate-900/60 text-slate-300 hover:text-white border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <FileUp className={`w-4 h-4 ${activeTab === 'document' ? 'text-white' : 'text-teal-400'}`} />
                  <span>📄 AI Document & Bill Upload</span>
                  {activeTab === 'document' && (
                    <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-white/20 text-white ml-auto">
                      Active
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {successMessage && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-sm font-medium">{successMessage}</span>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-xs font-bold px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 transition-colors shadow-md"
              >
                Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Active Tab Panel */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
            {activeTab === 'manual' ? (
              <ResourceForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
            ) : (
              <DocumentUpload onExtractedDataSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
            )}
          </div>

          {/* AI Analysis Feedback after submission */}
          {aiReportResult && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
                <h3 className="text-lg font-bold font-display text-white">Instant Gemini AI Advisory Feedback</h3>
              </div>
              <AIRecommendationCards report={aiReportResult} />
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
