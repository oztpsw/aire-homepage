(function () {
  const measurementId = 'G-4B7DTLC5HX';
  const storageKey = 'aire-analytics-consent';
  const lang = document.documentElement.lang || 'ko';
  const copy = lang.startsWith('ko')
    ? { message: '선택적 Google Analytics 쿠키를 사용하여 방문 및 사이트 이용 현황을 확인합니다. 동의하기 전에는 분석 데이터가 전송되지 않습니다.', privacy: '개인정보 안내', decline: '거부', accept: '분석 허용' }
    : lang.startsWith('ja')
      ? { message: '任意の Google Analytics Cookie を使用して、訪問状況とサイト利用状況を確認します。同意するまで分析データは送信されません。', privacy: 'プライバシー通知', decline: '拒否', accept: '分析を許可' }
      : { message: 'We use optional Google Analytics cookies to understand visits and site usage. No analytics data is sent unless you accept.', privacy: 'Privacy notice', decline: 'Decline', accept: 'Accept analytics' };

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

  function saveChoice(value) {
    localStorage.setItem(storageKey, value);
    document.querySelector('.analytics-consent')?.remove();
    if (value === 'accepted') loadAnalytics();
  }

  const style = document.createElement('style');
  style.textContent = '.analytics-consent{position:fixed;z-index:1000;right:22px;bottom:22px;left:22px;display:flex;align-items:center;justify-content:space-between;gap:26px;max-width:920px;margin:auto;padding:18px 20px;background:#fffdfa;color:#252722;border:1px solid rgba(16,42,36,.28);box-shadow:0 14px 44px rgba(16,42,36,.2);font-family:Arial,"Noto Sans KR","Noto Sans JP",sans-serif}.analytics-consent p{max-width:630px;margin:0;font-size:13px;line-height:1.6}.analytics-consent p a{text-decoration:underline;text-underline-offset:3px}.analytics-consent div{display:flex;gap:10px;flex-shrink:0}.analytics-consent button{padding:10px 13px;border:1px solid #102a24;background:transparent;font:600 12px Arial,"Noto Sans KR","Noto Sans JP",sans-serif;cursor:pointer}.analytics-consent .accept{background:#102a24;color:#fff}.analytics-privacy-link{margin-left:14px;text-decoration:underline;text-underline-offset:3px}@media(max-width:640px){.analytics-consent{right:12px;bottom:12px;left:12px;display:block;padding:16px}.analytics-consent div{margin-top:14px}.analytics-consent button{flex:1}.analytics-privacy-link{display:block;margin:10px 0 0}}';
  document.head.appendChild(style);

  const copyright = document.querySelector('.footer-copyright');
  if (copyright && !copyright.querySelector('.analytics-privacy-link')) {
    const privacyLink = document.createElement('a');
    privacyLink.className = 'analytics-privacy-link';
    privacyLink.href = 'privacy.html';
    privacyLink.textContent = copy.privacy;
    copyright.appendChild(privacyLink);
  }

  const saved = localStorage.getItem(storageKey);
  if (saved === 'accepted') { loadAnalytics(); return; }
  if (saved === 'declined') return;

  const banner = document.createElement('aside');
  banner.className = 'analytics-consent';
  banner.setAttribute('aria-label', copy.privacy);
  banner.innerHTML = `<p>${copy.message} <a href="privacy.html">${copy.privacy}</a></p><div><button type="button" data-consent="declined">${copy.decline}</button><button type="button" class="accept" data-consent="accepted">${copy.accept}</button></div>`;
  banner.querySelectorAll('[data-consent]').forEach(button => button.addEventListener('click', () => saveChoice(button.dataset.consent)));
  document.body.appendChild(banner);
})();
