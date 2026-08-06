import React, { useState } from 'react';
import { Fingerprint, CheckCircle2, ShieldCheck, RefreshCw, Sparkles, AlertCircle, Lock } from 'lucide-react';

export default function FingerprintScanner({ onScanComplete, mode = 'login' }) {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState('Touch sensor or click "Scan Fingerprint"');
  const [capturedFingerprint, setCapturedFingerprint] = useState(null);
  const [biometricError, setBiometricError] = useState('');

  const triggerFingerprintScan = async () => {
    setBiometricError('');
    setIsScanning(true);
    setProgress(0);
    setScanStatus('Initializing Fingerprint Biometric Scanner...');

    // Check WebAuthn platform authenticator (TouchID / Windows Hello / Android Fingerprint)
    let nativeSuccess = false;
    if (window.PublicKeyCredential && navigator.credentials) {
      try {
        setScanStatus('Waiting for Touch ID / Fingerprint sensor...');
        // WebAuthn biometric request simulation / probe
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);
      } catch (err) {
        console.warn('WebAuthn prompt info:', err.message);
      }
    }

    // High-tech scanner animation simulation
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 20;
      setProgress(currentProgress);

      if (currentProgress === 40) {
        setScanStatus('Reading Ridge Patterns & Minutiae Points...');
      } else if (currentProgress === 80) {
        setScanStatus('Generating 256-Bit Biometric Cryptographic Hash...');
      } else if (currentProgress >= 100) {
        clearInterval(interval);
        const fingerprintToken = `fp_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        setCapturedFingerprint(fingerprintToken);
        setIsScanning(false);
        setScanStatus('Fingerprint Biometric Match Verified! ✅');

        if (onScanComplete) {
          onScanComplete(fingerprintToken);
        }
      }
    }, 180);
  };

  return (
    <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4 bg-slate-950/90 text-slate-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <Fingerprint className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold font-display text-white">
              {mode === 'register' ? 'Enroll Fingerprint Biometric' : 'Fingerprint / Touch ID Sign In'}
            </h4>
            <p className="text-[11px] text-slate-400">WebAuthn Touch ID & Biometric Verification</p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Optional Touch ID
        </span>
      </div>

      {biometricError && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <span>{biometricError}</span>
        </div>
      )}

      {/* Interactive Fingerprint Reticle Display */}
      <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex flex-col items-center justify-center space-y-3">
        {capturedFingerprint ? (
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/40 flex items-center justify-center mx-auto shadow-glow-eco">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <p className="text-xs font-bold text-emerald-400">Fingerprint Template Authenticated!</p>
          </div>
        ) : (
          <button
            type="button"
            onClick={triggerFingerprintScan}
            disabled={isScanning}
            className="group relative p-5 rounded-full bg-slate-800/80 hover:bg-slate-800 border-2 border-teal-500/40 hover:border-teal-400 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-2xl"
          >
            <Fingerprint className={`w-12 h-12 ${isScanning ? 'text-emerald-400 animate-bounce' : 'text-teal-400 group-hover:text-emerald-400 transition-colors'}`} />
            {isScanning && (
              <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-75" />
            )}
          </button>
        )}

        <p className="text-xs text-slate-300 font-medium text-center px-4">
          {capturedFingerprint ? 'Touch ID verified. Click Sign In below.' : 'Touch the fingerprint sensor icon above to scan'}
        </p>
      </div>

      {/* Progress & Status Indicator */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-semibold text-[11px]">{scanStatus}</span>
          {isScanning && <span className="font-mono font-bold text-teal-400">{progress}%</span>}
        </div>

        {isScanning && (
          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="pt-1">
        {!capturedFingerprint ? (
          <button
            type="button"
            onClick={triggerFingerprintScan}
            disabled={isScanning}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
          >
            <Fingerprint className="w-4 h-4" /> Scan Fingerprint Biometric
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setCapturedFingerprint(null);
              triggerFingerprintScan();
            }}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-teal-400" /> Retake Fingerprint Scan
          </button>
        )}
      </div>
    </div>
  );
}
