import {readdir,copyFile,mkdir,rm,cp} from 'node:fs/promises';
import {join} from 'node:path';
// Lista blanca: nunca incluir backend, claves, fuentes, archivos de pruebas ni documentación en la web pública.
const allow=new Set(['premium.css','inauguracion.css','cafe-hero.svg','cafe-vaso-dea.svg','buymeacoffee-logo.svg','cafeteria.css','dea-promo.js','dea-promo.css','dea-experience.js','dea-guias.js','index.html','app.js','catalogo-publico.js','web-check-scan.js','visitas.js','dea-radio.js','dea-radio.css','radio-dea.js','radio-dea.css','habboween-v2.js','habboween-v2.css','habboween-pumpkin.svg','habboween-ghost.svg','habboween-web.svg','habboween-skyline.svg','habboween-ornament.svg','habboween-candles.svg','habboween-skull.svg','habboween-bat.svg','styles.css','avatar-clean.js','founder-app.js','founder-app.css','founder-10pedro.html','founder-kietsyandrea.html','founder-lesslie-ar.html','founder-xpe-34.html','directores-deawebapp.html','managers-deawebapp.html','dea-cargos.js','dea-cargos.css','founder-10pedro.webmanifest','founder-kietsyandrea.webmanifest','founder-lesslie-ar.webmanifest','founder-xpe-34.webmanifest','site.webmanifest','robots.txt','seo-public.css','sitemap.xml','google8fa052a4ee6eb69c.html','aguila-dea-original.jpg','logo-dea-es.png','og-image.jpg','favicon.ico','apple-touch-icon.png','icon-192.png','icon-512.png','favicon-16.png','favicon-32.png','favicon-48.png','favicon-64.png']);
await rm('dist',{recursive:true,force:true});await mkdir('dist');
for(const name of await readdir('.'))if(allow.has(name))await copyFile(name,join('dist',name));
console.log(`Preparados ${allow.size} archivos web públicos. Backend Apps Script, datos privados y secretos fuera de dist/.`);

// Publicar guías HTML con URLs reales para Google; no empaquetar paneles ni backend privado.
const seoDirs=['musica','cafeteria','agencia-habbo','rangos-habbo','departamentos','unirse-a-dea','normativa','founders'];
for(const dir of seoDirs){
 await mkdir(join('dist',dir),{recursive:true});
 await copyFile(join(dir,'index.html'),join('dist',dir,'index.html'));
}

// Imágenes públicas DEA: publicar únicamente insignias y avatar de Founder aprobados.
await mkdir(join('dist','assets','dea'),{recursive:true});
await cp(join('assets','dea','insignias'),join('dist','assets','dea','insignias'),{recursive:true});
await copyFile(join('assets','dea','founder-xpe34.png'),join('dist','assets','dea','founder-xpe34.png'));
await copyFile(join('assets','dea','sala-completa.webp'),join('dist','assets','dea','sala-completa.webp'));
await copyFile(join('assets','dea','manager-fr4nn23.png'),join('dist','assets','dea','manager-fr4nn23.png'));
await copyFile(join('assets','dea','promo-sala.webp'),join('dist','assets','dea','promo-sala.webp'));
console.log('Insignias DEA y avatar XPE_34 incluidos en dist/assets/dea/.');

for(const name of ['premium-reception','premium-control'])for(const suffix of ['','-mobile'])await copyFile(join('assets','dea',name+suffix+'.webp'),join('dist','assets','dea',name+suffix+'.webp'));

for(const name of ['premium-headquarters.webp','premium-headquarters-mobile.webp','premium-sections.webp'])await copyFile(join('assets','dea',name),join('dist','assets','dea',name));

// Individually optimized launch art: responsive images, no stretched atlas.
for(const key of ['agencia','founders','jerarquia','nominas','placas','normativa'])for(const suffix of ['','-small'])await copyFile(join('assets','dea','launch-'+key+suffix+'.webp'),join('dist','assets','dea','launch-'+key+suffix+'.webp'));
for(const size of ['960','1440','mobile'])for(const ext of ['webp','avif'])await copyFile(join('assets','dea','launch-hero-'+size+'.'+ext),join('dist','assets','dea','launch-hero-'+size+'.'+ext));

await copyFile(join('assets','dea','inauguracion-flyer-original.webp'),join('dist','assets','dea','inauguracion-flyer-original.webp'));

for(const suffix of ['','-small'])await copyFile(join('assets','dea','inauguracion-tarta'+suffix+'.webp'),join('dist','assets','dea','inauguracion-tarta'+suffix+'.webp'));

for(const name of ['music.css','music.js'])await copyFile(join('musica',name),join('dist','musica',name));
for(const name of ['music-studio.webp','music-studio-small.webp'])await copyFile(join('assets','dea',name),join('dist','assets','dea',name));
