/* Krøniken – «Tilbake til temaet»-knapp. Lastes av innholdssidene.
   Finner temaet fra adressen (?p=, ?t=, ?ls=) eller fra temasiden man kom fra (sessionStorage). */
(function(){
  var K=window.KRONIKEN||{},Q=new URLSearchParams(location.search),m='';
  ['p','t','ls'].forEach(function(n){var v=(Q.get(n)||'').split(',')[0].split('/')[0];if(!m&&K[v])m=v;});
  if(!m){var sti=location.pathname.split('/');var mp=sti[sti.length-2];if(K[mp])m=mp;}
  try{if(!m){var s=sessionStorage.getItem('kroniken-tema');if(K[s])m=s;}}catch(e){}
  var rot=(document.currentScript&&document.currentScript.src||'').replace(/felles\/tilbake\.js.*$/,'');
  var a=document.createElement('a');a.id='kr-tilbake';
  a.href=m?rot+'tema.html?l='+m:rot+'../portal/index.html';
  a.textContent=m?'← '+K[m].navn:'← Alle temaer';
  a.setAttribute('aria-label',m?'Tilbake til temaet '+K[m].navn:'Tilbake til alle temaer');
  var st=document.createElement('style');
  st.textContent='#kr-tilbake{position:fixed;left:10px;top:10px;z-index:9999;font:700 14px/1 system-ui,sans-serif;color:#F3E9D2;background:rgba(22,20,51,.82);border:1px solid rgba(243,233,210,.35);border-radius:999px;padding:9px 14px;text-decoration:none;opacity:.6;transition:opacity .15s}#kr-tilbake:hover,#kr-tilbake:focus-visible{opacity:1;outline:2px solid #E8B04B;outline-offset:2px}@media print{#kr-tilbake{display:none!important}}';
  document.head.appendChild(st);
  /* Sider med topplinje («Krøniken · elevbok»): legg knappen inn i linja i stedet for oppå den */
  var merke=[].filter.call(document.querySelectorAll('b'),function(x){return /^Krøniken · /.test(x.textContent);})[0];
  if(merke){a.style.cssText='position:static;opacity:1;margin-right:12px;flex:none;white-space:nowrap';merke.parentNode.insertBefore(a,merke);}
  else document.body.appendChild(a);
})();
