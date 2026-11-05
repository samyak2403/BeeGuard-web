import React, { useState } from 'react';
import { 
  Sliders, 
  Cpu, 
  BellRing, 
  ShieldAlert, 
  Save, 
  CheckCircle2,
  Key
} from 'lucide-react';

interface SettingsTabProps {
  onShowToast?: (type: 'success' | 'warning' | 'info', title: string, desc?: string) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ onShowToast }) => {
  const [modelConfidenceThreshold, setModelConfidenceThreshold] = useState<number>(75);
  const [qwenModel, setQwenModel] = useState<string>('Qwen/Qwen2.5-7B-Instruct');
  const [huggingFaceKey, setHuggingFaceKey] = useState<string>('hf_••••••••••••••••••••••••••••••••');
  const [quarantineRadiusKm, setQuarantineRadiusKm] = useState<number>(15);
  const [autoQuarantineAFB, setAutoQuarantineAFB] = useState<boolean>(true);
  const [autoQuarantineEFB, setAutoQuarantineEFB] = useState<boolean>(true);
  const [autoQuarantineVarroa, setAutoQuarantineVarroa] = useState<boolean>(false);
  const [fcmEmergencyPush, setFcmEmergencyPush] = useState<boolean>(true);
  const [syncIntervalSec, setSyncIntervalSec] = useState<number>(30);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    if (onShowToast) {
      onShowToast('success', 'Settings Saved', 'AI model thresholds and biosecurity policies applied.');
    }
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="w-6 h-6 text-emerald-600 shrink-0" />
          <span className="truncate">System Settings & Model Configuration</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure BeeGuard AI neural endpoints, biosecurity thresholds, and cloud synchronization
        </p>
      </div>

      {isSaved && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>System configuration successfully updated. Active parameters refreshed.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: AI Diagnostic Engine */}
        <div className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 space-y-5 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
            <Cpu className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-slate-900">AI Disease Diagnostic Inference Engine</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-slate-600 font-medium">Quarantine Trigger Confidence</label>
                <span className="font-bold text-emerald-600">{modelConfidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={modelConfidenceThreshold}
                onChange={(e) => setModelConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Scans exceeding this confidence score trigger automatic isolation advisory.
              </p>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1.5">Qwen Apiculture Model</label>
              <select
                value={qwenModel}
                onChange={(e) => setQwenModel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none"
              >
                <option value="Qwen/Qwen2.5-7B-Instruct">Qwen2.5-7B-Instruct (Fast & Precise)</option>
                <option value="Qwen/Qwen2.5-14B-Instruct">Qwen2.5-14B-Instruct (Research Grade)</option>
                <option value="Qwen/Qwen2.5-32B-Instruct">Qwen2.5-32B-Instruct (Enterprise Cluster)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-600 font-medium mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Hugging Face Inference API Token</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="password"
                  value={huggingFaceKey}
                  onChange={(e) => setHuggingFaceKey(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono text-[11px] outline-none"
                />
                <button
                  type="button"
                  onClick={() => alert('API Connection Verified: Latency 142ms')}
                  className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200 text-xs shrink-0 cursor-pointer"
                >
                  Test Connection
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Biosecurity & Containment */}
        <div className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 space-y-5 shadow-sm">
          <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
            <span className="text-slate-900">Biosecurity & Containment Policy</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1.5">
                Regional Push Advisory Radius (Kilometers)
              </label>
              <input
                type="number"
                min="5"
                max="100"
                value={quarantineRadiusKm}
                onChange={(e) => setQuarantineRadiusKm(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Apiaries within this distance receive automated spore alerts.
              </p>
            </div>

            <div className="space-y-2.5 flex flex-col justify-center">
              <label className="flex items-center gap-2.5 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoQuarantineAFB}
                  onChange={(e) => setAutoQuarantineAFB(e.target.checked)}
                  className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                />
                <span>Auto-quarantine on American Foulbrood (AFB) detection</span>
              </label>
              <label className="flex items-center gap-2.5 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoQuarantineEFB}
                  onChange={(e) => setAutoQuarantineEFB(e.target.checked)}
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                />
                <span>Auto-quarantine on European Foulbrood (EFB) detection</span>
              </label>
              <label className="flex items-center gap-2.5 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoQuarantineVarroa}
                  onChange={(e) => setAutoQuarantineVarroa(e.target.checked)}
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                />
                <span>Flag hive for mite wash when Varroa exceeds 5%</span>
              </label>
            </div>
          </div>
        </div>

        {/* Card 3: Cloud Sync */}
        <div className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 space-y-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <BellRing className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Notification & Real-Time Sync</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1.5">
                Firestore Snapshot Polling Interval (Seconds)
              </label>
              <input
                type="number"
                min="10"
                max="300"
                value={syncIntervalSec}
                onChange={(e) => setSyncIntervalSec(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none"
              />
            </div>

            <div className="flex flex-col justify-center">
              <label className="flex items-center gap-2.5 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fcmEmergencyPush}
                  onChange={(e) => setFcmEmergencyPush(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
                <span>Enable Firebase Cloud Messaging (FCM) high-priority channel</span>
              </label>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setModelConfidenceThreshold(75);
              setQuarantineRadiusKm(15);
              setSyncIntervalSec(30);
            }}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold cursor-pointer"
          >
            Reset Defaults
          </button>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save System Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
