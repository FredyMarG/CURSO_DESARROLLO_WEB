/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: NOTIFICATIONS API
 * ARCHIVO: main.js
 * Guía teórica, simulador universal en Node.js y ejemplos prácticos paso a paso
 * Documentación pedagógica LÍNEA POR LÍNEA al 100%
 * ============================================================================
 */

// Activamos el modo estricto de ECMAScript para asegurar código riguroso y sin errores silenciosos
"use strict";

/* ==========================================================================
   0. ADAPTADOR UNIVERSAL PARA EJECUCIÓN EN NAVEGADOR Y NODE.JS
   ========================================================================== */
// Detectamos si estamos en un navegador web real con soporte nativo para Notification
const esEntornoNavegador = typeof window !== "undefined" && "Notification" in window;

// Creamos una clase simulada de Notification para poder ejecutar y probar la guía en Node.js
class NotificationSimulada {
    // Propiedad estática simulada que representa el estado actual del permiso
    static permission = "default";

    // Método estático simulado que emula Notification.requestPermission() devolviendo una Promesa
    static async requestPermission() {
        // Simulamos que el usuario acepta el permiso desde el cuadro de diálogo
        NotificationSimulada.permission = "granted";
        // Retornamos la cadena "granted" tal como hace la Promesa nativa
        return NotificationSimulada.permission;
    }

    // El constructor recibe el título principal y un objeto opcional de configuración
    constructor(title, options = {}) {
        // Guardamos el título de la notificación
        this.title = title;
        // Guardamos el cuerpo descriptivo o cadena vacía si no se envía
        this.body = options.body || "";
        // Guardamos el icono configurado
        this.icon = options.icon || "";
        // Guardamos la etiqueta agrupadora (tag)
        this.tag = options.tag || "";
        // Guardamos si debe mostrarse en silencio
        this.silent = Boolean(options.silent);
        // Mapa interno de escuchadores de eventos de esta instancia
        this._events = {};

        // Notificamos en consola la creación de la alerta simulada en Node.js
        console.log(`   🔔 [SO SIMULADO] Notificación mostrada: "${this.title}"`);
        if (this.body) console.log(`      ↳ Cuerpo: "${this.body}"`);
        if (this.tag) console.log(`      ↳ Etiqueta (tag): "${this.tag}"`);
    }

    // Método equivalente a notificacion.addEventListener(evento, callback)
    addEventListener(evento, callback) {
        // Inicializamos el arreglo del evento si aún no existe
        if (!this._events[evento]) this._events[evento] = [];
        // Registramos el callback
        this._events[evento].push(callback);
    }

    // Método equivalente a notificacion.close() para cerrar la alerta programáticamente
    close() {
        // Si existen escuchadores para el evento "close", los ejecutamos
        if (this._events["close"]) {
            this._events["close"].forEach((fn) => fn({ type: "close" }));
        }
    }

    // Método auxiliar del simulador para emular que el usuario hizo clic en la notificación
    _simularClic() {
        // Si existen escuchadores para "click", los disparamos
        if (this._events["click"]) {
            this._events["click"].forEach((fn) => fn({ type: "click" }));
        }
    }
}

// Seleccionamos la API nativa del navegador o nuestro simulador si estamos en Node.js
const NotificationAPI = esEntornoNavegador ? window.Notification : NotificationSimulada;

/* ==========================================================================
   UTILIDAD DE IMPRESIÓN PEDAGÓGICA EN CONSOLA
   ========================================================================== */
// Función auxiliar para imprimir encabezados ordenados de cada bloque temático
function imprimirTitulo(numero, titulo) {
    // Línea divisoria superior
    console.log("\n" + "=".repeat(78));
    // Título del bloque
    console.log(`📌 BLOQUE ${numero}: ${titulo}`);
    // Línea divisoria inferior
    console.log("=".repeat(78));
}

/* ==========================================================================
   BLOQUE 1: ¿QUÉ ES LA NOTIFICATIONS API Y REQUISITOS DE SEGURIDAD?
   ========================================================================== */
// Imprimimos la cabecera del primer bloque
imprimirTitulo(1, "¿QUÉ ES LA NOTIFICATIONS API Y CUÁNDO USARLA?");

// Explicamos sus características principales en consola
console.log("🔔 Notificaciones Nativas del Sistema Operativo:");
console.log("   - Se muestran fuera de la ventana del navegador (centro de avisos de Windows/macOS/Android).");
console.log("   - Siguen siendo visibles aunque el navegador esté minimizado o en segundo plano.");
console.log("   - Requisito obligatorio de seguridad: funciona solo en HTTPS o en localhost.");

/* ==========================================================================
   BLOQUE 2: VERIFICACIÓN DE SOPORTE Y 'Notification.permission'
   ========================================================================== */
// Imprimimos la cabecera del segundo bloque
imprimirTitulo(2, "VERIFICACIÓN DE ESTADO: Notification.permission");

// Consultamos el estado actual del permiso ("default", "granted" o "denied")
console.log(`Estado actual del permiso: "${NotificationAPI.permission}"`);
console.log("   • 'default': El usuario aún no decide (actúa como denegado hasta preguntar).");
console.log("   • 'granted': Permiso concedido explícitamente para emitir alertas.");
console.log("   • 'denied' : Bloqueado por el usuario; no se puede volver a preguntar por código.");

/* ==========================================================================
   BLOQUE 3: SOLICITUD DE AUTORIZACIÓN CON 'requestPermission()'
   ========================================================================== */
// Imprimimos la cabecera del tercer bloque
imprimirTitulo(3, "SOLICITUD DE PERMISO Y ENVÍO DE NOTIFICACIONES");

// Función asíncrona principal para demostrar el flujo completo de permiso + envío + eventos
async function ejecutarFlujoNotificaciones() {
    // 1. Solicitamos permiso de forma asíncrona (en navegador real debe ir dentro de un evento click)
    console.log("🔑 Solicitando autorización mediante Notification.requestPermission()...");
    const resultado = esEntornoNavegador
        ? NotificationAPI.permission
        : await NotificationAPI.requestPermission();

    // Informamos la decisión obtenida
    console.log(`   ↳ Resultado del permiso: "${resultado}"`);

    // 2. Solo instanciamos new Notification() si el permiso es "granted"
    if (resultado === "granted") {
        // Definimos el objeto de configuración options
        const opciones = {
            // Texto descriptivo debajo del título
            body: "Tu reporte mensual ya está listo para descargar.",
            // Ruta del icono que acompaña la alerta
            icon: "https://cdn-icons-png.flaticon.com/512/1827/1827347.png",
            // Etiqueta única para reemplazar alertas anteriores con el mismo tag sin hacer spam
            tag: "reporte-mensual",
            // Indica si la notificación debe emitirse sin sonido
            silent: false
        };

        // Creamos y mostramos la notificación nativa
        const alerta = new NotificationAPI("¡Proceso Completado!", opciones);

        // 3. Registramos eventos de interacción sobre la instancia de notificación
        alerta.addEventListener("click", () => {
            // En el navegador enfocamos la ventana de la aplicación
            if (esEntornoNavegador) window.focus();
            // Informamos en consola la interacción del usuario
            console.log("   🖱️ [EVENTO click] El usuario pulsó la notificación -> window.focus() + close().");
            // Cerramos la notificación tras el clic
            alerta.close();
        });

        // Escuchamos el evento de cierre
        alerta.addEventListener("close", () => {
            // Confirmamos el cierre de la alerta
            console.log("   ❎ [EVENTO close] La notificación fue cerrada.");
        });

        // En Node.js simulamos que el usuario hace clic sobre la alerta para disparar los eventos
        if (!esEntornoNavegador) {
            alerta._simularClic();
        }
    } else {
        // En navegador, recordamos que requestPermission() debe invocarse tras un clic de botón
        console.log("   ℹ️ En el navegador, haz clic en el botón del Laboratorio (Slide 9) para solicitar permiso.");
    }

    /* ==========================================================================
       BLOQUE 4: ANALOGÍAS DEL MUNDO REAL
       ========================================================================== */
    imprimirTitulo(4, "ANALOGÍAS DEL MUNDO REAL: EL PORTERO Y EL TABLERO CON ETIQUETAS");
    console.log("🏢 1. El Portero de un Edificio (requestPermission):");
    console.log("   - Llama por el citófono antes de dejar subir paquetes. Si dices sí ('granted'), pasan directo.");
    console.log("   - Si dices no volver a molestar ('denied'), rechazará futuros avisos automáticamente.");
    console.log("\n📌 2. El Tablero de Avisos con Etiquetas (tag):");
    console.log("   - Usar el mismo 'tag' reemplaza la nota anterior en el tablero en vez de apilar 10 iguales.");

    /* ==========================================================================
       BLOQUE 5: BUENAS PRÁCTICAS Y ERRORES COMUNES
       ========================================================================== */
    imprimirTitulo(5, "BUENAS PRÁCTICAS Y ERRORES HABITUALES");
    console.log("✅ Pedir permiso en contexto tras un clic explícito del usuario (botón).");
    console.log("✅ Combinarla con 'visibilitychange': si la pestaña está 'visible', usa un toast interno.");
    console.log("✅ Usar 'window.focus()' dentro del evento 'click' de la notificación.");
    console.log("❌ Error común: Llamar a requestPermission() apenas carga la página (bloqueado).");
    console.log("❌ Error común: Enviar múltiples notificaciones seguidas sin agrupar con 'tag'.");

    /* ==========================================================================
       BLOQUE 6: RESUMEN TÉCNICO DEL MÓDULO
       ========================================================================== */
    imprimirTitulo(6, "RESUMEN TÉCNICO DE NOTIFICATIONS API");
    console.log("1. 🔍 Notification.permission: 'default' | 'granted' | 'denied'.");
    console.log("2. 🔑 Notification.requestPermission(): retorna Promesa con la decisión del usuario.");
    console.log("3. 🔔 new Notification(titulo, options): dispara la alerta en el sistema operativo.");
    console.log("4. 🖱️ Eventos: 'click', 'close', 'show', 'error' sobre la instancia creada.");
    console.log("=".repeat(78));
    console.log("🎓 ¡Módulo de Notifications API completado con éxito al 100%!");
    console.log("=".repeat(78));
}

// Ejecutamos el flujo pedagógico principal
ejecutarFlujoNotificaciones();
