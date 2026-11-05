import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle, 
  Layers, 
  Activity, 
  ShoppingBag, 
  UserCheck, 
  UserX, 
  Copy, 
  Check, 
  ExternalLink,
  Shield,
  CheckCircle2,
  AlertCircle,
  ZoomIn,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { 
  UserAccount, 
  UserRole, 
  HiveRecord, 
  DiseaseScanRecord, 
  MarketplaceItem 
} from '../types';
import { ScanDetailView } from './ScanDetailView';
import { SuspendUserModal } from './SuspendUserModal';

interface BeekeeperDetailViewProps {
  user: UserAccount;
  hives: HiveRecord[];
  scans: DiseaseScanRecord[];
  marketplace: MarketplaceItem[];
  onBack: () => void;
  onToggleUserStatus: (userId: string, reason?: string) => void;
  onUpdateRole: (userId: string, newRole: UserRole) => void;
  onUpdateScanStatus?: (scanId: string, newStatus: 'CONFIRMED' | 'QUARANTINED' | 'RESOLVED') => void;
  onTriggerOutbreakBroadcast?: (diseaseName: string, region: string) => void;
  onShowToast?: (type: 'success' | 'warning' | 'info', title: string, desc?: string) => void;
}

export const BeekeeperDetailView: React.FC<BeekeeperDetailViewProps> = ({
  user,
  hives,
  scans,
  marketplace,
  onBack,
  onToggleUserStatus,
  onUpdateRole,
  onUpdateScanStatus,
  onTriggerOutbreakBroadcast,
  onShowToast
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'hives' | 'scans' | 'marketplace'>('overview');
  const [isCopiedId, setIsCopiedId] = useState(false);
  const [selectedScan, setSelectedScan] = useState<DiseaseScanRecord | null>(null);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);

  const isSuspended = user.status === 'suspended';

  // If a scan card is clicked, launch the complete Scan Detail View
  if (selectedScan) {
    return (
      <ScanDetailView
        scan={selectedScan}
        onBack={() => setSelectedScan(null)}
        onUpdateStatus={(scanId, newStatus) => {
          if (onUpdateScanStatus) {
            onUpdateScanStatus(scanId, newStatus);
          }
        }}
        onTriggerOutbreakBroadcast={onTriggerOutbreakBroadcast}
        onShowToast={onShowToast}
      />
    );
  }

  // Associated hives for this beekeeper
  const userHives = hives.filter(h => 
    h.beekeeperId === user.id || 
    h.beekeeperName.toLowerCase() === user.fullName.toLowerCase() ||
    (user.fullName.toLowerCase().includes('samyak') && h.beekeeperName.toLowerCase().includes('samyak'))
  );

  // Associated scans for this beekeeper
  const userScans = scans.filter(s => 
    s.beekeeperName.toLowerCase() === user.fullName.toLowerCase() ||
    (user.fullName.toLowerCase().includes('samyak') && s.beekeeperName.toLowerCase().includes('samyak')) ||
    userHives.some(h => h.id === s.hiveId || (s.apiaryLocation && s.apiaryLocation.includes(h.name)))
  );

  // Associated marketplace items
  const userProducts = marketplace.filter(m => 
    m.sellerId === user.id || 
    m.sellerName.toLowerCase() === user.fullName.toLowerCase() ||
    (user.fullName.toLowerCase().includes('samyak') && m.sellerName.toLowerCase().includes('samyak'))
  );

  // Health summary of user's hives
  const healthyCount = userHives.filter(h => h.healthStatus === 'HEALTHY').length;
  const infectedCount = userHives.filter(h => h.healthStatus === 'INFECTED').length;
  const warningCount = userHives.filter(h => h.healthStatus === 'WARNING').length;
  const healthRate = userHives.length > 0 ? Math.round((healthyCount / userHives.length) * 100) : 100;

  const handleCopyId = () => {
    navigator.clipboard.writeText(user.id);
    setIsCopiedId(true);
    if (onShowToast) onShowToast('info', 'ID Copied', 'Beekeeper Firebase UID copied to clipboard.');
    setTimeout(() => setIsCopiedId(false), 2000);
  };

  const handleToggle = () => {
    if (!isSuspended) {
      setIsSuspendModalOpen(true);
    } else {
      // Reactivate account
      onToggleUserStatus(user.id);
      if (onShowToast) {
        onShowToast(
          'success',
          'Account Re-activated',
          `${user.fullName}'s account access has been fully restored.`
        );
      }
    }
  };

  const handleConfirmSuspension = (userId: string, reason: string) => {
    onToggleUserStatus(userId, reason);
    if (onShowToast) {
      onShowToast(
        'warning',
        'Account Suspended',
        `${user.fullName} has been suspended. Lockout notice sent to user app.`
      );
    }
  };

  const handleRoleChange = (newRole: UserRole) => {
    onUpdateRole(user.id, newRole);
    if (onShowToast) {
      onShowToast('success', 'Role Updated', `${user.fullName} elevated to ${newRole}.`);
    }
  };

  const initials = user.fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const roleColors: Record<UserRole, string> = {
    ADMIN: 'bg-amber-100 text-amber-800 border-amber-200',
    INSPECTOR: 'bg-blue-100 text-blue-700 border-blue-200',
    RESEARCHER: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    BEEKEEPER: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600" />
            <span>Back to Directory</span>
          </button>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 min-w-0">
            <span>Directory</span>
            <span>/</span>
            <span>Beekeepers</span>
            <span>/</span>
            <span className="text-slate-800 font-semibold truncate max-w-[180px] md:max-w-[260px]">{user.fullName}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {user.role === 'BEEKEEPER' ? (
            <button
              onClick={() => handleRoleChange('INSPECTOR')}
              className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Promote to Inspector</span>
            </button>
          ) : user.role === 'INSPECTOR' ? (
            <button
              onClick={() => handleRoleChange('BEEKEEPER')}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <span>Demote to Beekeeper</span>
            </button>
          ) : null}

          <button
            onClick={handleToggle}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
              isSuspended
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
            }`}
          >
            <UserX className="w-3.5 h-3.5" />
            <span>{isSuspended ? 'Reactivate Account' : 'Suspend Account'}</span>
          </button>
        </div>
      </div>

      {/* Main Profile Header Banner Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
          <div className="flex items-center gap-4 sm:gap-5 min-w-0 flex-1">
            {/* Avatar Initials */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-md">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">{user.fullName}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border shrink-0 ${roleColors[user.role]}`}>
                  {user.role}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 shrink-0 ${
                  isSuspended 
                    ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isSuspended ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`} />
                  <span>{isSuspended ? 'Account Suspended' : 'Verified Apiarist'}</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{user.location || 'Maharashtra, India'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-medium text-slate-700">{user.experience || 'Registered Apiarist'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Member Since {user.registeredAt}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Contact & UID Buttons */}
          <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
            <button
              onClick={handleCopyId}
              title="Copy Firebase UID"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-mono transition-colors"
            >
              {isCopiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
              <span>UID: {user.id.slice(0, 10)}...</span>
            </button>

            <div className="flex items-center gap-2">
              {user.phone && user.phone !== 'N/A' && (
                <a
                  href={`tel:${user.phone}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-medium transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {user.phone}</span>
                </a>
              )}
              {user.email && user.email !== 'N/A' && (
                <a
                  href={`mailto:${user.email}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-medium transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Beekeeper</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {isSuspended && (
          <div className="mt-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-xs uppercase tracking-wider text-rose-950">Account Access Suspended</h3>
                {user.suspendedAt && (
                  <span className="text-[11px] text-rose-600 font-medium">• Action Date: {user.suspendedAt}</span>
                )}
              </div>
              <p className="text-xs text-rose-800 mt-1">
                <strong>Stated Reason:</strong> {user.suspendedReason || 'Violation of Apiary Biosecurity and Safety Standards'}
              </p>
              <p className="text-[11px] text-rose-600 mt-1">
                The beekeeper is currently locked out of all mobile features and is viewing this notification on their app.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 4 Key Metric Cards for this Beekeeper */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Registered Colonies</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{userHives.length || user.hivesCount}</span>
            <span className="text-xs text-slate-400">colonies</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {healthyCount} Healthy • {infectedCount} Infected
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">AI Disease Scans</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{userScans.length}</span>
            <span className="text-xs text-slate-400">records</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Diagnostic history from app
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Marketplace Listings</span>
            <ShoppingBag className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{userProducts.length}</span>
            <span className="text-xs text-slate-400">listed</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Active equipment & honey
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Colony Health Rate</span>
            <ShieldCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{healthRate}%</span>
            <span className="text-xs text-emerald-600 font-semibold">Healthy</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Biosecurity score
          </p>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeSubTab === 'overview'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          Beekeeper Dossier
        </button>
        <button
          onClick={() => setActiveSubTab('hives')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
            activeSubTab === 'hives'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <span>Managed Hives</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            activeSubTab === 'hives' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {userHives.length || user.hivesCount}
          </span>
        </button>
        <button
          onClick={() => setActiveSubTab('scans')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
            activeSubTab === 'scans'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <span>Disease Scans</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            activeSubTab === 'scans' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {userScans.length}
          </span>
        </button>
        <button
          onClick={() => setActiveSubTab('marketplace')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
            activeSubTab === 'marketplace'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <span>Marketplace</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            activeSubTab === 'marketplace' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {userProducts.length}
          </span>
        </button>
      </div>

      {/* Tab Content Section */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Detailed Profile Dossier */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Personal & Apiary Profile
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Full registration details stored in Firebase Authentication and Firestore
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">Full Name</span>
                <span className="text-sm font-bold text-slate-800 mt-0.5 block">{user.fullName}</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">Email Address</span>
                <span className="text-sm font-semibold text-slate-800 mt-0.5 block break-all">{user.email}</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">Phone Number</span>
                <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{user.phone || 'N/A'}</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">Regional Apiary Location</span>
                <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{user.location || 'Maharashtra, India'}</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">Beekeeping Experience</span>
                <span className="text-sm font-semibold text-emerald-700 mt-0.5 block">{user.experience || 'Registered Apiarist'}</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">Platform Role</span>
                <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{user.role}</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 sm:col-span-2">
                <span className="text-slate-400 block font-medium">Firebase User UID</span>
                <span className="text-xs font-mono font-medium text-slate-700 mt-0.5 block break-all select-all">
                  {user.id}
                </span>
              </div>
            </div>

            {/* Biosecurity Compliance Notice */}
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs flex items-start gap-3">
              <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-emerald-900">National Bee Board (NBB) Compliance Verified</h4>
                <p className="text-emerald-700 mt-0.5 leading-relaxed">
                  Colonies managed by {user.fullName} follow biosecurity standards for Indian honey bees (Apis cerana indica & Apis mellifera). AI diagnosis alerts are delivered in real time to the mobile device.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Summary & Recent Activity */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Apiary Health Status
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-600 font-medium mb-1">
                    <span>Healthy Colonies</span>
                    <span className="text-emerald-600 font-bold">{healthyCount} / {userHives.length || user.hivesCount}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${healthRate}%` }}
                    />
                  </div>
                </div>

                {warningCount > 0 && (
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50 border border-amber-100 text-amber-800">
                    <span className="flex items-center gap-1.5 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      At Risk / Warning
                    </span>
                    <span className="font-bold">{warningCount} hives</span>
                  </div>
                )}

                {infectedCount > 0 && (
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-rose-50 border border-rose-100 text-rose-800">
                    <span className="flex items-center gap-1.5 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      Infected / Quarantined
                    </span>
                    <span className="font-bold">{infectedCount} hives</span>
                  </div>
                )}

                {infectedCount === 0 && warningCount === 0 && (
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-800">
                    <span className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Zero Active Infections
                    </span>
                    <span className="font-bold text-emerald-700">Clear</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Quick Actions
              </h3>
              <div className="flex flex-col gap-2 text-xs">
                <button
                  onClick={() => setActiveSubTab('hives')}
                  className="w-full py-2 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>View Managed Colonies ({userHives.length || user.hivesCount})</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => setActiveSubTab('scans')}
                  className="w-full py-2 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <span>View Diagnosis History ({userScans.length})</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => setActiveSubTab('marketplace')}
                  className="w-full py-2 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-amber-600" />
                    <span>View Marketplace Items ({userProducts.length})</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Managed Hives Sub Tab */}
      {activeSubTab === 'hives' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Colonies Managed by {user.fullName}
              </h2>
              <p className="text-xs text-slate-500">
                {userHives.length > 0 ? `${userHives.length} active apiary units linked to this beekeeper` : 'No colonies individually assigned yet'}
              </p>
            </div>
          </div>

          {userHives.length === 0 ? (
            <div className="p-8 bg-white rounded-xl border border-slate-200 text-center space-y-2">
              <Layers className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No Hive Colonies Recorded</p>
              <p className="text-xs text-slate-400">
                This beekeeper hasn't registered individual hive units in the mobile app yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userHives.map(hive => (
                <div key={hive.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{hive.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{hive.apiaryLocation}</span>
                      </p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      hive.healthStatus === 'HEALTHY'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : hive.healthStatus === 'WARNING'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {hive.healthStatus}
                    </span>
                  </div>

                  {hive.primaryDiagnosis && (
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                      <span className="text-slate-400 font-medium">Diagnosis: </span>
                      <span className="font-semibold text-slate-700">{hive.primaryDiagnosis}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-100">
                    <div className="p-2 rounded bg-slate-50">
                      <span className="text-[10px] text-slate-400 uppercase block font-medium">Queen</span>
                      <strong className="text-slate-800 font-semibold">{hive.queenStatus}</strong>
                    </div>
                    <div className="p-2 rounded bg-slate-50">
                      <span className="text-[10px] text-slate-400 uppercase block font-medium">Frames</span>
                      <strong className="text-slate-800 font-semibold">{hive.frameCount} Deep</strong>
                    </div>
                    <div className="p-2 rounded bg-slate-50">
                      <span className="text-[10px] text-slate-400 uppercase block font-medium">Yield</span>
                      <strong className="text-slate-800 font-semibold">{hive.honeyYieldKg} kg</strong>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                    <span>Inspected: {hive.lastInspectionDate}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Disease Scans Sub Tab */}
      {activeSubTab === 'scans' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              AI Diagnostic Scans Recorded by {user.fullName}
            </h2>
            <p className="text-xs text-slate-500">
              Real AI model inspections performed by this beekeeper in the field
            </p>
          </div>

          {userScans.length === 0 ? (
            <div className="p-8 bg-white rounded-xl border border-slate-200 text-center space-y-2">
              <Activity className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No Disease Scans Found</p>
              <p className="text-xs text-slate-400">
                No diagnostic camera scans recorded under this beekeeper's account yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userScans.map(scan => (
                <div 
                  key={scan.id} 
                  onClick={() => setSelectedScan(scan)}
                  className="bg-white rounded-xl border border-slate-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between overflow-hidden group"
                >
                  {/* Image Preview & Badges */}
                  <div className="relative h-40 bg-slate-900 overflow-hidden">
                    <img 
                      src={scan.imageUrl} 
                      alt={scan.diseaseName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-white text-[11px] font-bold">
                        {Math.round(scan.confidence * 100)}% Conf.
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                        scan.urgencyLevel === 'CRITICAL'
                          ? 'bg-rose-500 text-white'
                          : scan.urgencyLevel === 'HIGH'
                          ? 'bg-orange-500 text-white'
                          : scan.urgencyLevel === 'MODERATE'
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-500 text-white'
                      }`}>
                        {scan.urgencyLevel}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-sm text-[11px] font-semibold text-white flex items-center gap-1">
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>Inspect Dossier</span>
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center justify-between">
                        <span>{scan.diseaseName}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{scan.apiaryLocation}</span>
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{scan.timestamp}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          scan.status === 'QUARANTINED'
                            ? 'bg-rose-100 text-rose-800'
                            : scan.status === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {scan.status}
                        </span>
                      </div>

                      {/* Open Full Diagnostic Dossier Pill */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-emerald-600 group-hover:text-emerald-700">
                        <span>Open Diagnostic Dossier</span>
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Marketplace Sub Tab */}
      {activeSubTab === 'marketplace' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Marketplace Listings by {user.fullName}
            </h2>
            <p className="text-xs text-slate-500">
              Apiculture equipment, colonies, and honey listed for sale
            </p>
          </div>

          {userProducts.length === 0 ? (
            <div className="p-8 bg-white rounded-xl border border-slate-200 text-center space-y-2">
              <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No Marketplace Listings</p>
              <p className="text-xs text-slate-400">
                This beekeeper hasn't posted any products for sale in the marketplace.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userProducts.map(product => (
                <div key={product.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{product.productName}</h3>
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                        {product.category}
                      </span>
                    </div>
                    <span className="text-sm font-extrabold text-amber-600">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{product.location}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Listed {product.createdAt}</span>
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      product.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : product.status === 'FLAGGED'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {product.status === 'ACTIVE' ? 'Approved' : product.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Account Suspension Modal */}
      <SuspendUserModal
        isOpen={isSuspendModalOpen}
        user={user}
        onClose={() => setIsSuspendModalOpen(false)}
        onConfirm={handleConfirmSuspension}
      />
    </div>
  );
};

export default BeekeeperDetailView;
