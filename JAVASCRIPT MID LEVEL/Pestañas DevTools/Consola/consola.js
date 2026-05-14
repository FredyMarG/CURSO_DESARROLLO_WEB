/**
 * 💻 CONSOLE TAB LABORATORY
 * Uso de métodos de visualización y depuración avanzada.
 */

// 1. Registro básico de información
console.log("Iniciando monitor de consola...");

// 2. Visualización de datos complejos en formato de tabla (Data Mapping)
const dataset = [
    { id: 101, evento: "Click", timestamp: Date.now() },
    { id: 102, evento: "Scroll", timestamp: Date.now() }
];
console.table(dataset); // Genera una tabla interactiva en la consola

// 3. Agrupación lógica de mensajes (Grouping)
console.group("Diagnóstico de Carga");
console.info("DOM: Cargado");
console.info("Scripts: Activos");
console.warn("Advertencia: Latencia de renderizado detectada");
console.groupEnd(); // Finaliza el bloque de grupo

// 4. Personalización estética del log mediante CSS (String substitution)
const estilos = "color: white; background: #2563eb; padding: 5px; border-radius: 3px;";
console.log("%c INFO: Laboratorio de Consola configurado con éxito ", estilos);