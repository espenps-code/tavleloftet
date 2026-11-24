# Dinodalen på Tavleloftet

Dinoparken i ny drakt: elvedal, seks andre dinoer og de samme fem oppgavestasjonene. Verden-ID `dinodalen`, lagring `dinodalen-…`.
Kart og dinoer er beskrevet i `Skole\Dinodalen\LES-MEG.md` (den frittstående utgaven). Endringer der må også gjøres her.
I rapporten har stasjonen egne mål under «Skrive setninger» (`js/maal-dinodalen.js`).

## Utkikkstårnet: «Jeg ser» (lagt til 24.11.2026)
En sjette stasjon i hver innhegning. Eleven ser på et myldrebilde og skriver fem setninger som begynner med «Jeg ser».
Deretter må en voksen lese setningene og holde «Godkjenn» inne (1,3 sekunder). Først da kommer 10 mynter, og egget blir varmere.
- Bildene: `bilder/jegser/jegser-01.webp` til `-10.webp` (Higgsfield, nano_banana_2). De ti kommer i tur og orden, deretter tilfeldig.
- Koden: `oppgaver.js` (søk etter «JEG SER») og tårnet i `innhegning.js`. Tallene står i `JEGSER` (antall setninger og mynter).
- Setningene lagres under `dinodalen-jegser-v1` bare til de er godkjent. Etterpå slettes de, og bare tallet på ferdige bilder blir igjen.
- Lyd: `lyd/dino/js-intro.mp3`, `js-vis-voksen.mp3`, `js-mangler.mp3`, `js-godkjent.mp3` (Terje).

