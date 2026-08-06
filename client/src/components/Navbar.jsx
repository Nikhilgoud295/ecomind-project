import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, LogOut, User, Settings, Sparkles, Menu, X, BarChart3, PlusCircle, FileUp, FileText, Newspaper } from 'lucide-react';
import { authService } from '../services/authService';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentUser = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/add-data', label: 'Upload & Add Data', icon: FileUp },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/ai-advisor', label: 'AI Advisor', icon: Sparkles },
    { path: '/eco-news', label: 'Intelligence Hub', icon: Newspaper },
    { path: '/reports', label: 'Reports', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 backdrop-blur-md bg-dark-bg/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-eco-600 via-emerald-500 to-teal-400 p-0.5 shadow-glow-eco flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-dark-bg rounded-[10px] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-eco-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-1.5">
                EcoMind <span className="text-xs px-2 py-0.5 rounded-full bg-eco-500/20 text-eco-400 border border-eco-500/30">AI</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/80">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'bg-eco-600 text-white shadow-md shadow-eco-900/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* User Profile & Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 hover:border-eco-500/40 transition-colors"
                >
                  <img
                    src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                    alt={currentUser?.name || 'User'}
                    className="w-7 h-7 rounded-full object-cover border border-eco-500/40"
                  />
                  <span className="text-sm font-medium text-slate-200">{currentUser?.name?.split(' ')[0] || 'User'}</span>
                </Link>
                <Link
                  to="/settings"
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
                  title="Settings"
                >
                  <Settings className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800/60 transition-colors"
                  title="Log Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-eco-600 to-teal-500 hover:from-eco-500 hover:to-teal-400 text-white shadow-glow-eco transition-all transform hover:-translate-y-0.5"
                >
                  Get Started Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-dark-bg/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-3">
          {isAuthenticated ? (
            <>
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    <Icon className="w-5 h-5 text-eco-400" />
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser?.avatar_url}
                    alt={currentUser?.name}
                    className="w-8 h-8 rounded-full border border-eco-500"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{currentUser?.name}</span>
                    <span className="text-xs text-slate-400">{currentUser?.email}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-rose-400 hover:bg-slate-800 rounded-lg"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg border border-slate-700 text-slate-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg bg-eco-600 text-white font-medium shadow-glow-eco"
              >
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
