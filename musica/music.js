(()=>{'use strict';
const canonical='https://agenciaoficialdea.es/musica';
const share=document.getElementById('music-share'),status=document.getElementById('music-share-status');
share?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(canonical);status.textContent='Enlace copiado. Comparte el ritmo DEA.';}catch{status.textContent='Comparte este enlace: '+canonical;}});
// Stop the third-party player before leaving, including back/forward cache navigation.
const frame=document.querySelector('iframe'),source=frame?.getAttribute('src');
window.addEventListener('pagehide',()=>{if(frame)frame.src='about:blank';});
window.addEventListener('pageshow',e=>{if(e.persisted&&frame&&source)frame.src=source;});
})();
