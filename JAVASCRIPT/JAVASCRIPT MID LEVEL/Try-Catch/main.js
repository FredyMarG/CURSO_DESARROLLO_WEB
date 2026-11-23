// Guía Interactiva — Try, Catch, Finally y Error({ cause })

class ValidationError extends Error { // Define clase
    constructor(message, options) {
        super(message, options);
        this.name = "ValidationError";
    }
}

const jsonInput = document.getElementById("jsonInput");
const jsonOutput = document.getElementById("jsonOutput");
const edadInput = document.getElementById("edadInput");
const errorOutput = document.getElementById("errorOutput");
const traceTerminal = document.getElementById("traceTerminal");

function addTrace(texto, clase = "") {
    const div = document.createElement("div");
    div.className = clase;
    div.textContent = `[${new Date().toLocaleTimeString()}] ${texto}`; // Actualiza contenido en el DOM
    traceTerminal.appendChild(div);
    traceTerminal.scrollTop = traceTerminal.scrollHeight;
}

document.getElementById("btnBreakJson").addEventListener("click", () => {
    jsonInput.value = "{'curso': 'JS', activo: true,}";
});

document.getElementById("btnParseJson").addEventListener("click", () => {
    traceTerminal.innerHTML = ""; // Actualiza contenido en el DOM
    addTrace("try { JSON.parse(...) }");
    try { // Inicia bloque protegido contra errores
        const parsed = JSON.parse(jsonInput.value);
        jsonOutput.className = "output ok";
        jsonOutput.textContent = `JSON válido: ${JSON.stringify(parsed)}`; // Actualiza contenido en el DOM
        addTrace("Éxito: JSON deserializado correctamente.", "ok");
    } catch (err) {
        jsonOutput.className = "output err";
        jsonOutput.textContent = `${err.name}: ${err.message}`; // Actualiza contenido en el DOM
        addTrace(`catch (${err.name}): ${err.message}`, "err");
    } finally {
        addTrace("finally: Limpieza ejecutada siempre.", "warn");
    }
});

document.getElementById("btnValidarEdad").addEventListener("click", () => {
    traceTerminal.innerHTML = ""; // Actualiza contenido en el DOM
    const edad = Number(edadInput.value);
    addTrace(`try { validarEdad(${edad}) }`);

    try { // Inicia bloque protegido contra errores
        if (Number.isNaN(edad) || edad < 0) {
            throw new TypeError("La edad debe ser un número positivo."); // Lanza excepción controlada
        }
        if (edad < 18) {
            throw new ValidationError("Acceso denegado: debes ser mayor de 18 años."); // Lanza excepción controlada
        }
        errorOutput.className = "output ok";
        errorOutput.textContent = `Edad válida (${edad} años). Acceso permitido.`; // Actualiza contenido en el DOM
        addTrace("Validación superada sin excepciones.", "ok");
    } catch (err) {
        errorOutput.className = "output err";
        errorOutput.textContent = `[${err.name}] ${err.message}`; // Actualiza contenido en el DOM
        addTrace(`catch capturó ${err.name}: ${err.message}`, "err");
    } finally {
        addTrace("finally: Recursos liberados.", "warn");
    }
});

document.getElementById("btnErrorCausa").addEventListener("click", () => {
    traceTerminal.innerHTML = ""; // Actualiza contenido en el DOM
    try { // Inicia bloque protegido contra errores
        try { // Inicia bloque protegido contra errores
            JSON.parse("{corrupto}");
        } catch (origen) {
            throw new Error("Fallo al cargar la configuración del usuario", { cause: origen }); // Lanza excepción controlada
        }
    } catch (err) {
        errorOutput.className = "output err";
        errorOutput.textContent = `${err.message} | Causa raíz (${err.cause.name}): ${err.cause.message}`; // Actualiza contenido en el DOM
        addTrace(`Error principal: ${err.message}`, "err");
        addTrace(`err.cause: ${err.cause.name} -> ${err.cause.message}`, "warn");
    }
});
