/* DEA: actividad compartida entre pestañas; nueva visita tras 5 minutos inactivo. */
(()=>{'use strict';
 const KEY='dea-visit-session-v3',OLD='dea-visit-session-v2',LIMIT=300000,nf=new Intl.NumberFormat('es-ES');
 let memory=null,latest=null,inflight=false,lastRead=0,retryAfter=0,state='loading',retries=0,retryTimer=null;
 const random=()=>{const b=new Uint8Array(16);crypto.getRandomValues(b);return Array.from(b,x=>x.toString(16).padStart(2,'0')).join('')};
 function load(){try{return JSON.parse(localStorage.getItem(KEY)||'null')||memory}catch{return memory}}
 function save(s){memory=s;try{localStorage.setItem(KEY,JSON.stringify(s))}catch{}}
 function session(){const now=Date.now();let s=load();if(!s){try{const old=JSON.parse(sessionStorage.getItem(OLD)||'null');if(old&&now-old.last<LIMIT)s={id:old.id,last:old.last,registered:false}}catch{}}
  if(!s||! /^[a-f0-9]{32}$/.test(s.id||'')||!Number.isFinite(s.last)||now-s.last>=LIMIT||now<s.last)s={id:random(),last:now,registered:false};
  s.last=now;save(s);return s;
 }
 function paint(){for(const el of document.querySelectorAll('.dea-plate')){const strong=el.querySelector('strong'),label=el.querySelector('span'),button=el.querySelector('[data-visitas-retry]');if(!strong||!label)continue;const total=latest?nf.format(latest.total):'—';const message=latest?'VISITAS REGISTRADAS · HOY '+nf.format(latest.hoy)+(state==='error'?' · Actualización pendiente':''):state==='error'?'No se pudo consultar el contador. Puedes reintentar.':'Consultando visitas reales…';if(strong.textContent!==total)strong.textContent=total;if(label.textContent!==message)label.textContent=message;if(button)button.hidden=state!=='error'}}
 async function fetchCounts(options){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);try{const response=await fetch('/api/visitas',{...options,signal:controller.signal});if(!response.ok)throw Error('status '+response.status);const data=await response.json();if(!Number.isSafeInteger(data.total)||!Number.isSafeInteger(data.hoy)||data.total<0||data.hoy<0)throw Error('invalid');return data}finally{clearTimeout(timer)}}
 function acceptCounts(data){const previous=latest||load()?.counts;if(previous&&Number.isSafeInteger(previous.total)&&Number.isSafeInteger(previous.hoy)&&typeof previous.fecha==='string'){const newer=previous.fecha>data.fecha?previous:data;latest={...newer,total:Math.max(data.total,previous.total),hoy:previous.fecha===data.fecha?Math.max(data.hoy,previous.hoy):newer.hoy}}else latest=data;lastRead=Date.now()}

 async function request(){const s=session(),now=Date.now();if(s.registered&&latest&&now-lastRead<60000){paint();return;}
  const data=await fetchCounts(s.registered?{method:'GET'}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({session:s.id})});
  acceptCounts(data);retryAfter=0;state='ready';retries=0;
  // Mark acknowledged only after success; failed writes retry the SAME random ID.
  const current=load();if(current?.id===s.id){current.registered=true;current.counts=latest;save(current)}paint();
 }
 async function sync(){if(inflight||document.hidden||Date.now()<retryAfter)return;inflight=true;state='loading';paint();try{if(navigator.locks?.request){let entered=false;try{await navigator.locks.request('dea-visit-register',()=>{entered=true;return request()})}catch(e){if(entered)throw e;await request()}}else await request()}catch(e){
  // A failed write need not prevent displaying a real, read-only total.
  if(!latest&&!load()?.registered){try{acceptCounts(await fetchCounts({method:'GET'}));const current=load();if(current){current.counts=latest;save(current)}}catch{}}
  state='error';console.warn('DEA: contador no disponible',e);paint();const delay=[1500,5000,15000][retries++];retryAfter=Date.now()+(delay??15000);if(delay!==undefined){clearTimeout(retryTimer);retryTimer=setTimeout(()=>{retryAfter=0;void sync()},delay)}
 }finally{inflight=false}}
 document.addEventListener('click',e=>{if(!e.target.closest?.('[data-visitas-retry]'))return;clearTimeout(retryTimer);retries=0;retryAfter=0;void sync()});
 window.addEventListener('online',()=>{clearTimeout(retryTimer);retries=0;retryAfter=0;void sync()});
 const root=document.getElementById('app');if(root)new MutationObserver(paint).observe(root,{childList:true,subtree:false});
 function activity(){const before=load(),now=Date.now(),expired=!before||now-before.last>=LIMIT||now<before.last;session();if(expired||!before?.registered)void sync()}
 for(const type of ['pointerdown','keydown','scroll'])document.addEventListener(type,activity,{passive:true});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)void sync()});window.addEventListener('focus',()=>void sync());
 // No polling and no timer-created visits. Navigation only repaints the shared count.
 latest=load()?.counts||null;paint();void sync();
})();
