# Firebase Setup — Amja Travels **Inbound**

The Inbound site runs entirely on Firebase (Spark / free plan is enough to start).
No hosted server: the Firestore **Security Rules** are the backend.

---

## 1. Project

Use the existing `amjaa-travels` Firebase project (already wired in
`public/assets/firebase-init.js`). If you want a separate project for Inbound,
create one and paste its web config into that file — the values there are safe
to be public; access is controlled by the rules.

## 2. Firestore

Build → Firestore Database → Create database → **production mode** → a region
near Sri Lanka (`asia-south1`).

Collections used by the Inbound site:

| Collection | Shown on |
|---|---|
| `tour_packages_inbound` | Tours listing + `tour.html` detail |
| `hotels` | Hotels listing + `hotel.html` detail |
| `fleet` | Fleet listing + `vehicle.html` detail |
| `destinations_inbound` | Optional mosaic on `destinations.html` |
| `enquiries` | Admin inbox (created by the contact forms) |

Public visitors can **read** the catalog and **create** an enquiry. Only a
signed-in admin can add/edit/delete.

## 3. Authentication (admin login)

Build → Authentication → Get started → enable **Email/Password**.
Then **Users → Add user** and enter the admin email + password.

> The admin email and password live **only** in the Firebase Auth console and in
> your local shell when you run the script below. They are **not** in this
> repository, the site's HTML/JS, or any committed file — keep it that way.

## 4. Grant the admin claim (one-time, local)

1. Project settings → Service accounts → **Generate new private key** →
   save as `scripts/serviceAccountKey.json` (git-ignored).
2. From the project root:
   ```
   npm install firebase-admin
   node scripts/set-admin-claim.js <the-admin-email>
   ```
3. Sign out / in on `/admin/login.html` to activate the claim.

## 5. Deploy the rules

```
npm install -g firebase-tools
firebase login
firebase use --add          # pick the project, alias "default"
firebase deploy --only firestore:rules
```

`firestore.rules` now also allows the `destinations_inbound` collection.

## 6. Seed starter content (optional, local)

```
node scripts/seed.js          # adds editable tours / hotels / fleet / destinations
node scripts/seed.js --wipe   # clear those collections first, then add
```

Everything seeded is plain editable content — change it in the admin panel.
No prices, awards, partnerships or statistics are invented; figures read
"On request" for the office to fill in.

## 7. Deploy the site

```
firebase deploy --only hosting
```

You get a URL like `https://amjaa-travels.web.app`. Point the real inbound
domain at it and update `outboundUrl` in `public/assets/config.js` to the
outbound site's address.

---

## File map

| File | Role |
|---|---|
| `public/assets/config.js` | Editable site-wide values (phone, email, **outbound URL**) |
| `public/assets/theme.css` | The Inbound design system (one stylesheet, all pages) |
| `public/assets/partials.js` | Shared header / mobile menu / footer |
| `public/assets/ui.js` | Preloader, nav, reveals, lazy video, Inbound↔Outbound switch |
| `public/assets/render.js` | Card grids, detail pages, loading / empty / error states, lightbox |
| `public/assets/categories.js` | Catalog schema (fields, arrays, admin hints) |
| `public/assets/db.js` | Firestore read/write helpers |
| `public/assets/auth.js` | Admin login / guard |
| `public/assets/enquiry.js` | Contact-form → `enquiries` collection |
| `firestore.rules` | **The backend** — who can read/write what |
| `scripts/set-admin-claim.js` | One-off: grant the admin claim |
| `scripts/seed.js` | One-off: load editable starter content |
