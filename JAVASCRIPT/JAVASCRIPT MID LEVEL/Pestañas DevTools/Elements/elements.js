// DevTools Lab — Pestaña Elements

const targetElement = document.getElementById("targetElement");
const domInfo = document.getElementById("domInfo");

function actualizarInfo() {
    const styles = getComputedStyle(targetElement);
    domInfo.textContent =
        `classList:   [${[...targetElement.classList].join(", ")}]\n` +
        `data-estado: "${targetElement.dataset.estado}"\n` +
        `padding:     ${styles.padding}\n` +
        `borderColor: ${styles.borderColor}`;
}

document.getElementById("btnToggleClass").addEventListener("click", () => {
    targetElement.classList.toggle("resaltado");
    actualizarInfo();
});

document.getElementById("btnMutateAttr").addEventListener("click", () => {
    targetElement.dataset.estado =
        targetElement.dataset.estado === "activo" ? "pausado" : "activo";
    actualizarInfo();
});

document.getElementById("btnPadding").addEventListener("click", () => {
    targetElement.classList.toggle("extra-pad");
    actualizarInfo();
});

actualizarInfo();
