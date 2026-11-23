import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const config=JSON.parse(readFileSync(new URL('./maintenance-mode.json',import.meta.url),'utf8'));
const page=readFileSync(new URL('./mantenimiento.html',import.meta.url),'utf8');
const build=readFileSync(new URL('./build.mjs',import.meta.url),'utf8');
test('El estado de mantenimiento siempre es un booleano válido',()=>{assert.equal(typeof config.enabled,'boolean')});
test('El interruptor admite solo booleanos, la compilación publica la web normalmente mientras está desactivado',()=>{
 assert.match(build,/typeof maintenance\.enabled!=='boolean'/);
 assert.match(build,/if\(maintenance\.enabled\)/);
 assert.match(build,/copyFile\('mantenimiento\.html',join\('dist','index\.html'\)\)/);
 assert.match(build,/for\(const dir of seoDirs\)await copyFile\('mantenimiento\.html',join\('dist',dir,'index\.html'\)\)/);
});
test('La pantalla especial contiene la ilustración, vallas y texto sin controles públicos para activarla',()=>{
 assert.match(page,/<html lang="es">/);
 assert.match(page,/DEA en reformas/);
 assert.match(page,/REFORMAS EN CURSO/);
 assert.match(page,/vallas/);
 assert.match(page,/c41cf277-5f45-4c08-91b6-f162abad919e\.png/);
 assert.match(page,/prefers-reduced-motion/);
 assert.match(page,/noindex,nofollow/);
 assert.doesNotMatch(page,/type="password"|ADMIN_TOKEN|maintenance-mode\.json/);
});
test('El acceso técnico no se sustituye durante el mantenimiento',()=>{
 assert.doesNotMatch(build,/copyFile\('mantenimiento\.html',join\('dist','founder-/);
 assert.doesNotMatch(build,/copyFile\('mantenimiento\.html',join\('dist','api'/);
});
