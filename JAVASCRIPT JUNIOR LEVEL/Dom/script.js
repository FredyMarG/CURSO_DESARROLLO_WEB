/**
 * MANIPULACIÓN DEL DOM: HIJOS, PADRES Y HERMANOS
 * Uso de fragmentos, creación de nodos y relaciones entre elementos.
 */

const contenedor = document.querySelector(".contenedor");
const fragmento = document.createDocumentFragment();

/** 👤 OBTENCION Y MODIFICACION DE CHILDS */

// .firstElementChild / .lastElementChild: Acceso directo a elementos hijos (omite nodos de texto)
// .childNodes: Nodelist que incluye elementos y nodos de texto (espacios/saltos)
// .children: Colección HTML solo con elementos hijos

/** 🧑‍💼 METODOS DE MANIPULACIÓN DE HIJOS */
const parrafo = document.createElement("P")
parrafo.innerHTML = "Parrafo"
const h2Nuevo = document.createElement("H2")
h2Nuevo.innerHTML = "Titulo 2"
const h2Antiguo = document.querySelector("h2");

contenedor.replaceChild(h2Nuevo, h2Antiguo) // Intercambia un nodo hijo por otro

let respuesta = h2Nuevo.hasChildNodes(); // Verifica existencia de hijos (nodos o texto)
if (respuesta) {
    document.write("El elemento tiene hijos");
} else {
    document.write("El elemento NO tiene hijos");
}

/** 🧑‍💼 METODOS DE PADRE */
let res = contenedor.parentElement; // Acceso al nodo padre inmediato
console.log(res);

/** 🙌 METODOS DE HERMANOS (SIBLINGS) */
// .previousSibling / .nextSibling: Hermano anterior/siguiente (incluye nodos de texto)
// .previousElementSibling / .nextElementSibling: Hermano anterior/siguiente (solo elementos)
console.log(h2Nuevo.previousElementSibling);
console.log(h2Nuevo.nextElementSibling);