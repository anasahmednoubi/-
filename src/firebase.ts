import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  linkWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
  onAuthStateChanged,
  signInWithCredential,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocFromServer,
} from 'firebase/firestore';
import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import firebaseConfig from '../firebase-applet-config.json';

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db =
  firebaseConfig.firestoreDatabaseId &&
  firebaseConfig.firestoreDatabaseId !== '(default)'
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);

export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('the client is offline')
    ) {
      console.warn('Firebase client offline check:', error);
    }
  }
}

export async function signInWithGoogle(): Promise<User> {
  if (Capacitor.isNativePlatform()) {
    try {
      const res = await FirebaseAuthentication.signInWithGoogle();
      if (res.credential?.idToken) {
        const credential = GoogleAuthProvider.credential(res.credential.idToken);
        const userCred = await signInWithCredential(auth, credential);
        return userCred.user;
      }
      if (auth.currentUser) {
        return auth.currentUser;
      }
      throw new Error('لم يتم استلام بيانات الحساب من خدمة Google');
    } catch (err: any) {
      console.error('Native Google Sign In Error:', err);
      throw err;
    }
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function signInWithFacebook(): Promise<User> {
  const provider = new FacebookAuthProvider();
  provider.addScope('public_profile');
  provider.addScope('email');

  if (auth.currentUser) {
    try {
      const result = await linkWithPopup(auth.currentUser, provider);
      return result.user;
    } catch (linkErr: any) {
      if (linkErr.code === 'auth/credential-already-in-use') {
        const result = await signInWithPopup(auth, provider);
        return result.user;
      }
      throw linkErr;
    }
  } else {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  }
}

export async function signUpWithEmail(
  email: string,
  pass: string,
  name?: string
): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  if (name && name.trim()) {
    await updateProfile(cred.user, { displayName: name.trim() });
  }
  return auth.currentUser || cred.user;
}

export async function signInWithEmail(
  email: string,
  pass: string
): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  return cred.user;
}

export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function logOutFromGoogle(): Promise<void> {
  await signOut(auth);
}

export async function logOutFromFacebook(): Promise<void> {
  await signOut(auth);
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function syncUserData(
  userId: string,
  localTasks: any[],
  localRoutines: any[],
  profile: any,
  lastTs: number
): Promise<{ tasks: any[]; routines: any[]; profile: any; ts: number }> {
  const ref = doc(db, 'users', userId, 'data', 'backup');
  const snap = await getDoc(ref);
  const data = snap.exists() ? snap.data() : null;

  if (data && (data.tasks || data.routines) && data.ts > lastTs) {
    return {
      tasks: data.tasks || [],
      routines: data.routines || [],
      profile: data.prof || profile,
      ts: data.ts,
    };
  } else {
    const newTs = Date.now();
    await setDoc(ref, {
      userId,
      tasks: localTasks,
      routines: localRoutines,
      prof: profile,
      ts: newTs,
    });
    return {
      tasks: localTasks,
      routines: localRoutines,
      profile,
      ts: newTs,
    };
  }
}
