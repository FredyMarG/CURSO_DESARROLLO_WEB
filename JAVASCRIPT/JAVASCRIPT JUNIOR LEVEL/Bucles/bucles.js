/**
 * GUÍA INTERACTIVA: BUCLES WHILE, DO...WHILE, BREAK Y CONTINUE
 */

"use strict"; // Activa el modo estricto de JavaScript

const liveConsole = document.getElementById("live-console");

function registrar(mensaje, tipo = "ok") {
    const linea = document.createElement("div");
    linea.className = `log-line ${tipo}`;
    linea.textContent = `> ${mensaje}`; // Actualiza contenido en el DOM
    liveConsole.append(linea);
    liveConsole.scrollTop = liveConsole.scrollHeight;
    console.log(mensaje); // Imprime salida en consola
}

// 1. while vs do...while
document.getElementById("btn-while-cmp").addEventListener("click", () => {
    const limite = Math.min(10, Math.max(0, Number(document.getElementById("input-limite-while").value) || 0));

    const pasosWhile = [];
    let i = 0;
    while (i < limite) {
        pasosWhile.push(i);
        i++;
    }

    const pasosDo = [];
    let j = 0;
    do {
        pasosDo.push(j);
        j++;
    } while (j < limite);

    document.getElementById("out-while-cmp").textContent =
        `Límite: ${limite}\nwhile:      ${JSON.stringify(pasosWhile)} (${pasosWhile.length} ejecuciones)\ndo...while: ${JSON.stringify(pasosDo)} (${pasosDo.length} ejecuciones)`;
    registrar(`while vs do...while con límite=${limite} -> while: ${pasosWhile.length}, do...while: ${pasosDo.length}`);
});

// 2. break y continue
document.getElementById("btn-flow").addEventListener("click", () => {
    const skip = Number(document.getElementById("input-skip").value);
    const stop = Number(document.getElementById("input-stop").value);

    const resultado = [];
    let n = 0;
    while (n < 10) {
        n++;
        if (n === skip) continue;
        if (n === stop) {
            resultado.push(`[BREAK en ${n}]`);
            break;
        }
        resultado.push(n);
    }

    document.getElementById("out-flow").textContent = `Salida: ${resultado.join(" → ")}`; // Actualiza contenido en el DOM
    registrar(`Secuencia (skip=${skip}, stop=${stop}): ${resultado.join(", ")}`);
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => {
    liveConsole.replaceChildren();
});

registrar("Laboratorio de Bucles (while / do...while) listo.");
