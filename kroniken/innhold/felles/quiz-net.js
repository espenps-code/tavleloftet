/* Krøniken – nettlaget til quizspillet.
   KQNet(kode) gir { demo, set, update, remove, get, on }. Alle stier er relative til quiz/<KODE>.
   Vanlig drift: Firebase Realtime Database. Testmodus (?demo=1 eller uten Firebase-oppsett):
   alt går mellom faner i samme nettleser, og ingenting sendes ut av maskinen. */
(function(){
const FB_VER='10.12.2';
const last=src=>new Promise((ok,feil)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=()=>feil(new Error('Kunne ikke laste '+src));document.head.append(s);});
function lokal(kode){
  /* Hver fane har sin egen kopi av spillet og sender endringene til de andre fanene.
     En ny fane ber om hele tilstanden fra dem som allerede er med. */
  const K='kq-'+kode,L=[];let bc=null,minne={},synket=false;try{bc=new BroadcastChannel(K);}catch(e){}
  try{minne=JSON.parse(sessionStorage.getItem(K)||'{}');}catch(e){}
  const husk=()=>{try{sessionStorage.setItem(K,JSON.stringify(minne));}catch(e){}};
  const hent=(o,p)=>p?p.split('/').reduce((a,k)=>a==null?a:a[k],o):o;
  const varsle=p=>{L.slice().forEach(l=>{if(!p||!l.p||l.p===p||l.p.startsWith(p+'/')||p.startsWith(l.p+'/')){const v=hent(minne,l.p);l.cb(v===undefined?null:v);}});};
  const skriv=(p,v)=>{if(!p){minne=v||{};}else{const ks=p.split('/');let a=minne;ks.slice(0,-1).forEach(k=>{a=a[k]=(a[k]&&typeof a[k]==='object')?a[k]:{};});if(v==null)delete a[ks[ks.length-1]];else a[ks[ks.length-1]]=v;}husk();};
  let klarOk;const klar=new Promise(ok=>klarOk=ok);
  if(bc){bc.onmessage=e=>{const d=e.data;
      if(d.sync){if(Object.keys(minne).length)bc.postMessage({hel:minne});return;}
      if(d.hel){if(!synket){synket=true;minne=d.hel;husk();varsle('');klarOk();}return;}
      d.ops.forEach(o=>skriv(o[0],o[1]));varsle(d.p);};
    bc.postMessage({sync:1});setTimeout(()=>{synket=true;klarOk();},400);}else klarOk();
  const send=(p,ops)=>{varsle(p);if(bc)bc.postMessage({p,ops});};
  return{demo:true,
    set:async(p,v)=>{skriv(p,v);send(p,[[p,v]]);},
    update:async(p,o)=>{const ops=Object.entries(o).map(([k,v])=>[p?p+'/'+k:k,v]);ops.forEach(x=>skriv(x[0],x[1]));send(p,ops);},
    remove:async p=>{skriv(p,null);send(p,[[p,null]]);},
    get:async p=>{await klar;const v=hent(minne,p);return v===undefined?null:v;},
    on:(p,cb)=>{const l={p,cb};L.push(l);klar.then(()=>{const v=hent(minne,p);cb(v===undefined?null:v);});return()=>{const i=L.indexOf(l);if(i>=0)L.splice(i,1);};}};
}
window.KQNet=async function(kode){
  const cfg=window.TAVLELOFTET_FIREBASE;
  if(new URLSearchParams(location.search).has('demo')||!cfg)return lokal(kode);
  try{if(!window.firebase||!firebase.database){await last(`https://www.gstatic.com/firebasejs/${FB_VER}/firebase-app-compat.js`);await last(`https://www.gstatic.com/firebasejs/${FB_VER}/firebase-database-compat.js`);}}
  catch(e){return lokal(kode);}   /* uten nett: testmodus, og siden viser den gule stripa */
  if(!firebase.apps.length)firebase.initializeApp(cfg);
  const db=firebase.database(),R=p=>db.ref('quiz/'+kode+(p?'/'+p:''));
  return{demo:false,
    set:(p,v)=>R(p).set(v),update:(p,o)=>R(p).update(o),remove:p=>R(p).remove(),
    get:p=>R(p).get().then(s=>s.val()),
    on:(p,cb)=>{const r=R(p),h=s=>cb(s.val());r.on('value',h);return()=>r.off('value',h);}};
};
window.KQ_TEGN='ABDEFGHJKLMNPRSTUVXYZ';
window.KQ_FARGE=i=>`hsl(${Math.round(i*137.508)%360} 72% 62%)`;
window.KQ_SVAR=[{f:'#e98554',t:'A'},{f:'#5fb0d9',t:'B'},{f:'#f3d27a',t:'C'},{f:'#8fd0a8',t:'D'}];
/* Dyrene i kallenavnene («Rask Rev») og figuren som hører til. */
window.KQ_DYR={Rev:'🦊',Ugle:'🦉',Elg:'🦌',Bjørn:'🐻',Ulv:'🐺',Hare:'🐰',Ekorn:'🐿️',Oter:'🦦',Sel:'🦭',Hval:'🐳',Ørn:'🦅',Svane:'🦢',Pinnsvin:'🦔',Frosk:'🐸',Laks:'🐟',Gaupe:'🐱',Bever:'🦫',Krabbe:'🦀',Humle:'🐝',Sommerfugl:'🦋',Skilpadde:'🐢',Delfin:'🐬',Pingvin:'🐧',Mus:'🐭'};
window.KQ_IKON=n=>KQ_DYR[String(n||'').split(' ').pop()]||'⭐';
})();
