/* Agencia Oficial DEA: promoción de rango y VIP. No procesa pagos. */
(()=>{
 'use strict';
 const ENTRY_POPUPS_ENABLED=true;
 const KEY='dea-promo-noviembre-2026-equipo-v4';
 const END=Date.parse('2026-12-01T00:00:00+01:00');
 let dismissed=false,timer;
 try{dismissed=sessionStorage.getItem(KEY)==='1';}catch{}
 const eligible=()=>Date.now()<END&&['','#/','#/inicio','#/publico'].includes(location.hash);
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
  card.setAttribute('aria-label','Ofertas especiales de rangos y VIP de Agencia Oficial DEA');
  const offers=[['R5','Supervisor',130,25],['R6','Director',240,75],['R7','Delegado',500,180]];
  card.innerHTML=`<div class="dea-promo-panel">
   <button class="dea-promo-close" type="button" aria-label="Cerrar promociones">×</button>
   <div class="dea-promo-scene" aria-hidden="true"><div class="dea-promo-brand"><img src="/logo-dea-es.png" alt="" width="92" height="92"><span>AGENCIA OFICIAL DEA <small>HABBO ES</small></span></div><div class="dea-promo-crew" aria-label="LESS, los Founders activos y los cuatro Mánagers de DEA"><div class="dea-promo-crew-member dea-promo-crew-founder"><img class="dea-promo-avatar" src="https://www.habbo.es/habbo-imaging/avatarimage?user=lesslie.ar&direction=2&head_direction=2&action=std&gesture=sml&size=l" alt="" title="lesslie.ar" loading="eager" referrerpolicy="no-referrer"><span class="dea-promo-crew-label">lesslie.ar</span><span class="dea-promo-crew-role">FOUNDER</span></div><div class="dea-promo-crew-member dea-promo-crew-founder"><img class="dea-promo-avatar" src="https://www.habbo.es/habbo-imaging/avatarimage?user=10PEDRO&direction=2&head_direction=2&action=std&gesture=sml&size=l" alt="" title="10PEDRO" loading="eager" referrerpolicy="no-referrer"><span class="dea-promo-crew-label">10PEDRO</span><span class="dea-promo-crew-role">FOUNDER</span></div><div class="dea-promo-crew-member dea-promo-crew-founder"><img class="dea-promo-avatar" src="/assets/dea/founder-xpe34.png" alt="" title="XPE_34" loading="eager" referrerpolicy="no-referrer"><span class="dea-promo-crew-label">XPE_34</span><span class="dea-promo-crew-role">FOUNDER</span></div><div class="dea-promo-crew-member dea-promo-crew-manager"><img class="dea-promo-avatar" src="/assets/dea/manager-fr4nn23.png" alt="" title="Fr4nn_23" loading="eager" referrerpolicy="no-referrer"><span class="dea-promo-crew-label">Fr4nn_23</span><span class="dea-promo-crew-role">MÁNAGER</span></div><div class="dea-promo-crew-member dea-promo-crew-manager"><img class="dea-promo-avatar" src="https://www.habbo.es/habbo-imaging/avatarimage?user=MAYERGRHG&direction=2&head_direction=2&action=std&gesture=sml&size=l" alt="" title="MAYERGRHG" loading="eager" referrerpolicy="no-referrer"><span class="dea-promo-crew-label">MAYERGRHG</span><span class="dea-promo-crew-role">MÁNAGER</span></div><div class="dea-promo-crew-member dea-promo-crew-manager"><img class="dea-promo-avatar" src="https://www.habbo.es/habbo-imaging/avatarimage?user=Bibhi&direction=2&head_direction=2&action=std&gesture=sml&size=l" alt="" title="Bibhi" loading="eager" referrerpolicy="no-referrer"><span class="dea-promo-crew-label">Bibhi</span><span class="dea-promo-crew-role">MÁNAGER</span></div><div class="dea-promo-crew-member dea-promo-crew-manager"><img class="dea-promo-avatar" src="https://www.habbo.es/habbo-imaging/avatarimage?user=aaitaanaa&direction=2&head_direction=2&action=std&gesture=sml&size=l" alt="" title="aaitaanaa" loading="eager" referrerpolicy="no-referrer"><span class="dea-promo-crew-label">aaitaanaa</span><span class="dea-promo-crew-role">MÁNAGER</span></div></div></div></div>
   <div class="dea-promo-body">
    <span class="dea-promo-kicker">✦ ESPECIAL INAUGURACIÓN · ÚLTIMOS DÍAS</span>
    <h2>OFERTAS <span>DEA</span></h2>
    <p class="dea-promo-date">RANGOS HASTA EL 30 DE NOVIEMBRE · 23:59 H (ESPAÑA)</p>
    <div class="dea-promo-tabs" aria-label="Promociones DEA"><span class="dea-promo-tab dea-promo-tab-active">RANGOS EN OFERTA</span><a class="dea-promo-tab" href="#/publico/placas">VIP PERMANENTE</a></div>
    <div class="dea-promo-ranks">${offers.map(([code,name,before,now])=>`<a href="#/publico/compra-rangos" class="dea-promo-rank" aria-label="${code} ${name}: antes ${before}, ahora ${now} créditos"><b>${code}</b><span>${name}</span><small><del>${before} c</del> <strong>${now} c</strong></small><em>PRECIO DE INAUGURACIÓN</em></a>`).join('')}</div>
    <a class="dea-promo-vip" href="#/publico/placas" aria-label="VIP permanente por 35 créditos, ver condiciones">
     <span class="dea-promo-vip-emblem">★</span>
     <span class="dea-promo-vip-copy"><strong>VIP PERMANENTE</strong><small>Un solo pago · Sin caducidad</small></span>
     <b>35 c</b>
    </a>
    <div class="dea-promo-actions"><a class="dea-promo-cta" href="#/publico/compra-rangos">VER OFERTAS DE RANGO <span aria-hidden="true">→</span></a><a class="dea-promo-secondary" href="#/publico/placas">VER VIP</a></div>
    <p class="dea-promo-note">Rangos: promoción hasta el 30/11/2026. VIP permanente: 35 créditos. Compra presencial en Habbo con Founders o CEO, nunca mediante esta web.</p>
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
