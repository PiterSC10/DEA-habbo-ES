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
 assert.ok(html.includes('Agencia Oficial DEA | Comunidad Habbo ES'));
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


test('Google, web y WhatsApp utilizan exactamente el mismo titular y descripción DEA',async()=>{
 const html=(await load('index.html')).toString('utf8');
 const app=(await load('app.js')).toString('utf8');
 const title='Agencia Oficial DEA | Comunidad Habbo ES';
 const desc='Agencia Oficial DEA es una comunidad independiente de Habbo Hotel. Conoce nuestra sala, rangos, nóminas, equipo, eventos y noticias de DEA Confidencial.';
 assert.ok(html.includes('<title>'+title+'</title>'));
 assert.ok(html.includes('<meta name="description" content="'+desc+'">'));
 assert.ok(html.includes('<meta property="og:title" content="'+title+'">'));
 assert.ok(html.includes('<meta property="og:description" content="'+desc+'">'));
 assert.ok(html.includes('<meta name="twitter:title" content="'+title+'">'));
 assert.ok(html.includes('<meta name="twitter:description" content="'+desc+'">'));
 assert.ok(html.includes('<p>'+desc+'</p>'),'La descripción debe estar en el HTML sin JavaScript');
 assert.ok(app.includes('<p>'+desc+'</p>'),'La página renderizada también debe mostrar el texto');
 assert.ok(app.includes('inicio:["'+title+'","'+desc+'"]'));
 assert.ok(app.includes('publico:["'+title+'","'+desc+'"]'));
 const blocks=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
 assert.equal(blocks.find(b=>b['@type']==='WebSite')?.name,'Agencia Oficial DEA');
 assert.equal(blocks.find(b=>b['@type']==='WebPage')?.name,title);
 assert.equal(blocks.find(b=>b['@type']==='WebPage')?.description,desc);
 assert.equal(blocks.find(b=>b['@type']==='WebSite')?.description,desc);
 assert.equal((html.match(/<link rel="canonical"/g)||[]).length,1);
 assert.ok(html.includes('<link rel="canonical" href="https://agenciaoficialdea.es/">'));
});
test('Favicon DEA transparente, encajado y válido para Google en 96px',async()=>{
 const icon=await load('favicon-dea-20261125.png');
 assert.ok(icon.length>=2000&&icon.length<200000);
 assert.equal(icon.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
 assert.equal(icon.readUInt32BE(16),96);
 assert.equal(icon.readUInt32BE(20),96);
 assert.equal(icon[25],6,'El favicon PNG debe contener alpha para esquinas transparentes');
 for(const [file,size] of [['favicon-16.png',16],['favicon-32.png',32],['favicon-48.png',48],['favicon-64.png',64]]){
  const data=await load(file);assert.equal(data.readUInt32BE(16),size);assert.equal(data.readUInt32BE(20),size);
 }
 for(const file of ['index.html','agencia-habbo/index.html','rangos-habbo/index.html','unirse-a-dea/index.html','faq-dea/index.html']){
  const page=(await load(file)).toString('utf8');
  assert.ok(page.includes('href="/favicon-dea-20261125.png"'),file);
 }
 assert.ok((await load('build.mjs')).toString('utf8').includes("'favicon-dea-20261125.png'"));
});
