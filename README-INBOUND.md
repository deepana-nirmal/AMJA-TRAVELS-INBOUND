# Amja Travels **Inbound**

This repository is the **Inbound** travel website for Amja Travels — Sri Lanka
tours, hotels and a chauffeur-driven fleet. It was transformed from a copy of the
combined Amja Travels site; the outbound/flights/pilgrimage business is a
separate site now, linked via the **Inbound / Outbound** switch in the header.

## Run it

```
npm install          # dev dependency: `serve`
npm run dev          # serves ./public  (http://localhost:3000)
```

Static site — plain HTML/CSS/JS, no build step. Firebase (client SDK, loaded from
the CDN) provides the database, auth and the admin backend via Security Rules.
See **FIREBASE-SETUP.md** for first-time setup, seeding and deployment.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home — hero video, featured tours/hotels/fleet, destinations, media, why-us, CTA |
| `inbound.html` | Tours listing (dynamic from `tour_packages_inbound`) with region filter |
| `tour.html?id=…` | Tour detail — itinerary, highlights, included, gallery, video, enquiry |
| `hotels.html` / `hotel.html?id=…` | Hotels listing + detail (dynamic from `hotels`) |
| `fleet.html` / `vehicle.html?id=…` | Fleet listing + detail (dynamic from `fleet`) |
| `destinations.html` | Editorial guide to the five regions, with galleries + video |
| `admin/login.html`, `admin/index.html` | Content admin (reused + reskinned) |

Old outbound/hajj/umrah/flights pages are left in place and still work, but are
not linked from the Inbound navigation.

## Shared front-end (`public/assets/`)

| File | Role |
|---|---|
| `config.js` | Editable site values — phone, email, **`outboundUrl`** for the switch |
| `theme.css` | The whole design system (one stylesheet) — warm amber/indigo/ivory identity |
| `partials.js` | Injects the shared header, mobile menu and footer |
| `ui.js` | Preloader, header states, reveal-on-scroll, lazy + in-view video, Inbound↔Outbound switch |
| `render.js` | Card grids, detail-page builder, loading / empty / error states, lightbox |
| `categories.js` | Catalog schema — fields, array fields, admin hints (`INBOUND_CATEGORIES`) |
| `db.js`, `auth.js`, `enquiry.js`, `firebase-init.js` | Reused from the original site (Firestore + Auth + contact forms) |

## Media

Videos are lazy-loaded (`preload="none"`, poster images, play-on-tap, pause when
off-screen) so mobile stays fast. The hero video autoplays muted and pauses when
scrolled past. Drop replacement photography into `public/images/inbound/**` and
point the admin records at the new paths — every image, gallery and video URL is
editable in the admin panel.

## Design notes

- Identity is deliberately **warm** (amber / terracotta / deep indigo on ivory) and
  distinct from the cooler outbound site — **no dominant green**.
- New lightweight inbound preloader (CSS sun/compass), not the old globe.
- Fonts: Fraunces (display) + Inter (text), from Google Fonts.
- No invented prices, awards, partnerships or statistics — unknowns read
  "On request" and are editable in the admin panel.

## Admin

Reached via the small dot at the bottom-right of the footer → `admin/login.html`.
Firebase Auth (email/password) + an `admin` custom claim gate all writes. The
admin email/password are **not** in this repo — set them in the Firebase console
and run `node scripts/set-admin-claim.js <email>` once (see FIREBASE-SETUP.md).
