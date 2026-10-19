/* DEA V6 · Catálogos estáticos de la web pública. No acceder a Sheets privado. */
const PLACAS_PUBLICAS=Object.freeze([]); // Rellenar solo con elementos oficiales publicados por Founders.
function publicNeonTabs(p){
 const r=p==='publico/jerarquia',b=p==='publico/placas';
 return `<nav class="dea-public-neon-nav" aria-label="Catálogos públicos"><a class="dea-neon-link rango${r?' selected':''}" href="#/publico/jerarquia" ${r?'aria-current="page"':''}>${I('list',true)}<span><strong>RANGOS Y ASCENSOS</strong><small>Tabla oficial R1–R10</small></span>${I('arrow')}</a><a class="dea-neon-link placas${b?' selected':''}" href="#/publico/placas" ${b?'aria-current="page"':''}>${I('spark',true)}<span><strong>PLACAS DE BENEFICIO</strong><small>Catálogo y precios</small></span>${I('arrow')}</a></nav>`;
}
function catalogWindow(title,body){
 return `<section class="dea-catalog-window" aria-label="${esc(title)}"><div class="dea-catalog-window-bar"><span>${I('shield')} DEA HABBO ES · CATÁLOGO PÚBLICO</span><a href="#/publico" class="dea-window-close">${I('back')} Cerrar ventana</a></div>${body}</section>`;
}
function fullAscensionTable(){
 const groups=GROUPS.flatMap((g,n)=>g.ranks.length?g.ranks.map((name,i)=>({g,name,next:g.ranks[i+1]||GROUPS[n+1]?.ranks[0]||'Por definir',pending:false})):[{g,name:'Por definir',next:'Por definir',pending:true}]);
 const trs=groups.map(x=>`<tr><td><strong class="dea-rank-chip">${esc(x.g.id)}</strong><small>${esc(x.g.label)}</small></td><td><strong>${esc(x.name)}</strong></td><td>${esc(x.next)}</td><td>${esc(x.g.period)}</td><td>${x.g.hours===null?'Por definir':esc(x.g.hours)+' horas'}</td><td>${x.g.pay===null?'Por definir':esc(x.g.pay)+' c'}</td><td>${x.pending?'Pendiente de aprobación':x.g.id==='R1'?'Formación en Habbo':'Presencia y aprobación Founder'}</td></tr>`).join('');
 const table=`<div class="dea-table-scroll" role="region" tabindex="0" aria-label="Tabla de ascensos R1 a R10"><table class="dea-rank-table"><caption>Tabla de ascensos y nóminas de DEA HABBO ES</caption><thead><tr><th>Categoría</th><th>Rango interno</th><th>Siguiente ascenso</th><th>Plazo mínimo</th><th>Horas nómina</th><th>Nómina</th><th>Verificación</th></tr></thead><tbody>${trs}</tbody></table></div>`;
 const tariff=`<section class="dea-tariff-info"><h2>Ingreso gratuito o compra presencial de rango</h2><p>La formación e ingreso ordinarios son gratuitos. Para compras hay que hablar con Founders o CEO; las misiones concretas siguen pendientes de aprobación y no se permite comprar desde la web.</p><div class="dea-tariff-grid">${[['Supervisor','R5','130'],['Director','R6','240'],['Delegado','R7','500']].map(([title,cat,price])=>`<article class="dea-tariff"><small>${cat}</small><strong>${title}</strong><b>${price} c</b><small>Precio total · Solo presencial</small></article>`).join('')}</div></section>`;
 return catalogWindow('Rangos y ascensos',head('ESCALAFÓN DEA','Tabla completa de rangos y ascensos','Incluye los 35 rangos internos conocidos (R1–R6) y las categorías R7–R10 aún por definir.')+table+`<p class="dea-catalog-warning">R1 consta de tres etapas de 15 minutos (45 minutos en total). Los ascensos desde R2 no son automáticos: requieren plazo, comprobación de presencia en Habbo y autorización de Founders.</p>`+tariff);
}
function publicPlaqueImage(item){
 const url=String(item?.imagenUrl||'');
 const safe=/^https:\/\/[^"' <>\s]+\.(png|jpg|jpeg|webp)$/i.test(url)||/^\.\/[a-z0-9._-]+\.(png|jpg|jpeg|webp)$/i.test(url);
 return `<img src="${esc(safe?url:'./logo-dea-es.png')}" loading="lazy" alt="${safe?'Logo oficial de '+esc(item.nombre):'Emblema DEA provisional, placa sin logo definido'}">`;
}
function publicPlaques(){
 const placeholder=PLACAS_PUBLICAS.length===0;
 const items=placeholder?Array.from({length:6},(_,n)=>({nombre:'Placa '+String(n+1).padStart(2,'0')})):PLACAS_PUBLICAS;
 const cards=items.map(item=>{
  const active=!placeholder&&item.estado==='Publicada';
  const price=active&&item.precioCreditos!==undefined?esc(item.precioCreditos)+' créditos':'Precio por definir';
  const benefit=active&&item.beneficio?esc(item.beneficio):'Beneficio por definir';
  const days=active&&item.duracionDias?esc(item.duracionDias)+' días':'Duración por definir';
  return `<article class="dea-plaque-card"><div class="dea-plaque-image">${publicPlaqueImage(item)}<span>${active?'CATÁLOGO OFICIAL':'PENDIENTE'}</span></div><h3>${esc(item.nombre)}</h3><strong class="dea-plaque-price">${price}</strong><p><b>Beneficio:</b> ${benefit}</p><p><b>Duración:</b> ${days}</p><small>${active?'Venta exclusivamente por Founders con comprobación presencial en Habbo.':'Imagen provisional. No está a la venta.'}</small></article>`;
 }).join('');
 return catalogWindow('Placas de beneficio',head('CATÁLOGO DEA','Placas de beneficio','Consulta de placas, logos, precios en créditos, duración y ventajas tras su aprobación oficial por los Founders.')+`<p class="dea-catalog-warning">Las 6–8 placas están pendientes de definición. No hay placas oficiales con nombres, logos, precios o beneficios aprobados en la base de datos. Estos seis espacios son provisionales y no representan artículos disponibles.</p><div class="dea-plaque-grid">${cards}</div><section class="dea-tariff-info"><h2>Proceso de activación presencial</h2><p>Solicitud → comprobación en sala Habbo por Founders → aprobación → entrega y activación → registro de caducidad y visualización en expediente. Sin pagos automáticos.</p></section>`);
}
