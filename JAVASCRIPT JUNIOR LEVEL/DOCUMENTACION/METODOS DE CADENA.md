# 📘 GUÍA DEFINITIVA DE MÉTODOS DE CADENA EN JAVASCRIPT

## 🔥 NIVEL DIOS PRO EXTREMO (MEJORADO)

---

# 📌 1. LISTA COMPLETA DE MÉTODOS

## 🔍 BÚSQUEDA

* `includes()`
* `indexOf()`
* `lastIndexOf()`
* `startsWith()`
* `endsWith()`
* `search()`
* `match()`
* `matchAll()`

## ✂️ EXTRACCIÓN

* `slice()`
* `substring()`
* `substr()` ⚠️

## 🔄 REEMPLAZO

* `replace()`
* `replaceAll()`

## 🔤 TRANSFORMACIÓN

* `toUpperCase()`
* `toLowerCase()`
* `trim()`
* `trimStart()`
* `trimEnd()`
* `normalize()`

## 📦 DIVISIÓN Y UNIÓN

* `split()`
* `concat()`

## 🔢 ACCESO

* `charAt()`
* `charCodeAt()`
* `at()`

## 🧪 OTROS

* `repeat()`
* `padStart()`
* `padEnd()`
* `localeCompare()`

---

# 🧠 2. EXPLICACIÓN UNO A UNO

---

# 🔍 includes()

## 📌 Función

👉 Verifica si un texto contiene otro texto

## 🌍 Ejemplo (tienda 🛒)

```js
// FUNCIÓN: Buscar si un producto es de cierta marca
let producto = "Camisa Nike";
producto.includes("Nike"); // true
```

---

# 🔍 indexOf()

## 📌 Función

👉 Devuelve la posición donde inicia un texto

```js
// FUNCIÓN: Encontrar posición de una parte del texto
"carro".indexOf("rr") // 2
```

---

# 🔍 lastIndexOf()

## 📌 Función

👉 Busca desde el final

```js
// FUNCIÓN: Encontrar la última aparición
"banana".lastIndexOf("a") // 5
```

---

# 🔍 startsWith()

## 📌 Función

👉 Verifica cómo inicia un texto

```js
// FUNCIÓN: Validar inicio de texto
"perro negro".startsWith("perro")
```

---

# 🔍 endsWith()

## 📌 Función

👉 Verifica cómo termina un texto

```js
// FUNCIÓN: Validar tipo de archivo
"foto.png".endsWith(".png")
```

---

# 🔍 search()

## 📌 Función

👉 Buscar usando expresiones regulares

```js
// FUNCIÓN: Buscar patrón dentro del texto
"hola mundo".search("mundo")
```

---

# 🔍 match()

## 📌 Función

👉 Obtener coincidencias

```js
// FUNCIÓN: Extraer palabras repetidas
"hola hola".match(/hola/g)
```

---

# ✂️ slice()

## 📌 Función

👉 Extraer una parte del texto

```js
// FUNCIÓN: Cortar texto (animal 🐶)
let animal = "perrito";
animal.slice(0, 4) // "perr"
```

---

# ✂️ substring()

## 📌 Función

👉 Extraer texto sin negativos

```js
// FUNCIÓN: Cortar texto básico
"javascript".substring(0,4)
```

---

# 🔄 replace()

## 📌 Función

👉 Reemplazar una parte del texto

```js
// FUNCIÓN: Cambiar palabra
"perro grande".replace("perro", "gato")
```

---

# 🔄 replaceAll()

## 📌 Función

👉 Reemplazar todas las coincidencias

```js
// FUNCIÓN: Reemplazar múltiples palabras
"perro perro".replaceAll("perro", "gato")
```

---

# 🔤 toUpperCase()

## 📌 Función

👉 Convertir a mayúsculas

```js
// FUNCIÓN: Normalizar texto
"hola".toUpperCase()
```

---

# 🔤 toLowerCase()

## 📌 Función

👉 Convertir a minúsculas

```js
// FUNCIÓN: Comparaciones sin error
"HOLA".toLowerCase()
```

---

# 🔤 trim()

## 📌 Función

👉 Eliminar espacios

```js
// FUNCIÓN: Limpiar datos
"  gato  ".trim()
```

---

# 📦 split()

## 📌 Función

👉 Convertir string a array

```js
// FUNCIÓN: Separar lista (frutas 🍎)
"manzana,pera,uvas".split(",")
```

---

# 📦 concat()

## 📌 Función

👉 Unir textos

```js
// FUNCIÓN: Unir palabras
"hola".concat(" mundo")
```

---

# 🔢 charAt()

## 📌 Función

👉 Obtener un carácter por posición

```js
// FUNCIÓN: Obtener letra
"gato".charAt(0)
```

---

# 🔢 at()

## 📌 Función

👉 Acceder desde el final

```js
// FUNCIÓN: Obtener último carácter
"gato".at(-1)
```

---

# 🧪 repeat()

## 📌 Función

👉 Repetir texto

```js
// FUNCIÓN: Generar patrón
"ha".repeat(3)
```

---

# 🧪 padStart()

## 📌 Función

👉 Rellenar al inicio

```js
// FUNCIÓN: Formatear números
"5".padStart(3, "0") // 005
```

---

# 🧱 3. PATRÓN PROFESIONAL

```js
// FUNCIÓN: Normalizar texto antes de usarlo
let limpio = texto.trim().toLowerCase();
```

---

# 🐞 4. DEBUGGING

```js
// FUNCIÓN: Evitar errores con undefined
if (texto && texto.includes("hola"))
```

---

# ⚠️ 5. ERRORES COMUNES

* No validar valores
* Pensar que modifican el original
* No limpiar datos

---

# ⚡ 6. OPTIMIZACIÓN

```js
// FUNCIÓN: Evitar cálculos repetidos
let limpio = texto.trim();
```

---

# 🧩 7. EJERCICIOS

1. Validar un email
2. Limpiar un nombre
3. Separar productos

---

# 🧾 8. RESUMEN FINAL

* includes → buscar
* slice → cortar
* replace → cambiar
* split → dividir
* trim → limpiar

---

# 🔥 CONCLUSIÓN

Ahora no solo sabes los métodos…
👉 Sabes exactamente **para qué sirve cada uno en la vida real** 🚀
