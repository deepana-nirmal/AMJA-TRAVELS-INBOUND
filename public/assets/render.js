// ─────────────────────────────────────────────────────────────
// render.js — shared rendering for the Inbound site's dynamic
// sections (tours, hotels, fleet, destinations). Loading skeletons,
// empty + error states, card markup and a small lightbox.
// Falls back to any markup already in the container on failure.
// ─────────────────────────────────────────────────────────────
import { listItems, getItem } from './db.js';

export const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export const slug = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const arr = v => Array.isArray(v) ? v : (v ? [v] : []);

// reject if a Firestore call hangs (offline, blocked) so the UI can
// show an error/empty state instead of skeletons forever
function withTimeout(promise, ms = 9000) {
  return Promise.race([
    promise,
    new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))
  ]);
}
export const firstImage = it => it.image_url || arr(it.gallery)[0] || '';
export const galleryOf = it => {
  const g = arr(it.gallery).filter(Boolean);
  const main = it.image_url;
  if (main && !g.includes(main)) return [main, ...g];
  return g.length ? g : (main ? [main] : []);
};

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='100%25' height='100%25' fill='%23F3E9DA'/%3E%3Ctext x='50%25' y='50%25' fill='%23B89A72' font-family='serif' font-size='28' text-anchor='middle' dominant-baseline='middle'%3EAmja Travels%3C/text%3E%3C/svg%3E";

function img(src, alt) {
  const u = src || PLACEHOLDER;
  return `<img src="${esc(u)}" alt="${esc(alt || '')}" loading="lazy" decoding="async"
    data-ph="${esc(PLACEHOLDER)}" onerror="this.onerror=null;this.src=this.dataset.ph">`;
}

// ── card renderers ──
export function tourCard(it) {
  const id = it.id;
  const meta = [
    it.duration ? `<span>${esc(it.duration)}</span>` : '',
    it.destination ? `<span>${esc(it.destination)}</span>` : '',
  ].join('');
  return `<a class="card reveal" href="tour.html?id=${encodeURIComponent(id)}">
    <div class="card-media">${img(firstImage(it), it.title)}
      ${it.video_url ? '<span class="tag">▶ Video</span>' : ''}</div>
    <div class="card-body">
      <div class="kicker">${esc(it.destination || 'Sri Lanka')}</div>
      <h3>${esc(it.title || 'Untitled tour')}</h3>
      <p>${esc(it.description || '').slice(0, 130)}</p>
      <div class="meta">${meta}</div>
      <div class="card-foot">
        <span class="price">${esc(it.price || 'On request')}</span>
        <span class="link-arrow">View tour <span>→</span></span>
      </div>
    </div></a>`;
}

export function hotelCard(it) {
  return `<a class="card reveal" href="hotel.html?id=${encodeURIComponent(it.id)}">
    <div class="card-media">${img(firstImage(it), it.name)}
      ${it.rating ? `<span class="tag">${esc(it.rating)}</span>` : ''}</div>
    <div class="card-body">
      <div class="kicker">${esc(it.location || 'Sri Lanka')}</div>
      <h3>${esc(it.name || 'Hotel')}</h3>
      <p>${esc(it.description || '').slice(0, 130)}</p>
      <div class="card-foot">
        <span class="price">${esc(it.price || 'Rates on request')}</span>
        <span class="link-arrow">View hotel <span>→</span></span>
      </div>
    </div></a>`;
}

export function vehicleCard(it) {
  const feats = arr(it.features).slice(0, 3).map(f => `<span>${esc(f)}</span>`).join('');
  return `<a class="card reveal" href="vehicle.html?id=${encodeURIComponent(it.id)}" data-cat="${esc(it.vehicle_category || '')}">
    <div class="card-media">${img(firstImage(it), it.name)}
      ${it.vehicle_category ? `<span class="tag">${esc(it.vehicle_category)}</span>` : ''}</div>
    <div class="card-body">
      <div class="kicker">${esc(it.model || it.vehicle_category || '')}</div>
      <h3>${esc(it.name || 'Vehicle')}</h3>
      <p>${esc(it.description || '').slice(0, 120)}</p>
      <div class="meta"><span>👤 ${esc(it.capacity || '—')}</span>${feats}</div>
      <div class="card-foot">
        <span class="price">${esc(it.price || 'Rate on request')}</span>
        <span class="link-arrow">Details <span>→</span></span>
      </div>
    </div></a>`;
}

export function destinationCard(it) {
  return `<a class="tile reveal" href="destinations.html#${slug(it.name)}">
    ${img(firstImage(it), it.name)}
    <div class="tile-cap"><div class="k">${esc(it.region || 'Sri Lanka')}</div>
      <h3>${esc(it.name || '')}</h3><p>${esc(it.tagline || '')}</p></div>
  </a>`;
}

// ── list renderer with states ──
export async function renderList(category, selector, cardFn, opts = {}) {
  const grid = document.querySelector(selector);
  if (!grid) return [];
  const { limit, skeletonCount = 6, keepFallback = false, onDone } = opts;

  if (!keepFallback) {
    grid.innerHTML = Array.from({ length: skeletonCount })
      .map(() => '<div class="skeleton sk-card"></div>').join('');
  }

  let items = [];
  try {
    items = await withTimeout(listItems(category));
  } catch (e) {
    console.warn('renderList:', category, e.message);
    if (keepFallback) return [];           // leave the curated static cards in place
    grid.innerHTML = `<div class="state error" style="grid-column:1/-1">
      <h3>We couldn't load this right now</h3>
      <p>Please check your connection and refresh — or contact us and we'll help directly.</p>
      <a class="btn btn-primary" href="#contact">Contact us</a></div>`;
    return [];
  }

  items.sort((a, b) => String(a.created_at || '').localeCompare(String(b.created_at || '')));
  if (limit) items = items.slice(0, limit);

  if (!items.length) {
    if (keepFallback) return [];           // no data yet → keep the curated static cards
    grid.innerHTML = `<div class="state" style="grid-column:1/-1">
      <h3>Nothing here yet</h3>
      <p>This section is being prepared. Tell us what you're after and we'll build it for you.</p>
      <a class="btn btn-primary" href="#contact">Make an enquiry</a></div>`;
    return [];
  }

  grid.innerHTML = items.map(cardFn).join('');
  requestReveal(grid);
  if (typeof onDone === 'function') onDone(items);
  return items;
}

function requestReveal(scope) {
  const els = (scope || document).querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(ents => {
    ents.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.1 });
  els.forEach(e => io.observe(e));
}

// ── detail loader ──
export function getParam(name) {
  return new URLSearchParams(location.search).get(name);
}

export async function loadDetail(category, { render, notFound, error }) {
  const id = getParam('id');
  if (!id) { notFound && notFound(); return null; }
  try {
    const item = await withTimeout(getItem(category, id));
    if (!item) { notFound && notFound(); return null; }
    render(item);
    return item;
  } catch (e) {
    console.warn('loadDetail:', e.message);
    error && error(e);
    return null;
  }
}

// ── shared detail-page builder (tour / hotel / vehicle) ──
export function detailHTML(o) {
  const specs = (o.specs || []).filter(s => s[1])
    .map(s => `<li><span>${esc(s[0])}</span><b>${esc(s[1])}</b></li>`).join('');
  const chips = (o.chips || []).filter(Boolean)
    .map(c => `<span>${esc(c)}</span>`).join('');
  const gal = (o.gallery || []).filter(Boolean);
  const galHTML = gal.length > 1 ? `<div class="sec-tight"><div class="wrap">
      <h2 class="h-md" style="margin-bottom:20px">Gallery</h2>
      <div class="detail-gallery" data-lightbox>
        ${gal.map((g, i) => `<button data-i="${i}"><img src="${esc(g)}" alt="${esc(o.title)} photo ${i + 1}" loading="lazy" decoding="async"></button>`).join('')}
      </div></div></div>` : '';
  const video = o.videoUrl ? `<div style="margin:26px 0">
      <div class="video-frame">
        <video muted loop playsinline preload="none" ${o.heroImg ? `poster="${esc(o.heroImg)}"` : ''} data-src="${esc(o.videoUrl)}"></video>
        <button class="v-play" aria-label="Play video"><svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="11" fill="rgba(0,0,0,.35)"/><path d="M10 8l6 4-6 4z" fill="#fff"/></svg></button>
        <button class="v-mute" aria-label="Toggle sound" data-muted="1"><svg class="i-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 5 6 9H2v6h4l5 4z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg><svg class="i-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="display:none"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14"/></svg></button>
      </div></div>` : '';
  const blocks = (o.blocks || []).filter(b => b && b.html)
    .map(b => `<div class="prose" style="margin-top:34px">${b.h ? `<h3>${esc(b.h)}</h3>` : ''}${b.html}</div>`).join('');

  return `
  <section class="sec-tight" style="padding-bottom:0">
    <div class="wrap">
      <div class="crumbs" style="font-size:.74rem;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-40);margin-bottom:14px">
        <a href="index.html">Home</a> / <a href="${esc(o.crumbHref)}">${esc(o.crumbLabel)}</a> / ${esc(o.title)}
      </div>
      <div class="eyebrow">${esc(o.kicker || '')}</div>
      <h1 class="h-xl" style="margin:12px 0 0">${esc(o.title)}</h1>
      ${o.lead ? `<p class="lede" style="margin-top:16px;max-width:60ch">${esc(o.lead)}</p>` : ''}
    </div>
  </section>
  <section class="sec-tight" style="padding-top:34px;padding-bottom:34px">
    <div class="wrap">
      <div class="split-media wide reveal" style="aspect-ratio:16/9">
        <img src="${esc(o.heroImg)}" alt="${esc(o.title)}" fetchpriority="high" onerror="this.style.display='none'">
      </div>
    </div>
  </section>
  <section class="sec-tight" style="padding-top:0">
    <div class="wrap detail-body">
      <div>
        ${o.descHTML ? `<div class="prose">${o.descHTML}</div>` : ''}
        ${chips ? `<h3 style="margin:32px 0 12px" class="h-md">Highlights</h3><div class="chips">${chips}</div>` : ''}
        ${video}
        ${blocks}
      </div>
      <aside class="detail-side">
        <div class="eyebrow">${esc(o.sideKicker || 'At a glance')}</div>
        <ul class="spec-list">${specs || '<li><span>Details</span><b>On request</b></li>'}</ul>
        ${o.bookingUrl ? `<a class="btn btn-ghost" style="width:100%;justify-content:center;margin-bottom:10px" href="${esc(o.bookingUrl)}" target="_blank" rel="noopener">Booking info</a>` : ''}
        <a class="btn btn-primary" style="width:100%;justify-content:center" href="#enquire">Enquire about this</a>
        <p class="muted" style="font-size:.82rem;margin-top:12px">Prices are indicative and confirmed on quote. Nothing here is a fixed package — everything can be adjusted.</p>
      </aside>
    </div>
  </section>
  ${galHTML}
  <section class="sec enquiry" id="enquire">
    <div class="wrap"><div class="panel-dark">
      <div class="eyebrow" style="color:var(--gold);justify-content:center">Enquire</div>
      <h2 class="h-lg" style="text-align:center;margin-top:14px">Interested in <em style="color:var(--gold)">${esc(o.title)}</em>?</h2>
      <form class="enq-form" data-enquiry="${esc(o.enquiryCategory || 'inbound')}">
        <input type="hidden" name="item_title" value="${esc(o.title)}">
        <div class="row2">
          <input type="text" name="name" placeholder="Your name*" required />
          <input type="tel" name="phone" placeholder="Phone / WhatsApp*" required />
        </div>
        <input type="email" name="email" placeholder="Email (optional)" />
        <textarea name="message" placeholder="Your dates, group size and any questions…">I'd like to enquire about: ${esc(o.title)}</textarea>
        <button type="submit">Send enquiry</button>
        <div class="enq-status"></div>
      </form>
      <div class="contact-actions">
        <a class="btn btn-light" data-cfg="phone" href="tel:+94112335657">+94 11 233 5657</a>
        <a class="btn btn-outline-light" data-cfg="whatsapp" href="https://wa.me/94777308079" target="_blank" rel="noopener">WhatsApp us</a>
      </div>
    </div></div>
  </section>`;
}

export function wireDetail(root) {
  (root || document).querySelectorAll('[data-lightbox]').forEach(box => {
    const imgs = Array.prototype.slice.call(box.querySelectorAll('img')).map(im => im.src);
    box.querySelectorAll('button[data-i]').forEach(b => {
      b.addEventListener('click', () => lightbox(imgs, +b.dataset.i));
    });
  });
}

export function detailState(root, kind) {
  if (kind === 'loading') {
    root.innerHTML = `<section class="sec"><div class="wrap">
      <div class="skeleton" style="height:32px;width:40%;margin-bottom:20px"></div>
      <div class="skeleton" style="height:52vh;min-height:320px;margin-bottom:24px"></div>
      <div class="skeleton" style="height:200px"></div></div></section>`;
  } else if (kind === 'notfound') {
    root.innerHTML = `<section class="sec"><div class="wrap"><div class="state">
      <h3>We couldn't find that</h3>
      <p>It may have been removed or the link is out of date. Browse what's available instead.</p>
      <a class="btn btn-primary" href="index.html">Back to home</a></div></div></section>`;
  } else {
    root.innerHTML = `<section class="sec"><div class="wrap"><div class="state error">
      <h3>Something went wrong loading this page</h3>
      <p>Please refresh, or contact us and we'll send the details directly.</p>
      <a class="btn btn-primary" data-cfg="whatsapp" href="https://wa.me/94777308079" target="_blank" rel="noopener">WhatsApp us</a></div></div></section>`;
  }
}

// ── lightbox ──
let lb, lbImages = [], lbIndex = 0;
function lbPaint() { if (lb && lbImages.length) lb.querySelector('img').src = lbImages[lbIndex]; }
export function lightbox(images, startIndex = 0) {
  lbImages = (images || []).filter(Boolean);
  if (!lbImages.length) return;
  lbIndex = Math.max(0, Math.min(startIndex, lbImages.length - 1));
  if (!lb) {
    lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = `<button class="lb-close" aria-label="Close">✕</button>
      <button class="lb-prev" aria-label="Previous">‹</button>
      <img alt="">
      <button class="lb-next" aria-label="Next">›</button>`;
    document.body.appendChild(lb);
    lb.querySelector('.lb-close').onclick = () => lb.classList.remove('open');
    lb.querySelector('.lb-prev').onclick = () => { lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length; lbPaint(); };
    lb.querySelector('.lb-next').onclick = () => { lbIndex = (lbIndex + 1) % lbImages.length; lbPaint(); };
    lb.onclick = e => { if (e.target === lb) lb.classList.remove('open'); };
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') lb.classList.remove('open');
      if (e.key === 'ArrowLeft') lb.querySelector('.lb-prev').click();
      if (e.key === 'ArrowRight') lb.querySelector('.lb-next').click();
    });
  }
  lbPaint();
  lb.classList.add('open');
}
