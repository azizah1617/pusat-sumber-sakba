import React from 'react';
import { Book, Loan, TabType } from '../types';
import {
  BookOpen,
  BookMarked,
  CheckCircle2,
  ArrowRight,
  PlusCircle,
  BookUp2,
  History,
  Clock,
} from 'lucide-react';

interface DashboardTabProps {
  books: Book[];
  loans: Loan[];
  onNavigateTab: (tab: TabType) => void;
  onPrintReport: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  books,
  loans,
  onNavigateTab,
}) => {
  const totalBooks = books.length;
  const borrowedLoans = loans.filter((l) => l.status === 'Dipinjam');
  const borrowedCount = borrowedLoans.length;
  const availableCount = books.filter((b) => b.status === 'Tersedia').length;

  const recentLoans = loans.slice(0, 5);

  return (
    <section id="tab-dashboard" className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 bg-white/15 backdrop-blur-xs rounded-full text-xs font-semibold tracking-wide uppercase text-blue-100 mb-3 border border-white/20">
              Pusat Sumber &amp; Media SAKBA
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Datang ke Sistem Rekod Perpustakaan
            </h2>
            <p className="text-blue-100 text-sm sm:text-base mt-2 leading-relaxed">
              Pengurusan peminjaman buku murid dan guru secara sistematik, pantas dan diselaraskan secara langsung dengan Cloud Sync.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            <button
              onClick={() => onNavigateTab('pinjaman')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-blue-800 hover:bg-blue-50 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95"
            >
              <BookUp2 className="w-4 h-4 text-blue-700" />
              Pinjam Buku
            </button>
            <button
              onClick={() => onNavigateTab('buku')}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600/80 hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              Tambah Buku
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Books */}
        <div
          onClick={() => onNavigateTab('buku')}
          className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-500 text-xs sm:text-sm font-semibold uppercase tracking-wider">
              Jumlah Koleksi Buku
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <p id="stat-total-books" className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            {totalBooks}
          </p>
          <div className="mt-3 flex items-center text-xs text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
            <span>Lihat katalog lengkap</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        {/* Currently Borrowed */}
        <div
          id="stat-borrowed-card"
          onClick={() => onNavigateTab('rekod')}
          className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 hover:border-amber-400 hover:shadow-md transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-500 text-xs sm:text-sm font-semibold uppercase tracking-wider">
              Sedang Dipinjam
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookMarked className="w-5 h-5" />
            </div>
          </div>
          <p id="stat-borrowed" className="text-3xl sm:text-4xl font-extrabold text-amber-600 tracking-tight">
            {borrowedCount}
          </p>
          <div className="mt-3 flex items-center text-xs text-amber-600 font-medium group-hover:translate-x-1 transition-transform">
            <span>Semak rekod pinjaman aktif</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        {/* Available Books */}
        <div
          onClick={() => onNavigateTab('pinjaman')}
          className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 hover:border-emerald-400 hover:shadow-md transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-500 text-xs sm:text-sm font-semibold uppercase tracking-wider">
              Buku Tersedia
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p id="stat-available" className="text-3xl sm:text-4xl font-extrabold text-emerald-600 tracking-tight">
            {availableCount}
          </p>
          <div className="mt-3 flex items-center text-xs text-emerald-600 font-medium group-hover:translate-x-1 transition-transform">
            <span>Sedia untuk dipinjam</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800">Aktiviti Terkini</h3>
              <p className="text-xs text-slate-500">Rekod transaksi terkini di perpustakaan</p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('rekod')}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
          >
            <span>Semua Rekod</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          {recentLoans.length === 0 ? (
            <div className="p-8 text-center">
              <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 font-medium text-sm">Belum ada sebarang aktiviti pinjaman.</p>
              <p className="text-slate-400 text-xs mt-1">
                Pinjaman yang dibuat akan dipaparkan di sini secara automatik.
              </p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/75 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3.5 px-5">Peminjam</th>
                  <th className="py-3.5 px-5">Item / Buku</th>
                  <th className="py-3.5 px-5 text-center">Tarikh</th>
                  <th className="py-3.5 px-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody id="recent-activity-body" className="text-sm divide-y divide-slate-100">
                {recentLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold uppercase">
                          {loan.borrower.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 leading-tight">{loan.borrower}</p>
                          <span className="inline-block text-[11px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded mt-0.5">
                            {loan.class}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-slate-700">
                      <span className="font-medium line-clamp-1 max-w-[240px] sm:max-w-none">
                        {loan.item}
                      </span>
                      {loan.type === 'Pukal' && (
                        <span className="text-[10px] text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded font-semibold ml-1.5">
                          Pukal Guru
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-center text-xs text-slate-500 font-medium whitespace-nowrap">
                      {loan.date}
                    </td>
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          loan.status === 'Dipinjam'
                            ? 'bg-amber-100 text-amber-700 border border-amber-300/60'
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-300/60'
                        }`}
                      >
                        {loan.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
};
