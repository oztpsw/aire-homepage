// Presentation adjustments for the localized pages, without changing booking links.
const localizedScroll = document.querySelector('.localized-scroll');
localizedScroll?.addEventListener('scroll', () => {
  window.dispatchEvent(new Event('scroll'));
}, { passive: true });

function polishLocalizedLabels() {
  const lang = document.documentElement.lang;
  if (lang !== 'en' && lang !== 'ja') return;
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
  if (toggle) toggle.setAttribute('aria-label', lang === 'ja'
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
