import React, { useState } from 'react';
import { 
  Save, 
  RotateCcw, 
  Eye, 
  Package, 
  Sparkles, 
  Layers, 
  Smartphone, 
  Download, 
  FileText, 
  Check, 
  Upload, 
  FileDown,
  Info,
  ShieldCheck,
  FileCode,
  Loader2,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { LandingPageConfig } from './types';

interface LandingPageEditorProps {
  config: LandingPageConfig;
  onUpdate: (newConfig: LandingPageConfig) => void;
  onSave: () => void | Promise<void>;
  onReset: () => void | Promise<void>;
  onSwitchToPreview: () => void;
  isSaving?: boolean;
  lastSyncTime?: Date | null;
}

type EditorSection = 'release' | 'hero' | 'features' | 'screens' | 'download' | 'general';

export const LandingPageEditor: React.FC<LandingPageEditorProps> = ({
  config,
  onUpdate,
  onSave,
  onReset,
  onSwitchToPreview,
  isSaving = false,
  lastSyncTime = null
}) => {
  const [activeSection, setActiveSection] = useState<EditorSection>('release');
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const [isCalculatingHash, setIsCalculatingHash] = useState(false);
  const [apkInspectSuccess, setApkInspectSuccess] = useState<string | null>(null);

  const handleSaveClick = async () => {
    try {
      await onSave();
      setShowSavedFeedback(true);
      setTimeout(() => setShowSavedFeedback(false), 3500);
    } catch (e) {
      console.error('Save failed:', e);
    }
  };

  const handleApkFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.apk')) {
      alert('Please select a valid Android package file (.apk)');
      return;
    }

    setIsCalculatingHash(true);
    setApkInspectSuccess(null);

    try {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

      onUpdate({
        ...config,
        release: {
          ...config.release,
          fileSize: sizeMB,
          sha256: hashHex,
          directDownloadUrl: `/downloads/${file.name}`
        }
      });

      setApkInspectSuccess(`Parsed "${file.name}" (${sizeMB}) with real SHA-256! Click "Save All Changes" to publish live to Firestore.`);
    } catch (err: any) {
      console.error('Failed to parse APK file:', err);
      alert('Error calculating APK checksum: ' + err?.message);
    } finally {
      setIsCalculatingHash(false);
    }
  };

  const handleFillProductionDefaults = () => {
    onUpdate({
      ...config,
      release: {
        ...config.release,
        version: 'v1.0.0',
        buildNumber: 1,
        releaseDate: 'November 2026',
        fileSize: '37.8 MB',
        minAndroidVersion: 'Android 7.0 (Nougat, API 24)',
        targetAndroidVersion: 'Android 15+ (Vanilla Ice Cream, API 36)',
        architecture: 'arm64-v8a, armeabi-v7a, x86_64 (Universal)',
        sha256: '08DB65E217E26E550DADE5D68BB2613935FB646AE7ED1654898B8D5EB289921B',
        directDownloadUrl: '/downloads/beeguard-release.apk',
        githubRepoUrl: 'https://github.com/samyak2403/BeeGuard',
        githubReleasesUrl: 'https://github.com/samyak2403/BeeGuard/releases',
        githubDirectDownloadUrl: 'https://github.com/samyak2403/BeeGuard/releases/download/v1.0.0/app-release.apk'
      }
    });
    setApkInspectSuccess('Filled actual BeeGuard production release info! Click "Save" to publish live.');
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `beeguard-landing-config-${config.release.version}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        onUpdate({ ...config, ...parsed });
        alert('Configuration imported successfully! Remember to click "Save Changes".');
      } catch (err) {
        alert('Failed to parse JSON file. Please ensure it is valid.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Editor Top Command Bar */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
              Admin CMS
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-slate-500">Live Customization Engine</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Customize Landing Page Content
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Modify APK download links, version tags, hero copy, features, and screen highlights.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            type="button"
            onClick={onSwitchToPreview}
            className="h-9 px-3.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            <span>Preview Mode</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="h-9 px-3 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            title="Reset to default copy"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleExportJson}
            className="h-9 px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            title="Export JSON backup"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <label className="h-9 px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap">
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Import</span>
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>

          <button
            type="button"
            onClick={handleSaveClick}
            className="h-9 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold border border-transparent shadow-md shadow-amber-500/20 inline-flex items-center justify-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5 whitespace-nowrap"
          >
            {showSavedFeedback ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4 text-white" />}
            <span>{showSavedFeedback ? 'Saved!' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Editor Section Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveSection('release')}
          className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer inline-flex items-center justify-center gap-2 border ${
            activeSection === 'release'
              ? 'bg-amber-500 text-white border-transparent shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Package className="w-4 h-4 shrink-0" />
          <span>APK & Release Specs</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('hero')}
          className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer inline-flex items-center justify-center gap-2 border ${
            activeSection === 'hero'
              ? 'bg-amber-500 text-white border-transparent shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>Hero Section & Stats</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('features')}
          className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer inline-flex items-center justify-center gap-2 border ${
            activeSection === 'features'
              ? 'bg-amber-500 text-white border-transparent shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4 shrink-0" />
          <span>Autonomous Features (6)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('screens')}
          className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer inline-flex items-center justify-center gap-2 border ${
            activeSection === 'screens'
              ? 'bg-amber-500 text-white border-transparent shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Smartphone className="w-4 h-4 shrink-0" />
          <span>App Screens (5)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('download')}
          className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer inline-flex items-center justify-center gap-2 border ${
            activeSection === 'download'
              ? 'bg-amber-500 text-white border-transparent shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Download className="w-4 h-4 shrink-0" />
          <span>Download & Install Guide</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('general')}
          className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer inline-flex items-center justify-center gap-2 border ${
            activeSection === 'general'
              ? 'bg-amber-500 text-white border-transparent shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4 shrink-0" />
          <span>General & Footer</span>
        </button>
      </div>

      {/* SECTION 1: Release & APK Specs */}
      {activeSection === 'release' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
          
          {/* Header & Live Sync Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <Package className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Application Release & APK Download Information
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure live production APK release versioning, file sizes, target SDKs, and binary endpoints.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Firestore Real-Time Sync</span>
              </span>
              {lastSyncTime && (
                <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
                  Synced: {lastSyncTime.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>

          {/* Quick APK Inspection & Preset Actions */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">Quick Tools & Automated Inspection</p>
                <p className="text-[11px] text-slate-500">Pick an APK file to auto-calculate exact size & SHA-256 hash or load BeeGuard defaults.</p>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              <label className="h-8 px-3 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                {isCalculatingHash ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                    <span>Analyzing APK...</span>
                  </>
                ) : (
                  <>
                    <FileCode className="w-3.5 h-3.5 text-amber-600" />
                    <span>Inspect Local .APK</span>
                  </>
                )}
                <input 
                  type="file" 
                  accept=".apk" 
                  onChange={handleApkFileSelect} 
                  disabled={isCalculatingHash}
                  className="hidden" 
                />
              </label>

              <button
                type="button"
                onClick={handleFillProductionDefaults}
                className="h-8 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Load App v1.0.0 Defaults</span>
              </button>

              <button
                type="button"
                onClick={handleSaveClick}
                disabled={isSaving}
                className="h-8 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-bold shadow-xs inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    <span>Saving...</span>
                  </>
                ) : showSavedFeedback ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    <span>Saved Live!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 text-white" />
                    <span>Publish Live</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Inspection Alert Feedback */}
          {apkInspectSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{apkInspectSuccess}</span>
              </div>
              <button 
                type="button" 
                onClick={() => setApkInspectSuccess(null)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Version Tag (e.g. v1.0.0)
              </label>
              <input
                type="text"
                value={config.release.version}
                onChange={(e) => onUpdate({
                  ...config,
                  release: { ...config.release, version: e.target.value }
                })}
                placeholder="v1.0.0"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Version Code / Build Number
              </label>
              <input
                type="number"
                value={config.release.buildNumber}
                onChange={(e) => onUpdate({
                  ...config,
                  release: { ...config.release, buildNumber: parseInt(e.target.value) || 1 }
                })}
                placeholder="1"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Release Date / Month
              </label>
              <input
                type="text"
                value={config.release.releaseDate}
                onChange={(e) => onUpdate({
                  ...config,
                  release: { ...config.release, releaseDate: e.target.value }
                })}
                placeholder="November 2026"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                APK File Size
              </label>
              <input
                type="text"
                value={config.release.fileSize}
                onChange={(e) => onUpdate({
                  ...config,
                  release: { ...config.release, fileSize: e.target.value }
                })}
                placeholder="37.8 MB"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Minimum Android OS (minSdk)
              </label>
              <input
                type="text"
                value={config.release.minAndroidVersion}
                onChange={(e) => onUpdate({
                  ...config,
                  release: { ...config.release, minAndroidVersion: e.target.value }
                })}
                placeholder="Android 7.0 (Nougat, API 24)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Target Android OS (targetSdk)
              </label>
              <input
                type="text"
                value={config.release.targetAndroidVersion}
                onChange={(e) => onUpdate({
                  ...config,
                  release: { ...config.release, targetAndroidVersion: e.target.value }
                })}
                placeholder="Android 15+ (Vanilla Ice Cream, API 36)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Supported Architectures
              </label>
              <input
                type="text"
                value={config.release.architecture}
                onChange={(e) => onUpdate({
                  ...config,
                  release: { ...config.release, architecture: e.target.value }
                })}
                placeholder="arm64-v8a, armeabi-v7a, x86_64 (Universal)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Direct Download Binary Link (Local path or HTTPS URL)
              </label>
              <input
                type="text"
                value={config.release.directDownloadUrl}
                onChange={(e) => onUpdate({
                  ...config,
                  release: { ...config.release, directDownloadUrl: e.target.value }
                })}
                placeholder="/downloads/beeguard-release.apk"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Relative path (e.g. <code className="text-amber-700">/downloads/beeguard-release.apk</code>) or full URL (e.g. Firebase Storage, Google Drive).
              </span>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                GitHub Releases URL
              </label>
              <input
                type="text"
                value={config.release.githubReleasesUrl}
                onChange={(e) => onUpdate({
                  ...config,
                  release: { ...config.release, githubReleasesUrl: e.target.value }
                })}
                placeholder="https://github.com/samyak2403/BeeGuard/releases"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                GitHub Direct Binary Download Link
              </label>
              <input
                type="text"
                value={config.release.githubDirectDownloadUrl}
                onChange={(e) => onUpdate({
                  ...config,
                  release: { ...config.release, githubDirectDownloadUrl: e.target.value }
                })}
                placeholder="https://github.com/samyak2403/BeeGuard/releases/download/v1.0.0/app-release.apk"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                SHA-256 Binary Checksum (Security Verification)
              </label>
              <input
                type="text"
                value={config.release.sha256}
                onChange={(e) => onUpdate({
                  ...config,
                  release: { ...config.release, sha256: e.target.value }
                })}
                placeholder="08DB65E217E26E550DADE5D68BB2613935FB646AE7ED1654898B8D5EB289921B"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono select-all"
              />
            </div>
          </div>

          {/* Live Download Preview Widget */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-amber-600" />
                Live User Download Card Preview
              </span>
              <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-semibold border border-amber-200">
                Updates in Real-Time
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white border border-amber-300 shadow-xs space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-extrabold text-lg flex items-center justify-center shadow-sm">
                    🐝
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">{config.download.boxTitle}</h4>
                    <p className="text-[11px] text-slate-500">
                      Release {config.release.version} (Build #{config.release.buildNumber}) • {config.release.releaseDate}
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-300">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>{config.download.boxSubtitle || 'Verified Production Package'}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500 text-white flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5">
                  <Download className="w-4 h-4 text-white" />
                  <div>
                    <div className="text-xs font-extrabold leading-tight">{config.download.apkButtonLabel}</div>
                    <div className="text-[10px] text-amber-100 font-normal">
                      Package: {config.release.fileSize} • Direct: {config.release.directDownloadUrl}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/20 text-white">
                  .APK
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5 text-slate-600 text-[11px]">
                <div className="flex items-center justify-between font-semibold">
                  <span>SHA-256 Checksum:</span>
                  <span className="text-amber-700 font-mono text-[10px]">{config.release.architecture}</span>
                </div>
                <div className="font-mono text-[10px] text-slate-800 bg-slate-50 p-2 rounded border border-slate-100 break-all select-all">
                  {config.release.sha256}
                </div>
              </div>
            </div>
          </div>

          {/* Section Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Target SDK: <strong>{config.release.targetAndroidVersion}</strong> • Min: <strong>{config.release.minAndroidVersion}</strong>
            </span>

            <button
              type="button"
              onClick={handleSaveClick}
              disabled={isSaving}
              className="h-9 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-bold shadow-sm inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? 'Saving to Firestore...' : 'Save Release Specs to Firestore'}</span>
            </button>
          </div>

        </div>
      )}

      {/* SECTION 2: Hero Section & Stats */}
      {activeSection === 'hero' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Hero Section Copy & Micro-Stats
              </h3>
              <p className="text-xs text-slate-500">
                Customize top headline, badge labels, subtitle narrative, and the 4 trust stat cards.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Badge Title
              </label>
              <input
                type="text"
                value={config.hero.badgeTitle}
                onChange={(e) => onUpdate({
                  ...config,
                  hero: { ...config.hero, badgeTitle: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Badge Subtitle
              </label>
              <input
                type="text"
                value={config.hero.badgeSubtitle}
                onChange={(e) => onUpdate({
                  ...config,
                  hero: { ...config.hero, badgeSubtitle: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Headline Prefix
              </label>
              <input
                type="text"
                value={config.hero.headlinePrefix}
                onChange={(e) => onUpdate({
                  ...config,
                  hero: { ...config.hero, headlinePrefix: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Headline Gradient Highlight
              </label>
              <input
                type="text"
                value={config.hero.headlineGradient}
                onChange={(e) => onUpdate({
                  ...config,
                  hero: { ...config.hero, headlineGradient: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Headline Suffix
              </label>
              <input
                type="text"
                value={config.hero.headlineSuffix}
                onChange={(e) => onUpdate({
                  ...config,
                  hero: { ...config.hero, headlineSuffix: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Subtitle Description
              </label>
              <textarea
                rows={3}
                value={config.hero.subtitle}
                onChange={(e) => onUpdate({
                  ...config,
                  hero: { ...config.hero, subtitle: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Download Button Label
              </label>
              <input
                type="text"
                value={config.hero.downloadButtonText}
                onChange={(e) => onUpdate({
                  ...config,
                  hero: { ...config.hero, downloadButtonText: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Explore Features Button Label
              </label>
              <input
                type="text"
                value={config.hero.featuresButtonText}
                onChange={(e) => onUpdate({
                  ...config,
                  hero: { ...config.hero, featuresButtonText: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 4 Stat Badges Editor */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              4 Quick Trust / Performance Badges
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {config.hero.stats.map((stat, idx) => (
                <div key={stat.id || idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <span className="text-[10px] font-bold text-amber-600 uppercase">
                    Badge #{idx + 1}
                  </span>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={stat.title}
                      onChange={(e) => {
                        const newStats = [...config.hero.stats];
                        newStats[idx] = { ...newStats[idx], title: e.target.value };
                        onUpdate({
                          ...config,
                          hero: { ...config.hero, stats: newStats }
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={stat.subtitle}
                      onChange={(e) => {
                        const newStats = [...config.hero.stats];
                        newStats[idx] = { ...newStats[idx], subtitle: e.target.value };
                        onUpdate({
                          ...config,
                          hero: { ...config.hero, stats: newStats }
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: Autonomous Features (6 Pillars) */}
      {activeSection === 'features' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Layers className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Six Autonomous Pillars of Hive Defense
              </h3>
              <p className="text-xs text-slate-500">
                Edit titles, taglines, badges, descriptions, and feature bullet points.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {config.features.map((feature, idx) => (
              <div key={feature.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                    Pillar #{idx + 1}: {feature.id}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Icon: {feature.iconName}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) => {
                        const newFeatures = [...config.features];
                        newFeatures[idx] = { ...newFeatures[idx], title: e.target.value };
                        onUpdate({ ...config, features: newFeatures });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={feature.tagline}
                      onChange={(e) => {
                        const newFeatures = [...config.features];
                        newFeatures[idx] = { ...newFeatures[idx], tagline: e.target.value };
                        onUpdate({ ...config, features: newFeatures });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={feature.badge}
                      onChange={(e) => {
                        const newFeatures = [...config.features];
                        newFeatures[idx] = { ...newFeatures[idx], badge: e.target.value };
                        onUpdate({ ...config, features: newFeatures });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={feature.description}
                    onChange={(e) => {
                      const newFeatures = [...config.features];
                      newFeatures[idx] = { ...newFeatures[idx], description: e.target.value };
                      onUpdate({ ...config, features: newFeatures });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Highlights */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Key Highlights (3 Bullets)
                  </label>
                  <div className="space-y-2">
                    {feature.highlights.map((h, hIdx) => (
                      <input
                        key={hIdx}
                        type="text"
                        value={h}
                        onChange={(e) => {
                          const newFeatures = [...config.features];
                          const newHighlights = [...newFeatures[idx].highlights];
                          newHighlights[hIdx] = e.target.value;
                          newFeatures[idx] = { ...newFeatures[idx], highlights: newHighlights };
                          onUpdate({ ...config, features: newFeatures });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: App Screens (5) */}
      {activeSection === 'screens' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Smartphone className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Integrated App Screens (5 Screens Showcase)
              </h3>
              <p className="text-xs text-slate-500">
                Edit tab labels, headlines, technical highlights, and detailed clinical descriptions for each screen.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {config.screens.map((screen, idx) => (
              <div key={screen.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                    Screen #{idx + 1}: {screen.id} ({screen.tabLabel})
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Aspect Ratio: 1080×2400
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tab Label
                    </label>
                    <input
                      type="text"
                      value={screen.tabLabel}
                      onChange={(e) => {
                        const newScreens = [...config.screens];
                        newScreens[idx] = { ...newScreens[idx], tabLabel: e.target.value };
                        onUpdate({ ...config, screens: newScreens });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Screen Title
                    </label>
                    <input
                      type="text"
                      value={screen.title}
                      onChange={(e) => {
                        const newScreens = [...config.screens];
                        newScreens[idx] = { ...newScreens[idx], title: e.target.value };
                        onUpdate({ ...config, screens: newScreens });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={screen.category}
                      onChange={(e) => {
                        const newScreens = [...config.screens];
                        newScreens[idx] = { ...newScreens[idx], category: e.target.value };
                        onUpdate({ ...config, screens: newScreens });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Headline
                    </label>
                    <input
                      type="text"
                      value={screen.headline}
                      onChange={(e) => {
                        const newScreens = [...config.screens];
                        newScreens[idx] = { ...newScreens[idx], headline: e.target.value };
                        onUpdate({ ...config, screens: newScreens });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Badge Text & Tech Highlight
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={screen.badge}
                        placeholder="Badge"
                        onChange={(e) => {
                          const newScreens = [...config.screens];
                          newScreens[idx] = { ...newScreens[idx], badge: e.target.value };
                          onUpdate({ ...config, screens: newScreens });
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <input
                        type="text"
                        value={screen.techHighlight}
                        placeholder="Tech"
                        onChange={(e) => {
                          const newScreens = [...config.screens];
                          newScreens[idx] = { ...newScreens[idx], techHighlight: e.target.value };
                          onUpdate({ ...config, screens: newScreens });
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={screen.description}
                    onChange={(e) => {
                      const newScreens = [...config.screens];
                      newScreens[idx] = { ...newScreens[idx], description: e.target.value };
                      onUpdate({ ...config, screens: newScreens });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Key Features (4 Bullets)
                  </label>
                  <div className="space-y-2">
                    {screen.features.map((f, fIdx) => (
                      <input
                        key={fIdx}
                        type="text"
                        value={f}
                        onChange={(e) => {
                          const newScreens = [...config.screens];
                          const newFeatures = [...newScreens[idx].features];
                          newFeatures[fIdx] = e.target.value;
                          newScreens[idx] = { ...newScreens[idx], features: newFeatures };
                          onUpdate({ ...config, screens: newScreens });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: Download & Installation */}
      {activeSection === 'download' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Download className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Download Section & 3-Step Installation Guide
              </h3>
              <p className="text-xs text-slate-500">
                Customize download card titles, button labels, and field installation instructions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Section Badge
              </label>
              <input
                type="text"
                value={config.download.badge}
                onChange={(e) => onUpdate({
                  ...config,
                  download: { ...config.download, badge: e.target.value }
                })}
                placeholder="Official Android APK Release"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Section Headline
              </label>
              <input
                type="text"
                value={config.download.headline}
                onChange={(e) => onUpdate({
                  ...config,
                  download: { ...config.download, headline: e.target.value }
                })}
                placeholder="Download BeeGuard for Android"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Section Subtitle
              </label>
              <input
                type="text"
                value={config.download.subtitle}
                onChange={(e) => onUpdate({
                  ...config,
                  download: { ...config.download, subtitle: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Download Box Title
              </label>
              <input
                type="text"
                value={config.download.boxTitle}
                onChange={(e) => onUpdate({
                  ...config,
                  download: { ...config.download, boxTitle: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                APK Main Button Label
              </label>
              <input
                type="text"
                value={config.download.apkButtonLabel}
                onChange={(e) => onUpdate({
                  ...config,
                  download: { ...config.download, apkButtonLabel: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 3 Steps Guide */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              3-Step Installation Guide Steps
            </h4>

            <div className="space-y-3">
              {config.download.steps.map((step, idx) => (
                <div key={step.step} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-1 text-center font-bold text-amber-600 text-sm">
                    #{step.step}
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => {
                        const newSteps = [...config.download.steps];
                        newSteps[idx] = { ...newSteps[idx], title: e.target.value };
                        onUpdate({
                          ...config,
                          download: { ...config.download, steps: newSteps }
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div className="sm:col-span-7">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Instruction Detail
                    </label>
                    <input
                      type="text"
                      value={step.description}
                      onChange={(e) => {
                        const newSteps = [...config.download.steps];
                        newSteps[idx] = { ...newSteps[idx], description: e.target.value };
                        onUpdate({
                          ...config,
                          download: { ...config.download, steps: newSteps }
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: General & Footer */}
      {activeSection === 'general' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <FileText className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                General Branding & Footer Information
              </h3>
              <p className="text-xs text-slate-500">
                Customize brand naming, product taglines, and public footer copyright notices.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Brand Name
              </label>
              <input
                type="text"
                value={config.brandName}
                onChange={(e) => onUpdate({ ...config, brandName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Brand Tagline
              </label>
              <input
                type="text"
                value={config.brandTagline}
                onChange={(e) => onUpdate({ ...config, brandTagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Footer Copyright Text
              </label>
              <input
                type="text"
                value={config.footerCopyright}
                onChange={(e) => onUpdate({ ...config, footerCopyright: e.target.value })}
                placeholder="© 2026 BeeGuard Apiary Biosecurity • All Rights Reserved."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 text-xs">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Firestore Real-Time Database Sync</p>
              <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                When you click "Save Changes" or "Publish Live", all customizations are saved directly to Firebase Firestore in real-time. Changes are immediately reflected live across all browser sessions, mobile devices, and visitors.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Save Action Bar */}
      <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
        <button
          type="button"
          onClick={onSwitchToPreview}
          className="h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Eye className="w-4 h-4 text-slate-500" />
          <span>Switch to Live Preview</span>
        </button>

        <button
          type="button"
          onClick={handleSaveClick}
          disabled={isSaving}
          className="h-10 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-bold border border-transparent shadow-md shadow-amber-500/20 inline-flex items-center justify-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : showSavedFeedback ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Save className="w-4 h-4 text-white" />}
          <span>{isSaving ? 'Saving to Firestore...' : showSavedFeedback ? 'Saved Live to Firestore!' : 'Save All Changes'}</span>
        </button>
      </div>

    </div>
  );
};

