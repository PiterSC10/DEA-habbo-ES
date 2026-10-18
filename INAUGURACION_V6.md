# DEA HABBO ES · V6 — Control de inauguración

**Sitio:** https://pitersc10.github.io/DEA-habbo-ES/

## Conservado
- Portada original con **ACCESO VIP**, **ÚNETE A DEA** y **WEB PÚBLICA**, sin menús duplicados.
- Escudo original, águila dorada y azul, colores oficiales.
- Menú único plegable dentro de cada sección y diseño responsivo.
- Founders en igualdad; formación R1 en Habbo y fichas web a partir de R2.

## Sustitución tecnológica
GitHub Pages es la web pública. **Google Apps Script + Google Sheets restringido + Discord OAuth2** son el backend privado. No se usan Workers, D1 ni ninguna plataforma Cloudflare.

La web pública no ofrece cuentas de prueba ni botones de gestión que no tengan autenticación. Los accesos privados abren el portal de Apps Script, donde deben existir sesiones y controles de servidor.

## Bloqueo de salida
**No marcar el sistema como inaugurado mientras no se demuestre:** instalación y despliegue /exec, Discord OAuth2 verificado, permisos por ID, acceso VIP Founder, rechazo de acceso sin permiso, expediente del agente visible solo para su propietario, formularios reales de solicitudes/ascensos/pagos, auditoría y logout.

Las pruebas de JavaScript y las comprobaciones automáticas de GitHub **solo validan la web estática**. Tras completar el backend, publicar desde GitHub al fusionar la rama revisada, sin cambiar logotipos ni estilos.
