# DEA HABBO ES · Instalación oficial sin Cloudflare

**Atención:** esta rama contiene una propuesta de publicación. No fusionar con `main` antes de validar la instalación privada.

1. Trabaja con la cuenta Google **DEA HABBO Departamento Web** y el proyecto Apps Script **DEA HABBO ES - SISTEMA CENTRAL**.
2. Guarda respaldo del código anterior y de la hoja (copia de Sheets realizada).
3. Instala los archivos oficiales `Code.gs`, `DiscordOAuth.gs`, `Solicitudes.gs`, `Operaciones.gs` y `Portal.html` en Apps Script, **sustituyendo** las funciones antiguas de pruebas sin autenticación.
4. En **Propiedades de secuencia de comandos** verifica `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET` y `DISCORD_REDIRECT_URI`. El Client Secret es secreto y no debe figurar en GitHub, documentos ni mensajes.
5. Discord Developer Portal → OAuth2: la URL Redirect registrada debe ser **exactamente** la URL /exec de Apps Script definida en `DISCORD_REDIRECT_URI`.
6. Implementar aplicación web (Google Apps Script) y copiar la dirección `/exec` vigente. Revisar el acceso correcto para iniciar sesión desde Discord; **NO abrir acciones sensibles sin sesiones y permisos del servidor**.
7. Probar con la identidad Discord del Founder 10PEDRO. Comprobar su estado autorizado en FOUNDERS y una cuenta sin privilegios; verificar que no pueda escribir ni consultar expedientes ajenos.
8. Ejecutar prueba completa: solicitud R2, revisión, aprobación, expediente, ascenso, nómina, paga extra, duplicados, auditoría, cierre de sesión. No usar expedientes reales hasta terminar.
9. En GitHub, la rama `lanzamiento-google-apps-script` mantiene la interfaz y enlaza el portal /exec. Si la implementación devuelve una URL nueva, **actualizar `DEA_PORTAL` antes de publicar**.
10. Revisar `npm run check` y la página en móvil, luego fusionar el PR y comprobar GitHub Pages.

**No utilizar Cloudflare.** La administración se hace desde el portal privado alojado por Apps Script; la web pública no expone operaciones administrativas.

Más detalles en `SECURITY.md` y `LANZAMIENTO_GOOGLE.md`.
