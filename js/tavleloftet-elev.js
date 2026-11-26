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
   • Kommer noen inn fra «Prøv en verden» (prov.html, ?prove=1), kjører verdenen
     i prøvemodus: ingen kode, ingen sky, egne lagringsnøkler. Se PRØVEMODUS under.
   ========================================================================= */
(function () {
  'use strict';
  var VERDENER = {
    dinoparken: { navn: 'Dinoparken', prefikser: ['dinoparken-'] },
    dinoparken2: { navn: 'Dinoparken', prefikser: ['dp2-'] },      // Dinoparken med oppgavepakker (egne oppgaver per elev)
    dinodalen:  { navn: 'Dinodalen',  prefikser: ['dinodalen-'] },   // Dinoparken i ny drakt: elvedal og seks andre dinoer
    lyslaget:   { navn: 'Lyslaget',   prefikser: ['kl-', 'rv-', 'ru-', 'lysbase-'] },  // lysbase- = selve verdenen (basen.html)
    sakuradalen: { navn: 'Sakuradalen', prefikser: ['sakuradalen-'] }   // monsterverdenen: fange, trene og dyste (25.11.2026)
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

  /* ---------- PRØVEMODUS («Prøv en verden», prov.html) ----------
     Besøkende som vil se en verden før de bestiller, kommer inn med ?prove=1.
     Da gjelder dette, helt til fanen lukkes eller de går til en innloggingsside:
       • ingen elevkode, ingen innlogging og INGENTING sendes til skyen
       • framgangen ligger bare i FANEN (sessionStorage), under egne nøkler som starter
         med «prove~». Den er borte når fanen lukkes, og en ekte elev på samme iPad
         blir aldri blandet inn.
       • prøven varer PROVE_MIN minutter (tiden telles bare mens siden vises). Da kommer
         en sluttskjerm med bestilling, og det som er gjort i prøven slettes. Slik kan
         ingen bruke prøven som et gratis opplegg for en elev over tid.
       • åpningstiden er slått av (se tavleloftet-apningstid.js)
       • verdenen gir litt ekstra startkapital (TL.proveStart), så den som titter
         rekker å se en utbygging på noen minutter
       • et lite bånd øverst sier at dette er en prøve, med lenke til bestilling.
         Etter noen sekunder krymper det til en liten flik man kan trykke på.
     Flagget ligger i sessionStorage (tl-prove), så det følger fanen, ikke enheten. */
  var PROVE_START = { dinoparken: 100, dinodalen: 100, lyslaget: 70, sakuradalen: 60 };   // ekstra mynter/skruer i prøven
  var PROVE_MIN = 15;                                                                      // hvor mange minutter prøven varer
  var PROVE_NEDE = { lyslaget: true };                                                     // båndet nederst i stedet for øverst
  var iProve = false;
  try {
    var SS = window.sessionStorage;
    if (side === 'logginn') { SS.removeItem('tl-prove'); SS.removeItem('tl-prove-vist'); SS.removeItem('tl-prove-brukt'); }
    else if (/[?&]prove=1(&|#|$)/.test(location.search) && verden in PROVE_START) {
      SS.setItem('tl-prove', '1');
      // Kommer noen inn på nytt fra prøvesiden etter at tiden er ute, starter prøven helt forfra
      var iRammeNå = false; try { iRammeNå = window.top !== window.self; } catch (e) { iRammeNå = true; }
      if (!iRammeNå && Number(SS.getItem('tl-prove-brukt') || 0) >= PROVE_MIN * 60) {
        var ryddes = []; for (var ri = 0; ri < SS.length; ri++) { var rk = SS.key(ri); if (rk.indexOf('prove~') === 0) ryddes.push(rk); }
        ryddes.forEach(function (k) { SS.removeItem(k); });
        SS.removeItem('tl-prove-brukt'); SS.removeItem('tl-prove-vist');
      }
    }
    iProve = side !== 'logginn' && SS.getItem('tl-prove') === '1' && verden in PROVE_START;
  } catch (e) {}
  if (iProve) {
    (function () {
      var P = 'prove~', SP = Storage.prototype;
      var eGet = SP.getItem, eSet = SP.setItem, eRem = SP.removeItem, eKey = SP.key, eClear = SP.clear;
      var eLen = Object.getOwnPropertyDescriptor(SP, 'length').get;
      function min(k) { k = String(k); for (var i = 0; i < V.prefikser.length; i++) if (k.indexOf(V.prefikser[i]) === 0) return true; return false; }
      /* Verdenen tror den bruker localStorage som vanlig. Nøklene som hører til verdenen blir i
         stedet lagt i fanens sessionStorage med «prove~» foran. Alt annet går til localStorage. */
      var FANE = window.sessionStorage;
      function prøvenøkler(alle) {          // prøvenøklene i fanen: for denne verdenen, eller alle
        var ut = [], n = eLen.call(FANE);
        for (var i = 0; i < n; i++) { var k = eKey.call(FANE, i); if (k.indexOf(P) === 0 && (alle || min(k.slice(P.length)))) ut.push(k); }
        return ut;
      }
      function synlige() {                  // det verdenen «ser»: prøvenøklene uten merke, og alt som ikke er elevdata
        var ut = prøvenøkler().map(function (k) { return k.slice(P.length); }), n = eLen.call(LS);
        for (var i = 0; i < n; i++) { var k = eKey.call(LS, i); if (!min(k) && k.indexOf(P) !== 0) ut.push(k); }
        return ut;
      }
      SP.getItem = function (k) { return this === LS && min(k) ? eGet.call(FANE, P + k) : eGet.call(this, k); };
      SP.setItem = function (k, v) { return this === LS && min(k) ? eSet.call(FANE, P + k, v) : eSet.call(this, k, v); };
      SP.removeItem = function (k) { return this === LS && min(k) ? eRem.call(FANE, P + k) : eRem.call(this, k); };
      SP.key = function (i) { if (this !== LS) return eKey.call(this, i); var s = synlige(); return i >= 0 && i < s.length ? s[i] : null; };
      SP.clear = function () { if (this !== LS) return eClear.call(this); prøvenøkler().forEach(function (k) { eRem.call(FANE, k); }); };
      try { Object.defineProperty(SP, 'length', { configurable: true, get: function () { return this === LS ? synlige().length : eLen.call(this); } }); } catch (e) {}
      // Rydd bort prøvedata som en tidligere utgave la igjen i localStorage
      try { var gamle = []; for (var gi = 0; gi < eLen.call(LS); gi++) { var gk = eKey.call(LS, gi); if (gk.indexOf(P) === 0) gamle.push(gk); } gamle.forEach(function (k) { eRem.call(LS, k); }); } catch (e) {}

      TL.testmodus = true;                  // som lokal testing: ingen kode, ingen sky
      TL.prove = true;
      TL.proveStart = PROVE_START[verden] || 0;
      TL.proveNullstill = function () { prøvenøkler().forEach(function (k) { eRem.call(FANE, k); }); location.reload(); };
      TL.proveAvslutt = function () { try { prøvenøkler(true).forEach(function (k) { eRem.call(FANE, k); }); eRem.call(FANE, 'tl-prove'); eRem.call(FANE, 'tl-prove-vist'); eRem.call(FANE, 'tl-prove-brukt'); } catch (e) {} location.href = '../prov.html'; };

      /* Båndet øverst. Vises ikke på sider som ligger i en ramme inne i verdenen. */
      var iRamme = false; try { iRamme = window.top !== window.self; } catch (e) { iRamme = true; }
      if (iRamme) return;
      function bånd() {
        if (document.getElementById('tl-prove')) return;
        var st = document.createElement('style');
        st.textContent =
          '#tl-prove{position:fixed;left:50%;top:0;transform:translateX(-50%);z-index:2147483000;display:flex;align-items:center;gap:10px;max-width:calc(100vw - 16px);' +
          'padding:6px 8px 8px 8px;border-radius:0 0 18px 18px;background:#1F3A34;color:#F3EFE4;border:2px solid #E0A63A;border-top:0;box-shadow:0 6px 18px rgba(0,0,0,.28);' +
          'font:700 14px/1.2 "Atkinson Hyperlegible",system-ui,sans-serif;white-space:nowrap}' +
          '#tl-prove a,#tl-prove button{font:700 13px/1 "Atkinson Hyperlegible",system-ui,sans-serif;border-radius:999px;padding:8px 12px;cursor:pointer;text-decoration:none;flex-shrink:0;' +
          'margin:0;min-height:0;min-width:0;width:auto;height:auto;box-shadow:none;text-transform:none;letter-spacing:0;-webkit-appearance:none;appearance:none}' +
          '#tl-prove .tl-p-merke{background:transparent;color:#F3EFE4;border:0;font-size:14px;display:flex;align-items:center;gap:6px;padding:8px 6px 8px 8px}' +
          '#tl-prove .tl-p-merke small{font-weight:400;opacity:.85;font-size:13px}' +
          '#tl-prove .tl-p-merke i{font-style:normal;font-size:11px;transition:transform .2s}' +
          '#tl-prove a{background:#E0A63A;color:#1F3A34;border:0}' +
          '#tl-prove .tl-p-slutt{background:transparent;color:#F3EFE4;border:2px solid rgba(243,239,228,.55)}' +
          '#tl-prove a:focus-visible,#tl-prove button:focus-visible{outline:3px solid #fff;outline-offset:2px}' +
          '#tl-prove.liten{padding:0 4px 2px;gap:0;border-radius:0 0 12px 12px;opacity:.94}' +
          '#tl-prove.liten .tl-p-merke{padding:5px 8px;font-size:12px}' +
          '#tl-prove.liten .tl-p-merke small,#tl-prove.liten a,#tl-prove.liten .tl-p-slutt{display:none}' +
          '#tl-prove:not(.liten) .tl-p-merke i{transform:rotate(180deg)}' +
          '#tl-prove.nede{top:auto;bottom:0;border-top:2px solid #E0A63A;border-bottom:0;border-radius:18px 18px 0 0;padding:8px 8px 6px}' +
          '#tl-prove.nede.liten{border-radius:12px 12px 0 0;padding:2px 4px 0}' +
          '#tl-prove.nede .tl-p-merke i{transform:rotate(180deg)}#tl-prove.nede:not(.liten) .tl-p-merke i{transform:none}' +
          '@media (max-width:640px){#tl-prove .tl-p-merke small{display:none}#tl-prove{gap:6px}}' +
          '@media print{#tl-prove{display:none}}';
        document.head.appendChild(st);
        var b = document.createElement('div');
        b.id = 'tl-prove'; b.setAttribute('role', 'region'); b.setAttribute('aria-label', 'Prøveversjon');
        if (PROVE_NEDE[verden]) b.className = 'nede';        // der toppen av skjermen er full (robotrekka i Lyslaget)
        b.innerHTML = '<button type="button" class="tl-p-merke" aria-expanded="true"><span>Prøveversjon <small>· <b id="tl-p-tid"></b> igjen · lagres ikke</small></span><i aria-hidden="true">▾</i></button>' +
          '<a href="../skreddersydd.html#henvendelse">Bestill en slik verden</a>' +
          '<button type="button" class="tl-p-slutt">Avslutt</button>';
        var merke = b.firstChild, timer = null;
        function sett(liten) { b.classList.toggle('liten', liten); merke.setAttribute('aria-expanded', String(!liten)); }
        b.addEventListener('click', function (e) {
          clearTimeout(timer);
          if (e.target.closest('.tl-p-slutt')) return TL.proveAvslutt();
          if (e.target.closest('.tl-p-merke')) sett(!b.classList.contains('liten'));
        });
        /* Første side i prøven viser hele båndet noen sekunder. Etterpå er det bare en liten flik
           øverst, så det ikke ligger over noe i verdenen. Trykk på fliken for å åpne det igjen. */
        var sett_for = false; try { sett_for = sessionStorage.getItem('tl-prove-vist') === '1'; sessionStorage.setItem('tl-prove-vist', '1'); } catch (e) {}
        sett(sett_for);
        if (!sett_for) {                    // tell fra siden er ferdig lastet, så båndet rekker å bli sett også på en treg iPad
          var start = function () { timer = setTimeout(function () { sett(true); }, 7000); };
          if (document.readyState === 'complete') start(); else addEventListener('load', start);
        }
        document.body.appendChild(b);

        /* Klokka: teller sekunder mens siden vises. Når tiden er ute, slettes prøven og sluttskjermen vises. */
        var GRENSE = PROVE_MIN * 60, ferdig = false;
        function brukt() { return Number(eGet.call(FANE, 'tl-prove-brukt') || 0); }
        function visTid() {
          var m = Math.max(1, Math.ceil((GRENSE - brukt()) / 60)), el = document.getElementById('tl-p-tid');
          if (el) el.textContent = m + (m === 1 ? ' minutt' : ' minutter');
        }
        function slutt() {
          if (ferdig) return; ferdig = true;
          try { prøvenøkler(true).forEach(function (k) { eRem.call(FANE, k); }); } catch (e) {}
          st.textContent +=
            '#tl-prove-slutt{position:fixed;inset:0;z-index:2147483600;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(12,26,30,.94);' +
            'font:400 18px/1.5 "Atkinson Hyperlegible",system-ui,sans-serif;color:#1B2B27}' +
            '#tl-prove-slutt div{background:#FFF7E6;border-radius:28px;padding:32px;max-width:520px;width:100%;text-align:center;box-shadow:0 30px 60px rgba(0,0,0,.5)}' +
            '#tl-prove-slutt h2{font:700 32px/1.1 Fredoka,"Atkinson Hyperlegible",system-ui,sans-serif;margin:0 0 10px;color:#1B2B27}' +
            '#tl-prove-slutt p{margin:0 0 22px;color:#3D5650}' +
            '#tl-prove-slutt a{display:block;margin:10px 0 0;padding:14px 20px;border-radius:999px;font-weight:700;text-decoration:none;color:#1B2B27;border:2px solid #8FA39D}' +
            '#tl-prove-slutt a.hoved{background:#F4B942;border-color:#F4B942;box-shadow:0 5px 0 #B9861F}' +
            '#tl-prove-slutt a:focus-visible{outline:3px solid #0F6E63;outline-offset:3px}';
          var s = document.createElement('div');
          s.id = 'tl-prove-slutt'; s.setAttribute('role', 'dialog'); s.setAttribute('aria-modal', 'true'); s.setAttribute('aria-labelledby', 'tl-p-slutt-t');
          s.innerHTML = '<div><h2 id="tl-p-slutt-t">Prøven er slutt</h2>' +
            '<p>Du har sett deg rundt i ' + PROVE_MIN + ' minutter. I en ekte verden får eleven sin egen kode, oppgaver som er tilpasset, og framgangen blir lagret.</p>' +
            '<a class="hoved" href="../skreddersydd.html#henvendelse">Bestill en slik verden</a>' +
            '<a href="../rapport.html?demo">Se en eksempelrapport</a>' +
            '<a href="../prov.html">Tilbake til prøvesiden</a></div>';
          b.style.display = 'none';
          document.body.appendChild(s);
          // Ingenting bak skjermen skal kunne brukes
          [].forEach.call(document.body.children, function (el) { if (el !== s) { try { el.inert = true; } catch (e) {} } });
          var f = s.querySelector('a'); if (f) f.focus();
        }
        visTid();
        if (brukt() >= GRENSE) return slutt();
        setInterval(function () {
          if (ferdig || document.visibilityState !== 'visible') return;
          var n = brukt() + 1; eSet.call(FANE, 'tl-prove-brukt', String(n));
          if (n >= GRENSE) slutt(); else if (n % 15 === 0) visTid();
        }, 1000);
      }
      if (document.body) bånd(); else document.addEventListener('DOMContentLoaded', bånd);
    })();
    return;
  }
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
  /* Voksenmenyen i verdenene: åpnes med elevens egen voksenkode (fra velkomstbrevet),
     ikke en felles kode. Sjekker at voksenkoden hører til eleven som er logget inn. */
  TL.sjekkVoksenkode = function (skrevet) {
    var vk = String(skrevet || '').toUpperCase().replace(/[^0-9A-Z]/g, '');
    if (!/^[A-HJ-NP-Z2-9]{10}$/.test(vk) || !TL.kode) return Promise.resolve(false);
    return fetch(url('voksenkoder/' + vk + '/info'), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (info) { return !!(info && info.elev === TL.kode); })
      .catch(function () { return false; });
  };

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
