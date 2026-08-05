import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import ResourceForm from '../components/ResourceForm';
import AIRecommendationCards from '../components/AIRecommendationCards';
import { usageService } from '../services/usageService';
import { aiService } from '../services/aiService';

export default function AddData() {
  const navigate = useNavigate();
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
          {/* Header */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-eco-500/20 text-eco-400 border border-eco-500/30">
                Resource Input Protocol
              </span>
            </div>
            <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
              <PlusCircle className="w-6 h-6 text-eco-400" />
              Record Sustainability Data
            </h1>
            <p className="text-xs text-slate-400">
              Input your daily electricity, water, waste, and transportation metrics to compute precise carbon emissions and generate Gemini AI advice.
            </p>
          </div>

          {successMessage && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-medium">{successMessage}</span>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 transition-colors"
              >
                Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Input Form */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            <ResourceForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
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
