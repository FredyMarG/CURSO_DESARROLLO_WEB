/**
 * LABORATORIO UNIFICADO: MANIPULACIÓN INTEGRAL DEL DOM
 * Este script integra el manejo de atributos, clases, contenido y navegación entre nodos.
 */

console.log("%c--- 1. SELECCIÓN Y ATRIBUTOS GLOBALES ---", "color: #0284c7; font-weight: bold;");

// --- 🧹 MÉTODOS DE SELECCIÓN DE ELEMENTOS (RESUMEN) ---
/* 
   • getElementById: Rápido, busca por ID único.
   • getElementsByTagName: Devuelve una HTMLCollection (dinámica) de etiquetas.
   • querySelector: El más versátil; usa sintaxis de CSS (.clase, #id, tag) y devuelve el primer acierto.
   • querySelectorAll: Devuelve una NodeList (estática) con todos los elementos que coincidan.
*/

// --- 🌐 MÉTODOS DE ATRIBUTOS GLOBALES ---
// Estos métodos funcionan en prácticamente cualquier elemento HTML.
const titulo = document.querySelector(".titulo"); // Paso 1: Seleccionamos el elemento que tenga la clase CSS "titulo".

/**
 * .setAttribute(nombre, valor): Crea o actualiza un atributo.
 * contentEditable: Permite que el usuario edite el texto directamente en el navegador.
 */
titulo.setAttribute("contentEditable", "false"); // Paso 2: Deshabilitamos la posibilidad de que el usuario edite el texto del título manualmente.

/**
 * .setAttribute("DIR", "valor"): Controla la dirección del texto.
 * "ltr" (Left to Right) o "rtl" (Right to Left).
 */
titulo.setAttribute("DIR", "ltr"); // Paso 3: Forzamos la dirección del texto de izquierda a derecha (Left-to-Right).

/**
 * .setAttribute("hidden", "true"): Oculta el elemento del layout.
 * .removeAttribute("hidden"): Vuelve a mostrar el elemento eliminando el atributo.
 */
titulo.setAttribute("hidden", "true"); // Paso 4: Ocultamos el elemento de la vista del usuario.
titulo.removeAttribute("hidden");    // Paso 5: Lo volvemos a hacer visible eliminando el atributo 'hidden'.

/**
 * tabindex: Define si el elemento puede recibir foco mediante el teclado (tecla TAB).
 * 0: El elemento es navegable en su orden natural.
 */
titulo.setAttribute("tabindex", "0"); // Paso 6: Hacemos que el título sea accesible a través de la navegación por teclado (TAB).

/**
 * title: Texto que aparece al pasar el cursor (tooltip nativo del navegador).
 */
titulo.setAttribute("title", "titulo normal"); // Paso 7: Definimos el texto flotante informativo (tooltip).


// --- 📜 ATRIBUTOS ESPECÍFICOS DE INPUTS ---
const input = document.querySelector(".input-normal"); // Paso 8: Localizamos el campo de entrada (input) en el HTML.

/** .value: Propiedad fundamental para obtener o establecer el texto de un campo de entrada. */
input.value = "Valor cambiado"; // Paso 9: Cambiamos programáticamente el texto que el usuario ve dentro del input.

/** .type: Cambia el comportamiento del input (text, password, file, checkbox, etc). */
input.type = "file"; // Paso 10: Transformamos el input de texto a un selector de archivos del sistema.

/** .accept: Filtra los tipos de archivos permitidos en un input de tipo 'file'. */
input.accept = "image/png, image/jpeg"; // Paso 11: Restringimos la selección solo a imágenes PNG y JPG.

input.type = "text"; // Paso 12: Regresamos el input a su estado normal de texto.

/** .form: Referencia al ID del formulario padre (permite validación fuera del tag <form>). */
input.form = "formulario"; // Paso 13: Vinculamos este input a un formulario con ID "formulario".

/** .minLength / .maxLength: Restricciones de validación de caracteres. */
input.minlength = "5";   // Paso 14: Establecemos validación mínima de 5 caracteres.
input.maxlength = "100"; // Paso 15: Establecemos un límite máximo de 100 caracteres.

/** .placeholder: Texto de ayuda visual que desaparece al escribir. */
input.placeholder = "Ingrese su nombre"; // Paso 16: Seteamos el texto de sugerencia de fondo.

/** .required: Si es true, el navegador impide el envío del formulario si está vacío. */
input.required = true; // Paso 17: Marcamos el campo como obligatorio para el envío del formulario.


// --- 🎨 PROPIEDAD STYLE ---
let elemento = document.querySelector(".style");

/**
 * .style permite modificar CSS inline (directamente en la etiqueta).
 * Nota: Las propiedades en JS usan camelCase (backgroundColor en lugar de background-color).
 */


// --- 🏗️ CLASSLIST: GESTIÓN DE CLASES CSS ---
/** 
 * classList es la forma recomendada de manejar estilos mediante clases predefinidas en CSS,
 * manteniendo la separación de lógica y diseño.
 */

// .add(): Agrega una clase sin sobrescribir las existentes.
elemento.classList.add("grande"); // Paso 18: Añadimos la clase CSS "grande" al elemento.

// .remove(): Quita la clase especificada.
elemento.classList.remove("grande"); // Paso 19: Eliminamos la clase "grande" sin tocar el resto de clases.

/** .item(index): Recupera la clase en una posición específica del listado de clases. */
let item = elemento.classList.item(2); // Paso 20: Obtenemos el nombre de la tercera clase aplicada (índice 2).
console.log("%cClase en índice 2:", "color: #0284c7;", item);

/** .contains(clase): Retorna true si el elemento posee dicha clase. Útil para condicionales. */
let contiene = elemento.classList.contains("rojo"); // Paso 21: Comprobamos si el elemento tiene la clase "rojo".
console.log("%c¿Contiene 'rojo'?:", "color: #0284c7;", contiene);

/** 
 * .toggle(clase, forzado?): 
 * Si la clase existe, la quita. Si no existe, la pone.
 * El segundo parámetro opcional 'false' obliga a que siempre se elimine.
 */
elemento.classList.toggle("grande", false); // Paso 22: Usamos toggle con modo forzado para asegurar que se elimine.

/** .replace(vieja, nueva): Intercambia una clase por otra de forma atómica. */
elemento.classList.replace("style", "chico") // Paso 23: Reemplazamos "style" por "chico" directamente.


// --- 🔄 OBTENCIÓN Y MODIFICACIÓN DE CONTENIDO ---

/** 
 * textContent: Devuelve el texto plano de un nodo y sus descendientes. 
 * Es el más seguro para prevenir ataques XSS ya que no interpreta HTML.
 */
elemento.textContent;

/** innerText: Similar a textContent pero consciente del CSS (no devuelve texto oculto con 'display: none'). */
elemento.innerText;

/** innerHTML: Retorna o establece el marcado HTML. Permite inyectar etiquetas como <b> o <div>. */
elemento.innerHTML;


console.log("%c--- 2. NAVEGACIÓN Y NODOS (HIJOS/PADRES) ---", "color: #0284c7; font-weight: bold;");

/** 
 * MANIPULACIÓN DE NODOS: HIJOS, PADRES Y HERMANOS
 */
const contenedor = document.querySelector(".contenedor"); // Paso 24: Identificamos el contenedor padre.

/** 
 * DocumentFragment: Contenedor ligero en memoria para mejorar el rendimiento en inserciones masivas.
 */
const fragmento = document.createDocumentFragment(); // Paso 25: Creamos un fragmento (memoria volátil) para inyecciones eficientes.

/** 🧑‍💼 MÉTODOS DE MANIPULACIÓN DINÁMICA */
const parrafoNuevo = document.createElement("P"); // Paso 26: Creamos un nuevo nodo de párrafo (<p>).
parrafoNuevo.innerHTML = "Soy un párrafo inyectado mediante JS.";

const h2Nuevo = document.createElement("H2"); // Paso 27: Creamos un nuevo encabezado H2.
h2Nuevo.innerHTML = "Subtítulo Nuevo (Reemplazado)";

const h2Antiguo = document.querySelector(".contenedor h2"); // Paso 28: Buscamos el H2 que ya existe en el contenedor.

/** .replaceChild(nuevo, antiguo): Sustituye un nodo existente. */
if (h2Antiguo) {
    contenedor.replaceChild(h2Nuevo, h2Antiguo); // Paso 29: Intercambiamos físicamente el H2 viejo por el nuevo en el DOM.
}

/** .hasChildNodes(): Retorna booleano indicando si el elemento contiene nodos. */
let tieneHijos = h2Nuevo.hasChildNodes(); // Paso 30: Verificamos si nuestro H2 recién creado tiene contenido dentro.
console.log(`%c¿El nuevo H2 tiene hijos?: %c${tieneHijos}`, "color: #0284c7;", "font-weight: bold;");

/** 🧑‍💼 NAVEGACIÓN HACIA EL PADRE (PARENTS) */
/** 
 * .parentElement: Obtiene el padre directo (Elemento HTML).
 * .parentNode: Obtiene cualquier tipo de padre (Nodo).
 */
let padreDelContenedor = contenedor.parentElement; // Paso 31: Accedemos al elemento que envuelve al contenedor.
console.log("%cPadre del contenedor:", "color: #0284c7; font-style: italic;", padreDelContenedor);

/** 🙌 NAVEGACIÓN ENTRE HERMANOS (SIBLINGS) */
/*
   • .previousElementSibling: Hermano anterior (solo elementos).
   • .nextElementSibling: Hermano siguiente (solo elementos).
*/
console.log("%cHermano anterior del H2:", "color: #0c4a6e;", h2Nuevo.previousElementSibling); // Paso 32: Vemos qué elemento está antes.
console.log("%cHermano siguiente del H2:", "color: #0c4a6e;", h2Nuevo.nextElementSibling);   // Paso 33: Vemos qué elemento está después.

/** 👤 EXPLORACIÓN DE HIJOS (RESUMEN) */
console.log("%cHijos del contenedor (solo HTML):", "color: #0c4a6e;", contenedor.children); // Paso 34: Listamos solo los hijos que son etiquetas.
console.log("%cPrimer hijo real:", "color: #0c4a6e; font-weight: bold;", contenedor.firstElementChild); // Paso 35: Obtenemos el primer hijo que es un Element.

console.log("%c----------------------------------------", "color: #0284c7;");