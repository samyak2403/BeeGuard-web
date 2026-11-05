import React, { useState } from 'react';
import { 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Copy, 
  Check, 
  QrCode,
  Smartphone
} from 'lucide-react';
import { 
  DownloadSectionConfig, 
  AppReleaseInfo, 
  DEFAULT_DOWNLOAD_CONFIG, 
  DEFAULT_APP_RELEASE 
} from './types';
import { GithubIcon } from './GithubIcon';

interface DownloadSectionProps {
  onShowToast?: (type: 'success' | 'warning' | 'info', title: string, desc?: string) => void;
  downloadConfig?: DownloadSectionConfig;
  releaseInfo?: AppReleaseInfo;
}

export const DownloadSection: React.FC<DownloadSectionProps> = ({ 
  onShowToast,
  downloadConfig = DEFAULT_DOWNLOAD_CONFIG,
  releaseInfo = DEFAULT_APP_RELEASE
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const getFullDownloadUrl = () => {
    if (typeof window === 'undefined') return releaseInfo.directDownloadUrl;
    return `${window.location.origin}${releaseInfo.directDownloadUrl}`;
  };

  const handleCopyLink = () => {
    const fullUrl = getFullDownloadUrl();
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    onShowToast?.('success', 'Direct APK Link Copied', fullUrl);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(releaseInfo.sha256);
    setCopiedHash(true);
    onShowToast?.('success', 'SHA-256 Checksum Copied');
    setTimeout(() => setCopiedHash(false), 2500);
  };

  // Generate a high-contrast SVG QR Code pointing to GitHub Releases
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    releaseInfo.githubReleasesUrl
  )}`;

  return (
    <section id="download" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
            {downloadConfig.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            {downloadConfig.headline}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {downloadConfig.subtitle}
          </p>
        </div>

        {/* Main Download Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Download Card & GitHub Links (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white border border-amber-300 shadow-sm space-y-6">
              
              {/* Release Header */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-amber-500/30">
                    🐝
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">
                      {downloadConfig.boxTitle}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Release {releaseInfo.version} (Build #{releaseInfo.buildNumber}) • {releaseInfo.releaseDate}
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{downloadConfig.boxSubtitle || 'Verified Production Package'}</span>
                </div>
              </div>

              {/* Primary Direct Download Button */}
              <div className="space-y-3">
                <a
                  href={releaseInfo.directDownloadUrl}
                  download="beeguard-v1.0.0.apk"
                  className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-base shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35 flex items-center justify-between transition-all transform hover:-translate-y-0.5 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <Download className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-extrabold leading-tight">
                        {downloadConfig.apkButtonLabel}
                      </div>
                      <div className="text-xs text-amber-100 font-normal">
                        Package: {releaseInfo.fileSize} • Standalone Installer .APK
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-3 py-1 rounded-lg bg-black/20 text-white group-hover:bg-black/30 transition-colors">
                    .APK
                  </span>
                </a>
              </div>

              {/* GitHub Releases & Source Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href={releaseInfo.githubReleasesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold border border-transparent inline-flex items-center justify-between transition-colors shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <GithubIcon className="w-4 h-4 text-white shrink-0" />
                    <span>GitHub Releases</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </a>

                <a
                  href={releaseInfo.githubRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-300 inline-flex items-center justify-between transition-colors shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <GithubIcon className="w-4 h-4 text-slate-700 shrink-0" />
                    <span>View Repository Source</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </a>
              </div>

              {/* Checksum Verification Box */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    SHA-256 Checksum:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="h-7 px-2.5 rounded-lg border border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-amber-50 text-[11px] text-amber-700 font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-amber-600" />}
                      <span>{copiedLink ? 'Copied' : 'Copy APK Link'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyHash}
                      className="h-7 px-2.5 rounded-lg border border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-amber-50 text-[11px] text-amber-700 font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedHash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-amber-600" />}
                      <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
                    </button>
                  </div>
                </div>
                <div className="font-mono text-[11px] text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-100 break-all select-all">
                  {releaseInfo.sha256}
                </div>
              </div>

            </div>

            {/* Installation Instructions */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                3-Step Android Installation Guide
              </h4>
              <ol className="space-y-2.5 text-xs text-slate-600 list-decimal list-inside">
                {downloadConfig.steps.map((step) => (
                  <li key={step.step} className="leading-relaxed">
                    <strong>{step.title}</strong> {step.description}
                  </li>
                ))}
              </ol>
            </div>

          </div>

          {/* Right Column: Scan QR Code & Hardware Specs (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* QR Code Quick Scan Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">
                <QrCode className="w-3.5 h-3.5 text-amber-600" />
                <span>Scan with Android Camera</span>
              </div>

              <h4 className="text-lg font-bold text-slate-900">
                Install Directly on Your Phone
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Scan this QR code with your mobile camera to open GitHub releases directly on your Android phone.
              </p>

              {/* QR Code Container */}
              <div className="flex justify-center py-2">
                <div className="p-3 rounded-2xl bg-white border-2 border-slate-200 shadow-inner">
                  <img
                    src={qrCodeUrl}
                    alt="Scan to Download BeeGuard Android APK"
                    className="w-40 h-40 object-contain rounded-lg"
                    loading="lazy"
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-400 font-mono">
                Points to verified GitHub Release Asset
              </p>
            </div>

            {/* Hardware & Compatibility Matrix */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Hardware & OS Requirements
                </h4>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Android Version</span>
                  <span className="font-semibold text-slate-800">{releaseInfo.minAndroidVersion}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Architecture</span>
                  <span className="font-semibold text-slate-800 font-mono">{releaseInfo.architecture}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Target Level</span>
                  <span className="font-semibold text-slate-800 font-mono">{releaseInfo.targetAndroidVersion}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Hardware Camera</span>
                  <span className="font-semibold text-slate-800">Required for TFLite Vision</span>
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-500">Storage Footprint</span>
                  <span className="font-semibold text-slate-800 font-mono">~{releaseInfo.fileSize}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
