/* =========================================================================
   MÅLFIL – Dinoparken 2 (Dinoparken med oppgavepakker)
   -------------------------------------------------------------------------
   Samme oppsett som maal-dinoparken.js, men hver gruppe hører til en
   oppgavepakke («pakke»). Rapporten viser bare gruppene i elevens pakke.
   Hvilken pakke eleven har, ligger lagret under «pakkeNokkel» sammen med
   resten av framgangen. Mangler den, brukes «standardPakke».

   «standard» er den samme regelen som stjernene i spillet: 8 riktige av de
   10 siste. I Brøleskolen (uttale) er «riktig» at en voksen har godkjent.
   ========================================================================= */
(window.TL_MAAL = window.TL_MAAL || {}).dinoparken2 = {
  navn: 'Dinoparken',
  nokkel: 'dp2-framgang-v1',                 // må starte med verdenens prefiks («dp2-»)
  pakkeNokkel: 'dp2-pakke',
  standardPakke: 'lyd-venner-klosser',
  standard: { oppgaver: 10, andel: 0.8, dager: 1 },
  grupper: [
    { id: 'lytte', pakke: 'lyd-venner-klosser', navn: 'Høre forskjell (P/B og T/D)', ikon: '👂', maal: [
      { id: 'lytte-1', navn: 'Hvilket ord hører du?' }, { id: 'lytte-2', navn: 'Hvilken lyd kommer først?' },
      { id: 'lytte-3', navn: 'Hvem begynner annerledes?' } ] },
    { id: 'bokstav', pakke: 'lyd-venner-klosser', navn: 'Bokstavlyder (F, S, L)', ikon: '🥚', maal: [
      { id: 'bokstav-1', navn: 'Fra lyd til bokstav' }, { id: 'bokstav-2', navn: 'Finn bildet som begynner med lyden' },
      { id: 'bokstav-3', navn: 'Sorter i reirene' } ] },
    { id: 'uttale', pakke: 'lyd-venner-klosser', navn: 'Si lyden (godkjent av voksen)', ikon: '🦖', maal: [
      { id: 'uttale-1', navn: 'Si lyden alene' }, { id: 'uttale-2', navn: 'Si ord' }, { id: 'uttale-3', navn: 'Si korte setninger' } ] },
    { id: 'sosial', pakke: 'lyd-venner-klosser', navn: 'Venner og følelser', ikon: '💛', maal: [
      { id: 'sosial-1', navn: 'Kjenn igjen følelser' }, { id: 'sosial-2', navn: 'Hva føler Mio nå?' },
      { id: 'sosial-3', navn: 'Lurt eller ikke lurt?' } ] },
    { id: 'logikk', pakke: 'lyd-venner-klosser', navn: 'Klosselogikk', ikon: '🧱', maal: [
      { id: 'logikk-1', navn: 'Mønster og like klosser' }, { id: 'logikk-2', navn: 'Hva mangler? Tell og bygg likt' },
      { id: 'logikk-3', navn: 'To regler, speil og ruter' } ] },
    { id: 'klokke', pakke: 'standard', navn: 'Klokka', ikon: '🕒', maal: [
      { id: 'klokke-1', navn: 'Hele timer' }, { id: 'klokke-2', navn: 'Halv' },
      { id: 'klokke-3', navn: 'Kvart over' }, { id: 'klokke-4', navn: 'Kvart på' },
      { id: 'klokke-5', navn: 'Alt blandet' }, { id: 'klokke-6', navn: 'Ettermiddag (24 t)' } ] },
    { id: 'penger', pakke: 'standard', navn: 'Penger', ikon: '🪙', maal: [
      { id: 'penger-1', navn: 'Kjenn myntene' }, { id: 'penger-2', navn: 'Betal nøyaktig til 50 kr' },
      { id: 'penger-3', navn: 'Sedler til 200 kr' }, { id: 'penger-4', navn: 'Vekslebua' },
      { id: 'penger-5', navn: 'Opp til 500 kr' }, { id: 'penger-6', navn: 'Penger tilbake' } ] },
    { id: 'tier', pakke: 'standard', navn: '10-er-venner', ikon: '🥚', maal: [
      { id: 'tier-1', navn: 'Se mengden' }, { id: 'tier-2', navn: 'Hvor mange mangler?' },
      { id: 'tier-3', navn: 'Bare tall' }, { id: 'tier-4', navn: 'Vennepar' }, { id: 'tier-5', navn: '100-venner' } ] },
    { id: 'lyder', pakke: 'standard', navn: 'Lyder i ord', ikon: '📣', maal: [
      { id: 'lyder-1', navn: 'Første lyd (2 valg)' }, { id: 'lyder-2', navn: 'Første lyd (4 valg)' },
      { id: 'lyder-3', navn: 'Siste lyd' }, { id: 'lyder-4', navn: 'Lyden i midten' }, { id: 'lyder-5', navn: 'Fotsporboksene' } ] },
    { id: 'stavelser', pakke: 'standard', navn: 'Lese ord', ikon: '🪧', maal: [
      { id: 'stavelser-1', navn: 'Korte ord' }, { id: 'stavelser-2', navn: 'To stavelser med buer' },
      { id: 'stavelser-3', navn: 'To stavelser uten buer' }, { id: 'stavelser-4', navn: 'Hør og finn ordet' },
      { id: 'stavelser-5', navn: 'Små setninger' } ] }
  ]
};
