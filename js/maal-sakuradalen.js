/* =========================================================================
   MÅLFIL – Sakuradalen
   -------------------------------------------------------------------------
   Ett mål per tema og vanskegrad. ID-en er den oppgaver.js sender til
   TLFramgang.logg(): tema + '-' + vanskegrad (1 = lett, 2 = middels, 3 = vanskelig).

   Standardregelen gjelder: 8 riktige av de 10 siste på første forsøk.
   Dojoen: fagene eleven trener monstrene i. Vanskegraden følger nivået på
   egenskapen (1–5 lett, 6–10 middels, 11–15 vanskelig).
   Fangst: hverdagsferdighetene eleven løser for å lukke boksen. Vanskegraden
   følger monsteret (vanlig, sjelden, legendarisk).
   ========================================================================= */
(function () {
  var NIVAA = ['Lett', 'Middels', 'Vanskelig'];
  var TEMA = [
    ['tallinje', 'Tallinje (dojo: styrke)', '📏', ['0–20 med alle tall', '0–20 med hopp fram og tilbake', '0–100 med tiere']],
    ['klokke', 'Klokka (dojo: fart)', '🕒', ['Hele timer', 'Hel og halv', 'Hel, halv og kvart']],
    ['maale', 'Måling (dojo: utholdenhet)', '⚖️', ['Velge måleredskap', 'Lese av linjal og vekt', 'Hva er rimelig?']],
    ['kalk', 'Kalkulator (dojo: utholdenhet)', '🧮', ['Små pluss- og minusstykker', 'Tosifrede tall', 'Regnefortellinger']],
    ['engelsk', 'Engelske ord (dojo: kløkt)', '🇬🇧', ['Ord og bilde', 'Betydning og staving', 'Ord i setning og staving']],
    ['hender', 'Vaske hender (fangst)', '🧼', null],
    ['lek', 'Invitere til lek (fangst)', '🤝', null],
    ['hjelp', 'Be om hjelp (fangst)', '🙋', null],
    ['hverdag', 'Løse hverdagsproblemer (fangst)', '💡', null],
    ['rekkefolge', 'Kle på seg i riktig rekkefølge (fangst)', '👕', ['Tre plagg', 'Fire plagg', 'Fem plagg']],
    ['klaer', 'Klær som passer til vær og situasjon (fangst)', '🌦️', ['Velg ett plagg', 'Velg to plagg', 'Velg tre plagg']]
  ];
  var ADL = ['To svar å velge mellom', 'Tre svar å velge mellom', 'Tre svar, møtt hos legendariske monstre'];
  (window.TL_MAAL = window.TL_MAAL || {}).sakuradalen = {
    navn: 'Sakuradalen',
    nokkel: 'sakuradalen-framgang-v1',           // må starte med verdenens prefiks («sakuradalen-»)
    standard: { oppgaver: 10, andel: 0.8, dager: 1 },
    grupper: TEMA.map(function (t) {
      return { id: t[0], navn: t[1], ikon: t[2], maal: NIVAA.map(function (n, i) { return { id: t[0] + '-' + (i + 1), navn: n + ': ' + (t[3] || ADL)[i] }; }) };
    })
  };
})();
