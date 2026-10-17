# DEA HABBO ES · Activación real posterior (no desplegada)

**NO hay que activar Cloudflare ahora para poder mostrar la nueva portada y la web pública.** El panel VIP real y la inscripción real sí requieren servidor y Discord.

1. Crear cuenta gratuita de Cloudflare; seleccionar Workers y D1 Free.
2. Crear aplicación en Discord Developer Portal con OAuth2 / scope `identify`; no crear contraseñas propias para agentes.
3. Obtener **ID numérico de Discord** de cada Founder: 10PEDRO, KietsyAndrea, lesslie.ar y XPE_34. **Nunca usar solo el nickname** para asignar permiso de dirección.
4. En el equipo local instalar Node.js 20+, ejecutar `npm install` y `npm run check`.
5. `npx wrangler login`; `npx wrangler d1 create dea_habbo_db` y copiar el ID devuelto a `wrangler.toml` sustituyendo `REEMPLAZAR_POR_TU_D1_DATABASE_ID`.
6. `npx wrangler d1 execute dea_habbo_db --remote --file=schema.sql` (inicializa las tablas con las reglas conocidas; si ya existía, prueba primero en una base de ensayo).
7. Determinar la URL HTTPS real de Workers y añadir **exactamente** `https://TU-DOMINIO/auth/callback` entre las Redirect URIs de Discord.
8. Guardar los secretos mediante `npx wrangler secret put DISCORD_CLIENT_ID`, `npx wrangler secret put DISCORD_CLIENT_SECRET` y `npx wrangler secret put FOUNDER_DISCORD_IDS` (IDs separados por comas). No escribirlos en README, JS, HTML ni GitHub. Añadir `DISCORD_ASCENSOS_WEBHOOK` solo cuando decidas enviar avisos de ascenso a un canal privado.
9. **No ejecutar `npm run deploy` sin autorización explícita para publicar**. Al autorizarlo, el comando compilará la parte pública a `dist/` y desplegará el Worker con D1.
10. Realizar pruebas con dos cuentas reales diferentes (Founder y agente): iniciar sesión, solicitar alta a R2, verificar Habbo, aprobar, consultar expediente propio, ascender tras plazo, pagar jornada válida, bloquear pagos duplicados, revisar auditoría y descargar backup.

### Qué queda pendiente después de activar el backend

- Enlace verificable a la sala / servidor Discord (no se ha suministrado su URL).
- Integrar notificaciones privadas de **todos** los tipos de movimientos (ahora está preparado el webhook opcional para ascensos; no hay garantía de reintentos si Discord falla).
- Sincronización de dos documentos online: **ascensos** y **nóminas/extras**. Los CSV de ejemplo ya están disponibles; una hoja online vinculada aún no existe.
- Procedimientos especiales para R8–R10 (no hay nombres internos ni automatización de promociones por mérito).
- Políticas de corrección de pagos y respaldo periódico verificado. Los eventos históricos actuales son inmutables; las rectificaciones formales están por diseñar.

### Seguridad y privacidad

No te fíes de ninguna pantalla de administración mostrada por el navegador si no existe un Worker que compruebe el ID de Discord. El modo demo no tiene permisos ni registros oficiales. No recolectes datos innecesarios; los identificadores de Discord y expedientes son privados. La base D1 mantiene los originales, los CSV son copias opcionales.
