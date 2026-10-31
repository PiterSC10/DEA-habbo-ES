import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile, access} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
const src=await readFile(new URL('./app.js',import.meta.url),'utf8');
const catalogs=await readFile(new URL('./catalogo-publico.js',import.meta.url),'utf8');
const experience=await readFile(new URL('./dea-experience.js',import.meta.url),'utf8');
const css=await readFile(new URL('./styles.css',import.meta.url),'utf8');
const html=await readFile(new URL('./index.html',import.meta.url),'utf8');
function page(route,unlocked=true){
 const root={innerHTML:'',addEventListener(){},querySelector(){return null}};
 const location={hash:'#/inicio'};
 const document={addEventListener(){},getElementById(){return root},title:''};
 const window={addEventListener(){}};
 const sessionStorage={getItem(){return unlocked?'yes':null},setItem(){},removeItem(){}};
 const runtime=unlocked?src:src.replace('const PUBLIC_SITE_LIVE=true','const PUBLIC_SITE_LIVE=false');
 const app=runInNewContext(catalogs+'\n'+experience+'\n'+runtime+'\n({render})',{document,location,window,sessionStorage});
 location.hash='#/'+route;app.render();return root.innerHTML;
}
test('Portada tiene las tres ventanas y no una barra lateral',()=>{
 const h=page('inicio');
 for(const name of ['FOUNDER VIP','ÚNETE A DEA','WEB PÚBLICA']) assert.match(h,new RegExp(name));
 assert.equal((h.match(/class="choice (?:vip|join|public)"/g)||[]).length,3);
 assert.doesNotMatch(h,/class="side/);
 assert.match(h,/aguila-dea-original\.jpg/);
});
test('Siete páginas públicas sin errores de renderizado',()=>{
 for(const p of ['publico','publico/agencia','publico/jerarquia','publico/departamentos','publico/founders','publico/ingreso','publico/normativa'])
  assert.ok(page(p).length>1000,p);
});
test('Los accesos VIP y agente llegan a la identificación de su área',()=>{
 assert.match(page('vip'),/href="#\/identificacion\/vip"/);
 assert.match(page('ficha'),/href="#\/identificacion\/agente"/);
 assert.match(page('inicio'),/href="#\/publico\/ingreso" class="choice join"/);
 for(const p of ['unete','identificacion/vip','identificacion/alta','identificacion/agente']){
  assert.match(page(p),/https:\/\/script\.google\.com\/macros\/s\/[^" ]+\/exec/);
 }
});
test('No se publica lógica anterior de Cloudflare ni demo',()=>{
 assert.doesNotMatch(src,/Cloudflare|wrangler|\/api\/|\/auth\/login|demo\.agents|ASCENSO_DEMO|NOMINA_DEMO/);
});
test('Jerarquía R1-R10 visible y nombres oficiales',()=>{
 const h=page('publico/jerarquia');
 for(let i=1;i<=10;i++)assert.ok(h.includes('class="dea-rank-chip">R'+i+'</strong>'),'R'+i);
 assert.match(h,/Agente de Enlace/);
 assert.match(h,/Jefe de Dirección/);
});
test('Imágenes originales y estilos en la distribución pública',async()=>{
 for(const f of ['styles.css','aguila-dea-original.jpg','logo-dea-es.png','og-image.jpg','icon-192.png','icon-512.png'])
  await access(new URL('./'+f,import.meta.url));
 assert.match(css,/\.shell-home/);
 assert.match(html,/\.\/styles\.css/);
 assert.match(html,/https:\/\/dea-habbo-es\.vercel\.app\/og-image\.jpg/);
});

test('Acceso de agentes conserva Habbo separado de Discord y ningún acceso VIP',()=>{
 const join=page('unete');
 assert.match(join,/Habbo y firma única/);
 assert.match(join,/Discord/);
 assert.match(join,/ENTRAR DIRECTAMENTE CON DISCORD/);
 assert.doesNotMatch(join,/discord_email|discord_username/);
 const nav=join.match(/<nav class="side-scroll"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
 assert.ok(nav);
 assert.match(nav,/Acceso de agentes/);
 assert.match(nav,/Mi expediente/);
 assert.doesNotMatch(nav,/Acceso VIP|identificacion\/vip|CENTRO VIP/);
});
test('El área de Founders está separada y no anuncia registro ni fichas de agentes',()=>{
 for(const path of ['vip','identificacion/vip','vip/solicitudes']){
  const view=page(path), nav=view.match(/<nav class="side-scroll"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert.ok(nav,path);
  assert.match(nav,/Acceso seguro/);
  assert.doesNotMatch(nav,/Ingreso R2|Acceso de agentes|Expediente personal|Mi expediente|identificacion\/alta|identificacion\/agente/);
 }
});
test('Identificación usa el OAuth real sin formularios de correo incompatibles',()=>{
 const vip=page('vip');assert.match(vip,/href="#\/identificacion\/vip"/);
 for(const path of ['identificacion/vip','identificacion/alta','identificacion/agente']){
  const gate=page(path);assert.match(gate,/ENTRAR DIRECTAMENTE CON DISCORD/);
  assert.match(gate,/https:\/\/script\.google\.com/);
  assert.doesNotMatch(gate,/discord_username|discord_email|method="post"|type="password"/);
 }
});
test('VIP, registro y expediente requieren validación en Apps Script',()=>{
 assert.match(page('unete'),/ENTRAR DIRECTAMENTE CON DISCORD/);
 assert.match(page('ficha'),/href="#\/identificacion\/agente"/);
 for(const route of ['identificacion/vip','identificacion/alta','identificacion/agente']){
  const html=page(route);
  assert.match(html,/https:\/\/script\.google\.com\/macros\/s\/[^" ]+\/exec/);
  assert.doesNotMatch(html,/access_token=|DISCORD_CLIENT_SECRET|data-action="grant-vip"/);
 }
});


test('Tres entradas oficiales permanecen claramente diferenciadas sin crear una cuarta',()=>{
 const h=page('inicio');
 assert.equal((h.match(/class="choice (?:vip|join|public)"/g)||[]).length,3);
 assert.match(h,/class="choice vip"/);
 assert.match(h,/class="choice join"/);
 assert.match(h,/class="choice public"/);
 assert.match(h,/href="#\/vip" class="choice vip"/);
 assert.match(h,/href="#\/publico\/ingreso" class="choice join"/);
 assert.match(h,/href="#\/publico" class="choice public"/);
 assert.match(h,/Zona privada reservada a Founders/);
 assert.match(h,/ACCESO RESTRINGIDO/);
 assert.match(h,/ACCESO LIBRE/);
});
test('Colores y neón de cada acceso, estados accesibles y respeto al movimiento reducido',()=>{
 for(const sel of ['.choice.vip{--choice-accent:', '.choice.join{--choice-accent:', '.choice.public{--choice-accent:', '.choice:hover,.choice:focus-visible', '.choice:active', '.app-layout .side-item:hover', '@media(prefers-reduced-motion:reduce)']){
  assert.ok(css.includes(sel),sel);
 }
 assert.match(css,/\.choice\.vip\{--choice-accent:#f4cb78/);
 assert.match(css,/\.choice\.join\{--choice-accent:#6edbff/);
 assert.match(css,/\.choice\.public\{--choice-accent:#7ce5c0/);
});
test('La navegación no mezcla un Founder con las fichas de los agentes',()=>{
 const vip=page('identificacion/vip');
 const agent=page('identificacion/alta');
 const menu=v=>v.match(/<nav class="side-scroll"[^>]*>([\s\S]*?)<\/nav>/)?.[1]||'';
 assert.match(menu(vip),/Acceso seguro/);
 assert.doesNotMatch(menu(vip),/Acceso de agentes|Mi expediente/);
 assert.match(menu(agent),/Acceso de agentes/);
 assert.match(menu(agent),/Mi expediente/);
 assert.doesNotMatch(menu(agent),/Acceso VIP|Acceso seguro/);
});

test('Antes de iniciar sesión sólo aparece el escudo, águila y formulario de preinauguración',()=>{
 for(const route of ['inicio','vip','identificacion/vip','identificacion/alta','publico/jerarquia']){
  const screen=page(route,false);
  assert.match(screen,/PREINAUGURACIÓN/);
  assert.match(screen,/logo-dea-es\.png/);
  assert.match(screen,/aguila-dea-original\.jpg/);
  assert.match(screen,/data-preview-login/);
  assert.match(screen,/type="password"/);
  assert.doesNotMatch(screen,/class="choice (?:vip|join|public)"/);
  assert.doesNotMatch(screen,/Centro de Control DEA|discord_username|discord_email/);
 }
});
test('Con sesión temporal se ven exactamente tres ventanas originales y todos los accesos',()=>{
 const home=page('inicio',true);
 assert.equal((home.match(/class="choice (?:vip|join|public)"/g)||[]).length,3);
 assert.match(page('identificacion/vip',true),/Identificación VIP/);
 assert.match(page('identificacion/alta',true),/Identificación de agentes/);
 assert.match(page('publico/jerarquia',true),/Rangos y ascensos/);
});
test('La contraseña no figura en claro en JavaScript y la puerta no suplanta Discord',()=>{
 assert.match(src,/PREVIEW_DIGEST='[a-f0-9]{64}'/);
 assert.doesNotMatch(src,/DEA-vc2pCQJ6P85lp3eqhKGRRMENKdu_YA/);
 assert.match(src,/PREVIEW_SESSION_KEY/);
 assert.match(src,/crypto\.subtle\.digest/);
 assert.match(src,/Discord se comprueban después/);
});


test('Pie 2026 visible con Powered by enlazado y sin firma personal ni frase de Founders',()=>{
 for(const p of ['inicio','vip','identificacion/vip','identificacion/alta','identificacion/agente','unete','ficha','publico','publico/agencia','publico/jerarquia','publico/placas','publico/departamentos','publico/founders','publico/ingreso','publico/normativa']){
  const screen=page(p,true);
  assert.match(screen,/© 2026 DEA HABBO ES/);
  assert.match(screen,/Powered by <a href="https:\/\/yourdesigngpt\.vercel\.app\/"/);
  assert.doesNotMatch(screen,/YourDesignGPT<\/a>[^<]*<span[^>]*>·<\/span> 10PEDRO/);
  assert.doesNotMatch(screen,/dea-credit-founders|DEA HABBO ES es un proyecto de sus cuatro Founders/);
  assert.match(screen,/No afiliada, patrocinada ni respaldada por Habbo ni Sulake/);
 }
});
test('En la pantalla de contraseña NO aparecen créditos, Founders ni pie editorial',()=>{
 for(const p of ['inicio','vip','identificacion/vip','identificacion/alta','publico/jerarquia']){
  const gate=page(p,false);
  assert.match(gate,/DEA HABBO ES · Preinauguración/);
  assert.doesNotMatch(gate,/© 2026|YourDesignGPT|10PEDRO|KietsyAndrea|lesslie\.ar|XPE_34|No afiliada/);
 }
});
test('Los cuatro lanzadores Founder conservan créditos sin firma personal ni frase de Founders',async()=>{
 for(const slug of ['10pedro','kietsyandrea','lesslie-ar','xpe-34']){
  const launcher=await readFile(new URL('./founder-'+slug+'.html',import.meta.url),'utf8');
  const footer=launcher.match(/<footer class="dea-founder-footer">([\s\S]*?)<\/footer>/)?.[1];
  assert.ok(footer,'Falta pie en '+slug);
  assert.match(footer,/© 2026 DEA HABBO ES/);
  assert.match(footer,/href="https:\/\/yourdesigngpt\.vercel\.app\/"/);
  assert.doesNotMatch(footer,/<a[^>]+>10PEDRO<\/a>/);
  assert.doesNotMatch(footer,/10PEDRO|KietsyAndrea|lesslie\.ar|XPE_34|dea-credit-founders/);
  assert.match(footer,/Habbo ni Sulake/);
 }
});

test('SEO de preinauguración: canónica Vercel y fichas sociales sin datos personales',async()=>{
 assert.match(html,/<link rel="canonical" href="https:\/\/dea-habbo-es\.vercel\.app\/"/);
 assert.match(html,/<meta property="og:url" content="https:\/\/dea-habbo-es\.vercel\.app\/"/);
 assert.match(html,/<meta property="og:image" content="https:\/\/dea-habbo-es\.vercel\.app\/og-image\.jpg"/);
 assert.match(html,/<meta name="twitter:image" content="https:\/\/dea-habbo-es\.vercel\.app\/og-image\.jpg"/);
 assert.match(html,/<meta property="og:locale" content="es_ES"/);
 assert.doesNotMatch(html,/pitersc10\.github\.io|YourDesignGPT|10PEDRO/);
 const match=html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
 assert.ok(match,'JSON-LD existente');
 const ld=JSON.parse(match[1]);
 assert.equal(ld['@type'],'WebSite');
 assert.equal(ld.url,'https://dea-habbo-es.vercel.app/');
 assert.equal(ld.name,'DEA HABBO ES');
});

test('Apertura SEO pública y miniapps privadas siempre noindex',async()=>{
 const vercel=JSON.parse(await readFile(new URL('./vercel.json',import.meta.url),'utf8'));
 const global=vercel.headers.find(h=>h.source==='/(.*)');
 assert.ok(global);
 assert.ok(!global.headers.some(h=>h.key==='X-Robots-Tag'),'Nunca noindex global');
 assert.ok(html.includes('content="index,follow,max-image-preview:large"'));
 const privateFiles=['founder-10pedro.html','founder-kietsyandrea.html','founder-lesslie-ar.html','founder-xpe-34.html','directores-deawebapp.html','managers-deawebapp.html'];
 for(const f of privateFiles){
  const entry=vercel.headers.find(x=>x.source==='/'+f);
  assert.ok(entry&&entry.headers.some(h=>h.key==='X-Robots-Tag'&&h.value.includes('noindex')),f);
  const privateHtml=await readFile(new URL('./'+f,import.meta.url),'utf8');
  assert.ok(privateHtml.includes('noindex,nofollow,noarchive,nosnippet'),f);
 }
 const crawler=await readFile(new URL('./robots.txt',import.meta.url),'utf8');
 assert.ok(crawler.includes('User-agent: *'));
 assert.ok(crawler.includes('Sitemap: https://dea-habbo-es.vercel.app/sitemap.xml'));
 assert.ok(src.includes('const PUBLIC_SITE_LIVE=true'));
 assert.ok(page('inicio',true).includes('class="choice vip"'));
 assert.ok(page('publico/jerarquia',true).includes('dea-catalog-window'));
 assert.ok(!page('inicio',true).includes('data-preview-login'));
});

test('SEO: títulos propios por sección y sin renunciar al bloqueo de la portada',()=>{
 assert.match(src,/const PAGE_SEO=/);
 for(const item of ['publico/agencia','publico/jerarquia','publico/ingreso','publico/normativa']){
  assert.ok(src.includes("'"+item+"'"),item);
 }
 assert.match(src,/document\.title='Preinauguración \| DEA HABBO ES'/);
 assert.match(page('inicio',false),/PREINAUGURACIÓN/);
 assert.equal((page('inicio',true).match(/class="choice (?:vip|join|public)"/g)||[]).length,3);
});

test('Neones en parte superior de área pública, sin cambiar portada',()=>{
 const h=page('publico');
 assert.equal(h.split('class="dea-neon-link ').length-1,2);
 for(const p of ['publico/jerarquia','publico/placas'])assert.ok(h.includes('href="#/'+p+'"'));
 assert.ok(!page('inicio').includes('dea-public-neon-nav'));
 assert.ok(!page('vip').includes('dea-public-neon-nav'));
});
test('Tabla completa: 70 rangos internos oficiales R1–R10',()=>{
 const h=page('publico/jerarquia');
 const table=h.match(/<table class="dea-rank-table">([\s\S]*?)<\/table>/)?.[1];
 assert.ok(table,'Falta la tabla R1–R10');
 assert.equal(table.split('class="dea-rank-chip"').length-1,70);
 for(const x of ['Cadete','Agente de Enlace','Instructor en Jefe','Estratega en División','Supervisor de Unidad','Jefe de Dirección','R7','R8','R9','R10','130 c','240 c','500 c'])assert.ok(h.includes(x),x);
 assert.ok(h.includes('Cerrar ventana'));
});
test('Escalafón PDF: 26 nuevos rangos R7–R10 visibles',()=>{
 const h=page('publico/jerarquia');
 const names=['Delegado Dir. Cadetes','Delegado Dir. Agentes','Delegado Dir. Elite','Delegado Dir. Logística','Delegado Dir. Base','Delegado Dir. Advisor','Delegado Dir. General','Delegado Dir. Jefe','Secretario Base','Secretario Advisor I','Secretario Advisor II','Secretario Advisor III','Secretario Coord. I','Secretario Coord. II','Secretario Coord. III','Secretario General','Secretario en Jefe','Líder en Formación','Líder de Base','Líder de Division','Líder de General','Líder de Coorp','Mánager en Formación','Mánager de PBL','Mánager de RRHH','Mánager MKT'];
 assert.equal(names.length,26);
 for(const n of names)assert.ok(h.includes(n),'Falta: '+n);
});
test('Rangos y ascensos: autoridad acumulativa hasta R5, R7 y R10 en tabla y sección final',()=>{
 const view=page('publico/jerarquia');
 assert.match(view,/¿Quién puede ascender a quién\?/);
 assert.match(view,/Permisos <strong>acumulativos<\/strong>/);
 assert.match(view,/Quién puede autorizar/);
 assert.match(view,/DIRECTORES[\s\S]*?Ascensos hasta R5 incluido/);
 assert.match(view,/MANAGERS[\s\S]*?Ascensos hasta R7 incluido/);
 assert.match(view,/FOUNDERS[\s\S]*?Ascensos hasta R10 incluido/);
 assert.match(view,/Directores · Managers · Founders/);
 assert.match(view,/Managers · Founders/);
 assert.match(view,/Formación presencial en Habbo/);
 assert.match(view,/R7, R8, R9 y R10:[\s\S]*?nombres internos ya están publicados/);
 assert.match(view,/verificación del permiso en el servidor mediante Discord/);
 assert.ok(view.indexOf('Ingreso gratuito o compra presencial')<view.indexOf('¿Quién puede ascender a quién?'),'La normativa queda al final');
});
test('Normativa no invade Placas, preinauguración ni la portada principal',()=>{
 for(const route of ['inicio','publico/placas','vip'])assert.doesNotMatch(page(route),/dea-ascension-permissions/);
 assert.doesNotMatch(page('publico/jerarquia',false),/dea-ascension-permissions/);
 assert.equal((page('publico').match(/class="dea-neon-link /g)||[]).length,2);
});

test('Catálogo de placas: VIP real y condiciones presenciales sin checkout',()=>{
 const h=page('publico/placas');
 assert.equal(h.split('class="dea-plaque-card"').length-1,2);
 for(const x of ['Preguntar a Founders','BENEFICIO · SIN RANGO','sin poderes sobre la sala','No se realizan pagos desde esta web'])assert.ok(h.includes(x),x);
 assert.ok(!h.includes('checkout'));
 for(const text of ['[DEA] Guardapaga','20 créditos','un mes desde la compra','48 horas','22:00'])assert.ok(h.includes(text),text);
});
test('La puerta de preinauguración está activa antes de los tres accesos',()=>{
 for(const p of ['publico/jerarquia','publico/placas']){
  const h=page(p,false);
  assert.ok(h.includes('PREINAUGURACIÓN'));
  assert.ok(!h.includes('dea-catalog-window'));
 }
 assert.ok(html.includes('index,follow,max-image-preview:large'));
});

test('Cuatro páginas Founder individuales, visibles directamente sin la portada',async()=>{
 for(const [nick,base] of [['10PEDRO','founder-10pedro'],['KietsyAndrea','founder-kietsyandrea'],['lesslie.ar','founder-lesslie-ar'],['XPE_34','founder-xpe-34']]){
  const raw=await readFile(new URL('./'+base+'.html',import.meta.url),'utf8');
  const manifest=JSON.parse(await readFile(new URL('./'+base+'.webmanifest',import.meta.url),'utf8'));
  assert.match(raw,/DEA CONTROL APP FOUNDER \(NO COMPARTIR\)/);
  assert.match(raw,/NO COMPARTIR ESTE ENLACE/);
  assert.ok(raw.includes('data-founder="'+nick+'"'));
  assert.ok(!raw.includes('dea_v7_session'));
  assert.equal(manifest.start_url,'./'+base+'.html');
  assert.equal(manifest.display,'standalone');
 }
});
test('Lanzadores sin tokens y con enlace por Founder a Discord/Apps Script',async()=>{
 const js=await readFile(new URL('./founder-app.js',import.meta.url),'utf8');
 assert.match(js,/script\.google\.com\/macros\/s\//);
 assert.match(js,/\?founder=/);
 assert.match(js,/&tab=/);
 assert.doesNotMatch(js,/DISCORD_CLIENT_SECRET|access_token|password|localStorage|sessionStorage/);
 const build=await readFile(new URL('./build.mjs',import.meta.url),'utf8');
 assert.match(build,/founder-10pedro.html/);
 assert.match(build,/founder-app.js/);
 assert.doesNotMatch(build,/FounderControl\.gs|Code\.gs|Portal\.html/);
});

test('Dos miniapps generales de Directores y Managers con límites acumulativos y sin acceso automático',async()=>{
 const configs=[
  ['directores-deawebapp.html','director','Hasta R5','R2–R5'],
  ['managers-deawebapp.html','manager','Hasta R7','R2–R7']
 ];
 for(const [file,role,,range] of configs){
  const html=await readFile(new URL('./'+file,import.meta.url),'utf8');
  assert.match(html,new RegExp('data-dea-role="'+role+'"'));
  assert.ok(html.includes('HASTA R'+(role==='director'?5:7)));
  assert.ok(html.includes(range));
  assert.match(html,/IDENTIFICARME CON DISCORD/);
  assert.match(html,/id="dea-role-enter"/);
  assert.match(html,/La identidad y los límites se comprueban en Google Apps Script/);
  assert.match(html,/Acceso operativo mediante Discord/);
  assert.doesNotMatch(html,/name="discord_id"|role="founder"|data-form="ascenso"/);
  assert.match(html,/© 2026 DEA HABBO ES/);
  assert.match(html,/Habbo ni Sulake/);
  assert.match(html,/noindex,nofollow,noarchive,nosnippet/);
 }
 const launcher=await readFile(new URL('./dea-cargos.js',import.meta.url),'utf8');
 assert.match(launcher,/role==='director'/);
 assert.match(launcher,/\['director','manager'\]\.includes\(role\)/);
 assert.match(launcher,/\?start=direct&app=/);
 assert.match(launcher,/d-directores/);
 assert.match(launcher,/m-managers/);
 assert.doesNotMatch(launcher,/client_secret|DISCORD_CLIENT_SECRET|access_token|sessionStorage|localStorage/);
 const stylesheet=await readFile(new URL('./dea-cargos.css',import.meta.url),'utf8');
 assert.match(stylesheet,/dea-role-director/);
 assert.match(stylesheet,/dea-role-manager/);
 const build=await readFile(new URL('./build.mjs',import.meta.url),'utf8');
 for(const file of ['directores-deawebapp.html','managers-deawebapp.html','dea-cargos.js','dea-cargos.css'])
  assert.ok(build.includes(file),file);
 assert.doesNotMatch(build,/RoleControl\.gs|Code\.gs|Portal\.html/);
});

test('WEB CHECK SCAN V6 está integrado en el layout principal sin una página nueva',async()=>{
 const module=await readFile(new URL('./web-check-scan.js',import.meta.url),'utf8');
 const build=await readFile(new URL('./build.mjs',import.meta.url),'utf8');
 const packageJson=await readFile(new URL('./package.json',import.meta.url),'utf8');
 assert.match(html,/<script src="\.\/web-check-scan\.js(?:\?[^\"]+)?" defer><\/script>/);
 assert.match(build,/'web-check-scan\.js'/);
 assert.match(packageJson,/node --check web-check-scan\.js/);
 assert.match(module,/\.home-foot,#app \.foot/);
 assert.doesNotMatch(module,/#app \.home-foot,#app \.foot,#app \.dea-preview-footer/);
 assert.match(module,/WEB CHECK SCAN/);
 assert.match(module,/role="dialog" aria-modal="true"/);
 assert.match(module,/data-dea-tech-close/);
 assert.match(module,/RUN SCAN AGAIN/);
 assert.match(module,/runBtn\.disabled=false/);
 assert.match(module,/prefers-reduced-motion:reduce/);
 assert.match(module,/@media\(max-width:630px\)/);
 for(const term of ['FRONTEND & DESIGN','WEB APPLICATION','INTEGRATIONS & DATABASE','INFRASTRUCTURE','SYSTEM REVIEW COMPLETED','Public Components Reviewed','PROJECT DEVELOPMENT REPORT'])assert.ok(module.includes(term),term);
 for(const term of ['HTML5 Structure','CSS3 Responsive Framework','JavaScript Application','Navigation System','Corporate Visual Identity','Mobile Compatibility','Public Information Portal','R1–R10 Rank Structure','Promotion Rules','Benefit Badge Catalog','Founder Access Launchers','Directors WebApp','Managers WebApp','Discord OAuth2 Configuration','Google Apps Script Connection','Google Sheets Data Structure','Agent Records System','Promotion Management','Payroll & Guardapaga','Audit Log Architecture','GitHub Repository','Vercel Deployment','GitHub Pages Backup','SEO Metadata','PWA Manifest','Website Resource Integrity'])assert.ok(module.includes(term),term);
 assert.match(module,/PRIVATE VALIDATION REQUIRED/);
 assert.match(module,/No constituye auditoría|No constituye auditoría externa|no constituye auditoría externa/i);
 assert.match(module,/const HOURS=WORK.reduce/);
 assert.match(module,/aria-label="Importe oculto"/);assert.match(module,/data-dea-valuation-toggle/);
 assert.doesNotMatch(module,/5\.400 €|6\.900 €/);
 assert.doesNotMatch(module,/4\.050 €|135 h|client_secret|DISCORD_CLIENT_SECRET|apiKey|access_token/);
 assert.match(module,/https:\/\/yourdesigngpt\.vercel\.app\//);
 assert.match(module,/Designed &amp; Developed by/);
 assert.match(module,/No es presupuesto aceptado, factura ni certificación/);
 assert.doesNotMatch(module,/https:\/\/script\.google\.com\/macros/);
 for(const route of ['inicio','publico','publico/jerarquia','publico/placas']){
  assert.ok(page(route,true).includes('dea-credit-main'),route);
 }
 assert.doesNotMatch(page('inicio',false),/WEB CHECK SCAN/);
 assert.match(page('inicio',false),/DEA HABBO ES · Preinauguración/);
});

test('Search Console, sitemap y seis páginas de búsqueda públicos',async()=>{
 const verification=await readFile(new URL('./google8fa052a4ee6eb69c.html',import.meta.url),'utf8');
 const build=await readFile(new URL('./build.mjs',import.meta.url),'utf8');
 const sitemap=await readFile(new URL('./sitemap.xml',import.meta.url),'utf8');
 const cssSEO=await readFile(new URL('./seo-public.css',import.meta.url),'utf8');
 assert.equal(verification.trim(),'google-site-verification: google8fa052a4ee6eb69c.html');
 assert.ok(build.includes("'google8fa052a4ee6eb69c.html'"));
 assert.ok(build.includes("'sitemap.xml'"));
 assert.ok(build.includes("'seo-public.css'"));
 assert.ok(cssSEO.includes('@media(max-width:640px)'));
 assert.ok(sitemap.includes('https://dea-habbo-es.vercel.app/'));
 for(const slug of ['agencia-habbo','rangos-habbo','departamentos','unirse-a-dea','normativa','founders']){
  const p=await readFile(new URL('./'+slug+'/index.html',import.meta.url),'utf8');
  assert.ok(sitemap.includes('https://dea-habbo-es.vercel.app/'+slug+'/'),slug);
  assert.ok(p.includes('<meta name="robots" content="index,follow'),slug);
  assert.ok(p.includes('<link rel="canonical" href="https://dea-habbo-es.vercel.app/'+slug+'/">'),slug);
  assert.ok(p.includes('<h1>'),slug);
  assert.ok(p.includes('DEA HABBO ES'),slug);
  assert.ok(!p.includes('DISCORD_CLIENT_SECRET')&&!p.includes('google.script.run'),slug);
  assert.ok(build.includes("'"+slug+"'"),slug);
 }
 assert.ok(page('inicio',true).includes('#/publico/jerarquia'));
 assert.ok(html.includes('index,follow,max-image-preview:large'));
});


test('Menú móvil: fondo dentro del layout, abrir, cerrar, Escape y navegar',()=>{
 const handlers={},windowHandlers={};
 const root={innerHTML:'',addEventListener(type,fn){(handlers[type]??=[]).push(fn)},querySelector(){return null}};
 const location={hash:'#/publico'};
 const context={document:{getElementById(){return root}},location,window:{addEventListener(type,fn){windowHandlers[type]=fn},scrollTo(){}},innerWidth:390,sessionStorage:{getItem(){return 'yes'}}};
 runInNewContext(catalogs+'\n'+src,context);
 const action=name=>handlers.click.forEach(fn=>fn({stopPropagation(){},target:{closest(selector){return selector==='[data-route],[data-action]'?{dataset:{action:name}}:null}}}));
 assert.match(root.innerHTML,/^<div class="app-layout app-area-publico"><div class="mobile-overlay/);
 action('mobile-menu');
 assert.match(root.innerHTML,/class="mobile-overlay active"/);
 assert.match(root.innerHTML,/class="side expanded mobile-open"/);
 assert.match(root.innerHTML,/aria-label="Mostrar menú" aria-expanded="true"/);
 action('close-mobile');assert.doesNotMatch(root.innerHTML,/mobile-open/);
 action('mobile-menu');handlers.keydown.forEach(fn=>fn({key:'Escape'}));assert.doesNotMatch(root.innerHTML,/mobile-open/);
 action('mobile-menu');location.hash='#/publico/founders';windowHandlers.hashchange();
 assert.doesNotMatch(root.innerHTML,/mobile-open/);assert.match(root.innerHTML,/KietsyAndrea/);
});

test('Habboween: Founders públicos con adornos limitados; original y VIP sin escena',async()=>{
 const theme=await readFile(new URL('./habboween-v2.js',import.meta.url),'utf8');
 const events={},nodes=[],classes=new Set();let storage='habboween';
 function element(){const el={parentNode:null,hidden:false,setAttribute(){},addEventListener(type,fn){this[type]=fn},remove(){this.parentNode=null},prepend(node){node.parentNode=this},append(node){node.parentNode=this}};nodes.push(el);return el}
 const target=element(),root={querySelector(selector){assert.equal(selector,'.app-area-publico .main-body, .app-area-unete .main-body');return target}};
 const body=element();body.classList={toggle(name,on){on?classes.add(name):classes.delete(name)}};
 const location={hash:'#/publico/founders'};
 runInNewContext(theme,{document:{createElement:element,getElementById(){return root},body,contains(el){return !!el.parentNode}},localStorage:{getItem(){return storage},setItem(k,v){storage=v}},location,window:{addEventListener(type,fn){events[type]=fn}},requestAnimationFrame(fn){fn()},MutationObserver:class{observe(){}}});
 const scene=nodes.find(el=>el.className==='hw-page-scene'),button=nodes.find(el=>el.id==='dea-hw-switch');
 assert.ok(classes.has('dea-hw-v2'));assert.equal(scene.parentNode,target);assert.equal(scene.hidden,false);
 button.click();assert.equal(storage,'original');assert.equal(scene.parentNode,null);assert.equal(scene.hidden,true);
 button.click();assert.equal(scene.parentNode,target);
 for(const path of ['vip','vip/solicitudes','identificacion/vip','ficha','founder-10pedro']){
  location.hash='#/'+path;events.hashchange();assert.equal(scene.parentNode,null,path);assert.equal(button.hidden,true,path);assert.equal(classes.has('dea-hw-v2'),false,path);
 }
 location.hash='#/publico/founders';events.hashchange();assert.equal(scene.parentNode,target);assert.equal(button.hidden,false);
 const themeCss=await readFile(new URL('./habboween-v2.css',import.meta.url),'utf8');
 assert.match(themeCss,/\.hw-page-scene\[hidden\]\{display:none!important\}/);
 assert.match(themeCss,/\.hw-page-scene img\{[^}]*max-width:38px;max-height:44px/);
});

 test('Escalafón actualizado y cargos confirmados sin conceder accesos',()=>{
 const h=page('publico/jerarquia');
 for(const n of ['Agente de Enlace I','Agente de Enlace II','Agente de Enlace III','Agente de Élite V','Instructor Advisor III','Estratega VI','[FIRMA DE DIRECTOR DE AGENTES]'])assert.ok(h.includes(n),n);
 const f=page('publico/founders');
 for(const n of ['CLASIFICADO · DEA','PRÓXIMAMENTE','Primera al mando','Jefa del Departamento de Comunicación'])assert.ok(f.includes(n),n);
 assert.doesNotMatch(f,/Fr4nn_23/);
 assert.doesNotMatch(h,/dea-rank-chip">R11/);
 assert.match(page('vip'),/identificacion\/vip/);
 });

test('Identidades de staff reservadas: cuatro managers en fila y líderes debajo',()=>{
 const f=page('publico/founders');
 const sections=[...f.matchAll(/<section class="dea-confirmed-staff">([\s\S]*?)<\/section>/g)].map(x=>x[1]);
 assert.equal(sections.length,2);
 assert.equal((sections[0].match(/class="dea-classified-card"/g)||[]).length,4);
 assert.equal((sections[1].match(/class="dea-classified-card"/g)||[]).length,1);
 for(const section of sections){assert.doesNotMatch(section,/<img|avatarimage|habbo=/);assert.match(section,/IDENTIDAD RESERVADA/);}
 assert.doesNotMatch(page('publico/jerarquia'),/Habbo confirmado:/);
 assert.doesNotMatch(src.slice(src.indexOf('const DEA_PUBLIC_STAFF'),src.indexOf('function deaRankMission')),/habbo:|avatarimage/);
 assert.match(css,/\.dea-staff-grid\{display:grid;grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);
});

test('Nóminas públicas: dos jornadas, banderas y horarios por fecha, sin pagas extra',()=>{const view=page('publico/nominas');for(const value of ['22:00','miércoles','sábado','Argentina','Ciudad de México','Colombia','Ecuador','República Dominicana','Puerto Rico','Chile','Uruguay','Guardapaga','20 créditos','48 horas'])assert.ok(view.includes(value),value);assert.doesNotMatch(view,/pagas? extra/i);assert.ok(page('publico').includes('#/publico/nominas'));});

test('Cuba utiliza UTC-4 en invierno según IANA 2026f',()=>{const value=runInNewContext(catalogs+";deaPayrollTimes('2026-11-04').find(x=>x.zone==='America/Havana').time",{});assert.equal(value,'17:00');});
