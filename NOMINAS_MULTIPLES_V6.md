# DEA HABBO ES V6 · Nóminas múltiples

Actualización de backend privado preparada el **19/10/2026**.

## Funcionalidad

- Un Founder autorizado en Discord puede marcar varios agentes activos a la vez.
- El Portal.html privado presenta avatar Habbo, nick, categoría, rango, horas necesarias y el importe correspondiente.
- El importe se consulta en la tabla privada `RANGOS`; no se modifica desde el formulario.
- Hay selección múltiple, total automático, verificación de asistencia/entrega presencial, pago por jornada de miércoles o domingo y estados `Pendiente`, `Pagado` y `Sin regla`.
- Un envío a `deaNominasLote` revalida sesión Founder, fecha, alta, importe aprobado, asistencia, horas y duplicados bajo `LockService` antes de registrar cada pago individual en `NOMINAS` y `AUDITORIA`.
- No efectúa transferencias automáticas de créditos en Habbo.
- Se mantiene `deaNomina` por compatibilidad con clientes anteriores.

## Estado de publicación

**Frontend estático (GitHub Pages y Vercel):** sin cambio funcional; la portada y el acceso Discord existentes se mantienen.

**Backend privado Apps Script:** actualización preparada y ensayada localmente (11/11 comprobaciones), guardada en el Drive privado de DEA como `DEA_HABBO_ES_V6_NOMINAS_MULTIPLES_BACKEND_PRIVADO.zip`. Para activarla hay que sustituir **solamente** `Operaciones.gs` y `Portal.html` del proyecto Apps Script oficial y crear **nueva versión de la misma implementación /exec**. Hasta entonces el panel de producción puede seguir mostrando el formulario individual.

## Pruebas de aceptación obligatorias en Apps Script

1. Iniciar sesión como Founder con su ID Discord autorizado; confirmar que un agente sin privilegios no pueda utilizar operaciones de nóminas.
2. Seleccionar una jornada real de miércoles o domingo y comprobar la cuantía por rango desde `RANGOS`.
3. Confirmar que se bloquean los duplicados, agentes no activos, días no permitidos e importes pendientes de definir.
4. Solo cuando se hayan abonado efectivamente los créditos en Habbo, registrar un lote y confirmar una fila por agente en `NOMINAS` y `AUDITORIA`.
5. Confirmar que el portal muestra los pagos sin cruzar los datos de otros agentes.

> Privacidad: no subir archivos `.gs`, historiales, identificadores personales ni secretos de Discord al repositorio público. Los archivos de Apps Script residen en Drive privado.

