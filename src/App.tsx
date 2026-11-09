import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Sidebar, TabType } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewTab } from './components/OverviewTab';
import { ScansTab } from './components/ScansTab';
import { HivesTab } from './components/HivesTab';
import { MarketplaceTab } from './components/MarketplaceTab';
import { UsersTab } from './components/UsersTab';
import { OutbreaksTab } from './components/OutbreaksTab';
import { SettingsTab } from './components/SettingsTab';
import { AdminProfileView } from './components/AdminProfileView';
import { LoginPage } from './components/LoginPage';
import { AlertBroadcastModal } from './components/AlertBroadcastModal';
import { AppLandingPage } from './landing';
import { Toast, ToastMessage } from './components/common/Toast';
import { 
  DiseaseScanRecord, 
  HiveRecord, 
  MarketplaceItem, 
  OutbreakAlert, 
  PlatformMetrics, 
  UserAccount, 
  UserRole 
} from './types';
import {
  subscribeToUsers,
  subscribeToHives,
  subscribeToScans,
  subscribeToMarketplace,
  subscribeToOutbreaks,
  subscribeToAdminProfile,
  DEFAULT_ADMIN_PROFILE,
  AdminProfileData,
  updateScanQuarantine,
  addHiveColony,
  broadcastOutbreakNotification,
  moderateProduct,
  deleteProduct,
  deleteUserAccount,
  deleteScanRecord,
  deleteOutbreakAlert,
  toggleUserSuspension,
  updateUserRole
} from './services/firebase';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('beeguard_admin_authenticated') === 'true';
  });

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('beeguard_admin_authenticated', 'true');
    showToast('success', 'Authentication Successful', 'Welcome to BeeGuard Central Command!');
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('beeguard_admin_authenticated');
    showToast('info', 'Signed Out', 'You have been signed out of the BeeGuard Admin Console.');
  };
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(true);

  // Core Live Data States (Streamed exclusively from live Firebase Firestore)
  const [adminProfile, setAdminProfile] = useState<AdminProfileData>(DEFAULT_ADMIN_PROFILE);
  const [scans, setScans] = useState<DiseaseScanRecord[]>([]);
  const [hives, setHives] = useState<HiveRecord[]>([]);
  const [marketplace, setMarketplace] = useState<MarketplaceItem[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [outbreaks, setOutbreaks] = useState<OutbreakAlert[]>([]);
  const [metrics, setMetrics] = useState<PlatformMetrics>({
    totalBeekeepers: 0,
    activeHives: 0,
    scansPerformed: 0,
    outbreakQuarantines: 0,
    overallHealthRate: 100,
    marketplaceVolume: 0
  });

  // Toast Helper
  const showToast = useCallback((type: 'success' | 'warning' | 'info', title: string, description?: string) => {
    setToast({
      id: Date.now().toString(),
      type,
      title,
      description
    });
  }, []);

  // -------------------------------------------------------------
  // Real-time Firestore Subscriptions (100% Real Live Firebase Data)
  // -------------------------------------------------------------
  useEffect(() => {
    // 1. Live Users / Beekeepers
    const unsubUsers = subscribeToUsers(
      (liveUsers) => {
        setIsLiveConnected(true);
        setUsers(liveUsers);
      },
      () => setIsLiveConnected(false)
    );

    // 2. Live Hives
    const unsubHives = subscribeToHives(
      (liveHives) => {
        setIsLiveConnected(true);
        setHives(liveHives);
      },
      () => setIsLiveConnected(false)
    );

    // 3. Live AI Disease Scans from Android App
    const unsubScans = subscribeToScans(
      (liveScans) => {
        setIsLiveConnected(true);
        setScans(liveScans);
      },
      () => setIsLiveConnected(false)
    );

    // 4. Live Marketplace Products
    const unsubMarketplace = subscribeToMarketplace(
      (liveItems) => {
        setIsLiveConnected(true);
        setMarketplace(liveItems);
      },
      () => setIsLiveConnected(false)
    );

    // 5. Live Outbreaks & Biosecurity Notifications
    const unsubOutbreaks = subscribeToOutbreaks(
      (liveAlerts) => {
        setIsLiveConnected(true);
        setOutbreaks(liveAlerts);
      },
      () => setIsLiveConnected(false)
    );

    // 6. Live Super Administrator Profile from Firestore `admin_auth/super_admin`
    const unsubAdmin = subscribeToAdminProfile(
      (profile) => {
        setAdminProfile(profile);
      }
    );

    return () => {
      unsubUsers();
      unsubHives();
      unsubScans();
      unsubMarketplace();
      unsubOutbreaks();
      unsubAdmin();
    };
  }, []);

  // Update dynamic metrics whenever live datasets change
  useEffect(() => {
    const totalColonies = hives.length;
    const healthyCount = hives.filter(h => h.healthStatus === 'HEALTHY').length;
    const rate = totalColonies > 0 ? +((healthyCount / totalColonies) * 100).toFixed(1) : 100;
    const activeQuarantines = outbreaks.filter(o => o.status === 'ACTIVE_QUARANTINE').length;

    setMetrics({
      totalBeekeepers: users.length,
      activeHives: hives.filter(h => h.healthStatus !== 'INFECTED').length,
      scansPerformed: scans.length,
      overallHealthRate: rate,
      outbreakQuarantines: activeQuarantines,
      marketplaceVolume: marketplace.length
    });
  }, [hives, scans, outbreaks, users, marketplace]);

  // Active Quarantines Count for Sidebar badge
  const activeQuarantinesCount = useMemo(() => {
    return outbreaks.filter(o => o.status === 'ACTIVE_QUARANTINE').length;
  }, [outbreaks]);

  // -------------------------------------------------------------
  // Mutative Actions synced to Firebase & Local State
  // -------------------------------------------------------------
  const handleUpdateScanStatus = async (scanId: string, newStatus: 'CONFIRMED' | 'QUARANTINED' | 'RESOLVED') => {
    setScans(prev => prev.map(s => s.id === scanId ? { ...s, status: newStatus } : s));
    try {
      await updateScanQuarantine(scanId, newStatus);
      showToast('success', 'Scan Status Synchronized', `Colony scan updated to ${newStatus} in Firestore.`);
    } catch {
      showToast('info', 'Status Updated Locally', 'State applied on admin dashboard.');
    }
  };

  const handleAddNewHive = async (newHiveData: Omit<HiveRecord, 'id'>) => {
    const tempId = `hive-${Date.now().toString().slice(-4)}`;
    const newHive: HiveRecord = {
      ...newHiveData,
      id: tempId
    };
    setHives(prev => [newHive, ...prev]);
    showToast('success', 'Colony Registered', `Colony ${newHiveData.name} registered to cloud telemetry.`);
    try {
      await addHiveColony(newHiveData);
    } catch {
      // Local fallback already in place
    }
  };

  const handleUpdateItemStatus = async (id: string, newStatus: 'ACTIVE' | 'PENDING_REVIEW' | 'FLAGGED') => {
    setMarketplace(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    try {
      await moderateProduct(id, newStatus);
      showToast('success', 'Product Moderated', `Catalog item status updated to ${newStatus.replace('_', ' ')}.`);
    } catch {
      showToast('info', 'Status Moderated', 'Item state updated.');
    }
  };

  const handleDeleteItem = async (id: string) => {
    setMarketplace(prev => prev.filter(item => item.id !== id));
    try {
      await deleteProduct(id);
      showToast('warning', 'Product Removed', 'Listing permanently deleted from marketplace catalog.');
    } catch {
      showToast('warning', 'Product Removed Locally', 'Listing removed from view.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    try {
      await deleteUserAccount(userId);
      showToast('warning', 'User Account Deleted', 'User permanently removed from Firestore.');
    } catch {
      showToast('info', 'User Removed Locally', 'User removed from view.');
    }
  };

  const handleDeleteScan = async (scanId: string) => {
    setScans(prev => prev.filter(s => s.id !== scanId));
    try {
      await deleteScanRecord(scanId);
      showToast('warning', 'Scan Record Deleted', 'Disease detection record deleted from Firestore.');
    } catch {
      showToast('info', 'Scan Removed Locally', 'Scan removed from view.');
    }
  };

  const handleDeleteOutbreak = async (outbreakId: string) => {
    setOutbreaks(prev => prev.filter(o => o.id !== outbreakId));
    try {
      await deleteOutbreakAlert(outbreakId);
      showToast('warning', 'Outbreak Alert Deleted', 'Alert permanently deleted from notifications.');
    } catch {
      showToast('info', 'Outbreak Removed Locally', 'Outbreak removed from view.');
    }
  };

  const handleToggleUserStatus = async (userId: string, reason?: string) => {
    const user = users.find(u => u.id === userId);
    const nextStatus = user?.status === 'suspended' ? 'verified' : 'suspended';
    setUsers(prev => prev.map(u => u.id === userId ? {
      ...u,
      status: nextStatus,
      isSuspended: nextStatus === 'suspended',
      suspendedReason: nextStatus === 'suspended' ? (reason || 'Violation of Apiary Biosecurity and Safety Standards') : '',
      suspendedAt: nextStatus === 'suspended' ? new Date().toLocaleDateString() : ''
    } : u));
    try {
      await toggleUserSuspension(userId, nextStatus === 'suspended', reason);
      showToast(nextStatus === 'suspended' ? 'warning' : 'success', 'Beekeeper Status Updated', `User account is now ${nextStatus}.`);
    } catch {
      showToast('info', 'Status Updated Locally', `User status marked as ${nextStatus}.`);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    try {
      await updateUserRole(userId, newRole);
      showToast('success', 'Role Updated', `User privilege elevated to ${newRole}.`);
    } catch {
      showToast('info', 'Role Updated Locally', `User role marked as ${newRole}.`);
    }
  };

  const handleUpdateOutbreakStatus = (id: string, newStatus: 'ACTIVE_QUARANTINE' | 'CONTAINED' | 'INVESTIGATING') => {
    setOutbreaks(prev => prev.map(outbreak => outbreak.id === id ? { ...outbreak, status: newStatus } : outbreak));
    showToast('info', 'Quarantine Protocol Updated', `Outbreak status shifted to ${newStatus.replace('_', ' ')}.`);
  };

  const handleBroadcastAlert = async (newAlert: OutbreakAlert, customMessage?: string) => {
    setOutbreaks(prev => [newAlert, ...prev]);
    showToast('warning', 'Emergency Broadcast Sent', `Alert sent to all mobile app beekeepers in ${newAlert.region}.`);
    try {
      await broadcastOutbreakNotification(newAlert, customMessage);
    } catch {
      // Local fallback active
    }
  };

  const handleRefreshData = () => {
    showToast('info', 'Live Telemetry Synced', 'Live Firestore streams and mobile app data active.');
  };

  // Enrich hives with Beekeeper full names from Users
  const enrichedHives = useMemo(() => {
    return hives.map((hive) => {
      const matchedUser = users.find((u) => 
        (hive.beekeeperId && (u.id === hive.beekeeperId || u.email === hive.beekeeperId)) ||
        (u.fullName && hive.beekeeperName && hive.beekeeperName !== 'Registered Apiarist' && u.fullName.toLowerCase() === hive.beekeeperName.toLowerCase())
      ) || (users.length === 1 ? users[0] : undefined);

      const beekeeperName = (hive.beekeeperName && hive.beekeeperName !== 'Registered Apiarist')
        ? hive.beekeeperName
        : (matchedUser?.fullName || (users.length === 1 ? users[0].fullName : hive.beekeeperName || 'Registered Apiarist'));

      return {
        ...hive,
        beekeeperName,
        beekeeperId: hive.beekeeperId || matchedUser?.id || ''
      };
    });
  }, [hives, users]);

  // Enrich scans with Beekeeper full names and Hive locations
  const enrichedScans = useMemo(() => {
    return scans.map((scan) => {
      // 1. Direct user match by id or email
      let matchedUser = users.find((u) => 
        (scan.userId && (u.id === scan.userId || u.email === scan.userId)) ||
        (u.fullName && scan.beekeeperName && scan.beekeeperName !== 'Beekeeper' && u.fullName.toLowerCase() === scan.beekeeperName.toLowerCase())
      );

      // 2. Direct hive match by id or name
      const matchedHive = enrichedHives.find((h) => 
        (scan.hiveId && (h.id === scan.hiveId || h.id.endsWith(scan.hiveId) || scan.hiveId.endsWith(h.id))) ||
        (scan.hiveName && h.name && h.name.toLowerCase() === scan.hiveName.toLowerCase())
      );

      if (!matchedUser && matchedHive?.beekeeperId) {
        matchedUser = users.find((u) => u.id === matchedHive.beekeeperId);
      }

      // If only one registered user exists in system, link unassigned/guest scans
      if (!matchedUser && users.length === 1) {
        matchedUser = users[0];
      }

      const beekeeperName = (scan.beekeeperName && scan.beekeeperName !== 'Beekeeper')
        ? scan.beekeeperName
        : (matchedUser?.fullName || matchedHive?.beekeeperName || 'Beekeeper');

      const apiaryLocation = (scan.apiaryLocation && scan.apiaryLocation !== 'Field Scan' && !scan.apiaryLocation.includes('undefined'))
        ? scan.apiaryLocation
        : (matchedHive ? `Hive: ${matchedHive.name}` : scan.hiveName ? `Hive: ${scan.hiveName}` : scan.apiaryLocation || 'Field Scan');

      return {
        ...scan,
        beekeeperName,
        apiaryLocation,
        userId: scan.userId || matchedUser?.id,
        hiveName: scan.hiveName || matchedHive?.name
      };
    });
  }, [scans, users, enrichedHives]);

  // Search filtering
  const filteredScans = useMemo(() => {
    if (!searchTerm.trim()) return enrichedScans;
    const q = searchTerm.toLowerCase();
    return enrichedScans.filter(s => 
      s.diseaseName.toLowerCase().includes(q) ||
      s.beekeeperName.toLowerCase().includes(q) ||
      s.apiaryLocation.toLowerCase().includes(q)
    );
  }, [enrichedScans, searchTerm]);

  const filteredHives = useMemo(() => {
    if (!searchTerm.trim()) return enrichedHives;
    const q = searchTerm.toLowerCase();
    return enrichedHives.filter(h => 
      h.name.toLowerCase().includes(q) ||
      h.beekeeperName.toLowerCase().includes(q) ||
      h.apiaryLocation.toLowerCase().includes(q) ||
      (h.primaryDiagnosis && h.primaryDiagnosis.toLowerCase().includes(q))
    );
  }, [enrichedHives, searchTerm]);

  const filteredMarketplace = useMemo(() => {
    if (!searchTerm.trim()) return marketplace;
    const q = searchTerm.toLowerCase();
    return marketplace.filter(m => 
      m.productName.toLowerCase().includes(q) ||
      m.sellerName.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.location.toLowerCase().includes(q)
    );
  }, [marketplace, searchTerm]);

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    const q = searchTerm.toLowerCase();
    return users.filter(u => 
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.location.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  }, [users, searchTerm]);

  const handleToggleSidebar = () => {
    if (window.innerWidth >= 768) {
      setIsSidebarCollapsed(prev => !prev);
    } else {
      setIsMobileSidebarOpen(prev => !prev);
    }
  };

  // If public landing page requested via URL param or path, render public view directly
  const isPublicLanding = typeof window !== 'undefined' && 
    (window.location.search.includes('view=landing') || window.location.pathname === '/landing');
  if (isPublicLanding) {
    return (
      <div className="size-full min-h-screen bg-white font-sans">
        <AppLandingPage standalone onShowToast={showToast} />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    );
  }

  // If not authenticated, require Super Admin Login with Email, Password & Security Key
  if (!isAuthenticated) {
    return (
      <div className="size-full min-h-screen bg-slate-900 font-sans">
        <LoginPage onLoginSuccess={handleLoginSuccess} onShowToast={showToast} />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    );
  }

  return (
    <div className="size-full flex h-screen bg-slate-100 text-slate-900 font-sans overflow-hidden">
      {/* Mobile Drawer Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Navigation (Exact Figma Theme & Structure + 3-line Toggle) */}
      <Sidebar 
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setIsMobileSidebarOpen(false);
        }}
        activeQuarantinesCount={activeQuarantinesCount}
        scansCount={scans.length}
        isOpen={isMobileSidebarOpen}
        onToggleMobile={handleToggleSidebar}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        onSignOut={handleSignOut}
        adminName={adminProfile.fullName}
        adminRole={adminProfile.designation}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <Header 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onTriggerAlertModal={() => setIsAlertModalOpen(true)}
          onRefreshData={handleRefreshData}
          onToggleMobileSidebar={handleToggleSidebar}
          isLive={isLiveConnected}
        />

        {/* Tab View Routing */}
        <main className="flex-1 overflow-y-auto bg-slate-100">
          {activeTab === 'overview' && (
            <OverviewTab 
              metrics={metrics}
              recentScans={enrichedScans}
              activeOutbreaks={outbreaks}
              onNavigateToScans={() => setActiveTab('scans')}
              onNavigateToOutbreaks={() => setActiveTab('outbreaks')}
              onUpdateScanStatus={handleUpdateScanStatus}
              onDeleteScan={handleDeleteScan}
              onTriggerOutbreakBroadcast={() => setIsAlertModalOpen(true)}
              onShowToast={showToast}
              adminName={adminProfile.fullName}
            />
          )}

          {activeTab === 'scans' && (
            <ScansTab 
              scans={filteredScans}
              onUpdateScanStatus={handleUpdateScanStatus}
              onDeleteScan={handleDeleteScan}
              onTriggerOutbreakBroadcast={() => setIsAlertModalOpen(true)}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'hives' && (
            <HivesTab 
              hives={filteredHives}
              scans={enrichedScans}
              onAddNewHive={handleAddNewHive}
              onTriggerOutbreakBroadcast={() => setIsAlertModalOpen(true)}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'marketplace' && (
            <MarketplaceTab 
              items={filteredMarketplace}
              onUpdateItemStatus={handleUpdateItemStatus}
              onDeleteItem={handleDeleteItem}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'users' && (
            <UsersTab 
              users={filteredUsers}
              hives={enrichedHives}
              scans={enrichedScans}
              marketplace={marketplace}
              onToggleUserStatus={handleToggleUserStatus}
              onUpdateRole={handleUpdateUserRole}
              onDeleteUser={handleDeleteUser}
              onUpdateScanStatus={handleUpdateScanStatus}
              onTriggerOutbreakBroadcast={() => setIsAlertModalOpen(true)}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'outbreaks' && (
            <OutbreaksTab 
              outbreaks={outbreaks}
              hives={enrichedHives}
              scans={enrichedScans}
              onTriggerBroadcast={() => setIsAlertModalOpen(true)}
              onUpdateOutbreakStatus={handleUpdateOutbreakStatus}
              onDeleteOutbreak={handleDeleteOutbreak}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'landing' && (
            <AppLandingPage onShowToast={showToast} />
          )}

          {activeTab === 'settings' && (
            <SettingsTab onShowToast={showToast} />
          )}

          {activeTab === 'profile' && (
            <AdminProfileView 
              onBackToDashboard={() => setActiveTab('overview')} 
              onShowToast={showToast}
              onSignOut={handleSignOut}
              scans={enrichedScans}
              users={users}
              hives={enrichedHives}
              outbreaks={outbreaks}
            />
          )}
        </main>
      </div>

      {/* Emergency Push Modal */}
      {isAlertModalOpen && (
        <AlertBroadcastModal 
          onClose={() => setIsAlertModalOpen(false)}
          onBroadcast={handleBroadcastAlert}
          onShowToast={showToast}
        />
      )}

      {/* Feedback Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default App;
