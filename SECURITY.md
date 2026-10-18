# Seguridad de DEA HABBO ES V6

La base de datos central es **Google Sheets restringido**, propiedad de la cuenta Google de DEA. GitHub Pages solo distribuye recursos públicos; jamás incluye tokens, contraseñas, identificadores de sesión ni expedientes.

**Autenticación:** OAuth2 de Discord con `identify`, `state` de un solo uso asociado a la sesión, intercambio del código desde el servidor y comprobación del ID numérico. Los nombres de Discord o Habbo no conceden permisos.

**Autorización obligatoria por cada operación:** validar sesión activa y no revocada, consultar permisos actualizados en FOUNDERS o AGENTES y denegar cualquier lectura/escritura no autorizada. Los agentes solo pueden consultar su expediente. Un Founder debe figurar habilitado en la hoja. Rechazar la invocación directa de cualquier función antigua sin verificación, incluso si el botón no se ve en pantalla.

**Protecciones:** caducidad y revocación de sesión, estado OAuth no reutilizable y vinculado a la sesión, control CSRF cuando corresponda, saneamiento de entradas, bloqueo de concurrencia, impedir duplicados de nómina/extra y registrar autor y fecha en AUDITORIA. Cuidado con aplicaciones Apps Script desplegadas como propietario para `google.script.run`: las funciones servidor accesibles desde el HTML deben aplicar permisos por sí mismas.

**Secretos:** `DISCORD_CLIENT_SECRET` y webhooks únicamente en Apps Script Script Properties. Nunca enviar el secreto en conversaciones, Google Sheets, GitHub o capturas. Si se expone, rotarlo.

**Pruebas obligatorias:** autenticar a 10PEDRO, probar rechazo de otras cuentas, protección de expedientes, operaciones autorizadas, duplicados, cierre y expiración de sesión. No abrir datos personales ni publicar la V6 como operativa hasta que se completen.

La comprobación automatizada de GitHub **no sustituye una auditoría de seguridad del backend**, y Google Sheets restringido no basta para proteger los métodos de una aplicación web expuesta.
