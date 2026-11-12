# Producción DEA · 12 de noviembre de 2026

Backend publicado: Apps Script versión 47, revisión lógica 6.20261112. Mantiene la URL existente. Las versiones 45 y 46 quedan disponibles como respaldo de código.

## Cambios instalados

- `doGet` procesa `start=direct` y prepara OAuth Discord con alcance `identify` y estado de un uso.
- La versión 47 conserva el destino validado de la miniapp en el estado OAuth: el acceso Manager no se transforma en una sesión del portal general.
- El callback verifica `/users/@me` y registra el Discord ID en `REGISTROS_DISCORD`, bajo bloqueo e idempotentemente. El alta básica no crea autorizaciones administrativas.
- El directorio Founder combina expedientes, identidades y registros OAuth; incluye perfiles incompletos y estados rechazados. Los expedientes sin Discord se conservan.
- Portal privado: «Nuevos registros · 24 h», fechas Europe/Madrid y consulta paginada del historial de altas y cambios, con filtro por texto en la página cargada.
- La vinculación de cargos por perfil exige aprobación previa verificable para ese Discord; una foto y un nombre por sí solos no conceden acceso administrativo.
- Se conserva la recuperación de sesiones con vencimiento y cierre en servidor. La reparación administrativa temporal no forma parte del despliegue.

## Rectificación de accesos

Se restauró el Discord original de XPE_34 como Founder con respaldo de accesos OAuth históricos. Fran quedó asociado al expediente R10 Mánager MKT ya aprobado por Master. Se conservó su identificador de agente, fechas y rango; no se creó otro expediente. Se revocaron las sesiones cruzadas. La auditoría privada guarda los valores anteriores y posteriores y la procedencia de la autorización administrativa.

## Validación y límites

- Compilación local previa: 71 pruebas superadas.
- Tres pruebas adicionales del módulo público superadas: destino de miniapp conservado, registro idempotente sin permisos y rechazo de historial sin autorización.
- Apps Script: 14 comprobaciones completadas, incluyendo creación y validación de la hoja, consulta real del directorio, evaluación de las plantillas Portal/Manager/Director y rechazo anónimo de consultas privadas.
- La rectificación confirmó en servidor: Founder correcto, permiso Manager correcto, identidad de Fran correcta y conservación del expediente.
- Navegador de escritorio: web pública → Apps Script → enlace OAuth → formulario oficial de Discord, sin error de Google Drive.
- Enlaces específicos comprobados: Manager abre OAuth; Founder de XPE abre su pantalla personal. No se han autenticado las cuentas de los titulares.
- Vercel: producción READY, despliegue dpl_BCFK3hpRSWfexRm4aSKYtZHuyL3S desde el commit ad07bce81e3704498dede23c337cf8ffa2a5ce3d. El despliegue anterior servía un commit anterior a main.
- Pendiente de validación con los titulares: OAuth completo de ambas cuentas, miniapp autenticada, actualización, cierre y reapertura de sesión. No se han solicitado ni utilizado sus contraseñas.
- Pendiente de prueba real en móvil. Las comprobaciones locales y la evaluación de plantillas no sustituyen estas pruebas.

No se declara el cierre definitivo de producción.

La revisión automática rechazó añadir pruebas extra mediante la sustitución completa del archivo de autenticación. Esa sustitución no se ejecutó; se conservaron las comprobaciones ya instaladas y se validaron los enlaces reales. La corrección de cuentas sí fue ejecutada, auditada y verificada.

## Fuente pública y backend privado

`registro-discord.gs` reproduce el módulo de registro instalado dentro de Discord0Auth.gs. No instalarlo dos veces. Integración: `deaRegistryEnsure_(saved)` dentro del bloqueo OAuth, antes de guardar la sesión; `deaRegistryEnrich_(data,me)` al obtener el directorio privado y al refrescar el roster. El módulo no es un backend independiente ni un endpoint HTTP.

El archivo histórico `identidad-dea.gs` del repositorio no es una exportación completa del backend actual. No debe reemplazar automáticamente el código instalado; existen cambios privados posteriores de nóminas, comisiones, portal y cargos. Las credenciales y las filas privadas permanecen fuera del repositorio y de la distribución pública.
