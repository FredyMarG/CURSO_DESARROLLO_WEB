// DevTools Lab — Pestaña Elements (inspección en vivo de clases, atributos y estilos computados)

// Referencias al elemento objetivo y al panel de diagnóstico
const targetElement = document.getElementById("targetElement"); // Nodo DOM que vamos a mutar
const domInfo = document.getElementById("domInfo"); // Bloque donde se muestran las propiedades actuales

/**
 * Lee las clases, atributos data-* y estilos computados reales del elemento
 * para reflejar en pantalla cualquier cambio inspeccionable desde DevTools.
 */
function actualizarInfo() {
    const styles = getComputedStyle(targetElement); // Obtiene los estilos finales calculados por el navegador
    domInfo.textContent =
        `classList:   [${[...targetElement.classList].join(", ")}]\n` +
        `data-estado: "${targetElement.dataset.estado}"\n` +
        `padding:     ${styles.padding}\n` +
        `borderColor: ${styles.borderColor}`;
}

// Alterna la clase CSS "resaltado" para observar la mutación en el panel Elements
document.getElementById("btnToggleClass").addEventListener("click", () => {
    targetElement.classList.toggle("resaltado"); // Añade o quita la clase
    actualizarInfo(); // Actualiza el resumen en pantalla
});

// Cambia el atributo data-estado entre "activo" y "pausado"
document.getElementById("btnMutateAttr").addEventListener("click", () => {
    targetElement.dataset.estado =
        targetElement.dataset.estado === "activo" ? "pausado" : "activo";
    actualizarInfo();
});

// Alterna la clase "extra-pad" para ver cambios en el Box Model / Computed
document.getElementById("btnPadding").addEventListener("click", () => {
    targetElement.classList.toggle("extra-pad");
    actualizarInfo();
});

// Muestra el estado inicial al cargar el laboratorio
actualizarInfo();
