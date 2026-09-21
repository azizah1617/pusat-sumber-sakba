import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock, ShieldAlert, WifiOff, School } from 'lucide-react';

interface HeaderProps {
  onOpenResetModal: () => void;
  isOnline: boolean;
  syncState: 'connected' | 'connecting' | 'offline';
}

export const Header: React.FC<HeaderProps> = ({
  onOpenResetModal,
  syncState,
}) => {
  const [time, setTime] = useState<string>('00:00:00');
  const [dateStr, setDateStr] = useState<string>('Memuatkan...');
  const [logoLoaded, setLogoLoaded] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('ms-MY', { hour12: false }));
      setDateStr(
        now.toLocaleDateString('ms-MY', {
          weekday: 'long',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header id="main-header" className="no-print bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-xl border-b border-blue-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-5">
          {/* Logo & School Title */}
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="relative flex-shrink-0">
              {logoLoaded ? (
                <img
                  src="https://i.postimg.cc/g2CVFzRH/logo-sakba.png"
                  alt="Logo SAKBA"
                  className="h-16 w-auto max-w-[70px] drop-shadow-lg object-contain transition-transform hover:scale-105"
                  onError={() => setLogoLoaded(false)}
                />
              ) : (
                <div className="h-14 w-14 rounded-xl bg-blue-700/60 border border-blue-400/40 flex items-center justify-center text-blue-200 shadow-inner">
                  <School className="w-8 h-8 text-white" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white drop-shadow-sm">
                  Sistem Rekod Perpustakaan
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/30 text-blue-200 border border-blue-400/30 backdrop-blur-xs">
                  SAKBA Cloud
                </span>
              </div>
              
              <div className="flex items-center justify-center md:justify-start gap-2 text-blue-200 text-xs sm:text-sm font-medium mt-1">
                <span>SM Sains Kepala Batas</span>
                <span className="text-blue-400">•</span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  {syncState === 'connected' ? (
                    <>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                      </span>
                      <span className="text-emerald-300 font-semibold">Cloud Sync Active</span>
                    </>
                  ) : syncState === 'connecting' ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin text-amber-300" />
                      <span className="text-amber-300">Menyambung...</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3 h-3 text-red-300" />
                      <span className="text-red-300">Mod Luar Talian</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Clock & System Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div
              id="clock-container"
              className="bg-blue-950/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-blue-500/30 text-center md:text-right shadow-inner flex-1 md:flex-initial"
            >
              <div className="flex items-center justify-center md:justify-end gap-1.5 text-blue-200 mb-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span id="clock-date" className="text-[11px] uppercase tracking-wider font-semibold text-blue-200">
                  {dateStr}
                </span>
              </div>
              <div
                id="clock-time"
                className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-wider leading-none"
              >
                {time}
              </div>
            </div>

            {/* Reset Button */}
            <button
              id="btn-open-reset"
              onClick={onOpenResetModal}
              title="Reset Sistem Perpustakaan"
              className="flex flex-col items-center justify-center px-3 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-600/90 text-red-200 hover:text-white border border-red-400/40 hover:border-red-500 transition-all shadow-sm group active:scale-95"
            >
              <ShieldAlert className="w-5 h-5 mb-0.5 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Reset</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
