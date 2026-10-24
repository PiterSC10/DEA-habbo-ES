/* DEA V6 · Catálogos estáticos de la web pública. No acceder a Sheets privado. */
const PLACAS_PUBLICAS=Object.freeze([{nombre:'[DEA] VIP',precioCreditos:35,duracion:'Permanente',estado:'Publicada',beneficio:'Ventajas VIP pendientes de descripción oficial.'}]);
function publicNeonTabs(p){
 const r=p==='publico/jerarquia',b=p==='publico/placas';
 return `<nav class="dea-public-neon-nav" aria-label="Catálogos públicos"><a class="dea-neon-link rango${r?' selected':''}" href="#/publico/jerarquia" ${r?'aria-current="page"':''}>${I('list',true)}<span><strong>RANGOS Y ASCENSOS</strong><small>Tabla oficial R1–R10</small></span>${I('arrow')}</a><a class="dea-neon-link placas${b?' selected':''}" href="#/publico/placas" ${b?'aria-current="page"':''}>${I('spark',true)}<span><strong>PLACAS DE BENEFICIO</strong><small>Catálogo y precios</small></span>${I('arrow')}</a></nav>`;
}
function catalogWindow(title,body){
 return `<section class="dea-catalog-window" aria-label="${esc(title)}"><div class="dea-catalog-window-bar"><span>${I('shield')} DEA HABBO ES · CATÁLOGO PÚBLICO</span><a href="#/publico" class="dea-window-close">${I('back')} Cerrar ventana</a></div>${body}</section>`;
}
/* Autorización acumulativa por categoría de destino; la validación real corresponde a Apps Script. */
function ascensionApprover(groupId){
 const level=Number(String(groupId).replace(/^R/,''));
 if(level===1)return 'Formación presencial en Habbo';
 if(level<=5)return 'Directores · Managers · Founders';
 if(level<=7)return 'Managers · Founders';
 return 'Founders';
}
function ascensionAuthorizationGuide(){
 const cards=[
  {name:'DIRECTORES',range:'Ascensos hasta R5 incluido',detail:'Pueden autorizar ascensos hacia R2, R3, R4 y R5, tras la formación inicial R1.',tone:'director'},
  {name:'MANAGERS',range:'Ascensos hasta R7 incluido',detail:'Incluye las autorizaciones de Directores y además R6 y R7.',tone:'manager'},
  {name:'FOUNDERS',range:'Ascensos hasta R10 incluido',detail:'Pueden autorizar ascensos hacia cualquier categoría R2–R10.',tone:'founder'}
 ];
 return `<section class="dea-ascension-permissions" aria-labelledby="dea-ascension-permissions-title"><div class="dea-ascension-permissions-head"><span class="dea-rank-chip">NORMATIVA DE ASCENSOS</span><h2 id="dea-ascension-permissions-title">¿Quién puede ascender a quién?</h2><p>Permisos <strong>acumulativos</strong> según el cargo del responsable y la <strong>categoría de destino</strong> del agente.</p></div><div class="dea-ascension-permissions-grid">${cards.map(x=>`<article class="dea-ascension-permission ${x.tone}"><span>${esc(x.name)}</span><strong>${esc(x.range)}</strong><p>${esc(x.detail)}</p></article>`).join('')}</div><p class="dea-ascension-permissions-note"><strong>R1:</strong> formación de 45 minutos gestionada en la sala de Habbo; el expediente web empieza en R2. <strong>R7, R8, R9 y R10:</strong> sus nombres internos ya están publicados según el escalafón oficial. La habilitación de operaciones sigue requiriendo comprobación presencial y permisos en el servidor. Todos los ascensos exigen comprobación presencial, cumplimiento del plazo y <strong>verificación del permiso en el servidor mediante Discord</strong>; conocer el enlace de una miniapp no concede autorización.</p></section>`;
}
function fullAscensionTable(){
 const groups=GROUPS.flatMap((g,n)=>g.ranks.length?g.ranks.map((name,i)=>({g,name,next:g.ranks[i+1]||GROUPS[n+1]?.ranks[0]||'Por definir',pending:false})):[{g,name:'Por definir',next:'Por definir',pending:true}]);
 const trs=groups.map(x=>`<tr><td><strong class="dea-rank-chip">${esc(x.g.id)}</strong><small>${esc(x.g.label)}</small></td><td><strong>${esc(x.name)}</strong></td><td>${esc(x.next)}</td><td>${esc(x.g.period)}</td><td>${x.g.hours===null?'Por definir':esc(x.g.hours)+' horas'}</td><td>${x.g.pay===null?'Por definir':esc(x.g.pay)+' c'}</td><td>${ascensionApprover(x.g.id)}</td></tr>`).join('');
 const table=`<div class="dea-table-scroll" role="region" tabindex="0" aria-label="Tabla de ascensos R1 a R10"><table class="dea-rank-table"><caption>Tabla de ascensos y nóminas de DEA HABBO ES</caption><thead><tr><th>Categoría</th><th>Rango interno</th><th>Siguiente ascenso</th><th>Plazo mínimo</th><th>Horas nómina</th><th>Nómina</th><th>Quién puede autorizar</th></tr></thead><tbody>${trs}</tbody></table></div>`;
 const tariff=`<section class="dea-tariff-info"><h2>Ingreso gratuito o compra presencial de rango</h2><p>La formación e ingreso ordinarios son gratuitos. Para compras hay que hablar con Founders o CEO; las misiones concretas siguen pendientes de aprobación y no se permite comprar desde la web.</p><div class="dea-tariff-grid">${[['Supervisor','R5','130'],['Director','R6','240'],['Delegado','R7','500']].map(([title,cat,price])=>`<article class="dea-tariff"><small>${cat}</small><strong>${title}</strong><b>${price} c</b><small>Precio total · Solo presencial</small></article>`).join('')}</div></section>`;
 return catalogWindow('Rangos y ascensos',head('ESCALAFÓN DEA','Tabla completa de rangos y ascensos','Incluye el escalafón oficial completo R1–R10, con sus rangos internos. Los plazos y nóminas no definidos se mantienen pendientes.')+table+`<p class="dea-catalog-warning">R1 consta de tres etapas de 15 minutos (45 minutos en total). Los ascensos desde R2 no son automáticos: requieren plazo, comprobación de presencia en Habbo y autorización de Directores, Managers o Founders según el rango de destino.</p>`+tariff+ascensionAuthorizationGuide());
}
function publicPlaqueImage(item){
 const url=String(item?.imagenUrl||'');
 const safe=/^https:\/\/[^"' <>\s]+\.(png|jpg|jpeg|webp)$/i.test(url)||/^\.\/[a-z0-9._-]+\.(png|jpg|jpeg|webp)$/i.test(url);
 return `<img src="${esc(safe?url:'./logo-dea-es.png')}" loading="lazy" alt="${safe?'Logo oficial de '+esc(item.nombre):'Emblema DEA provisional, placa sin logo definido'}">`;
}
function publicPlaques(){const cards=PLACAS_PUBLICAS.map(item=>`<article class="dea-plaque-card"><div class="dea-plaque-image"><img class="dea-vip-original" src="./assets/dea/insignias/vip.png" alt="Placa original [DEA] VIP" loading="lazy"><span>EN VENTA</span></div><h3>${esc(item.nombre)}</h3><strong class="dea-plaque-price">${esc(item.precioCreditos)} créditos</strong><p><b>Duración:</b> ${esc(item.duracion)}</p><p><b>Beneficios:</b> Pendientes de descripción oficial.</p><small>Venta y entrega presencial en Habbo. Insignia original [DEA] VIP extraída de la captura de Habbo.</small></article>`).join('');return catalogWindow('Placas de beneficio',head('CATÁLOGO DEA','Placas de beneficio','Primera placa de beneficio confirmada por DEA.')+`<div class="dea-plaque-grid">${cards}</div><section class="dea-tariff-info"><h2>Adquisición presencial</h2><p>La placa VIP tiene un precio comunicado de 35 créditos y duración permanente. Para solicitarla, consulta con la dirección de DEA en Habbo. No se realizan pagos desde esta web.</p></section>`)}
