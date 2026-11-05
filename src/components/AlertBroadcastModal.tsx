import React, { useState } from 'react';
import { X, Radio, Send } from 'lucide-react';
import { OutbreakAlert } from '../types';

interface AlertBroadcastModalProps {
  onClose: () => void;
  onBroadcast: (newAlert: OutbreakAlert, customMessage?: string) => void;
  onShowToast?: (type: 'success' | 'warning' | 'info', title: string, desc?: string) => void;
  initialDisease?: string;
  initialRegion?: string;
}

export const AlertBroadcastModal: React.FC<AlertBroadcastModalProps> = ({
  onClose,
  onBroadcast,
  onShowToast,
  initialDisease,
  initialRegion
}) => {
  const [disease, setDisease] = useState(initialDisease || 'American Foulbrood (AFB)');
  const [region, setRegion] = useState(initialRegion || 'Kolhapur West Apiary Corridor');
  const [severity, setSeverity] = useState<'CRITICAL' | 'HIGH' | 'MODERATE'>('CRITICAL');
  const [affectedHives, setAffectedHives] = useState(5);
  const [message, setMessage] = useState(
    'Urgent Biosecurity Notice: Suspected American Foulbrood detected. Cease inter-apiary colony transport immediately.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAlert: OutbreakAlert = {
      id: `out-${Date.now().toString().slice(-4)}`,
      region,
      disease,
      affectedHives,
      severity,
      dateReported: new Date().toISOString().split('T')[0],
      status: 'ACTIVE_QUARANTINE'
    };

    onBroadcast(newAlert, message);
    if (onShowToast) {
      onShowToast('warning', 'Emergency Alert Transmitted', `Push sent to all apiaries in ${region}.`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Emergency Outbreak Broadcast</h3>
              <p className="text-xs text-slate-500">Push notification to all registered beekeepers in target zone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Disease Pathology</label>
            <select
              value={disease}
              onChange={(e) => setDisease(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:bg-white focus:border-red-500 font-medium"
            >
              <option value="American Foulbrood (AFB)">American Foulbrood (AFB)</option>
              <option value="European Foulbrood (EFB)">European Foulbrood (EFB)</option>
              <option value="Varroa Mites Infestation">Varroa Mites Infestation</option>
              <option value="Nosema Spore Outbreak">Nosema Spore Outbreak</option>
              <option value="Chalkbrood Fungal Spread">Chalkbrood Fungal Spread</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Target Region</label>
              <input
                type="text"
                required
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:bg-white focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Severity Level</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as 'CRITICAL' | 'HIGH' | 'MODERATE')}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:bg-white focus:border-red-500 font-medium"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MODERATE">MODERATE</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Estimated Colonies Affected</label>
            <input
              type="number"
              min="1"
              max="500"
              value={affectedHives}
              onChange={(e) => setAffectedHives(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:bg-white focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Notification Body Message</label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:bg-white focus:border-red-500 font-mono text-[11px]"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Transmit Push Alert</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
