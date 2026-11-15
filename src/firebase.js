// Firebase Authentication & Firestore Integration
import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc,
  serverTimestamp 
} from "firebase/firestore";

const CONFIG_STORAGE_KEY = 'portfolio_firebase_config';
const LOCAL_DATA_KEY = 'portfolio_saved_data_v1';
const LOCAL_AUTH_KEY = 'portfolio_admin_session';

// Get Firebase configuration either from Vite env or localStorage
export function getFirebaseConfig() {
  const envConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  // If env variables exist and are not empty
  if (envConfig.apiKey && envConfig.projectId) {
    return { ...envConfig, source: 'env' };
  }

  // Otherwise check local storage
  try {
    const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.apiKey && parsed.projectId) {
        return { ...parsed, source: 'storage' };
      }
    }
  } catch (e) {
    console.warn("Could not read Firebase config from localStorage", e);
  }

  return null;
}

// Initialize Firebase App
let firebaseApp = null;
let firebaseAuth = null;
let firestoreDb = null;

export function initFirebase() {
  const config = getFirebaseConfig();
  if (!config) {
    return { app: null, auth: null, db: null, isConfigured: false };
  }

  try {
    if (!getApps().length) {
      firebaseApp = initializeApp(config);
    } else {
      firebaseApp = getApp();
    }
    firebaseAuth = getAuth(firebaseApp);
    firestoreDb = getFirestore(firebaseApp);
    return { app: firebaseApp, auth: firebaseAuth, db: firestoreDb, isConfigured: true };
  } catch (err) {
    console.error("Firebase initialization failed:", err);
    return { app: null, auth: null, db: null, isConfigured: false, error: err.message };
  }
}

// Save dynamic Firebase configuration
export function saveFirebaseConfig(config) {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    return true;
  } catch (err) {
    console.error("Failed to save Firebase config", err);
    return false;
  }
}

// Clear saved Firebase configuration
export function clearFirebaseConfig() {
  localStorage.removeItem(CONFIG_STORAGE_KEY);
}

// ----------------------------------------------------------------------------
// AUTHENTICATION API
// ----------------------------------------------------------------------------

export async function loginAdmin(email, password) {
  const { auth, isConfigured } = initFirebase();

  if (isConfigured && auth) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify({ email: userCredential.user.email, isFirebase: true }));
      return { success: true, user: userCredential.user, method: 'firebase' };
    } catch (err) {
      // If user not found and it's the first time, allow creating account if desired, or return error
      console.error("Firebase auth error:", err);
      return { success: false, error: err.message, code: err.code };
    }
  }

  // Fallback local admin authentication if Firebase is not yet hooked up
  // This allows immediate testing and editing out-of-the-box
  const validEmail = "admin@portfolio.local";
  const validPassword = "admin";
  const customAdmin = JSON.parse(localStorage.getItem('portfolio_local_admin_creds') || 'null');

  const checkEmail = customAdmin?.email || validEmail;
  const checkPass = customAdmin?.password || validPassword;

  if (email.trim().toLowerCase() === checkEmail.toLowerCase() && password === checkPass) {
    const adminUser = { email: checkEmail, isLocal: true };
    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(adminUser));
    return { success: true, user: adminUser, method: 'local' };
  }

  // Also accept user's personal email as default admin username with "admin123"
  if (email.trim().toLowerCase() === "vakatipavankumar.official@gmail.com" && password === "admin123") {
    const adminUser = { email, isLocal: true };
    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(adminUser));
    return { success: true, user: adminUser, method: 'local' };
  }

  return { success: false, error: "Invalid email or password. (For initial local login: use admin@portfolio.local / admin or configure Firebase)" };
}

export async function createAdminAccount(email, password) {
  const { auth, isConfigured } = initFirebase();
  if (isConfigured && auth) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify({ email: userCredential.user.email, isFirebase: true }));
      return { success: true, user: userCredential.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Save locally
  localStorage.setItem('portfolio_local_admin_creds', JSON.stringify({ email, password }));
  return { success: true, user: { email, isLocal: true } };
}

export async function logoutAdmin() {
  const { auth, isConfigured } = initFirebase();
  if (isConfigured && auth) {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn("Firebase signout error:", e);
    }
  }
  localStorage.removeItem(LOCAL_AUTH_KEY);
  return { success: true };
}

export function subscribeToAuth(callback) {
  const { auth, isConfigured } = initFirebase();
  if (isConfigured && auth) {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        callback({ email: user.email, isFirebase: true });
      } else {
        // Check if there is a local session
        const local = localStorage.getItem(LOCAL_AUTH_KEY);
        callback(local ? JSON.parse(local) : null);
      }
    });
  }

  // Local auth check
  const local = localStorage.getItem(LOCAL_AUTH_KEY);
  callback(local ? JSON.parse(local) : null);
  return () => {};
}

// ----------------------------------------------------------------------------
// FIRESTORE / DATA PERSISTENCE API
// ----------------------------------------------------------------------------

export async function fetchPortfolioData(defaultData) {
  const { db, isConfigured } = initFirebase();

  // Try fetching from Firestore first if configured
  if (isConfigured && db) {
    try {
      const docRef = doc(db, "portfolio", "main_data");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const cloudData = docSnap.data();
        // Sync to local storage for fast cached load
        localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(cloudData));
        return { data: cloudData, source: 'firestore' };
      }
    } catch (err) {
      console.warn("Could not fetch data from Firestore, falling back to local storage:", err);
    }
  }

  // Fallback to local storage
  try {
    const saved = localStorage.getItem(LOCAL_DATA_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { data: parsed, source: 'localStorage' };
    }
  } catch (e) {
    console.error("Error reading localStorage", e);
  }

  // Fallback to initial data
  return { data: defaultData, source: 'initial' };
}

export async function persistPortfolioData(data) {
  // Always update localStorage first for instantaneous optimistic save & offline reliability
  try {
    localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to write to localStorage", e);
  }

  // If Firebase Firestore is active, save to cloud
  const { db, isConfigured } = initFirebase();
  if (isConfigured && db) {
    try {
      const docRef = doc(db, "portfolio", "main_data");
      await setDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });
      return { success: true, savedToCloud: true };
    } catch (err) {
      console.error("Failed to persist data to Firestore:", err);
      return { success: true, savedToCloud: false, error: err.message };
    }
  }

  return { success: true, savedToCloud: false };
}
