// Guía Interactiva — Eventos de Teclado

const keyInput = document.getElementById("keyInput"); // Obtiene referencia DOM para "keyInput"
const valKey = document.getElementById("valKey"); // Obtiene referencia DOM para "valKey"
const valCode = document.getElementById("valCode"); // Obtiene referencia DOM para "valCode"
const valMods = document.getElementById("valMods"); // Obtiene referencia DOM para "valMods"
const keyLog = document.getElementById("keyLog"); // Obtiene referencia DOM para "keyLog"

keyInput.addEventListener("keydown", (e) => { // Registra escuchador de eventos
    valKey.textContent = e.key === " " ? "Space" : e.key; // Actualiza contenido en el DOM
    valCode.textContent = e.code; // Actualiza contenido en el DOM

    const mods = []; // Declara e inicializa "mods"
    if (e.ctrlKey) mods.push("Ctrl"); // Evalúa condición
    if (e.shiftKey) mods.push("Shift"); // Evalúa condición
    if (e.altKey) mods.push("Alt"); // Evalúa condición
    if (e.metaKey) mods.push("Meta"); // Evalúa condición
    valMods.textContent = mods.length ? mods.join(" + ") : "Ninguno"; // Actualiza contenido en el DOM

    const line = document.createElement("div"); // Crea nuevo elemento DOM "line"
    line.textContent = `keydown → key="${e.key}" | code="${e.code}"${mods.length ? ` | [${mods.join("+")}]` : ""}`; // Actualiza contenido en el DOM
    keyLog.prepend(line); // Ejecuta llamada o método
    if (keyLog.children.length > 25) keyLog.lastElementChild.remove(); // Evalúa condición
});
