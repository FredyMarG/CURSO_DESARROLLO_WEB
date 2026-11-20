// Guía Interactiva — Eventos de Teclado

const keyInput = document.getElementById("keyInput");
const valKey = document.getElementById("valKey");
const valCode = document.getElementById("valCode");
const valMods = document.getElementById("valMods");
const keyLog = document.getElementById("keyLog");

keyInput.addEventListener("keydown", (e) => {
    valKey.textContent = e.key === " " ? "Space" : e.key;
    valCode.textContent = e.code;

    const mods = [];
    if (e.ctrlKey) mods.push("Ctrl");
    if (e.shiftKey) mods.push("Shift");
    if (e.altKey) mods.push("Alt");
    if (e.metaKey) mods.push("Meta");
    valMods.textContent = mods.length ? mods.join(" + ") : "Ninguno";

    const line = document.createElement("div");
    line.textContent = `keydown → key="${e.key}" | code="${e.code}"${mods.length ? ` | [${mods.join("+")}]` : ""}`;
    keyLog.prepend(line);
    if (keyLog.children.length > 25) keyLog.lastElementChild.remove();
});
