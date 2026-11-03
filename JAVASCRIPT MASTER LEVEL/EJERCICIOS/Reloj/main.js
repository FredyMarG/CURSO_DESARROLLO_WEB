/**
 * ==============================================================================
 * 🕰️ EJERCICIO PRÁCTICO: RELOJ DIGITAL EN TIEMPO REAL CON EL OBJETO DATE
 * ==============================================================================
 * Archivo: main.js
 * Propósito: Obtener la hora del sistema segundo a segundo, formatear los dígitos
 *            con ceros a la izquierda y actualizar el DOM dinámicamente.
 * Documentación pedagógica detallada línea por línea.
 * ==============================================================================
 */

// ==============================================================================
// 1. DIRECTIVA DE MODO ESTRICTO
// ==============================================================================

// Activamos el modo estricto de ECMAScript para evitar errores silenciosos y variables globales accidentales
"use strict";


// ==============================================================================
// 2. FUNCIÓN AUXILIAR DE FORMATEO: CEROS A LA IZQUIERDA (addZeros)
// ==============================================================================

// Declaramos una función flecha que recibe un número 'n' (horas, minutos o segundos)
// para garantizar que siempre tenga al menos 2 dígitos (ej. convierte 5 en "05").
const addZeros = n => {
    // Convertimos el número 'n' a cadena de texto con .toString() y evaluamos su longitud (.length).
    // Si tiene menos de 2 caracteres (es decir, números del 0 al 9), le concatenamos un "0" delante:
    if (n.toString().length < 2) return "0".concat(n);

    // Si el número ya tiene 2 dígitos (del 10 al 59), lo retornamos tal cual sin modificarlo:
    // (Nota técnica: En ES2017+ también se puede lograr con: String(n).padStart(2, "0"))
    return n;
};


// ==============================================================================
// 3. FUNCIÓN PRINCIPAL DE EXTRACCIÓN Y RENDERIZADO (actualizarHora)
// ==============================================================================

// Declaramos la función flecha encargada de leer el reloj del sistema y pintar los datos en el HTML
const actualizarHora = () => {
    // Instanciamos el objeto nativo 'Date' para capturar una fotografía exacta del tiempo actual del sistema
    const time = new Date();

    // Extraemos la hora actual (0 a 23) con .getHours() y la pasamos por 'addZeros' para asegurar 2 dígitos
    let horas = addZeros(time.getHours());

    // Extraemos los minutos actuales (0 a 59) con .getMinutes() y aplicamos el relleno de cero a la izquierda
    let min = addZeros(time.getMinutes());

    // Extraemos los segundos actuales (0 a 59) con .getSeconds() y aplicamos el relleno de cero a la izquierda
    let seg = addZeros(time.getSeconds());

    // Seleccionamos el elemento <div class="hora"> del DOM e inyectamos el texto de las horas formateadas
    document.querySelector(".hora").textContent = horas;

    // Seleccionamos el elemento <div class="min"> del DOM e inyectamos el texto de los minutos formateados
    document.querySelector(".min").textContent = min;

    // Seleccionamos el elemento <div class="seg"> del DOM e inyectamos el texto de los segundos formateados
    document.querySelector(".seg").textContent = seg;
};


// ==============================================================================
// 4. INICIALIZACIÓN INMEDIATA Y CICLO DE ACTUALIZACIÓN (setInterval)
// ==============================================================================

// Invocamos 'actualizarHora()' inmediatamente al cargar el script.
// ¿Por qué?: Porque 'setInterval' tarda 1 segundo (1000 ms) en ejecutar su primera llamada;
// sin esta línea inicial, el reloj mostraría "00 : 00 : 00" durante el primer segundo en pantalla.
actualizarHora();

// Programamos la ejecución repetitiva de 'actualizarHora' cada 1000 milisegundos (1 segundo)
// para mantener el reloj digital sincronizado en tiempo real.
setInterval(actualizarHora, 1000);
