// Run with NODE_PATH pointing to an installed Playwright; no site runtime dependency.
const {chromium,webkit}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const base=process.env.AIRE_TEST_URL||'http://localhost:8765/';
const out=process.env.AIRE_TEST_OUTPUT||'/tmp/aire-chinese-qa';
fs.mkdirSync(out,{recursive:true});
const chinese=['zh.html','zh-about.html','zh-menu.html','private-spa-gangnam-zh.html','zh-privacy.html'];
const old=['index.html','en.html','ja.html','about.html','en-about.html','ja-about.html','menu.html','en-menu.html','ja-menu.html','private-spa-gangnam.html','private-spa-gangnam-ko.html','private-spa-gangnam-ja.html'];
(async()=>{
 const browser=await chromium.launch();const report=[];
 for(const width of [320,360,390,430,768,1024,1440]){
  const page=await browser.newPage({viewport:{width,height:844},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const file of chinese){
   await page.goto(base+file,{waitUntil:'networkidle'});
   assert.equal(await page.locator('html').getAttribute('lang'),'zh-CN');
   assert.equal(await page.locator('h1').count(),1);
   const metrics=await page.evaluate(()=>{
    const bad=[...document.body.querySelectorAll('*')].filter(el=>{
     if(el.closest('script,style,.primary-nav')||(el.tagName==='IMG'&&el.parentElement.matches('.hero')))return false;
     const r=el.getBoundingClientRect(),cs=getComputedStyle(el);
     return r.width>0&&r.height>0&&cs.visibility!=='hidden'&&(r.left< -1||r.right>innerWidth+1);
    }).map(el=>({tag:el.tagName,cls:el.className,text:el.textContent.slice(0,70),x:el.getBoundingClientRect().x,width:el.getBoundingClientRect().width}));
    const h=document.querySelector('.site-header'),logo=h?.querySelector('.logo').getBoundingClientRect(),act=h?.querySelector('.header-actions').getBoundingClientRect();
    return {bad,headerOverlap:logo&&act?logo.right>act.left+1:false,scrollWidth:document.documentElement.scrollWidth,width:innerWidth};
   });
   report.push({file,width,...metrics,errors:[...errors]});
   if(metrics.bad.length||metrics.headerOverlap)console.log('LAYOUT',file,width,JSON.stringify(metrics));
   if(width<=430&&file!=='zh-privacy.html'){
    await page.locator('.menu-toggle').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
    await page.locator('.primary-nav a').first().waitFor({state:'visible'});
    await page.keyboard.press('Escape');assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
   }
   if([320,390,1440].includes(width)){
    await page.screenshot({path:`${out}/${file}-${width}-top.png`,fullPage:width>720});
    for(const [label,selector]of file==='zh-menu.html'?[['couple','#couple'],['facial','.facial-care-group'],['combo','.face-body-group'],['additional','#additional']]:file==='zh-about.html'?[['quote','.interview-body'],['story','.story']]:file==='zh.html'?[['programs','#programs'],['booking','#reservation']]:[]){
     await page.locator(selector).scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/${file}-${width}-${label}.png`});
    }
   }
   if(file==='zh-about.html'){
    const dims=await page.locator('.interview-portrait img').evaluate(el=>({w:el.clientWidth,h:el.clientHeight,nw:el.naturalWidth,nh:el.naturalHeight}));
    assert(dims.nw>0);assert(Math.abs(dims.w/dims.h-dims.nw/dims.nh)<.01);
   }
   if(file==='private-spa-gangnam-zh.html'){
    await page.locator('summary').first().click();assert(await page.locator('details').first().getAttribute('open')!==null);
   }
  }
  await page.close();
 }
 // Existing languages: navigation, fourth language, and header regression.
 for(const width of [320,390,1440]){
  const page=await browser.newPage({viewport:{width,height:844},reducedMotion:'reduce'});
  for(const file of old){
   await page.goto(base+file,{waitUntil:'domcontentloaded'});
   const overlap=await page.locator('header').evaluate(h=>h.querySelector('.logo').getBoundingClientRect().right>h.querySelector('.header-actions').getBoundingClientRect().left+1);
   assert(!overlap,`Header overlap ${file} ${width}`);
   await page.locator('.lang a[hreflang="zh-CN"]').click();await page.waitForURL(/(?:zh|zh-about|zh-menu|private-spa-gangnam-zh)\.html/);
   assert.equal(await page.locator('html').getAttribute('lang'),'zh-CN');
  }await page.close();
 }
 // Chinese -> existing languages and section anchors; never submit a booking.
 const p=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await p.goto(base+'menu.html');
 const factual=await p.locator('.course-price,.sig-time,.sig-price').evaluateAll(els=>els.map(e=>e.textContent.match(/[0-9,]+/g)));
 await p.goto(base+'zh-menu.html');
 assert.deepEqual(await p.locator('.course-price,.sig-time,.sig-price').evaluateAll(els=>els.map(e=>e.textContent.replaceAll('两人合计','2').match(/[0-9,]+/g))),factual,'All current Korean course durations, prices and guest counts preserved');
 for(const file of chinese.slice(0,4)){
  for(const lang of ['ko','en','ja']){
   await p.goto(base+file);await p.locator(`.lang a[lang="${lang}"]`).click();await p.waitForLoadState('domcontentloaded');
   assert.equal(await p.locator('html').getAttribute('lang'),lang);
  }
 }
 await p.goto(base+'zh-menu.html');await p.locator('.tabs a[href="#facial"]').click();
 assert(await p.locator('#facial').evaluate(el=>el.getBoundingClientRect().top<innerHeight));
 await p.locator('.mobile-reserve').click();await p.waitForURL('**/zh.html#reservation');
 const direct=await p.locator('[data-direct-booking]').getAttribute('href');assert(direct.endsWith('?lang=en'));
 assert((await p.locator('[data-direct-booking]').innerText()).includes('英语页面'));
 await p.locator('.analytics-privacy-link').click();await p.waitForURL('**/zh-privacy.html');
 await browser.close();
 fs.writeFileSync(out+'/report.json',JSON.stringify(report,null,2));
 const failures=report.filter(r=>r.bad.length||r.headerOverlap||r.errors.length);
 console.log(JSON.stringify({screens:report.length,legacySwitches:old.length*3,failures:failures.length,output:out}));
 if(failures.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
