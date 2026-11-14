/* Krøniken – kortene i øvespillet Samleren. Brukes av både tavla (spill.html) og eleven (spill-med.html),
   så kort nr. 3 og gruppe nr. 2 er de samme begge steder.
   Kortene er fagordene (begreper) fra de valgte delene. Hver del er en gruppe. Står samme fagord i to deler, hører det til den første.
   Er bare én del valgt, deles kortene i to grupper, så det alltid er grupper å samle på.
   KSamler.bygg(ls, ids, lister) – lister[d] er begrepene i del nr. d: [[fagord, forklaring], …]
   gir {kort:[[fagord,forklaring]], grupper:[{n,f,k:[kortnr]}], gAv:[gruppenr per kort]} */
(function(){
const FARGER=['#e98554','#5fb0d9','#f3d27a','#8fd0a8','#b497e8','#ee7d6b','#7fcfc0','#d9a441'];
function bygg(ls,ids,lister){
  const tema=((window.KRONIKEN||{})[ls]||{}).tema||[],kort=[];let grupper=[];
  ids.forEach((id,d)=>{const t=tema.find(x=>x.id===id),g={n:t?t.tittel:'Del '+(d+1),k:[]};
    (lister[d]||[]).forEach(b=>{if(!kort.some(k=>k[0]===b[0])){g.k.push(kort.length);kort.push(b);}});
    if(g.k.length)grupper.push(g);});
  if(grupper.length===1&&grupper[0].k.length>=6){
    const alle=grupper[0].k,ant=Math.round(alle.length/3),st=Math.ceil(alle.length/ant);grupper=[];
    for(let i=0;i<ant;i++)grupper.push({n:'Gruppe '+'ABCDEFGH'[i],k:alle.slice(i*st,(i+1)*st)});
    grupper=grupper.filter(g=>g.k.length);}
  const gAv=[];grupper.forEach((g,i)=>{g.f=FARGER[i%FARGER.length];g.k.forEach(k=>gAv[k]=i);});
  return{kort,grupper,gAv};
}
/* Poeng: utgaven av kortet, pluss bonus for en komplett gruppe og for hele albumet. */
window.KSamler={bygg,UTG:[{n:'bronse',p:1,f:'#c98a5a'},{n:'sølv',p:3,f:'#cfd8dc'},{n:'gull',p:6,f:'#f3d27a'}],GRUPPEBONUS:15,ALBUMBONUS:20};
})();
