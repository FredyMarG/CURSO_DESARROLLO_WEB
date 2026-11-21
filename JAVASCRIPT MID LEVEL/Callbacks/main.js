// Guía Interactiva — Callbacks en JavaScript

const numerosInput = document.getElementById("numerosInput"); // Obtiene referencia DOM para "numerosInput"
const syncOutput = document.getElementById("syncOutput"); // Obtiene referencia DOM para "syncOutput"
const userIdInput = document.getElementById("userIdInput"); // Obtiene referencia DOM para "userIdInput"
const asyncOutput = document.getElementById("asyncOutput"); // Obtiene referencia DOM para "asyncOutput"
const logTerminal = document.getElementById("logTerminal"); // Obtiene referencia DOM para "logTerminal"

const usuariosDB = { // Declara e inicializa "usuariosDB"
    1: { id: 1, nombre: "Ana García", rol: "Frontend Lead" },
    2: { id: 2, nombre: "Carlos Ruiz", rol: "Backend Dev" },
    3: { id: 3, nombre: "Elena Torres", rol: "UI/UX Designer" }
};

function log(mensaje, tipo = "info") { // Declara función
    const linea = document.createElement("div"); // Crea nuevo elemento DOM "linea"
    linea.className = `log-line ${tipo}`; // Asigna valor
    const hora = new Date().toLocaleTimeString(); // Declara e inicializa "hora"
    linea.textContent = `[${hora}] ${mensaje}`; // Actualiza contenido en el DOM
    logTerminal.appendChild(linea); // Inserta nodo en el DOM
    logTerminal.scrollTop = logTerminal.scrollHeight; // Asigna valor
}

// 1. Función de orden superior que acepta un callback síncrono
function procesarLista(arr, callback) { // Declara función
    const resultado = []; // Declara e inicializa "resultado"
    for (const item of arr) { // Inicia bucle de iteración
        resultado.push(callback(item)); // Ejecuta llamada o método
    }
    return resultado; // Retorna resultado
}

document.querySelectorAll("[data-op]").forEach((btn) => { // Instrucción JavaScript
    btn.addEventListener("click", () => { // Registra escuchador de eventos
        const numeros = numerosInput.value
            .split(",")
            .map((n) => Number(n.trim()))
            .filter((n) => !Number.isNaN(n)); // Ejecuta llamada o método

        const op = btn.dataset.op; // Declara e inicializa "op"
        let salida; // Declara e inicializa "salida"

        if (op === "doble") { // Evalúa condición
            salida = procesarLista(numeros, (n) => n * 2); // Asigna valor
            log(`Callback síncrono (x2): [${salida.join(", ")}]`, "ok"); // Ejecuta llamada o método
        } else if (op === "cuadrado") { // Instrucción JavaScript
            salida = procesarLista(numeros, (n) => n ** 2); // Asigna valor
            log(`Callback síncrono (n²): [${salida.join(", ")}]`, "ok"); // Ejecuta llamada o método
        } else { // Instrucción JavaScript
            salida = numeros.filter((n) => n > 5); // Asigna valor
            log(`Callback filter (> 5): [${salida.join(", ")}]`, "ok"); // Ejecuta llamada o método
        }

        syncOutput.className = "output ok"; // Asigna valor
        syncOutput.textContent = `Resultado: [${salida.join(", ")}]`; // Actualiza contenido en el DOM
    });
});

// 2. Patrón Error-First Callback (err, data)
function buscarUsuario(id, callback) { // Declara función
    log(`Iniciando consulta asíncrona para ID=${id}...`, "info"); // Ejecuta llamada o método
    setTimeout(() => { // Instrucción JavaScript
        const usuario = usuariosDB[id]; // Declara e inicializa "usuario"
        if (!usuario) { // Evalúa condición
            callback(new Error(`Usuario con ID ${id} no encontrado.`), null); // Ejecuta llamada o método
            return; // Retorna resultado
        }
        callback(null, usuario); // Ejecuta llamada o método
    }, 600); // Ejecuta llamada o método
}

document.getElementById("btnFetchUser").addEventListener("click", () => { // Registra escuchador de eventos
    const id = Number(userIdInput.value); // Declara e inicializa "id"
    asyncOutput.className = "output"; // Asigna valor
    asyncOutput.textContent = "Consultando servidor simulado..."; // Actualiza contenido en el DOM

    buscarUsuario(id, (err, user) => { // Instrucción JavaScript
        if (err) { // Evalúa condición
            asyncOutput.className = "output err"; // Asigna valor
            asyncOutput.textContent = `Error: ${err.message}`; // Actualiza contenido en el DOM
            log(`Error-First Callback: ${err.message}`, "err"); // Ejecuta llamada o método
            return; // Retorna resultado
        }
        asyncOutput.className = "output ok"; // Asigna valor
        asyncOutput.textContent = `Encontrado: ${user.nombre} (${user.rol})`; // Actualiza contenido en el DOM
        log(`Usuario recibido: ${JSON.stringify(user)}`, "ok"); // Ejecuta llamada o método
    });
});

// 3. Simulación visual de Callback Hell (3 pasos anidados)
document.getElementById("btnCallbackHell").addEventListener("click", () => { // Registra escuchador de eventos
    const id = Number(userIdInput.value) || 1; // Declara e inicializa "id"
    asyncOutput.className = "output"; // Asigna valor
    asyncOutput.textContent = "Ejecutando cadena de 3 callbacks anidados..."; // Actualiza contenido en el DOM

    buscarUsuario(id, (err, user) => { // Instrucción JavaScript
        if (err) { // Evalúa condición
            asyncOutput.className = "output err"; // Asigna valor
            asyncOutput.textContent = err.message; // Actualiza contenido en el DOM
            log(err.message, "err"); // Ejecuta llamada o método
            return; // Retorna resultado
        }
        log(`Paso 1 OK: ${user.nombre}`, "info"); // Ejecuta llamada o método
        setTimeout(() => { // Instrucción JavaScript
            log(`Paso 2 OK: Permisos cargados para ${user.rol}`, "info"); // Ejecuta llamada o método
            setTimeout(() => { // Instrucción JavaScript
                const msg = `Paso 3 OK: Sesión lista para ${user.nombre}`; // Declara e inicializa "msg"
                asyncOutput.className = "output ok"; // Asigna valor
                asyncOutput.textContent = msg; // Actualiza contenido en el DOM
                log(msg, "ok"); // Ejecuta llamada o método
            }, 450); // Ejecuta llamada o método
        }, 450); // Ejecuta llamada o método
    });
});

document.getElementById("btnClearLog").addEventListener("click", () => { // Registra escuchador de eventos
    logTerminal.innerHTML = ""; // Actualiza contenido en el DOM
});
