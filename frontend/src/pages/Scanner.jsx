import React, { useState } from 'react';
import axios from 'axios';
import { Link2, Mail, QrCode, AlertTriangle, ShieldCheck, AlertCircle, Loader2, Scan, ScanLine } from 'lucide-react';

const API_BASE = '/api';

function Scanner() {
  const [activeTab, setActiveTab] = useState('url');
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      let res;
      if (activeTab === 'url') {
        res = await axios.post(`${API_BASE}/scan-url`, { url: input });
      } else if (activeTab === 'email') {
        res = await axios.post(`${API_BASE}/scan-email`, { content: input });
      } else if (activeTab === 'qr' && file) {
        const formData = new FormData();
        formData.append('file', file);
        res = await axios.post(`${API_BASE}/scan-qr`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setResult(activeTab === 'qr' ? res.data.scan_result : res.data);
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.detail || 'Error during scanning. Make sure the backend is running.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get active threat indicators for the header badge
  const score = result?.risk_score !== undefined ? result.risk_score : 0;
  const status = result?.status || 'safe';

  let iconTextClass = 'text-[#ef4444]';
  let iconBgClass = 'bg-red-950/15 border-red-500/20';
  let iconBorderClass = 'border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.05)]';
  let pulseClass = 'animate-pulse';
  let HeaderIcon = ScanLine;

  if (result) {
    if (status === 'dangerous' || score >= 70) {
      iconTextClass = 'text-red-500';
      iconBgClass = 'bg-red-950/20 border-red-500/30';
      iconBorderClass = 'border-red-500/30 shadow-[0_0_25px_rgba(239,68,68,0.2)]';
      pulseClass = 'animate-pulse';
      HeaderIcon = AlertCircle;
    } else if (status === 'suspicious' || (score >= 30 && score < 70)) {
      iconTextClass = 'text-amber-500';
      iconBgClass = 'bg-amber-950/20 border-amber-500/30';
      iconBorderClass = 'border-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.2)]';
      pulseClass = 'animate-pulse';
      HeaderIcon = AlertTriangle;
    } else {
      iconTextClass = 'text-emerald-500';
      iconBgClass = 'bg-emerald-950/20 border-emerald-500/30';
      iconBorderClass = 'border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.2)]';
      pulseClass = 'animate-pulse';
      HeaderIcon = ShieldCheck;
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-2 sm:px-0 animate-fade-in relative z-10">
      {/* Dynamic Cyber Security HUD Badge */}
      <div className="flex flex-col items-center justify-center mb-6 select-none relative">
        <div className="absolute w-24 h-24 rounded-full bg-red-500/5 blur-xl animate-pulse"></div>
        <div className={`relative p-5 rounded-full border backdrop-blur-xl transition-all duration-500 hover:scale-105 shadow-2xl ${iconBgClass} ${iconBorderClass} flex items-center justify-center`}>
          {/* Outer spinning border highlight for scanner style */}
          <div className="absolute inset-0.5 rounded-full border border-dashed border-white/5 animate-[spin_40s_linear_infinite]"></div>
          <div className={`${pulseClass} relative z-10`}>
            <HeaderIcon className={`w-11 h-11 ${iconTextClass} transition-colors duration-500 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]`} />
          </div>
        </div>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 sm:mb-8 text-center text-white select-none tracking-tight">Threat Scanner</h1>
      
      <div className="mb-6 sm:mb-8">
        <ThreatLevelBar result={result} />
      </div>
      
      <div className="glass-segments p-1.5 mb-6 sm:mb-8 grid grid-cols-3 gap-1.5">
        <TabButton active={activeTab === 'url'} onClick={() => { setActiveTab('url'); setResult(null); }} icon={<Link2 className="w-4 h-4 sm:w-4.5 sm:h-4.5"/>} text="URL" desktopText="URL Scanner" />
        <TabButton active={activeTab === 'email'} onClick={() => { setActiveTab('email'); setResult(null); }} icon={<Mail className="w-4 h-4 sm:w-4.5 sm:h-4.5"/>} text="Email" desktopText="Email Analyzer" />
        <TabButton active={activeTab === 'qr'} onClick={() => { setActiveTab('qr'); setResult(null); }} icon={<QrCode className="w-4 h-4 sm:w-4.5 sm:h-4.5"/>} text="QR" desktopText="QR Scanner" />
      </div>

      <div className="glass-panel p-6 sm:p-8 mb-6 sm:mb-8 shadow-[0_15px_30px_rgba(0,0,0,0.4)] relative overflow-hidden">
        {/* Subtle light leak for iOS design */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-red-500/5 blur-2xl"></div>
        
        <form onSubmit={handleScan} className="flex flex-col gap-5 sm:gap-6 relative z-10">
          {activeTab === 'url' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">Suspicious URL</label>
              <input 
                type="url" 
                required 
                value={input} 
                onChange={e => setInput(e.target.value)}
                placeholder="https://example.com/login" 
                className="w-full glass-input px-4 py-3.5 focus:outline-none text-white text-sm sm:text-base placeholder-slate-600"
              />
            </div>
          )}
          
          {activeTab === 'email' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">Email or Message Content</label>
              <textarea 
                required 
                rows={6}
                value={input} 
                onChange={e => setInput(e.target.value)}
                placeholder="Paste the suspicious message here..." 
                className="w-full glass-input px-4 py-3.5 focus:outline-none text-white text-sm sm:text-base placeholder-slate-600 resize-none"
              />
            </div>
          )}

          {activeTab === 'qr' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">Upload QR Code Image</label>
              <input 
                type="file" 
                accept="image/*"
                required 
                onChange={e => setFile(e.target.files[0])}
                className="w-full glass-input px-4 py-3 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-red-500/10 file:text-red-400 hover:file:bg-red-500/20 file:transition-all text-slate-500 text-sm sm:text-base"
              />
            </div>
          )}

          <button type="submit" disabled={loading} className="glass-btn-primary w-full flex justify-center items-center gap-2 py-3.5 rounded-xl shadow-[0_4px_20px_rgba(239,68,68,0.25)] select-none">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Scan className="w-5 h-5" />}
            <span className="font-bold tracking-wide">{loading ? 'Analyzing...' : 'Scan Now'}</span>
          </button>
        </form>
      </div>
      {result && <ResultCard result={result} />}
    </div>
  );
}

function ThreatLevelBar({ result }) {
  if (!result) {
    return (
      <div className="w-full bg-[#001c10]/20 border border-[#10b981]/25 backdrop-blur-md rounded-2xl px-5 py-3.5 flex items-center justify-between transition-all duration-500 text-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.05)]">
        <span className="text-[9px] font-extrabold tracking-widest uppercase text-[#10b981]/80 select-none">System Status</span>
        <div className="flex-1 mx-4 sm:mx-8 h-2 rounded-full overflow-hidden bg-[#10b981]/10 border border-[#10b981]/15">
          <div 
            className="h-full transition-all duration-500 bg-gradient-to-r from-[#10b981] to-[#34d399] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            style={{ width: '12%' }}
          ></div>
        </div>
        <span className="font-mono font-extrabold text-[10px] sm:text-xs tracking-wider animate-pulse flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span> SECURE (READY)
        </span>
      </div>
    );
  }

  const score = result.risk_score !== undefined ? result.risk_score : 0;
  const status = result.status || 'safe';

  let level = 'SECURE';
  let bgClass = 'bg-[#001c10]/20 border-[#10b981]/25 text-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.05)]';
  let barBgClass = 'bg-[#10b981]/10 border-[#10b981]/15';
  let barClass = 'from-[#10b981] to-[#34d399] shadow-[0_0_8px_rgba(16,185,129,0.5)]';
  let statusColor = '#10b981';

  if (status === 'dangerous' || score >= 70) {
    level = 'CRITICAL';
    bgClass = 'bg-[#1a0000]/25 border-red-500/25 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.05)]';
    barBgClass = 'bg-red-500/10 border-red-500/15';
    barClass = 'from-[#ef4444] to-[#f43f5e] shadow-[0_0_8px_rgba(239,68,68,0.5)]';
    statusColor = '#ef4444';
  } else if (status === 'suspicious' || (score >= 30 && score < 70)) {
    level = 'ELEVATED';
    bgClass = 'bg-[#1c1500]/20 border-amber-500/25 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.05)]';
    barBgClass = 'bg-amber-500/10 border-amber-500/15';
    barClass = 'from-[#f59e0b] to-[#fbbf24] shadow-[0_0_8px_rgba(245,158,11,0.5)]';
    statusColor = '#f59e0b';
  }

  return (
    <div className={`w-full backdrop-blur-md rounded-2xl px-5 py-3.5 flex items-center justify-between transition-all duration-500 ${bgClass}`}>
      <span className="text-[9px] font-extrabold tracking-widest uppercase select-none opacity-80">Threat Level</span>
      <div className={`flex-1 mx-4 sm:mx-8 h-2 rounded-full overflow-hidden ${barBgClass} border`}>
        <div 
          className={`h-full transition-all duration-500 bg-gradient-to-r ${barClass} rounded-full`}
          style={{ width: `${Math.max(8, score)}%` }}
        ></div>
      </div>
      <span className="font-mono font-extrabold text-[10px] sm:text-xs tracking-wider flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor }}></span> {level} ({score}%)
      </span>
    </div>
  );
}

function TabButton({ active, onClick, icon, text, desktopText }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 ${
        active 
          ? 'bg-red-500 text-white shadow-[0_4px_16px_rgba(239,68,68,0.25)] border border-red-400/20 scale-[1.02]' 
          : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
      }`}
    >
      {icon} 
      <span className="hidden sm:inline">{desktopText}</span>
      <span className="inline sm:hidden">{text}</span>
    </button>
  );
}

function ResultCard({ result }) {
  const isSafe = result.status === 'safe';
  const isSuspicious = result.status === 'suspicious';
  const isDangerous = result.status === 'dangerous';

  let statusColor = 'text-emerald-400';
  let iconBgColor = 'bg-emerald-500/10 border-emerald-500/20';
  let panelClass = 'glass-panel-safe';
  let Icon = ShieldCheck;

  if (isSuspicious) {
    statusColor = 'text-amber-400';
    iconBgColor = 'bg-amber-500/10 border-amber-500/20';
    panelClass = 'glass-panel-suspicious';
    Icon = AlertTriangle;
  } else if (isDangerous) {
    statusColor = 'text-red-400';
    iconBgColor = 'bg-red-500/10 border-red-500/20';
    panelClass = 'glass-panel-dangerous';
    Icon = AlertCircle;
  }

  return (
    <div className={`${panelClass} p-6 sm:p-8 animate-fade-in relative overflow-hidden`}>
      {/* Soft backdrop ambient light leak to illuminate glass */}
      <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full opacity-15 blur-3xl" style={{
        backgroundColor: isSafe ? '#10b981' : isSuspicious ? '#f59e0b' : '#ef4444'
      }}></div>
      
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className={`p-3.5 sm:p-4 rounded-2xl border ${iconBgColor} ${statusColor} shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]`}>
          <Icon className="w-8 h-8 sm:w-10 sm:h-10 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]" />
        </div>
        <div>
          <h2 className={`text-2xl sm:text-3xl font-black capitalize tracking-tight ${statusColor}`}>{result.status}</h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
            Risk Index Evaluation: <span className={`font-bold ${statusColor}`}>{result.risk_score} / 100</span>
          </p>
        </div>
      </div>

      {result.threats_detected && result.threats_detected.length > 0 && (
        <div className="relative z-10 mt-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3.5">Threat Vectors Detected:</h3>
          <ul className="space-y-3">
            {result.threats_detected.map((threat, idx) => (
              <li key={idx} className="flex items-start gap-3 bg-red-950/15 p-4 rounded-xl border border-red-500/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-200 text-sm">{typeof threat === 'object' ? threat.title : threat}</p>
                  {typeof threat === 'object' && threat.description && (
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{threat.description}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {result.threats_detected && result.threats_detected.length === 0 && (
        <div className="relative z-10 bg-emerald-950/15 text-emerald-400 p-4 rounded-xl border border-emerald-500/10 flex items-center gap-3 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <span>Zero clear vulnerability signatures or phishing matches identified. Good to go!</span>
        </div>
      )}
    </div>
  );
}

export default Scanner;
