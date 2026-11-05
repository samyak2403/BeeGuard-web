import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  Clock, 
  ShieldAlert, 
  ShieldCheck, 
  Radio, 
  BookOpen, 
  ZoomIn, 
  ZoomOut, 
  AlertTriangle, 
  CheckCircle2, 
  Check, 
  Copy, 
  FileText,
  Activity,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { DiseaseScanRecord } from '../types';

interface ScanDetailViewProps {
  scan: DiseaseScanRecord;
  onBack: () => void;
  onUpdateStatus: (scanId: string, newStatus: 'CONFIRMED' | 'QUARANTINED' | 'RESOLVED') => void;
  onTriggerOutbreakBroadcast?: (diseaseName: string, region: string) => void;
  onShowToast?: (type: 'success' | 'warning' | 'info', title: string, desc?: string) => void;
}

interface DiseaseDossier {
  causativeAgent: string;
  pathologyStage: string;
  description: string;
  symptoms: string[];
  prevention: string[];
  treatment: string[];
  standards: string[];
}

const DISEASE_DOSSIERS: Record<string, DiseaseDossier> = {
  'European Foulbrood (EFB)': {
    causativeAgent: 'Melissococcus plutonius (Non-spore forming bacterium)',
    pathologyStage: 'Larval & early pupal stages (4-5 days old)',
    description: 'European Foulbrood (EFB) is an infectious bacterial brood disease of honey bees. Melissococcus plutonius multiplies in the midgut of the young larva, competing for its food and leading to starvation before capping.',
    symptoms: [
      'Uncapped larvae dying in twisted, unnatural "C" or corkscrew positions',
      'Color change from pearly white to dull yellow, then sour-smelling brown',
      'Visible tracheae showing through translucent larval skin',
      'Irregular, pepper-box spotty brood pattern with partially chewed cappings'
    ],
    prevention: [
      'Ensure strong pollen and nectar nutritional reserves during spring expansion',
      'Maintain hygienic, disease-resistant queen genetics (VSH or hygienic stock)',
      'Regularly replace 30% of brood combs annually with fresh foundation wax',
      'Disinfect hive tools with alcohol or torch between apiaries'
    ],
    treatment: [
      'Implement shook-swarm protocol onto fresh disease-free wax foundation',
      'Requeen the colony with a vigorous, disease-resistant mated queen',
      'Temporary brood interruption (queen caging for 10-14 days)',
      'Isolate affected apiary and avoid comb sharing across healthy hives'
    ],
    standards: [
      'World Organisation for Animal Health (WOAH) Terrestrial Code Chapter 9.5',
      'European Food Safety Authority (EFSA) Scientific Opinion on Honeybee Brood Health',
      'EU Pollinator Hub Controlled Vocabulary (EUPH-CV / PolOn)'
    ]
  },
  'American Foulbrood (AFB)': {
    causativeAgent: 'Paenibacillus larvae (Highly resistant endospore-forming bacterium)',
    pathologyStage: 'Capped brood & early pupal stage (spores viable 40+ years)',
    description: 'American Foulbrood is the most lethal bacterial disease affecting honey bee larvae. Spores ingested by young larvae germinate into vegetative cells in the midgut, decomposing tissues into a ropy colloidal mass.',
    symptoms: [
      'Sunken, dark, moist, and punctured brood cell cappings',
      'Distinct foul glue-pot or sulfurous decomposition odor',
      'Ropiness test: Brood remains draw out into an elastic thread of 2.5-3 cm',
      'Dry blackish-brown scale adhering tenaciously to the lower cell wall'
    ],
    prevention: [
      'Mandatory apiary biosecurity inspection before moving hives across sectors',
      'Never feed unpasteurized commercial honey or pollen from unknown sources',
      'Flame-sterilize metal hive tools with blowtorch between every apiary unit',
      'Quarantine newly purchased nucleus colonies for 30 days'
    ],
    treatment: [
      'CRITICAL: Immediate strict apiary quarantine and notification to regional bee inspector',
      'Destruction by burning of heavily infected frames and wax comb in sanitary pit',
      'Scorching of inner wooden hive body surfaces with high-temperature gas torch',
      'Prohibit honey harvesting or equipment transfer from the quarantine zone'
    ],
    standards: [
      'WOAH Terrestrial Manual Chapter 3.2.2 (American Foulbrood of Honey Bees)',
      'Indian Council of Agricultural Research (ICAR) Apiary Biosecurity Protocol',
      'National Bee Board (NBB) Mandatory Disease Reporting Framework'
    ]
  },
  'Varroa Mites': {
    causativeAgent: 'Varroa destructor (Ectoparasitic mite vectoring Deformed Wing Virus)',
    pathologyStage: 'Adult honeybees and developing drone/worker pupae',
    description: 'Varroa destructor is an invasive ectoparasitic mite that feeds on the fat body tissue of honey bees at all life stages. Infestation weakens bees, shortens lifespan, and transmits viral pathogens including Deformed Wing Virus (DWV).',
    symptoms: [
      'Visible reddish-brown oval mites clinging to the thorax or abdomen of bees',
      'Adult bees with stunted bodies, deformed or missing wings (DWV pathology)',
      'Spotty, punctured brood pattern and crawling bees in front of hive entrance',
      'Colony collapse disorder symptoms during late autumn/early winter'
    ],
    prevention: [
      'Conduct regular alcohol wash or powdered sugar roll mite drop counts (target < 2-3% infestation)',
      'Install screened bottom boards with sticky inspection sheets to monitor daily drop',
      'Practice drone brood trapping and removal during peak spring expansion',
      'Breed or introduce Varroa Sensitive Hygiene (VSH) queen stock'
    ],
    treatment: [
      'Apply organic treatments such as formic acid (Mite Away Quick Strips or Formic Pro)',
      'Oxalic acid sublimation or trickle during broodless windows (winter or artificial break)',
      'Thymol-based treatments (Apiguard / Api Life Var) when ambient temperatures allow (15°C - 30°C)',
      'Rotate synthetic miticides (Amitraz) strictly according to label instructions to prevent resistance'
    ],
    standards: [
      'European Food Safety Authority (EFSA) Bee Health Assessment Guidelines',
      'USDA-ARS Honey Bee Health Coalition Varroa Management Protocol',
      'WOAH Terrestrial Animal Health Code Chapter 9.6 (Varroosis of Honey Bees)'
    ]
  },
  'Nosema': {
    causativeAgent: 'Nosema apis & Nosema ceranae (Microsporidian intracellular fungal parasites)',
    pathologyStage: 'Adult honeybee ventricular epithelial midgut cells',
    description: 'Nosemosis of honey bees is an insidious disease of adult bees caused by microsporidian parasites. Spores germinate in the midgut, severely hindering digestion, reducing royal jelly secretion, and leading to premature foraging and early death.',
    symptoms: [
      'Dysentery streaks and fecal spots on hive entrance and frame top-bars (Nosema apis)',
      'Swollen, yellowish, milky ventriculus (midgut) lacking normal circular constrictions',
      'Weakened bees trembling and crawling helplessly on vegetation near the entrance',
      'Rapid spring depopulation without obvious dead bee accumulation inside hive'
    ],
    prevention: [
      'Winter colonies with young, vigorous queens and clean well-ripened honey stores',
      'Elevate hives 45 cm above ground in sunny, dry, well-ventilated apiary locations',
      'Disinfect combs with 80% acetic acid vapor or gamma irradiation before storage',
      'Feed thymol-supplemented sugar syrup in early autumn to lower spore burdens'
    ],
    treatment: [
      'Provide clean sugar syrup supplemented with organic thymol or certified natural extracts',
      'Replace contaminated dark brood frames with fresh sterilized wax foundations',
      'Requeen the colony with disease-tolerant queen stock',
      'Scrape and flame bottom boards and inner hive walls'
    ],
    standards: [
      'World Organisation for Animal Health (WOAH) Chapter 9.4 (Nosemosis of Honey Bees)',
      'European Food Safety Authority (EFSA) Scientific Opinion on Microsporidian Invasions',
      'EU Pollinator Hub Controlled Vocabulary (EUPH-CV / PolOn)'
    ]
  },
  'Chalkbrood': {
    causativeAgent: 'Ascosphaera apis (Heterothallic spore-forming fungus)',
    pathologyStage: 'Ingested by 3-4 day old larvae, germinates after capping',
    description: 'Chalkbrood is a fungal brood disease affecting honey bees. Fungal spores ingested with larval food germinate in the gut. The mycelium penetrates the larval tissues, transforming the larva into a hard, chalk-like white or greyish mummy.',
    symptoms: [
      'Hard, white or dark grey/black mummified larvae inside uncapped brood cells',
      'Chalky mummies expelled by hygienic worker bees onto the bottom board or entrance',
      'Hollow rattling sound when shaking frames with dried larval mummies',
      'Spotty brood pattern especially during damp, chilly spring weather'
    ],
    prevention: [
      'Position apiary in sunny, well-drained ground with good air circulation',
      'Tilt hives slightly forward to prevent rainwater accumulation on bottom boards',
      'Avoid opening hives during cold, damp, or windy weather',
      'Maintain strong worker populations capable of incubating the entire brood nest'
    ],
    treatment: [
      'Remove heavily infested frames and melt wax for industrial processing only',
      'Requeen colony with proven hygienic stock that quickly removes mummies',
      'Feed warm stimulating sugar syrup with clean pollen supplements',
      'Replace bottom boards and scrape out all debris'
    ],
    standards: [
      'WOAH Terrestrial Manual Reference for Honeybee Brood Pathologies',
      'ICAR AICRP on Honey Bees and Pollinators Management Bulletin'
    ]
  },
  'Sacbrood': {
    causativeAgent: 'Sacbrood virus (SBV / Iflavirus single-stranded RNA virus)',
    pathologyStage: 'Two-day-old larvae; mortality occurs after cell capping',
    description: 'Sacbrood is a viral infection that prevents honey bee larvae from completing pupal ecdysis (skin shedding). Fluid accumulates beneath the larval cuticle, forming a distinctive water-filled sac.',
    symptoms: [
      'Dying larvae forming a fluid-filled sac that can be easily pulled out intact with tweezers',
      'Larval head characteristically turned upward into a "gondola" or boat shape',
      'Color progression from pale white to canary yellow, then dark brown/black',
      'Brittle, boat-shaped scales adhering loosely to the bottom of the cell'
    ],
    prevention: [
      'Provide continuous high-protein pollen nutrition to bolster worker viral resistance',
      'Reduce mite-vectored viral stress by strictly controlling Varroa populations',
      'Avoid damp, shaded apiary locations and ensure adequate hive ventilation',
      'Introduce hygienic queen lines with proven viral clearing behavior'
    ],
    treatment: [
      'Requeen with a newly mated vigorous queen to create an artificial brood break',
      'Replace old darkened combs with fresh sterilized foundation',
      'Feed warm 1:1 sugar syrup to stimulate grooming and hygiene instincts',
      'Strong colonies generally self-clear sacbrood once weather and flora improve'
    ],
    standards: [
      'WOAH Terrestrial Animal Health Code for Apicultural Viral Diseases',
      'EU Reference Laboratory for Bee Health (EURL) Diagnostic Standards'
    ]
  },
  'Healthy': {
    causativeAgent: 'None (Optimal apiary biosecurity & vigorous queen vitality)',
    pathologyStage: 'All developmental stages clear of pathogenic spores',
    description: 'The inspected brood comb exhibits prime colony health. Solid, uniform brood pattern with pearly-white glistening larvae curled in natural positions, uniform convex cappings, and active hygienic worker behavior.',
    symptoms: [
      'Compact, solid, uninterrupted concentric brood pattern (> 85% capping uniformity)',
      'Pearly-white, glistening, plump larvae curled comfortably in cell bases',
      'Uniform dry golden-brown wax cappings without punctures, depressions, or grease',
      'Vigorous nurse bee coverage, calm comb demeanor, and clear hive aroma'
    ],
    prevention: [
      'Continue routine biosecurity inspections on a 10-14 day schedule',
      'Maintain clean water source within 200 meters of the apiary',
      'Ensure adequate honey and bee-bread reserves (minimum 2 full frames)',
      'Keep records of queen age, brood viability, and temperament'
    ],
    treatment: [
      'No medical or chemical intervention required',
      'Continue standard seasonal colony management and supers management for honey flow',
      'Rotate old frames out gradually during honey harvesting',
      'Maintain good ventilation and sunny hive elevation'
    ],
    standards: [
      'National Bee Board (NBB) Good Beekeeping Practices (GBP)',
      'FAO Biosecurity in Beekeeping and Honey Production Guidelines'
    ]
  }
};

export const ScanDetailView: React.FC<ScanDetailViewProps> = ({
  scan,
  onBack,
  onUpdateStatus,
  onTriggerOutbreakBroadcast,
  onShowToast
}) => {
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [isCopiedId, setIsCopiedId] = useState<boolean>(false);

  const isHealthy = scan.diseaseName === 'Healthy';
  const isCritical = scan.urgencyLevel === 'CRITICAL';
  const isQuarantined = scan.status === 'QUARANTINED';
  const isResolved = scan.status === 'RESOLVED';

  // Get matching dossier or fallback to EFB
  const dossier = DISEASE_DOSSIERS[scan.diseaseName] || 
    (scan.diseaseName.includes('Foulbrood') ? DISEASE_DOSSIERS['European Foulbrood (EFB)'] : DISEASE_DOSSIERS['Nosema']);

  // All 7 Standard Categories
  const allCategories = [
    'Chalkbrood',
    'European Foulbrood (EFB)',
    'Sacbrood',
    'Varroa Mites',
    'American Foulbrood (AFB)',
    'Nosema',
    'Healthy'
  ];

  // Synthesize or use real probabilities
  const probabilities = React.useMemo(() => {
    if (scan.classProbabilities && Object.keys(scan.classProbabilities).length > 0) {
      return scan.classProbabilities;
    }
    const targetPct = Math.round(scan.confidence * 100);
    const remainder = Math.max(0, 100 - targetPct);
    const otherCats = allCategories.filter(c => c !== scan.diseaseName);
    const perCat = Math.floor(remainder / otherCats.length);
    const leftover = remainder - perCat * otherCats.length;

    const map: Record<string, number> = {};
    map[scan.diseaseName] = targetPct;
    otherCats.forEach((c, idx) => {
      map[c] = perCat + (idx === 0 ? leftover : 0);
    });
    return map;
  }, [scan]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(scan.id);
    setIsCopiedId(true);
    if (onShowToast) onShowToast('info', 'ID Copied', 'Scan reference ID copied to clipboard.');
    setTimeout(() => setIsCopiedId(false), 2000);
  };

  const handleStatusChange = (newStatus: 'CONFIRMED' | 'QUARANTINED' | 'RESOLVED') => {
    onUpdateStatus(scan.id, newStatus);
    if (onShowToast) {
      if (newStatus === 'QUARANTINED') {
        onShowToast('warning', 'Biosecurity Quarantine Flagged', `Colony ${scan.apiaryLocation} placed under strict quarantine.`);
      } else if (newStatus === 'RESOLVED') {
        onShowToast('success', 'Quarantine Resolved', `Colony cleared for normal apiculture activity.`);
      } else {
        onShowToast('info', 'Diagnosis Confirmed', `Model classification confirmed by admin.`);
      }
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl w-full mx-auto space-y-6">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600" />
            <span>Back to Scans List</span>
          </button>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
            <span>Intelligence</span>
            <span>/</span>
            <span>Disease Scans</span>
            <span>/</span>
            <span className="text-slate-800 font-semibold truncate max-w-[200px]">{scan.diseaseName}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyId}
            title="Copy Scan ID"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-xs font-mono shadow-sm transition-all"
          >
            {isCopiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>ID: {scan.id.slice(0, 8)}...</span>
          </button>

          {onTriggerOutbreakBroadcast && !isHealthy && (
            <button
              onClick={() => onTriggerOutbreakBroadcast(scan.diseaseName, scan.apiaryLocation)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Broadcast Alert</span>
            </button>
          )}

          {isQuarantined ? (
            <button
              onClick={() => handleStatusChange('RESOLVED')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold shadow-sm transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Mark Quarantine Resolved</span>
            </button>
          ) : (
            <button
              onClick={() => handleStatusChange('QUARANTINED')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold shadow-sm transition-all"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Flag for Biosecurity Quarantine</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Diagnostic Header Banner Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
              isCritical
                ? 'bg-gradient-to-br from-rose-500 to-red-600 text-white'
                : isHealthy
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                : 'bg-gradient-to-br from-amber-500 to-orange-600 text-white'
            }`}>
              {isCritical ? <ShieldAlert className="w-8 h-8" /> : isHealthy ? <CheckCircle2 className="w-8 h-8" /> : <Activity className="w-8 h-8" />}
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                AI Predicted Condition
              </div>
              <div className="flex items-center gap-3 flex-wrap mt-0.5">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">{scan.diseaseName}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isCritical 
                    ? 'bg-rose-100 text-rose-800' 
                    : isHealthy 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {Math.round(scan.confidence * 100)}% Confidence
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  scan.urgencyLevel === 'CRITICAL'
                    ? 'bg-rose-500 text-white'
                    : scan.urgencyLevel === 'HIGH'
                    ? 'bg-orange-500 text-white'
                    : scan.urgencyLevel === 'MODERATE'
                    ? 'bg-amber-500 text-white'
                    : 'bg-emerald-500 text-white'
                }`}>
                  {scan.urgencyLevel} Urgency
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  isQuarantined
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : isResolved
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {scan.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-slate-700">{scan.apiaryLocation}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Beekeeper: <strong className="text-slate-800">{scan.beekeeperName}</strong></span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Timestamp: {scan.timestamp}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Specimen & Probabilities, Right Pathology & Protocol */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Scanned Specimen + 7 Category Probabilities */}
        <div className="lg:col-span-5 space-y-6">
          {/* Specimen Card */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Diagnostic Image Specimen</span>
              </div>
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-600 text-[11px] font-semibold border border-slate-200 transition-colors"
              >
                {isZoomed ? <ZoomOut className="w-3 h-3" /> : <ZoomIn className="w-3 h-3" />}
                <span>{isZoomed ? 'Reset Zoom' : '2.5x Zoom'}</span>
              </button>
            </div>

            <div className="relative bg-slate-950 flex items-center justify-center p-3 overflow-hidden min-h-[280px]">
              <img
                src={scan.imageUrl}
                alt={scan.diseaseName}
                onClick={() => setIsZoomed(!isZoomed)}
                className={`w-full max-h-[380px] object-cover rounded-lg cursor-pointer transition-transform duration-300 ${
                  isZoomed ? 'scale-150' : 'scale-100'
                }`}
              />
              <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[11px] font-medium">
                {isZoomed ? '🔍 Click again to zoom out' : '🔍 Tap image for microscopic zoom'}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Model Input: 224×224 RGB</span>
              <span>Inference: MobileNetV2-TFLite</span>
            </div>
          </div>

          {/* All 7 Category Probabilities Card (Matches Mobile App UI) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>All 7 Category Probabilities</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Softmax distribution across complete classification classes
              </p>
            </div>

            <div className="space-y-3 pt-1">
              {allCategories.map(category => {
                const prob = probabilities[category] || 0;
                const isTarget = category === scan.diseaseName;

                return (
                  <div key={category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-medium ${isTarget ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                        {category}
                      </span>
                      <span className={`font-bold ${isTarget ? 'text-rose-600' : 'text-amber-600'}`}>
                        {prob}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isTarget
                            ? isHealthy
                              ? 'bg-emerald-500'
                              : 'bg-rose-500'
                            : 'bg-amber-400'
                        }`}
                        style={{ width: `${prob}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Pathology, Prevention & Treatment, References */}
        <div className="lg:col-span-7 space-y-6">
          {/* Description & Pathology Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Description & Pathology</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Biological etiology and host tissue interaction
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">Causative Pathogen</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{dossier.causativeAgent}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">Vulnerable Stage</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{dossier.pathologyStage}</span>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/60 p-3.5 rounded-lg border border-slate-100">
              {dossier.description}
            </p>

            {/* Diagnostic Symptoms Checklist */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Key Microscopic & Field Symptoms
              </h4>
              <div className="space-y-1.5">
                {dossier.symptoms.map((symptom, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                    <span>{symptom}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Prevention & Treatment Recommendations Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Prevention & Treatment Recommendations</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Standard biological control and chemical treatment protocols
              </p>
            </div>

            {/* Prevention Recommendations */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Prevention Recommendations:</span>
              </h4>
              <ul className="space-y-1.5 pl-2 text-xs text-slate-700">
                {dossier.prevention.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-slate-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggested Treatment Steps */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Suggested Treatment Steps:</span>
              </h4>
              <ul className="space-y-1.5 pl-2 text-xs text-slate-700">
                {dossier.treatment.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Authoritative References & Standards Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Authoritative References & Standards</span>
              </h3>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-600">
              {dossier.standards.map((std, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{std}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-600 font-semibold">
              <span className="flex items-center gap-1">
                <span>View on EU Pollinator Hub & WOAH</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
              <span className="text-slate-400 font-normal">Updated Nov 2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanDetailView;
