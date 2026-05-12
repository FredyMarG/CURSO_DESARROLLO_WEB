# GUÍA — PESTAÑA NETWORK EN DEVTOOLS

---

# 📚 TEMARIO

1. ¿Qué es la pestaña Network?

2. ¿Qué significa “red” en una página web?

3. ¿Para qué sirve realmente?

4. Cómo funciona una petición web

5. Anatomía completa de la interfaz

6. Panel principal de requests

7. Timeline y cascada de carga

8. Información que ofrece Network

9. Tipos de recursos

   * Fetch/XHR
   * JS
   * CSS
   * Img
   * Media
   * Font
   * Doc
   * WS

10. Sort by y filtros de búsqueda

    * Filtrar por tipo
    * Buscar requests
    * Ordenar columnas
    * Buscar palabras clave

11. Headers

12. Preview

13. Response

14. Timing

15. Payload

16. Status codes

17. Limpiar cookies y cache

18. Hard reload

19. Desactivar cache

20. Importar y exportar

    * Export HAR
    * Import HAR
    * Compartir debugging

21. Simular internet lento

22. Monitorear APIs

23. Detectar errores reales

24. Debugging profesional

25. Casos prácticos

26. Errores comunes

27. Buenas prácticas

28. Flujo profesional de análisis

29. Ejercicios prácticos

30. Resumen final

---

# 🌐 ¿QUÉ ES LA PESTAÑA NETWORK?

La pestaña Network es una herramienta que permite ver TODA la comunicación entre el navegador e internet.

---

# 🧠 DEFINICIÓN SIMPLE

Network muestra todas las peticiones que una página web hace mientras funciona.

---

# 🧠 DEFINICIÓN PROFESIONAL

La pestaña Network es una herramienta de monitoreo y análisis de tráfico HTTP/HTTPS que permite inspeccionar recursos, tiempos de carga, APIs, respuestas del servidor y comportamiento de red de una aplicación web.

---

# 🌍 ¿QUÉ SIGNIFICA “RED”?

Cuando visitas una página:

```text
https://ejemplo.com
```

Tu navegador empieza a pedir archivos.

Ejemplo:

```text
Navegador → Servidor
```

Pide:

✅ HTML
✅ CSS
✅ JavaScript
✅ Imágenes
✅ APIs
✅ Videos
✅ Fuentes

Todo eso pasa por la red.

---

# 🔄 CÓMO FUNCIONA UNA PETICIÓN WEB

---

# 📤 PASO 1 — REQUEST

El navegador solicita información.

Ejemplo:

```http
GET /usuarios
```

---

# 📥 PASO 2 — RESPONSE

El servidor responde.

Ejemplo:

```json
[
  {
    "nombre": "Fredy"
  }
]
```

---

# 🌐 TODO ESO APARECE EN NETWORK

Network registra:

✅ Qué se pidió.
✅ Cuándo se pidió.
✅ Cuánto tardó.
✅ Qué respondió.
✅ Si falló.

---

# 🚀 ¿PARA QUÉ SIRVE REALMENTE?

Network es una herramienta extremadamente profesional.

Se usa para:

✅ Debugging.
✅ Revisar APIs.
✅ Optimizar rendimiento.
✅ Detectar errores.
✅ Analizar tiempos.
✅ Ver tráfico real.

---

# 🧩 INTERFAZ DE NETWORK

La pestaña normalmente se divide así:

```text
┌────────────────────────────────────┐
│ Barra superior                     │
│ Filtros y búsqueda                 │
├────────────────────────────────────┤
│ Lista de requests                  │
│                                    │
│ Nombre | Status | Type | Time      │
├────────────────────────────────────┤
│ Información detallada              │
│ Headers | Preview | Response       │
└────────────────────────────────────┘
```

---

# 🎛️ BARRA SUPERIOR

Aquí están herramientas importantes.

---

# 🔴 BOTÓN RECORD

Activa o desactiva captura.

```text
●
```

Rojo:

```text
Network está grabando tráfico
```

---

# 🗑️ BOTÓN CLEAR

Limpia la lista de requests.

Muy útil para:

✅ Empezar análisis limpio.
✅ Revisar solo nuevas peticiones.

---

# 🚫 DISABLE CACHE

Opción:

```text
Disable cache
```

Hace que el navegador NO use cache.

---

# 🧠 ¿QUÉ ES EL CACHE?

El cache guarda archivos temporalmente.

Ejemplo:

```text
CSS
JS
Imágenes
```

Para cargarlos más rápido.

---

# ⚠️ PROBLEMA DEL CACHE

A veces el navegador sigue usando archivos viejos.

Resultado:

```text
Tus cambios no aparecen
```

---

# ✅ SOLUCIÓN

Activar:

```text
Disable cache
```

---

# 📊 LISTA PRINCIPAL DE REQUESTS

Aquí aparece cada petición.

Ejemplo:

```text
index.html
styles.css
app.js
usuarios.json
```

---

# 📋 COLUMNAS IMPORTANTES

---

## Name

Nombre del recurso.

---

## Status

Código de respuesta.

Ejemplo:

```text
200
404
500
```

---

## Type

Tipo de archivo.

---

## Size

Peso del recurso.

---

## Time

Tiempo de carga.

---

## Waterfall

Muestra visualmente cuánto tarda cada recurso.

---

# 🌊 TIMELINE Y WATERFALL

Muestran el orden y duración de las cargas.

Ejemplo:

```text
HTML ━━━━━━━
CSS      ━━━
JS         ━━━━━━━
API             ━━
```

---

# 🧠 ¿PARA QUÉ SIRVE?

Permite detectar:

✅ Recursos lentos.
✅ APIs lentas.
✅ Bloqueos.
✅ Problemas de rendimiento.

---

# 📦 TIPOS DE RECURSOS

---

# 🌐 FETCH/XHR

Requests de APIs.

Muy importante para frontend moderno.

Ejemplo:

```javascript
fetch("/usuarios")
```

---

# ⚡ JS

Archivos JavaScript.

---

# 🎨 CSS

Hojas de estilo.

---

# 🖼️ IMG

Imágenes.

---

# 🎥 MEDIA

Videos y audio.

---

# 🔤 FONT

Fuentes tipográficas.

---

# 📄 DOC

Documento HTML principal.

---

# 🔌 WS

WebSockets.

Usados para:

✅ Chats.
✅ Juegos.
✅ Tiempo real.

---

# 🔍 SORT BY Y FILTROS DE BÚSQUEDA

Una de las herramientas más importantes.

---

# 🔎 FILTRAR POR TIPO

Botones:

```text
All
Fetch/XHR
JS
CSS
Img
Media
Font
Doc
WS
```

---

# 🧠 EJEMPLO REAL

Si quieres ver solo APIs:

```text
Fetch/XHR
```

---

# 🔎 BUSCAR REQUESTS

Barra de búsqueda:

```text
Buscar...
```

Puedes buscar:

✅ URLs.
✅ APIs.
✅ Archivos.
✅ Palabras clave.

---

# 🔎 BUSCAR POR PALABRAS CLAVE

Ejemplo:

```text
usuarios
```

Mostrará:

```text
/api/usuarios
```

---

# 🔎 FILTROS AVANZADOS

Ejemplo:

```text
status-code:404
```

Busca errores 404.

---

# 🔎 OTROS FILTROS ÚTILES

---

## Requests lentos

```text
larger-than:100k
```

---

## Método HTTP

```text
method:POST
```

---

## Dominio

```text
domain:api.com
```

---

# 📊 SORT BY

Puedes ordenar columnas.

Ejemplo:

✅ Por tamaño.
✅ Por tiempo.
✅ Por status.

---

# 🚀 ¿PARA QUÉ SIRVE ORDENAR?

Permite detectar:

✅ Recursos enormes.
✅ APIs lentas.
✅ Archivos problemáticos.

---

# 📨 HEADERS

Muestran información de la petición.

---

# 📤 REQUEST HEADERS

Información enviada.

Ejemplo:

```http
Authorization
Content-Type
Cookies
```

---

# 📥 RESPONSE HEADERS

Información recibida.

Ejemplo:

```http
Content-Length
Cache-Control
```

---

# 👀 PREVIEW

Muestra respuesta visual.

Muy útil con JSON.

---

# 📄 RESPONSE

Muestra respuesta real del servidor.

Ejemplo:

```json
{
  "nombre": "Fredy"
}
```

---

# ⏱️ TIMING

Muestra cuánto tardó cada fase.

Ejemplo:

✅ DNS
✅ SSL
✅ Request
✅ Download

---

# 📦 PAYLOAD

Muestra datos enviados.

Ejemplo:

```json
{
  "email": "test@test.com"
}
```

---

# 🚦 STATUS CODES

---

# ✅ 200

Todo correcto.

---

# ❌ 404

Archivo no encontrado.

---

# ❌ 500

Error del servidor.

---

# 🔒 401

No autorizado.

---

# 🚫 403

Acceso prohibido.

---

# 🍪 LIMPIAR COOKIES Y CACHE

Muy importante en debugging.

---

# 🧠 ¿POR QUÉ LIMPIAR CACHE?

Porque archivos viejos pueden causar:

✅ Bugs falsos.
✅ CSS viejo.
✅ JS antiguo.

---

# 🗑️ HARD RELOAD

Mantén presionado click en recargar.

Opciones:

```text
Normal Reload
Hard Reload
Empty Cache and Hard Reload
```

---

# 🚀 EMPTY CACHE AND HARD RELOAD

Hace:

✅ Borra cache.
✅ Fuerza descargar todo otra vez.

Muy útil profesionalmente.

---

# 🍪 LIMPIAR COOKIES

Desde:

```text
Application → Cookies
```

Puedes eliminar:

✅ Sesiones.
✅ Tokens.
✅ Datos temporales.

---

# 📤 IMPORTAR Y EXPORTAR

Muy útil para debugging profesional.

---

# 📦 ¿QUÉ ES UN HAR?

HAR significa:

```text
HTTP Archive
```

Es un archivo que guarda todo el tráfico Network.

---

# 📤 EXPORT HAR

Click derecho:

```text
Save all as HAR with content
```

---

# 🧠 ¿PARA QUÉ SIRVE?

Permite:

✅ Compartir debugging.
✅ Analizar requests.
✅ Revisar rendimiento.

---

# 📥 IMPORT HAR

Puedes abrir archivos HAR.

Y analizar tráfico grabado previamente.

---

# 🚀 SIMULAR INTERNET LENTO

Dropdown:

```text
No throttling
Fast 3G
Slow 3G
```

---

# 🧠 ¿PARA QUÉ SIRVE?

Permite probar:

✅ Apps móviles.
✅ Rendimiento.
✅ Experiencia real.

---

# 🔥 MONITOREAR APIs

Network es esencial para APIs.

---

# 🧪 EJEMPLO FETCH

```javascript
fetch("/usuarios")
```

Network muestra:

✅ URL.
✅ Status.
✅ Tiempo.
✅ Respuesta.

---

# 🐛 DEBUGGING PROFESIONAL

---

# 🧪 CASO 1 — API NO FUNCIONA

Proceso:

1. Abrir Network.
2. Filtrar Fetch/XHR.
3. Revisar status.
4. Revisar response.
5. Encontrar error.

---

# 🧪 CASO 2 — PÁGINA LENTA

Proceso:

1. Revisar waterfall.
2. Ordenar por tiempo.
3. Detectar archivos lentos.
4. Optimizar.

---

# 🧪 CASO 3 — LOGIN FALLA

Proceso:

1. Revisar payload.
2. Revisar headers.
3. Revisar cookies.
4. Revisar response.

---

# ❌ ERRORES COMUNES

---

# ❌ NO LIMPIAR CACHE

Puede mostrar resultados falsos.

---

# ❌ NO FILTRAR REQUESTS

La lista puede ser gigantesca.

---

# ❌ IGNORAR STATUS CODES

Ahí suelen estar los errores.

---

# ❌ NO REVISAR RESPONSE

La respuesta suele explicar el problema.

---

# ✅ BUENAS PRÁCTICAS

---

## ✅ Usa filtros constantemente

Ahorran muchísimo tiempo.

---

## ✅ Aprende status codes

Es obligatorio profesionalmente.

---

## ✅ Usa HAR para compartir bugs

Muy usado en equipos.

---

## ✅ Analiza waterfall

Ayuda muchísimo a optimizar.

---

# 🚀 FLUJO PROFESIONAL DE ANÁLISIS

---

## PASO 1

Abrir Network.

---

## PASO 2

Limpiar requests.

---

## PASO 3

Recargar página.

---

## PASO 4

Filtrar recursos.

---

## PASO 5

Revisar status.

---

## PASO 6

Revisar response.

---

## PASO 7

Encontrar problema.

---

# 🧪 EJERCICIOS PRÁCTICOS

---

# 🧪 EJERCICIO 1

Abre una página.

Filtra:

✅ JS
✅ CSS
✅ Img

---

# 🧪 EJERCICIO 2

Busca:

```text
api
```

Encuentra requests.

---

# 🧪 EJERCICIO 3

Ordena por:

```text
Time
```

Encuentra recurso más lento.

---

# 🧪 EJERCICIO 4

Activa:

```text
Disable cache
```

Recarga.

---

# 🧪 EJERCICIO 5

Exporta un archivo HAR.

---

# 🏁 RESUMEN FINAL

La pestaña Network es:

✅ Un monitor de tráfico.
✅ Un analizador de APIs.
✅ Un debugger de requests.
✅ Una herramienta de rendimiento.
✅ Un laboratorio de red.

Dominarla significa:

🔥 Entender cómo se comunica una web.
🔥 Debuggear APIs profesionalmente.
🔥 Detectar problemas reales.
🔥 Optimizar rendimiento.
🔥 Trabajar como desarrollador frontend/backend real.

---

# 🎯 LO MÁS IMPORTANTE QUE DEBES DOMINAR

## Nivel Junior

✅ Filtrar requests.
✅ Revisar status.
✅ Revisar response.

---

## Nivel Intermedio

✅ Headers.
✅ Payload.
✅ Waterfall.
✅ Cache.

---

## Nivel Profesional

✅ HAR.
✅ APIs complejas.
✅ Performance.
✅ Debugging avanzado.
✅ Optimización de tráfico.
