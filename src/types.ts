export interface Book {
  id: string;
  title: string;
  status: 'Tersedia' | 'Dipinjam';
  category?: string;
  createdAt?: any;
}

export interface Loan {
  id: string;
  borrower: string;
  class: string;
  item: string;
  bookId?: string;
  type: 'Individu' | 'Pukal';
  qty?: number;
  rawDate: any;
  date: string;
  due: string;
  status: 'Dipinjam' | 'Dikembalikan';
}

export type TabType = 'dashboard' | 'pinjaman' | 'buku' | 'rekod' | 'analisis';
export type LoanMode = 'murid' | 'guru';
