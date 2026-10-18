# Arquitectura DEA HABBO ES V6 · Definitiva

**Sin Cloudflare ni D1.** Mantener el diseño original: tres ventanas en portada y un menú interno plegable.

```text
GitHub Pages (sitio público, sin datos privados)
    ├── Web pública, jerarquía, Founders y normativa
    ├── Únete a DEA ──────────────┐
    └── ACCESO VIP ───────────────┤
                                 ↓
                     Google Apps Script /exec
                        ├── Discord OAuth2 identify
                        ├── sesión y autorización por acción
                        ├── control Founder y expedientes R2
                        ├── ascensos, nóminas y extras
                        └── auditoría de operaciones
                                 ↓
                Google Sheets restringido (base oficial)
```

OAuth Discord aporta identidad, **no** autorización automática. La sesión y todos los permisos se validan en el servidor; nunca confiar en JavaScript ni en nombres de usuario. Los Founders figuran en la pestaña FOUNDERS por su ID numérico y estado activo. Los agentes acceden a su ficha propia, en modo lectura.

**Requisito de despliegue:** retirar funciones públicas antiguas `google.script.run` sin comprobación de sesión; proteger todas las operaciones administrativas; verificar sesión, estado y autorización de cada escritura o lectura privada; asegurar revocación/caducidad de sesión y controles CSRF.

**Datos:** INICIO, SOLICITUDES, AGENTES, ASCENSOS, NOMINAS, PAGAS_EXTRA, RANGOS, FOUNDERS, AUDITORIA, CONFIG. Guardar con bloqueo cuando la operación necesite atomicidad; comprobar duplicados con reglas del servidor. Las modificaciones de normas se auditan y los eventos sensibles no se borran silenciosamente.

**Pruebas obligatorias antes de producción:** ID Founder real, login de agente, rechazo sin sesión, controles de acceso cruzado, alta desde R2, ascensos con plazo y presencia presencial, nóminas, extra de sábado y auditoría. La prueba de GitHub Pages no prueba estos permisos.

La entrega de créditos, aprobación de misión y presencia en Habbo se verifican por personas.
