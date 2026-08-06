import React, { useState } from 'react';
import { 
  Zap, 
  Droplets, 
  Trash2, 
  Fuel, 
  Bus, 
  Sun, 
  RefreshCw, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Edit3
} from 'lucide-react';
import { calculateCO2Emissions } from '../utils/calculations';

export default function ResourceForm({ onSubmit, initialValues, isSubmitting = false }) {
  const [formData, setFormData] = useState(initialValues || {
    date: new Date().toISOString().split('T')[0],
    electricity_kwh: '',
    water_liters: '',
    waste_kg: '',
    fuel_liters: '',
    public_transport_km: '',
    renewable_energy_pct: '0',
    recycling_pct: '0',
    notes: '',
  });

  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError('');
  };

  const calculated = calculateCO2Emissions(formData);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    const numericData = {
      date: formData.date,
      electricity_kwh: parseFloat(formData.electricity_kwh) || 0,
      water_liters: parseFloat(formData.water_liters) || 0,
      waste_kg: parseFloat(formData.waste_kg) || 0,
      fuel_liters: parseFloat(formData.fuel_liters) || 0,
      public_transport_km: parseFloat(formData.public_transport_km) || 0,
      renewable_energy_pct: parseFloat(formData.renewable_energy_pct) || 0,
      recycling_pct: parseFloat(formData.recycling_pct) || 0,
      notes: formData.notes,
    };

    if (
      numericData.electricity_kwh === 0 &&
      numericData.water_liters === 0 &&
      numericData.waste_kg === 0 &&
      numericData.fuel_liters === 0 &&
      numericData.public_transport_km === 0
    ) {
      setValidationError('Please enter at least one resource metric (Electricity, Water, Waste, Fuel, or Transport).');
      return;
    }

    onSubmit(numericData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form Header Banner */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-eco-400" />
            Manual Resource Usage Form
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Fill in your daily consumption figures below. Carbon emissions and offsets are calculated in real time.
          </p>
        </div>
        <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-eco-500/10 text-eco-400 border border-eco-500/20">
          Direct Input Mode
        </span>
      </div>

      {validationError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Real-time CO2 Preview Banner */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimated Carbon Impact</h4>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">{calculated.net} kg</span>
              <span className="text-xs text-emerald-400 font-bold">Net CO2 Equivalent</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400 border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-6 w-full sm:w-auto justify-around sm:justify-start">
          <div>
            <span className="block text-slate-500 text-[11px]">Gross Emissions</span>
            <span className="font-bold text-slate-200 text-sm">{calculated.gross} kg</span>
          </div>
          <div>
            <span className="block text-slate-500 text-[11px]">Eco Offsets</span>
            <span className="font-bold text-emerald-400 text-sm">-{(calculated.gross - calculated.net).toFixed(2)} kg</span>
          </div>
        </div>
      </div>

      {/* Date & Context Notes Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-eco-400" />
            Tracking Date *
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border-2 border-slate-700/80 text-white focus:outline-none focus:border-eco-500 focus:ring-1 focus:ring-eco-500 text-sm font-medium"
          />
          <p className="text-[11px] text-slate-400">Date when these resource metrics were consumed.</p>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            Activity Notes (Optional)
          </label>
          <input
            type="text"
            name="notes"
            placeholder="e.g. Household electricity, road trip commute"
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border-2 border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-eco-500 focus:ring-1 focus:ring-eco-500 text-sm font-medium"
          />
          <p className="text-[11px] text-slate-400">Optional description or context for your records.</p>
        </div>
      </div>

      {/* Resource Metrics Grid */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
          Enter Resource Quantities
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Electricity */}
          <div className="glass-panel p-4 rounded-2xl border-2 border-slate-800 hover:border-amber-500/50 transition-colors space-y-2 bg-slate-900/60">
            <label className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Electricity Usage
              </span>
              <span className="text-amber-400 text-xs font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">kWh</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="electricity_kwh"
              placeholder="e.g. 18.5"
              value={formData.electricity_kwh}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm font-semibold"
            />
            <p className="text-[10px] text-slate-400">Daily grid power consumed (kWh)</p>
          </div>

          {/* Water */}
          <div className="glass-panel p-4 rounded-2xl border-2 border-slate-800 hover:border-blue-500/50 transition-colors space-y-2 bg-slate-900/60">
            <label className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                Water Consumption
              </span>
              <span className="text-blue-400 text-xs font-mono font-bold bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">Liters</span>
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              name="water_liters"
              placeholder="e.g. 150"
              value={formData.water_liters}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-semibold"
            />
            <p className="text-[10px] text-slate-400">Clean water volume consumed (L)</p>
          </div>

          {/* Waste */}
          <div className="glass-panel p-4 rounded-2xl border-2 border-slate-800 hover:border-rose-500/50 transition-colors space-y-2 bg-slate-900/60">
            <label className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-400" />
                Waste Generated
              </span>
              <span className="text-rose-400 text-xs font-mono font-bold bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">kg</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="waste_kg"
              placeholder="e.g. 3.2"
              value={formData.waste_kg}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm font-semibold"
            />
            <p className="text-[10px] text-slate-400">Solid municipal trash (kg)</p>
          </div>

          {/* Fuel */}
          <div className="glass-panel p-4 rounded-2xl border-2 border-slate-800 hover:border-orange-500/50 transition-colors space-y-2 bg-slate-900/60">
            <label className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="flex items-center gap-2">
                <Fuel className="w-4 h-4 text-orange-400" />
                Fuel Usage
              </span>
              <span className="text-orange-400 text-xs font-mono font-bold bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">Liters</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="fuel_liters"
              placeholder="e.g. 4.5"
              value={formData.fuel_liters}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm font-semibold"
            />
            <p className="text-[10px] text-slate-400">Petrol or diesel consumed (L)</p>
          </div>

          {/* Public Transport */}
          <div className="glass-panel p-4 rounded-2xl border-2 border-slate-800 hover:border-teal-500/50 transition-colors space-y-2 bg-slate-900/60">
            <label className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="flex items-center gap-2">
                <Bus className="w-4 h-4 text-teal-400" />
                Public Transport
              </span>
              <span className="text-teal-400 text-xs font-mono font-bold bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">km</span>
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              name="public_transport_km"
              placeholder="e.g. 15.0"
              value={formData.public_transport_km}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm font-semibold"
            />
            <p className="text-[10px] text-slate-400">Bus, train, or metro distance (km)</p>
          </div>

          {/* Renewable Energy Share */}
          <div className="glass-panel p-4 rounded-2xl border-2 border-slate-800 hover:border-yellow-500/50 transition-colors space-y-2 bg-slate-900/60">
            <label className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-yellow-400" />
                Renewable Energy
              </span>
              <span className="text-yellow-400 text-xs font-mono font-bold bg-yellow-500/10 px-2 py-0.5 rounded-md border border-yellow-500/20">% Share</span>
            </label>
            <input
              type="number"
              min="0"
              max="100"
              name="renewable_energy_pct"
              placeholder="0 - 100"
              value={formData.renewable_energy_pct}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 text-sm font-semibold"
            />
            <p className="text-[10px] text-slate-400">Percentage clean solar/wind energy</p>
          </div>

          {/* Recycling Rate */}
          <div className="glass-panel p-4 rounded-2xl border-2 border-slate-800 hover:border-emerald-500/50 transition-colors space-y-2 bg-slate-900/60 sm:col-span-2 lg:col-span-1">
            <label className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                Recycling Rate
              </span>
              <span className="text-emerald-400 text-xs font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">% Diverted</span>
            </label>
            <input
              type="number"
              min="0"
              max="100"
              name="recycling_pct"
              placeholder="0 - 100"
              value={formData.recycling_pct}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-semibold"
            />
            <p className="text-[10px] text-slate-400">Percentage waste diverted to recycling</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-eco-600 via-emerald-500 to-teal-500 hover:from-eco-500 hover:to-teal-400 text-white font-bold text-sm shadow-glow-eco transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              Saving & Analyzing...
            </span>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Save Record & Generate Gemini Advice
            </>
          )}
        </button>
      </div>
    </form>
  );
}
