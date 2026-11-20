/* =========================================================================
   TAVLELOFTET – henvendelsesskjema (skreddersydd.html#henvendelse)
   Lagrer henvendelsen i Firebase under «henvendelser/». Bare Espen kan lese
   dem (voksen.html → Henvendelser). Etterpå sendes et kort varsel (fast tekst,
   uten innholdet) til kontakt@tavleloftet.no og en bekreftelse til avsenderen,
   via varsel.tavleloftet.no (webhotellet hos Gigahost).
   ========================================================================= */
(function(){
  'use strict';
  var skjema = document.getElementById('henvSkjema'); if (!skjema) return;
  var FB = '10.12.2', CFG = window.TAVLELOFTET_FIREBASE;
  var $ = function(id){ return document.getElementById(id); };
  var mld = function(t, type){ var e = $('henvMld'); e.textContent = t; e.className = 'henv-mld' + (type ? ' ' + type : ''); };
  function last(src){ return new Promise(function(ok, feil){ var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = feil; document.head.appendChild(s); }); }
  var lastet = null;
  function firebaseKlar(){
    if (lastet) return lastet;
    lastet = last('https://www.gstatic.com/firebasejs/' + FB + '/firebase-app-compat.js')
      .then(function(){ return last('https://www.gstatic.com/firebasejs/' + FB + '/firebase-database-compat.js'); })
      .then(function(){ if (!firebase.apps.length) firebase.initializeApp(CFG); return firebase.database(); });
    return lastet;
  }

  // Vis elevfeltene bare når det gjelder en verden
  function oppdaterType(){
    var t = (skjema.querySelector('input[name="type"]:checked') || {}).value;
    var verden = t === 'niva1' || t === 'niva2';
    $('henvElev').hidden = !verden;
    $('h-liker').required = verden; $('h-ove').required = verden;
    $('h-melding').required = !verden;
    $('h-meldingLbl').textContent = verden ? 'Noe mer du vil fortelle? (valgfritt)' : 'Din melding';
  }
  skjema.addEventListener('change', function(e){ if (e.target.name === 'type') oppdaterType(); });
  // Forhåndsvalg via lenke, f.eks. skreddersydd.html?om=kurs#henvendelse
  var om = new URLSearchParams(location.search).get('om');
  var valgt = om && skjema.querySelector('input[name="type"][value="' + om.replace(/[^a-z0-9]/g, '') + '"]');
  if (valgt) valgt.checked = true;
  oppdaterType();

  skjema.addEventListener('submit', function(e){
    e.preventDefault();
    if ($('h-nettside').value) { mld('Takk! Henvendelsen er sendt.', 'ok'); skjema.reset(); return; } // honningkrukke mot roboter
    if (!CFG || !CFG.databaseURL) { mld('Skjemaet er ikke koblet til ennå. Prøv igjen senere.', 'feil'); return; }
    var t = (skjema.querySelector('input[name="type"]:checked') || {}).value;
    var verden = t === 'niva1' || t === 'niva2';
    var data = {
      type: t, navn: $('h-navn').value.trim(), epost: $('h-epost').value.trim(),
      rolle: $('h-rolle').value, skole: $('h-skole').value.trim(), melding: $('h-melding').value.trim(),
      status: 'ny'
    };
    if (verden) { data.trinn = $('h-trinn').value; data.liker = $('h-liker').value.trim(); data.ove = $('h-ove').value.trim(); }
    Object.keys(data).forEach(function(k){ if (data[k] === '') delete data[k]; });
    var knapp = $('henvSend'); knapp.disabled = true; mld('Sender …');
    firebaseKlar().then(function(db){
      data.tid = firebase.database.ServerValue.TIMESTAMP;
      return db.ref('henvendelser').push(data);
    }).then(function(ref){
      // Varsel og bekreftelse – feil her skal aldri stoppe skjemaet
      try {
        fetch('https://varsel.tavleloftet.no/index.php', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true,
          body: JSON.stringify({ id: ref && ref.key, type: data.type, epost: data.epost || '' })
        }).catch(function(){});
      } catch (e) {}
      skjema.reset(); oppdaterType(); skjema.hidden = true; $('henvTakk').hidden = false;
      $('henvTakk').focus();
    }).catch(function(){
      mld('Det gikk ikke å sende. Sjekk nettet og prøv igjen.', 'feil');
    }).then(function(){ knapp.disabled = false; });
  });
})();
