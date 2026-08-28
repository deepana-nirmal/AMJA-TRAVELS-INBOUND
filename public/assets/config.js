/* ─────────────────────────────────────────────────────────────
   config.js — single place for editable site-wide values.
   Classic script (no module). Sets window.AMJA, used by ui.js
   and the page footers. Safe to edit by hand.
   ───────────────────────────────────────────────────────────── */
(function () {
  window.AMJA = {
    brand: 'Amja Travels',
    arm: 'Inbound',
    tagline: 'Explore Sri Lanka',

    // Contact — shared with the existing Amja Travels details.
    phone: '+94 11 233 5657',
    phoneAlt: '+94 77 730 8079',
    email: 'amjatrvl@sltnet.lk',
    whatsapp: '94777308079', // digits only, for wa.me links
    address: 'No. 30, Dias Place, Gunasinghapura, Colombo 12, Sri Lanka',
    hours: 'Monday – Saturday · 8:30 AM – 5:30 PM',

    // Inbound / Outbound connection — single source of truth for the
    // header/mobile/footer switcher. Every [data-outbound-link] anchor
    // gets this href assigned by ui.js (brandSwitch).
    inboundUrl: '/',
    outboundUrl: 'https://amjaa-travels.web.app/',
    outboundLabel: 'Worldwide holidays, flights & pilgrimage',
    inboundLabel: 'Sri Lanka tours, hotels & chauffeur fleet',

    social: {
      facebook: 'https://www.facebook.com/amjatravels/',
      instagram: '',
      youtube: 'https://www.youtube.com/channel/UCwWbAdW1H5Xb99yLWRk8tBA'
    }
  };
  window.AMJA.waLink = 'https://wa.me/' + window.AMJA.whatsapp;
  window.AMJA.telLink = 'tel:' + window.AMJA.phone.replace(/\s+/g, '');
  window.AMJA.mailLink = 'mailto:' + window.AMJA.email;
})();
