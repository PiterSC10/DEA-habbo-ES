/* DEA: sesión por navegador, renovada tras 5 minutos sin actividad. */
(()=>{'use strict';
 const KEY='dea-visit-session-v2',LIMIT=5*60*1000,nf=new Intl.NumberFormat('es-ES');let latest=null,inflight=false,lastSync=0;
 const random=()=>{const b=new Uint8Array(16);crypto.getRandomValues(b);return Array.from(b,x=>x.toString(16).padStart(2,'0')).join('')};
 function load(){try{return JSON.parse(sessionStorage.getItem(KEY)||'null')}catch{return null}}
 function save(s){try{sessionStorage.setItem(KEY,JSON.stringify(s))}catch{}}
 function session(){const now=Date.now();let s=load();if(!s||! /^[a-f0-9]{32}$/.test(s.id||'')||now-(s.last||0)>=LIMIT||now<(s.last||0)){s={id:random(),last:now};save(s);return {id:s.id,newSession:true}}s.last=now;save(s);return {id:s.id,newSession:false}}
 function paint(){for(const el of document.querySelectorAll('.dea-plate')){const strong=el.querySelector('strong'),label=el.querySelector('span');if(!strong||!label)continue;const total=latest?nf.format(latest.total):'—',message=latest?'VISITAS REGISTRADAS · HOY '+nf.format(latest.hoy):'Contador temporalmente no disponible';if(strong.textContent!==total)strong.textContent=total;if(label.textContent!==message)label.textContent=message}}
 async function sync(force=false){if(inflight||document.hidden)return;const now=Date.now();if(!force&&now-lastSync<15000)return;inflight=true;lastSync=now;const s=session();try{const response=await fetch('/api/visitas',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({session:s.id})});if(!response.ok)throw Error('status '+response.status);const data=await response.json();if(!Number.isSafeInteger(data.total)||!Number.isSafeInteger(data.hoy))throw Error('invalid');latest=data}catch(e){console.warn('DEA: contador no disponible',e);latest=null}finally{inflight=false;paint()}}
 const root=document.getElementById('app');if(root)new MutationObserver(paint).observe(root,{childList:true,subtree:false});
 // A reload and route changes preserve the same session. Background polling never creates a new visit.
 void sync(true);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)void sync(true)});
 window.addEventListener('focus',()=>void sync(true));
 setInterval(()=>{if(!document.hidden){const s=load();if(s&&Date.now()-s.last<LIMIT){void fetch('/api/visitas').then(r=>r.ok?r.json():null).then(d=>{if(d&&Number.isSafeInteger(d.total)&&Number.isSafeInteger(d.hoy)){latest=d;paint()}}).catch(()=>{})}}},120000);
 // Track actual user interaction, not refreshes or timer ticks.
 let touch=0;const activity=()=>{const now=Date.now();if(now-touch<10000)return;touch=now;const s=load();if(s&&now-s.last>=LIMIT)void sync(true);else if(s){s.last=now;save(s)}};
 for(const type of ['pointerdown','keydown','scroll'])document.addEventListener(type,activity,{passive:true});
})();