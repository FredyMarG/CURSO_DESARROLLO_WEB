// DevTools Lab — Pestaña Elements

const targetElement = document.getElementById("targetElement"); // Obtiene referencia DOM para "targetElement"
const domInfo = document.getElementById("domInfo"); // Obtiene referencia DOM para "domInfo"

function actualizarInfo() { // Declara función
    const styles = getComputedStyle(targetElement); // Declara e inicializa "styles"
    domInfo.textContent =
        `classList:   [${[...targetElement.classList].join(", ")}]\n` +
        `data-estado: "${targetElement.dataset.estado}"\n` +
        `padding:     ${styles.padding}\n` +
        `borderColor: ${styles.borderColor}`; // Instrucción JavaScript
}

document.getElementById("btnToggleClass").addEventListener("click", () => { // Registra escuchador de eventos
    targetElement.classList.toggle("resaltado"); // Modifica clases CSS del elemento
    actualizarInfo(); // Ejecuta llamada o método
});

document.getElementById("btnMutateAttr").addEventListener("click", () => { // Registra escuchador de eventos
    targetElement.dataset.estado =
        targetElement.dataset.estado === "activo" ? "pausado" : "activo"; // Instrucción JavaScript
    actualizarInfo(); // Ejecuta llamada o método
});

document.getElementById("btnPadding").addEventListener("click", () => { // Registra escuchador de eventos
    targetElement.classList.toggle("extra-pad"); // Modifica clases CSS del elemento
    actualizarInfo(); // Ejecuta llamada o método
});

actualizarInfo(); // Ejecuta llamada o método
