/* ══════════════════════════════════════════
   3D PRELOADER — rotating globe + Colombo flight arcs
   Recoloured to the navy / denim / powder palette.
   Degrades gracefully: if THREE or WebGL missing, the
   loader still shows and dismisses via anim.js.
══════════════════════════════════════════ */
function startGlobe() {
  if (typeof THREE === 'undefined') return;
  var canvas = document.getElementById('loadGlobe');
  var loader = document.getElementById('load');
  if (!canvas || !loader) return;

  var renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); }
  catch (e) { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight, false);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, .1, 100);
  camera.position.z = 6.2;

  scene.add(new THREE.HemisphereLight(0xbcd0ee, 0x0a1330, 1.15));
  var key = new THREE.DirectionalLight(0xeef4ff, 1.35); key.position.set(4, 5, 6); scene.add(key);
  var rim = new THREE.DirectionalLight(0x4c6a9c, .9);   rim.position.set(-5, -2, -4); scene.add(rim);

  var globe = new THREE.Group();
  globe.rotation.z = 0.38;
  scene.add(globe);
  var R = 1.9;

  // navy ocean sphere
  var core = new THREE.Mesh(new THREE.SphereGeometry(R, 72, 72),
    new THREE.MeshStandardMaterial({ color: 0x22375f, metalness: .2, roughness: .85 }));
  globe.add(core);
  // periwinkle graticule
  var wire = new THREE.Mesh(new THREE.SphereGeometry(R * 1.002, 40, 26),
    new THREE.MeshBasicMaterial({ color: 0x4c6a9c, wireframe: true, transparent: true, opacity: .28 }));
  globe.add(wire);
  // powder landmass dots
  var N = 1500, pos = new Float32Array(N * 3);
  for (var i = 0; i < N; i++) {
    var y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963229728653;
    pos[i * 3] = Math.cos(th) * r * R * 1.008; pos[i * 3 + 1] = y * R * 1.008; pos[i * 3 + 2] = Math.sin(th) * r * R * 1.008;
  }
  var dotGeo = new THREE.BufferGeometry();
  dotGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  var dots = new THREE.Points(dotGeo, new THREE.PointsMaterial({ color: 0xb9d0ea, size: .02, transparent: true, opacity: .55 }));
  globe.add(dots);
  // atmosphere glow (powder)
  globe.add(new THREE.Mesh(new THREE.SphereGeometry(R * 1.16, 48, 48),
    new THREE.MeshBasicMaterial({ color: 0x8fb4e6, transparent: true, opacity: .10, side: THREE.BackSide })));
  globe.add(new THREE.Mesh(new THREE.SphereGeometry(R * 1.04, 48, 48),
    new THREE.MeshBasicMaterial({ color: 0xb9d0ea, transparent: true, opacity: .06, side: THREE.BackSide })));
  // upgrade to real earth map if it loads in time
  try {
    var tl = new THREE.TextureLoader(); tl.crossOrigin = 'anonymous';
    tl.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
      function (tex) {
        core.material = new THREE.MeshStandardMaterial({ map: tex, metalness: .08, roughness: .82, emissive: 0x0a1a34, emissiveIntensity: .32 });
        wire.visible = false; dots.visible = false;
      }, undefined, function () {});
  } catch (e) {}

  function ll(lat, lon, rad) {
    var phi = (90 - lat) * Math.PI / 180, th = (lon + 180) * Math.PI / 180;
    return new THREE.Vector3(-rad * Math.sin(phi) * Math.cos(th), rad * Math.cos(phi), rad * Math.sin(phi) * Math.sin(th));
  }
  function arc(a, b, color) {
    var v0 = ll(a[0], a[1], R), v1 = ll(b[0], b[1], R);
    var mid = v0.clone().add(v1).multiplyScalar(.5);
    mid.normalize().multiplyScalar(R * (1 + v0.distanceTo(v1) * 0.30));
    var curve = new THREE.QuadraticBezierCurve3(v0, mid, v1);
    globe.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(64)),
      new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: .9 })
    ));
    [v0, v1].forEach(function (v) {
      var m = new THREE.Mesh(new THREE.SphereGeometry(.03, 10, 10), new THREE.MeshBasicMaterial({ color: color }));
      m.position.copy(v); globe.add(m);
    });
    return curve;
  }
  var CMB = [6.9, 79.86];
  var routes = [
    [[21.42, 39.83], 0xb9d0ea],  // Makkah
    [[25.20, 55.27], 0x8fb4e6],  // Dubai
    [[1.35, 103.82], 0xa9bcdc],  // Singapore
    [[51.51, -0.13], 0xd8e4f5],  // London
    [[3.20, 73.22], 0x8fb4e6],   // Maldives
    [[7.29, 80.64], 0xffffff]    // Kandy
  ];
  var curves = routes.map(function (r) { return { c: arc(CMB, r[0], r[1]), col: r[1] }; });
  var planes = curves.map(function (r, i) {
    var m = new THREE.Mesh(new THREE.SphereGeometry(.045, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    globe.add(m); return { m: m, c: r.c, off: i / curves.length };
  });
  var hub = new THREE.Mesh(new THREE.SphereGeometry(.05, 14, 14), new THREE.MeshBasicMaterial({ color: 0xF6D3CE }));
  hub.position.copy(ll(CMB[0], CMB[1], R)); globe.add(hub);

  var clock = new THREE.Clock(), alive = true;
  window.__killGlobe = function () { alive = false; };
  function resize() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize, { passive: true });
  (function loop() {
    if (!alive) return;
    if (loader.style.display === 'none') { alive = false; return; }
    requestAnimationFrame(loop);
    var t = clock.getElapsedTime();
    globe.rotation.y = t * 0.16;
    globe.position.y = Math.sin(t * 0.6) * 0.04;
    var pulse = 1 + Math.sin(t * 3) * 0.25; hub.scale.setScalar(pulse);
    for (var i = 0; i < planes.length; i++) {
      var tt = (t * 0.12 + planes[i].off) % 1;
      planes[i].m.position.copy(planes[i].c.getPoint(tt));
    }
    renderer.render(scene, camera);
  })();
}

// run as soon as possible, but ensure the canvas exists
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startGlobe);
} else {
  startGlobe();
}
