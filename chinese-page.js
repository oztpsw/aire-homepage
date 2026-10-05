// Chinese text is served as HTML. This file only adds interaction and animation.
(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const scrollArea = document.querySelector('.localized-scroll');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function menu(open) {
    header?.classList.toggle('open', open);
    toggle?.setAttribute('aria-expanded', String(open));
    toggle?.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
  }
  toggle?.addEventListener('click', () => menu(toggle.getAttribute('aria-expanded') !== 'true'));
  document.querySelectorAll('.primary-nav a').forEach(a => a.addEventListener('click', () => menu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') menu(false); });
  const headerState = () => header?.classList.toggle('scrolled', (window.scrollY + (scrollArea?.scrollTop || 0)) > 18);
  window.addEventListener('scroll', headerState, {passive:true});
  scrollArea?.addEventListener('scroll', headerState, {passive:true});
  headerState();
  // The legacy KR pages read this key and only understand ko/en/ja.
  // Store the destination language, never an unsupported Chinese value.
  document.querySelectorAll('.lang a[lang]').forEach(a => a.addEventListener('click', () => {
    if (['ko','en','ja'].includes(a.lang)) {
      try { localStorage.setItem('aire-lang', a.lang); } catch {}
    }
  }));
  document.querySelectorAll('#content .section-head,#content .program,#content .subcard,#content .signature')
    .forEach(el => el.classList.add('reveal'));
  const reveal = new IntersectionObserver(entries => entries.forEach(({target,isIntersecting}) => {
    if (isIntersecting) { target.classList.add('visible', 'is-visible'); reveal.unobserve(target); }
  }), {threshold:.08});
  document.querySelectorAll('.reveal').forEach((el,i) => {
    el.style.setProperty('--reveal-delay', `${Math.min(i%3,2)*65}ms`);
    if(reduced)el.classList.add('visible','is-visible'); else reveal.observe(el);
  });
  const tabLinks = [...document.querySelectorAll('.tabs a,.primary-nav a[href^="#"]')];
  const sections = new IntersectionObserver(entries => entries.forEach(({target,isIntersecting}) => {
    if(isIntersecting) tabLinks.forEach(a => a.classList.toggle('active', a.hash === '#'+target.id));
  }), {rootMargin:'-24% 0px -66% 0px'});
  new Set(tabLinks.map(a => document.querySelector(a.hash)).filter(Boolean)).forEach(el => sections.observe(el));
  const film = document.querySelector('.film video');
  if(film && !reduced) new IntersectionObserver(entries => entries.forEach(({isIntersecting}) => {
    if(isIntersecting)film.play().catch(()=>{}); else film.pause();
  }), {threshold:.2}).observe(film);
})();
