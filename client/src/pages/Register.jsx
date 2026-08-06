import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, User, Mail, Lock, Building2, UserPlus, AlertCircle, Scan, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/authService';
import FaceRecognitionScanner from '../components/FaceRecognitionScanner';

export default function Register() {
  const navigate = useNavigate();
  const [authMethod, setAuthMethod] = useState('password'); // 'password' | 'face'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    organization: '',
  });

  const [faceBiometricData, setFaceBiometricData] = useState(null);
  const [isFaceCaptured, setIsFaceCaptured] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleFaceCaptured = (biometricSnapshot) => {
    setFaceBiometricData(biometricSnapshot);
    setIsFaceCaptured(true);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email) {
      setError('Please enter your full name and email address.');
      return;
    }

    if (authMethod === 'password' && (!formData.password || formData.password.length < 6)) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (authMethod === 'face' && !isFaceCaptured) {
      setError('Please complete the Face Recognition scan before submitting.');
      return;
    }

    setLoading(true);

    const newUserObject = {
      id: `usr_${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      organization: formData.organization.trim() || 'EcoMind Enterprise',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      face_enrolled: Boolean(isFaceCaptured || faceBiometricData)
    };

    try {
      const res = await authService.register({
        ...formData,
        password: formData.password || 'face_id_secured_123',
        face_biometric_data: faceBiometricData
      });

      if (res.token) {
        localStorage.setItem('ecomind_token', res.token);
        localStorage.setItem('ecomind_user', JSON.stringify(res.user || newUserObject));
      } else {
        localStorage.setItem('ecomind_token', 'demo_token_123');
        localStorage.setItem('ecomind_user', JSON.stringify(newUserObject));
      }

      // Save user into registered users list so Face ID login looks up their real registered name!
      const registeredUsers = JSON.parse(localStorage.getItem('ecomind_registered_users') || '[]');
      const filtered = registeredUsers.filter(u => u.email !== newUserObject.email);
      filtered.push(newUserObject);
      localStorage.setItem('ecomind_registered_users', JSON.stringify(filtered));

      window.dispatchEvent(new Event('storage'));
      navigate('/dashboard');
    } catch (err) {
      console.warn('Register fallback handling:', err);
      localStorage.setItem('ecomind_token', 'demo_token_123');
      localStorage.setItem('ecomind_user', JSON.stringify(newUserObject));

      const registeredUsers = JSON.parse(localStorage.getItem('ecomind_registered_users') || '[]');
      const filtered = registeredUsers.filter(u => u.email !== newUserObject.email);
      filtered.push(newUserObject);
      localStorage.setItem('ecomind_registered_users', JSON.stringify(filtered));

      window.dispatchEvent(new Event('storage'));
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-eco-600/15 via-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 z-10">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-eco-600 via-emerald-500 to-teal-400 p-0.5 shadow-glow-eco flex items-center justify-center">
            <div className="w-full h-full bg-dark-bg rounded-[14px] flex items-center justify-center">
              <Leaf className="w-6 h-6 text-eco-400" />
            </div>
          </div>
        </Link>
        <h2 className="text-3xl font-extrabold font-display tracking-tight text-white">Create EcoMind Account</h2>
        <p className="text-xs text-slate-400">Register with Password or Face ID Biometric Recognition</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="glass-panel py-8 px-6 shadow-2xl rounded-3xl border border-slate-800 space-y-6">
          {/* Method Selection Switcher Bar */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => { setAuthMethod('password'); setError(''); }}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                authMethod === 'password'
                  ? 'bg-eco-600 text-white shadow-glow-eco scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Lock className="w-4 h-4" /> Email & Password
            </button>
            <button
              type="button"
              onClick={() => { setAuthMethod('face'); setError(''); }}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                authMethod === 'face'
                  ? 'bg-eco-600 text-white shadow-glow-eco scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Scan className="w-4 h-4 text-emerald-400" /> Face ID Biometric
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2.5 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Kavya Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-eco-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@organization.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-eco-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Organization / Company Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="organization"
                  placeholder="EcoMind Enterprise"
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-eco-500 text-sm"
                />
              </div>
            </div>

            {authMethod === 'password' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Account Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-eco-500 text-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Mandatory Face ID Biometric Recognition Enrolment
                </label>
                <FaceRecognitionScanner onScanComplete={handleFaceCaptured} mode="register" />
                
                {isFaceCaptured && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Facial mesh registered for <strong>{formData.name || 'User'}</strong>! Click Create Account below.</span>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-eco-600 via-emerald-500 to-teal-500 hover:from-eco-500 hover:to-teal-400 text-white font-bold shadow-glow-eco transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              {loading ? 'Creating Account & Enrolling Face ID...' : `Register Account as ${formData.name || 'User'}`}
            </button>
          </form>

          <div className="text-center text-xs text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="text-eco-400 font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
