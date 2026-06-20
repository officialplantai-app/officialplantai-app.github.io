/* PlantAI — shared site script */
(function () {
  'use strict';

  // Mark JS available — used to gate optional reveal/staging animations.
  document.documentElement.classList.add('js');

  // Email-confirmation banner (Supabase redirect handler).
  // Triggers on ?confirmed=true, ?type=signup, #confirmation, #type=signup.
  function showConfirmBanner() {
    var banner = document.getElementById('confirm-banner');
    if (!banner) return;
    var search = window.location.search || '';
    var hash = window.location.hash || '';
    var triggered =
      search.indexOf('confirmed=true') !== -1 ||
      search.indexOf('type=signup') !== -1 ||
      hash.indexOf('confirmation') !== -1 ||
      hash.indexOf('type=signup') !== -1;
    if (triggered) banner.classList.add('visible');
  }
  showConfirmBanner();

  // Mobile nav overlay toggle.
  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var overlay = document.getElementById('nav-overlay');
    if (!toggle || !overlay) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      overlay.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      setOpen(!open);
    });
    // Close on link click (anchor nav still navigates).
    overlay.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setOpen(false);
    });
    // Close on Escape.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    // Close when resizing past desktop breakpoint.
    var mq = window.matchMedia('(min-width: 880px)');
    mq.addEventListener('change', function (e) { if (e.matches) setOpen(false); });
  }
  initNav();

  // IntersectionObserver-based reveal. Default state in CSS is visible;
  // .js class only applies the hidden start state if reveal class is present.
  function initReveal() {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches) {
      // Don't gate visibility — leave everything visible.
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
      return;
    }
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  }
  initReveal();

  // FAQ — only allow one open at a time within a list (optional polish).
  function initFaqExclusive() {
    document.querySelectorAll('.faq-list').forEach(function (list) {
      list.addEventListener('toggle', function (e) {
        if (!(e.target instanceof HTMLDetailsElement)) return;
        if (!e.target.open) return;
        list.querySelectorAll('details[open]').forEach(function (d) {
          if (d !== e.target) d.removeAttribute('open');
        });
      }, true);
    });
  }
  initFaqExclusive();
})();
