// Entrance motion. Content stays visible if this script never runs (no .js class, no hidden state).
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.addEventListener('load', function () { document.documentElement.classList.add('loaded'); });
  if (reduce || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('js');
  var groups = document.querySelectorAll('[data-rv]');
  groups.forEach(function (g) {
    var kids = g.querySelectorAll(':scope > *, :scope .rv-item');
    kids.forEach(function (el, i) { el.classList.add('rv'); el.style.transitionDelay = Math.min(i, 6) * 75 + 'ms'; });
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  document.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });
})();
