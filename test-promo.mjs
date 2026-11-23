import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const source=readFileSync(new URL('./dea-promo.js',import.meta.url),'utf8');
function start({hash='#/inicio',now='2026-11-23T08:00:00Z',closed=false}={}){
 const listeners={},timers=new Map(),store=new Map(closed?[['dea-popup-bienvenida-faq-20261123-v1','1']]:[]);let card=null,seq=0;
 const location={hash};const window={addEventListener:(name,fn)=>listeners[name]=fn};
 const document={hidden:false,addEventListener(){},getElementById:()=>card,createElement(){return {innerHTML:'',setAttribute(){},querySelector(){return {addEventListener:(name,fn)=>this.close=fn}},querySelectorAll(){return []},addEventListener(){},remove(){card=null}}},body:{append(el){card=el}}};
 runInNewContext(source,{location,window,document,sessionStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},Date:{now:()=>Date.parse(now),parse:Date.parse},setTimeout:fn=>{timers.set(++seq,fn);return seq},clearTimeout:id=>timers.delete(id)});
 function flush(){const batch=[...timers.values()];timers.clear();batch.forEach(fn=>fn());}
 return {get card(){return card},flush,store,navigate(hash){location.hash=hash;listeners.hashchange()}};
}
test('Popup compacto da la bienvenida y únicamente ofrece acceso FAQ DEA',()=>{
 const x=start();assert.equal(x.card,null);x.flush();const s=x.card.innerHTML;
 assert.match(s,/dea-welcome-panel/);assert.match(s,/BIENVENIDO A/);assert.match(s,/FAQ DEA/);assert.match(s,/Todas tus dudas resueltas/);
 assert.equal((s.match(/<a\\s/g)||[]).length,2);assert.match(s,/href="#\\/publico\\/faq"/);assert.match(s,/href="#\\/publico\\/noticias"/);assert.match(s,/Nuevos comandos en DEA/);for(const c of [':membresias',':misiones',':traslados'])assert.ok(s.includes(c));
 for(const word of ['RANGOS EN OFERTA','VIP PERMANENTE','VER OFERTAS DE RANGO','Comprar rangos','35 c'])assert.ok(!s.includes(word),word);
});
test('Cerrar guarda la decisión durante la sesión y no reaparece',()=>{
 const x=start();x.flush();x.card.close();assert.equal(x.card,null);x.navigate('#/inicio');x.flush();assert.equal(x.card,null);
 const y=start({closed:true});y.flush();assert.equal(y.card,null);
});
test('Se abre solo en portada, sin bloquear interiores ni identificación',()=>{
 for(const hash of ['#/publico','#/publico/faq','#/vip','#/identificacion/vip','#/unete','#/ficha','#/publico/compra-rangos']){const x=start({hash});x.flush();assert.equal(x.card,null,hash);}
 const x=start();x.flush();x.navigate('#/publico');assert.equal(x.card,null);
});
test('La bienvenida no caduca después de noviembre y mantiene su escena Habbo',()=>{
 const x=start({now:'2026-12-02T11:00:00Z'});x.flush();assert.ok(x.card);assert.match(x.card.innerHTML,/dea-promo-scene/);assert.match(x.card.innerHTML,/logo-dea-es.png/);
});
