# GUÍA — PESTAÑA APPLICATION EN DEVTOOLS

---

# 📚 TEMARIO

1. ¿Qué es la pestaña Application?

2. ¿Para qué sirve realmente?

3. ¿Qué significa almacenamiento en una web?

4. Anatomía completa de la pestaña

5. Application

6. Storage

   * Local Storage
   * Session Storage
   * Cookies
   * IndexedDB
   * Web SQL

7. Cache

   * Cache Storage
   * Application Cache
   * Service Workers

8. Background Services

9. Frames

10. Manifest

11. Service Workers

12. Inspección de datos guardados

13. Modificar datos manualmente

14. Eliminar almacenamiento

15. Simular limpieza de sesión

16. Debugging real

17. Seguridad y sesiones

18. Casos prácticos reales

19. Errores comunes

20. Buenas prácticas

21. Flujo profesional de análisis

22. Ejercicios prácticos

23. Resumen final

---

# 🌐 ¿QUÉ ES LA PESTAÑA APPLICATION?

La pestaña Application es una herramienta enfocada en almacenamiento, cache y servicios internos de una aplicación web.

---

# 🧠 DEFINICIÓN SIMPLE

Application permite ver y controlar los datos que una página guarda en el navegador.

---

# 🧠 DEFINICIÓN PROFESIONAL

La pestaña Application es una herramienta de inspección y administración de almacenamiento web, cache, service workers y recursos persistentes utilizados por aplicaciones web modernas.

---

# 🚀 ¿PARA QUÉ SIRVE REALMENTE?

Application se usa para:

✅ Ver datos guardados.
✅ Debuggear sesiones.
✅ Revisar cache.
✅ Analizar PWAs.
✅ Controlar cookies.
✅ Revisar almacenamiento local.
✅ Inspeccionar servicios en segundo plano.

---

# 🧠 ¿QUÉ SIGNIFICA “ALMACENAMIENTO WEB”?

Las páginas modernas pueden guardar información dentro del navegador.

Ejemplo:

✅ Tokens.
✅ Configuraciones.
✅ Preferencias.
✅ Sesiones.
✅ Datos offline.

---

# 🧪 EJEMPLO REAL

Cuando activas:

```text
Modo oscuro
```

Muchas páginas guardan:

```javascript
localStorage.setItem("theme", "dark")
```

---

# 🧩 INTERFAZ DE APPLICATION

La pestaña normalmente está organizada así:

```text
┌─────────────────────────┬────────────────────┐
│ Panel lateral           │ Información        │
│                         │ detallada          │
│ Storage                 │                    │
│ Cache                   │                    │
│ Background Services     │                    │
│ Frames                  │                    │
└─────────────────────────┴────────────────────┘
```

---

# 📦 APPLICATION

Application reúne herramientas relacionadas con:

✅ Almacenamiento.
✅ Cache.
✅ Datos persistentes.
✅ Recursos internos.

---

# 🧠 ¿POR QUÉ ES IMPORTANTE?

Porque muchas aplicaciones modernas funcionan gracias a datos guardados localmente.

Ejemplo:

✅ Gmail.
✅ YouTube.
✅ Spotify.
✅ Discord.

---

# 💾 STORAGE

Una de las secciones más importantes.

---

# 🧠 ¿QUÉ ES STORAGE?

Storage significa:

```text
Almacenamiento
```

Aquí puedes ver todos los datos que la página guarda.

---

# 📦 LOCAL STORAGE

Muy usado en frontend.

---

# 🧠 DEFINICIÓN SIMPLE

Local Storage guarda datos persistentes en el navegador.

---

# 🧠 DEFINICIÓN PROFESIONAL

Local Storage es un sistema de almacenamiento clave-valor persistente del navegador que permite guardar información localmente sin expiración automática.

---

# 🧪 EJEMPLO

```javascript
localStorage.setItem("usuario", "Fredy")
```

---

# 🔥 ¿QUÉ PUEDE GUARDARSE?

✅ Temas.
✅ Tokens.
✅ Configuraciones.
✅ Preferencias.

---

# ⚠️ IMPORTANTE

Local Storage:

✅ Persiste.
❌ No se elimina al cerrar navegador.

---

# 📦 SESSION STORAGE

Muy parecido a Local Storage.

---

# 🧠 DIFERENCIA PRINCIPAL

Session Storage:

```text
Se elimina al cerrar la pestaña
```

---

# 🧪 EJEMPLO

```javascript
sessionStorage.setItem("temp", "123")
```

---

# 🍪 COOKIES

Extremadamente importantes.

---

# 🧠 DEFINICIÓN SIMPLE

Las cookies son pequeños datos que el navegador guarda para una página.

---

# 🧠 DEFINICIÓN PROFESIONAL

Las cookies son fragmentos de datos enviados entre servidor y navegador utilizados para autenticación, sesiones, seguimiento y personalización.

---

# 🧪 EJEMPLO REAL

Cuando haces login:

```text
El servidor guarda una cookie de sesión
```

---

# 🍪 ¿QUÉ PUEDES VER?

✅ Nombre.
✅ Valor.
✅ Expiración.
✅ Dominio.
✅ Seguridad.

---

# ⚠️ IMPORTANCIA DE LAS COOKIES

Muchas autenticaciones dependen de ellas.

---

# 🗃️ INDEXEDDB

Base de datos interna del navegador.

---

# 🧠 DEFINICIÓN SIMPLE

IndexedDB permite guardar grandes cantidades de datos.

---

# 🧠 DEFINICIÓN PROFESIONAL

IndexedDB es una base de datos NoSQL integrada en el navegador que permite almacenamiento estructurado y consultas complejas offline.

---

# 🚀 ¿PARA QUÉ SE USA?

✅ Apps offline.
✅ PWAs.
✅ Datos grandes.
✅ Caché avanzado.

---

# 🧪 EJEMPLO REAL

Spotify Web puede guardar información temporal usando IndexedDB.

---

# 🗄️ WEB SQL

Tecnología antigua.

Actualmente casi no se usa.

---

# ⚡ CACHE

Una de las secciones más importantes para performance.

---

# 🧠 ¿QUÉ ES EL CACHE?

El cache guarda archivos temporalmente para cargarlos más rápido.

---

# 🧪 EJEMPLO

Cuando visitas una web:

```text
CSS
JS
Imágenes
```

Pueden guardarse en cache.

---

# 🚀 BENEFICIO

La siguiente carga es más rápida.

---

# ⚠️ PROBLEMA DEL CACHE

Puede causar:

✅ Archivos viejos.
✅ Bugs falsos.
✅ CSS desactualizado.

---

# 📦 CACHE STORAGE

Muy usado por PWAs y Service Workers.

---

# 🧠 DEFINICIÓN SIMPLE

Cache Storage almacena recursos web para usarlos offline.

---

# 🧠 DEFINICIÓN PROFESIONAL

Cache Storage es una API de almacenamiento de recursos HTTP utilizada principalmente por Service Workers para implementar aplicaciones offline y estrategias avanzadas de cache.

---

# 🧪 EJEMPLO

Una app puede guardar:

✅ HTML
✅ CSS
✅ JS

Para funcionar sin internet.

---

# ⚙️ SERVICE WORKERS

Muy importantes en aplicaciones modernas.

---

# 🧠 DEFINICIÓN SIMPLE

Son scripts que funcionan en segundo plano.

---

# 🧠 DEFINICIÓN PROFESIONAL

Un Service Worker es un script ejecutado independientemente de la página principal que permite manejar cache, requests, sincronización y funcionalidades offline.

---

# 🚀 ¿QUÉ PERMITEN?

✅ Apps offline.
✅ Push notifications.
✅ Cache inteligente.
✅ Background sync.

---

# 🧪 EJEMPLO REAL

YouTube puede seguir funcionando parcialmente sin internet gracias al cache.

---

# 🔄 BACKGROUND SERVICES

Servicios que trabajan detrás de la aplicación.

---

# 🧠 ¿QUÉ SON?

Procesos ejecutados en segundo plano.

---

# 🚀 EJEMPLOS

✅ Push notifications.
✅ Background sync.
✅ Periodic sync.
✅ Fetches automáticos.

---

# 🧠 ¿POR QUÉ SON IMPORTANTES?

Porque muchas PWAs modernas dependen de ellos.

---

# 🖼️ FRAMES

Una sección muy importante.

---

# 🧠 ¿QUÉ ES UN FRAME?

Un frame es un contexto independiente de renderizado dentro de la página.

---

# 🧪 EJEMPLO

```html
<iframe src="https://youtube.com"></iframe>
```

---

# 🌳 ¿QUÉ MUESTRA FRAMES?

Muestra:

✅ Origen.
✅ Recursos.
✅ Storage.
✅ Seguridad.

---

# 🧠 ¿POR QUÉ ES IMPORTANTE?

Porque muchas páginas usan:

✅ iframes.
✅ publicidad.
✅ widgets externos.

---

# 📄 MANIFEST

Muy usado en PWAs.

---

# 🧠 ¿QUÉ ES?

Archivo que describe la aplicación web.

---

# 📦 INFORMACIÓN DEL MANIFEST

✅ Nombre.
✅ Iconos.
✅ Tema.
✅ Modo fullscreen.

---

# 🔬 INSPECCIÓN DE DATOS GUARDADOS

Application permite revisar datos fácilmente.

---

# 🧪 EJEMPLO LOCAL STORAGE

```javascript
localStorage.setItem("modo", "dark")
```

Application mostrará:

```text
modo → dark
```

---

# ✏️ MODIFICAR DATOS MANUALMENTE

Puedes cambiar valores directamente.

Ejemplo:

```text
isAdmin = true
```

Muy útil para testing.

---

# 🗑️ ELIMINAR ALMACENAMIENTO

Puedes borrar:

✅ Cookies.
✅ Cache.
✅ Local Storage.
✅ Session Storage.

---

# 🔥 CLEAR STORAGE

Herramienta muy importante.

Permite limpiar TODO rápidamente.

---

# 🧠 ¿PARA QUÉ SIRVE?

Muy útil cuando:

✅ El login falla.
✅ Hay cache corrupto.
✅ La sesión se rompe.

---

# 🧪 SIMULAR LIMPIEZA DE SESIÓN

Borra:

✅ Cookies.
✅ Tokens.
✅ Session Storage.

Y la aplicación actuará como usuario nuevo.

---

# 🐛 DEBUGGING REAL

---

# 🧪 CASO 1 — LOGIN NO FUNCIONA

Proceso:

1. Revisar cookies.
2. Revisar tokens.
3. Revisar Local Storage.
4. Limpiar datos.
5. Probar nuevamente.

---

# 🧪 CASO 2 — APP NO ACTUALIZA

Proceso:

1. Revisar cache.
2. Revisar Service Worker.
3. Borrar Cache Storage.
4. Hard reload.

---

# 🧪 CASO 3 — PWA FALLA OFFLINE

Proceso:

1. Revisar cache.
2. Revisar manifest.
3. Revisar Service Worker.
4. Revisar recursos guardados.

---

# 🔒 SEGURIDAD Y SESIONES

Application es clave para seguridad.

---

# ⚠️ TOKENS VISIBLES

Muchos sitios guardan:

```text
JWT
Tokens
Sesiones
```

---

# ⚠️ IMPORTANCIA

Nunca debes exponer datos sensibles inseguramente.

---

# ❌ ERRORES COMUNES

---

# ❌ OLVIDAR LIMPIAR CACHE

Puede causar bugs falsos.

---

# ❌ CONFUNDIR LOCAL STORAGE Y SESSION STORAGE

Persisten diferente.

---

# ❌ IGNORAR SERVICE WORKERS

Pueden mantener archivos viejos.

---

# ❌ BORRAR DATOS SIN SABER

Puede cerrar sesiones importantes.

---

# ✅ BUENAS PRÁCTICAS

---

## ✅ Revisa storage cuando algo no actualiza

Muchos bugs vienen de datos guardados.

---

## ✅ Aprende cookies profundamente

Son esenciales profesionalmente.

---

## ✅ Usa Clear Storage para debugging

Muy útil.

---

## ✅ Aprende Service Workers

Cada vez son más importantes.

---

# 🚀 FLUJO PROFESIONAL DE ANÁLISIS

---

## PASO 1

Abrir Application.

---

## PASO 2

Revisar Storage.

---

## PASO 3

Revisar Cookies.

---

## PASO 4

Revisar Cache.

---

## PASO 5

Revisar Service Workers.

---

## PASO 6

Limpiar datos si es necesario.

---

## PASO 7

Probar nuevamente.

---

# 🧪 EJERCICIOS PRÁCTICOS

---

# 🧪 EJERCICIO 1

Entra a cualquier página.

Revisa:

✅ Cookies.
✅ Local Storage.

---

# 🧪 EJERCICIO 2

Guarda un dato:

```javascript
localStorage.setItem("test", "123")
```

Revísalo en Application.

---

# 🧪 EJERCICIO 3

Borra Session Storage.

Recarga página.

---

# 🧪 EJERCICIO 4

Revisa Cache Storage.

---

# 🧪 EJERCICIO 5

Explora Frames.

Busca iframes.

---

# 🏁 RESUMEN FINAL

La pestaña Application es:

✅ Un administrador de almacenamiento.
✅ Un inspector de cache.
✅ Un debugger de sesiones.
✅ Un explorador de PWAs.
✅ Una herramienta profesional de análisis.

Dominarla significa:

🔥 Entender cómo una web guarda datos.
🔥 Debuggear sesiones reales.
🔥 Resolver problemas de cache.
🔥 Trabajar con PWAs.
🔥 Pensar como desarrollador frontend profesional.

---

# 🎯 LO MÁS IMPORTANTE QUE DEBES DOMINAR

## Nivel Junior

✅ Local Storage.
✅ Cookies.
✅ Session Storage.

---

## Nivel Intermedio

✅ Cache.
✅ Service Workers.
✅ Clear Storage.

---

## Nivel Profesional

✅ PWAs.
✅ IndexedDB.
✅ Background Services.
✅ Estrategias de cache.
✅ Debugging avanzado de almacenamiento.
