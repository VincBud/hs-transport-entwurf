/* Redesign „Was wir fahren“ + „Fahrer gesucht“.
   Eigener <script>-Block vor </body>, nach den bestehenden Skripten.
   Ohne JS: alle Inhalte sichtbar, erstes Leistungsbild steht. */

/* 1) Leistungen: das klebende Bild links folgt der Zeile, die gerade
      die Bildschirmmitte (55 %) passiert hat. Nur Klassenwechsel. */
window.addEventListener('DOMContentLoaded', function () {
  var items = Array.prototype.slice.call(document.querySelectorAll('.svc-i'));
  var slides = Array.prototype.slice.call(document.querySelectorAll('.svc-slide'));
  if (!items.length || !slides.length) return;
  document.documentElement.classList.add('js-svc');
  var cur = -1, laeuft = false;
  function upd() {
    laeuft = false;
    var linie = window.innerHeight * 0.55, a = 0;
    items.forEach(function (it, i) { if (it.getBoundingClientRect().top < linie) a = i; });
    if (a === cur) return;
    cur = a;
    items.forEach(function (it, i) { it.classList.toggle('on', i === a); });
    slides.forEach(function (s, i) { s.classList.toggle('on', i === a); });
  }
  window.addEventListener('scroll', function () {
    if (!laeuft) { laeuft = true; requestAnimationFrame(upd); }
  }, { passive: true });
  window.addEventListener('resize', upd, { passive: true });
  upd();
});

/* 2) Ruhiges Einblenden (.rv) und Planen-Aufdeckung für Bilder (.cur).
      Einmalig je Element, nie bei reduzierter Bewegung. */
window.addEventListener('DOMContentLoaded', function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;
  var ziele = document.querySelectorAll('#leistungen .rv, #leistungen .cur, #karriere .rv, #karriere .cur, #standorte .rv, #standorte .cur, #ueber-uns .rv, #ueber-uns .cur');
  if (!ziele.length) return;
  document.documentElement.classList.add('rv-on');
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
  ziele.forEach(function (el) { io.observe(el); });
});
