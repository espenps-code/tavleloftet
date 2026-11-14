/* Krøniken – oversikt over alt innhold. Menyen, quizen og prøveportalen leser denne. */
window.KRONIKEN={
  kristendommen:{navn:'Kristendommen',type:'religionen',hoved:'hovedpresentasjon.html',bokhoved:true,bilde:'tittel-kors.webp',
    verktoy:{oppgaver:'skriftruller.webp',historier:'sonnen.webp',quiz:'stormen.webp'},tema:[
    {id:'tema1-historie',tittel:'Fra Jesus til i dag',om:'Opprinnelse og historie',bilde:'vandring.webp'},
    {id:'tema2-bibelen',tittel:'Bibelen og fortellingene',om:'Hellige tekster og fortellinger',bilde:'bibelen.webp'},
    {id:'tema3-hoytider',tittel:'Kirkeåret',om:'Høytider og merkedager',bilde:'hoytider.webp'},
    {id:'tema4-ritualer',tittel:'Fra dåp til gravferd',om:'Ritualer og livsfaser',bilde:'kirkerom.webp'},
    {id:'tema5-steder',tittel:'Kirken og de hellige stedene',om:'Hellige steder og bygg',bilde:'hellige-steder.webp'},
    {id:'tema6-etikk',tittel:'Hvordan bør vi leve?',om:'Etikk og levesett',bilde:'forsoning.webp'},
    {id:'tema7-mangfold',tittel:'Én tro, mange kirker',om:'Mangfold og kirkesamfunn',bilde:'mangfold.webp'}
  ]},
  /* Høytidsopplegg i kristendomskunnskap. To deler for hvert trinn: del 1–2 for 5. trinn, 3–4 for 6. trinn, 5–6 for 7. trinn. */
  bibelfortellinger:{navn:'Fortellinger fra Bibelen',type:'modulen',bilde:'skapelsen.webp',
    verktoy:{oppgaver:'tavlene.webp',historier:'karavane.webp',quiz:'slynge.webp'},tema:[
    {id:'tema1-begynnelsen',tittel:'I begynnelsen',om:'5. trinn · Skapelsen, hagen og den store flommen',bilde:'skapelsen.webp'},
    {id:'tema2-abraham',tittel:'Abraham og Josef',om:'5. trinn · Fortellingene om en familie',bilde:'stjernehimmel.webp'},
    {id:'tema3-moses',tittel:'Moses',om:'5. trinn · Fra slaveri til frihet',bilde:'tornebusk.webp'},
    {id:'tema4-david',tittel:'David',om:'5. trinn · Gjetergutten som ble konge',bilde:'gjetergutt.webp'},
    {id:'tema5-lignelsene',tittel:'Lignelsene til Jesus',om:'6. trinn · Korte fortellinger med et dypere poeng',bilde:'gjeteren.webp'},
    {id:'tema6-bergprekenen',tittel:'Bergprekenen',om:'6. trinn · Den mest kjente talen i Bibelen',bilde:'fjellsiden.webp'}
  ]},
  kristennorge:{navn:'Kristendommen i Norge',type:'modulen',bilde:'steinkors.webp',
    verktoy:{oppgaver:'gammelbibel.webp',historier:'kulistein.webp',quiz:'langskip.webp'},tema:[
    {id:'tema1-kristningen',tittel:'Da Norge ble kristent',om:'6. trinn · Fra norrøn tro til kristendom',bilde:'steinkors.webp'},
    {id:'tema2-middelalderen',tittel:'Kirken i middelalderen',om:'6. trinn · Klostre, helgener og en kirke for hele Europa',bilde:'kloster.webp'},
    {id:'tema3-reformasjonen',tittel:'Reformasjonen i Norge',om:'6. trinn · Da kongen bestemte troen',bilde:'festning.webp'},
    {id:'tema4-konfirmasjonen',tittel:'Konfirmasjon og skole',om:'7. trinn · Da alle barn skulle lære å lese',bilde:'skolestue.webp'},
    {id:'tema5-vekkelsene',tittel:'Vekkelser og religionsfrihet',om:'7. trinn · Fra én tillatt tro til frihet for alle',bilde:'bedehus.webp'},
    {id:'tema6-samene',tittel:'Samene og kirken',om:'7. trinn · Tro, urett og forsoning',bilde:'fjellkirke.webp'}
  ]},
  kirkebygg:{navn:'Kirkebygg og kirkekunst',type:'modulen',bilde:'stavkirke.webp',
    verktoy:{oppgaver:'notatblokk.webp',historier:'nidaros.webp',quiz:'glassmaleri.webp'},tema:[
    {id:'tema1-stavkirkene',tittel:'Stavkirkene',om:'6. trinn · Trekirkene fra middelalderen',bilde:'stavkirke.webp'},
    {id:'tema2-steinkirkene',tittel:'Steinkirkene og Nidarosdomen',om:'6. trinn · Fra tykke murer til spisse buer',bilde:'katedral.webp'},
    {id:'tema3-kirkerommet',tittel:'Slik leser du et kirkerom',om:'5. trinn · Hva tingene heter, og hva de brukes til',bilde:'kirkerom.webp'},
    {id:'tema4-bildene',tittel:'Bilder som forteller',om:'6. trinn · Kirkekunst og symboler',bilde:'glassmaleri.webp'},
    {id:'tema5-idag',tittel:'Kirker i dag',om:'7. trinn · Fra bygdekirke til arbeidskirke',bilde:'modernekirke.webp'},
    {id:'tema6-undersok',tittel:'Undersøk din egen kirke',om:'5. trinn · Et opplegg for kirkebesøk',bilde:'besok.webp'}
  ]},
  jul:{navn:'Jul',type:'modulen',bilde:'julenatt.webp',
    verktoy:{oppgaver:'adventskrans.webp',historier:'biskopen.webp',quiz:'koret.webp'},tema:[
    {id:'tema1-julenatten',tittel:'Fortellingen om julenatten',om:'5. trinn · Juleevangeliet',bilde:'julenatt.webp'},
    {id:'tema2-advent',tittel:'Advent: ventetiden',om:'5. trinn · Fra første søndag i advent til trettende dag jul',bilde:'adventskrans.webp'},
    {id:'tema3-tradisjoner',tittel:'Jul i Norge før og nå',om:'6. trinn · Fra midtvintersfest til juletre',bilde:'julebord.webp'},
    {id:'tema4-nissen',tittel:'Hvor kommer julenissen fra?',om:'6. trinn · Myte eller fakta om jula',bilde:'biskopen.webp'},
    {id:'tema5-verden',tittel:'Jul i verden',om:'7. trinn · Samme høytid, ulike datoer og skikker',bilde:'verden.webp'},
    {id:'tema6-sangene',tittel:'Julens sanger og bilder',om:'7. trinn · Salmer, krybber og kulturarv',bilde:'koret.webp'}
  ]},
  paske:{navn:'Påske',type:'modulen',bilde:'tomgrav.webp',
    verktoy:{oppgaver:'egg.webp',historier:'inntoget.webp',quiz:'fullmane.webp'},tema:[
    {id:'tema1-paskeuka',tittel:'Påskeuka dag for dag',om:'5. trinn · Fra palmesøndag til påskedag',bilde:'jerusalem.webp'},
    {id:'tema2-tegn',tittel:'Påskens tegn og tradisjoner',om:'5. trinn · Faste, egg, fullmåne og påskefjell',bilde:'egg.webp'},
    {id:'tema3-pesach',tittel:'Påske og pesach',om:'6. trinn · To høytider med felles rot',bilde:'seder.webp'},
    {id:'tema4-nattverd',tittel:'Det siste måltidet',om:'6. trinn · Nattverden før og nå',bilde:'brodvin.webp'},
    {id:'tema5-pinse',tittel:'Fra påske til pinse',om:'7. trinn · Himmelfart, pinse og kirkens begynnelse',bilde:'pinseild.webp'},
    {id:'tema6-kunst',tittel:'Påsken i kunst og musikk',om:'7. trinn · Kors, prosesjoner og pasjoner',bilde:'korsene.webp'}
  ]},
  /* Hovedpresentasjonen for jødedommen er en vanlig innholdsfil (hoved.js) og åpnes gjennom presentasjon.html. */
  jodedommen:{navn:'Jødedommen',type:'religionen',hoved:'../presentasjon.html?p=jodedommen/hoved',bilde:'tittel-menora.webp',
    verktoy:{oppgaver:'skriver.webp',historier:'sivkurven.webp',quiz:'david.webp'},tema:[
    {id:'tema1-historie',tittel:'Fra Abraham til i dag',om:'Opprinnelse og historie',bilde:'abraham.webp'},
    {id:'tema2-tekstene',tittel:'Toraen og fortellingene',om:'Hellige tekster og fortellinger',bilde:'torarull.webp'},
    {id:'tema3-hoytider',tittel:'Det jødiske året',om:'Høytider og merkedager',bilde:'sabbat.webp'},
    {id:'tema4-ritualer',tittel:'Fra fødsel til gravferd',om:'Ritualer og livsfaser',bilde:'barmitsva.webp'},
    {id:'tema5-steder',tittel:'Synagogen og de hellige stedene',om:'Hellige steder og bygg',bilde:'synagoge.webp'},
    {id:'tema6-etikk',tittel:'Bud, mat og gode gjerninger',om:'Etikk og levesett',bilde:'budene.webp'},
    {id:'tema7-norge',tittel:'Jøder i Norge',om:'Minoritet og historie i Norge',bilde:'synagoge-norge.webp'}
  ]},
  islam:{navn:'Islam',type:'religionen',hoved:'../presentasjon.html?p=islam/hoved',bilde:'tittel-halvmane.webp',
    verktoy:{oppgaver:'vitenskap.webp',historier:'palmen.webp',quiz:'kart.webp'},tema:[
    {id:'tema1-historie',tittel:'Fra Mekka til hele verden',om:'Opprinnelse og historie',bilde:'karavane.webp'},
    {id:'tema2-koranen',tittel:'Koranen og troen',om:'Hellige tekster og troslære',bilde:'koranen.webp'},
    {id:'tema3-hoytider',tittel:'Ramadan, id og året',om:'Høytider og merkedager',bilde:'ramadan.webp'},
    {id:'tema4-ritualer',tittel:'Fem søyler og ett liv',om:'Ritualer og livsfaser',bilde:'bonneteppe.webp'},
    {id:'tema5-steder',tittel:'Moskeen og de hellige byene',om:'Hellige steder og bygg',bilde:'moske.webp'},
    {id:'tema6-etikk',tittel:'Halal, haram og det gode livet',om:'Etikk og levesett',bilde:'familie.webp'},
    {id:'tema7-norge',tittel:'Islam i Norge',om:'Mangfold og islam i Norge',bilde:'vindu.webp'}
  ]},
  hinduismen:{navn:'Hinduismen',type:'religionen',hoved:'../presentasjon.html?p=hinduismen/hoved',bilde:'tittel-lotus.webp',
    verktoy:{oppgaver:'symboler.webp',historier:'broen.webp',quiz:'musikk.webp'},tema:[
    {id:'tema1-historie',tittel:'Fra Indus til hele verden',om:'Opprinnelse og historie',bilde:'kart.webp'},
    {id:'tema2-tekstene',tittel:'Tekstene og troen',om:'Hellige tekster og troslære',bilde:'forteller.webp'},
    {id:'tema3-hoytider',tittel:'Lys, farger og fest',om:'Høytider og merkedager',bilde:'holi.webp'},
    {id:'tema4-ritualer',tittel:'Puja og livets ritualer',om:'Ritualer og livsfaser',bilde:'puja.webp'},
    {id:'tema5-steder',tittel:'Tempelet og de hellige stedene',om:'Hellige steder og bygg',bilde:'tempeltarn.webp'},
    {id:'tema6-etikk',tittel:'Dharma, karma og ikke-vold',om:'Etikk og levesett',bilde:'namaste.webp'},
    {id:'tema7-norge',tittel:'Mange guder, mange veier',om:'Guder, retninger og hinduer i Norge',bilde:'ganesha.webp'}
  ]},
  buddhismen:{navn:'Buddhismen',type:'religionen',hoved:'../presentasjon.html?p=buddhismen/hoved',bilde:'tittel-buddha.webp',
    verktoy:{oppgaver:'symboler.webp',historier:'haren.webp',quiz:'hjulet.webp'},tema:[
    {id:'tema1-historie',tittel:'Prinsen som våknet',om:'Opprinnelse og historie',bilde:'palasset.webp'},
    {id:'tema2-laeren',tittel:'Læren og tekstene',om:'Hellige tekster og troslære',bilde:'kurvene.webp'},
    {id:'tema3-hoytider',tittel:'Fullmåne og fest',om:'Høytider og merkedager',bilde:'vesak.webp'},
    {id:'tema4-ritualer',tittel:'Meditasjon og klosterliv',om:'Ritualer og livsfaser',bilde:'meditasjon.webp'},
    {id:'tema5-steder',tittel:'Templer, stupaer og hellige steder',om:'Hellige steder og bygg',bilde:'stupa.webp'},
    {id:'tema6-etikk',tittel:'Medfølelse og middelvei',om:'Etikk og levesett',bilde:'fuglen.webp'},
    {id:'tema7-norge',tittel:'Tre retninger og buddhismen i Norge',om:'Retninger og buddhister i Norge',bilde:'veien.webp'}
  ]},
  humanismen:{navn:'Humanismen',type:'livssynet',hoved:'../presentasjon.html?p=humanismen/hoved',bilde:'tittel-stjerner.webp',
    verktoy:{oppgaver:'symboler.webp',historier:'kikkerten.webp',quiz:'vekta.webp'},tema:[
    {id:'tema1-historie',tittel:'Fra antikken til i dag',om:'Opprinnelse og historie',bilde:'agora.webp'},
    {id:'tema2-tanker',tittel:'Tanker uten hellig tekst',om:'Fornuft, vitenskap og menneskerettigheter',bilde:'biblioteket.webp'},
    {id:'tema3-merkedager',tittel:'Merkedager uten helligdager',om:'Merkedager og feiringer',bilde:'midtsommer.webp'},
    {id:'tema4-seremonier',tittel:'Seremonier gjennom livet',om:'Seremonier og livsfaser',bilde:'konfirmasjon.webp'},
    {id:'tema5-steder',tittel:'Steder og symboler',om:'Steder, rom og symboler',bilde:'kulturhus.webp'},
    {id:'tema6-etikk',tittel:'Menneskeverd og ansvar',om:'Etikk og levesett',bilde:'paraplyen.webp'},
    {id:'tema7-norge',tittel:'Humanister i Norge og verden',om:'Mangfold og humanismen i Norge',bilde:'benken.webp'}
  ]},
  menneskerettigheter:{navn:'Menneskerettigheter',type:'modulen',bilde:'tittel-hender.webp',
    verktoy:{oppgaver:'kortene.webp',historier:'sloret.webp',quiz:'vekta.webp'},tema:[
    {id:'tema1-rettigheter',tittel:'Hva er en rettighet?',om:'Menneskerettigheter og barns rettigheter',bilde:'erklaeringen.webp'},
    {id:'tema2-ytringsfrihet',tittel:'Retten til å si det du mener',om:'Ytringsfrihet og grensene for den',bilde:'talerstol.webp'},
    {id:'tema3-religionsfrihet',tittel:'Frihet til å tro',om:'Religionsfrihet før og nå',bilde:'gudshus.webp'},
    {id:'tema4-minoriteter',tittel:'Å være få blant mange',om:'Religiøse minoriteter i Norge',bilde:'klasserom.webp'}
  ]},
  filosofi:{navn:'Filosofi',type:'modulen',bilde:'tittel-stjerner.webp',
    verktoy:{oppgaver:'samtalering.webp',historier:'hulen.webp',quiz:'dorene.webp'},tema:[
    {id:'tema1-sporre',tittel:'Kunsten å spørre',om:'Undring og filosofiske spørsmål',bilde:'undring.webp'},
    {id:'tema2-begrunne',tittel:'Kunsten å begrunne',om:'Påstander, grunner og tankefeller',bilde:'pilarene.webp'},
    {id:'tema3-tankeeksperiment',tittel:'Tenk deg at …',om:'Tankeeksperimenter',bilde:'skipet.webp'},
    {id:'tema4-etikk',tittel:'Tre briller for rett og galt',om:'Etiske tenkemåter og dilemmaer',bilde:'sporvogna.webp'}
  ]},
  livssporsmal:{navn:'De store spørsmålene',type:'modulen',bilde:'tittel-speil.webp',
    verktoy:{oppgaver:'roller.webp',historier:'gilgamesj.webp',quiz:'fingeravtrykk.webp'},tema:[
    {id:'tema1-hvem',tittel:'Hvem er jeg?',om:'Identitet og tilhørighet',bilde:'speilet.webp'},
    {id:'tema2-godtliv',tittel:'Hva er et godt liv?',om:'Lykke, levekår og hva som er nok',bilde:'bordet.webp'},
    {id:'tema3-livogdod',tittel:'Liv og død',om:'Det ingen vet sikkert',bilde:'skogbunnen.webp'},
    {id:'tema4-kloden',tittel:'Framtida og kloden',om:'Levesett, ressurser og ansvar',bilde:'jordoppgang.webp'}
  ]}
};
