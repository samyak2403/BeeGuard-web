import React from 'react';
import { 
  Cpu, 
  Layers, 
  AlertTriangle, 
  Database, 
  MessageSquare, 
  ShoppingBag, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import { FeaturePillarConfig, DEFAULT_FEATURES } from './types';

interface FeaturesSectionProps {
  features?: FeaturePillarConfig[];
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  features = DEFAULT_FEATURES
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Cpu': return <Cpu className="w-5 h-5 text-amber-600" />;
      case 'Layers': return <Layers className="w-5 h-5 text-emerald-600" />;
      case 'AlertTriangle': return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      case 'Database': return <Database className="w-5 h-5 text-blue-600" />;
      case 'MessageSquare': return <MessageSquare className="w-5 h-5 text-purple-600" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5 text-teal-600" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-600" />;
      case 'Activity': return <Activity className="w-5 h-5 text-rose-600" />;
      default: return <Sparkles className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <section id="features" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
            Engineered for Modern Apiculture
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Six Autonomous Pillars of Hive Defense
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Built from the ground up for extreme field durability, offline resilience, and clinical diagnostic accuracy.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                
                {/* Header Row: Icon & Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getIcon(feature.iconName)}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${feature.badgeColor || 'bg-amber-100 text-amber-800 border-amber-300'}`}>
                    {feature.badge}
                  </span>
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    {feature.tagline}
                  </p>
                </div>

                {/* Description */}
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Bullets */}
                <ul className="space-y-2 pt-2 border-t border-slate-100">
                  {feature.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-tight">{highlight}</span>
                    </li>
                  ))}
                </ul>

              </div>

              {/* Card Footer Micro-Bar */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>BeeGuard Core Engine</span>
                <span className="text-amber-500 font-bold group-hover:translate-x-0.5 transition-transform">Active →</span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
