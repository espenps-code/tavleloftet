# Dinoparken 2 – Dinoparken med oppgavepakker

Dette er en kopi av `dinoparken/` (laget 20.11.2026). Parken, eggene, biblioteket og AR-kortene er like.
Forskjellen er at oppgavene på de fem stasjonene kommer fra en **oppgavepakke**, så hver elev kan få sitt eget innhold.
Den vanlige Dinoparken i `dinoparken/` er ikke endret.

## Pakken «Lyder, venner og klosser» (`lyd-venner-klosser`)
Laget for en elev som ikke leser ennå. Alt leses opp, og eleven svarer med bilder. Tre nivåer i hvert tema.

| Stasjon | Tema | Nivå 1 | Nivå 2 | Nivå 3 |
|---|---|---|---|---|
| Lyttetårnet | Høre forskjell på P/B og T/D | Hvilket ord hører du? (pil/bil) | Hvilken lyd kommer først? | Hvem begynner annerledes? |
| Bokstavreiret | Bokstavlydene F, S, L | Fra lyd til bokstav | Finn bildet som begynner med lyden | Sorter i reirene |
| Brøleskolen | Si P, B, T, D, F, S, L | Lyden alene | Ord | Korte setninger |
| Vennekroken | Følelser, lek og turtaking, høflighet | Kjenn igjen følelser | Hva føler Mio nå? | Lurt eller ikke lurt? |
| Klosseverkstedet | Logikk med klosser | Mønster og like klosser | Hva mangler? Tell og bygg likt | To regler, speil og ruter |

**Brøleskolen trenger en voksen.** En iPad kan ikke høre om en lyd blir riktig. En voksen holder inne en knapp for å starte runden,
hører på, og trykker «Bra sagt» eller «Øv en gang til». Munntipsene som vises, er generelle. Har eleven logoped eller
spesialpedagog, er det deres råd som gjelder.

## Slik er det bygget
- `oppgaver.js` – oppgavemotoren. Øverst står `PAKKER`: hvilke stasjoner en pakke har, og hvilke lyder og bokstaver som øves.
  Vil du lage en pakke til en ny elev (f.eks. K/G og R), kopierer du en pakke der og bytter lydene. Ordene står i `ORD2` og ordparene i `LYDPAR`.
- Pakken eleven har, lagres under nøkkelen `dp2-pakke` sammen med framgangen (følger elevkoden). Mangler den, brukes `lyd-venner-klosser`.
  `voksen.html` skriver den når koden lages. Den kan også byttes i voksenmenyen inne i parken.
- Lagringsnøklene starter med `dp2-` (ikke `dinoparken-`), så de to parkene aldri blander framgang.
- Verden-ID er `dinoparken2`. Den står i `js/tavleloftet-elev.js`, `elev/index.html`, `voksen.html`, `rapport.html` (målfil `js/maal-dinoparken2.js`)
  og i `database-regler.json`. **Regelen må publiseres i Firebase før det kan lages elevkoder til denne verdenen.**
- Bilder: `bilder/ord/` (ordbilder) og `bilder/sosial/` (Mio: følelser `fol-…`, situasjoner `sc-…`, oppførsel `at-…`). Laget med Higgsfield (nano_banana_2).
- Lyd: `lyd/ord-<ord>.mp3`, `lyd/dino/<klipp>.mp3`, `lyd/tall-<n>.mp3`. Lest inn med ElevenLabs (stemmen Kristine, modell eleven_v4).
  Enkeltlydene (`lyd/P.mp3` osv.) er de gamle fra Myntland.
- `lydsjekk.html` – en side der du kan høre gjennom alle klippene (lenkes ikke fra noe sted).

## Lese inn klipp på nytt
Lista over alle klipp og teksten deres ligger i `Tavleloftet\Claude outputs\dinoparken2\klipp.json`, sammen med skriptene som ble brukt
(`tts.py`, `lesinn.py`). Slett fila som skal leses inn på nytt og kjør skriptet, eller be Claude gjøre det.
