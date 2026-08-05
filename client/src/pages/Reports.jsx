import React, { useState, useEffect } from 'react';
import { FileText, PlusCircle, Download, FileSpreadsheet, Sparkles, Calendar, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import ReportsTable from '../components/ReportsTable';
import { reportService } from '../services/reportService';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [reportType, setReportType] = useState('weekly');
  const [customTitle, setCustomTitle] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await reportService.getReports();
      if (res.success) {
        setReports(res.reports || []);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setSuccessMsg('');

    try {
      const res = await reportService.generateReport({
        type: reportType,
        title: customTitle || `EcoMind ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Sustainability Audit`,
      });

      if (res.success) {
        setSuccessMsg(`New ${reportType.toUpperCase()} report generated successfully!`);
        setCustomTitle('');
        fetchReports();
      }
    } catch (err) {
      console.error('Error generating report:', err);
    } finally {
      setGenerating(false);
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
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Compliance & ESG Documentation
              </span>
            </div>
            <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-eco-400" />
              Sustainability Reports & Exports
            </h1>
            <p className="text-xs text-slate-400">
              Generate daily, weekly, or monthly carbon audit reports. Download formatted PDF files or raw CSV spreadsheets for stakeholder compliance.
            </p>
          </div>

          {/* Generator Form Card */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-eco-400" />
              Generate New Sustainability Report
            </h3>

            {successMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleGenerateReport} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-eco-500 text-sm"
                >
                  <option value="daily">Daily Audit Report</option>
                  <option value="weekly">Weekly Aggregate Audit</option>
                  <option value="monthly">Monthly ESG Executive Report</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Custom Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Q3 Carbon Audit Report"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-eco-500 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={generating}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-eco-600 to-teal-500 hover:from-eco-500 hover:to-teal-400 text-white font-medium text-xs shadow-glow-eco flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {generating ? (
                  <span>Generating Report...</span>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    Compile Report
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Generated Reports Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold font-display text-white">Generated Report History</h3>
            {loading ? (
              <div className="glass-panel p-8 text-center text-xs text-slate-400">Loading reports...</div>
            ) : (
              <ReportsTable reports={reports} />
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
