# Plantilla Maestra del Curso (`RESOURCES COURSE/plantilla/`)

Carpeta centralizada y reutilizable para crear **cualquier curso, módulo, centro de documentación o ejercicio nuevo** manteniendo el 100% del diseño, navegación, temas y optimización del proyecto.

---

## Contenido de la plantilla

| Archivo | Para qué sirve |
|---|---|
| `modulo-template.html` | Base de **9 diapositivas** (Portada, Teoría, Buenas Prácticas, Simulador, Quiz y Laboratorio) |
| `documentacion-template.html` | Lector de **3 columnas** con tablas, `<ol>`, Mermaid, búsqueda y `docs-switcher.js` |
| `guia-apuntes-template.md` | Estructura estándar de cada guía Markdown (Teoría, Analogía + Mermaid, `node --test`, Ejercicios y Checklist) |
| `ejercicio-template.html` | Base limpia para ejercicios o proyectos conectados a `exercises/ejercicios-neon.*` |
| `docs-data-generator.js` | Script CLI para generar `docs-data.js` automáticamente desde `apuntes/*.md` |
| `slides-engine.css/js` | Motor compartido de diapositivas, quiz, copia de código y laboratorio en vivo |
| `course-polish.css/js` | Temas neón, barra superior/inferior, retos prácticos, favicon temático y enlace `?doc=` |
| `docs-switcher.js` | Selector cruzado, barra de lectura, ScrollSpy, Modo Enfoque, `↑ Subir`, atajos `/` / `Ctrl+K` y numeración uniforme `01.` / `01.1` |

---

## Cómo crear un curso nuevo en 5 pasos

1. **Crear la estructura del curso:**
   ```text
   NUEVO_CURSO/
   ├── Modulo01/index.html              (copia de modulo-template.html)
   └── Documentacion/
       ├── index.html                   (copia de documentacion-template.html)
       ├── docs-data.js                 (generado con docs-data-generator.js)
       └── apuntes/
           └── 01_TEMA.md               (copia de guia-apuntes-template.md)
   ```
2. **Generar `docs-data.js` automáticamente:**
   ```powershell
   node "RESOURCES COURSE/plantilla/docs-data-generator.js" NUEVO_CURSO/Documentacion
   ```
3. **Registrar el curso en `course-polish.js`:**
   - Añadir su configuración en `courseMeta`, sus carpetas en `COURSE_MODULES` y el mapa `?doc=` si aplica.
4. **Registrar el visor en `docs-switcher.js`:**
   - Añadir la nueva entrada en `DOC_CENTERS` y su color en `THEME_BY_ID`.
5. **Publicar en el portal (`index.html` y `RESOURCES COURSE/portal/app.js`):**
   - Agregar el paso en `.learning-path`, el botón en `.toolbar` y las tarjetas numeradas (`01.`, `02.`, ...) en `modules`.
