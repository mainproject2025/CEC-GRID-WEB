import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

/* ================================
   FIREBASE CLIENT CONFIG
   (SAFE TO EXPOSE)
================================ */
const firebaseConfig = {
  apiKey: "AIzaSyDsb4Gl2MARCXrCRbejhgmFGoPQnCsSLyg",
  authDomain: "test-cec-grid.firebaseapp.com",
  projectId: "test-cec-grid",
  storageBucket: "test-cec-grid.firebasestorage.app",
  messagingSenderId: "305642168913",
  appId: "1:305642168913:web:f827be7d9b52126a178e70"
};

/* ================================
   INIT (SINGLETON)
================================ */
const app = initializeApp(firebaseConfig);

/* ================================
   EXPORT AUTH
================================ */
export const auth = getAuth(app);
