import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile, access} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
const src=await readFile(new URL('./app.js',import.meta.url),'utf8');
const css=await readFile(new URL('./styles.css',import.meta.url),'utf8');
const html=await readFile(new URL('./index.html',import.meta.url),'utf8');
function page(route){
 const root={innerHTML:'',addEventListener(){}};
 const location={hash:'#/inicio'};
 const document={getElementById(){return root},title:''};
 const window={addEventListener(){}};
 const app=runInNewContext(src+'\n({render})',{document,location,window});
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
 assert.doesNotMatch(src,/Cloudflare|wrangler|\/api\/|\/auth\/login|sessionStorage|demo\.agents|ASCENSO_DEMO|NOMINA_DEMO/);
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
 assert.match(html,/https:\/\/pitersc10\.github\.io\/DEA-habbo-ES\/og-image\.jpg/);
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
