// src/utils/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, increment } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:      process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain:  process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId:   process.env.REACT_APP_FIREBASE_PROJECT_ID,
  appId:       process.env.REACT_APP_FIREBASE_APP_ID,
};

const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

/* ── Auth helpers ─────────────────────────────────────────────────── */

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function logOut() {
  await signOut(auth);
}

/* ── Usage helpers ────────────────────────────────────────────────── */

const FREE_LIMIT = 2;

/**
 * Returns { freeUsed, totalPaid, canAnalyzeFree }
 */
export async function getUserUsage(uid) {
  const ref  = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { freeUsed: 0, totalPaid: 0 });
    return { freeUsed: 0, totalPaid: 0, canAnalyzeFree: true };
  }
  const { freeUsed = 0, totalPaid = 0 } = snap.data();
  return { freeUsed, totalPaid, canAnalyzeFree: freeUsed < FREE_LIMIT };
}

/** Call after a successful FREE analysis */
export async function incrementFreeUsage(uid) {
  const ref = doc(db, 'users', uid);
  await setDoc(ref, { freeUsed: increment(1) }, { merge: true });
}

/** Call after Razorpay payment verified */
export async function incrementPaidUsage(uid) {
  const ref = doc(db, 'users', uid);
  await setDoc(ref, { totalPaid: increment(1) }, { merge: true });
}
