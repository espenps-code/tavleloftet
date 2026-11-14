/* Krøniken – kortene i øvespillet Samleren. Brukes av både tavla (spill.html) og eleven (spill-med.html),
   så kort nr. 3 er det samme begge steder.
   Kortene er fagordene (begreper) fra de valgte delene. Står samme fagord i to deler, blir det ett kort.
   Hvert kort eleven trekker, har i tillegg ett av seks symboler i hjørnet. Symbolet er tilfeldig og har ikke noe med fagordet å gjøre.
   Tre like symboler kan byttes inn i en bonus. Symbolene er bevisst nøytrale (ingen religiøse tegn).
   KSamler.bygg(lister) – lister[d] er begrepene i del nr. d: [[fagord, forklaring], …] – gir kortene. */
(function(){
function bygg(lister){const kort=[];lister.forEach(l=>(l||[]).forEach(b=>{if(!kort.some(k=>k[0]===b[0]))kort.push(b);}));return kort;}
const S=(n,flertall,f,d)=>({n,flertall,f,svg:`<svg class="sym" viewBox="0 0 24 24" style="color:${f}" fill="currentColor" role="img" aria-label="${n}">${d}</svg>`});
const SYMBOLER=[
  S('sol','soler','#f3c64a','<circle cx="12" cy="12" r="4.6"/><path d="M12 1.8v3.2M12 19v3.2M1.8 12H5M19 12h3.2M4.8 4.8l2.2 2.2M17 17l2.2 2.2M4.8 19.2 7 17M17 7l2.2-2.2" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" fill="none"/>'),
  S('blad','blader','#6fc48a','<path d="M4.5 19.5C3.5 10 9 3.8 20.2 3.8c0 11.2-6.2 16.7-15.7 15.7z"/><path d="M4.5 19.5 14 10" stroke="#16211f" stroke-width="1.6" fill="none" stroke-linecap="round"/>'),
  S('dråpe','dråper','#5fb0d9','<path d="M12 2.5c4.2 5 6.8 8.3 6.8 11.9a6.8 6.8 0 0 1-13.6 0c0-3.6 2.6-6.9 6.8-11.9z"/>'),
  S('fjell','fjell','#b497e8','<path d="M1.5 20.5 8.8 6.5l4.1 7.3 2.7-4.3 6.9 11z"/>'),
  S('nøkkel','nøkler','#e98554','<circle cx="8" cy="8" r="4.3" fill="none" stroke="currentColor" stroke-width="3"/><path d="M11.3 11.3 20.5 20.5M16.2 16.2l3-3" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"/>'),
  S('lyn','lyn','#ee7d9b','<path d="M13.8 1.8 4.8 13.6h5.6L8.8 22.2l10-12.3h-5.9z"/>')];
/* Poeng: utgaven av kortet, pluss bonus for å bytte inn tre like symboler og for fullt album. */
window.KSamler={bygg,SYMBOLER,UTG:[{n:'bronse',p:1,f:'#c98a5a'},{n:'sølv',p:3,f:'#cfd8dc'},{n:'gull',p:6,f:'#f3d27a'}],BYTTEBONUS:10,ALBUMBONUS:20};
})();
