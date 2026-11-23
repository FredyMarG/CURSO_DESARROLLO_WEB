/**
 * GUÍA INTERACTIVA: FOR, FOR...OF, FOR...IN Y LABELS
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

// 1. for clásico
document.getElementById("btn-tabla").addEventListener("click", () => {
    const base = Number(document.getElementById("input-tabla-num").value) || 1;
    const lineas = [];
    for (let i = 1; i <= 5; i++) {
        lineas.push(`${base} x ${i} = ${base * i}`);
    }
    document.getElementById("out-tabla").textContent = lineas.join("\n"); // Actualiza contenido en el DOM
    registrar(`Tabla del ${base} generada con bucle for.`);
});

// 2. for...of vs for...in vs Object.entries
const animales = ["gato", "perro", "loro"];

document.getElementById("btn-for-of").addEventListener("click", () => {
    const pasos = [];
    for (const [indice, animal] of animales.entries()) {
        pasos.push(`[${indice}] => "${animal}"`);
    }
    document.getElementById("out-for-comp").textContent =
        `for...of con .entries() (Valores reales):\n${pasos.join("\n")}`;
    registrar("for...of ejecutado sobre array de animales.");
});

document.getElementById("btn-for-in").addEventListener("click", () => {
    const copia = [...animales];
    copia.extra = "propiedad_ajena"; // Demostración de por qué evitar for...in en arrays
    const pasos = [];
    for (const clave in copia) {
        pasos.push(`clave "${clave}" => ${copia[clave]}`);
    }
    document.getElementById("out-for-comp").textContent =
        `for...in (⚠️ incluye propiedades extra en arrays):\n${pasos.join("\n")}`;
    registrar("for...in capturó índices como strings + propiedad extra.", "warn");
});

document.getElementById("btn-entries").addEventListener("click", () => {
    const perfil = { nombre: "Carlos", nivel: "Junior", activo: true };
    const pasos = [];
    for (const [clave, valor] of Object.entries(perfil)) {
        pasos.push(`${clave}: ${valor}`);
    }
    document.getElementById("out-for-comp").textContent =
        `Object.entries(perfil) + for...of (Recomendado para objetos):\n${pasos.join("\n")}`;
    registrar("Object.entries() + for...of ejecutado sobre objeto.");
});

// 3. Labels en bucles anidados
const grupos = [
    ["pedro", "marcelo"],
    ["maria", "josefa", "roberta"],
    ["josefina", "lucas"]
];

document.getElementById("btn-label").addEventListener("click", () => {
    const objetivo = document.getElementById("input-buscar-label").value.trim().toLowerCase();
    const visitados = [];
    let encontrado = false;

    bucleExterno:
    for (let i = 0; i < grupos.length; i++) {
        for (let j = 0; j < grupos[i].length; j++) {
            const actual = grupos[i][j];
            visitados.push(`[${i}][${j}] ${actual}`);
            if (actual === objetivo) {
                encontrado = true;
                break bucleExterno;
            }
        }
    }

    document.getElementById("out-label").textContent =
        `Buscando "${objetivo}": ${encontrado ? "✅ ENCONTRADO (break bucleExterno)" : "❌ No existe"}\nRecorrido:\n${visitados.join(" -> ")}`;
    registrar(`Búsqueda con label ("${objetivo}"): ${encontrado ? "encontrado" : "no encontrado"}`);
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => {
    liveConsole.replaceChildren();
});

registrar("Laboratorio de For y Labels listo.");
