# DEA HABBO ES — SEO técnico de preinauguración (Vercel)

**Dominio principal:** https://dea-habbo-es.vercel.app/

**Respaldo:** https://pitersc10.github.io/DEA-habbo-ES/

## Fase 1 — aplicada durante la preinauguración

- Se conserva la pantalla de usuario y contraseña temporal. No se altera Discord OAuth2 ni el backend de Apps Script.
- Se mantiene el `noindex,nofollow,noarchive,nosnippet` en `index.html` y la cabecera `X-Robots-Tag` de Vercel. La web **no debe aparecer en Google todavía**.
- `link rel="canonical"`, `og:url`, `og:image` y Twitter apuntan al dominio Vercel y no a GitHub Pages.
- Open Graph incluye título, descripción, idioma español e imagen de marca sin nombres personales.
- `WebSite` JSON-LD de schema.org declara el nombre y la identidad de comunidad independiente.
- El título y la descripción visibles del navegador se actualizan al navegar por las secciones del SPA.
- `robots.txt` permite al robot ver las instrucciones noindex; **no es una medida de seguridad** y no contiene sitemap durante la preinauguración.
- Se mantiene el diseño original, las tres tarjetas y los tres accesos, sin construir rutas que salten el login de preinauguración.
- **Advertencia:** los archivos del sitio siguen públicos en GitHub. La puerta de JavaScript es visual; no sustituye la autorización de servidor.

## Fase 2 — preparar páginas públicas aptas para Google

Actualmente la web utiliza rutas con fragmento `#/publico/...`. El título JavaScript por sí solo **no posiciona páginas independientes**. Antes de inaugurar habrá que servir páginas HTML con URL reales y contenido público indexable sin incluir el VIP.

| URL futura en Vercel | Objetivo |
| --- | --- |
| `/` | Presentar DEA HABBO ES |
| `/agencia-habbo/` | Qué es la agencia y su actividad |
| `/rangos-habbo/` | Jerarquía R1–R10 y ascensos |
| `/departamentos/` | Organización de DEA |
| `/unirse-a-dea/` | Acceso gratuito, formación inicial e ingreso R2 |
| `/normativa/` | Reglas públicas y preguntas frecuentes |

Estas rutas son **propuestas, no están publicadas**. Crear contenido original y comprensible, además de títulos, meta descriptions y canónicas individuales. Evitar duplicar contenido con el respaldo GitHub Pages. Mantener los formularios de Discord/Founders en el portal privado.

## Día de inauguración — pasos que requerirán aprobación

1. Confirmar que están terminados el backend, la autorización por ID Discord, las funciones de Founders y las pruebas de acceso de agentes.
2. Publicar las páginas públicas con URL propias que muestren contenido útil en el HTML recibido por Google.
3. Retirar `noindex` **únicamente de las páginas públicas**; mantener noindex y autenticación real en todas las áreas privadas.
4. Revisar que la protección de despliegue de Vercel no bloquee a Google en las páginas públicas; nunca desproteger el portal privado para lograr SEO.
5. Publicar `sitemap.xml` con solo páginas públicas, canónicas y con respuesta 200. Referenciarlo en `robots.txt`.
6. Conectar y verificar el dominio en Google Search Console y Bing Webmaster Tools, enviar sitemap, medir cobertura e incidencias.
7. Comprobar OG/Twitter, imágenes y Core Web Vitals en móvil. Asegurar que GitHub Pages mantiene la URL canónica de Vercel o se redirige cuando sea posible.

**No levantar `noindex` antes de la aprobación explícita de inauguración.** La indexación depende de los buscadores y no se garantizan posiciones.

## QA

`npm run check` valida reglas SEO de preinauguración, dominio canónico Vercel, imágenes y continuidad del gate. `npm run build` copia únicamente assets públicos y `robots.txt` a `dist`; nunca copia datos privados.

## Iteración de preparación de 19/10/2026 — sin liberar la indexación

- Se preparó un borrador **no desplegable** de sitemap: `seo-preparacion/sitemap-candidato.xml`. El proceso de construcción de Vercel es una lista blanca y no lo copia a `dist/`.
- No se ha creado ni enviado una propiedad en Google Search Console; hace falta verificar titularidad y contar con páginas HTML reales y aptas para indexación.
- Validar previamente: seis URL públicas deben devolver HTTP 200 y HTML propio, contenido visible para Google, canonical individual, ausencia de gate exclusivo al visitar la página pública tras inauguración y separación estricta del portal VIP.
- Se mantiene sin cambios la pantalla original de preinauguración y las directivas de exclusión global. El sitemap aprobado se moverá a `dist/sitemap.xml` **solo el día del lanzamiento**, tras la autorización explícita del responsable.

## Verificación de titularidad en Google Search Console (20/10/2026)

Se incorpora el archivo `google8fa052a4ee6eb69c.html` facilitado por Search Console y se publica en la raíz del dominio Vercel mediante la lista blanca `build.mjs`. URL de comprobación: https://dea-habbo-es.vercel.app/google8fa052a4ee6eb69c.html

La propiedad de tipo **Prefijo de URL** deberá verificarse desde Google Search Console mediante el método **Archivo HTML**. No eliminar el archivo tras la verificación para conservar la titularidad.

**No inicia indexación:** se conservan `noindex`, `X-Robots-Tag` y preinauguración; no se publica un sitemap hasta el lanzamiento aprobado. No se modifica OAuth, Apps Script ni el panel privado.
