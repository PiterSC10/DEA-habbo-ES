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
test('Entradas privadas apuntan a Apps Script',()=>{
 for(const p of ['vip','vip/solicitudes','unete','ficha','ficha/pagos'])
  assert.match(page(p),/https:\/\/script\.google\.com\/macros\/s\/[^" ]+\/exec/);
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

test('Ingreso distingue identidad Discord y nick de Habbo, sin permitir acceso VIP directo',()=>{
 const join=page('unete');
 assert.match(join,/nombre de Habbo, aunque sea diferente/);
 assert.match(join,/ID de Discord/);
 assert.match(join,/pendiente de confirmación por un Founder/);
 const vip=page('vip');
 assert.match(vip,/Entrar con Discord/);
 assert.doesNotMatch(vip,/data-action="approve"|data-action="demo-/);
});
