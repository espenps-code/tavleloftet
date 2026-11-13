/* Krøniken – presentasjonsmotor (felles for alle livssyn). Klikk/piltaster for neste steg, F fullskjerm, N notater, O oversikt, B svart skjerm */
(function(){
  const stage=document.getElementById('stage');
  const slides=[...stage.querySelectorAll('.slide')];
  window.SLIDE_INIT=window.SLIDE_INIT||{};
  let cur=-1, stepIdx=0, busy=false;

  // UI
  document.body.insertAdjacentHTML('beforeend',`
    <div id="bar"></div><div id="count"></div>
    <div id="nav"><button id="bPrev" aria-label="Forrige">&#9664;</button><button id="bNext" aria-label="Neste">&#9654;</button>
    <button id="bOver">Oversikt (O)</button><button id="bNotes">Notater (N)</button><button id="bFs">Fullskjerm (F)</button></div>
    <div id="notes" hidden></div><div id="overview" hidden></div>
    <div id="help">Klikk eller &rarr; for neste &middot; &larr; tilbake &middot; F fullskjerm &middot; N lærernotater &middot; O oversikt &middot; B svart skjerm</div>
    <div id="black" hidden style="position:fixed;inset:0;background:#000;z-index:50"></div>`);
  setTimeout(()=>{const h=document.getElementById('help');h.style.opacity=0;setTimeout(()=>h.remove(),1200)},5000);

  function fit(){const s=Math.min(innerWidth/1600,innerHeight/900);stage.style.transform=`scale(${s})`;}
  addEventListener('resize',fit);fit();

  const stepsOf=el=>{const all=[...el.querySelectorAll('.s')].map((e,i)=>({e,o:e.dataset.o!=null?+e.dataset.o:i})).sort((x,y)=>x.o-y.o).map(x=>x.e);const groups=[];
    all.forEach(e=>{if(e.dataset.with!==undefined&&groups.length)groups[groups.length-1].push(e);else groups.push([e]);});return groups;};

  // Timere
  let audio;
  function chime(){try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();
    [660,880,1320].forEach((f,i)=>{const o=audio.createOscillator(),g=audio.createGain();o.frequency.value=f;o.type='sine';
      g.gain.setValueAtTime(0,audio.currentTime+i*.18);g.gain.linearRampToValueAtTime(.25,audio.currentTime+i*.18+.02);
      g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+i*.18+1.2);o.connect(g).connect(audio.destination);o.start(audio.currentTime+i*.18);o.stop(audio.currentTime+i*.18+1.3);});}catch(e){}}
  document.querySelectorAll('.timer').forEach(t=>{
    const total=+t.dataset.sec||120;let left=total,iv=null;
    t.innerHTML=`<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="none" style="stroke:var(--bg3)" stroke-width="10"/>
      <circle class="rg" cx="60" cy="60" r="52" fill="none" style="stroke:var(--a)" stroke-width="10" stroke-linecap="round" stroke-dasharray="326.7" stroke-dashoffset="0"/></svg>
      <div><div class="tt"></div><div class="tl">${t.dataset.label||'Klikk for å starte'}</div></div>`;
    const tt=t.querySelector('.tt'),rg=t.querySelector('.rg'),tl=t.querySelector('.tl');
    const show=()=>{tt.textContent=`${Math.floor(left/60)}:${String(left%60).padStart(2,'0')}`;rg.style.strokeDashoffset=(326.7*(1-left/total)).toFixed(1);};
    show();
    t.addEventListener('click',e=>{e.stopPropagation();
      if(t.classList.contains('end')){left=total;t.classList.remove('end');tl.textContent='Klikk for å starte';show();return;}
      if(iv){clearInterval(iv);iv=null;tl.textContent='Pause – klikk for å fortsette';return;}
      tl.textContent='Klikk for pause';
      iv=setInterval(()=>{left--;show();if(left<=0){clearInterval(iv);iv=null;t.classList.add('end');tl.textContent='Tiden er ute! Klikk for å nullstille';chime();}},1000);
    });
  });
  // Snu-kort
  document.querySelectorAll('.flip').forEach(f=>f.addEventListener('click',e=>{e.stopPropagation();f.classList.toggle('open');}));

  function setNotes(){const n=slides[cur].querySelector('aside.notes');const box=document.getElementById('notes');
    box.innerHTML=`<h4>Lærernotater · lysbilde ${cur+1}</h4>`+(n?n.innerHTML:'<p>Ingen notater.</p>');}

  function go(i,opts={}){
    if(i<0||i>=slides.length||i===cur)return;
    const back=i<cur, prev=slides[cur];
    slides.forEach(s=>s.classList.remove('out','back'));
    if(prev){prev.classList.remove('cur');prev.classList.add('out');if(back)prev.classList.add('back');
      setTimeout(()=>prev.classList.remove('out','back'),1200);}
    const el=slides[i];cur=i;
    const tr='t-'+(el.dataset.tr||'fade');
    el.className=el.className.replace(/\bt-\S+/g,'').trim();
    el.classList.add(tr);if(back)el.classList.add('back');
    void el.offsetWidth;el.classList.add('cur');
    const groups=stepsOf(el);
    groups.flat().forEach(e=>e.classList.remove('on','done'));
    stepIdx=0;
    if(opts.full){groups.forEach(g=>g.forEach(e=>e.classList.add('done')));stepIdx=groups.length;}
    el.querySelectorAll('.flip.open').forEach(f=>f.classList.remove('open'));
    const fn=window.SLIDE_INIT[el.dataset.init];if(fn)try{fn(el,opts)}catch(e){console.error(e)}
    document.getElementById('bar').style.width=((i+1)/slides.length*100)+'%';
    document.getElementById('count').textContent=`${i+1} / ${slides.length}`;
    setNotes();
    try{history.replaceState(null,'','#'+(i+1))}catch(e){}
  }
  function next(){const groups=stepsOf(slides[cur]);
    if(stepIdx<groups.length){groups[stepIdx].forEach(e=>{e.classList.add('on');
      const ev=new CustomEvent('step',{detail:e});slides[cur].dispatchEvent(ev);});stepIdx++;}
    else go(cur+1);}
  function prev(){const groups=stepsOf(slides[cur]);
    if(stepIdx>0){stepIdx--;groups[stepIdx].forEach(e=>e.classList.remove('on','done'));}
    else go(cur-1,{full:true});}
  window.DECK={next,prev,go};

  stage.addEventListener('click',e=>{if(e.target.closest('.flip,.timer,.hot,button,input,select,a,label,.nostep'))return;next();});
  document.getElementById('bNext').onclick=next;document.getElementById('bPrev').onclick=prev;
  const toggle=id=>{const el=document.getElementById(id);el.hidden=!el.hidden;};
  function overview(){const o=document.getElementById('overview');
    if(!o.hidden){o.hidden=true;return;}
    o.innerHTML=slides.map((s,i)=>`<button data-i="${i}" class="${i===cur?'here':''}"><span>${i+1}</span>${(s.dataset.title||s.querySelector('h1,h2')?.textContent||'').trim()}</button>`).join('');
    o.querySelectorAll('button').forEach(b=>b.onclick=()=>{o.hidden=true;go(+b.dataset.i);});o.hidden=false;}
  function fs(){try{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();}catch(e){}}
  document.getElementById('bOver').onclick=overview;document.getElementById('bNotes').onclick=()=>toggle('notes');document.getElementById('bFs').onclick=fs;
  document.getElementById('black').onclick=()=>toggle('black');
  addEventListener('keydown',e=>{
    if(e.target.matches('input,textarea,select'))return;
    const k=e.key;
    if(['ArrowRight','PageDown',' ','Enter'].includes(k)){e.preventDefault();next();}
    else if(['ArrowLeft','PageUp','Backspace'].includes(k)){e.preventDefault();prev();}
    else if(k==='f'||k==='F')fs();
    else if(k==='n'||k==='N')toggle('notes');
    else if(k==='o'||k==='O'||k==='Escape'&&!document.getElementById('overview').hidden)overview();
    else if(k==='b'||k==='B'||k==='.')toggle('black');
    else if(k==='Home')go(0);else if(k==='End')go(slides.length-1);
  });
  const start=parseInt((location.hash||'').slice(1));
  go(start>0&&start<=slides.length?start-1:0);
})();
