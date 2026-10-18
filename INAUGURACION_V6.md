# DEA HABBO ES · V6 — Preparación de inauguración

## Cambios de interfaz

- Conservada la portada original con **ACCESO VIP**, **ÚNETE A DEA** y **WEB PÚBLICA**.
- El logotipo superior izquierdo dirige a la portada desde el inicio y desde el menú interno.
- Las acciones interactivas de dirección tienen **borde dorado, realce y foco visible**. Las tarjetas informativas no se presentan como botones.
- En el acceso VIP **no existe opción de entrar mediante una demostración**: se necesita sesión Discord verificada y permiso Founder. Si falta el backend, el acceso privado permanece cerrado.
- Se incorpora **Cerrar sesión** a las vistas internas cuando hay una identidad activa.
- Se retiran los registros de muestra predefinidos del frontend. Los datos reales dependen del Worker y D1.

## Cómo abrir la web

- Preview actual: https://pitersc10.github.io/DEA-habbo-ES/
- Esta rama es **candidata a inauguración**, no está publicada en `main` y todavía requiere revisión.
- Para previsualizar el cambio antes de fusionarlo, probar esta rama en un servidor HTTP local o en un entorno de staging.

## Activación real pendiente (no simular)

1. Configurar Cloudflare Workers + D1 y aplicar `schema.sql`. D1 es la fuente oficial; Sheets, si se utiliza, será exportación/consulta complementaria.
2. Registrar la aplicación Discord OAuth2. Usar el callback exacto HTTPS del Worker, `https://TU-DOMINIO/auth/callback`; proteger `DISCORD_CLIENT_SECRET` y los IDs numéricos autorizados.
3. Para la primera prueba, usar **solo el ID Discord real de 10PEDRO** en `FOUNDER_DISCORD_IDS`. Probar acceso VIP, denegación de otra cuenta, cierre de sesión y rechazos API 401/403.
4. Probar escritura y recuperación de registros, alta R2 después de los 45 minutos presenciales de los tres rangos R1, ascensos, nóminas, duplicados, auditoría y backups.
5. Incorporar después los **cuatro Founders** y comprobar sus permisos. No deducir permisos de nombres Discord o Habbo.
6. Opcional: configurar webhook privado Discord y exportación a Google Sheets. No almacenar tokens ni exportaciones privadas en GitHub.

**No fusionar la rama ni anunciar funciones VIP como activas hasta superar las pruebas en una instalación real.** Abrir la web estática no equivale a desplegar su backend ni a autorizar a nadie.
