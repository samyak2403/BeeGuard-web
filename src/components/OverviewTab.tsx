import React, { useState, useMemo } from 'react';
import { 
  ArrowUpRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { DiseaseScanRecord, OutbreakAlert, PlatformMetrics } from '../types';
import { ScanDetailView } from './ScanDetailView';

interface OverviewTabProps {
  metrics: PlatformMetrics;
  recentScans: DiseaseScanRecord[];
  activeOutbreaks: OutbreakAlert[];
  onNavigateToScans: () => void;
  onNavigateToOutbreaks: () => void;
  onUpdateScanStatus?: (scanId: string, newStatus: 'CONFIRMED' | 'QUARANTINED' | 'RESOLVED') => void;
  onTriggerOutbreakBroadcast?: (diseaseName: string, region: string) => void;
  onShowToast?: (type: 'success' | 'warning' | 'info', title: string, desc?: string) => void;
  adminName?: string;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  metrics,
  recentScans,
  activeOutbreaks,
  onNavigateToScans,
  onNavigateToOutbreaks,
  onUpdateScanStatus,
  onTriggerOutbreakBroadcast,
  onShowToast,
  adminName
}) => {
  const [selectedScan, setSelectedScan] = useState<DiseaseScanRecord | null>(null);

  // If a detection card was clicked, launch the full Scan Detail Dossier
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

  const statCards = [
    {
      title: 'Total Monitored Hives',
      value: metrics.activeHives.toString(),
      trend: 'Live Firestore Telemetry',
      trendColor: 'text-emerald-600'
    },
    {
      title: 'Active Beekeepers',
      value: metrics.totalBeekeepers.toString(),
      trend: 'Registered App Users',
      trendColor: 'text-blue-600'
    },
    {
      title: 'AI Field Scans',
      value: metrics.scansPerformed.toString(),
      trend: 'Real-time Detections',
      trendColor: 'text-amber-600'
    },
    {
      title: 'Colony Health Rate',
      value: `${metrics.overallHealthRate}%`,
      trend: 'Biosecurity Health Index',
      trendColor: 'text-emerald-600'
    }
  ];

  const diseaseDistribution = useMemo(() => {
    const total = recentScans.length;
    const diseaseConfigs: { name: string; color: string }[] = [
      { name: 'Healthy', color: 'bg-emerald-500' },
      { name: 'Nosema', color: 'bg-purple-500' },
      { name: 'Chalkbrood', color: 'bg-amber-500' },
      { name: 'Varroa Mites', color: 'bg-red-500' },
      { name: 'European Foulbrood (EFB)', color: 'bg-yellow-500' },
      { name: 'American Foulbrood (AFB)', color: 'bg-rose-600' },
      { name: 'Sacbrood', color: 'bg-pink-500' }
    ];

    return diseaseConfigs.map(({ name, color }) => {
      const count = recentScans.filter(s => 
        s.diseaseName.toLowerCase().includes(name.toLowerCase()) || 
        name.toLowerCase().includes(s.diseaseName.toLowerCase())
      ).length;
      const pct = total > 0 ? +((count / total) * 100).toFixed(1) : 0;
      return { name, count, pct, color };
    });
  }, [recentScans]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">
      {/* Welcome Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
          Welcome back, {adminName || 'Samyak'}!
        </h1>
        <p className="text-slate-600 text-sm">
          Here's your apiary and bee colony health overview. Click any detection to review full diagnostic dossier.
        </p>
      </div>

      {/* Emergency Alert Banner if any */}
      {activeOutbreaks.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center text-red-600 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-red-900 truncate">
                Active Outbreak: {activeOutbreaks[0].disease} ({activeOutbreaks[0].region})
              </p>
              <p className="text-xs text-red-700 mt-0.5 line-clamp-1">
                {activeOutbreaks[0].affectedHives} colonies quarantined for biosecurity containment.
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToOutbreaks}
            className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold self-start sm:self-auto shrink-0 shadow-sm transition-colors cursor-pointer"
          >
            View Containment
          </button>
        </div>
      )}

      {/* 4 Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-slate-200 min-w-0">
            <div className="text-xs sm:text-sm font-medium text-slate-500 mb-1 truncate">{card.title}</div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{card.value}</div>
            <div className={`text-xs sm:text-sm mt-2 font-medium truncate ${card.trendColor}`}>{card.trend}</div>
          </div>
        ))}
      </div>

      {/* Recent Disease Detections (Clickable Launcher) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-900">Recent Disease Detections</h2>
            <p className="text-xs text-slate-500 mt-0.5">Click any detection to open full microscopic diagnostic dossier</p>
          </div>
          <button
            onClick={onNavigateToScans}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <span>View All Scans ({recentScans.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {recentScans.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              <p className="font-semibold text-slate-700">No field disease scans recorded in Firebase</p>
              <p className="text-slate-400 mt-1">Real-time scans performed by beekeepers on the mobile app will automatically stream here via Firebase.</p>
            </div>
          ) : (
            recentScans.slice(0, 5).map((scan) => {
            const isHealthy = scan.diseaseName === 'Healthy';
            const isCritical = scan.urgencyLevel === 'CRITICAL';
            const confPct = Math.round(scan.confidence > 1 ? scan.confidence : scan.confidence * 100);

            return (
              <div
                key={scan.id}
                onClick={() => setSelectedScan(scan)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/40 rounded-xl px-3.5 sm:px-4 transition-all cursor-pointer group shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-md"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  {/* Specimen Photo Thumbnail */}
                  <div className="relative w-12 h-12 rounded-lg bg-slate-900 overflow-hidden shrink-0 shadow-sm border border-slate-200 group-hover:scale-105 transition-transform">
                    <img 
                      src={scan.imageUrl} 
                      alt={scan.diseaseName} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <p className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors truncate">
                        {scan.diseaseName}
                      </p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        isCritical
                          ? 'bg-rose-100 text-rose-800'
                          : isHealthy
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {confPct}% Conf.
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
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

                    <p className="text-xs text-slate-500 flex items-center gap-1.5 sm:gap-2 mt-1 min-w-0">
                      <span className="truncate max-w-[120px] sm:max-w-[160px] font-medium text-slate-700">{scan.beekeeperName}</span>
                      <span className="text-slate-300">•</span>
                      <span className="truncate flex-1">{scan.apiaryLocation}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-400 shrink-0 text-[11px]">{scan.timestamp}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pl-15 sm:pl-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 ${
                    scan.status === 'RESOLVED' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : scan.status === 'QUARANTINED' 
                      ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {scan.status}
                  </span>

                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 group-hover:text-emerald-700 shrink-0">
                    <span className="hidden sm:inline">Inspect Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })
        )}
        </div>
      </div>

      {/* Epidemiological Distribution Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Epidemiological Pathology Distribution</h2>
        <p className="text-xs text-slate-500 mb-5">
          Live classification telemetry across {recentScans.length} AI CNN verified field samples from Firebase
        </p>

        <div className="space-y-3.5">
          {diseaseDistribution.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 truncate mr-2">{item.name}</span>
                <span className="text-slate-500 shrink-0">
                  {item.count} cases <strong className="text-slate-800">({item.pct}%)</strong>
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
