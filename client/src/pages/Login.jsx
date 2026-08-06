import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, LogIn, AlertCircle, Sparkles, Scan, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/authService';
import FaceRecognitionScanner from '../components/FaceRecognitionScanner';

export default function Login() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' | 'face'
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [faceBiometricData, setFaceBiometricData] = useState(null);
  const [isFaceVerified, setIsFaceVerified] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleDemoFill = () => {
    setFormData({
      email: 'nikhilgoudkeesari@gmail.com',
      password: 'Password123!',
    });
    setError('');
  };

  const handleFaceCaptured = (biometricSnapshot) => {
    setFaceBiometricData(biometricSnapshot);
    setIsFaceVerified(true);
    setError('');
  };

  const handleFaceLoginSubmit = async () => {
    if (!isFaceVerified || !faceBiometricData) {
      setError('Please start the AI Camera and scan your face first to verify biometrics.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.faceLogin({
        email: formData.email || 'nikhilgoudkeesari@gmail.com',
        face_biometric_data: faceBiometricData
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Face Login Error:', err);
      setError(err.response?.data?.message || 'Facial verification failed. Please scan your face again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (loginMethod === 'password') {
      if (!formData.email || !formData.password) {
        setError('Please fill in both email and password.');
        return;
      }

      setLoading(true);

      try {
        await authService.login(formData);
        navigate('/dashboard');
      } catch (err) {
        const serverMessage = err.response?.data?.message;
        if (serverMessage) {
          setError(serverMessage);
        } else {
          setError('Invalid login credentials. Please check your email and password.');
        }
      } finally {
        setLoading(false);
      }
    } else {
      handleFaceLoginSubmit();
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
        <h2 className="text-3xl font-extrabold font-display tracking-tight text-white">Sign In to EcoMind AI</h2>
        <p className="text-xs text-slate-400">Choose Email & Password or Face ID Biometric Sign In</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="glass-panel py-8 px-6 shadow-2xl rounded-3xl border border-slate-800 space-y-6">
          {/* Method Selection Switcher Bar */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => { setLoginMethod('password'); setError(''); }}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                loginMethod === 'password'
                  ? 'bg-eco-600 text-white shadow-glow-eco'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-4 h-4" /> Email & Password
            </button>
            <button
              type="button"
              onClick={() => { setLoginMethod('face'); setError(''); }}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                loginMethod === 'face'
                  ? 'bg-eco-600 text-white shadow-glow-eco'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Scan className="w-4 h-4 text-emerald-400" /> Face ID Biometric
            </button>
          </div>

          {/* Quick Demo Fill Banner */}
          {loginMethod === 'password' && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-eco-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-200">Testing & Reviewing?</span>
              </div>
              <button
                type="button"
                onClick={handleDemoFill}
                className="text-xs font-bold px-3 py-1 rounded-lg bg-eco-600 hover:bg-eco-500 text-white transition-colors"
              >
                Fill Demo Account
              </button>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2.5 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {loginMethod === 'password' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  Password
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-eco-600 via-emerald-500 to-teal-500 hover:from-eco-500 hover:to-teal-400 text-white font-semibold shadow-glow-eco transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Mandatory Facial Recognition Scanner */}
              <FaceRecognitionScanner onScanComplete={handleFaceCaptured} mode="login" />

              <button
                type="button"
                onClick={handleFaceLoginSubmit}
                disabled={loading || !isFaceVerified}
                className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm ${
                  isFaceVerified
                    ? 'bg-gradient-to-r from-eco-600 via-emerald-500 to-teal-500 text-white shadow-glow-eco hover:scale-[1.02]'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <span>Verifying Face Biometrics...</span>
                ) : isFaceVerified ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Face Verified — Click to Sign In
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Scan Face Above First to Sign In
                  </>
                )}
              </button>
            </div>
          )}

          <div className="text-center pt-2 text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-eco-400 font-semibold hover:underline">
              Create free account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
