/* ══════════════════════════════════════════
   AMJAA TRAVELS — animation engine
   Globe loader + GSAP scroll animations + Lenis
══════════════════════════════════════════ */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mob = matchMedia('(max-width:900px)').matches;
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  function loader(done) {
    const m = $('#lm'), p = $('#lp'), sub = $('#lsub');
    // No loader on this page (inner pages) → skip straight to content.
    if (!m || !$('#load')) { done && done(); return; }
    'Amja Travels'.split('').forEach(c => { const s = document.createElement('span'); s.textContent = c === ' ' ? ' ' : c; m.appendChild(s); });
    if (reduce || !window.gsap) { revealNow(); done && done(); return; }
    gsap.to('#lm span', { y: '0%', rotationX: 0, opacity: 1, duration: 1, ease: 'power4.out', stagger: .05 });
    gsap.to(sub, { opacity: 1, duration: .8, delay: .4 });
    const o = { v: 0 };
    gsap.to(o, {
      v: 100, duration: 2.6, ease: 'power1.inOut',
      onUpdate: () => p.textContent = String(Math.floor(o.v)).padStart(2, '0'),
      onComplete: () => {
        if (window.__killGlobe) window.__killGlobe();
        const tl = gsap.timeline();
        tl.to('#lm span', { y: '-90%', rotationX: 90, opacity: 0, duration: .5, ease: 'power3.in', stagger: .025 })
          .to([sub, p], { opacity: 0, duration: .35 }, '-=.45')
          .to('#load', { yPercent: -100, duration: .9, ease: 'expo.inOut',
            onComplete: () => { const l = $('#load'); if (l) l.style.display = 'none'; } }, '-=.15');
        // start the hero WHILE the curtain is sliding up — no dead pause
        tl.add(() => { done && done(); }, '-=0.7');
      }
    });
  }

  function revealNow() {
    const l = $('#load'); if (l) l.style.display = 'none';
    if (window.__killGlobe) window.__killGlobe();
  }

  function hero() {
    // sub-page full-screen hero (image + title reveal)
    const sub = $('.subhero');
    if (sub) {
      if (reduce || !window.gsap) {
        $$('.subhero .shtitle .l>span').forEach(s => s.style.transform = 'none');
        return;
      }
      gsap.timeline()
        .from('.subhero .shbg img', { scale: 1.28, duration: 2.0, ease: 'expo.out' }, 0)
        .to('.subhero .shtitle .l>span', { y: '0%', duration: 1.2, ease: 'expo.out', stagger: .12 }, 0.35);
      return;
    }

    if (reduce || !window.gsap) {
      const e = $('#hscroll'); if (e) e.style.opacity = 1;
      return;
    }
    gsap.timeline()
      .from('#heroVideo', { opacity: 0, scale: 1.15, duration: 1.8, ease: 'expo.out' }, 0)
      .to('#hscroll', { opacity: 1, duration: .7 }, 0.7);
  }

  function menu() {
    const fs = $('#fsmenu'), open = $('#mtog'), close = $('#fsClose');
    if (!fs) return;
    if (open) open.addEventListener('click', () => fs.classList.add('open'));
    if (close) close.addEventListener('click', () => fs.classList.remove('open'));
    $$('#fsmenu a').forEach(a => a.addEventListener('click', () => fs.classList.remove('open')));
  }

  function main() {
    if (!window.gsap) return;
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
      onUpdate: s => { const y = s.scroll(); hd.classList.toggle('s', y > 120); hd.style.transform = (y > last && y > 500) ? 'translateY(-120%)' : 'translateY(0)'; last = y; }
    });

    gsap.to('#heroVideo', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hin', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
    if ($('.subhero')) {
      gsap.to('.subhero .shbg img', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.subhero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.subhero .shin', { yPercent: -14, ease: 'none', scrollTrigger: { trigger: '.subhero', start: 'top top', end: 'bottom top', scrub: true } });
    }

    $$('.rv').forEach(el => gsap.to(el, { opacity: 1, y: 0, duration: 1.05, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } }));

    /* signature blend/art images: soft float-in + gentle scroll parallax */
    $$('.blend-img').forEach(img => {
      gsap.from(img, { opacity: 0, y: 60, scale: .96, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: img, start: 'top 88%' } });
      gsap.to(img, { yPercent: -6, ease: 'none', scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    $$('.msk > span').forEach(el => gsap.to(el, { y: 0, duration: 1.15, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' } }));

    const iH = $('#introH');
    if (iH) {
      const nodes = Array.from(iH.childNodes); iH.innerHTML = '';
      nodes.forEach(n => {
        const it = n.nodeType !== 3;
        (n.textContent || '').split(/(\s+)/).forEach(w => {
          if (!w.trim()) { iH.appendChild(document.createTextNode(' ')); return; }
          const s = document.createElement('span'); s.className = 'w' + (it ? ' it' : ''); s.textContent = w; iH.appendChild(s);
        });
      });
      gsap.to('#introH .w', { opacity: 1, ease: 'none', stagger: .05, scrollTrigger: { trigger: iH, start: 'top 84%', end: 'top 40%', scrub: true } });
    }

    gsap.to('#figRvl', { scaleY: 0, duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: '.fig', start: 'top 82%' } });
    gsap.fromTo('#figImg', { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.fig', start: 'top bottom', end: 'bottom top', scrub: true } });

    ScrollTrigger.batch('.sc', { start: 'top 88%', onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: .08 }) });
    ScrollTrigger.batch('.ec', { start: 'top 88%', onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: .1 }) });
    ScrollTrigger.batch('.dc', { start: 'top 88%', onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: .1 }) });
    ScrollTrigger.batch('.fc', { start: 'top 90%', onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: .9, ease: 'expo.out', stagger: .06 }) });
    ScrollTrigger.batch('.vm .c', { start: 'top 88%', onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: .12 }) });

    $$('.dc .ph img').forEach(img => gsap.fromTo(img, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true } }));

    const pil = $('.pil');
    if (pil) {
      gsap.timeline({ scrollTrigger: { trigger: pil, start: 'top 72%' } })
        .to('.pil .rvl', { scaleX: 0, duration: 1.1, ease: 'expo.inOut' })
        .from('.pil .ph img', { scale: 1.3, duration: 1.4, ease: 'expo.out' }, '-=1.1');
      gsap.fromTo('.pil .ph img', { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: pil, start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.from('.pil .tx > *', { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: .08, scrollTrigger: { trigger: pil, start: 'top 62%' } });
    }

    if (!mob) $$('.hc').forEach(c => {
      c.addEventListener('mousemove', e => {
        const r = c.getBoundingClientRect();
        gsap.to(c, { rotateY: ((e.clientX - r.left) / r.width - .5) * 12, rotateX: -((e.clientY - r.top) / r.height - .5) * 12, duration: .5, ease: 'power2.out', transformPerspective: 900 });
      });
      c.addEventListener('mouseleave', () => gsap.to(c, { rotateY: 0, rotateX: 0, duration: .9, ease: 'expo.out' }));
    });

    const q = $('#quote');
    if (q) {
      const words = q.textContent.trim().split(' ');
      q.innerHTML = words.map(w => `<span class="w">${w}</span>`).join(' ');
      gsap.to('#quote .w', { opacity: 1, ease: 'none', stagger: .06, scrollTrigger: { trigger: q, start: 'top 82%', end: 'top 45%', scrub: true } });
    }

    
    $$('[data-c]').forEach(el => {
      const end = +el.dataset.c, sfx = el.dataset.s || '';
      ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => {
        const o = { v: 0 };
        gsap.to(o, { v: end, duration: 2, ease: 'power3.out', onUpdate: () => el.textContent = (end >= 1000 ? Math.floor(o.v).toLocaleString() : Math.floor(o.v)) + sfx });
      }});
    });

    (function ticker() {
      const tk = $('#tk1'); if (!tk) return;
      const items = ['Colombo', 'Kandy', 'Ella', 'Sigiriya', 'Mirissa', 'Galle', 'Dubai', 'Maldives', 'Singapore', 'London'];
      const html = items.map(t => `<b>${t}</b><s>✦</s>`).join('');
      tk.innerHTML = html + html + html + html;
      if (reduce) return;
      let x = 0, w = tk.scrollWidth / 4;
      (function loop() { x -= .42; if (x <= -w) x = 0; tk.style.transform = `translate3d(${x}px,0,0)`; requestAnimationFrame(loop); })();
    })();

    ScrollTrigger.refresh();
    addEventListener('load', () => ScrollTrigger.refresh());
    addEventListener('resize', () => ScrollTrigger.refresh());
  }

  function bail() {
    revealNow();
    $$('.rv').forEach(e => { e.style.opacity = 1; e.style.transform = 'none'; });
    $$('.msk > span,.htitle .l>span,.subhero .shtitle .l>span').forEach(e => e.style.transform = 'none');
    ['#hk', '#hp', '#hscroll', '#hstats'].forEach(s => { const e = $(s); if (e) e.style.opacity = 1; });
    const rv = $('#figRvl'); if (rv) rv.style.display = 'none';
    $$('[data-rvl]').forEach(e => e.style.display = 'none');
    $$('#introH .w,#quote .w').forEach(w => w.style.opacity = 1);
  }

  document.addEventListener('DOMContentLoaded', () => {

  /* ── scroll-triggered video autoplay (plays in view, pauses out) ── */
  (function(){
    var v=document.getElementById('homeVideo'); if(!v||!('IntersectionObserver' in window))return;
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ var pr=v.play(); if(pr&&pr.catch)pr.catch(function(){}); }
        else v.pause();
      });
    },{threshold:0.35});
    io.observe(v);

    // sound on/off toggle
    var btn=document.getElementById('videoSound');
    if(btn){
      var im=document.getElementById('iconMuted'), is=document.getElementById('iconSound');
      btn.addEventListener('click',function(){
        v.muted=!v.muted;
        if(!v.muted){ var pr=v.play(); if(pr&&pr.catch)pr.catch(function(){}); }
        im.style.display=v.muted?'':'none';
        is.style.display=v.muted?'none':'';
      });
    }
  })();

    menu();
    if (!window.gsap || !window.ScrollTrigger) { bail(); return; }
    try { loader(() => { hero(); main(); }); } catch (e) { console.error(e); bail(); }
  });

  setTimeout(() => { const l = $('#load'); if (l && l.style.display !== 'none') bail(); }, 7000);
})();
