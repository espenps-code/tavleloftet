/* =========================================================================
   MÅLFIL – Lyslaget
   -------------------------------------------------------------------------
   Tre deler:
     • Klokka (Spors stasjon): ett mål per stasjon. Målet er nådd når eleven
       har fullført stasjonen i spillet (samme regel som spillet selv).
     • Verkstedet: ett mål per arbeidsordre og nivå.
     • Utrykning: ett mål per fag og nivå.
   I Verkstedet og Utrykning gjelder standardregelen: 8 riktige av de 10 siste
   på første forsøk. Gruppene for Lett og Utfordring vises bare i rapporten
   når eleven har jobbet på det nivået («skjulTom»).
   ========================================================================= */
(function () {
  var NIVAA = [['lett', 'Lett'], ['middels', 'Middels'], ['utfordring', 'Utfordring']];
  var grupper = [
    { id: 'klokka', navn: 'Klokka (Spors stasjon)', ikon: '🕒', maal: [
      { id: 'kl-s1', navn: 'Tallene på klokka' }, { id: 'kl-s2', navn: 'Lilleviseren' }, { id: 'kl-s3', navn: 'Hele timer' },
      { id: 'kl-s4', navn: 'Mellom to tall' }, { id: 'kl-s5', navn: 'Halv' }, { id: 'kl-s6', navn: 'Kvart over' },
      { id: 'kl-s7', navn: 'Kvart på' }, { id: 'kl-s8', navn: 'Hel, halv og kvart' }, { id: 'kl-s9', navn: 'Storeviseren teller fem' },
      { id: 'kl-s10', navn: 'Over og på' }, { id: 'kl-s11', navn: 'Rundt halv' }, { id: 'kl-s12', navn: 'Hele klokka' },
      { id: 'kl-s13', navn: 'Spors rutetabell' } ] }
  ];
  NIVAA.forEach(function (n) {
    grupper.push({ id: 'verksted-' + n[0], navn: 'Verkstedet – ' + n[1], ikon: '🔧', skjulTom: n[0] !== 'middels', maal: [
      { id: 'v-tell-' + n[0], navn: 'Tell og sorter' }, { id: 'v-pluss-' + n[0], navn: 'Pluss' },
      { id: 'v-former-' + n[0], navn: 'Former' }, { id: 'v-minus-' + n[0], navn: 'Minus' } ] });
  });
  NIVAA.forEach(function (n) {
    grupper.push({ id: 'utrykning-' + n[0], navn: 'Utrykning – ' + n[1], ikon: '🚨', skjulTom: n[0] !== 'middels', maal: [
      { id: 'u-matte-' + n[0], navn: 'Matte' }, { id: 'u-lesing-' + n[0], navn: 'Lesing' }, { id: 'u-skriving-' + n[0], navn: 'Skriving' } ] });
  });
  (window.TL_MAAL = window.TL_MAAL || {}).lyslaget = {
    navn: 'Lyslaget',
    nokkel: 'rv-framgang-v1',                  // må starte med et av verdenens prefikser (kl-, rv-, ru-)
    standard: { oppgaver: 10, andel: 0.8, dager: 1 },
    grupper: grupper
  };
})();
