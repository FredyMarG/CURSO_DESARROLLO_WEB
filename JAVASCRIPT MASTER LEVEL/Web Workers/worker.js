/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: WEB WORKERS API
 * ARCHIVO: worker.js (Hilo Secundario Dedicado)
 * Ejecuta cálculos intensivos en segundo plano sin bloquear la interfaz
 * Documentación pedagógica LÍNEA POR LÍNEA al 100%
 * ============================================================================
 */

// Activamos el modo estricto dentro del contexto global del Worker (DedicatedWorkerGlobalScope)
"use strict";

// Escuchamos los mensajes enviados desde el hilo principal mediante worker.postMessage()
self.onmessage = (e) => {
    // Extraemos la cantidad de iteraciones solicitada desde la propiedad e.data
    const { iteraciones } = e.data;

    // Inicializamos el acumulador numérico para la operación matemática pesada
    let suma = 0;

    // Ejecutamos el bucle intensivo que congelaría la pantalla si corriera en el hilo principal
    for (let i = 0; i < iteraciones; i++) {
        // Acumulamos el valor de cada iteración
        suma += i;
    }

    // Enviamos el resultado final de vuelta al hilo principal usando self.postMessage()
    self.postMessage(suma);
};
