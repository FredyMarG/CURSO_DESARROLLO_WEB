// Guía Interactiva — Eventos de Teclado

const keyInput = document.getElementById("keyInput");
const valKey = document.getElementById("valKey");
const valCode = document.getElementById("valCode");
const valMods = document.getElementById("valMods");
const keyLog = document.getElementById("keyLog");

keyInput.addEventListener("keydown", (e) => {
    valKey.textContent = e.key === " " ? "Space" : e.key; // Actualiza contenido en el DOM
    valCode.textContent = e.code; // Actualiza contenido en el DOM

    const mods = [];
    if (e.ctrlKey) mods.push("Ctrl");
    if (e.shiftKey) mods.push("Shift");
    if (e.altKey) mods.push("Alt");
    if (e.metaKey) mods.push("Meta");
    valMods.textContent = mods.length ? mods.join(" + ") : "Ninguno"; // Actualiza contenido en el DOM

    const line = document.createElement("div");
    line.textContent = `keydown → key="${e.key}" | code="${e.code}"${mods.length ? ` | [${mods.join("+")}]` : ""}`; // Actualiza contenido en el DOM
    keyLog.prepend(line);
    if (keyLog.children.length > 25) keyLog.lastElementChild.remove();
});
