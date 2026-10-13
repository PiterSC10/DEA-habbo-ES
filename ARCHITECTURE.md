# Arquitectura prevista

**Actual V4:** sitio estático HTML/CSS/JS; logo e iconos locales. No hay servidor ni datos.

**Fase futura:** GitHub privado → Cloudflare Workers (API, permisos y sesiones) + D1 (datos) + Discord OAuth (identificación). Discord para notificaciones, no como base de datos principal. Todos los accesos y operaciones deben comprobarse en el backend.

**Rutas actuales:** navegación SPA por fragmentos `#/...` dentro de `index.html`. No requieren reglas de rewrite en alojamiento estático.

**Modelo conceptual:** usuarios, vínculo Habbo, categorías/rangos, ascensos append-only, presencia verificada, nóminas, permisos, auditoría, documentación.

**Privacidad:** hasta desplegar el backend, usar únicamente datos ficticios.
