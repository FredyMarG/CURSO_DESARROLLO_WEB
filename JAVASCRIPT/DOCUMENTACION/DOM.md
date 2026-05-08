# 🌳 GUÍA DEFINITIVA DEL DOM EN JAVASCRIPT

# 📚 TEMARIO GENERAL

## 🧠 ¿Qué encontrarás en esta guía?

Esta guía está diseñada para aprender el DOM desde cero hasta un nivel profesional 🚀

Incluye:

✅ Explicaciones claras
✅ Diagramas visuales
✅ Ejemplos prácticos
✅ Analogías fáciles
✅ Flujo visual del DOM
✅ Buenas prácticas
✅ Errores comunes
✅ Explicaciones para desarrolladores junior

---

# 📑 TEMARIO

## 1️⃣ Introducción al DOM

* ¿Qué es el DOM?
* Cómo funciona
* Representación visual
* Árbol DOM
* Relación entre HTML y JavaScript

---

## 2️⃣ Métodos de selección de elementos

* getElementById()
* querySelector()
* querySelectorAll()
* getElementsByClassName()
* getElementsByTagName()

---

## 3️⃣ Métodos de atributos

* getAttribute()
* setAttribute()
* removeAttribute()

---

## 4️⃣ Atributos globales

* id
* class
* title
* hidden
* contenteditable

---

## 5️⃣ Atributos de inputs

* value
* placeholder
* required
* disabled
* type

---

## 6️⃣ Propiedad Style

* style.color
* style.backgroundColor
* style.fontSize
* Modificación dinámica de estilos

---

## 7️⃣ Clases y classList

* classList.add()
* classList.remove()
* classList.toggle()
* classList.contains()

---

## 8️⃣ Obtención y modificación de elementos

* textContent
* innerText
* innerHTML
* Diferencias importantes

---

## 9️⃣ Creación de elementos

* createElement()
* createTextNode()
* appendChild()
* append()
* prepend()
* insertBefore()
* cloneNode()
* remove()
* replaceWith()
* createDocumentFragment()

---

## 🔟 Obtención y modificación de Childs (Hijos)

* firstChild
* lastChild
* firstElementChild
* lastElementChild
* childNodes
* children

---

## 1️⃣1️⃣ Métodos de Childs

* appendChild()
* replaceChild()
* removeChild()
* hasChildNodes()

---

## 1️⃣2️⃣ Propiedades de Parents (Padres)

* parentElement
* Relación padre e hijo

---

## 1️⃣3️⃣ Propiedades de Siblings (Hermanos)

* nextElementSibling
* previousElementSibling

---

## 1️⃣4️⃣ Nodos

* nodeName
* nodeType
* childNodes
* Tipos de nodos
* Textos y comentarios

---

## 1️⃣5️⃣ Buenas prácticas

* Organización
* Optimización
* Errores comunes
* Recomendaciones profesionales

---

## 1️⃣6️⃣ Mini proyectos prácticos

* Lista dinámica
* Creación de elementos
* Manipulación del DOM

---

## 1️⃣7️⃣ Resumen final

* Conceptos importantes
* Diferencias clave
* Flujo mental del DOM

---

## Nivel Niño de 8 años + Nivel PRO EXTREMO 🚀

---

# 📖 ¿Qué es el DOM?

DOM significa:

> **Document Object Model**

Pero tranquilo 😎...

Imagina que una página web es como una **casa LEGO** 🧱.

Cada cosa dentro de la página es una pieza:

* Un título 📝
* Un botón 🔘
* Una imagen 🖼️
* Un input 📥
* Un párrafo 📄

JavaScript usa el DOM para:

✅ Encontrar elementos
✅ Cambiar colores
✅ Modificar textos
✅ Crear elementos nuevos
✅ Eliminar elementos
✅ Mover cosas
✅ Escuchar eventos

---

# 🧠 REPRESENTACIÓN VISUAL DEL DOM

```txt
📄 document
│
├── 🧱 html
│   │
│   ├── 🧱 head
│   │
│   └── 🧱 body
│       │
│       ├── 📝 h1
│       ├── 📄 p
│       ├── 🔘 button
│       └── 📦 div
│           ├── 📄 span
│           └── 🖼️ img
```

👉 Cada elemento es un "nodo".
👉 Todos están conectados como una familia.

---

# 🎯 MÉTODOS DE SELECCIÓN DE ELEMENTOS

Estos métodos sirven para:

> 🔎 Encontrar elementos dentro del HTML.

---

# 1️⃣ getElementById()

Busca un elemento por su ID.

## HTML

```html
<h1 id="titulo">Hola Mundo</h1>
```

## JavaScript

```js
const titulo = document.getElementById("titulo")

console.log(titulo)
```

---

# 🧠 EXPLICACIÓN PARA NIÑOS

Es como buscar una persona por su:

🪪 Cédula única.

El ID nunca debe repetirse.

---

# 2️⃣ querySelector()

Busca el PRIMER elemento que coincida.

```js
const elemento = document.querySelector("p")
```

---

# 🔥 También funciona con:

## Clase

```js
const caja = document.querySelector(".caja")
```

## ID

```js
const titulo = document.querySelector("#titulo")
```

---

# 3️⃣ querySelectorAll()

Busca TODOS los elementos.

```js
const parrafos = document.querySelectorAll("p")
```

---

# 📊 REPRESENTACIÓN

```txt
📄 Página
│
├── 📄 p
├── 📄 p
├── 📄 p
└── 📄 p
```

`querySelectorAll()` trae TODOS.

---

# 4️⃣ getElementsByClassName()

Busca elementos por clase.

```js
const cajas = document.getElementsByClassName("caja")
```

---

# 5️⃣ getElementsByTagName()

Busca por etiqueta.

```js
const divs = document.getElementsByTagName("div")
```

---

# ⚠️ ERROR COMÚN

❌ Esto da error:

```js
const titulo = document.getElementById("titulo")

tituloo.textContent = "Hola"
```

✅ Correcto:

```js
titulo.textContent = "Hola"
```

---

# 🧩 MÉTODOS DE ATRIBUTOS DE UN ELEMENTO

Los atributos son información extra.

Ejemplo:

```html
<img src="foto.png" alt="Foto">
```

Aquí:

* `src` → dirección de imagen
* `alt` → texto alternativo

---

# 1️⃣ getAttribute()

Obtiene un atributo.

```js
const imagen = document.querySelector("img")

console.log(imagen.getAttribute("src"))
```

---

# 2️⃣ setAttribute()

Cambia o crea atributos.

```js
imagen.setAttribute("src", "perro.png")
```

---

# 3️⃣ removeAttribute()

Elimina atributos.

```js
imagen.removeAttribute("alt")
```

---

# 📌 ATRIBUTOS GLOBALES

Son atributos que casi cualquier elemento puede tener.

---

# ⭐ id

Identificador único.

```html
<div id="caja"></div>
```

---

# ⭐ class

Sirve para agrupar elementos.

```html
<div class="rojo"></div>
```

---

# ⭐ title

Muestra un mensaje cuando pasas el mouse.

```html
<button title="Guardar">Guardar</button>
```

---

# ⭐ hidden

Oculta elementos.

```html
<p hidden>Oculto</p>
```

---

# ⭐ contenteditable

Permite editar texto.

```html
<div contenteditable="true">
  Puedes escribir aquí
</div>
```

---

# 📥 ATRIBUTOS DE INPUTS

Los inputs tienen atributos especiales.

---

# ⭐ value

Valor del input.

```html
<input value="Hola">
```

---

# ⭐ placeholder

Texto guía.

```html
<input placeholder="Escribe tu nombre">
```

---

# ⭐ required

Hace obligatorio el campo.

```html
<input required>
```

---

# ⭐ disabled

Desactiva el input.

```html
<input disabled>
```

---

# ⭐ type

Define el tipo.

```html
<input type="number">
```

---

# 🎨 PROPIEDAD STYLE

Sirve para cambiar estilos desde JavaScript.

---

# 🖍️ Cambiar color

```js
const titulo = document.querySelector("h1")

titulo.style.color = "red"
```

---

# 📦 Cambiar fondo

```js
titulo.style.backgroundColor = "yellow"
```

---

# 📏 Cambiar tamaño

```js
titulo.style.fontSize = "50px"
```

---

# 📊 REPRESENTACIÓN VISUAL

```txt
ANTES:
📝 Hola Mundo

DESPUÉS:
🟥 Hola Mundo
```

---

# ⚠️ ERROR COMÚN

❌ Incorrecto:

```js
style.color = red
```

✅ Correcto:

```js
titulo.style.color = "red"
```

---

# 🏷️ CLASES, classList Y SUS MÉTODOS

Las clases ayudan a organizar estilos.

---

# 📌 HTML

```html
<div class="caja"></div>
```

---

# 🧠 classList

Permite manipular clases.

---

# 1️⃣ add()

Agrega una clase.

```js
caja.classList.add("rojo")
```

---

# 2️⃣ remove()

Elimina clases.

```js
caja.classList.remove("rojo")
```

---

# 3️⃣ toggle()

Agrega o quita automáticamente.

```js
caja.classList.toggle("activo")
```

---

# 📊 REPRESENTACIÓN

```txt
Primer clic:
✅ activo agregado

Segundo clic:
❌ activo eliminado
```

---

# 4️⃣ contains()

Pregunta si existe una clase.

```js
console.log(caja.classList.contains("activo"))
```

---

# ✏️ OBTENCIÓN Y MODIFICACIÓN DE ELEMENTOS

---

# ⭐ textContent

Obtiene o cambia texto.

```js
titulo.textContent = "Hola Fredy"
```

---

# ⭐ innerText

Similar a textContent.

```js
titulo.innerText = "Hola"
```

---

# ⭐ innerHTML

Permite agregar HTML.

```js
caja.innerHTML = "<b>Hola</b>"
```

---

# ⚠️ DIFERENCIA IMPORTANTE

## textContent

```js
caja.textContent = "<b>Hola</b>"
```

Resultado:

```txt
<b>Hola</b>
```

---

## innerHTML

```js
caja.innerHTML = "<b>Hola</b>"
```

Resultado:

```txt
Hola (en negrita)
```

---

# 🧱 CREACIÓN DE ELEMENTOS

Crear elementos significa:

> ✨ Construir HTML usando JavaScript.

Es como usar LEGO 🧱.

JavaScript puede crear:

✅ Botones
✅ Divs
✅ Inputs
✅ Tarjetas
✅ Listas
✅ Imágenes
✅ Tablas
✅ Dashboards

---

# 🧠 ¿POR QUÉ ES IMPORTANTE?

Porque las páginas modernas NO tienen todo escrito en HTML.

Muchas cosas se crean dinámicamente.

Ejemplos reales:

```txt
📱 Instagram crea publicaciones
🛒 Amazon crea productos
💬 WhatsApp crea mensajes
🎮 Juegos crean enemigos
📊 Dashboards crean tarjetas
```

Todo eso usa DOM.

---

# 🌳 ESTRUCTURA MENTAL

```txt
JavaScript
    ↓
Crea elementos
    ↓
Modifica elementos
    ↓
Los agrega al DOM
    ↓
Aparecen en pantalla
```

---

# 1️⃣ createElement()

⚠️ IMPORTANTE:

El método correcto es:

```js
document.createElement()
```

❌ Mucha gente escribe:

```js
createElements()
```

Pero:

```txt
❌ NO EXISTE
```

Porque JavaScript crea:

```txt
1 elemento a la vez
```

---

## 📖 ¿Qué hace?

Crea elementos HTML desde JavaScript.

---

# 🧠 SINTAXIS

```js
const elemento = document.createElement("etiqueta")
```

---

# 📦 EJEMPLO SIMPLE

```js
const caja = document.createElement("div")
```

---

# 📊 ¿QUÉ PASÓ?

```txt
ANTES:
❌ No existe div

DESPUÉS:
✅ JavaScript creó un div
```

---

# ⚠️ IMPORTANTE

El elemento existe:

✅ En memoria

Pero todavía:

❌ NO aparece en pantalla

---

# 🧠 ANALOGÍA PARA NIÑOS

Es como construir un juguete:

```txt
🧱 createElement()
= construir la pieza

📺 appendChild()
= ponerla en pantalla
```

---

# 🟢 CREAR UN BOTÓN

```js
const boton = document.createElement("button")
```

---

# 🟢 CREAR UN PÁRRAFO

```js
const parrafo = document.createElement("p")
```

---

# 🟢 CREAR UNA IMAGEN

```js
const imagen = document.createElement("img")
```

---

# 🟢 CREAR INPUT

```js
const input = document.createElement("input")
```

---

# 🎨 MODIFICAR EL ELEMENTO CREADO

Una vez creado podemos:

✅ Cambiar texto
✅ Cambiar color
✅ Agregar clases
✅ Agregar atributos

---

# ✏️ AGREGAR TEXTO

```js
const titulo = document.createElement("h1")

titulo.textContent = "Hola Mundo"
```

---

# 🎨 CAMBIAR ESTILOS

```js
titulo.style.color = "blue"
```

---

# 🏷️ AGREGAR CLASES

```js
titulo.classList.add("grande")
```

---

# 📌 AGREGAR ATRIBUTOS

```js
imagen.setAttribute("src", "foto.png")
```

---

# 📊 REPRESENTACIÓN VISUAL

```txt
🧱 createElement("button")
        ↓
🔘 Botón vacío
        ↓
textContent
        ↓
🔘 Guardar
        ↓
appendChild
        ↓
📺 Aparece en pantalla
```

---

# 2️⃣ createTextNode()

## 📖 ¿Qué hace?

Crea nodos de texto.

---

# 🧠 ¿Qué es un nodo de texto?

Es texto puro.

Ejemplo:

```html
<p>Hola</p>
```

Aquí:

```txt
📄 p → nodo elemento
📝 Hola → nodo texto
```

---

# 🟢 EJEMPLO

```js
const texto = document.createTextNode("Hola Fredy")
```

---

# 🧠 ¿POR QUÉ EXISTE?

Porque en el DOM:

```txt
TODO ES UN NODO
```

Incluso el texto.

---

# 🧩 UNIR TEXTO CON ELEMENTOS

```js
const boton = document.createElement("button")

const texto = document.createTextNode("Enviar")

boton.appendChild(texto)
```

---

# 📊 REPRESENTACIÓN

```txt
🔘 button vacío
        ↓
📝 "Enviar"
        ↓
🔘 Enviar
```

---

# ⚠️ HOY EN DÍA

Normalmente usamos:

```js
textContent
```

Porque es más simple.

---

# 3️⃣ appendChild()

## 📖 ¿Qué hace?

Agrega un hijo dentro de otro elemento.

---

# 🧠 EJEMPLO VISUAL

```txt
📦 div
└── 🔘 button
```

El botón es hijo del div.

---

# 🟢 EJEMPLO

```js
const div = document.createElement("div")

const boton = document.createElement("button")

boton.textContent = "Click"

div.appendChild(boton)
```

---

# 📊 RESULTADO

```html
<div>
  <button>Click</button>
</div>
```

---

# ⚠️ IMPORTANTE

appendChild():

✅ Agrega
✅ Mueve
✅ Reorganiza elementos

---

# 🧠 DATO IMPORTANTE

Un elemento NO puede existir en dos lugares.

---

# ❌ Esto NO duplica

```js
padre1.appendChild(hijo)
padre2.appendChild(hijo)
```

---

# 📊 RESULTADO

```txt
❌ Sale de padre1
✅ Va a padre2
```

---

# 4️⃣ append()

Parecido a appendChild().

Pero:

✅ Puede agregar texto
✅ Puede agregar varios elementos

---

# 🟢 EJEMPLO

```js
div.append("Hola")
```

---

# 🟢 VARIOS ELEMENTOS

```js
div.append(boton, parrafo)
```

---

# ⚠️ DIFERENCIA

| appendChild | append        |
| ----------- | ------------- |
| Solo 1 nodo | Varios        |
| Solo nodos  | Texto y nodos |
| Más antiguo | Más moderno   |

---

# 5️⃣ prepend()

Agrega elementos AL INICIO.

---

# 🟢 EJEMPLO

```js
lista.prepend(nuevoElemento)
```

---

# 📊 REPRESENTACIÓN

```txt
ANTES:
1️⃣
2️⃣
3️⃣

DESPUÉS:
🆕
1️⃣
2️⃣
3️⃣
```

---

# 6️⃣ insertBefore()

Inserta antes de otro elemento.

---

# 🟢 EJEMPLO

```js
padre.insertBefore(nuevo, referencia)
```

---

# 📊 REPRESENTACIÓN

```txt
ANTES:
A
B

DESPUÉS:
A
🆕
B
```

---

# 7️⃣ cloneNode()

Clona elementos.

---

# 🟢 EJEMPLO

```js
const copia = elemento.cloneNode(true)
```

---

# 🧠 ¿Qué significa true?

```txt
true = copiar hijos también
false = copiar solo el elemento
```

---

# 📊 REPRESENTACIÓN

```txt
📄 Original
        ↓
📄 Copia exacta
```

---

# 8️⃣ remove()

Elimina elementos.

---

# 🟢 EJEMPLO

```js
boton.remove()
```

---

# 📊 RESULTADO

```txt
❌ El botón desaparece
```

---

# 9️⃣ replaceWith()

Reemplaza elementos.

---

# 🟢 EJEMPLO

```js
viejo.replaceWith(nuevo)
```

---

# 📊 REPRESENTACIÓN

```txt
ANTES:
🔴 Viejo

DESPUÉS:
🟢 Nuevo
```

---

# 🔥 CREACIÓN DINÁMICA COMPLETA

## 🎯 Crear tarjeta de usuario

---

# 🟢 JavaScript

```js
const tarjeta = document.createElement("div")

const nombre = document.createElement("h2")

const descripcion = document.createElement("p")

nombre.textContent = "Fredy"

descripcion.textContent = "Desarrollador"

tarjeta.classList.add("card")

tarjeta.append(nombre, descripcion)

document.body.appendChild(tarjeta)
```

---

# 📊 RESULTADO VISUAL

```txt
📦 TARJETA
├── 👤 Fredy
└── 💻 Desarrollador
```

---

# 🚀 createDocumentFragment()

## 📖 ¿Qué hace?

Crea un contenedor invisible.

---

# 🧠 ¿PARA QUÉ SIRVE?

Sirve para:

✅ Mejorar rendimiento
✅ Evitar renderizados innecesarios
✅ Agregar MUCHOS elementos rápido

---

# 📊 REPRESENTACIÓN

```txt
JavaScript
    ↓
📦 Fragmento invisible
    ↓
Agrega MUCHOS elementos
    ↓
Se inserta TODO junto
    ↓
🚀 Más rápido
```

---

# ❌ SIN FRAGMENT

```txt
Agregar elemento
🔄 Re-render

Agregar elemento
🔄 Re-render

Agregar elemento
🔄 Re-render
```

Muy lento 😵

---

# ✅ CON FRAGMENT

```txt
Agregar TODO al fragment
        ↓
1 SOLO renderizado
        ↓
🚀 Más rápido
```

---

# 🟢 EJEMPLO PROFESIONAL

```js
const fragmento = document.createDocumentFragment()

for(let i = 1; i <= 5; i++){

  const li = document.createElement("li")

  li.textContent = `Elemento ${i}`

  fragmento.appendChild(li)
}

lista.appendChild(fragmento)
```

---

# 📊 RESULTADO

```txt
• Elemento 1
• Elemento 2
• Elemento 3
• Elemento 4
• Elemento 5
```

---

# 🧠 ¿QUÉ HICIMOS?

```txt
1️⃣ Creamos fragmento
2️⃣ Creamos elementos
3️⃣ Los guardamos en el fragmento
4️⃣ Insertamos TODO al final
```

---

# ⚠️ ERRORES COMUNES

---

# ❌ Olvidar appendChild()

```js
const boton = document.createElement("button")
```

El botón NO aparecerá.

---

# ❌ Usar innerHTML innecesariamente

A veces:

```js
createElement()
```

es más seguro.

---

# ❌ Crear MUCHOS elementos sin fragment

Puede volver lenta la página.

---

# 🚀 BUENAS PRÁCTICAS

✅ Reutilizar elementos

✅ Usar fragmentos

✅ Usar classList

✅ Separar lógica y estilos

✅ Evitar exceso de innerHTML

---

# 🧠 RESUMEN VISUAL

```txt
createElement()
    ↓
Crea HTML

textContent
    ↓
Agrega texto

classList
    ↓
Agrega clases

style
    ↓
Agrega estilos

appendChild()
    ↓
Lo muestra en pantalla
```

---

# 👶 OBTENCIÓN Y MODIFICACIÓN DE CHILDS (HIJOS)

## 🧠 SUPER AYUDA

Cuando hablamos de:

```txt
Childs = Hijos 👶
```

Nos referimos a:

> 📦 Elementos que están DENTRO de otro elemento.

---

# 🌳 ESTRUCTURA VISUAL

```html
<div class="contenedor">

  <h1>Título</h1>

  <p>Párrafo</p>

  <button>Click</button>

</div>
```

---

# 📊 REPRESENTACIÓN DOM

```txt
📦 div.contenedor
├── 📝 h1
├── 📄 p
└── 🔘 button
```

---

# 🧠 ¿QUIÉN ES QUIÉN?

| Elemento | Rol      |
| -------- | -------- |
| div      | 👨 Padre |
| h1       | 👶 Hijo  |
| p        | 👶 Hijo  |
| button   | 👶 Hijo  |

---

# 🚀 ¿PARA QUÉ SIRVE ESTO?

Gracias a los childs podemos:

✅ Obtener elementos internos
✅ Modificar contenido
✅ Crear menús
✅ Crear listas dinámicas
✅ Crear tarjetas
✅ Crear dashboards
✅ Recorrer estructuras HTML

---

# ⚠️ MUY IMPORTANTE

En el DOM existen:

```txt
🧱 Elementos HTML
📝 Textos
💬 Comentarios
```

Algunos métodos toman TODO.

Otros SOLO elementos HTML.

Y aquí es donde muchos se confunden 😵.

---

# 1️⃣ firstChild

## 📖 ¿Qué hace?

Obtiene el PRIMER nodo hijo.

---

# ⚠️ IMPORTANTE

firstChild:

✅ Puede traer texto
✅ Puede traer comentarios
✅ Puede traer espacios
✅ Puede traer elementos HTML

---

# 🧠 EJEMPLO

```html
<div>

  <p>Hola</p>

</div>
```

---

# JavaScript

```js
const div = document.querySelector("div")

console.log(div.firstChild)
```

---

# 📊 RESULTADO REAL

Muchas veces:

```txt
📝 #text
```

---

# 😱 ¿POR QUÉ?

Porque:

```txt
Los saltos de línea y espacios
TAMBIÉN SON NODOS
```

---

# 🌳 REPRESENTACIÓN REAL

```txt
📦 div
├── 📝 salto de línea
├── 📄 p
└── 📝 salto de línea
```

---

# ⚠️ ERROR MUY COMÚN

La gente cree:

```txt
firstChild = primer elemento HTML
```

Pero:

```txt
❌ NO SIEMPRE
```

---

# 🧠 SUPER CONSEJO

Si quieres SOLO HTML:

✅ Usa:

```js
firstElementChild
```

---

# 2️⃣ lastChild

## 📖 ¿Qué hace?

Obtiene el ÚLTIMO nodo hijo.

---

# 🟢 EJEMPLO

```js
console.log(div.lastChild)
```

---

# ⚠️ IMPORTANTE

También puede devolver:

```txt
📝 Texto
💬 Comentarios
📄 Elementos
```

---

# 📊 REPRESENTACIÓN

```txt
📦 div
├── 📄 p
├── 🔘 button
└── 📝 salto de línea
```

---

# Resultado

```txt
📝 #text
```

---

# 🧠 DIFERENCIA MENTAL

| Propiedad  | Qué obtiene |
| ---------- | ----------- |
| firstChild | Primer nodo |
| lastChild  | Último nodo |

---

# 3️⃣ firstElementChild

## 📖 ¿Qué hace?

Obtiene el PRIMER elemento HTML.

---

# 🧠 SUPER AYUDA

A diferencia de firstChild:

```txt
✅ IGNORA textos
✅ IGNORA espacios
✅ IGNORA comentarios
```

---

# 🟢 EJEMPLO

```js
console.log(div.firstElementChild)
```

---

# 📊 RESULTADO

```txt
📄 <p>
```

---

# 🌳 REPRESENTACIÓN

```txt
📦 div
├── 📝 salto línea
├── 📄 p
├── 🔘 button
└── 📝 salto línea
```

---

# Resultado

```txt
📄 p
```

---

# 🚀 ¿POR QUÉ ES TAN USADO?

Porque normalmente queremos:

```txt
Elementos HTML reales
```

Y NO:

```txt
Saltos de línea raros 😵
```

---

# 4️⃣ lastElementChild

## 📖 ¿Qué hace?

Obtiene el ÚLTIMO elemento HTML.

---

# 🟢 EJEMPLO

```js
console.log(div.lastElementChild)
```

---

# 📊 RESULTADO

```txt
🔘 button
```

---

# 🌳 REPRESENTACIÓN

```txt
📦 div
├── 📄 p
├── 🔘 button
└── 📝 salto línea
```

---

# Resultado

```txt
🔘 button
```

---

# 🧠 DIFERENCIA IMPORTANTE

| Propiedad         | Incluye textos | Solo HTML |
| ----------------- | -------------- | --------- |
| firstChild        | ✅              | ❌         |
| firstElementChild | ❌              | ✅         |
| lastChild         | ✅              | ❌         |
| lastElementChild  | ❌              | ✅         |

---

# 5️⃣ childNodes

## 📖 ¿Qué hace?

Obtiene TODOS los nodos hijos.

---

# 🧠 ¿Qué significa TODOS?

```txt
✅ Elementos HTML
✅ Textos
✅ Comentarios
✅ Saltos de línea
```

---

# 🟢 EJEMPLO

```js
console.log(div.childNodes)
```

---

# 📊 REPRESENTACIÓN REAL

```txt
📦 div
├── 📝 salto línea
├── 📄 p
├── 📝 texto
├── 🔘 button
└── 💬 comentario
```

---

# Resultado

```txt
NodeList(5)
```

---

# 🧠 ¿QUÉ DEVUELVE?

Devuelve:

```txt
📦 NodeList
```

---

# 🚀 ¿QUÉ ES NodeList?

Es una colección de nodos.

Parecida a un array.

---

# 🟢 RECORRER childNodes

```js
const hijos = div.childNodes

hijos.forEach(hijo => {

  console.log(hijo)
})
```

---

# ⚠️ PROBLEMA COMÚN

Muchos nodos serán:

```txt
📝 #text
```

---

# 🧠 ¿POR QUÉ?

Porque el DOM cuenta:

```txt
Espacios y saltos de línea
```

---

# 6️⃣ children

## 📖 ¿Qué hace?

Obtiene SOLO elementos HTML hijos.

---

# 🧠 SUPER AYUDA

children es:

```txt
La versión limpia de childNodes 😎
```

---

# 🟢 EJEMPLO

```js
console.log(div.children)
```

---

# 📊 RESULTADO

```txt
HTMLCollection(2)
```

---

# 🌳 REPRESENTACIÓN

```txt
📦 div
├── 📝 salto línea
├── 📄 p
├── 🔘 button
└── 💬 comentario
```

---

# Resultado real

```txt
📄 p
🔘 button
```

---

# 🚀 ¿POR QUÉ ES TAN USADO?

Porque normalmente queremos:

✅ Elementos HTML

Y NO:

❌ Textos
❌ Comentarios
❌ Saltos de línea

---

# ⚠️ DIFERENCIA MÁS IMPORTANTE DEL DOM

| Propiedad  | Devuelve        |
| ---------- | --------------- |
| childNodes | TODOS los nodos |
| children   | SOLO HTML       |

---

# 🧠 EJEMPLO VISUAL DEFINITIVO

## HTML

```html
<div>

  Hola

  <p>Texto</p>

  <!-- comentario -->

</div>
```

---

# 🌳 DOM REAL

```txt
📦 div
├── 📝 "Hola"
├── 📄 p
└── 💬 comentario
```

---

# childNodes

```txt
📝 Texto
📄 p
💬 Comentario
```

---

# children

```txt
📄 p
```

---

# 🚀 CASOS REALES

## 📱 Instagram

Usa children para:

✅ Obtener publicaciones
✅ Obtener comentarios
✅ Obtener historias

---

## 🛒 Amazon

Usa children para:

✅ Obtener productos
✅ Obtener tarjetas
✅ Obtener imágenes

---

## 🎮 Juegos

Usan childNodes para:

✅ Recorrer nodos
✅ Analizar estructuras

---

# ⚠️ ERRORES COMUNES

---

# ❌ Confundir childNodes y children

---

# ❌ Usar firstChild esperando HTML

Muchas veces devuelve:

```txt
#text
```

---

# ❌ Pensar que los espacios NO existen

Para el DOM:

```txt
Los espacios también son nodos 😵
```

---

# 🚀 BUENAS PRÁCTICAS

✅ Usar firstElementChild

✅ Usar lastElementChild

✅ Usar children cuando quieras HTML

✅ Usar childNodes cuando necesites TODO

---

# 🧠 RESUMEN VISUAL

```txt
children
    ↓
SOLO HTML

childNodes
    ↓
TODO

firstElementChild
    ↓
Primer HTML

lastElementChild
    ↓
Último HTML
```

---

# 🧩 MÉTODOS DE CHILDS (HIJOS)

---

# ⭐ appendChild()

Agrega hijos.

```js
padre.appendChild(hijo)
```

---

# ⭐ replaceChild()

Reemplaza hijos.

```js
padre.replaceChild(nuevo, viejo)
```

---

# ⭐ removeChild()

Elimina hijos.

```js
padre.removeChild(hijo)
```

---

# ⭐ hasChildNodes()

Pregunta si tiene hijos.

```js
console.log(padre.hasChildNodes())
```

---

# 👨‍👦 PROPIEDADES DE PARENTS (PADRES)

---

# ⭐ parentElement

Obtiene el padre.

```js
console.log(hijo.parentElement)
```

---

# 📊 REPRESENTACIÓN

```txt
📦 div
└── 🔘 button
```

El padre del botón es el div.

---

# 👨‍👩‍👧 PROPIEDADES DE SIBLINGS (HERMANOS)

Siblings = hermanos.

---

# 📊 EJEMPLO

```txt
📦 div
├── 📄 p
├── 🔘 button
└── 🖼️ img
```

Todos son hermanos.

---

# ⭐ nextElementSibling

Hermano siguiente.

```js
console.log(parrafo.nextElementSibling)
```

---

# ⭐ previousElementSibling

Hermano anterior.

```js
console.log(boton.previousElementSibling)
```

---

# 🌐 NODOS

Todo en el DOM es un nodo.

---

# 📊 TIPOS DE NODOS

```txt
📄 Documento
🧱 Elementos HTML
📝 Textos
💬 Comentarios
```

---

# ⭐ nodeName

Nombre del nodo.

```js
console.log(elemento.nodeName)
```

---

# ⭐ nodeType

Tipo de nodo.

```js
console.log(elemento.nodeType)
```

---

# 📊 TIPOS IMPORTANTES

```txt
1 → Elemento
3 → Texto
8 → Comentario
9 → Documento
```

---

# ⭐ childNodes

Obtiene TODOS los nodos.

```js
console.log(caja.childNodes)
```

---

# ⚠️ DIFERENCIA IMPORTANTE

## children

Trae SOLO elementos HTML.

---

## childNodes

Trae:

✅ Textos
✅ Saltos de línea
✅ Comentarios
✅ Elementos

---

# 🧠 EJEMPLO VISUAL

```html
<div>
  Hola
  <p>Texto</p>
</div>
```

---

# children

```txt
📄 p
```

---

# childNodes

```txt
📝 Texto "Hola"
📄 p
📝 Saltos de línea
```

---

# 🚀 MINI PROYECTO COMPLETO

## 🎯 Objetivo

Crear una lista dinámica.

---

# 🧱 HTML

```html
<input type="text" id="input">
<button id="agregar">Agregar</button>
<ul id="lista"></ul>
```

---

# ⚡ JavaScript

```js
const input = document.getElementById("input")
const boton = document.getElementById("agregar")
const lista = document.getElementById("lista")

boton.addEventListener("click", () => {

  const li = document.createElement("li")

  li.textContent = input.value

  lista.appendChild(li)

  input.value = ""
})
```

---

# 📊 ¿QUÉ PASA?

```txt
1️⃣ El usuario escribe
2️⃣ Se crea un <li>
3️⃣ Se agrega a la lista
4️⃣ El input se limpia
```

---

# ⚠️ ERRORES COMUNES EN DOM

---

# ❌ No esperar que cargue HTML

```js
const titulo = document.querySelector("h1")
```

Si el HTML aún no existe:

💥 ERROR.

---

# ✅ Solución

Poner el script al final:

```html
<script src="app.js"></script>
</body>
```

---

# ❌ Confundir innerHTML y textContent

---

# ❌ Usar demasiados estilos inline

Mejor usar clases.

---

# 🚀 BUENAS PRÁCTICAS

✅ Usar nombres claros

```js
const botonGuardar = document.querySelector("button")
```

---

✅ Usar classList

---

✅ Separar CSS y JS

---

✅ Reutilizar funciones

---

# 🧠 RESUMEN FINAL

| Tema          | ¿Qué hace?             |
| ------------- | ---------------------- |
| DOM           | Controla la página web |
| querySelector | Busca elementos        |
| textContent   | Cambia texto           |
| innerHTML     | Inserta HTML           |
| style         | Cambia estilos         |
| classList     | Manipula clases        |
| createElement | Crea elementos         |
| appendChild   | Agrega hijos           |
| parentElement | Obtiene padre          |
| siblings      | Obtiene hermanos       |
| childNodes    | Obtiene nodos          |

---

# 🏆 CONCLUSIÓN

El DOM es:

```txt
🧠 El cerebro de la página
```

Gracias al DOM podemos:

✅ Crear interfaces dinámicas
✅ Hacer aplicaciones
✅ Modificar páginas en tiempo real
✅ Crear juegos
✅ Crear dashboards
✅ Crear redes sociales
✅ Crear aplicaciones modernas

---

# 🎮 RETOS PARA PRACTICAR

## 🟢 Fácil

1️⃣ Cambia el color de un título.

2️⃣ Cambia el texto de un botón.

3️⃣ Crea un párrafo desde JavaScript.

---

# 🟡 Medio

1️⃣ Crear una lista dinámica.

2️⃣ Crear modo oscuro.

3️⃣ Mostrar y ocultar elementos.

---

# 🔴 Difícil

1️⃣ Crear un TODO LIST.

2️⃣ Crear un mini chat.

3️⃣ Crear una calculadora.

---

# 📘 GUÍA RÁPIDA PARA DESARROLLADORES JUNIOR

## 🧠 Objetivo

Esta sección está diseñada para:

✅ Desarrolladores junior
✅ Personas que están aprendiendo DOM
✅ Tener definiciones claras y rápidas
✅ Entender visualmente cómo funciona el DOM

---

# 🌳 DOM (Document Object Model)

## 🧠 ¿Qué es el DOM?

El DOM es la representación de una página web en forma de árbol.

JavaScript usa el DOM para:

✅ Leer HTML
✅ Modificar HTML
✅ Crear elementos
✅ Eliminar elementos
✅ Cambiar estilos

---

# 📊 REPRESENTACIÓN VISUAL

```txt
📄 document
│
└── 🧱 html
    │
    └── 🧱 body
        │
        ├── 📝 h1
        ├── 📄 p
        └── 🔘 button
```

---

# 🔎 MÉTODOS DE SELECCIÓN

## 🧠 ¿Para qué sirven?

Permiten buscar elementos dentro del HTML.

---

# getElementById()

## 🧠 Descripción

Busca un elemento usando un ID único.

```js
const titulo = document.getElementById("titulo")
```

---

# querySelector()

## 🧠 Descripción

Busca el PRIMER elemento que coincida.

```js
document.querySelector(".card")
```

---

# querySelectorAll()

## 🧠 Descripción

Busca TODOS los elementos.

```js
document.querySelectorAll(".card")
```

---

# 🏷️ ATRIBUTOS

## 🧠 ¿Qué son?

Son propiedades extra de los elementos HTML.

---

# getAttribute()

## 🧠 Descripción

Obtiene un atributo.

```js
img.getAttribute("src")
```

---

# setAttribute()

## 🧠 Descripción

Agrega o modifica atributos.

```js
img.setAttribute("src", "foto.png")
```

---

# removeAttribute()

## 🧠 Descripción

Elimina atributos.

```js
input.removeAttribute("disabled")
```

---

# 🎨 STYLE

## 🧠 ¿Qué hace?

Permite cambiar CSS desde JavaScript.

---

# style.color

## 🧠 Cambia color texto

```js
titulo.style.color = "red"
```

---

# 🏷️ CLASSLIST

## 🧠 ¿Qué hace?

Permite manipular clases CSS.

---

# classList.add()

## 🧠 Agrega clases

```js
card.classList.add("activo")
```

---

# ✏️ MODIFICACIÓN DE ELEMENTOS

# textContent

## 🧠 Cambia texto puro

```js
titulo.textContent = "Hola"
```

---

# innerHTML

## 🧠 Inserta HTML real

```js
caja.innerHTML = "<b>Hola</b>"
```

---

# 🧱 CREACIÓN DE ELEMENTOS

# createElement()

## 🧠 Crea elementos HTML

```js
const div = document.createElement("div")
```

---

# appendChild()

## 🧠 Inserta elementos en pantalla

```js
document.body.appendChild(div)
```

---

# 👶 CHILDS

# firstElementChild

## 🧠 Primer hijo HTML

```js
div.firstElementChild
```

---

# children

## 🧠 Obtiene todos los hijos HTML

```js
div.children
```

---

# 👨 PARENTS

# parentElement

## 🧠 Obtiene el padre

```js
hijo.parentElement
```

---

# 👨‍👩‍👧 SIBLINGS

# nextElementSibling

## 🧠 Obtiene el hermano siguiente

```js
elemento.nextElementSibling
```

---

# 🌐 NODOS

# nodeType

## 🧠 Obtiene el tipo de nodo

```js
elemento.nodeType
```

---

# 🌟 FRASE FINAL

```txt
“El DOM convierte páginas estáticas en páginas vivas.” 🚀
```
