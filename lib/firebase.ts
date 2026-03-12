import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace this with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyC19GPF9AF4ZM68Q5a3v9ylmLxqSSDalpc",
  authDomain: "dev-projects-store.firebaseapp.com",
  projectId: "dev-projects-store",
  storageBucket: "dev-projects-store.firebasestorage.app",
  messagingSenderId: "886600411197",
  appId: "1:886600411197:web:0b2d9a18ff111b7b60e254"
};

// Next.js hot-reload issues ko prevent karne ke liye check karte hain
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };