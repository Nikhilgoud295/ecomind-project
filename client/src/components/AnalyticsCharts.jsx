import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart3, CloudRain } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AnalyticsCharts({ summary }) {
  const [activeTab, setActiveTab] = useState('emissions');

  const hasData = summary?.hasData && summary?.logs?.length > 0;
  const logs = summary?.logs || [];

  // Build real-time chart data directly from user's logged entries
  const chartData = hasData
    ? logs.slice().reverse().map(l => ({
        date: l.date,
        co2: l.total_co2_kg,
        electricity: l.electricity_kwh,
        water: l.water_liters,
        waste: l.waste_kg,
        scope1: l.scope1_kg,
        scope2: l.scope2_kg,
        scope3: l.scope3_kg,
      }))
    : [];

  const pieData = hasData
    ? [
        { name: 'Scope 1 (Direct Fuel)', value: summary.scope1 || 1, color: '#ef4444' },
        { name: 'Scope 2 (Electricity)', value: summary.scope2 || 1, color: '#f59e0b' },
        { name: 'Scope 3 (Water & Waste)', value: summary.scope3 || 1, color: '#10b981' },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Chart Selector Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
        <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-eco-400" />
          Sustainability Analytics & Visualizations
        </h3>
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          {[
            { id: 'emissions', label: 'CO2 Trend' },
            { id: 'energy', label: 'Electricity & Water' },
            { id: 'waste', label: 'Waste Log' },
            { id: 'breakdown', label: 'Scope Breakdown' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-eco-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Active Chart View */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 h-80 flex flex-col justify-center">
        {!hasData ? (
          <div className="text-center space-y-3 p-6">
            <CloudRain className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400 font-medium">
              No carbon audit logs recorded yet. Add your resource data to generate real-time analytics.
            </p>
            <Link
              to="/add-data"
              className="inline-block px-4 py-2 rounded-xl bg-eco-600 hover:bg-eco-500 text-white font-bold text-xs transition-all shadow-glow-eco"
            >
              + Log Resource Usage
            </Link>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === 'emissions' && (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="co2Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} unit=" kg" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="co2" name="Net CO2 (kg)" stroke="#10b981" strokeWidth={2.5} fill="url(#co2Grad)" />
              </AreaChart>
            )}

            {activeTab === 'energy' && (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="electricity" name="Electricity (kWh)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="water" name="Water (Liters)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}

            {activeTab === 'waste' && (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} unit=" kg" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="waste" name="Waste (kg)" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}

            {activeTab === 'breakdown' && (
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
