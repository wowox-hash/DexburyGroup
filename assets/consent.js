// Google Analytics 4 with prior consent (GDPR / ePrivacy).
// GA loads only after the visitor clicks "Accept". Nothing is set before that.
// The visitor's choice is stored in localStorage (strictly necessary, no cookie).
(function () {
  var script = document.currentScript;
  var GA_ID = script && script.getAttribute('data-ga-id');
  if (!GA_ID || !/^G-[A-Z0-9]{6,}$/.test(GA_ID)) return; // not configured yet: do nothing
  var KEY = 'dexbury-consent-v1';

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadGA() {
    if (window.__gaLoaded) return; window.__gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
    gtag('js', new Date());
    gtag('config', GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
    var s = document.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
    trackEvents();
  }

  function trackEvents() {
    // Conversions: thank-you page after a form, and clicks on contact links.
    if (/\/thanks(\.html)?$/.test(location.pathname)) {
      var ref = document.referrer || '';
      gtag('event', 'generate_lead', { form: /ventures/.test(ref) ? 'venture' : 'contact' });
    }
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a');
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (href.indexOf('mailto:') === 0) gtag('event', 'email_click', { link_text: a.textContent.trim().slice(0, 60) });
      else if (/(^|\/)contact(\.html)?$|#submit$/.test(href)) gtag('event', 'cta_click', { link_text: a.textContent.trim().slice(0, 60), page: location.pathname });
    }, true);
  }

  function clearGA() {
    // Remove GA cookies if the visitor withdraws consent.
    document.cookie.split(';').forEach(function (c) {
      var n = c.split('=')[0].trim();
      if (n === '_ga' || n.indexOf('_ga_') === 0) {
        var host = location.hostname.replace(/^www\./, '');
        ['', '; domain=.' + host, '; domain=' + location.hostname].forEach(function (d) {
          document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
        });
      }
    });
  }

  function banner() {
    if (document.getElementById('cc-banner')) return;
    var b = document.createElement('div');
    b.id = 'cc-banner'; b.setAttribute('role', 'dialog'); b.setAttribute('aria-live', 'polite');
    b.setAttribute('aria-label', 'Cookie consent');
    b.innerHTML =
      '<p>We use Google Analytics cookies to understand how visitors use this site, only if you accept. ' +
      '<a href="/legal#privacy">Privacy &amp; cookies</a></p>' +
      '<div class="cc-btns"><button type="button" class="cc-no">Decline</button>' +
      '<button type="button" class="cc-yes">Accept</button></div>';
    document.body.appendChild(b);
    b.querySelector('.cc-yes').addEventListener('click', function () { save('granted'); b.remove(); loadGA(); });
    b.querySelector('.cc-no').addEventListener('click', function () { save('denied'); b.remove(); clearGA(); });
  }

  function init() {
    var v = read();
    if (v === 'granted') loadGA();
    else if (v !== 'denied') banner();
    document.querySelectorAll('[data-cookie-settings]').forEach(function (el) {
      el.hidden = false;
      el.addEventListener('click', function (e) {
        e.preventDefault();
        if (read() === 'granted') { save('denied'); clearGA(); location.reload(); return; }
        try { localStorage.removeItem(KEY); } catch (x) {}
        banner();
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
