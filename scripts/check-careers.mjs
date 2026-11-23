import assert from 'node:assert/strict';
import { readFileSync,existsSync,readdirSync,statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const addition='<p style="margin:18px 0 0;font-size:12px;letter-spacing:.08em"><a href="/careers/" lang="ko">채용안내</a></p>\n';
let count=0;
for(const file of readdirSync(root).filter(f=>f.endsWith('.html'))){
 const current=readFileSync(path.join(root,file),'utf8');
 const original=execFileSync('git',['show',`a17be6a0049ec4b998bd0aa8fb1ef4046c2909aa:${file}`],{cwd:root,encoding:'utf8'});
 assert.equal(current.replace(addition,''),original,`${file}: existing content changed`);
 if(current.includes(addition))count++;
}
for(const relative of ['careers/index.html','careers/apply/index.html']){
 const html=readFileSync(path.join(root,relative),'utf8');assert.match(html,/<html lang="ko">/);assert.match(html,/<h1>/);assert.match(html,/name="viewport"/);assert.match(html,/rel="canonical"/);
 for(const match of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)){let file=path.join(root,match[1].split(/[?#]/)[0]);assert.ok(existsSync(file),`missing asset/link ${file}`);if(statSync(file).isDirectory())assert.ok(existsSync(path.join(file,'index.html')));}
}
const form=readFileSync(path.join(root,'careers/apply/index.html'),'utf8');for(const name of ['name','phone','experience','workType','consent'])assert.ok(new RegExp(`name="${name}"[^>]*required`).test(form),`required ${name}`);
assert.ok(!/name="field"/.test(form));assert.ok(!/type="file"/.test(form));assert.match(form,/id="application-form" hidden/);
const js=readFileSync(path.join(root,'careers/careers.js'),'utf8');assert.ok(!/(localStorage|sessionStorage|innerHTML)/.test(js));assert.ok(js.includes("credentials:'omit'"));
console.log(`PASS: ${count} footer links; existing page content and reservation links unchanged; Korean pages, form requirements, local links, assets, metadata, no browser draft storage.`);
