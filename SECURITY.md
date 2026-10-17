# Seguridad · DEA HABBO ES V6

La web está preparada para demostrar funcionalidades; **la demo no representa un permiso real ni un almacén oficial de datos**. No confiar en el botón «Ver demo del Centro VIP» como autenticación.

En producción, el servidor usa Discord OAuth y sesiones HttpOnly, comprueba los IDs de los cuatro Founders (secret `FOUNDER_DISCORD_IDS`) y rechaza acciones no autorizadas. Los permisos delegados de ascensos también requieren validación en servidor. El agente solo ve su expediente propio. No debe poder editar rangos ni pagos.

Los registros de promociones, pagos y auditoría son inmutables mediante triggers D1. Cambios de normas generan eventos con valor anterior/nuevo y responsable. No subir `DISCORD_CLIENT_SECRET`, webhooks, tokens o backups personales a GitHub. Exportaciones y copias contienen información privada y deben almacenarse de forma segura.

No se ha realizado una auditoría de seguridad independiente ni pruebas de producción. Se requieren pruebas de OAuth, permisos cruzados, concurrencia en aprobaciones, duplicados, recuperación y registros antes de abrir inscripciones reales.
