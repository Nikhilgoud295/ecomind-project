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

export default function AnalyticsCharts({ chartData = [] }) {
  const [activeTab, setActiveTab] = useState('emissions');

  const defaultData = chartData.length > 0 ? chartData : [
    { date: 'Aug 01', co2: 17.8, electricity: 18.5, water: 140, waste: 3.2, renewable: 25, recycling: 40 },
    { date: 'Aug 02', co2: 24.1, electricity: 22.0, water: 165, waste: 4.1, renewable: 20, recycling: 35 },
    { date: 'Aug 03', co2: 9.3, electricity: 12.0, water: 95, waste: 1.8, renewable: 50, recycling: 70 },
    { date: 'Aug 04', co2: 13.6, electricity: 15.2, water: 110, waste: 2.5, renewable: 35, recycling: 50 },
    { date: 'Aug 05', co2: 11.4, electricity: 14.0, water: 105, waste: 2.0, renewable: 40, recycling: 60 },
  ];

  const pieData = [
    { name: 'Electricity CO2', value: 45, color: '#f59e0b' },
    { name: 'Fuel & Commute', value: 30, color: '#ef4444' },
    { name: 'Waste Disposal', value: 15, color: '#ec4899' },
    { name: 'Water Treatment', value: 10, color: '#3b82f6' },
  ];

  return (
    <div className="space-y-6">
      {/* Chart Selector Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
        <h3 className="text-base font-bold font-display text-white">Sustainability Analytics & Visualizations</h3>
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          {[
            { id: 'emissions', label: 'CO2 Trend' },
            { id: 'energy', label: 'Electricity & Water' },
            { id: 'waste', label: 'Waste & Recycling' },
            { id: 'breakdown', label: 'Impact Distribution' },
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

      {/* Main Active Chart */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 h-80">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'emissions' && (
            <AreaChart data={defaultData}>
              <defs>
                <linearGradient id="co2Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2e33" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} unit=" kg" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
              />
              <Area type="monotone" dataKey="co2" name="CO2 Emissions (kg)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#co2Grad)" />
            </AreaChart>
          )}

          {activeTab === 'energy' && (
            <LineChart data={defaultData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2e33" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
              />
              <Legend />
              <Line type="monotone" dataKey="electricity" name="Electricity (kWh)" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="water" name="Water (Liters)" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          )}

          {activeTab === 'waste' && (
            <BarChart data={defaultData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2e33" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="waste" name="Waste (kg)" fill="#ef4444" radius={[6, 6, 0, 0]} />
              <Bar dataKey="recycling" name="Recycling Rate (%)" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          )}

          {activeTab === 'breakdown' && (
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px' }} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
