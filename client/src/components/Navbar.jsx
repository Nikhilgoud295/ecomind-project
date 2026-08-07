import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, LogOut, User, Bell, Settings, BarChart3, FileUp, Sparkles, Newspaper, FileText, Check, ShieldAlert, AlertTriangle, Zap, Menu, X, LogIn, UserPlus, Award } from 'lucide-react';
import { authService } from '../services/authService';

export default function Navbar() {
  const navigate = useNavigate();
  
  // Real-time reactive user state
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated());

  // Real-time user points balance
  const [userPoints, setUserPoints] = useState(() => {
    const email = authService.getCurrentUser()?.email?.toLowerCase().trim() || 'default';
    const saved = localStorage.getItem(`ecomind_user_points_${email}`);
    return saved !== null ? parseInt(saved, 10) : 120;
  });

  useEffect(() => {
    const syncUserState = () => {
      const user = authService.getCurrentUser();
      setCurrentUser(user);
      setIsAuthenticated(authService.isAuthenticated());

      const email = user?.email?.toLowerCase().trim() || 'default';
      const saved = localStorage.getItem(`ecomind_user_points_${email}`);
      setUserPoints(saved !== null ? parseInt(saved, 10) : 120);
    };

    syncUserState();
    window.addEventListener('storage', syncUserState);
    window.addEventListener('ecomind_user_updated', syncUserState);
    window.addEventListener('ecomind_points_updated', syncUserState);
    return () => {
      window.removeEventListener('storage', syncUserState);
      window.removeEventListener('ecomind_user_updated', syncUserState);
      window.removeEventListener('ecomind_points_updated', syncUserState);
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
      title: 'Scope 1 Fuel Anomaly Detected',
      message: 'Diesel fuel consumption spiked by 18.5 Liters during morning commute.',
      time: '3 hours ago',
      read: false
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { label: 'Upload & Record', path: '/add-data', icon: FileUp },
    { label: 'Analytics & Trends', path: '/analytics', icon: BarChart3 },
    { label: 'AI Advisor', path: '/ai-advisor', badge: 'Gemini', icon: Sparkles },
    { label: 'Rewards & Badges', path: '/rewards', badge: 'Top 1%', icon: Award },
    { label: 'Intelligence Hub', path: '/intelligence-hub', badge: 'Enterprise', icon: Newspaper },
    { label: 'Reports Export', path: '/reports', icon: FileText },
  ];

  return (
    <nav className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 bg-dark-bg/90 backdrop-blur-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <Link
            to="/dashboard"
            className="flex items-center gap-3 group transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-eco-600 via-emerald-500 to-teal-400 p-0.5 shadow-glow-eco group-hover:shadow-glow-eco-lg transition-all duration-500">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-emerald-400 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500" />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold font-display tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  EcoMind
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-eco-500/20 text-eco-400 border border-eco-500/30">
                  AI
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest -mt-1 hidden sm:inline">
                Enterprise ESG Copilot
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.slice(0, 5).map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all duration-200 flex items-center gap-1.5"
                >
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-eco-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Dynamic User Profile & Interactive Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-3 relative">
                {/* Rewards & Performance Appreciation Badge Button */}
                <Link
                  to="/rewards"
                  className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border border-emerald-500/40 hover:border-emerald-400 transition-all duration-300 hover:scale-105 shadow-md"
                  title="Performance Rewards Core"
                >
                  <Award className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-mono font-bold text-emerald-300">{userPoints} pts</span>
                </Link>

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

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="group p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-all duration-300 hover:scale-110 active:scale-95 relative cursor-pointer"
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
                            className="text-[10px] text-eco-400 hover:text-eco-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
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
                  className="group p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800/80 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
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
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-slate-800 px-4 pt-2 pb-4 space-y-2 animate-fade-in">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-eco-400" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-eco-500/20 text-eco-400 font-bold border border-eco-500/30">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
