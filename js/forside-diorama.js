/* =========================================================================
   DIORAMAET PÅ FORSIDEN (index-diorama.html)
   En low poly-øy der hvert prosjekt på Tavleloftet har sin egen plass:
   Myntland (butikk og mynter), Krøniken (stavkirke), reisene (globus og fly),
   spillene (terning og sjakkbrikke), skreddersydd (dinosaur) og
   Erobre nabolaget (hus med flagg).
   Tegnes i 3D med three.js (js/three.min.js, ingenting hentes utenfra).
   Navnelappene er vanlige HTML-lenker som følger med øya når den vugger.
   Uten 3D (gamle maskiner) vises bare lappene i en enkel liste.
   ========================================================================= */
(function () {
  'use strict';
  var T = window.THREE;
  var boksEl = document.querySelector('.hero-diorama');
  if (!boksEl) return;
  var cv = boksEl.querySelector('canvas');
  var lapper = Array.prototype.slice.call(boksEl.querySelectorAll('.lapp'));
  var rolig = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var renderer;
  try {
    if (!T) throw new Error('three mangler');
    renderer = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch (e) { boksEl.classList.add('uten3d'); return; }

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFShadowMap;
  var scene = new T.Scene();
  var camera = new T.PerspectiveCamera(28, 1, 1, 200);

  /* ---------- lys ---------- */
  scene.add(new T.HemisphereLight(0xffffff, 0xb59a78, 1.0));
  var sol = new T.DirectionalLight(0xfff1d6, 2.8);
  sol.position.set(-10, 22, 12);
  sol.castShadow = true;
  sol.shadow.mapSize.set(2048, 2048);
  var sc = sol.shadow.camera; sc.left = -14; sc.right = 14; sc.top = 14; sc.bottom = -14; sc.near = 1; sc.far = 60;
  sol.shadow.bias = -0.0006; sol.shadow.normalBias = 0.04;
  scene.add(sol);

  /* ---------- små byggeklosser ---------- */
  var mats = {};
  function mat(c) { if (!mats[c]) mats[c] = new T.MeshLambertMaterial({ color: c, flatShading: true }); return mats[c]; }
  function legg(par, geo, c, x, y, z) {
    var m = new T.Mesh(geo, mat(c)); m.position.set(x || 0, y || 0, z || 0);
    m.castShadow = true; m.receiveShadow = true; par.add(m); return m;
  }
  function boks(p, w, h, d, c, x, y, z) { return legg(p, new T.BoxGeometry(w, h, d), c, x, y, z); }
  function syl(p, rt, rb, h, s, c, x, y, z) { return legg(p, new T.CylinderGeometry(rt, rb, h, s), c, x, y, z); }
  function kjegle(p, r, h, s, c, x, y, z) { return legg(p, new T.ConeGeometry(r, h, s), c, x, y, z); }
  function kule(p, r, c, x, y, z, d) { return legg(p, new T.IcosahedronGeometry(r, d || 0), c, x, y, z); }
  function gruppe(p, x, y, z, ry) { var g = new T.Group(); g.position.set(x || 0, y || 0, z || 0); g.rotation.y = ry || 0; p.add(g); return g; }

  /* ---------- øya ---------- */
  var RX = 9, RZ = 0.74;
  function ujevn(geo) {
    var p = geo.attributes.position;
    for (var i = 0; i < p.count; i++) {
      var x = p.getX(i), z = p.getZ(i), a = Math.atan2(z, x);
      var f = 1 + 0.05 * Math.sin(a * 3 + 0.6) + 0.035 * Math.sin(a * 5 + 2.1) + 0.02 * Math.sin(a * 9);
      p.setX(i, x * f); p.setZ(i, z * f * RZ);
    }
    geo.computeVertexNormals(); return geo;
  }
  var verden = gruppe(scene);
  var oy = gruppe(verden);
  legg(oy, ujevn(new T.CylinderGeometry(RX, RX, 0.5, 16)), 0x8fd16a, 0, -0.25, 0);
  legg(oy, ujevn(new T.CylinderGeometry(RX, RX * 0.9, 1.0, 16)), 0xbb8756, 0, -1.0, 0);
  legg(oy, ujevn(new T.CylinderGeometry(RX * 0.9, RX * 0.5, 1.8, 16)), 0x8d6c57, 0, -2.4, 0);
  kule(oy, 0.7, 0x8d6c57, -8.4, -3.7, 1.2); kule(oy, 0.45, 0xa27a60, 8.0, -3.4, 2.2); kule(oy, 0.3, 0x8d6c57, 7.0, -4.2, 0.9);

  // sti i midten (sandfargede heller)
  [[-1.2, 0.6], [0, 0.2], [1.2, 0.5], [0.4, 1.4], [-0.6, -0.8], [0.8, -0.9]].forEach(function (s) {
    var h = syl(oy, 0.55, 0.6, 0.06, 7, 0xe8d6a8, s[0], 0.03, s[1]); h.rotation.y = s[0];
  });

  /* ---------- trær og pynt ---------- */
  function gran(x, z, s) {
    var g = gruppe(oy, x, 0, z); g.scale.setScalar(s || 1);
    syl(g, 0.12, 0.16, 0.5, 5, 0x8a5a33, 0, 0.25, 0);
    kjegle(g, 0.8, 1.1, 6, 0x2f8f63, 0, 1.0, 0); kjegle(g, 0.6, 1.0, 6, 0x37a06f, 0, 1.65, 0); kjegle(g, 0.4, 0.8, 6, 0x46b07c, 0, 2.25, 0);
  }
  function lauvtre(x, z, s, c) {
    var g = gruppe(oy, x, 0, z); g.scale.setScalar(s || 1);
    syl(g, 0.12, 0.17, 0.8, 5, 0x8a5a33, 0, 0.4, 0);
    kule(g, 0.7, c || 0x5bbf6a, 0, 1.3, 0); kule(g, 0.45, c || 0x5bbf6a, 0.42, 0.98, 0.2);
  }
  gran(-7.6, -1.6, 0.9); gran(-6.9, -3.2, 1.05); gran(7.4, -1.2, 0.95); gran(1.8, -5.6, 0.8); gran(-2.4, -5.5, 0.85);
  lauvtre(7.6, 1.6, 0.85); lauvtre(-7.7, 1.5, 0.8, 0x7fcf5a); lauvtre(2.6, 5.0, 0.7, 0x7fcf5a); lauvtre(-2.8, 5.2, 0.7);
  [[-3.4, 4.6, 0xf4b942], [3.6, 4.2, 0xf07a5a], [-6.4, 3.4, 0xffffff], [6.6, 3.4, 0xf4b942], [-1.4, 3.0, 0xf07a5a], [1.6, -3.2, 0xffffff]].forEach(function (b) {
    syl(oy, 0.02, 0.02, 0.3, 4, 0x3f8f4f, b[0], 0.15, b[1]); kule(oy, 0.12, b[2], b[0], 0.33, b[1]);
  });

  /* ---------- Myntland: butikk med mynter (bak til venstre) ---------- */
  var mynt = gruppe(oy, -4.4, 0, -2.2, 0.35);
  boks(mynt, 2.2, 1.5, 1.6, 0xfff3d6, 0, 0.75, 0);
  var tak = kjegle(mynt, 1.75, 0.9, 4, 0x1f8f7f, 0, 1.95, 0); tak.rotation.y = Math.PI / 4; tak.scale.set(1, 1, 0.78);
  boks(mynt, 0.55, 0.85, 0.06, 0x8a5a33, 0, 0.43, 0.81);
  boks(mynt, 0.5, 0.4, 0.06, 0xbfe6f0, -0.68, 0.95, 0.81); boks(mynt, 0.5, 0.4, 0.06, 0xbfe6f0, 0.68, 0.95, 0.81);
  // markise
  for (var i = 0; i < 5; i++) boks(mynt, 0.44, 0.08, 0.5, i % 2 ? 0xffffff : 0xf07a5a, -0.88 + i * 0.44, 1.32, 1.02).rotation.x = 0.35;
  // myntstabler og en stor mynt som snurrer
  [[1.5, 0.5, 4], [1.85, 0.05, 6], [1.45, -0.35, 3]].forEach(function (s) {
    for (var k = 0; k < s[2]; k++) syl(mynt, 0.26, 0.26, 0.09, 12, k % 2 ? 0xf4b942 : 0xe6a52e, s[0], 0.05 + k * 0.1, s[1]);
  });
  var storMynt = gruppe(mynt, 0, 3.0, 0);
  var m1 = syl(storMynt, 0.55, 0.55, 0.12, 18, 0xf4b942, 0, 0, 0); m1.rotation.x = Math.PI / 2;
  var m2 = syl(storMynt, 0.36, 0.36, 0.14, 18, 0xe09a24, 0, 0, 0); m2.rotation.x = Math.PI / 2;

  /* ---------- Krøniken: stavkirke (bak til høyre) ---------- */
  var kirke = gruppe(oy, 4.2, 0, -2.4, -0.4);
  var tre = 0x5b3a26, tak2 = 0x3b2a20;
  boks(kirke, 2.0, 0.9, 1.5, tre, 0, 0.45, 0);
  var t1 = kjegle(kirke, 1.55, 0.7, 4, tak2, 0, 1.25, 0); t1.rotation.y = Math.PI / 4; t1.scale.set(1, 1, 0.8);
  boks(kirke, 1.3, 0.7, 1.0, tre, 0, 1.55, 0);
  var t2 = kjegle(kirke, 1.05, 0.6, 4, tak2, 0, 2.2, 0); t2.rotation.y = Math.PI / 4; t2.scale.set(1, 1, 0.8);
  boks(kirke, 0.7, 0.6, 0.6, tre, 0, 2.45, 0);
  var t3 = kjegle(kirke, 0.55, 1.1, 4, tak2, 0, 3.25, 0); t3.rotation.y = Math.PI / 4;
  // dragehoder på gavlene
  [[-0.95, 1.55], [0.95, 1.55]].forEach(function (d) { var k = kjegle(kirke, 0.08, 0.45, 4, 0xa4492a, d[0], d[1], 0); k.rotation.z = d[0] > 0 ? -0.7 : 0.7; });
  boks(kirke, 0.4, 0.6, 0.05, 0x2a1c14, 0, 0.3, 0.76);
  kule(kirke, 0.05, 0xf4b942, 0, 3.85, 0, 1);

  /* ---------- Reisene: globus og et fly som sirkler (foran til høyre) ---------- */
  var reise = gruppe(oy, 5.0, 0, 2.0);
  syl(reise, 0.5, 0.65, 0.2, 8, 0x5b3a26, 0, 0.1, 0);
  syl(reise, 0.07, 0.07, 0.7, 6, 0xb9861f, 0, 0.5, 0);
  var globus = gruppe(reise, 0, 1.55, 0);
  kule(globus, 0.95, 0x1e6e9e, 0, 0, 0, 1);
  // land som små klumper
  [[0.5, 0.55, 0.55], [-0.6, 0.3, 0.6], [0.2, -0.4, 0.82], [-0.3, 0.75, -0.5], [0.75, -0.1, -0.55], [-0.75, -0.35, -0.4]].forEach(function (l) {
    var v = new T.Vector3(l[0], l[1], l[2]).normalize().multiplyScalar(0.86);
    kule(globus, 0.32, 0xf3e6c4, v.x, v.y, v.z, 0);
  });
  var ring = legg(reise, new T.TorusGeometry(1.15, 0.04, 6, 24), 0xb9861f, 0, 1.55, 0); ring.rotation.x = Math.PI / 2 + 0.4;
  var flyBane = gruppe(reise, 0, 1.55, 0);
  var fly = gruppe(flyBane, 1.75, 0.3, 0);
  boks(fly, 0.14, 0.14, 0.62, 0xffffff, 0, 0, 0);
  boks(fly, 0.7, 0.04, 0.18, 0xf07a5a, 0, 0, 0.02);
  boks(fly, 0.28, 0.04, 0.1, 0xf07a5a, 0, 0.02, -0.26);
  boks(fly, 0.04, 0.18, 0.12, 0xf07a5a, 0, 0.1, -0.27);

  /* ---------- Spillene: terning og sjakkbrikke (foran til venstre) ---------- */
  var spill = gruppe(oy, -5.0, 0, 2.1, 0.3);
  var terning = boks(spill, 1.1, 1.1, 1.1, 0xffffff, 0, 0.56, 0);
  terning.rotation.y = 0.5;
  // øyne på terningen (forsiden og toppen)
  function oye(par, x, y, z) { kule(par, 0.09, 0x1b2b27, x, y, z, 1); }
  oye(terning, 0, 0.56, 0); oye(terning, 0.28, 0.56, 0.28); oye(terning, -0.28, 0.56, -0.28);
  oye(terning, 0.25, 0.25, 0.56); oye(terning, -0.25, -0.25, 0.56);
  var hest = gruppe(spill, 1.25, 0, -0.5);
  syl(hest, 0.38, 0.45, 0.2, 10, 0x1b2b27, 0, 0.1, 0);
  syl(hest, 0.22, 0.32, 0.6, 10, 0x1b2b27, 0, 0.5, 0);
  var hode = boks(hest, 0.32, 0.6, 0.5, 0x1b2b27, 0, 1.05, 0.05); hode.rotation.x = -0.35;
  boks(hest, 0.3, 0.22, 0.38, 0x1b2b27, 0, 1.15, 0.3);
  var brett = boks(spill, 1.1, 0.06, 1.1, 0xf3e6c4, 0.3, 0.03, 1.1);
  for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) if ((r + c) % 2) boks(spill, 0.27, 0.07, 0.27, 0x1f8f7f, 0.3 - 0.41 + c * 0.275, 0.035, 1.1 - 0.41 + r * 0.275);

  /* ---------- Skreddersydd: en liten dinosaur (foran i midten) ---------- */
  var dino = gruppe(oy, 0.2, 0, 3.4, -0.5);
  var gronnDino = 0x6cc04a;
  var kropp = kule(dino, 0.65, gronnDino, 0, 0.85, 0, 0); kropp.scale.set(1.25, 0.9, 0.85);
  var hals = boks(dino, 0.38, 0.8, 0.38, gronnDino, 0.6, 1.35, 0); hals.rotation.z = -0.4;
  boks(dino, 0.6, 0.38, 0.42, gronnDino, 0.95, 1.75, 0);
  kule(dino, 0.06, 0x1b2b27, 1.05, 1.85, 0.2, 1); kule(dino, 0.06, 0x1b2b27, 1.05, 1.85, -0.2, 1);
  var hale = kjegle(dino, 0.3, 1.2, 6, gronnDino, -1.1, 0.75, 0); hale.rotation.z = Math.PI / 2 + 0.25;
  [[0.35, 0.25], [0.35, -0.25], [-0.35, 0.25], [-0.35, -0.25]].forEach(function (b) { syl(dino, 0.13, 0.15, 0.5, 6, 0x58a83a, b[0], 0.25, b[1]); });
  [-0.3, 0, 0.3].forEach(function (x, i) { var p = kjegle(dino, 0.13, 0.3, 4, 0xf4b942, x, 1.43 - i * 0.03, 0); });

  /* ---------- Erobre nabolaget: to hus og et flagg (bak i midten) ---------- */
  var nabo = gruppe(oy, 0.1, 0, -3.9);
  function hus(x, z, farge, takfarge) {
    var g = gruppe(nabo, x, 0, z);
    boks(g, 1.0, 0.8, 0.9, farge, 0, 0.4, 0);
    var t = kjegle(g, 0.85, 0.6, 4, takfarge, 0, 1.1, 0); t.rotation.y = Math.PI / 4; t.scale.set(1, 1, 0.95);
    boks(g, 0.22, 0.4, 0.04, 0x5b3a26, 0, 0.2, 0.46);
    boks(g, 0.22, 0.2, 0.04, 0xbfe6f0, 0.3, 0.52, 0.46);
  }
  hus(-0.9, 0, 0xf4d58d, 0xa4492a); hus(0.6, 0.25, 0xe8f1f5, 0x1f8f7f);
  syl(nabo, 0.04, 0.04, 1.9, 5, 0xdddddd, 1.6, 0.95, 0.4);
  var flagg = boks(nabo, 0.65, 0.4, 0.04, 0xf07a5a, 1.93, 1.65, 0.4);

  /* ---------- skyer ---------- */
  function sky(x, y, z, s) {
    var g = gruppe(verden, x, y, z); g.scale.setScalar(s);
    kule(g, 0.8, 0xffffff, 0, 0, 0, 1); kule(g, 0.6, 0xffffff, 0.8, -0.1, 0.1, 1); kule(g, 0.55, 0xffffff, -0.75, -0.15, 0, 1);
    g.traverse(function (o) { if (o.isMesh) o.castShadow = false; });
    return g;
  }
  var skyer = [sky(-7.5, 5.2, -3, 0.8), sky(7.8, 6.0, -4, 0.65)];

  /* ---------- lappene følger et punkt i 3D ---------- */
  var punkter = {
    myntland: new T.Vector3(-4.4, 3.8, -2.2),
    kroniken: new T.Vector3(4.2, 4.2, -2.4),
    reiser: new T.Vector3(5.0, 3.0, 2.0),
    spill: new T.Vector3(-5.0, 1.8, 2.1),
    skreddersydd: new T.Vector3(0.4, 2.3, 3.4),
    nabolaget: new T.Vector3(0.9, 2.3, -3.9)
  };
  var tmp = new T.Vector3();

  /* ---------- størrelse og kamera ---------- */
  var B = 1, H = 1;
  function tilpass() {
    var r = boksEl.getBoundingClientRect();
    B = Math.max(1, r.width); H = Math.max(1, r.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(B, H, false);
    camera.aspect = B / H;
    var tanV = Math.tan(14 * Math.PI / 180), tanH = tanV * camera.aspect;
    var avstand = Math.max(10.8 / tanH, 8.2 / tanV);
    var vinkel = 30 * Math.PI / 180;
    camera.position.set(0, Math.sin(vinkel) * avstand + 1, Math.cos(vinkel) * avstand);
    camera.lookAt(0, 0.2, 0.4);
    camera.updateProjectionMatrix();
  }
  tilpass();
  window.addEventListener('resize', tilpass);

  /* ---------- mus: øya lener seg litt mot pekeren ---------- */
  var mx = 0, my = 0, mxM = 0, myM = 0;
  if (!rolig && matchMedia('(pointer: fine)').matches) {
    boksEl.addEventListener('mousemove', function (e) {
      var r = boksEl.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5; my = (e.clientY - r.top) / r.height - 0.5;
    });
    boksEl.addEventListener('mouseleave', function () { mx = 0; my = 0; });
  }
  lapper.forEach(function (l) {
    l.addEventListener('mouseenter', function () { boksEl.classList.add('peker'); l.classList.add('aktiv'); });
    l.addEventListener('mouseleave', function () { boksEl.classList.remove('peker'); l.classList.remove('aktiv'); });
  });

  /* ---------- tegn ---------- */
  var synlig = true;
  if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { synlig = e[0].isIntersecting; }).observe(boksEl);
  var start = performance.now();
  function tegn(n) {
    var t = (n - start) / 1000;
    if (!rolig) {
      mxM += (mx - mxM) * 0.05; myM += (my - myM) * 0.05;
      verden.rotation.y = Math.sin(t * 0.18) * 0.22 + mxM * 0.5;
      verden.rotation.x = myM * 0.12;
      verden.position.y = Math.sin(t * 0.8) * 0.12;
      storMynt.rotation.y = t * 1.4;
      globus.rotation.y = t * 0.35;
      flyBane.rotation.y = -t * 0.9;
      fly.rotation.y = 0;
      flagg.rotation.y = Math.sin(t * 3) * 0.25;
      dino.position.y = Math.abs(Math.sin(t * 2.2)) * 0.12;
      skyer[0].position.x = -7.5 + Math.sin(t * 0.2) * 0.6;
      skyer[1].position.x = 7.8 + Math.sin(t * 0.17 + 1) * 0.6;
    }
    renderer.render(scene, camera);
    // flytt navnelappene
    verden.updateMatrixWorld();
    lapper.forEach(function (l) {
      var p = punkter[l.dataset.punkt]; if (!p) return;
      tmp.copy(p).applyMatrix4(oy.matrixWorld).project(camera);
      l.style.transform = 'translate(-50%,-100%) translate(' + ((tmp.x + 1) / 2 * B).toFixed(1) + 'px,' + ((1 - tmp.y) / 2 * H).toFixed(1) + 'px)';
    });
    if (!rolig || !tegn.ferdig) { tegn.ferdig = true; }
    requestAnimationFrame(loop);
  }
  function loop(n) { if (synlig || !tegn.ferdig) tegn(n); else requestAnimationFrame(loop); }
  requestAnimationFrame(loop);
  boksEl.classList.add('klar');
})();
