import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Shield, ScanLine, History, Home as HomeIcon } from 'lucide-react';
import Home from './pages/Home';
import Scanner from './pages/Scanner';
import Dashboard from './pages/Dashboard';

function Navbar() {
  return (
    <>
      {/* Desktop/Tablet Top Navbar - Floating Glass Capsule */}
      <div className="hidden md:block sticky top-0 z-50 px-4 pt-4">
        <nav className="flex bg-[#0b0b0f]/45 backdrop-blur-xl border border-white/[0.08] rounded-2xl px-6 py-3.5 justify-between items-center max-w-6xl mx-auto shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <Link to="/" className="flex items-center gap-3 hover:opacity-85 transition-opacity cursor-pointer">
            <Shield className="text-[#ef4444] w-7 h-7" />
            <span className="text-xl font-bold text-white select-none tracking-tight">
              PhishShield <span className="text-red-500">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 bg-red-950/40 text-[#ef4444] border border-red-500/20 text-[9px] rounded-full px-2.5 py-0.5 font-bold tracking-wider">
              <span className="animate-pulse text-[8px]">●</span> LIVE
            </div>
            <div className="flex items-center gap-1 bg-white/[0.02] border border-white/[0.05] p-1 rounded-xl">
              <DesktopNavLink to="/" icon={<HomeIcon className="w-4 h-4" />} label="Home" />
              <DesktopNavLink to="/scanner" icon={<ScanLine className="w-4 h-4" />} label="Scanner" />
              <DesktopNavLink to="/dashboard" icon={<History className="w-4 h-4" />} label="History" />
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Top Header - Frosted glass header */}
      <nav className="flex md:hidden bg-[#060608]/65 backdrop-blur-xl border-b border-white/[0.06] px-4 py-3.5 justify-between items-center sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer">
          <Shield className="text-[#ef4444] w-5.5 h-5.5" />
          <span className="text-base font-bold text-white select-none tracking-tight">
            PhishShield <span className="text-red-500">AI</span>
          </span>
        </Link>
        <div className="flex items-center gap-1 bg-red-950/40 text-[#ef4444] border border-red-500/25 text-[8px] rounded-full px-2 py-0.5 font-bold tracking-wider">
          <span className="animate-pulse">●</span> LIVE
        </div>
      </nav>

      {/* Mobile Bottom Tab Bar - Floating Glass Island Dock */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-[#0b0b0f]/60 backdrop-blur-xl border border-white/[0.08] py-2 px-6 flex justify-around items-center rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
          <MobileNavLink to="/" icon={<HomeIcon className="w-5 h-5" />} label="Home" />
          <MobileNavLink to="/scanner" icon={<ScanLine className="w-5 h-5" />} label="Scanner" />
          <MobileNavLink to="/dashboard" icon={<History className="w-5 h-5" />} label="History" />
        </div>
      </div>
    </>
  );
}

function DesktopNavLink({ to, icon, label }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${isActive ? 'bg-white/[0.06] text-red-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' : 'text-slate-300 hover:bg-white/[0.03] hover:text-white'}`}
    >
      {icon} {label}
    </Link>
  );
}

function MobileNavLink({ to, icon, label }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-red-500 scale-105' : 'text-slate-400 hover:text-white'}`}
    >
      <div className={`p-1 rounded-lg transition-all ${isActive ? 'bg-red-500/10' : ''}`}>
        {icon}
      </div>
      <span className="text-[9px] font-semibold uppercase tracking-wider">{label}</span>
    </Link>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#050508] text-slate-200 font-sans relative overflow-hidden selection:bg-red-500/30 selection:text-white">
        
        {/* Glassmorphism Background Ambient glowing blobs */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Red Glow Orb */}
          <div className="absolute top-[10%] left-[5%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-red-600/10 blur-[100px] sm:blur-[130px] animate-float-slow"></div>
          {/* Deep Blue/Indigo Orb */}
          <div className="absolute bottom-[20%] right-[10%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-blue-600/10 blur-[120px] sm:blur-[160px] animate-float-medium"></div>
          {/* Crimson Center Orb */}
          <div className="absolute top-[40%] right-[30%] w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full bg-rose-700/8 blur-[90px] sm:blur-[120px] animate-float-fast"></div>
          {/* Subtle amber safety glow */}
          <div className="absolute bottom-[5%] left-[25%] w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] rounded-full bg-amber-600/6 blur-[80px] sm:blur-[110px] animate-float-slow"></div>
        </div>

        <div className="relative z-10 min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 container mx-auto px-4 pb-28 md:pb-12 max-w-6xl">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/scanner" element={<Scanner />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
