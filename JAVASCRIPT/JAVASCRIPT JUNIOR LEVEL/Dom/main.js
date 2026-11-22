/**
 * GUÍA INTERACTIVA: MANIPULACIÓN MODERNA DEL DOM
 */

"use strict"; // Activa el modo estricto de JavaScript

const liveConsole = document.getElementById("live-console"); // Obtiene referencia DOM para "liveConsole"

function registrar(mensaje) { // Declara función
    const linea = document.createElement("div"); // Crea nuevo elemento DOM "linea"
    linea.className = "log-line ok"; // Asigna valor
    linea.textContent = `> ${mensaje}`; // Actualiza contenido en el DOM
    liveConsole.append(linea); // Inserta nodo en el DOM
    liveConsole.scrollTop = liveConsole.scrollHeight; // Asigna valor
    console.log(mensaje); // Imprime salida en consola
}

// 1. classList y textContent
const cajaEstilo = document.getElementById("caja-estilo"); // Obtiene referencia DOM para "cajaEstilo"
const outClassList = document.getElementById("out-classlist"); // Obtiene referencia DOM para "outClassList"

function actualizarEstadoClases() { // Declara función
    outClassList.textContent = `Clases actuales: "${cajaEstilo.className}"`; // Actualiza contenido en el DOM
}

document.getElementById("btn-toggle-dest").addEventListener("click", () => { // Registra escuchador de eventos
    cajaEstilo.classList.toggle("destacado"); // Modifica clases CSS del elemento
    actualizarEstadoClases(); // Ejecuta llamada o método
    registrar(`classList.toggle("destacado") -> ${cajaEstilo.classList.contains("destacado")}`); // Modifica clases CSS del elemento
});

document.getElementById("btn-toggle-grande").addEventListener("click", () => { // Registra escuchador de eventos
    cajaEstilo.classList.toggle("grande"); // Modifica clases CSS del elemento
    actualizarEstadoClases(); // Ejecuta llamada o método
    registrar(`classList.toggle("grande") -> ${cajaEstilo.classList.contains("grande")}`); // Modifica clases CSS del elemento
});

document.getElementById("btn-aplicar-texto").addEventListener("click", () => { // Registra escuchador de eventos
    const texto = document.getElementById("dom-texto-input").value; // Obtiene referencia DOM para "texto"
    cajaEstilo.textContent = texto || "Elemento manipulable del DOM"; // Actualiza contenido en el DOM
    registrar(`textContent actualizado de forma segura.`); // Ejecuta llamada o método
});

// 2. Creación dinámica, DocumentFragment, replaceChildren y Delegación de Eventos
const lista = document.getElementById("dom-lista"); // Obtiene referencia DOM para "lista"
const inputItem = document.getElementById("dom-item-input"); // Obtiene referencia DOM para "inputItem"

function crearItemLista(texto) { // Declara función
    const li = document.createElement("li"); // Crea nuevo elemento DOM "li"
    const span = document.createElement("span"); // Crea nuevo elemento DOM "span"
    span.textContent = texto; // Actualiza contenido en el DOM

    const btnDel = document.createElement("button"); // Crea nuevo elemento DOM "btnDel"
    btnDel.type = "button"; // Asigna valor
    btnDel.className = "btn-del"; // Asigna valor
    btnDel.textContent = "Eliminar"; // Actualiza contenido en el DOM

    li.append(span, btnDel); // Inserta nodo en el DOM
    return li; // Retorna resultado
}

document.getElementById("btn-add-append").addEventListener("click", () => { // Registra escuchador de eventos
    const texto = inputItem.value.trim() || `Ítem ${lista.children.length + 1}`; // Declara e inicializa "texto"
    lista.append(crearItemLista(texto)); // Inserta nodo en el DOM
    inputItem.value = ""; // Asigna valor
    registrar(`append(): "${texto}" añadido al final.`); // Ejecuta llamada o método
});

document.getElementById("btn-add-prepend").addEventListener("click", () => { // Registra escuchador de eventos
    const texto = inputItem.value.trim() || `Prioritario ${lista.children.length + 1}`; // Declara e inicializa "texto"
    lista.prepend(crearItemLista(texto)); // Ejecuta llamada o método
    inputItem.value = ""; // Asigna valor
    registrar(`prepend(): "${texto}" añadido al inicio.`); // Ejecuta llamada o método
});

document.getElementById("btn-add-lote").addEventListener("click", () => { // Registra escuchador de eventos
    const fragmento = document.createDocumentFragment(); // Declara e inicializa "fragmento"
    const base = lista.children.length; // Declara e inicializa "base"
    for (let i = 1; i <= 3; i++) { // Inicia bucle de iteración
        fragmento.append(crearItemLista(`Lote Fragment #${base + i}`)); // Inserta nodo en el DOM
    }
    lista.append(fragmento); // Inserta nodo en el DOM
    registrar("3 elementos insertados en 1 solo reflow con DocumentFragment."); // Ejecuta llamada o método
});

document.getElementById("btn-vaciar").addEventListener("click", () => { // Registra escuchador de eventos
    lista.replaceChildren(); // Ejecuta llamada o método
    registrar("lista.replaceChildren() vació todos los hijos."); // Ejecuta llamada o método
});

// Delegación de eventos: un solo listener para todos los botones actuales y futuros
lista.addEventListener("click", (event) => { // Registra escuchador de eventos
    const boton = event.target.closest(".btn-del"); // Declara e inicializa "boton"
    if (!boton) return; // Evalúa condición

    const li = boton.closest("li"); // Declara e inicializa "li"
    const texto = li?.querySelector("span")?.textContent ?? ""; // Obtiene referencia DOM para "texto"
    li?.remove(); // Ejecuta llamada o método
    registrar(`Delegación de eventos: eliminado "${texto}".`); // Ejecuta llamada o método
});

// 3. Navegación entre nodos y closest()
document.getElementById("btn-inspeccionar-dom").addEventListener("click", () => { // Registra escuchador de eventos
    const contenedor = document.getElementById("contenedor-nav"); // Obtiene referencia DOM para "contenedor"
    const hijo1 = document.getElementById("nav-hijo-1"); // Obtiene referencia DOM para "hijo1"
    const tarjetaPadre = hijo1.closest(".card"); // Declara e inicializa "tarjetaPadre"

    document.getElementById("out-nav").textContent =
        `contenedor.firstElementChild: <${contenedor.firstElementChild.tagName.toLowerCase()}> "${contenedor.firstElementChild.textContent}"\n` +
        `hijo1.nextElementSibling: <${hijo1.nextElementSibling.tagName.toLowerCase()}> "${hijo1.nextElementSibling.textContent}"\n` +
        `hijo1.closest(".card"): <${tarjetaPadre?.tagName.toLowerCase()}> con título "${tarjetaPadre?.querySelector("h2")?.textContent}"`; // Actualiza contenido en el DOM
    registrar("Relaciones del árbol DOM inspeccionadas."); // Ejecuta llamada o método
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => { // Registra escuchador de eventos
    liveConsole.replaceChildren(); // Ejecuta llamada o método
});

registrar("Laboratorio del DOM listo."); // Ejecuta llamada o método
