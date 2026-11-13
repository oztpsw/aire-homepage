/* Add only owner-approved videos: { id: 'YouTube video ID', title: { ko, en, ja, 'zh-CN' } }. */
const aireMediaVideos = [{"id": "4FLQ4KfCdn4", "title": {"ko": "미모/실력/인성 까지 3박자가 아울러진 강남아이레스파 소개해드립니다~", "en": "Introducing AIRE SPA", "ja": "AIRE SPAのご紹介", "zh-CN": "AIRE SPA 简介"}}, {"id": "CzLEcFpirRY", "title": {"ko": "조화로운 마사지의 맛!! 보는 사람까지 시원함이 전달되요~!!", "en": "Body massage at AIRE SPA", "ja": "AIRE SPAのボディマッサージ", "zh-CN": "AIRE SPA 身体按摩"}}, {"id": "EwCrTpFNU4U", "title": {"ko": "인스타에서 급등하는 빨래통 사건의 여자가 선정샘이구나~!!ㅎㅎ", "en": "A massage session at AIRE SPA", "ja": "AIRE SPAの施術風景", "zh-CN": "AIRE SPA 按摩实录"}}];
(() => {
  const section = document.querySelector('#media');
  if (!section || !aireMediaVideos.length) return;
  const videos = aireMediaVideos.filter(v => /^[\w-]{11}$/.test(v.id));
  if (!videos.length) return;
  const labels = {ko:['더 보기','닫기','영상 재생'],en:['Show more','Close','Play video'],ja:['もっと見る','閉じる','動画を再生'], 'zh-CN':['查看更多','关闭','播放视频']};
  const grid = section.querySelector('.aire-media-grid');
  const more = section.querySelector('.aire-media-more');
  const dialog = section.querySelector('dialog');
  const close = section.querySelector('.aire-media-close');
  const player = section.querySelector('.aire-media-player');
  let expanded = false, opener = null, previousOverflow = '';
  const lang = () => document.documentElement.lang;
  const words = () => labels[lang()] || labels.en;
  const title = v => v.title[lang()] || v.title.en || '';
  const stop = () => { player.replaceChildren(); document.body.style.overflow = previousOverflow; opener?.focus(); };
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', stop);
  dialog.addEventListener('click', e => { if(e.target === dialog) {const r=dialog.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) dialog.close();} });
  const render = () => {
    grid.replaceChildren(); grid.classList.toggle('aire-media-single', videos.length === 1);
    videos.slice(0, expanded ? videos.length : 3).forEach(v => {
      const button = document.createElement('button'); button.type='button'; button.className='aire-media-card';
      const image = document.createElement('img'); image.src=`https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg`; image.addEventListener('error',()=>{image.src=`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;},{once:true}); image.alt=''; image.loading='lazy'; image.width=480; image.height=360;
      const caption=document.createElement('span'); caption.className='aire-media-caption';
      const captionText=title(v), lastSpace=captionText.lastIndexOf(' ');
      caption.append(document.createTextNode(captionText.slice(0,lastSpace+1)));
      const ending=document.createElement('span'); ending.className='aire-media-title-ending'; ending.textContent=captionText.slice(lastSpace+1); caption.append(ending);
      const visual=document.createElement('span'); visual.className='aire-media-visual';
      const play=document.createElement('span'); play.className='aire-media-play'; play.textContent='▶'; play.setAttribute('aria-hidden','true');
      button.setAttribute('aria-label',`${words()[2]}: ${title(v)}`); visual.append(image,play); button.append(visual,caption);
      button.addEventListener('click',()=>{
        opener=button; previousOverflow=document.body.style.overflow;
        const frame=document.createElement('iframe'); frame.src=`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0&playsinline=1`; frame.title=title(v); frame.allow='autoplay; encrypted-media; picture-in-picture; fullscreen'; frame.allowFullscreen=true; frame.referrerPolicy='strict-origin-when-cross-origin';
        player.replaceChildren(frame); dialog.showModal(); document.body.style.overflow='hidden'; close.focus();
      }); grid.append(button);
    });
    more.textContent=words()[0]; more.hidden=expanded||videos.length<=3; close.setAttribute('aria-label',words()[1]);
  };
  more.addEventListener('click',()=>{expanded=true;render();grid.children[3]?.focus();});
  new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  section.hidden=false; render();
})();
