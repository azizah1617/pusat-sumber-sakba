import React, { useState } from 'react';
import { Loan } from '../types';
import {
  Search,
  Printer,
  CheckCircle2,
  Clock,
  RotateCcw,
  BookMarked,
} from 'lucide-react';

interface RekodTabProps {
  loans: Loan[];
  onReturnItem: (loanId: string) => Promise<void>;
  showToast: (msg: string) => void;
}

export const RekodTab: React.FC<RekodTabProps> = ({
  loans,
  onReturnItem,
  showToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Dipinjam' | 'Dikembalikan'>('Semua');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleReturn = async (loanId: string) => {
    try {
      setProcessingId(loanId);
      await onReturnItem(loanId);
    } catch (err) {
      console.error(err);
      showToast('Gagal memulangkan item.');
    } finally {
      setProcessingId(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredLoans = loans.filter((l) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      l.borrower.toLowerCase().includes(term) ||
      l.item.toLowerCase().includes(term) ||
      l.status.toLowerCase().includes(term) ||
      l.class.toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'Semua' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = loans.filter((l) => l.status === 'Dipinjam').length;

  return (
    <section id="tab-rekod" className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        {/* Header Toolbar */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 no-print">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Rekod Pinjaman Buku</h2>
              {activeCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300/60">
                  {activeCount} Aktif
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Sejarah dan rekod peminjaman aktif pelajar serta guru
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Filter pills */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              {(['Semua', 'Dipinjam', 'Dikembalikan'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    statusFilter === filter
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="search-records"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama, kelas, atau buku..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white text-xs sm:text-sm outline-none transition-all"
              />
            </div>

            {/* Print button */}
            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Senarai</span>
            </button>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-4 px-6">Peminjam</th>
                <th className="py-4 px-6">Buku / Item</th>
                <th className="py-4 px-6 text-center">Tarikh Pinjam &amp; Tamat</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right no-print">Tindakan</th>
              </tr>
            </thead>
            <tbody id="loans-table-body" className="text-sm divide-y divide-slate-100">
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-400">
                    <BookMarked className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium">Tiada rekod pinjaman ditemui.</p>
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                          {loan.borrower.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{loan.borrower}</p>
                          <span className="inline-block text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded mt-0.5">
                            {loan.class}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <p className="font-semibold text-slate-800">{loan.item}</p>
                      {loan.type === 'Pukal' ? (
                        <span className="inline-block text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded mt-1">
                          Pinjaman Pukal Guru ({loan.qty || 1} naskhah)
                        </span>
                      ) : (
                        loan.bookId && (
                          <span className="inline-block font-mono text-[11px] text-slate-400">
                            ID: {loan.bookId}
                          </span>
                        )
                      )}
                    </td>

                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <div className="text-xs text-slate-600 space-y-0.5">
                        <div>
                          <span className="text-slate-400">Pinjam: </span>
                          <span className="font-medium">{loan.date}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Pulang: </span>
                          <span className="font-bold text-blue-600">{loan.due}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          loan.status === 'Dipinjam'
                            ? 'bg-amber-100 text-amber-700 border border-amber-300/60'
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-300/60'
                        }`}
                      >
                        {loan.status === 'Dipinjam' ? (
                          <Clock className="w-3 h-3" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                        {loan.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right no-print whitespace-nowrap">
                      {loan.status === 'Dipinjam' ? (
                        <button
                          onClick={() => handleReturn(loan.id)}
                          disabled={processingId === loan.id}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-xl font-bold text-xs transition-all shadow-xs border border-blue-200 hover:border-transparent active:scale-95 disabled:opacity-50"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>{processingId === loan.id ? 'Memproses...' : 'Terima'}</span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Selesai</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Cards */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredLoans.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <BookMarked className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-medium text-sm">Tiada rekod pinjaman ditemui.</p>
            </div>
          ) : (
            filteredLoans.map((loan) => (
              <div key={loan.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{loan.borrower}</h4>
                    <span className="inline-block text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {loan.class}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      loan.status === 'Dipinjam'
                        ? 'bg-amber-100 text-amber-700 border border-amber-300/60'
                        : 'bg-emerald-100 text-emerald-700 border border-emerald-300/60'
                    }`}
                  >
                    {loan.status}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                  <p className="font-bold text-slate-800 text-sm">{loan.item}</p>
                  <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-200/60">
                    <span>Pinjam: {loan.date}</span>
                    <span className="font-bold text-blue-600">Pulang: {loan.due}</span>
                  </div>
                </div>

                {loan.status === 'Dipinjam' && (
                  <div className="pt-1 no-print">
                    <button
                      onClick={() => handleReturn(loan.id)}
                      disabled={processingId === loan.id}
                      className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 active:scale-98"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{processingId === loan.id ? 'Memproses...' : 'Terima Pemulangan Buku'}</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
