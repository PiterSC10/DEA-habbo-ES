import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const app=readFileSync(new URL('./app.js',import.meta.url),'utf8');
const promo=readFileSync(new URL('./dea-promo.js',import.meta.url),'utf8');
const css=readFileSync(new URL('./premium.css',import.meta.url),'utf8');
const prefix='https://d2ol7oe51mr4n9.cloudfront.net/user_3JG75h2Nju8XQikwbWBljGYXsX6/';
test('Cada tarjeta usa su propia ilustración nueva, sin duplicación de Placas ni Comprar rangos',()=>{
 const mapping=app.match(/const DEA_CARD_ART=(\{[^;]+\});/);
 assert.ok(mapping,'Constante de imágenes encontrada');
 const images=JSON.parse(mapping[1]);
 assert.equal(images.placas,prefix+'18b715a0-d709-4e73-8d96-f097ce428135.webp');
 assert.equal(images['compra-rangos'],prefix+'e0c64868-ac2d-4441-a5a8-44d7e99d958a.webp');
 assert.notEqual(images.placas,images['compra-rangos']);
 for(const [key,url] of Object.entries(images))assert.ok(url.endsWith('.webp'),key);
});
test('Los títulos siguen debajo de la imagen y no se pintan dentro del recurso',()=>{
 const declaration=app.slice(app.indexOf('function deaPremiumCard('),app.indexOf('function deaHomeNavigation('));
 assert.ok(declaration.indexOf('class="dea-premium-card-art"')<declaration.indexOf('<h2>'));
 assert.match(css,/\.dea-directory-grid/);
});
test('El popup conserva la bienvenida y muestra los comandos nuevos con FAQ real',()=>{
 assert.match(promo,/BIENVENIDO A/);
 assert.match(promo,/dea-welcome-faq/);
 assert.match(promo,/dea-welcome-update/);
 assert.match(promo,/href="#\/publico\/noticias"/);
 for(const command of [':membresias',':misiones',':traslados'])assert.ok(promo.includes(command),command);
});
