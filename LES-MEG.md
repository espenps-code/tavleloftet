# Tavleloftet – nettstedet (testversjon)

Dette er selve nettsiden til Tavleloftet. Alt ligger i denne mappa, og ingenting hentes fra andre nettsteder
(skrifttypene ligger i `fonts/`, så ingen IP-adresser sendes til Google).

## Hva er hva
- `index.html` – forsiden
- `spill.html` – spillrommet (lenker til spillene i `spill/`)
- `spill/vaskemester.html` – Vaskemester (26.11.2026): renholdsspill i 3D førsteperson, hybel → leilighet → enebolig. Kopi fra Mykje Spill (hadde ingen Mykje-referanser). Lyd (Bobla) i `spill/vaskemester/lyd/`, skrifter (Atkinson Hyperlegible, Baloo 2) i `spill/vaskemester/fonts/`. Lagrer i nettleseren (`vaskemester-v1`), ingen Firebase.
- `spill/sjakkloftet.html` – Sjakkloftet (24.11.2026): sjakk mot bot, mot en medelev, sjakknøtter (fra Lichess sin åpne base, CC0), minispill, springerløype og elevdelen av turnering.
  Kopi av Mykje Sjakk fra Mykje Spill uten Mykje-referanser. Bruker Tavleloftets Firebase (stiene `sjakk`, `sjakknokkel`, `sjakkkode`, `sjakkserie`) og anonym pålogging.
  Maskoten Sprett (åtte uttrykk, laget i Higgsfield 24.11.2026) ligger i `spill/sjakkloftet/`. Øvelser: Matt-skolen, Slå alle bøndene, Trygg rute, Rutejakt, og Fischer-sjakk.
- `spill/sjakkloftet-turnering.html` – lærersiden som styrer turneringer (kallenavn med koder, Monrad, klokker, sammenlagt). Ikke lenket fra spillrommet. Må stå åpen mens turneringen går.
- `skreddersydd.html` – skreddersydde verdener (lenker til elevinnloggingen og rapporten; bestillingsskjemaet er ikke laget ennå)
- `prov.html` – «Prøv en verden» (lagt ut 26.11.2026): prøvekort for Dinoparken, Dinodalen, Lyslaget og Sakuradalen,
  pluss fotball- og fiskeverdenen som «kan bygges for din elev» (ingen prøve, bare bilde). Lenket fra `skreddersydd.html`. Delebilde: `img/deling/prov.jpg`.
  Kortene åpner verdenen med `?prove=1`. Da går verdenen i PRØVEMODUS (styres øverst i `js/tavleloftet-elev.js`):
  ingen kode og ingen sky. Framgangen ligger bare i fanen (sessionStorage, nøkler som starter med `prove~`), så den er borte når fanen lukkes
  og blandes aldri med en ekte elev på samme enhet. Prøven varer 15 minutter (`PROVE_MIN`). Da kommer sluttskjermen «Prøven er slutt» med bestilling,
  og det som er gjort slettes. Dette er for at ingen skal bruke prøven som gratis opplegg for en elev. Går man inn på nytt fra `prov.html`, starter den forfra.
  Ingen åpningstid, ekstra startkapital (`PROVE_START` i samme fil: 100 mynter i dinoverdenene, 70 skruer i Lyslaget, 60 mynter i Sakuradalen)
  og et lite bånd med «Bestill en slik verden» og «Avslutt». Båndet står nederst i Lyslaget (`PROVE_NEDE`), øverst ellers.
  Prøven avsluttes også når man trykker «Avslutt» eller åpner en innloggingsside (`elev/` eller `logginn.html`).
  Hver verden har én linje som legger til startkapitalen: `+(window.TL&&TL.proveStart||0)` (i dinoverdenene også i `oppgaver.js`).
  Den linja finnes ikke i de frittstående kildene (`Skole\Dinodalen`, `Skole\Robotmatte`, `maler/monsterverden`). Den gjør ingenting der, men ta den med ved kopiering hit.
  Voksenmenyen i prøven: åpnes uten kode i Lyslaget og Sakuradalen, med 1234 i dinoverdenene.
  Ny verden i prøven: legg den i `PROVE_START` og lag et kort i `prov.html`.
  «Se en eksempelrapport» går til `rapport.html?demo` (oppdiktede tall).
- `elev/` – felles elevinnlogging: eleven skriver koden og sendes til riktig verden (`dinoparken/`, `lyslaget/`)
- `lyslaget/basen.html` – Lyslaget-basen: 3D-verdenen der eleven tjener skruer og bygger ut basen (lagt ut 24.11.2026). Eleven kommer hit etter
  innlogging (`elev/` og `lyslaget/logginn.html` sender til `basen.html`). Den gamle forsiden ligger fortsatt på `lyslaget/index.html`.
  Verden-ID er fortsatt `lyslaget`. Lagring: `lysbase-spill` og `lysbase-jegser-v1` (prefikset `lysbase-` står i `js/tavleloftet-elev.js`).
  Oppgavene i verdenen ligger i `lyslaget/basen-oppgaver.js`: Vennekroken (sosiale ferdigheter med roboten Bit, tre nivåer) og
  «Jeg ser» (fem setninger til et myldrebilde, en voksen holder «Godkjenn» inne). Bilder og lyd: `lyslaget/basen/`. Ikonene i menyene (laget i Higgsfield 24.11.2026, gjennomsiktig bakgrunn) ligger i `lyslaget/basen/ikon/`; originalene og klippeskriptet ligger i `Skole\Robotmatte\basen\ikon\original`. Mangler et ikon, vises emoji-tegnet i stedet.
  Hør gjennom klippene på `lyslaget/lydsjekk-basen.html`. Kilden er `Skole\Robotmatte` (frittstående utgave uten innlogging). Se `maler/lyslagetverden/LES-MEG.md`.
- «Jeg ser» (Lyslaget-basen og Dinodalen, 26.11.2026): en setning får hake først når den slutter med punktum (! og ? godtas også). Mangler tegnet, kommer tipset
  «Husk punktum» når eleven går ut av feltet eller trykker «Ferdig», og feltet blir oransje. Endret i `lyslaget/basen-oppgaver.js` og `dinodalen/oppgaver.js`.
  Tipset leses opp med klippet `js-punktum.mp3` («Husk å sette punktum til slutt.», Terje, lest inn 26.11.2026): `lyslaget/basen/lyd/` og `dinodalen/lyd/dino/`.
  De frittstående kildene (`Skole\\Robotmatte`, `Skole\\Dinodalen`) har samme endring og samme klipp.
- Pengeoppgavene i Dinodalen og Dinoparken (26.11.2026): betaler eleven riktig beløp med flere mynter enn nødvendig, kommer tipset «Visste du at det går med færre mynter?»
  med klippet `lyd/dino/faerre-tips.mp3`. Eleven får full uttelling likevel. Hentet fra kilden `Skole\\Dinodalen`. `dinoparken2/` har ikke fått det.
- `dinoparken2/` – Dinoparken med oppgavepakker (egne oppgaver per elev). Første pakke: lyder, venner og klosser. Se `dinoparken2/LES-MEG.md`
- `dinodalen/` – Dinodalen: Dinoparken i ny drakt (elvedal, seks andre dinoer, samme oppgaver). Verden-ID `dinodalen`, lagring `dinodalen-…`. Kilden til kart og dinoer: `Skole\Dinodalen` (frittstående utgave uten innlogging)
- `sakuradalen/` – Sakuradalen (lagt ut 25.11.2026): monsterverdenen der eleven fanger monstre i bokser, trener dem i dojoen og dyster i arenaen.
  Verden-ID `sakuradalen`, lagring `sakuradalen-spill` og `sakuradalen-framgang-v1`. Ulenket fra forsiden, eleven kommer inn med elevkode via `elev/`.
  `index.html` er hele verdenen, `oppgaver.js` er oppgavepakke 1 (tallinje, klokka, måling, kalkulator, engelsk og hverdagsferdigheter).
  `lyd/` har 643 norske klipp (Kristine) og 77 engelske (Alice), `lyd/klipp.js` er lista. `bilder/` har monstre, klær og ikoner (Higgsfield).
  Målfil: `js/maal-sakuradalen.js` (ett mål per tema og vanskegrad). Kilden er `Tavleloftet\maler\monsterverden` (frittstående utgave uten innlogging).
  De to utgavene er like bortsett fra linjene øverst i `<head>`. Se `maler/monsterverden/LES-MEG.md`.
- `js/tavleloftet-apningstid.js` – åpningstid for alle verdenene (30 min per dag som standard). Styres fra `rapport.html`. Se toppen av fila
- `admin.html` – bare for Espen (het `voksen.html` til 21.11.2026): lager elevkode og voksenkode, og skriver ut innloggingslapp
- `voksen.html` – sender videre til `rapport.html`. «Voksensiden» er nå det kjøperen ser: rapporten, som åpnes med voksenkoden eller fra hengelåsmenyen i verdenen («Se rapporten»)
- `rapport.html` – framgangsrapporten kjøperen åpner med voksenkoden (se `maler/laererrapport/LES-MEG.md`)
- `kroniken/` – Krøniken, KRLE-verktøyet. Mappa er en kopi av `innhold/`, `portal/` og `religionsprove/` fra
  `Tavleloftet\Krøniken` i Dropbox (uten LES-MEG-filene). Kilden er Dropbox-mappa: endringer gjøres der og kopieres hit.
  `kroniken/index.html` sender videre til `kroniken/portal/index.html`. Elevboka: `kroniken/innhold/bok.html`.
  Krøniken bruker Firebase-prosjektet krle-sim og henter Firebase og skrifttyper (portal og prøveportal) fra Google.
- `utskrift.html` – «Til utskrift» (24.11.2026): lenkekort til utskriftsverktøyene på Myntland (Utskriftsmateriell, Oppgavegenerator, Leksegenerator, Regneverkstedet, Ordverkstedet). Kortene er kopier – de står også på `verktoy.html`. Delebilde: `img/deling/utskrift.jpg`
- `verktoy.html` – lærerverktøy-siden (kort med lenke til hvert verktøy i `verktoy/`)
- `verktoy/stasjonstavla/` – Stasjonstavla. Kopi av `stasjoner.html` fra Myntland (24.11.2026), med fagikoner og musikk. Myntland-versjonen ligger fortsatt der.
- `verktoy/spelling-express/` – Spelling Express (elevside, lærerside, veiledning). Kopi fra Myntland (24.11.2026). Bruker fortsatt Firebase-prosjektet spelling-express, så lister laget på Myntland virker her også. PDF-veiledningen nevner fortsatt myntland.no.
- `verktoy/fotostudio/` – Fotostudio. Kopi fra Mykje Ting (24.11.2026), uten Mykje-referanser. «Tilbake» går til `verktoy.html`.
- `verktoy/lesetrim/` – Lesetrim (26.11.2026): høyfrekvente ord på bokmål/nynorsk (eller egen liste), ett ord om gangen. Lesemonstrene (åtte, fra `Myntland\lesemonster`, bakgrunnen fjernet) ligger i `bilder/`. De faste høyfrekvente ordene står øverst i skriptet i `index.html`; ekstra ord og engelsk ligger i `lister-ekstra.js`, temalistene (alfabet, telle, dyr, navn, nonord osv.) i `lister-tema.js`. «Egen tekst» viser en innlimt tekst ord for ord i rekkefølge. Startknapp med nedtelling på leseskjermen, ingen snakkebobler. Ingen opplesing (tatt bort med vilje). Ingen data sendes noe sted; valgene huskes i nettleseren. Bruker Andika fra `fonts/`. Delebilde: `img/deling/lesetrim.jpg`
- `verktoy/kroppsoving/` – vurdering i kroppsøving (ulenket, venter på innlogging)
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
