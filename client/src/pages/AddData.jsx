import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUp, Edit3, Sparkles, CheckCircle2, ArrowRight, FileText } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import ResourceForm from '../components/ResourceForm';
import DocumentUpload from '../components/DocumentUpload';
import AIRecommendationCards from '../components/AIRecommendationCards';
import { usageService } from '../services/usageService';
import { aiService } from '../services/aiService';
import { auditStore } from '../services/auditStore';

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
      // 1. Save directly to auditStore so Dashboard, Analytics, Reports & AI update in real-time
      const savedRecord = auditStore.addRecord(formData);
      setSuccessMessage(`✅ Resource usage record logged! Net Carbon Emissions: ${savedRecord.total_co2_kg} kg CO2e.`);

      // 2. Try backend API save
      try {
        await usageService.addUsage(formData);
      } catch (apiErr) {
        console.warn('Backend API note:', apiErr.message);
      }

      // 3. Trigger Gemini AI analysis on the submitted data
      try {
        const aiRes = await aiService.analyzeSustainability({
          usageId: savedRecord.id,
          ...formData,
        });

        if (aiRes.success) {
          setAiReportResult(aiRes.analysis);
        }
      } catch (aiErr) {
        console.warn('AI analysis call warning:', aiErr);
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
          {/* Header Card */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
                <FileUp className="w-6 h-6 text-eco-400" />
                Upload & Record Sustainability Data
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Fill in consumption figures manually or extract metrics automatically from utility bill documents.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                View Live Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between animate-fade-in shadow-lg">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-glow-eco"
              >
                View Updated Dashboard →
              </button>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => setActiveTab('manual')}
              className={`py-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'manual'
                  ? 'bg-eco-600 text-white shadow-glow-eco scale-[1.01]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Edit3 className="w-4 h-4" /> Manual Data Input Form
            </button>

            <button
              onClick={() => setActiveTab('document')}
              className={`py-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'document'
                  ? 'bg-eco-600 text-white shadow-glow-eco scale-[1.01]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-300" /> AI Document & Bill Scanner
            </button>
          </div>

          {/* Form Content */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            {activeTab === 'manual' ? (
              <ResourceForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
            ) : (
              <DocumentUpload onExtractedData={handleFormSubmit} isSubmitting={isSubmitting} />
            )}
          </div>

          {/* AI Advisor Real-time Recommendations Output */}
          {aiReportResult && (
            <div className="animate-fade-in space-y-4">
              <div className="flex items-center gap-2 text-eco-400 font-bold text-sm font-display">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Gemini AI Instant Advisory Insights</span>
              </div>
              <AIRecommendationCards analysis={aiReportResult} />
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
