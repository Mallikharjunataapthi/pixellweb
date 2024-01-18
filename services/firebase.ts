import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_XDS__FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_XDS__FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_XDS__FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_XDS__FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_XDS__FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_XDS__FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_XDS__FIREBASE_MESUREMENT_ID,
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

export { app, db, auth, signOut };
