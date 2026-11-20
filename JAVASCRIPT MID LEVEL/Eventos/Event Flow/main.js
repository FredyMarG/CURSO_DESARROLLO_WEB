// Guía Interactiva — Event Flow (Capturing & Bubbling)

const abuelo = document.getElementById("abuelo");
const padre = document.getElementById("padre");
const hijo = document.getElementById("hijo");
const chkCapture = document.getElementById("chkCapture");
const chkStop = document.getElementById("chkStop");
const flowLog = document.getElementById("flowLog");

let controller = new AbortController();

function registrar(fase, nodo) {
    const line = document.createElement("div");
    line.textContent = `• [${fase}] → ${nodo}`;
    flowLog.appendChild(line);
}

function bindListeners() {
    controller.abort();
    controller = new AbortController();
    const useCapture = chkCapture.checked;
    const opts = { capture: useCapture, signal: controller.signal };
    const faseLabel = useCapture ? "CAPTURING" : "BUBBLING";

    abuelo.addEventListener("click", () => {
        registrar(faseLabel, "Abuelo (Rojo)");
    }, opts);

    padre.addEventListener("click", (e) => {
        registrar(faseLabel, "Padre (Azul)");
        if (chkStop.checked) {
            e.stopPropagation();
            registrar("STOP", "e.stopPropagation() ejecutado en Padre");
        }
    }, opts);

    hijo.addEventListener("click", () => {
        flowLog.innerHTML = "";
        registrar("TARGET", "Hijo (Botón)");
    }, { signal: controller.signal });
}

chkCapture.addEventListener("change", bindListeners);
document.getElementById("btnClear").addEventListener("click", () => {
    flowLog.innerHTML = "Haz clic en el botón \"Hijo\" para observar el flujo.";
});

bindListeners();
