// Generate Chinese HTML from the current published EN layout; never run the legacy
// EN/JA renderer here. Exact-match translations fail closed when source copy changes.
import fs from 'node:fs';
const dict=JSON.parse(fs.readFileSync('scripts/i18n/zh-CN.json','utf8'));
const origin='https://airespaseoul.com/';
const pages=[
 ['en.html','zh.html','AIRE SPA & AESTHETIC｜首尔江南身体与面部护理','AIRE SPA 位于首尔江南，提供预约制身体按摩与面部护理。设有单人及双人独立护理室，每间配有淋浴区。'],
 ['en-about.html','zh-about.html','关于 AIRE SPA｜首尔江南 SPA','了解 AIRE SPA 的护理理念、单人和双人护理室，以及店长 Lee Jumi 的韩国媒体专访。'],
 ['en-menu.html','zh-menu.html','护理项目与价格｜AIRE SPA 首尔江南','查看 AIRE SPA 身体按摩、双人护理、面部护理及加项的时长、包含内容与韩元价格。'],
 ['private-spa-gangnam.html','private-spa-gangnam-zh.html','首尔江南 SPA · 独立护理室｜AIRE SPA','AIRE SPA 位于首尔江南，提供预约制身体与面部护理，设有单人和双人独立护理室，不提供医疗项目。'],
 ['privacy.html','zh-privacy.html','隐私说明｜AIRE SPA & AESTHETIC','AIRE SPA 网站访问分析与预约咨询处理的隐私说明。']
];
const names=Object.fromEntries(pages.map(([s,t])=>[s,t]));
const decode=s=>s.replaceAll('&amp;','&').replaceAll('&nbsp;','\u00a0').replaceAll('&quot;','"').replaceAll('&#39;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>');
const encode=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const keep=new Set(['EN','JP','KR','AIRE SPA','& AESTHETIC','AIRE SPA & AESTHETIC','Deeply Different.','시사와이드경제','→','↗','01','02','03','INSTAGRAM','WHATSAPP','@aire.spa.aesthetic','02-564-5455','010-2497-5455','A SIGNATURE','B SIGNATURE','C SIGNATURE','ENERGY RITUAL','ENERGY COMPLETE','LINE & VOLUME RITUAL','LINE & VOLUME COMPLETE','← AIRE SPA','_ga','_ga_<container-id>','简中','简体中文','中文','日本語','한국어']);
function translate(s){
 const key=decode(s).trim();
 if(!key)return s;
 let value=dict[key];
 if(value===undefined){
  if(keep.has(key))return s;
  if(key==='.')value='。';
  else if(/^\d+(?: \/ \d+)* min$/.test(key))value=key.replace(' min','分钟');
  else if(/^KRW [\d,]+(?: \/ 2 guests)?$/.test(key))value=key.replace('KRW ','').replace(' / 2 guests','韩元 / 两人合计')+(key.includes('guests')?'':'韩元');
  else if(/^FROM KRW [\d,]+$/.test(key))value=key.replace('FROM KRW ','')+'韩元起';
  else throw new Error('Missing Chinese translation: '+key);
 }
 return s.replace(s.trim(),encode(value));
}
function schemaTranslate(obj,title,description,target,source){
 if(Array.isArray(obj))return obj.map(v=>schemaTranslate(v,title,description,target,source));
 if(obj&&typeof obj==='object'){
  const out={...obj};
  for(const [k,v]of Object.entries(out)){
   if(k==='inLanguage')out[k]='zh-CN';
   else if(typeof v==='string'){
    if((k==='url'||k==='@id')&&v.startsWith(origin+source))out[k]=v.replace(origin+source,origin+target);
    else if(k==='name'&&['AboutPage','CollectionPage','WebPage'].includes(obj['@type']))out[k]=title;
    else if(k==='description')out[k]=description;
    else if(dict[v])out[k]=dict[v];
   }else out[k]=schemaTranslate(v,title,description,target,source);
  }
  return out;
 }
 return obj;
}
for(const[source,target,title,description]of pages){
 let html=fs.readFileSync(source,'utf8');
 html=html.replace(/<html lang="[^"]+"/,'<html lang="zh-CN"');
 html=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,block=>{
  if(block.includes('application/ld+json')){
   const data=JSON.parse(block.replace(/^.*?>/s,'').replace(/<\/script>$/,''));
   return '<script type="application/ld+json">\n'+JSON.stringify(schemaTranslate(data,title,description,target,source),null,2)+'\n</script>';
  }
  return block.includes('analytics-consent.js')||block.includes('localized-polish.js')||block.includes('language-switch.js')?block:'';
 });
 html=html.replace(/<title>[\s\S]*?<\/title>/,`<title>${encode(title)}</title>`);
 html=html.replace(/<meta\b[^>]*(?:name="(?:description|twitter:title|twitter:description)"|property="(?:og:title|og:description|og:url|og:locale)")[^>]*>/g,tag=>{
  const val=tag.includes('og:url')?origin+target:tag.includes('og:locale')?'zh_CN':tag.includes('title')?title:description;
  return tag.replace(/content="[^"]*"/,`content="${encode(val)}"`);
 });
 html=html.replace(/(<link rel="canonical" href=")[^"]+/,`$1${origin+target}`);
 // Translate actual body text only; CSS and structured data are not translation input.
 const start=html.search(/<body\b/);
 if(start<0)throw new Error('Missing body: '+source);
 let head=html.slice(0,start),body=html.slice(start);
 if(source==='en.html')body=body.replace(/(<p data-i18n="introText">)[\s\S]*?<\/p>/,'$1AIRE SPA &amp; AESTHETIC 位于<a href="private-spa-gangnam-zh.html">首尔江南，提供非医疗性质的 SPA 护理</a>。所有护理均需预约，身体和面部护理均在单人或双人独立护理室内进行。</p>');
 if(source==='en-about.html')body=body.replace(/(<p class="interview-summary">)[\s\S]*?<\/p>/,'$1首尔江南 AIRE SPA &amp; AESTHETIC 店长 Lee Jumi 接受韩国媒体《<span lang="ko">시사와이드경제</span>》专访，介绍身体按摩和独立护理室，并分享如何让客人在店内安心休息。</p>');
 // Explicit HTML replacements above have already been translated.
 body=body.replace(/(<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<!--[^]*?-->|<[^>]+>)|([^<]+)/g,(whole,tag,text)=>{
  if(tag)return tag;
  if(/[\u4e00-\u9fff]/.test(text)&&!/[\uac00-\ud7af]/.test(text))return text;
  return translate(text);
 });
 body=body.replace(/\b(alt|aria-label|title)="([^"]*)"/g,(m,k,v)=>`${k}="${v?translate(v):''}"`);
 // Chinese pages use real links; no runtime language substitution can overwrite them.
 body=body.replace(/<button\b[^>]*data-lang="(en|ja|ko)"[^>]*>[\s\S]*?<\/button>/g,(_,lang)=>{
  const root=source==='en.html'?{en:'en.html',ja:'ja.html',ko:'index.html'}:source==='en-about.html'?{en:'en-about.html',ja:'ja-about.html',ko:'about.html'}:{en:'en-menu.html',ja:'ja-menu.html',ko:'menu.html'};
  return `<a href="${root[lang]}" lang="${lang}" hreflang="${lang}">${{en:'EN',ja:'日本語',ko:'한국어'}[lang]}</a>`;
 });
 // Convert EN content links, excluding the language selector.
 body=body.replace(/href="([^"#]+)(#[^"]*)?"/g,(m,href,hash='')=>names[href]?`href="${names[href]}${hash}"`:m);
 // Restore original language switch destinations after translating content links.
 if(source!=='privacy.html')body=body.replace(/<div class="lang">[\s\S]*?<\/div>/,()=>{
  const group=source==='en.html'?['index.html','en.html','ja.html']:source==='en-about.html'?['about.html','en-about.html','ja-about.html']:source==='en-menu.html'?['menu.html','en-menu.html','ja-menu.html']:['private-spa-gangnam-ko.html','private-spa-gangnam.html','private-spa-gangnam-ja.html'];
  return `<div class="lang"><a href="${group[1]}" lang="en" hreflang="en">EN</a><a href="${group[2]}" lang="ja" hreflang="ja">日本語</a><a href="${group[0]}" lang="ko" hreflang="ko">한국어</a><a class="active" href="${target}" lang="zh-CN" hreflang="zh-CN" aria-label="简体中文" aria-current="page">中文</a></div>`;
 });
 body=body.replaceAll('href="index.html"','href="zh.html"');
 if(source!=='privacy.html')body=body.replace('href="zh.html" lang="ko"','href="index.html" lang="ko"');
 body=body.replaceAll('tel:025645455','tel:+8225645455').replaceAll('tel:01024975455','tel:+821024975455').replaceAll('>02-564-5455<','>+82 2-564-5455<').replaceAll('>010-2497-5455<','>+82 10-2497-5455<');
 if(source==='en.html')body=body.replace('310,000韩元起','310,000韩元起 / 两人合计');
 body=body.replace(/\sdata-i18n="[^"]*"/g,'');
 body=body.replace('<header class="site-header">','<header class="site-header has-chinese">');
 if(!head.includes('rel="canonical"'))head=head.replace('</head>',`<link rel="canonical" href="${origin+target}">\n</head>`);
 if(source!=='privacy.html'&&!head.includes('hreflang="zh-CN"'))head=head.replace('</head>',`<link rel="alternate" hreflang="zh-CN" href="${origin+target}">\n</head>`);
 if(!head.includes('href="language-switch.css'))head=head.replace('</head>','<link rel="stylesheet" href="language-switch.css?v=20261006-native">\n</head>');
 head=head.replace('</head>','<link rel="stylesheet" href="chinese.css">\n</head>');
 body=body.replace(/src="localized-polish\.js[^"]*"/g,'src="localized-polish.js?v=zh-20261006"').replace(/src="analytics-consent\.js[^"]*"/g,'src="analytics-consent.js?v=zh-20261006"');
 body=body.replace('</body>','<script src="chinese-page.js"></script>\n</body>');
 fs.writeFileSync(target,head+body);
 console.log(`Built ${target}`);
}
