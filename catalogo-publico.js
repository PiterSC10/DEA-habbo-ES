/* DEA V6 · Catálogos estáticos de la web pública. No acceder a Sheets privado. */
const PLACAS_PUBLICAS=Object.freeze([{nombre:'[DEA] Guardapaga',duracion:'Un mes',precio:20,beneficio:'Recoger una nómina reservada durante 48 horas desde el horario oficial.'},{nombre:'[DEA] VIP',duracion:'Permanente',estado:'Publicada',beneficio:'Acceso permanente como visitante para entrar y salir de DEA, sin poderes, sin permiso para trabajar ni ejercer funciones de agente.'}]);
function publicNeonTabs(p){
 const r=p==='publico/jerarquia',b=p==='publico/placas';
 return `<nav class="dea-public-neon-nav" aria-label="Catálogos públicos"><a class="dea-neon-link rango${r?' selected':''}" href="#/publico/jerarquia" ${r?'aria-current="page"':''}>${I('list',true)}<span><strong>RANGOS Y ASCENSOS</strong><small>Tabla oficial R1–R10</small></span>${I('arrow')}</a><a class="dea-neon-link placas${b?' selected':''}" href="#/publico/placas" ${b?'aria-current="page"':''}>${I('spark',true)}<span><strong>PLACAS DE BENEFICIO</strong><small>Catálogo de beneficios</small></span>${I('arrow')}</a><a class="dea-neon-link cafe" href="#/publico/cafeteria"><span aria-hidden="true">☕</span><span><strong>LA CAFETERÍA DE DEA</strong><small>Apoya a nuestra comunidad</small></span><b class="dea-cafe-open">OPEN</b></a></nav>`;
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
 const trs=groups.map(x=>`<tr><td><strong class="dea-rank-chip">${esc(x.g.id)}</strong><small>${esc(x.g.label)}</small></td><td><strong>${esc(x.name)}</strong><small>${esc(deaRankMission(x.g.id,x.name))}</small></td><td>${esc(x.next)}</td><td>${esc(x.g.period)}</td><td>${x.g.hours===null?'Por definir':esc(x.g.hours)+' horas'}</td><td>${x.g.pay===null?'Por definir':esc(x.g.pay)+' c'}</td><td>${ascensionApprover(x.g.id)}</td></tr>`).join('');
 const table=`<div class="dea-table-scroll" role="region" tabindex="0" aria-label="Tabla de ascensos R1 a R10"><table class="dea-rank-table"><caption>Tabla de ascensos y nóminas de DEA HABBO ES</caption><thead><tr><th>Categoría</th><th>Rango interno</th><th>Siguiente ascenso</th><th>Plazo mínimo</th><th>Horas nómina</th><th>Nómina</th><th>Quién puede autorizar</th></tr></thead><tbody>${trs}</tbody></table></div>`;
 const tariff=`<section class="dea-tariff-info"><h2>Ingreso gratuito o compra presencial de rango</h2><p>La formación e ingreso ordinarios son gratuitos. Para compras hay que hablar con Founders o CEO; las misiones concretas siguen pendientes de aprobación y no se permite comprar desde la web.</p><div class="dea-tariff-grid">${[['Supervisor','R5','130'],['Director','R6','240'],['Delegado','R7','500']].map(([title,cat,price])=>`<article class="dea-tariff"><small>${cat}</small><strong>${title}</strong><b>${price} c</b><small>Precio total · Solo presencial</small></article>`).join('')}</div></section>`;
 return catalogWindow('Rangos y ascensos',head('ESCALAFÓN DEA','Tabla completa de rangos y ascensos','Incluye el escalafón oficial completo R1–R10, con sus rangos internos. Los plazos y nóminas no definidos se mantienen pendientes.')+table+`<p class="dea-catalog-warning">R1 consta de tres etapas de 15 minutos (45 minutos en total). Los ascensos desde R2 no son automáticos: requieren plazo, comprobación de presencia en Habbo y autorización de Directores, Managers o Founders según el rango de destino.</p>`+tariff+ascensionAuthorizationGuide());
}
function publicPlaqueImage(item){
 const url=String(item?.imagenUrl||'');
 const safe=/^https:\/\/[^"' <>\s]+\.(png|jpg|jpeg|webp)$/i.test(url)||/^\.\/[a-z0-9._-]+\.(png|jpg|jpeg|webp)$/i.test(url);
 return `<img src="${esc(safe?url:'./logo-dea-es.png')}" loading="lazy" alt="${safe?'Logo oficial de '+esc(item.nombre):'Emblema DEA provisional, placa sin logo definido'}">`;
}
const DEA_PUBLIC_PLAQUES=[
 {image:'beneficio-gold',title:'Beneficio Gold',price:100,benefit:'Usa la ropa que quieras sin importar el rango, disfruta de chat libre y accede a los beneficios PS, HS, RN y BD.'},
 {image:'reduccion-nomina',title:'Reducción de Nómina [RN]',price:40,benefit:'Reduce un 50 % las horas requeridas para cobrar la nómina.'},
 {image:'payment-security',title:'Payment Security [PS]',price:20,benefit:'Guardapaga: si cumples los requisitos, puedes reservar tu nómina del miércoles o sábado y recogerla hasta 48 horas después de las 22:00 (hora peninsular española) de esa jornada.'},
 {image:'fast-pay',title:'Fast Pay [FP]',price:30,benefit:'Accede a una fila preferente para cobrar la nómina.'},
 {title:'Hour Skip [HS]',benefit:'Reduce un 50 % tus horas.'},
 {title:'Bonus Day [BD]',benefit:'Añade un día extra de bonificación cada semana (7 créditos extra).'},
 {image:'beneficio-vip',title:'VIP',price:35,permanent:true,benefit:'Entra y sal de la sala DEA como visitante, sin rango, sin trabajar y sin permisos de gestión.'}
];
function publicPlaques(){
 const cards=DEA_PUBLIC_PLAQUES.map(({image,title,price,permanent,benefit})=>`<article class="dea-plaque-card">
 <div class="dea-plaque-image">${image?`<img class="dea-plaque-emblem" src="/assets/dea/insignias/${image}.png" width="120" height="120" alt="">`:'<strong>Emblema: próximamente</strong>'}</div>
 <div class="dea-plaque-details"><h3>[DEA] ${title}${permanent?' <span class="dea-rank-code dea-rank-code-benefit">BENEFICIO · SIN RANGO</span>':''}</h3>
 <strong class="dea-plaque-price">${price==null?'Precio: próximamente':`${price} créditos`}</strong>
 <p><b>Duración:</b> ${permanent?'permanente':'un mes desde la compra'}.</p>
 <p><b>Beneficio:</b> ${benefit}</p></div></article>`).join('');
 return catalogWindow('Placas de beneficio',head('CATÁLOGO DEA','Placas de beneficio','Consulta el precio, la duración y el beneficio de cada placa.')+`<div class="dea-plaque-grid">${cards}</div><section class="dea-tariff-info"><h2>Compra y registro</h2><p>La compra y la entrega se hacen en Habbo con un Founder. Si ya tienes expediente, la compra se registra allí: no te registres de nuevo. No se realizan pagos desde esta web.</p></section>`);
}
/* Horarios de cada jornada: Europe/Madrid es la referencia oficial. */
const DEA_PAYROLL_ZONES=[['🇪🇸','España · península','Europe/Madrid'],['🇪🇸','España · Canarias','Atlantic/Canary'],['🇦🇷','Argentina · Buenos Aires','America/Argentina/Buenos_Aires'],['🇲🇽','México · Ciudad de México','America/Mexico_City'],['🇲🇽','México · Cancún','America/Cancun'],['🇲🇽','México · Tijuana','America/Tijuana'],['🇨🇴','Colombia · Bogotá','America/Bogota'],['🇪🇨','Ecuador · Quito','America/Guayaquil'],['🇪🇨','Ecuador · Galápagos','Pacific/Galapagos'],['🇩🇴','República Dominicana','America/Santo_Domingo'],['🇵🇷','Puerto Rico','America/Puerto_Rico'],['🇨🇱','Chile · Santiago','America/Santiago'],['🇨🇱','Chile · Punta Arenas','America/Punta_Arenas'],['🇨🇱','Chile · Isla de Pascua','Pacific/Easter'],['🇺🇾','Uruguay · Montevideo','America/Montevideo'],['🇵🇪','Perú · Lima','America/Lima'],['🇻🇪','Venezuela · Caracas','America/Caracas'],['🇧🇴','Bolivia · La Paz','America/La_Paz'],['🇵🇾','Paraguay · Asunción','America/Asuncion'],['🇵🇦','Panamá','America/Panama'],['🇨🇷','Costa Rica','America/Costa_Rica'],['🇳🇮','Nicaragua','America/Managua'],['🇭🇳','Honduras','America/Tegucigalpa'],['🇸🇻','El Salvador','America/El_Salvador'],['🇬🇹','Guatemala','America/Guatemala'],['🇨🇺','Cuba · La Habana','America/Havana'],['🇬🇶','Guinea Ecuatorial · Malabo','Africa/Malabo']];
function deaPayrollParts(date,zone){return Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));}
function deaPayrollInstant(day){if(!/^\d{4}-\d{2}-\d{2}$/.test(day))throw Error('Fecha inválida');const target=Date.parse(day+'T22:00:00Z');let ms=target;for(let i=0;i<3;i++){const p=deaPayrollParts(new Date(ms),'Europe/Madrid');ms+=target-Date.parse(p.year+'-'+p.month+'-'+p.day+'T'+p.hour+':'+p.minute+':00Z');}return new Date(ms);}
function deaPayrollNext(weekday,now=new Date()){const p=deaPayrollParts(now,'Europe/Madrid');const d=new Date(p.year+'-'+p.month+'-'+p.day+'T12:00:00Z');for(let i=0;i<8;i++){const day=d.toISOString().slice(0,10);if(d.getUTCDay()===weekday&&deaPayrollInstant(day)>=now)return day;d.setUTCDate(d.getUTCDate()+1);}throw Error('Jornada no encontrada');}
// IANA tzdb 2026f: Cuba mantiene UTC-4 del 1-11-2026 al cambio del 7-11-2027.
function deaPayrollZoneFor(zone,instant){return zone==='America/Havana'&&instant.getTime()>=Date.parse('2026-11-01T05:00:00Z')&&instant.getTime()<Date.parse('2027-11-07T05:00:00Z')?'Etc/GMT+4':zone;}
function deaPayrollTimes(day){const instant=deaPayrollInstant(day);return DEA_PAYROLL_ZONES.map(([flag,country,zone])=>({flag,country,zone,time:new Intl.DateTimeFormat('es-ES',{timeZone:deaPayrollZoneFor(zone,instant),hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(instant),date:new Intl.DateTimeFormat('es-ES',{timeZone:deaPayrollZoneFor(zone,instant),weekday:'long'}).format(instant)}));}
function deaPayrollScheduleHtml(weekday,day){const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));day=day||deaPayrollNext(weekday);return '<section class="dea-payroll-schedule"><h3>🇪🇸 Nómina del '+(weekday===3?'miércoles':'sábado')+' · 22:00</h3><p>Hora oficial de España peninsular. Equivalencias adaptadas a los cambios de hora.</p><details><summary>🌎 Ver horarios por país</summary><div class="tablewrap dea-table-scroll"><table><thead><tr><th>País / zona</th><th>Hora local</th><th>Día local</th></tr></thead><tbody>'+deaPayrollTimes(day).map(r=>'<tr><td>'+r.flag+' '+esc(r.country)+'</td><td><b>'+esc(r.time)+'</b></td><td>'+esc(r.date)+'</td></tr>').join('')+'</tbody></table></div><p>Los horarios se ajustan a los cambios de hora y a la zona de cada país.</p></details></section>';}
