/**
 * GUÍA INTERACTIVA: BUCLES WHILE, DO...WHILE, BREAK Y CONTINUE
 */

"use strict"; // Activa el modo estricto de JavaScript

const liveConsole = document.getElementById("live-console"); // Declara e inicializa variable local

function registrar(mensaje, tipo = "ok") { // Define función reutilizable
    const linea = document.createElement("div"); // Declara e inicializa variable local
    linea.className = `log-line ${tipo}`;
    linea.textContent = `> ${mensaje}`; // Actualiza contenido en el DOM
    liveConsole.append(linea);
    liveConsole.scrollTop = liveConsole.scrollHeight;
    console.log(mensaje); // Imprime salida en consola
}

// 1. while vs do...while
document.getElementById("btn-while-cmp").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    const limite = Math.min(10, Math.max(0, Number(document.getElementById("input-limite-while").value) || 0)); // Declara e inicializa variable local

    const pasosWhile = []; // Declara e inicializa variable local
    let i = 0; // Declara e inicializa variable local
    while (i < limite) { // Ejecuta bucle mientras se cumpla la condición
        pasosWhile.push(i);
        i++;
    }

    const pasosDo = []; // Declara e inicializa variable local
    let j = 0; // Declara e inicializa variable local
    do {
        pasosDo.push(j);
        j++;
    } while (j < limite);

    document.getElementById("out-while-cmp").textContent =
        `Límite: ${limite}\nwhile:      ${JSON.stringify(pasosWhile)} (${pasosWhile.length} ejecuciones)\ndo...while: ${JSON.stringify(pasosDo)} (${pasosDo.length} ejecuciones)`;
    registrar(`while vs do...while con límite=${limite} -> while: ${pasosWhile.length}, do...while: ${pasosDo.length}`);
});

// 2. break y continue
document.getElementById("btn-flow").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    const skip = Number(document.getElementById("input-skip").value); // Declara e inicializa variable local
    const stop = Number(document.getElementById("input-stop").value); // Declara e inicializa variable local

    const resultado = []; // Declara e inicializa variable local
    let n = 0; // Declara e inicializa variable local
    while (n < 10) { // Ejecuta bucle mientras se cumpla la condición
        n++;
        if (n === skip) continue; // Evalúa condición lógica
        if (n === stop) { // Evalúa condición lógica
            resultado.push(`[BREAK en ${n}]`);
            break;
        }
        resultado.push(n);
    }

    document.getElementById("out-flow").textContent = `Salida: ${resultado.join(" → ")}`; // Actualiza contenido en el DOM
    registrar(`Secuencia (skip=${skip}, stop=${stop}): ${resultado.join(", ")}`);
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    liveConsole.replaceChildren();
});

registrar("Laboratorio de Bucles (while / do...while) listo.");

