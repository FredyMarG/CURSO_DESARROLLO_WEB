// DevTools Lab — Pestaña Application (inspección de localStorage y sessionStorage)

// Referencias a los campos de entrada y al panel de salida
const keyInput = document.getElementById("keyInput"); // Campo para el nombre de la clave
const valInput = document.getElementById("valInput"); // Campo para el valor asociado
const storageView = document.getElementById("storageView"); // Contenedor donde se imprime el estado actual

/**
 * Lee todas las claves almacenadas en localStorage y sessionStorage
 * y las muestra formateadas como JSON en pantalla.
 */
function renderStorage() {
    // Recolecta las entradas persistentes de localStorage
    const localData = {};
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i); // Obtiene el nombre de la clave en el índice i
        localData[k] = localStorage.getItem(k); // Recupera su valor como string
    }

    // Recolecta las entradas temporales de sessionStorage (duran mientras la pestaña siga abierta)
    const sessionData = {};
    for (let i = 0; i < sessionStorage.length; i++) {
        const k = sessionStorage.key(i);
        sessionData[k] = sessionStorage.getItem(k);
    }

    // Actualiza la vista textual de forma segura con textContent
    storageView.textContent =
        `localStorage:\n${JSON.stringify(localData, null, 2)}\n\n` +
        `sessionStorage:\n${JSON.stringify(sessionData, null, 2)}`;
}

// Guarda el par clave/valor en localStorage al pulsar el botón correspondiente
document.getElementById("btnSaveLocal").addEventListener("click", () => {
    const k = keyInput.value.trim(); // Elimina espacios sobrantes en la clave
    if (!k) return; // Evita guardar claves vacías
    localStorage.setItem(k, valInput.value); // Persiste el dato en el navegador
    renderStorage(); // Refresca el visor en pantalla
});

// Guarda el par clave/valor en sessionStorage (solo para la sesión de esta pestaña)
document.getElementById("btnSaveSession").addEventListener("click", () => {
    const k = keyInput.value.trim();
    if (!k) return;
    sessionStorage.setItem(k, valInput.value);
    renderStorage();
});

// Limpia ambos almacenamientos y actualiza el visor
document.getElementById("btnClearStorage").addEventListener("click", () => {
    localStorage.clear(); // Borra todas las claves de localStorage
    sessionStorage.clear(); // Borra todas las claves de sessionStorage
    renderStorage();
});

// Renderizado inicial al cargar la página
renderStorage();
