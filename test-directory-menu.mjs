import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=p=>readFile(new URL('./'+p,import.meta.url),'utf8');
test('Directorio DEA reúne 18 tarjetas y cada acceso conserva ruta real',async()=>{
 const s=await read('app.js');
 const m=s.match(/const DEA_PUBLIC_CARD_ENTRIES=(\[[^;]+\]);/);
 assert.ok(m,'Lista de accesos');
 const entries=JSON.parse(m[1]);
 assert.equal(entries.length,18);
 assert.equal(new Set(entries.map(x=>x[0])).size,18);
 for(const route of ['publico/como-unirse','publico/como-trabajar','publico/faq'])assert.ok(entries.find(x=>x[0]===route));
});
test('Las nueve escenas nuevas sustituyen las imágenes con números y títulos incrustados',async()=>{
 const s=await read('app.js'),css=await read('premium.css');
 const art=JSON.parse(s.match(/const DEA_CARD_ART=(\{[^;]+\});/)[1]);
 assert.equal(Object.keys(art).length,9);
 assert.equal(new Set(Object.values(art)).size,9);
 for(const [key,url] of Object.entries(art)){assert.match(url,/\.webp$/);assert.ok(!url.includes('2cf5d19c-6ae1'),key);}
 assert.match(css,/\.dea-premium-directory \.dea-directory-grid \.dea-premium-card-art:after\{display:none\}/);
});
test('Barra superior destaca los tres accesos principales con skin neón',async()=>{
 const s=await read('app.js'),css=await read('premium.css');
 assert.match(s,/function deaPremiumQuickLinks\(current\)/);
 assert.match(s,/\['como-unirse','Únete a DEA','user'\]/);
 assert.match(s,/\['como-trabajar','Cómo trabajar en DEA','book'\]/);
 assert.match(s,/\['faq','FAQ DEA','book'\]/);
 assert.match(s,/dea-premium-quicknav/);
 assert.match(s,/dea-premium-tabs-extended/);
 assert.match(css,/\.dea-neon-quick/);
 assert.match(css,/\.dea-premium-tabs-extended>a\.dea-neon-top/);
});
