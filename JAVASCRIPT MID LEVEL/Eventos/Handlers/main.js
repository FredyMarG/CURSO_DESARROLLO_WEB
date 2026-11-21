// Guía Interactiva — Event Handlers Modernos

const onceOutput = document.getElementById("onceOutput"); // Obtiene referencia DOM para "onceOutput"
const btnOnce = document.getElementById("btnOnce"); // Obtiene referencia DOM para "btnOnce"

btnOnce.addEventListener("click", () => { // Registra escuchador de eventos
    onceOutput.className = "output ok"; // Asigna valor
    onceOutput.textContent = "¡Ejecutado! Este listener ya fue removido automáticamente ({ once: true })."; // Actualiza contenido en el DOM
    btnOnce.textContent = "Listener consumido"; // Actualiza contenido en el DOM
}, { once: true }); // Ejecuta llamada o método

// 2. AbortController para remover listeners limpiamente
const btnTarget = document.getElementById("btnTarget"); // Obtiene referencia DOM para "btnTarget"
const abortOutput = document.getElementById("abortOutput"); // Obtiene referencia DOM para "abortOutput"
let clickCount = 0; // Declara e inicializa "clickCount"
let controller = null; // Declara e inicializa "controller"

function activarListener() { // Declara función
    if (controller) controller.abort(); // Evalúa condición
    controller = new AbortController(); // Asigna valor
    btnTarget.addEventListener("click", () => { // Registra escuchador de eventos
        clickCount += 1; // Instrucción JavaScript
        abortOutput.className = "output ok"; // Asigna valor
        abortOutput.textContent = `Clic #${clickCount} registrado.`; // Actualiza contenido en el DOM
    }, { signal: controller.signal }); // Ejecuta llamada o método
    abortOutput.className = "output"; // Asigna valor
    abortOutput.textContent = "Listener activo: haz clic en \"Botón de Prueba\"."; // Actualiza contenido en el DOM
}

document.getElementById("btnAbort").addEventListener("click", () => { // Registra escuchador de eventos
    if (controller) controller.abort(); // Evalúa condición
    abortOutput.className = "output"; // Asigna valor
    abortOutput.textContent = "Listener desconectado con controller.abort()."; // Actualiza contenido en el DOM
});

document.getElementById("btnRebind").addEventListener("click", activarListener); // Registra escuchador de eventos
activarListener(); // Ejecuta llamada o método

// 3. CustomEvent
const customMsgInput = document.getElementById("customMsgInput"); // Obtiene referencia DOM para "customMsgInput"
const customOutput = document.getElementById("customOutput"); // Obtiene referencia DOM para "customOutput"

document.addEventListener("usuario:notificacion", (e) => { // Registra escuchador de eventos
    customOutput.className = "output ok"; // Asigna valor
    customOutput.textContent = `CustomEvent recibido [${e.detail.hora}]: "${e.detail.mensaje}"`; // Actualiza contenido en el DOM
});

document.getElementById("btnDispatchCustom").addEventListener("click", () => { // Registra escuchador de eventos
    document.dispatchEvent(new CustomEvent("usuario:notificacion", { // Instrucción JavaScript
        detail: { // Instrucción JavaScript
            mensaje: customMsgInput.value.trim() || "Sin mensaje",
            hora: new Date().toLocaleTimeString()
        }
    }));
});
