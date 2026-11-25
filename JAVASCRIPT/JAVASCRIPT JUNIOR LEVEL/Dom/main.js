/**
 * GUÍA INTERACTIVA: MANIPULACIÓN MODERNA DEL DOM
 */

"use strict"; // Activa el modo estricto de JavaScript

const liveConsole = document.getElementById("live-console"); // Declara e inicializa variable local

function registrar(mensaje) { // Define función reutilizable
    const linea = document.createElement("div"); // Declara e inicializa variable local
    linea.className = "log-line ok";
    linea.textContent = `> ${mensaje}`; // Actualiza contenido en el DOM
    liveConsole.append(linea);
    liveConsole.scrollTop = liveConsole.scrollHeight;
    console.log(mensaje); // Imprime salida en consola
}

// 1. classList y textContent
const cajaEstilo = document.getElementById("caja-estilo"); // Declara e inicializa variable local
const outClassList = document.getElementById("out-classlist"); // Declara e inicializa variable local

function actualizarEstadoClases() { // Define función reutilizable
    outClassList.textContent = `Clases actuales: "${cajaEstilo.className}"`; // Actualiza contenido en el DOM
}

document.getElementById("btn-toggle-dest").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    cajaEstilo.classList.toggle("destacado");
    actualizarEstadoClases();
    registrar(`classList.toggle("destacado") -> ${cajaEstilo.classList.contains("destacado")}`);
});

document.getElementById("btn-toggle-grande").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    cajaEstilo.classList.toggle("grande");
    actualizarEstadoClases();
    registrar(`classList.toggle("grande") -> ${cajaEstilo.classList.contains("grande")}`);
});

document.getElementById("btn-aplicar-texto").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    const texto = document.getElementById("dom-texto-input").value; // Declara e inicializa variable local
    cajaEstilo.textContent = texto || "Elemento manipulable del DOM"; // Actualiza contenido en el DOM
    registrar(`textContent actualizado de forma segura.`);
});

// 2. Creación dinámica, DocumentFragment, replaceChildren y Delegación de Eventos
const lista = document.getElementById("dom-lista"); // Declara e inicializa variable local
const inputItem = document.getElementById("dom-item-input"); // Declara e inicializa variable local

function crearItemLista(texto) { // Define función reutilizable
    const li = document.createElement("li"); // Declara e inicializa variable local
    const span = document.createElement("span"); // Declara e inicializa variable local
    span.textContent = texto; // Actualiza contenido en el DOM

    const btnDel = document.createElement("button"); // Declara e inicializa variable local
    btnDel.type = "button";
    btnDel.className = "btn-del";
    btnDel.textContent = "Eliminar"; // Actualiza contenido en el DOM

    li.append(span, btnDel);
    return li; // Retorna el resultado de la función
}

document.getElementById("btn-add-append").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    const texto = inputItem.value.trim() || `Ítem ${lista.children.length + 1}`; // Declara e inicializa variable local
    lista.append(crearItemLista(texto));
    inputItem.value = "";
    registrar(`append(): "${texto}" añadido al final.`);
});

document.getElementById("btn-add-prepend").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    const texto = inputItem.value.trim() || `Prioritario ${lista.children.length + 1}`; // Declara e inicializa variable local
    lista.prepend(crearItemLista(texto));
    inputItem.value = "";
    registrar(`prepend(): "${texto}" añadido al inicio.`);
});

document.getElementById("btn-add-lote").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    const fragmento = document.createDocumentFragment(); // Declara e inicializa variable local
    const base = lista.children.length; // Declara e inicializa variable local
    for (let i = 1; i <= 3; i++) { // Itera sobre elementos o rango
        fragmento.append(crearItemLista(`Lote Fragment #${base + i}`));
    }
    lista.append(fragmento);
    registrar("3 elementos insertados en 1 solo reflow con DocumentFragment.");
});

document.getElementById("btn-vaciar").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    lista.replaceChildren();
    registrar("lista.replaceChildren() vació todos los hijos.");
});

// Delegación de eventos: un solo listener para todos los botones actuales y futuros
lista.addEventListener("click", (event) => { // Registra escuchador de evento en el DOM
    const boton = event.target.closest(".btn-del"); // Declara e inicializa variable local
    if (!boton) return; // Evalúa condición lógica

    const li = boton.closest("li"); // Declara e inicializa variable local
    const texto = li?.querySelector("span")?.textContent ?? ""; // Declara e inicializa variable local
    li?.remove();
    registrar(`Delegación de eventos: eliminado "${texto}".`);
});

// 3. Navegación entre nodos y closest()
document.getElementById("btn-inspeccionar-dom").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    const contenedor = document.getElementById("contenedor-nav"); // Declara e inicializa variable local
    const hijo1 = document.getElementById("nav-hijo-1"); // Declara e inicializa variable local
    const tarjetaPadre = hijo1.closest(".card"); // Declara e inicializa variable local

    document.getElementById("out-nav").textContent =
        `contenedor.firstElementChild: <${contenedor.firstElementChild.tagName.toLowerCase()}> "${contenedor.firstElementChild.textContent}"\n` +
        `hijo1.nextElementSibling: <${hijo1.nextElementSibling.tagName.toLowerCase()}> "${hijo1.nextElementSibling.textContent}"\n` +
        `hijo1.closest(".card"): <${tarjetaPadre?.tagName.toLowerCase()}> con título "${tarjetaPadre?.querySelector("h2")?.textContent}"`; // Actualiza contenido en el DOM
    registrar("Relaciones del árbol DOM inspeccionadas.");
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    liveConsole.replaceChildren();
});

registrar("Laboratorio del DOM listo.");

