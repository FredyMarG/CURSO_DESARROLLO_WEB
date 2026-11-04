/**
 * ==============================================================================
 * 💾 EJERCICIO PRÁCTICO: SISTEMA DE PREFERENCIA DE IDIOMA CON LOCALSTORAGE
 * ==============================================================================
 * Archivo: main.js
 * Propósito: Detectar si el usuario ya eligió un idioma previamente en
 *            localStorage; si no existe, mostrar el modal de selección, guardar
 *            su preferencia de forma permanente y traducir la interfaz en vivo.
 * Documentación pedagógica detallada línea por línea.
 * ==============================================================================
 */

// ==============================================================================
// 1. DIRECTIVA DE MODO ESTRICTO Y SELECCIÓN DE ELEMENTOS DEL DOM
// ==============================================================================

// Activamos el modo estricto para garantizar buenas prácticas y evitar variables sin declarar
"use strict";

// Seleccionamos la capa contenedora del modal ('.modal-overlay') para mostrarla u ocultarla
const modal = document.querySelector(".modal-overlay");

// Seleccionamos los elementos de la página principal para actualizar su texto según el idioma elegido
const estadoStorage = document.getElementById("estadoStorage");
const tituloPagina = document.getElementById("tituloPagina");
const descripcionPagina = document.getElementById("descripcionPagina");
const btnCambiarIdioma = document.getElementById("btnCambiarIdioma");
const btnBorrarStorage = document.getElementById("btnBorrarStorage");


// ==============================================================================
// 2. DICCIONARIO DE TRADUCCIONES (INTERNACIONALIZACIÓN - i18n)
// ==============================================================================

// Definimos un objeto con los textos en Español ("es") e Inglés ("en") para que el cambio
// de idioma se refleje visualmente en la página además de en la consola del navegador:
const traducciones = {
    es: {
        titulo: "¡Bienvenido a tu Aplicación Web! 🇪🇸",
        descripcion: "Tu preferencia de idioma (<strong>Español</strong>) se ha guardado en <code>localStorage</code>. Si recargas la página o cierras el navegador, el modal ya no volverá a aparecer porque tu elección persiste localmente.",
        btnCambiar: "🌐 Cambiar idioma",
        btnBorrar: "🗑️ Borrar localStorage y reiniciar"
    },
    en: {
        titulo: "Welcome to your Web Application! 🇺🇸",
        descripcion: "Your language preference (<strong>English</strong>) has been saved in <code>localStorage</code>. If you reload the page or close the browser, the modal won't appear again because your choice persists locally.",
        btnCambiar: "🌐 Change language",
        btnBorrar: "🗑️ Clear localStorage & reset"
    }
};


// ==============================================================================
// 3. FUNCIÓN PARA APLICAR EL IDIOMA EN LA INTERFAZ Y CONSOLA (aplicarIdiomaUI)
// ==============================================================================

// Declaramos una función que recibe el código de idioma ("es" o "en") y actualiza los textos del DOM
const aplicarIdiomaUI = (codigoIdioma) => {
    // Obtenemos el paquete de textos correspondiente al código (o español por defecto si no coincide)
    const textos = traducciones[codigoIdioma] || traducciones.es;

    // Actualizamos el atributo 'lang' de la etiqueta raíz <html> por accesibilidad y SEO
    document.documentElement.lang = codigoIdioma;

    // Mostramos en la píldora superior el valor exacto almacenado actualmente en localStorage
    if (estadoStorage) {
        estadoStorage.textContent = `localStorage.getItem("idioma") ➔ "${codigoIdioma}"`;
    }

    // Actualizamos el título, la descripción y el texto de los botones en la página principal
    if (tituloPagina) tituloPagina.textContent = textos.titulo;
    if (descripcionPagina) descripcionPagina.innerHTML = textos.descripcion;
    if (btnCambiarIdioma) btnCambiarIdioma.textContent = textos.btnCambiar;
    if (btnBorrarStorage) btnBorrarStorage.textContent = textos.btnBorrar;

    // Imprimimos el mensaje de confirmación en la consola del navegador
    console.log(`El idioma activo es: ${codigoIdioma}`);
};


// ==============================================================================
// 4. FUNCIONES DE CONTROL DEL MODAL (abrirModal Y cerrarModal)
// ==============================================================================

// Función flecha encargada de animar la salida del modal y ocultarlo tras completarse la transición
const cerrarModal = () => {
    // Aplicamos la animación CSS 'desaparecer' de 0.5 segundos conservando su estado final ('forwards')
    modal.style.animation = "desaparecer 0.5s ease forwards";

    // Esperamos 500 milisegundos (lo que dura la animación) antes de aplicar 'display: none'
    setTimeout(() => {
        modal.style.display = "none";
    }, 500);
};

// Función flecha encargada de volver a mostrar el modal si el usuario desea cambiar su preferencia
const abrirModal = () => {
    // Devolvemos la visualización flexible para centrar la ventana modal en pantalla
    modal.style.display = "flex";
    // Aplicamos la animación de entrada 'aparecer'
    modal.style.animation = "aparecer 0.4s ease forwards";
};


// ==============================================================================
// 5. FUNCIÓN DE REGISTRO DE EVENTOS DE SELECCIÓN (definirIdioma)
// ==============================================================================

// Vincula los eventos 'click' a los botones de Inglés (.en) y Español (.es)
const definirIdioma = () => {
    // Escuchamos el clic en el botón con clase '.en' (Inglés)
    document.querySelector(".en").addEventListener("click", () => {
        // Guardamos de forma permanente la clave "idioma" con el valor "en" en localStorage
        localStorage.setItem("idioma", "en");
        // Traducimos inmediatamente la interfaz al inglés
        aplicarIdiomaUI("en");
        // Cerramos la ventana modal con animación suave
        cerrarModal();
    });

    // Escuchamos el clic en el botón con clase '.es' (Español)
    document.querySelector(".es").addEventListener("click", () => {
        // Guardamos de forma permanente la clave "idioma" con el valor "es" en localStorage
        localStorage.setItem("idioma", "es");
        // Traducimos inmediatamente la interfaz al español
        aplicarIdiomaUI("es");
        // Cerramos la ventana modal con animación suave
        cerrarModal();
    });
};


// ==============================================================================
// 6. BOTONES AUXILIARES PARA EXPERIMENTAR CON LOCALSTORAGE EN VIVO
// ==============================================================================

// Si el usuario pulsa "Cambiar idioma", reabrimos el modal para que pueda elegir otro
if (btnCambiarIdioma) {
    btnCambiarIdioma.addEventListener("click", abrirModal);
}

// Si el usuario pulsa "Borrar localStorage y reiniciar", eliminamos la clave "idioma" y recargamos
if (btnBorrarStorage) {
    btnBorrarStorage.addEventListener("click", () => {
        // Eliminamos selectivamente la clave "idioma" usando removeItem()
        localStorage.removeItem("idioma");
        // Recargamos la página para comprobar cómo vuelve a aparecer el modal automáticamente
        location.reload();
    });
}


// ==============================================================================
// 7. FLUJO DE INICIALIZACIÓN AL CARGAR LA PÁGINA
// ==============================================================================

// Registramos los eventos de los botones del modal para que estén siempre listos
definirIdioma();

// Consultamos en localStorage si ya existe un valor asociado a la clave "idioma"
const idioma = localStorage.getItem("idioma");

// Evaluamos si el usuario entra por primera vez (getItem devuelve estrictamente 'null' si no existe):
if (idioma === null) {
    // Si no hay idioma guardado, dejamos el modal visible en pantalla esperando su elección
    console.log("Primera visita detectada (idioma === null). Mostrando modal de selección...");
} else {
    // Si ya existe un idioma guardado ("es" o "en"), ocultamos el modal de inmediato
    modal.style.display = "none";
    // Y aplicamos directamente el idioma recuperado de localStorage en la interfaz
    aplicarIdiomaUI(idioma);
}
