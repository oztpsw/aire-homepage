// Version only language-switch destinations so a cached pre-label page is not reused.
(() => {
  const revision = '20261006-footer';
  const groups = [
    {ko:'index.html',en:'en.html',ja:'ja.html','zh-CN':'zh.html'},
    {ko:'about.html',en:'en-about.html',ja:'ja-about.html','zh-CN':'zh-about.html'},
    {ko:'menu.html',en:'en-menu.html',ja:'ja-menu.html','zh-CN':'zh-menu.html'},
    {ko:'private-spa-gangnam-ko.html',en:'private-spa-gangnam.html',ja:'private-spa-gangnam-ja.html','zh-CN':'private-spa-gangnam-zh.html'}
  ];
  const file = location.pathname.split('/').pop() || 'index.html';
  const group = groups.find(g => Object.values(g).includes(file));
  if (!group) return;
  const names = {en:'EN',ja:'日本語',ko:'한국어','zh-CN':'中文'};
  function normalize() {
    document.querySelectorAll('.lang button,.lang a').forEach(el => {
      const lang = el.dataset.lang || el.getAttribute('hreflang') || el.lang ||
        Object.keys(group).find(k => new URL(el.getAttribute('href') || '',location.href).pathname.endsWith('/'+group[k]));
      if (!names[lang]) return;
      el.textContent = names[lang];
      el.lang = lang;
      el.dataset.languageTarget = lang;
      if (el.tagName === 'A') el.href = group[lang]+'?lang-ui='+revision;
    });
  }
  normalize();
  window.addEventListener('pageshow', normalize);
  document.addEventListener('click', event => {
    const el = event.target.closest('.lang [data-language-target]');
    if (!el || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const lang = el.dataset.languageTarget;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (['ko','en','ja'].includes(lang)) {
      try { localStorage.setItem('aire-lang',lang); } catch {}
    }
    location.href = group[lang]+'?lang-ui='+revision;
  },true);
})();
