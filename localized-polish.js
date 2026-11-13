// Presentation adjustments for the localized pages, without changing booking links.
const localizedScroll = document.querySelector('.localized-scroll');
localizedScroll?.addEventListener('scroll', () => {
  window.dispatchEvent(new Event('scroll'));
}, { passive: true });

function polishLocalizedLabels() {
  const lang = document.documentElement.lang;
  if (lang !== 'en' && lang !== 'ja' && lang !== 'zh-CN') return;
  document.querySelectorAll('.process p').forEach(paragraph => {
    if (!paragraph.textContent.includes('→') || paragraph.querySelector('.treatment-step')) return;
    const steps = paragraph.textContent.split('→').map(text => text.trim());
    paragraph.replaceChildren(...steps.map((text, index) => {
      const step = document.createElement('span');
      step.className = 'treatment-step';
      if (index) {
        const arrow = document.createElement('span');
        arrow.className = 'step-arrow';
        arrow.textContent = '→';
        step.append(arrow);
      }
      step.append(document.createTextNode(text));
      return step;
    }));
  });
  const toggle = document.querySelector('.menu-toggle');
  if (toggle && lang !== 'zh-CN') toggle.setAttribute('aria-label', lang === 'ja'
    ? (toggle.getAttribute('aria-expanded') === 'true' ? 'メニューを閉じる' : 'メニューを開く')
    : (toggle.getAttribute('aria-expanded') === 'true' ? 'Close menu' : 'Open menu'));
  if (lang === 'ja') {
    const labels = { ABOUT:'AIREについて', PROGRAMS:'プログラム', SPACE:'施設', LOCATION:'アクセス', RESERVATION:'予約', MENU:'メニュー' };
    document.querySelectorAll('footer a,footer h3').forEach(el => {
      if (labels[el.textContent.trim()]) el.textContent = labels[el.textContent.trim()];
    });
    document.querySelectorAll('.program-meta span').forEach(el => {
      el.textContent = el.textContent.replace(/\bmin\b/gi, '分').replace(/FROM KRW ([\d,]+)/, '$1ウォン〜');
    });
  }
}
polishLocalizedLabels();
document.querySelector('.menu-toggle')?.addEventListener('click', polishLocalizedLabels);
document.querySelectorAll('.lang button').forEach(button => button.addEventListener('click', polishLocalizedLabels));

// Hide the shortcut while its destination is already visible on mobile.
(() => {
  const button = document.querySelector('body > .mobile-reserve[href="#reservation"]');
  const reservation = document.getElementById('reservation');
  if (!button || !reservation) return;
  const mobile = matchMedia('(max-width:720px)');
  const header = document.querySelector('.site-header');
  let pending = false;

  function update() {
    pending = false;
    if (!mobile.matches) { button.hidden = false; return; }
    const style = getComputedStyle(button);
    const px = name => parseFloat(style[name]) || 0;
    const barHeight = Math.max(px('minHeight'), px('lineHeight') + px('paddingTop') + px('paddingBottom') + px('borderTopWidth') + px('borderBottomWidth'));
    // Use the same viewport boundary whether the bar is visible or collapsed.
    // Otherwise the extra space created by hiding it can cause repeated toggles.
    const bottom = document.body.getBoundingClientRect().bottom - barHeight;
    const top = Math.max(0, header?.getBoundingClientRect().bottom || 0);
    const area = reservation.getBoundingClientRect();
    button.hidden = area.top < bottom - 1 && area.bottom > top + 1;
  }
  function schedule() {
    if (!pending) { pending = true; requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule);
  mobile.addEventListener('change', schedule);
  const observer = new ResizeObserver(schedule);
  observer.observe(document.body);
  observer.observe(reservation);
  document.fonts?.ready.then(schedule);
  update();
})();
