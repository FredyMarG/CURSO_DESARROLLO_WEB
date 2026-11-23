/**
 * GUÍA INTERACTIVA: ESTRUCTURAS CONDICIONALES
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

// 1. if / else if / else + Ternario
document.getElementById("btn-eval-hora").addEventListener("click", () => {
    const hora = Number(document.getElementById("input-hora").value);
    const out = document.getElementById("out-hora");

    if (Number.isNaN(hora) || hora < 0 || hora > 23) {
        out.textContent = "❌ Ingresa una hora válida entre 0 y 23."; // Actualiza contenido en el DOM
        registrar("Hora fuera de rango (0-23).", "err");
        return;
    }

    let saludo = "";
    if (hora < 12) saludo = "Buenos días ☀️";
    else if (hora <= 18) saludo = "Buenas tardes 🌤️"; // Evalúa condición alternativa
    else saludo = "Buenas noches 🌙"; // Rama alternativa

    const jornada = hora >= 6 && hora < 19 ? "Horario diurno" : "Horario nocturno";
    out.textContent = `Hora: ${hora}:00\nSaludo (if/else): ${saludo}\nTernario: ${jornada}`; // Actualiza contenido en el DOM
    registrar(`Hora ${hora} -> ${saludo} (${jornada})`);
});

// 2. Switch vs Diccionario
document.getElementById("btn-eval-rol").addEventListener("click", () => {
    const rol = document.getElementById("select-rol").value;
    let permisoSwitch = "";

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
    const permisoMapa = mapa[rol] ?? "Sin permisos asignados";

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

document.getElementById("btn-eval-truthy").addEventListener("click", () => {
    const item = muestrasTruthy[document.getElementById("select-truthy").value];
    const esTruthy = Boolean(item.val);

    document.getElementById("out-truthy").textContent =
        `Valor: ${item.label}\nBoolean(valor): ${esTruthy}\nClasificación: ${esTruthy ? "✅ TRUTHY (entra al if)" : "❌ FALSY (entra al else)"}`;
    registrar(`${item.label} es ${esTruthy ? "Truthy" : "Falsy"}`, esTruthy ? "ok" : "warn");
});

// 4. Cláusulas de guarda (Early Return)
function verificarAcceso(edad, tieneEntrada) {
    if (Number.isNaN(edad) || edad < 0) return { ok: false, msg: "❌ Edad inválida." };
    if (edad < 18) return { ok: false, msg: "⛔ Denegado: debes ser mayor de 18 años." };
    if (!tieneEntrada) return { ok: false, msg: "⛔ Denegado: necesitas una entrada válida." };
    return { ok: true, msg: "✅ Acceso concedido. ¡Bienvenido al evento!" };
}

document.getElementById("btn-eval-acceso").addEventListener("click", () => {
    const edad = Number(document.getElementById("input-edad-acceso").value);
    const tieneEntrada = document.getElementById("chk-entrada").checked;
    const res = verificarAcceso(edad, tieneEntrada);

    document.getElementById("out-acceso").textContent = res.msg; // Actualiza contenido en el DOM
    registrar(`Validar acceso (edad=${edad}, entrada=${tieneEntrada}) -> ${res.msg}`, res.ok ? "ok" : "warn");
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => {
    liveConsole.replaceChildren();
});

registrar("Laboratorio de Condicionales listo.");
