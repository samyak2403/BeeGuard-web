import React, { useState } from 'react';
import { 
  Microscope, 
  Filter, 
  Eye, 
  Clock, 
  MapPin, 
  User, 
  ZoomIn, 
  ShieldCheck, 
  ShieldAlert,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { DiseaseScanRecord } from '../types';
import { ScanDetailView } from './ScanDetailView';

interface ScansTabProps {
  scans: DiseaseScanRecord[];
  onUpdateScanStatus: (scanId: string, newStatus: 'CONFIRMED' | 'QUARANTINED' | 'RESOLVED') => void;
  onTriggerOutbreakBroadcast?: (diseaseName: string, region: string) => void;
  onShowToast?: (type: 'success' | 'warning' | 'info', title: string, desc?: string) => void;
}

export const ScansTab: React.FC<ScansTabProps> = ({ 
  scans, 
  onUpdateScanStatus,
  onTriggerOutbreakBroadcast,
  onShowToast
}) => {
  const [selectedDisease, setSelectedDisease] = useState<string>('ALL');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('ALL');
  const [selectedScanId, setSelectedScanId] = useState<string | null>(null);

  const selectedScan = scans.find((s) => s.id === selectedScanId);

  // If a scan card was clicked, render the dedicated Scan Detail Page
  if (selectedScan) {
    return (
      <ScanDetailView
        scan={selectedScan}
        onBack={() => setSelectedScanId(null)}
        onUpdateStatus={onUpdateScanStatus}
        onTriggerOutbreakBroadcast={onTriggerOutbreakBroadcast}
        onShowToast={onShowToast}
      />
    );
  }

  const diseases = [
    'ALL',
    'European Foulbrood (EFB)',
    'American Foulbrood (AFB)',
    'Varroa Mites',
    'Nosema',
    'Chalkbrood',
    'Sacbrood',
    'Healthy'
  ];

  const urgencies = ['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'];

  const filteredScans = scans.filter((scan) => {
    const diseaseMatch = selectedDisease === 'ALL' || scan.diseaseName === selectedDisease;
    const urgencyMatch = selectedUrgency === 'ALL' || scan.urgencyLevel === selectedUrgency;
    return diseaseMatch && urgencyMatch;
  });

  const handleStatusChange = (e: React.MouseEvent, scan: DiseaseScanRecord, newStatus: 'CONFIRMED' | 'QUARANTINED' | 'RESOLVED') => {
    e.stopPropagation();
    onUpdateScanStatus(scan.id, newStatus);
    if (onShowToast) {
      if (newStatus === 'QUARANTINED') {
        onShowToast('warning', 'Quarantine Protocol Issued', `${scan.diseaseName} in ${scan.apiaryLocation} flagged.`);
      } else if (newStatus === 'RESOLVED') {
        onShowToast('success', 'Quarantine Marked Resolved', 'Colony cleared for normal apiculture activity.');
      } else {
        onShowToast('info', 'Status Confirmed', 'Scan marked as confirmed by administrator.');
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">
      {/* Tab Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Microscope className="w-6 h-6 text-emerald-600 shrink-0" />
            <span className="truncate">AI Disease Classification Intelligence</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review comb cell & adult honeybee telemetry ({filteredScans.length} scans matched) • Click any card to open full diagnostic dossier
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 shadow-sm">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedDisease}
              onChange={(e) => setSelectedDisease(e.target.value)}
              className="bg-transparent text-slate-800 outline-none cursor-pointer font-medium"
            >
              {diseases.map((d) => (
                <option key={d} value={d} className="bg-white text-slate-800">
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 shadow-sm">
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="bg-transparent text-slate-800 outline-none cursor-pointer font-medium"
            >
              {urgencies.map((u) => (
                <option key={u} value={u} className="bg-white text-slate-800">
                  {u === 'ALL' ? 'All Urgencies' : u}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Scans Cards Grid or Empty State */}
      {filteredScans.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Microscope className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No matching AI scans found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your disease or urgency filters to view other field diagnostic records.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredScans.map((scan) => {
            const isHealthy = scan.diseaseName === 'Healthy';
            const isCritical = scan.urgencyLevel === 'CRITICAL';
            const confPct = Math.round(scan.confidence > 1 ? scan.confidence : scan.confidence * 100);

            return (
              <div
                key={scan.id}
                onClick={() => setSelectedScanId(scan.id)}
                className="rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group overflow-hidden"
              >
                <div>
                  {/* Image Frame */}
                  <div className="relative h-44 sm:h-48 bg-slate-900 overflow-hidden">
                    <img
                      src={scan.imageUrl}
                      alt={scan.diseaseName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5 sm:gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/95 text-slate-800 shadow">
                        {confPct}% Conf.
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        isCritical
                          ? 'bg-red-500 text-white'
                          : isHealthy
                          ? 'bg-emerald-500 text-white'
                          : 'bg-amber-500 text-white'
                      }`}>
                        {scan.urgencyLevel}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-sm text-[11px] font-semibold text-white flex items-center gap-1">
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>Inspect Dossier</span>
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 space-y-2">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center justify-between gap-2">
                      <span className="truncate">{scan.diseaseName}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{scan.apiaryLocation}</span>
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs text-slate-600">
                      <span className="flex items-center gap-1.5 min-w-0 flex-1 truncate">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{scan.beekeeperName}</span>
                      </span>
                      <span className="flex items-center gap-1 shrink-0 text-slate-400 text-[11px]">
                        <Clock className="w-3 h-3 shrink-0" />
                        <span>{scan.timestamp}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons & Navigation Pill */}
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 space-y-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedScanId(scan.id);
                      }}
                      className="flex-1 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-200 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Diagnostics</span>
                    </button>

                    {scan.status === 'QUARANTINED' ? (
                      <button
                        onClick={(e) => handleStatusChange(e, scan, 'RESOLVED')}
                        className="px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-medium transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Resolved</span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleStatusChange(e, scan, 'QUARANTINED')}
                        className="px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-medium transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Quarantine</span>
                      </button>
                    )}
                  </div>

                  {/* Click for Detail View Pill */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-emerald-600 group-hover:text-emerald-700">
                    <span className="truncate">Open Full Diagnostic Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ScansTab;
