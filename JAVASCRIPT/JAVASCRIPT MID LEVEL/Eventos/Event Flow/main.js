// Guía Interactiva — Event Flow (Capturing & Bubbling)

const abuelo = document.getElementById("abuelo"); // Declara e inicializa variable local
const padre = document.getElementById("padre"); // Declara e inicializa variable local
const hijo = document.getElementById("hijo"); // Declara e inicializa variable local
const chkCapture = document.getElementById("chkCapture"); // Declara e inicializa variable local
const chkStop = document.getElementById("chkStop"); // Declara e inicializa variable local
const flowLog = document.getElementById("flowLog"); // Declara e inicializa variable local

let controller = new AbortController(); // Declara e inicializa variable local

function registrar(fase, nodo) { // Define función reutilizable
    const line = document.createElement("div"); // Declara e inicializa variable local
    line.textContent = `• [${fase}] → ${nodo}`; // Actualiza contenido en el DOM
    flowLog.appendChild(line);
}

function bindListeners() { // Define función reutilizable
    controller.abort();
    controller = new AbortController();
    const useCapture = chkCapture.checked; // Declara e inicializa variable local
    const opts = { capture: useCapture, signal: controller.signal }; // Declara e inicializa variable local
    const faseLabel = useCapture ? "CAPTURING" : "BUBBLING"; // Declara e inicializa variable local

    abuelo.addEventListener("click", () => { // Registra escuchador de evento en el DOM
        registrar(faseLabel, "Abuelo (Rojo)");
    }, opts);

    padre.addEventListener("click", (e) => { // Registra escuchador de evento en el DOM
        registrar(faseLabel, "Padre (Azul)");
        if (chkStop.checked) { // Evalúa condición lógica
            e.stopPropagation();
            registrar("STOP", "e.stopPropagation() ejecutado en Padre");
        }
    }, opts);

    hijo.addEventListener("click", () => { // Registra escuchador de evento en el DOM
        flowLog.innerHTML = ""; // Actualiza contenido en el DOM
        registrar("TARGET", "Hijo (Botón)");
    }, { signal: controller.signal });
}

chkCapture.addEventListener("change", bindListeners);
document.getElementById("btnClear").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    flowLog.innerHTML = "Haz clic en el botón \"Hijo\" para observar el flujo."; // Actualiza contenido en el DOM
});

bindListeners();

