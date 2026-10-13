# Seguridad

Este ZIP es una **demo estática**: los botones de acceso VIP y agentes NO autentican usuarios. Ningún elemento visual del frontend puede sustituir controles de acceso del servidor. No introduzcas datos personales reales.

Para un servicio real: Discord OAuth con validación de `state` y PKCE, sesiones seguras, base de datos en backend, comprobación de permisos en cada operación, auditoría append-only, protección contra XSS/CSRF, control de abuso y copias de seguridad. Nunca almacenes secretos en `index.html`.
