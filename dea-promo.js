/* Agencia Oficial DEA: promoción de rango y VIP. No procesa pagos. */
(()=>{
 'use strict';
 const ENTRY_POPUPS_ENABLED=true;
 const KEY='dea-popup-bienvenida-faq-20261123-v1';
 const END=Infinity; // Pantalla de bienvenida sin fecha de caducidad; no muestra promociones.
 let dismissed=false,timer;
 try{dismissed=sessionStorage.getItem(KEY)==='1';}catch{}
 const eligible=()=>Date.now()<END&&['','#/','#/inicio'].includes(location.hash);
 function close(){
  dismissed=true;
  try{sessionStorage.setItem(KEY,'1');}catch{}
  document.getElementById('dea-promo')?.remove();
 }
 function show(){
  if(dismissed||!eligible()||document.getElementById('dea-promo')||document.getElementById('dea-party-overlay')||document.getElementById('dea-cookie-banner'))return;
  const card=document.createElement('aside');
  card.id='dea-promo';
  card.setAttribute('role','dialog');
  card.setAttribute('aria-modal','true');
  card.setAttribute('aria-label','Bienvenida a Agencia Oficial DEA');
  card.innerHTML=`<div class="dea-promo-panel dea-welcome-panel">
    <button class="dea-promo-close" type="button" aria-label="Cerrar bienvenida y ver la portada">×</button>
    <div class="dea-promo-scene dea-welcome-scene" aria-hidden="true">
      <div class="dea-promo-brand"><img src="/logo-dea-es.png" alt="" width="72" height="72"><span>AGENCIA OFICIAL DEA <small>COMUNIDAD HABBO ES</small></span></div>
    </div>
    <div class="dea-promo-body dea-welcome-body">
      <span class="dea-promo-kicker">✦ DEPARTAMENTO ESPECIAL DE AGENTES ✦</span>
      <h2>BIENVENIDO A <span>DEA</span></h2>
      <p class="dea-welcome-subtitle">Explora la agencia, descubre nuestra comunidad y encuentra todas las respuestas antes de comenzar.</p>
      <a class="dea-welcome-faq" href="#/publico/faq" aria-label="FAQ DEA: Todas tus dudas resueltas">
        <span class="dea-welcome-faq-icon" aria-hidden="true">?</span>
        <span><strong>FAQ DEA</strong><small>Todas tus dudas resueltas</small></span>
        <span class="dea-welcome-faq-arrow" aria-hidden="true">→</span>
      </a>
      <a class="dea-welcome-update" href="#/publico/noticias" aria-label="Leer en DEA Confidencial el comunicado oficial sobre los nuevos comandos"><img src="https://d2ol7oe51mr4n9.cloudfront.net/user_3JG75h2Nju8XQikwbWBljGYXsX6/209b40e4-91a2-4de7-8764-b49fc023ee0a.webp" alt="" width="140" height="80" loading="lazy" decoding="async"><span><small>NUEVO · DEA CONFIDENCIAL</small><strong>¡Nuevos comandos en DEA!</strong><em>:membresias · :misiones · :traslados</em></span><b aria-hidden="true">↗</b></a>
      <p class="dea-welcome-note">Cierra esta ventana para descubrir la portada de DEA y entrar en la web.</p>
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
