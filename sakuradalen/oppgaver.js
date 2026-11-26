/* =====================================================================
   SAKURADALEN – OPPGAVEPAKKE 1
   Denne fila bytter ut prøveoppgaven i index.html med ekte oppgaver.
   Tas script-linja for denne fila bort, er prøveoppgaven tilbake.

   Hvor oppgavene dukker opp (STASJON_TEMA under):
     Styrke       -> tallinjer
     Fart         -> klokka (hel, halv, kvart)
     Utholdenhet  -> måleenheter og kalkulator
     Kløkt        -> engelske ord
     Fangst       -> ADL: vaske hender, invitere til lek, be om hjelp,
                     hverdagsproblemer, klær i riktig rekkefølge, klær etter vær
     Dyst         -> blanding av de fire fagene fra dojoen

   Tre vanskegrader (niv 1–3):
     Trening: følger nivået på egenskapen (1–5, 6–10, 11–15).
     Fangst:  følger sjeldenheten (vanlig, sjelden, legendarisk).
     Dyst:    følger motstanderen (belte 1–3, 4–7, 8–10).

   Ordbankene står øverst. Det er de du endrer for å tilpasse til eleven.
   ===================================================================== */
(function(){
'use strict';

var TEMA = {
  tallinje:{navn:'Tallinje', ik:'📏'}, klokke:{navn:'Klokka', ik:'🕒'}, maale:{navn:'Måling', ik:'⚖️'}, kalk:{navn:'Kalkulator', ik:'🧮'},
  engelsk:{navn:'Engelsk', ik:'🇬🇧'}, hender:{navn:'Vaske hender', ik:'🧼'}, lek:{navn:'Invitere til lek', ik:'🤝'}, hjelp:{navn:'Be om hjelp', ik:'🙋'},
  hverdag:{navn:'Hverdagsproblemer', ik:'💡'}, rekkefolge:{navn:'Kle på seg', ik:'👕'}, klaer:{navn:'Klær som passer', ik:'🌦️'}
};
var STASJON_TEMA = {
  styrke:['tallinje'], fart:['klokke'], uth:['maale','kalk'], klokt:['engelsk'],
  fangst:['hender','lek','hjelp','hverdag','rekkefolge','klaer'],
  dyst:['tallinje','klokke','maale','kalk','engelsk']
};

/* ---------- ORDBANKER ---------- */
/* Engelske ord. en = engelsk, no = norsk, e = bilde (emoji til ekte bilder er laget). */
var ORD = [
  {en:'dog',no:'hund',e:'🐶'},{en:'cat',no:'katt',e:'🐱'},{en:'house',no:'hus',e:'🏠'},{en:'car',no:'bil',e:'🚗'},{en:'book',no:'bok',e:'📖'},
  {en:'apple',no:'eple',e:'🍎'},{en:'water',no:'vann',e:'💧'},{en:'milk',no:'melk',e:'🥛'},{en:'bread',no:'brød',e:'🍞'},{en:'ball',no:'ball',e:'⚽'},
  {en:'sun',no:'sol',e:'☀️'},{en:'rain',no:'regn',e:'🌧️'},{en:'bed',no:'seng',e:'🛏️'},{en:'chair',no:'stol',e:'🪑'},{en:'door',no:'dør',e:'🚪'},
  {en:'hand',no:'hånd',e:'✋'},{en:'foot',no:'fot',e:'🦶'},{en:'fish',no:'fisk',e:'🐟'},{en:'bird',no:'fugl',e:'🐦'},{en:'tree',no:'tre',e:'🌳'},
  {en:'school',no:'skole',e:'🏫'},{en:'bus',no:'buss',e:'🚌'},{en:'boat',no:'båt',e:'⛵'},{en:'shoe',no:'sko',e:'👟'},{en:'hat',no:'hatt',e:'👒'},
  {en:'happy',no:'glad',e:'😀'},{en:'sad',no:'lei seg',e:'😢'},{en:'red',no:'rød',e:'🔴'},{en:'blue',no:'blå',e:'🔵'},{en:'green',no:'grønn',e:'🟢'},
  {en:'eat',no:'spise',e:'🍽️'},{en:'drink',no:'drikke',e:'🥤'},{en:'sleep',no:'sove',e:'😴'},{en:'run',no:'løpe',e:'🏃'},{en:'read',no:'lese',e:'📚'}
];
/* Setninger med et hull. ok = ordet som passer, feil = to ord som ikke passer, no = hva setningen betyr. */
var SETNINGER = [
  {s:'The ___ is red.', ok:'apple', feil:['happy','run'], e:'🍎', no:'Eplet er rødt.'},
  {s:'I ___ water.', ok:'drink', feil:['door','blue'], e:'🥤', no:'Jeg drikker vann.'},
  {s:'The ___ says woof.', ok:'dog', feil:['fish','chair'], e:'🐶', no:'Hunden sier voff.'},
  {s:'I ___ in my bed.', ok:'sleep', feil:['apple','green'], e:'😴', no:'Jeg sover i senga mi.'},
  {s:'The sun is in the ___.', ok:'sky', feil:['shoe','milk'], e:'☀️', no:'Sola er på himmelen.'},
  {s:'I ___ a book.', ok:'read', feil:['rain','foot'], e:'📖', no:'Jeg leser ei bok.'},
  {s:'The ___ can swim.', ok:'fish', feil:['house','bread'], e:'🐟', no:'Fisken kan svømme.'},
  {s:'I go to ___ by bus.', ok:'school', feil:['happy','eat'], e:'🚌', no:'Jeg drar til skolen med buss.'},
  {s:'The grass is ___.', ok:'green', feil:['sad','hand'], e:'🟢', no:'Gresset er grønt.'},
  {s:'I ___ bread for lunch.', ok:'eat', feil:['tree','blue'], e:'🍞', no:'Jeg spiser brød til lunsj.'},
  {s:'The ___ can fly.', ok:'bird', feil:['car','bed'], e:'🐦', no:'Fuglen kan fly.'},
  {s:'I am ___ today.', ok:'happy', feil:['door','boat'], e:'😀', no:'Jeg er glad i dag.'},
  {s:'Please open the ___.', ok:'door', feil:['run','red'], e:'🚪', no:'Vær så snill og åpne døra.'},
  {s:'I kick the ___.', ok:'ball', feil:['milk','sleep'], e:'⚽', no:'Jeg sparker ballen.'},
  {s:'The ___ says meow.', ok:'cat', feil:['bus','hat'], e:'🐱', no:'Katten sier mjau.'},
  {s:'I sit on a ___.', ok:'chair', feil:['rain','drink'], e:'🪑', no:'Jeg sitter på en stol.'},
  {s:'I put on my ___.', ok:'shoes', feil:['fish','happy'], e:'👟', no:'Jeg tar på meg skoene.'},
  {s:'I can ___ fast.', ok:'run', feil:['book','green'], e:'🏃', no:'Jeg kan løpe fort.'},
  {s:'We live in a ___.', ok:'house', feil:['eat','sad'], e:'🏠', no:'Vi bor i et hus.'},
  {s:'I drink ___ in the morning.', ok:'milk', feil:['chair','read'], e:'🥛', no:'Jeg drikker melk om morgenen.'}
];
/* Måling. Hvert spørsmål har ett riktig svar og to–tre gale. */
var MAAL_VERKTOY = [
  {sp:'Hva bruker vi for å måle hvor lang en blyant er?', ok:'📏 Linjal', feil:['⚖️ Vekt','🥛 Litermål','⏰ Klokke']},
  {sp:'Hva bruker vi for å finne ut hvor mye en pose epler veier?', ok:'⚖️ Vekt', feil:['📏 Linjal','🌡️ Termometer','⏰ Klokke']},
  {sp:'Hva bruker vi for å måle opp melk til vaflene?', ok:'🥛 Litermål', feil:['📏 Linjal','⚖️ Vekt','🌡️ Termometer']},
  {sp:'Hva bruker vi for å se hvor varmt det er ute?', ok:'🌡️ Termometer', feil:['📏 Linjal','⚖️ Vekt','🥛 Litermål']},
  {sp:'Hva bruker vi for å se hvor lenge friminuttet varer?', ok:'⏰ Klokke', feil:['📏 Linjal','⚖️ Vekt','🌡️ Termometer']},
  {sp:'Hva bruker vi for å måle hvor høy du er?', ok:'📏 Målebånd', feil:['⚖️ Vekt','🥛 Litermål','⏰ Klokke']},
  {sp:'Hva måler vi i kilo?', ok:'Hvor tungt noe er', feil:['Hvor langt noe er','Hvor varmt noe er']},
  {sp:'Hva måler vi i meter?', ok:'Hvor langt noe er', feil:['Hvor tungt noe er','Hvor lang tid noe tar']},
  {sp:'Hva måler vi i liter?', ok:'Hvor mye det er plass til', feil:['Hvor langt noe er','Hvor tungt noe er']}
];
var MAAL_RIMELIG = [
  {sp:'Hvor høy er en dør?', ok:'2 meter', feil:['2 centimeter','2 kilometer']},
  {sp:'Hvor lang er en blyant?', ok:'15 centimeter', feil:['15 meter','15 kilometer']},
  {sp:'Hvor mye melk er det i en melkekartong?', ok:'1 liter', feil:['1 kilo','1 meter']},
  {sp:'Hvor mye veier en pose mel?', ok:'1 kilo', feil:['1 gram','1 liter']},
  {sp:'Hvor langt er det å gå til butikken?', ok:'1 kilometer', feil:['1 centimeter','1 kilo']},
  {sp:'Hvor mye veier en binders?', ok:'1 gram', feil:['1 kilo','1 meter']},
  {sp:'Hvor lang er en buss?', ok:'12 meter', feil:['12 centimeter','12 liter']},
  {sp:'Hvor mye vann er det i en bøtte?', ok:'10 liter', feil:['10 meter','10 gram']},
  {sp:'Hvor bred er en finger?', ok:'1 centimeter', feil:['1 meter','1 kilo']},
  {sp:'Hva er lengst?', ok:'🚌 En buss', feil:['🚲 En sykkel','✏️ En blyant']},
  {sp:'Hva er kortest?', ok:'🐜 En maur', feil:['🐱 En katt','🐴 En hest']},
  {sp:'Hva veier mest?', ok:'🐘 En elefant', feil:['🐶 En hund','🐭 En mus']},
  {sp:'Hva veier minst?', ok:'🪶 En fjær', feil:['📖 En bok','🎒 En sekk']},
  {sp:'Hva rommer mest?', ok:'🛁 Et badekar', feil:['🥛 Et glass','🪣 En bøtte']}
];
/* Regnefortellinger til kalkulatoren. {a} og {b} byttes ut med tallene i «tall». Tallene er faste,
   slik at hver fortelling kan leses inn som ett lydklipp. regn: '+', '-' eller '*'. */
var REGNEFORTELLINGER = [
  {t:'En is koster {a} kroner. En brus koster {b} kroner. Hvor mye koster det til sammen?', regn:'+', tall:[[25,18],[30,22],[19,15]]},
  {t:'Du har {a} kroner. Du kjøper et blad til {b} kroner. Hvor mye har du igjen?', regn:'-', tall:[[50,35],[80,45],[60,25]]},
  {t:'Det er {a} elever i klassen. I dag er {b} borte. Hvor mange er på skolen?', regn:'-', tall:[[24,3],[20,6],[27,5]]},
  {t:'En bolle koster {b} kroner. Du kjøper {a} boller. Hvor mye koster det?', regn:'*', tall:[[3,12],[4,15],[2,18]]},
  {t:'Du har {a} klistremerker. Du får {b} til. Hvor mange har du nå?', regn:'+', tall:[[34,21],[52,13],[45,30]]},
  {t:'Det er {a} poser med {b} epler i hver. Hvor mange epler er det?', regn:'*', tall:[[3,6],[5,4],[4,8]]},
  {t:'Bussen har {a} seter. {b} er opptatt. Hvor mange seter er ledige?', regn:'-', tall:[[50,32],[45,20],[48,15]]}
];
/* ADL: situasjoner med ett godt valg og to dårlige. */
var HENDER = [
  {e:'🚽', sp:'Du er ferdig på do. Hva gjør du før du går ut?', ok:'Vasker hendene med såpe', feil:['Går rett ut','Tørker hendene på buksa']},
  {e:'🍽️', sp:'Det er mat. Hva gjør du først?', ok:'Vasker hendene', feil:['Begynner å spise','Tar på maten til de andre']},
  {e:'🧼', sp:'Du vasker hendene. Hva trenger du sammen med vannet?', ok:'Såpe', feil:['Tannkrem','Ingenting']},
  {e:'💦', sp:'Hendene er vasket og våte. Hva gjør du?', ok:'Tørker dem med håndkle eller papir', feil:['Tørker dem på genseren','Rister vannet på de andre']},
  {e:'🤧', sp:'Du har nyst i hendene. Hva gjør du?', ok:'Vasker hendene', feil:['Tar på dørhåndtaket','Tørker dem på bordet']},
  {e:'⛏️', sp:'Du har lekt i sandkassa og skal inn og spise. Hva gjør du?', ok:'Vasker hendene først', feil:['Spiser med en gang','Børster sanden av på buksa']},
  {e:'🚰', sp:'Du er ferdig med å vaske hendene. Hva gjør du med krana?', ok:'Skrur av vannet', feil:['Lar vannet renne','Skrur på mer vann']}
];
var LEK = [
  {e:'⚽', sp:'Du vil leke med Noah i friminuttet. Hva kan du si?', ok:'«Vil du leke med meg?»', feil:['«Flytt deg!»','Ingenting. Du tar ballen hans.']},
  {e:'🧍', sp:'Sara står alene i skolegården. Du vil ha henne med. Hva gjør du?', ok:'Går bort og spør: «Vil du være med?»', feil:['Ser en annen vei','Roper: «Hvorfor står du der?»']},
  {e:'🏃', sp:'Noen leker sisten. Du vil være med. Hva sier du?', ok:'«Kan jeg være med?»', feil:['«Dere leker feil!»','Ingenting. Du løper inn og dytter.']},
  {e:'🙅', sp:'Du spør om Ali vil leke. Han sier: «Ikke nå.» Hva gjør du?', ok:'Sier: «Ok, kanskje senere.»', feil:['Blir sint og roper','Følger etter ham hele friminuttet']},
  {e:'🧱', sp:'Emma bygger med klosser. Du vil bygge sammen med henne. Hva gjør du?', ok:'Spør: «Kan jeg bygge sammen med deg?»', feil:['Tar klossene hennes','Velter tårnet']},
  {e:'🎲', sp:'Du har et spill. Hvordan får du noen med?', ok:'Spør: «Har du lyst til å spille?»', feil:['Venter på at noen skal gjette det','Sier: «Du må spille med meg!»']},
  {e:'👋', sp:'En ny elev vet ikke hva hun skal gjøre i friminuttet. Hva kan du si?', ok:'«Hei! Vil du være med oss?»', feil:['«Du kan ikke være her.»','Ingenting']},
  {e:'🤝', sp:'To venner vil leke hver sin lek. Hva er lurt?', ok:'Leke den ene leken først og den andre etterpå', feil:['Krangle til friminuttet er over','Den som roper høyest bestemmer']}
];
var HJELP = [
  {e:'🧥', sp:'Du får ikke opp glidelåsen på jakka. Hva gjør du?', ok:'Spør en voksen: «Kan du hjelpe meg?»', feil:['Drar så hardt du kan','Går ut uten jakke']},
  {e:'📝', sp:'Du skjønner ikke oppgaven i timen. Hva gjør du?', ok:'Rekker opp hånda og spør', feil:['Sitter stille og venter','Skriver av naboen']},
  {e:'🩹', sp:'Du har falt og slått deg i friminuttet. Hva gjør du?', ok:'Går til en voksen og sier fra', feil:['Gjemmer deg','Sier ingenting til noen']},
  {e:'🥫', sp:'Du får ikke opp lokket på matboksen. Hva sier du?', ok:'«Kan du hjelpe meg med lokket?»', feil:['«Dum boks!»','Ingenting. Du lar være å spise.']},
  {e:'🏪', sp:'Du finner ikke melka i butikken. Hvem kan du spørre?', ok:'En som jobber i butikken', feil:['Ingen. Du går hjem.','Du roper høyt i butikken']},
  {e:'🎒', sp:'Sekken er for tung å løfte opp på knaggen. Hva gjør du?', ok:'Ber om hjelp til å løfte', feil:['Lar den ligge midt i gangen','Sparker til den']},
  {e:'😟', sp:'Noen er slemme mot deg i friminuttet. Hva gjør du?', ok:'Sier fra til en voksen', feil:['Sier det aldri til noen','Er slem tilbake']},
  {e:'🙏', sp:'En voksen har hjulpet deg. Hva sier du?', ok:'«Takk for hjelpen!»', feil:['Ingenting','«Det tok lang tid.»']}
];
var HVERDAG = [
  {e:'🥛', sp:'Du søler melk på bordet. Hva gjør du?', ok:'Henter en klut og tørker opp', feil:['Lar det være','Legger boka over']},
  {e:'🧤', sp:'Du finner ikke vottene dine. Hva gjør du først?', ok:'Leter i sekken og på plassen din', feil:['Tar noen andre sine','Går ut uten votter']},
  {e:'👟', sp:'Skolissa har gått opp. Hva gjør du?', ok:'Stopper og knyter den', feil:['Løper videre','Tar av deg skoen og går i sokkene']},
  {e:'⚽', sp:'Ballen har havnet på taket. Hva gjør du?', ok:'Sier fra til en voksen', feil:['Klatrer opp på taket','Kaster steiner etter den']},
  {e:'✏️', sp:'Blyanten din brakk. Hva gjør du?', ok:'Spisser den eller henter en ny', feil:['Slutter å jobbe','Tar blyanten til naboen']},
  {e:'🥪', sp:'Du mistet brødskiva på gulvet. Hva gjør du?', ok:'Plukker den opp og kaster den i søpla', feil:['Lar den ligge','Sparker den under bordet']},
  {e:'🔋', sp:'Nettbrettet er nesten tomt for strøm. Hva gjør du?', ok:'Setter det til lading', feil:['Legger det i sekken','Trykker hardere på skjermen']},
  {e:'💧', sp:'Du er veldig tørst i timen. Hva gjør du?', ok:'Spør om du kan drikke vann', feil:['Løper ut av klasserommet','Tar flaska til naboen']},
  {e:'🌧️', sp:'Du ble våt på beina i friminuttet. Hva gjør du?', ok:'Bytter til tørre sokker', feil:['Går med våte sokker hele dagen','Tar av sokkene og går barbeint ute']},
  {e:'⏰', sp:'Du kommer for sent til timen. Hva gjør du?', ok:'Går stille inn og setter deg', feil:['Går hjem igjen','Roper «Hei!» til alle']},
  {e:'🧃', sp:'Du har drukket opp juicen. Hva gjør du med kartongen?', ok:'Kaster den i søpla', feil:['Legger den på gulvet','Putter den i sekken til naboen']}
];
/* Rekkefølger. Første steg står først. Listene er laget slik at det bare finnes én riktig rekkefølge. */
var HENDER_STEG = [null,
  ['🧼 Ta såpe','💦 Skyll av såpa','🧻 Tørk hendene'],
  ['🚰 Skru på vannet','🧼 Ta såpe','💦 Skyll av såpa','🧻 Tørk hendene'],
  ['🚰 Skru på vannet','🧼 Ta såpe','👐 Gni hendene godt','💦 Skyll av såpa','🧻 Tørk hendene']
];
var KLE_PAA = [null,
  [['🩲 Truse','👖 Bukse','👟 Sko'], ['👕 T-skjorte','🧶 Genser','🧥 Jakke'], ['🧦 Sokker','👖 Bukse','👟 Sko'], ['👕 T-skjorte','🧥 Jakke','🎒 Sekk']],
  [['🩲 Truse','🧦 Sokker','👖 Bukse','👟 Sko'], ['👕 T-skjorte','🧶 Genser','🧥 Jakke','🎒 Sekk'], ['🧦 Ullsokker','🧥 Vinterdress','🥾 Vintersko','🧤 Votter'], ['🩲 Truse','👖 Bukse','👕 T-skjorte','🧶 Genser']],
  [['🩲 Truse','🧦 Sokker','👖 Bukse','👕 T-skjorte','🧶 Genser','👟 Sko'], ['🩲 Undertøy','🧦 Ullsokker','🧥 Vinterdress','🥾 Vintersko','🧤 Votter'], ['👕 T-skjorte','🧶 Genser','🧥 Jakke','🦺 Refleksvest','🎒 Sekk'], ['🩲 Truse','🧦 Sokker','👖 Bukse','👕 T-skjorte','🧥 Jakke','👟 Sko','🎒 Sekk']]
];
/* Påkledningsfiguren. Figuren og plaggene ligger i bilder/kle/. Plaggene er tegnet på figuren (Higgsfield) og klipt ut,
   så hvert plagg har sin faste plass: KLE_POS = [venstre, topp, bredde] i prosent av figurbildet (lages sammen med bildene).
   s = plassen på kroppen (to plagg på samme plass bytter med hverandre), z = hvilket lag det ligger i (høyest ligger øverst),
   etter = plagg som må være på FØR dette i «Kle på seg» (gjelder bare de som er med i oppgaven). */
var KROPP = {
  truse:{s:'under',z:1}, undertoy:{s:'under',z:1},
  sokker:{s:'sokk',z:2,etter:['truse','undertoy']}, ullsokker:{s:'sokk',z:2,etter:['undertoy']},
  bukse:{s:'bein',z:3,etter:['truse','undertoy','sokker']}, shorts:{s:'bein',z:3}, badetoy:{s:'bein',z:3},
  tskjorte:{s:'skjorte',z:4,etter:['truse']}, pentoy:{s:'skjorte',z:4},
  genser:{s:'genser',z:5,etter:['tskjorte']}, gymtoy:{s:'hel',z:5}, pysj:{s:'hel',z:5}, vinterdress:{s:'hel',z:5,etter:['undertoy','ullsokker']}, regnbukse:{s:'ytterbein',z:5},
  sko:{s:'fot',z:6,etter:['sokker','bukse']}, gymsko:{s:'fot',z:6}, pensko:{s:'fot',z:6}, sandaler:{s:'fot',z:6}, tofler:{s:'fot',z:6}, stovler:{s:'fot',z:6},
  vintersko:{s:'fot',z:6,etter:['vinterdress','ullsokker']},
  jakke:{s:'jakke',z:9,etter:['tskjorte','genser']}, regnjakke:{s:'jakke',z:9}, vinterjakke:{s:'jakke',z:9},
  refleksvest:{s:'vest',z:10,etter:['jakke']}, sekk:{s:'rygg',z:11,etter:['jakke','refleksvest','sko']}, skjerf:{s:'hals',z:12},
  lue:{s:'hode',z:13}, caps:{s:'hode',z:13}, solhatt:{s:'hode',z:13}, solbriller:{s:'ansikt',z:13},
  votter:{s:'hand',z:13,etter:['vinterdress','vintersko']}, handkle:{s:'arm',z:13}
};
var KLE_FORHOLD = '876/1143';
var KLE_POS = {
  badetoy:[29.0,54.77,42.12], bukse:[29.45,54.77,41.21], caps:[31.51,4.72,37.1], genser:[5.02,33.86,89.5], gymsko:[25.34,84.08,49.43], gymtoy:[20.09,34.12,59.93],
  handkle:[68.49,39.98,24.77], jakke:[6.16,31.67,87.79], lue:[30.37,1.05,39.27], pensko:[29.45,82.76,41.32], pentoy:[6.51,31.67,87.67], pysj:[8.45,33.95,83.33],
  refleksvest:[29.45,33.51,41.32], regnbukse:[29.57,33.68,40.98], regnjakke:[6.74,28.08,86.76], sandaler:[30.02,86.7,40.07], sekk:[23.29,32.9,53.65], shorts:[29.68,54.86,40.87],
  skjerf:[31.51,28.35,36.87], sko:[29.45,82.76,41.32], sokker:[30.94,81.36,38.24], solbriller:[31.39,15.84,37.33], solhatt:[15.64,4.81,68.95], stovler:[30.37,74.19,39.38],
  tofler:[29.57,88.28,40.98], truse:[29.34,55.38,41.55], tskjorte:[19.18,33.6,61.76], ullsokker:[30.14,74.1,39.84], undertoy:[30.02,34.12,40.07], vinterdress:[10.05,28.43,80.14],
  vinterjakke:[4.45,24.67,91.21], vintersko:[29.22,76.55,41.67], votter:[1.37,44.79,97.37]
};
/* Bakgrunnen bak figuren i «Klær som passer». */
var KLE_SCENE = {'🌧️':'#b9c6d6,#8fa3b8','❄️':'#eaf3fb,#c9dcee','☀️':'#fff3c4,#ffd98a','🏃':'#dff0d8,#b9dcae','🏊':'#cdeffa,#8fd3ee','🌙':'#3d3a66,#2b2440','🎂':'#fde3ee,#f6bcd2','🏖️':'#cdeffa,#f6e3a8','💨':'#e9d9c0,#cdb48e'};
/* Klær. Brukes i «klær som passer». */
var PLAGG = {
  regnjakke:'🧥 Regnjakke', regnbukse:'👖 Regnbukse', stovler:'🥾 Gummistøvler', paraply:'☂️ Paraply',
  lue:'🧶 Lue', votter:'🧤 Votter', skjerf:'🧣 Skjerf', vinterjakke:'🧥 Vinterjakke', vintersko:'🥾 Vintersko',
  shorts:'🩳 Shorts', tskjorte:'👕 T-skjorte', sandaler:'🩴 Sandaler', solhatt:'👒 Solhatt', solbriller:'🕶️ Solbriller',
  badetoy:'🩱 Badetøy', handkle:'🟦 Håndkle', gymsko:'👟 Joggesko', gymtoy:'🎽 Gymtøy', pysj:'🛌 Pysjamas', tofler:'🥿 Tøfler',
  pentoy:'👔 Pen skjorte', pensko:'👞 Pene sko', caps:'🧢 Caps'
};
var KLAER = [
  {e:'🌧️', sp:'Det regner ute. Hva tar du på deg?', ok:['regnjakke','regnbukse','stovler'], feil:['sandaler','shorts','solhatt','solbriller'], grunn:['truse','sokker','bukse','tskjorte','genser']},
  {e:'❄️', sp:'Det snør og er kaldt. Hva tar du på deg?', ok:['lue','votter','vinterjakke','vintersko','skjerf'], feil:['shorts','sandaler','solhatt','badetoy'], grunn:['truse','ullsokker','bukse','tskjorte','genser']},
  {e:'☀️', sp:'Det er sol og veldig varmt. Hva tar du på deg?', ok:['shorts','tskjorte','sandaler','solhatt'], feil:['vinterjakke','lue','votter','skjerf'], grunn:['truse']},
  {e:'🏃', sp:'Du skal ha gym. Hva trenger du?', ok:['gymtoy','gymsko'], feil:['pysj','stovler','vinterjakke','pentoy'], grunn:['truse','sokker']},
  {e:'🏊', sp:'Du skal i svømmehallen. Hva tar du med?', ok:['badetoy','handkle'], feil:['votter','gymsko','regnbukse','lue'], grunn:[]},
  {e:'🌙', sp:'Det er kveld og du skal legge deg. Hva tar du på deg?', ok:['pysj','tofler'], feil:['regnjakke','gymsko','solbriller','vintersko'], grunn:['truse']},
  {e:'🎂', sp:'Du skal i bursdag. Hva kan passe?', ok:['pentoy','pensko'], feil:['pysj','regnbukse','badetoy','gymtoy'], grunn:['truse','sokker','bukse']},
  {e:'🏖️', sp:'Du skal på stranda en varm sommerdag. Hva tar du med?', ok:['badetoy','handkle','solhatt','solbriller'], feil:['vinterjakke','votter','skjerf','vintersko'], grunn:[]},
  {e:'💨', sp:'Det er høst, kaldt og vått. Hva tar du på deg?', ok:['regnjakke','stovler','lue'], feil:['shorts','sandaler','badetoy','solbriller'], grunn:['truse','sokker','bukse','tskjorte','genser']}
];
/* grunn = det figuren allerede har på seg i «Klær som passer», så den ikke står naken. Passende plagg som ikke er med
   i oppgaven, er også på fra start. Eleven skal bare finne det som mangler for å bli klar. */

/* «Kle på seg»: det figuren har på seg fra start. Oppgaven kan handle om bare overkroppen (t-skjorte, genser, jakke)
   eller bare underkroppen. Da har figuren resten på fra før, så den er ferdig påkledd når oppgaven er løst. */
function kleGrunn(ids){
  var har = function(){ return [].some.call(arguments, function(id){return ids.indexOf(id)>=0}) }, g = [];
  if(har('vinterdress')){ if(!har('undertoy','truse')) g.push('undertoy'); return g }
  if(!har('truse','undertoy')) g.push('truse');
  if(!har('bukse')){ if(!har('sokker','ullsokker')) g.push('sokker'); g.push('bukse'); if(har('jakke','sekk') && !har('sko')) g.push('sko') }
  else if(har('sko') && !har('sokker','ullsokker')) g.push('sokker');
  if(!har('tskjorte')) g.push('tskjorte');
  return g;
}

/* ---------- Hjelpere ---------- */
function en(a){return a[rnd(a.length)]}
function mellom(a,b){return a+rnd(b-a+1)}
function stokk(a){a=a.slice(); for(var i=a.length-1;i>0;i--){var j=rnd(i+1),t=a[i];a[i]=a[j];a[j]=t} return a}
function tallValg(riktig, min, maks, n, steg){
  steg = steg||1; var v = [riktig], forsok = 0;
  while(v.length<n && forsok++<200){var k = riktig + (rnd(7)-3)*steg; if(k>=min && k<=maks && v.indexOf(k)<0) v.push(k)}
  for(var k2=min; v.length<n && k2<=maks; k2+=steg) if(v.indexOf(k2)<0) v.push(k2);
  return stokk(v).map(function(x){return {t:String(x), ok:x===riktig}});
}
function valgFra(ok, feil, n){return stokk([{t:ok, ok:true}].concat(stokk(feil).slice(0,n-1).map(function(f){return {t:f, ok:false}})))}

/* ---------- Manus for øret ----------
   Lydklippene er lest inn med tall som ord og uten emoji. ore() gjør om teksten på skjermen til
   teksten som ble lest inn. Den brukes både når klippene lages og når de skal finnes igjen. */
var ENERE = ['null','en','to','tre','fire','fem','seks','sju','åtte','ni','ti','elleve','tolv','tretten','fjorten','femten','seksten','sytten','atten','nitten'],
    TIERE = ['','','tjue','tretti','førti','femti','seksti','sytti','åtti','nitti'];
function tallord(n){return n<20 ? ENERE[n] : n===100 ? 'hundre' : TIERE[Math.floor(n/10)]+(n%10 ? ENERE[n%10] : '')}
function kt(h){return h===1 ? 'ett' : tallord(h)}   // klokka ett, ikke klokka en
function ore(t){
  t = String(t).replace(/[«»]/g,'').replace(/[^A-Za-z0-9æøåÆØÅ .,?!:\-]/g,'').replace(/\d+/g,function(d){return tallord(+d)})
    .replace(/\bcm\b/,'centimeter').replace(/\bkg\b/,'kilo').replace(/\ben (kilo|gram)\b/,'ett $1').replace(/\s+/g,' ').trim();
  if(!/[.?!]$/.test(t)) t += '.';
  return t.charAt(0).toUpperCase()+t.slice(1);
}
var FEILMELD = {proev:'Prøv en gang til.', rekke:'Ikke den ennå. Hva kommer først?', passet:'Noe passet ikke. Se en gang til.', mangler:'Det mangler noe. Se en gang til.', nesten:'Ikke helt. Prøv en gang til.', kalk:'Kalkulatoren viser ikke riktig svar ennå. Prøv en gang til.'};

/* ---------- Bilder av klær og ting ----------
   Teksten etter emojien slås opp her. Finnes det et bilde, vises bildet i stedet for emojien. */
var TING = {'Regnjakke':'regnjakke','Regnbukse':'regnbukse','Gummistøvler':'stovler','Paraply':'paraply','Lue':'lue','Votter':'votter','Skjerf':'skjerf','Vinterjakke':'vinterjakke','Vintersko':'vintersko',
  'Shorts':'shorts','T-skjorte':'tskjorte','Sandaler':'sandaler','Solhatt':'solhatt','Solbriller':'solbriller','Badetøy':'badetoy','Håndkle':'handkle','Joggesko':'gymsko','Gymtøy':'gymtoy','Pysjamas':'pysj',
  'Tøfler':'tofler','Pen skjorte':'pentoy','Pene sko':'pensko','Caps':'caps','Truse':'truse','Bukse':'bukse','Sko':'sko','Genser':'genser','Jakke':'jakke','Sokker':'sokker','Sekk':'sekk','Ullsokker':'ullsokker',
  'Vinterdress':'vinterdress','Undertøy':'undertoy','Refleksvest':'refleksvest','Gå ut':'dor','Ta såpe':'saape'};
function pynt(t){ var i = t.indexOf(' '), rest = i>0 ? t.slice(i+1) : '', fil = TING[rest]; return fil ? '<img class="ting" src="bilder/ting/'+fil+'.webp" alt="">'+esc(rest) : esc(t) }

/* ---------- Tegninger ---------- */
var INK2 = '#2b2440';
function klokkeSvg(h, m, str){
  str = str||170; var s = '<svg viewBox="0 0 120 120" width="'+str+'" height="'+str+'" role="img" aria-label="Klokke"><circle cx="60" cy="60" r="55" fill="#fffaf3" stroke="'+INK2+'" stroke-width="4"/>';
  for(var i=1;i<=12;i++){var a = i*Math.PI/6; s += '<text x="'+(60+43*Math.sin(a)).toFixed(1)+'" y="'+(60-43*Math.cos(a)+5).toFixed(1)+'" font-size="13" font-weight="700" text-anchor="middle" fill="'+INK2+'" font-family="Fredoka,Arial">'+i+'</text>'}
  for(var j=0;j<60;j+=5){var b = j*Math.PI/30; s += '<line x1="'+(60+52*Math.sin(b)).toFixed(1)+'" y1="'+(60-52*Math.cos(b)).toFixed(1)+'" x2="'+(60+55*Math.sin(b)).toFixed(1)+'" y2="'+(60-55*Math.cos(b)).toFixed(1)+'" stroke="'+INK2+'" stroke-width="2"/>'}
  var ta = (h%12 + m/60)*Math.PI/6, ma = m*Math.PI/30;
  s += '<line x1="60" y1="60" x2="'+(60+26*Math.sin(ta)).toFixed(1)+'" y2="'+(60-26*Math.cos(ta)).toFixed(1)+'" stroke="#b83a55" stroke-width="6" stroke-linecap="round"/>';
  s += '<line x1="60" y1="60" x2="'+(60+38*Math.sin(ma)).toFixed(1)+'" y2="'+(60-38*Math.cos(ma)).toFixed(1)+'" stroke="'+INK2+'" stroke-width="4" stroke-linecap="round"/><circle cx="60" cy="60" r="4" fill="'+INK2+'"/></svg>';
  return s;
}
function linjalSvg(cm){
  var s = '<svg viewBox="0 0 330 110" width="100%" style="max-width:520px" role="img" aria-label="En blyant ligger langs en linjal"><rect x="14" y="14" width="'+(cm*24)+'" height="18" rx="4" fill="#f2b632" stroke="'+INK2+'" stroke-width="2.5"/><path d="M'+(14+cm*24)+' 14 l14 9 l-14 9z" fill="#f7dcc0" stroke="'+INK2+'" stroke-width="2.5" stroke-linejoin="round"/>';
  s += '<rect x="4" y="46" width="322" height="50" rx="6" fill="#ffe9a8" stroke="'+INK2+'" stroke-width="2.5"/>';
  for(var i=0;i<=12;i++){var x = 14+i*24; s += '<line x1="'+x+'" y1="46" x2="'+x+'" y2="64" stroke="'+INK2+'" stroke-width="2"/><text x="'+x+'" y="82" font-size="13" font-weight="700" text-anchor="middle" fill="'+INK2+'" font-family="Fredoka,Arial">'+i+'</text>';
    if(i<12) s += '<line x1="'+(x+12)+'" y1="46" x2="'+(x+12)+'" y2="56" stroke="'+INK2+'" stroke-width="1.4"/>'}
  return s+'<text x="318" y="92" font-size="9" text-anchor="end" fill="'+INK2+'" font-family="Arial">cm</text></svg>';
}
function vektSvg(kg){
  var s = '<svg viewBox="0 0 200 150" width="230" role="img" aria-label="En vekt med viser"><rect x="50" y="6" width="100" height="10" rx="4" fill="#cfc8d6" stroke="'+INK2+'" stroke-width="2.5"/><rect x="92" y="16" width="16" height="16" fill="#cfc8d6" stroke="'+INK2+'" stroke-width="2.5"/><rect x="20" y="30" width="160" height="114" rx="16" fill="#e8799b" stroke="'+INK2+'" stroke-width="3"/><circle cx="100" cy="90" r="48" fill="#fffaf3" stroke="'+INK2+'" stroke-width="3"/>';
  for(var i=0;i<=10;i++){var a = (i/10*300-150)*Math.PI/180; s += '<line x1="'+(100+40*Math.sin(a)).toFixed(1)+'" y1="'+(90-40*Math.cos(a)).toFixed(1)+'" x2="'+(100+46*Math.sin(a)).toFixed(1)+'" y2="'+(90-46*Math.cos(a)).toFixed(1)+'" stroke="'+INK2+'" stroke-width="2"/><text x="'+(100+31*Math.sin(a)).toFixed(1)+'" y="'+(90-31*Math.cos(a)+4).toFixed(1)+'" font-size="10" font-weight="700" text-anchor="middle" fill="'+INK2+'" font-family="Fredoka,Arial">'+i+'</text>'}
  var v = (kg/10*300-150)*Math.PI/180;
  return s+'<line x1="100" y1="90" x2="'+(100+36*Math.sin(v)).toFixed(1)+'" y2="'+(90-36*Math.cos(v)).toFixed(1)+'" stroke="#b83a55" stroke-width="4" stroke-linecap="round"/><circle cx="100" cy="90" r="4" fill="'+INK2+'"/><text x="100" y="128" font-size="9" text-anchor="middle" fill="'+INK2+'" font-family="Arial">kg</text></svg>';
}

/* =====================================================================
   OPPGAVELAGERNE. Hver lager én oppgave for et tema og en vanskegrad.
   ===================================================================== */
function klTekst(h, m){var n = h%12+1; return m===0 ? 'Klokka er '+h : m===30 ? 'Halv '+n : m===15 ? 'Kvart over '+h : 'Kvart på '+n}
function klOrd(h, m){var n = h%12+1; return m===0 ? 'klokka '+kt(h) : m===30 ? 'halv '+kt(n) : m===15 ? 'kvart over '+kt(h) : 'kvart på '+kt(n)}
function klLes(h, m){return m===0 ? 'Klokka er '+kt(h)+'.' : 'Klokka er '+klOrd(h,m)+'.'}
var LAG = {
  klokke: function(niv){
    var min = [null,[0],[0,30],[0,15,30,45]][niv], h = mellom(1,12), m = en(min), tider = [[h,m]], f = 0;
    if(niv>1 && m===30) tider.push([h%12+1, 30]);             // den vanligste forvekslingen: halv fire og halv fem
    if(niv>2 && m!==30) tider.push([h, m===15?45:15]);
    while(tider.length<4 && f++<100){var t = [rnd(3)?mellom(1,12):h, en(min)]; if(!tider.some(function(x){return x[0]===t[0]&&x[1]===t[1]})) tider.push(t)}
    if(rnd(3)) return {sp:'Hva er klokka?', bilde:klokkeSvg(h,m,150), type:'valg', lang:true, valg:stokk(tider.map(function(t,i){return {t:klTekst(t[0],t[1]), l:klLes(t[0],t[1]), ok:i===0}}))};
    return {sp:'Hvilken klokke viser '+(m===0 ? 'klokka '+h : klTekst(h,m).toLowerCase())+'?', lyd:['Hvilken klokke viser '+klOrd(h,m)+'?'], type:'valg', bildevalg:true, valg:stokk(tider.map(function(t,i){return {t:klokkeSvg(t[0],t[1],120), ok:i===0}}))};
  },
  tallinje: function(niv){
    var v = rnd(3), a, b, n, alle = function(){return true}, femmere = function(x){return x%5===0};
    if(niv===1){
      a = rnd(2)*10; b = a+10; n = mellom(a+1,b-1);
      if(v===0) return {sp:'Hvilket tall mangler på tallinja?', type:'valg', linje:{min:a,max:b,steg:1,merk:function(x){return x!==n},spm:n}, valg:tallValg(n,a,b,4)};
      if(v===1) return {sp:'Finn tallet '+n+' på tallinja.', type:'linje', linje:{min:a,max:b,steg:1,merk:alle}, maal:n};
      return {sp:'Hvilket tall kommer rett etter '+(n-1)+'?', type:'valg', linje:{min:a,max:b,steg:1,merk:function(x){return x<n}}, valg:tallValg(n,a,b,4)};
    }
    if(niv===2){
      if(v===0){ n = mellom(1,19); if(n%5===0) n++; return {sp:'Finn tallet '+n+' på tallinja.', type:'linje', linje:{min:0,max:20,steg:1,merk:femmere}, maal:n} }
      var hopp = mellom(2,5), fram = rnd(2)===0, start = fram ? mellom(1,20-hopp) : mellom(hopp,19);
      return {sp:'Start på merket. Hopp '+hopp+' '+(fram?'fram':'tilbake')+'. Trykk der du lander.', lyd:['Start på merket.','Hopp '+tallord(hopp)+' '+(fram?'fram':'tilbake')+'.','Trykk der du lander.'], type:'linje', linje:{min:0,max:20,steg:1,merk:alle,start:start}, maal:fram?start+hopp:start-hopp};
    }
    if(v===0){ n = mellom(1,9)*10; return {sp:'Finn tallet '+n+' på tallinja.', type:'linje', linje:{min:0,max:100,steg:10,merk:function(x){return x%50===0}}, maal:n} }
    if(v===1){ var t = mellom(1,3), fr = rnd(2)===0, st = fr ? mellom(0,10-t)*10 : mellom(t,10)*10;
      return {sp:'Start på merket. Hopp '+t+' '+(t===1?'tier':'tiere')+' '+(fr?'fram':'tilbake')+'. Trykk der du lander.', lyd:['Start på merket.','Hopp '+tallord(t)+' '+(t===1?'tier':'tiere')+' '+(fr?'fram':'tilbake')+'.','Trykk der du lander.'], type:'linje', linje:{min:0,max:100,steg:10,merk:alle,start:st}, maal:fr?st+t*10:st-t*10} }
    a = mellom(1,8)*10; n = mellom(a+1,a+19); if(n%10===0) n++;
    return {sp:'Finn tallet '+n+' på tallinja.', type:'linje', linje:{min:a,max:a+20,steg:1,merk:function(x){return x%10===0}}, maal:n};
  },
  maale: function(niv){
    var q;
    if(niv===1){ q = en(MAAL_VERKTOY); return {sp:q.sp, type:'valg', lang:true, valg:valgFra(q.ok,q.feil,3)} }
    if(niv===2){
      if(rnd(2)){ var cm = mellom(3,11); return {sp:'Hvor lang er blyanten?', bilde:linjalSvg(cm), type:'valg', valg:tallValg(cm,1,12,4).map(function(x){x.t += ' cm'; return x})} }
      var kg = mellom(1,9); return {sp:'Hvor mye viser vekta?', bilde:vektSvg(kg), type:'valg', valg:tallValg(kg,0,10,4).map(function(x){x.t += ' kg'; return x})};
    }
    q = en(MAAL_RIMELIG); return {sp:q.sp, type:'valg', lang:true, valg:valgFra(q.ok,q.feil,3)};
  },
  kalk: function(niv){
    var a, b, pluss = rnd(2)===0, stykke = function(){return {sp:'Bruk kalkulatoren. Regn ut stykket.', bilde:'<span class="eng-ord">'+a+(pluss?' + ':' − ')+b+'</span>', type:'kalk', tall:[a,b], svar:pluss?a+b:a-b}};
    if(niv===1){ a = mellom(2,12); b = mellom(1,8); if(!pluss && b>a){var t=a;a=b;b=t} return stykke() }
    if(niv===2){ a = mellom(21,69); b = mellom(11,29); if(!pluss && b>a){var t2=a;a=b;b=t2} return stykke() }
    var f = en(REGNEFORTELLINGER), par = en(f.tall); a = par[0]; b = par[1];
    return {sp:f.t.replace('{a}',a).replace('{b}',b), type:'kalk', tall:[a,b], svar:f.regn==='+'?a+b:f.regn==='-'?a-b:a*b};
  },
  engelsk: function(niv){
    var o = en(ORD), andre = stokk(ORD.filter(function(x){return x!==o})).slice(0,3), v = rnd(2), korte = ORD.filter(function(x){return x.en.length<=5});
    if(niv===1){
      if(v) return {sp:'Hva heter «'+o.no+'» på engelsk?', bilde:'<span class="stor-e">'+o.e+'</span>', type:'valg', engelsk:true, valg:stokk([o].concat(andre)).map(function(x){return {t:x.en, ok:x===o}})};
      return {sp:'Hvilket bilde passer til det engelske ordet?', bilde:'<span class="eng-ord">'+o.en+'</span>', les2:o.en, type:'valg', bildevalg:true, valg:stokk([o].concat(andre)).map(function(x){return {t:'<span class="stor-e">'+x.e+'</span>', ok:x===o}})};
    }
    if(niv===2){
      if(v){ o = en(korte); return {sp:'Skriv «'+o.no+'» på engelsk. Trykk på bokstavene.', lyd:[ore('Skriv '+o.no+' på engelsk.'),'Trykk på bokstavene.'], bilde:'<span class="stor-e">'+o.e+'</span>', type:'skriv', ord:o.en, ekstra:0} }
      return {sp:'Hva betyr det engelske ordet?', bilde:'<span class="eng-ord">'+o.en+'</span>', les2:o.en, type:'valg', valg:stokk([o].concat(andre)).map(function(x){return {t:x.e+' '+x.no, ok:x===o}})};
    }
    if(v){ var s = en(SETNINGER); return {sp:'Velg ordet som passer i setningen.', bilde:'<span class="stor-e">'+s.e+'</span><span class="eng-ord">'+esc(s.s)+'</span><span class="liten">'+esc(s.no)+'</span>', les2:s.s.replace('___','blank'), fasit:s.s.replace('___',s.ok), type:'valg', engelsk:true, valg:valgFra(s.ok,s.feil,3)} }
    return {sp:'Skriv «'+o.no+'» på engelsk. Trykk på bokstavene.', lyd:[ore('Skriv '+o.no+' på engelsk.'),'Trykk på bokstavene.'], bilde:'<span class="stor-e">'+o.e+'</span>', type:'skriv', ord:o.en, ekstra:2};
  },
  hender: function(niv){
    if(rnd(3)===0) return {sp:'Vask hendene. Trykk på det du gjør først, og så videre.', bilde:'<span class="stor-e">🧼</span>', type:'rekke', steg:HENDER_STEG[niv]};
    return situasjon(en(HENDER), niv);
  },
  lek: function(niv){return situasjon(en(LEK), niv)},
  hjelp: function(niv){return situasjon(en(HJELP), niv)},
  hverdag: function(niv){return situasjon(en(HVERDAG), niv)},
  rekkefolge: function(niv){ var steg = en(KLE_PAA[niv]);
    var plagg = steg.map(function(t){return {id:TING[t.slice(t.indexOf(' ')+1)], navn:t.slice(t.indexOf(' ')+1)}});
    return {sp:'Du skal kle på deg. Trykk på det du tar på først, og så videre.', hint:'Dra klærne bort på figuren, eller trykk på dem.', type:'kle', modus:'rekke', steg:steg,
      grunn:kleGrunn(plagg.map(function(p){return p.id})), plagg:stokk(plagg)} },
  klaer: function(niv){
    /* Figuren er nesten påkledd og mangler noe: alle plaggene som mangler må på, og ingen av de som ikke passer. Høyere nivå gir flere plagg å velge mellom. */
    var k = en(KLAER), n = Math.min(niv+1, k.ok.length), ok = stokk(k.ok).slice(0,n), feil = stokk(k.feil).slice(0, niv+1);
    var grunn = (k.grunn||[]).concat(k.ok.filter(function(id){return ok.indexOf(id)<0}));
    var navn = function(id){var t = PLAGG[id]; return t.slice(t.indexOf(' ')+1)}, del = k.sp.split('. ');
    return {sp:k.sp, lyd:[del[0]+'.', del[1]], hint:'Figuren er nesten klar. Dra det som mangler bort på figuren, eller trykk på det. Trykk «Ferdig» når du er klar.', type:'kle', modus:'velg', scene:k.e, grunn:grunn,
      steg:ok.map(function(id){return PLAGG[id]}), ok:ok, plagg:stokk(ok.concat(feil)).map(function(id){return {id:id, navn:navn(id)}})};
  }
};
function situasjon(q, niv){return {sp:q.sp, bilde:'<span class="stor-e">'+q.e+'</span>', type:'valg', lang:true, valg:valgFra(q.ok, q.feil, niv===1 ? 2 : 3)}}

/* ---------- Velg tema og lag en oppgave som ikke er lik den forrige ---------- */
var forrige = {}, teller = {};
function lag(stasjonId, niv){
  var temaer = STASJON_TEMA[stasjonId] || STASJON_TEMA.dyst;
  teller[stasjonId] = (teller[stasjonId]||rnd(temaer.length)) + 1;
  var tema = stasjonId==='dyst' ? en(temaer) : temaer[teller[stasjonId] % temaer.length], o, f = 0;
  var nokkel = function(o){var r = o.valg && o.valg.filter(function(v){return v.ok})[0]; return o.sp+'|'+[o.maal,o.svar,o.ord].join('|')+(r?r.t:'')+(o.steg?o.steg.join():'')};
  do { o = LAG[tema](niv) } while(nokkel(o) === forrige[tema] && f++<8);
  forrige[tema] = nokkel(o); o.tema = tema; o.niv = niv; window.OPPGAVER.siste = o; return o;
}

/* ---------- Opplesing ----------
   Norsk tekst spilles fra lydklippene i mappa lyd/ (lest inn med ElevenLabs, stemmen Kristine).
   lyd/klipp.js er lista over hvilke tekster som har klipp. Finnes ikke klippet, brukes stemmen som
   er bygd inn i nettbrettet. Engelske ord og setninger er lest inn med en britisk stemme (Alice),
   og står i lista med «en:» foran teksten. */
var LYD = window.SAKURA_LYD || {}, spiller = typeof Audio !== 'undefined' ? new Audio() : null, runde = 0, lestEl = null;
function merk(el){ if(lestEl) lestEl.classList.remove('leses'); lestEl = el||null; if(lestEl) lestEl.classList.add('leses') }
function stopp(){ runde++; try{spiller.pause()}catch(e){} try{speechSynthesis.cancel()}catch(e){} merk(null) }
/* liste = [{t: tekst, eng: sann for engelsk, el: knappen som skal lyse opp mens den leses}] – leses etter tur. */
function spill(liste){
  stopp(); if(S && S.lydAv) return; var id = runde, i = 0;
  (function neste(){
    if(id !== runde) return; if(i >= liste.length) return merk(null);
    var x = liste[i++], fil = LYD[(x.eng ? 'en:' : '')+x.t], ferdig = false, videre = function(){ if(!ferdig){ferdig = true; setTimeout(neste, 280)} };
    merk(x.el);
    if(fil && spiller){ spiller.onended = videre; spiller.onerror = videre; spiller.src = 'lyd/'+fil; var p = spiller.play(); if(p && p.catch) p.catch(function(){}) }
    else if(window.speechSynthesis){ try{ var u = new SpeechSynthesisUtterance(x.t); u.lang = x.eng ? 'en-GB' : 'nb-NO'; u.rate = .9; u.onend = videre; u.onerror = videre; speechSynthesis.speak(u) }catch(e){videre()} }
    else videre();
  })();
}
document.addEventListener('click', function(e){ if(e.target.closest && e.target.closest('[data-a="lukk"],[data-omr]')) stopp() }, true);
/* Alle tekstene én oppgave kan lese opp på norsk. Brukes når lydklippene skal lages. */
function klargjor(o){
  o.lyd = o.lyd || [ore(o.sp)];
  (o.valg||[]).forEach(function(v){ if(o.engelsk){v.l = v.t; v.eng = true} else if(v.l === undefined) v.l = o.bildevalg || /^\d+$/.test(v.t) ? null : ore(v.t) });
  if(o.steg && o.type!=='kle') o.stegLes = o.steg.map(ore);
  return o;
}
function klipp(o){ klargjor(o); return o.lyd.concat((o.valg||[]).filter(function(v){return v.l && !v.eng}).map(function(v){return v.l}), o.stegLes||[]) }

/* ---------- Telling til rapporten: riktige på første forsøk og antall oppgaver per tema og vanskegrad ---------- */
function tell(o, riktig){
  if(!S) return; var f = S.fag || (S.fag = {}), t = f[o.tema] || (f[o.tema] = {}), n = t[o.niv] || (t[o.niv] = [0,0]);
  n[1]++; if(riktig) n[0]++; lagre();
  if(window.TLFramgang) window.TLFramgang.logg(o.tema+'-'+o.niv, riktig);   // til rapporten på Tavleloftet (målfila js/maal-sakuradalen.js)
}

/* ---------- Visning ---------- */
function linjeHtml(l, trykkbar){
  var s = '<div class="tl'+((l.max-l.min)/l.steg>12?' tett':'')+'">';
  for(var x=l.min; x<=l.max; x+=l.steg){
    var merke = l.spm===x ? '?' : l.merk(x) ? x : '', kl = (l.start===x?' start':'')+(l.spm===x?' spm':'')+(x%(l.steg*5)===0?' fem':'');
    s += trykkbar ? '<button class="tp'+kl+'" data-n="'+x+'" aria-label="'+(merke===''?'Strek uten tall':merke)+'"><i></i><b>'+merke+'</b></button>' : '<span class="tp'+kl+'"><i></i><b>'+merke+'</b></span>';
  }
  return s+'</div>';
}
function kalkHtml(){
  return '<div class="kalk"><output id="kdisp" aria-live="polite">0</output><div class="ktast">'+['7','8','9','+','4','5','6','−','1','2','3','×','C','0','=','÷'].map(function(k){
    return '<button data-k="'+k+'" class="'+(/\d/.test(k)?'':'op')+(k==='='?' er':'')+'">'+k+'</button>'}).join('')+'</div></div>';
}
function plaggGrunn(id){   // fast plagg figuren har på fra start (kan ikke tas av)
  var p = KLE_POS[id];
  return '<img class="kgrunn" data-g="'+id+'" data-s="'+KROPP[id].s+'" src="bilder/kle/'+id+'.webp" alt="" style="left:'+p[0]+'%;top:'+p[1]+'%;width:'+p[2]+'%;z-index:'+KROPP[id].z+'">';
}
function plaggPaa(id){
  var p = KLE_POS[id];
  return '<button class="kpaa" data-av="'+id+'" style="left:'+p[0]+'%;top:'+p[1]+'%;width:'+p[2]+'%;z-index:'+KROPP[id].z+'" aria-label="Ta av"><img src="bilder/kle/'+id+'.webp" alt=""></button>';
}
function vis(o, stasjon, ferdig, feil){
  klargjor(o);
  var tm = TEMA[o.tema], kropp = '', feilet = false, alt = function(i, l, inni){return l ? '<span class="alt"><button class="hor" data-hor="'+i+'" aria-label="Hør">🔊</button>'+inni+'</span>' : inni};
  if(o.type==='valg')  kropp = '<div class="svar'+(o.lang?' lang':'')+(o.bildevalg?' bildevalg':'')+'">'+o.valg.map(function(v,i){return alt(i, v.l, '<button data-i="'+i+'">'+(o.bildevalg?v.t:pynt(v.t))+'</button>')}).join('')+'</div>';
  if(o.type==='flere') kropp = '<div class="svar lang flere">'+o.valg.map(function(v,i){return alt(i, v.l, '<button data-i="'+i+'" aria-pressed="false">'+pynt(v.t)+'</button>')}).join('')+'</div><p class="midt"><button class="gull" data-sjekk>Sjekk</button></p>';
  if(o.type==='linje') kropp = linjeHtml(o.linje, true);
  if(o.type==='kalk')  kropp = kalkHtml()+'<p class="midt"><button class="gull" data-sjekk>Dette er svaret</button></p>';
  if(o.type==='rekke') kropp = '<ol class="rekke" id="rlagt"></ol><div class="svar lang" id="rvalg">'+stokk(o.steg.map(function(t,i){return {t:t,i:i}})).map(function(v){return alt(v.i, o.stegLes[v.i], '<button data-i="'+v.i+'">'+pynt(v.t)+'</button>')}).join('')+'</div>';
  if(o.type==='kle') kropp = '<p class="khint">'+esc(o.hint)+'</p><div class="kle"><div class="kfig" id="kfig"'+(o.scene?' style="background:linear-gradient('+KLE_SCENE[o.scene]+')"':'')+'>'+(o.scene?'<span class="kvaer">'+(o.scene==='💨'?'🍂':o.scene)+'</span>':'')+'<div class="kdukke" style="aspect-ratio:'+KLE_FORHOLD+'"><img class="kbase" src="bilder/kle/figur.webp" alt="">'+(o.grunn||[]).map(plaggGrunn).join('')+'</div></div>'+
    '<div class="kskuff" id="kskuff">'+o.plagg.map(function(p){return '<button data-p="'+p.id+'"><img src="bilder/kle/'+p.id+'.webp" alt="" draggable="false"><span>'+esc(p.navn)+'</span></button>'}).join('')+'</div></div>'+
    (o.modus==='velg' ? '<p class="midt"><button class="gull" data-sjekk>Ferdig</button></p>' : '');
  if(o.type==='skriv'){ var bok = o.ord.split(''); for(var x=0;x<o.ekstra;x++) bok.push(en('aeiorstln'.split('')));
    kropp = '<div class="ordfelt" id="ofelt" aria-live="polite"></div><div class="brikker">'+stokk(bok.map(function(b,i){return {b:b,i:i}})).map(function(v){return '<button data-b="'+v.b+'" data-i="'+v.i+'">'+v.b+'</button>'}).join('')+'</div><p class="midt"><button class="sek" data-visk>⌫ Visk ut</button></p>'; }
  dialog('<div class="rad" style="margin-bottom:6px"><h2 style="flex:1;margin:0;font-size:1.1rem">'+tm.ik+' '+tm.navn+'</h2><button class="sek lyd" data-les aria-label="Les opp">🔊</button></div>'+
    '<p class="spm">'+esc(o.sp)+'</p>'+(o.bilde?'<div class="obilde">'+o.bilde+'</div>':'')+(o.type==='valg'&&o.linje?linjeHtml(o.linje,false):'')+kropp+
    '<p class="tilbakemelding" id="tmeld" aria-live="assertive"></p><p style="margin-top:10px"><button class="sek" data-a="lukk">'+(feil?'Gi opp dysten':'Avbryt')+'</button></p>',
    function(el){
      el.classList.add('oppg'); if(o.type==='linje') el.classList.add('vid');
      /* ----- påkledning ----- */
      var paa = [], dratt = false;
      function med(id){return o.plagg.some(function(p){return p.id===id})}
      function skuffKnapp(id){return el.querySelector('#kskuff [data-p="'+id+'"]')}
      function rist(k){ if(!k) return; k.classList.add('rist'); setTimeout(function(){k.classList.remove('rist')}, 400) }
      function grunnVis(s, vis){ [].forEach.call(el.querySelectorAll('#kfig .kgrunn[data-s="'+s+'"]'), function(g){g.style.display = vis ? '' : 'none'}) }
      function taAv(id){ var i = paa.indexOf(id); if(i<0) return; paa.splice(i,1); var b = el.querySelector('#kfig [data-av="'+id+'"]'); if(b) b.remove(); var k = skuffKnapp(id); if(k) k.classList.remove('brukt');
        var s = KROPP[id].s; if(!paa.some(function(x){return KROPP[x].s===s})) grunnVis(s, true) }
      function taPaa(id){
        var p = KROPP[id], k = skuffKnapp(id); if(!p || paa.indexOf(id)>=0) return;
        if(o.modus==='rekke'){
          var mangler = (p.etter||[]).filter(function(x){return med(x) && paa.indexOf(x)<0});
          if(mangler.length){ rist(k); mangler.forEach(function(x){ var m = skuffKnapp(x); if(m){ m.classList.add('forst'); setTimeout(function(){m.classList.remove('forst')}, 1600) } }); return galt(FEILMELD.rekke) }
        }
        paa.filter(function(x){return KROPP[x].s===p.s}).forEach(taAv);   // to plagg på samme plass bytter med hverandre
        grunnVis(p.s, false);   // et plagg på samme plass som grunnantrekket erstatter det mens det er på
        paa.push(id); k.classList.add('brukt'); meld.textContent = '';
        el.querySelector('#kfig .kdukke').insertAdjacentHTML('beforeend', plaggPaa(id));
        if(o.modus==='rekke' && paa.length === o.plagg.length) setTimeout(riktig, 900);
      }
      if(o.type==='kle'){
        var fig = el.querySelector('#kfig'), spok = null, start = null;
        el.querySelector('#kskuff').addEventListener('pointerdown', function(e){
          var k = e.target.closest('[data-p]'); if(!k || k.disabled || k.classList.contains('brukt')) return;
          start = {k:k, x:e.clientX, y:e.clientY, id:e.pointerId}; dratt = false;
        });
        var flytt = function(e){
          if(!start || e.pointerId !== start.id) return;
          if(!spok){ if(Math.hypot(e.clientX-start.x, e.clientY-start.y) < 10) return;
            dratt = true; stopp(); spok = start.k.querySelector('img').cloneNode(); spok.className = 'kspok'; document.body.appendChild(spok); start.k.classList.add('dras') }
          spok.style.left = e.clientX+'px'; spok.style.top = e.clientY+'px';
          var r = fig.getBoundingClientRect(); fig.classList.toggle('over', e.clientX>r.left && e.clientX<r.right && e.clientY>r.top && e.clientY<r.bottom);
          e.preventDefault();
        };
        var slipp = function(e){
          if(!start || (e.pointerId !== undefined && e.pointerId !== start.id)) return;
          var k = start.k, traff = fig.classList.contains('over'); start = null; k.classList.remove('dras'); fig.classList.remove('over');
          if(spok){ spok.remove(); spok = null; if(traff && document.body.contains(el)) taPaa(k.dataset.p) }
          setTimeout(function(){dratt = false}, 0);
        };
        window.addEventListener('pointermove', flytt, {passive:false}); window.addEventListener('pointerup', slipp); window.addEventListener('pointercancel', slipp);
        /* rydder opp når oppgaven lukkes */
        var vakt = new MutationObserver(function(){ if(!document.body.contains(el)){ vakt.disconnect(); window.removeEventListener('pointermove', flytt); window.removeEventListener('pointerup', slipp); window.removeEventListener('pointercancel', slipp); if(spok) spok.remove() } });
        vakt.observe(document.getElementById('lag'), {childList:true});
      }
      var meld = el.querySelector('#tmeld'), lagt = [], skrevet = [], disp = '0', forrigeTall = null, op = null, nytt = true, regnet = null;   // regnet = de to tallene i det siste stykket kalkulatoren regnet ut
      function knapp(i){return el.querySelector('[data-i="'+i+'"]')}
      function lesAlt(){
        var l = o.lyd.map(function(t){return {t:t}}); if(o.les2) l.push({t:o.les2, eng:true});
        if(o.type==='valg' && o.lang) o.valg.forEach(function(v,i){ if(v.l) l.push({t:v.l, eng:v.eng, el:knapp(i)}) });   // svarene leses etter tur og lyser opp
        spill(l);
      }
      function riktig(){ if(!feilet) tell(o, true); stopp(); if(o.fasit) spill([{t:o.fasit, eng:true}]); ferdig(!feilet) }   // fasit = hele den engelske setningen leses opp
      function galt(tekst){ if(!feilet){feilet = true; tell(o, false)} if(feil){stopp(); return feil()} meld.textContent = tekst||FEILMELD.proev; spill([{t:meld.textContent}]) }
      function tegnOrd(){ el.querySelector('#ofelt').innerHTML = o.ord.split('').map(function(_,i){return '<span>'+(skrevet[i]?skrevet[i].b:'')+'</span>'}).join('') }
      if(o.type==='skriv') tegnOrd();
      lesAlt();
      el.addEventListener('click', function(e){
        var k = e.target.closest('button'); if(!k || k.disabled) return; var d = k.dataset;
        if('les' in d) return lesAlt();
        if(d.hor !== undefined){ var hv = o.valg ? o.valg[+d.hor] : {l:o.stegLes[+d.hor]}; return spill([{t:hv.l, eng:hv.eng, el:knapp(d.hor)}]) }
        stopp();
        if(o.type==='kle'){
          if(d.p){ if(dratt || k.classList.contains('brukt')) return; return taPaa(d.p) }
          if(d.av){ if(o.modus==='rekke' && paa.some(function(x){return (KROPP[x].etter||[]).indexOf(d.av)>=0})) return rist(k);   // kan ikke ta av noe som ligger under noe annet
            return taAv(d.av) }
          if('sjekk' in d){
            var gale = paa.filter(function(x){return o.ok.indexOf(x)<0});
            if(gale.length){ gale.forEach(function(x){ var s = skuffKnapp(x); taAv(x); s.classList.add('feil'); s.disabled = true }); return galt(FEILMELD.passet) }
            if(o.ok.some(function(x){return paa.indexOf(x)<0})) return galt(FEILMELD.mangler);
            return riktig() }
          return }
        if(o.type==='valg' && d.i!==undefined){ if(o.valg[+d.i].ok) return riktig(); k.classList.add('feil'); k.disabled = true; return galt() }
        if(o.type==='flere'){
          if(d.i!==undefined){ k.setAttribute('aria-pressed', k.getAttribute('aria-pressed')!=='true'); meld.textContent = ''; return }
          if('sjekk' in d){ var kn = [].slice.call(el.querySelectorAll('.flere [data-i]')), alleRett = kn.every(function(b){return (b.getAttribute('aria-pressed')==='true') === o.valg[+b.dataset.i].ok});
            if(alleRett) return riktig();
            kn.forEach(function(b){ if(b.getAttribute('aria-pressed')==='true' && !o.valg[+b.dataset.i].ok){ b.setAttribute('aria-pressed','false'); b.classList.add('feil'); b.disabled = true } });
            return galt(kn.some(function(b){return b.classList.contains('feil')}) ? FEILMELD.passet : FEILMELD.mangler) }
        }
        if(o.type==='linje' && d.n!==undefined){ if(+d.n===o.maal) return riktig(); k.classList.add('feil'); return galt() }
        if(o.type==='rekke' && d.i!==undefined){
          if(+d.i !== lagt.length){ k.classList.add('rist'); setTimeout(function(){k.classList.remove('rist')}, 400); return galt(FEILMELD.rekke) }
          lagt.push(+d.i); k.disabled = true; (k.closest('.alt')||k).style.display = 'none'; el.querySelector('#rlagt').insertAdjacentHTML('beforeend','<li>'+pynt(o.steg[+d.i])+'</li>'); meld.textContent = '';
          if(lagt.length === o.steg.length) return setTimeout(riktig, 500); return }
        if(o.type==='skriv'){
          if('visk' in d){ var s = skrevet.pop(); if(s) s.k.style.visibility = ''; meld.textContent = ''; return tegnOrd() }
          if(d.b && skrevet.length < o.ord.length){ skrevet.push({b:d.b, k:k}); k.style.visibility = 'hidden'; tegnOrd();
            if(skrevet.length === o.ord.length){ if(skrevet.map(function(x){return x.b}).join('') === o.ord){ spill([{t:o.ord, eng:true}]); return setTimeout(riktig, 900) }
              skrevet.forEach(function(x){x.k.style.visibility = ''}); skrevet = []; setTimeout(tegnOrd, 500); return galt(FEILMELD.nesten) } }
          return }
        if(o.type==='kalk'){
          if('sjekk' in d){
            /* Svaret må komme fra kalkulatoren: eleven må ha tastet inn de to tallene i oppgaven og regnet dem ut.
               Å bare skrive svaret i ruta holder ikke. Det gir et tips, men teller ikke som feil. */
            var brukt = regnet && o.tall && regnet.slice().sort().join() === o.tall.slice().sort().join();
            if(parseFloat(disp) === o.svar && (brukt || !o.tall)) return riktig();
            if(parseFloat(disp) === o.svar){ meld.textContent = 'Bruk kalkulatoren. Tast inn stykket og trykk =.'; return spill([{t:'Bruk kalkulatoren. Regn ut stykket.'}]) }
            return galt(FEILMELD.kalk) }
          if(d.k){ var t = d.k, regn = function(a,b,p){return p==='+'?a+b:p==='−'?a-b:p==='×'?a*b:b===0?0:a/b};
            if(/\d/.test(t)){ if(nytt) regnet = null; disp = nytt || disp==='0' ? t : (disp.length<9 ? disp+t : disp); nytt = false }
            else if(t==='C'){ disp = '0'; forrigeTall = null; op = null; nytt = true; regnet = null }
            else { if(op && !nytt){ regnet = [forrigeTall, parseFloat(disp)]; disp = String(Math.round(regn(forrigeTall, parseFloat(disp), op)*100)/100) }
              forrigeTall = parseFloat(disp); op = t==='=' ? null : t; nytt = true }
            el.querySelector('#kdisp').textContent = disp.replace('.',','); meld.textContent = '' }
        }
      });
    }, o.type==='linje' || o.bildevalg || o.type==='kle');
}

/* ---------- Stil ---------- */
var st = document.createElement('style');
st.textContent = '.oppg .spm{font-size:1.25rem;font-weight:700;margin:4px 0 10px;line-height:1.3}.oppg .lyd{font-size:1.3rem;padding:6px 14px}'+
  '.dialog.vid{max-width:940px}.obilde{text-align:center;margin:6px 0 10px;display:flex;flex-direction:column;align-items:center;gap:4px}.stor-e{font-size:4.2rem;line-height:1.1}'+
  '.eng-ord{font-family:Fredoka,sans-serif;font-weight:700;font-size:1.9rem;background:var(--lys);border-radius:14px;padding:6px 18px}'+
  '.oppg .svar.lang{grid-template-columns:1fr}.oppg .svar.lang button{font-size:1.1rem;min-height:56px;text-align:left;padding:10px 16px}'+
  '.oppg .svar.bildevalg button{min-height:0;padding:10px}.oppg .svar button{border:3px solid transparent}'+
  '.oppg .flere button[aria-pressed="true"]{background:#d8f0d6;border-color:var(--gronn)}.oppg .flere button[aria-pressed="true"]::after{content:" ✓";font-weight:700}'+
  '.alt{display:flex;gap:6px;align-items:stretch}.alt>[data-i]{flex:1;min-width:0}.oppg .svar .hor{flex:none;width:52px;min-height:0;padding:0;font-size:1.2rem;background:var(--kant);border:0}.oppg .leses{border-color:var(--gull)!important;box-shadow:0 0 0 4px #f2c23066}'+
  '.ting{width:52px;height:52px;object-fit:contain;vertical-align:middle;margin:-6px 10px -6px 0}.rekke .ting{width:36px;height:36px}'+
  '.tilbakemelding{min-height:1.5em;text-align:center;font-weight:700;color:#8f2a40;margin:10px 0 0}'+
  '.tl{display:flex;align-items:flex-start;margin:22px 0 8px;border-top:4px solid var(--ink);position:relative}.tl .tp{flex:1;min-width:0;background:none;border:0;border-radius:10px;padding:0 0 6px;min-height:64px;display:flex;flex-direction:column;align-items:center;color:var(--ink);font:inherit;position:relative}'+
  '.tl .tp i{display:block;width:3px;height:14px;background:var(--ink);margin-top:-2px}.tl .tp.fem i{height:22px;width:4px}.tl .tp b{font-family:Fredoka,sans-serif;font-size:1.15rem;margin-top:4px;min-height:1.4em}.tl.tett .tp b{font-size:.95rem}'+
  '.tl button.tp:active,.tl button.tp:hover{background:var(--lys)}.tl .tp.feil{background:#f6c9c4}.tl .tp.spm b{background:var(--gull);border-radius:8px;padding:0 8px}'+
  '.tl .tp.start::before{content:"Start";position:absolute;top:-30px;font-size:.8rem;font-weight:700;background:var(--hav);color:#fff;border-radius:8px;padding:1px 7px}.tl .tp.start i{background:var(--hav);width:6px}'+
  '.kalk{max-width:300px;margin:8px auto;background:var(--ink);border-radius:18px;padding:12px}.kalk output{display:block;background:#e4f5d8;border-radius:10px;padding:8px 12px;text-align:right;font-family:Fredoka,monospace;font-size:1.9rem;font-weight:700;margin-bottom:10px;min-height:1.5em}'+
  '.ktast{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.ktast button{min-height:54px;font-size:1.4rem;padding:0;background:#fffaf3;color:var(--ink)}.ktast button.op{background:var(--kant)}.ktast button.er{background:var(--gull)}'+
  '.khint{margin:-4px 0 8px;font-size:.95rem;color:#5a5070}.kle{display:flex;gap:12px;align-items:stretch}'+
  '.kfig{position:relative;flex:0 0 48%;max-width:320px;border-radius:18px;background:linear-gradient(#f3ecf6,#e6dcea);border:3px solid var(--kant);overflow:hidden;align-self:flex-start;padding:8px 6px 4px}.kfig.over{border-color:var(--gull);box-shadow:0 0 0 4px #f2c23066}'+
  '.kdukke{position:relative;width:100%}.kbase{position:absolute;inset:0;width:100%;height:100%;display:block}.kvaer{position:absolute;right:6px;top:2px;font-size:2.2rem;line-height:1.2;z-index:1}'+
  '.kgrunn{position:absolute;display:block;pointer-events:none}.oppg .kpaa{position:absolute;padding:0;min-height:0;background:none;border:0;border-radius:0}.kpaa img{display:block;width:100%;pointer-events:none}'+
  '.kskuff{flex:1;min-width:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:8px;align-content:start}'+
  '.oppg .kskuff button{background:var(--lys);color:var(--ink);border:3px solid var(--kant);padding:6px 4px;min-height:0;font-size:.85rem;display:flex;flex-direction:column;align-items:center;gap:2px;touch-action:none;user-select:none;-webkit-user-select:none}'+
  '.kskuff img{width:64px;height:64px;object-fit:contain;pointer-events:none}.kskuff .brukt{opacity:.25}.kskuff .dras{opacity:.4}.oppg .kskuff .feil{background:#f6c9c4;opacity:.6}.oppg .kskuff .forst{border-color:var(--gull);box-shadow:0 0 0 4px #f2c23066}'+
  '.kspok{position:fixed;width:96px;height:96px;object-fit:contain;transform:translate(-50%,-60%);pointer-events:none;z-index:99;filter:drop-shadow(0 6px 6px rgba(43,36,64,.35))}'+
  '@media(max-width:520px){.kle{flex-direction:column;align-items:center}.kfig{flex:none;width:72%;align-self:center}.kskuff{width:100%;grid-template-columns:repeat(auto-fill,minmax(76px,1fr))}.kskuff img{width:48px;height:48px}}'+
  '.rekke{margin:0 0 10px;padding-left:1.6em;min-height:1em}.rekke li{background:#d8f0d6;border-radius:12px;padding:8px 12px;margin-bottom:6px;font-weight:700}'+
  '.ordfelt{display:flex;justify-content:center;gap:6px;margin:8px 0 14px}.ordfelt span{width:48px;height:56px;border-bottom:4px solid var(--ink);font-family:Fredoka,sans-serif;font-size:2rem;font-weight:700;text-align:center;line-height:52px}'+
  '.brikker{display:flex;flex-wrap:wrap;justify-content:center;gap:8px}.brikker button{width:56px;min-height:56px;padding:0;font-size:1.6rem;font-family:Fredoka,sans-serif;background:var(--lys);color:var(--ink);border:3px solid var(--kant)}'+
  '@media (prefers-reduced-motion:no-preference){.rist{animation:rist .35s}@keyframes rist{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}}';
document.head.appendChild(st);

/* ---------- Koblingen til spillet ---------- */
window.startOppgave = function(stasjon, ferdig, feil, niv){ vis(lag(stasjon.id, klem(niv||1,1,3)), stasjon, ferdig, feil) };
window.OPPGAVER = {ORD:ORD, SETNINGER:SETNINGER, TEMA:TEMA, STASJON_TEMA:STASJON_TEMA, LAG:LAG, lag:lag, vis:vis, klipp:klipp, FEILMELD:FEILMELD};   // til testing og til rapporten
})();
