/* =========================================================================
   TAVLELOFTET – felles Firebase-oppsett
   -------------------------------------------------------------------------
   Brukes av:
     • spill/slagskip.html og spillene for to (Fire på rad, Fyrstikkspillet,
       Gjett hvem) – «Mot en venn»
     • dinoparken/ og lyslaget/ – innlogging med elevkode og lagring av
       framgang i skyen
     • voksen.html – voksensiden der du lager elevkoder

   SLIK FYLLER DU UT (bare én gang):
     1. Firebase-konsollen → prosjektet «tavleloftet» → tannhjulet
        (Prosjektinnstillinger) → «Dine apper» → nettapp → Konfig.
     2. Kopier verdiene inn under (bytt ut null med { … }).
     3. Det MÅ være med databaseURL (Realtime Database, europe-west1).

   Står den som null:
     • spillene virker mot boten og to på én skjerm, men ikke «Mot en venn»
     • Dinoparken og Lyslaget virker, men lagrer bare på enheten (testmodus)
   ========================================================================= */
window.TAVLELOFTET_FIREBASE = {
  apiKey: "AIzaSyDKUuvyvZ7o85j4gLTvo5KD0ZrSf0fcbKM",
  authDomain: "tavleloftet.firebaseapp.com",
  databaseURL: "https://tavleloftet-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tavleloftet",
  appId: "1:241109019628:web:a7bc7e79e8205a7d796ec9"
};
/* (Satt opp 10. november 2026. Nøkkelen er offentlig og skal ligge her – det er
   databasereglene som beskytter dataene.) Mal:
window.TAVLELOFTET_FIREBASE = {
  apiKey: "AIza…",
  authDomain: "tavleloftet.firebaseapp.com",
  databaseURL: "https://tavleloftet-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tavleloftet",
  appId: "1:…:web:…"
};
*/
