import React, { useMemo } from 'react';
import { Loan } from '../types';
import { Printer, TrendingUp, Info, Users, GraduationCap, BarChart2 } from 'lucide-react';

interface AnalisisTabProps {
  loans: Loan[];
  onPrintAnalysis: () => void;
}

export const AnalisisTab: React.FC<AnalisisTabProps> = ({
  loans,
  onPrintAnalysis,
}) => {
  const currentYear = new Date().getFullYear();
  const months = [
    'Januari',
    'Februari',
    'Mac',
    'April',
    'Mei',
    'Jun',
    'Julai',
    'Ogos',
    'September',
    'Oktober',
    'November',
    'Disember',
  ];

  const analysisData = useMemo(() => {
    return months.map((monthName, idx) => {
      let mCount = 0;
      let gCount = 0;

      loans.forEach((l) => {
        let d: Date | null = null;
        if (l.rawDate) {
          if (typeof l.rawDate.toDate === 'function') {
            d = l.rawDate.toDate();
          } else if (l.rawDate instanceof Date) {
            d = l.rawDate;
          } else if (typeof l.rawDate.seconds === 'number') {
            d = new Date(l.rawDate.seconds * 1000);
          } else if (typeof l.rawDate === 'string') {
            d = new Date(l.rawDate);
          }
        }

        if (d && !isNaN(d.getTime())) {
          if (d.getFullYear() === currentYear && d.getMonth() === idx) {
            if (l.type === 'Pukal' || l.class === 'GURU') {
              gCount += l.qty || 1;
            } else {
              mCount += 1;
            }
          }
        }
      });

      return {
        month: monthName,
        muridCount: mCount,
        guruCount: gCount,
        total: mCount + gCount,
      };
    });
  }, [loans, currentYear]);

  const yearTotals = useMemo(() => {
    return analysisData.reduce(
      (acc, item) => {
        acc.murid += item.muridCount;
        acc.guru += item.guruCount;
        acc.total += item.total;
        return acc;
      },
      { murid: 0, guru: 0, total: 0 }
    );
  }, [analysisData]);

  const maxMonthTotal = Math.max(...analysisData.map((a) => a.total), 1);

  return (
    <section id="tab-analisis" className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Annual Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 no-print">
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Jumlah Pinjaman Murid ({currentYear})
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{yearTotals.murid}</p>
          <span className="text-[11px] text-slate-400">Peminjaman buku individu</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Jumlah Pinjaman Guru ({currentYear})
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-purple-700">{yearTotals.guru}</p>
          <span className="text-[11px] text-slate-400">Jumlah kuantiti buku pukal</span>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-5 rounded-2xl shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center backdrop-blur-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
              Jumlah Keseluruhan ({currentYear})
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">{yearTotals.total}</p>
          <span className="text-[11px] text-blue-200">Jumlah pergerakan buku setakat ini</span>
        </div>
      </div>

      {/* Visual Distribution Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 no-print">
        <div className="flex items-center gap-2 mb-6">
          <BarChart2 className="w-5 h-5 text-blue-600" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Graf Trend Pinjaman Bulanan ({currentYear})
          </h3>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 sm:gap-3 items-end h-44 sm:h-52 pt-6 pb-2 border-b border-slate-100">
          {analysisData.map((d) => {
            const heightPercent = d.total > 0 ? Math.max((d.total / maxMonthTotal) * 100, 8) : 4;
            return (
              <div key={d.month} className="flex flex-col items-center h-full justify-end group">
                <span className="text-[10px] font-bold text-blue-700 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {d.total}
                </span>
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 ${
                    d.total > 0
                      ? 'bg-gradient-to-t from-blue-600 to-indigo-500 group-hover:from-blue-700 group-hover:to-indigo-600 shadow-xs'
                      : 'bg-slate-100'
                  }`}
                  title={`${d.month}: ${d.total} (${d.muridCount} murid, ${d.guruCount} guru)`}
                ></div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-2 truncate w-full text-center">
                  {d.month.slice(0, 3)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Analysis Table Card */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-xs border border-slate-200/80">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 no-print">
          <div>
            <h2 id="analysis-title" className="text-lg sm:text-xl font-bold text-slate-900">
              Analisis Pinjaman Bulanan ({currentYear})
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Jadual statistik pecahan pinjaman mengikut kategori setiap bulan
            </p>
          </div>

          <button
            onClick={onPrintAnalysis}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Laporan</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-700 text-xs sm:text-sm uppercase tracking-wider">
              <tr>
                <th className="p-3.5 sm:p-4 border border-slate-200 font-bold">Bulan</th>
                <th className="p-3.5 sm:p-4 border border-slate-200 text-center font-bold">
                  Pinjaman Murid
                </th>
                <th className="p-3.5 sm:p-4 border border-slate-200 text-center font-bold">
                  Pinjaman Guru (Item)
                </th>
                <th className="p-3.5 sm:p-4 border border-slate-200 text-center font-extrabold bg-blue-50/80 text-blue-900">
                  Jumlah Keseluruhan
                </th>
              </tr>
            </thead>
            <tbody id="analysis-table-body" className="text-xs sm:text-sm divide-y divide-slate-200">
              {analysisData.map((row) => (
                <tr key={row.month} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 sm:p-4 border border-slate-200 font-medium text-slate-800">
                    {row.month}
                  </td>
                  <td className="p-3.5 sm:p-4 border border-slate-200 text-center font-semibold text-slate-700">
                    {row.muridCount}
                  </td>
                  <td className="p-3.5 sm:p-4 border border-slate-200 text-center font-semibold text-purple-700">
                    {row.guruCount}
                  </td>
                  <td className="p-3.5 sm:p-4 border border-slate-200 text-center font-bold text-blue-700 bg-blue-50/30">
                    {row.total}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-100 font-bold text-xs sm:text-sm border-t-2 border-slate-300">
              <tr>
                <td className="p-3.5 sm:p-4 border border-slate-200 text-slate-900 uppercase">
                  Jumlah Keseluruhan ({currentYear})
                </td>
                <td className="p-3.5 sm:p-4 border border-slate-200 text-center text-slate-900">
                  {yearTotals.murid}
                </td>
                <td className="p-3.5 sm:p-4 border border-slate-200 text-center text-purple-800">
                  {yearTotals.guru}
                </td>
                <td className="p-3.5 sm:p-4 border border-slate-200 text-center text-blue-800 bg-blue-100/70 font-extrabold">
                  {yearTotals.total}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Nota Analisis */}
        <div className="mt-8 p-5 sm:p-6 bg-slate-50 rounded-xl border border-slate-200 no-print">
          <div className="flex items-center gap-2 mb-2 text-slate-800">
            <Info className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-800">Nota Analisis:</h3>
          </div>
          <ul className="text-xs sm:text-sm text-slate-600 list-disc list-inside space-y-1.5 pl-1 leading-relaxed">
            <li>Data dikira berdasarkan tarikh pinjaman dibuat mengikut pangkalan data awan.</li>
            <li>Pinjaman Guru dikira berdasarkan jumlah kuantiti buku yang dipinjam secara pukal.</li>
            <li>Jumlah Keseluruhan menggabungkan semua aktiviti pinjaman dalam bulan tersebut.</li>
          </ul>
        </div>
      </div>
    </section>
  );
};
