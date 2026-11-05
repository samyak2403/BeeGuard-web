export type UserRole = 'ADMIN' | 'BEEKEEPER' | 'INSPECTOR' | 'RESEARCHER';

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  role: UserRole;
  experience: string;
  registeredAt: string;
  hivesCount: number;
  status: 'active' | 'verified' | 'suspended';
  isSuspended?: boolean;
  suspendedReason?: string;
  suspendedAt?: string;
}

export type HealthStatus = 'HEALTHY' | 'INFECTED' | 'WARNING';

export interface HiveRecord {
  id: string;
  name: string;
  apiaryLocation: string;
  beekeeperId: string;
  beekeeperName: string;
  healthStatus: HealthStatus;
  primaryDiagnosis?: string;
  lastInspectionDate: string;
  honeyYieldKg: number;
  queenStatus: 'ACTIVE' | 'SUPERSEDED' | 'ABSENT';
  frameCount: number;
}

export type UrgencyLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export interface DiseaseScanRecord {
  id: string;
  beekeeperName: string;
  apiaryLocation: string;
  diseaseName: string;
  confidence: number;
  urgencyLevel: UrgencyLevel;
  timestamp: string;
  imageUrl: string;
  status: 'CONFIRMED' | 'QUARANTINED' | 'RESOLVED';
  hiveId?: string;
  hiveName?: string;
  userId?: string;
  classProbabilities?: Record<string, number>;
  notes?: string;
}

export interface MarketplaceItem {
  id: string;
  productName: string;
  category: string;
  price: number;
  sellerName: string;
  sellerId: string;
  location: string;
  status: 'ACTIVE' | 'PENDING_REVIEW' | 'FLAGGED';
  createdAt: string;
  imageUrl?: string;
}

export interface OutbreakAlert {
  id: string;
  region: string;
  disease: string;
  affectedHives: number;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  dateReported: string;
  status: 'ACTIVE_QUARANTINE' | 'CONTAINED' | 'INVESTIGATING';
}

export interface PlatformMetrics {
  totalBeekeepers: number;
  activeHives: number;
  scansPerformed: number;
  outbreakQuarantines: number;
  overallHealthRate: number;
  marketplaceVolume: number;
}

