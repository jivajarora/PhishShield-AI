import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, ScanLine, History, Home as HomeIcon, AlertTriangle } from 'lucide-react';
import Home from './pages/Home';
import Scanner from './pages/Scanner';
import Dashboard from './pages/Dashboard';

function Login({ onLogin }) {
  const googleBtnRef = useRef(null);

  useEffect(() => {
    // Read Google Client ID from Vite env variables
    const client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
    
    if (client_id && window.google) {
      try {
        window.google.accounts.id.initialize({
          client_id: client_id,
          callback: (response) => {
            const token = response.credential;
            try {
              // Parse token JWT locally
              const base64Url = token.split('.')[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                  return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              }).join(''));
              const payload = JSON.parse(jsonPayload);
              
              onLogin({
                email: payload.email,
                name: payload.name || payload.email.split('@')[0],
                picture: payload.picture
              }, token);
            } catch (e) {
              console.error("Failed to parse token payload", e);
            }
          }
        });
        
        window.google.accounts.id.renderButton(
          googleBtnRef.current,
          { theme: "dark", size: "large", width: 280, text: "signin_with" }
        );
      } catch (err) {
        console.error("Google script initialization failed", err);
      }
    }
  }, [onLogin]);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 select-none relative z-10">
      {/* Login Widget Container */}
      <div className="glass-panel max-w-sm w-full p-8 text-center relative border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.65)] rounded-[24px]">
        {/* Amber top line glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-44 h-[1px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent"></div>
        
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-red-950/25 border border-red-500/25 text-[#ef4444] animate-pulse">
            <Shield className="w-10 h-10" />
          </div>
        </div>

        <h2 className="text-xl font-black text-white tracking-tight mb-2">ACCESS DECRYPTION PROTOCOL</h2>
        <p className="text-slate-400 text-xs font-semibold mb-8 leading-relaxed max-w-xs mx-auto">
          Authorization required to log threat reports and access secure AI scanning diagnostics.
        </p>

        <div className="flex flex-col gap-4 items-center">
          {/* Google Sign In Wrapper */}
          <div ref={googleBtnRef} className="w-full flex justify-center min-h-[44px]"></div>
          
          {!window.google && (
            <p className="text-[10px] text-slate-500 font-semibold animate-pulse">
              Establishing connection to Google Sign-In...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Navbar({ user, onLogout }) {
  return (
    <>
      {/* Desktop/Tablet Top Navbar - Floating Glass Capsule */}
      <div className="hidden md:block sticky top-0 z-50 px-4 pt-4">
        <nav className="flex bg-[#0b0b0f]/45 backdrop-blur-xl border border-white/[0.08] rounded-2xl px-6 py-3 justify-between items-center max-w-6xl mx-auto shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
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
            
            {user && (
              <div className="flex items-center gap-1 bg-white/[0.02] border border-white/[0.05] p-1 rounded-xl">
                <DesktopNavLink to="/" icon={<HomeIcon className="w-4 h-4" />} label="Home" />
                <DesktopNavLink to="/scanner" icon={<ScanLine className="w-4 h-4" />} label="Scanner" />
                <DesktopNavLink to="/dashboard" icon={<History className="w-4 h-4" />} label="History" />
              </div>
            )}

            {user && (
              <div className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] pl-3 pr-2 py-1 rounded-xl select-none">
                <img 
                  src={user.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`} 
                  alt={user.name} 
                  className="w-6 h-6 rounded-full border border-white/10" 
                />
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-extrabold text-white leading-tight">{user.name}</span>
                  <span className="text-[8px] font-semibold text-slate-500 leading-tight">{user.email}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="ml-2 py-1 px-2.5 text-[8px] font-bold text-slate-400 hover:text-red-400 bg-white/[0.02] hover:bg-red-500/10 border border-white/[0.05] hover:border-red-500/25 rounded-lg transition-all duration-150 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Top Header - Frosted glass header */}
      <nav className="flex md:hidden bg-[#060608]/65 backdrop-blur-xl border-b border-white/[0.06] px-4 py-3 justify-between items-center sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer">
          <Shield className="text-[#ef4444] w-5.5 h-5.5" />
          <span className="text-base font-bold text-white select-none tracking-tight">
            PhishShield <span className="text-red-500">AI</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-red-950/40 text-[#ef4444] border border-red-500/25 text-[8px] rounded-full px-2 py-0.5 font-bold tracking-wider">
            <span className="animate-pulse">●</span> LIVE
          </div>
          
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
              <img 
                src={user.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`} 
                alt={user.name} 
                className="w-5 h-5 rounded-full border border-white/10" 
              />
              <button 
                onClick={onLogout}
                className="py-0.5 px-2 text-[8px] font-bold text-slate-400 hover:text-red-400 bg-white/[0.02] border border-white/[0.05] rounded transition-all duration-150 cursor-pointer"
              >
                Exit
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Tab Bar */}
      {user && <MobileTabBar />}
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

function MobileTabBar() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const routes = ['/', '/scanner', '/dashboard'];
  
  const getActiveIndex = (path) => {
    const idx = routes.indexOf(path);
    return idx !== -1 ? idx : 0;
  };
  
  const initialActive = getActiveIndex(location.pathname);
  
  const [activeIndex, setActiveIndex] = useState(initialActive);
  const [hoverIndex, setHoverIndex] = useState(initialActive);
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0); 
  const [containerWidth, setContainerWidth] = useState(0);
  const [lastVibratedIndex, setLastVibratedIndex] = useState(initialActive);

  useEffect(() => {
    const currentIdx = getActiveIndex(location.pathname);
    setActiveIndex(currentIdx);
    setHoverIndex(currentIdx);
  }, [location.pathname]);

  const handleTouchStart = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setContainerWidth(rect.width);
    setIsDragging(true);
    
    const clientX = e.touches[0].clientX;
    const relX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    setDragX(relX);

    const sectionWidth = rect.width / 3;
    const touchedIdx = Math.min(2, Math.floor(relX / sectionWidth));
    setHoverIndex(touchedIdx);
    setLastVibratedIndex(touchedIdx);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches[0].clientX;
    const relX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    setDragX(relX);

    const sectionWidth = rect.width / 3;
    const currentHoverIdx = Math.min(2, Math.floor(relX / sectionWidth));
    
    if (currentHoverIdx !== hoverIndex) {
      setHoverIndex(currentHoverIdx);
      if (currentHoverIdx !== lastVibratedIndex) {
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
        setLastVibratedIndex(currentHoverIdx);
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (hoverIndex !== activeIndex) {
      navigate(routes[hoverIndex]);
    }
  };

  const handleTabClick = (idx) => {
    navigate(routes[idx]);
  };

  let dropletStyle = {};
  if (containerWidth > 0) {
    if (isDragging) {
      const percentage = (dragX / containerWidth) * 100;
      const hoverCenterPercent = (hoverIndex * 2 + 1) * 16.666;
      const dist = Math.abs(percentage - hoverCenterPercent);
      const stretchX = 1 + Math.min(0.35, dist / 40);
      const stretchY = 1 - Math.min(0.18, dist / 80);
      
      dropletStyle = {
        left: `${percentage}%`,
        transform: `translate(-50%, -50%) scale(${stretchX}, ${stretchY})`,
        transition: 'transform 0.05s ease-out',
      };
    } else {
      const percentage = (activeIndex * 2 + 1) * 16.666;
      dropletStyle = {
        left: `${percentage}%`,
        transform: 'translate(-50%, -50%) scale(1, 1)',
        transition: 'left 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      };
    }
  } else {
    const percentage = (activeIndex * 2 + 1) * 16.666;
    dropletStyle = {
      left: `${percentage}%`,
      transform: 'translate(-50%, -50%)',
    };
  }

  return (
    <div className="md:hidden fixed bottom-6 left-6 right-6 z-50 select-none">
      <div 
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative bg-[#0c0c12]/60 backdrop-blur-2xl border border-white/[0.08] py-3 px-4 flex justify-between items-center rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.7)] touch-none"
      >
        <div 
          className="absolute top-1/2 w-[28%] h-[72%] rounded-full bg-gradient-to-r from-red-600/20 via-red-500/25 to-red-600/20 border border-red-500/25 shadow-[0_0_15px_rgba(239,68,68,0.25),inset_0_1px_1px_rgba(255,255,255,0.15)] pointer-events-none z-0"
          style={dropletStyle}
        />

        {routes.map((route, idx) => {
          const isSelected = isDragging ? hoverIndex === idx : activeIndex === idx;
          let label = 'Home';
          let icon = null;
          
          if (idx === 0) {
            label = 'Home';
            icon = <HomeIcon className="w-5.5 h-5.5" />;
          } else if (idx === 1) {
            label = 'Scanner';
            icon = <ScanLine className="w-5.5 h-5.5" />;
          } else {
            label = 'History';
            icon = <History className="w-5.5 h-5.5" />;
          }

          return (
            <button
              key={route}
              onClick={() => handleTabClick(idx)}
              className="flex-1 flex flex-col items-center gap-1 justify-center relative z-10 py-1.5 cursor-pointer outline-none focus:outline-none bg-transparent border-none"
            >
              <div 
                className={`p-1 rounded-xl transition-all duration-300 ${isSelected ? 'text-red-500 scale-110 filter drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'text-slate-400'}`}
              >
                {icon}
              </div>
              <span 
                className={`text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${isSelected ? 'text-white scale-102' : 'text-slate-500'}`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DisclaimerModal({ onAccept }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Blur background overlay */}
      <div className="fixed inset-0 bg-[#020204]/85 backdrop-blur-lg z-0" />
      
      {/* Modal Card */}
      <div className="relative z-10 glass-panel max-w-md w-full p-8 rounded-[24px] border border-amber-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.65)] flex flex-col gap-6 text-center animate-fade-in">
        
        {/* Specular highlights on card */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"></div>

        {/* Warning Icon */}
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-amber-950/20 border border-amber-500/25 text-amber-500 filter drop-shadow-[0_0_10px_rgba(245,158,11,0.2)] animate-pulse">
            <AlertTriangle className="w-10 h-10" />
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-1.5 select-none">
          <h2 className="text-xl font-black text-white tracking-tight">ADMINISTRATIVE DISCLOSURE</h2>
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-amber-500">Security & Supervision Notice</span>
        </div>

        {/* Warning Content */}
        <div className="text-slate-300 text-xs leading-relaxed space-y-3 font-medium select-none text-left">
          <p>
            Please be advised that all scan actions, email reports, QR inputs, and analysis target histories processed through this dashboard are recorded under your authenticated account.
          </p>
          <p className="text-slate-400 bg-black/45 border border-white/[0.04] p-3 rounded-xl text-[11px] leading-relaxed">
            These logs are subject to active supervision and review by the platform administrator (<span className="text-amber-400 font-bold">arorajivaj3009@gmail.com</span>) for threat intelligence analysis.
          </p>
          <p className="text-red-400/90 font-semibold text-center">
            Please refrain from uploading or scanning confidential credentials, personal keys, or private sensitive correspondence.
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-2">
          <button 
            onClick={onAccept}
            className="w-full py-3 px-6 text-xs font-black tracking-wider uppercase text-black bg-amber-500 hover:bg-amber-400 hover:scale-[1.02] active:scale-[0.98] border-none rounded-xl transition-all duration-200 cursor-pointer shadow-[0_4px_20px_rgba(245,158,11,0.3)]"
          >
            I Acknowledge & Consent
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('phishshield_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [token, setToken] = useState(() => {
    return localStorage.getItem('phishshield_token') || null;
  });

  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    if (user && user.email !== 'arorajivaj3009@gmail.com') {
      const accepted = localStorage.getItem(`disclaimer_accepted_${user.email}`);
      if (!accepted) {
        setShowDisclaimer(true);
      } else {
        setShowDisclaimer(false);
      }
    } else {
      setShowDisclaimer(false);
    }
  }, [user]);

  const handleLogin = (userInfo, tokenStr) => {
    setUser(userInfo);
    setToken(tokenStr);
    localStorage.setItem('phishshield_user', JSON.stringify(userInfo));
    localStorage.setItem('phishshield_token', tokenStr);
  };

  const handleLogout = () => {
    if (user) {
      localStorage.removeItem(`disclaimer_accepted_${user.email}`);
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('phishshield_user');
    localStorage.removeItem('phishshield_token');
  };

  const handleAcceptDisclaimer = () => {
    if (user) {
      localStorage.setItem(`disclaimer_accepted_${user.email}`, 'true');
    }
    setShowDisclaimer(false);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#050508] text-slate-200 font-sans relative overflow-hidden selection:bg-red-500/30 selection:text-white">
        
        {/* Glow Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[5%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-red-600/10 blur-[100px] sm:blur-[130px] animate-float-slow"></div>
          <div className="absolute bottom-[20%] right-[10%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-blue-600/10 blur-[120px] sm:blur-[160px] animate-float-medium"></div>
          <div className="absolute top-[40%] right-[30%] w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full bg-rose-700/8 blur-[90px] sm:blur-[120px] animate-float-fast"></div>
        </div>

        <div className="relative z-10 min-h-screen flex flex-col">
          {user ? (
            <>
              <Navbar user={user} onLogout={handleLogout} />
              <main className="flex-1 container mx-auto px-4 pb-28 md:pb-12 max-w-6xl">
                <Routes>
                  <Route path="/" element={<Home user={user} />} />
                  <Route path="/scanner" element={<Scanner user={user} token={token} />} />
                  <Route path="/dashboard" element={<Dashboard user={user} token={token} />} />
                </Routes>
              </main>
              {showDisclaimer && <DisclaimerModal onAccept={handleAcceptDisclaimer} />}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center min-h-screen">
              <Login onLogin={handleLogin} />
            </div>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;
