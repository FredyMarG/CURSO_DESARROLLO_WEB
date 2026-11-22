/**
 * GUÍA INTERACTIVA: BUCLES WHILE, DO...WHILE, BREAK Y CONTINUE
 */

"use strict"; // Activa el modo estricto de JavaScript

const liveConsole = document.getElementById("live-console"); // Obtiene referencia DOM para "liveConsole"

function registrar(mensaje, tipo = "ok") { // Declara función
    const linea = document.createElement("div"); // Crea nuevo elemento DOM "linea"
    linea.className = `log-line ${tipo}`; // Asigna valor
    linea.textContent = `> ${mensaje}`; // Actualiza contenido en el DOM
    liveConsole.append(linea); // Inserta nodo en el DOM
    liveConsole.scrollTop = liveConsole.scrollHeight; // Asigna valor
    console.log(mensaje); // Imprime salida en consola
}

// 1. while vs do...while
document.getElementById("btn-while-cmp").addEventListener("click", () => { // Registra escuchador de eventos
    const limite = Math.min(10, Math.max(0, Number(document.getElementById("input-limite-while").value) || 0)); // Obtiene referencia DOM para "limite"

    const pasosWhile = []; // Declara e inicializa "pasosWhile"
    let i = 0; // Declara e inicializa "i"
    while (i < limite) { // Inicia bucle de iteración
        pasosWhile.push(i); // Ejecuta llamada o método
        i++; // Instrucción JavaScript
    }

    const pasosDo = []; // Declara e inicializa "pasosDo"
    let j = 0; // Declara e inicializa "j"
    do { // Inicia bucle de iteración
        pasosDo.push(j); // Ejecuta llamada o método
        j++; // Instrucción JavaScript
    } while (j < limite); // Ejecuta llamada o método

    document.getElementById("out-while-cmp").textContent =
        `Límite: ${limite}\nwhile:      ${JSON.stringify(pasosWhile)} (${pasosWhile.length} ejecuciones)\ndo...while: ${JSON.stringify(pasosDo)} (${pasosDo.length} ejecuciones)`; // Instrucción JavaScript
    registrar(`while vs do...while con límite=${limite} -> while: ${pasosWhile.length}, do...while: ${pasosDo.length}`); // Ejecuta llamada o método
});

// 2. break y continue
document.getElementById("btn-flow").addEventListener("click", () => { // Registra escuchador de eventos
    const skip = Number(document.getElementById("input-skip").value); // Obtiene referencia DOM para "skip"
    const stop = Number(document.getElementById("input-stop").value); // Obtiene referencia DOM para "stop"

    const resultado = []; // Declara e inicializa "resultado"
    let n = 0; // Declara e inicializa "n"
    while (n < 10) { // Inicia bucle de iteración
        n++; // Instrucción JavaScript
        if (n === skip) continue; // Evalúa condición
        if (n === stop) { // Evalúa condición
            resultado.push(`[BREAK en ${n}]`); // Ejecuta llamada o método
            break; // Instrucción JavaScript
        }
        resultado.push(n); // Ejecuta llamada o método
    }

    document.getElementById("out-flow").textContent = `Salida: ${resultado.join(" → ")}`; // Actualiza contenido en el DOM
    registrar(`Secuencia (skip=${skip}, stop=${stop}): ${resultado.join(", ")}`); // Ejecuta llamada o método
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => { // Registra escuchador de eventos
    liveConsole.replaceChildren(); // Ejecuta llamada o método
});

registrar("Laboratorio de Bucles (while / do...while) listo."); // Ejecuta llamada o método
