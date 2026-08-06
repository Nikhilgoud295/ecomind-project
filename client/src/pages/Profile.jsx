import React, { useState } from 'react';
import { User, Mail, Building2, Save, ShieldCheck, CheckCircle2, Scan } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import FaceRecognitionScanner from '../components/FaceRecognitionScanner';
import { authService } from '../services/authService';

export default function Profile() {
  const currentUser = authService.getCurrentUser();
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    organization: currentUser?.organization || 'Individual User',
    avatar_url: currentUser?.avatar_url || '',
  });

  const [faceBiometricData, setFaceBiometricData] = useState(null);
  const [showFaceScanner, setShowFaceScanner] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMsg('');
  };

  const handleFaceCaptured = (biometricSnapshot) => {
    setFaceBiometricData(biometricSnapshot);
    setMsg('Facial biometric template captured! Click "Save Profile Changes" to update your account.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    try {
      const res = await authService.updateProfile({
        name: formData.name,
        organization: formData.organization,
        avatar_url: formData.avatar_url,
        face_biometric_data: faceBiometricData
      });

      if (res.success) {
        setMsg('Profile and Face ID biometric template updated successfully!');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-slate-100">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6 overflow-hidden">
          {/* Header */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <img
                src={formData.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                alt="Avatar"
                className="w-16 h-16 rounded-2xl border-2 border-eco-500 object-cover shadow-glow-eco"
              />
              <div>
                <h1 className="text-2xl font-bold font-display text-white">{formData.name || 'User Profile'}</h1>
                <p className="text-xs text-slate-400">{formData.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-eco-500/20 text-eco-400 border border-eco-500/30">
                    {formData.organization}
                  </span>
                  <span className="text-[10px] text-slate-400">Sustainability Champion</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" /> Face ID Enrolled
            </div>
          </div>

          {/* Profile Edit Form */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
                <User className="w-5 h-5 text-eco-400" />
                Account Settings & Biometric Credentials
              </h3>

              <button
                type="button"
                onClick={() => setShowFaceScanner(!showFaceScanner)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Scan className="w-4 h-4 text-emerald-400" />
                {showFaceScanner ? 'Hide Face Scanner' : 'Re-Enroll Face ID'}
              </button>
            </div>

            {msg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{msg}</span>
              </div>
            )}

            {/* Optional Face ID Scanner on Profile */}
            {showFaceScanner && (
              <div className="animate-fade-in pb-2">
                <FaceRecognitionScanner onScanComplete={handleFaceCaptured} mode="register" />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-eco-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Email Address (Read only)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 text-sm cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Organization / Company
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-eco-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Avatar Image URL
                  </label>
                  <input
                    type="text"
                    name="avatar_url"
                    value={formData.avatar_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-eco-500 text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-eco-600 to-teal-500 hover:from-eco-500 hover:to-teal-400 text-white font-medium text-xs shadow-glow-eco flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
