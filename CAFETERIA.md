# La Cafetería de DEA

## Implementación
Página pública /cafeteria, selección local 1/3/5/10/25 cafés y cantidades previstas 2/6/10/20/50 EUR. Cartel OPEN centrado en portada, tarjeta en portada/inicio público y debajo de comunicados en noticias, enlace en pie. CSS independiente con rejilla adaptable, foco visible, radios nativos y movimiento reducido. Sin cambios en API, autenticación, radio, roles ni datos.

## Proveedor revisado el 5 de noviembre de 2026
Perfil preparado: https://buymeacoffee.com/deahabbodpw?l=es
Nombre DEA Habbo ES, logo oficial y descripción de apoyo voluntario guardados. Moneda EUR guardada. Apoyo mensual desactivado. Mensaje de agradecimiento guardado y confirmado en su vista previa.

Estado del proveedor: no puede aceptar pagos hasta conectar método de cobro. El titular debe abrir https://studio.buymeacoffee.com/payout-settings y completar Stripe, país real, identidad, datos fiscales/bancarios y condiciones aplicables. No se introdujeron estos datos ni se validó la forma jurídica.

Limitación observada en Supporters > Settings > Standard view > Price per coffee: solo 3, 5 o 10 EUR. Se mantiene el valor anterior de 5 EUR; NO se afirma que el proveedor tenga cafés de 2 EUR. Suggested amounts permite hasta tres botones (5/10/25/50/100) y muestra campo de importe libre, pero no se ha verificado un cobro de 2 EUR. Decisión necesaria antes de activar: comprobar importe libre de 2 EUR, autorizar otra unidad o elegir proveedor compatible. No inventar parámetros de URL para trasladar la selección.

Los cinco importes de la web son orientativos y el botón permanece disabled, sin enlace de pago. No activar hasta verificar la correspondencia de importes, titular y autorización de cobros. Tarjeta, Apple Pay y Google Pay no se han verificado en este checkout. No se registró ningún pago.

## Validación
npm run check: 64/64 pruebas existentes correctas. npm run build correcto. node --check cafeteria.js y git diff --check correctos. Preview Vercel READY y /cafeteria HTTP 200. Chrome escritorio: cabecera, logo, radio visible y accesos comprobados; 25 cafés actualiza resumen a 50 EUR; sin error de aplicación observado en la página nueva (los registros incluyen avisos de extensión/autenticación Vercel anteriores). Sin validación de reproducción de emisoras, sesiones privadas reales, Safari/iOS ni captura móvil: pendientes. Ningún secreto o dato financiero se añade al repositorio.
