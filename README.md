# DEA-HABBO_ES

**Web pública e intranet de DEA-HABBO_ES — prototipo visual V2**

Proyecto comunitario no oficial ambientado en Habbo. Diseño institucional en azul marino, negro y acentos dorados. Dirección visual y marca: **10PEDRO**.

> **ESTADO: PROTOTIPO / DEMOSTRACIÓN.** No está conectado a Discord OAuth, no hay sesiones autenticadas, no hay base de datos, ni panel privado real. No introduzcas contraseñas, datos personales, nóminas reales o información confidencial. El botón de Discord solo informa de que la conexión no está disponible.

## Cómo verlo

Abre `index.html` en un navegador moderno. No requiere instalaciones, dependencias ni servidor para la demostración.

## Contenido del repositorio

```text
DEA_HABBO_ES/
├── index.html                  # Web pública + demostración visual de intranet
├── README.md                   # Guía principal
├── SECURITY.md                 # Política y controles de seguridad previstos
├── .gitignore                  # Archivos que no deben subirse
└── docs/
    ├── ARQUITECTURA.md         # Arquitectura técnica prevista
    ├── FUNCIONALIDADES.md      # Alcance y hoja de ruta
    └── GITHUB.md               # Subida y trabajo seguro con GitHub
```

## Qué puedes navegar

**Web pública:** Inicio, Agencia, Jerarquía, Departamentos, Reclutamiento, Normativa, Actualidad, Contacto y Acceso.

**Zona privada (solo simulación):** expediente de agente, ascensos, nóminas, documentación y vistas administrativas de demostración.

La simulación de área privada **no ofrece protección real**. La visibilidad de un panel en esta versión no implica que exista autorización de servidor.

## Tecnología actual

- HTML5 + CSS3 + JavaScript integrados en `index.html`.
- Sin dependencias externas obligatorias.
- Sin almacenamiento persistente ni API.

## Arquitectura futura propuesta (todavía no implementada)

- **GitHub privado**: código, cambios y revisiones.
- **Cloudflare Workers / Pages**: web y lógica de servidor, sujeto a límites y condiciones del plan.
- **Cloudflare D1**: datos oficiales.
- **Discord OAuth**: acceso con identidad verificada.
- **Auditoría**: registro inmutable para operadores normales, con protección y copias externas.
- **Verificación Habbo**: manual por personal autorizado; la web no mide el tiempo en la sala.

Ver `docs/ARQUITECTURA.md` y `SECURITY.md`.

## Reglas del proyecto

1. Una sola web con zonas pública, intranet y administración.
2. Rangos R1–R10; no inventar rangos internos pendientes.
3. R1: tres rangos de 15 minutos cada uno, verificados manualmente en Habbo.
4. Desde R2: tiempo real transcurrido desde el último ascenso **más** permanencia mínima en sala, esta última verificada manualmente.
5. Historial de ascensos permanente; correcciones mediante nuevos registros, no sobrescritura silenciosa.
6. Nóminas separadas del cómputo de ascensos.
7. Permisos individuales y aprobación reforzada para operaciones sensibles.

## Propiedad y control

Mantener el repositorio privado bajo una cuenta controlada por los Founders, con autenticación de dos factores. No guardar tokens de Discord, contraseñas ni claves en GitHub.

## Próximo paso

Aprobar el diseño; luego crear el backend seguro, la base de datos y el acceso real con Discord en un entorno de pruebas **antes** de usar expedientes reales.

**DEA-HABBO_ES · 10PEDRO · Prototipo V2**
