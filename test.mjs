import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile, access} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
const src=await readFile(new URL('./app.js',import.meta.url),'utf8');
const css=await readFile(new URL('./styles.css',import.meta.url),'utf8');
const html=await readFile(new URL('./index.html',import.meta.url),'utf8');
function page(route,unlocked=true){
 const root={innerHTML:'',addEventListener(){}};
 const location={hash:'#/inicio'};
 const document={getElementById(){return root},title:''};
 const window={addEventListener(){}};
 const sessionStorage={getItem(){return unlocked?'yes':null},setItem(){},removeItem(){}};
 const app=runInNewContext(src+'\n({render})',{document,location,window,sessionStorage});
 location.hash='#/'+route;app.render();return root.innerHTML;
}
test('Portada tiene las tres ventanas y no una barra lateral',()=>{
 const h=page('inicio');
 for(const name of ['ACCESO VIP','ÚNETE A DEA','WEB PÚBLICA']) assert.match(h,new RegExp(name));
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
 assert.match(page('inicio'),/href="#\/identificacion\/alta" class="choice join"/);
 for(const p of ['unete','identificacion/vip','identificacion/alta','identificacion/agente']){
  assert.match(page(p),/https:\/\/script\.google\.com\/macros\/s\/[^" ]+\/exec/);
 }
});
test('No se publica lógica anterior de Cloudflare ni demo',()=>{
 assert.doesNotMatch(src,/Cloudflare|wrangler|\/api\/|\/auth\/login|demo\.agents|ASCENSO_DEMO|NOMINA_DEMO/);
});
test('Jerarquía R1-R10 visible y nombres oficiales',()=>{
 const h=page('publico/jerarquia');
 for(let i=1;i<=10;i++)assert.match(h,new RegExp('R'+i+' · '));
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
 assert.match(join,/nick de Habbo como nombre principal/);
 assert.match(join,/tu ID de Discord/);
 assert.match(join,/ENTRAR DIRECTAMENTE CON DISCORD/);
 assert.match(join,/ACEPTAR Y VERIFICAR CON DISCORD/);
 const nav=join.match(/<nav class="side-scroll">([\s\S]*?)<\/nav>/)?.[1];
 assert.ok(nav);
 assert.match(nav,/Acceso de agentes/);
 assert.match(nav,/Mi expediente/);
 assert.doesNotMatch(nav,/Acceso VIP|identificacion\/vip|CENTRO VIP/);
});
test('El área de Founders está separada y no anuncia registro ni fichas de agentes',()=>{
 for(const path of ['vip','identificacion/vip','vip/solicitudes']){
  const view=page(path), nav=view.match(/<nav class="side-scroll">([\s\S]*?)<\/nav>/)?.[1];
  assert.ok(nav,path);
  assert.match(nav,/Acceso seguro/);
  assert.doesNotMatch(nav,/Ingreso R2|Acceso de agentes|Expediente personal|Mi expediente|identificacion\/alta|identificacion\/agente/);
 }
});
test('VIP muestra Discord directo y debajo usuario y correo obligatorio',()=>{
 const vip=page('vip');
 assert.match(vip,/href="#\/identificacion\/vip"/);
 assert.doesNotMatch(vip,/href="https:\/\/script\.google\.com/);
 const gate=page('identificacion/vip');
 assert.match(gate,/ENTRAR DIRECTAMENTE CON DISCORD/);
 assert.match(gate,/ACEPTAR Y VERIFICAR CON DISCORD/);
 assert.match(gate,/name="discord_username"/);
 assert.match(gate,/name="discord_email"/);
 assert.match(gate,/type="email"[^>]*required/);
 assert.match(gate,/method="post"/);
 assert.match(gate,/name="login_mode" value="manual"/);
 assert.match(gate,/Discord te pedirá que autorices la identidad/);
 assert.doesNotMatch(gate,/type="password"/);
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
 assert.match(h,/href="#\/identificacion\/alta" class="choice join"/);
 assert.match(h,/href="#\/publico" class="choice public"/);
 assert.match(h,/Zona reservada a Founders/);
 assert.match(h,/Sin permisos de dirección/);
 assert.match(h,/Información abierta/);
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
 const menu=v=>v.match(/<nav class="side-scroll">([\s\S]*?)<\/nav>/)?.[1]||'';
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
 assert.match(page('publico/jerarquia',true),/Jerarquía R1–R10/);
});
test('La contraseña no figura en claro en JavaScript y la puerta no suplanta Discord',()=>{
 assert.match(src,/PREVIEW_DIGEST='[a-f0-9]{64}'/);
 assert.doesNotMatch(src,/DEA-vc2pCQJ6P85lp3eqhKGRRMENKdu_YA/);
 assert.match(src,/PREVIEW_SESSION_KEY/);
 assert.match(src,/crypto\.subtle\.digest/);
 assert.match(src,/Discord se comprueban después/);
});


test('Ninguna página visible incluye créditos personales en pie o marca de agua',()=>{
 for(const p of ['inicio','vip','identificacion/vip','unete','ficha','publico','publico/jerarquia']){
  const screen=page(p);
  assert.doesNotMatch(screen,/YourDesignGPT|yourdesigngpt\.netlify\.app|Designed by|Diseñado por/);
 }
 const gate=page('inicio',false);
 assert.doesNotMatch(gate,/10PEDRO|YourDesignGPT|yourdesigngpt\.netlify\.app|Designed by|Diseñado por/);
 assert.match(gate,/DEA HABBO ES · Preinauguración/);
 assert.match(page('inicio'),/© DEA HABBO ES · Comunidad independiente/);
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

test('Preinauguración permanece explícitamente fuera de Google, sin sitemap abierto',async()=>{
 const vercel=JSON.parse(await readFile(new URL('./vercel.json',import.meta.url),'utf8'));
 const headers=vercel.headers.flatMap(h=>h.headers);
 const robots=headers.find(h=>h.key.toLowerCase()==='x-robots-tag');
 assert.match(robots.value,/noindex/);
 assert.match(html,/<meta name="robots" content="noindex,nofollow,noarchive,nosnippet"/);
 const crawler=await readFile(new URL('./robots.txt',import.meta.url),'utf8');
 assert.match(crawler,/User-agent: \*/);
 assert.match(crawler,/Allow: \/\s*$/m);
 assert.doesNotMatch(crawler,/^Sitemap:/m);
 const build=await readFile(new URL('./build.mjs',import.meta.url),'utf8');
 assert.match(build,/robots\.txt/);
 assert.match(src,/PREVIEW_SESSION_KEY/);
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

test('Normativa actualizada: nóminas miércoles y sábados, sin domingo',()=>{
 const html=page('publico/normativa');
 assert.match(html,/MIÉRCOLES y SÁBADOS/);
 assert.doesNotMatch(html,/miércoles y domingo|Miércoles y domingo|Pago(?:s)? ordinarios miércoles y domingo/i);
 assert.match(html,/pagas extraordinarias tienen un registro separado/);
 assert.match(html,/SOLO los Founders pueden vender/);
 assert.match(html,/comprobación en sala/i);
});

test('Tarifas de compra supervisada y entrada gratuita: sin ventas automáticas',()=>{
 const html=page('publico/compra-rangos');
 for(const v of ['Supervisor','Director','Delegado','60 c','150 c','360 c','130 créditos','240 créditos','500 créditos','Founders / CEO'])assert.ok(html.includes(v),v);
 assert.match(html,/no procesa ni autoriza compras automáticas/);
 const ingreso=page('publico/ingreso');
 assert.match(ingreso,/Ingreso gratuito/);
 assert.match(ingreso,/Consultar compra de rango/);
 assert.match(ingreso,/publico\/compra-rangos/);
});

test('Las placas requieren aprobación Founder, caducidad y catálogo todavía sin precios',()=>{
 const html=page('publico/placas');
 assert.match(html,/SOLO un Founder puede vender/);
 assert.match(html,/caducidad/);
 assert.match(html,/banderín/);
 assert.match(html,/necesitan instalarse y probarse en Google Apps Script/);
 assert.doesNotMatch(html,/data-form="placa"\/|creditos=\d+/);
});

test('Eventos con CEO actualizado y sin calendario inventado',()=>{
 const found=page('publico/founders');
 const eventos=page('publico/eventos');
 assert.match(found,/XPE_34/);
 assert.match(found,/CEO · EVENTOS/);
 assert.doesNotMatch(found,/CEO · DIRECTOR DE MARKETING/);
 assert.match(eventos,/XPE_34 — CEO de Eventos/);
 assert.match(eventos,/No hay eventos con fechas publicadas/);
});

test('Las nuevas secciones son solo públicas: VIP y agentes no obtienen controles',()=>{
 const nav=page('publico/placas').match(/<nav class="side-scroll">([\s\S]*?)<\/nav>/)?.[1]||'';
 for(const p of ['publico/compra-rangos','publico/placas','publico/eventos'])assert.ok(nav.includes(p),p);
 for(const p of ['identificacion/vip','identificacion/alta']){
  const pageHtml=page(p);
  assert.doesNotMatch(pageHtml,/data-form="placa"|data-form="venta"|data-form="pago-rango"/);
 }
 for(const p of ['publico/compra-rangos','publico/placas','publico/eventos'])
  assert.match(page(p,false),/data-preview-login/);
});
