# Acceso Discord: correo y usuario verificados

La V6 añade una **pantalla unificada** al pulsar Acceso VIP, Únete a DEA o Mi expediente. Encima está el botón **ENTRAR DIRECTAMENTE CON DISCORD**. Justo debajo hay un formulario con **usuario de Discord** y **correo electrónico de Discord** obligatorios que se remite mediante **HTTPS POST** a Google Apps Script, no a GitHub.

## Contrato del backend (obligatorio antes de fusionar esta actualización)

La implementación de Google Apps Script debe incluir `doGet(e)` con `?start=direct` y `doPost(e)` con `login_mode=manual`, `discord_username` y `discord_email`. El archivo `DiscordOAuth.gs` debe solicitar los scopes `identify email`, verificar `user.verified===true` y, en modo manual, comprobar que el usuario y correo de entrada coinciden con `user.username` y `user.email` devueltos por Discord, **después** de completar el flujo OAuth2. Las credenciales escritas nunca otorgan permisos.

El correo/usuario manuales solo permanecen temporalmente en `CacheService` durante el inicio OAuth (máximo 10 minutos); no se guardan en Google Sheets ni se añaden a URL. La cuenta autorizada se identifica por `user.id`. El VIP requiere que ese ID esté autorizado con estado `Activo` en `FOUNDERS`.

**Instalar antes del merge:** paquete privado `DEA_HABBO_ES_V6_DISCORD_CORREO_VERIFICADO_APPS_SCRIPT.zip`. Debe sustituir, no duplicar, las funciones anteriores del proyecto Apps Script. Para comprobarlo, probar `doPost` real y cuentas con email correcto/incorrecto/no verificado, Founder y no Founder. Nunca publicar el Client Secret.

La prueba automática de GitHub comprueba solo el cliente público. **Hasta desplegar el backend actualizado y probar OAuth real, mantener este PR en borrador; un build verde no demuestra que el formulario POST esté operativo.**
