import {readdir,copyFile,mkdir,rm} from 'node:fs/promises';
import {join} from 'node:path';
// Lista blanca: nunca incluir backend, claves, fuentes, archivos de pruebas ni documentación en la web pública.
const allow=new Set(['index.html','app.js','catalogo-publico.js','web-check-scan.js','habboween-skin.js','styles.css','founder-app.js','founder-app.css','founder-10pedro.html','founder-kietsyandrea.html','founder-lesslie-ar.html','founder-xpe-34.html','directores-deawebapp.html','managers-deawebapp.html','dea-cargos.js','dea-cargos.css','founder-10pedro.webmanifest','founder-kietsyandrea.webmanifest','founder-lesslie-ar.webmanifest','founder-xpe-34.webmanifest','site.webmanifest','robots.txt','seo-public.css','sitemap.xml','google8fa052a4ee6eb69c.html','aguila-dea-original.jpg','logo-dea-es.png','og-image.jpg','favicon.ico','apple-touch-icon.png','icon-192.png','icon-512.png','favicon-16.png','favicon-32.png','favicon-48.png','favicon-64.png']);
await rm('dist',{recursive:true,force:true});await mkdir('dist');
for(const name of await readdir('.'))if(allow.has(name))await copyFile(name,join('dist',name));
console.log(`Preparados ${allow.size} archivos web públicos. Backend Apps Script, datos privados y secretos fuera de dist/.`);

// Publicar guías HTML con URLs reales para Google; no empaquetar paneles ni backend privado.
const seoDirs=['agencia-habbo','rangos-habbo','departamentos','unirse-a-dea','normativa','founders'];
for(const dir of seoDirs){
 await mkdir(join('dist',dir),{recursive:true});
 await copyFile(join(dir,'index.html'),join('dist',dir,'index.html'));
}
