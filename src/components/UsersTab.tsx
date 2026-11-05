import React, { useState } from 'react';
import { Users, Mail, Phone, MapPin, Award, UserCheck, UserX, ArrowRight, ChevronRight, AlertTriangle } from 'lucide-react';
import { UserAccount, UserRole, HiveRecord, DiseaseScanRecord, MarketplaceItem } from '../types';
import { BeekeeperDetailView } from './BeekeeperDetailView';
import { SuspendUserModal } from './SuspendUserModal';

interface UsersTabProps {
  users: UserAccount[];
  hives?: HiveRecord[];
  scans?: DiseaseScanRecord[];
  marketplace?: MarketplaceItem[];
  onToggleUserStatus: (userId: string, reason?: string) => void;
  onUpdateRole: (userId: string, newRole: UserRole) => void;
  onUpdateScanStatus?: (scanId: string, newStatus: 'CONFIRMED' | 'QUARANTINED' | 'RESOLVED') => void;
  onTriggerOutbreakBroadcast?: (diseaseName: string, region: string) => void;
  onShowToast?: (type: 'success' | 'warning' | 'info', title: string, desc?: string) => void;
}

export const UsersTab: React.FC<UsersTabProps> = ({
  users,
  hives = [],
  scans = [],
  marketplace = [],
  onToggleUserStatus,
  onUpdateRole,
  onUpdateScanStatus,
  onTriggerOutbreakBroadcast,
  onShowToast
}) => {
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [suspendingUser, setSuspendingUser] = useState<UserAccount | null>(null);

  const selectedUser = users.find((u) => u.id === selectedUserId);

  // If a beekeeper card was clicked, render the comprehensive Beekeeper Detail View
  if (selectedUser) {
    return (
      <BeekeeperDetailView
        user={selectedUser}
        hives={hives}
        scans={scans}
        marketplace={marketplace}
        onBack={() => setSelectedUserId(null)}
        onToggleUserStatus={onToggleUserStatus}
        onUpdateRole={onUpdateRole}
        onUpdateScanStatus={onUpdateScanStatus}
        onTriggerOutbreakBroadcast={onTriggerOutbreakBroadcast}
        onShowToast={onShowToast}
      />
    );
  }

  const filteredUsers = users.filter((u) => {
    if (roleFilter === 'ALL') return true;
    return u.role === roleFilter;
  });

  const handleToggle = (e: React.MouseEvent, user: UserAccount) => {
    e.stopPropagation();
    if (user.status !== 'suspended') {
      setSuspendingUser(user);
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
    if (onShowToast && suspendingUser) {
      onShowToast(
        'warning',
        'Account Suspended',
        `${suspendingUser.fullName} has been suspended. Lockout notice sent to user app.`
      );
    }
  };

  const handlePromote = (e: React.MouseEvent, user: UserAccount) => {
    e.stopPropagation();
    const nextRole: UserRole = user.role === 'BEEKEEPER' ? 'INSPECTOR' : 'RESEARCHER';
    onUpdateRole(user.id, nextRole);
    if (onShowToast) {
      onShowToast('success', 'Role Elevated', `${user.fullName} is now an ${nextRole}.`);
    }
  };

  const initialsGradients = [
    'from-emerald-500 to-teal-600',
    'from-blue-500 to-purple-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600'
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">
      {/* Header & Role Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600 shrink-0" />
            <span className="truncate">Beekeeper & Apiarist Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage {filteredUsers.length} registered beekeepers, regional inspectors & researchers • Click any card for full profile
          </p>
        </div>

        <div className="shrink-0">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none cursor-pointer shadow-sm font-medium"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="INSPECTOR">Inspectors</option>
            <option value="BEEKEEPER">Beekeepers</option>
            <option value="RESEARCHER">Researchers</option>
          </select>
        </div>
      </div>

      {/* Users Grid or Empty State */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No apiarists found matching role filter</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Switch filter to "All Roles" to view all registered users in the network.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredUsers.map((user, idx) => {
            const isSuspended = user.status === 'suspended';
            const initials = user.fullName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            const gradient = initialsGradients[idx % initialsGradients.length];

            const roleColors: Record<UserRole, string> = {
              ADMIN: 'bg-amber-100 text-amber-800 border border-amber-200',
              INSPECTOR: 'bg-blue-100 text-blue-700 border border-blue-200',
              RESEARCHER: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
              BEEKEEPER: 'bg-slate-100 text-slate-700 border border-slate-200'
            };

            return (
              <div
                key={user.id}
                onClick={() => setSelectedUserId(user.id)}
                className={`p-5 sm:p-6 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group relative ${
                  isSuspended ? 'opacity-70' : ''
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center justify-between gap-1">
                          <span className="truncate">{user.fullName}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 min-w-0">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{user.location || 'Maharashtra, India'}</span>
                        </p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap inline-block shrink-0 ${roleColors[user.role]}`}>
                      {user.role}
                    </span>
                  </div>

                  <div className="space-y-1.5 py-3 border-y border-slate-100 text-xs text-slate-600">
                    <p className="flex items-center gap-2 min-w-0">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </p>
                    <p className="flex items-center gap-2 min-w-0">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{user.phone}</span>
                    </p>
                    <p className="flex items-center gap-2 min-w-0">
                      <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate text-slate-700 font-medium">{user.experience || 'Registered Apiarist'}</span>
                    </p>
                  </div>

                  {isSuspended && (
                    <div className="mt-2 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-[11px] space-y-0.5">
                      <div className="flex items-center gap-1 font-semibold text-rose-700">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        <span>Account Suspended</span>
                      </div>
                      <p className="text-slate-600 line-clamp-2" title={user.suspendedReason || 'Biosecurity violation'}>
                        Reason: <span className="font-medium text-rose-950">{user.suspendedReason || 'Biosecurity violation'}</span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-slate-500 font-medium truncate mr-1">
                      Managed Hives: <strong className="text-slate-900">{user.hivesCount}</strong>
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {user.role === 'BEEKEEPER' && (
                        <button
                          onClick={(e) => handlePromote(e, user)}
                          title="Promote Role"
                          className="px-2 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <UserCheck className="w-3 h-3" />
                          <span>Promote</span>
                        </button>
                      )}

                      <button
                        onClick={(e) => handleToggle(e, user)}
                        title={isSuspended ? 'Reactivate Beekeeper' : 'Suspend Beekeeper'}
                        className={`px-2 py-1 rounded-md text-[11px] font-semibold border inline-flex items-center gap-1 transition-colors cursor-pointer ${
                          isSuspended
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        <UserX className="w-3 h-3" />
                        <span>{isSuspended ? 'Reactivate' : 'Suspend'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Click for Detail View Pill */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-emerald-600 group-hover:text-emerald-700">
                    <span className="truncate">Open Full Beekeeper Profile</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Account Suspension Modal */}
      <SuspendUserModal
        isOpen={!!suspendingUser}
        user={suspendingUser}
        onClose={() => setSuspendingUser(null)}
        onConfirm={handleConfirmSuspension}
      />
    </div>
  );
};

export default UsersTab;
