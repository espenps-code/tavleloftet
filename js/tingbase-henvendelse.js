/* =========================================================================
   TAVLELOFTET – henvendelsesskjema for Tingbasen (tingbase.html#henvendelse)
   Samme løype som skreddersydd-skjemaet: lagres under «henvendelser/» med
   type «tingbase», leses i admin.html → Henvendelser, og varsel.tavleloftet.no
   sender kort varsel + bekreftelse.
   ========================================================================= */
(function(){
  'use strict';
  var skjema = document.getElementById('tingSkjema'); if (!skjema) return;
  var FB = '10.12.2', CFG = window.TAVLELOFTET_FIREBASE;
  var $ = function(id){ return document.getElementById(id); };
  var mld = function(t, type){ var e = $('tingMld'); e.textContent = t; e.className = 'henv-mld' + (type ? ' ' + type : ''); };
  function last(src){ return new Promise(function(ok, feil){ var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = feil; document.head.appendChild(s); }); }
  var lastet = null;
  function firebaseKlar(){
    if (lastet) return lastet;
    lastet = last('https://www.gstatic.com/firebasejs/' + FB + '/firebase-app-compat.js')
      .then(function(){ return last('https://www.gstatic.com/firebasejs/' + FB + '/firebase-database-compat.js'); })
      .then(function(){ if (!firebase.apps.length) firebase.initializeApp(CFG); return firebase.database(); });
    return lastet;
  }
  skjema.addEventListener('submit', function(e){
    e.preventDefault();
    if ($('t-nettside').value) { mld('Takk! Henvendelsen er sendt.', 'ok'); skjema.reset(); return; } // honningkrukke
    if (!CFG || !CFG.databaseURL) { mld('Skjemaet er ikke koblet til ennå. Prøv igjen senere.', 'feil'); return; }
    var str = $('t-storrelse').value, melding = $('t-melding').value.trim();
    if (str) melding = 'Ansatte: ' + str + '\n\n' + melding;
    var data = { type: 'tingbase', navn: $('t-navn').value.trim(), epost: $('t-epost').value.trim(),
      rolle: $('t-rolle').value, skole: $('t-skole').value.trim(), melding: melding, status: 'ny' };
    Object.keys(data).forEach(function(k){ if (data[k] === '') delete data[k]; });
    var knapp = $('tingSend'); knapp.disabled = true; mld('Sender …');
    firebaseKlar().then(function(db){
      data.tid = firebase.database.ServerValue.TIMESTAMP;
      return db.ref('henvendelser').push(data);
    }).then(function(ref){
      try {
        fetch('https://varsel.tavleloftet.no/index.php', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true,
          body: JSON.stringify({ id: ref && ref.key, type: data.type, epost: data.epost || '' })
        }).catch(function(){});
      } catch (e) {}
      skjema.reset(); skjema.hidden = true; $('tingTakk').hidden = false; $('tingTakk').focus();
    }).catch(function(){
      mld('Det gikk ikke å sende. Sjekk nettet og prøv igjen.', 'feil');
    }).then(function(){ knapp.disabled = false; });
  });
})();
