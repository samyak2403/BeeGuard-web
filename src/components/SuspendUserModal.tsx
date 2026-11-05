import React, { useState } from 'react';
import { ShieldAlert, X, Lock, Smartphone } from 'lucide-react';
import { UserAccount } from '../types';

interface SuspendUserModalProps {
  user: UserAccount | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userId: string, reason: string) => void;
}

const PRESET_REASONS = [
  'Violation of Apiary Biosecurity and Safety Standards',
  'Submitting False or Unverified Disease Diagnostic Reports',
  'Unauthorized Commercial Marketplace Transactions',
  'Non-Compliance with Quarantine and Health Inspection Mandates',
  'Suspicious Account Activity or Identity Impersonation',
  'Custom Reason'
];

export const SuspendUserModal: React.FC<SuspendUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !user) return null;

  const [selectedReason, setSelectedReason] = useState<string>(PRESET_REASONS[0]);
  const [customText, setCustomText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const finalReason = selectedReason === 'Custom Reason'
    ? (customText.trim() || 'Administrative suspension pending apiary biosecurity verification.')
    : selectedReason;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    onConfirm(user.id, finalReason);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-950">Suspend Beekeeper Account</h3>
              <p className="text-xs text-rose-700">Immediate lockout enforcement on mobile app</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-rose-100/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Target Beekeeper Summary */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900 truncate">{user.fullName}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200 text-slate-700 shrink-0">
              {user.role}
            </span>
          </div>

          {/* Reason Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Select Suspension Reason
            </label>
            <div className="space-y-2">
              {PRESET_REASONS.map((preset) => (
                <label
                  key={preset}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedReason === preset
                      ? 'bg-rose-50/80 border-rose-300 text-rose-950 font-semibold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="suspensionReason"
                    value={preset}
                    checked={selectedReason === preset}
                    onChange={() => setSelectedReason(preset)}
                    className="mt-0.5 text-rose-600 focus:ring-rose-500"
                  />
                  <span>{preset}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Text Area if Custom Reason is selected */}
          {selectedReason === 'Custom Reason' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Enter Specific Suspension Notice:
              </label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                rows={3}
                required
                placeholder="Detail the biosecurity, compliance, or marketplace policy violation..."
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
              />
            </div>
          )}

          {/* Mobile Preview Notice */}
          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
            <Smartphone className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="font-semibold block text-amber-950">Mobile App User Lockout Notice:</span>
              <span className="text-[11px] text-amber-800 line-clamp-2 mt-0.5">
                "{finalReason}"
              </span>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <Lock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>This user will be immediately locked out of all mobile features until re-activated.</span>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (selectedReason === 'Custom Reason' && !customText.trim())}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-sm shadow-rose-200 cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Confirm Suspension</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
