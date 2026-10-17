import {test} from 'node:test';
import assert from 'node:assert/strict';
import app,{RANKS,nextEligibility} from './worker.js';

test('Existen 35 rangos internos confirmados de R1 a R6, sin inventar R7–R10',()=>{
 assert.equal(RANKS.length,35);
 assert.equal(RANKS[0].name,'Cadete');
 assert.equal(RANKS[34].name,'Jefe de Dirección');
 assert.equal(RANKS.filter(x=>x.category==='R3').length,8);
});
test('Un cadete no puede ascender antes de 15 min',()=>{
 const a={rank_index:0,last_promoted_at:'2026-10-14T08:00:00.000Z'};
 assert.equal(nextEligibility(a,Date.parse('2026-10-14T08:14:59.000Z')).eligible,false);
 assert.equal(nextEligibility(a,Date.parse('2026-10-14T08:15:00.000Z')).eligible,true);
});
test('R2 necesita 2 horas; R5 necesita 5 días',()=>{
 let a={rank_index:3,last_promoted_at:'2026-10-14T08:00:00.000Z'};
 assert.equal(nextEligibility(a,Date.parse('2026-10-14T09:59:00.000Z')).eligible,false);
 assert.equal(nextEligibility(a,Date.parse('2026-10-14T10:00:00.000Z')).eligible,true);
 a={rank_index:20,last_promoted_at:'2026-10-14T08:00:00.000Z'};
 assert.equal(RANKS[20].category,'R5');
 assert.equal(nextEligibility(a,Date.parse('2026-10-19T07:59:00.000Z')).eligible,false);
 assert.equal(nextEligibility(a,Date.parse('2026-10-19T08:00:00.000Z')).eligible,true);
});
test('El rango 35 no permite avances a categorías aún no definidas',()=>{
 assert.equal(nextEligibility({rank_index:34,last_promoted_at:'2026-01-01T00:00:00Z'},Date.parse('2026-10-14T12:00:00Z')).eligible,false);
});
test('El acceso API sin D1 no finge persistencia',async()=>{
 const res=await app.fetch(new Request('https://dea.test/api/health'),{},{});
 assert.equal(res.status,503);
 assert.match((await res.json()).error,/D1/);
});
test('El HTML publicado recibe automáticamente la vista previa absoluta',async()=>{
 const response=await app.fetch(new Request('https://dea.test/'),{ASSETS:{fetch:async()=>new Response('<meta property="og:image" content="./og-image.jpg">',{headers:{'content-type':'text/html'}})}},{});
 assert.equal(response.status,200);
 assert.match(await response.text(),/https:\/\/dea\.test\/og-image\.jpg/);
});
