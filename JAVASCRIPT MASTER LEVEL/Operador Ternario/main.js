/**
 * ==============================================================================
 * ⚡ JAVASCRIPT MASTER LEVEL: MÓDULO COMPLETO DEL OPERADOR TERNARIO (? :)
 * ==============================================================================
 * Archivo: main.js
 * Propósito: Guía práctica ejecutable, comentada y explicada línea por línea al 100%
 * Ejecución: En terminal con 'node main.js' o directamente en la consola del navegador
 * 
 * TEMARIO DEL MÓDULO (DOCUMENTACION/OPERADOR TERNARIO.md):
 * 1. Definición del Operador Ternario (El único operador de 3 operandos en JavaScript)
 * 2. Expresión vs. Declaración (Diferencia fundamental con 'if...else')
 * 3. Sintaxis básica y anatomía de los 3 operandos (Condición ? Verdad : Falsedad)
 * 4. Evaluación de valores Truthy y Falsy en la condición
 * 5. Asignación implícita e inmutabilidad con 'const'
 * 6. Comparativa visual y técnica: 'if...else' tradicional vs. Operador Ternario
 * 7. Precedencia y orden de evaluación asociativa de derecha a izquierda
 * 8. Analogía del mundo real: El interruptor eléctrico de dos vías 💡
 * 9. Diagrama de flujo de decisión binaria
 * 10. Buenas prácticas recomendadas en la industria (Condiciones legibles con paréntesis)
 * 11. Errores comunes y antipatrones (Anidamiento excesivo y ejecución de efectos secundarios)
 * 12. Antipatrón booleano redundante (condicion ? true : false)
 * 13. Uso del Operador Ternario dentro de funciones flecha y retornos implícitos
 * 14. Uso en plantillas de texto (Template Literals) para inyección dinámica
 * 15. Resolución completa de los 3 Ejercicios del curso (Niveles 1, 2 y 3)
 * 16. Resumen maestro y chuleta técnica
 * ==============================================================================
 */

// Activamos el modo estricto para garantizar código limpio y sin fallos silenciosos
"use strict";

// Función auxiliar para imprimir divisores elegantes y pedagógicos en la consola
function imprimirSeparador(numeroBloque, titulo) {
    // Imprime un salto de línea inicial para separar del bloque previo
    console.log("\n" + "=".repeat(78));
    // Imprime el número del bloque y el título descriptivo en mayúsculas
    console.log(`📌 BLOQUE ${numeroBloque}: ${titulo}`);
    // Imprime la línea divisoria inferior de cierre
    console.log("=".repeat(78));
}


// ==============================================================================
// BLOQUE 1: DEFINICIÓN DEL OPERADOR TERNARIO
// ==============================================================================
imprimirSeparador(1, "DEFINICIÓN DEL OPERADOR TERNARIO");

// El operador ternario es el ÚNICO operador en todo el lenguaje JavaScript que recibe 3 operandos.
// Es una estructura condicional condensada que sustituye al 'if...else' tradicional en escenarios simples.
// Operando 1: La condición a evaluar (expresión booleana, truthy o falsy).
// Operando 2: La expresión que se ejecuta y devuelve si la condición es verdadera (tras el '?').
// Operando 3: La expresión que se ejecuta y devuelve si la condición es falsa (tras el ':').

const hora = 14;
// Evaluamos si la hora es menor a 12 para determinar el saludo
const saludo = hora < 12 ? "Buenos días" : "Buenas tardes";
console.log("Saludo según la hora (14h)      :", saludo); // Imprime: "Buenas tardes"


// ==============================================================================
// BLOQUE 2: EXPRESIÓN VS. DECLARACIÓN (DIFERENCIA CON IF...ELSE)
// ==============================================================================
imprimirSeparador(2, "EXPRESIÓN (DEVUELVE VALOR) VS. DECLARACIÓN");

// Un bloque 'if...else' es una DECLARACIÓN (statement): ejecuta instrucciones pero NO produce un valor directo.
// Por eso no puedes hacer: const x = if (true) { 1 } else { 2 }; // ❌ SyntaxError

// El Operador Ternario es una EXPRESIÓN (expression): produce y devuelve un valor inmediatamente.
// Esto permite usarlo a la derecha del signo igual '=' o como argumento directo de una función.

const puntaje = 85;
// Asignamos directamente el valor producido por la expresión ternaria
const resultadoPrueba = puntaje >= 60 ? "Aprobado" : "Reprobado";
console.log("Resultado de evaluación directa :", resultadoPrueba);


// ==============================================================================
// BLOQUE 3: ANATOMÍA DE LOS 3 OPERANDOS
// ==============================================================================
imprimirSeparador(3, "ANATOMÍA DE LOS 3 OPERANDOS ( ? : )");

// Estructura:
// [Condición] ? [Expresión Verdadera] : [Expresión Falsa]
//      │      │          │           │          │
//      │      │          │           │          └─ Caso 'Else' (si la condición falla)
//      │      │          │           └──────────── Separador de alternativa
//      │      │          └──────────────────────── Caso 'Then' (si la condición se cumple)
//      │      └─────────────────────────────────── Operador de interrogación ("¿Es verdad?")
//      └────────────────────────────────────────── Pregunta lógica a resolver

const temperatura = 28;
const recomendacion = temperatura > 25 ? "Llevar ropa ligera" : "Llevar abrigo";
console.log("Temperatura actual: 28°C        ->", recomendacion);


// ==============================================================================
// BLOQUE 4: EVALUACIÓN DE VALORES TRUTHY Y FALSY
// ==============================================================================
imprimirSeparador(4, "EVALUACIÓN DE VALORES TRUTHY Y FALSY");

// En JavaScript, la condición no tiene que ser estrictamente un booleano 'true' o 'false'.
// El motor realiza una conversión implícita (Type Coercion) a booleano:
// Falsy values: false, 0, -0, 0n, "", null, undefined, NaN.
// Truthy values: Cualquier otro valor (cadenas con texto, números != 0, arrays [], objetos {}).

const nombreUsuario = ""; // Cadena vacía es FALSY
const nombreMostrado = nombreUsuario ? nombreUsuario : "Invitado Anónimo";
console.log("Usuario con string vacío \"\"     :", nombreMostrado); // Imprime: "Invitado Anónimo"

const saldoCuenta = 500; // Número distinto de 0 es TRUTHY
const estadoCuenta = saldoCuenta ? "Cuenta con fondos" : "Cuenta en ceros";
console.log("Saldo numérico 500 (Truthy)     :", estadoCuenta);


// ==============================================================================
// BLOQUE 5: ASIGNACIÓN IMPLÍCITA E INMUTABILIDAD CON 'const'
// ==============================================================================
imprimirSeparador(5, "INMUTABILIDAD CON CONST MEDIANTE EL TERNARIO");

// Con 'if...else', te ves forzado a declarar la variable con 'let' fuera del bloque
// para poder reasignarla dentro, perdiendo la seguridad de las constantes inmutables.
let categoriaSloppy;
const aniosExperiencia = 6;

if (aniosExperiencia >= 5) {
    categoriaSloppy = "Senior";
} else {
    categoriaSloppy = "Junior";
}
console.log("Variable con 'let' y 'if/else'  :", categoriaSloppy);

// Con el operador ternario, la variable puede ser 100% inmutable con 'const':
const categoriaStrict = aniosExperiencia >= 5 ? "Senior" : "Junior";
console.log("Variable con 'const' y ternario :", categoriaStrict);


// ==============================================================================
// BLOQUE 6: COMPARATIVA DETALLADA: IF...ELSE VS. TERNARIO
// ==============================================================================
imprimirSeparador(6, "COMPARATIVA: IF...ELSE VS. TERNARIO");

// Escenario: Calcular costo de entrada según membresía activa
const esSocioClub = true;

// 1. Forma con if...else (6 líneas de código, variable mutable)
let tarifaIfElse;
if (esSocioClub) {
    tarifaIfElse = "$2.00 USD";
} else {
    tarifaIfElse = "$10.00 USD";
}

// 2. Forma con Operador Ternario (1 sola línea limpia e inmutable)
const tarifaTernario = esSocioClub ? "$2.00 USD" : "$10.00 USD";

console.log("Tarifa con if...else tradicional :", tarifaIfElse);
console.log("Tarifa con Operador Ternario     :", tarifaTernario);


// ==============================================================================
// BLOQUE 7: PRECEDENCIA Y ASOCIATIVIDAD DE DERECHA A IZQUIERDA
// ==============================================================================
imprimirSeparador(7, "PRECEDENCIA Y ASOCIATIVIDAD");

// El operador ternario tiene una precedencia menor que los operadores aritméticos y lógicos (+, -, >, <, &&, ||).
// Por lo tanto, las operaciones de comparación a la izquierda se resuelven antes de evaluar el ternario:
const precioBase = 100;
const descuento = 20;
const limite = 70;

// Aquí 'precioBase - descuento' se evalúa primero (80), luego '80 > limite' (true):
const resultadoPrecedencia = precioBase - descuento > limite ? "Por encima del límite" : "Por debajo";
console.log("Evaluación de precedencia        :", resultadoPrecedencia);

// La asociatividad del operador ternario es de DERECHA A IZQUIERDA:
// a ? b : c ? d : e  se interpreta como  a ? b : (c ? d : e)


// ==============================================================================
// BLOQUE 8: ANALOGÍA DEL MUNDO REAL: EL INTERRUPTOR DE DOS VÍAS 💡
// ==============================================================================
imprimirSeparador(8, "ANALOGÍA DEL MUNDO REAL: EL INTERRUPTOR 💡");

console.log(`
💡 METÁFORA DEL INTERRUPTOR DE LUZ DE DOS VÍAS:
1. Condición: La posición física del interruptor en la pared.
   - ¿Está arriba? (interruptorArriba === true)
2. El signo '?': Si la respuesta es SÍ:
   - Consecuencia inmediata: La bombilla se enciende ("Luz Encendida").
3. Los dos puntos ':': Si la respuesta es NO:
   - Consecuencia inmediata: La habitación queda en penumbra ("Luz Apagada").
No existen estados flotantes ni términos medios; es una bifurcación directa y binaria.
`);


// ==============================================================================
// BLOQUE 9: DIAGRAMA DE FLUJO DE DECISIÓN
// ==============================================================================
imprimirSeparador(9, "DIAGRAMA DE FLUJO DE DECISIÓN BINARIA");

console.log(`
                 [ Evaluar Condición Lógica ]
                              │
               ┌──────────────┴──────────────┐
               ▼ ¿Es Verdadera (Truthy)?     ▼ ¿Es Falsa (Falsy)?
              [?]                           [:]
               │                             │
               ▼                             ▼
      [ Ejecuta Expresión 1 ]       [ Ejecuta Expresión 2 ]
               │                             │
               └──────────────┬──────────────┘
                              ▼
                 [ Retorno o Asignación Final ]
`);


// ==============================================================================
// BLOQUE 10: BUENAS PRÁCTICAS RECOMENDADAS
// ==============================================================================
imprimirSeparador(10, "BUENAS PRÁCTICAS EN LA INDUSTRIA");

// 1. Usar paréntesis para delimitar condiciones compuestas y favorecer la lectura:
const puntajeCredito = 750;
const ingresosMensuales = 4000;

// Los paréntesis hacen visible de inmediato dónde termina la lógica de evaluación:
const estadoPrestamo = (puntajeCredito > 700 && ingresosMensuales > 3000) 
    ? "Crédito Aprobado" 
    : "Crédito Rechazado";

console.log("Evaluación con paréntesis claros :", estadoPrestamo);

// 2. Limitar el uso del ternario a asignaciones sencillas de una sola línea.


// ==============================================================================
// BLOQUE 11: ERRORES COMUNES Y ANTIPATRONES
// ==============================================================================
imprimirSeparador(11, "ERRORES COMUNES Y ANTIPATRONES");

// ❌ ANTIPATRÓN 1: Ternarios Anidados o Encadenados
// Dificultan gravemente el mantenimiento del software.
const nivel = 2;
// Evitar escribir estructuras como esta:
const etiquetaMala = nivel === 1 ? "Básico" : nivel === 2 ? "Intermedio" : nivel === 3 ? "Avanzado" : "Experto";
console.log("Antipatrón anidado (evitar)      :", etiquetaMala);

// ✅ Solución recomendada para 3 o más casos: Usar 'switch' o un mapa de objetos (Object Lookup):
const mapaNiveles = {
    1: "Básico",
    2: "Intermedio",
    3: "Avanzado"
};
const etiquetaLimpia = mapaNiveles[nivel] || "Experto";
console.log("Solución limpia con Object Lookup:", etiquetaLimpia);

// ❌ ANTIPATRÓN 2: Usar el ternario para ejecutar bloques de código con múltiples efectos secundarios
// (autenticado ? (abrirSesion(), cargarDatos(), redirigir()) : mostrarError();)
// Para lógica de control procedimental, 'if...else' es siempre la herramienta adecuada.


// ==============================================================================
// BLOQUE 12: EL ANTIPATRÓN BOOLEANO REDUNDANTE
// ==============================================================================
imprimirSeparador(12, "ANTIPATRÓN BOOLEANO REDUNDANTE");

const edadUsuario = 22;

// ❌ Antipatrón innecesario:
// Escribir '? true : false' cuando la comparación por sí misma YA produce un booleano:
const esMayorDeEdadRedundante = edadUsuario >= 18 ? true : false;
console.log("Forma redundante (? true : false):", esMayorDeEdadRedundante);

// ✅ Solución profesional: Asignar directamente el resultado de la comparación:
const esMayorDeEdadOptimo = edadUsuario >= 18;
console.log("Forma óptima directa            :", esMayorDeEdadOptimo);


// ==============================================================================
// BLOQUE 13: USO DEL TERNARIO DENTRO DE FUNCIONES FLECHA
// ==============================================================================
imprimirSeparador(13, "TERNARIO DENTRO DE FUNCIONES FLECHA");

// La combinación de funciones flecha y el operador ternario permite retornos implícitos
// sumamente elegantes y legibles en una sola línea:

const evaluarRendimiento = calificacion => 
    calificacion >= 90 ? "Sobresaliente" : "Estándar";

console.log("Rendimiento 95 con Arrow Function:", evaluarRendimiento(95));
console.log("Rendimiento 75 con Arrow Function:", evaluarRendimiento(75));


// ==============================================================================
// BLOQUE 14: USO EN PLANTILLAS DE TEXTO (TEMPLATE LITERALS)
// ==============================================================================
imprimirSeparador(14, "INYECCIÓN EN TEMPLATE LITERALS (${ ? : })");

// Como el operador ternario es una expresión, se puede incrustar directamente dentro de `${}`
// en una plantilla literal (Template Literal), algo imposible con un 'if...else':

const totalItems = 1;
// Inyectamos dinámicamente el plural o singular de la palabra:
const textoCarrito = `Tienes ${totalItems} producto${totalItems === 1 ? "" : "s"} en tu carrito.`;
console.log("Inyección dinámica en Template   :", textoCarrito);

const totalItemsVarios = 4;
console.log("Inyección en plural              :", `Tienes ${totalItemsVarios} producto${totalItemsVarios === 1 ? "" : "s"} en tu carrito.`);


// ==============================================================================
// BLOQUE 15: RESOLUCIÓN DE LOS 3 EJERCICIOS DEL TEMARIO
// ==============================================================================
imprimirSeparador(15, "RESOLUCIÓN DE LOS 3 EJERCICIOS DEL CURSO");

// --- EJERCICIO 1 (Nivel Junior) ---
// Enunciado: Evaluar si un número es par o impar y asignar "Par" o "Impar" a una constante 'resultado'.
console.log("--- EJERCICIO 1 (Nivel Junior): Número Par o Impar ---");
const numero = 7;
// Si el resto de dividir por 2 es 0, es par; de lo contrario, impar:
const resultado = numero % 2 === 0 ? "Par" : "Impar";
console.log(`¿El número ${numero} es par o impar?     :`, resultado);

// --- EJERCICIO 2 (Nivel Semi-Senior) ---
// Enunciado: Optimizar el bloque tradicional de rol 'admin' a un operador ternario dinámico:
console.log("\n--- EJERCICIO 2 (Nivel Semi-Senior): Optimización de Rol ---");
let rol = "admin";

// Implementación con operador ternario inmutable:
const acceso = rol === "admin" ? true : false;
console.log(`Rol evaluado: "${rol}" -> Acceso concedido:`, acceso);

// Nota técnica: en producción, también es válido simplificar a 'const acceso = rol === "admin";'
console.log("Validación directa simplificada   :", rol === "admin");

// --- EJERCICIO 3 (Nivel Avanzado / Semi-Senior) ---
// Enunciado: Función flecha 'obtenerMensajeEnvio(totalCompra, esPremium)' con retorno implícito de ternario:
// Si totalCompra >= 50 o esPremium es true -> "Envío Gratis"; de lo contrario -> "Costo de envío: $5".
console.log("\n--- EJERCICIO 3 (Nivel Avanzado): obtenerMensajeEnvio con Retorno Implícito ---");
const obtenerMensajeEnvio = (totalCompra, esPremium) => 
    (totalCompra >= 50 || esPremium) ? "Envío Gratis" : "Costo de envío: $5";

console.log("Compra $30 sin membresía premium  :", obtenerMensajeEnvio(30, false)); // "Costo de envío: $5"
console.log("Compra $60 sin membresía premium  :", obtenerMensajeEnvio(60, false)); // "Envío Gratis"
console.log("Compra $20 con membresía premium  :", obtenerMensajeEnvio(20, true));  // "Envío Gratis"


// ==============================================================================
// BLOQUE 16: RESUMEN MAESTRO Y CONCLUSIONES
// ==============================================================================
imprimirSeparador(16, "RESUMEN MAESTRO DEL OPERADOR TERNARIO");

console.log(`
RESUMEN TÉCNICO:
1. El Operador Ternario (? :) es una EXPRESIÓN de 3 operandos que retorna un valor directo.
2. Permite declarar variables inmutables con 'const' en una sola línea limpia.
3. Se evalúa de izquierda a derecha en su condición, y tiene asociatividad de derecha a izquierda.
4. Puede inyectarse directamente dentro de Template Literals: \`\${condicion ? 'A' : 'B'}\`.
5. Se acopla de forma idónea a los retornos implícitos de las funciones flecha: 'param => cond ? x : y'.
6. REGLA DE ORO: Evitar el anidamiento excesivo y nunca usarlo para reemplazar bloques de control complejos.
`);
console.log("==============================================================================");
console.log("🎯 [FIN DEL LABORATORIO]: Módulo de Operador Ternario completado con éxito.");
console.log("==============================================================================\n");
