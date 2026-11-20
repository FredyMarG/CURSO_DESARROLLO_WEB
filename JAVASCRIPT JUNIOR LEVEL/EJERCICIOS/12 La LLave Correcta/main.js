/**
 * Lógica para la generación dinámica, renderizado optimizado con DocumentFragment
 * y selección accesible de llaves en el DOM.
 */

const contenedor = document.querySelector(".flex-container");
const boton = document.querySelector(".send-button");
const form = document.getElementById("keyForm");
const keyDataInput = document.querySelector(".key-data");
const statusPill = document.getElementById("selectedStatus");
const resultBox = document.getElementById("resultBox");

boton.value = boton.value.toUpperCase();

/**
 * Genera el contenido HTML de una tarjeta de llave.
 */
function crearLLave(nombre, modelo, precio) {
    const img = `<img class="llave-img" src="llave.jpg" alt="${nombre}">`;
    const titulo = `<h2>${nombre}</h2>`;
    const sub = `<h3 id="${modelo}">${modelo}</h3>`;
    const valor = `<p>Precio: <b>${precio}</b></p>`;
    return [img, titulo, sub, valor];
}

/**
 * Actualiza el campo oculto del formulario y el feedback visual.
 */
function seleccionarLlave(card, nombre, modelo, precio) {
    document.querySelectorAll(".flex-item.selected").forEach((el) => {
        el.classList.remove("selected");
    });
    card.classList.add("selected");
    keyDataInput.value = modelo;

    if (statusPill) {
        statusPill.textContent = `🔑 Seleccionaste: ${nombre} — ${modelo} (${precio})`;
        statusPill.classList.add("has-selection");
    }
    if (resultBox) {
        resultBox.className = "result-box";
        resultBox.textContent = "";
    }
}

const fragment = document.createDocumentFragment();

for (let i = 1; i <= 20; i++) {
    const modeloRandom = Math.floor(Math.random() * 9000) + 1000;
    const precioRandom = `$${(Math.random() * 10 + 30).toFixed(2)}`;
    const nombre = `Llave ${i}`;
    const modelo = `Modelo ${modeloRandom}`;

    const llave = crearLLave(nombre, modelo, precioRandom);
    const div = document.createElement("div");

    div.tabIndex = 0;
    div.setAttribute("role", "button");
    div.classList.add(`item-${i}`, "flex-item");
    div.innerHTML = llave.join("");

    div.addEventListener("click", () => seleccionarLlave(div, nombre, modelo, precioRandom));
    div.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            seleccionarLlave(div, nombre, modelo, precioRandom);
        }
    });

    fragment.appendChild(div);
}

contenedor.appendChild(fragment);

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!keyDataInput.value) {
        resultBox.textContent = "⚠️ Primero selecciona una llave haciendo clic sobre su tarjeta.";
        resultBox.className = "result-box err";
        return;
    }
    resultBox.textContent = `✅ ¡Pedido confirmado! El cerrajero llevará la llave ${keyDataInput.value}.`;
    resultBox.className = "result-box ok";
});
