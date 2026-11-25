/**
 * GUÍA INTERACTIVA: ESTRUCTURAS CONDICIONALES
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

// 1. if / else if / else + Ternario
document.getElementById("btn-eval-hora").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    const hora = Number(document.getElementById("input-hora").value); // Declara e inicializa variable local
    const out = document.getElementById("out-hora"); // Declara e inicializa variable local

    if (Number.isNaN(hora) || hora < 0 || hora > 23) { // Evalúa condición lógica
        out.textContent = "❌ Ingresa una hora válida entre 0 y 23."; // Actualiza contenido en el DOM
        registrar("Hora fuera de rango (0-23).", "err");
        return; // Retorna el resultado de la función
    }

    let saludo = ""; // Declara e inicializa variable local
    if (hora < 12) saludo = "Buenos días ☀️"; // Evalúa condición lógica
    else if (hora <= 18) saludo = "Buenas tardes 🌤️"; // Evalúa condición alternativa
    else saludo = "Buenas noches 🌙"; // Rama alternativa

    const jornada = hora >= 6 && hora < 19 ? "Horario diurno" : "Horario nocturno"; // Declara e inicializa variable local
    out.textContent = `Hora: ${hora}:00\nSaludo (if/else): ${saludo}\nTernario: ${jornada}`; // Actualiza contenido en el DOM
    registrar(`Hora ${hora} -> ${saludo} (${jornada})`);
});

// 2. Switch vs Diccionario
document.getElementById("btn-eval-rol").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    const rol = document.getElementById("select-rol").value; // Declara e inicializa variable local
    let permisoSwitch = ""; // Declara e inicializa variable local

    switch (rol) { // Evalúa múltiples casos
        case "admin":
            permisoSwitch = "Acceso total al sistema";
            break;
        case "editor":
        case "moderador":
            permisoSwitch = "Edición y moderación de contenido";
            break;
        case "invitado":
            permisoSwitch = "Solo lectura";
            break;
        default:
            permisoSwitch = "Sin permisos asignados";
    }

    const mapa = {
        admin: "Acceso total al sistema",
        editor: "Edición y moderación de contenido",
        moderador: "Edición y moderación de contenido",
        invitado: "Solo lectura"
    };
    const permisoMapa = mapa[rol] ?? "Sin permisos asignados"; // Declara e inicializa variable local

    document.getElementById("out-rol").textContent =
        `Rol: "${rol}"\nResultado switch: ${permisoSwitch}\nResultado diccionario: ${permisoMapa}`;
    registrar(`Rol "${rol}" -> ${permisoSwitch}`);
});

// 3. Truthy vs Falsy
const muestrasTruthy = {
    empty_str: { val: "", label: '""' },
    zero_str: { val: "0", label: '"0"' },
    zero: { val: 0, label: "0" },
    empty_arr: { val: [], label: "[]" },
    empty_obj: { val: {}, label: "{}" },
    null: { val: null, label: "null" },
    nan: { val: NaN, label: "NaN" }
};

document.getElementById("btn-eval-truthy").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    const item = muestrasTruthy[document.getElementById("select-truthy").value]; // Declara e inicializa variable local
    const esTruthy = Boolean(item.val); // Declara e inicializa variable local

    document.getElementById("out-truthy").textContent =
        `Valor: ${item.label}\nBoolean(valor): ${esTruthy}\nClasificación: ${esTruthy ? "✅ TRUTHY (entra al if)" : "❌ FALSY (entra al else)"}`;
    registrar(`${item.label} es ${esTruthy ? "Truthy" : "Falsy"}`, esTruthy ? "ok" : "warn");
});

// 4. Cláusulas de guarda (Early Return)
function verificarAcceso(edad, tieneEntrada) { // Define función reutilizable
    if (Number.isNaN(edad) || edad < 0) return { ok: false, msg: "❌ Edad inválida." }; // Evalúa condición lógica
    if (edad < 18) return { ok: false, msg: "⛔ Denegado: debes ser mayor de 18 años." }; // Evalúa condición lógica
    if (!tieneEntrada) return { ok: false, msg: "⛔ Denegado: necesitas una entrada válida." }; // Evalúa condición lógica
    return { ok: true, msg: "✅ Acceso concedido. ¡Bienvenido al evento!" }; // Retorna el resultado de la función
}

document.getElementById("btn-eval-acceso").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    const edad = Number(document.getElementById("input-edad-acceso").value); // Declara e inicializa variable local
    const tieneEntrada = document.getElementById("chk-entrada").checked; // Declara e inicializa variable local
    const res = verificarAcceso(edad, tieneEntrada); // Declara e inicializa variable local

    document.getElementById("out-acceso").textContent = res.msg; // Actualiza contenido en el DOM
    registrar(`Validar acceso (edad=${edad}, entrada=${tieneEntrada}) -> ${res.msg}`, res.ok ? "ok" : "warn");
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    liveConsole.replaceChildren();
});

registrar("Laboratorio de Condicionales listo.");

