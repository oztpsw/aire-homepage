(function () {
  const measurementId = 'G-4B7DTLC5HX';
  const lang = document.documentElement.lang || 'ko';
  const copy = lang.startsWith('ko')
    ? { privacy: '개인정보 안내' }
    : lang.startsWith('ja')
      ? { privacy: 'プライバシー通知' }
      : { privacy: 'Privacy notice' };

  function loadAnalytics() {
    if (document.querySelector(`script[data-ga-id="${measurementId}"]`)) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', measurementId);
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.dataset.gaId = measurementId;
    document.head.appendChild(script);
  }

  const style = document.createElement('style');
  style.textContent = '.analytics-privacy-link{margin-left:14px;text-decoration:underline;text-underline-offset:3px}@media(max-width:640px){.analytics-privacy-link{display:block;margin:10px 0 0}}';
  document.head.appendChild(style);

  const copyright = document.querySelector('.footer-copyright');
  if (copyright && !copyright.querySelector('.analytics-privacy-link')) {
    const privacyLink = document.createElement('a');
    privacyLink.className = 'analytics-privacy-link';
    privacyLink.href = 'privacy.html';
    privacyLink.textContent = copy.privacy;
    copyright.appendChild(privacyLink);
  }

  loadAnalytics();
})();
