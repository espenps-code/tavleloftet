/* =========================================================================
   TAVLELOFTET – framgangslogg (felles for alle læringsverdener)
   -------------------------------------------------------------------------
   Denne fila er «karakterboka». Hver verden sier fra hver gang eleven har
   svart på en oppgave:

       TLFramgang.logg('klokke-1', true);     // mål-ID, riktig eller galt

   Legges i <head> ETTER tavleloftet-elev.js og verdenens målfil:

     <script src="../js/maal-dinoparken.js"></script>
     <script src="../js/tavleloftet-framgang.js" data-verden="dinoparken"></script>

   Loggen lagres i nettleseren under en nøkkel som starter med verdenens
   prefiks. Da tar tavleloftet-elev.js den med til skyen helt av seg selv,
   og lærersida (rapport.html) kan lese den. Ingen navn lagres her.

   Når er et mål nådd? Standard er den samme regelen som stjernene i Dinoparken,
   så rapporten og spillet alltid sier det samme:
     • minst 10 oppgaver i målet
     • minst 8 riktige av de 10 siste (på første forsøk)
   Kravet kan strammes inn i målfila, per verden eller per mål (flere oppgaver,
   høyere andel riktige eller øving på flere ulike dager).
   Har verdenen sin egen regel for når noe er mestret, kan den også si rett ut:
       TLFramgang.merkNaadd('klokke-1');
   Datoen målet først ble nådd, blir stående selv om eleven bommer senere.
   ========================================================================= */
(function () {
  'use strict';
  var MAAL = window.TL_MAAL = window.TL_MAAL || {};
  var STANDARD = { oppgaver: 10, andel: 0.8, dager: 1 };
  var MAKS_SVAR = 60, MAKS_DAGER = 40, MAKS_AKTIVITET = 200;

  function to(n) { return (n < 10 ? '0' : '') + n; }
  function idag(d) { d = d || new Date(); return d.getFullYear() + '-' + to(d.getMonth() + 1) + '-' + to(d.getDate()); }

  /* Alle målene i en verden som én flat liste */
  function alleMaal(verden) {
    var V = MAAL[verden], ut = [];
    if (V) (V.grupper || []).forEach(function (g) { (g.maal || []).forEach(function (m) { ut.push({ gruppe: g, maal: m }); }); });
    return ut;
  }
  /* Kravet til ett mål: standard < verdenens standard < målets eget krav */
  function krav(verden, maalId) {
    var V = MAAL[verden] || {}, k = {}, eget = null;
    alleMaal(verden).forEach(function (x) { if (x.maal.id === maalId) eget = x.maal.krav || null; });
    [STANDARD, V.standard || {}, eget || {}].forEach(function (kilde) { for (var n in kilde) k[n] = kilde[n]; });
    var egetRiktige = (eget && eget.riktige) || (!(eget && (eget.oppgaver || eget.andel)) && V.standard && V.standard.riktige);
    k.riktige = egetRiktige || Math.ceil(k.oppgaver * k.andel);
    return k;
  }
  /* Hvor langt har eleven kommet på ett mål? m = det som er lagret om målet */
  function vurder(m, k) {
    m = m || {};
    var siste = (m.s || '').slice(-k.oppgaver), riktige = siste.split('1').length - 1;
    var antall = m.n || 0, dager = (m.d || []).length;
    var del = function (a, b) { return Math.min(1, b ? a / b : 1); };
    return {
      antall: antall, riktigeSiste: riktige, avSiste: siste.length, dager: dager,
      totaltRiktige: m.r || 0,
      oppfylt: antall >= k.oppgaver && riktige >= k.riktige && dager >= k.dager,
      andel: (del(antall, k.oppgaver) + del(riktige, k.riktige) + del(dager, k.dager)) / 3
    };
  }
  function ny() { return { v: 1, m: {}, dag: {} }; }
  /* Legg ett svar inn i loggen (endrer og returnerer «logg») */
  function leggTil(logg, verden, maalId, riktig, dato) {
    dato = dato || idag();
    logg = logg && logg.v === 1 ? logg : ny();
    var m = logg.m[maalId] = logg.m[maalId] || { n: 0, r: 0, s: '', d: [], f: dato };
    m.n++; if (riktig) m.r++;
    m.s = (m.s + (riktig ? '1' : '0')).slice(-MAKS_SVAR);
    if (m.d.indexOf(dato) < 0) { m.d.push(dato); if (m.d.length > MAKS_DAGER) m.d.shift(); }
    m.l = dato;
    if (!m.nd && vurder(m, krav(verden, maalId)).oppfylt) m.nd = dato;     // nådd-dato settes én gang
    var a = logg.dag[dato] = logg.dag[dato] || [0, 0];
    a[0]++; if (riktig) a[1]++;
    var dager = Object.keys(logg.dag).sort();
    while (dager.length > MAKS_AKTIVITET) delete logg.dag[dager.shift()];
    return logg;
  }

  var me = document.currentScript, verden = me && me.getAttribute('data-verden');
  var F = window.TLFramgang = { idag: idag, alleMaal: alleMaal, krav: krav, vurder: vurder, ny: ny, leggTil: leggTil, STANDARD: STANDARD };
  function nokkel() { return (MAAL[verden] && MAAL[verden].nokkel) || null; }
  F.les = function () { try { return JSON.parse(localStorage.getItem(nokkel())) || ny(); } catch (e) { return ny(); } };
  F.logg = function (maalId, riktig) {
    if (!verden || !nokkel()) return;                       // ingen målfil = ingen logging, spillet går som før
    try { localStorage.setItem(nokkel(), JSON.stringify(leggTil(F.les(), verden, maalId, !!riktig))); } catch (e) {}
  };
  /* Verdenen sier selv at målet er nådd (f.eks. når eleven får en stjerne).
     tidligere = true: målet var nådd før rapporten ble koblet på, så datoen er «senest i dag». */
  F.merkNaadd = function (maalId, tidligere) {
    if (!verden || !nokkel()) return;
    var logg = F.les(), m = logg.m[maalId];
    if (m && m.nd) return;                                  // har dato fra før – ikke rør
    m = logg.m[maalId] = m || { n: 0, r: 0, s: '', d: [] };
    m.nd = idag(); if (tidligere) m.fr = 1;
    try { localStorage.setItem(nokkel(), JSON.stringify(logg)); } catch (e) {}
  };
})();
