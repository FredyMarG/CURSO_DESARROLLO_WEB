// Guía Interactiva — Event Handlers Modernos

const onceOutput = document.getElementById("onceOutput");
const btnOnce = document.getElementById("btnOnce");

btnOnce.addEventListener("click", () => {
    onceOutput.className = "output ok";
    onceOutput.textContent = "¡Ejecutado! Este listener ya fue removido automáticamente ({ once: true }).";
    btnOnce.textContent = "Listener consumido";
}, { once: true });

// 2. AbortController para remover listeners limpiamente
const btnTarget = document.getElementById("btnTarget");
const abortOutput = document.getElementById("abortOutput");
let clickCount = 0;
let controller = null;

function activarListener() {
    if (controller) controller.abort();
    controller = new AbortController();
    btnTarget.addEventListener("click", () => {
        clickCount += 1;
        abortOutput.className = "output ok";
        abortOutput.textContent = `Clic #${clickCount} registrado.`;
    }, { signal: controller.signal });
    abortOutput.className = "output";
    abortOutput.textContent = "Listener activo: haz clic en \"Botón de Prueba\".";
}

document.getElementById("btnAbort").addEventListener("click", () => {
    if (controller) controller.abort();
    abortOutput.className = "output";
    abortOutput.textContent = "Listener desconectado con controller.abort().";
});

document.getElementById("btnRebind").addEventListener("click", activarListener);
activarListener();

// 3. CustomEvent
const customMsgInput = document.getElementById("customMsgInput");
const customOutput = document.getElementById("customOutput");

document.addEventListener("usuario:notificacion", (e) => {
    customOutput.className = "output ok";
    customOutput.textContent = `CustomEvent recibido [${e.detail.hora}]: "${e.detail.mensaje}"`;
});

document.getElementById("btnDispatchCustom").addEventListener("click", () => {
    document.dispatchEvent(new CustomEvent("usuario:notificacion", {
        detail: {
            mensaje: customMsgInput.value.trim() || "Sin mensaje",
            hora: new Date().toLocaleTimeString()
        }
    }));
});
