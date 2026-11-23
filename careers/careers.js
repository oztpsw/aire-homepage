(() => {
 'use strict';
 const api=window.AIRE_RECRUITMENT.api;
 const status=document.getElementById('recruitment-status'),apply=document.getElementById('apply-link'),form=document.getElementById('application-form');
 const statusText={active:'적극 채용 중',evergreen:'상시 지원 접수 중',paused:'현재 지원 접수를 잠시 중단했습니다.'};
 let catalog,requestKey=crypto.randomUUID(),token='',widgetId,busy=false,submitted=false;
 const feedback=document.getElementById('feedback');
 function message(text,success=false){if(!feedback)return;feedback.textContent=text;feedback.className='feedback '+(success?'success':'error');feedback.focus();}
 const errors={invalid:'필수 항목과 전화번호 형식을 확인해 주세요. 국내 휴대전화 또는 국가번호(+82 등)를 입력해 주세요.',challenge:'보안 확인을 다시 진행해 주세요.',rate_limit:'요청이 많습니다. 잠시 후 다시 시도해 주세요.',duplicate:'동일한 연락처로 최근 24시간 이내 접수된 지원서가 있습니다. 중복 제출은 제한됩니다. 접수 확인이나 수정은 아래 삭제·문의 연락처로 문의해 주세요.',conflict:'이전 제출 내용과 달라 접수하지 못했습니다. 페이지를 새로 연 뒤 다시 확인해 주세요.',closed:'현재 지원 접수가 중단되어 제출하지 못했습니다.',policy_changed:'개인정보 안내가 변경되었습니다. 새로고침하여 내용을 다시 확인하고 동의해 주세요.',unavailable:'접수 결과를 확인하지 못했습니다. 입력 내용은 이 화면에 유지됩니다. 잠시 후 다시 제출해 주세요.'};
 async function load(){
  try{
   const r=await fetch(api,{credentials:'omit',cache:'no-store',signal:AbortSignal.timeout(12000)});if(!r.ok)throw new Error();catalog=await r.json();
   status.textContent=statusText[catalog.status]||statusText.paused;
   const content=catalog.content?.ko||{};
   const details=document.getElementById('job-details');
   if(details){const labels={duties:'담당 업무',qualifications:'지원 자격·우대사항',location:'근무 장소',employment:'근무 형태',schedule:'근무일·시간',compensation:'급여·정산 방식',process:'채용 절차',notes:'기타 안내'};for(const [key,label] of Object.entries(labels)){if(!content[key]?.trim())continue;const row=document.createElement('div');row.className='job-row';const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=content[key];row.append(dt,dd);details.append(row);}document.getElementById('job-empty').hidden=details.children.length>0;if(content.intro)document.getElementById('intro-text').textContent=content.intro;}
   const open=catalog.status!=='paused'&&(catalog.retentionMode==='decision'||catalog.retentionDays)&&content.privacy&&content.privacyContact&&catalog.siteKey;
   if(apply)apply.hidden=!open;
   if(form&&open){document.getElementById('privacy-text').textContent=content.privacy;document.getElementById('retention').textContent=catalog.retentionMode==='decision'?'보유기간: 채용 절차 종료 시까지. 종료 시 지원서와 관련 개인정보를 삭제합니다.':`보유기간: 접수일로부터 ${catalog.retentionDays}일. 기간 만료 후 삭제합니다.`;document.getElementById('privacy-contact').textContent=`삭제 요청·지원 문의: ${content.privacyContact}`;form.hidden=false;loadChallenge();}
  }catch{status.textContent='채용 안내를 불러오지 못했습니다. 잠시 후 새로고침해 주세요.';}
 }
 function loadChallenge(){
  window.aireRecruitmentReady=()=>{widgetId=window.turnstile.render('#challenge',{sitekey:catalog.siteKey,action:'recruitment',language:'ko',callback:v=>{token=v;},'expired-callback':()=>{token='';},'error-callback':()=>{token='';message('보안 확인을 불러오지 못했습니다. 네트워크 상태를 확인하고 새로고침해 주세요.');}});};
  const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?onload=aireRecruitmentReady&render=explicit';script.async=true;script.defer=true;script.onerror=()=>message('보안 확인을 불러오지 못했습니다. 새로고침해 주세요.');document.head.append(script);
 }
 if(form){
  form.addEventListener('submit',async event=>{event.preventDefault();if(busy||submitted||!form.reportValidity())return;if(!token){message('보안 확인을 완료한 뒤 제출해 주세요.');return;}
   const values=Object.fromEntries(new FormData(form));const payload={...values,consent:form.elements.consent.checked,locale:'ko',requestKey,policyVersion:catalog.policyVersion,token};
   busy=true;const button=form.querySelector('button[type=submit]');button.disabled=true;button.textContent='접수 중…';
   try{const r=await fetch(api,{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(20000)});const result=await r.json();if(!r.ok){message(errors[result.code]||errors.unavailable);return;}if(!result.ok||!/^AIR-[A-F0-9]{32}$/.test(result.receipt))throw new Error();submitted=true;form.reset();form.hidden=true;message(`지원서가 접수되었습니다. 접수번호: ${result.receipt}\n접수번호를 따로 보관해 주세요. 검토 후 입력하신 연락처로 안내드립니다.`,true);requestKey=crypto.randomUUID();}
   catch{message(errors.unavailable);}finally{busy=false;button.disabled=false;button.textContent='지원서 제출하기';token='';if(widgetId!==undefined&&window.turnstile)window.turnstile.reset(widgetId);}
  });
  // No draft, phone, name or consent data is persisted in local/session storage.
  window.addEventListener('pagehide',()=>{form.reset();token='';});
  window.addEventListener('pageshow',event=>{if(event.persisted){form.reset();requestKey=crypto.randomUUID();location.reload();}});
 }
 load();
})();
