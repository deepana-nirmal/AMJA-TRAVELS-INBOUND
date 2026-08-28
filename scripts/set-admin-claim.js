// ─────────────────────────────────────────────────────────────
// scripts/set-admin-claim.js  (modular firebase-admin v12+ API)
// Grants admin:true to a Firebase Auth user using a local
// serviceAccountKey.json. Local only — never deployed.
//
//   node scripts/set-admin-claim.js admin@amja.local
// ─────────────────────────────────────────────────────────────
const path = require('path');
const fs = require('fs');

const keyPath = path.join(__dirname, 'serviceAccountKey.json');
if (!fs.existsSync(keyPath)) {
  console.error('\n❌ Missing scripts/serviceAccountKey.json — download it from');
  console.error('   Firebase console → Project settings → Service accounts.\n');
  process.exit(1);
}

let initializeApp, cert, getAuth;
try {
  ({ initializeApp, cert } = require('firebase-admin/app'));
  ({ getAuth } = require('firebase-admin/auth'));
} catch (e) {
  console.error('\n❌ firebase-admin not installed correctly. Run:\n');
  console.error('     npm install firebase-admin@latest\n');
  console.error('   Detail:', e.message, '\n');
  process.exit(1);
}

const email = process.argv[2] || 'admin@amja.local';
const serviceAccount = require(keyPath);

initializeApp({ credential: cert(serviceAccount) });

(async () => {
  try {
    const auth = getAuth();
    const user = await auth.getUserByEmail(email);
    await auth.setCustomUserClaims(user.uid, { admin: true });
    console.log(`\n✅ Granted admin claim to ${email}  (uid: ${user.uid})`);
    console.log('   Sign out and back in on the admin page to apply it.\n');
    process.exit(0);
  } catch (e) {
    if (e.code === 'auth/user-not-found') {
      console.error(`\n❌ No Auth user "${email}". Create it in Firebase → Authentication → Users.\n`);
    } else {
      console.error('\n❌ Failed:', e.message, '\n');
    }
    process.exit(1);
  }
})();
