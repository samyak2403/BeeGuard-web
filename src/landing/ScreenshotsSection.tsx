import React, { useState, useEffect } from 'react';
import { 
  Microscope, 
  LayoutDashboard, 
  MessageSquare, 
  AlertTriangle, 
  ShoppingBag, 
  Check, 
  Maximize2, 
  X,
  ZoomIn,
  Sparkles
} from 'lucide-react';
import { ScreenShowcaseConfig, DEFAULT_SCREENS } from './types';

import homeImg from './screenshorts/home.png';
import diagnosisImg from './screenshorts/diagnosis_result.png';
import chatImg from './screenshorts/chat_screeen.png';
import noBeeImg from './screenshorts/no_bee_detected.png';
import productImg from './screenshorts/product_img.png';

interface ScreenshotsSectionProps {
  screensConfig?: ScreenShowcaseConfig[];
}

export const ScreenshotsSection: React.FC<ScreenshotsSectionProps> = ({
  screensConfig = DEFAULT_SCREENS
}) => {
  const [activeScreenId, setActiveScreenId] = useState<string>(screensConfig[0]?.id || 'diagnosis');
  const [lightboxImage, setLightboxImage] = useState<(ScreenShowcaseConfig & { image: string }) | null>(null);

  const getImageForId = (id: string) => {
    switch (id) {
      case 'home': return homeImg;
      case 'chatbot': return chatImg;
      case 'validation': return noBeeImg;
      case 'marketplace': return productImg;
      case 'diagnosis':
      default:
        return diagnosisImg;
    }
  };

  const getIconForId = (id: string) => {
    switch (id) {
      case 'home': return LayoutDashboard;
      case 'chatbot': return MessageSquare;
      case 'validation': return AlertTriangle;
      case 'marketplace': return ShoppingBag;
      case 'diagnosis':
      default:
        return Microscope;
    }
  };

  const activeScreen = screensConfig.find(s => s.id === activeScreenId) || screensConfig[0] || DEFAULT_SCREENS[0];
  const activeImage = getImageForId(activeScreen.id);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxImage(null);
      }
    };
    if (lightboxImage) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage]);

  return (
    <section id="screenshots" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>High-Contrast Jetpack Compose Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed for Field Apiary Operations
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            High-contrast Material 3 UI engineered for direct sunlight readability with gloved-hand touch targets. Explore the real screens running on production Android builds.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center justify-start lg:justify-center gap-2.5 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {screensConfig.map((screen) => {
            const Icon = getIconForId(screen.id);
            const isActive = screen.id === activeScreenId;
            return (
              <button
                key={screen.id}
                onClick={() => setActiveScreenId(screen.id)}
                className={`h-10 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-2xs inline-flex items-center justify-center gap-2 border ${
                  isActive
                    ? 'bg-amber-500 text-white border-transparent shadow-md shadow-amber-500/20 ring-2 ring-amber-400/50'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-amber-600'}`} />
                <span>{screen.tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Spotlight Showcase Card */}
        <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
          {/* Subtle Ambient Background Blob */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            
            {/* Left Column: Feature Narrative (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                  {activeScreen.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${activeScreen.badgeColor || 'bg-amber-100 text-amber-800 border-amber-300'}`}>
                  {activeScreen.badge}
                </span>
              </div>

              {/* Title & Headline */}
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {activeScreen.headline}
                </h3>
                <p className="text-amber-600 font-semibold text-xs sm:text-sm mt-1">
                  {activeScreen.title}
                </p>
              </div>

              {/* Paragraph Description */}
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {activeScreen.description}
              </p>

              {/* Feature Checkmarks */}
              <div className="space-y-3 pt-2">
                {activeScreen.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <span className="leading-snug">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setLightboxImage({ ...activeScreen, image: activeImage })}
                  className="h-10 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs border border-transparent inline-flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Enlarge Full Resolution (1080×2400)</span>
                </button>

                <div className="h-10 text-xs text-slate-600 font-mono bg-slate-100 px-3.5 rounded-xl border border-slate-200 inline-flex items-center justify-center">
                  {activeScreen.techHighlight}
                </div>
              </div>

            </div>

            {/* Right Column: High-Res Smartphone Mockup Frame (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              
              {/* Smartphone Outer Shell */}
              <div className="relative w-64 sm:w-72 rounded-[40px] bg-slate-900 p-2.5 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/50">
                
                {/* Punch-hole camera notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-900 rounded-full z-30 flex items-center justify-center pointer-events-none">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
                </div>

                {/* Screenshot Display Box with click-to-zoom hover */}
                <div 
                  onClick={() => setLightboxImage({ ...activeScreen, image: activeImage })}
                  className="relative rounded-[32px] overflow-hidden bg-slate-950 aspect-[1080/2400] border border-slate-800/80 shadow-inner group cursor-pointer"
                >
                  <img 
                    src={activeImage} 
                    alt={activeScreen.title}
                    className="w-full h-full object-cover object-top select-none transition-transform duration-300 group-hover:scale-102"
                    loading="lazy"
                  />

                  {/* Hover Overlay with Zoom Icon */}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4">
                    <div className="w-10 h-10 rounded-full bg-black/70 backdrop-blur-xs flex items-center justify-center mb-2 shadow-lg">
                      <ZoomIn className="w-5 h-5 text-amber-400" />
                    </div>
                    <span className="text-xs font-bold text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs">
                      Click to View 1080p Fullscreen
                    </span>
                  </div>

                  {/* Glass Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
                </div>

              </div>

              {/* Caption */}
              <p className="text-[11px] text-slate-500 mt-4 text-center font-medium">
                Captured directly from live Android device test run
              </p>

            </div>

          </div>
        </div>

        {/* 5-Screen Interactive Carousel / Thumbnail Strip */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span>All 5 Integrated App Screens</span>
              <span className="text-xs font-normal text-slate-500 normal-case">(Click any card to inspect)</span>
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {screensConfig.map((screen) => {
              const isActive = screen.id === activeScreenId;
              const screenImg = getImageForId(screen.id);
              return (
                <div
                  key={screen.id}
                  onClick={() => setActiveScreenId(screen.id)}
                  className={`group rounded-2xl bg-white border p-3 cursor-pointer transition-all ${
                    isActive
                      ? 'border-amber-500 ring-2 ring-amber-400/40 shadow-md transform -translate-y-1'
                      : 'border-slate-200 hover:border-amber-300 hover:shadow-xs'
                  }`}
                >
                  {/* Miniature Device Frame */}
                  <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-[1080/2400] mb-3 border border-slate-800">
                    <img 
                      src={screenImg} 
                      alt={screen.tabLabel}
                      className="w-full h-full object-cover object-top select-none group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {isActive && (
                      <div className="absolute inset-0 border-2 border-amber-500 rounded-xl pointer-events-none" />
                    )}
                  </div>

                  {/* Title & Category */}
                  <div className="text-center">
                    <p className={`text-xs font-bold truncate ${isActive ? 'text-amber-600' : 'text-slate-800 group-hover:text-amber-600'}`}>
                      {screen.tabLabel}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      {screen.category}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* High-Resolution Fullscreen Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setLightboxImage(null)}
        >
          <div 
            className="relative max-w-2xl w-full bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl p-4 sm:p-6 flex flex-col items-center max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {lightboxImage.category}
                </span>
                <h3 className="text-lg font-bold text-white">
                  {lightboxImage.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High-Res Phone Device View */}
            <div className="w-64 sm:w-80 rounded-[38px] bg-black p-2 border-4 border-slate-800 shadow-2xl my-2">
              <div className="rounded-[30px] overflow-hidden aspect-[1080/2400] bg-slate-950">
                <img 
                  src={lightboxImage.image} 
                  alt={lightboxImage.title}
                  className="w-full h-full object-cover object-top select-none"
                />
              </div>
            </div>

            {/* Footer Summary */}
            <div className="w-full pt-4 mt-2 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-300">
                {lightboxImage.description}
              </p>
              <div className="flex items-center justify-center gap-3 mt-3">
                <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md">
                  Resolution: 1080 × 2400 px
                </span>
                <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                  {lightboxImage.badge}
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
