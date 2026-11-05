import React, { useState } from 'react';
import { 
  Download, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  Heart,
  Eye,
  Edit3,
  Save,
  RotateCcw
} from 'lucide-react';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { ScreenshotsSection } from './ScreenshotsSection';
import { DownloadSection } from './DownloadSection';
import { LandingPageEditor } from './LandingPageEditor';
import { AllPageBeeFlight } from './AllPageBeeFlight';
import { 
  LandingPageConfig, 
  loadLandingConfig, 
  saveLandingConfig, 
  resetLandingConfig 
} from './types';
import { GithubIcon } from './GithubIcon';

interface AppLandingPageProps {
  onShowToast?: (type: 'success' | 'warning' | 'info', title: string, desc?: string) => void;
  standalone?: boolean;
}

export const AppLandingPage: React.FC<AppLandingPageProps> = ({ 
  onShowToast,
  standalone = false 
}) => {
  const [isFullscreen, setIsFullscreen] = useState(standalone);
  const [config, setConfig] = useState<LandingPageConfig>(loadLandingConfig);
  const [adminTab, setAdminTab] = useState<'preview' | 'edit'>('preview');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSave = () => {
    saveLandingConfig(config);
    onShowToast?.('success', 'Landing Page Saved', 'Custom configuration is now active.');
  };

  const handleReset = () => {
    if (window.confirm('Reset all landing page customizations back to original defaults?')) {
      const def = resetLandingConfig();
      setConfig(def);
      onShowToast?.('info', 'Configuration Reset', 'Restored original default settings.');
    }
  };

  return (
    <div className={`min-h-screen bg-white text-slate-900 ${isFullscreen ? 'fixed inset-0 z-50 overflow-y-auto' : ''}`}>
      
      {/* Admin Mode Top Navigation Bar with Edit & Preview Tabs */}
      {!standalone && !isFullscreen && (
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 border-b border-slate-800 sticky top-0 z-50 shadow-md">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Left: Branding & Status */}
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🐝</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-white tracking-tight">
                    Landing Page Manager
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                    {config.release.version}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Switch between live preview and admin content customizer
                </p>
              </div>
            </div>

            {/* Center: The Two Tabs (Edit & Preview) */}
            <div className="flex items-center p-1 rounded-2xl bg-slate-800 border border-slate-700">
              <button
                type="button"
                onClick={() => setAdminTab('preview')}
                className={`h-8 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 border ${
                  adminTab === 'preview'
                    ? 'bg-amber-500 text-white border-transparent shadow-xs'
                    : 'text-slate-300 border-transparent hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>

              <button
                type="button"
                onClick={() => setAdminTab('edit')}
                className={`h-8 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 border ${
                  adminTab === 'edit'
                    ? 'bg-amber-500 text-white border-transparent shadow-xs'
                    : 'text-slate-300 border-transparent hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Customize & Edit</span>
              </button>
            </div>

            {/* Right: Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="h-8 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold border border-transparent inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                title="Save customizations"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="h-8 px-3 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                title="Reset to defaults"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Reset</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="h-8 px-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                title="Open Public View (Fullscreen)"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Fullscreen</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* RENDER TAB: EDIT / CUSTOMIZE */}
      {!standalone && !isFullscreen && adminTab === 'edit' ? (
        <LandingPageEditor
          config={config}
          onUpdate={setConfig}
          onSave={handleSave}
          onReset={handleReset}
          onSwitchToPreview={() => setAdminTab('preview')}
        />
      ) : (
        /* RENDER TAB: LIVE PREVIEW */
        <div className="relative">
          {/* Ambient Flying Bees Across the Entire Page (Without Any Card) */}
          <AllPageBeeFlight />

          {/* Public Top Navbar */}
          <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
              
              {/* Brand */}
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🐝</span>
                <div>
                  <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                    {config.brandName}
                  </span>
                  <span className="text-xs font-bold text-amber-600 ml-1.5 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200">
                    {config.brandTagline}
                  </span>
                </div>
              </div>

              {/* Center Navigation Links (Hidden on small mobile) */}
              <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
                <button 
                  onClick={() => scrollToSection('features')} 
                  className="h-8 inline-flex items-center justify-center hover:text-amber-600 transition-colors cursor-pointer"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('screenshots')} 
                  className="h-8 inline-flex items-center justify-center hover:text-amber-600 transition-colors cursor-pointer"
                >
                  App Preview
                </button>
                <button 
                  onClick={() => scrollToSection('download')} 
                  className="h-8 inline-flex items-center justify-center hover:text-amber-600 transition-colors cursor-pointer"
                >
                  Download APK
                </button>
                <a 
                  href={config.release.githubRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 inline-flex items-center justify-center gap-1.5 hover:text-slate-900 transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5 text-slate-700" />
                  <span>GitHub</span>
                </a>
              </nav>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2.5">
                
                {/* Toggle Fullscreen Public View */}
                {!standalone && (
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    title={isFullscreen ? "Exit Fullscreen" : "Open Fullscreen Public Showcase"}
                    className="h-9 px-3.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
                  >
                    {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Public View'}</span>
                  </button>
                )}

                {/* Direct Download Button */}
                <a
                  href={config.release.directDownloadUrl}
                  download="beeguard-v1.0.0.apk"
                  className="h-9 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs border border-transparent inline-flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Get APK</span>
                </a>
              </div>

            </div>
          </header>

          {/* Main Landing Sections */}
          <main>
            {/* Hero Section */}
            <HeroSection
              heroConfig={config.hero}
              releaseInfo={config.release}
              onScrollToDownload={() => scrollToSection('download')}
              onScrollToFeatures={() => scrollToSection('features')}
            />

            {/* Features Section */}
            <FeaturesSection features={config.features} />

            {/* Screenshots Section */}
            <ScreenshotsSection screensConfig={config.screens} />

            {/* Download & Installation Section */}
            <DownloadSection
              downloadConfig={config.download}
              releaseInfo={config.release}
              onShowToast={onShowToast}
            />
          </main>

          {/* Footer (No Open Source Tags!) */}
          <footer className="bg-slate-950 text-white py-12 border-t border-slate-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🐝</span>
                  <div>
                    <h3 className="font-extrabold text-base tracking-tight text-white">
                      {config.brandName} {config.brandTagline}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Next-Generation On-Device Apicultural Diagnostic Intelligence
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <a 
                    href={config.release.githubRepoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>Source</span>
                  </a>
                  <a 
                    href={config.release.githubReleasesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Releases</span>
                  </a>
                  <a 
                    href={config.release.directDownloadUrl}
                    download="beeguard-v1.0.0.apk"
                    className="hover:text-amber-400 font-semibold transition-colors flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download {config.release.version}</span>
                  </a>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
                <p>
                  {config.footerCopyright}
                </p>
                <p className="flex items-center gap-1">
                  <span>Engineered with</span>
                  <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                  <span>for Global Pollinator Protection</span>
                </p>
              </div>

            </div>
          </footer>
        </div>
      )}

    </div>
  );
};
