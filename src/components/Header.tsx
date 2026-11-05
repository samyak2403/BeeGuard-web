import React, { useState } from 'react';
import { Search, Radio, RefreshCw, X, Menu } from 'lucide-react';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onTriggerAlertModal: () => void;
  onRefreshData: () => void;
  onToggleMobileSidebar?: () => void;
  isLive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  onTriggerAlertModal,
  onRefreshData,
  onToggleMobileSidebar,
  isLive = true
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefreshData();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shrink-0 gap-3">
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-md min-w-0">
        {onToggleMobileSidebar && (
          <button 
            type="button"
            onClick={onToggleMobileSidebar}
            className="p-2 hover:bg-slate-100 active:bg-slate-200 rounded-lg text-slate-600 hover:text-slate-900 transition-colors shrink-0"
            title="Toggle Sidebar (3 lines)"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Search Bar */}
        <div className="relative w-full min-w-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search hives, scans, beekeepers..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-9 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-sans"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Firestore Indicator */}
        <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium shrink-0 ${
          isLive 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
            : 'bg-amber-50 border-amber-200 text-amber-700'
        }`}>
          <span className={`w-2 h-2 rounded-full shrink-0 ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          <span className="whitespace-nowrap">{isLive ? 'Live Firebase Connected' : 'Local Sandbox Mode'}</span>
        </div>

        {/* Date Display */}
        <span className="hidden xl:inline-block text-xs text-slate-500 font-medium px-1 whitespace-nowrap">
          {currentDate}
        </span>

        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          title="Refresh Telemetry"
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 border border-slate-200 transition-all shrink-0 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
        </button>

        {/* Emergency Broadcast Trigger */}
        <button
          onClick={onTriggerAlertModal}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium text-xs shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
        >
          <Radio className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline whitespace-nowrap">Broadcast Outbreak</span>
          <span className="sm:hidden whitespace-nowrap">Broadcast</span>
        </button>
      </div>
    </header>
  );
};
