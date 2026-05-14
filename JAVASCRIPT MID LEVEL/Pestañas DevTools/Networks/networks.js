/**
 * 🌐 NETWORK TAB LABORATORY
 * Este script simula el ciclo de vida de una petición HTTP.
 */

// Definimos una función asíncrona para manejar peticiones Fetch
const simularTraficoDeRed = async () => {
    try {
        // Iniciamos la petición a una API externa (aparecerá en la pestaña Network como 'fetch')
        const respuesta = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        
        // Parseamos el cuerpo de la respuesta a formato JSON (ver pestaña 'Response')
        const datos = await respuesta.json();
        
        // Imprimimos en consola para confirmar la llegada de los datos
        console.log("Datos de red obtenidos:", datos);
    } catch (error) {
        // En caso de fallo (ej. sin internet), la petición se marcará en rojo en 'Network'
        console.error("Fallo detectado en el flujo de red:", error);
    }
};

// Ejecutamos la función inmediatamente al cargar la página
simularTraficoDeRed();