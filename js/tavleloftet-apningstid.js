/* =========================================================================
   TAVLELOFTET – åpningstid (felles for alle læringsverdener)
   -------------------------------------------------------------------------
   Legges i <head> ETTER tavleloftet-elev.js på sidene i en verden:

     <script src="../js/tavleloftet-apningstid.js"></script>

   Verdenen er åpen et visst antall minutter hver dag (STANDARD = 30).
   Tiden telles bare mens siden vises på skjermen, og er felles for alle
   sidene i verdenen. Når tiden er brukt opp, stenger verdenen til neste dag.
   Fem minutter før kommer et varsel.

   Den voksne styrer tiden på rapportsiden (rapport.html, åpnes med
   voksenkoden): minutter per dag, «ingen grense» eller 10 minutter ekstra
   i dag. Det samme kan gjøres fra «For voksne» på stengt-skjermen og i
   voksenmenyen i dinoparkene.

   Lagring i skyen, under elevkoden:  elever/<kode>/innst
     tid        minutter per dag (0 = ingen grense). Mangler = STANDARD
     ekstraDag  dato det er gitt ekstra tid for, ekstraMin = hvor mange minutter
     bruktDag   dato, bruktMin = minutter brukt den dagen (oppdateres hvert minutt)
   Bare tall og datoer – ingen navn.
   På enheten: tl-tid-<verden> (sekunder brukt i dag) og tl-tidinnst-<verden>
   (sist kjente innstilling, så det virker uten nett).
   ========================================================================= */
(function () {
  'use strict';
  var TL = window.TL;
  if (!TL || !TL.verden || !(TL.kode || TL.testmodus)) return;     // ikke logget inn (sendes til logginn) eller ukjent verden
  // Vises siden inne i verdenen (Lyslaget-basen åpner Verkstedet osv. i en ramme), teller den ytre siden tiden. Ellers ville tiden gått dobbelt.
  try { if (window.top !== window.self && window.parent.TLTid && window.parent.TL && window.parent.TL.verden === TL.verden) return; } catch (e) {}

  var STANDARD = 30, VALG = [10, 15, 20, 30, 45, 60, 90, 0], VARSEL = 5 * 60, NAADE = 4 * 60, UTEN_SJEKK = 60;
  /* Tekst per verden. «opptatt» sier om eleven er midt i en runde – da får runden bli ferdig før det stenges. */
  var dinoOpptatt = function () { return document.body.classList.contains('do-åpen') || !!document.querySelector('.modal#adult:not([hidden])'); };
  var TEKST = {
    dinoparken:  { navn: 'Dinoparken', sover: 'Dinoene skal sove nå.', opptatt: dinoOpptatt },
    dinoparken2: { navn: 'Dinoparken', sover: 'Dinoene skal sove nå.', opptatt: dinoOpptatt },
    dinodalen:   { navn: 'Dinodalen',  sover: 'Dinoene skal sove nå.', opptatt: dinoOpptatt },
    // I basen (basen.html) får en åpen oppgave bli ferdig før det stenges. De andre Lyslaget-sidene varsler og stenger som før.
    lyslaget:    { navn: 'Lyslaget',   sover: 'Robotene skal lade batteriene nå.', opptatt: /basen\.html$/.test(location.pathname) ? function () { return !!document.querySelector('#lag .overlegg, #side.apen'); } : undefined }
  };
  var T = TEKST[TL.verden] || { navn: TL.verdenNavn || 'Verdenen', sover: 'Nå er det pause.' };
  var CFG = window.TAVLELOFTET_FIREBASE, DB = CFG && CFG.databaseURL ? CFG.databaseURL.replace(/\/$/, '') : null;
  var SKY = !!(DB && TL.kode);
  var LS = window.localStorage, K_BRUK = 'tl-tid-' + TL.verden, K_INNST = 'tl-tidinnst-' + TL.verden;

  function to(n) { return (n < 10 ? '0' : '') + n; }
  function idag() { var d = new Date(); return d.getFullYear() + '-' + to(d.getMonth() + 1) + '-' + to(d.getDate()); }
  function lesJ(k) { try { return JSON.parse(LS.getItem(k)) || {}; } catch (e) { return {}; } }
  function skrivJ(k, v) { try { LS.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function bruk() { var b = lesJ(K_BRUK); if (b.dag !== idag()) b = { dag: idag(), brukt: 0, varslet: false }; return b; }
  function innst() { var i = lesJ(K_INNST); return { tid: typeof i.tid === 'number' ? i.tid : STANDARD, ekstra: i.ekstraDag === idag() ? (i.ekstraMin || 0) : 0 }; }
  function igjen() { var i = innst(); return i.tid > 0 ? (i.tid + i.ekstra) * 60 - (bruk().brukt || 0) - ubokfort : Infinity; }
  function minTxt(s) { var m = Math.max(0, Math.ceil(s / 60)); return m === 1 ? '1 minutt' : m + ' minutter'; }

  /* ---------- skyen ---------- */
  function sky(metode, data) {
    if (!SKY) return Promise.resolve(null);
    return fetch(DB + '/elever/' + TL.kode + '/innst.json', metode === 'GET' ? { cache: 'no-store' } : { method: 'PATCH', body: JSON.stringify(data) })
      .then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
  }
  function hentInnst() {
    return sky('GET').then(function (i) {
      if (!i) return;
      skrivJ(K_INNST, { tid: i.tid, ekstraDag: i.ekstraDag, ekstraMin: i.ekstraMin });
      // brukt på en annen enhet i dag? Da gjelder det høyeste tallet
      if (i.bruktDag === idag() && typeof i.bruktMin === 'number') { var b = bruk(); if (i.bruktMin * 60 > (b.brukt || 0) + 90) { b.brukt = i.bruktMin * 60; skrivJ(K_BRUK, b); } }
      vis(); sjekk();
    });
  }
  function sendBruk() { var b = bruk(); sky('PATCH', { bruktDag: b.dag, bruktMin: Math.round((b.brukt || 0) / 60) }); }
  function settInnst(endring) {                      // endring = { tid } eller { ekstraDag, ekstraMin }
    var i = lesJ(K_INNST); for (var k in endring) i[k] = endring[k]; skrivJ(K_INNST, i);
    var b = bruk(); b.varslet = false; skrivJ(K_BRUK, b);
    vis(); sjekk();
    return sky('PATCH', endring);
  }

  /* ---------- utseende ---------- */
  var st = document.createElement('style');
  st.textContent =
    '.tt-chip{position:fixed;right:16px;bottom:16px;z-index:5;display:flex;align-items:center;gap:8px;background:rgba(255,253,246,.95);border:3px solid #1f3b2c;border-radius:999px;padding:6px 14px 6px 8px;font:600 17px Fredoka,system-ui,sans-serif;color:#1f3b2c;box-shadow:0 4px 0 rgba(31,59,44,.18);pointer-events:none}' +
    '.tt-chip.snart{background:#fff3cf}.tt-chip svg{flex:none}' +
    '@media (max-width:640px){.tt-chip{bottom:70px;font-size:15px}}' +
    '.tt-toast{position:fixed;left:50%;top:104px;transform:translateX(-50%);z-index:9998;background:#fff3cf;border:3px solid #1f3b2c;border-radius:20px;padding:12px 22px;font:600 20px Fredoka,system-ui,sans-serif;color:#1f3b2c;box-shadow:0 6px 0 rgba(31,59,44,.18);text-align:center;max-width:90vw;transition:opacity .4s}' +
    '.tt-stengt{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:16px;overflow:auto;background:radial-gradient(ellipse at 50% 20%,#34507a 0%,#1d2f4f 60%,#141f38 100%);font-family:"Atkinson Hyperlegible",system-ui,sans-serif}' +
    '.tt-kort{background:#fffdf6;border:4px solid #1f3b2c;border-radius:28px;box-shadow:0 10px 0 rgba(0,0,0,.3);width:min(560px,100%);padding:26px 26px 22px;text-align:center;color:#1f3b2c}' +
    '.tt-kort h2{font:700 clamp(26px,5vw,36px) Fredoka,system-ui,sans-serif;margin:10px 0 8px;color:#1f3b2c}' +
    '.tt-kort p{font-size:clamp(18px,3vw,22px);line-height:1.4;margin:0 0 16px;color:#1f3b2c}' +
    '.tt-knapp{min-height:56px;padding:10px 20px;border:3px solid #1f3b2c;border-radius:18px;background:#f2a33a;font:600 20px Fredoka,system-ui,sans-serif;color:#1f3b2c;cursor:pointer;box-shadow:0 5px 0 rgba(31,59,44,.22);touch-action:manipulation}' +
    '.tt-voksen{display:block;margin:18px auto 0;background:none;border:0;font:400 15px "Atkinson Hyperlegible",system-ui,sans-serif;color:#5a6f62;text-decoration:underline;cursor:pointer;padding:8px}' +
    '.tt-kode{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:12px}' +
    '.tt-kode input{font:600 18px system-ui,sans-serif;padding:10px 12px;border:2px solid #1f3b2c;border-radius:12px;width:210px;text-align:center;text-transform:uppercase}' +
    '.tt-panel{margin:12px 0;padding:12px 14px;background:#f3efe2;border-radius:16px;text-align:left;font:400 16px "Atkinson Hyperlegible",system-ui,sans-serif;color:#1f3b2c}' +
    '.tt-panel b.t{font:600 18px Fredoka,system-ui,sans-serif;display:block;margin-bottom:4px}' +
    '.tt-panel .rad{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:8px}' +
    '.tt-panel select,.tt-panel button,.tt-kode button{font:600 16px Fredoka,system-ui,sans-serif;color:#1f3b2c;border:2px solid #1f3b2c;border-radius:12px;padding:8px 12px;background:#fff;min-height:44px;cursor:pointer}' +
    '.tt-panel small{display:block;margin-top:8px;color:#5a6f62}';
  document.head.appendChild(st);
  var KLOKKE = '<svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#9fd46b" stroke="#1f3b2c" stroke-width="2"/><path d="M12 6.5V12l3.5 2.5" fill="none" stroke="#1f3b2c" stroke-width="2.2" stroke-linecap="round"/></svg>';
  var MAANE = '<svg width="92" height="92" viewBox="0 0 92 92" aria-hidden="true"><circle cx="46" cy="46" r="42" fill="#1d2f4f" stroke="#1f3b2c" stroke-width="4"/><path d="M58 22a26 26 0 1 0 14 40A22 22 0 0 1 58 22z" fill="#ffe08a" stroke="#1f3b2c" stroke-width="3" stroke-linejoin="round"/><circle cx="26" cy="30" r="2.5" fill="#fff"/><circle cx="36" cy="18" r="1.8" fill="#fff"/><circle cx="20" cy="52" r="1.8" fill="#fff"/></svg>';

  var chip, stengtEl, ubokfort = 0, overtid = 0, sekSidenSky = 0;
  function toast(txt) {
    var m = document.createElement('div'); m.className = 'tt-toast'; m.setAttribute('role', 'status'); m.textContent = txt; document.body.appendChild(m);
    setTimeout(function () { m.style.opacity = '0'; }, 6000); setTimeout(function () { m.remove(); }, 6500);
  }
  function si(txt) { try { if (!('speechSynthesis' in window)) return; speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(txt); u.lang = 'nb-NO'; u.rate = .95; speechSynthesis.speak(u); } catch (e) {} }
  var STENGT_TXT = T.navn + ' er stengt for i dag. ' + T.sover + ' Kom tilbake i morgen!';
  function steng() {
    if (stengtEl) return;
    bokfor(); sendBruk();
    stengtEl = document.createElement('div'); stengtEl.className = 'tt-stengt'; stengtEl.setAttribute('role', 'dialog'); stengtEl.setAttribute('aria-modal', 'true'); stengtEl.setAttribute('aria-label', 'Stengt for i dag');
    stengtEl.innerHTML = '<div class="tt-kort">' + MAANE + '<h2>Stengt for i dag</h2><p>' + T.sover + '<br>Kom tilbake i morgen – da åpner ' + T.navn + ' igjen!</p>' +
      '<button class="tt-knapp" id="ttHor">🔊 Les for meg</button><button class="tt-voksen" id="ttVoksen">For voksne</button><div id="ttVoksenBoks"></div></div>';
    document.body.appendChild(stengtEl);
    stengtEl.querySelector('#ttHor').onclick = function () { si(STENGT_TXT); };
    stengtEl.querySelector('#ttVoksen').onclick = voksenBoks;
    si(STENGT_TXT);
  }
  /* «For voksne» på stengt-skjermen: voksenkoden åpner innstillingene */
  function voksenBoks() {
    var boks = stengtEl && stengtEl.querySelector('#ttVoksenBoks'); if (!boks) return;
    boks.innerHTML = '<div class="tt-kode"><input id="ttVk" type="password" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="14" placeholder="Voksenkode" aria-label="Voksenkode"><button id="ttVkOk" type="button">Åpne</button></div><p id="ttVkFb" style="font-size:15px;margin:8px 0 0"></p>';
    var inn = boks.querySelector('#ttVk'), fb = boks.querySelector('#ttVkFb');
    var prov = function () {
      fb.textContent = 'Sjekker …';
      var ok = TL.sjekkVoksenkode && TL.kode ? TL.sjekkVoksenkode(inn.value) : Promise.resolve(inn.value === '1234');   // testmodus: 1234
      ok.then(function (ja) { if (ja) { boks.innerHTML = ''; panel(boks); } else { fb.textContent = 'Feil kode. Voksenkoden står i velkomstbrevet.'; inn.select(); } });
    };
    boks.querySelector('#ttVkOk').onclick = prov; inn.onkeydown = function (e) { if (e.key === 'Enter') prov(); };
    setTimeout(function () { inn.focus(); }, 50);
  }
  function apne() { if (stengtEl) { stengtEl.remove(); stengtEl = null; } overtid = 0; }
  function vis() {
    if (!chip) return;
    var s = igjen();
    if (s === Infinity) { chip.hidden = true; return; }
    chip.hidden = false; chip.classList.toggle('snart', s <= VARSEL);
    chip.innerHTML = KLOKKE + '<span>' + (s > 0 ? 'Åpent ' + minTxt(s) + ' til' : 'Stenger snart') + '</span>';
  }
  function bokfor() { if (!ubokfort) return; var b = bruk(); b.brukt = (b.brukt || 0) + ubokfort; ubokfort = 0; skrivJ(K_BRUK, b); }
  function sjekk() {
    var s = igjen();
    if (s > 0) {
      apne();
      var b = bruk(), i = innst();
      if (s <= VARSEL && !b.varslet && (i.tid + i.ekstra) * 60 > VARSEL) {
        bokfor(); b = bruk(); b.varslet = true; skrivJ(K_BRUK, b);
        toast(T.navn + ' stenger om 5 minutter. Gjør ferdig det du holder på med!'); si(T.navn + ' stenger om fem minutter.');
      }
      return;
    }
    if (stengtEl) return;
    // Tiden er ute. Vet vi at eleven er midt i en runde, får den bli ferdig (maks NAADE sekunder).
    // Vet vi det ikke (verdener uten «opptatt»), sier vi fra og stenger etter UTEN_SJEKK sekunder.
    if (T.opptatt) { if (T.opptatt() && overtid < NAADE) { overtid++; return; } }
    else if (overtid < UTEN_SJEKK && !startetStengt) { if (!overtid) { toast(T.navn + ' stenger nå. Gjør ferdig oppgaven du holder på med!'); si(T.navn + ' stenger nå. Gjør ferdig oppgaven.'); } overtid++; return; }
    steng();
  }
  function tikk() {
    if (document.visibilityState !== 'visible') return;
    if (!stengtEl) ubokfort++;
    if (ubokfort >= 5) bokfor();
    if (++sekSidenSky >= 60) { sekSidenSky = 0; bokfor(); if (!stengtEl) sendBruk(); hentInnst(); }
    vis(); sjekk();
  }
  addEventListener('pagehide', bokfor);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState !== 'visible') bokfor(); });

  /* ---------- innstillinger (voksenmenyen i verdenen og «For voksne» på stengt-skjermen) ---------- */
  function panel(el) {
    if (!el) return;
    var tegn = function () {
      bokfor();
      var i = innst(), brukt = Math.floor((bruk().brukt || 0) / 60), s = igjen();
      el.innerHTML = '<div class="tt-panel"><b class="t">Åpningstid</b>' +
        '<span>' + (i.tid > 0 ? 'Brukt i dag: <b>' + brukt + ' av ' + (i.tid + i.ekstra) + ' minutter</b>' + (s <= 0 ? ' – stengt for i dag' : '') : 'Ingen grense. Brukt i dag: <b>' + brukt + ' minutter</b>') + '</span>' +
        '<div class="rad"><label>Åpent hver dag: <select aria-label="Minutter per dag">' + VALG.map(function (v) { return '<option value="' + v + '"' + (v === i.tid ? ' selected' : '') + '>' + (v ? v + ' minutter' : 'Ingen grense') + '</option>'; }).join('') +
        (VALG.indexOf(i.tid) < 0 ? '<option value="' + i.tid + '" selected>' + i.tid + ' minutter</option>' : '') + '</select></label>' +
        (i.tid > 0 ? '<button type="button">Gi 10 minutter ekstra i dag</button>' : '') + '</div>' +
        (SKY ? '<small>Dette kan også endres på rapportsiden (tavleloftet.no/rapport.html) med voksenkoden.</small>' : '') + '</div>';
      el.querySelector('select').onchange = function (e) { settInnst({ tid: +e.target.value }); tegn(); };
      var b = el.querySelector('button');
      if (b) b.onclick = function () {
        var naa = innst(), mangler = Math.max(0, -Math.floor(igjen() / 60));       // er tiden brukt opp, skal «10 ekstra» gi 10 hele minutter
        settInnst({ ekstraDag: idag(), ekstraMin: naa.ekstra + mangler + 10 }); tegn();
      };
    };
    tegn();
  }
  window.TLTid = { panel: panel, status: function () { bokfor(); var i = innst(); return { tid: i.tid, ekstra: i.ekstra, bruktSek: bruk().brukt || 0, igjenSek: igjen() }; } };

  var startetStengt = false;
  function start() {
    chip = document.createElement('div'); chip.className = 'tt-chip'; chip.setAttribute('role', 'status'); document.body.appendChild(chip);
    startetStengt = true;                    // er tiden alt brukt opp når siden åpnes (også etter svar fra skyen), stenges det med en gang
    vis(); sjekk();
    var ferdig = function () { startetStengt = false; };
    hentInnst().then(ferdig, ferdig);
    setInterval(tikk, 1000);
  }
  if (document.body) start(); else addEventListener('DOMContentLoaded', start);
})();
