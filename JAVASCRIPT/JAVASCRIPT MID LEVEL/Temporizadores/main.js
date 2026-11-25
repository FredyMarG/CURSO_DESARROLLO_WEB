// Guía Interactiva — Temporizadores JS

let timeoutId = null; // Declara e inicializa variable local
let intervalId = null; // Declara e inicializa variable local
let decimas = 0; // Declara e inicializa variable local

const delayInput = document.getElementById("delayInput"); // Declara e inicializa variable local
const btnStartTimeout = document.getElementById("btnStartTimeout"); // Declara e inicializa variable local
const btnCancelTimeout = document.getElementById("btnCancelTimeout"); // Declara e inicializa variable local
const timeoutOutput = document.getElementById("timeoutOutput"); // Declara e inicializa variable local

btnStartTimeout.addEventListener("click", () => { // Registra escuchador de evento en el DOM
    const ms = Math.max(200, Number(delayInput.value) || 2000); // Declara e inicializa variable local
    if (timeoutId) clearTimeout(timeoutId); // Evalúa condición lógica

    timeoutOutput.className = "output warn";
    timeoutOutput.textContent = `Esperando ${ms} ms...`; // Actualiza contenido en el DOM
    btnCancelTimeout.disabled = false;

    timeoutId = setTimeout(() => {
        timeoutOutput.className = "output ok";
        timeoutOutput.textContent = `¡setTimeout ejecutado tras ${ms} ms!`; // Actualiza contenido en el DOM
        btnCancelTimeout.disabled = true;
        timeoutId = null;
    }, ms);
});

btnCancelTimeout.addEventListener("click", () => { // Registra escuchador de evento en el DOM
    if (!timeoutId) return; // Evalúa condición lógica
    clearTimeout(timeoutId);
    timeoutId = null;
    btnCancelTimeout.disabled = true;
    timeoutOutput.className = "output";
    timeoutOutput.textContent = "Temporizador cancelado con clearTimeout()."; // Actualiza contenido en el DOM
});

// Cronómetro con setInterval
const cronoDisplay = document.getElementById("cronoDisplay"); // Declara e inicializa variable local
const btnStartInterval = document.getElementById("btnStartInterval"); // Declara e inicializa variable local
const btnPauseInterval = document.getElementById("btnPauseInterval"); // Declara e inicializa variable local
const btnResetInterval = document.getElementById("btnResetInterval"); // Declara e inicializa variable local

function renderCrono() { // Define función reutilizable
    cronoDisplay.textContent = `${(decimas / 10).toFixed(1).padStart(4, "0")} s`; // Actualiza contenido en el DOM
}

btnStartInterval.addEventListener("click", () => { // Registra escuchador de evento en el DOM
    if (intervalId) return; // Evalúa condición lógica
    intervalId = setInterval(() => {
        decimas += 1;
        renderCrono();
    }, 100);
    btnStartInterval.disabled = true;
    btnPauseInterval.disabled = false;
});

btnPauseInterval.addEventListener("click", () => { // Registra escuchador de evento en el DOM
    clearInterval(intervalId);
    intervalId = null;
    btnStartInterval.disabled = false;
    btnPauseInterval.disabled = true;
});

btnResetInterval.addEventListener("click", () => { // Registra escuchador de evento en el DOM
    clearInterval(intervalId);
    intervalId = null;
    decimas = 0;
    renderCrono();
    btnStartInterval.disabled = false;
    btnPauseInterval.disabled = true;
});

// Event Loop Demo: Microtasks vs Macrotasks
const loopOutput = document.getElementById("loopOutput"); // Declara e inicializa variable local

document.getElementById("btnEventLoop").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    loopOutput.innerHTML = ""; // Actualiza contenido en el DOM
    const pushLine = (txt) => {
        const div = document.createElement("div"); // Declara e inicializa variable local
        div.textContent = txt; // Actualiza contenido en el DOM
        loopOutput.appendChild(div);
    };

    pushLine("1. Código síncrono (inicio)");
    setTimeout(() => pushLine("4. Macrotask: setTimeout(..., 0)"), 0);
    Promise.resolve().then(() => pushLine("3. Microtask: Promise.resolve().then(...)"));
    pushLine("2. Código síncrono (fin)");
});

