(()=>{'use strict';
const canonical='https://agenciaoficialdea.es/musica';
const share=document.getElementById('music-share'),status=document.getElementById('music-share-status');
share?.addEventListener?.('click',async()=>{
 if(navigator.share){try{await navigator.share({title:'DEA MUSIC · Agencia Oficial DEA',text:'Escucha la banda sonora de nuestra agencia.',url:canonical});return;}catch(e){if(e?.name==='AbortError')return;}}
 try{await navigator.clipboard.writeText(canonical);status.textContent='✓ Enlace de DEA MUSIC copiado. ¡Compártelo!';}
 catch{status.textContent='Comparte este enlace: '+canonical;}
});
const frame=document.querySelector('iframe'),source=frame?.getAttribute('src');
window.addEventListener('pagehide',()=>{if(frame)frame.src='about:blank';});
window.addEventListener('pageshow',e=>{if(e.persisted&&frame&&source)frame.src=source;});
})();
