// ─────────────────────────────────────────────────────────────
// firebase-init.js
// Initializes the Firebase CLIENT SDK for the whole site.
// No server, no service-account key. Security Rules do the work.
//
// ⚠️  PASTE YOUR FIREBASE WEB CONFIG BELOW.
//     Get it from: Firebase console → Project settings (gear icon)
//     → "Your apps" → Web app → "SDK setup and configuration" → Config.
//     It is SAFE for these values to be public — they only identify
//     your project. Access is controlled entirely by Security Rules.
// ─────────────────────────────────────────────────────────────

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const firebaseConfig = {
  apiKey:            "AIzaSyAd3tsZjjBcLVsTwXcS_xf-PdIx0f5thKg",
  authDomain:        "amjaa-travels.firebaseapp.com",       // e.g. amjaa-travels.firebaseapp.com
  projectId:         "amjaa-travels",         // e.g. amjaa-travels
  storageBucket:     "amjaa-travels.firebasestorage.app",     // e.g. amjaa-travels.appspot.com
  messagingSenderId: "631210231227",
  appId:             "1:631210231227:web:fd9d830291ec73e27e309e",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export { app };
