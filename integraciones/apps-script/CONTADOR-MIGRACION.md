# Contador DEA · migración del 12/11/2026

Backend publicado: Apps Script SISTEMA CENTRAL, versión 49; misma implementación.

El módulo `contador-dea.gs` utiliza exclusivamente hojas del libro central existente:

- `VISITAS_WEB_RECUPERACION`: 685 eventos v4 recuperados, por fecha, sin duplicar la fila TOTAL_V4.
- `VISITAS_WEB_EVENTOS`: nuevas cargas, fecha Europe/Madrid e identificador SHA-256; bloqueo de script y deduplicación por fecha e ID. Acepta tanto fechas nativas de Sheets como texto ISO.
- `VISITAS_WEB_BASELINE`: reservado al acumulado v3. No inicializar con cero ni marcar completo hasta recuperar el original.

En Código.gs se añadió únicamente esta ruta a doGet, antes de noticias:

```js
if(p.public==='visitas')return deaVisitsPublic_(p);
```

La API Vercel `/api/visitas` consulta este módulo y devuelve únicamente agregados. No depende de Vercel Blob. Conserva el contrato de alta POST, consulta GET e historial GET `?stats=1`.

Se preserva el estilo del contador. El signo `+` y el aviso de recuperación parcial impiden confundir el mínimo verificado con el total exacto pendiente.

## Completar el histórico sin reiniciar visitas

El Blob privado `dea-visitas/v3/contador.json` sigue conservado, pero suspendido por cuota. Cuando se pueda exportar, verificar `version:3`, `total` entero no negativo y el mapa `days`. Importar en VISITAS_WEB_BASELINE las claves `total_v3` y `dia:AAAA-MM-DD`. No sumar otra vez los eventos v4. Solo después de verificar la importación establecer `completo` a booleano TRUE. El código añadirá ese acumulado a los eventos recuperados y nuevos, sin sobrescribirlos.

No se han eliminado archivos del almacén anterior. Las visitas que no pudieron registrarse durante la suspensión no pueden reconstruirse con certeza.

## Verificación

Compilación y pruebas locales, incluyendo proxy, rechazo de respuestas inválidas, deduplicación de Apps Script en entorno aislado y adición posterior de baseline sin reinicio. Consulta pública real del backend recupera el historial desde 23/10/2026. La revisión automática rechazó generar visitas sintéticas en producción para no modificar las cifras reales; las pruebas de escritura se realizan con hojas simuladas.
