import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Radio, 
  MapPin, 
  Calendar, 
  Layers, 
  ShieldCheck, 
  ArrowRight, 
  ChevronRight 
} from 'lucide-react';
import { OutbreakAlert, HiveRecord, DiseaseScanRecord } from '../types';
import { OutbreakDetailView } from './OutbreakDetailView';

interface OutbreaksTabProps {
  outbreaks: OutbreakAlert[];
  hives?: HiveRecord[];
  scans?: DiseaseScanRecord[];
  onTriggerBroadcast: () => void;
  onUpdateOutbreakStatus: (id: string, newStatus: 'ACTIVE_QUARANTINE' | 'CONTAINED' | 'INVESTIGATING') => void;
  onShowToast?: (type: 'success' | 'warning' | 'info', title: string, desc?: string) => void;
}

export const OutbreaksTab: React.FC<OutbreaksTabProps> = ({
  outbreaks,
  hives = [],
  scans = [],
  onTriggerBroadcast,
  onUpdateOutbreakStatus,
  onShowToast
}) => {
  const [selectedOutbreakId, setSelectedOutbreakId] = useState<string | null>(null);

  const selectedOutbreak = outbreaks.find(o => o.id === selectedOutbreakId);

  // If an outbreak card was clicked, render the dedicated Outbreak Detail View
  if (selectedOutbreak) {
    return (
      <OutbreakDetailView
        outbreak={selectedOutbreak}
        hives={hives}
        scans={scans}
        onBack={() => setSelectedOutbreakId(null)}
        onUpdateStatus={onUpdateOutbreakStatus}
        onTriggerBroadcast={onTriggerBroadcast}
        onShowToast={onShowToast}
      />
    );
  }

  const handleContained = (e: React.MouseEvent, outbreak: OutbreakAlert) => {
    e.stopPropagation();
    onUpdateOutbreakStatus(outbreak.id, 'CONTAINED');
    if (onShowToast) {
      onShowToast('success', 'Outbreak Contained', `${outbreak.disease} in ${outbreak.region} cleared.`);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">
      {/* Header & Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
            <span className="truncate">Delinquent Outbreak Quarantines</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Enforce statutory containment zones and emergency broadcasts • Click any quarantine card to inspect biosecurity dossier
          </p>
        </div>

        <button
          onClick={onTriggerBroadcast}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-sm transition-all self-start sm:self-auto active:scale-95 shrink-0 cursor-pointer"
        >
          <Radio className="w-4 h-4" />
          <span>Broadcast Quarantine Notice</span>
        </button>
      </div>

      {/* Outbreaks List or Empty State */}
      {outbreaks.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No active biosecurity outbreaks</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            All regional apiary corridors are currently clear of mandatory quarantine enforcement orders.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {outbreaks.map((outbreak) => {
            const isCritical = outbreak.severity === 'CRITICAL';
            const isQuarantine = outbreak.status === 'ACTIVE_QUARANTINE';

            return (
              <div
                key={outbreak.id}
                onClick={() => setSelectedOutbreakId(outbreak.id)}
                className={`p-5 sm:p-6 rounded-xl bg-white border shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between gap-4 group relative ${
                  isQuarantine ? 'border-red-200 hover:border-red-400' : 'border-slate-200 hover:border-emerald-400'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                  <div className="flex items-start gap-3.5 sm:gap-4 min-w-0 flex-1">
                    <div
                      className={`p-3 rounded-lg shrink-0 group-hover:scale-105 transition-transform ${
                        isCritical
                          ? 'bg-red-100 text-red-600'
                          : 'bg-amber-100 text-amber-600'
                      }`}
                    >
                      <ShieldAlert className="w-6 h-6" />
                    </div>

                    <div className="space-y-1.5 sm:space-y-2 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-red-700 transition-colors flex items-center gap-1.5 truncate">
                          <span className="truncate">{outbreak.disease}</span>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors shrink-0" />
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap inline-block shrink-0 ${
                          isCritical ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {outbreak.severity} SEVERITY
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[200px]">{outbreak.region}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span><strong>{outbreak.affectedHives}</strong> Infected Hives</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Reported: {outbreak.dateReported}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 self-start md:self-auto">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap inline-block shrink-0 ${
                      isQuarantine ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {outbreak.status}
                    </span>

                    {isQuarantine && (
                      <button
                        onClick={(e) => handleContained(e, outbreak)}
                        className="px-3.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Mark Contained</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Action Pill */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-red-600 group-hover:text-red-700">
                  <span className="truncate">Open Biosecurity Containment Dossier & Directives</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OutbreaksTab;
