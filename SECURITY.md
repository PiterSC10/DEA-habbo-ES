# Seguridad de DEA-HABBO_ES

## Estado actual

**Este repositorio contiene exclusivamente un prototipo visual.** La navegación privada es una simulación accesible sin autenticación. No debe utilizarse para información real ni presentarse como una intranet protegida.

## Reglas para el futuro sistema

- **Autenticación:** Discord OAuth implementado en servidor, con `state`, PKCE cuando corresponda, sesiones protegidas, expiración y revocación. Nunca pedir la contraseña de Discord en la web.
- **Verificación de Habbo:** comprobar manualmente el nickname; el login con Discord no acredita por sí solo la propiedad de una cuenta Habbo.
- **Autorización:** denegar por defecto; comprobar cada acción en servidor, incluyendo acceso por expediente, departamento y rol.
- **Separación de funciones:** nadie aprueba sus propias nóminas, ascensos extraordinarios ni cambios de privilegios.
- **Ascensos:** validar rango, fecha, autorizaciones y verificación manual de presencia. Registrar transacciones atómicas.
- **Auditoría:** registrar actor, acción, objetivo, marca temporal, valores anteriores/nuevos y resultado; no permitir borrar/editar auditoría desde la interfaz normal. Enviar copia a almacenamiento independiente con retención protegida.
- **Copias de seguridad:** programadas, cifradas, independientes del proveedor principal y probadas mediante restauraciones periódicas.
- **Secretos:** solo variables seguras del proveedor, nunca en código, commits, archivos `.env` subidos o mensajes públicos.
- **Administración:** 2FA en GitHub/Cloudflare, acceso mínimo, revisiones de permisos y registro de accesos.
- **Despliegue:** primero entorno de pruebas; pruebas de permisos y seguridad antes de aceptar datos reales.
- **Privacidad:** recopilar el mínimo de datos, definir períodos de conservación y acceso por necesidad.

## Limitaciones

Ni Discord ni GitHub sustituyen una base de datos transaccional y auditada. GitHub protege el código y su historial, pero no conserva por sí solo los datos de actividad.

La protección frente a administradores con control total de infraestructura requiere copias y registros fuera de su alcance. No existe garantía absoluta de invulnerabilidad ni de disponibilidad del 100 %.

## Reporte de incidencias

Hasta que exista un canal oficial, comunicar cualquier incidencia de forma privada a los Founders. No publicar credenciales, datos de miembros ni detalles de vulnerabilidades en incidencias públicas.
