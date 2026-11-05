import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Radio, 
  MapPin, 
  Calendar, 
  Layers, 
  Activity, 
  Copy, 
  Check, 
  ChevronRight, 
  Bell, 
  FileText, 
  Lock
} from 'lucide-react';
import { OutbreakAlert, HiveRecord, DiseaseScanRecord } from '../types';
import { ScanDetailView } from './ScanDetailView';

interface OutbreakDetailViewProps {
  outbreak: OutbreakAlert;
  hives?: HiveRecord[];
  scans?: DiseaseScanRecord[];
  onBack: () => void;
  onUpdateStatus: (id: string, newStatus: 'ACTIVE_QUARANTINE' | 'CONTAINED' | 'INVESTIGATING') => void;
  onTriggerBroadcast?: () => void;
  onShowToast?: (type: 'success' | 'warning' | 'info', title: string, desc?: string) => void;
}

export const OutbreakDetailView: React.FC<OutbreakDetailViewProps> = ({
  outbreak,
  hives = [],
  scans = [],
  onBack,
  onUpdateStatus,
  onTriggerBroadcast,
  onShowToast
}) => {
  const [selectedScan, setSelectedScan] = useState<DiseaseScanRecord | null>(null);
  const [isCopiedId, setIsCopiedId] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<'ACTIVE_QUARANTINE' | 'CONTAINED' | 'INVESTIGATING'>(outbreak.status);

  // If a scan inside this outbreak is clicked, launch the complete Scan Detail Dossier
  if (selectedScan) {
    return (
      <ScanDetailView
        scan={selectedScan}
        onBack={() => setSelectedScan(null)}
        onUpdateStatus={(scanId, newStatus) => {
          if (onShowToast) {
            onShowToast('info', 'Status Updated', `Scan ${scanId.slice(0, 8)} updated to ${newStatus}.`);
          }
        }}
        onTriggerOutbreakBroadcast={onTriggerBroadcast ? () => onTriggerBroadcast() : undefined}
        onShowToast={onShowToast}
      />
    );
  }

  const isCritical = outbreak.severity === 'CRITICAL';
  const isQuarantine = currentStatus === 'ACTIVE_QUARANTINE';
  const isContained = currentStatus === 'CONTAINED';

  // Hives in the affected sector
  const regionKeyword = outbreak.region.split('&')[0].trim().toLowerCase();
  const affectedHives = hives.filter(h => 
    h.apiaryLocation.toLowerCase().includes(regionKeyword) ||
    (h.primaryDiagnosis && h.primaryDiagnosis.toLowerCase().includes(outbreak.disease.toLowerCase()))
  );

  // Scans for this disease in the region
  const diseaseKeyword = outbreak.disease.split(' ')[0].toLowerCase();
  const linkedScans = scans.filter(s => 
    s.diseaseName.toLowerCase().includes(diseaseKeyword) ||
    (s.apiaryLocation && s.apiaryLocation.toLowerCase().includes(regionKeyword))
  );

  const handleCopyId = () => {
    navigator.clipboard.writeText(outbreak.id);
    setIsCopiedId(true);
    if (onShowToast) onShowToast('info', 'Alert ID Copied', 'Outbreak statutory reference ID copied.');
    setTimeout(() => setIsCopiedId(false), 2000);
  };

  const handleStatusChange = (newStatus: 'ACTIVE_QUARANTINE' | 'CONTAINED' | 'INVESTIGATING') => {
    setCurrentStatus(newStatus);
    onUpdateStatus(outbreak.id, newStatus);
    if (onShowToast) {
      if (newStatus === 'CONTAINED') {
        onShowToast('success', 'Outbreak Marked Contained', `${outbreak.disease} in ${outbreak.region} cleared.`);
      } else if (newStatus === 'ACTIVE_QUARANTINE') {
        onShowToast('warning', 'Quarantine Enforced', `Strict biosecurity containment active in ${outbreak.region}.`);
      } else {
        onShowToast('info', 'Status: Investigating', `Biosecurity inspection underway in ${outbreak.region}.`);
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
            <span>Back to Outbreak Alerts</span>
          </button>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
            <span>Biosecurity</span>
            <span>/</span>
            <span>Quarantines</span>
            <span>/</span>
            <span className="text-slate-800 font-semibold truncate max-w-[200px]">{outbreak.disease}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyId}
            title="Copy Outbreak ID"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-xs font-mono shadow-sm transition-all"
          >
            {isCopiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>ID: {outbreak.id.slice(0, 8)}...</span>
          </button>

          {onTriggerBroadcast && (
            <button
              onClick={onTriggerBroadcast}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Broadcast Push Alert</span>
            </button>
          )}

          {/* Status Switcher */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-xs font-semibold shadow-sm">
            <button
              onClick={() => handleStatusChange('ACTIVE_QUARANTINE')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                isQuarantine ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active Quarantine
            </button>
            <button
              onClick={() => handleStatusChange('INVESTIGATING')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                currentStatus === 'INVESTIGATING' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Investigating
            </button>
            <button
              onClick={() => handleStatusChange('CONTAINED')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                isContained ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Contained
            </button>
          </div>
        </div>
      </div>

      {/* Main Hero Quarantine Banner */}
      <div className={`bg-white rounded-2xl border p-6 shadow-sm transition-colors ${
        isQuarantine ? 'border-rose-200' : 'border-slate-200'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
              isCritical
                ? 'bg-gradient-to-br from-rose-500 to-red-600 text-white'
                : 'bg-gradient-to-br from-amber-500 to-orange-600 text-white'
            }`}>
              {isCritical ? <ShieldAlert className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Statutory Biosecurity Incident
              </div>
              <div className="flex items-center gap-3 flex-wrap mt-0.5">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">{outbreak.disease}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isCritical ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {outbreak.severity} SEVERITY
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  isQuarantine
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : isContained
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {currentStatus}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-slate-700">{outbreak.region}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span><strong>{outbreak.affectedHives}</strong> Confirmed Affected Colonies</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>First Reported: {outbreak.dateReported}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Key Biosecurity Containment Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Infected Colonies</span>
            <Layers className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{outbreak.affectedHives}</span>
            <span className="text-xs text-slate-400">colonies</span>
          </div>
          <p className="text-[11px] text-rose-600 font-semibold mt-1">
            Confirmed spore/parasite load
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Containment Radius</span>
            <Lock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">5.0</span>
            <span className="text-xs text-slate-400">km buffer</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Statutory biosecurity zone
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Regional Hives At Risk</span>
            <AlertTriangle className="w-4 h-4 text-orange-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{affectedHives.length || outbreak.affectedHives * 2}</span>
            <span className="text-xs text-slate-400">colonies</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Apiaries under active audit
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Mobile Broadcast</span>
            <Bell className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900">Dispatched</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            Delivered to regional beekeepers
          </p>
        </div>
      </div>

      {/* Main Grid: Directives & Affected Colonies / Linked Scans */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): Containment Directives & Biosecurity Protocol */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Statutory Containment Directives</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Legal obligations under the National Bee Board (NBB) & WOAH standards
              </p>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-100 text-xs text-rose-900 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <Lock className="w-4 h-4 text-rose-600 shrink-0" />
                <span>MANDATORY 5 KM MOVEMENT BAN ACTIVE</span>
              </div>
              <p className="leading-relaxed text-rose-800">
                All transit of honey bee colonies, nucleus boxes, queens, used comb, and raw pollen out of the {outbreak.region} is strictly prohibited until biosecurity clearance is issued.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs text-slate-700">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider">
                Emergency Enforcement Directives
              </h4>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                  <div>
                    <strong className="text-slate-900 block">Colony Quarantine & Shook-Swarm/Incineration</strong>
                    <span className="text-slate-600">
                      Heavily infected frames must be incinerated or shook onto new wax foundation. Bottom boards must be flamed.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                  <div>
                    <strong className="text-slate-900 block">Alcohol Wash / Spore Microscopic Audits</strong>
                    <span className="text-slate-600">
                      All apiaries within a 5 km radius must conduct microscopic comb examinations or 300-bee alcohol wash sampling within 72 hours.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                  <div>
                    <strong className="text-slate-900 block">Regional Apiarist Push Broadcast</strong>
                    <span className="text-slate-600">
                      Automated biosecurity notifications sent to all registered mobile app beekeepers across the Western Ghats sector.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): Linked Field Scans & Affected Hives */}
        <div className="lg:col-span-5 space-y-6">
          {/* Linked Diagnostic Scans */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>Related Diagnostic Scans ({linkedScans.length})</span>
            </h3>

            {linkedScans.length === 0 ? (
              <div className="p-6 text-center space-y-1 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500">
                <ShieldCheck className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                <p className="font-semibold text-slate-700">No Direct Scan Matches</p>
                <p className="text-[11px] text-slate-400">All local apiary camera scans reviewed.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {linkedScans.slice(0, 4).map(scan => (
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
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {Math.round(scan.confidence * 100)}% Conf. • {scan.timestamp}
                        </p>
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

          {/* Regional Quarantine Status */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Containment Compliance</span>
            </h3>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-2">
              <div className="flex justify-between items-center text-slate-700">
                <span>Apiary Audit Progress</span>
                <strong className="text-slate-900 font-bold">92% Audited</strong>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-[92%]" />
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Field inspectors from Satara & Belgaum regional stations deployed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutbreakDetailView;

