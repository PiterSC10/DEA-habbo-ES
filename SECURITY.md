# Seguridad · DEA-HABBO-ES

**Estado V4: prototipo visual, no apto para gestión real de agentes.**

- Los botones VIP y Agentes NO autentican ni conceden acceso real. Nunca utilizar el HTML como control de seguridad.
- Los cuatro Founders se identificarán mediante Discord OAuth y una lista de identidades verificada en el backend, no por nickname editable.
- El usuario normal solo podrá leer su propia ficha, comprobando el ID de Discord y el vínculo con Habbo en cada consulta del servidor.
- Delegar ascensos por permisos específicos, no por acceso general al panel VIP.
- Registrar movimientos de ascenso con fecha, rango previo, nuevo rango, responsable y motivo; no sobrescribir historial.
- Verificación de presencia en Habbo siempre manual hasta que exista un mecanismo autorizado y fiable.
- Separar permisos de ascensos, nóminas, RR. HH., administración y auditoría.
- Mantener secretos en Cloudflare, nunca en GitHub ni en el navegador.
- Habilitar protección de ramas y copias independientes de registros y base de datos.
- El código cliente no debe mostrar datos privados reales ni contener tokens.
