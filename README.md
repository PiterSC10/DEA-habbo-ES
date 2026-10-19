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
- R2 (Agente de Enlace) es la primera ficha oficial; requiere Discord y autorización presencial de un Founder.
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
