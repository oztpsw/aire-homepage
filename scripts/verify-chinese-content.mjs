import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const groups=[['en.html','zh.html'],['en-about.html','zh-about.html'],['en-menu.html','zh-menu.html'],['private-spa-gangnam.html','private-spa-gangnam-zh.html'],['privacy.html','zh-privacy.html']];
for(const[source,target]of groups){
 const s=fs.readFileSync(source,'utf8'),t=fs.readFileSync(target,'utf8');
 assert(t.includes('<html lang="zh-CN">'));
 assert.equal((t.match(/<h1\b/g)||[]).length,1,target);
 assert(t.includes(`rel="canonical" href="https://airespaseoul.com/${target}"`));
 assert(!/const (?:T|copy|MENU_DETAILS)=/.test(t),'Chinese HTML must not be overwritten by old dictionaries');
 const srcs=x=>[...x.matchAll(/<(?:img|source|video)\b[^>]*\b(?:src|srcset)="([^"]+)"/g)].map(m=>m[1]);
 assert.deepEqual(srcs(t),srcs(s),`Real assets preserved: ${target}`);
 for(const match of t.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){
  if(match[1].includes('application/ld+json'))JSON.parse(match[2]);
  else new vm.Script(match[2]);
 }
 const text=t.replace(/<div class="lang">[\s\S]*?<\/div>/g,'').replace(/<(?:script|style)\b[^>]*>[\s\S]*?<\/(?:script|style)>/g,'').replace(/<[^>]*>/g,'');
 assert(!/[\uac00-\ud7af]/.test(text.replaceAll('시사와이드경제','')),`Untranslated Korean: ${target}`);
 assert(!/[\u3040-\u30ff]/.test(text),`Untranslated Japanese: ${target}`);
 if(target==='zh-about.html'){
  assert(t.includes('"@type": "AboutPage"'));assert(!t.includes('NewsArticle'));
  assert(t.includes('本页摘要及引语由本站译为中文。'));
 }
 if(target!=='zh-privacy.html')assert.equal((t.match(/hreflang="zh-CN"/g)||[]).length,2,'head alternate + switch');
 console.log(`Content, assets and schema: ${target}`);
}
for(const f of ['chinese-page.js','analytics-consent.js','localized-polish.js'])new vm.Script(fs.readFileSync(f,'utf8'));
