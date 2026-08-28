/* ══════════════════════════════════════════════════════════════
   globe.js — 3D preloader globe with flight arcs into Colombo.
   Ported from the outbound site and RECOLOURED to the Inbound
   palette (assets/theme.css): amber --sun, deep indigo --deep,
   gold --gold, sky --sky, ivory --paper.

   • Only runs where the full-page loader exists (#preloader +
     #preloaderGlobe) — i.e. the homepage. Inner pages have no
     canvas, so startGlobe() returns immediately and three.js is
     never even included there.
   • Respects prefers-reduced-motion: skips WebGL entirely, the
     CSS wordmark/bar still show and ui.js dismisses on load.
   • Fails safe: missing THREE / no WebGL → silent return, the
     CSS preloader remains and ui.js's timeout dismisses it.
   ══════════════════════════════════════════════════════════════ */

// Inbound palette (hex mirrors of the CSS custom properties)
var INK = {
  deep:   0x122036,  // --deep   (ocean sphere)
  ink:    0x182A44,  // --ink
  paper:  0xFBF6EF,  // --paper  (ivory)
  cream:  0xFFFDF9,  // --cream
  sun:    0xDC7A34,  // --sun    (hub pulse + primary arcs)
  sunDeep:0xB4551F,  // --sun-deep
  gold:   0xE7B15A,  // --gold   (landmass dots + arcs)
  sky:    0x3E6DA6   // --sky    (graticule + one arc)
};

function startGlobe() {
  if (typeof THREE === 'undefined') return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches) return;

  var canvas = document.getElementById('preloaderGlobe');
  var loader = document.getElementById('preloader');
  if (!canvas || !loader) return;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  } catch (e) { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight, false);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 100);
  camera.position.z = 6.2;

  // warm-lit
  scene.add(new THREE.HemisphereLight(0xF3E9DA, 0x0C1626, 1.15));
  var key = new THREE.DirectionalLight(0xFFF3E4, 1.35); key.position.set(4, 5, 6); scene.add(key);
  var rim = new THREE.DirectionalLight(INK.sun, 0.85);   rim.position.set(-5, -2, -4); scene.add(rim);

  var globe = new THREE.Group();
  globe.rotation.z = 0.38;
  scene.add(globe);
  var R = 1.9;

  // deep-indigo ocean sphere
  var core = new THREE.Mesh(
    new THREE.SphereGeometry(R, 72, 72),
    new THREE.MeshStandardMaterial({ color: INK.deep, metalness: 0.2, roughness: 0.85 })
  );
  globe.add(core);

  // sky-blue graticule
  var wire = new THREE.Mesh(
    new THREE.SphereGeometry(R * 1.002, 40, 26),
    new THREE.MeshBasicMaterial({ color: INK.sky, wireframe: true, transparent: true, opacity: 0.22 })
  );
  globe.add(wire);

  // gold landmass dots
  var N = 1500, pos = new Float32Array(N * 3);
  for (var i = 0; i < N; i++) {
    var y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963229728653;
    pos[i * 3]     = Math.cos(th) * r * R * 1.008;
    pos[i * 3 + 1] = y * R * 1.008;
    pos[i * 3 + 2] = Math.sin(th) * r * R * 1.008;
  }
  var dotGeo = new THREE.BufferGeometry();
  dotGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  var dots = new THREE.Points(dotGeo, new THREE.PointsMaterial({
    color: INK.gold, size: 0.02, transparent: true, opacity: 0.5
  }));
  globe.add(dots);

  // warm atmosphere glow
  globe.add(new THREE.Mesh(
    new THREE.SphereGeometry(R * 1.16, 48, 48),
    new THREE.MeshBasicMaterial({ color: INK.sun, transparent: true, opacity: 0.10, side: THREE.BackSide })
  ));
  globe.add(new THREE.Mesh(
    new THREE.SphereGeometry(R * 1.04, 48, 48),
    new THREE.MeshBasicMaterial({ color: INK.gold, transparent: true, opacity: 0.07, side: THREE.BackSide })
  ));

  function ll(lat, lon, rad) {
    var phi = (90 - lat) * Math.PI / 180, th = (lon + 180) * Math.PI / 180;
    return new THREE.Vector3(
      -rad * Math.sin(phi) * Math.cos(th),
      rad * Math.cos(phi),
      rad * Math.sin(phi) * Math.sin(th)
    );
  }
  function arc(a, b, color) {
    var v0 = ll(a[0], a[1], R), v1 = ll(b[0], b[1], R);
    var mid = v0.clone().add(v1).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(R * (1 + v0.distanceTo(v1) * 0.30));
    var curve = new THREE.QuadraticBezierCurve3(v0, mid, v1);
    globe.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(64)),
      new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.9 })
    ));
    [v0, v1].forEach(function (v) {
      var m = new THREE.Mesh(
        new THREE.SphereGeometry(0.03, 10, 10),
        new THREE.MeshBasicMaterial({ color: color })
      );
      m.position.copy(v); globe.add(m);
    });
    return curve;
  }

  var CMB = [6.9, 79.86]; // Colombo — every arc runs to here
  var routes = [
    [[21.42,  39.83], INK.gold],    // Makkah
    [[25.20,  55.27], INK.sun],     // Dubai
    [[1.35,  103.82], INK.sky],     // Singapore
    [[51.51,  -0.13], INK.paper],   // London
    [[3.20,   73.22], INK.sun],     // Maldives
    [[7.29,   80.64], INK.gold]     // Kandy
  ];
  var curves = routes.map(function (r) { return { c: arc(CMB, r[0], r[1]), col: r[1] }; });

  // planes fly *toward* Colombo (inbound)
  var planes = curves.map(function (r, i) {
    var m = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 12, 12),
      new THREE.MeshBasicMaterial({ color: INK.cream })
    );
    globe.add(m);
    return { m: m, c: r.c, off: i / curves.length };
  });

  // amber hub pulse over Colombo
  var hub = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 14, 14),
    new THREE.MeshBasicMaterial({ color: INK.sun })
  );
  hub.position.copy(ll(CMB[0], CMB[1], R));
  globe.add(hub);

  var clock = new THREE.Clock(), alive = true;
  window.__killGlobe = function () { alive = false; };

  function resize() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize, { passive: true });

  function stopped() {
    // ui.js fades the loader (.done) then removes it from the DOM
    return !document.body.contains(loader) ||
           loader.classList.contains('done') ||
           loader.style.display === 'none';
  }

  (function loop() {
    if (!alive) return;
    if (stopped()) { alive = false; return; }
    requestAnimationFrame(loop);
    var t = clock.getElapsedTime();
    globe.rotation.y = t * 0.16;
    globe.position.y = Math.sin(t * 0.6) * 0.04;
    hub.scale.setScalar(1 + Math.sin(t * 3) * 0.25);
    for (var i = 0; i < planes.length; i++) {
      var tt = 1 - ((t * 0.12 + planes[i].off) % 1); // 1→0 = destination→Colombo
      planes[i].m.position.copy(planes[i].c.getPoint(tt));
    }
    renderer.render(scene, camera);
  })();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startGlobe);
} else {
  startGlobe();
}
