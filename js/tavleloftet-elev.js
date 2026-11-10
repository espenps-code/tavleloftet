/* =========================================================================
   TAVLELOFTET – elevinnlogging og lagring i skyen
   -------------------------------------------------------------------------
   Legges ØVERST i <head> i hver side i en læringsverden:

     <script src="../js/tavleloftet-firebase.js"></script>
     <script src="../js/tavleloftet-elev.js" data-verden="dinoparken"></script>

   Slik virker det (kort fortalt):
   • Spillene lagrer som før i nettleseren (localStorage). Denne fila legger
     seg «mellom» og sender en kopi av framgangen til Firebase hver gang noe
     endres – som en automatisk sikkerhetskopi.
   • Er ingen elev logget inn på enheten, sendes eleven til logginn.html.
   • Når eleven logger inn (også på en ny iPad), hentes framgangen fra skyen.
   • Uten nett lagres det lokalt, og sendes opp når nettet er tilbake.
   • Står Firebase-oppsettet som null, kjører verdenen i testmodus
     (bare lokal lagring, ingen innlogging).
   ========================================================================= */
(function () {
  'use strict';
  var VERDENER = {
    dinoparken: { navn: 'Dinoparken', prefikser: ['dinoparken-'] },
    lyslaget:   { navn: 'Lyslaget',   prefikser: ['kl-', 'rv-', 'ru-'] }
  };
  var me = document.currentScript;
  var verden = me && me.getAttribute('data-verden');
  var side = me && me.getAttribute('data-side');           // 'logginn' på innloggingssida
  var V = VERDENER[verden];
  var CFG = window.TAVLELOFTET_FIREBASE;
  var LS = window.localStorage;
  var OKT = 'tl-okt-' + verden, SYNK = 'tl-synk-' + verden, SKITTEN = 'tl-skitten-' + verden;
  var TL = window.TL = { verden: verden, verdenNavn: V && V.navn, VERDENER: VERDENER };

  if (!V) { console.warn('Tavleloftet: ukjent verden', verden); return; }
  if (!CFG || !CFG.databaseURL) { TL.testmodus = true; console.info('Tavleloftet: testmodus – lagrer bare på denne enheten.'); return; }

  var DB = CFG.databaseURL.replace(/\/$/, '');
  var KODE_RE = /^[A-HJ-NP-Z2-9]{6}$/;

  /* ---------- små hjelpere ---------- */
  function lesJSON(k) { try { return JSON.parse(LS.getItem(k)); } catch (e) { return null; } }
  function passer(k) { if (!k) return false; for (var i = 0; i < V.prefikser.length; i++) if (k.indexOf(V.prefikser[i]) === 0) return true; return false; }
  function enc(k) { return encodeURIComponent(k).replace(/\./g, '%2E'); }
  function dec(k) { try { return decodeURIComponent(k); } catch (e) { return k; } }
  var ekteSet = Storage.prototype.setItem, ekteRemove = Storage.prototype.removeItem, ekteClear = Storage.prototype.clear;
  function settStille(k, v) { ekteSet.call(LS, k, v); }
  function fjernStille(k) { ekteRemove.call(LS, k); }

  function bilde() {                       // alt denne verdenen har lagret lokalt
    var d = {};
    for (var i = 0; i < LS.length; i++) { var k = LS.key(i); if (passer(k)) d[enc(k)] = LS.getItem(k); }
    return d;
  }
  function tømLokalt() {
    var ut = [];
    for (var i = 0; i < LS.length; i++) { var k = LS.key(i); if (passer(k)) ut.push(k); }
    ut.forEach(fjernStille);
  }
  function skrivLokalt(data) {
    tømLokalt();
    if (data) Object.keys(data).forEach(function (k) { if (typeof data[k] === 'string') settStille(dec(k), data[k]); });
  }
  function likt(a, b) {
    var ka = Object.keys(a || {}).sort(), kb = Object.keys(b || {}).sort();
    if (ka.join('|') !== kb.join('|')) return false;
    for (var i = 0; i < ka.length; i++) if (a[ka[i]] !== b[ka[i]]) return false;
    return true;
  }
  function url(sti) { return DB + '/' + sti + '.json'; }

  /* ---------- felles funksjoner (brukes også av logginn.html) ---------- */
  TL.hentElev = function (kode) {
    return fetch(url('elever/' + kode), { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('nett');
      return r.json();
    });
  };
  TL.loggInn = function (kode, elev, til) {
    skrivLokalt(elev && elev.data);
    settStille(OKT, JSON.stringify({ kode: kode, tid: Date.now() }));
    settStille(SYNK, String((elev && elev.oppdatert) || 0));
    fjernStille(SKITTEN);
    location.replace(til || 'index.html');
  };
  TL.loggUt = function () {
    var gjør = function () { tømLokalt(); fjernStille(OKT); fjernStille(SYNK); fjernStille(SKITTEN); location.replace('logginn.html'); };
    if (LS.getItem(SKITTEN)) TL.synkNå().then(gjør, gjør); else gjør();
  };
  TL.formater = function (k) { return k ? k.slice(0, 3) + '-' + k.slice(3) : ''; };
  TL.KODE_RE = KODE_RE;

  if (side === 'logginn') return;          // innloggingssida trenger ikke resten

  /* ---------- er noen logget inn? ---------- */
  var okt = lesJSON(OKT);
  if (!okt || !KODE_RE.test(okt.kode || '')) {
    document.documentElement.style.visibility = 'hidden';
    var her = location.pathname.split('/').pop() || 'index.html';
    location.replace('logginn.html?til=' + encodeURIComponent(her + location.search + location.hash));
    return;
  }
  TL.kode = okt.kode;

  /* ---------- send endringer til skyen ---------- */
  var timer = null, sender = false, påNytt = false;
  // Til vi har sjekket skyen, holder vi igjen: ellers kunne en gammel iPad
  // overskrive nyere framgang fra en annen iPad i det sida starter.
  var klar = false, ventende = false, uSendtFraFør = !!LS.getItem(SKITTEN);
  function merk() {
    if (!klar) { ventende = true; return; }
    settStille(SKITTEN, '1'); clearTimeout(timer); timer = setTimeout(TL.synkNå, 1500);
  }
  function blirKlar() { klar = true; if (ventende) { ventende = false; merk(); } }
  Storage.prototype.setItem = function (k, v) { ekteSet.call(this, k, v); if (this === LS && passer(k)) merk(); };
  Storage.prototype.removeItem = function (k) { ekteRemove.call(this, k); if (this === LS && passer(k)) merk(); };
  Storage.prototype.clear = function () {
    if (this !== LS) return ekteClear.call(this);
    var behold = {}; [OKT, SYNK].forEach(function (k) { var v = LS.getItem(k); if (v != null) behold[k] = v; });
    ekteClear.call(this); Object.keys(behold).forEach(function (k) { settStille(k, behold[k]); }); merk();
  };

  TL.synkNå = function (holdIlive) {
    clearTimeout(timer);
    if (sender) { påNytt = true; return Promise.resolve(); }
    if (!LS.getItem(SKITTEN)) return Promise.resolve();
    sender = true;
    var body = JSON.stringify({ data: bilde(), oppdatert: { '.sv': 'timestamp' } });
    return fetch(url('elever/' + TL.kode), { method: 'PATCH', body: body, keepalive: !!holdIlive && body.length < 60000 })
      .then(function (r) {
        if (r.status === 401 || r.status === 403) { TL.koblingBrutt = true; throw new Error('nektet'); }
        if (!r.ok) throw new Error('nett');
        return r.json();
      })
      .then(function (svar) {
        settStille(SYNK, String((svar && svar.oppdatert) || Date.now()));
        fjernStille(SKITTEN);
        TL.sistLagret = new Date();
      })
      .catch(function (e) { console.warn('Tavleloftet: fikk ikke lagret i skyen ennå –', e.message); })
      .then(function () { sender = false; if (påNytt) { påNytt = false; merk(); } });
  };
  addEventListener('pagehide', function () { if (LS.getItem(SKITTEN)) TL.synkNå(true); });
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden' && LS.getItem(SKITTEN)) TL.synkNå(true); });
  addEventListener('online', function () { if (LS.getItem(SKITTEN)) TL.synkNå(); });

  /* ---------- hent nyere framgang fra skyen (f.eks. brukt på en annen iPad) ---------- */
  TL.hentElev(TL.kode).then(function (elev) {
    if (elev === null) {                   // koden er slettet av en voksen
      tømLokalt(); fjernStille(OKT); fjernStille(SYNK); fjernStille(SKITTEN);
      location.replace('logginn.html?melding=slettet');
      return;
    }
    var server = Number(elev.oppdatert || 0), lokal = Number(LS.getItem(SYNK) || 0);
    if (uSendtFraFør) { blirKlar(); TL.synkNå(); return; }  // ulagret arbeid fra denne iPaden vinner
    if (server > lokal && !likt(elev.data || {}, bilde())) {
      if (sessionStorage.getItem('tl-lastet-pa-nytt') === String(server)) { blirKlar(); return; }
      sessionStorage.setItem('tl-lastet-pa-nytt', String(server));
      skrivLokalt(elev.data);
      settStille(SYNK, String(server));
      location.reload();
      return;
    }
    if (server > lokal) settStille(SYNK, String(server));
    blirKlar();
  }).catch(function () { blirKlar(); /* uten nett: fortsett lokalt, sendes når nettet er tilbake */ });
})();
