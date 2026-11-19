/* Krøniken – bygger en presentasjon fra en innholdsfil (window.PRES).
   Lysbildetyper: tittel, punkter, kort, snu, sitat, snakk, tidslinje, pastand, tall, sjekk, begreper, utbillett.
   Tekstmerking i innholdet: [[ord]] = fagord, **ord** = uthevet. */
(function(){
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const fmt=s=>esc(s).replace(/\[\[(.+?)\]\]/g,'<span class="term">$1</span>').replace(/\*\*(.+?)\*\*/g,'<b>$1</b>');
const TR=['zoom','left','up','iris','curtain','fade'];
const kick=(s)=>s.kicker?`<p class="kicker a">${fmt(s.kicker)}</p>`:'';
/* Bevegelse i klassen: «Myte eller fakta?» = reis deg / bli sittende, «Sant eller usant?» = tommel opp / ned.
   Lysbilder som allerede har en egen instruks i kickeren («Stå opp …», «Still deg …») får ikke banner. */
const erMyte=s=>/myte|fakta/i.test((s.kicker||'')+' '+(s.tittel||''));
const tommel=ned=>`<svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${ned?' style="transform:rotate(180deg)"':''}><path d="M7 10v11H3.5V10z"/><path d="M7 10l4-7c1.6 0 2.6 1.2 2.3 2.8L12.6 9H19a2 2 0 0 1 2 2.3l-1.3 7.6A2.4 2.4 0 0 1 17.3 21H7"/></svg>`;
const reis=opp=>`<svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${opp?'<circle cx="12" cy="3.8" r="2"/><path d="M12 6.5v8M12 8.5 8 12M12 8.5l4 3.5M12 14.5 9.5 21.5M12 14.5l2.5 7"/>':'<circle cx="10" cy="4" r="2"/><path d="M10 6.5v6.5h6l1 8M10 9l-3.5 3M4 13h4M5 13v8.5M16 13v8.5"/>'}</svg>`;
const aktiv=s=>{if(/stå opp|reis deg|still deg/i.test(s.kicker||''))return '';
  if(erMyte(s))return `<div class="aktiv a" style="--d:.3"><span class="ja">${reis(1)}<b>Reis deg</b> hvis du tror det er fakta</span><span class="nei">${reis(0)}<b>Bli sittende</b> hvis du tror det er en myte</span></div>`;
  if(/sant eller usant/i.test(s.tittel||''))return `<div class="aktiv a" style="--d:.3"><span class="ja">${tommel(0)}<b>Tommel opp</b> = sant</span><span class="nei">${tommel(1)}<b>Tommel ned</b> = usant</span></div>`;
  return '';};
const notes=s=>s.n?`<aside class="notes">${[].concat(s.n).map(x=>`<p>${fmt(x)}</p>`).join('')}</aside>`:'';
const plate=(b,w,h,rot)=>b?`<div class="plate a fx-blur" style="--d:.2;--rot:${rot||-2}deg;width:${w}px;height:${h}px"><img src="${PRES.mappe}bilder/${b.fil}" alt="${esc(b.alt||'')}"></div>`:'';
const T={
 tittel:s=>`<div class="row" style="flex:1;align-items:center;gap:70px"><div class="grow"><p class="kicker a">${fmt(s.kicker||PRES.livssyn+' · Tema '+PRES.nr)}</p><h1 class="a fx-blur" style="--d:.3;font-size:${s.tittel.length>22?84:104}px">${fmt(s.tittel)}</h1><p class="lead a" style="--d:.9;margin-top:26px">${fmt(s.ingress||'')}</p></div>${plate(s.bilde,480,620,2)}</div>`,
 punkter:s=>{const p=`<div class="grow">${kick(s)}<h2 class="a" style="--d:.2">${fmt(s.tittel)}</h2><ul class="clean">${s.punkter.map(x=>`<li class="s fx-${s.bilde&&!s.hoyre?'l':'r'}">${fmt(x)}</li>`).join('')}</ul></div>`;
   const b=plate(s.bilde,440,570,s.hoyre?2:-2);return `<div class="row" style="flex:1;align-items:center;gap:70px">${s.hoyre?p+b:b+p}</div>`;},
 kort:s=>{const k=s.kol||(s.kort.length===4?2:Math.min(3,s.kort.length));return `${kick(s)}<h2 class="a" style="--d:.2">${fmt(s.tittel)}</h2><div style="display:grid;grid-template-columns:repeat(${k},1fr);gap:26px;flex:1;align-content:center" class="kortg k${k}">${s.kort.map(c=>`<div class="card s fx-up"><h3>${fmt(c.t)}</h3><p>${fmt(c.p)}</p></div>`).join('')}</div>`;},
 snu:s=>{const k=s.kol||(s.kort.length===4?4:3),tett=s.bak&&s.kort.length>6,h=s.h||(tett?190:s.kort.length>4?250:400);return `${kick(s)}<h2 class="a" style="--d:.2">${fmt(s.tittel)}</h2>${erMyte(s)?aktiv(s):''}<div class="a" style="--d:.4;display:grid;grid-template-columns:repeat(${k},1fr);gap:${tett?18:24}px;flex:1;align-content:center">${s.kort.map(c=>`<div class="flip" style="height:${h}px"><div class="in"><div class="fr"><h3 style="font-size:${c.t.length>14?36:44}px${tett?';margin-bottom:22px':''}">${fmt(c.t)}</h3><span class="hint">Trykk for å snu</span></div><div class="bk${s.bak||c.v?' bkb':''}${tett?' tett':''}${c.v?(c.v==='Fakta'?' bk-fakta':' bk-myte'):''}">${c.v?`<h3 class="bkt">${c.v}</h3>`:s.bak?`<h3 class="bkt">${fmt(c.t)}</h3>`:''}<p style="font-size:${tett?(c.p.length>62?24:27):s.bak?(c.p.length>75?27:30):k===4?27:30}px">${fmt(c.p)}</p></div></div></div>`).join('')}</div>`;},
 sitat:s=>`<p class="kicker a">${fmt(s.kicker||'')}</p><p class="a fx-blur" style="--d:.4;font-family:var(--f-head);font-weight:600;font-size:${s.tekst.length>90?58:72}px;line-height:1.2;max-width:1300px">«${fmt(s.tekst)}»</p>${s.kilde?`<p class="a muted" style="--d:.9;margin-top:18px;font-size:26px">${fmt(s.kilde)}</p>`:''}${(s.forklaring?[].concat(s.forklaring):[]).map(f=>`<p class="lead s" style="margin-top:34px">${fmt(f)}</p>`).join('')}`,
 snakk:s=>`<p class="pill a">${fmt(s.merke||'Snakk sammen')}</p><h2 class="a" style="--d:.2;margin:30px 0 20px;max-width:1250px">${fmt(s.sporsmal)}</h2><p class="lead muted a" style="--d:.5">${fmt(s.hjelp||'')}</p><div class="timer a" style="--d:.8;margin-top:50px" data-sec="${s.sek||120}"></div>`,
 tidslinje:s=>{const n=s.punkter.length,dx=1080/(n-1);return `${kick(s)}<h2 class="a" style="--d:.2;margin-bottom:0">${fmt(s.tittel)}</h2><svg class="tl" viewBox="0 0 1380 600" style="width:100%;flex:1"><path class="draw a" style="--len:1300;--d:.4;stroke:var(--a)" d="M40 300 H1340" fill="none" stroke-width="8" stroke-linecap="round"/>${s.punkter.map((p,i)=>{const x=150+i*dx,opp=i%2===0,l=[].concat(p.tekst);
   return `<g class="s fx-pop"><circle cx="${x}" cy="300" r="18" fill="var(--a2)"/><text class="yr" x="${x}" y="${opp?238:372}" text-anchor="middle">${esc(p.aar)}</text>${l.map((t,j)=>`<text class="tx" x="${x}" y="${opp?190-(l.length-1-j)*32:412+j*32}" text-anchor="middle">${esc(t)}</text>`).join('')}</g>`;}).join('')}</svg>`;},
 pastand:s=>erMyte(s)?T.snu({kicker:s.kicker,tittel:/sant eller usant/i.test(s.tittel||'')||!s.tittel?'Fakta eller myte?':s.tittel,kol:s.pastander.length===4?2:Math.min(3,s.pastander.length),h:s.pastander.length>3?250:330,kort:s.pastander.map(p=>({t:p.t,v:p.sant?'Fakta':'Myte',p:p.f||''}))}):`${kick(s)}<h2 class="a" style="--d:.2">${fmt(s.tittel||'Sant eller usant?')}</h2>${aktiv(s)}<div class="a nostep" style="--d:.4;display:flex;flex-direction:column;gap:18px;flex:1;justify-content:center">${s.pastander.map(p=>`<button class="pst" data-s="${p.sant?1:0}"><span class="pt">${fmt(p.t)}</span><span class="pf"><b>${erMyte(s)?(p.sant?'Fakta':'Myte'):(p.sant?'Sant':'Usant')}</b> ${fmt(p.f||'')}</span></button>`).join('')}</div>`,
 tall:s=>`${kick(s)}<h2 class="a" style="--d:.2">${fmt(s.tittel)}</h2><div class="grid3" style="flex:1;align-content:center">${s.kort.map(c=>`<div class="card s fx-up"><p class="tall">${fmt(c.tall)}</p><h3 style="margin-top:14px">${fmt(c.t)}</h3><p>${fmt(c.p)}</p></div>`).join('')}</div>${s.kilde?`<p class="foot a" style="--d:1">${fmt(s.kilde)}</p>`:''}`,
 sjekk:s=>`<p class="kicker a">Sjekk deg selv</p><h2 class="a sjQ" style="--d:.2">Hva husker du?</h2><div class="a nostep sjA" style="--d:.4;display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:20px"></div><div class="nostep" style="margin-top:28px;display:flex;align-items:center;gap:26px;min-height:64px"><button class="neste sjN" hidden>Neste spørsmål</button><p class="sjF" style="font-size:28px" aria-live="polite"></p></div>`,
 begreper:s=>T.snu({kicker:'Skriv ned i boka',tittel:'Begreper å ta med',kol:3,bak:1,kort:PRES.begreper.map(b=>({t:b[0],p:b[1]}))}),
 utbillett:s=>`<p class="pill a">Før du går</p><h2 class="a" style="--d:.2;margin:30px 0 40px">Ut-billett</h2><div class="grid2" style="width:1200px;text-align:left"><div class="card s fx-up"><div class="q"><b>1</b><p>${fmt(s.a||'Én ting du lærte i dag.')}</p></div></div><div class="card s fx-up"><div class="q"><b>2</b><p>${fmt(s.b||'Én ting du lurer på eller vil vite mer om.')}</p></div></div></div>`
};
const SENTRERT={sitat:1,snakk:1,utbillett:1};
const STD={sjekk:'Fem tilfeldige spørsmål fra quizen til denne presentasjonen. La klassen stemme før du trykker på svaret. Nye spørsmål hver gang lysbildet åpnes.',
  begreper:'Elevene skriver begrepet og forklarer det med egne ord før kortet snus. På baksiden står begrepet sammen med forklaringen, så når alle kortene er snudd, kan elevene skrive rett av fra tavla. Begrepene kommer igjen i oppgavesettet og i quizen.',
  utbillett:'Elevene skriver på en lapp eller i boka og leverer på vei ut.'};
window.KRONIKEN_BYGG=function(stage){
  document.title=PRES.tittel+' – '+PRES.livssyn+' · Krøniken';
  stage.innerHTML=PRES.lysbilder.map((s,i)=>{if(!T[s.type])throw new Error('Ukjent lysbildetype: '+s.type);
    const tt=s.type==='begreper'?'Begreper':s.type==='sjekk'?'Sjekk: hva husker du?':s.type==='utbillett'?'Ut-billett':(s.tittel||s.sporsmal||s.kicker||s.type);
    return `<section class="slide${SENTRERT[s.type]?' center':''}" data-tr="${i?TR[(i-1)%TR.length]:'fade'}" data-title="${esc(tt).replace(/"/g,'&quot;').replace(/\[\[|\]\]|\*\*/g,'')}"${s.type==='sjekk'?' data-init="sjekk"':s.type==='pastand'?' data-init="pastand"':''}>${T[s.type](s)}${notes(s.n?s:{n:STD[s.type]})}</section>`;}).join('');
  const I=window.SLIDE_INIT=window.SLIDE_INIT||{};
  /* Påstander */
  stage.querySelectorAll('.pst').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();b.classList.add('vist',b.dataset.s==='1'?'sant':'usant');}));
  I.pastand=el=>el.querySelectorAll('.pst').forEach(b=>b.classList.remove('vist','sant','usant'));
  /* Sjekk deg selv – 5 tilfeldige fra quizen */
  I.sjekk=el=>{const Q=el.querySelector('.sjQ'),A=el.querySelector('.sjA'),N=el.querySelector('.sjN'),F=el.querySelector('.sjF');
    const stokk=l=>l.map(x=>[Math.random(),x]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]);
    const sp=stokk(PRES.quiz).slice(0,5).map(q=>{const a=stokk(q.a.map((t,k)=>[t,k===q.r]));return{q:q.q,a:a.map(x=>x[0]),r:a.findIndex(x=>x[1])};});let i=0,r=0;
    const vis=()=>{if(i>=sp.length){Q.textContent=`Ferdig! ${r} av ${sp.length} riktige`;A.innerHTML='';F.textContent='';N.textContent='Fem nye spørsmål';N.hidden=false;return;}
      const q=sp[i];Q.textContent=q.q;F.textContent=`Spørsmål ${i+1} av ${sp.length}`;N.hidden=true;N.textContent=i===sp.length-1?'Se resultatet':'Neste spørsmål';A.innerHTML='';
      q.a.forEach((s,j)=>{const b=document.createElement('button');b.className='svar';b.textContent=s;b.onclick=e=>{e.stopPropagation();
        [...A.children].forEach((x,k)=>{x.disabled=true;if(k===q.r)x.classList.add('rett');});
        if(j===q.r){r++;F.textContent='Riktig!';}else{b.classList.add('feil');F.textContent='Ikke helt. Riktig svar er markert med grønt.';}N.hidden=false;};A.appendChild(b);});};
    N.onclick=e=>{e.stopPropagation();if(i>=sp.length)I.sjekk(el);else{i++;vis();}};vis();};
};
})();
