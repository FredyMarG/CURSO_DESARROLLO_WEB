/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - EJERCICIO: USO DE COOKIES (CONSENTIMIENTO)
 * ARCHIVO: main.js
 * Gestiona creación, lectura, expiración UTC y UI del modal de cookies.
 * Documentación pedagógica LÍNEA POR LÍNEA en español.
 * ============================================================================
 */

// Activamos el modo estricto para evitar variables globales accidentales y errores silenciosos
"use strict";

/**
 * Calcula una fecha de expiración futura en formato UTC sumando 'dias' a la fecha actual.
 * @param {number} dias - Cantidad de días de vigencia de la cookie.
 * @returns {string} Fecha formateada en estándar UTC (ej. "Mon, 21 Dec 2026 19:00:00 GMT").
 */
const newFechaUTC = (dias) => {
    // Obtenemos la fecha y hora exacta del sistema en este instante
    const fecha = new Date();
    // Sumamos los milisegundos equivalentes a la cantidad de días solicitada
    fecha.setTime(fecha.getTime() + dias * 1000 * 60 * 60 * 24);
    // Convertimos el objeto Date a una cadena UTC válida para el atributo expires
    return fecha.toUTCString();
};

/**
 * Crea o actualiza una cookie con fecha de expiración en días y atributos seguros.
 * Incluye respaldo en localStorage por si el navegador bloquea document.cookie en protocolo file://.
 * @param {string} name - Par clave=valor de la cookie (ej. "acceptedCookies=si").
 * @param {number} dias - Días de duración (0 o negativo la elimina).
 */
const crearCookie = (name, dias) => {
    // Calculamos la fecha UTC de caducidad según los días recibidos
    const expires = newFechaUTC(dias);
    // Asignamos la cookie con ruta global (path=/) y política SameSite=Lax
    document.cookie = `${name}; expires=${expires}; path=/; SameSite=Lax`;

    // Guardamos copia espejo en localStorage por si se ejecuta desde archivo local (file://)
    try {
        const [clave, valor] = name.split("=");
        if (dias <= 0) localStorage.removeItem(`cookie_demo_${clave}`);
        else localStorage.setItem(`cookie_demo_${clave}`, valor);
    } catch (_) {
        // Ignoramos si el navegador restringe localStorage
    }
};

/**
 * Busca y devuelve el valor de una cookie específica por su nombre.
 * @param {string} cookieName - Nombre de la cookie a consultar.
 * @returns {string|null} El valor guardado, o null si no existe.
 */
const obtenerCookie = (cookieName) => {
    // Leemos la cadena completa de cookies accesibles en el documento
    const cookies = document.cookie ? document.cookie.split(";") : [];
    // Recorremos cada par clave=valor separado por punto y coma
    for (let i = 0; i < cookies.length; i++) {
        // Eliminamos espacios en blanco sobrantes alrededor del par
        const cookie = cookies[i].trim();
        // Comprobamos si empieza exactamente con "nombre="
        if (cookie.startsWith(`${cookieName}=`)) {
            // Devolvemos la porción posterior al signo '='
            return cookie.split("=")[1];
        }
    }

    // Respaldo para entornos file:// donde algunos navegadores no persisten document.cookie
    try {
        return localStorage.getItem(`cookie_demo_${cookieName}`);
    } catch (_) {
        return null;
    }
};

// --- Referencias a los elementos de la interfaz ---
// Fondo y contenedor del modal de consentimiento
const modalBg = document.getElementById("cookieModalBg");
// Botón de aceptación de cookies
const btnAccept = document.getElementById("accept");
// Botón de rechazo de cookies
const btnDeny = document.getElementById("deny");
// Caja visual que muestra el estado actual (verde neón o rojo neón)
const cookieStatus = document.getElementById("cookieStatus");
// Elemento <code> que imprime el valor actual de document.cookie
const cookieRaw = document.getElementById("cookieRaw");
// Botón para reabrir manualmente el modal y cambiar la preferencia
const btnReopenModal = document.getElementById("btnReopenModal");
// Botón para borrar la cookie usando max-age=0
const btnClearCookie = document.getElementById("btnClearCookie");

/**
 * Muestra el modal de consentimiento con transición suave de opacidad.
 */
function abrirModal() {
    // Colocamos el modal por encima del contenido
    modalBg.style.zIndex = "9999";
    // Activamos la opacidad al 100% para disparar la transición CSS
    modalBg.style.opacity = "1";
}

/**
 * Oculta el modal suavemente y devuelve su z-index detrás del contenido tras finalizar.
 */
function cerrarModal() {
    // Desvanecemos la opacidad a 0
    modalBg.style.opacity = "0";
    // Esperamos 450 ms (duración de la transición) antes de enviarlo atrás
    setTimeout(() => {
        modalBg.style.zIndex = "-1";
    }, 450);
}

/**
 * Actualiza el panel visual con el estado actual de la cookie acceptedCookies.
 */
function actualizarEstadoUI() {
    // Consultamos el valor actual de la cookie
    const estado = obtenerCookie("acceptedCookies");
    // Mostramos el contenido real de document.cookie (o aviso si está vacío en file://)
    cookieRaw.textContent = document.cookie || (estado ? `acceptedCookies=${estado} (respaldo local)` : "(vacío)");

    // Aplicamos verde neón si aceptó, rojo neón si rechazó o estilo neutro si está pendiente
    if (estado === "si") {
        cookieStatus.textContent = "✅ Cookies aceptadas (acceptedCookies = si)";
        cookieStatus.className = "cookie-status success";
    } else if (estado === "no") {
        cookieStatus.textContent = "❌ Cookies rechazadas (acceptedCookies = no)";
        cookieStatus.className = "cookie-status error";
    } else {
        cookieStatus.textContent = "⏳ Aún no has elegido una preferencia de cookies.";
        cookieStatus.className = "cookie-status warning";
    }
}

// Al pulsar "Sí, aceptar", guardamos la cookie por 30 días, cerramos el modal y refrescamos UI
btnAccept.addEventListener("click", () => {
    crearCookie("acceptedCookies=si", 30);
    cerrarModal();
    actualizarEstadoUI();
});

// Al pulsar "No, rechazar", guardamos "no" por 30 días, cerramos el modal y refrescamos UI
btnDeny.addEventListener("click", () => {
    crearCookie("acceptedCookies=no", 30);
    cerrarModal();
    actualizarEstadoUI();
});

// Permite al usuario volver a abrir el modal manualmente cuando lo desee
btnReopenModal.addEventListener("click", () => {
    abrirModal();
});

// Elimina la cookie asignando expiración en el pasado/0 y vuelve a abrir el modal
btnClearCookie.addEventListener("click", () => {
    document.cookie = "acceptedCookies=; max-age=0; path=/; SameSite=Lax";
    try { localStorage.removeItem("cookie_demo_acceptedCookies"); } catch (_) {}
    actualizarEstadoUI();
    abrirModal();
});

// Inicializamos la vista al cargar el documento
actualizarEstadoUI();

// Si el usuario aún no ha aceptado las cookies, mostramos el modal automáticamente tras 200 ms
if (obtenerCookie("acceptedCookies") !== "si") {
    setTimeout(abrirModal, 200);
}
