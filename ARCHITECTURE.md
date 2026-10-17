# Arquitectura DEA HABBO ES V6

Vista pública sin inicio de sesión; Únete a DEA con OAuth2 de Discord; expediente solo lectura; Centro VIP para Founders identificado por IDs numéricos verificados servidor.

**Frontend**: `index.html` + `app.js` + `styles.css` + dos logos. Tres accesos en la portada. Navegación interna mediante hash y breadcrumbs. Modo demo sobre datos de ejemplo en memoria/sesión local, nunca de producción.

**Servidor futuro**: Cloudflare Worker, cookies de sesión HttpOnly Secure SameSite, OAuth2 Discord `identify`, origen de solicitudes validado, permisos de Founder en Worker, D1 SQLite parametrizada. El frontend invoca `/api/*` cuando se despliega la infraestructura. `build.mjs` excluye de archivos públicos `worker.js`, `schema.sql`, los secretos y la documentación.

**D1**: users; sessions; agents (R2=rank_index 3 inicial); applications; promotions (inmutables); promotion_permissions; rank_rules (con registro de modificación); payments (pagos inmutables con unicidad por agente/jornada); extra_sessions (una extra por sábado); audit_events (inmutables). Relaciones y restricciones descritas en `schema.sql`.

**Registros**: D1 fuente oficial → API de consulta → CSV exportable para Excel / Google Sheets. La sincronización automática de Excel online todavía no existe. Discord puede recibir webhooks opcionales pero no es base de datos. Si el webhook falla, D1 conserva el registro. El enlace automático de otras operaciones a Discord queda pendiente.

**No automatizar en Habbo**: medición de presencia, concesión de misiones ni transferencia de créditos. Son operaciones humanas autorizadas.
