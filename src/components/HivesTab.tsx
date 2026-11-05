import React, { useState } from 'react';
import { Layers, Plus, MapPin, User, X, ArrowRight, ChevronRight } from 'lucide-react';
import { HiveRecord, DiseaseScanRecord, HealthStatus } from '../types';
import { HiveDetailView } from './HiveDetailView';

interface HivesTabProps {
  hives: HiveRecord[];
  scans?: DiseaseScanRecord[];
  onAddNewHive: (hive: Omit<HiveRecord, 'id'>) => void;
  onUpdateHiveHealth?: (hiveId: string, newHealth: HealthStatus) => void;
  onTriggerOutbreakBroadcast?: (diseaseName: string, region: string) => void;
  onShowToast?: (type: 'success' | 'warning' | 'info', title: string, desc?: string) => void;
}

export const HivesTab: React.FC<HivesTabProps> = ({ 
  hives, 
  scans = [],
  onAddNewHive,
  onUpdateHiveHealth,
  onTriggerOutbreakBroadcast,
  onShowToast
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedHiveId, setSelectedHiveId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const [newHiveName, setNewHiveName] = useState('');
  const [newApiary, setNewApiary] = useState('Kolhapur Apiary Alpha');
  const [newKeeper, setNewKeeper] = useState('Samyak Kamble');
  const [newFrames, setNewFrames] = useState(10);
  const [newQueen, setNewQueen] = useState<'ACTIVE' | 'SUPERSEDED' | 'ABSENT'>('ACTIVE');

  const selectedHive = hives.find(h => h.id === selectedHiveId);

  // If a colony card was clicked, render the dedicated Hive Detail Page
  if (selectedHive) {
    return (
      <HiveDetailView
        hive={selectedHive}
        scans={scans}
        onBack={() => setSelectedHiveId(null)}
        onUpdateHealth={onUpdateHiveHealth}
        onTriggerOutbreakBroadcast={onTriggerOutbreakBroadcast}
        onShowToast={onShowToast}
      />
    );
  }

  const filteredHives = hives.filter((h) => {
    if (filterStatus === 'ALL') return true;
    return h.healthStatus === filterStatus;
  });

  const handleCreateHive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHiveName.trim()) return;

    onAddNewHive({
      name: newHiveName,
      apiaryLocation: newApiary,
      beekeeperId: 'usr-001',
      beekeeperName: newKeeper,
      healthStatus: 'HEALTHY',
      lastInspectionDate: new Date().toISOString().split('T')[0],
      honeyYieldKg: 20.0,
      queenStatus: newQueen,
      frameCount: newFrames
    });

    if (onShowToast) {
      onShowToast('success', 'Colony Registered', `${newHiveName} successfully added to fleet.`);
    }

    setNewHiveName('');
    setShowAddModal(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl w-full mx-auto space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-6 h-6 text-emerald-600" />
            <span>Apiary & Hive Colony Fleet</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitoring {filteredHives.length} colonies across regional apiary zones • Click any card for full colony telemetry
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none cursor-pointer shadow-sm font-medium"
          >
            <option value="ALL">All Health Conditions</option>
            <option value="HEALTHY">Healthy Colonies</option>
            <option value="WARNING">Warning / Suspect</option>
            <option value="INFECTED">Infected / Quarantined</option>
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Register Colony</span>
          </button>
        </div>
      </div>

      {/* Hives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHives.map((hive) => {
          const isHealthy = hive.healthStatus === 'HEALTHY';
          const isWarning = hive.healthStatus === 'WARNING';

          return (
            <div
              key={hive.id}
              onClick={() => setSelectedHiveId(hive.id)}
              className="p-6 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center justify-between">
                      <span className="truncate">{hive.name}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{hive.apiaryLocation}</span>
                    </p>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap inline-block shrink-0 ${
                    isHealthy
                      ? 'bg-green-100 text-green-700'
                      : isWarning
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {hive.healthStatus}
                  </span>
                </div>

                {hive.primaryDiagnosis && (
                  <div className="my-3 px-3 py-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                    <span className="text-slate-500">Diagnosis: </span>
                    <strong className="text-slate-800">{hive.primaryDiagnosis}</strong>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center my-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Queen</p>
                    <p className={`text-xs font-bold mt-1 ${hive.queenStatus === 'ACTIVE' ? 'text-green-600' : 'text-amber-600'}`}>
                      {hive.queenStatus}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Frames</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">{hive.frameCount} Deep</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Yield</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">{hive.honeyYieldKg} kg</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 truncate">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{hive.beekeeperName}</span>
                  </span>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {hive.lastInspectionDate}
                  </span>
                </div>

                {/* Open Colony Profile Pill */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-emerald-600 group-hover:text-emerald-700">
                  <span>Open Colony Profile & Telemetry</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <span>Register New Bee Colony</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHive} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Colony Identifier / Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hive Bravo #4"
                  value={newHiveName}
                  onChange={(e) => setNewHiveName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Apiary Location</label>
                <input
                  type="text"
                  required
                  value={newApiary}
                  onChange={(e) => setNewApiary(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Responsible Beekeeper</label>
                <input
                  type="text"
                  required
                  value={newKeeper}
                  onChange={(e) => setNewKeeper(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Frame Count</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={newFrames}
                    onChange={(e) => setNewFrames(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Queen Status</label>
                  <select
                    value={newQueen}
                    onChange={(e) => setNewQueen(e.target.value as 'ACTIVE' | 'SUPERSEDED' | 'ABSENT')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUPERSEDED">SUPERSEDED</option>
                    <option value="ABSENT">ABSENT</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm"
                >
                  Register Colony
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HivesTab;
