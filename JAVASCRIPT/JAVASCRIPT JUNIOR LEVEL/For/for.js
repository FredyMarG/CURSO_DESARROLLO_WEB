/**
 * GUÍA INTERACTIVA: FOR, FOR...OF, FOR...IN Y LABELS
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

// 1. for clásico
document.getElementById("btn-tabla").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    const base = Number(document.getElementById("input-tabla-num").value) || 1; // Declara e inicializa variable local
    const lineas = []; // Declara e inicializa variable local
    for (let i = 1; i <= 5; i++) { // Itera sobre elementos o rango
        lineas.push(`${base} x ${i} = ${base * i}`);
    }
    document.getElementById("out-tabla").textContent = lineas.join("\n"); // Actualiza contenido en el DOM
    registrar(`Tabla del ${base} generada con bucle for.`);
});

// 2. for...of vs for...in vs Object.entries
const animales = ["gato", "perro", "loro"]; // Declara e inicializa variable local

document.getElementById("btn-for-of").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    const pasos = []; // Declara e inicializa variable local
    for (const [indice, animal] of animales.entries()) { // Itera sobre elementos o rango
        pasos.push(`[${indice}] => "${animal}"`);
    }
    document.getElementById("out-for-comp").textContent =
        `for...of con .entries() (Valores reales):\n${pasos.join("\n")}`;
    registrar("for...of ejecutado sobre array de animales.");
});

document.getElementById("btn-for-in").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    const copia = [...animales]; // Declara e inicializa variable local
    copia.extra = "propiedad_ajena"; // Demostración de por qué evitar for...in en arrays
    const pasos = []; // Declara e inicializa variable local
    for (const clave in copia) { // Itera sobre elementos o rango
        pasos.push(`clave "${clave}" => ${copia[clave]}`);
    }
    document.getElementById("out-for-comp").textContent =
        `for...in (⚠️ incluye propiedades extra en arrays):\n${pasos.join("\n")}`;
    registrar("for...in capturó índices como strings + propiedad extra.", "warn");
});

document.getElementById("btn-entries").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    const perfil = { nombre: "Carlos", nivel: "Junior", activo: true }; // Declara e inicializa variable local
    const pasos = []; // Declara e inicializa variable local
    for (const [clave, valor] of Object.entries(perfil)) { // Itera sobre elementos o rango
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

document.getElementById("btn-label").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    const objetivo = document.getElementById("input-buscar-label").value.trim().toLowerCase(); // Declara e inicializa variable local
    const visitados = []; // Declara e inicializa variable local
    let encontrado = false; // Declara e inicializa variable local

    bucleExterno:
    for (let i = 0; i < grupos.length; i++) { // Itera sobre elementos o rango
        for (let j = 0; j < grupos[i].length; j++) { // Itera sobre elementos o rango
            const actual = grupos[i][j]; // Declara e inicializa variable local
            visitados.push(`[${i}][${j}] ${actual}`);
            if (actual === objetivo) { // Evalúa condición lógica
                encontrado = true;
                break bucleExterno;
            }
        }
    }

    document.getElementById("out-label").textContent =
        `Buscando "${objetivo}": ${encontrado ? "✅ ENCONTRADO (break bucleExterno)" : "❌ No existe"}\nRecorrido:\n${visitados.join(" -> ")}`;
    registrar(`Búsqueda con label ("${objetivo}"): ${encontrado ? "encontrado" : "no encontrado"}`);
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    liveConsole.replaceChildren();
});

registrar("Laboratorio de For y Labels listo.");

