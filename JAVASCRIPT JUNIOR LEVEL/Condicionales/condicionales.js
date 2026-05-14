/**
 * LABORATORIO: ESTRUCTURAS DE CONTROL CONDICIONALES
 * En este script exploramos cómo el programa puede "decidir" qué camino tomar
 * dependiendo de si una condición es verdadera (true) o falsa (false).
 */

console.log("%c--- LABORATORIO: CONDICIONALES ---", "color: #e11d48; font-weight: bold; font-size: 12px;");

/* 1. Estructura Básica: if / else if / else */
let hora = 14;

/**
 * El bloque 'if' evalúa una expresión booleana.
 * FLUJO: Evaluación secuencial hasta encontrar la primera coincidencia verdadera.
 */
if (hora < 12) {
    console.log("%cResultado IF:", "color: #e11d48;", "Buenos días");
} else if (hora >= 12 && hora <= 18) {
    console.log("%cResultado ELSE IF:", "color: #e11d48;", "Buenas tardes"); 
} else {
    console.log("%cResultado ELSE:", "color: #e11d48;", "Buenas noches");
}

/* 2. Operador Ternario (Condicional en una sola línea) */
/**
 * SINTAXIS: (condicion) ? valor_si_true : valor_si_false;
 * Sintaxis: (condicion) ? valor_si_es_verdadero : valor_si_es_falso;
 */
let edad = 20;
let mensaje = (edad >= 18) ? "Es mayor de edad" : "Es menor de edad";
console.log("%cOperador Ternario:", "color: #e11d48; font-style: italic;", mensaje);

/* 3. Estructura Switch */
/**
 * OPTIMIZACIÓN: Ideal para evaluar una sola variable contra múltiples valores constantes.
 * IMPORTANTE: El 'break' evita la ejecución en cascada (fall-through).
 */
let diaSemana = 3;
let nombreDia = "";

switch (diaSemana) {
    case 1:
        nombreDia = "Lunes";
        break;
    case 2:
        nombreDia = "Martes";
        break;
    case 3:
        nombreDia = "Miércoles"; // Caso coincidente
        break;
    default:
        nombreDia = "Día no válido"; // Se ejecuta si ningún caso coincide
}
console.log("%cResultado SWITCH:", "color: #e11d48; font-weight: bold;", `Hoy es ${nombreDia}`);

/* 4. Evaluación de valores "Truthy" y "Falsy" */
/**
 * JavaScript convierte valores automáticamente a booleanos en contextos condicionales.
 * VALORES FALSY: false, 0, "", null, undefined, NaN.
 */
let nombreUsuario = ""; // String vacío es 'Falsy'

if (nombreUsuario) {
    console.log("Bienvenido " + nombreUsuario);
} else {
    console.log("%cEvaluación Truthy/Falsy:", "color: #4b5563;", "Usuario anónimo detectado");
}

/* 5. Ejemplo práctico: Validación de acceso */
let tieneEntrada = true;
let dinero = 50;
const PRECIO_ENTRADA = 100;

// Uso de operadores lógicos combinados
if (tieneEntrada || dinero >= PRECIO_ENTRADA) {
    console.log("%cAcceso:", "color: #059669; font-weight: bold;", "Concedido");
} else {
    console.log("%cAcceso:", "color: #dc2626; font-weight: bold;", "Denegado");
}