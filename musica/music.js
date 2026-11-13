(()=>{'use strict';
const canonical='https://agenciaoficialdea.es/musica';
const share=document.getElementById('music-share'),status=document.getElementById('music-share-status');
share?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(canonical);status.textContent='Enlace copiado. Comparte el ritmo DEA.';}catch{status.textContent='Comparte este enlace: '+canonical;}});

// Share controls: native iOS/Android share sheet, with clipboard fallback.
const playlistUrl='https://open.spotify.com/playlist/0eBQBwQuJU7YtfSDEReIIS';
const pageUrl='https://agenciaoficialdea.es/musica/';
const feedback=document.getElementById('music-share-feedback');
async function copyLink(url,label){
 try{await navigator.clipboard.writeText(url);if(feedback)feedback.textContent='✓ Enlace de '+label+' copiado. ¡Listo para compartir!';}
 catch{if(feedback)feedback.textContent='Copia este enlace: '+url;}
}
async function shareLink(url,title,label){
 if(navigator.share){try{await navigator.share({title,text:'Escucha DEA Music · La banda sonora de Agencia Oficial DEA',url});if(feedback)feedback.textContent='¡Gracias por compartir DEA Music!';return;}catch(e){if(e?.name==='AbortError')return;}}
 await copyLink(url,label);
}
document.getElementById('share-playlist')?.addEventListener('click',()=>shareLink(playlistUrl,'Playlist oficial DEA','la playlist'));
document.getElementById('share-page')?.addEventListener('click',()=>shareLink(pageUrl,'DEA Music · Agencia Oficial DEA','DEA Music'));
document.getElementById('copy-playlist')?.addEventListener('click',()=>copyLink(playlistUrl,'la playlist'));
document.getElementById('copy-page')?.addEventListener('click',()=>copyLink(pageUrl,'DEA Music'));

// Stop the third-party player before leaving, including back/forward cache navigation.
const frame=document.querySelector('iframe'),source=frame?.getAttribute('src');
window.addEventListener('pagehide',()=>{if(frame)frame.src='about:blank';});
window.addEventListener('pageshow',e=>{if(e.persisted&&frame&&source)frame.src=source;});
})();
