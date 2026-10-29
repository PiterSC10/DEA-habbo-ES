/* Promoción pública. No recibe datos de cuentas, ventas ni comisiones. */
(()=>{
 'use strict';
 const KEY='dea-promo-noviembre-2026-cerrada';
 const END=Date.parse('2026-12-01T00:00:00+01:00');
 let dismissed=false,timer;
 try{dismissed=sessionStorage.getItem(KEY)==='1';}catch{}
 const eligible=()=>Date.now()<END&&['','#/','#/inicio','#/publico'].includes(location.hash);
 function close(){dismissed=true;try{sessionStorage.setItem(KEY,'1');}catch{}document.getElementById('dea-promo')?.remove();}
 function show(){
  if(dismissed||!eligible()||document.getElementById('dea-promo'))return;
  const card=document.createElement('aside');card.id='dea-promo';card.setAttribute('aria-label','Promociones de rangos y VIP de DEA');
  card.innerHTML=`<button class="dea-promo-close" type="button" aria-label="Cerrar promociones">×</button><div class="dea-promo-scene" aria-hidden="true"></div><div class="dea-promo-body"><span class="dea-promo-kicker">✦ PROMOCIÓN ESPECIAL</span><h2>OFERTAS <span>DEA</span></h2><p class="dea-promo-date">Hasta el 30 de noviembre</p><div class="dea-promo-ranks">${[['R5','Supervisor',130,25],['R6','Director',240,75],['R7','Delegado',500,180]].map(([code,name,before,now])=>`<a href="#/publico/compra-rangos" class="dea-promo-rank" aria-label="${code} ${name}: antes ${before}, ahora ${now} créditos"><b>${code}</b><span>${name}</span><small><del>${before} c</del> <strong>${now} c</strong></small></a>`).join('')}</div><a class="dea-promo-vip" href="#/publico/placas"><span>★ Descubre también el VIP</span><small>Consulta las condiciones con un Founder ↗</small></a><a class="dea-promo-cta" href="#/publico/compra-rangos">Ver promociones <span aria-hidden="true">→</span></a><p class="dea-promo-note">Compras presenciales en Habbo · Ilustración de ambiente</p></div>`;
  card.querySelector('.dea-promo-close').addEventListener('click',close);
  card.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close();}});
  card.querySelectorAll('a').forEach(link=>link.addEventListener('click',close));
  document.body.append(card);
 }
 function sync(){clearTimeout(timer);if(!eligible()){document.getElementById('dea-promo')?.remove();return;}if(!dismissed)timer=setTimeout(show,3500);}
 window.addEventListener('hashchange',sync);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync();});
 sync();
})();
