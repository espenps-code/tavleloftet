/* =====================================================================
   LYSLAGET-BASEN – oppgavene som hører til selve verdenen
   ---------------------------------------------------------------------
   Lastes av basen.html. To oppgavetyper:

   «venner»  – Vennekroken: sosiale ferdigheter med den lille roboten Bit.
               Nivå 1 Kjenn igjen følelser · Nivå 2 Hva føler Bit nå? ·
               Nivå 3 Lurt eller ikke lurt?
               Neste nivå åpner når eleven har 8 riktige av de 10 siste
               (på første forsøk). Riktig svar på første forsøk gir skruer.

   «jegser»  – Utkikken: eleven ser på et myldrebilde og skriver fem
               setninger som begynner med «Jeg ser». En voksen leser dem og
               holder «Godkjenn» inne. Først da kommer skruene.
               Setningene lagres bare til de er godkjent. Etterpå slettes de.

   En stasjon i STASJONER (basen.html) får oppgaven med  oppg:'venner'
   eller  oppg:'jegser'.

   Filer:  basen/sosial/  fol-…, sc-…, at-… (bilder av Bit)
           basen/jegser/  jegser-01.webp … jegser-10.webp (myldrebilder)
           basen/lyd/     ett klipp per tekst (ElevenLabs, stemmen Terje)
   Lagring: Vennekroken ligger i selve spillet (lysbase-spill → venn).
            «Jeg ser» ligger i lysbase-jegser-v1.
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- Tall du kan skru på ---------- */
  var ROT = 'basen/';
  var HOLDTID = 1300;                      // så lenge (ms) må den voksne holde «Godkjenn» inne
  var KRAV = { siste: 10, riktige: 8 };    // 8 riktige av de 10 siste åpner neste nivå
  var JEGSER = { antallBilder: 10, setninger: 5, skruer: 15, nokkel: 'lysbase-jegser-v1' };

  /* ---------- Innholdet i Vennekroken ---------- */
  var NIVAANAVN = ['Kjenn igjen følelser', 'Hva føler Bit nå?', 'Lurt eller ikke lurt?'];
  var FOLELSER = [
    { id: 'glad', navn: 'glad', forklar: 'Munnen smiler, og øynene er glade. Bit er glad.' },
    { id: 'lei', navn: 'lei seg', forklar: 'Munnen peker ned, og det kommer tårer. Bit er lei seg.' },
    { id: 'sint', navn: 'sint', forklar: 'Øyenbrynene peker ned, og hendene er knyttet. Bit er sint.' },
    { id: 'redd', navn: 'redd', forklar: 'Øynene er store, og Bit skjelver. Bit er redd.' },
    { id: 'overrasket', navn: 'overrasket', forklar: 'Øynene og munnen er helt åpne. Bit er overrasket.' }
  ];
  /* ikke = følelser som lett kan forveksles med den riktige (brukes ikke som feilsvar) */
  var SCENER = [
    { id: 'batteri', tekst: 'Bit får et helt nytt batteri av en venn.', f: 'glad', ikke: [] },
    { id: 'mistet', tekst: 'Bit mister den fineste skruen sin ned i en kum.', f: 'lei', ikke: ['sint'] },
    { id: 'taarn', tekst: 'Noen river ned klossetårnet til Bit med vilje.', f: 'sint', ikke: ['lei'] },
    { id: 'torden', tekst: 'Det tordner og lyner høyt.', f: 'redd', ikke: ['overrasket'] },
    { id: 'boe', tekst: 'En venn hopper fram bak en kasse og sier «bø!».', f: 'overrasket', ikke: ['redd', 'glad'] },
    { id: 'deler', tekst: 'En venn deler verktøyet sitt med Bit.', f: 'glad', ikke: [] },
    { id: 'alene', tekst: 'Ingen vil leke med Bit i dag.', f: 'lei', ikke: ['sint'] },
    { id: 'tar-ball', tekst: 'Noen tar ballen fra Bit uten å spørre.', f: 'sint', ikke: ['lei'] },
    { id: 'skygge', tekst: 'Bit ser en stor, mørk skygge i garasjen.', f: 'redd', ikke: ['overrasket'] },
    { id: 'gave', tekst: 'Bit åpner en gave. Oppi ligger noe Bit ikke visste om!', f: 'overrasket', ikke: ['glad'] }
  ];
  var ATFERD = [
    { id: 'venter', tekst: 'Bit venter på tur ved ladestasjonen.', lurt: true, f: 'Ja! Når vi venter på tur, får alle lade.' },
    { id: 'sniker', tekst: 'Bit sniker foran de andre i køen.', lurt: false, f: 'Nei. Da blir de andre lei seg. Vi venter på tur.' },
    { id: 'spor', tekst: 'Bit spør: «Kan jeg være med?»', lurt: true, f: 'Ja! Det er lurt å spørre om å få være med.' },
    { id: 'dytter', tekst: 'Bit dytter en venn for å komme først.', lurt: false, f: 'Nei. Å dytte gjør vondt. Vi bruker ord.' },
    { id: 'deler-leker', tekst: 'Bit deler klossene sine med en venn.', lurt: true, f: 'Ja! Når vi deler, kan vi leke sammen.' },
    { id: 'river', tekst: 'Bit tar bilen rett ut av hendene på en venn.', lurt: false, f: 'Nei. Vi spør først: «Kan jeg låne den?»' },
    { id: 'hei', tekst: 'Bit sier «hei» og vinker til en venn.', lurt: true, f: 'Ja! Det er hyggelig å si hei.' },
    { id: 'roper', tekst: 'Bit roper mens en venn prøver å si noe.', lurt: false, f: 'Nei. Vi lytter når andre snakker.' },
    { id: 'hjelper', tekst: 'En venn har falt. Bit hjelper vennen opp.', lurt: true, f: 'Ja! Det er snilt å hjelpe.' },
    { id: 'ler', tekst: 'En venn har falt. Bit ler av vennen.', lurt: false, f: 'Nei. Da blir vennen lei seg. Vi spør: «Gikk det bra?»' },
    { id: 'takk', tekst: 'Bit får en oljekanne og sier «takk».', lurt: true, f: 'Ja! Det er fint å si takk.' },
    { id: 'lytter', tekst: 'Bit ser på vennen sin og lytter når vennen forteller.', lurt: true, f: 'Ja! Da merker vennen at Bit bryr seg.' }
  ];
  /* Hvilke oppgavetyper som trekkes på hvert nivå */
  var TYPER = { 1: ['folelse'], 2: ['hvaFoler', 'hvaFoler', 'folelse'], 3: ['lurt', 'lurt', 'hvaFoler'] };
  /* Hva myldrebildene viser (brukes som bildetekst for skjermlesere) */
  var JS_BILDER = ['', 'Roboter i verkstedet', 'Roboter på stranda', 'Roboter i byen', 'Roboter på lekeplassen', 'Roboter på gården',
    'Roboter i bursdag', 'Roboter i snøen', 'Roboter på togstasjonen', 'Roboter på kjøkkenet', 'Roboter på månen'];

  /* ---------- Små hjelpere ---------- */
  function rnd(n) { return Math.floor(Math.random() * n); }
  function velg(a) { return a[rnd(a.length)]; }
  function stokk(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = rnd(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function to(n) { return (n < 10 ? '0' : '') + n; }
  function fol(id) { return FOLELSER.filter(function (x) { return x.id === id; })[0]; }
  function sosBilde(n, kl) { return '<img class="lo-pic ' + (kl || '') + '" src="' + ROT + 'sosial/' + n + '.webp" alt="">'; }
  function logg(maal, riktig) { if (window.TLFramgang) window.TLFramgang.logg(maal, riktig); }

  /* ---------- Opplesing (ferdig innleste klipp) ---------- */
  var lydEl = null, ko = [], lydTimer = null;
  function nesteKlipp() {
    if (!ko.length) return;
    var n = ko.shift();
    if (typeof n === 'number') { lydTimer = setTimeout(nesteKlipp, n); return; }
    if (!lydEl) { lydEl = new Audio(); lydEl.addEventListener('ended', nesteKlipp); lydEl.addEventListener('error', nesteKlipp); }
    lydEl.src = ROT + 'lyd/' + n + '.mp3';
    var p = lydEl.play(); if (p && p.catch) p.catch(function () {});
  }
  function stopp() { ko = []; clearTimeout(lydTimer); if (lydEl) { try { lydEl.pause(); } catch (e) {} } }
  function spill(liste) { stopp(); ko = (liste || []).slice(); nesteKlipp(); }
  function leggTil(liste) { var gikk = ko.length || (lydEl && !lydEl.paused && !lydEl.ended); ko = ko.concat(liste); if (!gikk) nesteKlipp(); }

  /* ---------- Rammen rundt en oppgave ---------- */
  var NA = null;   // { st, omr, si } mens en oppgave er åpen
  function ramme(tittel, ikon, bred) {
    window.dialog(
      '<div class="lo">' +
        '<div class="lo-topp"><h2>' + ikon + ' ' + esc(tittel) + '</h2><span class="lo-luft"></span>' +
          '<button class="sek lo-rund" data-lo="hor" aria-label="Hør en gang til">🔊</button>' +
          '<button class="sek lo-rund" data-a="lukk" aria-label="Lukk">✕</button></div>' +
        '<div id="loUnder" class="lo-under"></div>' +
        '<p id="loTekst" class="lo-tekst"></p>' +
        '<div id="loBoks"></div>' +
        '<div id="loFot" class="lo-fot"></div>' +
      '</div>',
      function (el) {
        el.classList.add('lo-dlg'); if (bred) el.classList.add('bred');
        el.addEventListener('click', function (e) {
          var b = e.target.closest('[data-lo]'); if (!b || b.disabled) return;
          if (b.dataset.lo === 'hor' && NA && NA.si) spill(NA.si);
          if (b.dataset.lo === 'niva') { var V = venn(); V.niva = +b.dataset.n; window.lagre(); nyVenn(); }
          if (b.dataset.lo === 'neste') nyVenn();
        });
      });
  }
  function $(id) { return document.getElementById(id); }
  function skruetekst(m) { return '<span class="lo-skruer">+' + m + ' 🔩</span>'; }

  /* =====================================================================
     VENNEKROKEN
     ===================================================================== */
  function venn() {
    var S = window.S;
    if (!S.venn) S.venn = { niva: 1, apnet: 1, s: {}, sist: [] };
    return S.venn;
  }
  function riktigeSiste(V, n) { var s = (V.s[n] || '').slice(-KRAV.siste); return s.split('1').length - 1; }
  /* Trekker en ting eleven ikke nettopp har hatt */
  function ny(liste, V, type) {
    var mulige = liste.filter(function (x) { return V.sist.indexOf(type + ':' + x.id) < 0; });
    var x = velg(mulige.length ? mulige : liste);
    V.sist.push(type + ':' + x.id); while (V.sist.length > 4) V.sist.shift();
    return x;
  }
  function nivaKnapper(V) {
    var h = '';
    for (var n = 1; n <= 3; n++) {
      var last = n > V.apnet;
      h += '<button class="lo-niva' + (n === V.niva ? ' valgt' : '') + '" data-lo="niva" data-n="' + n + '"' + (last ? ' disabled' : '') +
        ' aria-label="Nivå ' + n + ': ' + NIVAANAVN[n - 1] + (last ? ' (låst)' : '') + '">' + (last ? '🔒 ' : '') + 'Nivå ' + n + '</button>';
    }
    var r = riktigeSiste(V, V.niva), prikker = '';
    if (V.niva === V.apnet && V.apnet < 3) {
      for (var i = 0; i < KRAV.riktige; i++) prikker += '<i class="' + (i < r ? 'pa' : '') + '"></i>';
      prikker = '<span class="lo-prikker" role="img" aria-label="' + r + ' av ' + KRAV.riktige + ' riktige mot neste nivå">' + prikker + '</span>';
    }
    return '<div class="lo-nivarad">' + h + '</div><div class="lo-navn">' + esc(NIVAANAVN[V.niva - 1]) + prikker + '</div>';
  }
  var LAG = {
    folelse: function (V) {
      var f = ny(FOLELSER, V, 'f'), valg = stokk([f].concat(stokk(FOLELSER.filter(function (x) { return x !== f; })).slice(0, 2)));
      return { tekst: 'Hvem er <b>' + f.navn + '</b>?', si: ['so-hvem-' + f.id],
        tegn: function (boks, svar) { bildeknapper(boks, valg, f, svar, false); },
        forklar: '<div class="lo-forklar">' + sosBilde('fol-' + f.id) + '<p>' + f.forklar + '</p></div>', forklarLyd: ['fol-' + f.id + '-forklar'] };
    },
    hvaFoler: function (V) {
      var s = ny(SCENER, V, 's'), f = fol(s.f);
      var valg = stokk([f].concat(stokk(FOLELSER.filter(function (x) { return x !== f && s.ikke.indexOf(x.id) < 0; })).slice(0, 2)));
      return { tekst: esc(s.tekst) + ' <b>Hvordan har Bit det nå?</b>', si: ['sc-' + s.id, 300, 'so-hvordan-har'],
        tegn: function (boks, svar) { boks.innerHTML = '<div class="lo-midt">' + sosBilde('sc-' + s.id, 'scene') + '</div>'; bildeknapper(boks, valg, f, svar, true); },
        forklar: '<div class="lo-forklar">' + sosBilde('fol-' + f.id) + '<p>' + esc(s.tekst) + '<br>Da blir Bit <b>' + f.navn + '</b>.</p></div>', forklarLyd: ['sc-' + s.id, 250, 'so-blir-' + f.id] };
    },
    lurt: function (V) {
      var a = ny(ATFERD, V, 'a');
      return { tekst: esc(a.tekst) + ' <b>Er det lurt?</b>', si: ['at-' + a.id, 300, 'so-er-det-lurt'],
        tegn: function (boks, svar) {
          boks.innerHTML = '<div class="lo-midt">' + sosBilde('at-' + a.id, 'scene') + '</div>';
          var rad = document.createElement('div'); rad.className = 'lo-valg to';
          [[true, '👍', 'Ja, det er lurt'], [false, '👎', 'Nei, ikke lurt']].forEach(function (v) {
            var b = document.createElement('button'); b.className = 'lo-svar tommel'; b.innerHTML = '<span class="ik">' + v[1] + '</span>' + v[2];
            b.onclick = function () { ferdigValg(rad, b, v[0] === a.lurt, function (x) { return x === (a.lurt ? rad.firstChild : rad.lastChild); }); svar(v[0] === a.lurt); };
            rad.appendChild(b);
          });
          boks.appendChild(rad);
        },
        forklar: '<div class="lo-forklar"><p><b>' + esc(a.f) + '</b></p></div>', forklarLyd: ['at-' + a.id + '-f'] };
    }
  };
  function ferdigValg(rad, trykket, riktig, erRiktig) {
    Array.prototype.forEach.call(rad.querySelectorAll('button'), function (x) { x.disabled = true; if (erRiktig(x)) x.classList.add('rett'); });
    if (!riktig) trykket.classList.add('feil');
  }
  function bildeknapper(boks, valg, riktig, svar, medNavn) {
    var rad = document.createElement('div'); rad.className = 'lo-valg' + (medNavn ? ' smaa' : '');
    valg.forEach(function (x) {
      var b = document.createElement('button'); b.className = 'lo-svar bilde';
      b.innerHTML = sosBilde('fol-' + x.id) + (medNavn ? '<span>' + x.navn + '</span>' : '');
      b.setAttribute('aria-label', medNavn ? x.navn : 'Bilde av Bit');
      b._x = x;
      b.onclick = function () { ferdigValg(rad, b, x === riktig, function (k) { return k._x === riktig; }); svar(x === riktig); };
      rad.appendChild(b);
    });
    boks.appendChild(rad);
  }
  function nyVenn() {
    if (!NA) return;
    var V = venn(), o = LAG[velg(TYPER[V.niva])](V), niva = V.niva;
    $('loUnder').innerHTML = nivaKnapper(V);
    $('loTekst').innerHTML = o.tekst;
    $('loFot').innerHTML = '';
    var boks = $('loBoks'); boks.innerHTML = '';
    NA.si = o.si;
    o.tegn(boks, function (riktig) {
      V.s[niva] = ((V.s[niva] || '') + (riktig ? '1' : '0')).slice(-KRAV.siste);
      logg('venn-' + niva, riktig);
      var lyd = [riktig ? 'riktig' : 'ikke-helt', 200].concat(o.forklarLyd), topp;
      if (riktig) { var m = window.belonning(NA.omr); topp = '<p class="lo-dom ok">✅ Riktig! ' + skruetekst(m) + '</p>'; }
      else topp = '<p class="lo-dom">Ikke helt. Se her:</p>';
      var nytt = '';
      if (riktig && niva === V.apnet && V.apnet < 3 && (V.s[niva] || '').length >= KRAV.siste && riktigeSiste(V, niva) >= KRAV.riktige) {
        V.apnet++; V.niva = V.apnet;
        nytt = '<p class="lo-nytt">⭐ Bra jobba! Nivå ' + V.apnet + ' er åpnet: ' + esc(NIVAANAVN[V.apnet - 1]) + '</p>';
        lyd = lyd.concat([300, 'nytt-nivaa']);
      }
      window.lagre(); window.tegnTopp();
      $('loUnder').innerHTML = nivaKnapper(V);
      $('loFot').innerHTML = topp + o.forklar + nytt +
        '<div class="rad lo-knapper"><button data-lo="neste">' + (riktig ? 'En til ▶' : 'Ny oppgave ▶') + '</button><button class="sek" data-a="lukk">Ferdig</button></div>';
      NA.si = o.forklarLyd;
      spill(lyd);
      var k = $('loFot').querySelector('button'); if (k) k.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
    spill(o.si);
  }
  function startVenner(st, omrId) {
    NA = { st: st, omr: omrId, si: null };
    ramme(st.navn, st.ik, false);
    nyVenn();
  }

  /* =====================================================================
     «JEG SER» – fem setninger til et myldrebilde
     ===================================================================== */
  function lesJS() { var s = null; try { s = JSON.parse(localStorage.getItem(JEGSER.nokkel)); } catch (e) {} s = s || {}; s.ferdig = s.ferdig || []; return s; }
  function lagreJS(s) { try { localStorage.setItem(JEGSER.nokkel, JSON.stringify(s)); } catch (e) {} }
  function jsGyldig(t) { return /^jeg\s+ser\s+(?:\d+\s+)?\p{L}\S+/iu.test(String(t || '').trim()); }
  function jsBilde(n) { return ROT + 'jegser/jegser-' + to(n) + '.webp'; }
  function jsStatus() { var s = lesJS(); return { godkjent: Math.min(s.ferdig.length, JEGSER.antallBilder), av: JEGSER.antallBilder, venter: !!(s.aktivt && s.aktivt.sendt), paabegynt: !!s.aktivt }; }
  function holdeknapp(b, ferdig) {
    b.classList.add('lo-hold');
    b.innerHTML = '<span class="lo-holdfyll"></span><span class="lo-holdtekst">' + b.innerHTML + '</span>';
    b.style.setProperty('--hold', HOLDTID + 'ms');
    var t = null;
    var slutt = function () { b.classList.remove('holder'); if (t) { clearTimeout(t); t = null; } };
    b.addEventListener('pointerdown', function (e) { if (b.disabled) return; e.preventDefault(); slutt(); b.classList.add('holder'); t = setTimeout(function () { t = null; ferdig(); }, HOLDTID); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { b.addEventListener(ev, slutt); });
    b.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!b.disabled) ferdig(); } });   // tastatur
    b.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  }
  function jsBildeknapp(n) {
    return '<button class="lo-jsbilde" id="jsBilde" aria-label="Trykk for å se bildet stort"><img src="' + jsBilde(n) + '" alt="' + esc(JS_BILDER[n] || 'Myldrebilde med roboter') + '"><span>🔍 Større bilde</span></button>';
  }
  function jsStortBilde(n) {
    var d = document.createElement('div'); d.className = 'lo-jsstor'; d.innerHTML = '<img src="' + jsBilde(n) + '" alt=""><span>Trykk for å lukke</span>';
    d.onclick = function () { d.remove(); }; document.body.appendChild(d);
  }
  function startJegSer(st, omrId) {
    NA = { st: st, omr: omrId, si: null };
    var s = lesJS();
    if (!s.aktivt) {
      var igjen = []; for (var n = 1; n <= JEGSER.antallBilder; n++) if (s.ferdig.indexOf(n) < 0) igjen.push(n);   // først alle ti i tur og orden, så tilfeldig
      var tom = []; for (var i = 0; i < JEGSER.setninger; i++) tom.push('');
      s.aktivt = { bilde: igjen.length ? igjen[0] : 1 + rnd(JEGSER.antallBilder), setn: tom, sendt: false };
      lagreJS(s);
    }
    ramme(st.navn, st.ik, true);
    if (s.aktivt.sendt) jsTilVoksen(false); else jsSkriv();
  }
  function jsSkriv() {
    var s = lesJS(), a = s.aktivt;
    $('loUnder').innerHTML = '<div class="lo-navn">Skrive setninger · Bilde ' + a.bilde + ' av ' + JEGSER.antallBilder + '</div>';
    $('loTekst').innerHTML = 'Se godt på bildet. Skriv fem setninger som begynner med <b class="lo-uthev">Jeg ser</b>.';
    NA.si = ['js-intro'];
    var boks = $('loBoks');
    boks.innerHTML = '<div class="lo-js">' + jsBildeknapp(a.bilde) + '<ol class="lo-jsliste">' + a.setn.map(function (t, i) {
      return '<li><input class="lo-jsinn" data-i="' + i + '" value="' + esc(t || '') + '" maxlength="90" autocomplete="off" autocorrect="off" spellcheck="false" autocapitalize="sentences" enterkeyhint="' +
        (i < a.setn.length - 1 ? 'next' : 'done') + '" aria-label="Setning ' + (i + 1) + '"><span class="lo-jsok" aria-hidden="true"></span></li>'; }).join('') + '</ol></div>';
    $('loFot').innerHTML = '<p class="lo-dom" id="jsMld"></p><div class="rad lo-knapper"><button id="jsFerdig">Ferdig – vis til en voksen ▶</button></div>';
    $('jsBilde').onclick = function () { jsStortBilde(a.bilde); };
    var felt = Array.prototype.slice.call(boks.querySelectorAll('.lo-jsinn'));
    var merk = function (inn) { var li = inn.parentNode; li.classList.toggle('ok', jsGyldig(inn.value)); li.classList.remove('feil'); };
    var ta = function () { var s2 = lesJS(); if (!s2.aktivt) return; s2.aktivt.setn = felt.map(function (f) { return f.value.trim().toLowerCase() === 'jeg ser' ? '' : f.value.trim(); }); lagreJS(s2); };
    var taTimer = null;
    felt.forEach(function (inn, i) {
      merk(inn);
      inn.addEventListener('input', function () { merk(inn); $('jsMld').textContent = ''; clearTimeout(taTimer); taTimer = setTimeout(ta, 800); });   // lagres underveis, så ingenting blir borte
      inn.addEventListener('change', ta);
      inn.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return; e.preventDefault(); ta();
        if (felt[i + 1]) { felt[i + 1].focus(); var v = felt[i + 1].value; felt[i + 1].setSelectionRange(v.length, v.length); } else inn.blur();
      });
    });
    $('jsFerdig').onclick = function () {
      clearTimeout(taTimer); ta();
      var tekster = felt.map(function (f) { return f.value.trim().replace(/\s+/g, ' '); }), feil = 0;
      felt.forEach(function (f, i) {
        var lik = tekster.map(function (t) { return t.toLowerCase(); }).indexOf(tekster[i].toLowerCase()) !== i;
        var ok = jsGyldig(tekster[i]) && !lik; f.parentNode.classList.toggle('feil', !ok); if (!ok) feil++;
      });
      if (feil) { $('jsMld').innerHTML = '<b>Ikke helt ferdig.</b> Alle fem setningene må begynne med «Jeg ser» og være ulike.'; spill(['js-mangler']); return; }
      var s2 = lesJS(); s2.aktivt.setn = tekster; s2.aktivt.sendt = true; lagreJS(s2);
      jsTilVoksen(true);
    };
    spill(NA.si);
  }
  function jsTilVoksen(nettopp) {
    var s = lesJS(), a = s.aktivt;
    $('loUnder').innerHTML = '<div class="lo-navn">Venter på en voksen · Bilde ' + a.bilde + ' av ' + JEGSER.antallBilder + '</div>';
    $('loTekst').innerHTML = '<b>Bra jobba!</b> Vis setningene til en voksen.';
    NA.si = ['js-vis-voksen'];
    $('loBoks').innerHTML = '<div class="lo-js">' + jsBildeknapp(a.bilde) + '<ol class="lo-jsliste les">' + a.setn.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol></div>';
    $('loFot').innerHTML = '<div class="lo-voksen"><small>Til den voksne: Les setningene sammen med eleven. Passer de til bildet, holder du «Godkjenn» inne et lite øyeblikk.</small>' +
      '<div class="rad lo-knapper"><button class="sek" id="jsRett">✏️ Må rettes</button><button class="gronn" id="jsOk">✓ Godkjenn</button></div></div>';
    $('jsBilde').onclick = function () { jsStortBilde(a.bilde); };
    $('jsRett').onclick = function () { var s2 = lesJS(); s2.aktivt.sendt = false; lagreJS(s2); jsSkriv(); };
    holdeknapp($('jsOk'), jsGodkjenn);
    if (nettopp) spill(NA.si);
  }
  function jsGodkjenn() {
    var s = lesJS(), a = s.aktivt; if (!a || !NA) return;
    var for_ = s.ferdig.length;
    if (s.ferdig.indexOf(a.bilde) < 0) s.ferdig.push(a.bilde);
    delete s.aktivt;                       // setningene slettes når de er godkjent
    lagreJS(s);
    var m = window.belonning(NA.omr, JEGSER.skruer);
    // rapporten: hver godkjente setning teller som én riktig oppgave i målet eleven jobber mot
    var maal = for_ < 1 ? 'jegser-1' : for_ < 5 ? 'jegser-5' : 'jegser-10';
    for (var i = 0; i < JEGSER.setninger; i++) logg(maal, true);
    window.tegnTopp();
    var n = Math.min(s.ferdig.length, JEGSER.antallBilder);
    $('loUnder').innerHTML = '<div class="lo-navn">Skrive setninger</div>';
    $('loTekst').innerHTML = '<b>Setningene er godkjent!</b>';
    NA.si = ['js-godkjent'];
    $('loBoks').innerHTML = '<div class="lo-slutt"><div class="lo-stortall">' + n + ' av ' + JEGSER.antallBilder + '</div><p>bilder ferdig</p><p class="lo-dom ok">' + skruetekst(m) + ' til basen</p></div>';
    $('loFot').innerHTML = '<div class="rad lo-knapper"><button id="jsNytt">Nytt bilde ▶</button><button class="sek" data-a="lukk">Tilbake til basen</button></div>';
    var st = NA.st, omrId = NA.omr;
    $('jsNytt').onclick = function () { startJegSer(st, omrId); };
    spill(NA.si);
  }

  /* ---------- Det basen.html bruker ---------- */
  window.LysOppgaver = {
    har: function (st) { return st.oppg === 'venner' || st.oppg === 'jegser'; },
    start: function (st, omrId) { if (st.oppg === 'jegser') startJegSer(st, omrId); else startVenner(st, omrId); },
    /* Liten tekst under stasjonsknappen */
    under: function (st) {
      if (st.oppg === 'jegser') { var j = jsStatus(); return j.venter ? '⏳ Venter på en voksen' : j.godkjent + ' av ' + j.av + ' bilder ferdig'; }
      if (st.oppg === 'venner' && window.S) { var V = venn(); return 'Nivå ' + V.niva + ': ' + NIVAANAVN[V.niva - 1]; }
      return '';
    },
    /* Til voksenmenyen */
    status: function () { var V = window.S ? venn() : { niva: 1, apnet: 1 }; return { venner: { niva: V.niva, apnet: V.apnet, navn: NIVAANAVN }, jegser: jsStatus() }; },
    nullstill: function () { try { localStorage.removeItem(JEGSER.nokkel); } catch (e) {} },
    klipp: function () { return { FOLELSER: FOLELSER, SCENER: SCENER, ATFERD: ATFERD }; }
  };
  /* Lukkes oppgaven, stopper opplesingen */
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('button[data-a="lukk"]'); if (b) { stopp(); NA = null; } }, true);

  /* ---------- Utseende ---------- */
  var st = document.createElement('style');
  st.textContent =
    '.dialog.lo-dlg{max-width:680px;padding:16px 18px 18px}.dialog.lo-dlg.bred{max-width:1040px}' +
    '.lo-topp{display:flex;align-items:center;gap:8px;margin-bottom:8px}.lo-topp h2{margin:0}.lo-luft{flex:1}' +
    '.lo-rund{width:48px;min-height:48px;padding:0;border-radius:50%;font-size:1.2rem}' +
    '.lo-nivarad{display:flex;gap:8px;flex-wrap:wrap}' +
    '.lo-niva{background:#e4e9f5;color:var(--ink);padding:6px 14px;min-height:40px;border-radius:999px;font-size:.95rem}' +
    '.lo-niva.valgt{background:var(--hoved);color:#fff}.lo-niva:disabled{background:#eef0f5;color:#8b94a8}' +
    '.lo-navn{font-size:.95rem;color:var(--dus);margin:8px 0 0;display:flex;gap:10px;align-items:center;flex-wrap:wrap}' +
    '.lo-prikker{display:inline-flex;gap:4px}.lo-prikker i{width:13px;height:13px;border-radius:50%;background:#dbe1ee}.lo-prikker i.pa{background:#2e9c5c}' +
    '.lo-tekst{font-size:1.35rem;line-height:1.35;margin:12px 0}.lo-uthev{background:#fff0b8;border-radius:8px;padding:0 6px}' +
    '.lo-midt{display:grid;place-items:center;margin-bottom:12px}' +
    '.lo-pic{display:block;width:100%;height:auto;border-radius:16px;background:#f7efd8}' +
    '.lo-pic.scene{width:min(300px,62vw,34vh);border:3px solid var(--ink)}' +
    '@media (max-height:820px){.lo-valg.smaa .lo-svar.bilde .lo-pic{width:min(100%,16vh);margin:0 auto}}' +
    '.lo-valg{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.lo-valg.to{grid-template-columns:1fr 1fr}' +
    '.lo-valg.smaa{max-width:480px;margin:0 auto}' +
    '.lo-svar{background:#fff;color:var(--ink);border:3px solid var(--kant);border-radius:18px;padding:8px;min-height:64px;font-size:1.05rem;display:flex;flex-direction:column;align-items:center;gap:6px}' +
    '.lo-svar.tommel{font-size:1.15rem;padding:12px 8px}.lo-svar .ik{font-size:2.2rem;line-height:1}' +
    '.lo-svar:disabled{background:#fff;color:var(--ink);cursor:default;opacity:.55}' +
    '.lo-svar.rett{border-color:#2e9c5c;background:#e3f6e8;opacity:1}.lo-svar.feil{border-color:#c2453a;background:#fbe4e1;opacity:1}' +
    '.lo-fot{margin-top:14px}.lo-dom{font-family:Fredoka,sans-serif;font-size:1.25rem;font-weight:600;margin:0 0 8px}.lo-dom:empty{display:none}.lo-dom.ok{color:#1d7a35}' +
    '.lo-skruer{display:inline-block;background:var(--gull);color:#3a2a00;border-radius:999px;padding:1px 12px}' +
    '.lo-forklar{display:flex;gap:14px;align-items:center;background:#f3f6fc;border-radius:16px;padding:10px 14px;margin-bottom:12px}' +
    '.lo-forklar .lo-pic{width:96px;flex:none}.lo-forklar p{margin:0;font-size:1.15rem}' +
    '.lo-nytt{background:#fff6d6;border:2px solid #c99700;border-radius:14px;padding:10px 14px;font-weight:700}' +
    '.lo-knapper{margin-top:4px}.lo-knapper button{font-size:1.1rem}' +
    'button.gronn{background:#2e9c5c;color:#fff}' +
    '.lo-js{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:16px;align-items:start}' +
    '@media (max-width:760px){.lo-js{grid-template-columns:1fr}}' +
    '.lo-jsbilde{position:relative;padding:0;border:3px solid var(--ink);border-radius:18px;overflow:hidden;background:#fff;cursor:zoom-in;display:block;width:100%;min-height:0}' +
    '.lo-jsbilde img{display:block;width:100%;height:auto}' +
    '.lo-jsbilde span{position:absolute;right:8px;bottom:8px;background:rgba(255,255,255,.94);border:2px solid var(--ink);border-radius:999px;padding:2px 12px;font:600 15px Fredoka,sans-serif;color:var(--ink)}' +
    '.lo-jsliste{margin:0;padding-left:30px;font:600 22px Fredoka,sans-serif;display:grid;gap:10px}.lo-jsliste li{position:relative}' +
    '.lo-jsinn{width:100%;font:400 20px "Atkinson Hyperlegible",system-ui,sans-serif;padding:9px 40px 9px 12px;border:2px solid var(--ink);border-radius:12px;color:var(--ink);background:#fff}' +
    '.lo-jsinn:focus{outline:4px solid #ffb300;outline-offset:1px}' +
    '.lo-jsok{position:absolute;right:12px;top:50%;transform:translateY(-50%);font:700 22px Fredoka,sans-serif;color:#1d7a35}' +
    '.lo-jsliste li.ok .lo-jsok::before{content:"✓"}.lo-jsliste li.feil .lo-jsinn{border-color:#c2453a;background:#fff3ee}' +
    '.lo-jsliste.les li{font:400 22px "Atkinson Hyperlegible",system-ui,sans-serif;line-height:1.35;border-bottom:2px dashed var(--kant);padding:4px 2px 8px}' +
    '.lo-jsstor{position:fixed;inset:0;z-index:70;background:rgba(15,23,45,.94);display:grid;place-items:center;padding:10px;cursor:zoom-out}' +
    '.lo-jsstor img{max-width:100%;max-height:100%;border-radius:12px;display:block}' +
    '.lo-jsstor span{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);background:rgba(255,255,255,.94);border:2px solid var(--ink);border-radius:999px;padding:4px 16px;font:600 16px Fredoka,sans-serif;color:var(--ink)}' +
    '.lo-voksen{background:#f3f6fc;border-radius:16px;padding:12px 14px}.lo-voksen small{display:block;margin-bottom:10px;color:var(--dus);font-size:.95rem}' +
    '.lo-hold{position:relative;overflow:hidden;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;touch-action:none}' +
    '.lo-holdfyll{position:absolute;inset:0;background:#1d7a35;transform:scaleX(0);transform-origin:left;transition:transform .15s}' +
    '.lo-hold.holder .lo-holdfyll{transform:scaleX(1);transition:transform var(--hold,1300ms) linear}.lo-holdtekst{position:relative}' +
    '.lo-slutt{text-align:center;padding:10px 0}.lo-stortall{font:700 3rem Fredoka,sans-serif;line-height:1.1}.lo-slutt p{margin:0 0 8px}';
  document.head.appendChild(st);
})();
