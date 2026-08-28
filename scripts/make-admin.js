// ─────────────────────────────────────────────────────────────
// scripts/make-admin.js  —  grant admin WITHOUT a service-account key file.
// Uses your `firebase login` credentials (Application Default Credentials),
// so no secret key ever has to be saved into the project.
//
// RUN THESE TWO COMMANDS FROM THE PROJECT ROOT:
//   1)  npx firebase login            (if not already logged in)
//   2)  gcloud auth application-default login    (opens browser, one time)
//        — OR, if you don't have gcloud, set the project and use the key
//          method instead (set-admin-claim.js).
//   3)  node scripts/make-admin.js admin@amja.local
// ─────────────────────────────────────────────────────────────
const admin = require('firebase-admin');
const email = process.argv[2] || 'admin@amja.local';

admin.initializeApp({
  projectId: 'amjaa-travels',
  // no cert() — uses Application Default Credentials from your login
});

(async () => {
  try {
    const u = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(u.uid, { admin: true });
    console.log(`\n✅ Granted admin to ${email} (uid ${u.uid}). Sign out/in to apply.\n`);
    process.exit(0);
  } catch (e) {
    console.error('\n❌', e.message, '\n');
    process.exit(1);
  }
})();
