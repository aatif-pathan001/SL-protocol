import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAgZfCNx5LMiuj_e02lN8Zg5K3axTpQxSM",
  authDomain: "solo-leveling-57f97.firebaseapp.com",
  projectId: "solo-leveling-57f97",
  storageBucket: "solo-leveling-57f97.firebasestorage.app",
  messagingSenderId: "319696220036",
  appId: "1:319696220036:web:074e3568659a90cd5277d1",
  measurementId: "G-203YG23MVZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Always export initialized status and instances
export const isInitialized = () => true;
export const getFirebaseAuth = () => auth;
export const getFirebaseDb = () => db;
export { auth, db, googleProvider };
