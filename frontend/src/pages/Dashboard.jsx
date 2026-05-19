import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { History, Link2, Mail, QrCode, ExternalLink, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

const API_BASE = '/api';

function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE}/history`);
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
                    <th className="py-4 px-6 font-bold uppercase tracking-wider text-[10px]">Type</th>
                    <th className="py-4 px-6 font-bold uppercase tracking-wider text-[10px]">Input / Target</th>
                    <th className="py-4 px-6 font-bold uppercase tracking-wider text-[10px]">Status</th>
                    <th className="py-4 px-6 font-bold uppercase tracking-wider text-[10px]">Risk Score</th>
                    <th className="py-4 px-6 font-bold uppercase tracking-wider text-[10px]">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {history.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.015] transition-colors duration-200">
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
                        {new Date(item.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View - Glass Widgets */}
            <div className="block md:hidden divide-y divide-white/[0.04] p-2">
              {history.map((item, idx) => (
                <div key={idx} className="p-5 flex flex-col gap-3.5 hover:bg-white/[0.02] transition-colors duration-200">
                  <div className="flex justify-between items-center select-none">
                    <div className="flex items-center gap-2 capitalize text-xs font-bold text-slate-400">
                      <span className="p-1 rounded bg-white/[0.03] border border-white/[0.06]">{getIcon(item.type)}</span>
                      <span>{item.type}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-slate-200 font-semibold break-all text-sm leading-relaxed">
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
    </div>
  );
}

export default Dashboard;
