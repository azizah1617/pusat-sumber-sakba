import React, { useState } from 'react';
import { X, KeyRound, AlertTriangle } from 'lucide-react';
import { MASTER_PASSWORD } from '../lib/firebase';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => Promise<void>;
  showToast: (msg: string) => void;
}

export const ResetModal: React.FC<ResetModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
  showToast,
}) => {
  const [password, setPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== MASTER_PASSWORD) {
      showToast('Katalaluan salah!');
      return;
    }

    if (!window.confirm('ADAKAH ANDA PASTI? Tindakan ini tidak boleh diundur.')) {
      return;
    }

    try {
      setIsDeleting(true);
      showToast('Sedang memadam data...');
      await onConfirmReset();
      setPassword('');
      onClose();
    } catch (err) {
      console.error(err);
      showToast('Ralat semasa memadam data.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      id="reset-modal"
      className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all no-print animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl p-6 sm:p-7 w-full max-w-md shadow-2xl border border-red-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          disabled={isDeleting}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Pengesahan Reset Sistem</h3>
            <p className="text-xs text-slate-500 font-medium">Tindakan Pentadbir SAKBA</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-5 leading-relaxed bg-red-50/60 p-3.5 rounded-xl border border-red-100 text-red-900">
          Semua data buku dan rekod pinjaman akan dipadamkan secara kekal dari pangkalan data. Sila masukkan katalaluan pentadbir untuk meneruskan:
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Katalaluan Pentadbir
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="password"
                id="reset-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                disabled={isDeleting}
                placeholder="Masukkan katalaluan..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-sm transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isDeleting || !password}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isDeleting ? 'Memadam...' : 'Padam Semua'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
