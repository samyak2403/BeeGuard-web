import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Key, 
  Lock, 
  Bell, 
  Smartphone, 
  Copy, 
  Check, 
  Camera, 
  Save, 
  RefreshCw, 
  History, 
  Laptop, 
  Sparkles, 
  LogOut
} from 'lucide-react';

interface AdminProfileViewProps {
  onBackToDashboard: () => void;
  onShowToast?: (type: 'success' | 'warning' | 'info', title: string, desc?: string) => void;
  onSignOut?: () => void;
}

export const AdminProfileView: React.FC<AdminProfileViewProps> = ({
  onBackToDashboard,
  onShowToast,
  onSignOut
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'security' | 'permissions' | 'notifications' | 'audit'>('profile');

  // Profile Form States
  const [fullName, setFullName] = useState('Samyak Kamble');
  const [designation, setDesignation] = useState('Chief Super Administrator');
  const [department, setDepartment] = useState('National Bee Board (NBB) & BeeGuard Intelligence Directorate');
  const [email, setEmail] = useState('samyak.admin@beeguard.gov.in');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [location, setLocation] = useState('Western Ghats Operational Directorate, Kolhapur, Maharashtra');
  const [jurisdiction, setJurisdiction] = useState('Western Ghats & Krishna Basin Apiary Corridors (MH & KA)');
  const [bio, setBio] = useState(
    'Chief Biosecurity Administrator and Lead Intelligence Officer for BeeGuard. Responsible for statutory disease outbreak quarantines, AI neural diagnostic model oversight, and apiary containment protocols.'
  );

  // Security States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [isApiKeyCopied, setIsApiKeyCopied] = useState(false);
  const apiKey = 'bg_live_sec_9941a82fbc7842e8b23c914092b3a677';

  // Notification Preferences
  const [notifyOutbreaks, setNotifyOutbreaks] = useState(true);
  const [notifyCriticalScans, setNotifyCriticalScans] = useState(true);
  const [notifyUserRegistrations, setNotifyUserRegistrations] = useState(true);
  const [notifyMarketplaceFlags, setNotifyMarketplaceFlags] = useState(false);
  const [notifyDailyDigest, setNotifyDailyDigest] = useState(true);

  // Save Feedback
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      if (onShowToast) {
        onShowToast('success', 'Profile Updated', 'Super Administrator profile information successfully updated.');
      }
    }, 600);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      if (onShowToast) onShowToast('warning', 'Missing Password', 'Please enter your current password.');
      return;
    }
    if (newPassword.length < 8) {
      if (onShowToast) onShowToast('warning', 'Weak Password', 'New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      if (onShowToast) onShowToast('warning', 'Password Mismatch', 'New passwords do not match.');
      return;
    }

    if (onShowToast) {
      onShowToast('success', 'Password Updated', 'Your security credentials have been updated.');
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setIsApiKeyCopied(true);
    if (onShowToast) {
      onShowToast('info', 'API Key Copied', 'Service key copied to clipboard.');
    }
    setTimeout(() => setIsApiKeyCopied(false), 2000);
  };

  const handleToggle2FA = () => {
    const nextState = !is2FAEnabled;
    setIs2FAEnabled(nextState);
    if (onShowToast) {
      onShowToast(
        nextState ? 'success' : 'warning',
        nextState ? '2FA Enabled' : '2FA Suspended',
        nextState ? 'Hardware authenticator app token verified.' : 'Two-factor authentication disabled.'
      );
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl w-full mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumb & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button 
            onClick={onBackToDashboard}
            className="hover:text-emerald-700 font-medium transition-colors"
          >
            Dashboard
          </button>
          <span>/</span>
          <span className="text-slate-400">Settings</span>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Super Administrator Profile</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-xs transition-colors"
          >
            ← Return to Dashboard
          </button>
          {onSignOut ? (
            <button
              onClick={onSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 text-xs font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={() => alert('Signing out of BeeGuard Admin...')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 text-xs font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
        {/* Background decorative subtle gradient */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 opacity-90" />
        
        <div className="relative pt-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-600 p-1 shadow-lg ring-4 ring-white">
                <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center text-white text-3xl font-extrabold tracking-wider">
                  SK
                </div>
              </div>
              <button 
                title="Change Avatar"
                className="absolute bottom-1 right-1 p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow border border-white transition-transform group-hover:scale-105"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Profile Identity */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">{fullName}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Level 4 Super Administrator
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  <Sparkles className="w-3 h-3 text-blue-500" />
                  NBB Certified Biosecurity Officer
                </span>
              </div>
              
              <p className="text-xs text-slate-600 font-medium">
                {designation} • {department}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Kolhapur, MH
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl shrink-0">
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Session Security</p>
              <p className="text-xs font-semibold text-emerald-600 flex items-center justify-end gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                2FA Hardware Enforced
              </p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Surveillance Scope</p>
              <p className="text-xs font-bold text-slate-800">2,840+ Colonies</p>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="flex items-center gap-2 mt-8 border-t border-slate-200 pt-4 overflow-x-auto scrollbar-none text-xs font-medium">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 shrink-0 ${
              activeSubTab === 'profile'
                ? 'bg-emerald-50 text-emerald-700 font-bold shadow-sm border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => setActiveSubTab('security')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 shrink-0 ${
              activeSubTab === 'security'
                ? 'bg-emerald-50 text-emerald-700 font-bold shadow-sm border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Security & 2FA</span>
          </button>

          <button
            onClick={() => setActiveSubTab('permissions')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 shrink-0 ${
              activeSubTab === 'permissions'
                ? 'bg-emerald-50 text-emerald-700 font-bold shadow-sm border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Clearance & Permissions</span>
          </button>

          <button
            onClick={() => setActiveSubTab('notifications')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 shrink-0 ${
              activeSubTab === 'notifications'
                ? 'bg-emerald-50 text-emerald-700 font-bold shadow-sm border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Alert Subscriptions</span>
          </button>

          <button
            onClick={() => setActiveSubTab('audit')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 shrink-0 ${
              activeSubTab === 'audit'
                ? 'bg-emerald-50 text-emerald-700 font-bold shadow-sm border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Admin Audit Trail</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: Profile Details */}
      {activeSubTab === 'profile' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>Administrative Identity & Contact</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official identity details recorded with the National Bee Board (NBB) central registry
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Official Designation</label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Official Gov / Directorate Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Emergency Operational Mobile</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Department / Organization</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Operational Station Location</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1 text-xs">Statutory Jurisdiction & Apiary Corridors</label>
                <input
                  type="text"
                  required
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1 text-xs">Administrative Bio & Executive Responsibilities</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onBackToDashboard}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Profile Details</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* SUB-TAB 2: Security & 2FA */}
      {activeSubTab === 'security' && (
        <div className="space-y-6">
          {/* Card 1: 2FA Authentication */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900">Two-Factor Authentication (2FA)</h3>
                </div>
                <p className="text-xs text-slate-500">
                  Mandatory for Level 4 Super Administrators enforcing statutory quarantine broadcasts and biosecurity movement bans
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggle2FA}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  is2FAEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    is2FAEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Google Authenticator / YubiKey (TOTP)</p>
                  <p className="text-slate-500 text-[11px]">Enrolled: March 14, 2024 • Last verification 15 min ago</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                ENFORCED
              </span>
            </div>
          </div>

          {/* Card 2: Update Credentials */}
          <form onSubmit={handleUpdatePassword} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-700" />
                <span>Update Administrative Password</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ensure passwords contain at least 8 characters, numerals, and biosecurity clearance keys
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-sm transition-colors"
              >
                Update Password
              </button>
            </div>
          </form>

          {/* Card 3: Service API Key */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-600" />
                  <span>Admin Telemetry & Cloud Messaging API Key</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Used for authenticating background ingestion workers and IoT apiary edge sensors
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyApiKey}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors"
              >
                {isApiKeyCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isApiKeyCopied ? 'Copied' : 'Copy Key'}</span>
              </button>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl font-mono text-xs text-emerald-400 flex items-center justify-between overflow-x-auto">
              <span>{apiKey}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest pl-4">Full Access</span>
            </div>
          </div>

          {/* Card 4: Active Login Sessions */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Laptop className="w-4 h-4 text-blue-600" />
              <span>Active Administrative Sessions</span>
            </h3>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Chrome on Windows 11 (Current Workstation)</p>
                    <p className="text-slate-500 text-[11px]">IP: 10.29.46.107 • Kolhapur Command Center</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  ACTIVE NOW
                </span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">BeeGuard Admin Mobile App (Pixel 8 Pro)</p>
                    <p className="text-slate-500 text-[11px]">Field Telemetry Sync • Active 2h ago</p>
                  </div>
                </div>
                <button
                  onClick={() => onShowToast && onShowToast('info', 'Session Revoked', 'Mobile device session terminated.')}
                  className="text-red-600 hover:text-red-700 font-medium text-xs hover:underline"
                >
                  Revoke
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Clearance & Permissions */}
      {activeSubTab === 'permissions' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Statutory Biosecurity Clearances & Role Matrix</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Official operational privileges conferred under the National Bee Board Act and BeeGuard Autonomous Surveillance Charter
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Emergency Outbreak Quarantine Authority</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    GRANTED
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Power to initiate statutory 5 km colony movement bans, trigger FCM emergency alert blasts, and seal delinquent apiaries.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">AI Neural Diagnostic Calibration</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    GRANTED
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Authority to adjust Qwen2.5-7B vision inference confidence thresholds, fine-tune CNN weights, and override false positives.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Beekeeper Privilege & License Revocation</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    GRANTED
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Power to suspend delinquent beekeepers, promote field inspectors, and verify commercial apiarist certifications.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Marketplace Honey Escrow & Delisting</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    GRANTED
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Authority to remove adulterated honey batches, freeze fraudulent seller balances, and enforce purity lab test compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Alert Subscriptions */}
      {activeSubTab === 'notifications' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-600" />
              <span>Super Administrator Notification Dispatch Policies</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize real-time push and SMS channels for immediate biosecurity incident escalations
            </p>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Emergency Outbreak Quarantine Alerts</p>
                <p className="text-slate-500 text-[11px]">Instant SMS and desktop notification on AFB/EFB cluster detections</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifyOutbreaks(!notifyOutbreaks)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notifyOutbreaks ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  notifyOutbreaks ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="py-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">High-Risk Disease Scans (&gt;80% Confidence)</p>
                <p className="text-slate-500 text-[11px]">Notify when AI classifies Varroa or Nosema at critical infection levels</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifyCriticalScans(!notifyCriticalScans)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notifyCriticalScans ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  notifyCriticalScans ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="py-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">New Apiarist Registrations</p>
                <p className="text-slate-500 text-[11px]">Alert when commercial beekeepers submit documents for verification</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifyUserRegistrations(!notifyUserRegistrations)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notifyUserRegistrations ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  notifyUserRegistrations ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="py-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Marketplace Honey Adulteration Flags</p>
                <p className="text-slate-500 text-[11px]">Instant notice when an apiary listing fails purity or moisture thresholds</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifyMarketplaceFlags(!notifyMarketplaceFlags)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notifyMarketplaceFlags ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  notifyMarketplaceFlags ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="py-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Daily Regional Biosecurity Intelligence Digest</p>
                <p className="text-slate-500 text-[11px]">Consolidated PDF telemetry report dispatched every morning at 07:00 AM IST</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifyDailyDigest(!notifyDailyDigest)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notifyDailyDigest ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  notifyDailyDigest ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onShowToast && onShowToast('success', 'Preferences Saved', 'Notification alert dispatch configuration updated.')}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm transition-all"
            >
              Save Notification Preferences
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: Audit Trail */}
      {activeSubTab === 'audit' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-slate-700" />
                <span>Executive Activity Log & Audit Trail</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Immutable cryptographic ledger of actions taken by Samyak Kamble (Super Admin)
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">Total 142 Events Logged</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
                    BIOSECURITY DISPATCH
                  </span>
                  <span className="font-semibold text-slate-900">
                    Enforced 5 km Quarantine in Kolhapur West Corridor
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Authorized emergency broadcast for American Foulbrood (AFB). Targeted 5 infected colonies and notified 148 apiarists.
                </p>
              </div>
              <span className="text-slate-400 text-[11px] whitespace-nowrap font-mono">Today, 08:30 AM</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                    AI CALIBRATION
                  </span>
                  <span className="font-semibold text-slate-900">
                    Calibrated Qwen2.5-7B Confidence Threshold to 75%
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Applied biosecurity policy update in System Settings. Refreshed active inference endpoints.
                </p>
              </div>
              <span className="text-slate-400 text-[11px] whitespace-nowrap font-mono">Yesterday, 04:15 PM</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                    USER VERIFICATION
                  </span>
                  <span className="font-semibold text-slate-900">
                    Elevated Dr. Rajesh Sharma to Master Inspector
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Approved Western Ghats field inspection license and granted comb audit authority.
                </p>
              </div>
              <span className="text-slate-400 text-[11px] whitespace-nowrap font-mono">Nov 3, 11:20 AM</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    MARKETPLACE ESCROW
                  </span>
                  <span className="font-semibold text-slate-900">
                    Flagged Non-Compliant Honey Listing #MK-8821
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Suspended listing pending laboratory pollen diastase and moisture certification.
                </p>
              </div>
              <span className="text-slate-400 text-[11px] whitespace-nowrap font-mono">Nov 2, 02:45 PM</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
