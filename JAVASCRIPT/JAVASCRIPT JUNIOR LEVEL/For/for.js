/**
 * GUÍA INTERACTIVA: FOR, FOR...OF, FOR...IN Y LABELS
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

// 1. for clásico
document.getElementById("btn-tabla").addEventListener("click", () => { // Registra escuchador de eventos
    const base = Number(document.getElementById("input-tabla-num").value) || 1; // Obtiene referencia DOM para "base"
    const lineas = []; // Declara e inicializa "lineas"
    for (let i = 1; i <= 5; i++) { // Inicia bucle de iteración
        lineas.push(`${base} x ${i} = ${base * i}`); // Ejecuta llamada o método
    }
    document.getElementById("out-tabla").textContent = lineas.join("\n"); // Actualiza contenido en el DOM
    registrar(`Tabla del ${base} generada con bucle for.`); // Ejecuta llamada o método
});

// 2. for...of vs for...in vs Object.entries
const animales = ["gato", "perro", "loro"]; // Declara e inicializa "animales"

document.getElementById("btn-for-of").addEventListener("click", () => { // Registra escuchador de eventos
    const pasos = []; // Declara e inicializa "pasos"
    for (const [indice, animal] of animales.entries()) { // Inicia bucle de iteración
        pasos.push(`[${indice}] => "${animal}"`); // Ejecuta llamada o método
    }
    document.getElementById("out-for-comp").textContent =
        `for...of con .entries() (Valores reales):\n${pasos.join("\n")}`; // Instrucción JavaScript
    registrar("for...of ejecutado sobre array de animales."); // Ejecuta llamada o método
});

document.getElementById("btn-for-in").addEventListener("click", () => { // Registra escuchador de eventos
    const copia = [...animales]; // Declara e inicializa "copia"
    copia.extra = "propiedad_ajena"; // Demostración de por qué evitar for...in en arrays
    const pasos = []; // Declara e inicializa "pasos"
    for (const clave in copia) { // Inicia bucle de iteración
        pasos.push(`clave "${clave}" => ${copia[clave]}`); // Ejecuta llamada o método
    }
    document.getElementById("out-for-comp").textContent =
        `for...in (⚠️ incluye propiedades extra en arrays):\n${pasos.join("\n")}`; // Instrucción JavaScript
    registrar("for...in capturó índices como strings + propiedad extra.", "warn"); // Ejecuta llamada o método
});

document.getElementById("btn-entries").addEventListener("click", () => { // Registra escuchador de eventos
    const perfil = { nombre: "Carlos", nivel: "Junior", activo: true }; // Declara e inicializa "perfil"
    const pasos = []; // Declara e inicializa "pasos"
    for (const [clave, valor] of Object.entries(perfil)) { // Inicia bucle de iteración
        pasos.push(`${clave}: ${valor}`); // Ejecuta llamada o método
    }
    document.getElementById("out-for-comp").textContent =
        `Object.entries(perfil) + for...of (Recomendado para objetos):\n${pasos.join("\n")}`; // Instrucción JavaScript
    registrar("Object.entries() + for...of ejecutado sobre objeto."); // Ejecuta llamada o método
});

// 3. Labels en bucles anidados
const grupos = [
    ["pedro", "marcelo"],
    ["maria", "josefa", "roberta"],
    ["josefina", "lucas"]
];

document.getElementById("btn-label").addEventListener("click", () => { // Registra escuchador de eventos
    const objetivo = document.getElementById("input-buscar-label").value.trim().toLowerCase(); // Obtiene referencia DOM para "objetivo"
    const visitados = []; // Declara e inicializa "visitados"
    let encontrado = false; // Declara e inicializa "encontrado"

    bucleExterno:
    for (let i = 0; i < grupos.length; i++) { // Inicia bucle de iteración
        for (let j = 0; j < grupos[i].length; j++) { // Inicia bucle de iteración
            const actual = grupos[i][j]; // Declara e inicializa "actual"
            visitados.push(`[${i}][${j}] ${actual}`); // Ejecuta llamada o método
            if (actual === objetivo) { // Evalúa condición
                encontrado = true; // Asigna valor
                break bucleExterno; // Instrucción JavaScript
            }
        }
    }

    document.getElementById("out-label").textContent =
        `Buscando "${objetivo}": ${encontrado ? "✅ ENCONTRADO (break bucleExterno)" : "❌ No existe"}\nRecorrido:\n${visitados.join(" -> ")}`; // Instrucción JavaScript
    registrar(`Búsqueda con label ("${objetivo}"): ${encontrado ? "encontrado" : "no encontrado"}`); // Ejecuta llamada o método
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => { // Registra escuchador de eventos
    liveConsole.replaceChildren(); // Ejecuta llamada o método
});

registrar("Laboratorio de For y Labels listo."); // Ejecuta llamada o método
