/**
 * 🏛️ MODULE: WINDOW GLOBAL INTERFACE
 * Laboratorio de métodos nativos del objeto global 'window'.
 */

// Variable global para mantener la referencia de la ventana hija
let ventanaReferencia = null;

/**
 * Muestra un cuadro de alerta bloqueante.
 * @function ejecutarAlert
 */
function ejecutarAlert() {
    // window.alert: Detiene la ejecución del hilo principal hasta que se cierra.
    window.alert("¡Este es un mensaje de alerta global!");
}

/**
 * Solicita una entrada de texto al usuario.
 * @function ejecutarPrompt
 */
function ejecutarPrompt() {
    // prompt(mensaje, valorPorDefecto): Retorna el string ingresado o null.
    const nombre = window.prompt("¿Cómo te llamas?", "Invitado");
    
    if (nombre) {
        console.log(`Usuario identificado: ${nombre}`);
    } else {
        console.warn("El usuario canceló la entrada de datos.");
    }
}

/**
 * Solicita una confirmación booleana.
 * @function ejecutarConfirm
 */
function ejecutarConfirm() {
    // confirm(): Retorna true (Aceptar) o false (Cancelar).
    const respuesta = window.confirm("¿Deseas guardar los cambios realizados?");
    console.log(`Decisión del usuario: ${respuesta ? "Aceptada" : "Rechazada"}`);
}

/**
 * Gestión de apertura de ventanas (Pop-ups).
 * @function abrirVentana
 */
function abrirVentana() {
    const url = "https://www.google.com";
    const nombre = "GoogleLab";
    const specs = "width=600,height=400,left=200,top=100";

    // open(): Abre una nueva ventana. Retorna la referencia al nuevo objeto window.
    ventanaReferencia = window.open(url, nombre, specs);

    if (ventanaReferencia) {
        console.log("Ventana abierta con éxito.");
    } else {
        console.error("La ventana fue bloqueada por el navegador (Pop-up blocker).");
    }
}

/**
 * Cierre de la ventana referenciada.
 * @function cerrarVentana
 */
function cerrarVentana() {
    // Verificamos si la referencia existe y si la ventana aún no está cerrada.
    if (ventanaReferencia && !ventanaReferencia.closed) {
        // close(): Cierra la ventana referenciada.
        ventanaReferencia.close();
        console.log("Ventana hija cerrada programáticamente.");
    } else {
        console.warn("No hay ninguna ventana activa para cerrar.");
    }
}

// Log de inicialización
console.log("Monitor del Objeto Window: Activo y listo.");