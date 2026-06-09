// 1. Definición de la expresión a evaluar:
// 'key' es la variable que el switch comparará. 
// La comparación que realiza JS internamente es de identidad (===), 
// lo que significa que compara valor y tipo de dato.
let key = "pera"; 

// 2. Estructura de Control Switch:
// Evaluamos el valor contenido en 'key'.
switch (key) {
    // 3. Casos (Cases):
    // Si key === "banana", se ejecuta el código debajo de este case.
    case "banana":
        document.write("Esta fruta es amarilla");
        break; // Importante: 'break' detiene la ejecución y sale del switch.

    // El flujo entra aquí porque key es igual a "pera".
    case "pera":
        document.write("Esta fruta es verde");
        break; // Evita que el código siga ejecutándose hacia el siguiente caso.

    case "manzana":
        document.write("Esta fruta es roja");
        break;

    // 4. Caso por Defecto (Default):
    // Se ejecuta si ninguno de los casos anteriores coincide con 'key'.
    // Es como el 'else' final en una cadena de 'if/else'.
    default:
        document.write("No se que fruta es esta");
        break; // Aunque es el último, poner break es una buena práctica.
}

/** 
 * NOTA EDUCATIVA:
 * ¿Por qué usar switch en lugar de if/else?
 * 1. Legibilidad: Cuando tienes más de 3 condiciones sobre una misma variable, 
 *    el switch es mucho más fácil de leer.
 * 2. Rendimiento: En algunos motores de JS, los switch muy largos pueden ser 
 *    ligeramente más rápidos que los if/else if debido a cómo se optimizan 
 *    las tablas de búsqueda.
 */