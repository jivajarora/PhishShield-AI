import React, { useId } from 'react';

export default function GlowingLightningShield({ className = "w-24 h-24", showGlow = true }) {
  // Generate a unique suffix for this component instance's SVG IDs to prevent conflicts in the DOM
  const uniqueId = useId().replace(/:/g, ''); // Remove colons to make it a valid SVG ID token
  const redGlowId = `red-glow-${uniqueId}`;
  const cyanGlowId = `cyan-glow-${uniqueId}`;
  const shieldRedGradId = `shield-red-grad-${uniqueId}`;
  const boltCyanGradId = `bolt-cyan-grad-${uniqueId}`;
  const traceCyanGradId = `trace-cyan-grad-${uniqueId}`;

  return (
    <div className={`relative ${className} shrink-0 flex items-center justify-center`}>
      {/* Background Glow Mesh (Red for shield outer glow, Cyan for bolt inner glow) */}
      {showGlow && (
        <>
          {/* Red shield glow */}
          <div className="absolute inset-0 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-colors duration-500"></div>
          {/* Cyan bolt glow */}
          <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-colors duration-500"></div>
        </>
      )}

      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full ${showGlow ? 'drop-shadow-[0_0_15px_rgba(239,68,68,0.25)]' : ''}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Neon Glow Filters */}
          <filter id={redGlowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id={cyanGlowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Shield Red Gradient */}
          <linearGradient id={shieldRedGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>

          {/* Bolt Cyan-Blue Gradient */}
          <linearGradient id={boltCyanGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#0891b2" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>

          {/* Lightning Bolt Trace Gradient (White to Cyan) */}
          <linearGradient id={traceCyanGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        {/* 1. Base Static Shield Path (glowing red outline) */}
        <path
          d="M50 12 C58 12 77 15 82 24 C82 45 74 68 50 86 C26 68 18 45 18 24 C23 15 42 12 50 12 Z"
          stroke={`url(#${shieldRedGradId})`}
          strokeWidth="3.5"
          strokeOpacity="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${redGlowId})`}
        />

        {/* 2. Lightning Bolt Group (floating animation) */}
        <g className="animate-bounce-slow">
          {/* Static Cyan Lightning Bolt Background */}
          <path
            d="M55 24 L35 50 H48 L43 76 L65 44 H52 Z"
            stroke={`url(#${boltCyanGradId})`}
            strokeWidth="3.5"
            strokeOpacity="0.4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Animated Tracing Lightning Bolt Outline */}
          <path
            d="M55 24 L35 50 H48 L43 76 L65 44 H52 Z"
            stroke={`url(#${traceCyanGradId})`}
            strokeWidth="3.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="animate-bolt-trace"
            filter={`url(#${cyanGlowId})`}
            style={{
              strokeDasharray: "40 110", // Dash of 40, gap of 110 (total ~150 length)
            }}
          />
        </g>
      </svg>

      {/* Embedded CSS style tag for guaranteed mobile animation loading and bypassing cache */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes boltTrace {
          0% {
            stroke-dashoffset: 150;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        .animate-bolt-trace {
          animation: boltTrace 2.5s linear infinite !important;
        }
        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2.5px);
          }
        }
        .animate-bounce-slow {
          animation: bounceSlow 3s ease-in-out infinite !important;
        }
      `}} />
    </div>
  );
}
