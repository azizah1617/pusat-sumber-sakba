import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Book, Loan, TabType, LoanMode } from './types';
import {
  auth,
  db,
  getBooksRef,
  getLoansRef,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  deleteDoc,
  Timestamp,
  writeBatch,
  signInAnonymously,
  onAuthStateChanged,
  User,
} from './lib/firebase';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DashboardTab } from './components/DashboardTab';
import { PinjamanTab } from './components/PinjamanTab';
import { BukuTab } from './components/BukuTab';
import { RekodTab } from './components/RekodTab';
import { AnalisisTab } from './components/AnalisisTab';
import { ResetModal } from './components/ResetModal';
import { Toast } from './components/Toast';
import { PrintHeader } from './components/PrintHeader';

// Local storage key for offline cache fallback
const LOCAL_BOOKS_KEY = 'sakba_library_books_cache';
const LOCAL_LOANS_KEY = 'sakba_library_loans_cache';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_BOOKS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loans, setLoans] = useState<Loan[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_LOANS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [syncState, setSyncState] = useState<'connecting' | 'connected' | 'offline'>('connecting');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [printDate, setPrintDate] = useState<string>('');
  const toastTimeoutRef = useRef<any>(null);

  // Toast helper matching window.showToast
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Expose showToast to window if needed
  useEffect(() => {
    (window as any).showToast = showToast;
  }, [showToast]);

  // Save to local cache whenever state updates
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_BOOKS_KEY, JSON.stringify(books));
    } catch (e) {
      console.warn('Local storage error:', e);
    }
  }, [books]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_LOANS_KEY, JSON.stringify(loans));
    } catch (e) {
      console.warn('Local storage error:', e);
    }
  }, [loans]);

  // Initialize Firebase Auth & Real-Time Listeners
  useEffect(() => {
    let unsubscribeBooks: (() => void) | null = null;
    let unsubscribeLoans: (() => void) | null = null;

    const initFirebase = async () => {
      try {
        setSyncState('connecting');
        const cred = await signInAnonymously(auth);
        setCurrentUser(cred.user);
        setSyncState('connected');
      } catch (err) {
        console.warn('Firebase Auth Anonymous warning, retrying or fallback:', err);
        setSyncState('offline');
      }
    };

    initFirebase();

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        setSyncState('connected');

        try {
          const booksRef = getBooksRef();
          const loansRef = getLoansRef();

          // Listen to Books collection
          unsubscribeBooks = onSnapshot(
            booksRef,
            (snapshot) => {
              const loadedBooks: Book[] = snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...(docSnap.data() as any),
              }));
              setBooks(loadedBooks);
              setSyncState('connected');
            },
            (err) => {
              console.error('Books onSnapshot error:', err);
              setSyncState('offline');
            }
          );

          // Listen to Loans collection
          unsubscribeLoans = onSnapshot(
            loansRef,
            (snapshot) => {
              const loadedLoans: Loan[] = snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...(docSnap.data() as any),
              }));
              // Sort descending by rawDate
              loadedLoans.sort((a, b) => {
                const aSec = a.rawDate?.seconds || (a.rawDate ? new Date(a.rawDate).getTime() / 1000 : 0);
                const bSec = b.rawDate?.seconds || (b.rawDate ? new Date(b.rawDate).getTime() / 1000 : 0);
                return bSec - aSec;
              });
              setLoans(loadedLoans);
              setSyncState('connected');
            },
            (err) => {
              console.error('Loans onSnapshot error:', err);
              setSyncState('offline');
            }
          );
        } catch (err) {
          console.error('Firestore subscription error:', err);
          setSyncState('offline');
        }
      } else {
        signInAnonymously(auth).catch(() => setSyncState('offline'));
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeBooks) unsubscribeBooks();
      if (unsubscribeLoans) unsubscribeLoans();
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // Process New Loan (Murid or Guru) - 100% exact business logic
  const handleProcessLoan = async ({
    mode,
    borrower,
    className,
    durationDays,
    cart,
    bulkQuantity,
  }: {
    mode: LoanMode;
    borrower: string;
    className: string;
    durationDays: number;
    cart: Book[];
    bulkQuantity: number;
  }) => {
    const now = Timestamp.fromDate(new Date());
    const days = durationDays || 7;
    const due = new Date();
    due.setDate(due.getDate() + days);

    const dateStr = new Date().toLocaleDateString('ms-MY');
    const dueStr = due.toLocaleDateString('ms-MY');

    const loansRef = getLoansRef();
    const booksRef = getBooksRef();

    if (mode === 'murid') {
      const newLoansToAdd: Loan[] = [];
      for (const book of cart) {
        const loanId = `L-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        const loanData = {
          borrower,
          class: className,
          item: book.title,
          bookId: book.id,
          type: 'Individu' as const,
          rawDate: now,
          date: dateStr,
          due: dueStr,
          status: 'Dipinjam' as const,
        };

        newLoansToAdd.push({ id: loanId, ...loanData });

        // Update in Firestore
        try {
          await setDoc(doc(loansRef, loanId), loanData);
          await updateDoc(doc(booksRef, book.id), { status: 'Dipinjam' });
        } catch (e) {
          console.warn('Offline fallback for loan creation:', e);
        }
      }

      // Also update local state optimistically
      setLoans((prev) => [
        ...newLoansToAdd,
        ...prev.filter((p) => !newLoansToAdd.some((n) => n.id === p.id)),
      ]);
      setBooks((prev) =>
        prev.map((b) => (cart.some((c) => c.id === b.id) ? { ...b, status: 'Dipinjam' } : b))
      );
    } else {
      // Guru (Pukal)
      const qty = bulkQuantity || 1;
      const loanId = `P-${Date.now()}`;
      const loanData = {
        borrower,
        class: 'GURU',
        item: `${qty} Buku (Pukal)`,
        qty: qty,
        type: 'Pukal' as const,
        rawDate: now,
        date: dateStr,
        due: dueStr,
        status: 'Dipinjam' as const,
      };

      try {
        await setDoc(doc(loansRef, loanId), loanData);
      } catch (e) {
        console.warn('Offline fallback for bulk loan:', e);
      }

      setLoans((prev) => [{ id: loanId, ...loanData }, ...prev]);
    }

    showToast('Pinjaman direkodkan!');
    setCurrentTab('rekod');
  };

  // Return Item (Pulangkan buku) - 100% exact business logic
  const handleReturnItem = async (loanId: string) => {
    const loan = loans.find((l) => l.id === loanId);
    if (!loan) return;

    const loansRef = getLoansRef();
    const booksRef = getBooksRef();

    try {
      await updateDoc(doc(loansRef, loanId), { status: 'Dikembalikan' });
      if (loan.bookId) {
        await updateDoc(doc(booksRef, loan.bookId), { status: 'Tersedia' });
      }
    } catch (e) {
      console.warn('Firestore updateDoc fallback to local:', e);
    }

    // Update local state optimistically
    setLoans((prev) =>
      prev.map((l) => (l.id === loanId ? { ...l, status: 'Dikembalikan' } : l))
    );
    if (loan.bookId) {
      setBooks((prev) =>
        prev.map((b) => (b.id === loan.bookId ? { ...b, status: 'Tersedia' } : b))
      );
    }

    showToast('Item dipulangkan.');
  };

  // Add Book - 100% exact business logic
  const handleAddBook = async (id: string, title: string) => {
    const booksRef = getBooksRef();
    const newBook: Book = { id, title, status: 'Tersedia' };

    try {
      await setDoc(doc(booksRef, id), { title, status: 'Tersedia' });
    } catch (e) {
      console.warn('Firestore setDoc book fallback:', e);
    }

    setBooks((prev) => [...prev.filter((b) => b.id !== id), newBook]);
    showToast('Buku didaftarkan!');
  };

  // Delete Book - 100% exact business logic
  const handleDeleteBook = async (id: string) => {
    const booksRef = getBooksRef();
    try {
      await deleteDoc(doc(booksRef, id));
    } catch (e) {
      console.warn('Firestore deleteDoc fallback:', e);
    }

    setBooks((prev) => prev.filter((b) => b.id !== id));
    showToast('Buku dipadam.');
  };

  // System Master Reset - 100% exact business logic
  const handleConfirmReset = async () => {
    const booksRef = getBooksRef();
    const loansRef = getLoansRef();

    try {
      const booksSnap = await getDocs(booksRef);
      const loansSnap = await getDocs(loansRef);

      const batch = writeBatch(db);
      booksSnap.forEach((d) => batch.delete(d.ref));
      loansSnap.forEach((d) => batch.delete(d.ref));

      await batch.commit();
    } catch (err) {
      console.warn('Reset batch error or offline clear:', err);
    }

    // Clear state and local caches
    setBooks([]);
    setLoans([]);
    localStorage.removeItem(LOCAL_BOOKS_KEY);
    localStorage.removeItem(LOCAL_LOANS_KEY);

    showToast('Sistem berjaya direset semula.');
  };

  // Print Handlers
  const handlePrintAnalysis = () => {
    const dateStr = new Date().toLocaleDateString('ms-MY', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    setPrintDate(dateStr);
    setTimeout(() => {
      window.print();
    }, 50);
  };

  const activeLoansCount = loans.filter((l) => l.status === 'Dipinjam').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Official Print Header */}
      <PrintHeader printDate={printDate} />

      {/* Main Header */}
      <Header
        onOpenResetModal={() => setIsResetModalOpen(true)}
        isOnline={navigator.onLine}
        syncState={syncState}
      />

      {/* Navigation Tab Bar */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeLoansCount={activeLoansCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'dashboard' && (
          <DashboardTab
            books={books}
            loans={loans}
            onNavigateTab={setCurrentTab}
            onPrintReport={handlePrintAnalysis}
          />
        )}

        {currentTab === 'pinjaman' && (
          <PinjamanTab
            books={books}
            onProcessLoan={handleProcessLoan}
            showToast={showToast}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'buku' && (
          <BukuTab
            books={books}
            onAddBook={handleAddBook}
            onDeleteBook={handleDeleteBook}
            showToast={showToast}
          />
        )}

        {currentTab === 'rekod' && (
          <RekodTab
            loans={loans}
            onReturnItem={handleReturnItem}
            showToast={showToast}
          />
        )}

        {currentTab === 'analisis' && (
          <AnalisisTab
            loans={loans}
            onPrintAnalysis={handlePrintAnalysis}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200/80 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Hak Cipta Terpelihara &copy; {new Date().getFullYear()} Pusat Sumber &amp; Media SM Sains Kepala Batas (SAKBA)
          </span>
          <span className="font-medium text-slate-400">
            Sistem Pengurusan Rekod Perpustakaan Digital
          </span>
        </div>
      </footer>

      {/* Reset Confirmation Modal */}
      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={handleConfirmReset}
        showToast={showToast}
      />

      {/* Floating Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
