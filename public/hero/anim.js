/* ══════════════════════════════════════════
   AMJA TRAVELS — BOLD edition · heavy motion
══════════════════════════════════════════ */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mob = matchMedia('(max-width:900px)').matches;
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  function loader(done) {
    const m = $('#lm'), p = $('#lp');
    'GO FURTHER'.split('').forEach(c => { const s = document.createElement('span'); s.textContent = c === ' ' ? ' ' : c; m.appendChild(s); });
    if (reduce) { $('#load').style.display = 'none'; done(); return; }
    gsap.to('#lm span', { y: 0, duration: .8, ease: 'power4.out', stagger: .05 });
    const o = { v: 0 };
    gsap.to(o, {
      v: 100, duration: 1.7, ease: 'power2.inOut',
      onUpdate: () => p.textContent = String(Math.floor(o.v)).padStart(2, '0'),
      onComplete: () => gsap.timeline({ onComplete: done })
        .to('#lm span', { y: '-104%', duration: .55, ease: 'power3.in', stagger: .03 })
        .to('#lp', { opacity: 0, duration: .3 }, '<')
        .to('#load', { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '-=.05')
        .set('#load', { display: 'none' })
    });
  }

  function hero() {
    if (reduce) {
      gsap.set('.hbg', { clipPath: 'inset(0 0 0% 0)' });
      gsap.set('.hline .r', { y: 0 });
      gsap.set(['#hk', '#hp', '#hpill'], { opacity: 1 });
      return;
    }
    gsap.timeline({ delay: .1 })
      .to('.hbg', { clipPath: 'inset(0 0 0% 0)', duration: 1.5, ease: 'expo.inOut' })
      .from('#himg', { scale: 1.5, duration: 2, ease: 'expo.out' }, '<')
      .to('#hk', { opacity: 1, duration: .7 }, '-=1.1')
      .to('.hline .r', { y: 0, duration: 1.25, ease: 'expo.out', stagger: .1 }, '-=.9')
      .to('#hp', { opacity: 1, duration: .8 }, '-=.7')
      .to('#hpill', { opacity: 1, duration: .8 }, '-=.7');
  }

  function main() {
    gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis && !reduce) {
      const l = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
      l.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => l.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
    }

    gsap.to('#prog', { width: '100%', ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } });

    const hd = $('#hd'); let last = 0;
    ScrollTrigger.create({
      start: 'top -80', end: 'max',
      onUpdate: s => { const y = s.scroll(); hd.classList.toggle('s', y > 100); hd.style.transform = (y > last && y > 400) ? 'translateY(-120%)' : 'translateY(0)'; last = y; }
    });

    /* hero parallax + zoom out */
    gsap.to('#himg', { yPercent: 18, scale: 1.15, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hin', { yPercent: -30, opacity: .3, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });

    /* reveals */
    $$('.rv').forEach(el => gsap.to(el, { opacity: 1, y: 0, duration: 1.05, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } }));
    $$('.msk > span').forEach(el => gsap.to(el, { y: 0, duration: 1.15, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' } }));

    /* ── manifesto word brighten ── */
    const man = $('#man');
    if (man) {
      const nodes = Array.from(man.childNodes); man.innerHTML = '';
      nodes.forEach(n => {
        const cls = n.nodeType !== 3 ? (n.className || '') : '';
        (n.textContent || '').split(/(\s+)/).forEach(w => {
          if (!w.trim()) { man.appendChild(document.createTextNode(' ')); return; }
          const s = document.createElement('span'); s.className = 'w ' + cls; s.textContent = w; man.appendChild(s);
        });
      });
      gsap.to('#man .w', { opacity: 1, ease: 'none', stagger: .04, scrollTrigger: { trigger: man, start: 'top 80%', end: 'bottom 55%', scrub: true } });
    }

    /* ── tickers ── */
    function tick(id, items, dir) {
      const tk = $('#' + id); if (!tk) return;
      const html = items.map(t => `<b>${t}</b><s>✦</s>`).join('');
      tk.innerHTML = html + html + html + html;
      if (reduce) return;
      let x = dir < 0 ? 0 : -tk.scrollWidth / 4, w = tk.scrollWidth / 4;
      (function loop() { x += .5 * dir; if (dir < 0 && x <= -w) x = 0; if (dir > 0 && x >= 0) x = -w; tk.style.transform = `translate3d(${x}px,0,0)`; requestAnimationFrame(loop); })();
    }
    tick('tk1', ['Inbound Tours', 'Outbound Tours', 'Flights', 'Hajj & Umrah', 'Hotels', 'Fleet'], -1);
    tick('tk2', ['Colombo', 'Kandy', 'Ella', 'Sigiriya', 'Dubai', 'Maldives', 'Singapore', 'London'], 1);

    /* ── feature split reveals ── */
    $$('.feat').forEach(f => {
      const rvl = $('[data-rvl]', f), img = $('img', f);
      gsap.timeline({ scrollTrigger: { trigger: f, start: 'top 72%' } })
        .to(rvl, { scaleX: 0, duration: 1.1, ease: 'expo.inOut' })
        .from(img, { scale: 1.35, duration: 1.4, ease: 'expo.out' }, '-=1.1');
      // parallax the image while in view
      gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.from($$('.txt > *', f), { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: .08, scrollTrigger: { trigger: f, start: 'top 62%' } });
    });

    /* ── services sticky stack ── */
    const cards = $$('.scard');
    cards.forEach((c, i) => {
      c.style.top = (12 + i * 3) + 'vh';
      c.style.zIndex = i + 1;
      c.style.marginBottom = (i < cards.length - 1) ? '6vh' : '0';
      if (i < cards.length - 1) {
        gsap.to(c, { scale: .92, filter: 'brightness(.8)', ease: 'none', scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top top', scrub: true } });
      }
    });

    /* ── counters ── */
    $$('[data-c]').forEach(el => {
      const end = +el.dataset.c, sfx = el.dataset.s || '';
      ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => {
        const o = { v: 0 };
        gsap.to(o, { v: end, duration: 2, ease: 'power3.out', onUpdate: () => el.textContent = (end >= 1000 ? Math.floor(o.v).toLocaleString() : Math.floor(o.v)) + sfx });
      }});
    });

    /* ── destinations staggered reveal ── */
    ScrollTrigger.batch('.dc', { start: 'top 88%', onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: .1 }) });

    /* ── hotels 3D tilt ── */
    if (!mob) $$('.hc').forEach(c => {
      c.addEventListener('mousemove', e => {
        const r = c.getBoundingClientRect();
        gsap.to(c, { rotateY: ((e.clientX - r.left) / r.width - .5) * 12, rotateX: -((e.clientY - r.top) / r.height - .5) * 12, duration: .5, ease: 'power2.out', transformPerspective: 900 });
      });
      c.addEventListener('mouseleave', () => gsap.to(c, { rotateY: 0, rotateX: 0, duration: .9, ease: 'expo.out' }));
    });

    /* ── magnetic ── */
    if (!mob) $$('.mag').forEach(b => {
      b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .35, y: (e.clientY - r.top - r.height / 2) * .55, duration: .5, ease: 'power3.out' }); });
      b.addEventListener('mouseleave', () => gsap.to(b, { x: 0, y: 0, duration: .85, ease: 'elastic.out(1,.4)' }));
    });

    ScrollTrigger.refresh();
    addEventListener('load', () => ScrollTrigger.refresh());
    addEventListener('resize', () => ScrollTrigger.refresh());
  }

  function cursor() {
    if (mob) return;
    const c = $('#cu'), d = $('#cd');
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; d.style.transform = `translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`; });
    (function f() { cx += (mx - cx) * .15; cy += (my - cy) * .15; c.style.transform = `translate3d(${cx}px,${cy}px,0) translate(-50%,-50%)`; requestAnimationFrame(f); })();
    $$('a,button,.dc,.hc,.scard').forEach(el => { el.addEventListener('mouseenter', () => c.classList.add('g')); el.addEventListener('mouseleave', () => c.classList.remove('g')); });
  }

  function bail() {
    const l = $('#load'); if (l) l.style.display = 'none';
    $$('.rv').forEach(e => { e.style.opacity = 1; e.style.transform = 'none'; });
    $$('.msk > span,.hline .r').forEach(e => e.style.transform = 'none');
    const bg = $('.hbg'); if (bg) bg.style.clipPath = 'inset(0 0 0 0)';
    ['#hk', '#hp', '#hpill'].forEach(s => { const e = $(s); if (e) e.style.opacity = 1; });
    $$('[data-rvl]').forEach(e => e.style.display = 'none');
    $$('#man .w').forEach(w => w.style.opacity = 1);
    const m = $('#man'); if (m) m.style.opacity = 1;
  }

  document.addEventListener('DOMContentLoaded', () => {
    cursor();
    if (!window.gsap || !window.ScrollTrigger) { bail(); return; }
    try { loader(() => { hero(); main(); }); } catch (e) { console.error(e); bail(); }
  });
})();
