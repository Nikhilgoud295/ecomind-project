import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, User, Mail, Lock, Building2, UserPlus, AlertCircle, Scan } from 'lucide-react';
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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleFaceCaptured = (biometricSnapshot) => {
    setFaceBiometricData(biometricSnapshot);
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

    if (authMethod === 'face' && !faceBiometricData) {
      setError('Please complete the Face Recognition scan before submitting.');
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        ...formData,
        password: formData.password || 'face_id_secured_123',
        face_biometric_data: faceBiometricData
      });
      navigate('/dashboard');
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      if (serverMessage) {
        setError(serverMessage);
      } else if (err.message === 'Network Error' || !err.response) {
        setError('Network Error: Unable to connect to backend API server.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
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
          {/* Method Selection Bar */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => setAuthMethod('password')}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                authMethod === 'password'
                  ? 'bg-eco-600 text-white shadow-glow-eco'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-4 h-4" /> Password Registration
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('face')}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                authMethod === 'face'
                  ? 'bg-eco-600 text-white shadow-glow-eco'
                  : 'text-slate-400 hover:text-white'
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
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-eco-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="jane@organization.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-eco-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Organization / Household
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="organization"
                  placeholder="e.g. GreenTech Inc or Home"
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-eco-500 text-sm"
                />
              </div>
            </div>

            {authMethod === 'password' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-eco-500 text-sm"
                  />
                </div>
              </div>
            ) : (
              <FaceRecognitionScanner onScanComplete={handleFaceCaptured} mode="register" />
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-eco-600 via-emerald-500 to-teal-500 hover:from-eco-500 hover:to-teal-400 text-white font-semibold shadow-glow-eco transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? (
                <span>Registering Account...</span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  {authMethod === 'face' ? 'Register with Face ID Biometrics' : 'Create Free Account'}
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/register" className="text-eco-400 font-semibold hover:underline" onClick={() => navigate('/login')}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
