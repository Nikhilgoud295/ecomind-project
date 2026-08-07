import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, User, Mail, Lock, Building2, UserPlus, AlertCircle, Scan, ShieldCheck, CheckCircle2, LockKeyhole, RefreshCw } from 'lucide-react';
import { authService, validateEmailSyntax } from '../services/authService';
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

  const handleFaceCaptured = (biometricSnapshot, passed, reason) => {
    if (!passed) {
      setIsFaceCaptured(false);
      setFaceBiometricData(null);
      setError(`❌ Biometric Enrolment Failed: ${reason || 'Clear lighting and facing camera required.'}`);
      return;
    }
    setFaceBiometricData(biometricSnapshot);
    setIsFaceCaptured(true);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    // 1. Strict Email Syntax & Typo Check
    const emailCheck = validateEmailSyntax(formData.email);
    if (!emailCheck.valid) {
      setError(emailCheck.message);
      return;
    }

    // 2. Check duplicate registration
    const registeredUsers = JSON.parse(localStorage.getItem('ecomind_registered_users') || '[]');
    const existingUser = registeredUsers.find(u => u.email === emailCheck.email);
    if (existingUser) {
      setError(`❌ Account Already Exists: An account with email "${emailCheck.email}" is already registered. Please Sign In.`);
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
      email: emailCheck.email,
      organization: formData.organization.trim() || 'EcoMind Enterprise',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      face_enrolled: Boolean(isFaceCaptured || faceBiometricData)
    };

    try {
      const res = await authService.register({
        name: formData.name.trim(),
        email: emailCheck.email,
        password: formData.password || 'face_id_secured_123',
        organization: formData.organization.trim() || 'EcoMind Enterprise',
        face_biometric_data: faceBiometricData
      });

      if (res.token) {
        localStorage.setItem('ecomind_token', res.token);
        localStorage.setItem('ecomind_user', JSON.stringify(res.user || newUserObject));
      } else {
        localStorage.setItem('ecomind_token', 'demo_token_123');
        localStorage.setItem('ecomind_user', JSON.stringify(newUserObject));
      }

      // Save user into registered users list so login checks their account!
      const filtered = registeredUsers.filter(u => u.email !== newUserObject.email);
      filtered.push(newUserObject);
      localStorage.setItem('ecomind_registered_users', JSON.stringify(filtered));

      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('ecomind_user_updated'));
      navigate('/dashboard');
    } catch (err) {
      console.warn('Register fallback handling:', err);
      localStorage.setItem('ecomind_token', 'demo_token_123');
      localStorage.setItem('ecomind_user', JSON.stringify(newUserObject));

      const filtered = registeredUsers.filter(u => u.email !== newUserObject.email);
      filtered.push(newUserObject);
      localStorage.setItem('ecomind_registered_users', JSON.stringify(filtered));

      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('ecomind_user_updated'));
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-eco-600 via-emerald-500 to-teal-400 p-0.5 shadow-glow-eco flex items-center justify-center transition-all duration-300 group-hover:scale-110">
            <div className="w-full h-full bg-dark-bg rounded-[14px] flex items-center justify-center">
              <Leaf className="w-6 h-6 text-eco-400 group-hover:animate-bounce" />
            </div>
          </div>
          <span className="text-3xl font-extrabold font-display text-white tracking-tight">EcoMind <span className="text-eco-400 font-mono">AI</span></span>
        </Link>
        <h2 className="text-xl font-bold font-display text-slate-200">Create New Account</h2>
        <p className="text-xs text-slate-400">Join enterprise sustainability teams tracking Scope 1, 2 & 3 emissions.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="glass-panel py-8 px-6 sm:px-10 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          
          {/* Method Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <button
              type="button"
              onClick={() => { setAuthMethod('password'); setError(''); }}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMethod === 'password'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LockKeyhole className="w-4 h-4 text-emerald-400" /> Password Sign Up
            </button>
            <button
              type="button"
              onClick={() => { setAuthMethod('face'); setError(''); }}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMethod === 'face'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Scan className="w-4 h-4 text-teal-400" /> Face ID Enrolment
            </button>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-2.5 text-xs font-semibold animate-fade-in shadow-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nikhil Goud"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-eco-500 text-xs font-semibold"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Work Email Address</span>
                <span className="text-[10px] text-eco-400 font-mono">Syntax Validation Active</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="user@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-eco-500 text-xs font-mono"
                />
              </div>
            </div>

            {/* Organization */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Organization / Company</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="EcoMind Enterprise"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-eco-500 text-xs font-semibold"
                />
              </div>
            </div>

            {authMethod === 'password' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-eco-500 text-xs font-mono"
                  />
                </div>
              </div>
            )}

            {authMethod === 'face' && (
              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <span>Enrol Face ID: Position your face clearly in webcam frame.</span>
                </div>

                <FaceRecognitionScanner
                  onCapture={handleFaceCaptured}
                  isEnrolling={true}
                />
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-eco-600 via-emerald-500 to-teal-500 hover:from-eco-500 hover:to-teal-400 text-white font-bold text-xs shadow-glow-eco flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] cursor-pointer"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" /> Create Account & Start Audit
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="border-t border-slate-800 pt-4 text-center">
            <p className="text-xs text-slate-400">
              Already have an enterprise account?{' '}
              <Link to="/login" className="font-bold text-eco-400 hover:text-eco-300 underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
