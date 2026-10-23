/* Classic counter: one request per page load. No sessions, timers or retry buttons. */
(()=>{'use strict';
 const bytes=new Uint8Array(16);crypto.getRandomValues(bytes);
 const id=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join(''),nf=new Intl.NumberFormat('es-ES');
 let latest=null,failed=false;
 function paint(){for(const plate of document.querySelectorAll('.dea-plate')){const total=plate.querySelector('strong'),label=plate.querySelector('span');if(!total||!label)continue;total.textContent=latest?nf.format(latest.total):'—';label.textContent=latest?'VISITAS REGISTRADAS · HOY '+nf.format(latest.hoy):failed?'Visitas no disponibles en este momento.':'Consultando visitas reales…'}}
 async function register(){const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),15000);try{const response=await fetch('/api/visitas',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({session:id}),signal:controller.signal});if(!response.ok)throw Error('status '+response.status);const data=await response.json();if(!Number.isSafeInteger(data.total)||!Number.isSafeInteger(data.hoy)||data.total<0||data.hoy<0)throw Error('invalid');latest=data}catch{failed=true}finally{clearTimeout(timeout);paint()}}
 const root=document.getElementById('app');if(root)new MutationObserver(paint).observe(root,{childList:true,subtree:false});
 paint();void register();
})();
