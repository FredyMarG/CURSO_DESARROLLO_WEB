/**
 * GUÍA INTERACTIVA: ESTRUCTURAS CONDICIONALES
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

// 1. if / else if / else + Ternario
document.getElementById("btn-eval-hora").addEventListener("click", () => { // Registra escuchador de eventos
    const hora = Number(document.getElementById("input-hora").value); // Obtiene referencia DOM para "hora"
    const out = document.getElementById("out-hora"); // Obtiene referencia DOM para "out"

    if (Number.isNaN(hora) || hora < 0 || hora > 23) { // Evalúa condición
        out.textContent = "❌ Ingresa una hora válida entre 0 y 23."; // Actualiza contenido en el DOM
        registrar("Hora fuera de rango (0-23).", "err"); // Ejecuta llamada o método
        return; // Retorna resultado
    }

    let saludo = ""; // Declara e inicializa "saludo"
    if (hora < 12) saludo = "Buenos días ☀️"; // Evalúa condición
    else if (hora <= 18) saludo = "Buenas tardes 🌤️"; // Evalúa condición alternativa
    else saludo = "Buenas noches 🌙"; // Rama alternativa

    const jornada = hora >= 6 && hora < 19 ? "Horario diurno" : "Horario nocturno"; // Declara e inicializa "jornada"
    out.textContent = `Hora: ${hora}:00\nSaludo (if/else): ${saludo}\nTernario: ${jornada}`; // Actualiza contenido en el DOM
    registrar(`Hora ${hora} -> ${saludo} (${jornada})`); // Ejecuta llamada o método
});

// 2. Switch vs Diccionario
document.getElementById("btn-eval-rol").addEventListener("click", () => { // Registra escuchador de eventos
    const rol = document.getElementById("select-rol").value; // Obtiene referencia DOM para "rol"
    let permisoSwitch = ""; // Declara e inicializa "permisoSwitch"

    switch (rol) { // Evalúa múltiples casos
        case "admin":
            permisoSwitch = "Acceso total al sistema"; // Asigna valor
            break; // Instrucción JavaScript
        case "editor":
        case "moderador":
            permisoSwitch = "Edición y moderación de contenido"; // Asigna valor
            break; // Instrucción JavaScript
        case "invitado":
            permisoSwitch = "Solo lectura"; // Asigna valor
            break; // Instrucción JavaScript
        default:
            permisoSwitch = "Sin permisos asignados"; // Asigna valor
    }

    const mapa = { // Declara e inicializa "mapa"
        admin: "Acceso total al sistema",
        editor: "Edición y moderación de contenido",
        moderador: "Edición y moderación de contenido",
        invitado: "Solo lectura"
    };
    const permisoMapa = mapa[rol] ?? "Sin permisos asignados"; // Declara e inicializa "permisoMapa"

    document.getElementById("out-rol").textContent =
        `Rol: "${rol}"\nResultado switch: ${permisoSwitch}\nResultado diccionario: ${permisoMapa}`; // Instrucción JavaScript
    registrar(`Rol "${rol}" -> ${permisoSwitch}`); // Ejecuta llamada o método
});

// 3. Truthy vs Falsy
const muestrasTruthy = { // Declara e inicializa "muestrasTruthy"
    empty_str: { val: "", label: '""' },
    zero_str: { val: "0", label: '"0"' },
    zero: { val: 0, label: "0" },
    empty_arr: { val: [], label: "[]" },
    empty_obj: { val: {}, label: "{}" },
    null: { val: null, label: "null" },
    nan: { val: NaN, label: "NaN" }
};

document.getElementById("btn-eval-truthy").addEventListener("click", () => { // Registra escuchador de eventos
    const item = muestrasTruthy[document.getElementById("select-truthy").value]; // Obtiene referencia DOM para "item"
    const esTruthy = Boolean(item.val); // Declara e inicializa "esTruthy"

    document.getElementById("out-truthy").textContent =
        `Valor: ${item.label}\nBoolean(valor): ${esTruthy}\nClasificación: ${esTruthy ? "✅ TRUTHY (entra al if)" : "❌ FALSY (entra al else)"}`; // Instrucción JavaScript
    registrar(`${item.label} es ${esTruthy ? "Truthy" : "Falsy"}`, esTruthy ? "ok" : "warn"); // Ejecuta llamada o método
});

// 4. Cláusulas de guarda (Early Return)
function verificarAcceso(edad, tieneEntrada) { // Declara función
    if (Number.isNaN(edad) || edad < 0) return { ok: false, msg: "❌ Edad inválida." }; // Evalúa condición
    if (edad < 18) return { ok: false, msg: "⛔ Denegado: debes ser mayor de 18 años." }; // Evalúa condición
    if (!tieneEntrada) return { ok: false, msg: "⛔ Denegado: necesitas una entrada válida." }; // Evalúa condición
    return { ok: true, msg: "✅ Acceso concedido. ¡Bienvenido al evento!" }; // Retorna resultado
}

document.getElementById("btn-eval-acceso").addEventListener("click", () => { // Registra escuchador de eventos
    const edad = Number(document.getElementById("input-edad-acceso").value); // Obtiene referencia DOM para "edad"
    const tieneEntrada = document.getElementById("chk-entrada").checked; // Obtiene referencia DOM para "tieneEntrada"
    const res = verificarAcceso(edad, tieneEntrada); // Declara e inicializa "res"

    document.getElementById("out-acceso").textContent = res.msg; // Actualiza contenido en el DOM
    registrar(`Validar acceso (edad=${edad}, entrada=${tieneEntrada}) -> ${res.msg}`, res.ok ? "ok" : "warn"); // Ejecuta llamada o método
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => { // Registra escuchador de eventos
    liveConsole.replaceChildren(); // Ejecuta llamada o método
});

registrar("Laboratorio de Condicionales listo."); // Ejecuta llamada o método
