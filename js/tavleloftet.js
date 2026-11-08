// Tavleloftet – litt bevegelse: karusell og parallakse i toppbildet.
// Ingen sporing, ingen informasjonskapsler, ingen eksterne skript.
(function () {
  var rolig = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Karusell: forrige/neste, prikker og teller
  document.querySelectorAll('[data-karusell]').forEach(function (rot) {
    var spor = rot.querySelector('.track');
    var kort = Array.prototype.slice.call(spor.children);
    var teller = rot.querySelector('.teller');
    var prikker = rot.querySelector('.prikker');
    var aktiv = 0;

    function ga(i) {
      i = Math.max(0, Math.min(kort.length - 1, i));
      spor.scrollTo({ left: kort[i].offsetLeft - spor.offsetLeft - 4, behavior: rolig ? 'auto' : 'smooth' });
    }
    function oppdater() {
      var x = spor.scrollLeft, best = 0, avstand = Infinity;
      kort.forEach(function (k, i) {
        var d = Math.abs(k.offsetLeft - spor.offsetLeft - 4 - x);
        if (d < avstand) { avstand = d; best = i; }
      });
      if (spor.scrollLeft + spor.clientWidth >= spor.scrollWidth - 4) best = kort.length - 1;
      aktiv = best;
      if (teller) teller.textContent = (best + 1) + ' / ' + kort.length;
      if (prikker) prikker.querySelectorAll('button').forEach(function (b, i) {
        b.setAttribute('aria-current', i === best ? 'true' : 'false');
      });
    }
    if (prikker) kort.forEach(function (k, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Gå til kort ' + (i + 1));
      b.appendChild(document.createElement('span'));
      b.addEventListener('click', function () { ga(i); });
      prikker.appendChild(b);
    });
    rot.querySelector('[data-forrige]').addEventListener('click', function () { ga(aktiv - 1); });
    rot.querySelector('[data-neste]').addEventListener('click', function () { ga(aktiv + 1); });
    var t;
    spor.addEventListener('scroll', function () { clearTimeout(t); t = setTimeout(oppdater, 60); }, { passive: true });
    oppdater();
  });

  // Parallakse i toppbildet (bare med mus, og ikke hvis brukeren har bedt om rolige sider)
  var hero = document.querySelector('.hero');
  var lag = document.querySelector('.hero-bg .plx');
  if (hero && lag && !rolig && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      lag.style.transform = 'translate(' + (-x * 18) + 'px,' + (-y * 12) + 'px) scale(1.03)';
    });
    hero.addEventListener('mouseleave', function () { lag.style.transform = ''; });
  }

  // Skisse av innlogging på skreddersydd-siden – sender ingenting noe sted
  var skjema = document.querySelector('[data-kodeskjema]');
  if (skjema) skjema.addEventListener('submit', function (e) {
    e.preventDefault();
    var s = skjema.querySelector('.status');
    s.hidden = false;
    s.textContent = 'Dette er en skisse – innloggingen kobles til når verdenene flytter hit.';
  });
})();
