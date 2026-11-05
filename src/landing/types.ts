export interface AppReleaseInfo {
  version: string;
  buildNumber: number;
  releaseDate: string;
  fileSize: string;
  minAndroidVersion: string;
  targetAndroidVersion: string;
  architecture: string;
  sha256: string;
  githubRepoUrl: string;
  githubReleasesUrl: string;
  directDownloadUrl: string;
  githubDirectDownloadUrl: string;
}

export interface HeroStatBadge {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
}

export interface HeroConfig {
  badgeTitle: string;
  badgeSubtitle: string;
  headlinePrefix: string;
  headlineGradient: string;
  headlineSuffix: string;
  subtitle: string;
  downloadButtonText: string;
  githubButtonText: string;
  featuresButtonText: string;
  stats: HeroStatBadge[];
}

export interface FeaturePillarConfig {
  id: string;
  title: string;
  tagline: string;
  description: string;
  badge: string;
  badgeColor: string;
  iconName: string;
  highlights: string[];
}

export interface ScreenShowcaseConfig {
  id: string;
  tabLabel: string;
  title: string;
  category: string;
  headline: string;
  description: string;
  badge: string;
  badgeColor: string;
  techHighlight: string;
  features: string[];
}

export interface DownloadStepConfig {
  step: number;
  title: string;
  description: string;
}

export interface DownloadSectionConfig {
  badge: string;
  headline: string;
  subtitle: string;
  boxTitle: string;
  boxSubtitle: string;
  apkButtonLabel: string;
  steps: DownloadStepConfig[];
}

export interface LandingPageConfig {
  brandName: string;
  brandTagline: string;
  footerCopyright: string;
  release: AppReleaseInfo;
  hero: HeroConfig;
  features: FeaturePillarConfig[];
  screens: ScreenShowcaseConfig[];
  download: DownloadSectionConfig;
}

export const DEFAULT_APP_RELEASE: AppReleaseInfo = {
  version: 'v1.0.0',
  buildNumber: 1,
  releaseDate: 'November 2026',
  fileSize: '45.8 MB',
  minAndroidVersion: 'Android 8.0 (Oreo, API 26)',
  targetAndroidVersion: 'Android 14+ (Upside Down Cake, API 34)',
  architecture: 'arm64-v8a, armeabi-v7a, x86_64',
  sha256: 'F9F44D726853F5DE031688DA2CB7905C346760A0B7AEB26F27A73FD62ADBBA9C',
  githubRepoUrl: 'https://github.com/samyak2403/BeeGuard',
  githubReleasesUrl: 'https://github.com/samyak2403/BeeGuard/releases',
  directDownloadUrl: '/downloads/beeguard-v1.0.0.apk',
  githubDirectDownloadUrl: 'https://github.com/samyak2403/BeeGuard/releases/download/v1.0.0/app-debug.apk'
};

export const CURRENT_APP_RELEASE = DEFAULT_APP_RELEASE;

export const DEFAULT_HERO_CONFIG: HeroConfig = {
  badgeTitle: 'BeeGuard Android v1.0.0',
  badgeSubtitle: 'Production APK Available',
  headlinePrefix: 'Smart Honeybee',
  headlineGradient: 'Disease Prediction',
  headlineSuffix: '& Apiary Biosecurity',
  subtitle: 'Empowering apiarists with on-device TensorFlow Lite computer vision, instant 7-class brood pathogen diagnostics, regional quarantine radar, and offline-first colony telemetry.',
  downloadButtonText: 'Download Android APK',
  githubButtonText: 'GitHub Releases',
  featuresButtonText: 'Explore Features',
  stats: [
    {
      id: 'stat-inference',
      title: '180ms Inference',
      subtitle: 'On-device neural vision',
      iconName: 'Zap'
    },
    {
      id: 'stat-pathogens',
      title: '7 Pathogens',
      subtitle: 'AFB, EFB, Varroa & more',
      iconName: 'ShieldCheck'
    },
    {
      id: 'stat-offline',
      title: 'Offline Sync',
      subtitle: 'Room SQLite & WorkManager',
      iconName: 'Layers'
    },
    {
      id: 'stat-cloud',
      title: 'Biosecurity Cloud',
      subtitle: 'Firebase Real-time Sync',
      iconName: 'Shield'
    }
  ]
};

export const DEFAULT_FEATURES: FeaturePillarConfig[] = [
  {
    id: 'tflite-vision',
    title: 'On-Device TFLite Computer Vision',
    tagline: 'Instant Brood Pathogen Classification',
    description: 'High-speed MobileNetV2 CNN classifier running completely on-device. Diagnoses 7 conditions in under 200ms with zero cloud round-trips.',
    badge: 'Edge Neural AI',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    iconName: 'Cpu',
    highlights: [
      'Classifies 7 categories: Varroa, AFB, EFB, Nosema, Chalkbrood, Sacbrood & Healthy',
      'Full softmax probability distribution across all 7 classes',
      'Clinical symptom analysis and actionable medical treatment protocol'
    ]
  },
  {
    id: 'apiary-management',
    title: 'Digital Apiary & Hive Dossiers',
    tagline: 'Colony Health & Queen Audit Trails',
    description: 'Manage unlimited apiary yards and colonies. Record frame inspections, brood viability, queen age, temper ratings, and honey yield forecast.',
    badge: 'Colony Tracking',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    iconName: 'Layers',
    highlights: [
      'Comprehensive colony health index scoring (Healthy, Warning, Infected)',
      'Detailed inspection forms covering queen status, frames of bees & pests',
      'Historical chronological logs with photo evidence storage'
    ]
  },
  {
    id: 'biosecurity-radar',
    title: 'Biosecurity Outbreak Radar',
    tagline: 'Regional Quarantine Early Warning',
    description: 'Connected radar network detecting contagious honeybee epidemics. Alerts beekeepers within quarantine zones before diseases spread.',
    badge: 'Contagion Defense',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    iconName: 'AlertTriangle',
    highlights: [
      'Automated administrative broadcast alerts via Firebase Cloud Messaging',
      'Geofenced containment zones with status tracking (Active, Contained, Investigating)',
      'Direct protocol coordination with state and national agricultural boards'
    ]
  },
  {
    id: 'offline-sync',
    title: 'Offline-First Architecture',
    tagline: 'Zero Dependency on Remote Cellular',
    description: 'Engineered for remote field apiaries. Room SQLite local database powers all inspections offline; WorkManager syncs atomically upon reconnection.',
    badge: 'Zero Signal Proof',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    iconName: 'Database',
    highlights: [
      'Room Database with 7 persistent DAOs and type converters',
      'Background WorkManager periodic and network-reconnect sync',
      'Atomic queue engine resolving offline-to-cloud conflicts'
    ]
  },
  {
    id: 'ai-chatbot',
    title: 'Apicultural AI Advisory Chatbot',
    tagline: 'Instant Expert Answers in the Field',
    description: 'Dual-engine conversational intelligence powered by Python Rasa REST server and Qwen LLM. Answers questions on queen rearing, swarming, and nutrition.',
    badge: 'Rasa + Qwen AI',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    iconName: 'MessageSquare',
    highlights: [
      'Trained apiculture NLU intent classification and conversation stories',
      'Actionable recommendations for varroa mite IPM treatments',
      'Persistent chat history with offline caching'
    ]
  },
  {
    id: 'marketplace',
    title: 'Verified Apiarist Marketplace',
    tagline: 'Direct Commercial & Equipment Trade',
    description: 'Integrated marketplace for live honeybee packages, mated queens, extractors, protective suits, and artisan honey with direct beekeeper contact.',
    badge: '8 Categories',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    iconName: 'ShoppingBag',
    highlights: [
      '8 categories: Beehives, Protective gear, Smokers, Extractors, Tools, Queens, Colonies & Honey',
      'Direct dial and SMS seller contact with location verification',
      'Seller verification and administrator moderation integration'
    ]
  }
];

export const DEFAULT_SCREENS: ScreenShowcaseConfig[] = [
  {
    id: 'diagnosis',
    tabLabel: 'AI Disease Diagnosis',
    title: '7-Class Brood Disease Classifier',
    category: 'Edge Neural Network (TFLite)',
    headline: 'Sub-Second Brood Disease Detection in the Field',
    description: 'Capture any brood comb frame with your phone camera. BeeGuard executes an optimized MobileNetV2 convolutional neural network locally on-device, calculating exact class probabilities across 7 major conditions without sending sensitive apiary data to remote clouds.',
    badge: '94.2% Softmax Match',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    techHighlight: 'TFLite MobileNetV2 • 180ms',
    features: [
      'Instant 180ms inference powered by TensorFlow Lite and NNAPI acceleration',
      'Complete 7-class probability breakdown (AFB, EFB, Varroa, Chalkbrood, Sacbrood, Nosema, Healthy)',
      'Clinical symptom analysis and actionable medical treatment protocol',
      'Automatic offline saving to Room SQLite database with Cloud Firestore sync'
    ]
  },
  {
    id: 'home',
    tabLabel: 'Command Dashboard',
    title: 'Apiary Operations & Colony Telemetry',
    category: 'Apiary Management',
    headline: 'Centralized Apiary Health, Vitals & Weather Hub',
    description: 'Get a real-time snapshot of your entire apiary operation. Monitor local microclimate conditions, total active hives, healthy vs quarantined colonies, quick diagnostic camera shortcuts, and recent field inspection logs at a single glance.',
    badge: 'Apiary Command Center',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    techHighlight: 'Live Telemetry & Quick Scan',
    features: [
      'Live apiary weather telemetry with temperature, humidity, and forage suitability',
      'Colony status breakdown (Healthy, Under Observation, Quarantined)',
      'One-tap diagnostic camera launcher for instant comb disease scanning',
      'Inspection timeline history synchronized seamlessly with administrator console'
    ]
  },
  {
    id: 'chatbot',
    tabLabel: 'AI Advisory Copilot',
    title: 'Apicultural Knowledge Assistant',
    category: 'Dual-Engine Conversational AI',
    headline: 'Rasa NLU & Qwen LLM Apicultural Consultation',
    description: 'Have a specialized beekeeping consultant right at your fingertips. Ask questions about queen cell identification, swarming prevention, varroa mite treatment dosages, and seasonal hive nutrition in natural conversational language.',
    badge: 'Rasa NLU + Qwen LLM',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    techHighlight: 'Apiculture Domain Intelligence',
    features: [
      'Trained Rasa NLU intent recognition tailored specifically to apicultural terminology',
      'Qwen LLM fallback for nuanced, open-ended conversational troubleshooting',
      'Instant treatment protocols for Varroa, Foulbrood, and seasonal sugar feeding ratios',
      'Persistent local chat history with zero data loss in remote, signal-free apiaries'
    ]
  },
  {
    id: 'validation',
    tabLabel: 'Comb Presence Guard',
    title: 'Smart Comb & Bee Presence Validator',
    category: 'Diagnostic Reliability & Precision',
    headline: 'Zero False Positives via Smart Presence Validation',
    description: 'To protect beekeepers from erroneous disease alerts and wasted medication, BeeGuard validates the presence of honeybees and brood comb structures before committing inference results. If an invalid or blurry frame is detected, clear guidance is provided.',
    badge: 'Safety Pre-check Shield',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    techHighlight: 'Frame & Illumination Guard',
    features: [
      'Active comb surface verification filter preventing false disease alarms',
      'Camera positioning guidance with real-time lighting and focus checks',
      'Educational prompts helping beekeepers capture optimal diagnostic angles',
      'Eliminates wasted medication and unnecessary hive quarantine distress'
    ]
  },
  {
    id: 'marketplace',
    tabLabel: 'Equipment Marketplace',
    title: 'Verified Apiary Equipment & Supplies',
    category: 'Beekeeper Commerce',
    headline: 'Curated Beekeeping Gear, Supplies & Live Colonies',
    description: 'Browse verified equipment including ventilated bee suits, stainless steel smokers, Langstroth frames, honey extractors, and organic mite treatments with transparent pricing and direct beekeeper communication.',
    badge: '8 Product Categories',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    techHighlight: 'Direct Verified Trade',
    features: [
      '8 curated categories spanning protective gear, tools, treatments, and honey',
      'Direct seller communication with phone and WhatsApp integration',
      'Transparent pricing, verified seller badges, and location proximity filters',
      'Integrated administrator moderation and listing review'
    ]
  }
];

export const DEFAULT_DOWNLOAD_CONFIG: DownloadSectionConfig = {
  badge: 'Official Android APK Release',
  headline: 'Download BeeGuard for Android',
  subtitle: 'Get the full production build directly or explore releases and source code on GitHub.',
  boxTitle: 'BeeGuard HiveSense',
  boxSubtitle: 'Verified Production Package',
  apkButtonLabel: 'Download APK Direct Package',
  steps: [
    {
      step: 1,
      title: 'Download the APK:',
      description: 'Tap the download button above or visit our GitHub Releases page on your Android device.'
    },
    {
      step: 2,
      title: 'Allow Installation:',
      description: 'If prompted by Android, enable "Install unknown apps" in Settings for your browser or file manager.'
    },
    {
      step: 3,
      title: 'Launch & Verify:',
      description: 'Open BeeGuard, sign in or create an account, and begin offline colony health inspection immediately.'
    }
  ]
};

export const DEFAULT_LANDING_CONFIG: LandingPageConfig = {
  brandName: 'BeeGuard',
  brandTagline: 'HiveSense',
  footerCopyright: `© ${new Date().getFullYear()} BeeGuard Apiary Biosecurity • All Rights Reserved.`,
  release: DEFAULT_APP_RELEASE,
  hero: DEFAULT_HERO_CONFIG,
  features: DEFAULT_FEATURES,
  screens: DEFAULT_SCREENS,
  download: DEFAULT_DOWNLOAD_CONFIG
};

const STORAGE_KEY = 'beeguard_landing_config_v1';

export function loadLandingConfig(): LandingPageConfig {
  if (typeof window === 'undefined') return DEFAULT_LANDING_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_LANDING_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_LANDING_CONFIG,
      ...parsed,
      release: { ...DEFAULT_LANDING_CONFIG.release, ...(parsed.release || {}) },
      hero: { 
        ...DEFAULT_LANDING_CONFIG.hero, 
        ...(parsed.hero || {}),
        stats: parsed.hero?.stats || DEFAULT_LANDING_CONFIG.hero.stats 
      },
      features: parsed.features || DEFAULT_LANDING_CONFIG.features,
      screens: parsed.screens || DEFAULT_LANDING_CONFIG.screens,
      download: { 
        ...DEFAULT_LANDING_CONFIG.download, 
        ...(parsed.download || {}),
        steps: parsed.download?.steps || DEFAULT_LANDING_CONFIG.download.steps 
      }
    };
  } catch (e) {
    console.error('Failed to load landing config from storage, using defaults', e);
    return DEFAULT_LANDING_CONFIG;
  }
}

export function saveLandingConfig(config: LandingPageConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save landing config to storage', e);
  }
}

export function resetLandingConfig(): LandingPageConfig {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear landing config', e);
    }
  }
  return DEFAULT_LANDING_CONFIG;
}
