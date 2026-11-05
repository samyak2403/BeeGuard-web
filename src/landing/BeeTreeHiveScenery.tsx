import React from 'react';

/**
 * BeeTreeHiveScenery
 * Pure organic scenery featuring the majestic tree with lush canopy, blossoms,
 * hanging woven skep beehive with glistening honey drop, and meadow wildflowers.
 * Rendered WITHOUT ANY CARD, borders, or container boxes ("wiotu card").
 * Fully transparent, responsive, hardware-accelerated SVG.
 */
export const BeeTreeHiveScenery: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div 
      aria-hidden="true" 
      className={`pointer-events-none select-none w-full overflow-hidden ${className}`}
    >
      <style>{`
        @keyframes treeBranchSway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(0.8deg); }
        }
        @keyframes skepHiveSway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-1.8deg); }
        }
        @keyframes honeyDripFlow {
          0%, 100% { transform: scale(1) translateY(0); opacity: 0.85; }
          50% { transform: scale(1.18) translateY(3px); opacity: 1; }
          75% { transform: scale(0.9) translateY(6px); opacity: 0.5; }
        }
        @keyframes sceneryWingFlutterL {
          0%, 100% { transform: rotate(0deg) scaleY(1); }
          50% { transform: rotate(-35deg) scaleY(0.3); }
        }
        @keyframes sceneryWingFlutterR {
          0%, 100% { transform: rotate(0deg) scaleY(1); }
          50% { transform: rotate(35deg) scaleY(0.3); }
        }
        @keyframes sceneryBeeLoop1 {
          0% { transform: translate(0px, 0px) rotate(0deg); }
          25% { transform: translate(140px, -40px) rotate(12deg); }
          50% { transform: translate(280px, 20px) rotate(-8deg); }
          75% { transform: translate(160px, 50px) rotate(6deg); }
          100% { transform: translate(0px, 0px) rotate(0deg); }
        }
        @keyframes sceneryBeeLoop2 {
          0% { transform: translate(0px, 0px) rotate(0deg); }
          35% { transform: translate(-120px, 35px) rotate(-15deg); }
          70% { transform: translate(-220px, -20px) rotate(10deg); }
          100% { transform: translate(0px, 0px) rotate(0deg); }
        }
        @keyframes sceneryPollenGlow {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 0.85; transform: translateY(-8px); }
        }

        .scenery-tree {
          transform-origin: 100px 380px;
          animation: treeBranchSway 8s ease-in-out infinite;
        }
        .scenery-skep {
          transform-origin: 290px 95px;
          animation: skepHiveSway 5.5s ease-in-out infinite;
        }
        .scenery-honey-drip {
          animation: honeyDripFlow 4.5s ease-in-out infinite;
        }
        .scenery-wing-l {
          transform-origin: 9px 4px;
          animation: sceneryWingFlutterL 0.08s ease-in-out infinite;
        }
        .scenery-wing-r {
          transform-origin: 15px 4px;
          animation: sceneryWingFlutterR 0.08s ease-in-out infinite;
        }
        .scenery-bee-1 {
          animation: sceneryBeeLoop1 14s ease-in-out infinite;
        }
        .scenery-bee-2 {
          animation: sceneryBeeLoop2 16s ease-in-out infinite;
        }
      `}</style>

      <svg
        viewBox="0 0 1000 360"
        className="w-full h-auto max-h-[380px]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          <linearGradient id="unboxedTrunkGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#451A03" />
            <stop offset="40%" stopColor="#78350F" />
            <stop offset="70%" stopColor="#92400E" />
            <stop offset="100%" stopColor="#3E1A04" />
          </linearGradient>

          <linearGradient id="unboxedLeaf1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          <linearGradient id="unboxedLeaf2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          <linearGradient id="unboxedLeaf3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          <linearGradient id="unboxedSkepGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="30%" stopColor="#F59E0B" />
            <stop offset="75%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>

          <linearGradient id="unboxedHoneyDrop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          <linearGradient id="unboxedGrassGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.6" />
          </linearGradient>

          <pattern id="unboxedHex" width="16" height="28" patternUnits="userSpaceOnUse" patternTransform="scale(0.8)">
            <path
              d="M8 0 L16 4.6 L16 13.8 L8 18.5 L0 13.8 L0 4.6 Z M8 18.5 L16 23.1 L16 32.3 L8 37 L0 32.3 L0 23.1 Z"
              fill="none"
              stroke="#D97706"
              strokeWidth="0.8"
              strokeOpacity="0.3"
            />
          </pattern>
        </defs>

        {/* Golden Dotted Flight Trails (Seamless in Landscape) */}
        <g opacity="0.3" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 4" fill="none">
          <path d="M 290,175 Q 420,110 560,150 T 780,130 Q 880,180 820,240 T 600,230 Q 420,270 290,190" />
          <path d="M 310,180 C 230,140 190,80 250,50 C 310,20 390,70 310,180" />
          <path d="M 680,260 Q 760,200 850,230 T 940,280" />
        </g>

        {/* Soft Meadow Rolling Grass Waves (Bottom Blend) */}
        <path
          d="M 0,330 Q 250,295 500,325 T 1000,305 L 1000,360 L 0,360 Z"
          fill="url(#unboxedGrassGrad)"
          opacity="0.35"
        />

        {/* THE MAJESTIC TREE & BRANCHES (WITHOUT CARD) */}
        <g className="scenery-tree">
          {/* Main Trunk rising on the left */}
          <path
            d="M 50,360 C 60,300 70,240 90,200 C 105,170 130,140 150,120 C 165,105 200,95 285,85 C 330,78 390,80 440,90 C 385,105 330,105 285,108 C 240,112 210,125 185,150 C 165,170 145,210 140,260 C 135,300 138,330 145,360 Z"
            fill="url(#unboxedTrunkGrad)"
          />

          {/* Left Upper Branch */}
          <path
            d="M 120,175 C 90,150 55,135 15,130 C 48,142 80,160 105,185 Z"
            fill="url(#unboxedTrunkGrad)"
          />

          {/* Top Branch reaching overhead */}
          <path
            d="M 175,135 C 185,95 205,65 235,35 C 220,60 200,95 190,130 Z"
            fill="url(#unboxedTrunkGrad)"
          />

          {/* Bark Ridges */}
          <g stroke="#2D1102" strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
            <path d="M 75,340 C 85,290 92,240 110,205" />
            <path d="M 105,350 C 112,310 115,270 130,230" />
            <path d="M 170,125 C 210,110 250,100 300,93" />
          </g>

          {/* Layer 1: Emerald Foliage Clustered Canopy */}
          <g fill="url(#unboxedLeaf2)" opacity="0.95">
            <circle cx="150" cy="75" r="48" />
            <circle cx="210" cy="50" r="52" />
            <circle cx="270" cy="55" r="45" />
            <circle cx="95" cy="115" r="42" />
            <circle cx="45" cy="120" r="38" />
            <circle cx="350" cy="65" r="40" />
            <circle cx="410" cy="80" r="32" />
          </g>

          {/* Layer 2: Main Fresh Green Leaves */}
          <g fill="url(#unboxedLeaf1)">
            <circle cx="130" cy="65" r="44" />
            <circle cx="185" cy="40" r="48" />
            <circle cx="245" cy="42" r="46" />
            <circle cx="305" cy="55" r="42" />
            <circle cx="75" cy="100" r="38" />
            <circle cx="30" cy="110" r="32" />
            <circle cx="380" cy="70" r="30" />
          </g>

          {/* Layer 3: Sunlit Lime Highlights */}
          <g fill="url(#unboxedLeaf3)">
            <circle cx="160" cy="50" r="28" />
            <circle cx="220" cy="30" r="30" />
            <circle cx="280" cy="38" r="26" />
            <circle cx="60" cy="85" r="22" />
            <circle cx="330" cy="50" r="22" />
          </g>

          {/* Blossoming Apple & Clover Flowers */}
          <g>
            <g transform="translate(60, 110)">
              <circle cx="-4" cy="0" r="3.5" fill="#FFFFFF" />
              <circle cx="4" cy="0" r="3.5" fill="#FFFFFF" />
              <circle cx="0" cy="-4" r="3.5" fill="#FFFFFF" />
              <circle cx="0" cy="4" r="3.5" fill="#FFFFFF" />
              <circle cx="0" cy="0" r="2" fill="#F59E0B" />
            </g>

            <g transform="translate(200, 25)">
              <circle cx="-4.5" cy="0" r="4" fill="#FFF1F2" />
              <circle cx="4.5" cy="0" r="4" fill="#FFF1F2" />
              <circle cx="0" cy="-4.5" r="4" fill="#FFF1F2" />
              <circle cx="0" cy="4.5" r="4" fill="#FFF1F2" />
              <circle cx="0" cy="0" r="2.5" fill="#F59E0B" />
            </g>

            <g transform="translate(340, 75)">
              <circle cx="-4" cy="0" r="3.5" fill="#FFFFFF" />
              <circle cx="4" cy="0" r="3.5" fill="#FFFFFF" />
              <circle cx="0" cy="-4" r="3.5" fill="#FFFFFF" />
              <circle cx="0" cy="4" r="3.5" fill="#FFFFFF" />
              <circle cx="0" cy="0" r="2" fill="#F59E0B" />
            </g>

            <g transform="translate(125, 95)">
              <circle cx="-4" cy="0" r="3.5" fill="#FFF1F2" />
              <circle cx="4" cy="0" r="3.5" fill="#FFF1F2" />
              <circle cx="0" cy="-4" r="3.5" fill="#FFF1F2" />
              <circle cx="0" cy="4" r="3.5" fill="#FFF1F2" />
              <circle cx="0" cy="0" r="2" fill="#F59E0B" />
            </g>
          </g>
        </g>

        {/* THE HANGING SKEP BEEHIVE (ORGANIC & UNBOXED) */}
        <g className="scenery-skep">
          {/* Hemp Rope from Branch */}
          <path
            d="M 285,85 L 285,118"
            stroke="#78350F"
            strokeWidth="3"
            strokeDasharray="2 1"
            strokeLinecap="round"
          />
          <ellipse cx="285" cy="87" rx="4" ry="2" fill="#92400E" />
          <ellipse cx="285" cy="117" rx="5" ry="2.5" fill="#92400E" />

          {/* Skep Body */}
          <g>
            <ellipse cx="285" cy="122" rx="14" ry="7" fill="url(#unboxedSkepGrad)" stroke="#B45309" strokeWidth="1" />
            <ellipse cx="285" cy="132" rx="22" ry="9" fill="url(#unboxedSkepGrad)" stroke="#B45309" strokeWidth="1.2" />
            <ellipse cx="285" cy="144" rx="28" ry="11" fill="url(#unboxedSkepGrad)" stroke="#B45309" strokeWidth="1.2" />
            <ellipse cx="285" cy="158" rx="33" ry="12" fill="url(#unboxedSkepGrad)" stroke="#B45309" strokeWidth="1.2" />
            <ellipse cx="285" cy="172" rx="35" ry="13" fill="url(#unboxedSkepGrad)" stroke="#B45309" strokeWidth="1.2" />
            <ellipse cx="285" cy="186" rx="34" ry="12" fill="url(#unboxedSkepGrad)" stroke="#B45309" strokeWidth="1.2" />

            {/* Honeycomb Texture */}
            <ellipse cx="285" cy="155" rx="32" ry="32" fill="url(#unboxedHex)" opacity="0.6" />

            {/* Hive Entrance Hole */}
            <ellipse cx="285" cy="182" rx="8" ry="7" fill="#1C1917" />
            <path d="M 277,182 Q 285,177 293,182 L 293,187 Q 285,189 277,187 Z" fill="#0C0A09" />
            <ellipse cx="285" cy="186" rx="6" ry="1.5" fill="#D97706" opacity="0.7" />

            {/* Wooden Base Board */}
            <path d="M 257,192 Q 285,197 313,192 L 311,196 Q 285,201 259,196 Z" fill="#78350F" />
          </g>

          {/* Glistening Golden Honey Drop */}
          <g className="scenery-honey-drip" transform="translate(285, 196)">
            <path
              d="M 0,0 C -3.5,4 -4.5,8 0,14 C 4.5,8 3.5,4 0,0 Z"
              fill="url(#unboxedHoneyDrop)"
              stroke="#B45309"
              strokeWidth="0.5"
            />
            <ellipse cx="-1" cy="7" rx="1.5" ry="3" fill="#FEF3C7" opacity="0.85" />
          </g>
        </g>

        {/* WOODEN LANGSTROTH HIVE ON MEADOW (RIGHT SIDE) */}
        <g transform="translate(740, 245)">
          <rect x="15" y="65" width="6" height="25" fill="#451A03" rx="1" />
          <rect x="75" y="65" width="6" height="25" fill="#451A03" rx="1" />
          <rect x="8" y="60" width="80" height="8" fill="#582909" rx="2" />

          {/* Brood Chamber */}
          <rect x="14" y="24" width="68" height="38" fill="url(#unboxedSkepGrad)" stroke="#78350F" strokeWidth="1.2" rx="3" />
          <rect x="36" y="38" width="24" height="6" fill="#78350F" rx="2" opacity="0.8" />

          {/* Honey Super */}
          <rect x="14" y="-8" width="68" height="30" fill="url(#unboxedSkepGrad)" stroke="#78350F" strokeWidth="1.2" rx="3" />
          <rect x="36" y="4" width="24" height="5" fill="#78350F" rx="2" opacity="0.8" />

          {/* Outer Cover Roof */}
          <path d="M 8,-14 L 88,-14 L 87,-11 L 9,-11 Z" fill="#F59E0B" opacity="0.9" />
          <path d="M 10,-12 L 86,-12 L 84,-6 L 12,-6 Z" fill="#92400E" stroke="#582909" strokeWidth="1" />

          {/* Entrance Reducer */}
          <path d="M 10,61 L 86,61 L 82,65 L 14,65 Z" fill="#78350F" />
          <rect x="32" y="58" width="32" height="3" fill="#1C1917" rx="1" />

          {/* Emblem */}
          <circle cx="48" cy="-1" r="4.5" fill="#FFFFFF" stroke="#D97706" strokeWidth="0.8" />
          <text x="48" y="1.2" fontSize="5" textAnchor="middle" fill="#B45309" fontWeight="bold">01</text>
        </g>

        {/* WILDFLOWERS (CLOVER, LAVENDER, GOLDENROD) */}
        <g>
          <g transform="translate(520, 325)">
            <path d="M 0,0 Q 2,-12 4,-18" stroke="#047857" strokeWidth="1.5" />
            <circle cx="4" cy="-21" r="5" fill="#F43F5E" opacity="0.9" />
          </g>

          <g transform="translate(610, 320)">
            <path d="M 0,0 Q -3,-10 -2,-22" stroke="#047857" strokeWidth="1.5" />
            <circle cx="-2" cy="-24" r="6" fill="#FBBF24" />
          </g>

          <g transform="translate(680, 328)">
            <path d="M 0,0 Q 3,-14 2,-25" stroke="#047857" strokeWidth="1.5" />
            <ellipse cx="2" cy="-25" rx="3" ry="7" fill="#8B5CF6" />
          </g>

          <g transform="translate(860, 315)">
            <path d="M 0,0 Q -2,-12 1,-20" stroke="#047857" strokeWidth="1.5" />
            <circle cx="1" cy="-22" r="5" fill="#FFFFFF" />
            <circle cx="1" cy="-22" r="2.5" fill="#FCD34D" />
          </g>
        </g>

        {/* DRIFTING GOLDEN POLLEN PARTICLES */}
        <g fill="#FBBF24" opacity="0.6">
          <circle cx="260" cy="140" r="1.8" className="scenery-honey-drip" />
          <circle cx="390" cy="110" r="1.5" style={{ animationDelay: '1s' }} className="scenery-honey-drip" />
          <circle cx="470" cy="180" r="2" style={{ animationDelay: '2s' }} className="scenery-honey-drip" />
          <circle cx="630" cy="150" r="1.5" style={{ animationDelay: '1.5s' }} className="scenery-honey-drip" />
        </g>

        {/* FLYING BEES INSIDE SCENERY ("BEE FLING") */}
        {/* Bee A: Flying between Tree Canopy and Skep */}
        <g className="scenery-bee-1" transform="translate(360, 150)">
          <g transform="scale(0.85)">
            <ellipse cx="9" cy="4" rx="7" ry="11" fill="#E0F2FE" stroke="#93C5FD" strokeWidth="0.8" opacity="0.85" className="scenery-wing-l" />
            <ellipse cx="15" cy="4" rx="6" ry="10" fill="#E0F2FE" stroke="#93C5FD" strokeWidth="0.8" opacity="0.85" className="scenery-wing-r" />

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

            <circle cx="5" cy="16" r="1.8" fill="#FBBF24" />
            <circle cx="19" cy="16" r="1.8" fill="#FBBF24" />
          </g>
        </g>

        {/* Bee B: Returning toward Skep Hive */}
        <g className="scenery-bee-2" transform="translate(560, 190)">
          <g transform="scale(0.8) scaleX(-1)">
            <ellipse cx="9" cy="4" rx="7" ry="11" fill="#E0F2FE" stroke="#93C5FD" strokeWidth="0.8" opacity="0.85" className="scenery-wing-l" />
            <ellipse cx="15" cy="4" rx="6" ry="10" fill="#E0F2FE" stroke="#93C5FD" strokeWidth="0.8" opacity="0.85" className="scenery-wing-r" />

            <ellipse cx="12" cy="14" rx="7.5" ry="10.5" fill="#F59E0B" />
            <path d="M 5,11 Q 12,13 19,11" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M 5,15 Q 12,17 19,15" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M 6.5,19 Q 12,21 17.5,19" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />

            <circle cx="12" cy="6" r="5" fill="#1E293B" />
            <circle cx="10" cy="5" r="1.3" fill="#FFFFFF" />
            <circle cx="14" cy="5" r="1.3" fill="#FFFFFF" />

            <circle cx="5" cy="16" r="1.8" fill="#FBBF24" />
            <circle cx="19" cy="16" r="1.8" fill="#FBBF24" />
          </g>
        </g>

        {/* Bee C: Hovering near Tree Canopy */}
        <g transform="translate(250, 95) scale(0.7) rotate(25)">
          <ellipse cx="9" cy="4" rx="7" ry="11" fill="#E0F2FE" stroke="#93C5FD" strokeWidth="0.8" opacity="0.85" className="scenery-wing-l" />
          <ellipse cx="15" cy="4" rx="6" ry="10" fill="#E0F2FE" stroke="#93C5FD" strokeWidth="0.8" opacity="0.85" className="scenery-wing-r" />
          <ellipse cx="12" cy="14" rx="7.5" ry="10.5" fill="#FBBF24" />
          <path d="M 5,11 Q 12,13 19,11" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M 5,15 Q 12,17 19,15" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="12" cy="6" r="5" fill="#1E293B" />
        </g>

      </svg>
    </div>
  );
};

