# 🌐 GUÍA — LOCATION EN JAVASCRIPT

---

# 📚 TEMARIO

1. ¿Qué es `location`?
2. Relación entre `window` y `location`
3. Anatomía de una URL
4. `window.location.href`
5. `window.location.hostname`
6. `window.location.pathname`
7. `window.location.protocol`
8. `window.location.host` vs `hostname`
9. `window.location.port` y `origin`
10. `window.location.search` (Query Params)
11. `window.location.hash` (Anclas)
12. `window.location.assign()`
13. `window.location.replace()`
14. `window.location.reload()`
15. Redirecciones
16. Casos reales
17. Buenas prácticas
18. Errores comunes
19. Seguridad
20. Debugging
21. Resumen final

---

# 🌍 ¿QUÉ ES `LOCATION`?

`location` es un objeto que contiene información sobre la URL actual del navegador.

Permite:

✅ leer URLs  
✅ redireccionar páginas  
✅ detectar rutas  
✅ obtener dominio  
✅ conocer protocolo  
✅ navegar entre páginas  

---

# 🧠 RELACIÓN CON `WINDOW`

`location` pertenece al objeto:

```js
window
```

---

# ✅ Ejemplo

```js
console.log(window.location)
```

---

# 📌 También puede escribirse así

```js
console.log(location)
```

Porque `window` es el objeto global del navegador.

---

# 🌐 ANATOMÍA DE UNA URL

Supongamos esta URL:

```txt
https://www.google.com:8080/search?q=js#p1
```

---

# 🧠 DESCOMPOSICIÓN

```txt
https: // www.google.com : 8080 /search ?q=js #p1
  │            │           │      │      │     │
  │            │           │      │      │     └── hash
  │            │           │      │      └──────── search
  │            │           │      └─────────────── pathname
  │            │           └────────────────────── port
  │            └────────────────────────────────── hostname
  └─────────────────────────────────────────────── protocol
```

---

# 📦 ESTRUCTURA DEL OBJETO LOCATION

```txt
window.location
 ├── href
 ├── hostname
 ├── host
 ├── pathname
 ├── protocol
 ├── port
 ├── origin
 ├── search
 ├── hash
 ├── assign()
 ├── replace()
 └── reload()
```

---

# 🔗 `window.location.href`

Devuelve la URL completa actual.

---

# ✅ Ejemplo

```js
console.log(window.location.href)
```

---

# 🧠 RESULTADO

```txt
https://www.google.com/search/images
```

---

# 📌 ¿QUÉ RETORNA?

Toda la dirección completa de la página.

---

# 🚀 CASO REAL

---

# ✅ Mostrar URL actual

```js
const url = window.location.href

console.log(url)
```

---

# 🚀 REDIRECCIÓN USANDO `href`

---

# ✅ Cambiar página

```js
window.location.href = "https://youtube.com"
```

---

# 🧠 ¿QUÉ OCURRE?

```txt
Página actual
       ↓
Cambio de href
       ↓
Nueva página
```

---

# ⚠️ IMPORTANTE

Esto recarga completamente el navegador.

---

# 🌍 `window.location.hostname`

Devuelve el dominio del sitio.

---

# ✅ Ejemplo

```js
console.log(window.location.hostname)
```

---

# 🧠 RESULTADO

```txt
www.google.com
```

---

# 📌 ¿QUÉ ES EL HOSTNAME?

El nombre del dominio.

---

# 🧠 VISUAL

```txt
https://www.google.com/search

        ↑
     hostname
```

---

# 🚀 CASO REAL

---

# ✅ Detectar dominio

```js
if(window.location.hostname === "localhost"){

    console.log("Entorno local")

}
```

---

# 🔥 Otro ejemplo

```js
console.log(`Dominio: ${location.hostname}`)
```

---

# 📂 `window.location.pathname`

Devuelve la ruta de la página.

---

# ✅ Ejemplo

```js
console.log(window.location.pathname)
```

---

# 🧠 RESULTADO

```txt
/search/images
```

---

# 🧠 VISUAL

```txt
https://google.com/search/images

                    ↑
                 pathname
```

---

# 📌 ¿PARA QUÉ SIRVE?

Para detectar páginas específicas.

---

# 🚀 CASO REAL

---

# ✅ Detectar sección actual

```js
if(location.pathname === "/admin"){

    console.log("Panel administrador")

}
```

---

# ✅ Sistema de rutas simple

```js
switch(location.pathname){

    case "/":
        console.log("Inicio")
        break

    case "/contacto":
        console.log("Contacto")
        break

}
```

---

# 🔒 `window.location.protocol`

Devuelve el protocolo usado.

---

# ✅ Ejemplo

```js
console.log(window.location.protocol)
```

---

# 🧠 RESULTADO

```txt
https:
```

---

# 📌 POSIBLES VALORES

| Protocolo | Significado |
| --- | --- |
| http: | conexión normal |
| https: | conexión segura |
| file: | archivo local |

---

# 🧠 VISUAL

```txt
https://google.com

↑
protocol
```

---

# 🚀 CASO REAL

---

# ✅ Detectar HTTPS

```js
if(location.protocol === "https:"){

    console.log("Conexión segura")

}
```

---

# 🚨 IMPORTANCIA DE HTTPS

HTTPS protege:

✅ contraseñas  
✅ datos  
✅ sesiones  
✅ formularios  

---

# 🔄 `window.location.assign()`

Carga una nueva página.

---

# ✅ Sintaxis

```js
window.location.assign(url)
```

---

# ✅ Ejemplo

```js
window.location.assign("https://youtube.com")
```

---

# 🧠 ¿QUÉ OCURRE?

```txt
Página actual
      ↓
assign()
      ↓
Nueva página
```

---

# 📌 DIFERENCIA ENTRE `href` Y `assign()`

---

# ✅ Ambos redireccionan

```js
location.href = "https://google.com"
```

```js
location.assign("https://google.com")
```

---

# 🧠 DIFERENCIA PRINCIPAL

`assign()` es un método.

`href` es una propiedad.

---

# 📊 COMPARACIÓN

| Método | Tipo |
| --- | --- |
| href | propiedad |
| assign() | método |

---

# 🚀 CASOS REALES

---

# ✅ Sistema login

```js
if(usuarioLogueado){

    location.assign("/dashboard")

}
```

---

# ✅ Redirección automática

```js
setTimeout(() => {

    location.href = "/inicio"

}, 3000)
```

---

# ✅ Detectar entorno desarrollo

```js
if(location.hostname === "localhost"){

    console.log("Modo desarrollo")

}
```

---

# ✅ Detectar protocolo inseguro

```js
if(location.protocol === "http:"){

    console.log("Sitio inseguro")

}
```

---

# 🚨 ERRORES COMUNES

---

# ❌ Confundir hostname con href

---

# ✅ Incorrecto

```js
console.log(location.href)
```

Devuelve TODO.

---

# ✅ Correcto

```js
console.log(location.hostname)
```

Devuelve solo dominio.

---

# ❌ Olvidar que assign recarga

```js
location.assign("/home")
```

La página se recarga completamente.

---

# ❌ Comparar pathname incorrectamente

---

# 🚫 Incorrecto

```js
if(location.pathname === "admin")
```

---

# ✅ Correcto

```js
if(location.pathname === "/admin")
```

---

# 🔍 DEBUGGING

---

# ✅ Ver objeto completo

```js
console.log(location)
```

---

# ✅ Ver URL actual

```js
console.log(location.href)
```

---

# ✅ Ver dominio

```js
console.log(location.hostname)
```

---

# ✅ Ver ruta

```js
console.log(location.pathname)
```

---

# ✅ Ver protocolo

```js
console.log(location.protocol)
```

---

# 🧠 INSPECCIÓN COMPLETA

```js
console.dir(location)
```

---

# 🏆 BUENAS PRÁCTICAS

---

# ✅ Usar HTTPS

Siempre que sea posible.

---

# ✅ Validar rutas

Antes de redireccionar.

---

# ✅ Evitar redirecciones infinitas

---

# ❌ Malo

```js
location.href = "/home"
```

en cada carga.

---

# ✅ Usar pathname para rutas

Muy útil en SPA y routing.

---

# ✅ Mantener URLs limpias

Buenas URLs ayudan al SEO y organización.

---

# 🌎 FLUJO COMPLETO

```txt
Usuario entra a URL
           ↓
location obtiene información
           ↓
JavaScript analiza ruta
           ↓
Se ejecuta lógica específica
```

---

# 🧪 EJERCICIOS

---

# ✅ Ejercicio 1

Mostrar la URL actual en pantalla.

---

# ✅ Ejercicio 2

Detectar si el usuario está en HTTPS.

---

# ✅ Ejercicio 3

Crear una redirección automática después de 5 segundos.

---

# 💡 PISTA

```js
setTimeout()
```

---

# ✅ Ejercicio 4

Detectar si el usuario está en `/admin`.

---

# 🧠 RESUMEN FINAL

| Propiedad/Método | Función |
| --- | --- |
| href | URL completa |
| hostname | dominio |
| pathname | ruta |
| protocol | protocolo |
| assign() | redireccionar |

---

# 🏆 CONCLUSIÓN

El objeto `location` es una de las herramientas más importantes del navegador.

Permite:

✅ navegar  
✅ detectar páginas  
✅ controlar rutas  
✅ manejar redirecciones  
✅ trabajar con URLs  

Es fundamental para:

🔥 aplicaciones web  
🔥 routing  
🔥 autenticación  
🔥 dashboards  
🔥 SPAs  
🔥 navegación dinámica