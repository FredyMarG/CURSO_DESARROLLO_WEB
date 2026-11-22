// DevTools Lab — Pestaña Console

const consoleMirror = document.getElementById("consoleMirror"); // Obtiene referencia DOM para "consoleMirror"
const usuarios = [
    { id: 1, nombre: "Ana", nivel: "Senior" },
    { id: 2, nombre: "Luis", nivel: "Mid" }
];

document.querySelectorAll("[data-cmd]").forEach((btn) => { // Instrucción JavaScript
    btn.addEventListener("click", () => { // Registra escuchador de eventos
        const cmd = btn.dataset.cmd; // Declara e inicializa "cmd"

        if (cmd === "log") { // Evalúa condición
            console.log("Log informativo:", { fecha: new Date().toISOString() }); // Imprime salida en consola
            consoleMirror.textContent = "console.log() enviado a DevTools."; // Imprime salida en consola
        } else if (cmd === "warn") { // Instrucción JavaScript
            console.warn("Advertencia: Este endpoint se deprecará pronto."); // Imprime salida en consola
            consoleMirror.textContent = "console.warn() enviado (resaltado en amarillo)."; // Imprime salida en consola
        } else if (cmd === "error") { // Instrucción JavaScript
            console.error("Error simulado: Fallo de validación."); // Imprime salida en consola
            consoleMirror.textContent = "console.error() enviado con stack trace."; // Imprime salida en consola
        } else if (cmd === "table") { // Instrucción JavaScript
            console.table(usuarios); // Imprime salida en consola
            consoleMirror.textContent = `console.table() enviado:\n${JSON.stringify(usuarios, null, 2)}`; // Imprime salida en consola
        } else if (cmd === "time") { // Instrucción JavaScript
            console.time("calculo"); // Imprime salida en consola
            let total = 0; // Declara e inicializa "total"
            for (let i = 0; i < 100000; i++) total += i; // Inicia bucle de iteración
            console.timeEnd("calculo"); // Imprime salida en consola
            consoleMirror.textContent = `Medición completada (ver tiempo exacto en Console). Suma: ${total}`; // Actualiza contenido en el DOM
        } else if (cmd === "group") { // Instrucción JavaScript
            console.groupCollapsed("Grupo de Autenticación"); // Imprime salida en consola
            console.log("Paso 1: Validar token"); // Imprime salida en consola
            console.log("Paso 2: Cargar permisos"); // Imprime salida en consola
            console.groupEnd(); // Imprime salida en consola
            consoleMirror.textContent = "Grupo colapsado creado en Console."; // Actualiza contenido en el DOM
        }
    });
});
