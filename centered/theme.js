/* Review-only palette switcher for the centered layout experiment.
   Usage: ?theme=<name>  (default: juniper)
   juniper | clay | crimson | oxblood | brass | teal | cobalt | plum | graphite | ink
   Same ten names as the root layout, so a colour can be compared across both.
   Delete this file and the .theme-switch block in index.html before launch. */
(function () {
  var THEMES = ['juniper', 'clay', 'crimson', 'oxblood', 'brass', 'teal',
                'cobalt', 'plum', 'graphite', 'ink'];

  // Retired centered-only palettes, plus the root layout's own older names,
  // mapped to their nearest surviving palette so shared links keep working.
  // indigo/ember were dropped as near-duplicates of cobalt/clay (dE 9.2, 15.4).
  var ALIASES = { indigo: 'cobalt', azure: 'cobalt', magenta: 'plum', ember: 'clay',
                  navy: 'brass', slate: 'teal', bone: 'crimson',
                  harbor: 'clay', mustard: 'brass' };
  var root = document.documentElement;

  function current() {
    var q = new URLSearchParams(location.search).get('theme');
    if (q && ALIASES[q]) q = ALIASES[q];
    if (THEMES.indexOf(q) > -1) return q;
    try {
      var saved = localStorage.getItem('jds-lab-theme');
      if (saved && ALIASES[saved]) saved = ALIASES[saved];
      if (THEMES.indexOf(saved) > -1) return saved;
    } catch (e) {}
    return 'juniper';
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('jds-lab-theme', theme); } catch (e) {}
    document.querySelectorAll('[data-theme-set]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.themeSet === theme));
    });
  }

  apply(current());

  document.querySelectorAll('[data-theme-set]').forEach(function (b) {
    b.addEventListener('click', function () {
      apply(b.dataset.themeSet);
      var url = new URL(location.href);
      url.searchParams.set('theme', b.dataset.themeSet);
      history.replaceState(null, '', url);
    });
  });

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
