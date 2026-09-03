import crypto from 'node:crypto';
import fs from 'node:fs';

const groups = [
  ['index.html', 'en.html', 'ja.html'],
  ['about.html', 'en-about.html', 'ja-about.html'],
  ['menu.html', 'en-menu.html', 'ja-menu.html']
];
const allFiles = groups.flat();
const landingPages = ['private-spa-gangnam.html', 'private-spa-gangnam-ko.html', 'private-spa-gangnam-ja.html'];

for (const group of groups) {
  const cssHashes = group.map(file => {
    const html = fs.readFileSync(file, 'utf8');
    const css = [...html.matchAll(/<style>[\s\S]*?<\/style>/g)].map(match => match[0]).join('\n');
    return crypto.createHash('sha256').update(css).digest('hex');
  });
  if (new Set(cssHashes).size !== 1) throw new Error(`CSS mismatch: ${group.join(', ')}`);
  console.log(`CSS identical: ${group.join(', ')}`);
}

for (const file of allFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const localLinks = [...html.matchAll(/(?:src|href)="([^"#]+)(?:#[^"]*)?"/g)]
    .map(match => match[1])
    .filter(link => !/^(?:https?:|tel:|\/)/.test(link));
  for (const link of localLinks) {
    const localPath = link.split(/[?#]/, 1)[0];
    if (!fs.existsSync(localPath)) throw new Error(`${file}: missing local target ${link}`);
  }
  const alternates = [...html.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)];
  if (alternates.length !== 4) throw new Error(`${file}: expected 4 hreflang links, found ${alternates.length}`);
  const languages = new Set(alternates.map(([unused, language]) => language));
  for (const language of ['ko', 'en', 'ja', 'x-default']) {
    if (!languages.has(language)) throw new Error(`${file}: missing hreflang ${language}`);
  }
}

for (const file of landingPages) {
  const html = fs.readFileSync(file, 'utf8');
  const localLinks = [...html.matchAll(/(?:src|href)="([^"#]+)(?:#[^"]*)?"/g)]
    .map(match => match[1])
    .filter(link => !/^(?:https?:|tel:|\/)/.test(link));
  for (const link of localLinks) {
    const localPath = link.split(/[?#]/, 1)[0];
    if (!fs.existsSync(localPath)) throw new Error(`${file}: missing local target ${link}`);
  }
  const url = `https://airespaseoul.com/${file}`;
  if (!html.includes(`<link rel="canonical" href="${url}">`)) throw new Error(`${file}: canonical URL mismatch`);
  const alternates = [...html.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)];
  if (alternates.length !== 4) throw new Error(`${file}: expected 4 hreflang links, found ${alternates.length}`);
  for (const language of ['ko', 'en', 'ja', 'x-default']) {
    if (!alternates.some(match => match[1] === language)) throw new Error(`${file}: missing hreflang ${language}`);
  }
}

const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
for (const file of allFiles) {
  const url = file === 'index.html' ? 'https://airespaseoul.com/' : `https://airespaseoul.com/${file}`;
  if (!sitemap.includes(`<loc>${url}</loc>`)) throw new Error(`sitemap missing ${url}`);
}
for (const file of landingPages) {
  const url = `https://airespaseoul.com/${file}`;
  if (!sitemap.includes(`<loc>${url}</loc>`)) throw new Error(`sitemap missing ${url}`);
}

console.log('Local links, hreflang sets, and sitemap entries valid.');
