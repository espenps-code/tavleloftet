# Tavleloftet – nettstedet (testversjon)

Dette er selve nettsiden til Tavleloftet. Alt ligger i denne mappa, og ingenting hentes fra andre nettsteder
(skrifttypene ligger i `fonts/`, så ingen IP-adresser sendes til Google).

## Hva er hva
- `index.html` – forsiden
- `spill.html` – spillrommet (lenker til spillene i `spill/`)
- `skreddersydd.html` – skreddersydde verdener (lenker til elevinnloggingen og rapporten; bestillingsskjemaet er ikke laget ennå)
- `elev/` – felles elevinnlogging: eleven skriver koden og sendes til riktig verden (`dinoparken/`, `lyslaget/`)
- `voksen.html` – bare for Espen: lager elevkode og voksenkode, og skriver ut innloggingslapp
- `rapport.html` – framgangsrapporten kjøperen åpner med voksenkoden (se `maler/laererrapport/LES-MEG.md`)
- `kroniken/` – Krøniken, KRLE-verktøyet. Mappa er en kopi av `innhold/`, `portal/` og `religionsprove/` fra
  `Tavleloftet\Krøniken` i Dropbox (uten LES-MEG-filene). Kilden er Dropbox-mappa: endringer gjøres der og kopieres hit.
  `kroniken/index.html` sender videre til `kroniken/portal/index.html`. Elevboka: `kroniken/innhold/bok.html`.
  Krøniken bruker Firebase-prosjektet krle-sim og henter Firebase og skrifttyper (portal og prøveportal) fra Google.
- `personvern.html` – midlertidig side til foretaket er registrert
- `css/tavleloftet.css` – utseendet (farger, skrift, knapper) for alle sidene
- `js/tavleloftet.js` – karusellen og den lille bevegelsen i toppbildet
- `img/` – bilder, `fonts/` – skrifttyper (OFL-lisens, se LISENS-skrifttyper.txt)

## Se siden på egen maskin
Dobbeltklikk `index.html`, så åpnes den i nettleseren.

## Før den legges ut ordentlig
- Fjern den gule «Testversjon»-stripa øverst på hver side
- Bytt «Kontakt: [kommer]» med e-postadresse
- Legg inn personvernerklæringen når ENK-en er registrert
- Bestillingsskjemaet («Fortell om eleven») må lages
- Menyen og bunnteksten er like på index, spill, skreddersydd og personvern – endres de ett sted, må de endres på alle fire
