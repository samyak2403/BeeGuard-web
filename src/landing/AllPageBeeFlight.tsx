import React from 'react';

/**
 * AllPageBeeFlight
 * Renders ambient flying bees ("bee fling") across the entire landing page
 * without any card container or boundaries ("wiotu card").
 * Fully transparent, pointer-events-none, hardware-accelerated SVG animations.
 */
export const AllPageBeeFlight: React.FC = () => {
  return (
    <div 
      aria-hidden="true" 
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden select-none"
    >
      <style>{`
        @keyframes pageWingFlutterLeft {
          0%, 100% { transform: rotate(0deg) scaleY(1); }
          50% { transform: rotate(-35deg) scaleY(0.3); }
        }
        @keyframes pageWingFlutterRight {
          0%, 100% { transform: rotate(0deg) scaleY(1); }
          50% { transform: rotate(35deg) scaleY(0.3); }
        }

        /* Flight trajectory 1: Glides across top & center of screen */
        @keyframes pageBeeFlight1 {
          0% {
            transform: translate(-60px, 120px) rotate(15deg);
            opacity: 0;
          }
          5% { opacity: 0.95; }
          25% {
            transform: translate(28vw, 180px) rotate(-8deg);
          }
          50% {
            transform: translate(58vw, 90px) rotate(12deg);
          }
          75% {
            transform: translate(82vw, 220px) rotate(-5deg);
          }
          95% { opacity: 0.95; }
          100% {
            transform: translate(105vw, 140px) rotate(10deg);
            opacity: 0;
          }
        }

        /* Flight trajectory 2: Gentle figure-8 flight on right side */
        @keyframes pageBeeFlight2 {
          0% {
            transform: translate(calc(100vw + 60px), 320px) scaleX(-1) rotate(0deg);
            opacity: 0;
          }
          5% { opacity: 0.9; }
          30% {
            transform: translate(calc(100vw - 180px), 420px) scaleX(-1) rotate(-15deg);
          }
          60% {
            transform: translate(calc(100vw - 280px), 260px) scaleX(-1) rotate(10deg);
          }
          85% {
            transform: translate(calc(100vw - 120px), 360px) scaleX(-1) rotate(-8deg);
          }
          95% { opacity: 0.9; }
          100% {
            transform: translate(calc(100vw + 60px), 320px) scaleX(-1) rotate(0deg);
            opacity: 0;
          }
        }

        /* Flight trajectory 3: Lower ambient pollinator crossing screen */
        @keyframes pageBeeFlight3 {
          0% {
            transform: translate(-50px, 65vh) rotate(10deg);
            opacity: 0;
          }
          5% { opacity: 0.85; }
          35% {
            transform: translate(35vw, calc(65vh - 70px)) rotate(-12deg);
          }
          70% {
            transform: translate(70vw, calc(65vh + 50px)) rotate(8deg);
          }
          95% { opacity: 0.85; }
          100% {
            transform: translate(105vw, 65vh) rotate(5deg);
            opacity: 0;
          }
        }

        /* Trajectory 4: Small scout bee dipping near middle-left */
        @keyframes pageBeeFlight4 {
          0% {
            transform: translate(15vw, 45vh) rotate(0deg);
            opacity: 0.8;
          }
          25% {
            transform: translate(calc(15vw + 70px), calc(45vh - 40px)) rotate(18deg);
          }
          50% {
            transform: translate(calc(15vw + 120px), calc(45vh + 25px)) rotate(-15deg);
          }
          75% {
            transform: translate(calc(15vw + 40px), calc(45vh + 50px)) rotate(10deg);
          }
          100% {
            transform: translate(15vw, 45vh) rotate(0deg);
            opacity: 0.8;
          }
        }

        .page-wing-l {
          transform-origin: 9px 4px;
          animation: pageWingFlutterLeft 0.08s ease-in-out infinite;
        }
        .page-wing-r {
          transform-origin: 15px 4px;
          animation: pageWingFlutterRight 0.08s ease-in-out infinite;
        }

        .ambient-bee-1 {
          animation: pageBeeFlight1 22s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
        }
        .ambient-bee-2 {
          animation: pageBeeFlight2 18s ease-in-out infinite;
          animation-delay: 4s;
        }
        .ambient-bee-3 {
          animation: pageBeeFlight3 26s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          animation-delay: 9s;
        }
        .ambient-bee-4 {
          animation: pageBeeFlight4 14s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>

      {/* FLYING BEE 1: Upper Sky Forager */}
      <div className="absolute top-0 left-0 ambient-bee-1">
        <svg width="34" height="34" viewBox="0 0 32 32" className="drop-shadow-sm">
          {/* Wings */}
          <ellipse cx="9" cy="4" rx="7" ry="11" fill="#E0F2FE" stroke="#93C5FD" strokeWidth="0.8" opacity="0.85" className="page-wing-l" />
          <ellipse cx="15" cy="4" rx="6" ry="10" fill="#E0F2FE" stroke="#93C5FD" strokeWidth="0.8" opacity="0.85" className="page-wing-r" />

          {/* Abdomen */}
          <ellipse cx="12" cy="14" rx="7.5" ry="10.5" fill="#F59E0B" />
          <path d="M 5,11 Q 12,13 19,11" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M 5,15 Q 12,17 19,15" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M 6.5,19 Q 12,21 17.5,19" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />

          {/* Stinger */}
          <polygon points="12,24.5 10.5,27.5 13.5,27.5" fill="#0F172A" transform="rotate(180 12 26)" />

          {/* Head & Eyes */}
          <circle cx="12" cy="6" r="5" fill="#1E293B" />
          <circle cx="10" cy="5" r="1.3" fill="#FFFFFF" />
          <circle cx="14" cy="5" r="1.3" fill="#FFFFFF" />

          {/* Antennae */}
          <path d="M 10,2 Q 8,-3 6,-4" stroke="#1E293B" strokeWidth="1" strokeLinecap="round" fill="none" />
          <path d="M 14,2 Q 16,-3 18,-4" stroke="#1E293B" strokeWidth="1" strokeLinecap="round" fill="none" />

          {/* Pollen Baskets */}
          <circle cx="5" cy="16" r="1.8" fill="#FBBF24" />
          <circle cx="19" cy="16" r="1.8" fill="#FBBF24" />
        </svg>
      </div>

      {/* FLYING BEE 2: Right Margin Sentinel */}
      <div className="absolute top-0 left-0 ambient-bee-2">
        <svg width="30" height="30" viewBox="0 0 32 32" className="drop-shadow-sm">
          <ellipse cx="9" cy="4" rx="7" ry="11" fill="#E0F2FE" stroke="#93C5FD" strokeWidth="0.8" opacity="0.85" className="page-wing-l" />
          <ellipse cx="15" cy="4" rx="6" ry="10" fill="#E0F2FE" stroke="#93C5FD" strokeWidth="0.8" opacity="0.85" className="page-wing-r" />

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
        </svg>
      </div>

      {/* FLYING BEE 3: Mid-page Crosser */}
      <div className="absolute top-0 left-0 ambient-bee-3">
        <svg width="26" height="26" viewBox="0 0 32 32" className="drop-shadow-sm">
          <ellipse cx="9" cy="4" rx="7" ry="11" fill="#E0F2FE" stroke="#93C5FD" strokeWidth="0.8" opacity="0.85" className="page-wing-l" />
          <ellipse cx="15" cy="4" rx="6" ry="10" fill="#E0F2FE" stroke="#93C5FD" strokeWidth="0.8" opacity="0.85" className="page-wing-r" />

          <ellipse cx="12" cy="14" rx="7.5" ry="10.5" fill="#FBBF24" />
          <path d="M 5,11 Q 12,13 19,11" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M 5,15 Q 12,17 19,15" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M 6.5,19 Q 12,21 17.5,19" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />

          <circle cx="12" cy="6" r="5" fill="#1E293B" />
          <circle cx="10" cy="5" r="1.3" fill="#FFFFFF" />
          <circle cx="14" cy="5" r="1.3" fill="#FFFFFF" />

          <path d="M 10,2 Q 8,-3 6,-4" stroke="#1E293B" strokeWidth="1" strokeLinecap="round" fill="none" />
          <path d="M 14,2 Q 16,-3 18,-4" stroke="#1E293B" strokeWidth="1" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      {/* FLYING BEE 4: Playful Scout Looper */}
      <div className="absolute top-0 left-0 ambient-bee-4">
        <svg width="24" height="24" viewBox="0 0 32 32" className="drop-shadow-sm">
          <ellipse cx="9" cy="4" rx="7" ry="11" fill="#E0F2FE" stroke="#93C5FD" strokeWidth="0.8" opacity="0.8" className="page-wing-l" />
          <ellipse cx="15" cy="4" rx="6" ry="10" fill="#E0F2FE" stroke="#93C5FD" strokeWidth="0.8" opacity="0.8" className="page-wing-r" />

          <ellipse cx="12" cy="14" rx="7.5" ry="10.5" fill="#F59E0B" />
          <path d="M 5,11 Q 12,13 19,11" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M 5,15 Q 12,17 19,15" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />

          <circle cx="12" cy="6" r="5" fill="#1E293B" />
          <circle cx="10" cy="5" r="1.3" fill="#FFFFFF" />
          <circle cx="14" cy="5" r="1.3" fill="#FFFFFF" />
        </svg>
      </div>

    </div>
  );
};

