import React from 'react';

interface PrintHeaderProps {
  printDate: string;
}

export const PrintHeader: React.FC<PrintHeaderProps> = ({ printDate }) => {
  return (
    <div className="print-only text-center mb-8 border-b-2 border-black pb-4 pt-2">
      <h1 className="text-2xl font-bold uppercase tracking-tight text-black">
        Laporan Analisis Pinjaman Perpustakaan
      </h1>
      <p className="text-lg font-semibold text-black mt-1">
        SM Sains Kepala Batas (SAKBA)
      </p>
      <p className="text-sm text-gray-700 font-medium">
        Pusat Sumber &amp; Media Pembelajaran
      </p>
      <p id="print-date" className="text-xs italic mt-2 text-gray-600">
        {printDate ? `Dijana pada: ${printDate}` : ''}
      </p>
    </div>
  );
};
