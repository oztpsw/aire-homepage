// Keep category navigation aligned with the real sticky header and tab height.
(() => {
  const tabs = document.querySelector('.program-tabs-band .tabs');
  const band = document.querySelector('.program-tabs-band');
  const content = document.getElementById('content');
  if (!tabs || !band || !content) return;
  const links = [...tabs.querySelectorAll('a[href^="#"]')];
  const wrapper = document.querySelector('.localized-scroll');
  const header = document.querySelector('.site-header');
  let frame = 0;
  let requested = null;
  let requestUntil = 0;

  function scroller() {
    return wrapper && getComputedStyle(wrapper).overflowY === 'auto' ? wrapper : window;
  }
  function offset() {
    return Math.ceil((header?.getBoundingClientRect().height || 0) + band.getBoundingClientRect().height + 20);
  }
  function sections() {
    return links.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);
  }
  function activate(id) {
    links.forEach(link => {
      const active = link.hash === '#' + id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function update() {
    frame = 0;
    const anchorOffset = offset();
    document.documentElement.style.setProperty('--menu-anchor-offset', anchorOffset + 'px');
    const area = scroller();
    const origin = area === window ? 0 : area.getBoundingClientRect().top;
    const threshold = origin + anchorOffset + 2;
    const available = sections();
    if (!available.length) return;
    if (requested) {
      const target = document.getElementById(requested);
      if (!target || performance.now() > requestUntil || Math.abs(target.getBoundingClientRect().top - (origin + anchorOffset)) < 3) requested = null;
      else { activate(requested); return; }
    }
    let current = available[0];
    for (const section of available) {
      if (section.getBoundingClientRect().top <= threshold) current = section;
    }
    activate(current.id);
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  function release() { requested = null; schedule(); }

  tabs.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || !tabs.contains(link) || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    const area = scroller();
    const origin = area === window ? 0 : area.getBoundingClientRect().top;
    const currentTop = area === window ? window.scrollY : area.scrollTop;
    const top = Math.max(0, currentTop + target.getBoundingClientRect().top - origin - offset());
    requested = target.id;
    requestUntil = performance.now() + 1800;
    activate(target.id);
    if (location.hash !== link.hash) history.pushState(null, '', link.hash);
    area.scrollTo({top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    schedule();
  });
  window.addEventListener('scroll', schedule, {passive:true});
  wrapper?.addEventListener('scroll', schedule, {passive:true});
  window.addEventListener('resize', release);
  window.addEventListener('hashchange', release);
  document.addEventListener('wheel', release, {passive:true});
  document.addEventListener('touchstart', release, {passive:true});
  document.addEventListener('keydown', event => {
    if (['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key)) release();
  });
  window.addEventListener('scrollend', release);
  wrapper?.addEventListener('scrollend', release);
  document.addEventListener('aire-menu-render', schedule);
  new ResizeObserver(schedule).observe(band);
  update();
  // Fragment links from other pages also use the measured offset after layout.
  window.addEventListener('load', () => {
    update();
    if (links.some(link => link.hash === location.hash)) {
      const target = document.getElementById(location.hash.slice(1));
      const area = scroller();
      const origin = area === window ? 0 : area.getBoundingClientRect().top;
      const top = (area === window ? window.scrollY : area.scrollTop) + target.getBoundingClientRect().top - origin - offset();
      area.scrollTo({top:Math.max(0, top),behavior:'instant'});
      update();
    }
  }, {once:true});
})();
