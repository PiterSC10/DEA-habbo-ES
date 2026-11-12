import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHandler} from './api/visitas.js';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {webcrypto} from 'node:crypto';
async function call(h,method='GET',body={},query={},headers={}){let status,value;const responseHeaders={};await h({method,body,query,headers},{status(s){status=s},setHeader(k,v){responseHeaders[k]=v},end(v){value=v?JSON.parse(v):null}});return {status,body:value,headers:responseHeaders};}
const aggregate={total:685,hoy:0,fecha:'2026-11-12',historicoCompleto:false};
test('Sheets proxy preserves recovered totals and explicit incomplete status',async()=>{let target;const h=createHandler({fetcher:async u=>{target=u;return {ok:true,json:async()=>({...aggregate,secret:'never expose'})}}});const r=await call(h);assert.equal(r.status,200);assert.equal(r.body.total,685);assert.equal(r.body.historicoCompleto,false);assert.equal(r.body.secret,undefined);assert.equal(target.searchParams.get('public'),'visitas');assert.equal(target.searchParams.has('session'),false);});
test('POST forwards only the validated visit ID and requires backend acknowledgement',async()=>{const h=createHandler({fetcher:async u=>{assert.equal(u.searchParams.get('session'),'a'.repeat(32));return {ok:true,json:async()=>({...aggregate,total:686,hoy:1,registrada:false})}}});const r=await call(h,'POST',{session:'a'.repeat(32),total:999999});assert.equal(r.body.total,686);assert.equal(r.body.registrada,false);});
test('Stats preserve daily recovered history',async()=>{const h=createHandler({fetcher:async u=>{assert.equal(u.searchParams.get('stats'),'1');return {ok:true,json:async()=>({...aggregate,historial:[{fecha:'2026-10-23',visitas:25}],desde:'2026-10-23',historialCompleto:false})}}});const r=await call(h,'GET',{}, {stats:'1'});assert.equal(r.body.historial[0].visitas,25);assert.equal(r.body.historialCompleto,false);});
test('Invalid methods, origins and identifiers never contact backend',async()=>{const h=createHandler({fetcher:async()=>{throw Error('must not call')}});assert.equal((await call(h,'POST',{session:'bad'})).status,400);assert.equal((await call(h,'PUT')).status,405);assert.equal((await call(h,'GET',{}, {},{origin:'https://evil.example'})).status,403);assert.equal((await call(h,'OPTIONS',{}, {},{origin:'https://pitersc10.github.io'})).status,204);});
test('Backend errors and missing figures never invent a total',async()=>{for(const value of [{error:'unavailable'}, {...aggregate,total:-1}, {...aggregate,historicoCompleto:undefined}]){const h=createHandler({fetcher:async()=>({ok:true,json:async()=>value})});const r=await call(h);assert.equal(r.status,503);assert.equal(r.body.total,undefined);}});
const src=await readFile(new URL('./visitas.js',import.meta.url),'utf8');
function client({fail=false,partial=false}={}){
 const requests=[],timers=new Map(),total={textContent:''},label={textContent:''};let seq=0;
 const context={Intl,Uint8Array,crypto:webcrypto,Number,JSON,AbortController,setTimeout(fn,ms){const id=++seq;timers.set(id,{fn,ms});return id},clearTimeout(id){timers.delete(id)},document:{getElementById:()=>null,querySelectorAll:()=>[{querySelector:s=>s==='.dea-stats-inline'?{}:s.includes('strong')?total:label}]},fetch:async(url,opts)=>{requests.push(opts);if(fail)throw Error('network');return {ok:true,json:async()=>({total:13,hoy:13,...(partial?{historicoCompleto:false}:{})})}}};runInNewContext(src,context);return {requests,total,label,timers,flush:()=>new Promise(r=>setImmediate(r))};
}
test('Cliente clásico: entrar y recargar generan IDs nuevos y una sola petición',async()=>{
 const a=client(),b=client();assert.equal(a.label.textContent,'Consultando visitas reales…');await a.flush();await b.flush();assert.equal(a.requests.length,1);assert.equal(b.requests.length,1);assert.notEqual(a.requests[0].body,b.requests[0].body);assert.equal(a.total.textContent,'13');assert.equal(a.timers.size,0);
});
test('Sin reintentos automáticos, botones ni almacenamiento de sesiones',async()=>{
 const c=client({fail:true});await c.flush();assert.equal(c.requests.length,1);assert.equal(c.timers.size,0);assert.equal(c.label.textContent,'Visitas no disponibles en este momento.');assert.equal(c.total.textContent,'—');assert.doesNotMatch(src,/localStorage|sessionStorage|setInterval|data-visitas-retry/);
 const app=await readFile(new URL('./app.js',import.meta.url),'utf8');assert.match(app,/CONTROL DE VISITAS DEA/);assert.doesNotMatch(app,/data-visitas-retry/);
});


const gs=await readFile(new URL('./integraciones/apps-script/contador-dea.gs',import.meta.url),'utf8');
function gasFixture(){
 const tabs=new Map();
 function sheet(rows){return {getDataRange:()=>({getValues:()=>rows.map(r=>[...r]),getDisplayValues:()=>rows.map(r=>r.map(String))}),getRange:()=>({getDisplayValues:()=>[[...rows[0]]]}),appendRow(r){rows.push(r)},setFrozenRows(){}};}
 tabs.set('VISITAS_WEB_RECUPERACION',sheet([['date','count'],['2026-10-23',685],['TOTAL_V4',685]]));
 const book={getSheetByName:n=>tabs.get(n),insertSheet:n=>{const s=sheet([]);tabs.set(n,s);return s}};
 const context={Date:class extends Date{constructor(...args){super(...(args.length?args:['2026-11-12T17:00:00Z']))}},Utilities:{formatDate:d=>d.toISOString().slice(0,10),DigestAlgorithm:{SHA_256:'sha256'},computeDigest:()=>Array(32).fill(42)},deaBook_:()=>book,deaTab_:n=>tabs.get(n),SpreadsheetApp:{flush(){}},LockService:{getScriptLock:()=>({tryLock:()=>true,releaseLock(){}})},ContentService:{MimeType:{JSON:'json'},createTextOutput:s=>({setMimeType:()=>JSON.parse(s)})}};
 runInNewContext(gs,context);return {context,tabs};
}
test('Apps Script retains recovered days, counts a visit once and preserves data on duplicate',()=>{const {context}=gasFixture();const first=context.deaVisitsPublic_({session:'a'.repeat(32)});const repeat=context.deaVisitsPublic_({session:'a'.repeat(32)});assert.equal(first.total,686);assert.equal(first.hoy,1);assert.equal(first.registrada,true);assert.equal(repeat.total,686);assert.equal(repeat.registrada,false);assert.equal(first.historicoCompleto,false);const read=context.deaVisitsPublic_({stats:'1'});assert.equal(read.total,686);assert.equal(read.historial[0].visitas,685);});
test('Apps Script can add the recovered v3 baseline later without resetting new visits',()=>{const {context,tabs}=gasFixture();context.deaVisitsPublic_({session:'a'.repeat(32)});tabs.get('VISITAS_WEB_BASELINE').appendRow(['total_v3',100]);tabs.get('VISITAS_WEB_BASELINE').appendRow(['dia:2026-10-23',100]);tabs.get('VISITAS_WEB_BASELINE').appendRow(['completo',true]);const read=context.deaVisitsPublic_({stats:'1'});assert.equal(read.total,786);assert.equal(read.hoy,1);assert.equal(read.historicoCompleto,true);assert.equal(read.historial[0].visitas,785);});

test('El mínimo recuperado nunca se presenta como total completo',async()=>{const c=client({partial:true});await c.flush();assert.equal(c.total.textContent,'13+');assert.match(c.label.textContent,/HISTÓRICO EN RECUPERACIÓN/);});

test('Apps Script normalizes native Sheets dates and deduplicates them',()=>{const {context,tabs}=gasFixture();context.deaVisitsPublic_({stats:'1'});tabs.get('VISITAS_WEB_EVENTOS').appendRow([new Date('2026-11-12T08:00:00Z'),'2a'.repeat(32),'2026-11-12T16:00:00Z']);const repeat=context.deaVisitsPublic_({session:'a'.repeat(32)});assert.equal(repeat.total,686);assert.equal(repeat.hoy,1);assert.equal(repeat.registrada,false);});
