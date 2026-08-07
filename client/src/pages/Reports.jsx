import React, { useState, useEffect } from 'react';
import { FileText, PlusCircle, Download, FileSpreadsheet, Sparkles, Calendar, CheckCircle2, CloudRain, FileUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import ReportsTable from '../components/ReportsTable';
import { auditStore } from '../services/auditStore';
import { authService } from '../services/authService';

export default function Reports() {
  const [summary, setSummary] = useState(() => auditStore.getSummary());
  const currentUser = authService.getCurrentUser();
  const [successMsg, setSuccessMsg] = useState('');

  const syncAuditData = () => {
    setSummary(auditStore.getSummary());
  };

  useEffect(() => {
    syncAuditData();
    window.addEventListener('ecomind_audit_updated', syncAuditData);
    window.addEventListener('storage', syncAuditData);
    return () => {
      window.removeEventListener('ecomind_audit_updated', syncAuditData);
      window.removeEventListener('storage', syncAuditData);
    };
  }, []);

  const handleExportCSV = () => {
    if (!summary.hasData || summary.logs.length === 0) return;

    const headers = ['ID', 'Date', 'Electricity (kWh)', 'Water (Liters)', 'Waste (kg)', 'Fuel (L)', 'Scope 1 (kg)', 'Scope 2 (kg)', 'Scope 3 (kg)', 'Total CO2 (kg)'];
    const rows = summary.logs.map(l => [
      l.id,
      l.date,
      l.electricity_kwh,
      l.water_liters,
      l.waste_kg,
      l.fuel_liters,
      l.scope1_kg,
      l.scope2_kg,
      l.scope3_kg,
      l.total_co2_kg
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EcoMind_Carbon_Audit_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSuccessMsg('✅ Audit Report CSV exported successfully!');
    setTimeout(() => setSuccessMsg(''), 5000);
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
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  SEBI BRSR Statutory Audit Compliance
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {summary.hasData ? `${summary.recordCount} Audit Logs Verified` : '0 Logs Recorded'}
                </span>
              </div>
              <h1 className="text-2xl font-bold font-display text-white mt-1 flex items-center gap-2">
                <FileText className="w-6 h-6 text-eco-400" />
                Sustainability & BRSR Reports Core
              </h1>
              <p className="text-xs text-slate-400">
                Statutory audit reports calculated strictly from user-entered resource usage.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                disabled={!summary.hasData}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-eco-600 to-teal-500 hover:from-eco-500 hover:to-teal-400 text-white font-bold text-xs shadow-glow-eco flex items-center gap-2 transition-all disabled:opacity-40 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Export CSV Audit Log
              </button>
            </div>
          </div>

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* User Data Summary Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Logged Footprint</span>
              <span className="text-2xl font-extrabold text-white font-mono">{summary.hasData ? `${summary.totalCO2} kg` : '0.0 kg'}</span>
              <span className="text-[11px] text-emerald-400 block font-mono">{summary.totalCO2Tons} Tons CO2e</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Scope 1 Direct</span>
              <span className="text-2xl font-extrabold text-white font-mono">{summary.hasData ? `${summary.scope1} kg` : '0.0 kg'}</span>
              <span className="text-[11px] text-slate-400 block">Fuel & Gas</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Scope 2 Electricity</span>
              <span className="text-2xl font-extrabold text-white font-mono">{summary.hasData ? `${summary.scope2} kg` : '0.0 kg'}</span>
              <span className="text-[11px] text-slate-400 block">{summary.totalElectricity} kWh grid</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Scope 3 Indirect</span>
              <span className="text-2xl font-extrabold text-white font-mono">{summary.hasData ? `${summary.scope3} kg` : '0.0 kg'}</span>
              <span className="text-[11px] text-slate-400 block">Water & Waste</span>
            </div>
          </div>

          {/* User Audit Records Table Component */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-eco-400" />
              Verified User Resource Audit Records
            </h3>

            {!summary.hasData ? (
              <div className="p-8 text-center space-y-3">
                <CloudRain className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-400">No audit records logged yet by current user.</p>
                <Link
                  to="/add-data"
                  className="inline-block px-4 py-2 rounded-xl bg-eco-600 hover:bg-eco-500 text-white font-bold text-xs transition-all shadow-glow-eco"
                >
                  + Add First Audit Record
                </Link>
              </div>
            ) : (
              <ReportsTable reports={summary.logs} />
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
