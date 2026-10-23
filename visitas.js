/* DEA: actividad compartida entre pestañas; nueva visita tras 5 minutos inactivo. */
(()=>{'use strict';
 const KEY='dea-visit-session-v3',OLD='dea-visit-session-v2',LIMIT=300000,nf=new Intl.NumberFormat('es-ES');
 let memory=null,latest=null,inflight=false,lastRead=0,retryAfter=0;
 const random=()=>{const b=new Uint8Array(16);crypto.getRandomValues(b);return Array.from(b,x=>x.toString(16).padStart(2,'0')).join('')};
 function load(){try{return JSON.parse(localStorage.getItem(KEY)||'null')||memory}catch{return memory}}
 function save(s){memory=s;try{localStorage.setItem(KEY,JSON.stringify(s))}catch{}}
 function session(){const now=Date.now();let s=load();if(!s){try{const old=JSON.parse(sessionStorage.getItem(OLD)||'null');if(old&&now-old.last<LIMIT)s={id:old.id,last:old.last,registered:false}}catch{}}
  if(!s||! /^[a-f0-9]{32}$/.test(s.id||'')||!Number.isFinite(s.last)||now-s.last>=LIMIT||now<s.last)s={id:random(),last:now,registered:false};
  s.last=now;save(s);return s;
 }
 function paint(){for(const el of document.querySelectorAll('.dea-plate')){const strong=el.querySelector('strong'),label=el.querySelector('span');if(!strong||!label)continue;const total=latest?nf.format(latest.total):'—',message=latest?'VISITAS REGISTRADAS · HOY '+nf.format(latest.hoy):'Contador temporalmente no disponible';if(strong.textContent!==total)strong.textContent=total;if(label.textContent!==message)label.textContent=message}}
 async function request(){const s=session(),now=Date.now();if(s.registered&&latest&&now-lastRead<60000){paint();return;}
  const response=await fetch('/api/visitas',s.registered?{method:'GET'}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({session:s.id})});
  if(!response.ok)throw Error('status '+response.status);const data=await response.json();if(!Number.isSafeInteger(data.total)||!Number.isSafeInteger(data.hoy)||data.total<0||data.hoy<0)throw Error('invalid');
  latest=data;lastRead=Date.now();retryAfter=0;
  // Mark acknowledged only after success; failed writes retry the SAME random ID.
  const current=load();if(current?.id===s.id){current.registered=true;save(current)}paint();
 }
 async function sync(){if(inflight||document.hidden||Date.now()<retryAfter)return;inflight=true;try{if(navigator.locks?.request)await navigator.locks.request('dea-visit-register',request);else await request()}catch(e){retryAfter=Date.now()+15000;console.warn('DEA: contador no disponible',e);paint()}finally{inflight=false}}
 const root=document.getElementById('app');if(root)new MutationObserver(paint).observe(root,{childList:true,subtree:false});
 function activity(){const before=load(),now=Date.now(),expired=!before||now-before.last>=LIMIT||now<before.last;session();if(expired||!before?.registered)void sync()}
 for(const type of ['pointerdown','keydown','scroll'])document.addEventListener(type,activity,{passive:true});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)void sync()});window.addEventListener('focus',()=>void sync());
 // No polling and no timer-created visits. Navigation only repaints the shared count.
 void sync();
})();
