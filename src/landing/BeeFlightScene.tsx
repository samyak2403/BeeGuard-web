import React, { useState } from 'react';
import { Sparkles, Play, Pause } from 'lucide-react';

interface BeeFlightSceneProps {
  className?: string;
  showControls?: boolean;
}

export const BeeFlightScene: React.FC<BeeFlightSceneProps> = ({
  className = '',
  showControls = true
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [beeCount, setBeeCount] = useState(4);
  const [honeyGlow, setHoneyGlow] = useState(false);

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-b from-amber-500/10 via-amber-50/50 to-emerald-50/40 border border-amber-200/80 shadow-sm p-4 sm:p-6 ${className}`}>
      
      {/* Top Scene Controls & Title Bar */}
      {showControls && (
        <div className="flex items-center justify-between mb-2 relative z-20 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <span>Interactive Apiary Habitat</span>
              <span className="text-[10px] font-normal text-slate-500 normal-case">(Tree, Skep Hive & Active Foragers)</span>
            </h4>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setHoneyGlow(!honeyGlow)}
              className={`h-7 px-2.5 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1 border transition-all cursor-pointer ${
                honeyGlow 
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs' 
                  : 'bg-white/90 text-amber-800 border-amber-200 hover:bg-amber-50'
              }`}
              title="Toggle honey harvesting glow"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>{honeyGlow ? 'Glow Active' : 'Honey Glow'}</span>
            </button>

            <button
              type="button"
              onClick={() => setBeeCount(prev => (prev >= 6 ? 3 : prev + 1))}
              className="h-7 px-2.5 rounded-lg bg-white/90 hover:bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-semibold inline-flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
              title="Spawn extra flying bees"
            >
              <span>🐝 {beeCount} Bees</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="h-7 w-7 rounded-lg bg-white/90 hover:bg-amber-50 text-slate-700 border border-amber-200 inline-flex items-center justify-center transition-all cursor-pointer shadow-2xs"
              title={isPlaying ? "Pause flight animation" : "Resume flight animation"}
            >
              {isPlaying ? <Pause className="w-3 h-3 text-slate-700" /> : <Play className="w-3 h-3 text-emerald-600 fill-emerald-600" />}
            </button>
          </div>
        </div>
      )}

      {/* SVG Canvas Container */}
      <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] max-h-[300px]">
        <svg
          viewBox="0 0 1000 360"
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#FFFBEB" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ECFDF5" stopOpacity="0.5" />
            </linearGradient>

            <linearGradient id="trunkGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#582909" />
              <stop offset="40%" stopColor="#78350F" />
              <stop offset="70%" stopColor="#92400E" />
              <stop offset="100%" stopColor="#451A03" />
            </linearGradient>

            <linearGradient id="leafGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            <linearGradient id="leafGrad2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            <linearGradient id="leafGrad3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6EE7B7" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            {/* Honey Skep Hive Gradients */}
            <linearGradient id="skepGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="35%" stopColor="#F59E0B" />
              <stop offset="70%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>

            <linearGradient id="honeyDropGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="40%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            <linearGradient id="woodenHiveGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>

            {/* Honeycomb pattern */}
            <pattern id="hexPattern" width="16" height="28" patternUnits="userSpaceOnUse" patternTransform="scale(0.8)">
              <path
                d="M8 0 L16 4.6 L16 13.8 L8 18.5 L0 13.8 L0 4.6 Z M8 18.5 L16 23.1 L16 32.3 L8 37 L0 32.3 L0 23.1 Z"
                fill="none"
                stroke="#D97706"
                strokeWidth="0.8"
                strokeOpacity="0.25"
              />
            </pattern>

            {/* Glowing filter for honey drop */}
            <filter id="honeyGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <style>{`
            @keyframes wingFlutterLeft {
              0%, 100% { transform: rotate(0deg) scaleY(1); }
              50% { transform: rotate(-35deg) scaleY(0.3); }
            }
            @keyframes wingFlutterRight {
              0%, 100% { transform: rotate(0deg) scaleY(1); }
              50% { transform: rotate(35deg) scaleY(0.3); }
            }
            @keyframes beeFlyPath1 {
              0% { transform: translate(0px, 0px) rotate(0deg); }
              25% { transform: translate(160px, -35px) rotate(8deg); }
              50% { transform: translate(320px, 15px) rotate(-10deg); }
              75% { transform: translate(180px, 45px) rotate(5deg); }
              100% { transform: translate(0px, 0px) rotate(0deg); }
            }
            @keyframes beeFlyPath2 {
              0% { transform: translate(0px, 0px) rotate(0deg); }
              30% { transform: translate(-140px, 30px) rotate(-12deg); }
              60% { transform: translate(-260px, -25px) rotate(10deg); }
              85% { transform: translate(-100px, -40px) rotate(-5deg); }
              100% { transform: translate(0px, 0px) rotate(0deg); }
            }
            @keyframes beeFlyPath3 {
              0% { transform: translate(0px, 0px) scale(0.9); }
              50% { transform: translate(80px, -60px) scale(1.05) rotate(15deg); }
              100% { transform: translate(0px, 0px) scale(0.9); }
            }
            @keyframes beeFlyPath4 {
              0% { transform: translate(0px, 0px) rotate(0deg); }
              40% { transform: translate(-180px, -50px) rotate(-15deg); }
              70% { transform: translate(-80px, 20px) rotate(10deg); }
              100% { transform: translate(0px, 0px) rotate(0deg); }
            }
            @keyframes treeBreeze {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(0.8deg); }
            }
            @keyframes honeyDripDrop {
              0% { transform: scale(1) translateY(0); opacity: 0.9; }
              50% { transform: scale(1.15) translateY(3px); opacity: 1; }
              70% { transform: scale(0.9) translateY(6px); opacity: 0.6; }
              71% { transform: scale(1) translateY(0); opacity: 0; }
              85% { opacity: 0.9; }
              100% { transform: scale(1) translateY(0); opacity: 0.9; }
            }
            @keyframes hiveSway {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(-1.5deg); }
            }
            @keyframes pollenDrift {
              0% { transform: translateY(0) translateX(0); opacity: 0.3; }
              50% { transform: translateY(-12px) translateX(15px); opacity: 0.8; }
              100% { transform: translateY(0) translateX(0); opacity: 0.3; }
            }

            .wing-l {
              transform-origin: 12px 10px;
              animation: ${isPlaying ? 'wingFlutterLeft 0.08s ease-in-out infinite' : 'none'};
            }
            .wing-r {
              transform-origin: 12px 10px;
              animation: ${isPlaying ? 'wingFlutterRight 0.08s ease-in-out infinite' : 'none'};
            }
            .bee-1 {
              animation: ${isPlaying ? 'beeFlyPath1 12s ease-in-out infinite' : 'none'};
            }
            .bee-2 {
              animation: ${isPlaying ? 'beeFlyPath2 14s ease-in-out infinite' : 'none'};
            }
            .bee-3 {
              animation: ${isPlaying ? 'beeFlyPath3 9s ease-in-out infinite' : 'none'};
            }
            .bee-4 {
              animation: ${isPlaying ? 'beeFlyPath4 16s ease-in-out infinite' : 'none'};
            }
            .tree-sway-group {
              transform-origin: 120px 360px;
              animation: treeBreeze 7s ease-in-out infinite;
            }
            .skep-sway-group {
              transform-origin: 290px 85px;
              animation: hiveSway 5s ease-in-out infinite;
            }
            .honey-drop-anim {
              animation: honeyDripDrop 4s ease-in-out infinite;
            }
            .pollen-particle {
              animation: pollenDrift 4s ease-in-out infinite;
            }
          `}</style>

          {/* Background Ambient Sky */}
          <rect width="1000" height="360" fill="url(#skyGrad)" />

          {/* Golden Dotted Flight Paths (Decorative Trail) */}
          <g opacity="0.35" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 4" fill="none">
            <path d="M 290,175 Q 400,120 520,160 T 700,140 Q 820,190 760,250 T 560,240 Q 400,280 290,190" />
            <path d="M 310,180 C 220,150 180,90 240,60 C 300,30 380,80 310,180" />
            <path d="M 680,270 Q 750,210 840,240 T 910,290" />
          </g>

          {/* Distant Hills / Apiary Landscape */}
          <path
            d="M 0,320 Q 250,280 500,310 T 1000,290 L 1000,360 L 0,360 Z"
            fill="#A7F3D0"
            opacity="0.4"
          />
          <path
            d="M 0,335 Q 320,305 650,330 T 1000,315 L 1000,360 L 0,360 Z"
            fill="url(#grassGrad)"
            opacity="0.85"
          />

          {/* THE TREE WITH BRANCHES & LUSH FOLIAGE */}
          <g className="tree-sway-group">
            {/* Tree Trunk & Major Branches */}
            {/* Main Trunk rising on the left */}
            <path
              d="M 60,360 C 70,300 80,240 100,200 C 115,170 140,140 160,120 C 175,105 210,95 295,85 C 330,80 380,82 420,90 C 370,105 320,105 280,108 C 240,112 210,125 185,150 C 165,170 145,210 140,260 C 135,300 140,330 150,360 Z"
              fill="url(#trunkGrad)"
            />

            {/* Left secondary branch */}
            <path
              d="M 125,175 C 95,150 65,135 25,130 C 55,142 85,160 110,185 Z"
              fill="url(#trunkGrad)"
            />

            {/* Top secondary branch reaching toward sky */}
            <path
              d="M 180,135 C 190,95 210,65 240,35 C 225,60 205,95 195,130 Z"
              fill="url(#trunkGrad)"
            />

            {/* Bark Texture Lines */}
            <g stroke="#3E1A04" strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
              <path d="M 85,340 C 95,290 100,240 120,205" />
              <path d="M 115,350 C 122,310 125,270 140,230" />
              <path d="M 180,125 C 220,110 260,100 310,93" />
            </g>

            {/* Layer 1: Darker Emerald Under-Foliage Clusters */}
            <g fill="url(#leafGrad2)" opacity="0.95">
              <circle cx="160" cy="75" r="48" />
              <circle cx="220" cy="50" r="52" />
              <circle cx="280" cy="55" r="45" />
              <circle cx="105" cy="115" r="42" />
              <circle cx="50" cy="120" r="38" />
              <circle cx="360" cy="65" r="40" />
            </g>

            {/* Layer 2: Main Lush Green Canopy */}
            <g fill="url(#leafGrad1)">
              <circle cx="140" cy="65" r="44" />
              <circle cx="195" cy="40" r="48" />
              <circle cx="255" cy="42" r="46" />
              <circle cx="315" cy="55" r="42" />
              <circle cx="85" cy="100" r="38" />
              <circle cx="35" cy="110" r="32" />
              <circle cx="390" cy="70" r="30" />
            </g>

            {/* Layer 3: Vibrant Highlight Leaves & Buds */}
            <g fill="url(#leafGrad3)">
              <circle cx="170" cy="50" r="28" />
              <circle cx="230" cy="30" r="30" />
              <circle cx="290" cy="38" r="26" />
              <circle cx="70" cy="85" r="22" />
              <circle cx="340" cy="50" r="22" />
            </g>

            {/* Apple / Honey Tree Blossoms (Pink & White Petals with Golden Center) */}
            <g>
              {/* Blossom 1 on left branch */}
              <g transform="translate(65, 110)">
                <circle cx="-5" cy="0" r="4" fill="#FFFFFF" opacity="0.95" />
                <circle cx="5" cy="0" r="4" fill="#FFFFFF" opacity="0.95" />
                <circle cx="0" cy="-5" r="4" fill="#FFFFFF" opacity="0.95" />
                <circle cx="0" cy="5" r="4" fill="#FFFFFF" opacity="0.95" />
                <circle cx="0" cy="0" r="2.5" fill="#F59E0B" />
              </g>

              {/* Blossom 2 on upper branch */}
              <g transform="translate(210, 25)">
                <circle cx="-5" cy="0" r="4.5" fill="#FFF1F2" />
                <circle cx="5" cy="0" r="4.5" fill="#FFF1F2" />
                <circle cx="0" cy="-5" r="4.5" fill="#FFF1F2" />
                <circle cx="0" cy="5" r="4.5" fill="#FFF1F2" />
                <circle cx="0" cy="0" r="2.8" fill="#F59E0B" />
              </g>

              {/* Blossom 3 near hive branch */}
              <g transform="translate(350, 75)">
                <circle cx="-5" cy="0" r="4" fill="#FFFFFF" />
                <circle cx="5" cy="0" r="4" fill="#FFFFFF" />
                <circle cx="0" cy="-5" r="4" fill="#FFFFFF" />
                <circle cx="0" cy="5" r="4" fill="#FFFFFF" />
                <circle cx="0" cy="0" r="2.5" fill="#F59E0B" />
              </g>

              {/* Blossom 4 */}
              <g transform="translate(130, 95)">
                <circle cx="-4" cy="0" r="3.5" fill="#FFF1F2" />
                <circle cx="4" cy="0" r="3.5" fill="#FFF1F2" />
                <circle cx="0" cy="-4" r="3.5" fill="#FFF1F2" />
                <circle cx="0" cy="4" r="3.5" fill="#FFF1F2" />
                <circle cx="0" cy="0" r="2" fill="#F59E0B" />
              </g>

              {/* Blossom 5 */}
              <g transform="translate(275, 45)">
                <circle cx="-4.5" cy="0" r="4" fill="#FFFFFF" />
                <circle cx="4.5" cy="0" r="4" fill="#FFFFFF" />
                <circle cx="0" cy="-4.5" r="4" fill="#FFFFFF" />
                <circle cx="0" cy="4.5" r="4" fill="#FFFFFF" />
                <circle cx="0" cy="0" r="2.5" fill="#F59E0B" />
              </g>
            </g>
          </g>

          {/* THE HANGING SKEP BEEHIVE */}
          <g className="skep-sway-group">
            {/* Hanging Hemp Rope from Tree Branch */}
            <path
              d="M 290,85 L 290,118"
              stroke="#78350F"
              strokeWidth="3"
              strokeDasharray="2 1"
              strokeLinecap="round"
            />
            {/* Top Loop Knot */}
            <ellipse cx="290" cy="87" rx="4" ry="2" fill="#92400E" />
            <ellipse cx="290" cy="117" rx="5" ry="2.5" fill="#92400E" />

            {/* Skep Body (Layered woven straw dome rings) */}
            <g id="skepHiveBody" filter={honeyGlow ? "url(#honeyGlowFilter)" : undefined}>
              {/* Ring 1 (Top small cap) */}
              <ellipse cx="290" cy="122" rx="14" ry="7" fill="url(#skepGrad)" stroke="#B45309" strokeWidth="1" />
              {/* Ring 2 */}
              <ellipse cx="290" cy="132" rx="22" ry="9" fill="url(#skepGrad)" stroke="#B45309" strokeWidth="1.2" />
              {/* Ring 3 */}
              <ellipse cx="290" cy="144" rx="28" ry="11" fill="url(#skepGrad)" stroke="#B45309" strokeWidth="1.2" />
              {/* Ring 4 */}
              <ellipse cx="290" cy="158" rx="33" ry="12" fill="url(#skepGrad)" stroke="#B45309" strokeWidth="1.2" />
              {/* Ring 5 */}
              <ellipse cx="290" cy="172" rx="35" ry="13" fill="url(#skepGrad)" stroke="#B45309" strokeWidth="1.2" />
              {/* Ring 6 (Base) */}
              <ellipse cx="290" cy="186" rx="34" ry="12" fill="url(#skepGrad)" stroke="#B45309" strokeWidth="1.2" />

              {/* Honeycomb Texture Overlay */}
              <ellipse cx="290" cy="155" rx="32" ry="32" fill="url(#hexPattern)" opacity="0.6" pointerEvents="none" />

              {/* Hive Entrance Aperture */}
              <ellipse cx="290" cy="182" rx="8" ry="7" fill="#1C1917" />
              <path d="M 282,182 Q 290,177 298,182 L 298,187 Q 290,189 282,187 Z" fill="#0C0A09" />
              <ellipse cx="290" cy="186" rx="6" ry="1.5" fill="#D97706" opacity="0.7" />

              {/* Wooden Bottom Board / Landing Shelf */}
              <path d="M 262,192 Q 290,197 318,192 L 316,196 Q 290,201 264,196 Z" fill="#78350F" />
            </g>

            {/* Golden Honey Drop with Glisten Animation */}
            <g className="honey-drop-anim" transform="translate(290, 196)">
              <path
                d="M 0,0 C -3.5,4 -4.5,8 0,14 C 4.5,8 3.5,4 0,0 Z"
                fill="url(#honeyDropGrad)"
                stroke="#B45309"
                strokeWidth="0.5"
                filter={honeyGlow ? "url(#honeyGlowFilter)" : undefined}
              />
              <ellipse cx="-1" cy="7" rx="1.5" ry="3" fill="#FEF3C7" opacity="0.8" />
            </g>
          </g>

          {/* SECOND APIARY HIVE: MODERN WOODEN LANGSTROTH HIVE ON GRASS */}
          <g transform="translate(680, 240)">
            {/* Hive Stand Legs */}
            <rect x="15" y="65" width="6" height="25" fill="#451A03" rx="1" />
            <rect x="75" y="65" width="6" height="25" fill="#451A03" rx="1" />
            <rect x="8" y="60" width="80" height="8" fill="#582909" rx="2" />

            {/* Brood Box (Bottom Chamber) */}
            <rect x="14" y="24" width="68" height="38" fill="url(#woodenHiveGrad)" stroke="#78350F" strokeWidth="1.2" rx="3" />
            {/* Box Joint Handles */}
            <rect x="36" y="38" width="24" height="6" fill="#78350F" rx="2" opacity="0.8" />
            <path d="M 14,34 L 82,34" stroke="#92400E" strokeWidth="0.8" opacity="0.6" />

            {/* Honey Super (Upper Chamber) */}
            <rect x="14" y="-8" width="68" height="30" fill="url(#woodenHiveGrad)" stroke="#78350F" strokeWidth="1.2" rx="3" />
            <rect x="36" y="4" width="24" height="5" fill="#78350F" rx="2" opacity="0.8" />

            {/* Telescoping Metal / Wood Outer Cover Roof */}
            <path d="M 10,-12 L 86,-12 L 84,-6 L 12,-6 Z" fill="#92400E" stroke="#582909" strokeWidth="1" />
            <path d="M 8,-14 L 88,-14 L 87,-11 L 9,-11 Z" fill="#F59E0B" opacity="0.9" />

            {/* Entrance Reducer & Flight Landing Board */}
            <path d="M 10,61 L 86,61 L 82,65 L 14,65 Z" fill="#78350F" />
            <rect x="32" y="58" width="32" height="3" fill="#1C1917" rx="1" />

            {/* BeeGuard Hive Marker Emblem */}
            <g transform="translate(48, -1)">
              <circle cx="0" cy="0" r="4.5" fill="#FFFFFF" stroke="#D97706" strokeWidth="0.8" />
              <text x="0" y="2.2" fontSize="5" textAnchor="middle" fill="#B45309" fontWeight="bold">01</text>
            </g>
          </g>

          {/* WILDFLOWERS ON THE MEADOW */}
          <g>
            {/* Clover 1 */}
            <g transform="translate(480, 325)">
              <path d="M 0,0 Q 2,-12 4,-18" stroke="#047857" strokeWidth="1.5" fill="none" />
              <circle cx="4" cy="-21" r="5" fill="#F43F5E" opacity="0.9" />
              <circle cx="6" cy="-24" r="4" fill="#FB7185" />
            </g>

            {/* Goldenrod / Dandelion */}
            <g transform="translate(560, 320)">
              <path d="M 0,0 Q -3,-10 -2,-22" stroke="#047857" strokeWidth="1.5" fill="none" />
              <circle cx="-2" cy="-24" r="6" fill="#FBBF24" />
              <circle cx="-2" cy="-24" r="3.5" fill="#F59E0B" />
            </g>

            {/* Lavender Spike */}
            <g transform="translate(630, 328)">
              <path d="M 0,0 Q 3,-14 2,-25" stroke="#047857" strokeWidth="1.5" fill="none" />
              <ellipse cx="2" cy="-25" rx="3" ry="7" fill="#8B5CF6" />
              <ellipse cx="2" cy="-23" rx="3.5" ry="4" fill="#A78BFA" />
            </g>

            {/* White Clover 2 */}
            <g transform="translate(790, 315)">
              <path d="M 0,0 Q -2,-12 1,-20" stroke="#047857" strokeWidth="1.5" fill="none" />
              <circle cx="1" cy="-22" r="5" fill="#FFFFFF" />
              <circle cx="1" cy="-22" r="2.5" fill="#FCD34D" />
            </g>
          </g>

          {/* FLOATING POLLEN DUST & SUN SPARKLES */}
          <g fill="#FBBF24" opacity="0.6">
            <circle cx="250" cy="140" r="1.8" className="pollen-particle" />
            <circle cx="380" cy="110" r="1.5" className="pollen-particle" style={{ animationDelay: '1s' }} />
            <circle cx="460" cy="180" r="2" className="pollen-particle" style={{ animationDelay: '2s' }} />
            <circle cx="620" cy="150" r="1.5" className="pollen-particle" style={{ animationDelay: '1.5s' }} />
            <circle cx="750" cy="190" r="2" className="pollen-particle" style={{ animationDelay: '0.5s' }} />
            <circle cx="320" cy="220" r="1.8" className="pollen-particle" style={{ animationDelay: '2.5s' }} />
          </g>

          {/* ========================================================= */}
          {/* ANIMATED FLYING BEES ("BEE FLING") WITH FLUTTERING WINGS */}
          {/* ========================================================= */}

          {/* BEE 1: SCOUT FORAGER FLYING ACROSS UPPER MEADOW */}
          <g className="bee-1" transform="translate(360, 150)">
            <g transform="scale(0.85)">
              {/* Fluttering Left Wing */}
              <ellipse cx="9" cy="4" rx="7" ry="11" fill="#E0F2FE" stroke="#93C5FD" strokeWidth="0.8" opacity="0.8" className="wing-l" />
              {/* Fluttering Right Wing */}
              <ellipse cx="15" cy="4" rx="6" ry="10" fill="#E0F2FE" stroke="#93C5FD" strokeWidth="0.8" opacity="0.8" className="wing-r" />

              {/* Bee Body (Striped Abdomen) */}
              <ellipse cx="12" cy="14" rx="7.5" ry="10.5" fill="#F59E0B" />
              {/* Dark Stripes */}
              <path d="M 5,11 Q 12,13 19,11" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M 5,15 Q 12,17 19,15" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M 6.5,19 Q 12,21 17.5,19" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />

              {/* Stinger */}
              <polygon points="12,24.5 10.5,27.5 13.5,27.5" fill="#0F172A" transform="rotate(180 12 26)" />

              {/* Bee Head */}
              <circle cx="12" cy="6" r="5" fill="#1E293B" />
              {/* Cute Shiny Eyes */}
              <circle cx="10" cy="5" r="1.3" fill="#FFFFFF" />
              <circle cx="14" cy="5" r="1.3" fill="#FFFFFF" />

              {/* Antennae */}
              <path d="M 10,2 Q 8,-3 6,-4" stroke="#1E293B" strokeWidth="1" strokeLinecap="round" fill="none" />
              <circle cx="6" cy="-4" r="0.8" fill="#1E293B" />
              <path d="M 14,2 Q 16,-3 18,-4" stroke="#1E293B" strokeWidth="1" strokeLinecap="round" fill="none" />
              <circle cx="18" cy="-4" r="0.8" fill="#1E293B" />

              {/* Golden Pollen Baskets on Legs */}
              <circle cx="5" cy="16" r="1.8" fill="#FBBF24" />
              <circle cx="19" cy="16" r="1.8" fill="#FBBF24" />
            </g>
          </g>

          {/* BEE 2: RETURNING TO HANGING SKEP HIVE */}
          <g className="bee-2" transform="translate(540, 190)">
            <g transform="scale(0.8) scaleX(-1)">
              <ellipse cx="9" cy="4" rx="7" ry="11" fill="#E0F2FE" stroke="#93C5FD" strokeWidth="0.8" opacity="0.8" className="wing-l" />
              <ellipse cx="15" cy="4" rx="6" ry="10" fill="#E0F2FE" stroke="#93C5FD" strokeWidth="0.8" opacity="0.8" className="wing-r" />

              <ellipse cx="12" cy="14" rx="7.5" ry="10.5" fill="#F59E0B" />
              <path d="M 5,11 Q 12,13 19,11" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M 5,15 Q 12,17 19,15" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M 6.5,19 Q 12,21 17.5,19" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
              <polygon points="12,24.5 10.5,27.5 13.5,27.5" fill="#0F172A" transform="rotate(180 12 26)" />

              <circle cx="12" cy="6" r="5" fill="#1E293B" />
              <circle cx="10" cy="5" r="1.3" fill="#FFFFFF" />
              <circle cx="14" cy="5" r="1.3" fill="#FFFFFF" />

              <path d="M 10,2 Q 8,-3 6,-4" stroke="#1E293B" strokeWidth="1" strokeLinecap="round" fill="none" />
              <path d="M 14,2 Q 16,-3 18,-4" stroke="#1E293B" strokeWidth="1" strokeLinecap="round" fill="none" />

              <circle cx="5" cy="16" r="2" fill="#FBBF24" />
              <circle cx="19" cy="16" r="2" fill="#FBBF24" />
            </g>
          </g>

          {/* BEE 3: HOVERING NEAR TREE BLOSSOMS */}
          <g className="bee-3" transform="translate(260, 90)">
            <g transform="scale(0.7) rotate(20)">
              <ellipse cx="9" cy="4" rx="7" ry="11" fill="#E0F2FE" stroke="#93C5FD" strokeWidth="0.8" opacity="0.85" className="wing-l" />
              <ellipse cx="15" cy="4" rx="6" ry="10" fill="#E0F2FE" stroke="#93C5FD" strokeWidth="0.8" opacity="0.85" className="wing-r" />

              <ellipse cx="12" cy="14" rx="7.5" ry="10.5" fill="#FBBF24" />
              <path d="M 5,11 Q 12,13 19,11" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M 5,15 Q 12,17 19,15" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M 6.5,19 Q 12,21 17.5,19" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />

              <circle cx="12" cy="6" r="5" fill="#1E293B" />
              <circle cx="10" cy="5" r="1.3" fill="#FFFFFF" />
              <circle cx="14" cy="5" r="1.3" fill="#FFFFFF" />

              <path d="M 10,2 Q 8,-3 6,-4" stroke="#1E293B" strokeWidth="1" strokeLinecap="round" fill="none" />
              <path d="M 14,2 Q 16,-3 18,-4" stroke="#1E293B" strokeWidth="1" strokeLinecap="round" fill="none" />
            </g>
          </g>

          {/* BEE 4: FORAGING OVER GROUND MEADOW FLOWERS */}
          {beeCount >= 4 && (
            <g className="bee-4" transform="translate(730, 210)">
              <g transform="scale(0.75) rotate(-15)">
                <ellipse cx="9" cy="4" rx="7" ry="11" fill="#E0F2FE" stroke="#93C5FD" strokeWidth="0.8" opacity="0.8" className="wing-l" />
                <ellipse cx="15" cy="4" rx="6" ry="10" fill="#E0F2FE" stroke="#93C5FD" strokeWidth="0.8" opacity="0.8" className="wing-r" />

                <ellipse cx="12" cy="14" rx="7.5" ry="10.5" fill="#F59E0B" />
                <path d="M 5,11 Q 12,13 19,11" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M 5,15 Q 12,17 19,15" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M 6.5,19 Q 12,21 17.5,19" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />

                <circle cx="12" cy="6" r="5" fill="#1E293B" />
                <circle cx="10" cy="5" r="1.3" fill="#FFFFFF" />
                <circle cx="14" cy="5" r="1.3" fill="#FFFFFF" />

                <path d="M 10,2 Q 8,-3 6,-4" stroke="#1E293B" strokeWidth="1" strokeLinecap="round" fill="none" />
                <path d="M 14,2 Q 16,-3 18,-4" stroke="#1E293B" strokeWidth="1" strokeLinecap="round" fill="none" />

                <circle cx="5" cy="16" r="1.8" fill="#FBBF24" />
                <circle cx="19" cy="16" r="1.8" fill="#FBBF24" />
              </g>
            </g>
          )}

          {/* OPTIONAL BEE 5: HOVERING NEAR WOODEN HIVE */}
          {beeCount >= 5 && (
            <g className="bee-1" transform="translate(660, 270)">
              <g transform="scale(0.65) rotate(10)">
                <ellipse cx="9" cy="4" rx="7" ry="11" fill="#E0F2FE" stroke="#93C5FD" strokeWidth="0.8" opacity="0.8" className="wing-l" />
                <ellipse cx="15" cy="4" rx="6" ry="10" fill="#E0F2FE" stroke="#93C5FD" strokeWidth="0.8" opacity="0.8" className="wing-r" />

                <ellipse cx="12" cy="14" rx="7.5" ry="10.5" fill="#F59E0B" />
                <path d="M 5,11 Q 12,13 19,11" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M 5,15 Q 12,17 19,15" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />

                <circle cx="12" cy="6" r="5" fill="#1E293B" />
                <circle cx="10" cy="5" r="1.2" fill="#FFFFFF" />
                <circle cx="14" cy="5" r="1.2" fill="#FFFFFF" />
              </g>
            </g>
          )}

          {/* OPTIONAL BEE 6: NURSE BEE EXITING SKEP HIVE */}
          {beeCount >= 6 && (
            <g className="bee-3" transform="translate(305, 175)">
              <g transform="scale(0.6) rotate(-25)">
                <ellipse cx="9" cy="4" rx="7" ry="11" fill="#E0F2FE" stroke="#93C5FD" strokeWidth="0.8" opacity="0.8" className="wing-l" />
                <ellipse cx="15" cy="4" rx="6" ry="10" fill="#E0F2FE" stroke="#93C5FD" strokeWidth="0.8" opacity="0.8" className="wing-r" />

                <ellipse cx="12" cy="14" rx="7.5" ry="10.5" fill="#FBBF24" />
                <path d="M 5,11 Q 12,13 19,11" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M 5,15 Q 12,17 19,15" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />

                <circle cx="12" cy="6" r="5" fill="#1E293B" />
                <circle cx="10" cy="5" r="1.2" fill="#FFFFFF" />
                <circle cx="14" cy="5" r="1.2" fill="#FFFFFF" />
              </g>
            </g>
          )}

        </svg>
      </div>

      {/* Atmospheric Micro-Badges at Bottom of Canvas */}
      <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-amber-900/80 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-semibold">
            🌳 <span>Blooming Canopy</span>
          </span>
          <span className="text-amber-300">•</span>
          <span className="flex items-center gap-1 font-semibold">
            🍯 <span>Honey Skep & Box Hive</span>
          </span>
          <span className="text-amber-300">•</span>
          <span className="flex items-center gap-1 font-semibold">
            🐝 <span>Active Foraging Swarm</span>
          </span>
        </div>

        <div className="text-[10px] text-slate-500 font-mono">
          GPU SVG Motion • Continuous Wing Flutter
        </div>
      </div>

    </div>
  );
};
