// Guía Interactiva — Try, Catch, Finally y Error({ cause })

class ValidationError extends Error { // Define clase
    constructor(message, options) { // Instrucción JavaScript
        super(message, options); // Ejecuta llamada o método
        this.name = "ValidationError"; // Asigna valor
    }
}

const jsonInput = document.getElementById("jsonInput"); // Obtiene referencia DOM para "jsonInput"
const jsonOutput = document.getElementById("jsonOutput"); // Obtiene referencia DOM para "jsonOutput"
const edadInput = document.getElementById("edadInput"); // Obtiene referencia DOM para "edadInput"
const errorOutput = document.getElementById("errorOutput"); // Obtiene referencia DOM para "errorOutput"
const traceTerminal = document.getElementById("traceTerminal"); // Obtiene referencia DOM para "traceTerminal"

function addTrace(texto, clase = "") { // Declara función
    const div = document.createElement("div"); // Crea nuevo elemento DOM "div"
    div.className = clase; // Asigna valor
    div.textContent = `[${new Date().toLocaleTimeString()}] ${texto}`; // Actualiza contenido en el DOM
    traceTerminal.appendChild(div); // Inserta nodo en el DOM
    traceTerminal.scrollTop = traceTerminal.scrollHeight; // Asigna valor
}

document.getElementById("btnBreakJson").addEventListener("click", () => { // Registra escuchador de eventos
    jsonInput.value = "{'curso': 'JS', activo: true,}"; // Asigna valor
});

document.getElementById("btnParseJson").addEventListener("click", () => { // Registra escuchador de eventos
    traceTerminal.innerHTML = ""; // Actualiza contenido en el DOM
    addTrace("try { JSON.parse(...) }"); // Ejecuta llamada o método
    try { // Inicia bloque protegido contra errores
        const parsed = JSON.parse(jsonInput.value); // Declara e inicializa "parsed"
        jsonOutput.className = "output ok"; // Asigna valor
        jsonOutput.textContent = `JSON válido: ${JSON.stringify(parsed)}`; // Actualiza contenido en el DOM
        addTrace("Éxito: JSON deserializado correctamente.", "ok"); // Ejecuta llamada o método
    } catch (err) { // Instrucción JavaScript
        jsonOutput.className = "output err"; // Asigna valor
        jsonOutput.textContent = `${err.name}: ${err.message}`; // Actualiza contenido en el DOM
        addTrace(`catch (${err.name}): ${err.message}`, "err"); // Ejecuta llamada o método
    } finally { // Instrucción JavaScript
        addTrace("finally: Limpieza ejecutada siempre.", "warn"); // Ejecuta llamada o método
    }
});

document.getElementById("btnValidarEdad").addEventListener("click", () => { // Registra escuchador de eventos
    traceTerminal.innerHTML = ""; // Actualiza contenido en el DOM
    const edad = Number(edadInput.value); // Declara e inicializa "edad"
    addTrace(`try { validarEdad(${edad}) }`); // Ejecuta llamada o método

    try { // Inicia bloque protegido contra errores
        if (Number.isNaN(edad) || edad < 0) { // Evalúa condición
            throw new TypeError("La edad debe ser un número positivo."); // Lanza excepción controlada
        }
        if (edad < 18) { // Evalúa condición
            throw new ValidationError("Acceso denegado: debes ser mayor de 18 años."); // Lanza excepción controlada
        }
        errorOutput.className = "output ok"; // Asigna valor
        errorOutput.textContent = `Edad válida (${edad} años). Acceso permitido.`; // Actualiza contenido en el DOM
        addTrace("Validación superada sin excepciones.", "ok"); // Ejecuta llamada o método
    } catch (err) { // Instrucción JavaScript
        errorOutput.className = "output err"; // Asigna valor
        errorOutput.textContent = `[${err.name}] ${err.message}`; // Actualiza contenido en el DOM
        addTrace(`catch capturó ${err.name}: ${err.message}`, "err"); // Ejecuta llamada o método
    } finally { // Instrucción JavaScript
        addTrace("finally: Recursos liberados.", "warn"); // Ejecuta llamada o método
    }
});

document.getElementById("btnErrorCausa").addEventListener("click", () => { // Registra escuchador de eventos
    traceTerminal.innerHTML = ""; // Actualiza contenido en el DOM
    try { // Inicia bloque protegido contra errores
        try { // Inicia bloque protegido contra errores
            JSON.parse("{corrupto}"); // Ejecuta llamada o método
        } catch (origen) { // Instrucción JavaScript
            throw new Error("Fallo al cargar la configuración del usuario", { cause: origen }); // Lanza excepción controlada
        }
    } catch (err) { // Instrucción JavaScript
        errorOutput.className = "output err"; // Asigna valor
        errorOutput.textContent = `${err.message} | Causa raíz (${err.cause.name}): ${err.cause.message}`; // Actualiza contenido en el DOM
        addTrace(`Error principal: ${err.message}`, "err"); // Ejecuta llamada o método
        addTrace(`err.cause: ${err.cause.name} -> ${err.cause.message}`, "warn"); // Ejecuta llamada o método
    }
});
