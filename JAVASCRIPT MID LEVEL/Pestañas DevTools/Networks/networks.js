// DevTools Lab — Pestaña Network

const netOutput = document.getElementById("netOutput");

async function ejecutarPeticion(url, options = {}) {
    netOutput.textContent = `Enviando ${options.method || "GET"} ${url}...`;
    try {
        const res = await fetch(url, {
            ...options,
            signal: AbortSignal.timeout(5000)
        });
        const text = await res.text();
        netOutput.textContent =
            `Status: ${res.status} ${res.statusText} (ok=${res.ok})\n\n${text.slice(0, 350)}`;
    } catch (err) {
        netOutput.textContent = `Error de red (${err.name}): ${err.message}`;
    }
}

document.getElementById("btnGetOk").addEventListener("click", () => {
    ejecutarPeticion("https://jsonplaceholder.typicode.com/todos/1");
});

document.getElementById("btnGet404").addEventListener("click", () => {
    ejecutarPeticion("https://jsonplaceholder.typicode.com/todos/999999");
});

document.getElementById("btnPost").addEventListener("click", () => {
    ejecutarPeticion("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "DevTools Network Test", userId: 1 })
    });
});
