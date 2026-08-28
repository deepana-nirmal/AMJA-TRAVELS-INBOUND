// ─────────────────────────────────────────────────────────────
// starfield.js — lightweight Canvas-2D twinkling star field for the
// dark boxes (stats band, vision/mission, enquiry). Fills the WHOLE
// box, drifts, twinkles, and gently follows the cursor.
// Independent of Three.js / the admin login effect.
// Usage: dark box has  <canvas class="starfield"></canvas>
// ─────────────────────────────────────────────────────────────
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;

  const COLORS = ['#B9D0EA', '#A9BCDC', '#FFFFFF', '#8FB4E6'];

  function initField(canvas) {
    const box = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    let stars = [];
    let px = 0, py = 0;       // parallax offset (eased toward target)
    let tpx = 0, tpy = 0;     // parallax target from cursor

    function resize() {
      W = box.clientWidth;
      H = box.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // density scales with area — always fills the whole box
      const count = Math.max(40, Math.round((W * H) / 6500));
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.6 + 0.4,
          a: Math.random() * 0.6 + 0.3,           // base alpha
          tw: Math.random() * Math.PI * 2,        // twinkle phase
          tws: 0.008 + Math.random() * 0.02,      // twinkle speed
          vx: (Math.random() - 0.5) * 0.12,       // slow drift
          vy: (Math.random() - 0.5) * 0.12,
          depth: Math.random() * 1 + 0.3,         // parallax depth
          c: COLORS[(Math.random() * COLORS.length) | 0],
        });
      }
    }

    function frame() {
      requestAnimationFrame(frame);
      // ease parallax toward cursor target
      px += (tpx - px) * 0.05;
      py += (tpy - py) * 0.05;
      ctx.clearRect(0, 0, W, H);
      for (const s of stars) {
        // drift
        s.x += s.vx; s.y += s.vy;
        if (s.x < 0) s.x = W; if (s.x > W) s.x = 0;
        if (s.y < 0) s.y = H; if (s.y > H) s.y = 0;
        // twinkle
        s.tw += s.tws;
        const alpha = s.a * (0.55 + 0.45 * Math.sin(s.tw));
        const ox = px * s.depth, oy = py * s.depth;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.c;
        ctx.beginPath();
        ctx.arc(s.x + ox, s.y + oy, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // cursor parallax — based on pointer position over the box
    function onMove(e) {
      const rect = box.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5..0.5
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      tpx = cx * 34;   // max px shift
      tpy = cy * 34;
    }
    // react to cursor anywhere on the page (feels alive even when not directly over)
    window.addEventListener('mousemove', onMove);

    resize();
    if (window.ResizeObserver) new ResizeObserver(resize).observe(box);
    window.addEventListener('resize', resize);
    frame();
  }

  function boot() { document.querySelectorAll('canvas.starfield').forEach(initField); }
  if (document.readyState === 'complete') boot();
  else window.addEventListener('load', boot);
})();
