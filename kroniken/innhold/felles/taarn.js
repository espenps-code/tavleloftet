/* Krøniken – tårnene i øvespillet Tårnet. Brukes av både tavla (spill.html) og eleven (spill-med.html).
   Et tårn er stablet av moduler: en bunn med dør, etasjer (vindu, balkong eller klokke) og et tak.
   Usikrede etasjer vises som stillas. Veggen er ett bilde (laget i Higgsfield); steinsorten lages med fargefilter,
   og balkong, klokke og tak er tegnet i kode, så de passer til alle steinsortene.
   KTaarn.tegn(stil, etasjer, usikret, tak) gir HTML. etasjer er en tekst med én bokstav per sikret etasje: v, b eller u. */
(function(){
const rot=(document.currentScript&&document.currentScript.src||'').replace(/taarn\.js.*$/,'')+'taarn/';
const STILER=[
  {n:'Sandstein',f:'none',tak:'#c9603c',tak2:'#a84a2c'},
  {n:'Granitt',f:'grayscale(.9) brightness(.98) contrast(1.08)',tak:'#4f6f8f',tak2:'#3c5672'},
  {n:'Rød sandstein',f:'sepia(.55) hue-rotate(-30deg) saturate(1.9) brightness(.9)',tak:'#3f6b5d',tak2:'#2f5246'},
  {n:'Skifer',f:'grayscale(.75) brightness(.6) contrast(1.25)',tak:'#b9892f',tak2:'#946b20'}];
const MODULER={v:{n:'Vindu'},b:{n:'Balkong'},u:{n:'Klokke'}};
/* Tegningene ligger oppå veggbildet. viewBox er 172 x 96, samme form som bildet. */
const BALKONG='<svg viewBox="0 0 172 96" preserveAspectRatio="none" aria-hidden="true"><rect x="52" y="74" width="68" height="7" rx="1.5" fill="#3b2a20"/><rect x="54" y="52" width="64" height="4" rx="1.5" fill="#3b2a20"/>'+[58,66,74,82,90,98,106,114].map(x=>`<rect x="${x-1.5}" y="55" width="3" height="20" fill="#5a4030"/>`).join('')+'</svg>';
const KLOKKE='<svg viewBox="0 0 172 96" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><circle cx="86" cy="48" r="33" fill="#3b2a20"/><circle cx="86" cy="48" r="28" fill="#fbf5ea"/>'+[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>{const a=i*Math.PI/6;return `<circle cx="${(86+23*Math.sin(a)).toFixed(1)}" cy="${(48-23*Math.cos(a)).toFixed(1)}" r="${i%3?1.3:2.4}" fill="#3b2a20"/>`;}).join('')+'<path d="M86 48V29M86 48l12 7" stroke="#16211f" stroke-width="3.4" stroke-linecap="round" fill="none"/><circle cx="86" cy="48" r="3" fill="#c9603c"/></svg>';
function tak(s){return `<svg class="tak" viewBox="0 0 172 84" preserveAspectRatio="none" aria-hidden="true"><path d="M86 6v16" stroke="#3b2a20" stroke-width="2.5"/><path d="M86 6l18 5-18 5z" fill="#fbf5ea" stroke="#3b2a20" stroke-width="1.2"/><path d="M-4 84L86 20l90 64z" fill="${s.tak}"/>${[36,52,68].map(y=>`<path d="M${86-(y-20)*1.406} ${y}H${86+(y-20)*1.406}" stroke="${s.tak2}" stroke-width="3"/>`).join('')}<path d="M-4 84L86 20l90 64" fill="none" stroke="#3b2a20" stroke-width="3" stroke-linejoin="round"/></svg>`;}
function tegn(stil,etasjer,usikret,medTak,utenBunn){   /* utenBunn: et utsnitt midt i tårnet, uten døretasjen */
  const s=STILER[stil]||STILER[0];etasjer=String(etasjer||'').replace(/[^vbu]/g,'');usikret=Math.max(0,+usikret||0);
  let h='';
  if(usikret)h+='<i class="stillas"></i>'.repeat(Math.min(usikret,200));
  if(medTak&&!usikret&&etasjer.length)h+=tak(s);
  for(let i=etasjer.length-1;i>=0;i--){const m=etasjer[i];
    h+=`<i class="et" style="background-image:url('${rot}stein-${i===0&&!utenBunn?'bunn':'etasje'}.webp')">${i===0&&!utenBunn?'':m==='b'?BALKONG:m==='u'?KLOKKE:''}</i>`;}
  return `<div class="trn" style="--tf:${s.f}">${h}</div>`;
}
window.KTaarn={STILER,MODULER,tegn,BILDE_ASP:288/516,SVG:{b:BALKONG,u:KLOKKE},rot};   /* SVG og rot brukes av 3D-byen (by3d.js) */
})();
