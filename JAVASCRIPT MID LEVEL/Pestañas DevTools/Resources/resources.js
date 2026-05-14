/**
 * 🧪 SOURCES TAB LABORATORY
 * Este script está diseñado para practicar Debugging.
 */

// Función que simula un proceso de cálculo para probar Breakpoints
const calcularEstadoRecursos = () => {
    console.log("Iniciando análisis de recursos...");
    
    // Intenta colocar un 'Breakpoint' en la línea de abajo para inspeccionar la variable 'i'
    for (let i = 1; i <= 3; i++) {
        const mensaje = `Analizando recurso nivel ${i}...`;
        console.log(mensaje);
    }
    
    console.info("Análisis finalizado. Intenta usar 'Pretty Print' ({}) en la pestaña Sources.");
};

// Ejecución inicial
calcularEstadoRecursos();

/**
 * TIP PROFESIONAL:
 * Usa CTRL + P para buscar rápidamente este archivo (resources.js) dentro de la pestaña Sources.
 */