/* Krøniken – dørvakt for lærersidene.
   Sender den som ikke er logget inn, til innloggingen på forsiden.
   Merket «kr_inn» settes av forsiden ved innlogging og fjernes ved utlogging.
   Dette er en dør, ikke en lås: filene ligger åpent på nettet for den som kjenner adressen.
   Elevsidene (bok.html, historier.html, bli-med.html og prøvene) har ikke vakt. */
(function(){
  if(location.protocol==='file:'||/[?&]demo=1(&|$)/.test(location.search))return;
  try{ if(localStorage.getItem('kr_inn'))return; }catch(e){ return; }
  var side=location.pathname.split('/').pop()||'tema.html';
  location.replace('../portal/index.html?neste='+encodeURIComponent(side+location.search+location.hash));
})();
