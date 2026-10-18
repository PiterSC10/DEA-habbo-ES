# DEA HABBO ES · V6 — Edición Inauguración (interfaz)

**Archivo de entrada: `index.html`** (exactamente ese nombre). Archivos de entrega directamente en la raíz; no crear carpetas dentro del repositorio.

## Diseño aprobado

- Escudo **DEA · ES 3D** original en la esquina, en el favicon, los accesos de móvil/escritorio y la vista previa para WhatsApp.
- **Águila dorada y azul original** de fondo en la portada. Destello breve y modo de movimiento reducido.
- **Portada sin menús ni navegación duplicada**, solo tres accesos: **ACCESO VIP**, **ÚNETE A DEA** y **WEB PÚBLICA**.
- **Un menú lateral único** solo dentro de las secciones; botón de tres rayas para plegar/desplegar. Móvil: panel lateral superpuesto.
- Migas de pan con enlaces de regreso y contraste propio, no otra barra de menú.
- Fondo azul noche, VIP dorado, navegación pública azul/cian, bordes con contraste y tarjetas separadas.
- Marca y título: **DEA HABBO ES**, con referencia a **Habbo Hotel** (proyecto de fans independiente).
- Firma al pie: **Designed by 10PEDRO — YourDesignGPT**, enlace a https://yourdesigngpt.netlify.app/.

## Qué se puede usar ahora, sin conectar servicios

- Web pública: información institucional, jerarquía R1–R10, departamentos, normativa, Founders en orden alfabético e instrucciones de ingreso.
- Secciones, botones y formularios de dirección **preparados**; no son accesibles sin sesión Discord de Founder confirmada por el servidor.
- El acceso VIP **permanece cerrado** mientras el backend Cloudflare / Discord no esté operativo. No se ofrece entrada por modo demo.
- El escudo superior izquierdo devuelve a la portada y las acciones clicables se distinguen con borde dorado y realce.
- CSV de exportación desde las vistas autorizadas una vez disponibles los registros reales. No se ha conectado ninguna hoja online.

## Modelo aprobado de la agencia

**Formación R1 sin ficha online:** Cadete → Aspirante a Operador a los 15 min → Operador en Práctica a los 30 min → tras 45 min, primer rango oficial R2 · Agente de Enlace, con presencia y misión verificadas por sala.

**Alta web a partir de R2:** el agente inicia sesión con Discord, da nickname Habbo exacto, presenta solicitud. Un Founder verifica en la sala y aprueba; se crea la ficha en D1, asociada a ese Discord. El agente puede consultar su ficha, pero no editarla.

**Dirección:** 10PEDRO (CEO · DIRECTOR DE WEB), KietsyAndrea (por determinar), lesslie.ar (por determinar), XPE_34 (CEO · DIRECTOR DE MARKETING). Cuatro Founders con tarjetas idénticas, orden A–Z, mismas facultades iniciales.

**Nóminas:** miércoles y domingo, importe/horas según categoría. El sábado paga extra variable decidida por Founders, solo para asistencia verificada. La web no mueve créditos en Habbo; requiere entrega y confirmación humana.

## Componentes técnicos

`index.html`, `styles.css`, `app.js`: web sin dependencias externas. `logo-dea-es.png`, `aguila-dea-original.jpg` y recursos sociales/iconos: originales aprobados. `worker.js`: servidor Cloudflare Workers; `schema.sql`: tablas D1; `wrangler.toml`: referencia sin configurar a la futura D1; `build.mjs`: copia **solo** los recursos públicos a `dist/`; `test.mjs`: pruebas del servidor y las reglas base.

Las tablas SQL incluyen cuentas Discord, agentes, solicitudes, ascensos, reglas, nóminas, sesiones de extra y auditoría. El backend contiene rutas para guardar/consultar estos movimientos; la integración externa **aún no está activada ni probada con cuentas reales**.

**Pendientes de puesta en marcha:** cuenta Cloudflare y D1, app Discord OAuth, cuatro IDs reales de Founders, despliegue, pruebas con cuentas y permisos, enlace al servidor Discord, webhook del tablón y sincronización con hojas online. La web pública puede mostrarse antes. No abrir el VIP ni registrar datos personales hasta comprobar el backend, los permisos y la base D1.

## Revisión / vista previa

1. Descarga y descomprime el ZIP, manteniendo todos los archivos en la misma ubicación.
2. Abre `index.html` en un navegador. Para mejor compatibilidad puedes ejecutar `python -m http.server 8000` desde esa carpeta y visitar `http://localhost:8000`.
3. Para verificar el backend local (con Node 20+): `npm run check`, `npm run build`. La carpeta `dist/` es generada localmente y está ignorada por Git.
4. Para subir a un GitHub privado, añade los archivos de la raíz, con `index.html` y `app.js`/`styles.css` junto a los logos. No subas contraseñas ni tokens.

## Publicación real posterior

Consulta `INAUGURACION_V6.md` y `ACTIVAR_CUANDO_QUIERAS.md`. Para la miniatura de WhatsApp, necesitarás una URL HTTPS pública; en Cloudflare Workers el servidor reescribe `og:image` al dominio publicado. Evita inventar enlaces antes de disponer de él.

## Precio

Diseñado para operar en los planes gratuitos de GitHub, Cloudflare Workers/D1 y Discord. **Coste previsto 0 €/mes dentro de las cuotas de cada servicio**, nunca capacidad ilimitada garantizada. No se ha hecho ninguna compra ni despliegue.
