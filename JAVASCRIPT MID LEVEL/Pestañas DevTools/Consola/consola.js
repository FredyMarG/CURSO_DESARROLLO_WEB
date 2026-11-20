// DevTools Lab — Pestaña Console

const consoleMirror = document.getElementById("consoleMirror");
const usuarios = [
    { id: 1, nombre: "Ana", nivel: "Senior" },
    { id: 2, nombre: "Luis", nivel: "Mid" }
];

document.querySelectorAll("[data-cmd]").forEach((btn) => {
    btn.addEventListener("click", () => {
        const cmd = btn.dataset.cmd;

        if (cmd === "log") {
            console.log("Log informativo:", { fecha: new Date().toISOString() });
            consoleMirror.textContent = "console.log() enviado a DevTools.";
        } else if (cmd === "warn") {
            console.warn("Advertencia: Este endpoint se deprecará pronto.");
            consoleMirror.textContent = "console.warn() enviado (resaltado en amarillo).";
        } else if (cmd === "error") {
            console.error("Error simulado: Fallo de validación.");
            consoleMirror.textContent = "console.error() enviado con stack trace.";
        } else if (cmd === "table") {
            console.table(usuarios);
            consoleMirror.textContent = `console.table() enviado:\n${JSON.stringify(usuarios, null, 2)}`;
        } else if (cmd === "time") {
            console.time("calculo");
            let total = 0;
            for (let i = 0; i < 100000; i++) total += i;
            console.timeEnd("calculo");
            consoleMirror.textContent = `Medición completada (ver tiempo exacto en Console). Suma: ${total}`;
        } else if (cmd === "group") {
            console.groupCollapsed("Grupo de Autenticación");
            console.log("Paso 1: Validar token");
            console.log("Paso 2: Cargar permisos");
            console.groupEnd();
            consoleMirror.textContent = "Grupo colapsado creado en Console.";
        }
    });
});
