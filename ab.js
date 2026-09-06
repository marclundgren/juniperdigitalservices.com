/* 50/50 layout A/B split + GA4 tagging, for a static host with no server-side
   routing.

   Two surfaces, each testing the same two layouts against different copy:

     /        editorial (national)  vs  /centered/         (national)
     /local/  editorial (regional)  vs  /local/centered/   (regional)

   A visitor gets ONE layout assignment that follows them across both surfaces,
   so the split measures the layout and not the route. `ab_test` reports which
   surface the hit came from, so you can still segment.

   Load it synchronously as the first element in <head>: the redirect has to
   happen before the browser paints, or half your visitors see one layout flash
   before landing on the other.

   Setup:
     1. Put your GA4 measurement ID in GA_ID below.
     2. In GA4, register `ab_variant` and `ab_test` as custom dimensions
        (Admin -> Custom definitions), scoped to Event, or they won't show up
        in reports.

   Pinning a layout, for review and QA:
     ?layout=editorial   pin this browser to the editorial layout
     ?layout=centered    pin this browser to the centered layout
     ?layout=off         opt out of the test entirely
     ?layout=clear       forget the pin and re-roll on the next load

   `?ab=` is accepted as an alias so links made before the /lab restructure
   still work. The pin is stored in localStorage under `jds_layout`, with a
   cookie fallback for browsers that block storage, so you can also set, read
   or delete it straight from devtools:

     localStorage.setItem('jds_layout', 'centered')
     localStorage.removeItem('jds_layout')
*/
(function () {
  'use strict';

  var GA_ID   = 'G-XXXXXXXXXX';
  var KEY     = 'jds_layout';
  var MAX_AGE = 60 * 60 * 24 * 180;

  var LAYOUTS = ['editorial', 'centered'];

  var SURFACES = [
    { id: 'home',  paths: { editorial: '/',       centered: '/centered/' } },
    { id: 'local', paths: { editorial: '/local/', centered: '/local/centered/' } }
  ];

  var CRAWLERS = /bot|crawl|slurp|spider|bingpreview|headlesschrome|lighthouse|pagespeed|gtmetrix/i;

  function isLayout(id) {
    return LAYOUTS.indexOf(id) !== -1;
  }

  function normalize(path) {
    path = path.replace(/index\.html?$/, '');
    return path.charAt(path.length - 1) === '/' ? path : path + '/';
  }

  // Matched against the variant paths themselves, not a prefix: a page that
  // loads this script but isn't part of a test gets tagged and left alone.
  function surfaceFor(path) {
    for (var i = 0; i < SURFACES.length; i++) {
      var paths = SURFACES[i].paths;
      for (var j = 0; j < LAYOUTS.length; j++) {
        if (normalize(paths[LAYOUTS[j]]) === path) return SURFACES[i];
      }
    }
    return null;
  }

  /* --- the pin: localStorage, with a cookie fallback ----------------------- */

  // Probed with a real write rather than a read: a browser can hand back an
  // empty localStorage and then throw on setItem, and treating that as "no pin
  // yet" would re-roll the visitor on every page load.
  function storageWorks() {
    try {
      localStorage.setItem(KEY + '_probe', '1');
      localStorage.removeItem(KEY + '_probe');
      return true;
    } catch (e) {
      return false;
    }
  }

  var STORAGE = storageWorks();

  // When storage works it is the only source of truth. Reading through to the
  // cookie whenever localStorage merely came back empty would resurrect a pin
  // that someone had just deleted from devtools.
  function readStore() {
    if (STORAGE) {
      try { return localStorage.getItem(KEY); } catch (e) {}
    }
    var match = document.cookie.match('(?:^|; )' + KEY + '=([^;]*)');
    return match ? decodeURIComponent(match[1]) : null;
  }

  function writeStore(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
    document.cookie = KEY + '=' + encodeURIComponent(value) +
      ';path=/;max-age=' + MAX_AGE + ';SameSite=Lax';
  }

  function clearStore() {
    try { localStorage.removeItem(KEY); } catch (e) {}
    document.cookie = KEY + '=;path=/;max-age=0;SameSite=Lax';
  }

  function assign() {
    var params   = new URLSearchParams(location.search);
    var override = params.get('layout') || params.get('ab');

    if (override === 'clear') clearStore();
    else if (override === 'off') { writeStore('off'); return 'off'; }
    else if (override && isLayout(override)) { writeStore(override); return override; }

    var stored = readStore();
    if (stored === 'off') return 'off';
    if (stored && isLayout(stored)) return stored;

    // Crawlers stay unbucketed so each URL is indexed as it was requested.
    if (CRAWLERS.test(navigator.userAgent)) return null;

    var picked = LAYOUTS[Math.floor(Math.random() * LAYOUTS.length)];
    writeStore(picked);
    return picked;
  }

  // A bad path in SURFACES would otherwise bounce the visitor forever.
  function hopsExceeded() {
    try {
      var hops = Number(sessionStorage.getItem('jds_ab_hops')) || 0;
      if (hops >= 2) return true;
      sessionStorage.setItem('jds_ab_hops', hops + 1);
    } catch (e) {}
    return false;
  }

  function clearHops() {
    try { sessionStorage.removeItem('jds_ab_hops'); } catch (e) {}
  }

  function startAnalytics(variant, test) {
    if (GA_ID.indexOf('G-X') === 0) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };

    gtag('js', new Date());
    gtag('set', { ab_variant: variant, ab_test: test });
    gtag('set', 'user_properties', { ab_variant: variant });
    gtag('config', GA_ID);

    var tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(tag);
  }

  var here     = normalize(location.pathname);
  var surface  = surfaceFor(here);
  var assigned = assign();
  var target   = surface && assigned && assigned !== 'off' ? surface.paths[assigned] : null;

  if (target && normalize(target) !== here) {
    if (!hopsExceeded()) {
      location.replace(target + location.search + location.hash);
      return;
    }
  }
  clearHops();

  var reported = assigned || 'unbucketed';
  var testId   = 'layout-2026-09-' + (surface ? surface.id : 'other');

  document.documentElement.setAttribute('data-ab', reported);
  startAnalytics(reported, testId);

  // The contact forms POST away to Web3Forms, so the event has to go out on
  // submit rather than on any response.
  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (!form || form.tagName !== 'FORM' || typeof window.gtag !== 'function') return;
    gtag('event', 'generate_lead', {
      ab_variant: reported,
      ab_test: testId,
      form_location: location.pathname
    });
  });
})();
