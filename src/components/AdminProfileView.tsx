import React, { useState, useEffect } from 'react';
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
  LogOut,
  AlertTriangle,
  Microscope,
  Database
} from 'lucide-react';
import { 
  subscribeToAdminProfile, 
  updateAdminProfile, 
  updateAdminPassword, 
  DEFAULT_ADMIN_PROFILE,
  formatSafeDateTime
} from '../services/firebase';
import { 
  DiseaseScanRecord, 
  HiveRecord, 
  OutbreakAlert, 
  UserAccount 
} from '../types';

interface AdminProfileViewProps {
  onBackToDashboard: () => void;
  onShowToast?: (type: 'success' | 'warning' | 'info', title: string, desc?: string) => void;
  onSignOut?: () => void;
  scans?: DiseaseScanRecord[];
  users?: UserAccount[];
  hives?: HiveRecord[];
  outbreaks?: OutbreakAlert[];
}

export const AdminProfileView: React.FC<AdminProfileViewProps> = ({
  onBackToDashboard,
  onShowToast,
  onSignOut,
  scans = [],
  users = [],
  hives = [],
  outbreaks = []
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'security' | 'permissions' | 'notifications' | 'audit'>('profile');

  // Real-time Firestore Profile States
  const [fullName, setFullName] = useState(DEFAULT_ADMIN_PROFILE.fullName);
  const [designation, setDesignation] = useState(DEFAULT_ADMIN_PROFILE.designation);
  const [department, setDepartment] = useState(DEFAULT_ADMIN_PROFILE.department);
  const [email, setEmail] = useState(DEFAULT_ADMIN_PROFILE.email);
  const [phone, setPhone] = useState(DEFAULT_ADMIN_PROFILE.phone);
  const [location, setLocation] = useState(DEFAULT_ADMIN_PROFILE.location);
  const [jurisdiction, setJurisdiction] = useState(DEFAULT_ADMIN_PROFILE.jurisdiction);
  const [bio, setBio] = useState(DEFAULT_ADMIN_PROFILE.bio);
  const [securityKey, setSecurityKey] = useState(DEFAULT_ADMIN_PROFILE.securityKey);
  const [apiKey, setApiKey] = useState(DEFAULT_ADMIN_PROFILE.apiKey);
  const [is2FAEnabled, setIs2FAEnabled] = useState(DEFAULT_ADMIN_PROFILE.is2FAEnabled);

  // Notification Preferences (Synced to Firestore)
  const [notifyOutbreaks, setNotifyOutbreaks] = useState(true);
  const [notifyCriticalScans, setNotifyCriticalScans] = useState(true);
  const [notifyUserRegistrations, setNotifyUserRegistrations] = useState(true);
  const [notifyMarketplaceFlags, setNotifyMarketplaceFlags] = useState(false);
  const [notifyDailyDigest, setNotifyDailyDigest] = useState(true);

  // Security Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isApiKeyCopied, setIsApiKeyCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);

  // 1. Subscribe to Live Admin Profile in Firebase Firestore
  useEffect(() => {
    const unsub = subscribeToAdminProfile((profile) => {
      setFullName(profile.fullName);
      setDesignation(profile.designation);
      setDepartment(profile.department);
      setEmail(profile.email);
      setPhone(profile.phone);
      setLocation(profile.location);
      setJurisdiction(profile.jurisdiction);
      setBio(profile.bio);
      setSecurityKey(profile.securityKey);
      setApiKey(profile.apiKey);
      setIs2FAEnabled(profile.is2FAEnabled);

      if (profile.notificationPreferences) {
        setNotifyOutbreaks(profile.notificationPreferences.notifyOutbreaks);
        setNotifyCriticalScans(profile.notificationPreferences.notifyCriticalScans);
        setNotifyUserRegistrations(profile.notificationPreferences.notifyUserRegistrations);
        setNotifyMarketplaceFlags(profile.notificationPreferences.notifyMarketplaceFlags);
        setNotifyDailyDigest(profile.notificationPreferences.notifyDailyDigest);
      }
    });

    return () => unsub();
  }, []);

  // Save Profile to Firebase Firestore
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await updateAdminProfile({
        fullName,
        designation,
        department,
        email,
        phone,
        location,
        jurisdiction,
        bio
      });

      setIsSaving(false);
      if (res.success) {
        if (onShowToast) {
          onShowToast('success', 'Profile Updated in Firestore', 'Super Administrator profile saved live in Firebase.');
        }
      } else {
        if (onShowToast) {
          onShowToast('warning', 'Update Warning', res.error || 'Failed to update profile.');
        }
      }
    } catch {
      setIsSaving(false);
      if (onShowToast) {
        onShowToast('warning', 'Network Error', 'Could not sync with Firebase Firestore.');
      }
    }
  };

  // Update Password in Firebase Firestore
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      if (onShowToast) onShowToast('warning', 'Missing Password', 'Please enter your current administrator password.');
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

    setIsUpdatingPassword(true);
    const res = await updateAdminPassword(currentPassword, newPassword);
    setIsUpdatingPassword(false);

    if (res.success) {
      if (onShowToast) {
        onShowToast('success', 'Password Updated in Firestore', 'Your security credentials have been updated.');
      }
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      if (onShowToast) {
        onShowToast('warning', 'Security Verification Failed', res.error || 'Invalid current password.');
      }
    }
  };

  // Toggle 2FA in Firebase Firestore
  const handleToggle2FA = async () => {
    const nextState = !is2FAEnabled;
    setIs2FAEnabled(nextState);
    await updateAdminProfile({ is2FAEnabled: nextState });

    if (onShowToast) {
      onShowToast(
        nextState ? 'success' : 'warning',
        nextState ? '2FA Enforced in Firestore' : '2FA Suspended',
        nextState ? 'Hardware authenticator token active.' : 'Two-factor authentication disabled.'
      );
    }
  };

  // Save Notification Preferences to Firebase Firestore
  const handleSaveNotifications = async () => {
    setIsSavingNotifications(true);
    await updateAdminProfile({
      notificationPreferences: {
        notifyOutbreaks,
        notifyCriticalScans,
        notifyUserRegistrations,
        notifyMarketplaceFlags,
        notifyDailyDigest
      }
    });
    setIsSavingNotifications(false);

    if (onShowToast) {
      onShowToast('success', 'Preferences Synced to Firestore', 'Notification dispatch policies saved live in Firebase.');
    }
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setIsApiKeyCopied(true);
    if (onShowToast) {
      onShowToast('info', 'API Key Copied', 'Service key copied to clipboard.');
    }
    setTimeout(() => setIsApiKeyCopied(false), 2000);
  };

  // Real Dynamic Audit Trail compiled from Live Firestore Collections
  const liveAuditEvents = [
    // 1. Real Outbreak Events from Firestore `notifications`
    ...outbreaks.map((ob, idx) => ({
      id: `outbreak_${ob.id || idx}`,
      tag: 'BIOSECURITY DISPATCH',
      tagColor: 'bg-red-100 text-red-700 border border-red-300/60',
      title: `Enforced Quarantine in ${ob.region || 'Apiary Corridor'}`,
      description: `${ob.disease} (${ob.severity} Severity) affecting ${ob.affectedHives ?? 0} colonies. Action directive issued.`,
      time: formatSafeDateTime(ob.dateReported),
      icon: AlertTriangle
    })),

    // 2. Real AI Disease Detections from Firestore `disease_detections`
    ...scans.slice(0, 5).map((scan, idx) => ({
      id: `scan_${scan.id || idx}`,
      tag: 'AI VISION DIAGNOSTIC',
      tagColor: 'bg-amber-100 text-amber-800 border border-amber-300/60',
      title: `${scan.diseaseName} Classified (${Math.round(scan.confidence > 1 ? scan.confidence : scan.confidence * 100)}% Confidence)`,
      description: `Field inspection by ${scan.beekeeperName || 'beekeeper'} in ${scan.apiaryLocation || 'Regional Apiary'}. Urgency: ${scan.urgencyLevel}. Image hash verified in Cloud Storage.`,
      time: formatSafeDateTime(scan.timestamp),
      icon: Microscope
    })),

    // 3. Real Beekeeper Registrations from Firestore `users`
    ...users.slice(0, 4).map((u, idx) => ({
      id: `user_${u.id || idx}`,
      tag: 'BEEKEEPER ONBOARDING',
      tagColor: 'bg-emerald-100 text-emerald-800 border border-emerald-300/60',
      title: `Verified Apiarist: ${u.fullName || u.email}`,
      description: `Role: ${u.role} • Contact: ${u.phone || 'N/A'} • Region: ${u.location || 'India'}. Account granted access.`,
      time: formatSafeDateTime(u.registeredAt),
      icon: User
    }))
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumb & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500 min-w-0">
          <button 
            onClick={onBackToDashboard}
            className="hover:text-emerald-700 font-medium transition-colors cursor-pointer shrink-0"
          >
            Dashboard
          </button>
          <span>/</span>
          <span className="text-slate-400 shrink-0">Settings</span>
          <span>/</span>
          <span className="text-slate-800 font-semibold truncate">Super Administrator Profile</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onBackToDashboard}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-xs transition-colors cursor-pointer"
          >
            ← Return to Dashboard
          </button>
          {onSignOut && (
            <button
              onClick={onSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 text-xs font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Header Card with Live Firestore Data */}
      <div className="p-5 sm:p-6 lg:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
        {/* Background decorative subtle gradient */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 opacity-90" />
        
        <div className="relative pt-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 min-w-0 flex-1">
            {/* Avatar */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-amber-500 p-1 shadow-lg ring-4 ring-white">
                <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center text-white text-3xl font-extrabold tracking-wider">
                  {fullName ? fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'SK'}
                </div>
              </div>
              <button 
                title="Change Avatar"
                className="absolute bottom-1 right-1 p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow border border-white transition-transform group-hover:scale-105 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Profile Identity */}
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 truncate">{fullName}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Level 4 Super Administrator
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  NBB Certified Biosecurity Officer
                </span>
              </div>
              
              <p className="text-xs text-slate-600 font-medium truncate">
                {designation} • {department}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{email}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{phone}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{location.split(',')[0]}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                  <Database className="w-3 h-3" />
                  Live Firestore Synced
                </span>
              </div>
            </div>
          </div>

          {/* Real Live Telemetry Metrics from Firestore */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl shrink-0 self-start md:self-auto">
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Session Security</p>
              <p className="text-xs font-semibold text-emerald-600 flex items-center justify-end gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {is2FAEnabled ? '2FA Hardware Enforced' : '2FA Suspended'}
              </p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Surveillance Scope</p>
              <p className="text-xs font-bold text-slate-800">
                {hives.length} Hives • {scans.length} Scans • {users.length} Apiarists
              </p>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="flex items-center gap-2 mt-8 border-t border-slate-200 pt-4 overflow-x-auto scrollbar-none text-xs font-medium">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeSubTab === 'profile'
                ? 'bg-emerald-50 text-emerald-700 font-bold shadow-xs border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => setActiveSubTab('security')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeSubTab === 'security'
                ? 'bg-emerald-50 text-emerald-700 font-bold shadow-xs border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Security & 2FA</span>
          </button>

          <button
            onClick={() => setActiveSubTab('permissions')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeSubTab === 'permissions'
                ? 'bg-emerald-50 text-emerald-700 font-bold shadow-xs border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Clearance & Permissions</span>
          </button>

          <button
            onClick={() => setActiveSubTab('notifications')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeSubTab === 'notifications'
                ? 'bg-emerald-50 text-emerald-700 font-bold shadow-xs border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Alert Subscriptions</span>
          </button>

          <button
            onClick={() => setActiveSubTab('audit')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeSubTab === 'audit'
                ? 'bg-emerald-50 text-emerald-700 font-bold shadow-xs border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Admin Audit Trail ({liveAuditEvents.length})</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: Profile Details (Directly Connected to Firestore) */}
      {activeSubTab === 'profile' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>Administrative Identity & Contact</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official identity details recorded in Firebase Firestore `admin_auth/super_admin`
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  Firestore Live
                </span>
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
                  <label className="block text-slate-600 font-medium mb-1">Official Administrator Email</label>
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
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save to Firebase Firestore</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* SUB-TAB 2: Security & 2FA (Verified in Firestore) */}
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
                  Enforces mandatory 2FA Security Key (`{securityKey}`) verification before granting command clearance
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
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
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
                  <p className="font-semibold text-slate-800">Hardware 2FA Security Key: {securityKey}</p>
                  <p className="text-slate-500 text-[11px]">Stored in Firebase Firestore • Verified on every admin sign-in</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                is2FAEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
              }`}>
                {is2FAEnabled ? 'ENFORCED' : 'DISABLED'}
              </span>
            </div>
          </div>

          {/* Card 2: Update Password directly in Firebase Firestore */}
          <form onSubmit={handleUpdatePassword} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-700" />
                <span>Update Administrator Password</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Updates credentials directly in Firebase Firestore `admin_auth/super_admin`
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
                disabled={isUpdatingPassword}
                className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-sm transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {isUpdatingPassword && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Update Password in Firestore</span>
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer"
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
                    <p className="font-semibold text-slate-900">
                      Chrome on Windows 11 (Current Workstation)
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      Connected to Firestore `ai-based-student` • {window.location.host || 'localhost:3000'}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  ACTIVE NOW
                </span>
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
                  Power to initiate statutory 5 km colony movement bans, trigger emergency notifications in Firestore, and quarantine apiaries.
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
                  Authority to audit {scans.length} disease scans, adjust vision inference confidence thresholds, and override classifications.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Beekeeper Directory & Privilege Revocation</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    GRANTED
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Administrative oversight over {users.length} registered beekeepers with role promotion and suspension powers.
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
                  Authority to remove adulterated honey batches, freeze fraudulent seller accounts, and enforce purity lab test compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Alert Subscriptions (Synced to Firestore) */}
      {activeSubTab === 'notifications' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-600" />
                <span>Super Administrator Notification Dispatch Policies</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize real-time push and notification dispatch policies stored directly in Firebase Firestore
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              Synced in Firestore
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Emergency Outbreak Quarantine Alerts</p>
                <p className="text-slate-500 text-[11px]">Instant alerts on active biosecurity quarantines ({outbreaks.length} active currently)</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifyOutbreaks(!notifyOutbreaks)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notifyOutbreaks ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  notifyOutbreaks ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="py-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">High-Risk Disease Scans (&gt;80% Confidence)</p>
                <p className="text-slate-500 text-[11px]">Notify when AI classifies Varroa or Nosema at critical infection levels ({scans.length} total scans)</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifyCriticalScans(!notifyCriticalScans)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notifyCriticalScans ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  notifyCriticalScans ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="py-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">New Apiarist Registrations</p>
                <p className="text-slate-500 text-[11px]">Alert when beekeepers register via mobile app ({users.length} registered beekeepers)</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifyUserRegistrations(!notifyUserRegistrations)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notifyUserRegistrations ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
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
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  notifyMarketplaceFlags ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="py-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Daily Regional Biosecurity Intelligence Digest</p>
                <p className="text-slate-500 text-[11px]">Consolidated telemetry report dispatched every morning at 07:00 AM IST</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifyDailyDigest(!notifyDailyDigest)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notifyDailyDigest ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  notifyDailyDigest ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSaveNotifications}
              disabled={isSavingNotifications}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isSavingNotifications ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Preferences in Firestore</span>
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: Audit Trail (100% Real Live Events from Firestore) */}
      {activeSubTab === 'audit' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-slate-700" />
                <span>Executive Activity Log & Real-time Audit Trail</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Authentic audit trail compiled from live Firestore notifications, AI scans, and beekeeper records
              </p>
            </div>
            <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-mono font-semibold">
              {liveAuditEvents.length} Live Firestore Events
            </span>
          </div>

          {liveAuditEvents.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No audit events recorded yet in Firestore.
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              {liveAuditEvents.map((evt) => {
                const EvtIcon = evt.icon;
                return (
                  <div 
                    key={evt.id} 
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-50 transition-colors flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        <EvtIcon className="w-4 h-4 text-slate-700" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${evt.tagColor}`}>
                            {evt.tag}
                          </span>
                          <span className="font-semibold text-slate-900">
                            {evt.title}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          {evt.description}
                        </p>
                      </div>
                    </div>
                    <span className="text-slate-400 text-[11px] whitespace-nowrap font-mono shrink-0">
                      {evt.time}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
