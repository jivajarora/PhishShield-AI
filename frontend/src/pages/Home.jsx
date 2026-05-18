import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Lock, Scan } from 'lucide-react';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center animate-fade-in text-center py-6 sm:py-12">
      {/* Icon Shield with Neon Glow Ring */}
      <div className="relative mb-8 sm:mb-10 group">
        <div className="absolute inset-0 bg-[#ef4444]/20 rounded-full blur-2xl group-hover:bg-[#ef4444]/35 transition-colors duration-500"></div>
        <div className="relative z-10 p-6 sm:p-8 rounded-full bg-white/[0.02] border border-white/[0.08] backdrop-blur-md shadow-[0_15px_35px_rgba(239,68,68,0.15)] transition-transform duration-500 group-hover:scale-105">
          <ShieldCheck className="w-20 h-20 sm:w-28 sm:h-28 text-[#ef4444] filter drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        </div>
      </div>
      
      {/* Sleek iOS Gradient Title */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-6 tracking-tight text-white leading-tight select-none">
        Next-Gen <span className="bg-gradient-to-r from-red-500 to-rose-600 bg-clip-text text-transparent filter drop-shadow-[0_2px_10px_rgba(239,68,68,0.2)]">Threat Detection</span>
      </h1>
      
      {/* Sleek Subtext */}
      <p className="text-base sm:text-lg text-slate-400 max-w-2xl mb-8 sm:mb-12 leading-relaxed px-4 select-none">
        Empowering digital defenses with machine learning models and global intelligence. Identify malicious links, suspicious emails, and dangerous QR codes instantly.
      </p>
      
      {/* Floating Glass Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12 sm:mb-16 w-full sm:w-auto px-4 sm:px-0 relative z-20">
        <Link to="/scanner" className="glass-btn-primary flex items-center justify-center gap-2 text-base sm:text-lg py-3.5 px-8">
          <Scan className="w-5 h-5" /> Start Scanning
        </Link>
        <Link to="/dashboard" className="glass-btn-secondary flex items-center justify-center gap-2 text-base sm:text-lg py-3.5 px-8">
          View History
        </Link>
      </div>

      {/* Stats Row - Floating Glass Capsule */}
      <div className="w-full max-w-4xl mb-12 sm:mb-20 px-4 relative z-20">
        <div className="glass-panel py-6 px-4 flex flex-col sm:flex-row items-center gap-6 sm:gap-4 justify-around shadow-[0_12px_24px_rgba(0,0,0,0.3)]">
          <div className="text-center flex-1">
            <div className="bg-gradient-to-b from-white to-red-400 bg-clip-text text-transparent text-3xl sm:text-4xl font-extrabold tracking-tight">2.4M+</div>
            <div className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-1.5">Threats Blocked</div>
          </div>
          <div className="hidden sm:block h-8 w-[1px] bg-white/[0.08]"></div>
          <div className="text-center flex-1">
            <div className="bg-gradient-to-b from-white to-red-400 bg-clip-text text-transparent text-3xl sm:text-4xl font-extrabold tracking-tight">99.8%</div>
            <div className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-1.5">Accuracy Rate</div>
          </div>
          <div className="hidden sm:block h-8 w-[1px] bg-white/[0.08]"></div>
          <div className="text-center flex-1">
            <div className="bg-gradient-to-b from-white to-red-400 bg-clip-text text-transparent text-3xl sm:text-4xl font-extrabold tracking-tight">&lt; 1.0s</div>
            <div className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-1.5">Analysis Time</div>
          </div>
        </div>
      </div>
      
      {/* 3-Column Glass Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full max-w-5xl px-4 sm:px-0">
        <FeatureCard 
          icon={<Zap className="w-6 h-6 text-[#ef4444]" />}
          title="AI-Powered"
          description="Analyzes URLs and emails using machine learning models trained on thousands of known threats."
        />
        <FeatureCard 
          icon={<Lock className="w-6 h-6 text-[#ef4444]" />}
          title="Real-Time Protection"
          description="Instant validation against global threat intelligence databases like VirusTotal and PhishTank."
        />
        <FeatureCard 
          icon={<Scan className="w-6 h-6 text-[#ef4444]" />}
          title="Multi-Modal Scanning"
          description="Scan suspicious links, analyze email contents, and decode QR codes safely in one place."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="glass-panel glass-panel-hover p-8 text-left group flex flex-col items-start relative overflow-hidden">
      {/* Top specular glow */}
      <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent"></div>
      
      <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-red-500/30 group-hover:bg-red-500/5 transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        {icon}
      </div>
      <h3 className="text-white text-xl font-bold mb-3 tracking-tight group-hover:text-red-400 transition-colors duration-300">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed select-none">{description}</p>
    </div>
  );
}

export default Home;
