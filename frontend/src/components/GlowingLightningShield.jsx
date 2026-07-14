import React from 'react';

export default function GlowingLightningShield({ className = "w-24 h-24", showGlow = true }) {
  return (
    <div className={`relative ${className} shrink-0 flex items-center justify-center`}>
      {/* Background Glow Mesh */}
      {showGlow && (
        <div className="absolute inset-0 bg-[#ef4444]/15 rounded-full blur-2xl group-hover:bg-[#ef4444]/30 transition-colors duration-500"></div>
      )}

      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full ${showGlow ? 'drop-shadow-[0_0_15px_rgba(239,68,68,0.35)]' : ''}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Neon Glow Filter */}
          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Highlight Shimmer Gradient */}
          <linearGradient id="shield-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="35%" stopColor="#f43f5e" />
            <stop offset="70%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>

          {/* Lightning Bolt Fill Gradient */}
          <linearGradient id="zap-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>
        </defs>

        {/* 1. Base Static Shield Path (subtle protective outline) */}
        <path
          d="M50 12 C58 12 77 15 82 24 C82 45 74 68 50 86 C26 68 18 45 18 24 C23 15 42 12 50 12 Z"
          stroke="#ef4444"
          strokeWidth="3.5"
          strokeOpacity="0.45"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 2. Lightning Bolt Group (floating animation) */}
        <g className="animate-bounce-slow" style={{ transformOrigin: 'center' }}>
          {/* Base lightning stroke for backdrop */}
          <path
            d="M55 24 L35 50 H48 L43 76 L65 44 H52 Z"
            stroke="rgba(239, 68, 68, 0.25)"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Animated Tracing Lightning Bolt Outline */}
          <path
            d="M55 24 L35 50 H48 L43 76 L65 44 H52 Z"
            stroke="url(#shield-grad)"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
            pathLength="100"
            className="animate-bolt-trace"
            filter="url(#neon-glow)"
            style={{
              strokeDasharray: "25 75", // Traveling light outline effect
            }}
          />
        </g>
      </svg>
    </div>
  );
}
