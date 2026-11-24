/* Agencia Oficial DEA: bienvenida pública con FAQ y comandos nuevos. Sin pagos. */
(()=>{
 'use strict';
 const ENTRY_POPUPS_ENABLED=true;
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
  const card=document.createElement('aside');
  card.id='dea-promo';
  card.setAttribute('role','dialog');
  card.setAttribute('aria-modal','true');
  card.setAttribute('aria-label','DEA Confidencial: reconocimiento a Danisol, Miembro de la Semana número dos');
  card.innerHTML="<div class=\"dea-promo-panel dea-welcome-panel dea-danisol-popup\">\n<button class=\"dea-promo-close\" type=\"button\" aria-label=\"Cerrar bienvenida y ver la portada\">×</button>\n<div class=\"dea-promo-scene dea-welcome-scene\" aria-hidden=\"true\"><div class=\"dea-promo-brand\"><img src=\"/logo-dea-es.png\" alt=\"\" width=\"72\" height=\"72\"><span>AGENCIA OFICIAL DEA <small>COMUNIDAD HABBO ES</small></span></div></div>\n<div class=\"dea-promo-body dea-welcome-body\">\n<span class=\"dea-promo-kicker\">✦ BIENVENIDO A DEA · RECONOCIMIENTO SEMANAL ✦</span>\n<h2>¡FELICIDADES, <span>DANISOL!</span></h2>\n<a class=\"dea-danisol-popup-flyer\" href=\"#/publico/noticias\" aria-label=\"Abrir en DEA Confidencial el expediente de Danisol, Miembro de la Semana número dos\">\n<img src=\"https://d2ol7oe51mr4n9.cloudfront.net/user_3JG75h2Nju8XQikwbWBljGYXsX6/36365e41-8d76-4576-9fbc-2e03e3fb8e96.webp\" alt=\"Flyer original DEA Miembro de la Semana número 2: Danisol con vestido rosa y el reconocimiento de la agencia\" width=\"1024\" height=\"1024\" fetchpriority=\"high\" decoding=\"async\"></a>\n<div class=\"dea-danisol-popup-copy\">\n<strong>🏆 MIEMBRO DE LA SEMANA #2</strong>\n<p>DEA reconoce tu <b>destacada participación</b> y el compromiso demostrado durante esta semana. Tu esfuerzo, dedicación y apoyo son parte importante del crecimiento de la agencia.</p>\n<p>¡Gracias por formar parte de esta gran familia y seguir dejando huella en DEA!</p>\n<em>✨ ¡Sigue brillando y poniendo en alto los colores de DEA!</em>\n</div>\n<a class=\"dea-danisol-popup-action\" href=\"#/publico/noticias\">VER EN DEA CONFIDENCIAL ↗</a>\n<div class=\"dea-danisol-popup-more\"><span>OTRAS NOVEDADES DEA</span>\n<a class=\"dea-welcome-faq\" href=\"#/publico/faq\" aria-label=\"FAQ DEA: Todas tus dudas resueltas\"><span class=\"dea-welcome-faq-icon\" aria-hidden=\"true\">?</span><span><strong>FAQ DEA</strong><small>Todas tus dudas resueltas</small></span><span class=\"dea-welcome-faq-arrow\" aria-hidden=\"true\">→</span></a>\n<a class=\"dea-welcome-update\" href=\"#/publico/noticias\" aria-label=\"Leer en DEA Confidencial los nuevos comandos\">\n<img src=\"https://d2ol7oe51mr4n9.cloudfront.net/user_3JG75h2Nju8XQikwbWBljGYXsX6/209b40e4-91a2-4de7-8764-b49fc023ee0a.webp\" alt=\"\" width=\"140\" height=\"80\" loading=\"lazy\" decoding=\"async\">\n<span><small>DEA CONFIDENCIAL</small><strong>¡Nuevos comandos en DEA!</strong><em>:membresias · :misiones · :traslados</em></span><b aria-hidden=\"true\">↗</b></a>\n</div>\n<p class=\"dea-welcome-note\">AgenciaOficialDEA.es · Reconocimiento oficial #2</p>\n</div></div>";
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
