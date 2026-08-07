import React from 'react';
import { FileText, Download, Calendar, FileSpreadsheet, Zap, Droplets, Trash2, CheckCircle2 } from 'lucide-react';
import { exportReportToPDF, exportReportToCSV } from '../utils/exportHelpers';

export default function ReportsTable({ reports = [] }) {
  if (!reports || reports.length === 0) {
    return (
      <div className="glass-panel p-8 rounded-2xl text-center space-y-3">
        <FileText className="w-8 h-8 text-slate-500 mx-auto" />
        <h4 className="text-sm font-semibold text-white">No Resource Audit Logs Recorded Yet</h4>
        <p className="text-xs text-slate-400">Add resource usage entries in 'Upload & Add Data' to populate verified statutory audit records.</p>
      </div>
    );
  }

  const handleSingleExportPDF = (log) => {
    exportReportToPDF({
      title: `Resource Audit Entry #${log.id}`,
      type: 'Statutory Audit Record',
      start_date: log.date,
      end_date: log.date,
      created_at: log.timestamp || new Date().toISOString(),
      summary_data: {
        total_co2_kg: log.total_co2_kg,
        total_electricity_kwh: log.electricity_kwh,
        total_water_liters: log.water_liters,
        total_waste_kg: log.waste_kg,
        scope1_kg: log.scope1_kg,
        scope2_kg: log.scope2_kg,
        scope3_kg: log.scope3_kg
      }
    });
  };

  const handleSingleExportCSV = (log) => {
    exportReportToCSV({
      title: `Resource Audit Entry #${log.id}`,
      type: 'Statutory Audit Record',
      start_date: log.date,
      end_date: log.date,
      created_at: log.timestamp || new Date().toISOString(),
      summary_data: {
        total_co2_kg: log.total_co2_kg,
        total_electricity_kwh: log.electricity_kwh,
        total_water_liters: log.water_liters,
        total_waste_kg: log.waste_kg,
        scope1_kg: log.scope1_kg,
        scope2_kg: log.scope2_kg,
        scope3_kg: log.scope3_kg
      }
    });
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
            <tr>
              <th className="p-4">Audit Entry Date</th>
              <th className="p-4">Electricity</th>
              <th className="p-4">Water Supply</th>
              <th className="p-4">Solid Waste</th>
              <th className="p-4">Scope Breakdown</th>
              <th className="p-4">Net CO2 Footprint</th>
              <th className="p-4 text-right">Download Export</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {reports.map((log) => {
              const totalCo2 = log.total_co2_kg ?? log.calculated_co2_kg ?? (log.summary_data?.total_co2_kg || 0);
              const electricity = log.electricity_kwh ?? log.summary_data?.total_electricity_kwh ?? 0;
              const water = log.water_liters ?? log.summary_data?.total_water_liters ?? 0;
              const waste = log.waste_kg ?? log.summary_data?.total_waste_kg ?? 0;
              const logDate = log.date || (log.created_at ? new Date(log.created_at).toLocaleDateString() : 'Recent');

              return (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-medium text-slate-200 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-eco-400 flex-shrink-0" />
                    <div>
                      <span className="block font-bold text-white">{logDate}</span>
                      <span className="text-[10px] text-slate-500 font-mono">ID: {log.id}</span>
                    </div>
                  </td>

                  <td className="p-4 text-slate-300 font-mono">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      {electricity} kWh
                    </span>
                  </td>

                  <td className="p-4 text-slate-300 font-mono">
                    <span className="flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5 text-blue-400" />
                      {water} L
                    </span>
                  </td>

                  <td className="p-4 text-slate-300 font-mono">
                    <span className="flex items-center gap-1">
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      {waste} kg
                    </span>
                  </td>

                  <td className="p-4 text-slate-400">
                    <div className="space-y-0.5 text-[10px] font-mono">
                      <span className="block text-rose-400">Scope 1: {log.scope1_kg || 0} kg</span>
                      <span className="block text-amber-400">Scope 2: {log.scope2_kg || 0} kg</span>
                      <span className="block text-emerald-400">Scope 3: {log.scope3_kg || 0} kg</span>
                    </div>
                  </td>

                  <td className="p-4 font-extrabold text-emerald-400 font-mono text-sm">
                    {totalCo2} kg CO2e
                  </td>

                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleSingleExportPDF(log)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 transition-all inline-flex items-center gap-1 font-bold text-[11px] cursor-pointer"
                      title="Export PDF Audit Report"
                    >
                      <Download className="w-3.5 h-3.5" />
                      PDF
                    </button>
                    <button
                      onClick={() => handleSingleExportCSV(log)}
                      className="px-2.5 py-1.5 rounded-lg bg-teal-600/20 hover:bg-teal-600 text-teal-300 hover:text-white border border-teal-500/40 transition-all inline-flex items-center gap-1 font-bold text-[11px] cursor-pointer"
                      title="Export CSV Audit Spreadsheet"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      CSV
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
