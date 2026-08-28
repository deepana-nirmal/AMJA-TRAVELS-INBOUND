# Firebase Setup — Amjaa Travels

Everything runs on Firebase. No hosted server, no credit card (Spark free plan).
Follow these steps once; after that the site is fully working.

---

## 1. Create the Firebase project (free)

1. Go to <https://console.firebase.google.com> and sign in with a Google account.
2. Click **Add project** → name it `amjaa-travels` → continue.
3. Google Analytics is optional — you can turn it **off**.
4. Wait for it to finish, then **Continue**.

---

## 2. Enable Firestore (the database)

1. Left sidebar → **Build → Firestore Database** → **Create database**.
2. Choose **Start in production mode** (our rules handle security).
3. Pick a location close to Sri Lanka (e.g. `asia-south1` Mumbai) → **Enable**.

---

## 3. Enable Authentication (admin login)

1. Left sidebar → **Build → Authentication** → **Get started**.
2. **Sign-in method** tab → click **Email/Password** → **Enable** → **Save**.
3. **Users** tab → **Add user** → enter the admin email + a password → **Add user**.
   (This is the login for the admin panel.)

---

## 4. Get your web config and paste it in

1. Click the **gear icon** (top left) → **Project settings**.
2. Scroll to **Your apps** → click the **`</>` (Web)** icon.
3. Nickname it `amjaa-web` → **Register app** (skip Hosting for now).
4. Copy the `firebaseConfig` values shown.
5. Open **`public/assets/firebase-init.js`** and paste each value in place of the
   `PASTE_..._HERE` placeholders. (These values are safe to be public — security
   is enforced by the rules, not by hiding them.)

---

## 5. Make yourself an admin (one-time)

The admin login only *works* once the user has the `admin` claim.

1. In **Project settings → Service accounts** → **Generate new private key**.
   Save the file as **`scripts/serviceAccountKey.json`** (keep it secret; it's git-ignored).
2. In a terminal at the project root:
   ```
   npm install firebase-admin
   node scripts/set-admin-claim.js admin@amja.local
   ```
3. You'll see `✅ Granted admin claim`. Sign out / in on the admin page to activate it.
4. You can delete `serviceAccountKey.json` afterwards if you like.

---

## 6. Install the Firebase CLI + deploy the rules

```
npm install -g firebase-tools
firebase login
firebase use --add           # pick your amjaa-travels project, alias it "default"
firebase deploy --only firestore:rules,storage
```

This pushes `firestore.rules` and `storage.rules` — the actual backend logic.

---

## 7. (When ready) Enable Storage + deploy the site

- **Build → Storage → Get started** (accept defaults) to turn on image uploads.
- Deploy the whole site to free Firebase Hosting:
  ```
  firebase deploy
  ```
  You'll get a live URL like `https://amjaa-travels.web.app`.

> Note: newest projects sometimes ask for the Blaze (pay-as-you-go) plan to enable
> Storage. If you'd rather avoid any billing prompt, we can skip Storage and keep
> images as static files in `public/images` — tell me and I'll wire it that way.

---

## What each file does

| File | Role |
|---|---|
| `public/assets/firebase-init.js` | Connects the site to your Firebase project (paste config here) |
| `public/assets/categories.js` | The catalog schema (collections + fields) |
| `public/assets/db.js` | Read/write helpers for packages, hotels, fleet, enquiries |
| `public/assets/auth.js` | Admin login / logout / guard |
| `firestore.rules` | **The backend** — who can read/write what |
| `storage.rules` | Image upload permissions |
| `firebase.json` / `.firebaserc` | Hosting + deploy config |
| `scripts/set-admin-claim.js` | One-off: makes a user an admin |

---

## The data model (Firestore collections)

- `tour_packages_inbound`, `tour_packages_outbound` — tours
- `hajj_packages`, `umrah_packages` — pilgrimage
- `hotels`, `fleet`, `flights` — the rest of the catalog
- `enquiries` — customer form submissions (public can create, admin reads)

Public visitors can **read** the catalog and **submit** an enquiry. Only the
signed-in admin can add/edit/delete anything.
