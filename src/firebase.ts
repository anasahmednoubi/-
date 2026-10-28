import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  linkWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

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
