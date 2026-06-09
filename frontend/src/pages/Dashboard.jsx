import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { History, Link2, Mail, QrCode, ExternalLink, ShieldAlert, ShieldCheck, AlertTriangle, X, Copy, Check } from 'lucide-react';

const API_BASE = '/api';

const parseDate = (timestamp) => {
  if (!timestamp) return null;
  let dateStr = timestamp;
  if (typeof dateStr === 'string') {
    const tIndex = dateStr.indexOf('T');
    if (tIndex !== -1) {
      const timePart = dateStr.slice(tIndex);
      if (!timePart.includes('Z') && !timePart.includes('+') && !timePart.includes('-')) {
        dateStr = dateStr + 'Z';
      }
    }
  }
  const dateObj = new Date(dateStr);
  return isNaN(dateObj.getTime()) ? null : dateObj;
};

const formatToIST = (timestamp) => {
  const dateObj = parseDate(timestamp);
  if (!dateObj) return 'N/A';
  return dateObj.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) + ' IST';
};

const formatDateToIST = (timestamp) => {
  const dateObj = parseDate(timestamp);
  if (!dateObj) return 'N/A';
  return dateObj.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' });
};

function Dashboard({ user, token }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState(null);

  useEffect(() => {
    if (token) {
      fetchHistory();
    }
  }, [token]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE}/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setHistory(res.data.history || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    if (type === 'url') return <Link2 className="w-4 h-4" />;
    if (type === 'email') return <Mail className="w-4 h-4" />;
    if (type === 'qr') return <QrCode className="w-4 h-4" />;
    return <History className="w-4 h-4" />;
  };

  const getStatusIcon = (status) => {
    if (status === 'safe') return <ShieldCheck className="w-5 h-5 text-emerald-400 filter drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]" />;
    if (status === 'suspicious') return <AlertTriangle className="w-5 h-5 text-amber-400 filter drop-shadow-[0_0_4px_rgba(245,158,11,0.3)]" />;
    if (status === 'dangerous') return <ShieldAlert className="w-5 h-5 text-red-500 filter drop-shadow-[0_0_4px_rgba(239,68,68,0.3)]" />;
  };

  return (
    <div className="max-w-6xl mx-auto py-10 animate-fade-in px-4 sm:px-0 relative z-10">
      <div className="flex justify-between items-center mb-8 px-2 sm:px-0 select-none">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Scan History</h1>
        <button onClick={fetchHistory} className="glass-btn-secondary py-2 px-5 text-sm font-bold flex items-center gap-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
          Refresh
        </button>
      </div>

      <div className="glass-panel overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.45)] border border-white/[0.08] relative">
        {/* Specular highlights on table wrapper */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-bold select-none">Loading history...</div>
        ) : history.length === 0 ? (
          <div className="p-16 text-center text-slate-400 select-none">
            <History className="w-14 h-14 mx-auto mb-4 text-[#ef4444]/25 filter drop-shadow-[0_0_10px_rgba(239,68,68,0.1)]" />
            <p className="font-bold tracking-tight text-slate-300">No scans performed yet</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">Start scanning suspicious files, links, or emails to begin recording diagnostic logs.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white/[0.02] border-b border-white/[0.06] text-slate-400 select-none">
                  <tr>
                    {user?.email === 'arorajivaj3009@gmail.com' && (
                      <th className="py-4 px-6 font-bold uppercase tracking-wider text-[10px]">Scanner User</th>
                    )}
                    <th className="py-4 px-6 font-bold uppercase tracking-wider text-[10px]">Type</th>
                    <th className="py-4 px-6 font-bold uppercase tracking-wider text-[10px]">Input / Target</th>
                    <th className="py-4 px-6 font-bold uppercase tracking-wider text-[10px]">Status</th>
                    <th className="py-4 px-6 font-bold uppercase tracking-wider text-[10px]">Risk Score</th>
                    <th className="py-4 px-6 font-bold uppercase tracking-wider text-[10px]">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {history.map((item, idx) => (
                    <tr key={idx} onClick={() => setSelectedScan(item)} className="hover:bg-white/[0.015] transition-colors duration-200 cursor-pointer">
                      {user?.email === 'arorajivaj3009@gmail.com' && (
                        <td className="py-4 px-6 text-slate-400 font-semibold text-xs truncate max-w-[120px]" title={item.user_email}>
                          {item.user_email || 'Anonymous'}
                        </td>
                      )}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 capitalize text-slate-400 font-semibold text-sm">
                          <span className="p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">{getIcon(item.type)}</span>
                          <span>{item.type}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 max-w-xs truncate text-slate-200 font-medium text-sm" title={item.input}>
                        {item.input}
                      </td>
                      <td className="py-4 px-6 capitalize">
                        <div className="flex items-center gap-2 text-sm font-bold">
                          {getStatusIcon(item.status)}
                          <span className={item.status === 'safe' ? 'text-emerald-400' : item.status === 'suspicious' ? 'text-amber-400' : 'text-red-400'}>
                            {item.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-full bg-white/[0.03] border border-white/[0.05] rounded-full h-2 max-w-[100px] overflow-hidden">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${item.status === 'safe' ? 'from-emerald-500 to-emerald-400' : item.status === 'suspicious' ? 'from-amber-500 to-amber-400' : 'from-red-500 to-red-400'}`}
                              style={{ width: `${item.risk_score}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-slate-400 font-mono font-bold">{item.risk_score}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-400 text-xs font-medium">
                        {formatToIST(item.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View - Glass Widgets */}
            <div className="block md:hidden divide-y divide-white/[0.04] p-2">
              {history.map((item, idx) => (
                <div key={idx} onClick={() => setSelectedScan(item)} className="p-5 flex flex-col gap-3.5 hover:bg-white/[0.02] transition-colors duration-200 cursor-pointer">
                  <div className="flex justify-between items-center select-none">
                    <div className="flex items-center gap-2 capitalize text-xs font-bold text-slate-400">
                      <span className="p-1 rounded bg-white/[0.03] border border-white/[0.06]">{getIcon(item.type)}</span>
                      <span>{item.type}</span>
                      {user?.email === 'arorajivaj3009@gmail.com' && (
                        <span className="text-[9px] font-semibold text-slate-500 lowercase bg-white/[0.02] border border-white/[0.05] px-2 py-0.5 rounded">
                          by: {item.user_email || 'Anonymous'}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      {formatDateToIST(item.timestamp)}
                    </div>
                  </div>
                  <div className="text-slate-200 font-semibold break-all text-sm leading-relaxed max-h-12 overflow-hidden truncate">
                    {item.input}
                  </div>
                  <div className="flex justify-between items-center gap-4 mt-1 select-none">
                    <div className="flex items-center gap-1.5 text-xs font-bold capitalize">
                      {getStatusIcon(item.status)}
                      <span className={item.status === 'safe' ? 'text-emerald-400' : item.status === 'suspicious' ? 'text-amber-400' : 'text-red-400'}>
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-slate-500 font-bold font-mono">Risk: {item.risk_score}</span>
                      <div className="w-16 bg-white/[0.03] border border-white/[0.05] rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r ${item.status === 'safe' ? 'from-emerald-500 to-emerald-400' : item.status === 'suspicious' ? 'from-amber-500 to-amber-400' : 'from-red-500 to-red-400'}`}
                          style={{ width: `${item.risk_score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Diagnostic Details Modal */}
      {selectedScan && createPortal(
        <ScanDetailsModal 
          scan={selectedScan} 
          onClose={() => setSelectedScan(null)} 
          getStatusIcon={getStatusIcon}
          getIcon={getIcon}
        />,
        document.body
      )}
    </div>
  );
}

function ScanDetailsModal({ scan, onClose, getStatusIcon, getIcon }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (scan && scan.input) {
      navigator.clipboard.writeText(scan.input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!scan) return null;

  const isSafe = scan.status === 'safe';
  const isSuspicious = scan.status === 'suspicious';
  const isDangerous = scan.status === 'dangerous';

  let statusColor = 'text-emerald-400';
  let borderGlow = 'shadow-[0_0_30px_rgba(16,185,129,0.15)] border-emerald-500/20';
  let progressClass = 'from-emerald-500 to-emerald-400';

  if (isSuspicious) {
    statusColor = 'text-amber-400';
    borderGlow = 'shadow-[0_0_30px_rgba(245,158,11,0.15)] border-amber-500/20';
    progressClass = 'from-amber-500 to-amber-400';
  } else if (isDangerous) {
    statusColor = 'text-red-400';
    borderGlow = 'shadow-[0_0_30px_rgba(239,68,68,0.2)] border-red-500/20';
    progressClass = 'from-red-500 to-red-400';
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Blur background overlay */}
      <div 
        className="fixed inset-0 bg-[#020204]/75 backdrop-blur-md transition-opacity duration-300 z-0"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className={`relative z-10 glass-panel max-w-xl w-full p-6 sm:p-8 rounded-[24px] border ${borderGlow} flex flex-col gap-6 max-h-[85vh] overflow-y-auto animate-zoom-in shadow-2xl`}>
        
        {/* Header */}
        <div className="flex justify-between items-start select-none">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-slate-300">{getIcon(scan.type)}</span>
            <h2 className="text-lg font-black text-white tracking-tight">Diagnostic Scan Report</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-white transition-all cursor-pointer border-none bg-transparent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diagnosis Status Summary */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white/[0.01] border border-white/[0.04] p-4.5 rounded-2xl select-none">
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">Scan Status</span>
            <div className="flex items-center gap-2 mt-1">
              {getStatusIcon(scan.status)}
              <span className={`font-black uppercase text-sm sm:text-base ${statusColor}`}>{scan.status || 'unknown'}</span>
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <div className="flex justify-between items-center sm:justify-end gap-3 select-none">
              <span className="text-[10px] text-slate-500 font-bold font-mono">Risk Index: {scan.risk_score ?? 0}/100</span>
              <div className="w-24 bg-white/[0.03] border border-white/[0.05] rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${progressClass}`}
                  style={{ width: `${scan.risk_score ?? 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Target Details Box */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2.5 select-none">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Scanned Content Target</span>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1 py-1 px-2.5 text-[9px] font-bold text-slate-400 hover:text-white bg-white/[0.02] border border-white/[0.05] hover:border-white/10 rounded-lg transition-all duration-150 cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="bg-black/50 border border-white/[0.05] p-4 rounded-xl font-mono text-xs text-slate-200 select-all break-all whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed scrollbar-thin">
            {scan.input || 'No content provided'}
          </div>
        </div>

        {/* Diagnostic Logs (Threats Detected) */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 select-none mb-1">Diagnostic Log Summary</span>
          {scan.threats_detected && scan.threats_detected.length > 0 ? (
            <ul className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {scan.threats_detected.map((threat, idx) => {
                if (!threat) return null;
                const isObj = typeof threat === 'object' && !Array.isArray(threat);
                const title = isObj ? (threat.title || 'Threat Detected') : String(threat);
                const desc = isObj ? threat.description : null;
                return (
                  <li key={idx} className="flex items-start gap-3 bg-red-950/10 p-3.5 rounded-xl border border-red-500/10 select-none animate-fade-in">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-200 text-xs">{title}</p>
                      {desc && (
                        <p className="text-[10px] text-slate-400 mt-1 leading-normal">{desc}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="bg-emerald-950/10 text-emerald-400 p-4 rounded-xl border border-emerald-500/10 flex items-center gap-3 text-xs font-bold select-none">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Zero clear vulnerability signatures or phishing matches identified.</span>
            </div>
          )}
        </div>

        {/* Footer Meta Grid */}
        <div className="border-t border-white/[0.06] pt-5 mt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[10px] text-slate-500 font-semibold select-none">
          <div className="flex flex-col gap-0.5">
            <span>Diagnosed Scanner Account:</span>
            <span className="text-slate-400 font-bold break-all">{scan.user_email || 'Anonymous/Legacy User'}</span>
          </div>
          <div className="flex flex-col gap-0.5 sm:text-right">
            <span>Diagnostic Timestamp:</span>
            <span className="text-slate-400 font-bold">
              {formatToIST(scan.timestamp)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
