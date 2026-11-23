/**
 * GUÍA INTERACTIVA: MANIPULACIÓN MODERNA DEL DOM
 */

"use strict"; // Activa el modo estricto de JavaScript

const liveConsole = document.getElementById("live-console");

function registrar(mensaje) {
    const linea = document.createElement("div");
    linea.className = "log-line ok";
    linea.textContent = `> ${mensaje}`; // Actualiza contenido en el DOM
    liveConsole.append(linea);
    liveConsole.scrollTop = liveConsole.scrollHeight;
    console.log(mensaje); // Imprime salida en consola
}

// 1. classList y textContent
const cajaEstilo = document.getElementById("caja-estilo");
const outClassList = document.getElementById("out-classlist");

function actualizarEstadoClases() {
    outClassList.textContent = `Clases actuales: "${cajaEstilo.className}"`; // Actualiza contenido en el DOM
}

document.getElementById("btn-toggle-dest").addEventListener("click", () => {
    cajaEstilo.classList.toggle("destacado");
    actualizarEstadoClases();
    registrar(`classList.toggle("destacado") -> ${cajaEstilo.classList.contains("destacado")}`);
});

document.getElementById("btn-toggle-grande").addEventListener("click", () => {
    cajaEstilo.classList.toggle("grande");
    actualizarEstadoClases();
    registrar(`classList.toggle("grande") -> ${cajaEstilo.classList.contains("grande")}`);
});

document.getElementById("btn-aplicar-texto").addEventListener("click", () => {
    const texto = document.getElementById("dom-texto-input").value;
    cajaEstilo.textContent = texto || "Elemento manipulable del DOM"; // Actualiza contenido en el DOM
    registrar(`textContent actualizado de forma segura.`);
});

// 2. Creación dinámica, DocumentFragment, replaceChildren y Delegación de Eventos
const lista = document.getElementById("dom-lista");
const inputItem = document.getElementById("dom-item-input");

function crearItemLista(texto) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = texto; // Actualiza contenido en el DOM

    const btnDel = document.createElement("button");
    btnDel.type = "button";
    btnDel.className = "btn-del";
    btnDel.textContent = "Eliminar"; // Actualiza contenido en el DOM

    li.append(span, btnDel);
    return li;
}

document.getElementById("btn-add-append").addEventListener("click", () => {
    const texto = inputItem.value.trim() || `Ítem ${lista.children.length + 1}`;
    lista.append(crearItemLista(texto));
    inputItem.value = "";
    registrar(`append(): "${texto}" añadido al final.`);
});

document.getElementById("btn-add-prepend").addEventListener("click", () => {
    const texto = inputItem.value.trim() || `Prioritario ${lista.children.length + 1}`;
    lista.prepend(crearItemLista(texto));
    inputItem.value = "";
    registrar(`prepend(): "${texto}" añadido al inicio.`);
});

document.getElementById("btn-add-lote").addEventListener("click", () => {
    const fragmento = document.createDocumentFragment();
    const base = lista.children.length;
    for (let i = 1; i <= 3; i++) {
        fragmento.append(crearItemLista(`Lote Fragment #${base + i}`));
    }
    lista.append(fragmento);
    registrar("3 elementos insertados en 1 solo reflow con DocumentFragment.");
});

document.getElementById("btn-vaciar").addEventListener("click", () => {
    lista.replaceChildren();
    registrar("lista.replaceChildren() vació todos los hijos.");
});

// Delegación de eventos: un solo listener para todos los botones actuales y futuros
lista.addEventListener("click", (event) => {
    const boton = event.target.closest(".btn-del");
    if (!boton) return;

    const li = boton.closest("li");
    const texto = li?.querySelector("span")?.textContent ?? "";
    li?.remove();
    registrar(`Delegación de eventos: eliminado "${texto}".`);
});

// 3. Navegación entre nodos y closest()
document.getElementById("btn-inspeccionar-dom").addEventListener("click", () => {
    const contenedor = document.getElementById("contenedor-nav");
    const hijo1 = document.getElementById("nav-hijo-1");
    const tarjetaPadre = hijo1.closest(".card");

    document.getElementById("out-nav").textContent =
        `contenedor.firstElementChild: <${contenedor.firstElementChild.tagName.toLowerCase()}> "${contenedor.firstElementChild.textContent}"\n` +
        `hijo1.nextElementSibling: <${hijo1.nextElementSibling.tagName.toLowerCase()}> "${hijo1.nextElementSibling.textContent}"\n` +
        `hijo1.closest(".card"): <${tarjetaPadre?.tagName.toLowerCase()}> con título "${tarjetaPadre?.querySelector("h2")?.textContent}"`; // Actualiza contenido en el DOM
    registrar("Relaciones del árbol DOM inspeccionadas.");
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => {
    liveConsole.replaceChildren();
});

registrar("Laboratorio del DOM listo.");
