# Migración a agenciaoficialdea.es

Estado: preparada, pendiente de autenticación adicional de STRATO. No fusionar ni activar la redirección hasta resolver el pedido 708349490 y comprobar DNS y HTTPS. La web actual conserva su despliegue de producción.

## Configurado

- Proyecto Vercel correcto: dea-habbo-es (prj_8ZfY6mBzhq7VSjrjJLmkcBvkFrTI).
- agenciaoficialdea.es añadido al proyecto; www.agenciaoficialdea.es añadido con redirección 308 al dominio raíz.
- Propiedad de prefijo HTTPS preparada en Search Console bajo la cuenta del departamento web DEA. Verificación pendiente de dominio accesible. Google solicita google8fa052a4ee6eb69c.html, ya incluido en el build.
- Ocho páginas del sitemap: canónicas, URLs de Open Graph, Twitter y datos estructurados actualizados. Metadatos sociales y JSON-LD completados en Cafetería. Paneles privados conservan noindex.
- Contador con API relativa y orígenes admitidos nuevos; mismo backend y datos históricos. Sin escribir visitas artificiales.
- Redirección permanente del host antiguo conservando rutas preparada en esta rama.

## DNS pendiente

STRATO mantiene el pedido sin activar por autenticación adicional (correo aportado por el titular). Solo yourdesigngpt.es aparece administrable; no se ha tocado ese dominio.

Vercel indicó el 13/11/2026:

- A raíz: recomendación principal 216.198.79.1 y 64.29.17.1.
- CNAME www: bfaeba975c7c8090.vercel-dns-017.com.

Volver a consultar la configuración exacta de ambos nombres antes de guardar registros. Conservar MX/TXT ajenos; no cambiar nameservers ni comprar SSL adicional. La validación de HTTPS se realiza en Vercel al apuntar el DNS correctamente.

## Cierre pendiente tras activar STRATO

1. Abrir el paquete nuevo y configurar los registros devueltos por Vercel.
2. Confirmar propagación y certificado HTTPS válido en raíz y www, sin ignorar errores TLS.
3. Actualizar esta rama desde main si hubo otros cambios; repetir npm run build.
4. Fusionar la migración y publicar producción. Revisar que ninguna redirección conduce a dominio no disponible.
5. Comprobar las ocho URLs, sitemap, robots, archivo Google, imagen social y contador; revisar portada móvil/escritorio y rutas privadas pausadas.
6. Verificar propiedad HTTPS de Search Console, enviar sitemap.xml y solicitar cambio de dirección desde la propiedad Vercel. Solicitar indexación de portada y páginas clave si el servicio lo permite.

La indexación y las posiciones dependen de Google; no se han presentado como completadas. No se ha modificado OAuth ni los permisos de agentes.
