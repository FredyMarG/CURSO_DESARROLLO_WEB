/**
 * GUÍA INTERACTIVA: CONSOLE API Y DEBUGGING
 */

"use strict"; // Activa el modo estricto de JavaScript

const liveConsole = document.getElementById("live-console"); // Obtiene referencia DOM para "liveConsole"
let contadorClicks = 0; // Declara e inicializa "contadorClicks"

function registrar(mensaje, tipo = "ok") { // Declara función
    const linea = document.createElement("div"); // Crea nuevo elemento DOM "linea"
    linea.className = `log-line ${tipo}`; // Asigna valor
    linea.textContent = `> ${mensaje}`; // Actualiza contenido en el DOM
    liveConsole.append(linea); // Inserta nodo en el DOM
    liveConsole.scrollTop = liveConsole.scrollHeight; // Asigna valor
}

const usuariosDemo = [
    { id: 1, nombre: "Alice", rol: "Admin" },
    { id: 2, nombre: "Bob", rol: "Editor" },
    { id: 3, nombre: "Carla", rol: "Viewer" }
];

document.querySelectorAll("[data-con]").forEach((btn) => { // Instrucción JavaScript
    btn.addEventListener("click", () => { // Registra escuchador de eventos
        const cmd = btn.dataset.con; // Declara e inicializa "cmd"

        if (cmd === "log") { // Evalúa condición
            const estado = { usuario: "Alice", activo: true }; // Declara e inicializa "estado"
            console.log("Estado actual:", estado); // Imprime salida en consola
            document.getElementById("out-con-niveles").textContent = `console.log("Estado actual:", ${JSON.stringify(estado)})`; // Imprime salida en consola
            registrar(`console.log -> ${JSON.stringify(estado)}`, "ok"); // Imprime salida en consola
        } else if (cmd === "warn") { // Instrucción JavaScript
            console.warn("Advertencia: método próximo a deprecarse."); // Imprime salida en consola
            document.getElementById("out-con-niveles").textContent = "⚠️ console.warn() emitido en amarillo."; // Imprime salida en consola
            registrar("console.warn -> Advertencia emitida.", "warn"); // Imprime salida en consola
        } else if (cmd === "error") { // Instrucción JavaScript
            console.error("Error simulado: No se pudo conectar al servidor."); // Imprime salida en consola
            document.getElementById("out-con-niveles").textContent = "❌ console.error() emitido en rojo con stack trace."; // Imprime salida en consola
            registrar("console.error -> Error simulado emitido.", "err"); // Imprime salida en consola
        } else if (cmd === "assert") { // Instrucción JavaScript
            console.assert(5 < 4, "Fallo de aserción: 5 no es menor que 4"); // Imprime salida en consola
            document.getElementById("out-con-niveles").textContent = "console.assert(5 < 4, ...) -> Condición falsa: registró error."; // Imprime salida en consola
            registrar("console.assert(5 < 4) falló y emitió error.", "err"); // Imprime salida en consola
        } else if (cmd === "table") { // Instrucción JavaScript
            console.table(usuariosDemo, ["nombre", "rol"]); // Imprime salida en consola
            document.getElementById("out-con-estruc").textContent =
                "Tabla enviada a DevTools:\n" + usuariosDemo.map((u) => `${u.id} | ${u.nombre} | ${u.rol}`).join("\n"); // Ejecuta llamada o método
            registrar("console.table(usuariosDemo) renderizada en DevTools."); // Imprime salida en consola
        } else if (cmd === "group") { // Instrucción JavaScript
            console.group("Proceso de Carga"); // Imprime salida en consola
            console.log("1. Validando sesión..."); // Imprime salida en consola
            console.log("2. Descargando perfil..."); // Imprime salida en consola
            console.groupEnd(); // Imprime salida en consola
            document.getElementById("out-con-estruc").textContent = "Grupo 'Proceso de Carga' creado y cerrado con groupEnd()."; // Actualiza contenido en el DOM
            registrar("console.group('Proceso de Carga') ejecutado."); // Imprime salida en consola
        } else if (cmd === "css") { // Instrucción JavaScript
            console.log(
                "%c JS JUNIOR %c Consola estilizada con %c ",
                "background:#06b6d4;color:#083344;font-weight:bold;padding:2px 6px;border-radius:4px;",
                "color:#94a3b8;",
                "color:#34d399;font-weight:bold;"
            );
            document.getElementById("out-con-estruc").textContent = "Mensaje estilizado con %c enviado a DevTools."; // Actualiza contenido en el DOM
            registrar("console.log('%c...') con CSS enviado a DevTools."); // Imprime salida en consola
        } else if (cmd === "time") { // Instrucción JavaScript
            const inicio = performance.now(); // Declara e inicializa "inicio"
            console.time("bucle-500k"); // Imprime salida en consola
            let suma = 0; // Declara e inicializa "suma"
            for (let i = 0; i < 500_000; i++) suma += i; // Inicia bucle de iteración
            console.timeEnd("bucle-500k"); // Imprime salida en consola
            const ms = (performance.now() - inicio).toFixed(2); // Declara e inicializa "ms"
            document.getElementById("out-con-perf").textContent = `Bucle 500,000 iteraciones: ${ms} ms (suma=${suma})`; // Actualiza contenido en el DOM
            registrar(`console.timeEnd('bucle-500k'): ${ms} ms`); // Imprime salida en consola
        } else if (cmd === "count") { // Instrucción JavaScript
            contadorClicks++; // Instrucción JavaScript
            console.count("Botón count"); // Imprime salida en consola
            document.getElementById("out-con-perf").textContent = `Botón count: ${contadorClicks} ejecuciones`; // Actualiza contenido en el DOM
            registrar(`console.count('Botón count'): ${contadorClicks}`); // Imprime salida en consola
        } else if (cmd === "trace") { // Instrucción JavaScript
            console.trace("Trazado de pila desde guía interactiva"); // Imprime salida en consola
            document.getElementById("out-con-perf").textContent = "console.trace() enviado a DevTools (muestra la pila de llamadas)."; // Imprime salida en consola
            registrar("console.trace() emitido en DevTools."); // Imprime salida en consola
        }
    });
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => { // Registra escuchador de eventos
    console.clear(); // Imprime salida en consola
    liveConsole.replaceChildren(); // Ejecuta llamada o método
    registrar("Consola limpiada."); // Ejecuta llamada o método
});

registrar("Laboratorio de Console API listo."); // Ejecuta llamada o método
