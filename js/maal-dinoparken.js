/* =========================================================================
   MÅLFIL – Dinoparken
   -------------------------------------------------------------------------
   Dette er det eneste som må lages for hver ny verden: en liste over målene.
   ID-en er det verdenen sender til TLFramgang.logg(), navnet er det læreren
   ser i rapporten.

   «standard» er den samme regelen som stjernene i spillet: 8 riktige av de
   10 siste. Da får eleven målet i rapporten samtidig som stjernen i parken.
   (Endrer du mestringAv / mestringKrav i oppgaver.js, endre tallene her også.)
   ========================================================================= */
(window.TL_MAAL = window.TL_MAAL || {}).dinoparken = {
  navn: 'Dinoparken',
  nokkel: 'dinoparken-framgang-v1',          // må starte med verdenens prefiks («dinoparken-»)
  standard: { oppgaver: 10, andel: 0.8, dager: 1 },
  grupper: [
    { id: 'klokke', navn: 'Klokka', ikon: '🕒', maal: [
      { id: 'klokke-1', navn: 'Hele timer' }, { id: 'klokke-2', navn: 'Halv' },
      { id: 'klokke-3', navn: 'Kvart over' }, { id: 'klokke-4', navn: 'Kvart på' },
      { id: 'klokke-5', navn: 'Alt blandet' }, { id: 'klokke-6', navn: 'Ettermiddag (24 t)' } ] },
    { id: 'penger', navn: 'Penger', ikon: '🪙', maal: [
      { id: 'penger-1', navn: 'Kjenn myntene' }, { id: 'penger-2', navn: 'Betal nøyaktig til 50 kr' },
      { id: 'penger-3', navn: 'Sedler til 200 kr' }, { id: 'penger-4', navn: 'Vekslebua' },
      { id: 'penger-5', navn: 'Opp til 500 kr' }, { id: 'penger-6', navn: 'Penger tilbake' } ] },
    { id: 'tier', navn: '10-er-venner', ikon: '🥚', maal: [
      { id: 'tier-1', navn: 'Se mengden' }, { id: 'tier-2', navn: 'Hvor mange mangler?' },
      { id: 'tier-3', navn: 'Bare tall' }, { id: 'tier-4', navn: 'Vennepar' }, { id: 'tier-5', navn: '100-venner' } ] },
    { id: 'lyder', navn: 'Lyder i ord', ikon: '📣', maal: [
      { id: 'lyder-1', navn: 'Første lyd (2 valg)' }, { id: 'lyder-2', navn: 'Første lyd (4 valg)' },
      { id: 'lyder-3', navn: 'Siste lyd' }, { id: 'lyder-4', navn: 'Lyden i midten' }, { id: 'lyder-5', navn: 'Fotsporboksene' } ] },
    { id: 'stavelser', navn: 'Lese ord', ikon: '🪧', maal: [
      { id: 'stavelser-1', navn: 'Korte ord' }, { id: 'stavelser-2', navn: 'To stavelser med buer' },
      { id: 'stavelser-3', navn: 'To stavelser uten buer' }, { id: 'stavelser-4', navn: 'Hør og finn ordet' },
      { id: 'stavelser-5', navn: 'Små setninger' } ] }
  ]
};
