import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
const load=p=>readFile(new URL('./'+p,import.meta.url));
const image='og-dea-portada-20261123.jpg';
test('El archivo Open Graph existe, es un JPG real 1200x630 y pesa menos de 500 KB',async()=>{
 const b=await load(image);assert.ok(b.length>20000&&b.length<500000,`peso inesperado: ${b.length}`);
 assert.equal(b.readUInt16BE(0),0xFFD8);assert.equal(b.readUInt16BE(b.length-2),0xFFD9);
 let w=0,h=0;for(let i=2;i<b.length-9;){if(b[i]!==0xff){i++;continue}let code=b[i+1];if(code===0xd9||code===0xda)break;const size=b.readUInt16BE(i+2);if([0xc0,0xc1,0xc2,0xc3].includes(code)){h=b.readUInt16BE(i+5);w=b.readUInt16BE(i+7);break;}i+=size+2;}
 assert.equal(w,1200);assert.equal(h,630);
});
test('El título, descripción y fotografía de DEA se comparten correctamente en OG y Twitter',async()=>{
 const html=(await load('index.html')).toString('utf8');const u='https://agenciaoficialdea.es/'+image;
 assert.ok(html.includes('property="og:image" content="'+u+'"'));assert.ok(html.includes('name="twitter:image" content="'+u+'"'));
 assert.ok(html.includes('property="og:image:width" content="1200"'));assert.ok(html.includes('property="og:image:height" content="630"'));
 assert.ok(html.includes('Agencia Oficial DEA | Comunidad independiente'));
 assert.ok(html.includes('logo-dea-es.png'));assert.ok(html.includes('favicon-48.png'));
 const ads=(await load('ads.txt')).toString('utf8');assert.match(ads,/google\.com, pub-2770944255348213, DIRECT/);
 assert.ok(html.includes('adsbygoogle.js?client=ca-pub-2770944255348213'));
 assert.ok(html.includes("ad_storage:'denied'"));
});
test('Políticas y enlaces internos legales apuntan a recursos reales',async()=>{
 for(const file of ['privacidad/index.html','cookies/index.html']){
  const html=(await load(file)).toString('utf8');const hrefs=[...html.matchAll(/href="([^"]+)"/g)].map(m=>m[1]);
  for(const href of hrefs){
   if(!href.startsWith('/'))continue;
   const path=new URL(href,'https://agenciaoficialdea.es').pathname;
   const root=path==='/'?'index.html':path.endsWith('/')?path.slice(1)+'index.html':path.slice(1);
   try{await stat(new URL('./'+root,import.meta.url));}catch{assert.fail(`Enlace roto: ${file} -> ${href} -> ${root}`);}
  }
 }
});
