/**
 * GUÍA INTERACTIVA: CONSOLE API Y DEBUGGING
 */

"use strict";

const liveConsole = document.getElementById("live-console");
let contadorClicks = 0;

function registrar(mensaje, tipo = "ok") {
    const linea = document.createElement("div");
    linea.className = `log-line ${tipo}`;
    linea.textContent = `> ${mensaje}`;
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
            console.log("Estado actual:", estado);
            document.getElementById("out-con-niveles").textContent = `console.log("Estado actual:", ${JSON.stringify(estado)})`;
            registrar(`console.log -> ${JSON.stringify(estado)}`, "ok");
        } else if (cmd === "warn") {
            console.warn("Advertencia: método próximo a deprecarse.");
            document.getElementById("out-con-niveles").textContent = "⚠️ console.warn() emitido en amarillo.";
            registrar("console.warn -> Advertencia emitida.", "warn");
        } else if (cmd === "error") {
            console.error("Error simulado: No se pudo conectar al servidor.");
            document.getElementById("out-con-niveles").textContent = "❌ console.error() emitido en rojo con stack trace.";
            registrar("console.error -> Error simulado emitido.", "err");
        } else if (cmd === "assert") {
            console.assert(5 < 4, "Fallo de aserción: 5 no es menor que 4");
            document.getElementById("out-con-niveles").textContent = "console.assert(5 < 4, ...) -> Condición falsa: registró error.";
            registrar("console.assert(5 < 4) falló y emitió error.", "err");
        } else if (cmd === "table") {
            console.table(usuariosDemo, ["nombre", "rol"]);
            document.getElementById("out-con-estruc").textContent =
                "Tabla enviada a DevTools:\n" + usuariosDemo.map((u) => `${u.id} | ${u.nombre} | ${u.rol}`).join("\n");
            registrar("console.table(usuariosDemo) renderizada en DevTools.");
        } else if (cmd === "group") {
            console.group("Proceso de Carga");
            console.log("1. Validando sesión...");
            console.log("2. Descargando perfil...");
            console.groupEnd();
            document.getElementById("out-con-estruc").textContent = "Grupo 'Proceso de Carga' creado y cerrado con groupEnd().";
            registrar("console.group('Proceso de Carga') ejecutado.");
        } else if (cmd === "css") {
            console.log(
                "%c JS JUNIOR %c Consola estilizada con %c ",
                "background:#06b6d4;color:#083344;font-weight:bold;padding:2px 6px;border-radius:4px;",
                "color:#94a3b8;",
                "color:#34d399;font-weight:bold;"
            );
            document.getElementById("out-con-estruc").textContent = "Mensaje estilizado con %c enviado a DevTools.";
            registrar("console.log('%c...') con CSS enviado a DevTools.");
        } else if (cmd === "time") {
            const inicio = performance.now();
            console.time("bucle-500k");
            let suma = 0;
            for (let i = 0; i < 500_000; i++) suma += i;
            console.timeEnd("bucle-500k");
            const ms = (performance.now() - inicio).toFixed(2);
            document.getElementById("out-con-perf").textContent = `Bucle 500,000 iteraciones: ${ms} ms (suma=${suma})`;
            registrar(`console.timeEnd('bucle-500k'): ${ms} ms`);
        } else if (cmd === "count") {
            contadorClicks++;
            console.count("Botón count");
            document.getElementById("out-con-perf").textContent = `Botón count: ${contadorClicks} ejecuciones`;
            registrar(`console.count('Botón count'): ${contadorClicks}`);
        } else if (cmd === "trace") {
            console.trace("Trazado de pila desde guía interactiva");
            document.getElementById("out-con-perf").textContent = "console.trace() enviado a DevTools (muestra la pila de llamadas).";
            registrar("console.trace() emitido en DevTools.");
        }
    });
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => {
    console.clear();
    liveConsole.replaceChildren();
    registrar("Consola limpiada.");
});

registrar("Laboratorio de Console API listo.");
