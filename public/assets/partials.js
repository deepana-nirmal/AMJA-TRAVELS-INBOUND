/* ─────────────────────────────────────────────────────────────
   partials.js — injects the shared header, mobile menu and footer
   so every page keeps one copy of the markup. Classic script.
   Runs before ui.js (include it first). Reads <body data-page="…">
   for nav highlighting.
   ───────────────────────────────────────────────────────────── */
(function () {
  var page = document.body.getAttribute('data-page') || '';
  var NAV = [
    { href: 'index.html', label: 'Home', key: 'home' },
    { href: 'inbound.html', label: 'Tours', key: 'tours' },
    { href: 'destinations.html', label: 'Destinations', key: 'destinations' },
    { href: 'hotels.html', label: 'Hotels', key: 'hotels' },
    { href: 'fleet.html', label: 'Fleet', key: 'fleet' },
    { href: 'index.html#contact', label: 'Contact', key: 'contact' }
  ];
  function navLinks(cls) {
    return NAV.map(function (n) {
      var cur = n.key === page ? ' class="current"' : '';
      return '<a href="' + n.href + '"' + (cls ? '' : cur) + '>' + n.label + '</a>';
    }).join('');
  }

  var headerHTML =
    '<header class="site-header"' + (document.body.hasAttribute('data-solid-header') ? ' data-solid' : '') + '>' +
      '<div class="wrap bar">' +
        '<a href="index.html" class="brand"><span class="mark">Amja Travels</span><span class="arm">Inbound</span></a>' +
        '<nav class="nav">' + navLinks(false) + '</nav>' +
        '<div class="header-actions">' +
          '<div class="switch"><button class="switch-btn" type="button">Inbound ' +
            '<svg viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M1 1l5 5 5-5"/></svg></button>' +
            '<div class="switch-panel">' +
              '<a class="here" href="index.html"><div class="t">Amja Travels <span class="pill">Inbound</span></div><div class="d">Sri Lanka tours, hotels &amp; chauffeur fleet</div></a>' +
              '<a class="alt" data-outbound-link href="#"><div class="t">Amja Travels <span class="pill">Outbound</span></div><div class="d">Worldwide holidays, flights &amp; pilgrimage</div></a>' +
            '</div></div>' +
          '<div class="header-cta"><a href="index.html#contact" class="btn btn-primary">Plan my trip</a></div>' +
          '<button class="menu-toggle" aria-label="Open menu">&#9776;</button>' +
        '</div>' +
      '</div>' +
    '</header>' +
    '<div class="mobile-menu">' +
      '<button class="close">Close &#10005;</button>' +
      NAV.map(function (n) { return '<a href="' + n.href + '">' + n.label + '</a>'; }).join('') +
      '<div class="mm-switch"><a class="on" href="index.html">Inbound</a><a data-outbound-link href="#">Outbound</a></div>' +
      '<div class="mm-foot" data-cfg="address">Colombo 12, Sri Lanka</div>' +
    '</div>';

  var footerHTML =
    '<footer class="site-footer"><div class="wrap">' +
      '<div class="foot-cta"><div><div class="eyebrow" style="color:var(--gold)">Ready when you are</div>' +
        '<h2>Let\'s plan your Sri&nbsp;Lanka trip</h2></div>' +
        '<a href="index.html#contact" class="btn btn-primary">Start planning &rarr;</a></div>' +
      '<div class="foot-grid">' +
        '<div><div class="brand" style="color:#fff"><span class="mark">Amja Travels</span><span class="arm">Inbound</span></div>' +
          '<p style="margin-top:14px">The Sri Lanka ground-handling side of Amja Travels — private tours, hotels and chauffeur fleet, arranged from Colombo since 1998.</p>' +
          '<div class="foot-social">' +
            '<a href="https://www.facebook.com/amjatravels/" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24"><path d="M13 22v-8h3l.5-3.5H13V8.3c0-1 .3-1.7 1.7-1.7H17V3.5A24 24 0 0 0 14.6 3C12 3 10.3 4.6 10.3 7.6v2.9H7V14h3.3v8H13Z"/></svg></a>' +
            '<a href="https://www.youtube.com/channel/UCwWbAdW1H5Xb99yLWRk8tBA" target="_blank" rel="noopener" aria-label="YouTube"><svg viewBox="0 0 24 24"><path d="M23 12s0-3.3-.4-4.9a2.5 2.5 0 0 0-1.8-1.8C19.2 5 12 5 12 5s-7.2 0-8.8.4A2.5 2.5 0 0 0 1.4 7.2C1 8.7 1 12 1 12s0 3.3.4 4.9a2.5 2.5 0 0 0 1.8 1.8C4.8 19 12 19 12 19s7.2 0 8.8-.4a2.5 2.5 0 0 0 1.8-1.8C23 15.3 23 12 23 12ZM9.8 15.2V8.8l6 3.2-6 3.2Z"/></svg></a>' +
          '</div></div>' +
        '<div><h4>Explore</h4><ul>' +
          '<li><a href="inbound.html">Sri Lanka Tours</a></li><li><a href="destinations.html">Destinations</a></li>' +
          '<li><a href="hotels.html">Hotels</a></li><li><a href="fleet.html">Chauffeur Fleet</a></li>' +
          '<li><a href="index.html#contact">Make an enquiry</a></li></ul></div>' +
        '<div><h4>Colombo office</h4><ul>' +
          '<li data-cfg="address">No. 30, Dias Place, Gunasinghapura, Colombo 12, Sri Lanka</li>' +
          '<li><a data-cfg="phone" href="tel:+94112335657">+94 11 233 5657</a></li>' +
          '<li><a data-cfg="email" href="mailto:amjatrvl@sltnet.lk">amjatrvl@sltnet.lk</a></li>' +
          '<li data-cfg="hours">Monday – Saturday · 8:30 AM – 5:30 PM</li></ul>' +
          '<div class="accred">IATA · TAASL · Civil Aviation Authority of Sri&nbsp;Lanka</div></div>' +
        '<div><h4>Amja Travels</h4><div class="foot-arms" style="grid-template-columns:1fr">' +
          '<a href="index.html"><div class="t">Inbound</div><div class="d">You\'re here — travel into Sri Lanka</div></a>' +
          '<a data-outbound-link href="#"><div class="t">Outbound</div><div class="d">Holidays abroad, flights &amp; pilgrimage</div></a>' +
        '</div></div>' +
      '</div>' +
      '<div class="foot-bottom"><span>&copy; <span data-year>2026</span> Amja Travels (Pvt) Ltd. All rights reserved.</span>' +
        '<span class="links"><a href="#">Privacy</a><a href="#">Terms</a><span>Colombo 12 · Est. 1998</span>' +
        '<a href="admin/login.html" class="admin-dot" aria-label="Staff area" title="Staff area"></a></span></div>' +
    '</div></footer>';

  document.body.insertAdjacentHTML('afterbegin', '<div id="scrollbar"></div>' + headerHTML);
  document.body.insertAdjacentHTML('beforeend', footerHTML);
})();
