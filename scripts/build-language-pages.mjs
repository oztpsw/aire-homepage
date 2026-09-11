import fs from 'node:fs';
import vm from 'node:vm';

const languages = ['en', 'ja'];
const locales = { ko: 'ko_KR', en: 'en_US', ja: 'ja_JP' };
const files = {
  index: { ko: 'index.html', en: 'en.html', ja: 'ja.html' },
  about: { ko: 'about.html', en: 'en-about.html', ja: 'ja-about.html' },
  menu: { ko: 'menu.html', en: 'en-menu.html', ja: 'ja-menu.html' }
};
const metadata = {
  index: {
    en: {
      title: 'AIRE SPA & AESTHETIC | Official Website',
      description: 'AIRE SPA & AESTHETIC is a reservation-based, non-medical spa in Gangnam offering private rooms and body and facial treatments in Gangnam, Seoul.'
    },
    ja: {
      title: 'ソウル・江南のプライベートスパ | AIRE SPA',
      description: 'アイレスパはソウル・江南の予約制プライベートスパです。個別シャワーを備えた個室で、ボディマッサージとフェイシャルケアをご提供します。'
    }
  },
  about: {
    en: {
      title: 'Private Spa Rooms in Gangnam | About AIRE SPA',
      description: 'Learn about AIRE SPA in Gangnam, Seoul: reservation-only body and facial care in private single and couple rooms, each with its own shower area.'
    },
    ja: {
      title: '江南の個室スパ | AIRE SPAについて',
      description: 'ソウル・江南のAIRE SPAは完全予約制です。個別シャワーを備えた1名様用・2名様用の個室で、ボディとフェイシャルのケアをご提供します。'
    }
  },
  menu: {
    en: {
      title: 'Body Massage & Facial Care in Gangnam | AIRE SPA',
      description: 'View AIRE SPA body massage, couple care and facial programs in Gangnam, Seoul, with treatment durations, inclusions and prices in Korean won.'
    },
    ja: {
      title: '江南のボディマッサージ・フェイシャル | AIRE SPA',
      description: 'ソウル・江南のAIRE SPAが提供するボディマッサージ、カップルケア、フェイシャルの施術時間・内容・料金をご案内します。'
    }
  }
};

function extractObject(source, marker) {
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Missing ${marker}`);
  const objectStart = source.indexOf('{', start);
  let depth = 0;
  let quote = '';
  let escaped = false;
  for (let i = objectStart; i < source.length; i += 1) {
    const char = source[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = '';
      continue;
    }
    if (char === "'" || char === '"' || char === '`') quote = char;
    else if (char === '{') depth += 1;
    else if (char === '}' && --depth === 0) {
      return vm.runInNewContext(`(${source.slice(objectStart, i + 1)})`);
    }
  }
  throw new Error(`Unclosed object after ${marker}`);
}

function urlFor(file) {
  return file === 'index.html' ? 'https://airespaseoul.com/' : `https://airespaseoul.com/${file}`;
}

function languageLinks(page) {
  return ['ko', 'en', 'ja'].map(lang =>
    `<link rel="alternate" hreflang="${lang}" href="${urlFor(files[page][lang])}">`
  ).concat(`<link rel="alternate" hreflang="x-default" href="${urlFor(files[page].ko)}">`).join('\n');
}

function setMetadata(html, page, lang) {
  const meta = metadata[page][lang];
  const pageUrl = urlFor(files[page][lang]);
  html = html.replace(/<link rel="alternate" hreflang="(?:ko|en|ja|x-default)" href="[^"]+">\n?/g, '');
  html = html.replace('<html lang="ko">', `<html lang="${lang}">`)
    .replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${meta.description}">`)
    .replace(/<link rel="canonical" href="[^"]+">/, `<link rel="canonical" href="${pageUrl}">\n${languageLinks(page)}`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${meta.title}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${meta.description}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${pageUrl}">`)
    .replace(/<meta property="og:locale" content="[^"]*">/, `<meta property="og:locale" content="${locales[lang]}">`)
    .replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${meta.title}">`)
    .replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${meta.description}">`)
    .replaceAll('"inLanguage": "ko"', `"inLanguage": "${lang}"`);
  if (page !== 'index') {
    html = html.replaceAll(`https://airespaseoul.com/${files[page].ko}#webpage`, `${pageUrl}#webpage`)
      .replaceAll(`https://airespaseoul.com/${files[page].ko}",`, `${pageUrl}",`)
      .replace(/"name": "[^"]+",\n  "description"/, `"name": "${meta.title}",\n  "description"`)
      .replace(/"description": "[^"]+",\n  "inLanguage"/, `"description": "${meta.description}",\n  "inLanguage"`);
  }
  return html;
}

function setLinks(html, page, lang) {
  const home = files.index[lang];
  const about = files.about[lang];
  const menu = files.menu[lang];
  html = html.replaceAll('href="about.html"', `href="${about}"`)
    .replaceAll('href="menu.html"', `href="${menu}"`)
    .replaceAll('href="index.html#', `href="${home}#`);
  if (page === 'index') html = html.replace(/href="#top"/, `href="${home}#top"`);
  const destinations = JSON.stringify({ ko: files[page].ko, en: files[page].en, ja: files[page].ja });
  const navigation = `<script>\nconst languagePageUrls=${destinations};\ndocument.querySelectorAll('.lang button').forEach(button=>button.addEventListener('click',()=>{const target=languagePageUrls[button.dataset.lang];if(target&&location.pathname.split('/').pop()!==target)location.href=target},{capture:true}));\n</script>\n`;
  if (html.includes('const languagePageUrls=')) {
    html = html.replace(/const languagePageUrls=\{[^;]+\};/, `const languagePageUrls=${destinations};`);
  } else {
    html = html.replace('</body>', `${navigation}</body>`);
  }
  return html.replaceAll("||'ko'", `||'${lang}'`)
    .replaceAll("setLang('ko');", `setLang('${lang}');`)
    .replaceAll("render('ko');", `render('${lang}');`);
}

function setElementByDataKey(html, key, value) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return html.replace(new RegExp(`(<([a-z0-9]+)[^>]*data-i18n="${escaped}"[^>]*>)[\\s\\S]*?(<\\/\\2>)`, 'i'), `$1${value}$3`);
}

function localizeIndex(html, lang) {
  const copy = extractObject(html, 'const copy=');
  for (const [key, value] of Object.entries(copy[lang])) html = setElementByDataKey(html, key, value);
  const address = copy[lang].locationAddress;
  html = html.replace(/(<div class="footer-brand-block">[\s\S]*?<p>)[\s\S]*?(<\/p>)/, `$1${address}$2`);
  return html;
}

function setElementById(html, id, value) {
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return html.replace(new RegExp(`(<([a-z0-9]+)[^>]*id="${escaped}"[^>]*>)[\\s\\S]*?(<\\/\\2>)`, 'i'), `$1${value}$3`);
}

function localizeAbout(html, lang) {
  const translations = extractObject(html, 'const T=');
  for (const [id, value] of Object.entries(translations[lang])) html = setElementById(html, id, value);
  return html;
}

function money(lang, amount) { return lang === 'en' ? `KRW ${amount}` : `${amount}ウォン`; }
function priceGrid(lang, rows) {
  return `<div class="price-grid">${rows.map(row => `<div class="price"><span>${row[0]}</span><strong>${money(lang, row[1])}</strong></div>`).join('')}</div>`;
}
function signature(lang, name, time, price, items) {
  return `<article class="signature"><div class="sig-top"><h4>${name}</h4><span class="sig-time">${time}</span><strong class="sig-price">${money(lang, price)}</strong></div><div class="included">${items.map(item => `<span>${item}</span>`).join('')}</div></article>`;
}

function menuContent(t, lang) {
  const minutes = lang === 'ja' ? '分' : ' min';
  const labels = lang === 'ja'
    ? { body:'全身ボディケア',scrub:'ソルトスクラブ',mask:'マスクパック',lift:'リフティングトリートメント（FACE）',energy:'エナジーリチュアル',spa:'スパ入浴',head:'ヘッドスパ' }
    : { body:'Full Body Care',scrub:'Salt Scrub',mask:'Facial Mask',lift:'Lifting Treatment (FACE)',energy:'Energy Ritual',spa:'Spa Bathing',head:'Head Spa' };
  const name = (en, ja) => lang === 'ja' ? ja : en;
  return `<section class="section" id="body"><div class="section-head"><h2>${t.bodyTitle}</h2><p>${t.bodyLead}</p></div>
<article class="program"><div class="program-name"><div class="eyebrow">BODY CARE</div><h3>${t.bodyName}</h3><p class="desc">${t.bodyDesc}</p></div><div>${priceGrid(lang,[['60'+minutes,'120,000'],['90'+minutes,'160,000'],['120'+minutes,'200,000'],['150'+minutes,'250,000']])}<div class="note">${t.add30}</div></div></article>
<article class="program"><div class="program-name"><div class="eyebrow">SIGNATURE</div><h3>${t.sigTitle}</h3><p class="desc">${t.sigDesc}</p></div><div class="signature-list">${signature(lang,'A SIGNATURE','150'+minutes,'270,000',[labels.body,labels.scrub,labels.mask,labels.lift])}${signature(lang,'B SIGNATURE','180'+minutes,'360,000',[labels.body,labels.scrub,labels.energy])}${signature(lang,'C SIGNATURE','240'+minutes,'480,000',[labels.spa,labels.body,labels.scrub,labels.energy,labels.head])}</div></article></section>
<section class="section" id="couple"><div class="section-head"><h2>${t.coupleTitle}</h2><p>${t.coupleLead}</p></div><article class="program"><div class="program-name"><div class="eyebrow">COUPLE CARE</div><h3>${t.coupleName}</h3><p class="desc">${t.coupleDesc}</p></div><div>${priceGrid(lang,[['90'+minutes,'310,000'],['120'+minutes,'390,000']])}</div></article></section>
<section class="section" id="facial"><div class="section-head"><h2>${t.facialTitle}</h2><p>${t.facialLead}</p></div><div class="two-col">
<article class="subcard"><h4>${t.facial}</h4><p class="process">${t.process1}</p>${priceGrid(lang,[[name('Energy Ritual · 60 min','エナジーリチュアル · 60分'),'120,000']])}</article>
<article class="subcard"><h4>${t.faceBody}</h4><p class="process">${t.process2}</p>${priceGrid(lang,[[name('Energy Ritual · 90 min','エナジーリチュアル · 90分'),'170,000'],[name('Energy Complete · 150 min','エナジーコンプリート · 150分'),'270,000'],[name('Line & Volume Ritual · 90 min','ライン＆ボリューム リチュアル · 90分'),'180,000'],[name('Line & Volume Complete · 150 min','ライン＆ボリューム コンプリート · 150分'),'280,000']])}</article></div>
<article class="program"><div class="program-name"><div class="eyebrow">ADDITIONAL</div><h3>${t.additional}</h3></div><div class="additional"><article class="subcard"><h4>${t.spa}</h4><p class="desc">${t.spaDesc}</p>${priceGrid(lang,[['30'+minutes,'50,000']])}</article><article class="subcard"><h4>${t.scrub}</h4><p class="desc">${t.scrubDesc}</p>${priceGrid(lang,[[name('Back 30 min','背面 30分'),'50,000'],[name('Full Body 60 min','全身 60分'),'80,000']])}</article></div></article></section>`;
}

function localizeMenu(html, lang) {
  const translations = extractObject(html, 'const T=');
  const t = translations[lang];
  for (const [id, value] of Object.entries(t)) html = setElementById(html, id, value);
  return html.replace(/(<div id="content">)[\s\S]*?(<\/div><\/div><\/section><section class="program-cta">)/, `$1${menuContent(t, lang)}$2`);
}

for (const page of Object.keys(files)) {
  const source = fs.readFileSync(files[page].ko, 'utf8');
  for (const lang of languages) {
    let output = page === 'index' ? localizeIndex(source, lang) : page === 'about' ? localizeAbout(source, lang) : localizeMenu(source, lang);
    output = setLinks(setMetadata(output, page, lang), page, lang);
    fs.writeFileSync(files[page][lang], output);
  }
}

console.log('Generated EN and JA pages from the existing approved translations.');
