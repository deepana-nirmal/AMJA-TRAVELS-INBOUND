// ─────────────────────────────────────────────────────────────
// enquiry.js — wires any <form data-enquiry="category"> to save
// a lead into Firestore (the admin inbox). Public visitors can
// only CREATE enquiries (enforced by security rules).
// ─────────────────────────────────────────────────────────────
import { submitEnquiry } from './db.js';

// When any "Enquire →" link is clicked, prefill the form with the item name.
function wireEnquireLinks() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('.enq-link, a[href="#contact"]');
    if (!link) return;
    const item = link.getAttribute('data-item');
    const form = document.querySelector('form[data-enquiry]');
    if (form && item) {
      let hidden = form.querySelector('input[name="item_title"]');
      if (!hidden) {
        hidden = document.createElement('input');
        hidden.type = 'hidden'; hidden.name = 'item_title';
        form.appendChild(hidden);
      }
      hidden.value = item;
      const msg = form.querySelector('[name="message"]');
      if (msg && !msg.value.trim()) msg.value = `I'd like to enquire about: ${item}`;
      const nameField = form.querySelector('[name="name"]');
      // let the browser scroll to #contact, then focus the name field
      setTimeout(() => { if (nameField) nameField.focus({ preventScroll: true }); }, 500);
    }
  });
}

let linksWired = false;
function init() {
  if (!linksWired) { wireEnquireLinks(); linksWired = true; }
  document.querySelectorAll('form[data-enquiry]').forEach(form => {
    if (form.dataset.enqWired) return;
    form.dataset.enqWired = '1';
    const category = form.getAttribute('data-enquiry') || 'general';
    const status = form.querySelector('.enq-status');
    const btn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (status) { status.textContent = ''; status.className = 'enq-status'; }
      const data = Object.fromEntries(new FormData(form).entries());

      if (!data.name || !data.phone) {
        if (status) { status.textContent = 'Please enter your name and phone.'; status.className = 'enq-status err'; }
        return;
      }
      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = 'Sending…'; }
      try {
        await submitEnquiry(category, {
          name: data.name, phone: data.phone, email: data.email || '',
          message: data.message || '',
          item_title: data.item_title || '',
          extra: {
            travel_dates: data.travel_dates || '',
            travellers: data.travellers || '',
            experience_style: data.experience_style || '',
            accommodation_style: data.accommodation_style || '',
          },
        });
        form.reset();
        if (status) { status.textContent = 'Thank you — your enquiry is with our team. We\'ll follow up using the details you provided.'; status.className = 'enq-status ok'; }
      } catch (ex) {
        if (status) { status.textContent = 'Something went wrong. Please call us instead.'; status.className = 'enq-status err'; }
        console.error('enquiry failed:', ex);
      }
      if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || 'Send enquiry'; }
    });
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
// re-scan when detail pages / grids inject new forms
document.addEventListener('amja:refresh', init);
