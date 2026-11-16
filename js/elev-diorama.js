/* =========================================================================
   DIORAMAET PÅ ELEVSIDA (elev/index.html)
   En liten low poly-øy med mange interesser: fotball, dinosaur, robot, romfart,
   musikk, sjakk, bøker, kunst, spill, seiling, fjell og dyr.
   Tegnes i ekte 3D med three.js (ligger lokalt i js/three.min.js, ingenting hentes
   fra andre nettsteder).

   Innloggingskortet er vanlig HTML. Treramma og stolpene rundt kortet er 3D og
   måles opp etter kortet, slik at kortet ser ut som en plakat på ei oppslagstavle
   som står midt på øya.

   Brukes slik fra sida:
     Diorama.farge('#5fd35a')   – himmelen får verdenens farge
     Diorama.nøytral()          – tilbake til vanlig himmel
     Diorama.inn(ferdig)        – raketten letter, vi zoomer inn, så kalles ferdig()
   ========================================================================= */
var Diorama = (function () {
  'use strict';
  var T = window.THREE;
  var cv = document.getElementById('diorama');
  var kort = document.querySelector('.kort');
  var rolig = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tom = { farge: fargeCss, nøytral: nøytralCss, inn: function (cb) { setTimeout(cb, 600); } };

  function fargeCss(a) { document.body.style.setProperty('--verden', a); document.body.classList.add('farget'); }
  function nøytralCss() { document.body.classList.remove('farget'); }

  var renderer;
  try {
    if (!T) throw new Error('three mangler');
    renderer = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch (e) { cv.style.display = 'none'; document.body.classList.add('uten3d'); return tom; }

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFShadowMap;
  var scene = new T.Scene();
  var VFOV = 30, PITCH = 26 * Math.PI / 180;
  var camera = new T.PerspectiveCamera(VFOV, 1, 1, 300);

  /* ---------- lys ---------- */
  scene.add(new T.HemisphereLight(0xffffff, 0xc9ae8a, 0.95));
  var sol = new T.DirectionalLight(0xfff1d6, 2.9);
  sol.position.set(-9, 20, 13);
  sol.castShadow = true;
  sol.shadow.mapSize.set(2048, 2048);
  var sc = sol.shadow.camera; sc.left = -16; sc.right = 16; sc.top = 16; sc.bottom = -16; sc.near = 1; sc.far = 60;
  sol.shadow.bias = -0.0006; sol.shadow.normalBias = 0.04;
  scene.add(sol);

  /* ---------- små hjelpere for å bygge med klosser ---------- */
  var mats = {};
  function mat(c, ekstra) {
    var k = c + (ekstra ? JSON.stringify(ekstra) : '');
    if (!mats[k]) { var o = { color: c, flatShading: true }; if (ekstra) for (var n in ekstra) o[n] = ekstra[n]; mats[k] = new T.MeshLambertMaterial(o); }
    return mats[k];
  }
  function legg(par, geo, c, x, y, z, ekstra) {
    var m = new T.Mesh(geo, mat(c, ekstra)); m.position.set(x || 0, y || 0, z || 0);
    m.castShadow = true; m.receiveShadow = true; par.add(m); return m;
  }
  function boks(par, w, h, d, c, x, y, z, e) { return legg(par, new T.BoxGeometry(w, h, d), c, x, y, z, e); }
  function syl(par, rt, rb, h, s, c, x, y, z, e) { return legg(par, new T.CylinderGeometry(rt, rb, h, s), c, x, y, z, e); }
  function kjegle(par, r, h, s, c, x, y, z, e) { return legg(par, new T.ConeGeometry(r, h, s), c, x, y, z, e); }
  function kule(par, r, c, x, y, z, det, e) { return legg(par, new T.IcosahedronGeometry(r, det || 0), c, x, y, z, e); }
  function gruppe(par, x, y, z, ry) { var g = new T.Group(); g.position.set(x || 0, y || 0, z || 0); g.rotation.y = ry || 0; par.add(g); return g; }
  var anim = [];                        // alt som beveger seg legger en funksjon her

  /* ---------- øya ---------- */
  var RX = 10.9, RZ = 0.72;             // øya er en litt flattrykt, ujevn sirkel
  function ujevn(geo) {
    var p = geo.attributes.position;
    for (var i = 0; i < p.count; i++) {
      var x = p.getX(i), z = p.getZ(i), a = Math.atan2(z, x);
      var f = 1 + 0.045 * Math.sin(a * 3 + 0.6) + 0.035 * Math.sin(a * 5 + 2.1) + 0.02 * Math.sin(a * 9);
      p.setX(i, x * f); p.setZ(i, z * f * RZ);
    }
    geo.computeVertexNormals(); return geo;
  }
  var oy = gruppe(scene);
  legg(oy, ujevn(new T.CylinderGeometry(RX, RX, 0.5, 15)), 0x93d36b, 0, -0.25, 0);
  legg(oy, ujevn(new T.CylinderGeometry(RX, RX * 0.9, 1.0, 15)), 0xbb8756, 0, -1.0, 0);
  legg(oy, ujevn(new T.CylinderGeometry(RX * 0.9, RX * 0.52, 1.7, 15)), 0x8d6c57, 0, -2.35, 0);
  // noen løse steiner som svever under øya
  kule(oy, 0.7, 0x8d6c57, -8.6, -3.6, 1.5); kule(oy, 0.45, 0xa27a60, 8.2, -3.3, 2.4); kule(oy, 0.35, 0x8d6c57, 7.2, -4.1, 1.2);

  /* ---------- trær, busker og blomster ---------- */
  function gran(x, z, s) {
    var g = gruppe(oy, x, 0, z); g.scale.setScalar(s || 1);
    syl(g, 0.13, 0.17, 0.6, 5, 0x8a5a33, 0, 0.3, 0);
    kjegle(g, 0.85, 1.2, 6, 0x2f8f63, 0, 1.1, 0); kjegle(g, 0.65, 1.1, 6, 0x37a06f, 0, 1.8, 0); kjegle(g, 0.42, 0.9, 6, 0x46b07c, 0, 2.45, 0);
  }
  function lauvtre(x, z, s, c) {
    var g = gruppe(oy, x, 0, z); g.scale.setScalar(s || 1);
    syl(g, 0.13, 0.18, 0.9, 5, 0x8a5a33, 0, 0.45, 0);
    kule(g, 0.75, c || 0x5bbf6a, 0, 1.4, 0); kule(g, 0.5, c || 0x5bbf6a, 0.45, 1.05, 0.2);
  }
  function blomst(x, z, c) {
    syl(oy, 0.03, 0.03, 0.32, 4, 0x3f9b55, x, 0.16, z); kule(oy, 0.13, c, x, 0.38, z);
  }
  gran(-4.4, -2.6, 1.0); gran(-3.6, -1.6, 0.8); gran(3.6, -1.9, 0.9); gran(8.6, -4.3, 0.9); gran(-9.0, -3.2, 0.8);
  lauvtre(-9.9, -2.0, 1.0); lauvtre(-4.5, 6.3, 0.9, 0x6cc76a); lauvtre(9.9, 0.1, 0.85, 0x4fb774); lauvtre(4.4, 6.6, 0.7, 0xf2a65a);
  kule(oy, 0.4, 0x4fb774, -8.9, 0.25, 5.0); kule(oy, 0.33, 0x6cc76a, 9.2, 0.2, 4.0); kule(oy, 0.3, 0x4fb774, -1.2, 0.18, 7.3);
  [[0.4, 7.2, 0xff6b81], [-0.4, 6.7, 0xffd166], [1.1, 6.8, 0xffffff], [-5.6, 6.9, 0xff9f5a], [5.0, 7.0, 0xff6b81], [8.2, 4.9, 0xffd166],
   [-9.7, 3.7, 0xffffff], [-4.4, 2.6, 0xff6b81], [4.2, 2.9, 0xffd166], [9.6, -1.6, 0xff9f5a], [-9.2, -3.6, 0xffd166]].forEach(function (b) { blomst(b[0], b[1], b[2]); });
  // tråkkheller fram til tavla
  [[0, 5.0], [0.5, 5.9], [-0.1, 6.5]].forEach(function (s) { var h = syl(oy, 0.42, 0.46, 0.08, 6, 0xd9d2c0, s[0], 0.04, s[1]); h.castShadow = false; });

  /* ---------- fjell (natur og friluftsliv) ---------- */
  function fjell(x, z, r, h, c, sider) {
    kjegle(oy, r, h, sider, c, x, h / 2, z);
    var sh = h * 0.34; kjegle(oy, r * 0.34 * 1.04, sh, sider, 0xffffff, x, h - sh / 2 + 0.03, z);   // snøhette
  }
  fjell(1.6, -4.4, 4.3, 10.5, 0x8e9fa6, 6); fjell(-2.9, -5.2, 3.3, 8.0, 0x9dadb2, 5); fjell(5.2, -6.2, 2.2, 4.6, 0x82949b, 5);

  /* ---------- romrakett ---------- */
  var rampe = gruppe(oy, 5.9, 0, -4.2);
  syl(rampe, 1.5, 1.7, 0.3, 8, 0xaab3b8, 0, 0.15, 0);
  boks(rampe, 0.22, 3.9, 0.22, 0xe25b4b, -1.15, 2.2, -0.3); boks(rampe, 0.8, 0.14, 0.14, 0xe25b4b, -0.8, 3.3, -0.3);
  var rakett = gruppe(rampe, 0, 0.3, 0);
  syl(rakett, 0.62, 0.7, 2.7, 8, 0xf7f4ec, 0, 1.95, 0);
  kjegle(rakett, 0.62, 1.2, 8, 0xe9503f, 0, 3.9, 0);
  syl(rakett, 0.72, 0.72, 0.22, 8, 0xe9503f, 0, 1.2, 0);
  for (var f = 0; f < 3; f++) { var a0 = f * 2.094 + 0.5; var fin = boks(rakett, 0.12, 1.0, 0.7, 0xe9503f, Math.cos(a0) * 0.85, 0.8, Math.sin(a0) * 0.85); fin.rotation.y = -a0 + Math.PI / 2; }
  var vindu = syl(rakett, 0.26, 0.26, 0.1, 8, 0x4fc3e8, 0, 2.5, 0.63); vindu.rotation.x = Math.PI / 2;
  syl(rakett, 0.4, 0.3, 0.35, 6, 0x6d7a80, 0, 0.42, 0);
  var flamme = kjegle(rakett, 0.42, 1.8, 6, 0xffb02e, 0, -0.65, 0, { emissive: 0xff7a00 }); flamme.rotation.x = Math.PI; flamme.visible = false; flamme.castShadow = false;
  var letter = 0;

  /* ---------- borg (historie og eventyr) ---------- */
  var borg = gruppe(oy, -6.7, 0, -4.3);
  syl(borg, 1.2, 1.35, 3.3, 8, 0xc9cdd1, 0, 1.65, 0); syl(borg, 1.5, 1.5, 0.5, 8, 0xb5bbc0, 0, 3.5, 0);
  for (var k = 0; k < 8; k += 2) { var ak = k * Math.PI / 4 + 0.39; boks(borg, 0.5, 0.45, 0.5, 0xc9cdd1, Math.cos(ak) * 1.22, 3.95, Math.sin(ak) * 1.22).rotation.y = -ak; }
  kjegle(borg, 0.95, 1.5, 8, 0xd9534a, 0, 4.5, 0);
  boks(borg, 0.6, 1.0, 0.15, 0x6b4a2f, 0.25, 0.5, 1.28).rotation.y = 0.2;
  boks(borg, 0.3, 0.45, 0.1, 0x3c4a55, 0.3, 2.3, 1.2).rotation.y = 0.2;
  boks(borg, 2.4, 1.3, 0.6, 0xc9cdd1, 2.1, 0.65, 0.3); boks(borg, 0.5, 0.35, 0.6, 0xc9cdd1, 1.3, 1.45, 0.3); boks(borg, 0.5, 0.35, 0.6, 0xc9cdd1, 2.9, 1.45, 0.3);
  syl(borg, 0.04, 0.04, 1.3, 4, 0x6b4a2f, 0, 5.8, 0);
  var flagg = gruppe(borg, 0, 6.15, 0); boks(flagg, 0.8, 0.45, 0.04, 0xf4b942, 0.42, 0, 0);
  anim.push(function (t) { flagg.rotation.y = Math.sin(t * 2.2) * 0.5; });

  /* ---------- dinosaur ---------- */
  var dino = gruppe(oy, -7.6, 0, -0.3, -0.35);
  var kropp = kule(dino, 1.05, 0x55b96a, 0, 1.6, 0, 1); kropp.scale.set(1.55, 1, 1.05);
  kule(dino, 0.8, 0xc9e8a5, 0, 1.2, 0, 0).scale.set(1.4, 0.7, 0.85);
  [[-0.8, 0.5], [-0.8, -0.5], [0.8, 0.5], [0.8, -0.5]].forEach(function (b) { syl(dino, 0.3, 0.26, 1.1, 5, 0x47a55c, b[0], 0.55, b[1]); });
  var hale = kjegle(dino, 0.5, 2.3, 5, 0x55b96a, -2.3, 1.45, 0); hale.rotation.z = Math.PI / 2 + 0.15;
  var nakke = gruppe(dino, 1.25, 1.9, 0); nakke.rotation.z = -0.55;
  syl(nakke, 0.3, 0.46, 2.4, 5, 0x55b96a, 0, 1.1, 0);
  var hode = gruppe(nakke, 0, 2.3, 0); hode.rotation.z = 0.55;
  boks(hode, 1.0, 0.55, 0.62, 0x62c777, 0.3, 0.1, 0);
  boks(hode, 0.1, 0.14, 0.64, 0x23302b, 0.35, 0.22, 0); boks(hode, 0.12, 0.06, 0.4, 0x23302b, 0.78, 0.0, 0);
  for (var p = 0; p < 4; p++) kjegle(dino, 0.16, 0.34, 4, 0xf4b942, -0.9 + p * 0.55, 2.66 - Math.abs(p - 1.5) * 0.09, 0);
  anim.push(function (t) { nakke.rotation.z = -0.55 + Math.sin(t * 0.9) * 0.12; hode.rotation.z = 0.55 + Math.sin(t * 0.9 + 1) * 0.1; hale.rotation.y = Math.sin(t * 1.3) * 0.15; });

  /* ---------- fotball ---------- */
  var bane = gruppe(oy, -6.7, 0, 4.3, 0.22);
  boks(bane, 4.6, 0.08, 3.0, 0x6fc24f, 0, 0.04, 0); boks(bane, 1.15, 0.09, 3.0, 0x63b445, -1.15, 0.04, 0); boks(bane, 1.15, 0.09, 3.0, 0x63b445, 1.15, 0.04, 0);
  [[0, 0.06, 3.0, 0], [4.6, 0.06, 0.06, -1.47], [4.6, 0.06, 0.06, 1.47]].forEach(function (l) { var m = boks(bane, l[3] ? l[0] : 0.06, 0.02, l[3] ? 0.06 : l[2], 0xffffff, 0, 0.1, l[3]); m.castShadow = false; });
  var ring = legg(bane, new T.RingGeometry(0.5, 0.57, 10), 0xffffff, 0, 0.1, 0); ring.rotation.x = -Math.PI / 2; ring.castShadow = false;
  syl(bane, 0.05, 0.05, 1.0, 5, 0xffffff, -2.25, 0.5, -0.75); syl(bane, 0.05, 0.05, 1.0, 5, 0xffffff, -2.25, 0.5, 0.75);
  syl(bane, 0.05, 0.05, 1.5, 5, 0xffffff, -2.25, 1.0, 0).rotation.x = Math.PI / 2;
  boks(bane, 0.04, 1.0, 1.5, 0xffffff, -2.6, 0.5, 0, { transparent: true, opacity: 0.45 }).castShadow = false;
  kjegle(bane, 0.16, 0.34, 6, 0xff8a3d, 1.6, 0.25, 1.0); kjegle(bane, 0.16, 0.34, 6, 0xff8a3d, 1.9, 0.25, -0.9);
  var ball = kule(bane, 0.3, 0xffffff, 0.6, 0.4, 0.2, 1);
  anim.push(function (t) { var s = (t * 0.55) % 2; var u = s < 1 ? s : 2 - s; ball.position.x = -1.4 + u * 2.4; ball.position.y = 0.4 + Math.abs(Math.sin(t * 3.2)) * 0.9; ball.rotation.z = -t * 3; });

  /* ---------- robot ---------- */
  var robot = gruppe(oy, 6.4, 0, 0.5, -0.3);
  boks(robot, 0.34, 0.7, 0.36, 0x4b5b66, -0.32, 0.35, 0); boks(robot, 0.34, 0.7, 0.36, 0x4b5b66, 0.32, 0.35, 0);
  boks(robot, 1.3, 1.35, 0.9, 0x3aa8ff, 0, 1.35, 0); boks(robot, 0.7, 0.5, 0.06, 0xf7f4ec, 0, 1.45, 0.46);
  boks(robot, 0.16, 0.16, 0.08, 0xf4b942, -0.18, 1.5, 0.5, { emissive: 0xa06a00 }); boks(robot, 0.16, 0.16, 0.08, 0xe9503f, 0.18, 1.5, 0.5);
  var rhode = gruppe(robot, 0, 2.1, 0);
  boks(rhode, 1.0, 0.8, 0.8, 0x7ccfff, 0, 0.45, 0);
  boks(rhode, 0.22, 0.22, 0.06, 0xffffff, -0.24, 0.5, 0.41, { emissive: 0x7af0ff }); boks(rhode, 0.22, 0.22, 0.06, 0xffffff, 0.24, 0.5, 0.41, { emissive: 0x7af0ff });
  boks(rhode, 0.4, 0.07, 0.06, 0x23302b, 0, 0.2, 0.41);
  syl(rhode, 0.04, 0.04, 0.45, 4, 0x4b5b66, 0, 1.05, 0);
  var lampe = kule(rhode, 0.14, 0xffd166, 0, 1.34, 0, 0, { emissive: 0xffb000 });
  boks(robot, 0.26, 1.0, 0.3, 0x2f8fdd, -0.82, 1.35, 0);
  var arm = gruppe(robot, 0.82, 1.9, 0); boks(arm, 0.26, 1.0, 0.3, 0x2f8fdd, 0, 0.45, 0); kule(arm, 0.2, 0x4b5b66, 0, 1.0, 0);
  anim.push(function (t) { arm.rotation.z = -0.5 + Math.sin(t * 3) * 0.35; rhode.rotation.y = Math.sin(t * 0.7) * 0.25; lampe.scale.setScalar(1 + Math.sin(t * 4) * 0.2); });

  /* ---------- musikk ---------- */
  var scenen = gruppe(oy, 8.6, 0, 2.0, -0.4);
  syl(scenen, 1.45, 1.55, 0.28, 8, 0x9a6fd8, 0, 0.14, 0);
  var gitar = gruppe(scenen, -0.45, 0.3, 0.3); gitar.rotation.z = 0.18; gitar.rotation.x = -0.15;
  var g1 = syl(gitar, 0.5, 0.5, 0.18, 8, 0xf2a03d, 0, 0.5, 0); g1.rotation.x = Math.PI / 2;
  var g2 = syl(gitar, 0.37, 0.37, 0.18, 8, 0xf2a03d, 0, 1.05, 0); g2.rotation.x = Math.PI / 2;
  var g3 = syl(gitar, 0.15, 0.15, 0.2, 8, 0x4a3524, 0, 0.72, 0); g3.rotation.x = Math.PI / 2;
  boks(gitar, 0.14, 1.3, 0.08, 0x6b4a2f, 0, 1.9, 0.06); boks(gitar, 0.24, 0.32, 0.08, 0x4a3524, 0, 2.65, 0.06);
  syl(scenen, 0.48, 0.42, 0.5, 8, 0xe9503f, 0.7, 0.55, -0.1); syl(scenen, 0.5, 0.5, 0.06, 8, 0xf7f4ec, 0.7, 0.83, -0.1);
  syl(scenen, 0.03, 0.03, 1.3, 4, 0x4b5b66, 0.35, 0.9, -0.8); syl(scenen, 0.4, 0.4, 0.04, 8, 0xf4c542, 0.35, 1.56, -0.8).rotation.z = 0.15;
  var noter = [];
  for (var n = 0; n < 3; n++) {
    var note = gruppe(scenen, 0, 0, 0);
    kule(note, 0.16, 0x33405c, 0, 0, 0).scale.set(1.2, 0.85, 0.6); boks(note, 0.05, 0.55, 0.05, 0x33405c, 0.15, 0.28, 0); boks(note, 0.24, 0.1, 0.05, 0x33405c, 0.25, 0.5, 0);
    note.traverse(function (o) { o.castShadow = false; }); noter.push(note);
  }
  anim.push(function (t) { noter.forEach(function (o, i) { var u = (t * 0.28 + i / 3) % 1; o.position.set(-0.2 + i * 0.5 + Math.sin(u * 6 + i) * 0.25, 2.2 + u * 2.6, 0.2); o.scale.setScalar(Math.sin(u * Math.PI) * 1.1 + 0.01); o.rotation.z = Math.sin(u * 5 + i) * 0.3; }); });

  /* ---------- dam med seilbåt ---------- */
  var dam = gruppe(oy, 6.3, 0, 5.2);
  var vann = syl(dam, 1.75, 1.75, 0.08, 9, 0x5cc8ea, 0, 0.03, 0); vann.scale.z = 0.72; vann.castShadow = false;
  kule(dam, 0.28, 0xb9c0c4, -1.7, 0.1, 0.4); kule(dam, 0.2, 0xa5adb2, -1.3, 0.08, 0.95); kule(dam, 0.24, 0xb9c0c4, 1.75, 0.1, -0.2);
  syl(dam, 0.03, 0.03, 0.8, 4, 0x3f9b55, 1.3, 0.4, -0.85); syl(dam, 0.06, 0.06, 0.25, 5, 0x6b4a2f, 1.3, 0.85, -0.85);
  syl(dam, 0.03, 0.03, 0.6, 4, 0x3f9b55, 1.5, 0.3, -0.7); syl(dam, 0.06, 0.06, 0.22, 5, 0x6b4a2f, 1.5, 0.65, -0.7);
  var baat = gruppe(dam, 0, 0.1, 0);
  boks(baat, 0.95, 0.2, 0.36, 0xe9503f, 0, 0.08, 0); boks(baat, 0.7, 0.08, 0.3, 0xf7f4ec, 0, 0.2, 0);
  syl(baat, 0.03, 0.03, 1.0, 4, 0x6b4a2f, 0.05, 0.7, 0);
  var seil = kjegle(baat, 0.42, 0.85, 3, 0xffffff, -0.17, 0.75, 0); seil.scale.z = 0.12;
  anim.push(function (t) { baat.position.x = Math.cos(t * 0.35) * 0.75; baat.position.z = Math.sin(t * 0.35) * 0.5; baat.rotation.y = -t * 0.35 + Math.PI / 2; baat.rotation.z = Math.sin(t * 1.6) * 0.08; });

  /* ---------- sjakk ---------- */
  var sjakk = gruppe(oy, -2.7, 0, 6.0, 0.35);
  boks(sjakk, 2.0, 0.16, 2.0, 0x6b4a2f, 0, 0.08, 0); boks(sjakk, 1.8, 0.04, 1.8, 0x3c4a55, 0, 0.17, 0).castShadow = false;
  for (var i = 0; i < 4; i++) for (var j = 0; j < 4; j++) if ((i + j) % 2 === 0) boks(sjakk, 0.45, 0.05, 0.45, 0xf5ecd7, -0.675 + i * 0.45, 0.18, -0.675 + j * 0.45).castShadow = false;
  function brikke(x, z, c, type) {
    var b = gruppe(sjakk, x, 0.2, z);
    syl(b, 0.15, 0.19, 0.1, 6, c, 0, 0.05, 0);
    if (type === 'bonde') { syl(b, 0.07, 0.13, 0.3, 6, c, 0, 0.25, 0); kule(b, 0.13, c, 0, 0.48, 0); }
    if (type === 'taarn') { syl(b, 0.13, 0.15, 0.45, 6, c, 0, 0.32, 0); syl(b, 0.18, 0.18, 0.14, 6, c, 0, 0.6, 0); }
    if (type === 'konge') { syl(b, 0.08, 0.14, 0.6, 6, c, 0, 0.4, 0); syl(b, 0.16, 0.1, 0.14, 6, c, 0, 0.75, 0); boks(b, 0.05, 0.24, 0.05, c, 0, 0.93, 0); boks(b, 0.18, 0.05, 0.05, c, 0, 0.95, 0); }
  }
  brikke(-0.675, -0.225, 0xf5ecd7, 'konge'); brikke(0.225, 0.225, 0x2c3640, 'taarn'); brikke(-0.225, 0.675, 0xf5ecd7, 'bonde'); brikke(0.675, -0.675, 0x2c3640, 'bonde');

  /* ---------- bøker, eple og blyant ---------- */
  var boker = gruppe(oy, 2.8, 0, 6.1, -0.3);
  function bok(y, c, ry, w) { var b = gruppe(boker, 0, y, 0, ry); boks(b, w, 0.24, 0.85, c, 0, 0, 0); boks(b, w - 0.08, 0.16, 0.87, 0xfff8e6, 0.05, 0, 0).castShadow = false; }
  bok(0.12, 0xe9503f, 0.1, 1.25); bok(0.36, 0x0f8f80, -0.18, 1.15); bok(0.6, 0xf4b942, 0.22, 1.0);
  kule(boker, 0.2, 0xe23d3d, 0.05, 0.9, 0, 1); syl(boker, 0.02, 0.02, 0.12, 4, 0x6b4a2f, 0.05, 1.12, 0);
  var blyant = gruppe(boker, 1.0, 0, 0.1); blyant.rotation.z = -0.3;
  syl(blyant, 0.08, 0.08, 1.1, 6, 0xf4c542, 0, 0.75, 0); kjegle(blyant, 0.08, 0.22, 6, 0xf0d2a8, 0, 0.09, 0).rotation.x = Math.PI; syl(blyant, 0.085, 0.085, 0.14, 6, 0xff8fa3, 0, 1.36, 0);

  /* ---------- staffeli (kunst) ---------- */
  var kunst = gruppe(oy, 8.5, 0, -1.9, -0.5);
  [-0.45, 0.45].forEach(function (x) { var b = boks(kunst, 0.09, 2.0, 0.09, 0x8a5a33, x, 1.0, 0.15); b.rotation.x = 0.12; });
  boks(kunst, 0.09, 2.0, 0.09, 0x8a5a33, 0, 1.0, -0.45).rotation.x = -0.3;
  var lerret = gruppe(kunst, 0, 1.45, 0.2); lerret.rotation.x = -0.1;
  boks(lerret, 1.3, 1.0, 0.07, 0xffffff, 0, 0, 0);
  boks(lerret, 1.1, 0.3, 0.02, 0x7fd3f0, 0, 0.25, 0.04).castShadow = false; boks(lerret, 1.1, 0.5, 0.02, 0x8fd06a, 0, -0.15, 0.04).castShadow = false;
  boks(lerret, 0.26, 0.26, 0.03, 0xffd166, 0.3, 0.25, 0.05).castShadow = false; boks(lerret, 0.3, 0.4, 0.03, 0xe9503f, -0.25, -0.05, 0.05).castShadow = false;
  syl(kunst, 0.16, 0.14, 0.22, 6, 0xe9503f, -0.9, 0.11, 0.7); syl(kunst, 0.16, 0.14, 0.22, 6, 0x3aa8ff, -0.5, 0.11, 0.95); syl(kunst, 0.16, 0.14, 0.22, 6, 0xffd166, -1.0, 0.11, 1.1);

  /* ---------- spillmaskin ---------- */
  var spill = gruppe(oy, -9.5, 0, 1.9, 0.55);
  boks(spill, 0.95, 1.9, 0.8, 0x7b4fd6, 0, 0.95, 0); boks(spill, 1.0, 0.3, 0.86, 0xf4b942, 0, 2.0, 0);
  boks(spill, 0.72, 0.52, 0.06, 0x7af0ff, 0, 1.4, 0.4, { emissive: 0x2aa0b8 }).rotation.x = -0.2;
  boks(spill, 0.95, 0.14, 0.42, 0xff6fa5, 0, 0.98, 0.5);
  syl(spill, 0.03, 0.03, 0.2, 4, 0x23302b, -0.22, 1.14, 0.52); kule(spill, 0.07, 0xe9503f, -0.22, 1.27, 0.52);
  boks(spill, 0.1, 0.05, 0.1, 0xffd166, 0.15, 1.07, 0.55); boks(spill, 0.1, 0.05, 0.1, 0x5fd35a, 0.32, 1.07, 0.5);

  /* ---------- sauer (dyr) ---------- */
  function sau(x, z, ry) {
    var s = gruppe(oy, x, 0, z, ry);
    kule(s, 0.42, 0xfbfaf5, 0, 0.55, 0).scale.set(1.3, 1, 1); boks(s, 0.3, 0.28, 0.28, 0x3a3f45, 0.6, 0.68, 0);
    [[-0.3, 0.16], [-0.3, -0.16], [0.3, 0.16], [0.3, -0.16]].forEach(function (b) { syl(s, 0.05, 0.05, 0.3, 4, 0x3a3f45, b[0], 0.15, b[1]); });
    return s;
  }
  var sau1 = sau(-5.0, 1.3, -0.4); sau(-5.9, 2.0, 0.9); sau(-9.3, -0.9, 2.4);
  anim.push(function (t) { sau1.position.y = Math.max(0, Math.sin(t * 2.4)) * 0.18; });

  /* ---------- luftballong, planet og skyer ---------- */
  var ballong = gruppe(scene, -9.0, 6.6, -3.0);
  legg(ballong, new T.SphereGeometry(1.45, 8, 5), 0xef5d4e, 0, 1.3, 0).scale.y = 1.12;
  syl(ballong, 1.47, 1.47, 0.45, 8, 0xffd166, 0, 1.3, 0); syl(ballong, 0.72, 0.36, 0.7, 8, 0xef5d4e, 0, -0.3, 0);
  [[-0.25, -0.25], [0.25, -0.25], [-0.25, 0.25], [0.25, 0.25]].forEach(function (r) { syl(ballong, 0.015, 0.015, 0.7, 3, 0x6b4a2f, r[0], -0.95, r[1]); });
  boks(ballong, 0.6, 0.42, 0.6, 0x9c6b3f, 0, -1.45, 0);
  anim.push(function (t) { ballong.position.y = 6.6 + Math.sin(t * 0.6) * 0.35; ballong.position.x = -9.0 + Math.sin(t * 0.23) * 0.5; ballong.rotation.y = t * 0.15; });

  var planet = gruppe(scene, 9.6, 8.0, -5.0); planet.rotation.z = 0.35;
  kule(planet, 0.95, 0xf59e6c, 0, 0, 0, 1); var pring = legg(planet, new T.TorusGeometry(1.55, 0.11, 4, 12), 0xf4d58d, 0, 0, 0); pring.rotation.x = Math.PI / 2;
  var maane = kule(planet, 0.22, 0xdfe4e8, 2.3, 0, 0);
  anim.push(function (t) { planet.rotation.y = t * 0.3; maane.position.set(Math.cos(t * 0.8) * 2.4, 0.3, Math.sin(t * 0.8) * 2.4); planet.position.y = 8.0 + Math.sin(t * 0.5 + 2) * 0.2; });

  var skyer = [];
  function sky(x, y, z, s) {
    var g = gruppe(scene, x, y, z); g.scale.setScalar(s);
    [[0, 0, 0, 1], [1.0, -0.1, 0.1, 0.75], [-1.0, -0.15, 0, 0.7], [0.4, 0.45, -0.1, 0.7]].forEach(function (d) { var m = kule(g, d[3], 0xffffff, d[0], d[1], d[2]); m.castShadow = false; m.receiveShadow = false; });
    g.userData.x0 = x; g.userData.fart = 0.12 + (skyer.length % 3) * 0.05; skyer.push(g);
  }
  sky(-13, 9.5, -9, 1.3); sky(4, 11, -11, 1.0); sky(14, 6, -8, 1.2); sky(-5, 12.5, -12, 0.8); sky(-15, 3, -6, 0.9);
  anim.push(function (t) { skyer.forEach(function (g) { g.position.x = ((g.userData.x0 + t * g.userData.fart + 22) % 44) - 22; }); });

  /* ---------- oppslagstavla rundt innloggingskortet ---------- */
  var tavle = new T.Group(); scene.add(tavle);
  var enhet = new T.BoxGeometry(1, 1, 1);
  function del(c) { var m = new T.Mesh(enhet, mat(c)); m.castShadow = true; m.receiveShadow = true; tavle.add(m); return m; }
  var plate = del(0xd8a868), listT = del(0x9a6436), listB = del(0x9a6436), listV = del(0x9a6436), listH = del(0x9a6436), stolpeV = del(0x8a5a33), stolpeH = del(0x8a5a33), tak = del(0x0f6e63);
  var fugl = gruppe(tavle);
  kule(fugl, 0.26, 0xffc93c, 0, 0.26, 0); kule(fugl, 0.17, 0xffd766, 0.2, 0.52, 0);
  kjegle(fugl, 0.07, 0.2, 4, 0xff8a3d, 0.42, 0.5, 0).rotation.z = -Math.PI / 2;
  boks(fugl, 0.05, 0.05, 0.36, 0x23302b, 0.28, 0.58, 0); boks(fugl, 0.3, 0.06, 0.2, 0xf2a03d, -0.32, 0.3, 0).rotation.z = 0.5;
  anim.push(function (t) { var u = t % 4; fugl.position.y = fugl.userData.y + (u < 0.5 ? Math.abs(Math.sin(u * Math.PI * 4)) * 0.18 : 0); fugl.rotation.y = Math.sin(t * 0.8) * 0.5; });

  var C = new T.Vector3(), bak = new T.Vector3(0, Math.sin(PITCH), Math.cos(PITCH));
  function plasser() {
    var W = window.innerWidth, H = window.innerHeight, asp = W / H;
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);            // skånsomt mot iPad-batteriet
    renderer.setPixelRatio(dpr); renderer.setSize(W, H, false);
    camera.aspect = asp; camera.updateProjectionMatrix();
    // hvor mye av øya som skal få plass i bredden (mindre på høye skjermer, så kortet ikke blir bitte lite)
    var u = Math.max(0, Math.min(1, (asp - 0.6) / 0.7)); u = u * u * (3 - 2 * u);
    var bredde = Math.max(19 + 8 * u, 15.5 * asp);
    var r = kort.getBoundingClientRect();
    bredde = Math.min(bredde, 9.5 * W / r.height);                    // på mobil: zoom inn, så tavla ikke blir høyere enn fjellene
    var tanH = Math.tan(VFOV * Math.PI / 360);
    var D = bredde / (2 * tanH * asp);
    var wpp = 2 * D * tanH / H;                                       // hvor mange «meter» én piksel er ved tavla
    var bw = r.width * wpp, bh = r.height * wpp;
    var m = Math.max(0.34, Math.min(0.6, 20 * wpp));                  // treramma rundt kortet
    var cy = Math.max(2.6, (bh / 2 + m) * Math.cos(PITCH) + 0.75);
    C.set(0, cy, 3.6);
    camera.position.copy(C).addScaledVector(bak, D); camera.lookAt(C); camera.updateMatrixWorld();
    tavle.quaternion.copy(camera.quaternion);
    var hoyre = new T.Vector3(1, 0, 0).applyQuaternion(camera.quaternion), opp = new T.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
    tavle.position.copy(C).addScaledVector(hoyre, (r.left + r.width / 2 - W / 2) * wpp).addScaledVector(opp, -(r.top + r.height / 2 - H / 2) * wpp);
    var yw = bw + 2 * m, yh = bh + 2 * m, l = m * 0.55;
    plate.scale.set(yw, yh, 0.24); plate.position.set(0, 0, -0.16);
    listT.scale.set(yw + l, l, 0.4); listT.position.set(0, yh / 2, -0.1);
    listB.scale.set(yw + l, l, 0.4); listB.position.set(0, -yh / 2, -0.1);
    listV.scale.set(l, yh + l, 0.4); listV.position.set(-yw / 2, 0, -0.1);
    listH.scale.set(l, yh + l, 0.4); listH.position.set(yw / 2, 0, -0.1);
    tak.scale.set(yw + 1.0, 0.22, 1.0); tak.position.set(0, yh / 2 + l / 2 + 0.11, -0.25);
    var bunnY = tavle.position.y - (yh / 2) * Math.cos(PITCH);        // hvor høyt underkanten er over bakken
    var L = Math.max(0.4, bunnY / Math.cos(PITCH) + 0.7);
    [stolpeV, stolpeH].forEach(function (s, i) { s.scale.set(0.42, L, 0.34); s.position.set((i ? 1 : -1) * (yw / 2 - 0.75), -yh / 2 - L / 2 + 0.1, -0.3); });
    fugl.position.set(yw * 0.3, yh / 2 + l / 2 + 0.22, -0.2); fugl.userData.y = fugl.position.y;
  }
  window.addEventListener('resize', plasser);
  if (window.ResizeObserver) new ResizeObserver(plasser).observe(kort);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(plasser);
  plasser();

  /* ---------- tegn ---------- */
  var t0 = performance.now(), synlig = true;
  document.addEventListener('visibilitychange', function () { synlig = !document.hidden; });
  function tegn(naa) {
    requestAnimationFrame(tegn);
    if (!synlig) return;
    var t = (naa - t0) / 1000;
    if (rolig) t = 0.8;                                               // stillestående bilde for dem som har bedt om lite bevegelse
    for (var i = 0; i < anim.length; i++) anim[i](t);
    if (letter) {
      var s = (naa - letter) / 1000;
      rakett.position.y = 0.3 + s * s * s * 9; rakett.position.x = Math.sin(naa / 30) * 0.03;
      flamme.visible = true; flamme.scale.y = 0.8 + Math.random() * 0.5;
    }
    renderer.render(scene, camera);
  }
  requestAnimationFrame(tegn);

  return {
    farge: fargeCss,
    nøytral: nøytralCss,
    inn: function (cb) {
      if (rolig) { setTimeout(cb, 600); return; }
      letter = performance.now();
      setTimeout(cb, 1700);
    },
    tilbakestill: function () { letter = 0; rakett.position.set(0, 0.3, 0); flamme.visible = false; }
  };
})();
