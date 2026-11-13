/* ============================================================
   Religionsprøven – felles kode for lærerportal (index.html)
   og elevside (prove.html).

   Firebase-prosjekt: samme som Krøniken (krle-sim).
   Datastruktur:
     prover/{proveId}                 { eier, tittel, aktiv, visResultat, religioner[], opprettet }
     prover/{proveId}/koder/{KODE}    { nr }
     prover/{proveId}/svar/{KODE}     { kode, religion, sporsmal[10], svar[10], levert, startet, levertTid, riktige }
   Elevnavn lagres IKKE i Firebase – bare i lærerens nettleser.

   Demo: legg ?demo=1 bak adressen for å prøve alt uten Firebase.
   ============================================================ */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDazYM5XDIABscMaDFgJ1IEco0du4JAN4w",
  authDomain: "krle-sim.firebaseapp.com",
  projectId: "krle-sim",
  storageBucket: "krle-sim.firebasestorage.app",
  messagingSenderId: "1073291328318",
  appId: "1:1073291328318:web:2fa3d0e862ed8e25d24a6f"
};

const ANTALL_SPORSMAL = 10;

const RELIGIONER = {
  buddhismen:    { navn: "Buddhismen",    farge: "#E39B3A", mork: "#8a5412", lys: "#fbeed8" },
  hinduismen:    { navn: "Hinduismen",    farge: "#D9577A", mork: "#8c2442", lys: "#fbe3ea" },
  islam:         { navn: "Islam",         farge: "#3E9B6E", mork: "#1f5a3e", lys: "#dff1e7" },
  jodedommen:    { navn: "Jødedommen",    farge: "#4A6FD1", mork: "#23397a", lys: "#e0e7fa" },
  kristendommen: { navn: "Kristendommen", farge: "#C2553B", mork: "#7a2d1c", lys: "#f8e2da" }
};
const REL_NOKLER = Object.keys(RELIGIONER);
function relBilde(rel, n){ return "bilder/" + rel + "-0" + n + ".webp"; }

/* Spørsmålsbank fra Blooket-filene (20 per religion). */
const BANK = {"buddhismen":[{"s":"Hvem grunnla buddhismen?","a":["Moses","Siddhartha Gautama","Muhammad","Gandhi"],"k":0},{"s":"Hva betyr ordet «Buddha»?","a":["Den sterke","Den hellige kongen","Den oppvåknede","Den vise munken"],"k":0},{"s":"Hvor ble Siddhartha født?","a":["I Kina","I Nord-India (dagens Nepal)","I Japan","I Egypt"],"k":2},{"s":"Hva gjorde Siddhartha da han forsto at alle blir gamle, syke og dør?","a":["Bygde et større slott","Ble konge","Forlot slottet for å søke svar","Reiste til Kina"],"k":2},{"s":"Hvor satt Siddhartha da han ble Buddha?","a":["På en fjelltopp","Under et bodhi-tre","I et tempel","I en båt"],"k":0},{"s":"Hva heter Buddhas viktigste oppdagelse?","a":["De ti bud","De fem søylene","De fire edle sannhetene","De sju dagene"],"k":0},{"s":"Hva sier buddhismen at lidelse kommer av?","a":["At vi alltid vil ha mer","At gudene er sinte","At vi ikke ber nok","At vi ikke faster"],"k":1},{"s":"Hva kalles veien ut av lidelsen?","a":["Den åttedelte veien","Den hellige elva","Den store vognen","Den lange reisen"],"k":0},{"s":"Hva er nirvana?","a":["Et tempel i Tibet","En hellig bok","At grådighet, hat og forvirring slukner — full fred","Et gudebilde"],"k":1},{"s":"Hva heter de hellige tekstene i buddhismen?","a":["Vedaene","Tripitaka","Koranen","Toraen"],"k":3},{"s":"Hva betyr Tripitaka?","a":["De tre kurvene","Den hellige boka","Buddhas dagbok","De åtte hjulene"],"k":1},{"s":"Hva er det viktigste ritualet i buddhismen?","a":["Faste","Dåp","Meditasjon","Pilegrimsreise til Mekka"],"k":2},{"s":"Hva gjør munkene hver morgen?","a":["Går rundt med en bolle og får mat","Ber fem ganger","Bader i Ganges","Tenner fyrverkeri"],"k":3},{"s":"Hva heter buddhismens største høytid?","a":["Divali","Vesak","Id","Påske"],"k":3},{"s":"Hva feires under Vesak?","a":["Buddhas fødsel, oppvåkning og død","Nyttår","Munkenes nye kapper","Regntidens slutt"],"k":1},{"s":"Hva symboliserer de åtte eikene i dharmahjulet?","a":["Åtte guder","Åtte hellige byer","Stegene på den åttedelte veien","Åtte hellige bøker"],"k":2},{"s":"Hva symboliserer lotusblomsten?","a":["Rikdom","At man kan reise seg ren fra lidelsen","Krig","Solen"],"k":0},{"s":"Hva er en stupa?","a":["En hellig elv","En munkekappe","Et kuppelformet tårn med noe hellig inni","En bønnebok"],"k":0},{"s":"Hvem er Dalai Lama?","a":["Grunnleggeren av buddhismen","Lederen i tibetansk buddhisme","En hindugud","Kongen av Thailand"],"k":2},{"s":"Omtrent hvor mange buddhister finnes det i verden?","a":["5 millioner","50 millioner","500 millioner","5 milliarder"],"k":2}],"hinduismen":[{"s":"Hvem grunnla hinduismen?","a":["Moses","Buddha","Ingen – den vokste fram over lang tid","Gandhi"],"k":1},{"s":"I hvilket land oppsto hinduismen?","a":["Kina","India","Egypt","Iran"],"k":3},{"s":"Hva kommer navnet «hindu» fra?","a":["Elva Indus","Byen Delhi","Guden Vishnu","Fjellet Himalaya"],"k":1},{"s":"Hva heter de eldste hellige tekstene i hinduismen?","a":["Koranen","Bibelen","Vedaene","Toraen"],"k":2},{"s":"Hva er Brahman?","a":["Den ene guddommelige kraften bak alt","En hellig elv","En prest","En høytid"],"k":3},{"s":"Hva betyr karma?","a":["At alle guder er like","At det du gjør, kommer tilbake til deg","At man må faste","At man ber fem ganger om dagen"],"k":3},{"s":"Hva er samsara?","a":["Ringen av gjenfødelser","Et tempel","En hellig bok","En fargefest"],"k":1},{"s":"Hva er moksha?","a":["En hellig by","At sjelen slipper fri fra gjenfødelsene","Et symbol i pannen","Et gudebilde"],"k":1},{"s":"Hva heter hinduismens mest leste tekst, der Krishna snakker med Arjuna?","a":["Ramayana","Upanishadene","Bhagavadgita","Vedaene"],"k":1},{"s":"Hva kalles tilbedelsen med lys, blomster og mat?","a":["Puja","Prasad","Yoga","Dharma"],"k":2},{"s":"Hva er prasad?","a":["Et tempel","En prest","Mat som er gitt til guden og deles ut etterpå","En bønn"],"k":3},{"s":"Hva heter lysfesten, hinduismens største høytid?","a":["Holi","Divali","Navaratri","Id"],"k":1},{"s":"Hva gjør man under Holi?","a":["Faster i en måned","Kaster farget pulver på hverandre","Bader i Ganges","Tenner lamper i vinduene"],"k":0},{"s":"Hvilken gudinne ønsker man velkommen med lamper under Divali?","a":["Durga","Sarasvati","Sita","Lakshmi"],"k":1},{"s":"Hva er hinduismens viktigste symbol og lyd?","a":["Kors","Halvmåne","Om (aum)","Menora"],"k":3},{"s":"Hva symboliserer lotusblomsten?","a":["Rikdom","Sjelen som reiser seg ren fra gjørma","Krig","Solen"],"k":1},{"s":"Hva kalles den røde prikken mange hinduer har i pannen?","a":["Bindi","Tilak","Prasad","Mandir"],"k":3},{"s":"Hva heter den helligste elva i hinduismen?","a":["Nilen","Indus","Ganges","Glomma"],"k":0},{"s":"Hvilken gud har elefanthode?","a":["Vishnu","Ganesha","Shiva","Krishna"],"k":2},{"s":"Omtrent hvor mange hinduer finnes det i verden?","a":["12 millioner","120 millioner","1,2 milliarder","4 milliarder"],"k":2}],"islam":[{"s":"Hva betyr ordet «islam»?","a":["Overgivelse eller fred","Bønn","Den hellige boka","Reise"],"k":3},{"s":"Hva betyr «Allah»?","a":["Profet","Arabisk for «Gud»","Moské","Engel"],"k":3},{"s":"I hvilken by ble Muhammad født?","a":["Jerusalem","Medina","Mekka","Bagdad"],"k":3},{"s":"Hvem viste seg ifølge fortellingen for Muhammad i hulen?","a":["Engelen Gabriel","Moses","Abraham","Jesus"],"k":0},{"s":"Hvilket år regnes som år 0 i den muslimske tidsregningen?","a":["570","610","622","632"],"k":1},{"s":"Hva heter islams hellige bok?","a":["Bibelen","Toraen","Talmud","Koranen"],"k":1},{"s":"Hvilket språk er Koranen skrevet på?","a":["Arabisk","Hebraisk","Norsk","Latin"],"k":1},{"s":"Hva er hadith?","a":["Fortellinger om hva Muhammad sa og gjorde","En høytid","Et bønnehus","En fastemåned"],"k":0},{"s":"Hvor mange søyler har islam?","a":["Tre","Fem","Sju","Ti"],"k":0},{"s":"Hva heter trosbekjennelsen i islam?","a":["Salat","Zakat","Shahada","Hajj"],"k":0},{"s":"Hvor mange ganger om dagen ber muslimer?","a":["En","Tre","Fem","Sju"],"k":3},{"s":"Hvilken retning vender muslimer seg mot når de ber?","a":["Mot Jerusalem","Mot Mekka","Mot øst","Mot moskeen i Oslo"],"k":1},{"s":"Hva heter fastemåneden?","a":["Id al-fitr","Ramadan","Hajj","Sawm-dagen"],"k":0},{"s":"Hva er zakat?","a":["Å gi en del av det man eier til de fattige","Å faste","Å reise til Mekka","Å be fem ganger om dagen"],"k":2},{"s":"Hva er hajj?","a":["Fredagsbønnen","Fasten","Pilegrimsreisen til Mekka","Trosbekjennelsen"],"k":3},{"s":"Hvilken fest avslutter ramadan?","a":["Id al-adha","Id al-fitr","Hanukka","Pesach"],"k":1},{"s":"Hva er Kaba?","a":["En svart kube i Mekka som muslimer vender seg mot","Tårnet på en moské","Et bønneteppe","En hellig bok"],"k":3},{"s":"Hva kalles tårnet på en moské?","a":["Kuppel","Minaret","Nisje","Søyle"],"k":3},{"s":"Hvilken retning er den største i islam?","a":["Sjia","Sufisme","Sunni","Ingen av dem"],"k":3},{"s":"Omtrent hvor mange muslimer finnes det i verden?","a":["2 millioner","20 millioner","200 millioner","2 milliarder"],"k":3}],"jodedommen":[{"s":"Hvem inngikk ifølge fortellingen den første pakten med Gud?","a":["Moses","Abraham","Kong David","Salomo"],"k":0},{"s":"Hva fikk Moses på Sinaifjellet?","a":["Loven og de ti bud","Davidsstjernen","Toraen ferdig trykt","Nøkkelen til templet"],"k":2},{"s":"Hva kalles de fem Mosebøkene?","a":["Tanak","Talmud","Toraen","Evangeliet"],"k":3},{"s":"Hva er Tanak?","a":["Hele den hebraiske bibelen","En jødisk høytid","Rabbinerens tittel","Et hellig fjell"],"k":0},{"s":"Hva heter jødenes hviledag?","a":["Pesach","Hanukka","Jom kippur","Sabbat"],"k":2},{"s":"Når varer sabbaten?","a":["Fredag kveld til lørdag kveld","Lørdag kveld til søndag kveld","Hele søndagen","Mandag til tirsdag"],"k":2},{"s":"Hvilken mat er ikke kosher?","a":["Fisk","Svinekjøtt","Brød","Frukt"],"k":2},{"s":"Hvor gammel er man vanligvis ved bar mitsva?","a":["7 år","10 år","13 år","18 år"],"k":2},{"s":"Hvilken høytid feirer at jødene ble frie fra Egypt?","a":["Hanukka","Pesach","Jom kippur","Sabbat"],"k":0},{"s":"Hva gjør mange voksne jøder på jom kippur?","a":["Faster et helt døgn","Tenner åtte lys","Spiser usyret brød","Reiser til Roma"],"k":2},{"s":"Hvor mange dager varer hanukka?","a":["Tre","Fem","Åtte","Førti"],"k":3},{"s":"Hva er jødedommens mest kjente symbol?","a":["Korset","Halvmånen","Fisken","Davidsstjernen"],"k":3},{"s":"Hvor mange armer har en menora?","a":["Tre","Fem","Sju","Ti"],"k":1},{"s":"Hva er en kippa?","a":["En liten lue på bakhodet","En bønn","En høytid","En matrett"],"k":2},{"s":"Hva er en mesusa?","a":["En kapsel i dørkarmen med tekst fra Toraen","En sang i synagogen","Et brød man spiser på sabbaten","Et hellig fjell"],"k":1},{"s":"Hva kalles jødenes hus for bønn og læring?","a":["Kirken","Moskeen","Synagogen","Templet"],"k":2},{"s":"Hva er Vestmuren i Jerusalem?","a":["Det som er igjen av muren rundt tempelplassen","Grensen til Israel","Veggen i synagogen i Oslo","Moses' grav"],"k":3},{"s":"Hva er en rabbiner?","a":["Lærer og veileder i menigheten","Kongen i Israel","Et hellig sted","En jødisk høytid"],"k":2},{"s":"Hvilken retning i jødedommen er vanligst i Norge og Nord-Europa?","a":["Ortodoks jødedom","Konservativ jødedom","Reformjødedom","Ingen av dem"],"k":3},{"s":"Omtrent hvor mange jøder finnes det i verden?","a":["1,5 millioner","15 millioner","150 millioner","1,5 milliarder"],"k":1}],"kristendommen":[{"s":"Hva betyr «Kristus»?","a":["Den salvede","Guds venn","Læreren","Kongen av Nasaret"],"k":3},{"s":"Hvor ble Jesus født?","a":["I Nasaret","I Jerusalem","I Betlehem","I Roma"],"k":0},{"s":"Hvor vokste Jesus opp?","a":["Betlehem","Nasaret","Jerusalem","Trondheim"],"k":2},{"s":"Hva deler tidsregningen vår i f.Kr. og e.Kr.?","a":["Jesu fødsel","Jesu død","Kirkens fødsel","Slaget på Stiklestad"],"k":0},{"s":"Hvor mange disipler samlet Jesus?","a":["Sju","Ti","Tolv","Tjue"],"k":1},{"s":"Hva kalles det at Gud er Far, Sønn og Den hellige ånd?","a":["Treenigheten","Frelsen","Sakramentet","Evangeliet"],"k":2},{"s":"Hva skjedde med Jesus i Jerusalem?","a":["Han ble konge","Han ble korsfestet","Han ble prest","Han flyttet til Roma"],"k":2},{"s":"Hva tror kristne skjedde tre dager etter Jesu død?","a":["Han sto opp fra de døde","Kirken ble bygd","Bibelen ble skrevet","Disiplene dro til Norge"],"k":0},{"s":"Hva betyr «evangelium»?","a":["Hellig bok","Godt budskap","Guds hus","Stor høytid"],"k":0},{"s":"Hvilke to deler består Bibelen av?","a":["Jul og påske","Loven og profetene","Det gamle og Det nye testamentet","Salmene og bønnene"],"k":0},{"s":"Hva kalles de to viktigste ritualene, dåp og nattverd?","a":["Seremonier","Sakramenter","Symboler","Høytider"],"k":2},{"s":"Hva er den mest kjente kristne bønnen?","a":["Fadervår","Ave Maria","Trosbekjennelsen","Salme 23"],"k":0},{"s":"Hvilken høytid er den viktigste for kristne?","a":["Jul","Pinse","Påske","Advent"],"k":1},{"s":"Hva feires i pinsen?","a":["Jesu fødsel","Den hellige ånd kom til disiplene","Jesu dåp","Det siste kveldsmåltidet"],"k":3},{"s":"Hva er kristendommens viktigste symbol?","a":["Duen","Fisken","Lyset","Korset"],"k":0},{"s":"Hvorfor brukte de første kristne fisken som tegn?","a":["Det var et hemmelig tegn da de ble forfulgt","Jesus var fisker","Fisken er hellig mat","Den sto på flagget deres"],"k":0},{"s":"Hvor står Nidarosdomen?","a":["Oslo","Bergen","Trondheim","Stavanger"],"k":1},{"s":"Hvem leder den katolske kirken?","a":["Presten","Biskopen","Kongen","Paven"],"k":1},{"s":"Hvilken retning tilhører Den norske kirke?","a":["Den katolske","Den ortodokse","Den protestantiske","Den jødiske"],"k":3},{"s":"Omtrent hvor mange kristne finnes i verden?","a":["24 millioner","240 millioner","2,4 milliarder","24 milliarder"],"k":2}]};
function fasit(rel, i){ const q = BANK[rel][i]; return ((q.k - i*3 - 7) % 4 + 8) % 4; }

/* ---------- Småhjelpere ---------- */
function esc(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function $(id){ return document.getElementById(id); }
function stokk(a){ a = a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function tilfeldig(a){ return a[Math.floor(Math.random()*a.length)]; }
function st(id,msg,ok){ const el=$(id); if(!el)return; el.textContent=msg||""; el.className="status "+(ok===true?"ok":ok===false?"feil":""); }
function kopier(t){
  try{ navigator.clipboard.writeText(t); return; }catch(e){}
  const ta=document.createElement("textarea"); ta.value=t; document.body.appendChild(ta); ta.select();
  try{ document.execCommand("copy"); }catch(_){} ta.remove();
}
function normKode(s){ return String(s||"").toUpperCase().replace(/[^A-Z0-9]/g,""); }
const KODE_BOKSTAV = "ABCDEFGHJKLMNPRSTUVWXYZ", KODE_SIFFER = "23456789";
function lagKoder(antall, unngaa){
  const brukt = new Set(unngaa||[]), ut=[];
  while(ut.length<antall){
    let k=""; for(let i=0;i<3;i++) k+=tilfeldig(KODE_BOKSTAV.split("")); for(let i=0;i<2;i++) k+=tilfeldig(KODE_SIFFER.split(""));
    if(!brukt.has(k)){ brukt.add(k); ut.push(k); }
  }
  return ut;
}
function riktigeAv(svarDoc, p){
  p = p || PROVE_CTX;
  if(!svarDoc || !svarDoc.sporsmal) return 0;
  let n=0; svarDoc.sporsmal.forEach((_,i)=>{ const v=(svarDoc.svar||[])[i]; if(v!=null && v===hentSp(p,svarDoc,i).f) n++; });
  return n;
}
function datoTekst(ms){ if(!ms) return ""; const d=new Date(ms); return d.toLocaleDateString("nb-NO",{day:"numeric",month:"long",year:"numeric"}); }
function lsGet(k, fallback){ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):fallback; }catch(e){ return fallback; } }
function lsSet(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); return true; }catch(e){ return false; } }

/* ============================================================
   LAGER – samme grensesnitt for Firebase og demo
   ============================================================ */
const ER_DEMO = new URLSearchParams(location.search).get("demo") === "1";

function lagFirebaseLager(){
  let auth=null, db=null, ok=false;
  try{
    if(typeof firebase!=="undefined"){
      if(!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
      db = firebase.firestore();
      if(firebase.auth) auth = firebase.auth();
      ok = true;
    }
  }catch(e){ ok=false; }
  const P = id => db.collection("prover").doc(id);
  return {
    demo:false, klar:ok,
    onAuth(cb){ if(auth) auth.onAuthStateChanged(u=>cb(u?{uid:u.uid,email:u.email}:null)); else cb(null); },
    loginGoogle(){ return auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()); },
    loginEpost(e,p,ny){ return ny ? auth.createUserWithEmailAndPassword(e,p) : auth.signInWithEmailAndPassword(e,p); },
    loggUt(){ return auth.signOut(); },
    async mineProver(uid){
      const s = await db.collection("prover").where("eier","==",uid).get();
      const ut=[]; s.forEach(d=>ut.push(Object.assign({id:d.id}, d.data()))); return ut;
    },
    async nyProve(data, koder, elevIder){
      const ref = db.collection("prover").doc();
      await ref.set(data);
      await this.leggTilKoder(ref.id, koder, 1, elevIder);
      return ref.id;
    },
    async leggTilKoder(id, koder, startNr, elevIder){
      for(let i=0;i<koder.length;i+=400){
        const b=db.batch();
        koder.slice(i,i+400).forEach((k,j)=>{
          const d={nr:startNr+i+j}; const e=elevIder&&elevIder[i+j]; if(e) d.elevId=e;   // elevId peker på eleven i «Mine grupper» – ikke navnet
          b.set(P(id).collection("koder").doc(k), d);
        });
        await b.commit();
      }
    },
    async mineGrupper(uid){
      const s=await db.collection("aa_grupper").where("eier","==",uid).get(); const ut=[];
      s.forEach(d=>{ const x=d.data()||{}; ut.push({id:d.id, navn:x.navn||"Gruppe", elever:Array.isArray(x.elever)?x.elever:[]}); });
      return ut.sort((a,b)=>a.navn.localeCompare(b.navn,"nb"));
    },
    async hentProve(id){ const d=await P(id).get(); return d.exists ? Object.assign({id:d.id}, d.data()) : null; },
    oppdaterProve(id, patch){ return P(id).update(patch); },
    async hentKoder(id){
      const s=await P(id).collection("koder").get(); const ut=[];
      s.forEach(d=>{ const x=d.data()||{}; ut.push({kode:d.id, nr:x.nr||0, elevId:x.elevId||null}); }); ut.sort((a,b)=>a.nr-b.nr); return ut;
    },
    lyttSvar(id, cb, feil){
      return P(id).collection("svar").onSnapshot(s=>{ const ut={}; s.forEach(d=>ut[d.id]=d.data()); cb(ut); }, e=>feil&&feil(e));
    },
    nullstill(id, kode){ return P(id).collection("svar").doc(kode).delete(); },
    async slettProve(id){
      for(const sub of ["svar","koder"]){
        const s=await P(id).collection(sub).get(); const docs=[]; s.forEach(d=>docs.push(d.ref));
        for(let i=0;i<docs.length;i+=400){ const b=db.batch(); docs.slice(i,i+400).forEach(r=>b.delete(r)); await b.commit(); }
      }
      await P(id).delete();
    },
    /* elev */
    async kodeFinnes(id, kode){ try{ const d=await P(id).collection("koder").doc(kode).get(); return d.exists; }catch(e){ return false; } },
    async hentSvar(id, kode){
      try{
        const d=await P(id).collection("svar").doc(kode).get();
        return d.exists ? {status:"igang", data:d.data()} : {status:"ny"};
      }catch(e){
        if(e && e.code==="permission-denied") return {status:"levert"};
        throw e;
      }
    },
    startSvar(id, kode, data){ return P(id).collection("svar").doc(kode).set(data); },
    lagreSvar(id, kode, patch){ return P(id).collection("svar").doc(kode).update(patch); }
  };
}

function lagDemoLager(){
  const KEY="rp_demo_v1";
  const les=()=>lsGet(KEY,{prover:{}}), skriv=d=>lsSet(KEY,d);
  const lyttere=[];
  function varsle(){ lyttere.forEach(f=>f()); }
  window.addEventListener("storage", e=>{ if(e.key===KEY) varsle(); });
  function seed(){
    const d=les(); if(Object.keys(d.prover).length) return;
    const id="demo7b", koder=lagKoder(24), svar={};
    const navn=["Aksel","Amina","Ask","Ella","Emil","Filip","Hedda","Ibrahim","Ingrid","Jonas","Kasper","Leah","Linnea","Magnus","Maja","Noah","Nora","Oliver","Sara","Selma","Sofie","Theo","William","Yusuf"];
    const nm={}; koder.forEach((k,i)=>nm[k]=navn[i]); lsSet("rp_navn_"+id, nm);
    koder.forEach((k,i)=>{
      if(i>=20) return;
      const rel=tilfeldig(REL_NOKLER), sp=stokk([...Array(20).keys()]).slice(0,ANTALL_SPORSMAL);
      const levert = i<17;
      const sv = sp.map((qi,j)=> (!levert && j>4) ? null : (Math.random()<0.72 ? fasit(rel,qi) : Math.floor(Math.random()*4)));
      svar[k]={kode:k, religion:rel, sporsmal:sp, svar:sv, levert, startet:Date.now()-3600e3, levertTid: levert?Date.now()-1800e3:null};
      if(levert) svar[k].riktige = riktigeAv(svar[k]);
    });
    d.prover[id]={eier:"demo", tittel:"7B – De fem store religionene (demo)", aktiv:true, visResultat:true, religioner:REL_NOKLER.slice(), opprettet:Date.now(),
      koder: Object.fromEntries(koder.map((k,i)=>[k,{nr:i+1}])), svar};
    skriv(d);
  }
  seed();
  const kopi=o=>JSON.parse(JSON.stringify(o));
  return {
    demo:true, klar:true,
    onAuth(cb){ setTimeout(()=>cb({uid:"demo", email:"demo-lærer (ingenting lagres på nett)"}),0); },
    loginGoogle(){ return Promise.resolve(); }, loginEpost(){ return Promise.resolve(); },
    loggUt(){ location.href=location.pathname; return Promise.resolve(); },
    async mineProver(uid){ const d=les(); return Object.entries(d.prover).filter(([,p])=>p.eier===uid).map(([id,p])=>{ const x=kopi(p); delete x.koder; delete x.svar; x.id=id; return x; }); },
    async nyProve(data, koder, elevIder){ const d=les(), id="p"+Date.now().toString(36); d.prover[id]=Object.assign(kopi(data),{opprettet:Date.now(),koder:{},svar:{}}); skriv(d); await this.leggTilKoder(id,koder,1,elevIder); return id; },
    async leggTilKoder(id,koder,startNr,elevIder){ const d=les(); koder.forEach((k,i)=>{ d.prover[id].koder[k]={nr:startNr+i}; if(elevIder&&elevIder[i]) d.prover[id].koder[k].elevId=elevIder[i]; }); skriv(d); varsle(); },
    async mineGrupper(){
      let g=lsGet("rp_demo_grupper",null);
      if(!g){ const nv=["Aksel","Amina","Ask","Ella","Emil","Filip","Hedda","Ibrahim","Ingrid","Jonas","Kasper","Leah","Linnea","Magnus","Maja","Noah","Nora","Oliver","Sara","Selma","Sofie","Theo","William","Yusuf"];
        g=[{id:"demogr", navn:"7B (demo)", elever:nv.map((n,i)=>({id:"e"+i, navn:n}))}]; lsSet("rp_demo_grupper",g); }
      return g;
    },
    async hentProve(id){ const p=les().prover[id]; if(!p) return null; const x=kopi(p); delete x.koder; delete x.svar; x.id=id; return x; },
    async oppdaterProve(id,patch){ const d=les(); Object.assign(d.prover[id],patch); skriv(d); },
    async hentKoder(id){ const p=les().prover[id]; return Object.entries(p.koder).map(([kode,v])=>({kode,nr:v.nr,elevId:v.elevId||null})).sort((a,b)=>a.nr-b.nr); },
    lyttSvar(id, cb){ const f=()=>{ const p=les().prover[id]; cb(p?kopi(p.svar):{}); }; lyttere.push(f); f(); const t=setInterval(f,2000); return ()=>{ clearInterval(t); const i=lyttere.indexOf(f); if(i>=0) lyttere.splice(i,1); }; },
    async nullstill(id,kode){ const d=les(); delete d.prover[id].svar[kode]; skriv(d); varsle(); },
    async slettProve(id){ const d=les(); delete d.prover[id]; skriv(d); try{ localStorage.removeItem("rp_navn_"+id); }catch(e){} },
    async kodeFinnes(id,kode){ const p=les().prover[id]; return !!(p && p.koder[kode]); },
    async hentSvar(id,kode){ const s=les().prover[id].svar[kode]; if(!s) return {status:"ny"}; if(s.levert) return {status:"levert"}; return {status:"igang", data:kopi(s)}; },
    async startSvar(id,kode,data){ const d=les(); if(!d.prover[id].aktiv) throw {code:"permission-denied"}; d.prover[id].svar[kode]=kopi(data); skriv(d); varsle(); },
    async lagreSvar(id,kode,patch){ const d=les(); const s=d.prover[id].svar[kode]; if(!s||s.levert||!d.prover[id].aktiv) throw {code:"permission-denied"}; Object.assign(s,kopi(patch)); skriv(d); varsle(); }
  };
}

const Lager = ER_DEMO ? lagDemoLager() : lagFirebaseLager();


/* ============================================================
   TEMAER – de innebygde religionene ELLER egne temaer fra CSV
     prove.egne       = { nøkkel: {navn, farge, mork, lys, sp:[{s, a:[…], k}]} }  (k kodet som i BANK)
     prove.religioner = valgte temanøkler
     prove.modus      = "tilfeldig" (hver elev trekker ett tema) | "blandet" (spørsmål fra alle temaene)
     prove.antall     = antall spørsmål (standard 10)
   Svar-dokument: religion = temanøkkel, eller "_blandet" – da peker sporsmal[] på flatListe(prove).
   Gamle prøver uten disse feltene virker som før.
   ============================================================ */
var PROVE_CTX = null;   // prøven som vises nå (settes av sidene)
var EGNE_FARGER = [
  ["#7C8CE0","#33408a","#e4e8fa"],["#4FB8A8","#1f6b60","#dcf2ee"],["#E8B04B","#8a6414","#fbefd6"],
  ["#C9586B","#7a2535","#f7e0e5"],["#9a6fd1","#4d2f7a","#ece3f8"],["#5aa0d8","#1f4f7a","#deedf8"],
  ["#d98a4a","#7a4318","#f8e8da"],["#6aa84f","#2f5e1f","#e4f1de"]
];
var MAKS_SPORSMAL = 50;
function proveAntall(p){ return Math.max(1, Math.min(MAKS_SPORSMAL, (p && p.antall) || ANTALL_SPORSMAL)); }
function proveModus(p){ return p && p.modus==="blandet" ? "blandet" : "tilfeldig"; }
function proveTemaer(p){
  if(p && p.egne){ const ks=(p.religioner||[]).filter(k=>p.egne[k]); return ks.length ? ks : Object.keys(p.egne); }
  const r=((p && p.religioner)||[]).filter(k=>RELIGIONER[k]); return r.length ? r : REL_NOKLER;
}
function temaInfo(p, key){
  if(p && p.egne && p.egne[key]){ const t=p.egne[key]; return {key, navn:t.navn, farge:t.farge, mork:t.mork, lys:t.lys, egen:true}; }
  if(key==="_blandet") return {key, navn:"Blandet", farge:"#E8B04B", mork:"#8a6414", lys:"#fbefd6", blandet:true};
  const R=RELIGIONER[key] || {navn:String(key), farge:"#E8B04B", mork:"#8a6414", lys:"#fbefd6"};
  return Object.assign({key}, R);
}
function temaNavnListe(p){
  const n=proveTemaer(p).map(k=>temaInfo(p,k).navn);
  return n.length<2 ? n.join("") : n.slice(0,-1).join(", ")+" og "+n[n.length-1];
}
function temaBank(p, key){ return (p && p.egne && p.egne[key]) ? (p.egne[key].sp||[]) : (BANK[key]||[]); }
/* Bilde: de innebygde religionene har egne bilder – egne temaer får en farget flis med forbokstav */
function temaBilde(p, key, n){
  if(RELIGIONER[key] && !(p && p.egne && p.egne[key])) return relBilde(key, n||1);
  if(p && p.egne && p.egne[key] && p.egne[key].bilde) return p.egne[key].bilde;   // opplastet bilde for temaet
  const t=temaInfo(p, key), navn=(t.navn||"?").trim(), tall=(navn.match(/\d+/)||[""])[0].slice(0,2);
  const b=esc((navn.charAt(0).toUpperCase()||"?")+tall), fs=b.length>2?110:b.length>1?130:150;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.farge}"/><stop offset="1" stop-color="${t.mork}"/></linearGradient></defs><rect width="300" height="300" fill="url(#g)"/><circle cx="245" cy="55" r="95" fill="#fff" opacity=".09"/><circle cx="35" cy="270" r="75" fill="#fff" opacity=".07"/><text x="150" y="${150+fs*0.31}" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-weight="700" font-size="${fs}" fill="#fff" opacity=".93">${b}</text></svg>`;
  return "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg);
}
function kodFasit(k, i){ return ((k - i*3 - 7) % 4 + 8) % 4; }
function kodFasitInn(f, i){ return ((f + i*3 + 7) % 4 + 4) % 4; }
function flatListe(p){ const ut=[]; proveTemaer(p).forEach(k=>temaBank(p,k).forEach((_,i)=>ut.push([k,i]))); return ut; }
function spRef(p, doc, i){
  const qi=doc.sporsmal[i];
  if(doc.religion==="_blandet"){ const f=flatListe(p)[qi]||[null,0]; return {tema:f[0], idx:f[1]}; }
  return {tema:doc.religion, idx:qi};
}
function hentSp(p, doc, i){
  const r=spRef(p, doc, i), q=temaBank(p, r.tema)[r.idx];
  if(!q) return {q:{s:"(Spørsmålet finnes ikke lenger)", a:[]}, f:-1, tema:r.tema};
  return {q, f:kodFasit(q.k, r.idx), tema:r.tema};
}
/* Lager et nytt svar-dokument for eleven */
function nyttSvarDoc(p, kode, tema){
  const n=proveAntall(p);
  let religion, sporsmal;
  if(proveModus(p)==="blandet"){ religion="_blandet"; sporsmal=stokk([...Array(flatListe(p).length).keys()]).slice(0,n); }
  else { religion=tema; sporsmal=stokk([...Array(temaBank(p,tema).length).keys()]).slice(0,n); }
  return {kode, religion, sporsmal, svar:Array(sporsmal.length).fill(null), levert:false, startet:Date.now()};
}

/* ---------- CSV: Blooket-format eller enkel mal ---------- */
function lesCSV(tekst){
  tekst=String(tekst||"").replace(/^﻿/,"");
  // Finn skilletegn: det som forekommer oftest utenfor anførselstegn i starten av fila
  const tell={",":0,";":0,"\t":0}; let iq=false;
  for(let i=0;i<Math.min(tekst.length,3000);i++){ const c=tekst[i]; if(c==='"') iq=!iq; else if(!iq && c in tell) tell[c]++; }
  const sk=Object.keys(tell).sort((a,b)=>tell[b]-tell[a])[0];
  const rader=[]; let rad=[], felt="", q=false;
  for(let i=0;i<tekst.length;i++){
    const c=tekst[i];
    if(q){ if(c==='"'){ if(tekst[i+1]==='"'){ felt+='"'; i++; } else q=false; } else felt+=c; }
    else if(c==='"') q=true;
    else if(c===sk){ rad.push(felt); felt=""; }
    else if(c==="\n"||c==="\r"){ if(c==="\r"&&tekst[i+1]==="\n") i++; rad.push(felt); rader.push(rad); rad=[]; felt=""; }
    else felt+=c;
  }
  if(felt!==""||rad.length){ rad.push(felt); rader.push(rad); }
  return rader;
}
function tolkSporsmalCSV(tekst){
  const rader=lesCSV(tekst).map(r=>r.map(c=>String(c).replace(/\s+/g," ").trim()));
  let h=rader.findIndex(r=>r.some(c=>/question text|^spørsmål/i.test(c)));
  let iS=0, iA=[1,2,3,4], iK=5;
  if(h>=0){
    const hr=rader[h].map(c=>c.toLowerCase());
    iS=hr.findIndex(c=>/question text|^spørsmål/.test(c));
    iA=[]; hr.forEach((c,i)=>{ if(/^(answer|svar|alternativ) ?\d/.test(c)) iA.push(i); });
    iK=hr.findIndex(c=>/correct|riktig|fasit/.test(c));
  }
  const sp=[], feil=[];
  rader.slice(h+1).forEach((r,n)=>{
    const s=r[iS]; if(!s || r.every(c=>!c)) return;
    let a=iA.map(i=>r[i]||""); while(a.length && !a[a.length-1]) a.pop();
    a=a.slice(0,4);
    const m=String(r[iK]||"").match(/\d+/), f=m?parseInt(m[0],10)-1:-1;
    if(a.length<2 || a.some(x=>!x) || f<0 || f>=a.length){ feil.push(h+2+n); return; }
    sp.push({s, a, f});
  });
  return {sp, feil};
}
function temaNavnFraFil(filnavn){
  return String(filnavn||"Tema").replace(/\.csv$/i,"").replace(/^blooket[_\- ]*/i,"").replace(/[_\-]+/g," ")
    .replace(/\buke ?(\d+) +(?=\S)/i,"uke $1 – ").replace(/\s+/g," ").trim() || "Tema";
}
