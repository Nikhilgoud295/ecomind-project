import React from 'react';
import { FileText, Download, Calendar, Eye, FileSpreadsheet } from 'lucide-react';
import { exportReportToPDF, exportReportToCSV } from '../utils/exportHelpers';

export default function ReportsTable({ reports = [], onViewReport }) {
  if (!reports || reports.length === 0) {
    return (
      <div className="glass-panel p-8 rounded-2xl text-center space-y-3">
        <FileText className="w-8 h-8 text-slate-500 mx-auto" />
        <h4 className="text-sm font-semibold text-white">No Reports Generated Yet</h4>
        <p className="text-xs text-slate-400">Click 'Generate Report' above to create a PDF or CSV audit report.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
            <tr>
              <th className="p-4">Report Title</th>
              <th className="p-4">Type</th>
              <th className="p-4">Period</th>
              <th className="p-4">Total Net CO2</th>
              <th className="p-4">Created Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4 font-medium text-slate-200 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-eco-400 flex-shrink-0" />
                  <span>{report.title}</span>
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-eco-500/20 text-eco-300 border border-eco-500/30">
                    {report.type}
                  </span>
                </td>
                <td className="p-4 text-slate-400">
                  {report.start_date} to {report.end_date}
                </td>
                <td className="p-4 font-semibold text-emerald-400">
                  {report.summary_data?.total_co2_kg || 0} kg CO2e
                </td>
                <td className="p-4 text-slate-400">
                  {new Date(report.created_at).toLocaleDateString()}
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => exportReportToPDF(report)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 transition-colors inline-flex items-center gap-1 font-medium"
                    title="Export PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    PDF
                  </button>
                  <button
                    onClick={() => exportReportToCSV(report)}
                    className="px-2.5 py-1 rounded-lg bg-teal-600/20 hover:bg-teal-600 text-teal-300 hover:text-white border border-teal-500/40 transition-colors inline-flex items-center gap-1 font-medium"
                    title="Export CSV"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    CSV
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
