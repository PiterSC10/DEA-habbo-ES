import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHandler} from './api/visitas.js';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {webcrypto} from 'node:crypto';
const original={version:3,total:12,days:{'2026-10-23':12},sessions:{old:1}};
function fixture({baseline=original,legacy=[],records=[]}={}){
 let now=Date.parse('2026-10-23T19:00:00Z');const files=new Map(records.map(path=>[path,'{}'])),writes=[];
 const storage={async get(path){assert.equal(path,'dea-visitas/v3/contador.json');return baseline?{stream:new Response(JSON.stringify(baseline)).body}:null},async list({prefix,cursor,limit}){const all=[...legacy,...[...files.keys()].map(pathname=>({pathname}))].filter(b=>b.pathname.startsWith(prefix));const start=Number(cursor)||0;return {blobs:all.slice(start,start+limit),hasMore:start+limit<all.length,cursor:String(start+limit)}},async put(path,body,options){assert.equal(options.allowOverwrite,false);assert.equal(options.addRandomSuffix,false);assert.equal(options.access,'private');assert.ok(path.startsWith('dea-visitas/v4/'));if(files.has(path))throw Error('Blob already exists');files.set(path,body);writes.push(path)}};
 function handler(){return createHandler({storage,configured:()=>true,clock:()=>now})}
 async function call(h,token,overrides={}){let status,body;const headers={};await h({method:token?'POST':'GET',body:{session:token},headers:{},...overrides},{status(s){status=s},setHeader(k,v){headers[k]=v},end(v){body=v?JSON.parse(v):null}});return {status,body,headers}}
 return {handler,call,files,writes,set now(v){now=v}};
}
test('Cada carga nueva suma y conserva el total anterior sin sobrescribirlo',async()=>{
 const snapshot=JSON.stringify(original),f=fixture(),h=f.handler();assert.equal((await f.call(h)).body.total,12);
 assert.equal((await f.call(h,'a'.repeat(32))).body.total,13);assert.equal((await f.call(h,'b'.repeat(32))).body.total,14);assert.equal((await f.call(f.handler())).body.total,14);assert.equal(JSON.stringify(original),snapshot);assert.equal(f.writes.length,2);assert.ok(!f.writes.join('').includes('a'.repeat(32)));
});
test('Una petición duplicada no duplica el mismo registro',async()=>{
 const f=fixture(),id='a'.repeat(32);assert.equal((await f.call(f.handler(),id)).body.registrada,true);const again=await f.call(f.handler(),id);assert.equal(again.status,200);assert.equal(again.body.total,13);assert.equal(again.body.registrada,false);assert.equal(f.writes.length,1);
});
test('Entradas simultáneas se añaden sin competir por un archivo compartido',async()=>{
 const f=fixture();const replies=await Promise.all(['a','b','c','a','d'].map(x=>f.call(f.handler(),x.repeat(32))));assert.ok(replies.every(x=>x.status===200));assert.equal(f.files.size,4);assert.equal((await f.call(f.handler())).body.total,16);
});
test('Hoy cambia a medianoche de Madrid y el total se conserva',async()=>{
 const f=fixture();await f.call(f.handler(),'a'.repeat(32));f.now=Date.parse('2026-10-23T22:01:00Z');const r=await f.call(f.handler(),'b'.repeat(32));assert.equal(r.body.fecha,'2026-10-24');assert.equal(r.body.hoy,1);assert.equal(r.body.total,14);
});
test('Paginación completa y recuperación del historial v1/v2 cuando no existe v3',async()=>{
 const records=Array.from({length:1005},(_,i)=>'dea-visitas/v4/2026-10-23/'+i+'.json');const f=fixture({baseline:null,records,legacy:[{pathname:'dea-visitas/v1/2026-10-22/old.json'},{pathname:'dea-visitas/v2/2026-10-23/other.json'}]});const r=await f.call(f.handler());assert.equal(r.body.total,1007);assert.equal(r.body.hoy,1006);assert.equal(f.writes.length,0);
});
test('La API valida método, ID y origen; un fallo no inventa cifras',async()=>{
 const f=fixture(),h=f.handler();assert.equal((await f.call(h,'invalid')).status,400);assert.equal((await f.call(h,'a'.repeat(32),{headers:{origin:'https://other.example',host:'dea-habbo-es.vercel.app'}})).status,403);assert.equal((await f.call(h,null,{method:'PUT'})).status,405);
});
const src=await readFile(new URL('./visitas.js',import.meta.url),'utf8');
function client({fail=false}={}){
 const requests=[],timers=new Map(),total={textContent:''},label={textContent:''};let seq=0;
 const context={Intl,Uint8Array,crypto:webcrypto,Number,JSON,AbortController,setTimeout(fn,ms){const id=++seq;timers.set(id,{fn,ms});return id},clearTimeout(id){timers.delete(id)},document:{getElementById:()=>null,querySelectorAll:()=>[{querySelector:s=>s==='.dea-stats-inline'?{}:s.includes('strong')?total:label}]},fetch:async(url,opts)=>{requests.push(opts);if(fail)throw Error('network');return {ok:true,json:async()=>({total:13,hoy:13})}}};runInNewContext(src,context);return {requests,total,label,timers,flush:()=>new Promise(r=>setImmediate(r))};
}
test('Cliente clásico: entrar y recargar generan IDs nuevos y una sola petición',async()=>{
 const a=client(),b=client();assert.equal(a.label.textContent,'Consultando visitas reales…');await a.flush();await b.flush();assert.equal(a.requests.length,1);assert.equal(b.requests.length,1);assert.notEqual(a.requests[0].body,b.requests[0].body);assert.equal(a.total.textContent,'13');assert.equal(a.timers.size,0);
});
test('Sin reintentos automáticos, botones ni almacenamiento de sesiones',async()=>{
 const c=client({fail:true});await c.flush();assert.equal(c.requests.length,1);assert.equal(c.timers.size,0);assert.equal(c.label.textContent,'Visitas no disponibles en este momento.');assert.equal(c.total.textContent,'—');assert.doesNotMatch(src,/localStorage|sessionStorage|setInterval|data-visitas-retry/);
 const app=await readFile(new URL('./app.js',import.meta.url),'utf8');assert.match(app,/CONTROL DE VISITAS DEA/);assert.doesNotMatch(app,/data-visitas-retry/);
});

test('GitHub Pages usa la API oficial: CORS permite lectura, alta y preflight sin añadir visitas',async()=>{
 const f=fixture(),h=f.handler(),headers={origin:'https://pitersc10.github.io',host:'dea-habbo-es.vercel.app'};
 const pre=await f.call(h,null,{method:'OPTIONS',headers});assert.equal(pre.status,204);assert.equal(pre.headers['Access-Control-Allow-Origin'],'*');assert.match(pre.headers['Access-Control-Allow-Headers'],/Content-Type/);assert.equal(f.writes.length,0);
 const post=await f.call(h,'a'.repeat(32),{headers});assert.equal(post.status,200);assert.equal(post.body.total,13);assert.equal(post.headers['Access-Control-Allow-Origin'],'*');assert.equal(f.writes.length,1);
 assert.equal((await f.call(h,'b'.repeat(32),{headers:{...headers,origin:'https://evil.example'}})).status,403);
 const source=await readFile(new URL('./visitas.js',import.meta.url),'utf8');assert.match(source,/fetch\('https:\/\/dea-habbo-es\.vercel\.app\/api\/visitas'/);
});
