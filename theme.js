/* Review-only palette + layout switcher.

   Nothing renders for a visitor. The controls are built only when this browser
   has opted into review mode, so the page ships without them:

     ?review=1    turn the controls on for this browser (stored)
     ?review=0    turn them off again

   The flag lives in localStorage under `jds-review`, so devtools works too:

     localStorage.setItem('jds-review', '1')
     localStorage.removeItem('jds-review')

   Palette selection is independent of the controls — ?theme=<name> and the
   stored `jds-theme` still apply whether or not the switcher is visible.
   juniper | clay | crimson | oxblood | brass | teal | cobalt | plum | graphite | ink

   Delete this file and its <script> tag before launch. */
(function () {
  var THEMES = ['juniper', 'clay', 'crimson', 'oxblood', 'brass', 'teal',
                'cobalt', 'plum', 'graphite', 'ink'];

  // Earlier round's names, so shared links keep working.
  var ALIASES = { navy: 'brass', slate: 'teal', bone: 'crimson',
                  harbor: 'clay', mustard: 'brass' };

  var REVIEW_KEY = 'jds-review';
  var root = document.documentElement;
  var params = new URLSearchParams(location.search);

  function current() {
    var q = params.get('theme');
    if (q && ALIASES[q]) q = ALIASES[q];
    if (THEMES.indexOf(q) > -1) return q;
    try {
      var saved = localStorage.getItem('jds-theme');
      if (saved && ALIASES[saved]) saved = ALIASES[saved];
      if (THEMES.indexOf(saved) > -1) return saved;
    } catch (e) {}
    return 'juniper';
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('jds-theme', theme); } catch (e) {}
    document.querySelectorAll('[data-theme-set]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.themeSet === theme));
    });
  }

  // A `?review=` in the URL sets the flag; otherwise we read what's stored.
  function reviewing() {
    var q = params.get('review');
    if (q !== null) {
      var on = q !== '0' && q !== 'off' && q !== 'false';
      try {
        if (on) localStorage.setItem(REVIEW_KEY, '1');
        else localStorage.removeItem(REVIEW_KEY);
      } catch (e) {}
      return on;
    }
    try { return localStorage.getItem(REVIEW_KEY) === '1'; } catch (e) {}
    return false;
  }

  // The centered layout on whichever surface this page belongs to.
  function counterpart() {
    return location.pathname.indexOf('/local/') === 0
      ? '/local/centered/?layout=centered'
      : '/centered/?layout=centered';
  }

  function buildSwitcher() {
    var box = document.createElement('div');
    box.className = 'theme-switch';
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', 'Preview palette');

    var link = document.createElement('a');
    link.className = 'theme-switch-label';
    link.href = counterpart();
    link.style.textDecoration = 'none';
    link.textContent = '↗ Centered';
    box.appendChild(link);

    THEMES.forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button';
      b.dataset.themeSet = t;
      b.textContent = t.charAt(0).toUpperCase() + t.slice(1);
      b.addEventListener('click', function () {
        apply(t);
        var url = new URL(location.href);
        url.searchParams.set('theme', t);
        history.replaceState(null, '', url);
      });
      box.appendChild(b);
    });

    document.body.appendChild(box);
  }

  if (reviewing()) buildSwitcher();
  apply(current());

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
