/* Krøniken – 3D-byen i øvespillet Tårnet (tavla). Trenger three.min.js og taarn.js.
   Hver elev har sin egen tomt i et rutenett. Ledige tomter er parker. Mellom tomtene går det veier med små biler.
   Tårnene bygges av de samme modulene som den flate visningen: steinsort, vindu, balkong, klokke, tak og stillas.

   const by=await KBy.lag(boks,{antall:25});   // boks = et element med fast høyde
   by.oppdater([{id,navn,farge,stil,etasjer:'vvbu',usikret:2}]);   // kalles hver gang noe endrer seg
   by.ras(id);    // stillaset raser
   by.stopp();    // rydder opp
   KBy.kan() sier om nettleseren klarer 3D. Hvis ikke brukes den flate visningen. */
(function(){
const T=()=>window.THREE;
const TOMT=12,VEI=4.5,P=TOMT+VEI,TB=6,EH=2.3;   /* tomt, veibredde, avstand mellom tomter, tårnbredde, etasjehøyde */
function kan(){try{const c=document.createElement('canvas');return !!(window.THREE&&(c.getContext('webgl2')||c.getContext('webgl')));}catch(e){return false;}}
/* Tilfeldige tall som blir like hver gang for samme frø, så parkene ikke hopper rundt. */
function frø(n){let s=n*9301+49297;return()=>{s=(s*9301+49297)%233280;return s/233280;};}
const bilde=src=>new Promise(ok=>{const im=new Image();im.onload=()=>ok(im);im.onerror=()=>ok(null);im.src=src;});

/* Veggene: samme bilder, fargefilter og tegninger som i taarn.js, lagt på et lerret per steinsort og modul. */
async function teksturer(){
  const THREE=T(),K=window.KTaarn,ut=[];
  const [etasje,bunn]=await Promise.all([bilde(K.rot+'stein-etasje.webp'),bilde(K.rot+'stein-bunn.webp')]);
  const svg=async s=>bilde('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s.replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" width="516" height="288" ')));
  const tegning={b:await svg(K.SVG.b),u:await svg(K.SVG.u)};
  K.STILER.forEach((st,i)=>{ut[i]={};
    ['v','b','u','bunn'].forEach(m=>{const c=document.createElement('canvas');c.width=512;c.height=288;const x=c.getContext('2d');
      x.fillStyle='#b9a27a';x.fillRect(0,0,512,288);
      try{x.filter=st.f;}catch(e){}
      const im=m==='bunn'?bunn:etasje;if(im)x.drawImage(im,0,0,512,288);
      if(tegning[m])x.drawImage(tegning[m],0,0,512,288);
      x.filter='none';
      const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;
      /* sidene får bildet, toppen og bunnen en mørk flate */
      const side=new THREE.MeshLambertMaterial({map:t}),flat=new THREE.MeshLambertMaterial({color:new THREE.Color(0x4a4038).convertSRGBToLinear()});
      ut[i][m]=[side,side,flat,flat,side,side];});});
  return ut;
}

async function lag(boks,valg){
  const THREE=T(),K=window.KTaarn;valg=valg||{};
  const rolig=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
  const N=Math.max(3,Math.min(7,Math.ceil(Math.sqrt(Math.max(9,(valg.antall||0)+2)))));
  const halv=(N*P+VEI)/2,sted=(i,j)=>[(i-(N-1)/2)*P,(j-(N-1)/2)*P];
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));renderer.outputEncoding=THREE.sRGBEncoding;
  boks.innerHTML='';boks.appendChild(renderer.domElement);renderer.domElement.style.cssText='display:block;width:100%;height:100%;border-radius:14px';
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0x1a2b2a,halv*3.5,halv*8);
  const kamera=new THREE.PerspectiveCamera(34,1,1,2000);
  scene.add(new THREE.HemisphereLight(0xfff4dc,0x3a5a55,.9));
  const sol=new THREE.DirectionalLight(0xffe9c8,1.1);sol.position.set(60,110,40);scene.add(sol);
  const farge=f=>new THREE.Color(f).convertSRGBToLinear();   /* fargene er skrevet som på skjermen */
  const mat=(f,flat)=>flat?new THREE.MeshPhongMaterial({color:farge(f),flatShading:true,shininess:0}):new THREE.MeshLambertMaterial({color:farge(f)});
  const M={bakke:mat(0x21403a),vei:mat(0x2b3338),stripe:mat(0xd9cfa8),fortau:mat(0x8f9a94),gress:mat(0x4f9a63),gress2:mat(0x5fae6f),
    stamme:mat(0x6b4a32),krone:mat(0x2f7d55,true),krone2:mat(0x3f946a,true),vann:mat(0x4fa8c9),grus:mat(0xb7a98a),tre:mat(0x8a5f3c),
    stillas:new THREE.LineBasicMaterial({color:farge(0xf0b840)}),flagg:mat(0xfbf5ea),stang:mat(0x3b2a20),hjul:mat(0x1b2020),rute:mat(0xbfe3ee),støv:new THREE.MeshBasicMaterial({color:farge(0xcfc6b0),transparent:true,opacity:.7})};
  const G={boks:new THREE.BoxGeometry(1,1,1),etasje:new THREE.BoxGeometry(TB,EH,TB),kjegle:new THREE.ConeGeometry(1,1,6),tak:new THREE.ConeGeometry(TB*.78,TB*.62,4),syl:new THREE.CylinderGeometry(1,1,1,8),kule:new THREE.IcosahedronGeometry(1,0)};
  G.tak.rotateY(Math.PI/4);
  /* stillaset: kantene på en boks pluss kryss på sidene */
  (()=>{const a=TB/2+.25,h=EH/2,p=[];const k=[[-a,-a],[a,-a],[a,a],[-a,a]];
    k.forEach(([x,z],i)=>{const[nx,nz]=k[(i+1)%4];p.push(x,-h,z,x,h,z, x,h,z,nx,h,nz, x,-h,z,nx,h,nz, x,h,z,nx,-h,nz);});
    G.stillas=new THREE.BufferGeometry();G.stillas.setAttribute('position',new THREE.Float32BufferAttribute(p,3));})();
  const klosse=(m,sx,sy,sz,x,y,z,til)=>{const o=new THREE.Mesh(G.boks,m);o.scale.set(sx,sy,sz);o.position.set(x,y,z);(til||scene).add(o);return o;};

  /* ---- Bakken, veiene og fortauene ---- */
  {const b=new THREE.Mesh(new THREE.CylinderGeometry(halv*7,halv*7,1,48),M.bakke);b.position.y=-.6;scene.add(b);}
  klosse(M.vei,halv*2,.2,halv*2,0,0,0);
  for(let k=0;k<=N;k++){const c=(k-N/2)*P;   /* midtstriper */
    for(let d=-halv+2;d<halv-1;d+=3){klosse(M.stripe,.22,.04,1.3,c,.12,d);klosse(M.stripe,1.3,.04,.22,d,.12,c);}}
  const tomter=[];
  for(let i=0;i<N;i++)for(let j=0;j<N;j++){const[x,z]=sted(i,j),g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
    klosse(M.fortau,TOMT,.5,TOMT,0,.15,0,g);
    tomter.push({i,j,x,z,g,park:null,eier:null});}
  function park(t,nr){
    const r=frø(nr+7),g=new THREE.Group();t.g.add(g);t.park=g;
    klosse(r()<.5?M.gress:M.gress2,TOMT-1,.3,TOMT-1,0,.42,0,g);
    const type=nr%3;
    if(type===0){const v=new THREE.Mesh(G.syl,M.vann);v.scale.set(2.4,.12,1.8);v.position.set(-1+r()*2,.6,-1+r()*2);g.add(v);}
    if(type===1){klosse(M.grus,TOMT-1,.06,1.4,0,.6,0,g);klosse(M.grus,1.4,.06,TOMT-1,0,.6,0,g);}
    if(type===2){klosse(M.tre,2.2,.25,.7,-2,.85,2.6,g);klosse(M.tre,2.2,.25,.7,2,.85,-2.6,g);}
    const ant=4+Math.floor(r()*4);
    for(let k=0;k<ant;k++){const x=(r()-.5)*(TOMT-2.4),z=(r()-.5)*(TOMT-2.4);if(type===1&&(Math.abs(x)<1.3||Math.abs(z)<1.3))continue;
      const h=1.8+r()*1.8,s=new THREE.Mesh(G.syl,M.stamme);s.scale.set(.18,1,.18);s.position.set(x,1,z);g.add(s);
      const kr=new THREE.Mesh(r()<.5?G.kjegle:G.kule,r()<.5?M.krone:M.krone2);kr.scale.set(1+r()*.5,h,1+r()*.5);if(kr.geometry===G.kule)kr.scale.set(1.2,1.2,1.2);kr.position.set(x,1.4+h/2,z);kr.rotation.y=r()*3;g.add(kr);}
  }
  tomter.forEach((t,nr)=>park(t,nr));
  /* tilfeldig rekkefølge på tomtene, men litt spredt: de innerste først */
  const r0=frø(valg.frø||Math.floor(Math.random()*9999));
  const ledig=tomter.slice().sort((a,b)=>(Math.hypot(a.x,a.z)+r0()*P*1.5)-(Math.hypot(b.x,b.z)+r0()*P*1.5));

  /* ---- Bilene ---- */
  const biler=[];
  if(!rolig){const farger=[0xe98554,0x5fb0d9,0xf3d27a,0x8fd0a8,0xee7d6b,0xfbf5ea,0xb497e8];
    for(let k=0;k<Math.min(14,N*2+2);k++){const g=new THREE.Group(),m=mat(farger[k%farger.length]);
      klosse(m,1.1,.5,2.2,0,.55,0,g);klosse(M.rute,.95,.42,1.1,0,.98,-.1,g);
      [[-.5,.75],[.5,.75],[-.5,-.75],[.5,-.75]].forEach(([x,z])=>klosse(M.hjul,.22,.4,.4,x,.3,z,g));
      scene.add(g);biler.push({g,langsX:k%2===0,vei:Math.floor(r0()*(N+1)),ret:r0()<.5?1:-1,pos:(r0()*2-1)*halv,fart:5+r0()*5});}}

  /* ---- Tårnene ---- */
  let tekst=null;const hus={};
  const skilt=(s)=>{const c=document.createElement('canvas');c.width=160;c.height=200;const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:t,depthTest:false,transparent:true,sizeAttenuation:false}));sp.renderOrder=10;sp.scale.set(.05,.0625,1);   /* samme størrelse på skjermen uansett avstand */
    sp.userData.tegn=(tall)=>{const x=c.getContext('2d');x.clearRect(0,0,160,200);x.fillStyle='#0d1616';x.beginPath();x.arc(80,70,62,0,7);x.fill();x.fillStyle=s.farge;x.beginPath();x.arc(80,70,54,0,7);x.fill();
      x.font='64px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(KQ_IKON(s.navn),80,74);
      if(tall){x.font='700 46px Fredoka,"Trebuchet MS",sans-serif';x.lineWidth=9;x.strokeStyle='#0d1616';x.strokeText(tall,80,168);x.fillStyle='#fbf5ea';x.fillText(tall,80,168);}t.needsUpdate=true;};
    return sp;};
  function nyttHus(s){
    const t=ledig.shift();if(!t)return null;
    if(t.park){t.g.remove(t.park);t.park=null;}
    const g=new THREE.Group();t.g.add(g);
    klosse(M.grus,TOMT-1,.3,TOMT-1,0,.42,0,g);klosse(M.fortau,TB+1.6,.2,TB+1.6,0,.62,0,g);
    const h={t,g,et:'',u:0,stil:-1,etasjer:[],stillas:[],tak:null,skilt:skilt(s),fall:[],sig:''};
    g.add(h.skilt);h.skilt.userData.tegn('');h.skilt.position.set(0,5,0);t.eier=s.id;
    return hus[s.id]=h;
  }
  const BUNN=.72;
  /* Høye tårn: etasjene presses sammen i høyden (ys < 1), så hele byen fortsatt fyller skjermen.
     Tallet på skiltet viser alltid riktig antall etasjer. */
  let ys=1;
  function bygg(h,s,tving){
    const et=String(s.etasjer||''),u=Math.max(0,Math.min(200,+s.usikret||0)),stil=Math.max(0,Math.min(K.STILER.length-1,+s.stil||0)),sig=stil+'|'+et+'|'+u;
    if(sig===h.sig&&!tving)return;h.sig=sig;const eh=EH*ys;
    if(stil!==h.stil){h.etasjer.forEach(m=>h.g.remove(m));h.etasjer=[];h.stil=stil;}
    /* sikrede etasjer: nye faller på plass ovenfra */
    while(h.etasjer.length>et.length)h.g.remove(h.etasjer.pop());
    let nyNr=0;
    for(let i=0;i<et.length;i++){const m=i===0?'bunn':et[i],y=BUNN+eh/2+i*eh;let o=h.etasjer[i];
      if(o&&o.userData.m!==m){h.g.remove(o);o=null;}
      if(!o){o=new THREE.Group();o.userData.m=m;o.add(new THREE.Mesh(G.etasje,tekst[stil][m]));
        if(m==='b')klosse(M.stang,TB+1.1,.22,TB+1.1,0,-EH*.28,0,o);   /* balkongen stikker ut som en hylle rundt tårnet */
        o.position.set(0,y+(rolig?0:9),0);o.userData.y=y;o.userData.vent=(nyNr++)*.07;h.g.add(o);h.etasjer[i]=o;h.fall.push(o);}
      o.userData.y=y;o.scale.y=ys;if(!h.fall.includes(o))o.position.y=y;}
    /* stillas for det usikrede */
    while(h.stillas.length>u)h.g.remove(h.stillas.pop());
    while(h.stillas.length<u){const l=new THREE.LineSegments(G.stillas,M.stillas);h.g.add(l);h.stillas.push(l);}
    h.stillas.forEach((l,k)=>{l.position.set(0,BUNN+eh/2+(et.length+k)*eh,0);l.scale.y=ys;});
    /* taket står på når alt er sikret */
    const skalHaTak=et.length>0&&u===0;
    if(h.tak&&(!skalHaTak||h.tak.userData.stil!==stil)){h.g.remove(h.tak);h.tak=null;}
    if(skalHaTak&&!h.tak){const tg=new THREE.Group();tg.userData.stil=stil;const st=K.STILER[stil];
      const tk=new THREE.Mesh(G.tak,mat(parseInt(st.tak.slice(1),16),true));tk.position.y=TB*.31;tg.add(tk);
      klosse(M.stang,.12,1.8,.12,0,TB*.62+.8,0,tg);klosse(M.flagg,.9,.5,.06,.5,TB*.62+1.4,0,tg);h.g.add(tg);h.tak=tg;}
    const topp=BUNN+(et.length+u)*eh;if(h.tak)h.tak.position.y=BUNN+et.length*eh;
    h.høyde=topp+(h.tak?TB*.62+2:0);h.skilt.position.y=h.høyde+2.4;h.skilt.userData.tegn(et.length+u?String(et.length+u):'');
    h.et=et;h.u=u;
  }
  let maksH=10;
  function oppdater(liste){
    if(!tekst)return;
    /* Det høyeste tårnet skal ikke bli mye høyere enn byen er bred. Under ca. 35 etasjer er alt som før. */
    const maksEt=Math.max(1,...liste.map(s=>String(s.etasjer||'').length+Math.max(0,Math.min(200,+s.usikret||0))));
    const nyYs=Math.max(.12,Math.min(1,(N*P*.85)/(maksEt*EH)));
    const tving=Math.abs(nyYs-ys)>.02;if(tving)ys=nyYs;
    liste.forEach(s=>{const h=hus[s.id]||nyttHus(s);if(h)bygg(h,s,tving);});
    maksH=Math.max(10,...Object.values(hus).map(h=>h.høyde||0));
  }
  const støv=[];
  function ras(id){const h=hus[id];if(!h||rolig)return;
    for(let k=0;k<7;k++){const m=new THREE.Mesh(G.kule,M.støv.clone());m.position.set(h.t.x+(Math.random()-.5)*4,BUNN+h.et.length*EH+Math.random()*3,h.t.z+(Math.random()-.5)*4);m.userData={t:0,v:[(Math.random()-.5)*5,1+Math.random()*3,(Math.random()-.5)*5]};scene.add(m);støv.push(m);}}

  /* ---- Kamera og løkke ---- */
  let vinkel=Math.PI*.2,radius=halv*2.6,målY=4,sist=performance.now(),av=false,ramme=0;
  function størrelse(){const w=boks.clientWidth||600,h=boks.clientHeight||400;renderer.setSize(w,h,false);kamera.aspect=w/h;kamera.updateProjectionMatrix();}
  const ro=window.ResizeObserver?new ResizeObserver(størrelse):null;if(ro)ro.observe(boks);størrelse();
  function tegn(naa){
    if(av)return;ramme=requestAnimationFrame(tegn);
    const dt=Math.min(.1,(naa-sist)/1000);sist=naa;
    if(!rolig)vinkel+=dt*.07;
    const ønsketR=halv*2.05+maksH*1.15,ønsketY=2+maksH*.42;radius+=(ønsketR-radius)*Math.min(1,dt*1.5);målY+=(ønsketY-målY)*Math.min(1,dt*1.5);
    const høy=radius*.55;kamera.position.set(Math.sin(vinkel)*radius,målY+høy,Math.cos(vinkel)*radius);kamera.lookAt(0,målY,0);
    biler.forEach(b=>{b.pos+=b.ret*b.fart*dt;if(b.pos>halv+3)b.pos=-halv-3;if(b.pos<-halv-3)b.pos=halv+3;
      const c=(b.vei-N/2)*P,felt=b.ret*VEI*.24;
      if(b.langsX){b.g.position.set(b.pos,.1,c+felt);b.g.rotation.y=b.ret>0?-Math.PI/2:Math.PI/2;}else{b.g.position.set(c-felt,.1,b.pos);b.g.rotation.y=b.ret>0?Math.PI:0;}});
    Object.values(hus).forEach(h=>{for(let k=h.fall.length-1;k>=0;k--){const o=h.fall[k];
      if(o.userData.vent>0){o.userData.vent-=dt;continue;}
      o.position.y+=(o.userData.y-o.position.y)*Math.min(1,dt*9);if(Math.abs(o.position.y-o.userData.y)<.02){o.position.y=o.userData.y;h.fall.splice(k,1);}}});
    for(let k=støv.length-1;k>=0;k--){const m=støv[k],u=m.userData;u.t+=dt;m.position.x+=u.v[0]*dt;m.position.y+=u.v[1]*dt;m.position.z+=u.v[2]*dt;const s=.6+u.t*2.2;m.scale.set(s,s,s);m.material.opacity=Math.max(0,.7-u.t*.8);
      if(u.t>.9){scene.remove(m);m.material.dispose();støv.splice(k,1);}}
    renderer.render(scene,kamera);
  }
  tekst=await teksturer();
  ramme=requestAnimationFrame(tegn);
  return{oppdater,ras,plasser:N*N,
    stopp(){av=true;cancelAnimationFrame(ramme);if(ro)ro.disconnect();try{renderer.dispose();renderer.forceContextLoss&&renderer.forceContextLoss();}catch(e){}if(renderer.domElement.parentNode)renderer.domElement.remove();},
    _test:{scene,kamera,hus}};
}
window.KBy={kan,lag};
})();
