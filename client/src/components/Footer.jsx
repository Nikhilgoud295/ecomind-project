import React from 'react';
import { Leaf, Github, Twitter, Linkedin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="glass-panel border-t border-slate-800/80 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-eco-500/20 border border-eco-500/30 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-eco-400" />
              </div>
              <span className="text-lg font-bold font-display text-white">EcoMind AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering global organizations and individuals to reduce carbon emissions and optimize resource consumption with Google Gemini AI.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/dashboard" className="hover:text-eco-400 transition-colors">Dashboard</Link></li>
              <li><Link to="/add-data" className="hover:text-eco-400 transition-colors">Add Resource Data</Link></li>
              <li><Link to="/analytics" className="hover:text-eco-400 transition-colors">Analytics & Charts</Link></li>
              <li><Link to="/ai-advisor" className="hover:text-eco-400 transition-colors">AI Sustainability Advisor</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Resources & Reports</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/reports" className="hover:text-eco-400 transition-colors">Generate Reports</Link></li>
              <li><a href="#ghg-protocol" className="hover:text-eco-400 transition-colors">GHG Accounting Standards</a></li>
              <li><a href="#gemini-ai" className="hover:text-eco-400 transition-colors">Google Gemini Integration</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Tech Stack</h4>
            <div className="flex flex-wrap gap-1.5">
              {['React', 'Vite', 'Node.js', 'Express', 'Gemini AI', 'Supabase', 'Tailwind CSS', 'Zod', 'JWT', 'Recharts'].map((tech) => (
                <span key={tech} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} EcoMind AI. Built for Hackathon Excellence.</p>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white"><Github className="w-4 h-4" /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white"><Twitter className="w-4 h-4" /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white"><Linkedin className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
