# Identidad DEA — adaptador del sistema existente

Este módulo usa las funciones privadas del proyecto Apps Script inspeccionado: `deaRequire_`, `deaTab_`, `deaRows_`, `deaWithLock_`, `deaAudit_`, `deaRankCatalog_` y `deaIsMaster_`. No es un backend independiente y no añade un `doPost` público.

## Integración privada

La instalación del proyecto central conserva Discord OAuth, las sesiones y las ocho hojas anteriores. El código de los paneles privados, las vinculaciones y los IDs de administración permanecen en Apps Script.

- Renombrar las implementaciones anteriores de `deaOverview` y `deaCargoEstado` a `deaOverviewLegacy_` y `deaCargoEstadoLegacy_`.
- Sustituir los anteriores `deaSolicitarAlta` y `deaResolverSolicitud` por los del adaptador; no dejar rutas alternativas sin comprobaciones.
- Añadir `categoriaSolicitada` y `rangoSolicitado` al final del contrato `DEA_COLUMNS.SOLICITUDES`.
- Conservar las diez columnas existentes de SOLICITUDES y añadir las nuevas en K:L. Las solicitudes históricas sin rango explícito mantienen el alta R2 anterior.
- Crear IDENTIDADES_DEA con las siete cabeceras del módulo. No se modifican identidades, firmas ni expedientes existentes durante la preparación.
- El Master se valida contra el ID Discord obtenido por OAuth y la vinculación activa del servidor. Un nombre o un parámetro del cliente nunca concede ese acceso.
- En los ascensos, revalidar el permiso dentro del bloqueo, impedir autoascensos, respetar los plazos y exigir Master para R7–R10. Conservar snapshots, siguiente rango, ASCENSOS y auditoría.
- Registrar una intención auditada antes de las escrituras administrativas y la confirmación después en las operaciones heredadas.
- El Portal y CargoPortal muestran el registro único tras OAuth, selección del rango existente, aprobación y edición de la foto propia.

La firma 10P está reservada al propietario autenticado y verificado por el control Master del servidor. Ninguna instalación, consulta ni prueba la asigna a una cuenta real.

## Fotografía

El navegador acepta JPEG/PNG/WebP hasta 1 MB y comprime una miniatura JPEG de hasta 160 × 160 píxeles. El servidor valida formato, cabecera y tamaño (base64 hasta 40.000 caracteres). Se guarda de forma privada en la hoja existente; el nombre histórico de la columna `avatar_file_id` se conserva por compatibilidad, pero en esta versión contiene la miniatura. `deaMiFoto` solo devuelve la foto de la sesión propietaria. No se habilita el acceso público a archivos ni se solicitan permisos adicionales de Drive.

## Comprobaciones

`node --test test-identidad.mjs` verifica el contrato del adaptador con almacenamiento aislado. Las pruebas privadas adicionales ejecutadas en Apps Script comprueban ascensos con el código instalado, rechazo anónimo real, Master por ID, compilación de los siete paneles y conservación de las nueve hojas. Las funciones de prueba e instalación se mantienen privadas al publicar.

`npm run check` ejecuta las comprobaciones del sitio, visitas e identidad. `npm run build` excluye la integración privada de la distribución pública. El acceso real con Discord también debe verificarse en el entorno desplegado; los mocks no sustituyen esa comprobación.


## Primer registro unificado

- `deaRegistroInicial`: una sola solicitud OAuth con Habbo exacto, firma de 3 caracteres, foto opcional, rango y responsabilidad. La firma se reserva bajo bloqueo; los reintentos no duplican el registro.
- Nuevo ingreso: R2 tras confirmar 45 minutos de formación. Rangos en venta del catálogo: R5 Supervisor, R6 Director y R7 Delegado; también se conserva la selección de otros rangos existentes, incluido R10 Manager.
- Todos los primeros registros requieren Master por ID, código de misión leído en Habbo y comprobación presencial del rango o compra. R6 recibe autorización Director y R10 Manager únicamente tras la aprobación. No se tramitan pagos web.
- Founder solo admite la fila existente y sin Discord de lesslie.ar. Tras vincularla se cierra automáticamente, tanto en la interfaz como en el servidor.
- Revisión completa en Solicitudes del Master: Discord, Habbo, firma, fotografía, responsabilidad y misión. Auditoría previa y posterior; registros anteriores conservados.
- Actualizar también los adaptadores privados Portal, CargoPortal, RoleControl y Código del proyecto instalado. Las funciones públicas de vinculación Founder anteriores se redirigen al registro completo. Discord OAuth no se modifica.
- Validación: 37 escenarios aislados del nuevo flujo, rechazos anónimos reales y compilación de las siete plantillas; 11 hojas sin cambios por las pruebas. `npm run check` incluye las reglas del primer registro.
