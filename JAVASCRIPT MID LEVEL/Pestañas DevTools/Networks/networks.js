// DevTools Lab — Pestaña Network

const netOutput = document.getElementById("netOutput"); // Obtiene referencia DOM para "netOutput"

async function ejecutarPeticion(url, options = {}) { // Declara función
    netOutput.textContent = `Enviando ${options.method || "GET"} ${url}...`; // Actualiza contenido en el DOM
    try { // Inicia bloque protegido contra errores
        const res = await fetch(url, { // Declara e inicializa "res"
            ...options,
            signal: AbortSignal.timeout(5000)
        });
        const text = await res.text(); // Declara e inicializa "text"
        netOutput.textContent =
            `Status: ${res.status} ${res.statusText} (ok=${res.ok})\n\n${text.slice(0, 350)}`; // Instrucción JavaScript
    } catch (err) { // Instrucción JavaScript
        netOutput.textContent = `Error de red (${err.name}): ${err.message}`; // Actualiza contenido en el DOM
    }
}

document.getElementById("btnGetOk").addEventListener("click", () => { // Registra escuchador de eventos
    ejecutarPeticion("https://jsonplaceholder.typicode.com/todos/1");
});

document.getElementById("btnGet404").addEventListener("click", () => { // Registra escuchador de eventos
    ejecutarPeticion("https://jsonplaceholder.typicode.com/todos/999999");
});

document.getElementById("btnPost").addEventListener("click", () => { // Registra escuchador de eventos
    ejecutarPeticion("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "DevTools Network Test", userId: 1 })
    });
});
