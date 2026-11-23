/**
 * GUÍA INTERACTIVA: CONSOLE API Y DEBUGGING
 */

"use strict"; // Activa el modo estricto de JavaScript

const liveConsole = document.getElementById("live-console");
let contadorClicks = 0;

function registrar(mensaje, tipo = "ok") {
    const linea = document.createElement("div");
    linea.className = `log-line ${tipo}`;
    linea.textContent = `> ${mensaje}`; // Actualiza contenido en el DOM
    liveConsole.append(linea);
    liveConsole.scrollTop = liveConsole.scrollHeight;
}

const usuariosDemo = [
    { id: 1, nombre: "Alice", rol: "Admin" },
    { id: 2, nombre: "Bob", rol: "Editor" },
    { id: 3, nombre: "Carla", rol: "Viewer" }
];

document.querySelectorAll("[data-con]").forEach((btn) => {
    btn.addEventListener("click", () => {
        const cmd = btn.dataset.con;

        if (cmd === "log") {
            const estado = { usuario: "Alice", activo: true };
            console.log("Estado actual:", estado); // Imprime salida en consola
            document.getElementById("out-con-niveles").textContent = `console.log("Estado actual:", ${JSON.stringify(estado)})`; // Imprime salida en consola
            registrar(`console.log -> ${JSON.stringify(estado)}`, "ok"); // Imprime salida en consola
        } else if (cmd === "warn") {
            console.warn("Advertencia: método próximo a deprecarse."); // Imprime salida en consola
            document.getElementById("out-con-niveles").textContent = "⚠️ console.warn() emitido en amarillo."; // Imprime salida en consola
            registrar("console.warn -> Advertencia emitida.", "warn"); // Imprime salida en consola
        } else if (cmd === "error") {
            console.error("Error simulado: No se pudo conectar al servidor."); // Imprime salida en consola
            document.getElementById("out-con-niveles").textContent = "❌ console.error() emitido en rojo con stack trace."; // Imprime salida en consola
            registrar("console.error -> Error simulado emitido.", "err"); // Imprime salida en consola
        } else if (cmd === "assert") {
            console.assert(5 < 4, "Fallo de aserción: 5 no es menor que 4"); // Imprime salida en consola
            document.getElementById("out-con-niveles").textContent = "console.assert(5 < 4, ...) -> Condición falsa: registró error."; // Imprime salida en consola
            registrar("console.assert(5 < 4) falló y emitió error.", "err"); // Imprime salida en consola
        } else if (cmd === "table") {
            console.table(usuariosDemo, ["nombre", "rol"]); // Imprime salida en consola
            document.getElementById("out-con-estruc").textContent =
                "Tabla enviada a DevTools:\n" + usuariosDemo.map((u) => `${u.id} | ${u.nombre} | ${u.rol}`).join("\n");
            registrar("console.table(usuariosDemo) renderizada en DevTools."); // Imprime salida en consola
        } else if (cmd === "group") {
            console.group("Proceso de Carga"); // Imprime salida en consola
            console.log("1. Validando sesión..."); // Imprime salida en consola
            console.log("2. Descargando perfil..."); // Imprime salida en consola
            console.groupEnd(); // Imprime salida en consola
            document.getElementById("out-con-estruc").textContent = "Grupo 'Proceso de Carga' creado y cerrado con groupEnd()."; // Actualiza contenido en el DOM
            registrar("console.group('Proceso de Carga') ejecutado."); // Imprime salida en consola
        } else if (cmd === "css") {
            console.log(
                "%c JS JUNIOR %c Consola estilizada con %c ",
                "background:#06b6d4;color:#083344;font-weight:bold;padding:2px 6px;border-radius:4px;",
                "color:#94a3b8;",
                "color:#34d399;font-weight:bold;"
            );
            document.getElementById("out-con-estruc").textContent = "Mensaje estilizado con %c enviado a DevTools."; // Actualiza contenido en el DOM
            registrar("console.log('%c...') con CSS enviado a DevTools."); // Imprime salida en consola
        } else if (cmd === "time") {
            const inicio = performance.now();
            console.time("bucle-500k"); // Imprime salida en consola
            let suma = 0;
            for (let i = 0; i < 500_000; i++) suma += i;
            console.timeEnd("bucle-500k"); // Imprime salida en consola
            const ms = (performance.now() - inicio).toFixed(2);
            document.getElementById("out-con-perf").textContent = `Bucle 500,000 iteraciones: ${ms} ms (suma=${suma})`; // Actualiza contenido en el DOM
            registrar(`console.timeEnd('bucle-500k'): ${ms} ms`); // Imprime salida en consola
        } else if (cmd === "count") {
            contadorClicks++;
            console.count("Botón count"); // Imprime salida en consola
            document.getElementById("out-con-perf").textContent = `Botón count: ${contadorClicks} ejecuciones`; // Actualiza contenido en el DOM
            registrar(`console.count('Botón count'): ${contadorClicks}`); // Imprime salida en consola
        } else if (cmd === "trace") {
            console.trace("Trazado de pila desde guía interactiva"); // Imprime salida en consola
            document.getElementById("out-con-perf").textContent = "console.trace() enviado a DevTools (muestra la pila de llamadas)."; // Imprime salida en consola
            registrar("console.trace() emitido en DevTools."); // Imprime salida en consola
        }
    });
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => {
    console.clear(); // Imprime salida en consola
    liveConsole.replaceChildren();
    registrar("Consola limpiada.");
});

registrar("Laboratorio de Console API listo.");
