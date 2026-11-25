// Guía Interactiva — Event Handlers Modernos

const onceOutput = document.getElementById("onceOutput"); // Declara e inicializa variable local
const btnOnce = document.getElementById("btnOnce"); // Declara e inicializa variable local

btnOnce.addEventListener("click", () => { // Registra escuchador de evento en el DOM
    onceOutput.className = "output ok";
    onceOutput.textContent = "¡Ejecutado! Este listener ya fue removido automáticamente ({ once: true })."; // Actualiza contenido en el DOM
    btnOnce.textContent = "Listener consumido"; // Actualiza contenido en el DOM
}, { once: true });

// 2. AbortController para remover listeners limpiamente
const btnTarget = document.getElementById("btnTarget"); // Declara e inicializa variable local
const abortOutput = document.getElementById("abortOutput"); // Declara e inicializa variable local
let clickCount = 0; // Declara e inicializa variable local
let controller = null; // Declara e inicializa variable local

function activarListener() { // Define función reutilizable
    if (controller) controller.abort(); // Evalúa condición lógica
    controller = new AbortController();
    btnTarget.addEventListener("click", () => { // Registra escuchador de evento en el DOM
        clickCount += 1;
        abortOutput.className = "output ok";
        abortOutput.textContent = `Clic #${clickCount} registrado.`; // Actualiza contenido en el DOM
    }, { signal: controller.signal });
    abortOutput.className = "output";
    abortOutput.textContent = "Listener activo: haz clic en \"Botón de Prueba\"."; // Actualiza contenido en el DOM
}

document.getElementById("btnAbort").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    if (controller) controller.abort(); // Evalúa condición lógica
    abortOutput.className = "output";
    abortOutput.textContent = "Listener desconectado con controller.abort()."; // Actualiza contenido en el DOM
});

document.getElementById("btnRebind").addEventListener("click", activarListener); // Obtiene referencia al elemento del DOM
activarListener();

// 3. CustomEvent
const customMsgInput = document.getElementById("customMsgInput"); // Declara e inicializa variable local
const customOutput = document.getElementById("customOutput"); // Declara e inicializa variable local

document.addEventListener("usuario:notificacion", (e) => { // Registra escuchador de evento en el DOM
    customOutput.className = "output ok";
    customOutput.textContent = `CustomEvent recibido [${e.detail.hora}]: "${e.detail.mensaje}"`; // Actualiza contenido en el DOM
});

document.getElementById("btnDispatchCustom").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    document.dispatchEvent(new CustomEvent("usuario:notificacion", {
        detail: {
            mensaje: customMsgInput.value.trim() || "Sin mensaje",
            hora: new Date().toLocaleTimeString()
        }
    }));
});

