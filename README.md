> **V4.2 corregida:** se ha reparado el bloqueo de JavaScript por el botón ausente de salida de demo, la superposición de la portada sobre el menú, el encuadre del águila y el control del menú lateral.

# DEA-HABBO-ES · Prototipo V4.2

Web pública e intranet conceptual de la agencia ficticia DEA de Habbo. **Diseño aprobado: azul marino, negro y dorado.**

## Probar localmente

Abre `index.html` en un navegador junto a los archivos de imagen en la misma carpeta. No hace falta instalar paquetes. Para probar metadatos y rutas en un servidor local: `python -m http.server 8000` y abre `http://localhost:8000`.

## Qué incluye

- Portada cinematográfica con el **águila original** (sin alterar el águila ni las letras), destello y resplandor suave.
- Accesos VIP / Agentes / Web pública; **solo demostraciones**.
- Un solo menú lateral fijo a la izquierda con logo DEA · ES; apertura/cierre mediante tres rayitas, rutas clicables y botones de historial.
- Jerarquía desplegable R1–R10, 35 rangos internos confirmados de R1–R6; R7–R10 pendientes.
- Ficha de agente, ascensos, nóminas y administración ficticios, sin escrituras.
- Favicon, iconos para iOS/Android, imagen de compartir 1200×630, manifiesto web.
- Pie: Designed by 10PEDRO — [YourDesignGPT](https://yourdesigngpt.netlify.app/).

## IMPORTANTE: No hay autenticación real

Cualquiera que abra el HTML puede visitar la demostración VIP. **No es un panel privado real**, no hay Discord OAuth, base de datos ni controles de autorización. No introducir datos personales o reales. El acceso a producción debe implementarse en servidor con Cloudflare Workers + D1 y Discord OAuth, y con comprobaciones de rol en cada petición.

## Compartir en WhatsApp / Discord

`og-image.jpg` está preparado en formato 1200×630. Para que las redes muestren la miniatura, la web debe estar publicada y las etiquetas `og:image` y `twitter:image` deben apuntar a una **URL HTTPS absoluta**, no relativa. Actualiza el dominio antes de publicar; las apps pueden cachear miniaturas antiguas.

## Estructura

Todos los archivos del paquete se encuentran **en la raíz**, sin carpetas. Subir el contenido del ZIP a la raíz de un repositorio GitHub privado. No subir el ZIP dentro del repositorio como sustituto de sus archivos.

## Créditos

Proyecto independiente de fans; no afiliado oficialmente a Habbo ni a Sulake. Diseño: 10PEDRO — YourDesignGPT.
