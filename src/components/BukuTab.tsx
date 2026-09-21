import React, { useState } from 'react';
import { Book } from '../types';
import {
  BookOpen,
  Plus,
  Search,
  Trash2,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface BukuTabProps {
  books: Book[];
  onAddBook: (id: string, title: string) => Promise<void>;
  onDeleteBook: (id: string) => Promise<void>;
  showToast: (msg: string) => void;
}

export const BukuTab: React.FC<BukuTabProps> = ({
  books,
  onAddBook,
  onDeleteBook,
  showToast,
}) => {
  const [bookId, setBookId] = useState('');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Tersedia' | 'Dipinjam'>('Semua');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = bookId.trim();
    const cleanTitle = title.trim();

    if (!cleanId || !cleanTitle) {
      showToast('Sila lengkapkan No Perolehan dan Judul Buku.');
      return;
    }

    // Check duplicate ID
    if (books.some((b) => b.id.toLowerCase() === cleanId.toLowerCase())) {
      showToast(`No Perolehan "${cleanId}" telah wujud dalam sistem!`);
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddBook(cleanId, cleanTitle);
      setBookId('');
      setTitle('');
    } catch (err) {
      console.error(err);
      showToast('Ralat pendaftaran buku.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Padam buku ini?')) {
      try {
        await onDeleteBook(id);
      } catch (err) {
        console.error(err);
        showToast('Gagal memadam buku.');
      }
    }
  };

  // Filter books
  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Semua' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <section id="tab-buku" className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Tambah Buku Baru Card */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-xs border border-slate-200/80 no-print">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Tambah Buku Baru</h2>
            <p className="text-xs text-slate-500 font-medium">
              Daftarkan koleksi fizikal ke dalam sistem perpustakaan
            </p>
          </div>
        </div>

        <form id="book-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
          <div className="md:col-span-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              No Perolehan
            </label>
            <input
              type="text"
              id="book-id-manual"
              required
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              placeholder="Contoh: B-0012, SAKBA-882"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white text-sm outline-none transition-all font-mono"
            />
          </div>

          <div className="md:col-span-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Judul Buku
            </label>
            <input
              type="text"
              id="book-title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Sejarah Tingkatan 4, Fizik Kuantum Asas"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white text-sm outline-none transition-all"
            />
          </div>

          <div className="md:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={isSubmitting || !bookId.trim() || !title.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 px-4 rounded-xl font-bold text-sm shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Senarai Buku Table Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">Senarai Koleksi Buku</h3>
            <p className="text-xs text-slate-500">
              Menunjukkan {filteredBooks.length} daripada {books.length} buah buku
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            {/* Filter pills */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              {(['Semua', 'Tersedia', 'Dipinjam'] as const).map((filter) => (
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
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari judul atau no perolehan..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white text-xs sm:text-sm outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Desktop & Tablet Table */}
        <div className="overflow-x-auto hidden sm:block">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-4 pl-6">No Perolehan</th>
                <th className="p-4">Judul Buku</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right no-print">Aksi</th>
              </tr>
            </thead>
            <tbody id="books-table-body" className="text-sm divide-y divide-slate-100">
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">
                    <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium">Tiada buku ditemui.</p>
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 pl-6 font-mono text-xs font-bold text-slate-700">
                      <span className="bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                        {book.id}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-900">{book.title}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          book.status === 'Tersedia'
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-300/60'
                            : 'bg-amber-100 text-amber-700 border border-amber-300/60'
                        }`}
                      >
                        {book.status === 'Tersedia' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {book.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right no-print">
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="inline-flex items-center gap-1 text-slate-400 hover:text-red-600 font-medium text-xs p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Padam buku dari sistem"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Padam</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Cards */}
        <div className="sm:hidden divide-y divide-slate-100">
          {filteredBooks.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-medium text-sm">Tiada buku ditemui.</p>
            </div>
          ) : (
            filteredBooks.map((book) => (
              <div key={book.id} className="p-4 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="inline-block font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {book.id}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm leading-tight">{book.title}</h4>
                  <div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        book.status === 'Tersedia'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {book.status}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(book.id)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors no-print"
                  title="Padam buku"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
