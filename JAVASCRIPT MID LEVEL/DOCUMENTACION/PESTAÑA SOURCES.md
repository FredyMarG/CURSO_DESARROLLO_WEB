# GUÍA — PESTAÑA RESOURCES / SOURCES EN DEVTOOLS

---

# 📚 TEMARIO

1. ¿Qué es la pestaña Resources/Sources?

2. Diferencia entre Resources y Sources

3. ¿Para qué sirve realmente?

4. Anatomía de la pestaña

5. Explorar archivos del sitio

6. Ver y guardar archivos

   * HTML
   * CSS
   * JavaScript
   * Imágenes
   * Fuentes
   * JSON

7. Información ofrecida por la pestaña

8. Cambios en tiempo real

9. Workspaces

10. Snippets

    * Qué son
    * Cómo crearlos
    * Ejecutar fragmentos
    * Automatización

11. Ejecutar código por fragmentos

12. Debugging desde Sources

13. Breakpoints

14. Pretty Print

15. Buscar archivos y funciones

16. Breakpoints Avanzados
    * Conditional Breakpoints
    * Logpoints

17. Watch, Call Stack y Scope

16. Local Storage y recursos del navegador

17. Casos prácticos reales

18. Errores comunes

19. Buenas prácticas

20. Local Overrides (Persistencia real)

20. Flujo profesional de debugging

21. Ejercicios prácticos

22. Resumen final

---

# 🌐 ¿QUÉ ES LA PESTAÑA RESOURCES / SOURCES?

Dependiendo del navegador y la versión, esta pestaña puede llamarse:

✅ Sources
✅ Resources

En navegadores modernos normalmente aparece como:

```text
Sources
```

---

# 🧠 DEFINICIÓN SIMPLE

La pestaña Sources permite ver todos los archivos que una página web está utilizando.

---

# 🧠 DEFINICIÓN PROFESIONAL

La pestaña Sources es una herramienta de inspección y debugging que permite explorar, modificar y ejecutar recursos cargados por una página web, incluyendo archivos JavaScript, CSS, HTML, imágenes, almacenamiento local y fragmentos de código.

---

# 🔬 ¿QUÉ SON LOS RECURSOS DE UNA PÁGINA?

Cuando entras a una página:

```text
https://ejemplo.com
```

El navegador descarga MUCHOS archivos.

Por ejemplo:

✅ HTML
✅ CSS
✅ JavaScript
✅ Imágenes
✅ Videos
✅ Fuentes
✅ JSON
✅ APIs

La pestaña Sources te deja ver todos.

---

# 🧠 ¿PARA QUÉ SIRVE REALMENTE?

Sources es una de las herramientas más profesionales de DevTools.

Se usa para:

✅ Debugging JavaScript.
✅ Explorar código.
✅ Encontrar bugs.
✅ Ejecutar pruebas.
✅ Modificar archivos temporalmente.
✅ Ejecutar snippets.
✅ Analizar proyectos reales.

---

# 🚀 ¿POR QUÉ ES TAN IMPORTANTE?

Porque permite entender:

```text
Qué archivos usa la página
Cómo funciona el JavaScript
Qué scripts se ejecutan
Dónde ocurren errores
```

---

# 🧩 ANATOMÍA DE LA PESTAÑA SOURCES

Generalmente está dividida así:

```text
┌─────────────────────┬─────────────────────┐
│ Árbol de archivos   │ Editor de código    │
│                     │                     │
│                     │ Consola Debugging   │
└─────────────────────┴─────────────────────┘
```

---

# 📁 EXPLORAR ARCHIVOS DEL SITIO

En el panel izquierdo aparecen los archivos.

Ejemplo:

```text
example.com
├── css
├── js
├── images
└── fonts
```

---

# 📄 VER ARCHIVOS HTML

Puedes abrir:

```text
index.html
```

Y ver:

✅ Estructura.
✅ Scripts.
✅ Imports.

---

# 🎨 VER ARCHIVOS CSS

Puedes abrir:

```text
styles.css
```

Y analizar:

✅ Colores.
✅ Layouts.
✅ Flexbox.
✅ Grid.
✅ Media queries.

---

# ⚡ VER ARCHIVOS JAVASCRIPT

Aquí está uno de los poderes más grandes.

Puedes abrir:

```text
app.js
```

Y explorar:

✅ Funciones.
✅ Variables.
✅ Eventos.
✅ Clases.
✅ APIs.

---

# 🖼️ VER IMÁGENES

Puedes abrir:

✅ PNG
✅ JPG
✅ SVG
✅ WEBP

Muy útil para:

✅ Extraer assets.
✅ Revisar calidad.
✅ Ver rutas.

---

# 🔤 VER FUENTES

Puedes inspeccionar:

✅ Fuentes tipográficas.
✅ Archivos .woff.
✅ Fonts personalizadas.

---

# 📦 VER JSON

Muchas APIs devuelven JSON.

Ejemplo:

```json
{
    "nombre": "Fredy",
    "edad": 20
}
```

Sources permite verlos fácilmente.

---

# 💾 VER Y GUARDAR ARCHIVOS

---

# 📥 GUARDAR ARCHIVOS

Muchos archivos pueden guardarse.

Click derecho:

```text
Save as...
```

---

# 📥 ¿QUÉ PUEDES GUARDAR?

✅ CSS
✅ JavaScript
✅ HTML
✅ Imágenes
✅ JSON

---

# 🧠 ¿PARA QUÉ SIRVE GUARDARLOS?

Muy útil para:

✅ Analizar proyectos.
✅ Aprender de otros desarrolladores.
✅ Revisar código.
✅ Hacer pruebas locales.

---

# 🔬 INFORMACIÓN OFRECIDA POR SOURCES

Sources ofrece muchísima información.

---

# 📍 RUTAS DE ARCHIVOS

Ejemplo:

```text
/js/app.js
```

---

# 📍 TAMAÑO DE ARCHIVOS

Puedes detectar:

✅ Archivos enormes.
✅ Recursos pesados.

---

# 📍 CÓDIGO MINIFICADO

Muchos sitios comprimen JS.

Ejemplo:

```javascript
function a(){console.log("hola")}
```

Sources puede ayudarte a formatearlo.

---

# ✨ PRETTY PRINT

Botón:

```text
{}
```

Convierte:

```javascript
function a(){console.log("hola")}
```

En:

```javascript
function a() {
    console.log("hola")
}
```

---

# 📍 MAPAS DE ORIGEN (SOURCE MAPS)

Permiten relacionar:

```text
Código compilado ↔ Código original
```

Muy importante en:

✅ React
✅ Vue
✅ TypeScript

---

# 🔥 CAMBIOS EN TIEMPO REAL

Puedes modificar archivos temporalmente.

---

# ✏️ EDITAR JAVASCRIPT

Ejemplo:

Antes:

```javascript
console.log("Hola")
```

Después:

```javascript
console.log("MODIFICADO")
```

---

# ⚡ LOS CAMBIOS SON TEMPORALES

Importante:

```text
Al recargar → desaparecen
```

Porque solo afectan la versión cargada en memoria.

---

# 🔧 WORKSPACES

Workspaces conecta:

```text
DevTools ↔ Archivos reales del proyecto
```

---

# 🚀 ¿QUÉ PERMITE?

Permite:

✅ Guardar cambios reales.
✅ Editar directamente desde DevTools.
✅ Sincronizar archivos.

Muy útil profesionalmente.

---

# ✂️ SNIPPETS

Una de las herramientas más poderosas.

---

# 🧠 ¿QUÉ SON LOS SNIPPETS?

Los snippets son pequeños fragmentos de código JavaScript que puedes guardar y ejecutar cuando quieras.

---

# 🧠 DEFINICIÓN SIMPLE

Son mini scripts reutilizables dentro del navegador.

---

# 🧠 DEFINICIÓN PROFESIONAL

Los snippets son fragmentos persistentes de JavaScript almacenados en DevTools que permiten ejecutar automatizaciones, pruebas y debugging rápidamente sobre cualquier página web.

---

# 🛠️ CÓMO CREAR UN SNIPPET

Panel izquierdo:

```text
Snippets
```

Luego:

```text
New Snippet
```

---

# ⚡ EJECUTAR CÓDIGO POR FRAGMENTOS

Ejemplo:

```javascript
alert("Hola desde snippet")
```

Ejecutar:

```text
CTRL + ENTER
```

---

# 🚀 ¿PARA QUÉ SIRVEN?

Snippets sirven para:

✅ Automatizar tareas.
✅ Modificar páginas.
✅ Hacer testing.
✅ Ejecutar utilidades.
✅ Practicar JavaScript.

---

# 🧪 EJEMPLO REAL — CAMBIAR FONDO

```javascript
document.body.style.background = "black"
```

---

# 🧪 EJEMPLO REAL — ELIMINAR ADS

```javascript
document.querySelectorAll(".ad").forEach(el => el.remove())
```

---

# 🧪 EJEMPLO REAL — RESALTAR BOTONES

```javascript
document.querySelectorAll("button").forEach(btn => {
    btn.style.border = "5px solid red"
})
```

---

# 🛑 BREAKPOINTS AVANZADOS

No todos los breakpoints son simples clics.

### 🔸 Conditional Breakpoints
Click derecho en el número de línea -> **Add conditional breakpoint**.
Solo pausa la ejecución si se cumple una condición (ej: `usuario.id === 5`). Evita pausar en cada iteración de un bucle.

### 🔸 Logpoints
Click derecho -> **Add logpoint**.
Escribe un mensaje en la consola (`console.log`) sin detener la ejecución del código. Es ideal para depurar en sitios de producción donde no quieres interrumpir la experiencia.

---

# 🕵️ WATCH, CALL STACK Y SCOPE

Ubicados en el panel derecho durante una pausa:

### 👁️ Watch
Permite "vigilar" variables o expresiones específicas. Si el valor cambia mientras avanzas línea por línea, lo verás reflejado inmediatamente.

### 📜 Call Stack (Pila de llamadas)
Es el historial de funciones. Te dice qué función llamó a la que estás ejecutando ahora. Es vital para entender cómo llegaste a un error.

### 🔍 Scope (Ámbito)
Muestra todas las variables disponibles en el momento actual (Locales, Globales, Closure).

---

# 💾 LOCAL OVERRIDES

¿Quieres que tus cambios en Sources se mantengan incluso al recargar la página?

1. Ve a la pestaña **Overrides** (dentro de Sources).
2. Selecciona una carpeta en tu PC.
3. Dale permiso al navegador.

Ahora, cualquier cambio que guardes en el editor de DevTools se escribirá en tu disco duro y se cargará automáticamente al refrescar. **Es el flujo de trabajo profesional definitivo.**

---

# 🔍 BUSCAR ARCHIVOS

Atajo:

```text
CTRL + P
```

Busca archivos rápidamente.

---

# 🔍 BUSCAR FUNCIONES

Atajo:

```text
CTRL + SHIFT + F
```

Busca texto en TODOS los archivos.

Muy útil para:

✅ Encontrar funciones.
✅ Encontrar variables.
✅ Encontrar eventos.

---

# 🛑 BREAKPOINTS

Los breakpoints detienen el código.

---

# 🧠 DEFINICIÓN SIMPLE

Son pausas automáticas del JavaScript.

---

# 🧠 DEFINICIÓN PROFESIONAL

Un breakpoint es un punto de interrupción que pausa la ejecución del motor JavaScript para permitir inspeccionar variables, funciones y flujo del programa.

---

# 🔴 CREAR BREAKPOINT

Click en el número de línea.

Ejemplo:

```javascript
10 | console.log(usuario)
```

---

# ⚡ ¿QUÉ PASA CUANDO SE DETIENE?

Puedes inspeccionar:

✅ Variables.
✅ Valores.
✅ Stack.
✅ Scope.
✅ Flujo.

---

# 🐛 DEBUGGING REAL

---

# 🐛 EJEMPLO — VARIABLE INCORRECTA

Código:

```javascript
console.log(usuario.nombre)
```

Problema:

```text
usuario es undefined
```

Con breakpoint puedes descubrir:

✅ Dónde se rompió.
✅ Qué valor tenía.
✅ Qué función lo modificó.

---

# 🗂️ LOCAL STORAGE

Sources también permite explorar almacenamiento.

---

# 📦 LOCAL STORAGE

Guarda datos persistentes.

Ejemplo:

```javascript
localStorage.setItem("tema", "dark")
```

---

# 🍪 COOKIES

Puedes inspeccionar:

✅ Sesiones.
✅ Tokens.
✅ Preferencias.

---

# 📦 SESSION STORAGE

Datos temporales de sesión.

---

# 🧠 CASOS PRÁCTICOS REALES

---

# 🧪 CASO 1 — ENTENDER UNA WEB

Proceso:

1. Abrir Sources.
2. Revisar JS.
3. Revisar eventos.
4. Buscar funciones.
5. Analizar estructura.

---

# 🧪 CASO 2 — PROBAR CÓDIGO RÁPIDAMENTE

Crear snippet:

```javascript
console.log("testing")
```

Ejecutar instantáneamente.

---

# 🧪 CASO 3 — DEBUGGING

1. Colocar breakpoint.
2. Ejecutar acción.
3. Inspeccionar variables.
4. Encontrar bug.

---

# ❌ ERRORES COMUNES

---

# ❌ CREER QUE LOS CAMBIOS SON PERMANENTES

Los cambios temporales desaparecen.

---

# ❌ NO USAR PRETTY PRINT

El JS minificado puede ser ilegible.

---

# ❌ USAR MUCHOS BREAKPOINTS

Puede volver lento el debugging.

---

# ❌ MODIFICAR SIN ENTENDER

Puedes romper temporalmente la página.

---

# ✅ BUENAS PRÁCTICAS

---

## ✅ Usa snippets para automatizar

Te ahorran muchísimo tiempo.

---

## ✅ Aprende breakpoints profundamente

Son esenciales profesionalmente.

---

## ✅ Usa búsquedas globales

Aceleran el debugging.

---

## ✅ Usa Pretty Print

Especialmente en sitios minificados.

---

# 🚀 FLUJO PROFESIONAL DE DEBUGGING

---

## PASO 1

Abrir Sources.

---

## PASO 2

Buscar archivo.

---

## PASO 3

Encontrar función.

---

## PASO 4

Colocar breakpoint.

---

## PASO 5

Ejecutar acción.

---

## PASO 6

Inspeccionar variables.

---

## PASO 7

Corregir lógica.

---

# 🧪 EJERCICIOS PRÁCTICOS

---

# 🧪 EJERCICIO 1

Abre cualquier página.

Explora:

✅ CSS
✅ JS
✅ Imágenes

---

# 🧪 EJERCICIO 2

Usa:

```text
CTRL + P
```

Y encuentra un archivo JS.

---

# 🧪 EJERCICIO 3

Usa Pretty Print.

Analiza código minificado.

---

# 🧪 EJERCICIO 4

Crea un snippet:

```javascript
alert("Hola")
```

Ejecuta.

---

# 🧪 EJERCICIO 5

Coloca un breakpoint.

Inspecciona variables.

---

# 🏁 RESUMEN FINAL

La pestaña Sources/Resources es:

✅ Un explorador de archivos.
✅ Un debugger profesional.
✅ Un ejecutor de scripts.
✅ Un laboratorio JavaScript.
✅ Una herramienta de análisis.

Dominarla significa:

🔥 Entender cómo funciona una web real.
🔥 Encontrar bugs más rápido.
🔥 Analizar proyectos profesionales.
🔥 Mejorar muchísimo en JavaScript.
🔥 Aprender debugging real.

---

# 🎯 LO MÁS IMPORTANTE QUE DEBES DOMINAR

## Nivel Junior

✅ Explorar archivos.
✅ Ver JS.
✅ Ejecutar snippets.

---

## Nivel Intermedio

✅ Breakpoints.
✅ Pretty Print.
✅ Buscar funciones.

---

## Nivel Profesional

✅ Debugging profundo.
✅ Workspaces.
✅ Source maps.
✅ Automatización.
✅ Análisis completo de ejecución.
