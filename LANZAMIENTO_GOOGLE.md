# DEA HABBO ES — Corte de lanzamiento sin Cloudflare

**Estado:** candidato de publicación. NO fusionar hasta validar el servidor de Google Apps Script.

## Arquitectura
GitHub Pages aloja únicamente la interfaz pública. El portal privado y los formularios (Discord OAuth2, expedientes, ascensos, nóminas, pagas extra, auditoría) se ejecutan dentro de Google Apps Script, que accede a la hoja de cálculo privada.

**Pantalla inicial:** ACCESO VIP, ÚNETE A DEA y WEB PÚBLICA. Mantener el escudo y el águila originales, el menú interior, la jerarquía y la ruta de navegación.

## Ya preparado en esta rama
- `app.js` elimina la lógica antigua de Cloudflare, los formularios ficticios y el acceso demo; enlaza los apartados privados al portal Apps Script.
- `index.html` corrige las URL de imágenes Open Graph para compartir por WhatsApp.
- `styles.css` y todos los logotipos permanecen idénticos a la web publicada.

## No fusionar hasta comprobar
1. Instalar en el proyecto privado Apps Script los archivos `Code.gs`, `DiscordOAuth.gs`, `Operaciones.gs`, `Solicitudes.gs` y `Portal.html` del paquete privado de lanzamiento. Eliminar/retirar funciones antiguas no protegidas.
2. Mantener las propiedades `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET` y `DISCORD_REDIRECT_URI` en Apps Script; no incluirlas en GitHub.
3. Revisar autorización del primer Founder en `FOUNDERS!E2`, tras instalar los controles de sesión.
4. Desplegar el portal `/exec`, autenticar 10PEDRO con Discord y verificar permisos de lectura y escritura desde el servidor.
5. Comprobar que un usuario no autenticado y un agente normal no pueden consultar ni modificar datos de otros.
6. Comprobar que un registro R2 verdadero puede crearse, revisarse, aprobarse y queda auditado.
7. Verificar control de intervalos en ascensos, nóminas y pagas extra.
8. Verificar experiencia en móvil y escritorio. Solo entonces fusionar este PR con `main`.

**Datos:** La hoja original está restringida. Los registros `DEMO-*` y acciones `PRUEBA_*` se limpiaron el 18/10/2026 y se conserva copia previa de seguridad privada. No introducir datos personales reales hasta completar las verificaciones.

**Coste:** Google Apps Script y Google Sheets tienen cuotas gratuitas; esta arquitectura no usa Cloudflare, pero no puede prometer recursos ilimitados.
