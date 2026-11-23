// Guía Interactiva — Temporizadores JS

let timeoutId = null;
let intervalId = null;
let decimas = 0;

const delayInput = document.getElementById("delayInput");
const btnStartTimeout = document.getElementById("btnStartTimeout");
const btnCancelTimeout = document.getElementById("btnCancelTimeout");
const timeoutOutput = document.getElementById("timeoutOutput");

btnStartTimeout.addEventListener("click", () => {
    const ms = Math.max(200, Number(delayInput.value) || 2000);
    if (timeoutId) clearTimeout(timeoutId);

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

btnCancelTimeout.addEventListener("click", () => {
    if (!timeoutId) return;
    clearTimeout(timeoutId);
    timeoutId = null;
    btnCancelTimeout.disabled = true;
    timeoutOutput.className = "output";
    timeoutOutput.textContent = "Temporizador cancelado con clearTimeout()."; // Actualiza contenido en el DOM
});

// Cronómetro con setInterval
const cronoDisplay = document.getElementById("cronoDisplay");
const btnStartInterval = document.getElementById("btnStartInterval");
const btnPauseInterval = document.getElementById("btnPauseInterval");
const btnResetInterval = document.getElementById("btnResetInterval");

function renderCrono() {
    cronoDisplay.textContent = `${(decimas / 10).toFixed(1).padStart(4, "0")} s`; // Actualiza contenido en el DOM
}

btnStartInterval.addEventListener("click", () => {
    if (intervalId) return;
    intervalId = setInterval(() => {
        decimas += 1;
        renderCrono();
    }, 100);
    btnStartInterval.disabled = true;
    btnPauseInterval.disabled = false;
});

btnPauseInterval.addEventListener("click", () => {
    clearInterval(intervalId);
    intervalId = null;
    btnStartInterval.disabled = false;
    btnPauseInterval.disabled = true;
});

btnResetInterval.addEventListener("click", () => {
    clearInterval(intervalId);
    intervalId = null;
    decimas = 0;
    renderCrono();
    btnStartInterval.disabled = false;
    btnPauseInterval.disabled = true;
});

// Event Loop Demo: Microtasks vs Macrotasks
const loopOutput = document.getElementById("loopOutput");

document.getElementById("btnEventLoop").addEventListener("click", () => {
    loopOutput.innerHTML = ""; // Actualiza contenido en el DOM
    const pushLine = (txt) => {
        const div = document.createElement("div");
        div.textContent = txt; // Actualiza contenido en el DOM
        loopOutput.appendChild(div);
    };

    pushLine("1. Código síncrono (inicio)");
    setTimeout(() => pushLine("4. Macrotask: setTimeout(..., 0)"), 0);
    Promise.resolve().then(() => pushLine("3. Microtask: Promise.resolve().then(...)"));
    pushLine("2. Código síncrono (fin)");
});
