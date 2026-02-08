import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDmEs3duNXjMnl8OFPG69G-ESQZB3QGyTg",
  authDomain: "agroplay-4c1fc.firebaseapp.com",
  projectId: "agroplay-4c1fc",
  storageBucket: "agroplay-4c1fc.firebasestorage.app",
  messagingSenderId: "443292960467",
  appId: "1:443292960467:web:7c3c9a6f8fd9319bcaf626",
  measurementId: "G-H43GFKKXD8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export {
  app,
  auth,
  db,
  googleProvider,
  signInWithPopup,
  GoogleAuthProvider,
  doc,
  setDoc,
  serverTimestamp
};
export default app;
