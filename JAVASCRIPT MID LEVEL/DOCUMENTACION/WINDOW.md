# 🌐 GUÍA OBJETO WINDOW EN JAVASCRIPT

---

## 📚 TEMARIO

1. ¿Qué es el objeto `window`?
2. Relación entre Browser → Window → DOM
3. Métodos de apertura y cierre

   * `open()`
   * `close()`
   * `closed`
   * `stop()`

4. Métodos de interacción con el usuario

   * `alert()`
   * `prompt()`
   * `confirm()`
   * `print()`

5. Diagramas visuales
6. Ejemplos reales
7. Casos prácticos
8. Errores comunes
9. Buenas prácticas PRO
10. Debugging
11. Mini proyecto práctico
12. Resumen final

---

## 🌎 ¿QUÉ ES EL OBJETO `window`?

El objeto `window` es el objeto principal del navegador.

Representa toda la ventana del navegador donde se ejecuta JavaScript.

TODO en el navegador vive dentro de `window`.

---

## 🧠 PIÉNSALO ASÍ

```txt
NAVEGADOR
 └── WINDOW
      ├── DOCUMENT (HTML)
      ├── SCREEN
      ├── LOCATION
      ├── HISTORY
      ├── CONSOLE
      ├── ALERT
      ├── PROMPT
      └── MUCHAS MÁS...
```

---

## 🔥 IMPORTANTE

Cuando escribes:

```js
alert("Hola")
```

REALMENTE estás escribiendo:

```js
window.alert("Hola")
```

El navegador permite omitir `window`.

---

## 🧩 RELACIÓN ENTRE WINDOW Y DOM

```txt
WINDOW
 └── DOCUMENT
      └── HTML
           └── BODY
                └── ELEMENTOS
```

---

## 🚪 OPEN(), CLOSE(), CLOSED Y STOP()

---

### 🔓 `window.open()`

Abre una nueva ventana o pestaña.

---

#### 📌 Sintaxis

```js
window.open(url, nombre, configuraciones)
```

---

#### ✅ Ejemplo básico

```js
window.open("https://google.com")
```

---

#### 🧠 VISUAL

```txt
Página actual
     ↓
window.open()
     ↓
Nueva pestaña
```

---

#### ✅ Ejemplo PRO

```js
window.open(
    "https://google.com",
    "MiVentana",
    "width=600,height=400"
)
```

---

#### 🔍 EXPLICACIÓN

| Parte     | Significado    |
| --------- | -------------- |
| width     | ancho          |
| height    | alto           |
| MiVentana | nombre interno |

---

### 🎛️ CONFIGURACIONES COMPLETAS DE `window.open()`

| Opción     | Valor  | Descripción                  |
| ---------- | ------ | ---------------------------- |
| width      | número | Ancho de la ventana          |
| height     | número | Alto de la ventana           |
| left       | número | Distancia desde la izquierda |
| top        | número | Distancia desde arriba       |
| toolbar    | yes/no | Mostrar barra herramientas   |
| menubar    | yes/no | Mostrar menú                 |
| location   | yes/no | Mostrar barra dirección      |
| status     | yes/no | Mostrar barra estado         |
| scrollbars | yes/no | Mostrar scroll               |
| resizable  | yes/no | Permitir redimensionar       |

---

#### ✅ Ejemplo completo

```js
const ventana = window.open(
    "https://google.com",
    "MiVentana",
    "width=800,height=600,left=100,top=50,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes"
)
```

---

### ⚠️ LIMITACIÓN IMPORTANTE

Los navegadores modernos pueden bloquear ventanas emergentes.

Necesita una acción del usuario:

```js
button.addEventListener('click', () => {
    window.open("https://google.com")
})
```

---

### 🔄 INTERACTUAR CON LA VENTANA ABIERTA

```js
const ventana = window.open("https://google.com")

ventana.document.title = "Mi Ventana"

ventana.document.body.innerHTML = "<h1>Hola</h1>"
```

---

### ❌ `window.close()`

Cierra una ventana.

---

#### ✅ Ejemplo

```js
window.close()
```

---

#### ⚠️ IMPORTANTE

Solo funciona correctamente si la ventana fue abierta con JavaScript.

---

#### 🧠 Ejemplo real

```js
const ventana = window.open("https://google.com")

ventana.close()
```

---

### 🔍 `window.closed`

Propiedad de **sólo lectura** que devuelve un booleano. Es fundamental para evitar errores al intentar manipular una ventana que el usuario ya cerró.

---

#### ✅ Ejemplo

```js
const ventana = window.open("https://google.com")
if (ventana) {
    console.log(ventana.closed); // false
}
```

---

#### 📌 Resultado

```txt
false
```

Si el usuario la cierra:

```txt
true
```

---

### 🛑 `window.stop()`

Detiene la carga de la página.

Es como presionar la ❌ del navegador mientras carga.

---

#### ✅ Ejemplo

```js
window.stop()
```

---

#### 🧠 CASO REAL

Detener imágenes pesadas o scripts lentos.

---

## 🚨 ALERT(), PROMPT(), CONFIRM() Y PRINT()

---

### 🚨 `alert()`

Muestra una alerta.

---

#### ✅ Ejemplo

```js
alert("Hola mundo")
```

---

#### 🧠 VISUAL

```txt
┌─────────────┐
│ Hola mundo  │
│      OK     │
└─────────────┘
```

---

#### ⚠️ PROBLEMA

Bloquea toda la página hasta cerrarse.

---

### 🖨️ `print()`

Abre la ventana de impresión.

---

#### ✅ Ejemplo

```js
window.print()
```

---

#### 🧠 CASO REAL

Facturas, certificados y reportes PDF.

---

### ✍️ `prompt()`

Pide información al usuario.

---

#### ✅ Ejemplo

```js
const nombre = prompt("¿Cómo te llamas?")
```

---

#### 🧠 VISUAL

```txt
┌─────────────────────┐
│ ¿Cómo te llamas?    │
│ [______________]    │
│  OK    CANCELAR     │
└─────────────────────┘
```

---

#### 📌 Resultado

```js
console.log(nombre)
```

---

#### ⚠️ IMPORTANTE

Todo lo que devuelve es TEXTO.

---

#### ❌ Error común

```js
const edad = prompt("Edad")

console.log(edad + 10)
```

Resultado:

```txt
2010
```

---

#### ✅ Solución

```js
const edad = Number(prompt("Edad"))

console.log(edad + 10)
```

---

### ✅ `confirm()`

Muestra una confirmación.

---

#### ✅ Ejemplo

```js
const respuesta = confirm("¿Deseas eliminar?")
```

---

#### 📌 Retorna

| Botón    | Resultado |
| -------- | --------- |
| OK       | true      |
| Cancelar | false     |

---

#### 🧠 Ejemplo real

```js
if(confirm("¿Salir?")){
    console.log("Saliendo...")
}
```

---

## 🧠 DIAGRAMAS VISUALES

---

### 🌎 ESTRUCTURA GENERAL DEL NAVEGADOR

```txt
NAVEGADOR
 └── WINDOW
      ├── DOCUMENT
      ├── SCREEN
      ├── LOCATION
      ├── HISTORY
      ├── ALERT
      ├── PROMPT
      └── CONFIRM
```

---

### 🪟 APERTURA DE VENTANAS

```txt
Página actual
     ↓
window.open()
     ↓
Nueva pestaña/ventana
```

---

### 🧾 INTERACCIÓN CON EL USUARIO

```txt
USUARIO
   ↓
prompt()
   ↓
Dato ingresado
   ↓
JavaScript procesa información
```

---

## 🚀 CASOS PRÁCTICOS

---

### ✅ Abrir ventana personalizada

```js
window.open(
    "https://google.com",
    "MiVentana",
    "width=500,height=500"
)
```

---

### ✅ Confirmar eliminación

```js
const eliminar = confirm("¿Eliminar producto?")

if(eliminar){
    console.log("Producto eliminado")
}
```

---

### ✅ Solicitar edad

```js
const edad = Number(prompt("¿Edad?"))

if(edad >= 18){
    alert("Mayor de edad")
}
```

---

### ✅ Imprimir página

```js
window.print()
```

---

## ❌ ERRORES COMUNES

---

### ❌ Usar `prompt()` como número

```js
prompt() // devuelve string
```

---

### ❌ Abusar de `alert()`

Muchos alerts:

```txt
❌ Mala experiencia
❌ Bloquea interfaz
❌ Se ve anticuado
```

---

### ❌ Intentar cerrar pestañas normales

```js
window.close()
```

No siempre funciona.

---

### ❌ Abrir ventanas sin interacción

```js
window.open("https://google.com")
```

Puede ser bloqueado.

---

## ✅ BUENAS PRÁCTICAS PRO

---

### ✅ Usa `confirm()` para acciones peligrosas

```js
if(confirm("¿Eliminar cuenta?")){
    console.log("Cuenta eliminada")
}
```

---

### ✅ Convierte `prompt()` a número si es necesario

```js
const numero = Number(prompt("Número"))
```

---

### ✅ Evita exceso de alertas

Mejor usar:

```txt
✔ modales personalizados
✔ notificaciones visuales
✔ componentes UI modernos
```

---

### ✅ Usa `window.open()` con tamaños controlados

```js
window.open(
    "https://google.com",
    "Ventana",
    "width=600,height=400"
)
```

---

## 🧠 DEBUGGING

---

### ✅ Ver objeto window

```js
console.log(window)
```

---

### ✅ Verificar si ventana está cerrada

```js
console.log(ventana.closed)
```

---

### ✅ Detener carga página

```js
window.stop()
```

---

### ✅ Ver datos ingresados

```js
const dato = prompt("Dato")
console.log(dato)
```

---

## 🚀 MINI PROYECTO PRÁCTICO

---

### 🎯 OBJETIVO

Crear una página que:

✅ pregunte nombre
✅ confirme entrada
✅ muestre alert
✅ abra una ventana

---

### ✅ Código

```js
const nombre = prompt("¿Nombre?")

const entrar = confirm(`Hola ${nombre}, ¿entrar?`)

if(entrar){

    alert(`Bienvenido ${nombre}`)

    const ventana = window.open(
        "https://google.com",
        "MiVentana",
        "width=600,height=400"
    )

    console.log(ventana.closed)

}else{

    alert("Acceso cancelado")

}
```

---

## 🧠 RESUMEN FINAL

| Método/Propiedad | Función          |
| ---------------- | ---------------- |
| open()           | abrir ventana    |
| close()          | cerrar ventana   |
| closed           | saber si cerró   |
| stop()           | detener carga    |
| alert()          | mostrar alerta   |
| prompt()         | pedir datos      |
| confirm()        | confirmar acción |
| print()          | imprimir página  |

---

## 🏆 CONCLUSIÓN

El objeto `window` es el centro del navegador.

Dominarlo te permite:

✅ controlar ventanas
✅ interactuar con usuarios
✅ detener cargas
✅ abrir pestañas dinámicas
✅ crear experiencias reales

Es una de las bases MÁS importantes del desarrollo web frontend profesional.

