import React, { useState } from 'react';
import { 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Sparkles,
  Layers,
  ArrowRight,
  Microscope,
  LayoutDashboard,
  Shield,
  Cpu,
  Database
} from 'lucide-react';
import { 
  HeroConfig, 
  AppReleaseInfo, 
  DEFAULT_HERO_CONFIG, 
  DEFAULT_APP_RELEASE 
} from './types';
import { GithubIcon } from './GithubIcon';
import { BeeTreeHiveScenery } from './BeeTreeHiveScenery';

import diagnosisResultImg from './screenshorts/diagnosis_result.png';
import homeImg from './screenshorts/home.png';

interface HeroSectionProps {
  onScrollToDownload: () => void;
  onScrollToFeatures: () => void;
  heroConfig?: HeroConfig;
  releaseInfo?: AppReleaseInfo;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToDownload,
  onScrollToFeatures,
  heroConfig = DEFAULT_HERO_CONFIG,
  releaseInfo = DEFAULT_APP_RELEASE
}) => {
  const [activeScreen, setActiveScreen] = useState<'diagnosis' | 'home'>('diagnosis');

  const renderStatIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
      case 'ShieldCheck': return <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
      case 'Layers': return <Layers className="w-3.5 h-3.5 text-blue-600 shrink-0" />;
      case 'Shield': return <Shield className="w-3.5 h-3.5 text-purple-600 shrink-0" />;
      case 'Cpu': return <Cpu className="w-3.5 h-3.5 text-indigo-600 shrink-0" />;
      case 'Database': return <Database className="w-3.5 h-3.5 text-cyan-600 shrink-0" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
    }
  };

  const getStatColorClass = (idx: number) => {
    switch (idx % 4) {
      case 0: return 'text-amber-700';
      case 1: return 'text-emerald-700';
      case 2: return 'text-blue-700';
      case 3: return 'text-purple-700';
      default: return 'text-slate-800';
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200">
      {/* Decorative Honeycomb Grid SVG */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Version & Badge Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{heroConfig.badgeTitle}</span>
              <span className="text-amber-500">•</span>
              <span className="text-slate-700 font-medium">{heroConfig.badgeSubtitle}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              {heroConfig.headlinePrefix}{' '}
              <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
                {heroConfig.headlineGradient}
              </span>{' '}
              {heroConfig.headlineSuffix}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {heroConfig.subtitle}
            </p>

            {/* Action Buttons: Direct APK & GitHub Releases */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-2">
              <a
                href={releaseInfo.directDownloadUrl}
                download="beeguard-v1.0.0.apk"
                onClick={onScrollToDownload}
                className="h-12 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm border border-transparent shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 inline-flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>{heroConfig.downloadButtonText} ({releaseInfo.fileSize})</span>
              </a>

              <a
                href={releaseInfo.githubReleasesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm border border-transparent shadow-sm inline-flex items-center justify-center gap-2 transition-all hover:bg-slate-800 cursor-pointer whitespace-nowrap shrink-0"
              >
                <GithubIcon className="w-4 h-4 shrink-0 text-white" />
                <span>{heroConfig.githubButtonText}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </a>

              <button
                type="button"
                onClick={onScrollToFeatures}
                className="h-12 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm border border-slate-300 shadow-2xs inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>{heroConfig.featuresButtonText}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              </button>
            </div>

            {/* Quick Specs / Trust Micro-Badges */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              {heroConfig.stats.map((stat, idx) => (
                <div key={stat.id || idx} className="p-3 rounded-xl bg-white/80 border border-slate-200/80 shadow-2xs">
                  <div className={`flex items-center gap-1.5 text-xs font-bold ${getStatColorClass(idx)}`}>
                    {renderStatIcon(stat.iconName)}
                    <span>{stat.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{stat.subtitle}</p>
                </div>
              ))}
            </div>

          </div>

          {/* Right Phone Mockup Column (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            
            {/* Ambient Background Glow */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-amber-400/20 via-yellow-500/20 to-orange-400/20 rounded-full blur-3xl pointer-events-none" />

            {/* Quick Screen Switcher Pill */}
            <div className="inline-flex items-center gap-1 p-1 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm mb-4 relative z-20">
              <button
                type="button"
                onClick={() => setActiveScreen('diagnosis')}
                className={`h-8 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 border ${
                  activeScreen === 'diagnosis'
                    ? 'bg-amber-500 text-white border-transparent shadow-xs'
                    : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Microscope className="w-3.5 h-3.5 shrink-0" />
                <span>AI Diagnosis</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveScreen('home')}
                className={`h-8 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 border ${
                  activeScreen === 'home'
                    ? 'bg-amber-500 text-white border-transparent shadow-xs'
                    : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
                <span>Apiary Home</span>
              </button>
            </div>

            {/* Realistic Smartphone Mockup Frame */}
            <div className="relative w-64 sm:w-72 rounded-[40px] bg-slate-900 p-2.5 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/50">
              
              {/* Speaker & Front Camera Hole Punch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-900 rounded-full z-30 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
              </div>

              {/* Screen Container */}
              <div className="relative rounded-[32px] overflow-hidden bg-slate-950 aspect-[1080/2400] border border-slate-800/80 shadow-inner group">
                <img 
                  src={activeScreen === 'diagnosis' ? diagnosisResultImg : homeImg} 
                  alt={activeScreen === 'diagnosis' ? 'BeeGuard AI Disease Diagnosis Screen' : 'BeeGuard Apiary Home Screen'}
                  className="w-full h-full object-cover object-top select-none transition-all duration-300"
                  loading="eager"
                />

                {/* Subtle Glass Reflection Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
              </div>

              {/* Floating Badge Top Right */}
              <div className="absolute -top-3 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-2.5 shadow-lg flex items-center gap-2.5 z-30 transform hover:scale-105 transition-transform">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black text-xs border border-rose-200">
                  94%
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-800 leading-tight">EFB Detected</p>
                  <p className="text-[10px] text-slate-500 font-mono">180ms Neural Vision</p>
                </div>
              </div>

              {/* Floating Badge Bottom Left */}
              <div className="absolute -bottom-3 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-2.5 shadow-lg flex items-center gap-2.5 z-30 transform hover:scale-105 transition-transform">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm border border-emerald-200">
                  ✓
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-800 leading-tight">Offline Room SQLite</p>
                  <p className="text-[10px] text-slate-500 font-mono">Full Remote Operation</p>
                </div>
              </div>

            </div>

            {/* Caption Under Phone */}
            <p className="text-[11px] text-slate-500 mt-5 text-center font-medium">
              Live screenshot from BeeGuard Android {releaseInfo.version} Production APK
            </p>

          </div>

        </div>

        {/* Organic Unboxed Apiary Scenery: Tree, Hanging Hive & Flying Bees (No Card) */}
        <div className="mt-6 sm:mt-10 w-full">
          <BeeTreeHiveScenery />
        </div>

      </div>
    </div>
  );
};
