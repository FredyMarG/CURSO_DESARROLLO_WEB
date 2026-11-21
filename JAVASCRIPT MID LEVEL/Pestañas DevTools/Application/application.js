// DevTools Lab — Pestaña Application

const keyInput = document.getElementById("keyInput"); // Obtiene referencia DOM para "keyInput"
const valInput = document.getElementById("valInput"); // Obtiene referencia DOM para "valInput"
const storageView = document.getElementById("storageView"); // Obtiene referencia DOM para "storageView"

function renderStorage() { // Declara función
    const localData = {}; // Declara e inicializa "localData"
    for (let i = 0; i < localStorage.length; i++) { // Inicia bucle de iteración
        const k = localStorage.key(i); // Declara e inicializa "k"
        localData[k] = localStorage.getItem(k); // Asigna valor
    }

    const sessionData = {}; // Declara e inicializa "sessionData"
    for (let i = 0; i < sessionStorage.length; i++) { // Inicia bucle de iteración
        const k = sessionStorage.key(i); // Declara e inicializa "k"
        sessionData[k] = sessionStorage.getItem(k); // Asigna valor
    }

    storageView.textContent =
        `localStorage:\n${JSON.stringify(localData, null, 2)}\n\n` +
        `sessionStorage:\n${JSON.stringify(sessionData, null, 2)}`; // Instrucción JavaScript
}

document.getElementById("btnSaveLocal").addEventListener("click", () => { // Registra escuchador de eventos
    const k = keyInput.value.trim(); // Declara e inicializa "k"
    if (!k) return; // Evalúa condición
    localStorage.setItem(k, valInput.value); // Ejecuta llamada o método
    renderStorage(); // Ejecuta llamada o método
});

document.getElementById("btnSaveSession").addEventListener("click", () => { // Registra escuchador de eventos
    const k = keyInput.value.trim(); // Declara e inicializa "k"
    if (!k) return; // Evalúa condición
    sessionStorage.setItem(k, valInput.value); // Ejecuta llamada o método
    renderStorage(); // Ejecuta llamada o método
});

document.getElementById("btnClearStorage").addEventListener("click", () => { // Registra escuchador de eventos
    localStorage.clear(); // Ejecuta llamada o método
    sessionStorage.clear(); // Ejecuta llamada o método
    renderStorage(); // Ejecuta llamada o método
});

renderStorage(); // Ejecuta llamada o método
