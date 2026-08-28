// ─────────────────────────────────────────────────────────────
// auth.js — admin authentication (Firebase Auth, email/password).
// Replaces the old server-side admin login. The logged-in user
// carries an `admin` custom claim; Security Rules check it for writes.
// ─────────────────────────────────────────────────────────────

import { auth } from './firebase-init.js';
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}

// Resolves with the user (or null). Also fetches the token to confirm
// the `admin` claim is present.
export function onAdmin(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) { callback(null); return; }
    const token = await user.getIdTokenResult();
    callback({ user, isAdmin: token.claims.admin === true });
  });
}

// Guard: redirect to login if not an admin. Use at top of admin pages.
export function requireAdmin(loginUrl = 'login.html') {
  return new Promise((resolve) => {
    onAdmin((res) => {
      if (res && res.isAdmin) resolve(res.user);
      else window.location.href = loginUrl;
    });
  });
}
