# La Cafetería de DEA

Actualizado 5 noviembre 2026. Perfil: https://buymeacoffee.com/deahabbodpw?l=es

El propietario confirma configuración completada. Comprobación directa del perfil: aparece el formulario de apoyo, precio real 5 EUR por café y selector de unidades; ya no aparece aviso de conectar payout. La propia cuenta no puede pagarse a sí misma. No se ha realizado ningún pago ni confirmado transacción.

La web muestra 1/3/5/10/25 cafés equivalentes a 5/15/25/50/125 EUR, reflejando la configuración real observada. No se ha cambiado el precio del proveedor. El botón abre el enlace público oficial sin parámetros de cantidades. La selección web es orientativa y hay que elegir de nuevo la cantidad en el proveedor; este aviso se muestra antes del enlace. El checkout controla total y métodos disponibles. Apple Pay, Google Pay y tarjeta no se han probado transaccionando.

Accesos: cartel OPEN en portada, tarjeta, pie, opción de menú público, tarjeta superior pública y apartado #/publico/cafeteria. Página completa /cafeteria. Sin cambios en APIs, radio, autenticación, datos ni permisos.

Verificación: npm run check (64 pruebas), npm run build, sintaxis cafeteria.js y diff --check. Pruebas de navegación actualizadas para reconocer las tres tarjetas públicas, conservando las comprobaciones de Rangos y Placas. Revisión Chrome escritorio; sin prueba en dispositivo iOS/Safari real. No almacenar datos financieros ni inventar confirmaciones de pago.
