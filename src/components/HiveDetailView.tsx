import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  Activity, 
  Copy, 
  Check, 
  Crown, 
  Box, 
  Droplet,
  Radio,
  FileText,
  ChevronRight
} from 'lucide-react';
import { HiveRecord, DiseaseScanRecord, HealthStatus } from '../types';
import { ScanDetailView } from './ScanDetailView';

interface HiveDetailViewProps {
  hive: HiveRecord;
  scans?: DiseaseScanRecord[];
  onBack: () => void;
  onUpdateHealth?: (hiveId: string, newHealth: HealthStatus) => void;
  onTriggerOutbreakBroadcast?: (diseaseName: string, region: string) => void;
  onShowToast?: (type: 'success' | 'warning' | 'info', title: string, desc?: string) => void;
}

export const HiveDetailView: React.FC<HiveDetailViewProps> = ({
  hive,
  scans = [],
  onBack,
  onUpdateHealth,
  onTriggerOutbreakBroadcast,
  onShowToast
}) => {
  const [selectedScan, setSelectedScan] = useState<DiseaseScanRecord | null>(null);
  const [isCopiedId, setIsCopiedId] = useState(false);
  const [currentHealth, setCurrentHealth] = useState<HealthStatus>(hive.healthStatus);

  // If a scan card inside this hive is clicked, open the full scan diagnostic dossier
  if (selectedScan) {
    return (
      <ScanDetailView
        scan={selectedScan}
        onBack={() => setSelectedScan(null)}
        onUpdateStatus={(scanId, newStatus) => {
          if (onShowToast) {
            onShowToast('info', 'Status Updated', `Scan ${scanId.slice(0, 8)} set to ${newStatus}.`);
          }
        }}
        onTriggerOutbreakBroadcast={onTriggerOutbreakBroadcast}
        onShowToast={onShowToast}
      />
    );
  }

  // Associated scans for this colony
  const linkedScans = scans.filter(s => 
    s.hiveId === hive.id || 
    (s.apiaryLocation && s.apiaryLocation.toLowerCase().includes(hive.name.toLowerCase())) ||
    (s.apiaryLocation && hive.apiaryLocation && s.apiaryLocation.toLowerCase().includes(hive.apiaryLocation.toLowerCase()))
  );

  const isHealthy = currentHealth === 'HEALTHY';
  const isWarning = currentHealth === 'WARNING';
  const isInfected = currentHealth === 'INFECTED';

  const handleCopyId = () => {
    navigator.clipboard.writeText(hive.id);
    setIsCopiedId(true);
    if (onShowToast) onShowToast('info', 'ID Copied', 'Hive colony UID copied to clipboard.');
    setTimeout(() => setIsCopiedId(false), 2000);
  };

  const handleHealthChange = (newHealth: HealthStatus) => {
    setCurrentHealth(newHealth);
    if (onUpdateHealth) {
      onUpdateHealth(hive.id, newHealth);
    }
    if (onShowToast) {
      onShowToast(
        newHealth === 'HEALTHY' ? 'success' : newHealth === 'WARNING' ? 'warning' : 'warning',
        'Colony Health Updated',
        `${hive.name} marked as ${newHealth}.`
      );
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
            <span>Back to Colony Fleet</span>
          </button>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
            <span>Fleet</span>
            <span>/</span>
            <span>Colonies</span>
            <span>/</span>
            <span className="text-slate-800 font-semibold truncate max-w-[200px]">{hive.name}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyId}
            title="Copy Hive ID"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-xs font-mono shadow-sm transition-all"
          >
            {isCopiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>UID: {hive.id.slice(0, 8)}...</span>
          </button>

          {isInfected && onTriggerOutbreakBroadcast && (
            <button
              onClick={() => onTriggerOutbreakBroadcast(hive.primaryDiagnosis || 'Brood Infection', hive.apiaryLocation)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Broadcast Outbreak</span>
            </button>
          )}

          {/* Health Status Selector */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-xs font-semibold shadow-sm">
            <button
              onClick={() => handleHealthChange('HEALTHY')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                isHealthy ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Healthy
            </button>
            <button
              onClick={() => handleHealthChange('WARNING')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                isWarning ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Warning
            </button>
            <button
              onClick={() => handleHealthChange('INFECTED')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                isInfected ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Infected
            </button>
          </div>
        </div>
      </div>

      {/* Main Colony Hero Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
              isInfected
                ? 'bg-gradient-to-br from-rose-500 to-red-600 text-white'
                : isWarning
                ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white'
                : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
            }`}>
              {isInfected ? <ShieldAlert className="w-8 h-8" /> : isWarning ? <AlertTriangle className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Apiary Colony Profile
              </div>
              <div className="flex items-center gap-3 flex-wrap mt-0.5">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">{hive.name}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  isInfected 
                    ? 'bg-rose-50 text-rose-700 border-rose-200' 
                    : isWarning 
                    ? 'bg-amber-50 text-amber-700 border-amber-200' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {currentHealth}
                </span>

                {hive.primaryDiagnosis && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                    Diagnosis: {hive.primaryDiagnosis}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-slate-700">{hive.apiaryLocation}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Beekeeper: <strong className="text-slate-800">{hive.beekeeperName}</strong></span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Last Inspected: {hive.lastInspectionDate}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Key Colony Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Honey Production</span>
            <Droplet className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{hive.honeyYieldKg}</span>
            <span className="text-xs text-slate-400">kg harvested</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            Standard seasonal yield
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Frame Capacity</span>
            <Box className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{hive.frameCount}</span>
            <span className="text-xs text-slate-400">Deep Frames</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Langstroth 10-Frame Spec
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Queen Status</span>
            <Crown className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900">{hive.queenStatus}</span>
          </div>
          <p className={`text-[11px] font-semibold mt-1 ${
            hive.queenStatus === 'ACTIVE' ? 'text-emerald-600' : 'text-amber-600'
          }`}>
            {hive.queenStatus === 'ACTIVE' ? 'Seen laying & healthy' : 'Requires monitoring'}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Linked AI Scans</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{linkedScans.length}</span>
            <span className="text-xs text-slate-400">records</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Diagnostic history
          </p>
        </div>
      </div>

      {/* Main Grid: Specifications & Linked Diagnostic Scans */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): Specifications & Hive Dossier */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Colony Dossier & Hive Specifications</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Technical characteristics and biological parameters
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">Hive Architecture</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">Langstroth 10-Frame (Seasoned Teak/Pine)</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">Brood Chamber Status</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{hive.frameCount} Deep brood frames fully drawn</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">Honey Super In Place</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">Yes • Standard shallow super (160mm)</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">Bee Species</span>
                <span className="font-semibold text-emerald-700 mt-0.5 block">Apis cerana indica / Apis mellifera</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 sm:col-span-2">
                <span className="text-slate-400 block font-medium">Apiary Sector</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{hive.apiaryLocation}</span>
              </div>
            </div>

            {/* Inspection Protocol Checklist */}
            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider">
                Seasonal Biosecurity Checklist
              </h4>
              <div className="space-y-2 text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Screened bottom board debris checked for Varroa mite count</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Queen oviposition verified (concentric brood rings present)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pollen reserve stores adequate (minimum 2 full frames)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Ventilation and hive entrance reducer adjusted for current weather</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): Linked AI Disease Scans */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span>Colony AI Diagnostics ({linkedScans.length})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real AI model scans linked to this colony
                </p>
              </div>
            </div>

            {linkedScans.length === 0 ? (
              <div className="p-6 text-center space-y-2 bg-slate-50 rounded-xl border border-slate-100">
                <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No Disease Scans Recorded</p>
                <p className="text-[11px] text-slate-400">
                  This colony has no pathogenic flags. Brood comb is clear.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {linkedScans.map(scan => (
                  <div
                    key={scan.id}
                    onClick={() => setSelectedScan(scan)}
                    className="p-3 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg bg-slate-900 overflow-hidden shrink-0 border border-slate-200 group-hover:scale-105 transition-transform">
                        <img 
                          src={scan.imageUrl} 
                          alt={scan.diseaseName} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {scan.diseaseName}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                          <span>{Math.round(scan.confidence * 100)}% Conf.</span>
                          <span>•</span>
                          <span>{scan.timestamp}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        scan.status === 'QUARANTINED'
                          ? 'bg-rose-100 text-rose-800'
                          : scan.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {scan.status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Responsible Apiarist Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Assigned Beekeeper</span>
            </h3>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1.5">
              <p className="font-bold text-slate-900 text-sm">{hive.beekeeperName}</p>
              <p className="text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{hive.apiaryLocation}</span>
              </p>
              <p className="text-slate-500">
                Apiary Unit Operator ID: <code className="font-mono text-slate-700">{hive.beekeeperId || 'N/A'}</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiveDetailView;
