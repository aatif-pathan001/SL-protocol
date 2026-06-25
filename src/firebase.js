import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Read config from env
const envConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const hasEnvConfig = !!(envConfig.apiKey && envConfig.projectId);

function getStoredConfig() {
  try {
    const stored = localStorage.getItem("sl_firebase_config");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Error parsing stored Firebase config", e);
  }
  return null;
}

let appInstance = null;
let authInstance = null;
let dbInstance = null;

export function initializeFirebase(customConfig = null) {
  const config = customConfig || (hasEnvConfig ? envConfig : getStoredConfig());
  
  if (!config || !config.apiKey || !config.projectId) {
    return { initialized: false, error: "No Firebase configuration found" };
  }

  try {
    if (getApps().length === 0) {
      appInstance = initializeApp(config);
    } else {
      appInstance = getApp();
    }
    authInstance = getAuth(appInstance);
    dbInstance = getFirestore(appInstance);
    
    // Save to localStorage if it's a valid config
    if (config) {
      localStorage.setItem("sl_firebase_config", JSON.stringify(config));
    }
    
    return { initialized: true, app: appInstance, auth: authInstance, db: dbInstance };
  } catch (err) {
    console.error("Firebase initialization failed:", err);
    return { initialized: false, error: err.message };
  }
}

// Initial setup attempt
const initialSetup = initializeFirebase();

export const isInitialized = () => !!appInstance;
export const getFirebaseAuth = () => authInstance;
export const getFirebaseDb = () => dbInstance;
export const clearFirebaseConfig = () => {
  localStorage.removeItem("sl_firebase_config");
  appInstance = null;
  authInstance = null;
  dbInstance = null;
};
