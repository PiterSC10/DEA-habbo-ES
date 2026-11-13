# Agencia Oficial DEA · dominio publicado y SEO técnico

## Producción comprobada el 13 de noviembre de 2026

- Web: https://agenciaoficialdea.es/ responde HTTP 200 con HTTPS válido.
- Vercel: dea-habbo-es, despliegue dpl_7Z5zTQGK4K89KPsMiKZ3rTrAbG5v, estado READY.
- Código publicado: ff2b9e43384e3b3d50497f03b9a61c5aaff99403 en main. Incluye el diseño y marca actuales, nuevas imágenes y placas; accesos de alta/VIP continúan pausados.
- STRATO: contrato 10232911 y dominio activados. Registro A guardado: 216.198.79.1, recomendado por Vercel. Se conserva el CNAME existente de www al dominio raíz; Vercel confirma misconfigured=false. No se han cambiado MX/TXT ni yourdesigngpt.es.
- Certificado Vercel cert_C138ufY4FIYYxeczZv5UjEVa para raíz y www, renovación automática. No se ha comprado SSL adicional.
- www devuelve 308 al dominio raíz, conservando la ruta. HTTP devuelve 308 a HTTPS.

## SEO publicado

Las ocho páginas del sitemap responden HTTP 200 con su URL canónica .es, título propio y JSON-LD válido. Open Graph/Twitter y sus imágenes usan el dominio nuevo; Cafetería también dispone de fichas sociales y esquema WebPage. Robots permite rastreo y anuncia sitemap.xml. La imagen social y el archivo Google responden HTTP 200. Los paneles privados conservan noindex por cabecera y HTML.

Google Search Console ha verificado automáticamente la propiedad HTTPS mediante el archivo google8fa052a4ee6eb69c.html. Sitemap enviado: estado Correcto y ocho páginas descubiertas. La portada tiene confirmación de solicitud de indexación y ha entrado en la cola de rastreo prioritaria. Esto no significa que ya aparezca en resultados ni garantiza una posición.

## Redirección del dominio antiguo

La configuración del repositorio se conserva como respaldo. La comprobación real detectó que no se aplicaba por sí sola; se añadió una regla al principio de las reglas de proyecto Vercel, sin reemplazar las seis reglas anteriores:

- ID: 51ca8ac5-bf39-4007-8b11-0b313e96d50d.
- Versión publicada: 965ae9bb-0d3a-432c-b22a-f12b21cc0f63.
- src /(.*), condición host exacto dea-habbo-es.vercel.app, destino https://agenciaoficialdea.es/$1, estado 301.

Comprobados GET y HEAD de portada y rutas; también GET con agente Googlebot. Todos devuelven 301. /normativa/?origen=dea conserva ruta y parámetros. El dominio nuevo permanece HTTP 200 y no entra en bucle.

## Pruebas

- npm run build: 79 pruebas superadas.
- Las ocho páginas, sitemap, robots, archivo Google, imagen social y API de estadísticas responden correctamente en producción.
- Contador: mismo backend e histórico, API local; GET de estadísticas devolvió 781 totales y 68 del día. La comprobación posterior desde la interfaz mostró SISTEMA DEA · ONLINE y 785 totales/72 del día. Son lecturas en momentos distintos; no se han escrito visitas artificiales.
- Imágenes propias de portada cargadas correctamente. Escritorio sin desbordamiento horizontal. Se conservan las reglas adaptables y las pruebas existentes; no se ha realizado una prueba física nueva en iPhone en esta intervención.

## Pendiente externo

La herramienta Cambio de dirección de Search Console todavía rechaza su prueba de redirección de la portada antigua, pese a que el 301 está verificado públicamente con GET/HEAD y agente Googlebot. La verificación de ambos sitios sí pasa. Se ha intentado después de publicar la regla, pero no se declara aceptado el cambio de dirección. Revalidar cuando Google actualice su comprobación. El sitio nuevo, la verificación de propiedad, el sitemap y la solicitud de indexación ya están operativos.

No se han modificado OAuth, permisos de agentes, rangos ni bases de datos.
