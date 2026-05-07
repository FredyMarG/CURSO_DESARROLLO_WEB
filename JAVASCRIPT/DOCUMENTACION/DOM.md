# 🌳 MANUAL MAESTRO DEL DOM (DOCUMENT OBJECT MODEL)
> "Dominar el DOM es el primer paso para convertirte en un arquitecto de la web."

---

## 📑 1. DEFINICIÓN Y CONCEPTO EXTENDIDO

El **DOM (Document Object Model)** es una interfaz de programación de aplicaciones (API) para documentos HTML y XML. Cuando el navegador carga una página, crea una representación visual de la estructura del documento en forma de **árbol de nodos**.

### Características Principales:
*   **Dinámico:** Permite a JavaScript añadir, eliminar o modificar elementos y estilos en tiempo real.
*   **Estructurado:** Organiza el contenido en una jerarquía de "padres", "hijos" y "hermanos".
*   **Independiente del Lenguaje:** Aunque se usa principalmente con JS, el concepto de DOM es un estándar que podría usarse con otros lenguajes.
*   **Representación en Memoria:** No es el archivo HTML original, sino una versión "viva" que el navegador mantiene mientras la pestaña está abierta.

---

## 🧬 2. ANATOMÍA DE LOS NODOS (EL ÁRBOL)

En el DOM, **todo es un nodo**. Sin embargo, no todos los nodos son iguales. Comprender su jerarquía es vital para no cometer errores de selección.

### Tipos de Nodos Detallados:

1.  **Document (Raíz):** 
    *   *Definición:* Es la punta del árbol. Representa a toda la página cargada.
    *   *Importancia:* Es el punto de entrada. Sin el objeto `document`, no puedes usar ningún método de selección.

2.  **Element (Elementos HTML):** 
    *   *Definición:* Son las etiquetas que conocemos (`<div>`, `<a>`, `<p>`). 
    *   *Características:* Son los únicos nodos que pueden tener atributos y otros nodos hijos (elementos o texto).

3.  **Text (Contenido):** 
    *   *Definición:* Es el texto real que ves en pantalla. 
    *   *Comportamiento:* Se considera un "nodo hoja", lo que significa que no puede tener hijos. Está contenido dentro de un Element.

4.  **Attribute (Atributos):** 
    *   *Definición:* Propiedades como `class`, `id`, `href` o `src`.
    *   *Nota Técnica:* En el DOM moderno, los atributos no se manejan usualmente como nodos separados en el árbol, sino como propiedades asociadas al objeto Element.

5.  **Comentarios y otros:** 
    *   Incluso los comentarios `<!-- -->` y el `<!DOCTYPE html>` ocupan un lugar en el árbol de nodos, aunque rara vez se manipulan.

---

## 🔍 3. MÉTODOS DE SELECCIÓN (EL RASTREO)

Para aplicar un "jutsu" a un elemento, primero debes localizarlo. Aquí están las herramientas de rastreo ordenadas de la más específica a la más general.

### A. Métodos Tradicionales (Rápidos)

| Método | Descripción | Retorno |
| :--- | :--- | :--- |
| `getElementById()` | Busca un elemento por su ID único. | Un solo objeto Element. |
| `getElementsByTagName()` | Busca elementos por etiqueta (ej. `li`). | Una colección viva (HTMLCollection). |
| `getElementsByClassName()` | Busca elementos por su clase CSS. | Una colección viva (HTMLCollection). |

### B. Métodos Modernos (Versátiles)
*   **`querySelector(selector)`**: Usa sintaxis de CSS. Devuelve el **primer** elemento que coincida.
    *   *Ejemplo:* `document.querySelector(".card #btn-comprar");`
*   **`querySelectorAll(selector)`**: Devuelve **todos** los elementos que coincidan en una lista estática (NodeList).
    *   *Ejemplo:* `const items = document.querySelectorAll("nav ul li.active");`

---

## 🛠️ 4. MANIPULACIÓN DE ATRIBUTOS Y VALORES

Una vez capturado el elemento, podemos alterar su ADN (atributos).

1.  **`getAttribute('attr')`**: 
    *   *Función:* Lee el valor de un atributo.
    *   *Caso de uso:* Verificar la URL de una imagen antes de cambiarla.
2.  **`setAttribute('attr', 'valor')`**: 
    *   *Función:* Crea o sobrescribe un atributo.
    *   *Caso de uso:* Cambiar un botón a estado "deshabilitado".
3.  **`removeAttribute('attr')`**: 
    *   *Función:* Elimina el atributo por completo.
    *   *Caso de uso:* Quitar una clase de error de un formulario.

---

## 🚀 5. EJEMPLOS PRÁCTICOS DE ALTO NIVEL

### Ejemplo 1: El Jutsu de Transformación (Cambio de Atributos)
```javascript
// Seleccionamos la imagen del ninja
const imgNinja = document.querySelector('#avatar-principal');

// Si el usuario hace clic, cambiamos el atributo 'src'
imgNinja.onclick = () => {
    const actual = imgNinja.getAttribute('src');
    if(actual === 'naruto.png') {
        imgNinja.setAttribute('src', 'sasuke.png');
        imgNinja.setAttribute('alt', 'Retrato de Sasuke Uchiha');
    }
};
```

### Ejemplo 2: Creación Dinámica (Añadir a la Aldea)
A veces no basta con modificar, hay que crear elementos desde cero:
```javascript
// 1. Crear el elemento
const nuevoHijo = document.createElement('li');

// 2. Añadir contenido de texto
nuevoHijo.textContent = "Nueva Misión de Rango S";

// 3. Seleccionar el padre y añadir al hijo
const listaMisiones = document.querySelector('#lista-misiones');
listaMisiones.appendChild(nuevoHijo);
```

---

## ⚠️ 6. CARACTERÍSTICAS Y REGLAS DE ORO

1.  **NodeList vs HTMLCollection:** 
    *   `querySelectorAll` devuelve una NodeList (se puede usar `.forEach()`). 
    *   `getElementsBy...` devuelve una HTMLCollection (es más difícil de iterar, a veces hay que convertirla a Array).
2.  **Rendimiento:** Tocar el DOM es "costoso" para el navegador. Es mejor hacer muchos cambios en una variable y aplicar al DOM una sola vez al final.
3.  **Seguridad:** Ten cuidado con `.innerHTML`. Si insertas texto que viene de un usuario, podrías sufrir ataques de scripts (XSS). Usa siempre `.textContent` para textos simples.

## ⚡ 7. EVENTOS DEL DOM: LA CHISPA DE LA INTERACCIÓN

Un **Evento** es una señal de que algo ha sucedido en el navegador (un clic, una tecla presionada, el fin de la carga de la página). JavaScript permite "escuchar" estos eventos y ejecutar código en respuesta.

### A. El Escuchador de Eventos (`addEventListener`)
Es la forma moderna y recomendada de manejar interacciones. Permite añadir múltiples funciones a un mismo evento sin sobrescribir las anteriores.

**Sintaxis:**
`elemento.addEventListener('tipoEvento', funciónASuceder);`

---

### B. Tipos de Eventos más Comunes

#### 🖱️ 1. Eventos de Ratón (Mouse Events)
*   `click`: Cuando el usuario presiona y suelta el botón del ratón.
*   `dblclick`: Doble clic rápido.
*   `mouseenter`: Cuando el puntero entra en el área del elemento (útil para efectos hover).
*   `mouseleave`: Cuando el puntero sale del área del elemento.

#### ⌨️ 2. Eventos de Teclado (Keyboard Events)
*   `keydown`: Cuando se presiona una tecla.
*   `keyup`: Cuando se suelta una tecla.
*   *Propiedad Útil:* `event.key` te dice exactamente qué tecla se pulsó (ej: "Enter", "a", "Escape").

#### 📝 3. Eventos de Formulario
*   `submit`: Se dispara cuando se envía un formulario (es vital usar `event.preventDefault()` aquí para evitar que la página se recargue sola).
*   `change`: Cuando el valor de un `input`, `select` o `textarea` cambia y el usuario sale del campo.
*   `input`: Se dispara en tiempo real mientras el usuario escribe.

#### 🌐 4. Eventos de Ventana (Window Events)
*   `DOMContentLoaded`: Se dispara cuando el HTML ha sido completamente cargado y el DOM está listo. Es el momento seguro para ejecutar tu JS.
*   `scroll`: Cuando el usuario sube o baja en la página.
*   `resize`: Cuando se cambia el tamaño de la ventana del navegador.

---

### C. El Objeto `event`
Cuando ocurre un evento, JavaScript pasa automáticamente un objeto llamado `event` a la función. Este objeto contiene información valiosa.

```javascript
const boton = document.querySelector('#btn-mision');

boton.addEventListener('click', (e) => {
    console.log(e.target);    // El elemento exacto que recibió el clic
    console.log(e.type);      // El tipo de evento (en este caso: 'click')
    console.log(e.clientX);   // La posición X del ratón al hacer clic
});
```

---

### D. Ejemplo Práctico: "Modo Ninja Dinámico"
Vamos a crear un script que cambie el tema de tu página (como el cambio Naruto/Sasuke) al presionar una tecla específica:

```javascript
// Escuchamos el teclado en todo el documento
document.addEventListener('keydown', (event) => {
    const cuerpo = document.body;

    // Si presionas la tecla 'N', activas el Modo Naruto
    if (event.key === 'n' || event.key === 'N') {
        cuerpo.setAttribute('class', 'tema-naruto');
        console.log("¡Dattebayo! Modo Naruto activado.");
    } 

    // Si presionas la tecla 'S', activas el Modo Sasuke
    if (event.key === 's' || event.key === 'S') {
        cuerpo.setAttribute('class', 'tema-sasuke');
        console.log("Has entrado en la oscuridad... Modo Sasuke activado.");
    }
});
```

---

### 🛡️ E. Reglas de Oro de los Eventos

1.  **Delegación de Eventos:** Si tienes 100 botones, no pongas 100 escuchadores. Pon uno solo en el elemento padre y usa `e.target` para saber cuál se presionó. Esto ahorra mucha memoria.
2.  **`preventDefault()`:** Úsalo siempre en formularios para validar los datos antes de que la página se refresque.
3.  **No abuses del Scroll:** El evento `scroll` se dispara cientos de veces por segundo. Si pones código pesado ahí, la página se sentirá lenta (lag).
