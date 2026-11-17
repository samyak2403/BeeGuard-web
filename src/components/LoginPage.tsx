import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle2,
  User,
  RefreshCw,
  ArrowRight,
  Smartphone
} from 'lucide-react';
import { 
  verifyAdminLogin, 
  seedAdminAuthCredentials 
} from '../services/firebase';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onShowToast?: (type: 'success' | 'warning' | 'info', title: string, desc?: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onShowToast
}) => {
  // Sign In Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityKey, setSecurityKey] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Seed credentials to Firebase Firestore on initial mount
  useEffect(() => {
    seedAdminAuthCredentials().then(() => {
      // Background seed ensured
    });
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const result = await verifyAdminLogin(email, password, securityKey);

      if (!result.success) {
        setErrorMessage(result.error || 'Authentication failed. Please check your credentials.');
        if (onShowToast) {
          onShowToast('warning', 'Access Denied', result.error || 'Invalid credentials or security key.');
        }
        setIsLoading(false);
        return;
      }

      // Successful login
      setSuccessMessage('Super Administrator access granted.');
      if (onShowToast) {
        onShowToast('success', 'Security Key Verified', 'Super Administrator access granted.');
      }
      setIsLoading(false);
      onLoginSuccess();
    } catch {
      setErrorMessage('An unexpected error occurred during authentication. Please retry.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white text-slate-800 font-sans selection:bg-amber-500 selection:text-black">
      {/* LEFT COLUMN: Full Height Hero Photographic Image */}
      <div className="relative w-full lg:w-1/2 min-h-[320px] lg:min-h-screen bg-slate-900 overflow-hidden flex flex-col justify-between p-8 sm:p-12 lg:p-16">
        {/* Background Image */}
        <img 
          src="/login-hero.jpg" 
          alt="BeeGuard Apiary Intelligence" 
          className="absolute inset-0 w-full h-full object-cover object-center transform scale-105 filter brightness-[0.78] contrast-[1.12]"
        />

        {/* Ambient Dark/Tint Overlay matching reference aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-900/60 pointer-events-none" />
        <div className="absolute inset-0 bg-amber-950/20 mix-blend-color pointer-events-none" />

        {/* Top Overlay Title: Clean, Bold Typography matching reference "Arrendadora" style */}
        <div className="relative z-10 pt-4 sm:pt-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-lg">
            BeeGuard
          </h1>
          <p className="text-amber-300 font-medium tracking-widest text-xs sm:text-sm uppercase mt-2 drop-shadow">
            Autonomous Apiary Biosecurity Intelligence
          </p>
        </div>

        {/* Bottom Feature Badges on Left Image */}
        <div className="relative z-10 mt-auto pt-8">
          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 text-white shadow-xl">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 text-lg">
              🐝
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-wide">National Bee Board (NBB) Integrated</p>
              <p className="text-[11px] text-slate-300">Level 4 Biosecurity Clearance Gateway</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Pure White Background, Centered Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-white">
        <div className="w-full max-w-sm space-y-7 animate-in fade-in duration-300">
          {/* Brand Crest / Emblem matching reference's "HARINAS ELIZONDO" style */}
          <div className="text-center flex flex-col items-center">
            {/* Official BeeGuard Emblem Logo */}
            <div className="w-24 h-24 mb-3 flex items-center justify-center relative">
              <img 
                src="/logo.webp" 
                alt="BeeGuard" 
                className="w-full h-full object-contain filter drop-shadow-md" 
              />
            </div>

            {/* Typography */}
            <h2 className="text-2xl font-black text-slate-800 tracking-[0.2em] uppercase font-serif">
              BeeGuard
            </h2>
            <p className="text-[11px] font-semibold text-slate-500 tracking-[0.25em] uppercase mt-0.5">
              Central Command
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-semibold text-red-800">Authentication Failed</p>
                <p className="text-[11px] text-red-600 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-semibold text-emerald-900">Access Granted</p>
                <p className="text-[11px] text-emerald-700 leading-relaxed">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Field 1: Email Address */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Email Address</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@beeguard.in"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-slate-400 font-sans shadow-xs"
                />
              </div>
            </div>

            {/* Field 2: Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Password</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 pr-10 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-slate-400 font-sans shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Field 3: Security Key (2FA) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  <span>Security Key (2FA)</span>
                </label>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300/60">
                  Mandatory
                </span>
              </div>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  required
                  value={securityKey}
                  onChange={(e) => setSecurityKey(e.target.value.toUpperCase())}
                  placeholder="Enter 12-character security key"
                  className="w-full px-4 py-3 pr-10 rounded-lg border border-amber-300/80 bg-amber-50/40 text-slate-900 font-mono text-sm tracking-wider font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-slate-400 shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  aria-label="Toggle security key visibility"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign In Pill Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-full bg-slate-800 hover:bg-slate-900 active:scale-[0.99] text-white font-medium text-sm transition-all shadow-sm hover:shadow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Verifying clearance...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 text-white/80" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Subtext */}
          <p className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            Protected Biosecurity Console • Firebase 2FA Hardware Protocol
          </p>

          {/* Direct Link to Mobile App Landing Page & APK */}
          <div className="pt-2 text-center">
            <a
              href="?view=landing"
              className="inline-flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 font-semibold transition-colors cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Looking for the mobile app? Download Android APK →</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
