// ─────────────────────────────────────────────────────────────
// catalog.js — renders a category's items from Firestore into a
// page's card grid. If Firestore has data, it REPLACES the
// hardcoded cards; if empty or offline, the hardcoded cards stay
// (graceful fallback, page never looks broken).
//
// Usage on a page (module script):
//   import { renderCatalog } from './assets/catalog.js';
//   renderCatalog('fleet',   '.vgrid',   vehicleCard);
//   renderCatalog('inbound', '.pkg-grid', pkgCard);
// ─────────────────────────────────────────────────────────────
import { listItems } from './db.js';

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// default package card (matches .pkg markup used on most inner pages)
export function pkgCard(it) {
  const title = it.title || it.name || it.route || '';
  const kick  = it.package_type || it.destination || it.location || it.airline || '';
  const desc  = it.description || '';
  const price = it.price || it.fare || 'On request';
  const img   = it.image_url || '';
  const ph    = img ? `<div class="ph"><img src="${esc(img)}" alt="${esc(title)}" loading="lazy"></div>` : '';
  return `<article class="pkg rv">${ph}
    <div class="b"><div class="k">${esc(kick)}</div><h3>${esc(title)}</h3><p>${esc(desc)}</p>
    <div class="row"><span class="price">${esc(price)}</span><a href="#contact" class="go enq-link" data-item="${esc(title)}">Enquire →</a></div></div></article>`;
}

// vehicle card (matches .vcard markup on the fleet page)
export function vehicleCard(it) {
  const seat = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 11V7a2 2 0 0 1 2-2h2M19 11V7a2 2 0 0 0-2-2h-2M4 11h16v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><circle cx="8.5" cy="9" r="1"/><circle cx="15.5" cy="9" r="1"/></svg>';
  const tags = (it.features || []).map(t => `<span>${esc(t)}</span>`).join('');
  const img = it.image_url || '';
  const ph = `<div class="ph"><span class="cat">${esc(it.vehicle_category || '')}</span>${img ? `<img src="${esc(img)}" alt="${esc(it.name)}" loading="lazy">` : ''}</div>`;
  return `<article class="vcard rv" data-cat="${esc(it.vehicle_category || '')}">
    ${ph}
    <div class="b">
      <h3>${esc(it.name || '')}</h3>
      <div class="model">${esc(it.model || '')}</div>
      <p>${esc(it.description || '')}</p>
      <div class="meta">${seat}<span>${esc(it.capacity || '')}</span></div>
      <div class="vtags">${tags}</div>
      <div class="go"><span class="p">${esc(it.price || 'Per-day rate on request')}</span><a href="#contact" class="enq-link" data-item="${esc(it.name || '')}">Enquire →</a></div>
    </div></article>`;
}

export async function renderCatalog(category, gridSelector, cardFn = pkgCard) {
  const grid = document.querySelector(gridSelector);
  if (!grid) return;
  let items = [];
  try {
    items = await listItems(category);
  } catch (e) {
    console.warn('catalog: could not load', category, e.message);
    return; // keep hardcoded fallback cards
  }
  if (!items.length) return; // empty DB → keep fallback cards

  // sort seeded items by created order if present
  items.sort((a, b) => (a.created_at || '').localeCompare(b.created_at || ''));

  grid.innerHTML = items.map(cardFn).join('');

  // re-run reveal animations on the new cards if GSAP is present
  if (window.gsap && window.ScrollTrigger) {
    window.ScrollTrigger.refresh();
    document.querySelectorAll(gridSelector + ' .rv').forEach(el => {
      window.gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 92%' } });
    });
  }
  // re-bind fleet filter chips if present (they reference .vcard)
  if (window.__rebindFleetFilter) window.__rebindFleetFilter();
}
