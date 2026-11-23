/* Agencia Oficial DEA: bienvenida pública con FAQ y comandos nuevos. Sin pagos. */
(()=>{
 'use strict';
 const ENTRY_POPUPS_ENABLED=true;
 const LAVA_PROMO_END=Date.parse('2026-11-25T00:00:00+01:00'); // Fin del día del evento en España; noticia archivada.
 const lavaActive=()=>Date.now()<LAVA_PROMO_END;
 // Se muestra una vez por carga de página, aunque haya sido cerrado en una visita anterior.
 // No depender de sessionStorage: impedía ver el aviso al regresar a la web.
 let dismissed=false,timer;
 const eligible=()=>['','#/','#/inicio','#/publico'].includes(location.hash);
 function close(){
  dismissed=true;
  document.getElementById('dea-promo')?.remove();
 }
 function show(){
  if(dismissed||!eligible()||document.getElementById('dea-promo')||document.getElementById('dea-party-overlay')||document.getElementById('dea-cookie-banner'))return;
  const lavaMarkup=lavaActive()?"<section class=\"dea-welcome-lava\" aria-labelledby=\"dea-welcome-lava-title\">\n  <a class=\"dea-welcome-lava-preview\" href=\"#/publico/noticias\" aria-label=\"Ver el flyer oficial y comunicado de El Suelo es Lava en DEA Confidencial\">\n    <img src=\"https://d2ol7oe51mr4n9.cloudfront.net/user_3JG75h2Nju8XQikwbWBljGYXsX6/5cd8f740-f527-474a-8b74-83ce01c91eb5.webp\" alt=\"Flyer oficial DEA: El Suelo es Lava, premios Cajas HC, Reducción de Nómina y Payment Security\" width=\"1122\" height=\"1402\" loading=\"eager\" decoding=\"async\">\n  </a>\n  <div class=\"dea-welcome-lava-details\">\n    <span class=\"dea-welcome-lava-kicker\">EVENTO ESPECIAL · INAUGURACIÓN</span>\n    <strong id=\"dea-welcome-lava-title\">EL SUELO ES LAVA</strong>\n    <p>¡La diversión llega a DEA! Participa en nuestro nuevo juego y consigue premios especiales.</p>\n    <span class=\"dea-welcome-lava-hours\"><span>🇲🇽 México: <b>23/11 · 17:00</b></span><span>🇪🇸 España: <b>24/11 · 00:00</b></span></span>\n    <a class=\"dea-welcome-lava-action\" href=\"#/publico/noticias\">VER EL EVENTO EN DEA CONFIDENCIAL ↗</a>\n  </div>\n</section>":'';
  const card=document.createElement('aside');
  card.id='dea-promo';
  card.setAttribute('role','dialog');
  card.setAttribute('aria-modal','true');
  card.setAttribute('aria-label','Bienvenida a Agencia Oficial DEA');
  card.innerHTML=`<div class="dea-promo-panel dea-welcome-panel${lavaMarkup?' dea-welcome-event-open':''}">
    <button class="dea-promo-close" type="button" aria-label="Cerrar bienvenida y ver la portada">×</button>
    <div class="dea-promo-scene dea-welcome-scene" aria-hidden="true">
      <div class="dea-promo-brand"><img src="/logo-dea-es.png" alt="" width="72" height="72"><span>AGENCIA OFICIAL DEA <small>COMUNIDAD HABBO ES</small></span></div>
    </div>
    <div class="dea-promo-body dea-welcome-body">
      <span class="dea-promo-kicker">✦ DEPARTAMENTO ESPECIAL DE AGENTES ✦</span>
      <h2>BIENVENIDO A <span>DEA</span></h2>
      <p class="dea-welcome-subtitle">Explora la agencia, descubre nuestra comunidad y encuentra todas las respuestas antes de comenzar.</p>
      <div class="dea-welcome-main${lavaMarkup?' dea-welcome-with-event':''}"><div class="dea-welcome-links">
      <a class="dea-welcome-faq" href="#/publico/faq" aria-label="FAQ DEA: Todas tus dudas resueltas">
        <span class="dea-welcome-faq-icon" aria-hidden="true">?</span>
        <span><strong>FAQ DEA</strong><small>Todas tus dudas resueltas</small></span>
        <span class="dea-welcome-faq-arrow" aria-hidden="true">→</span>
      </a>
      <a class="dea-welcome-update" href="#/publico/noticias" aria-label="Leer en DEA Confidencial el comunicado oficial sobre los nuevos comandos"><img src="https://d2ol7oe51mr4n9.cloudfront.net/user_3JG75h2Nju8XQikwbWBljGYXsX6/209b40e4-91a2-4de7-8764-b49fc023ee0a.webp" alt="" width="140" height="80" loading="lazy" decoding="async"><span><small>NUEVO · DEA CONFIDENCIAL</small><strong>¡Nuevos comandos en DEA!</strong><em>:membresias · :misiones · :traslados</em></span><b aria-hidden="true">↗</b></a>
      </div>${lavaMarkup}</div>
      <p class="dea-welcome-note">Consulta las novedades de DEA o cierra este aviso para continuar. · AgenciaOficialDEA.es</p>
    </div>
  </div>`;
  card.querySelector('.dea-promo-close').addEventListener('click',close);
  card.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close();}});
  card.addEventListener('click',e=>{if(e.target===card)close();});
  card.querySelectorAll('a').forEach(link=>link.addEventListener('click',close));
  document.body.append(card);
  card.querySelector('.dea-promo-close')?.focus?.();
 }
 function sync(){
  if(!ENTRY_POPUPS_ENABLED)return;
  clearTimeout(timer);
  if(!eligible()){document.getElementById('dea-promo')?.remove();return;}
  if(!dismissed&&!document.getElementById('dea-party-overlay'))timer=setTimeout(show,250);
 }
 window.addEventListener('hashchange',sync);
 window.addEventListener('dea:initial-popup-closed',sync);
 document.addEventListener('dea:consent-change',sync);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync();});
 sync();
})();
