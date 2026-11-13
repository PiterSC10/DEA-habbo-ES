import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHandler} from './api/visitas.js';
const base='https://agenciaoficialdea.es';
const read=p=>readFile(new URL(p,import.meta.url),'utf8');
test('Todas las URL del sitemap tienen canónica, robots, imagen social y JSON-LD coherentes',async()=>{
 const xml=await read('sitemap.xml');const urls=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(x=>x[1]);
 assert.equal(urls.length,8);assert.equal(new Set(urls).size,8);
 for(const url of urls){
  assert.equal(new URL(url).origin,base);assert.ok(!url.includes('#'));assert.ok(!/founder-|webapp|api\//.test(url));
  const path=new URL(url).pathname;const html=await read(path==='/'?'index.html':path.slice(1)+'index.html');
  assert.ok(html.includes(`rel="canonical" href="${url}"`),url);
  assert.match(html,/<meta name="robots" content="index,follow/);
  assert.ok(html.includes(`property="og:url" content="${url}"`),url);
  assert.ok(html.includes(`content="${base}/og-image.jpg"`));assert.match(html,/<title>[^<]+<\/title>/);assert.match(html,/<h1[\s>]/);
  const blocks=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];assert.ok(blocks.length);
  for(const block of blocks){const obj=JSON.parse(block[1]);assert.equal(obj['@context'],'https://schema.org');assert.ok(!block[1].includes('dea-habbo-es.vercel.app'));}
 }
 assert.ok((await read('robots.txt')).includes('Sitemap: '+base+'/sitemap.xml'));
});
test('La redirección conserva rutas y solo afecta al antiguo host público',async()=>{
 const config=JSON.parse(await read('vercel.json'));const redirect=config.redirects[0];
 assert.equal(redirect.source,'/:path*');assert.deepEqual(redirect.has,[{type:'host',value:'dea-habbo-es.vercel.app'}]);assert.equal(redirect.destination,base+'/:path*');assert.equal(redirect.permanent,true);
});
test('El contador utiliza la misma API local y acepta el dominio nuevo sin cambiar históricos',async()=>{
 const source=await read('visitas.js');assert.match(source,/fetch\('\/api\/visitas'/);assert.doesNotMatch(source,/https:\/\/dea-habbo-es\.vercel\.app/);
 let calls=0;const handler=createHandler({fetcher:async()=>{calls++;return {ok:true,json:async()=>({total:707,hoy:22,fecha:'2026-11-13',historicoCompleto:false})}}});
 for(const origin of [base,'https://www.agenciaoficialdea.es','https://dea-habbo-es.vercel.app','https://evil.example']){
  let status;await handler({method:'GET',headers:{host:'agenciaoficialdea.es',origin}},{status(n){status=n},setHeader(){},end(){}});assert.equal(status,origin.includes('evil')?403:200);
 }
 assert.equal(calls,3);
});
