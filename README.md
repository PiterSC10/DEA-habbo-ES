# DEA HABBO ES · V6 oficial

Sitio web principal (Vercel): https://dea-habbo-es.vercel.app/

Respaldo (GitHub Pages): https://pitersc10.github.io/DEA-habbo-ES/

SEO: dominio canónico Vercel y metadatos preparados; **noindex sigue activo durante preinauguración**. Ver `SEO_LANZAMIENTO_VERCEL.md`.

Proyecto independiente de aficionados a Habbo Hotel.

## Diseño original, sin cambios
- Portada **sin menú**, con tres ventanas: **ACCESO VIP**, **ÚNETE A DEA**, **WEB PÚBLICA**.
- Dentro de las secciones, un **único menú lateral plegable**, migas de pan y versión móvil.
- Águila azul/dorada y escudo DEA · ES originales; colores azul noche, dorado y cian.
- Cuatro Founders en igualdad, sin crear permisos basados en el nombre visible.

## Arquitectura acordada (sin Cloudflare)
- **Vercel:** dominio principal y distribución estática desde GitHub (`index.html`, `app.js`, `styles.css` y gráficos).
- **GitHub Pages:** respaldo del mismo sitio; no es el dominio canónico para buscadores.
- **Google Apps Script:** portal privado, identificación OAuth2 con Discord y validación de permisos del lado del servidor.
- **Google Sheets restringido:** base de datos central con INICIO, SOLICITUDES, AGENTES, ASCENSOS, NOMINAS, PAGAS_EXTRA, RANGOS, FOUNDERS, AUDITORIA y CONFIG.
- **Discord OAuth2 `identify`:** confirma el ID numérico. Los agentes consultan únicamente su ficha; los Founders pueden gestionar funciones autorizadas.

Los accesos ACCESO VIP y ÚNETE A DEA abren el portal Apps Script. La información privada **nunca se incluye en el código público de GitHub**. La dirección del portal se define en `app.js` (`DEA_PORTAL`) y debe coincidir con el despliegue `/exec` vigente.

## Reglas funcionales
- R1 es formación en sala Habbo (3 tramos de 15 minutos, 45 minutos en total) y **no se registra** en la web.
- R2 (Agente de Enlace I) es la primera ficha oficial; requiere Discord y autorización presencial de un Founder.
- Ascensos sujetos a rango y plazo mínimo; un Founder verifica presencia en Habbo.
- Nóminas ordinarias los **miércoles y sábados**, con selección múltiple y comprobación presencial de horas y entrega. La paga extra del sábado es independiente y requiere aprobación específica.
- **Ingreso gratuito** tras formación R1 y aprobación de R2, o compra presencial de rango con Founders/CEO.
- Tarifas totales anunciadas: **Supervisor 130c · Director 240c · Delegado 500c**. Misiones y permisos de venta pendientes de aprobación; ninguna venta automática.
- Placas de beneficio: catálogo de 6–8 por concretar, exclusivamente Founders; solicitud, verificación presencial, aprobación, activación, caducidad y expediente.
- No se automatizan misiones en Habbo ni transferencias de créditos.
- No se inventan rangos internos de R7–R10 ni importes pendientes.

## Comprobaciones antes de publicar
1. Instalar **completamente** el Apps Script oficial y retirar toda función antigua de escritura sin autorización.
2. Configurar el Client ID, Client Secret y URL de retorno Discord **solo dentro de propiedades privadas de Apps Script**.
3. Verificar con Discord una sesión Founder (10PEDRO), otra no Founder, cierre de sesión y acceso a datos ajenos.
4. Probar solicitudes, aprobación R2, ascensos, nóminas, extras, auditoría y bloqueo de duplicados en un entorno controlado.
5. Confirmar el enlace `/exec` y la experiencia móvil; **solo entonces fusionar** la rama de lanzamiento con `main`.

La hoja está respaldada y los ejemplos se retiraron; eso **no equivale** a una certificación del backend. Para el detalle de seguridad consulta `SECURITY.md`.

## Desarrollo
`npm run check` realiza comprobaciones automatizadas del cliente público; `npm run build` prepara los recursos estáticos. Las verificaciones locales **no prueban** sesiones Discord ni la seguridad real de Apps Script.

Los secretos, historiales privados, copias de Sheets y credenciales **no deben subirse al repositorio**.

## Estado de la iteración 19/10/2026
- Google Sheets contiene tarifas, registro de compras y estructuras de placas (las dos últimas sin operaciones reales).
- El backend privado Apps Script para lotes de nómina, placas y compra presencial se entrega **fuera del repositorio público**. No se considera instalado ni verificado en producción hasta probar una nueva implementación de Apps Script.
- `noindex` del HTML y de las cabeceras Vercel se mantiene; el acceso de preinauguración no se modifica.
- Borrador de sitemap en `seo-preparacion/sitemap-candidato.xml`: **no se incluye en el build ni se anuncia en robots.txt**, porque las rutas HTML finales todavía no existen.

## Web pública: pestañas neón RANGOS Y ASCENSOS / PLACAS DE BENEFICIO
- Dos pestañas aparecen en la parte superior de toda la zona pública `#/publico`, sin introducir una cuarta entrada en la portada original.
- `#/publico/jerarquia`: ventana con tabla individual de 35 rangos definidos (R1–R6), cuatro categorías pendientes (R7–R10), siguientes ascensos, tiempos de progreso, horas y créditos de nómina. Se documentan tarifas de compra de rango comunicadas, sin activar ventas.
- `#/publico/placas`: ventana de fichas visuales con campo de logo, nombre, precio, beneficio y duración. Como `CATALOGO_PLACAS` está vacío, se muestran seis plazas provisionales (sin precio/beneficio oficial ni compra habilitada).
- Los datos públicos aprobados pueden publicarse en el array `PLACAS_PUBLICAS` de `catalogo-publico.js`, manteniendo las solicitudes, pagos, aprobaciones y expedientes **exclusivamente privados en Apps Script y Sheets**. Nunca exponer la hoja privada ni un token a JavaScript cliente.
- Se mantiene `noindex`, robots y formulario de preinauguración. Un workflow en GitHub comprueba `npm run check` y `npm run build` antes de fusionar.

## DEA CONTROL APP FOUNDER (NO COMPARTIR)
Cuatro accesos directos personales, sin pasar por portada, al mismo proyecto Vercel:
- 10PEDRO Master: https://dea-habbo-es.vercel.app/founder-10pedro.html
- KietsyAndrea: https://dea-habbo-es.vercel.app/founder-kietsyandrea.html
- lesslie.ar: https://dea-habbo-es.vercel.app/founder-lesslie-ar.html
- XPE_34: https://dea-habbo-es.vercel.app/founder-xpe-34.html

Los lanzadores muestran únicamente información de perfil pública (nick, rango, keko) y accesos a formularios alojados en el Apps Script privado. Antes de operar se requiere OAuth2 Discord real y Founder activo en Sheets; la URL no concede permisos. No se comparten secretos ni archivos .gs en el GitHub público. La miniapp del Master dispone de enlaces adicionales.

**PENDIENTE INSTALAR:** el ZIP privado DEA_CONTROL_APP_FOUNDER_V6_BACKEND_PRIVADO.zip actualiza OAuth, bloquea sesiones anteriores, vincula cada perfil al Discord real, ofrece formularios append-only de incidencias y cobros y corrige nóminas a miércoles/sábado. Debe instalarse y desplegarse en el Apps Script original, no se instala desde GitHub ni Vercel. Los tres Founders sin Discord ID activo deberán vincularse antes de operar. Los cobros de placas permanecen sin habilitar hasta tener catálogo aprobado.

## Pie editorial 2026 e independencia de Habbo
- En portada posterior a contraseña, zona pública, agente, VIP y lanzadores Founder se muestra: © 2026 DEA HABBO ES · Powered by YourDesignGPT (enlace a https://yourdesigngpt.netlify.app/) · 10PEDRO (sin enlace).
- Se mencionan los cuatro Founders: 10PEDRO, KietsyAndrea, lesslie.ar y XPE_34.
- Aviso: proyecto independiente no afiliado ni patrocinado por Habbo o Sulake; las marcas son de sus titulares.
- **No tocar la pantalla previa de contraseña**: conserva su pie «DEA HABBO ES · Preinauguración» sin créditos adicionales.
- Pendiente de una futura iteración: sección pública «LA SALA» con imagen de la sala oficial, enlace válido Habbo, descripción, acceso y normas aprobadas; no se publica una pestaña vacía hoy.

## Autoridad de ascensos (20/10/2026)
Se ha confirmado la jerarquía **acumulativa por categoría de destino**: Directores hasta R5, Managers hasta R7, Founders hasta R10. R1 continúa siendo formación presencial en Habbo; las fichas web empiezan en R2. En la sección final de la tabla pública «RANGOS Y ASCENSOS» se explican los límites; el último campo de la tabla indica cargos autorizados en vez de atribuir todo únicamente a Founders. R7–R10 conservan sus rangos internos como pendientes sin inventar nombres ni habilitar operaciones.

La web estática **solo informa**. Cualquier permiso real de ascenso requiere actualización/verificación en Google Apps Script: identificación Discord, cargo confirmado en registros y límites comprobados en servidor (no en JS público). Los accesos a miniapps no modifican autorización por sí mismos.

## Miniapps generales Directores y Managers (20/10/2026)
Nuevos lanzadores estáticos independientes de las cuatro miniapps Founder:
- /directores-deawebapp.html — Directores: autorizaciones hacia R2–R5 después de la formación presencial R1.
- /managers-deawebapp.html — Managers: acumulativamente hacia R2–R7.
- Founders: acumulativamente hasta R10, mediante sus miniapps existentes.
Los permisos dependen de una VINCULACIÓN ADMINISTRATIVA segura entre Discord ID y cargo aprobada por Master Founder, nunca del enlace ni de un nickname autodeclarado. Se mantiene R7–R10 internos pendientes de definir.
**Importante:** Los lanzadores no gestionan ni consultan datos personales y NO conceden ascensos. La implementación del backend privado Apps Script v5 debe ser ampliada antes de activar operaciones: validar OAuth, rol autoritativo en cada petición, progresión consecutiva, plazo, asistencia, bloqueo de rangos sin definir y auditoría. Este repositorio público no contiene secretos ni el código Apps Script de producción.
El enlace a Discord se dirige a `?start=direct&app=d-directores` o `?start=direct&app=m-managers`. El identificador de miniapp únicamente elige el contexto OAuth; **no concede permisos**. Es obligatorio que Apps Script reconozca esos identificadores, confirme Discord ID y categoría AGENTES en servidor (Director R6; Manager R10) y aplique topes R5 y R7 antes de modificar registros. Hasta instalar ese backend, los botones pueden mostrar un error de acceso no configurado; no afirmar que registran ascensos.

## WEB CHECK SCAN V6 — diagnóstico público demostrativo (20/10/2026)
- Módulo aislado `web-check-scan.js`, cargado solo en la web principal desde `index.html`, con botón `◉ WEB CHECK SCAN` en `.home-foot` y `.foot`. La puerta de contraseña `.dea-preview-footer` NO recibe botón.
- Modal accessible con grupos de 26 comprobaciones: frontend, web application, integraciones y base de datos, e infraestructura. La barra 0–100 % indica **avance del recorrido**. Recursos del mismo origen se inspeccionan con solicitudes de solo lectura y avisos claros; servicios privados y disponibilidad externa quedan documentados/no validados.
- Desplegable de 15 bloques de trabajos y **180 horas estimadas comerciales**. Valoración **5.400 € + IVA** conservadora actual y **6.900 € + IVA** si está completo y validado. No son horas reales certificadas ni factura. Firma y enlace de YourDesignGPT.
- No hay navegación nueva; conserva la portada original, categorías R1–R10, permisos acumulativos, miniapps y `noindex`. No se ha modificado ni auditado Apps Script, Discord OAuth2, Google Sheets ni permisos privados.
- Se reutiliza el concepto del PR #12, no se fusiona su código antiguo (valoración 135 h, botón en la puerta de contraseña).
