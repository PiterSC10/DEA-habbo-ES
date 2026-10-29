import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const source=readFileSync(new URL('./dea-promo.js',import.meta.url),'utf8');
function start({hash='#/inicio',now='2026-11-15T12:00:00Z',closed=false}={}){
 const listeners={},timers=new Map(),store=new Map(closed?[['dea-promo-noviembre-2026-cerrada','1']]:[]);let card=null,seq=0;
 const location={hash};const window={addEventListener:(name,fn)=>listeners[name]=fn};
 const document={hidden:false,addEventListener(){},getElementById:()=>card,createElement(){return {innerHTML:'',handlers:{},setAttribute(){},querySelector(){return {addEventListener:(name,fn)=>this.close=fn}},querySelectorAll(){return []},addEventListener(name,fn){this.handlers[name]=fn},remove(){card=null}}},body:{append(el){card=el}}};
 runInNewContext(source,{location,window,document,sessionStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},Date:{now:()=>Date.parse(now),parse:Date.parse},setTimeout:fn=>{timers.set(++seq,fn);return seq},clearTimeout:id=>timers.delete(id)});
 function flush(){const batch=[...timers.values()];timers.clear();batch.forEach(fn=>fn());}
 return {get card(){return card},flush,store,navigate(hash){location.hash=hash;listeners.hashchange()}};
}
test('Promo muestra los precios publicados y enlaces públicos sin checkout',()=>{const x=start();assert.equal(x.card,null);x.flush();for(const value of ['130 c','25 c','240 c','75 c','500 c','180 c','VIP'])assert(x.card.innerHTML.includes(value));assert(x.card.innerHTML.includes('#/publico/compra-rangos'));assert(x.card.innerHTML.includes('#/publico/placas'));assert(!/60\s*%|comisión|FOUNDER VIP/.test(x.card.innerHTML));});
test('Cerrar guarda la decisión durante la visita y evita su reaparición',()=>{const x=start();x.flush();x.card.close();assert.equal(x.card,null);x.navigate('#/publico');x.flush();assert.equal(x.card,null);const y=start({closed:true});y.flush();assert.equal(y.card,null);});
test('No invade identificaciones, intranet ni miniapps; se retira al navegar',()=>{for(const hash of ['#/vip','#/identificacion/vip','#/unete','#/ficha','#/publico/compra-rangos']){const x=start({hash});x.flush();assert.equal(x.card,null);}const x=start();x.flush();x.navigate('#/vip');assert.equal(x.card,null);});
test('Finaliza el 1 de diciembre a medianoche peninsular',()=>{const before=start({now:'2026-11-30T22:59:59Z'});before.flush();assert(before.card);const after=start({now:'2026-11-30T23:00:00Z'});after.flush();assert.equal(after.card,null);});
