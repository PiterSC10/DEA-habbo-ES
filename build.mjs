import {readdir,copyFile,mkdir,rm,cp,readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
// Lista blanca: nunca incluir backend, claves, fuentes, archivos de pruebas ni documentación en la web pública.
const allow=new Set(['1ee03705db884c5a9321dcf2a9dec38c.txt','mantenimiento.html','dea-consent.css','dea-consent.js','premium.css','inauguracion.css','cafe-hero.svg','cafe-vaso-dea.svg','buymeacoffee-logo.svg','cafeteria.css','dea-promo.js','dea-promo.css','dea-experience.js','dea-guias.js','index.html','app.js','catalogo-publico.js','web-check-scan.js','visitas.js','dea-radio.js','dea-radio.css','radio-dea.js','radio-dea.css','habboween-v2.js','habboween-v2.css','habboween-pumpkin.svg','habboween-ghost.svg','habboween-web.svg','habboween-skyline.svg','habboween-ornament.svg','habboween-candles.svg','habboween-skull.svg','habboween-bat.svg','styles.css','avatar-clean.js','founder-app.js','founder-app.css','founder-10pedro.html','founder-kietsyandrea.html','founder-lesslie-ar.html','founder-xpe-34.html','directores-deawebapp.html','managers-deawebapp.html','dea-cargos.js','dea-cargos.css','founder-10pedro.webmanifest','founder-kietsyandrea.webmanifest','founder-lesslie-ar.webmanifest','founder-xpe-34.webmanifest','site.webmanifest','robots.txt','ads.txt','seo-public.css','sitemap.xml','google8fa052a4ee6eb69c.html','aguila-dea-original.jpg','logo-dea-es.png','og-image.jpg','og-dea-oficial.jpg','og-dea-premium-20261114.jpg','og-dea-portada-20261123.jpg','favicon.ico','apple-touch-icon.png','icon-192.png','icon-512.png','favicon-16.png','favicon-32.png','favicon-48.png','favicon-64.png']);
await rm('dist',{recursive:true,force:true});await mkdir('dist');
for(const name of await readdir('.'))if(allow.has(name))await copyFile(name,join('dist',name));
console.log(`Preparados ${allow.size} archivos web públicos. Backend Apps Script, datos privados y secretos fuera de dist/.`);

// Publicar guías HTML con URLs reales para Google; no empaquetar paneles ni backend privado.
const seoDirs=['calculadora','faq-dea','musica','cafeteria','agencia-habbo','rangos-habbo','departamentos','unirse-a-dea','normativa','founders','privacidad','cookies'];
for(const dir of seoDirs){
 await mkdir(join('dist',dir),{recursive:true});
 await copyFile(join(dir,'index.html'),join('dist',dir,'index.html'));
 const output=join('dist',dir,'index.html');const page=await readFile(output,'utf8');
 if(!page.includes('dea-consent.js'))await writeFile(output,page.replace('</head>','<link rel="stylesheet" href="/dea-consent.css"><script src="/dea-consent.js" defer></script></head>'));
}

// Imágenes públicas DEA: publicar únicamente insignias y avatar de Founder aprobados.
await mkdir(join('dist','assets','dea'),{recursive:true});
await cp(join('assets','dea','insignias'),join('dist','assets','dea','insignias'),{recursive:true});
await copyFile(join('assets','dea','founder-xpe34.png'),join('dist','assets','dea','founder-xpe34.png'));
await copyFile(join('assets','dea','mantoj92-avatar.svg'),join('dist','assets','dea','mantoj92-avatar.svg'));
await copyFile(join('assets','dea','sala-completa.webp'),join('dist','assets','dea','sala-completa.webp'));
await copyFile(join('assets','dea','manager-fr4nn23.png'),join('dist','assets','dea','manager-fr4nn23.png'));
await copyFile(join('assets','dea','promo-sala.webp'),join('dist','assets','dea','promo-sala.webp'));
for(const name of ['launch-sala.svg','launch-noticias.svg'])await copyFile(join('assets','dea',name),join('dist','assets','dea',name));
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

for(const name of ['primera-paga-20261114.webp','pagas-semanales.webp'])await copyFile(join('assets','dea',name),join('dist','assets','dea',name));

await copyFile(join('assets','dea','rec-completo-20261115.webp'),join('dist','assets','dea','rec-completo-20261115.webp'));

await copyFile(join('assets','dea','agencias-20261115.png'),join('dist','assets','dea','agencias-20261115.png'));

await copyFile(join('assets','dea','visitas-1000-20261115.png'),join('dist','assets','dea','visitas-1000-20261115.png'));

await copyFile(join('assets','dea','guardapaga-noviembre-20261115.jpg'),join('dist','assets','dea','guardapaga-noviembre-20261115.jpg'));

await copyFile(join('assets','dea','sala-actual-20261115.webp'),join('dist','assets','dea','sala-actual-20261115.webp'));

await copyFile(join('assets','dea','confidencial-guardapaga-header.webp'),join('dist','assets','dea','confidencial-guardapaga-header.webp'));

await copyFile(join('assets','dea','momentos-after-party-20261116.webp'),join('dist','assets','dea','momentos-after-party-20261116.webp'));

await copyFile(join('assets','dea','miembros-semana-20261116.jpg'),join('dist','assets','dea','miembros-semana-20261116.jpg'));

await copyFile(join('assets','dea','radio-dj-vip-20261116.png'),join('dist','assets','dea','radio-dj-vip-20261116.png'));

await copyFile(join('assets','dea','calculadora-genio.webp'),join('dist','assets','dea','calculadora-genio.webp'));

await copyFile(join('assets','dea','calculadora-banner.webp'),join('dist','assets','dea','calculadora-banner.webp'));

await cp(join('assets','dea','payroll'),join('dist','assets','dea','payroll'),{recursive:true});


// Interruptor de mantenimiento controlado mediante GitHub. No hay botón público ni rutas de administración expuestas.
const maintenance=JSON.parse(await readFile('maintenance-mode.json','utf8'));
if(typeof maintenance.enabled!=='boolean')throw Error('maintenance-mode.json: enabled debe ser booleano');
if(maintenance.enabled){
 // Sustituir solo las páginas públicas; conservar APIs, ficheros de producción y accesos técnicos.
 await copyFile('mantenimiento.html',join('dist','index.html'));
 for(const dir of seoDirs)await copyFile('mantenimiento.html',join('dist',dir,'index.html'));
 console.log('MODO MANTENIMIENTO DEA ACTIVADO: portada y páginas de contenido públicas sustituidas.');
}else{
 console.log('MODO MANTENIMIENTO DEA DESACTIVADO: web normal publicada; pantalla preparada en /mantenimiento.html.');
}
