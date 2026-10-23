import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHandler} from './api/visitas.js';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {webcrypto} from 'node:crypto';

function fixture(legacy = []) {
 let state=null,revision=0,writes=0,lists=0,now=Date.parse('2026-10-23T20:00:00Z');
 const storage={
  async get(){const s=state,etag=String(revision);return s?{stream:new Response(JSON.stringify(s)).body,blob:{etag}}:null;},
  async list({prefix}){lists++;return {blobs:legacy.filter(b=>b.pathname.startsWith(prefix)),hasMore:false};},
  async put(path,body,opts){const next=JSON.parse(body);if((opts.ifMatch&&opts.ifMatch!==String(revision))||(!opts.ifMatch&&state)){const e=new Error('precondition');e.status=412;throw e;}state=next;revision++;writes++;}
 };
 const handler=()=>createHandler({storage,configured:()=>true,clock:()=>now,pause:async()=>{}});
 async function call(h,session){const headers={};let status,body;await h({method:session?'POST':'GET',body:{session},headers:{}},{status(s){status=s;},setHeader(k,v){headers[k]=v;},end(v){body=JSON.parse(v);}});return {status,body,headers};}
 return {handler,call,storage,get state(){return state;},get writes(){return writes;},get lists(){return lists;},set now(v){now=v;}};
}
test('Registro idempotente, lectura y persistencia en otra instancia/despliegue',async()=>{
 const f=fixture(),h=f.handler(),id='a'.repeat(32);
 assert.equal((await f.call(h)).body.total,0);
 assert.equal((await f.call(h,id)).body.registrada,true);
 assert.equal((await f.call(h,id)).body.total,1);
 assert.equal(f.writes,1);
 assert.equal((await f.call(f.handler())).body.total,1);
 const prior=f.lists;await f.call(f.handler());assert.equal(f.lists,prior);
 assert.ok(!JSON.stringify(f.state).includes(id));
});
test('Dos instancias simultáneas conservan todos los incrementos y deduplican',async()=>{
 const f=fixture();const results=await Promise.all(['a','b','a','c','b'].map(c=>f.call(f.handler(),c.repeat(32))));
 assert.ok(results.every(r=>r.status===200));assert.equal(f.state.total,3);assert.equal(f.writes,3);
});
test('Migración preserva v1/v2 sin modificar originales y cuenta hoy en Madrid',async()=>{
 const f=fixture([{pathname:'dea-visitas/v1/2026-10-22/antiguo.json'},{pathname:'dea-visitas/v2/2026-10-23/'+ 'd'.repeat(32)+'.json',uploadedAt:'2026-10-23T19:00:00Z'}]);
 assert.equal((await f.call(f.handler(),'d'.repeat(32))).body.total,2);
 assert.equal((await f.call(f.handler(),'e'.repeat(32))).body.total,3);
 f.now=Date.parse('2026-10-23T22:01:00Z');
 const result=await f.call(f.handler(),'f'.repeat(32));assert.equal(result.body.fecha,'2026-10-24');assert.equal(result.body.hoy,1);assert.equal(result.body.total,4);
});
test('Una sesión activa al cruzar medianoche no suma otra visita',async()=>{
 const f=fixture();await f.call(f.handler(),'a'.repeat(32));f.now=Date.parse('2026-10-23T22:01:00Z');
 const r=await f.call(f.handler(),'a'.repeat(32));assert.equal(r.body.total,1);assert.equal(r.body.hoy,0);
});
const src=await readFile(new URL('./visitas.js',import.meta.url),'utf8');
function client(shared=new Map(),start=1000000, fail=false){
 let now=start;const events={},requests=[];const doc={hidden:false,getElementById:()=>null,querySelectorAll:()=>[],addEventListener:(type,fn)=>events[type]=fn};
 const clock=class extends Date {static now(){return now;}};
 runInNewContext(src,{Intl,Uint8Array,crypto:webcrypto,Date:clock,Number,JSON,console:{warn(){}},document:doc,window:{addEventListener:(t,f)=>events[t]=f},navigator:{},localStorage:{getItem:k=>shared.get(k)||null,setItem:(k,v)=>shared.set(k,v)},sessionStorage:{getItem:()=>null},fetch:async(url,opts)=>{requests.push({url,...opts});if(fail)throw Error('network');return {ok:true,json:async()=>({total:1,hoy:1})}}});
 return {requests,events,shared,tick:ms=>{now+=ms;},flush:()=>new Promise(r=>setImmediate(r)),setFail:v=>{fail=v;}};
}
test('Cliente: primera entrada POST; recarga y navegación no escriben; inactividad exacta',async()=>{
 const a=client();await a.flush();assert.equal(a.requests[0].method,'POST');const id=JSON.parse(a.requests[0].body).session;
 const b=client(a.shared);await b.flush();assert.equal(b.requests[0].method,'GET');
 b.events.scroll();b.tick(299999);b.events.keydown();await b.flush();assert.equal(b.requests.length,1);
 b.tick(300000);b.events.pointerdown();await b.flush();assert.equal(b.requests.length,2);assert.equal(b.requests[1].method,'POST');assert.notEqual(JSON.parse(b.requests[1].body).session,id);
});
test('Actividad continua conserva sesión y un fallo reintenta el mismo ID',async()=>{
 const c=client(new Map(),1000000,true);await c.flush();const id=JSON.parse(c.requests[0].body).session;c.tick(16000);c.setFail(false);c.events.pointerdown();await c.flush();assert.equal(JSON.parse(c.requests[1].body).session,id);
 for(let i=0;i<10;i++){c.tick(240000);c.events.scroll();await c.flush();}assert.equal(c.requests.length,2);
});
