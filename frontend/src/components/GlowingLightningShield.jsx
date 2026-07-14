import React from 'react';

export default function GlowingLightningShield({ className = "w-24 h-24", showGlow = true }) {
  return (
    <div className={`relative ${className} shrink-0 flex items-center justify-center`}>
      {/* Background Glow Mesh (Cyan for shield, Red for bolt) */}
      {showGlow && (
        <>
          {/* Cyan shield glow */}
          <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-colors duration-500"></div>
          {/* Red bolt glow */}
          <div className="absolute inset-0 bg-red-500/10 rounded-full blur-xl group-hover:bg-red-500/20 transition-colors duration-500"></div>
        </>
      )}

      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full ${showGlow ? 'drop-shadow-[0_0_15px_rgba(6,182,212,0.25)]' : ''}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Neon Glow Filters */}
          <filter id="cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="red-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Shield Cyan-Blue Gradient */}
          <linearGradient id="shield-cyan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>

          {/* Bolt Red-Pink Gradient */}
          <linearGradient id="bolt-red-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>

          {/* Lightning Bolt Trace Gradient */}
          <linearGradient id="trace-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>

        {/* 1. Base Static Shield Path (glowing cyan outline) */}
        <path
          d="M50 12 C58 12 77 15 82 24 C82 45 74 68 50 86 C26 68 18 45 18 24 C23 15 42 12 50 12 Z"
          stroke="url(#shield-cyan-grad)"
          strokeWidth="3.5"
          strokeOpacity="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#cyan-glow)"
        />

        {/* 2. Lightning Bolt Group (floating animation) */}
        <g className="animate-bounce-slow" style={{ transformOrigin: 'center' }}>
          {/* Static Red Lightning Bolt Background */}
          <path
            d="M55 24 L35 50 H48 L43 76 L65 44 H52 Z"
            stroke="url(#bolt-red-grad)"
            strokeWidth="3.5"
            strokeOpacity="0.4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Animated Tracing Lightning Bolt Outline */}
          <path
            d="M55 24 L35 50 H48 L43 76 L65 44 H52 Z"
            stroke="url(#trace-grad)"
            strokeWidth="3.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="animate-bolt-trace"
            filter="url(#red-glow)"
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
