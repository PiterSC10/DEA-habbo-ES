import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHandler} from './api/visitas.js';
const base='https://agenciaoficialdea.es';
const read=p=>readFile(new URL(p,import.meta.url),'utf8');
test('Todas las URL del sitemap tienen canónica, robots, imagen social y JSON-LD coherentes',async()=>{
 const xml=await read('sitemap.xml');const urls=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(x=>x[1]);
 assert.equal(urls.length,5);assert.deepEqual(urls,[base+'/',base+'/agencia-habbo/',base+'/rangos-habbo/',base+'/unirse-a-dea/',base+'/faq-dea/']);
 for(const url of urls){
  assert.equal(new URL(url).origin,base);assert.ok(!url.includes('#'));assert.ok(!/founder-|webapp|api\//.test(url));
  const path=new URL(url).pathname;const html=await read(path==='/'?'index.html':path.slice(1)+'index.html');
  assert.ok(html.includes(`rel="canonical" href="${url}"`),url);
  assert.match(html,/<meta name="robots" content="index,follow/);
  assert.ok(html.includes(`property="og:url" content="${url}"`),url);
  assert.ok(html.includes(`content="${base}/${path==='/musica/'?'assets/dea/music-studio.webp':'og-dea-premium-20261114.jpg'}"`));assert.match(html,/<title>[^<]+<\/title>/);assert.match(html,/<h1[\s>]/);
  const blocks=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];assert.ok(blocks.length);
  for(const block of blocks){const obj=JSON.parse(block[1]);assert.equal(obj['@context'],'https://schema.org');assert.ok(!block[1].includes('dea-habbo-es.vercel.app'));}
 }
 const v=JSON.parse(await read('vercel.json'));
 for(const slug of ['departamentos','normativa','founders','cafeteria','musica','calculadora','privacidad']){
  assert.ok(v.headers.some(h=>h.source==='/'+slug+'/(.*)'&&h.headers.some(x=>x.key==='X-Robots-Tag'&&x.value==='noindex, follow')),slug);
 }
 for(const slug of ['agencia-habbo','rangos-habbo','unirse-a-dea','faq-dea'])assert.ok(!v.headers.some(h=>h.source==='/'+slug+'/(.*)'&&h.headers.some(x=>x.key==='X-Robots-Tag'&&/noindex/.test(x.value))),slug+' debe estar indexable');
 assert.ok((await read('robots.txt')).includes('Sitemap: '+base+'/sitemap.xml'));
});
test('La redirección conserva rutas y solo afecta al antiguo host público',async()=>{
 const config=JSON.parse(await read('vercel.json'));const redirect=config.redirects.find(r=>r.source==='/:path*');
 assert.ok(config.redirects.some(r=>r.source==='/cafeteria'&&r.destination==='/cafeteria/'&&r.permanent===true));
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

test('La portada SEO entrega el logotipo, el nombre oficial y no inyecta una segunda navegación fuera de la web',async()=>{
 const html=await read('index.html');const app=await read('app.js');
 assert.match(html,/rel="icon" type="image\/png" sizes="48x48" href="\/favicon-48\.png"/);
 assert.match(html,/https:\/\/agenciaoficialdea\.es\/logo-dea-es\.png/);
 assert.match(html,/name="application-name" content="Agencia Oficial DEA"/);
 assert.doesNotMatch(html,/class="dea-public-summary"/);
 assert.match(app,/ENTRAR EN LA WEB/);
 assert.match(app,/TIENDA DEA/);
 assert.match(app,/SOLICITAR EN LA SALA/);
 assert.doesNotMatch(app,/function layoutHome\(\)\{return \(DEA_ENTRY_ACCESS_ENABLED\?layoutHomeOriginal\(\):deaPremiumHome\(\)\)\+deaSeoAboutHtml/);
});
