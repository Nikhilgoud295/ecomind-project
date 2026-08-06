import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, Building2, Save, ShieldCheck, CheckCircle2, Scan, UploadCloud, Camera, Image, RefreshCw } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import FaceRecognitionScanner from '../components/FaceRecognitionScanner';
import { authService } from '../services/authService';

export default function Profile() {
  const fileInputRef = useRef(null);
  const currentUser = authService.getCurrentUser();
  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Nikhil Goud',
    email: currentUser?.email || 'nikhilgoudkeesari@gmail.com',
    organization: currentUser?.organization || 'EcoMind Enterprise',
    avatar_url: currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  });

  const [faceBiometricData, setFaceBiometricData] = useState(null);
  const [showFaceScanner, setShowFaceScanner] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setFormData({
        name: user.name || 'User',
        email: user.email || '',
        organization: user.organization || 'EcoMind Enterprise',
        avatar_url: user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      });
    }
  }, []);

  // Preset Avatar Photos for Quick Selection
  const avatarPresets = [
    { label: 'Executive Lead', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256' },
    { label: 'ESG Specialist', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256' },
    { label: 'Eco Analyst', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256' },
    { label: 'Sustainability Lead', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMsg('');
  };

  // Handle Local File Photo Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMsg('Please select a valid image file (PNG, JPG, JPEG, WebP).');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar_url: reader.result }));
        setMsg('📷 Profile photo loaded from device file! Click "Save Profile Changes" to apply.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (url) => {
    setFormData(prev => ({ ...prev, avatar_url: url }));
    setMsg('Selected preset profile avatar photo.');
  };

  const handleFaceCaptured = (biometricSnapshot) => {
    setFaceBiometricData(biometricSnapshot);
    setMsg(`Facial biometric template captured for ${formData.name}! Click "Save Profile Changes" to save.`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    const updatedUser = {
      ...currentUser,
      name: formData.name.trim(),
      organization: formData.organization.trim(),
      avatar_url: formData.avatar_url,
      face_enrolled: Boolean(faceBiometricData || currentUser?.face_enrolled)
    };

    try {
      await authService.updateProfile({
        name: formData.name.trim(),
        organization: formData.organization.trim(),
        avatar_url: formData.avatar_url,
        face_biometric_data: faceBiometricData
      });

      localStorage.setItem('ecomind_user', JSON.stringify(updatedUser));
      
      // Update registered users registry
      const registeredUsers = JSON.parse(localStorage.getItem('ecomind_registered_users') || '[]');
      const filtered = registeredUsers.filter(u => u.email !== updatedUser.email);
      filtered.push(updatedUser);
      localStorage.setItem('ecomind_registered_users', JSON.stringify(filtered));

      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('ecomind_user_updated'));

      setMsg(`✅ Profile information updated for ${formData.name}!`);
    } catch (err) {
      console.warn('Backend update fall-back:', err);
      localStorage.setItem('ecomind_user', JSON.stringify(updatedUser));

      const registeredUsers = JSON.parse(localStorage.getItem('ecomind_registered_users') || '[]');
      const filtered = registeredUsers.filter(u => u.email !== updatedUser.email);
      filtered.push(updatedUser);
      localStorage.setItem('ecomind_registered_users', JSON.stringify(filtered));

      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('ecomind_user_updated'));
      setMsg(`✅ Profile photo and details updated for ${formData.name}!`);
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
          {/* Header Card */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-5">
              {/* Interactive Upload Avatar Circle with Camera Overlay */}
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <img
                  src={formData.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                  alt="Avatar"
                  className="w-20 h-20 rounded-2xl border-2 border-eco-500 object-cover shadow-glow-eco group-hover:opacity-80 transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-2xl bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                  <Camera className="w-6 h-6 text-white animate-bounce" />
                </div>
              </div>

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

            {/* Quick Upload Button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-eco-600 to-teal-500 hover:from-eco-500 hover:to-teal-400 text-white font-bold text-xs shadow-glow-eco flex items-center gap-2 transition-all transform hover:scale-105"
              >
                <UploadCloud className="w-4 h-4" /> Upload Photo from Files
              </button>

              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" /> Face ID Enrolled
              </div>
            </div>
          </div>

          {/* Profile & Avatar Editing Panel */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
                <User className="w-5 h-5 text-eco-400" />
                Profile Photo & Account Customization
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
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{msg}</span>
              </div>
            )}

            {/* Optional Face ID Scanner */}
            {showFaceScanner && (
              <div className="animate-fade-in pb-2">
                <FaceRecognitionScanner onScanComplete={handleFaceCaptured} mode="register" />
              </div>
            )}

            {/* Profile Picture Upload Section */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4 text-eco-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Upload Custom Profile Photo</span>
                </div>
                <span className="text-[11px] text-slate-400">Supports PNG, JPG, JPEG, WebP</span>
              </div>

              {/* Hidden File Input Element */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* Drag and Drop / Select Box */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 rounded-xl border-2 border-dashed border-slate-700 hover:border-eco-500/70 bg-slate-950/60 hover:bg-slate-900 text-center cursor-pointer transition-all duration-300 group"
                >
                  <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-eco-400 group-hover:scale-110 transition-all mx-auto mb-2" />
                  <p className="text-xs font-semibold text-white">Click to Browse Local Device Files</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Select image file from computer</p>
                </div>

                {/* Preset Avatars Bar */}
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 block">Or Choose a Curated Avatar Preset:</span>
                  <div className="flex items-center gap-3">
                    {avatarPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPreset(preset.url)}
                        className={`relative rounded-xl overflow-hidden border-2 transition-all transform hover:scale-110 ${
                          formData.avatar_url === preset.url ? 'border-eco-400 ring-2 ring-eco-500/40 scale-105' : 'border-slate-700 opacity-70 hover:opacity-100'
                        }`}
                        title={preset.label}
                      >
                        <img src={preset.url} alt={preset.label} className="w-10 h-10 object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

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
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-eco-500 text-sm font-semibold"
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
                    Avatar Image URL / Data
                  </label>
                  <input
                    type="text"
                    name="avatar_url"
                    value={formData.avatar_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-eco-500 text-sm font-mono text-xs overflow-ellipsis"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-eco-600 via-emerald-500 to-teal-500 hover:from-eco-500 hover:to-teal-400 text-white font-bold text-xs shadow-glow-eco flex items-center gap-2 transition-all transform hover:scale-105 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Profile Changes
                    </>
                  )}
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
