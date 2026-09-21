import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  deleteDoc,
  Timestamp,
  writeBatch,
  CollectionReference,
  DocumentData,
} from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyAd_e_BrfjYQqjIXXn4r_BeRE5H_IVE8F8",
  authDomain: "perpustakaan-sakba.firebaseapp.com",
  projectId: "perpustakaan-sakba",
  storageBucket: "perpustakaan-sakba.firebasestorage.app",
  messagingSenderId: "864328607281",
  appId: "1:864328607281:web:6b915b0190e054d4e69710",
  measurementId: "G-GYL8W7LYGE"
};

export const MASTER_PASSWORD = "SAKBA2024";

// Initialize Firebase App singleton
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);

export const getAppId = (): string => {
  if (typeof window !== 'undefined' && (window as any).__app_id) {
    return (window as any).__app_id;
  }
  return 'sakba-perpustakaan-v1';
};

export const getBooksRef = (): CollectionReference<DocumentData> => {
  const appId = getAppId();
  return collection(db, 'artifacts', appId, 'public', 'data', 'books');
};

export const getLoansRef = (): CollectionReference<DocumentData> => {
  const appId = getAppId();
  return collection(db, 'artifacts', appId, 'public', 'data', 'loans');
};

export {
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
};
export type { User };
