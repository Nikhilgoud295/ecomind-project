import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col justify-center items-center px-4 text-center relative overflow-hidden">
      <div className="w-24 h-24 rounded-3xl bg-eco-500/10 border border-eco-500/30 flex items-center justify-center mb-6 shadow-glow-eco">
        <Leaf className="w-12 h-12 text-eco-400" />
      </div>

      <span className="text-sm font-bold font-mono text-eco-400 uppercase tracking-widest">404 Error</span>
      <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-white mt-2 mb-4">
        Sustainability Page Not Found
      </h1>
      <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-8 leading-relaxed">
        The requested EcoMind URL does not exist or has been relocated. Let's get you back on track to monitor your environmental footprint.
      </p>

      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="px-6 py-3 rounded-xl glass-panel border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white font-medium text-xs flex items-center gap-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Landing Page
        </Link>
        <Link
          to="/dashboard"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-eco-600 to-teal-500 hover:from-eco-500 hover:to-teal-400 text-white font-medium text-xs shadow-glow-eco flex items-center gap-2 transition-all"
        >
          <Home className="w-4 h-4" />
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
