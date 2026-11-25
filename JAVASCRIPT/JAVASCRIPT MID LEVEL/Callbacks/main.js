// Guía Interactiva — Callbacks en JavaScript

const numerosInput = document.getElementById("numerosInput"); // Declara e inicializa variable local
const syncOutput = document.getElementById("syncOutput"); // Declara e inicializa variable local
const userIdInput = document.getElementById("userIdInput"); // Declara e inicializa variable local
const asyncOutput = document.getElementById("asyncOutput"); // Declara e inicializa variable local
const logTerminal = document.getElementById("logTerminal"); // Declara e inicializa variable local

const usuariosDB = {
    1: { id: 1, nombre: "Ana García", rol: "Frontend Lead" },
    2: { id: 2, nombre: "Carlos Ruiz", rol: "Backend Dev" },
    3: { id: 3, nombre: "Elena Torres", rol: "UI/UX Designer" }
};

function log(mensaje, tipo = "info") { // Define función reutilizable
    const linea = document.createElement("div"); // Declara e inicializa variable local
    linea.className = `log-line ${tipo}`;
    const hora = new Date().toLocaleTimeString(); // Declara e inicializa variable local
    linea.textContent = `[${hora}] ${mensaje}`; // Actualiza contenido en el DOM
    logTerminal.appendChild(linea);
    logTerminal.scrollTop = logTerminal.scrollHeight;
}

// 1. Función de orden superior que acepta un callback síncrono
function procesarLista(arr, callback) { // Define función reutilizable
    const resultado = []; // Declara e inicializa variable local
    for (const item of arr) { // Itera sobre elementos o rango
        resultado.push(callback(item));
    }
    return resultado; // Retorna el resultado de la función
}

document.querySelectorAll("[data-op]").forEach((btn) => {
    btn.addEventListener("click", () => { // Registra escuchador de evento en el DOM
        const numeros = numerosInput.value
            .split(",")
            .map((n) => Number(n.trim()))
            .filter((n) => !Number.isNaN(n));

        const op = btn.dataset.op; // Declara e inicializa variable local
        let salida; // Declara e inicializa variable local

        if (op === "doble") { // Evalúa condición lógica
            salida = procesarLista(numeros, (n) => n * 2);
            log(`Callback síncrono (x2): [${salida.join(", ")}]`, "ok");
        } else if (op === "cuadrado") {
            salida = procesarLista(numeros, (n) => n ** 2);
            log(`Callback síncrono (n²): [${salida.join(", ")}]`, "ok");
        } else {
            salida = numeros.filter((n) => n > 5);
            log(`Callback filter (> 5): [${salida.join(", ")}]`, "ok");
        }

        syncOutput.className = "output ok";
        syncOutput.textContent = `Resultado: [${salida.join(", ")}]`; // Actualiza contenido en el DOM
    });
});

// 2. Patrón Error-First Callback (err, data)
function buscarUsuario(id, callback) { // Define función reutilizable
    log(`Iniciando consulta asíncrona para ID=${id}...`, "info");
    setTimeout(() => {
        const usuario = usuariosDB[id]; // Declara e inicializa variable local
        if (!usuario) { // Evalúa condición lógica
            callback(new Error(`Usuario con ID ${id} no encontrado.`), null);
            return; // Retorna el resultado de la función
        }
        callback(null, usuario);
    }, 600);
}

document.getElementById("btnFetchUser").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    const id = Number(userIdInput.value); // Declara e inicializa variable local
    asyncOutput.className = "output";
    asyncOutput.textContent = "Consultando servidor simulado..."; // Actualiza contenido en el DOM

    buscarUsuario(id, (err, user) => {
        if (err) { // Evalúa condición lógica
            asyncOutput.className = "output err";
            asyncOutput.textContent = `Error: ${err.message}`; // Actualiza contenido en el DOM
            log(`Error-First Callback: ${err.message}`, "err");
            return; // Retorna el resultado de la función
        }
        asyncOutput.className = "output ok";
        asyncOutput.textContent = `Encontrado: ${user.nombre} (${user.rol})`; // Actualiza contenido en el DOM
        log(`Usuario recibido: ${JSON.stringify(user)}`, "ok");
    });
});

// 3. Simulación visual de Callback Hell (3 pasos anidados)
document.getElementById("btnCallbackHell").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    const id = Number(userIdInput.value) || 1; // Declara e inicializa variable local
    asyncOutput.className = "output";
    asyncOutput.textContent = "Ejecutando cadena de 3 callbacks anidados..."; // Actualiza contenido en el DOM

    buscarUsuario(id, (err, user) => {
        if (err) { // Evalúa condición lógica
            asyncOutput.className = "output err";
            asyncOutput.textContent = err.message; // Actualiza contenido en el DOM
            log(err.message, "err");
            return; // Retorna el resultado de la función
        }
        log(`Paso 1 OK: ${user.nombre}`, "info");
        setTimeout(() => {
            log(`Paso 2 OK: Permisos cargados para ${user.rol}`, "info");
            setTimeout(() => {
                const msg = `Paso 3 OK: Sesión lista para ${user.nombre}`; // Declara e inicializa variable local
                asyncOutput.className = "output ok";
                asyncOutput.textContent = msg; // Actualiza contenido en el DOM
                log(msg, "ok");
            }, 450);
        }, 450);
    });
});

document.getElementById("btnClearLog").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    logTerminal.innerHTML = ""; // Actualiza contenido en el DOM
});

