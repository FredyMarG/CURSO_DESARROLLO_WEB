// Guía Interactiva — Event Flow (Capturing & Bubbling)

const abuelo = document.getElementById("abuelo"); // Obtiene referencia DOM para "abuelo"
const padre = document.getElementById("padre"); // Obtiene referencia DOM para "padre"
const hijo = document.getElementById("hijo"); // Obtiene referencia DOM para "hijo"
const chkCapture = document.getElementById("chkCapture"); // Obtiene referencia DOM para "chkCapture"
const chkStop = document.getElementById("chkStop"); // Obtiene referencia DOM para "chkStop"
const flowLog = document.getElementById("flowLog"); // Obtiene referencia DOM para "flowLog"

let controller = new AbortController(); // Declara e inicializa "controller"

function registrar(fase, nodo) { // Declara función
    const line = document.createElement("div"); // Crea nuevo elemento DOM "line"
    line.textContent = `• [${fase}] → ${nodo}`; // Actualiza contenido en el DOM
    flowLog.appendChild(line); // Inserta nodo en el DOM
}

function bindListeners() { // Declara función
    controller.abort(); // Ejecuta llamada o método
    controller = new AbortController(); // Asigna valor
    const useCapture = chkCapture.checked; // Declara e inicializa "useCapture"
    const opts = { capture: useCapture, signal: controller.signal }; // Declara e inicializa "opts"
    const faseLabel = useCapture ? "CAPTURING" : "BUBBLING"; // Declara e inicializa "faseLabel"

    abuelo.addEventListener("click", () => { // Registra escuchador de eventos
        registrar(faseLabel, "Abuelo (Rojo)"); // Ejecuta llamada o método
    }, opts); // Ejecuta llamada o método

    padre.addEventListener("click", (e) => { // Registra escuchador de eventos
        registrar(faseLabel, "Padre (Azul)"); // Ejecuta llamada o método
        if (chkStop.checked) { // Evalúa condición
            e.stopPropagation(); // Ejecuta llamada o método
            registrar("STOP", "e.stopPropagation() ejecutado en Padre"); // Ejecuta llamada o método
        }
    }, opts); // Ejecuta llamada o método

    hijo.addEventListener("click", () => { // Registra escuchador de eventos
        flowLog.innerHTML = ""; // Actualiza contenido en el DOM
        registrar("TARGET", "Hijo (Botón)"); // Ejecuta llamada o método
    }, { signal: controller.signal }); // Ejecuta llamada o método
}

chkCapture.addEventListener("change", bindListeners); // Registra escuchador de eventos
document.getElementById("btnClear").addEventListener("click", () => { // Registra escuchador de eventos
    flowLog.innerHTML = "Haz clic en el botón \"Hijo\" para observar el flujo."; // Actualiza contenido en el DOM
});

bindListeners(); // Ejecuta llamada o método
