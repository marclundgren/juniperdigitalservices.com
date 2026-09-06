/* 50/50 A/B split + GA4 tagging, for a static host with no server-side routing.

   Load it synchronously as the first element in <head>: the redirect has to
   happen before the browser paints, or half your visitors see variant A flash
   before landing on variant B.

   Setup:
     1. Put your GA4 measurement ID in GA_ID below.
     2. In GA4, register `ab_variant` and `ab_test` as custom dimensions
        (Admin -> Custom definitions), scoped to Event, or they won't show up
        in reports.

   Query overrides, for review and QA:
     ?ab=editorial   force a variant
     ?ab=centered
     ?ab=off         opt out of the test entirely on this browser
*/
(function () {
  'use strict';

  var GA_ID   = 'G-XXXXXXXXXX';
  var TEST_ID = 'layout-2026-09';
  var COOKIE  = 'jds_ab';
  var MAX_AGE = 60 * 60 * 24 * 180;

  var VARIANTS = [
    { id: 'editorial', path: '/' },
    { id: 'centered',  path: '/lab/centered/' }
  ];

  var CRAWLERS = /bot|crawl|slurp|spider|bingpreview|headlesschrome|lighthouse|pagespeed|gtmetrix/i;

  function variantById(id) {
    for (var i = 0; i < VARIANTS.length; i++) {
      if (VARIANTS[i].id === id) return VARIANTS[i];
    }
    return null;
  }

  function normalize(path) {
    path = path.replace(/index\.html?$/, '');
    return path.charAt(path.length - 1) === '/' ? path : path + '/';
  }

  function readCookie(name) {
    var match = document.cookie.match('(?:^|; )' + name + '=([^;]*)');
    return match ? decodeURIComponent(match[1]) : null;
  }

  function writeCookie(name, value) {
    document.cookie = name + '=' + encodeURIComponent(value) +
      ';path=/;max-age=' + MAX_AGE + ';SameSite=Lax';
  }

  function assign() {
    var override = new URLSearchParams(location.search).get('ab');
    if (override === 'off') { writeCookie(COOKIE, 'off'); return 'off'; }
    if (override && variantById(override)) { writeCookie(COOKIE, override); return override; }

    var stored = readCookie(COOKIE);
    if (stored === 'off') return 'off';
    if (stored && variantById(stored)) return stored;

    // Crawlers stay unbucketed so each variant is indexed as it was requested.
    if (CRAWLERS.test(navigator.userAgent)) return null;

    var picked = VARIANTS[Math.floor(Math.random() * VARIANTS.length)].id;
    writeCookie(COOKIE, picked);
    return picked;
  }

  // A bad path in VARIANTS would otherwise bounce the visitor forever.
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

  function startAnalytics(variant) {
    if (GA_ID.indexOf('G-X') === 0) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };

    gtag('js', new Date());
    gtag('set', { ab_variant: variant, ab_test: TEST_ID });
    gtag('set', 'user_properties', { ab_variant: variant });
    gtag('config', GA_ID);

    var tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(tag);
  }

  var assigned = assign();
  var target = assigned && assigned !== 'off' ? variantById(assigned) : null;

  if (target && normalize(target.path) !== normalize(location.pathname)) {
    if (!hopsExceeded()) {
      location.replace(target.path + location.search + location.hash);
      return;
    }
  }
  clearHops();

  var reported = assigned || 'unbucketed';
  document.documentElement.setAttribute('data-ab', reported);
  startAnalytics(reported);

  // The contact forms POST away to Web3Forms, so the event has to go out on
  // submit rather than on any response.
  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (!form || form.tagName !== 'FORM' || typeof window.gtag !== 'function') return;
    gtag('event', 'generate_lead', {
      ab_variant: reported,
      ab_test: TEST_ID,
      form_location: location.pathname
    });
  });
})();
