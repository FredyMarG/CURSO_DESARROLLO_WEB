/**
 * ⏱️ PERFORMANCE TAB LABORATORY
 * Este script simula cargas de trabajo para analizar el Main Thread.
 */

const boton = document.getElementById('btn-heavy');
const status = document.getElementById('status-text');

/**
 * Simula una tarea pesada que bloquea el hilo principal.
 * En la pestaña Performance, esto aparecerá como una barra roja (Long Task).
 */
const ejecutarTareaPesada = () => {
    // Actualizamos el DOM antes del bloqueo
    status.innerHTML = 'Estado: <span class="status-busy">BLOQUEADO (Procesando...)</span>';
    
    // Iniciamos la medición de tiempo en consola
    console.time("TareaPesada");
    
    // Un bucle síncrono largo que consume CPU (Aproximadamente 500ms-1s dependiendo del equipo)
    const inicio = performance.now();
    while (performance.now() - inicio < 1000) {
        // El navegador está totalmente congelado aquí
        // No se puede hacer scroll, ni click, ni animaciones.
    }
    
    console.timeEnd("TareaPesada");
    
    // Restauramos el estado
    status.innerHTML = 'Estado: <span class="status-ready">Tarea Finalizada - Revisa el Flame Chart</span>';
};

// Event listener para disparar la tarea manualmente durante la grabación
boton.addEventListener('click', () => {
    // Usamos un pequeño timeout para que el cambio de texto en el DOM se pinte 
    // ANTES de que el bucle bloquee el hilo principal.
    setTimeout(ejecutarTareaPesada, 100);
});

console.log("Laboratorio de Performance listo. Presiona Record y luego el botón.");