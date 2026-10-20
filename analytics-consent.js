(function () {
  'use strict';
  if (window.__businessAnalyticsLoaded) return;
  window.__businessAnalyticsLoaded = true;
  const measurementId = 'G-4B7DTLC5HX';
  const brand = 'aire_spa';
  const roleKey = 'business_analytics_role_v1';
  const params = new URLSearchParams(window.location.search);
  const requestedRole = params.get('analytics_role');
  let role = 'visitor';
  try {
    if (requestedRole === 'public') window.localStorage.removeItem(roleKey);
    else if (requestedRole === 'operator' || requestedRole === 'assistant') {
      window.localStorage.setItem(roleKey, requestedRole);
    }
    const savedRole = window.localStorage.getItem(roleKey);
    if (savedRole === 'operator' || savedRole === 'assistant') role = savedRole;
  } catch (_) { /* The explicit link still works when browser storage is blocked. */ }
  if (requestedRole === 'operator' || requestedRole === 'assistant') role = requestedRole;
  document.documentElement.dataset.analyticsRole = role;
  const localHost = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);
  const internal = role !== 'visitor' || localHost;
  document.documentElement.dataset.analyticsStatus = internal ? 'excluded' : 'enabled';

  // Marked staff and assistant browsers never load GA or send analytics events.
  // Do this before the first config call so even the first page_view is excluded.
  if (internal) {
    window['ga-disable-' + measurementId] = true;
    return;
  }
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied',
    ad_personalization: 'denied', analytics_storage: 'granted'
  });
  window.gtag('js', new Date());
  window.gtag('config', measurementId);
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  script.dataset.gaId = measurementId;
  document.head.appendChild(script);

  function classify(link) {
    let url;
    try { url = new URL(link.getAttribute('href'), window.location.href); }
    catch (_) { return null; }
    const host = url.hostname.replace(/^www\./, '');
    if (url.protocol === 'tel:') return ['phone_click', 'phone'];
    if (url.protocol === 'mailto:') return ['inquiry_click', 'email'];
    if (host === 'wa.me' || host === 'api.whatsapp.com') return ['inquiry_click', 'whatsapp'];
    if (host === 'booking.naver.com' || host === 'm.booking.naver.com') return ['reservation_click', 'naver'];
    if (host === 'aire-spa-reservation.aire-spa-reservation.workers.dev' && url.pathname === '/book') return ['reservation_click', 'direct'];
    if (host === 'maps.app.goo.gl' || host === 'map.naver.com' || host === 'naver.me' || host === 'map.kakao.com' || ((host === 'google.com' || host === 'maps.google.com') && (url.pathname.includes('/maps') || host === 'maps.google.com'))) return ['directions_click', host.includes('naver') ? 'naver_maps' : host.includes('kakao') ? 'kakao_maps' : 'google_maps'];
    if (host === 'instagram.com') return [brand === 'aire_spa' ? 'inquiry_click' : 'social_click', 'instagram'];
    if (host === 'facebook.com' || host === 'm.facebook.com') return ['social_click', 'facebook'];
    if (url.origin === window.location.origin && url.hash === '#reservation') return ['reservation_open', 'website'];
    if (url.origin === window.location.origin && (url.hash === '#visit' || url.hash === '#location')) return ['location_open', 'website'];
    if (url.origin === window.location.origin && /\/menu\/[^/]+\.pdf$/i.test(url.pathname)) return ['menu_download_click', 'pdf'];
    return null;
  }

  function trackClick(event) {
    if (event.type === 'auxclick' && event.button !== 1) return;
    if (event.type === 'click' && event.button > 0) return;
    const link = event.target && event.target.closest ? event.target.closest('a[href]') : null;
    if (!link) return;
    const action = classify(link);
    if (!action) return;
    const url = new URL(link.getAttribute('href'), window.location.href);
    // Send fixed categories, not email addresses, phone numbers or arbitrary query strings.
    window.gtag('event', action[0], {
      send_to: measurementId,
      contact_channel: action[1],
      page_language: document.documentElement.lang || 'en',
      link_placement: link.closest('footer') ? 'footer' : link.closest('header') ? 'header' : 'content',
      destination_host: url.hostname || action[1],
      transport_type: 'beacon'
    });
  }
  // Capture before existing language/anchor handlers; do not delay or replace navigation.
  document.addEventListener('click', trackClick, true);
  document.addEventListener('auxclick', trackClick, true);
})();

(function () {
  const lang = document.documentElement.lang || 'ko';
  const copy = lang.startsWith('ko')
    ? { privacy: '개인정보 안내' }
    : lang.startsWith('ja')
      ? { privacy: 'プライバシー通知' }
      : lang.startsWith('zh')
        ? { privacy: '隐私说明' }
        : { privacy: 'Privacy notice' };

  const style = document.createElement('style');
  style.textContent = '.analytics-privacy-link{margin-left:14px;text-decoration:underline;text-underline-offset:3px}@media(max-width:640px){.analytics-privacy-link{display:block;margin:10px 0 0}}';
  document.head.appendChild(style);

  const copyright = document.querySelector('.footer-copyright');
  if (copyright && !copyright.querySelector('.analytics-privacy-link')) {
    const privacyLink = document.createElement('a');
    privacyLink.className = 'analytics-privacy-link';
    privacyLink.href = lang.startsWith('zh') ? 'zh-privacy.html' : 'privacy.html';
    privacyLink.textContent = copy.privacy;
    copyright.appendChild(privacyLink);
  }

})();
