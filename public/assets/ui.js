/* ─────────────────────────────────────────────────────────────
   ui.js — shared front-end behaviour for the Inbound site.
   Classic script, no dependencies. Handles: preloader, header
   scroll states, scroll progress, mobile menu, Inbound/Outbound
   switch, reveal-on-scroll, lazy + in-view video, ticker loop.
   Deliberately light — no animation library.
   ───────────────────────────────────────────────────────────── */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ── preloader ── */
  function preloader() {
    var el = $('#preloader');
    if (!el) return;
    var start = Date.now();
    var MIN = reduce ? 0 : 550;
    var MAX = 1800;
    var dismissed = false;
    function done() {
      if (dismissed) return;
      dismissed = true;
      var wait = Math.max(0, MIN - (Date.now() - start));
      setTimeout(function () {
        el.classList.add('done');
        if (window.__killGlobe) window.__killGlobe();   // stop the WebGL loop as the loader fades
        document.body.style.overflow = '';
        setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 700);
      }, wait);
    }
    document.body.style.overflow = 'hidden';
    if (document.readyState === 'complete') done();
    else window.addEventListener('load', done);
    setTimeout(done, MAX);
  }

  /* ── header: scroll state + hide on scroll down ── */
  function header() {
    var hd = $('.site-header');
    if (!hd) return;
    var solid = hd.hasAttribute('data-solid');
    if (solid) hd.classList.add('solid', 'scrolled');
    var bar = $('#scrollbar');
    var last = 0;
    function onScroll() {
      var y = window.pageYOffset;
      if (!solid) hd.classList.toggle('scrolled', y > 60);
      hd.classList.toggle('hidden', y > last && y > 480 && !menuOpen());
      last = y;
      if (bar) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── mobile menu ── */
  var _menu;
  function menuOpen() { return _menu && _menu.classList.contains('open'); }
  function menu() {
    _menu = $('.mobile-menu');
    var toggle = $('.menu-toggle');
    if (!_menu || !toggle) return;
    var close = $('.mobile-menu .close');
    function set(open) {
      _menu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }
    toggle.addEventListener('click', function () { set(true); });
    if (close) close.addEventListener('click', function () { set(false); });
    $$('.mobile-menu a').forEach(function (a) {
      if (a.getAttribute('href') && a.getAttribute('href').charAt(0) !== '#') return;
      a.addEventListener('click', function () { set(false); });
    });
    $$('.mobile-menu a[href]:not([href^="#"])').forEach(function (a) {
      a.addEventListener('click', function () { set(false); });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  }

  /* ── Inbound / Outbound switch ── */
  function brandSwitch() {
    var cfg = window.AMJA || {};
    $$('[data-outbound-link]').forEach(function (a) {
      if (cfg.outboundUrl) a.href = cfg.outboundUrl;
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    });
    $$('.switch').forEach(function (sw) {
      var btn = $('.switch-btn', sw);
      if (!btn) return;
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        sw.classList.toggle('open');
      });
    });
    document.addEventListener('click', function () {
      $$('.switch.open').forEach(function (s) { s.classList.remove('open'); });
    });
  }

  /* ── reveal on scroll ── */
  function reveals() {
    var els = $$('.reveal').filter(function (el) { return !el.classList.contains('in'); });
    if (!els.length) return;
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
    // Safety net: never let content stay hidden if the observer
    // doesn't fire (some embedded/headless contexts, odd scroll roots).
    setTimeout(function () {
      els.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < innerHeight * 1.5) el.classList.add('in');
      });
    }, 1200);
    window.addEventListener('load', function () {
      setTimeout(function () { els.forEach(function (el) { el.classList.add('in'); }); }, 2500);
    });
  }

  /* ── videos: lazy source + play while in view ── */
  function videos() {
    var vids = $$('video[data-src], video[data-inview]').filter(function (v) {
      if (v.dataset.obs) return false; v.dataset.obs = '1'; return true;
    });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var v = en.target;
          if (en.isIntersecting) {
            if (v.dataset.src && !v.src) {
              v.src = v.dataset.src;
              v.load();
            }
            if (v.hasAttribute('autoplay') || v.dataset.inview !== undefined) {
              var p = v.play(); if (p && p.catch) p.catch(function () {});
            }
          } else if (!v.paused) {
            v.pause();
          }
        });
      }, { threshold: 0.35 });
      vids.forEach(function (v) { io.observe(v); });
    } else {
      vids.forEach(function (v) { if (v.dataset.src) { v.src = v.dataset.src; v.load(); } });
    }

    /* click-to-play frames (poster overlay) */
    $$('.video-frame').forEach(function (f) {
      if (f.dataset.wired) return; f.dataset.wired = '1';
      var v = $('video', f);
      var play = $('.v-play', f);
      var mute = $('.v-mute', f);
      if (play && v) {
        play.addEventListener('click', function () {
          if (v.dataset.src && !v.src) { v.src = v.dataset.src; v.load(); }
          v.play();
          f.classList.add('playing');
        });
      }
      if (mute && v) {
        mute.addEventListener('click', function () {
          v.muted = !v.muted;
          mute.setAttribute('data-muted', v.muted ? '1' : '0');
          if (!v.muted) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
          var on = $('.i-on', mute), off = $('.i-off', mute);
          if (on && off) { on.style.display = v.muted ? 'none' : ''; off.style.display = v.muted ? '' : 'none'; }
        });
      }
    });

    /* hero mute toggle */
    var hm = $('.hero-mute');
    if (hm) {
      var hv = $('.hero-media video');
      hm.addEventListener('click', function () {
        if (!hv) return;
        hv.muted = !hv.muted;
        if (!hv.muted) { var p = hv.play(); if (p && p.catch) p.catch(function () {}); }
        var on = $('.i-on', hm), off = $('.i-off', hm);
        if (on && off) { on.style.display = hv.muted ? 'none' : ''; off.style.display = hv.muted ? '' : 'none'; }
      });
    }
  }

  /* ── ticker: duplicate content for a seamless loop ── */
  function ticker() {
    $$('.ticker .track').forEach(function (t) {
      t.innerHTML = t.innerHTML + t.innerHTML;
    });
  }

  /* ── footer year + config-driven contact ── */
  function footerBits() {
    var cfg = window.AMJA || {};
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
    $$('[data-cfg]').forEach(function (el) {
      var k = el.getAttribute('data-cfg');
      if (cfg[k] == null) return;
      if (el.tagName === 'A') {
        if (k === 'phone') el.href = 'tel:' + cfg.phone.replace(/\s+/g, '');
        else if (k === 'email') el.href = 'mailto:' + cfg.email;
        else if (k === 'whatsapp') { el.href = cfg.waLink; el.textContent = el.textContent || 'WhatsApp'; return; }
        el.textContent = cfg[k];
      } else {
        el.textContent = cfg[k];
      }
    });
  }

  function init() {
    preloader();
    header();
    menu();
    brandSwitch();
    reveals();
    videos();
    ticker();
    footerBits();
  }

  // Re-run the parts that matter after content is injected dynamically
  // (detail pages, catalog grids). Idempotent.
  window.AMJAui = {
    refresh: function () {
      reveals();
      videos();
      brandSwitch();
      footerBits();
      document.dispatchEvent(new CustomEvent('amja:refresh'));
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
