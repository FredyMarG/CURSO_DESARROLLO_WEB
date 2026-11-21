// Guía Interactiva — Temporizadores JS

let timeoutId = null; // Declara e inicializa "timeoutId"
let intervalId = null; // Declara e inicializa "intervalId"
let decimas = 0; // Declara e inicializa "decimas"

const delayInput = document.getElementById("delayInput"); // Obtiene referencia DOM para "delayInput"
const btnStartTimeout = document.getElementById("btnStartTimeout"); // Obtiene referencia DOM para "btnStartTimeout"
const btnCancelTimeout = document.getElementById("btnCancelTimeout"); // Obtiene referencia DOM para "btnCancelTimeout"
const timeoutOutput = document.getElementById("timeoutOutput"); // Obtiene referencia DOM para "timeoutOutput"

btnStartTimeout.addEventListener("click", () => { // Registra escuchador de eventos
    const ms = Math.max(200, Number(delayInput.value) || 2000); // Declara e inicializa "ms"
    if (timeoutId) clearTimeout(timeoutId); // Evalúa condición

    timeoutOutput.className = "output warn"; // Asigna valor
    timeoutOutput.textContent = `Esperando ${ms} ms...`; // Actualiza contenido en el DOM
    btnCancelTimeout.disabled = false; // Asigna valor

    timeoutId = setTimeout(() => { // Asigna valor
        timeoutOutput.className = "output ok"; // Asigna valor
        timeoutOutput.textContent = `¡setTimeout ejecutado tras ${ms} ms!`; // Actualiza contenido en el DOM
        btnCancelTimeout.disabled = true; // Asigna valor
        timeoutId = null; // Asigna valor
    }, ms); // Ejecuta llamada o método
});

btnCancelTimeout.addEventListener("click", () => { // Registra escuchador de eventos
    if (!timeoutId) return; // Evalúa condición
    clearTimeout(timeoutId); // Ejecuta llamada o método
    timeoutId = null; // Asigna valor
    btnCancelTimeout.disabled = true; // Asigna valor
    timeoutOutput.className = "output"; // Asigna valor
    timeoutOutput.textContent = "Temporizador cancelado con clearTimeout()."; // Actualiza contenido en el DOM
});

// Cronómetro con setInterval
const cronoDisplay = document.getElementById("cronoDisplay"); // Obtiene referencia DOM para "cronoDisplay"
const btnStartInterval = document.getElementById("btnStartInterval"); // Obtiene referencia DOM para "btnStartInterval"
const btnPauseInterval = document.getElementById("btnPauseInterval"); // Obtiene referencia DOM para "btnPauseInterval"
const btnResetInterval = document.getElementById("btnResetInterval"); // Obtiene referencia DOM para "btnResetInterval"

function renderCrono() { // Declara función
    cronoDisplay.textContent = `${(decimas / 10).toFixed(1).padStart(4, "0")} s`; // Actualiza contenido en el DOM
}

btnStartInterval.addEventListener("click", () => { // Registra escuchador de eventos
    if (intervalId) return; // Evalúa condición
    intervalId = setInterval(() => { // Asigna valor
        decimas += 1; // Instrucción JavaScript
        renderCrono(); // Ejecuta llamada o método
    }, 100); // Ejecuta llamada o método
    btnStartInterval.disabled = true; // Asigna valor
    btnPauseInterval.disabled = false; // Asigna valor
});

btnPauseInterval.addEventListener("click", () => { // Registra escuchador de eventos
    clearInterval(intervalId); // Ejecuta llamada o método
    intervalId = null; // Asigna valor
    btnStartInterval.disabled = false; // Asigna valor
    btnPauseInterval.disabled = true; // Asigna valor
});

btnResetInterval.addEventListener("click", () => { // Registra escuchador de eventos
    clearInterval(intervalId); // Ejecuta llamada o método
    intervalId = null; // Asigna valor
    decimas = 0; // Asigna valor
    renderCrono(); // Ejecuta llamada o método
    btnStartInterval.disabled = false; // Asigna valor
    btnPauseInterval.disabled = true; // Asigna valor
});

// Event Loop Demo: Microtasks vs Macrotasks
const loopOutput = document.getElementById("loopOutput"); // Obtiene referencia DOM para "loopOutput"

document.getElementById("btnEventLoop").addEventListener("click", () => { // Registra escuchador de eventos
    loopOutput.innerHTML = ""; // Actualiza contenido en el DOM
    const pushLine = (txt) => { // Define función flecha "pushLine"
        const div = document.createElement("div"); // Crea nuevo elemento DOM "div"
        div.textContent = txt; // Actualiza contenido en el DOM
        loopOutput.appendChild(div); // Inserta nodo en el DOM
    };

    pushLine("1. Código síncrono (inicio)"); // Ejecuta llamada o método
    setTimeout(() => pushLine("4. Macrotask: setTimeout(..., 0)"), 0); // Ejecuta llamada o método
    Promise.resolve().then(() => pushLine("3. Microtask: Promise.resolve().then(...)")); // Ejecuta llamada o método
    pushLine("2. Código síncrono (fin)"); // Ejecuta llamada o método
});
