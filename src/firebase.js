import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

/* ================================
   FIREBASE CLIENT CONFIG
   (SAFE TO EXPOSE)
================================ */
const firebaseConfig = {
  apiKey: "AIzaSyArqcQ4iOw2UCVxaYpZCcbEF0aNbmVL5K8",
  authDomain: "cec-grid-58825.firebaseapp.com",
  projectId: "cec-grid-58825",
  storageBucket: "cec-grid-58825.firebasestorage.app",
  messagingSenderId: "209257727580",
  appId: "1:209257727580:web:35ce9eda9a5e35bba08899"
};

/* ================================
   INIT (SINGLETON)
================================ */
const app = initializeApp(firebaseConfig);

/* ================================
   EXPORT AUTH
================================ */
export const auth = getAuth(app);
