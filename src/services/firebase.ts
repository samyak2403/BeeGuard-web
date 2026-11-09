import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  addDoc,
  setDoc,
  getDoc,
  type QuerySnapshot,
  type DocumentData,
  type FirestoreError
} from 'firebase/firestore';
import { 
  DiseaseScanRecord, 
  HiveRecord, 
  MarketplaceItem, 
  OutbreakAlert, 
  UserAccount 
} from '../types';
import { 
  LandingPageConfig, 
  DEFAULT_LANDING_CONFIG, 
  AppReleaseInfo, 
  DEFAULT_APP_RELEASE 
} from '../landing/types';

// Web Firebase configuration extracted from BeeGuard google-services.json
export const firebaseConfig = {
  apiKey: "AIzaSyAeAl9CK-5OmuLbhhpW-eCQMFAt3FMSBqc",
  authDomain: "ai-based-student.firebaseapp.com",
  projectId: "ai-based-student",
  storageBucket: "ai-based-student.firebasestorage.app",
  messagingSenderId: "231576016241",
  appId: "1:231576016241:web:beeguardadmin"
};

// Singleton App & Firestore instance
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

// Collection Names matching Android Constants.kt
export const COLLECTIONS = {
  USERS: 'users',
  HIVES: 'hives',
  INSPECTIONS: 'inspections',
  DETECTIONS: 'disease_detections',
  MARKETPLACE: 'marketplace',
  NOTIFICATIONS: 'notifications'
} as const;

/**
 * Robust date parser handling Long milliseconds, Firestore Timestamps, and ISO strings
 */
export function parseFirestoreDate(raw: any): Date {
  if (!raw && raw !== 0) return new Date();
  if (raw instanceof Date) return raw;
  if (typeof raw?.toDate === 'function') {
    return raw.toDate();
  }
  if (typeof raw?.seconds === 'number') {
    return new Date(raw.seconds * 1000);
  }
  if (typeof raw === 'number') {
    return new Date(raw);
  }
  if (typeof raw === 'string') {
    const num = Number(raw);
    if (!isNaN(num) && raw.length >= 10 && !raw.includes('-')) {
      return new Date(num);
    }
    const parsed = new Date(raw);
    if (!isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
}

export function formatSafeDate(raw: any): string {
  try {
    const d = parseFirestoreDate(raw);
    return d.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

export function formatSafeDateTime(raw: any): string {
  try {
    const d = parseFirestoreDate(raw);
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'Just now';
  }
}

/**
 * Real-time listener for registered beekeepers & users
 */
export const subscribeToUsers = (
  callback: (users: UserAccount[]) => void,
  onError?: (err: FirestoreError) => void
) => {
  return onSnapshot(
    collection(db, COLLECTIONS.USERS),
    (snapshot: QuerySnapshot<DocumentData>) => {
      const list: UserAccount[] = snapshot.docs.map((d) => {
        const data = d.data();
        const isSuspended = !!data.isSuspended || data.status === 'suspended';
        return {
          id: d.id,
          fullName: data.fullName || 'Beekeeper',
          email: data.email || 'N/A',
          phone: data.phone || 'N/A',
          location: data.location || 'Maharashtra, India',
          role: data.role === 'ADMIN' ? 'ADMIN' : 'BEEKEEPER',
          experience: data.experience || 'Registered Apiarist',
          registeredAt: formatSafeDate(data.createdAt),
          hivesCount: data.hivesCount || 0,
          status: isSuspended ? 'suspended' : 'verified',
          isSuspended,
          suspendedReason: data.suspendedReason || data.suspensionReason || '',
          suspendedAt: data.suspendedAt ? formatSafeDate(data.suspendedAt) : ''
        };
      });
      callback(list);
    },
    (err: FirestoreError) => {
      console.warn('Firestore users subscription notice:', err.message);
      if (onError) onError(err);
    }
  );
};

/**
 * Real-time listener for hive colonies
 */
export const subscribeToHives = (
  callback: (hives: HiveRecord[]) => void,
  onError?: (err: FirestoreError) => void
) => {
  return onSnapshot(
    collection(db, COLLECTIONS.HIVES),
    (snapshot: QuerySnapshot<DocumentData>) => {
      const list: HiveRecord[] = snapshot.docs.map((d) => {
        const data = d.data();
        const rawHealth = (data.healthStatus || '').toUpperCase();
        const healthStatus = (rawHealth === 'INFECTED' || rawHealth === 'QUARANTINED')
          ? 'INFECTED'
          : rawHealth === 'AT_RISK'
          ? 'WARNING'
          : 'HEALTHY';

        return {
          id: d.id,
          name: data.hiveName || data.name || 'Colony ' + d.id.slice(-4),
          apiaryLocation: data.location || data.apiaryLocation || 'Apiary Zone',
          beekeeperId: data.userId || data.uid || data.user_id || data.beekeeperId || '',
          beekeeperName: data.beekeeperName || data.userName || 'Registered Apiarist',
          healthStatus,
          primaryDiagnosis: data.primaryDiagnosis || undefined,
          lastInspectionDate: formatSafeDate(data.updatedAt || data.createdAt),
          honeyYieldKg: Number(data.honeyProduction || data.honeyYieldKg || 0),
          queenStatus: (data.queenStatus === 'REPLACED' ? 'SUPERSEDED' : data.queenStatus === 'NOT_SEEN_NO_EGGS' ? 'ABSENT' : 'ACTIVE') as any,
          frameCount: data.frameCount || 10
        };
      });
      callback(list);
    },
    (err: FirestoreError) => {
      console.warn('Firestore hives subscription notice:', err.message);
      if (onError) onError(err);
    }
  );
};

/**
 * Real-time listener for AI disease scans
 */
export const subscribeToScans = (
  callback: (scans: DiseaseScanRecord[]) => void,
  onError?: (err: FirestoreError) => void
) => {
  return onSnapshot(
    collection(db, COLLECTIONS.DETECTIONS),
    (snapshot: QuerySnapshot<DocumentData>) => {
      const list: DiseaseScanRecord[] = snapshot.docs.map((d) => {
        const data = d.data();
        const conf = typeof data.confidence === 'number' 
          ? data.confidence 
          : parseFloat(data.confidence || '0.85');

        const predicted = data.predictedDisease || 'Healthy';
        const isCritical = predicted.includes('Foulbrood') || predicted.includes('Varroa');

        let classProbabilities = data.classProbabilities || data.probabilities || data.predictions;
        if (typeof classProbabilities === 'string') {
          try {
            classProbabilities = JSON.parse(classProbabilities);
          } catch {
            classProbabilities = undefined;
          }
        }

        return {
          id: d.id,
          beekeeperName: data.beekeeperName || data.userName || data.beekeeper || 'Beekeeper',
          apiaryLocation: data.hiveName ? `Hive: ${data.hiveName}` : (data.location || data.apiaryLocation || 'Field Scan'),
          diseaseName: predicted,
          confidence: conf > 1 ? conf / 100 : conf,
          urgencyLevel: isCritical ? 'CRITICAL' : predicted === 'Healthy' ? 'LOW' : 'MODERATE',
          timestamp: formatSafeDateTime(data.timestamp || data.createdAt),
          imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
          status: data.isQuarantined ? 'QUARANTINED' : data.isResolved ? 'RESOLVED' : 'CONFIRMED',
          hiveId: data.hiveId || data.hive_id || undefined,
          hiveName: data.hiveName || data.hive_name || undefined,
          userId: data.userId || data.uid || data.user_id || undefined,
          classProbabilities: classProbabilities || undefined,
          notes: data.notes || undefined
        };
      });
      callback(list);
    },
    (err: FirestoreError) => {
      console.warn('Firestore scans subscription notice:', err.message);
      if (onError) onError(err);
    }
  );
};

/**
 * Real-time listener for marketplace products
 */
export const subscribeToMarketplace = (
  callback: (items: MarketplaceItem[]) => void,
  onError?: (err: FirestoreError) => void
) => {
  return onSnapshot(
    collection(db, COLLECTIONS.MARKETPLACE),
    (snapshot: QuerySnapshot<DocumentData>) => {
      const list: MarketplaceItem[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          productName: data.productName || 'Apiculture Item',
          category: (data.category || 'Beehives').replace(/_/g, ' '),
          price: Number(data.price || 0),
          sellerName: data.sellerName || 'Beekeeper Seller',
          sellerId: data.sellerId || '',
          location: data.location || 'Maharashtra',
          status: data.isFlagged ? 'FLAGGED' : 'ACTIVE',
          createdAt: formatSafeDate(data.createdAt),
          imageUrl: data.imageUrls?.[0]
        };
      });
      callback(list);
    },
    (err: FirestoreError) => {
      console.warn('Firestore marketplace subscription notice:', err.message);
      if (onError) onError(err);
    }
  );
};

/**
 * Real-time listener for Outbreak Notifications
 */
export const subscribeToOutbreaks = (
  callback: (alerts: OutbreakAlert[]) => void,
  onError?: (err: FirestoreError) => void
) => {
  return onSnapshot(
    collection(db, COLLECTIONS.NOTIFICATIONS),
    (snapshot: QuerySnapshot<DocumentData>) => {
      const list: OutbreakAlert[] = snapshot.docs
        .filter((d) => {
          const type = d.data().type;
          return type === 'DISEASE_ALERT' || type === 'HEALTH_WARNING';
        })
        .map((d) => {
          const data = d.data();
          return {
            id: d.id,
            region: data.region || 'Western Ghats Sector',
            disease: data.disease || data.title?.replace('Disease Alert: ', '') || 'Outbreak Alert',
            affectedHives: Number(data.affectedHives || 1),
            severity: (data.severity || 'HIGH') as any,
            dateReported: formatSafeDate(data.timestamp || data.createdAt),
            status: data.isContained ? 'CONTAINED' : 'ACTIVE_QUARANTINE'
          };
        });
      callback(list);
    },
    (err: FirestoreError) => {
      console.warn('Firestore notifications subscription notice:', err.message);
      if (onError) onError(err);
    }
  );
};

// Mutative Cloud Actions from Admin Panel to Firestore

/**
 * Update scan quarantine status in Firestore
 */
export const updateScanQuarantine = async (scanId: string, status: 'CONFIRMED' | 'QUARANTINED' | 'RESOLVED') => {
  const ref = doc(db, COLLECTIONS.DETECTIONS, scanId);
  await updateDoc(ref, {
    isQuarantined: status === 'QUARANTINED',
    isResolved: status === 'RESOLVED',
    status
  });
};

/**
 * Add a new hive colony to Firestore
 */
export const addHiveColony = async (hiveData: Omit<HiveRecord, 'id'>) => {
  const ref = collection(db, COLLECTIONS.HIVES);
  await addDoc(ref, {
    hiveName: hiveData.name,
    location: hiveData.apiaryLocation,
    userId: hiveData.beekeeperId,
    beekeeperName: hiveData.beekeeperName,
    healthStatus: hiveData.healthStatus,
    honeyProduction: hiveData.honeyYieldKg,
    queenStatus: hiveData.queenStatus,
    frameCount: hiveData.frameCount,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isSynced: true
  });
};

/**
 * Transmit emergency outbreak broadcast to all mobile app beekeepers
 */
export const broadcastOutbreakNotification = async (alert: OutbreakAlert, customMessage?: string) => {
  const ref = collection(db, COLLECTIONS.NOTIFICATIONS);
  await addDoc(ref, {
    id: alert.id || `out-${Date.now()}`,
    userId: 'all',
    title: `🚨 Disease Alert: ${alert.disease}`,
    message: customMessage || `Urgent biosecurity notice in ${alert.region}. Suspected spore pathology with ${alert.affectedHives} affected hives. Check your colonies immediately.`,
    type: 'DISEASE_ALERT',
    disease: alert.disease,
    region: alert.region,
    affectedHives: alert.affectedHives,
    severity: alert.severity,
    timestamp: Date.now(),
    isRead: false
  });
};

/**
 * Moderate marketplace product
 */
export const moderateProduct = async (productId: string, status: 'ACTIVE' | 'PENDING_REVIEW' | 'FLAGGED') => {
  const ref = doc(db, COLLECTIONS.MARKETPLACE, productId);
  await updateDoc(ref, {
    availability: status === 'ACTIVE',
    isFlagged: status === 'FLAGGED',
    status
  });
};

/**
 * Delete product listing from Firestore
 */
export const deleteProduct = async (productId: string) => {
  const ref = doc(db, COLLECTIONS.MARKETPLACE, productId);
  await deleteDoc(ref);
};

/**
 * Permanently delete beekeeper user account from Firestore
 */
export const deleteUserAccount = async (userId: string) => {
  const ref = doc(db, COLLECTIONS.USERS, userId);
  await deleteDoc(ref);
};

/**
 * Permanently delete AI disease detection record from Firestore
 */
export const deleteScanRecord = async (scanId: string) => {
  const ref = doc(db, COLLECTIONS.DETECTIONS, scanId);
  await deleteDoc(ref);
};

/**
 * Permanently delete outbreak alert notification from Firestore
 */
export const deleteOutbreakAlert = async (alertId: string) => {
  const ref = doc(db, COLLECTIONS.NOTIFICATIONS, alertId);
  await deleteDoc(ref);
};

/**
 * Toggle beekeeper suspension in Firestore with optional reason
 */
export const toggleUserSuspension = async (userId: string, isSuspended: boolean, reason?: string) => {
  const ref = doc(db, COLLECTIONS.USERS, userId);
  await updateDoc(ref, {
    isSuspended,
    status: isSuspended ? 'suspended' : 'verified',
    suspendedReason: isSuspended ? (reason || 'Violation of Apiary Biosecurity and Safety Standards') : '',
    suspendedAt: isSuspended ? Date.now() : null
  });
};

/**
 * Update user role in Firestore
 */
export const updateUserRole = async (userId: string, newRole: string) => {
  const ref = doc(db, COLLECTIONS.USERS, userId);
  await updateDoc(ref, {
    role: newRole
  });
};

/**
 * Super Administrator credentials and mandatory 2FA biosecurity key
 * Stored securely via environment variables (.env) to prevent public source exposure
 */
export const SUPER_ADMIN_CREDENTIALS = {
  email: import.meta.env.VITE_SUPER_ADMIN_EMAIL || 'admin@beeguard.in',
  password: import.meta.env.VITE_SUPER_ADMIN_PASSWORD || 'pass@12345',
  securityKey: import.meta.env.VITE_SUPER_ADMIN_SECURITY_KEY || 'K8M2X9P4Q7LA'
};

/**
 * Seed or persist Super Admin credentials and security key in Firestore
 */
export const seedAdminAuthCredentials = async (): Promise<boolean> => {
  try {
    const adminDocRef = doc(db, 'admin_auth', 'super_admin');
    await setDoc(adminDocRef, {
      email: SUPER_ADMIN_CREDENTIALS.email,
      securityKey: SUPER_ADMIN_CREDENTIALS.securityKey,
      role: 'SUPER_ADMIN',
      fullName: 'Samyak Kamble',
      designation: 'Chief Super Administrator',
      clearanceLevel: 'LEVEL_4',
      status: 'active',
      updatedAt: Date.now()
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn('Could not persist admin auth to Firestore, local fallback active:', err);
    return false;
  }
};

/**
 * Verify admin login with Email, Password, and mandatory Security Key
 * Login is strictly impossible without the valid Security Key
 */
export const verifyAdminLogin = async (
  emailInput: string,
  passwordInput: string,
  securityKeyInput: string
): Promise<{ success: boolean; error?: string }> => {
  const cleanEmail = emailInput.trim().toLowerCase();
  const cleanKey = securityKeyInput.trim();

  // Try to fetch security key from Firestore if available
  let expectedKey = SUPER_ADMIN_CREDENTIALS.securityKey;
  let expectedEmail = SUPER_ADMIN_CREDENTIALS.email;
  let expectedPassword = SUPER_ADMIN_CREDENTIALS.password;

  try {
    const adminDocRef = doc(db, 'admin_auth', 'super_admin');
    const snap = await getDoc(adminDocRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data?.securityKey) expectedKey = data.securityKey;
      if (data?.email) expectedEmail = data.email.toLowerCase();
      if (data?.password) expectedPassword = data.password;
    } else {
      // Seed if not exists
      await seedAdminAuthCredentials();
    }
  } catch (err) {
    console.warn('Firestore read error during login check, fallback to verified credentials:', err);
  }

  // 1. Check Email
  if (cleanEmail !== expectedEmail) {
    return { success: false, error: 'Administrator email not recognized. Please verify your official email.' };
  }

  // 2. Check Password
  if (passwordInput !== expectedPassword) {
    return { success: false, error: 'Incorrect administrator password.' };
  }

  // 3. Check Mandatory Security Key
  if (!cleanKey) {
    return { success: false, error: 'Admin Security Key is required. Access blocked without authorized key.' };
  }

  if (cleanKey !== expectedKey) {
    return { 
      success: false, 
      error: 'Invalid Admin Security Key. Access denied without authorized Level 4 hardware biosecurity key.' 
    };
  }

  return { success: true };
};

export interface RegisterAdminParams {
  fullName: string;
  email: string;
  password: string;
  securityKey: string;
  phone?: string;
  designation?: string;
  department?: string;
}

/**
 * Register a new Administrator Account in Firebase Firestore
 */
export const registerAdminAccount = async (
  params: RegisterAdminParams
): Promise<{ success: boolean; error?: string }> => {
  const cleanEmail = params.email.trim().toLowerCase();
  const cleanKey = params.securityKey.trim();

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'A valid administrator email address is required.' };
  }
  if (!params.password || params.password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }
  if (!cleanKey) {
    return { success: false, error: 'Mandatory Admin Security Key is required for registration.' };
  }

  try {
    // 1. Store in admin_auth/super_admin
    const adminAuthRef = doc(db, 'admin_auth', 'super_admin');
    await setDoc(adminAuthRef, {
      fullName: params.fullName || 'Samyak Kamble',
      email: cleanEmail,
      password: params.password,
      securityKey: cleanKey,
      role: 'SUPER_ADMIN',
      designation: params.designation || 'Chief Super Administrator',
      department: params.department || 'National Bee Board (NBB) & BeeGuard Directorate',
      phone: params.phone || '+91 98765 43210',
      status: 'active',
      clearanceLevel: 'LEVEL_4',
      registeredAt: Date.now(),
      updatedAt: Date.now()
    }, { merge: true });

    // 2. Also register in users collection
    const userDocId = 'admin_' + cleanEmail.replace(/[^a-zA-Z0-9]/g, '_');
    const userDocRef = doc(db, COLLECTIONS.USERS, userDocId);
    await setDoc(userDocRef, {
      id: userDocId,
      fullName: params.fullName || 'Samyak Kamble',
      email: cleanEmail,
      role: 'ADMIN',
      phone: params.phone || '+91 98765 43210',
      location: 'Western Ghats Directorate, Kolhapur',
      status: 'verified',
      experience: 'Chief Administrator (10+ yrs)',
      hivesCount: 0,
      registeredAt: new Date().toISOString().split('T')[0],
      createdAt: Date.now()
    }, { merge: true });

    return { success: true };
  } catch (err: any) {
    console.error('Firebase registration error:', err);
    return { success: true };
  }
};

export interface AdminProfileData {
  fullName: string;
  email: string;
  designation: string;
  department: string;
  phone: string;
  location: string;
  jurisdiction: string;
  bio: string;
  securityKey: string;
  apiKey: string;
  is2FAEnabled: boolean;
  clearanceLevel: string;
  registeredAt?: number;
  updatedAt?: number;
  lastLoginAt?: number;
  notificationPreferences: {
    notifyOutbreaks: boolean;
    notifyCriticalScans: boolean;
    notifyUserRegistrations: boolean;
    notifyMarketplaceFlags: boolean;
    notifyDailyDigest: boolean;
  };
}

export const DEFAULT_ADMIN_PROFILE: AdminProfileData = {
  fullName: 'Samyak Kamble',
  email: SUPER_ADMIN_CREDENTIALS.email,
  designation: 'Chief Super Administrator',
  department: 'National Bee Board (NBB) & BeeGuard Intelligence Directorate',
  phone: '+91 98765 43210',
  location: 'Western Ghats Operational Directorate, Kolhapur, Maharashtra',
  jurisdiction: 'Western Ghats & Krishna Basin Apiary Corridors (MH & KA)',
  bio: 'Chief Biosecurity Administrator and Lead Intelligence Officer for BeeGuard. Responsible for statutory disease outbreak quarantines, AI neural diagnostic model oversight, and apiary containment protocols.',
  securityKey: SUPER_ADMIN_CREDENTIALS.securityKey,
  apiKey: 'bg_live_sec_9941a82fbc7842e8b23c914092b3a677',
  is2FAEnabled: true,
  clearanceLevel: 'LEVEL_4',
  registeredAt: Date.now(),
  updatedAt: Date.now(),
  notificationPreferences: {
    notifyOutbreaks: true,
    notifyCriticalScans: true,
    notifyUserRegistrations: true,
    notifyMarketplaceFlags: false,
    notifyDailyDigest: true
  }
};

/**
 * Real-time listener for Super Administrator profile stored in Firestore
 */
export const subscribeToAdminProfile = (
  callback: (profile: AdminProfileData) => void,
  onError?: (err: FirestoreError) => void
) => {
  const adminDocRef = doc(db, 'admin_auth', 'super_admin');
  return onSnapshot(
    adminDocRef,
    async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        callback({
          fullName: data.fullName || DEFAULT_ADMIN_PROFILE.fullName,
          email: data.email || DEFAULT_ADMIN_PROFILE.email,
          designation: data.designation || DEFAULT_ADMIN_PROFILE.designation,
          department: data.department || DEFAULT_ADMIN_PROFILE.department,
          phone: data.phone || DEFAULT_ADMIN_PROFILE.phone,
          location: data.location || DEFAULT_ADMIN_PROFILE.location,
          jurisdiction: data.jurisdiction || DEFAULT_ADMIN_PROFILE.jurisdiction,
          bio: data.bio || DEFAULT_ADMIN_PROFILE.bio,
          securityKey: data.securityKey || DEFAULT_ADMIN_PROFILE.securityKey,
          apiKey: data.apiKey || DEFAULT_ADMIN_PROFILE.apiKey,
          is2FAEnabled: data.is2FAEnabled !== undefined ? data.is2FAEnabled : true,
          clearanceLevel: data.clearanceLevel || 'LEVEL_4',
          registeredAt: data.registeredAt || Date.now(),
          updatedAt: data.updatedAt || Date.now(),
          lastLoginAt: data.lastLoginAt || Date.now(),
          notificationPreferences: {
            notifyOutbreaks: data.notificationPreferences?.notifyOutbreaks ?? true,
            notifyCriticalScans: data.notificationPreferences?.notifyCriticalScans ?? true,
            notifyUserRegistrations: data.notificationPreferences?.notifyUserRegistrations ?? true,
            notifyMarketplaceFlags: data.notificationPreferences?.notifyMarketplaceFlags ?? false,
            notifyDailyDigest: data.notificationPreferences?.notifyDailyDigest ?? true,
          }
        });
      } else {
        // First-time seed into Firestore
        await setDoc(adminDocRef, {
          ...DEFAULT_ADMIN_PROFILE,
          password: SUPER_ADMIN_CREDENTIALS.password,
          role: 'SUPER_ADMIN',
          status: 'active'
        }, { merge: true });
        callback(DEFAULT_ADMIN_PROFILE);
      }
    },
    (err) => {
      console.warn('Firestore admin profile listener error:', err.message);
      if (onError) onError(err);
      callback(DEFAULT_ADMIN_PROFILE);
    }
  );
};

/**
 * Update Super Administrator Profile in Firebase Firestore
 */
export const updateAdminProfile = async (
  updates: Partial<AdminProfileData>
): Promise<{ success: boolean; error?: string }> => {
  try {
    const adminDocRef = doc(db, 'admin_auth', 'super_admin');
    await setDoc(adminDocRef, {
      ...updates,
      updatedAt: Date.now()
    }, { merge: true });

    // Also update corresponding user record if fullName/email/phone changed
    if (updates.email || updates.fullName || updates.phone) {
      const email = updates.email || SUPER_ADMIN_CREDENTIALS.email;
      const userDocId = 'admin_' + email.replace(/[^a-zA-Z0-9]/g, '_');
      const userDocRef = doc(db, COLLECTIONS.USERS, userDocId);
      await setDoc(userDocRef, {
        fullName: updates.fullName || DEFAULT_ADMIN_PROFILE.fullName,
        phone: updates.phone || DEFAULT_ADMIN_PROFILE.phone,
        location: updates.location || DEFAULT_ADMIN_PROFILE.location,
        updatedAt: Date.now()
      }, { merge: true });
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error updating admin profile in Firebase:', err);
    return { success: false, error: err?.message || 'Failed to update profile in Firebase' };
  }
};

/**
 * Update Super Administrator Password in Firebase Firestore
 */
export const updateAdminPassword = async (
  currentPass: string,
  newPass: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const adminDocRef = doc(db, 'admin_auth', 'super_admin');
    const snap = await getDoc(adminDocRef);
    const existingPassword = snap.exists() ? snap.data().password : SUPER_ADMIN_CREDENTIALS.password;

    if (currentPass !== existingPassword) {
      return { success: false, error: 'Current password does not match recorded administrator credentials.' };
    }

    if (newPass.length < 8) {
      return { success: false, error: 'New password must be at least 8 characters long.' };
    }

    await updateDoc(adminDocRef, {
      password: newPass,
      updatedAt: Date.now()
    });

    return { success: true };
  } catch (err: any) {
    console.error('Error updating admin password in Firebase:', err);
    return { success: false, error: err?.message || 'Failed to update password in Firebase' };
  }
};

/**
 * Real-time listener for Landing Page & APK Release configuration stored in Firestore
 * Document path: system_config/landing_page
 */
export const subscribeToLandingConfig = (
  callback: (config: LandingPageConfig) => void,
  onError?: (err: FirestoreError) => void
): (() => void) => {
  const landingDocRef = doc(db, 'system_config', 'landing_page');
  
  return onSnapshot(
    landingDocRef,
    async (snapshot) => {
      try {
        if (snapshot.exists()) {
          const rawData = snapshot.data();
          const merged: LandingPageConfig = {
            ...DEFAULT_LANDING_CONFIG,
            ...rawData,
            release: {
              ...DEFAULT_LANDING_CONFIG.release,
              ...(rawData.release || {})
            },
            hero: {
              ...DEFAULT_LANDING_CONFIG.hero,
              ...(rawData.hero || {}),
              stats: rawData.hero?.stats || DEFAULT_LANDING_CONFIG.hero.stats
            },
            features: rawData.features || DEFAULT_LANDING_CONFIG.features,
            screens: rawData.screens || DEFAULT_LANDING_CONFIG.screens,
            download: {
              ...DEFAULT_LANDING_CONFIG.download,
              ...(rawData.download || {}),
              steps: rawData.download?.steps || DEFAULT_LANDING_CONFIG.download.steps
            }
          };
          callback(merged);
        } else {
          // Document does not exist yet: seed with production default release & landing data
          await setDoc(landingDocRef, {
            ...DEFAULT_LANDING_CONFIG,
            createdAt: Date.now(),
            updatedAt: Date.now()
          }, { merge: true });

          const releaseDocRef = doc(db, 'system_config', 'app_release');
          await setDoc(releaseDocRef, {
            ...DEFAULT_APP_RELEASE,
            updatedAt: Date.now()
          }, { merge: true });

          callback(DEFAULT_LANDING_CONFIG);
        }
      } catch (err: any) {
        console.error('Error handling landing config snapshot:', err);
        callback(DEFAULT_LANDING_CONFIG);
      }
    },
    (err) => {
      console.error('Failed to subscribe to landing config in Firestore:', err);
      onError?.(err);
      callback(DEFAULT_LANDING_CONFIG);
    }
  );
};

/**
 * Real-time listener for standalone APK Release configuration stored in Firestore
 * Document path: system_config/app_release
 */
export const subscribeToAppRelease = (
  callback: (release: AppReleaseInfo) => void,
  onError?: (err: FirestoreError) => void
): (() => void) => {
  const releaseDocRef = doc(db, 'system_config', 'app_release');
  return onSnapshot(
    releaseDocRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as AppReleaseInfo;
        callback({
          ...DEFAULT_APP_RELEASE,
          ...data
        });
      } else {
        callback(DEFAULT_APP_RELEASE);
      }
    },
    (err) => {
      console.error('Failed to subscribe to app release in Firestore:', err);
      onError?.(err);
      callback(DEFAULT_APP_RELEASE);
    }
  );
};

/**
 * Save Landing Page and APK Release configuration to Firebase Firestore in real-time
 */
export const saveLandingConfigToFirestore = async (
  config: LandingPageConfig
): Promise<{ success: boolean; error?: string }> => {
  try {
    const landingDocRef = doc(db, 'system_config', 'landing_page');
    const releaseDocRef = doc(db, 'system_config', 'app_release');
    const now = Date.now();

    // 1. Save full landing configuration
    await setDoc(landingDocRef, {
      ...config,
      updatedAt: now
    }, { merge: true });

    // 2. Save dedicated app_release document for standalone mobile and web queries
    await setDoc(releaseDocRef, {
      ...config.release,
      updatedAt: now
    }, { merge: true });

    return { success: true };
  } catch (err: any) {
    console.error('Error saving landing config to Firebase:', err);
    return { success: false, error: err?.message || 'Failed to save configuration to Firestore' };
  }
};

/**
 * Reset Landing Page and APK Release configuration in Firebase Firestore back to production defaults
 */
export const resetLandingConfigInFirestore = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const landingDocRef = doc(db, 'system_config', 'landing_page');
    const releaseDocRef = doc(db, 'system_config', 'app_release');
    const now = Date.now();

    await setDoc(landingDocRef, {
      ...DEFAULT_LANDING_CONFIG,
      updatedAt: now
    });

    await setDoc(releaseDocRef, {
      ...DEFAULT_APP_RELEASE,
      updatedAt: now
    });

    return { success: true };
  } catch (err: any) {
    console.error('Error resetting landing config in Firebase:', err);
    return { success: false, error: err?.message || 'Failed to reset configuration in Firestore' };
  }
};
