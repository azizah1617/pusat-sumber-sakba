import React from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div
      id="toast"
      className="fixed bottom-5 right-5 max-w-sm w-full bg-slate-900/95 text-white px-4 py-3 rounded-xl shadow-2xl backdrop-blur-xs border border-slate-700/60 flex items-center justify-between gap-3 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 no-print"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></div>
        <p className="text-xs sm:text-sm font-medium leading-tight">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors flex-shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
