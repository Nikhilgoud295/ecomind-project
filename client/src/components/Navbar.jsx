import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, LogOut, User, Bell, Settings, BarChart3, FileUp, Sparkles, Newspaper, FileText, Check, ShieldAlert, AlertTriangle, Zap, Menu, X, LogIn, UserPlus } from 'lucide-react';
import { authService } from '../services/authService';

export default function Navbar() {
  const navigate = useNavigate();
  
  // Real-time reactive user state
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated());

  useEffect(() => {
    const syncUserState = () => {
      setCurrentUser(authService.getCurrentUser());
      setIsAuthenticated(authService.isAuthenticated());
    };

    window.addEventListener('storage', syncUserState);
    window.addEventListener('ecomind_user_updated', syncUserState);
    return () => {
      window.removeEventListener('storage', syncUserState);
      window.removeEventListener('ecomind_user_updated', syncUserState);
    };
  }, []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Real-time environmental alerts notification panel state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'notif_1',
      type: 'warning',
      title: 'High Peak Electricity Consumption',
      message: 'Grid usage peaked at 81.7 kWh today (+12% above daily baseline).',
      time: '10 mins ago',
      read: false
    },
    {
      id: 'notif_2',
      type: 'info',
      title: 'SEBI BRSR Filing Reminder',
      message: 'Q3 BRSR Core statutory compliance cutoff is in 14 days.',
      time: '1 hour ago',
      read: false
    },
    {
      id: 'notif_3',
      type: 'alert',
      title: 'Water Aerator Savings Detected',
      message: 'Tap aerator retrofits saved approximately 140L clean water this week.',
      time: '3 hours ago',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    window.dispatchEvent(new Event('ecomind_user_updated'));
    navigate('/');
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
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 backdrop-blur-md bg-dark-bg/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Static Clean Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-eco-600 via-emerald-500 to-teal-400 p-0.5 shadow-glow-eco flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
              <div className="w-full h-full bg-dark-bg rounded-[10px] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-eco-400 group-hover:animate-bounce" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-1.5">
                EcoMind <span className="text-xs px-2 py-0.5 rounded-full bg-eco-500/20 text-eco-400 border border-eco-500/30 group-hover:bg-eco-500/40 transition-colors">AI</span>
              </span>
            </div>
          </Link>

          {/* Dynamic User Profile & Interactive Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-3 relative">
                {/* User Profile Link */}
                <Link
                  to="/profile"
                  className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 hover:border-eco-500/60 hover:bg-slate-800 transition-all duration-300 hover:scale-105"
                >
                  <img
                    src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                    alt={currentUser?.name || 'User'}
                    className="w-7 h-7 rounded-full object-cover border border-eco-500/40 group-hover:ring-2 group-hover:ring-eco-400 group-hover:scale-110 transition-all duration-300"
                  />
                  <span className="text-sm font-medium text-slate-200 group-hover:text-white font-display">
                    {currentUser?.name?.split(' ')[0] || 'User'}
                  </span>
                </Link>

                {/* Notifications Bell (POSITIONED LEFT OF SETTINGS) */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="group p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-all duration-300 hover:scale-110 active:scale-95 relative"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5 group-hover:text-eco-400 group-hover:animate-bounce transition-colors" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-slate-900 animate-pulse"></span>
                    )}
                  </button>

                  {/* Notifications Dropdown Panel */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 glass-panel bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl z-50 p-4 space-y-3 animate-fade-in backdrop-blur-xl">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-eco-400" />
                          <h4 className="text-xs font-bold text-white">Environmental Notifications</h4>
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-[10px] text-eco-400 hover:text-eco-300 font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Check className="w-3 h-3" /> Mark all read
                          </button>
                        )}
                      </div>

                      <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-thin">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-3 rounded-xl border text-xs space-y-1 transition-colors ${
                              n.read
                                ? 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                                : 'bg-slate-900 border-slate-700 text-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between font-bold text-white text-[11px]">
                              <span className="flex items-center gap-1.5">
                                {n.type === 'warning' && <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />}
                                {n.type === 'alert' && <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
                                {n.type === 'info' && <Zap className="w-3.5 h-3.5 text-eco-400" />}
                                {n.title}
                              </span>
                              <span className="text-[9px] text-slate-500 font-mono">{n.time}</span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-snug">{n.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Settings Gear Button */}
                <Link
                  to="/profile"
                  className="group p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-all duration-300 hover:scale-110 active:scale-95"
                  title="Settings & Profile"
                >
                  <Settings className="w-5 h-5 group-hover:text-eco-400 group-hover:rotate-90 transition-transform duration-500" />
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="group p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800/80 transition-all duration-300 hover:scale-110 active:scale-95"
                  title="Log Out"
                >
                  <LogOut className="w-5 h-5 group-hover:translate-x-1 group-hover:text-rose-400 transition-all duration-300" />
                </button>
              </div>
            ) : (
              /* DYNAMIC LOGGED-OUT SIGN IN & REGISTER BUTTONS */
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="group px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-800/70 hover:bg-slate-800 border border-slate-700 hover:border-eco-500/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-md"
                >
                  <LogIn className="w-4 h-4 text-eco-400 group-hover:scale-110 group-hover:translate-x-0.5 transition-transform" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="group px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-eco-600 via-emerald-500 to-teal-500 hover:from-eco-500 hover:to-teal-400 text-white shadow-glow-eco transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
                  <span>Create Account</span>
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
          {isAuthenticated && currentUser ? (
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
                    src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                    alt={currentUser?.name}
                    className="w-9 h-9 rounded-full object-cover border border-eco-500"
                  />
                  <div>
                    <span className="text-sm font-semibold text-white block">{currentUser?.name}</span>
                    <span className="text-xs text-slate-400 block">{currentUser?.email}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
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
                className="w-full py-2.5 rounded-xl bg-slate-800 text-white font-bold text-center text-sm border border-slate-700 flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4 text-eco-400" /> Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-eco-600 to-teal-500 text-white font-bold text-center text-sm shadow-glow-eco flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" /> Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
