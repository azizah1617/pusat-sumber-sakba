import React, { useState } from 'react';
import { Book, LoanMode, TabType } from '../types';
import {
  User,
  GraduationCap,
  Users,
  Calendar,
  BookPlus,
  Trash2,
  Check,
  AlertCircle,
  BookOpen,
} from 'lucide-react';

interface PinjamanTabProps {
  books: Book[];
  onProcessLoan: (params: {
    mode: LoanMode;
    borrower: string;
    className: string;
    durationDays: number;
    cart: Book[];
    bulkQuantity: number;
  }) => Promise<void>;
  showToast: (msg: string) => void;
  onNavigateTab: (tab: TabType) => void;
}

export const PinjamanTab: React.FC<PinjamanTabProps> = ({
  books,
  onProcessLoan,
  showToast,
}) => {
  const [mode, setMode] = useState<LoanMode>('murid');
  const [borrowerName, setBorrowerName] = useState('');
  const [borrowerClass, setBorrowerClass] = useState('');
  const [durationDays, setDurationDays] = useState(7);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [cart, setCart] = useState<Book[]>([]);
  const [bulkQuantity, setBulkQuantity] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableBooks = books.filter((b) => b.status === 'Tersedia');

  const handleModeChange = (newMode: LoanMode) => {
    setMode(newMode);
    setCart([]);
    setBorrowerName('');
    setBorrowerClass('');
    setBulkQuantity('');
    setSelectedBookId('');
  };

  const handleAddToCart = () => {
    if (!selectedBookId) {
      showToast('Pilih buku!');
      return;
    }
    if (cart.find((c) => c.id === selectedBookId)) {
      showToast('Sudah ditambah!');
      return;
    }
    const found = books.find((b) => b.id === selectedBookId);
    if (found) {
      setCart((prev) => [...prev, found]);
      setSelectedBookId('');
    }
  };

  const handleRemoveFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = borrowerName.trim();
    if (!cleanName) {
      showToast('Nama diperlukan!');
      return;
    }

    if (mode === 'murid' && cart.length === 0) {
      showToast('Sila pilih sekurang-kurangnya sebuah buku!');
      return;
    }

    if (mode === 'guru') {
      const qty = typeof bulkQuantity === 'number' ? bulkQuantity : parseInt(bulkQuantity, 10);
      if (!qty || qty < 1) {
        showToast('Sila masukkan bilangan buku pukal yang sah!');
        return;
      }
    }

    try {
      setIsSubmitting(true);
      await onProcessLoan({
        mode,
        borrower: cleanName,
        className: mode === 'murid' ? borrowerClass.trim() : 'GURU',
        durationDays: durationDays || 7,
        cart,
        bulkQuantity: typeof bulkQuantity === 'number' ? bulkQuantity : parseInt(bulkQuantity || '1', 10),
      });

      // Clear state after loan successfully recorded
      setBorrowerName('');
      setBorrowerClass('');
      setCart([]);
      setBulkQuantity('');
      setSelectedBookId('');
    } catch (err) {
      console.error(err);
      showToast('Ralat menyimpan pinjaman.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled =
    isSubmitting ||
    !borrowerName.trim() ||
    (mode === 'murid' && cart.length === 0) ||
    (mode === 'guru' && (!bulkQuantity || Number(bulkQuantity) <= 0));

  return (
    <section id="tab-pinjaman" className="space-y-6 animate-in fade-in duration-200">
      {/* Mode Switcher */}
      <div className="no-print bg-white p-2 rounded-2xl shadow-xs border border-slate-200/80 inline-flex flex-wrap gap-2">
        <button
          type="button"
          id="mode-murid"
          onClick={() => handleModeChange('murid')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            mode === 'murid'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Pinjaman Murid</span>
        </button>
        <button
          type="button"
          id="mode-guru"
          onClick={() => handleModeChange('guru')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            mode === 'guru'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Pinjaman Guru (Pukal)</span>
        </button>
      </div>

      {/* Main 2-Column Form Layout */}
      <form onSubmit={handleSubmitLoan}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Langkah 1: Maklumat Peminjam */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    1
                  </span>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                      Maklumat Peminjam
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      {mode === 'murid'
                        ? 'Sila masukkan nama pelajar & kelas'
                        : 'Sila masukkan nama guru peminjam'}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 uppercase">
                  {mode === 'murid' ? 'Individu' : 'Pukal'}
                </span>
              </div>

              <div className="space-y-4">
                {/* Nama Peminjam */}
                <div>
                  <label
                    id="label-name"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                  >
                    {mode === 'murid' ? 'Nama Pelajar' : 'Nama Guru'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="borrower-name"
                      required
                      value={borrowerName}
                      onChange={(e) => setBorrowerName(e.target.value)}
                      placeholder={mode === 'murid' ? 'Contoh: Muhammad Ali bin Ahmad' : 'Contoh: Cikgu Norazura'}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white text-sm outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Kelas (Hanya untuk Murid) */}
                {mode === 'murid' && (
                  <div id="field-class" className="animate-in fade-in duration-150">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Kelas
                    </label>
                    <input
                      type="text"
                      id="borrower-class"
                      required={mode === 'murid'}
                      value={borrowerClass}
                      onChange={(e) => setBorrowerClass(e.target.value)}
                      placeholder="Contoh: 4 Ibnu Sina, 2 Al-Farabi"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white text-sm outline-none transition-all"
                    />
                  </div>
                )}

                {/* Tempoh Pinjaman */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Tempoh Pinjaman (Hari)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      type="number"
                      id="loan-duration"
                      value={durationDays}
                      min="1"
                      max="60"
                      onChange={(e) => setDurationDays(parseInt(e.target.value, 10) || 1)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white text-sm outline-none transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Tarikh pemulangan akan dikira secara automatik ({durationDays} hari dari hari ini).
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-4 border-t border-slate-100">
              <button
                type="submit"
                id="btn-submit-loan"
                disabled={isSubmitDisabled}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 px-6 rounded-xl font-bold text-sm tracking-wider uppercase shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                {isSubmitting ? (
                  <span>Menyimpan Rekod...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Simpan Rekod Pinjaman</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Langkah 2: Pilih Buku */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200/80">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  2
                </span>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Pilih Buku / Kuantiti
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    {mode === 'murid'
                      ? 'Pilih buku dari koleksi sedia ada'
                      : 'Tetapkan kuantiti buku yang dipinjam secara pukal'}
                  </p>
                </div>
              </div>

              {mode === 'murid' && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700">
                  {availableBooks.length} Tersedia
                </span>
              )}
            </div>

            {/* Mode Murid: Select + Cart */}
            {mode === 'murid' && (
              <div id="section-murid" className="space-y-6">
                <div className="space-y-2 no-print">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Pilih Dari Koleksi Tersedia
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      id="book-select"
                      value={selectedBookId}
                      onChange={(e) => setSelectedBookId(e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white text-sm outline-none transition-all"
                    >
                      <option value="">-- Pilih Buku ({availableBooks.length} tersedia) --</option>
                      {availableBooks.map((book) => (
                        <option key={book.id} value={book.id}>
                          {book.title} ({book.id})
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <BookPlus className="w-4 h-4" />
                      <span>Tambah</span>
                    </button>
                  </div>
                  {availableBooks.length === 0 && (
                    <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Tiada buku sedia ada dalam koleksi. Sila daftar buku baharu terlebih dahulu di tab Senarai Buku.
                    </p>
                  )}
                </div>

                {/* Cart container */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Buku Dipilih ({cart.length})
                    </span>
                    {cart.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setCart([])}
                        className="text-xs text-red-500 hover:text-red-700 hover:underline"
                      >
                        Kosongkan
                      </button>
                    )}
                  </div>

                  <div
                    id="loan-cart"
                    className="space-y-2 max-h-72 overflow-y-auto pr-1 border border-slate-100 rounded-xl p-3 bg-slate-50/50"
                  >
                    {cart.length === 0 ? (
                      <div className="text-center py-8">
                        <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-slate-400 italic text-sm">
                          Belum ada buku dipilih untuk peminjam ini.
                        </p>
                        <p className="text-slate-400 text-xs mt-0.5">
                          Pilih buku di atas dan tekan butang "Tambah".
                        </p>
                      </div>
                    ) : (
                      cart.map((b, i) => (
                        <div
                          key={`${b.id}-${i}`}
                          className="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100/80 shadow-xs hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center">
                              {i + 1}
                            </span>
                            <div>
                              <p className="font-bold text-slate-800 text-sm">{b.title}</p>
                              <span className="text-[11px] font-mono text-slate-500">
                                No Perolehan: {b.id}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFromCart(i)}
                            className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            title="Buang buku dari pilihan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Mode Guru: Bulk Quantity */}
            {mode === 'guru' && (
              <div id="section-guru" className="space-y-6 py-4 animate-in fade-in duration-150">
                <div className="bg-purple-50/70 p-4 rounded-xl border border-purple-100 text-purple-900 text-xs sm:text-sm leading-relaxed">
                  Pinjaman guru memudahkan pinjaman berskala besar (pukal) untuk kegunaan pengajaran di bilik darjah, kelas membaca NILAM, atau aktiviti panitia.
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Bilangan Buku (Unit)
                  </label>
                  <div className="max-w-xs mx-auto">
                    <input
                      type="number"
                      id="bulk-quantity"
                      min="1"
                      max="500"
                      required={mode === 'guru'}
                      value={bulkQuantity}
                      onChange={(e) => {
                        const val = e.target.value;
                        setBulkQuantity(val === '' ? '' : parseInt(val, 10));
                      }}
                      placeholder="Contoh: 30"
                      className="block w-full px-4 py-4 border-2 border-purple-200 focus:border-purple-600 focus:ring-4 focus:ring-purple-100 rounded-2xl text-4xl font-extrabold text-center text-purple-900 outline-none transition-all shadow-inner"
                    />
                    <p className="text-center text-xs text-slate-500 mt-2">
                      Masukkan jumlah buku fizikal yang dipinjamkan
                    </p>
                  </div>
                </div>

                {/* Quick select presets for teachers */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  <span className="text-xs text-slate-400">Pilihan pantas:</span>
                  {[10, 20, 30, 40, 50].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setBulkQuantity(num)}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-700 transition-colors"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </section>
  );
};
