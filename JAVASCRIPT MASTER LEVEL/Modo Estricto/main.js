/**
 * ==============================================================================
 * 🛡️ JAVASCRIPT MASTER LEVEL: LABORATORIO PRÁCTICO DE MODO ESTRICTO ("use strict")
 * ==============================================================================
 * Archivo: main.js
 * Propósito: Guía práctica ejecutable, comentada línea por línea al 100%
 * Ejecución: En terminal con 'node main.js' o en la consola del navegador
 * 
 * TEMARIO DEL LABORATORIO:
 * 1. Activación de la directiva y reglas de posición
 * 2. Prevención de variables globales accidentales (ReferenceError)
 * 3. Protección contra fallos silenciosos en objetos (TypeError)
 * 4. Restricciones del operador 'delete' en identificadores y propiedades
 * 5. Seguridad del contexto léxico de 'this' en funciones independientes
 * 6. Optimización en el motor V8: Desvinculación de 'arguments'
 * 7. Ámbito aislado y seguro de la función eval()
 * 8. Protección de palabras reservadas para ES6+
 * 9. Prohibición de parámetros duplicados y literales octales antiguos
 * 10. Activación automática en Clases y Módulos de ES6
 * 11. Caso de Estudio Real: Refactorización y blindaje de código legado
 * ==============================================================================
 */

// ==============================================================================
// BLOQUE 1: ACTIVACIÓN DE LA DIRECTIVA EN EL ÁMBITO GLOBAL
// ==============================================================================

// La directiva "use strict" DEBE ser la primera instrucción ejecutable del archivo.
// No es una palabra reservada ni una función, sino una "expresión literal de directiva" (directive prologue).
// Le indica al motor de JavaScript (V8 en Node/Chrome, SpiderMonkey en Firefox) que active el modo estricto.
"use strict";

// Función utilitaria para imprimir encabezados visuales y pedagógicos en la consola
function imprimirSeparador(numeroBloque, titulo) {
    // Imprime un salto de línea inicial
    console.log("\n" + "=".repeat(78));
    // Imprime el número de bloque con su título descriptivo
    console.log(`📌 BLOQUE ${numeroBloque}: ${titulo}`);
    // Imprime una línea divisoria inferior
    console.log("=".repeat(78));
}

// Imprimimos el primer encabezado de confirmación
imprimirSeparador(1, "ACTIVACIÓN GLOBAL DE LA DIRECTIVA");

// Verificamos en consola que el modo estricto está activo desde la línea 24
console.log("✅ [OK] Directiva 'use strict' declarada e inicializada correctamente en la línea 24.");
console.log("ℹ️  El motor JavaScript ahora ejecuta este archivo bajo las reglas seguras de ES5+.");


// ==============================================================================
// BLOQUE 2: PREVENCIÓN DE VARIABLES GLOBALES ACCIDENTALES (ReferenceError)
// ==============================================================================
imprimirSeparador(2, "PREVENCIÓN DE VARIABLES GLOBALES ACCIDENTALES");

// Explicación didáctica:
// En Modo Descuidado (Sloppy Mode), si asignas un valor a una variable sin usar 'let', 'const' o 'var',
// JavaScript la crea automáticamente en el objeto global (window en navegadores o global en Node.js).
// Si cometes un error tipográfico, tu código crea un bug fantasma muy difícil de encontrar.
// En Modo Estricto, esto es un error fatal de referencia: ReferenceError.

try {
    // Intentamos asignar un valor a una variable que NUNCA fue declarada previamente
    nombreUsuarioNoDeclarado = "Carlos Alberto";
} catch (error) {
    // El Modo Estricto detiene la ejecución inmediatamente y arroja un ReferenceError
    console.log("❌ [FALLO BLOQUEADO] Se detectó asignación a variable no declarada:");
    // Imprimimos el tipo de error capturado
    console.log(`   Tipo de Excepción : ${error.name}`);
    // Imprimimos el mensaje oficial que generó el motor V8
    console.log(`   Mensaje del Motor : ${error.message}`);
    // Explicación pedagógica de la solución
    console.log("   💡 Diagnóstico    : En Sloppy Mode esto creaba 'window.nombreUsuarioNoDeclarado'.");
    console.log("                       En Strict Mode se exige declarar con let o const.");
}

// Implementación Correcta y Profesional:
// Declaramos la variable de forma explícita antes de usarla
let nombreUsuarioSeguro = "Carlos Alberto";
// Mostramos el valor declarado correctamente
console.log("✅ [SOLUCIÓN VÁLIDA] Variable declarada explícitamente con 'let':", nombreUsuarioSeguro);


// ==============================================================================
// BLOQUE 3: CONVERSIÓN DE ERRORES SILENCIOSOS EN OBJETOS (TypeError)
// ==============================================================================
imprimirSeparador(3, "PROTECCIÓN CONTRA FALLOS SILENCIOSOS EN OBJETOS");

// Explicación didáctica:
// En Sloppy Mode, si intentas modificar una propiedad inmutable (como un objeto congelado o
// una propiedad con writable: false), JavaScript IGNORA la asignación en completo silencio.
// El programador asume que el cambio ocurrió, pero en memoria el objeto sigue igual.
// En Modo Estricto, JavaScript lanza un TypeError avisándote al instante.

// Subcaso 3.1: Propiedad de Solo Lectura (writable: false)
// Creamos un objeto literal vacío para representar un usuario
const usuario = {};

// Definimos la propiedad 'id' como inmutable utilizando Object.defineProperty
Object.defineProperty(usuario, "id", {
    // Valor inicial inmutable
    value: 101,
    // writable en false significa que está estrictamente prohibido reasignar su valor
    writable: false,
    // configurable en false impide borrarla o cambiar su descriptor
    configurable: false
});

try {
    // Intentamos reasignar una propiedad protegida contra escritura
    usuario.id = 999;
} catch (error) {
    // En Modo Estricto obtenemos un TypeError en lugar de un fallo silencioso
    console.log("❌ [FALLO BLOQUEADO] Intento de reasignar propiedad 'writable: false':");
    console.log(`   Tipo de Excepción : ${error.name}`);
    console.log(`   Mensaje del Motor : ${error.message}`);
}

// Subcaso 3.2: Objeto Congelado con Object.freeze()
// Creamos un objeto de configuración del servidor
const configuracionServidor = {
    // Puerto de red
    puerto: 8080,
    // Protocolo de transporte
    protocolo: "https"
};

// Congelamos el objeto para volver todas sus propiedades de solo lectura e impedir extensiones
Object.freeze(configuracionServidor);

try {
    // Intentamos alterar el puerto del servidor protegido
    configuracionServidor.puerto = 3000;
} catch (error) {
    // Capturamos el TypeError que previene modificar objetos congelados
    console.log("❌ [FALLO BLOQUEADO] Intento de alterar objeto congelado con Object.freeze():");
    console.log(`   Tipo de Excepción : ${error.name}`);
    console.log(`   Mensaje del Motor : ${error.message}`);
}

// Confirmamos que el valor original en memoria nunca fue corrompido
console.log("🔒 [VALOR PRESERVADO] El puerto original sigue seguro en memoria:", configuracionServidor.puerto);


// ==============================================================================
// BLOQUE 4: RESTRICCIONES DEL OPERADOR 'delete' (SyntaxError / TypeError)
// ==============================================================================
imprimirSeparador(4, "RESTRICCIONES DEL OPERADOR 'delete'");

// Explicación didáctica:
// El operador 'delete' fue diseñado única y exclusivamente para borrar propiedades de objetos.
// En Sloppy Mode:
// - Hacer 'delete miVariable' simplemente retornaba 'false' sin hacer nada.
// En Modo Estricto:
// - Intentar borrar un identificador directo (variable, función, argumento) es un SyntaxError fatal.
// - Intentar borrar propiedades no configurables arroja TypeError.

// Declaramos una variable normal en memoria
let tokenSesion = "token_temporal_12345";

// La siguiente línea comentada provocaría un SyntaxError directo al parsear el script:
// delete tokenSesion; // ❌ SyntaxError: Delete of an unqualified identifier in strict mode.

try {
    // Intentamos borrar una propiedad nativa no configurable de JavaScript (Object.prototype)
    // En Sloppy Mode: retornaría 'false' silenciosamente.
    // En Strict Mode: lanza un TypeError explícito.
    delete Object.prototype;
} catch (error) {
    console.log("❌ [FALLO BLOQUEADO] Intento de eliminar propiedad no configurable del lenguaje:");
    console.log(`   Tipo de Excepción : ${error.name}`);
    console.log(`   Mensaje del Motor : ${error.message}`);
}

// Demostración del uso legal y correcto de 'delete':
// Creamos un objeto con propiedades removibles
const carritoCompras = {
    producto: "Teclado Mecánico",
    descuentoCupon: 15
};

// Borramos una propiedad propia y configurable del objeto
delete carritoCompras.descuentoCupon;
// Mostramos el objeto resultante donde la propiedad fue eliminada válidamente
console.log("✅ [USO CORRECTO DE DELETE] Propiedad de objeto eliminada con éxito:", carritoCompras);


// ==============================================================================
// BLOQUE 5: SEGURIDAD DEL CONTEXTO 'this' EN FUNCIONES INDEPENDIENTES
// ==============================================================================
imprimirSeparador(5, "SEGURIDAD DE 'this' EN FUNCIONES SUELTAS");

// Explicación didáctica:
// En Sloppy Mode, si llamas a una función ordinaria sin un objeto que la preceda,
// 'this' adopta automáticamente el objeto global (window o global).
// Esto era una falla grave de seguridad porque una función de utilidad podía modificar
// sin querer variables de todo el sistema.
// En Modo Estricto, 'this' permanece como 'undefined' si no hay un objeto invocador.

// Declaramos una función ordinaria
function inspeccionarContextoThis() {
    // Retornamos el valor actual de 'this' recibido por la función
    return this;
}

// Ejecutamos la función como función suelta (sin objeto antes del punto)
const contextoResultado = inspeccionarContextoThis();

// Imprimimos el valor obtenido
console.log("🎯 Valor capturado de 'this' en función suelta:", contextoResultado); // undefined

// Comprobación booleana estricta
if (contextoResultado === undefined) {
    console.log("✅ [SEGURO] 'this' es estrictamente 'undefined'.");
    console.log("           Se impidió el acceso accidental al objeto global del entorno.");
}


// ==============================================================================
// BLOQUE 6: OPTIMIZACIÓN DE MEMORIA V8: DESVINCULACIÓN DE 'arguments'
// ==============================================================================
imprimirSeparador(6, "DESVINCULACIÓN DE 'arguments' Y OPTIMIZACIÓN V8");

// Explicación didáctica:
// En Sloppy Mode, el objeto 'arguments' y los parámetros formales de la función estaban
// "mágicamente" sincronizados: cambiar el parámetro mutaba el índice de arguments y viceversa.
// Esto impedía que el motor de JavaScript (V8) realizara optimizaciones rápidas de compilación.
// En Modo Estricto, 'arguments' conserva una foto inmutable de los valores de entrada originales.

function calcularOptimizacionArgs(parametroBase) {
    // Reasignamos el valor del parámetro dentro del cuerpo de la función
    parametroBase = 999;

    // En Modo Estricto:
    // - parametroBase refleja el nuevo valor (999).
    // - arguments[0] conserva el valor original enviado al llamar la función (42).
    return {
        valorParametroActual: parametroBase,
        valorOriginalArguments: arguments[0]
    };
}

// Invocamos la función enviando el valor inicial 42
const resultadoOpt = calcularOptimizacionArgs(42);

// Mostramos la independencia de ambas referencias
console.log("⚡ Parámetro local modificado por la función :", resultadoOpt.valorParametroActual);     // 999
console.log("⚡ Valor original preservado en arguments[0]  :", resultadoOpt.valorOriginalArguments); // 42
console.log("💡 [POR QUÉ OCURRE]: El motor V8 no gasta ciclos de reloj sincronizándolos en memoria.");


// ==============================================================================
// BLOQUE 7: AISLAMIENTO ESTRICTO DE LA FUNCIÓN eval()
// ==============================================================================
imprimirSeparador(7, "AISLAMIENTO ESTRICTO DE eval()");

// Explicación didáctica:
// En Sloppy Mode, invocar 'eval("var x = 10")' creaba la variable 'x' en el ámbito de la función externa.
// Esto "rompía" el ámbito léxico, impidiendo que el motor optimizara el código en tiempo de compilación.
// En Modo Estricto, eval() crea un ámbito sandbox independiente; sus variables no escapan.

function probarAislamientoEval() {
    // Ejecutamos código dinámico dentro de eval en modo estricto
    eval("var variableSecretaEval = 'Dato interno de prueba';");

    try {
        // Intentamos acceder a la variable declarada dentro del eval
        console.log(variableSecretaEval);
    } catch (error) {
        // En Modo Estricto, la variable murió dentro del sandbox de eval
        console.log("🛡️ [SANDBOX PROTEGIDO] eval() no contaminó el entorno exterior:");
        console.log(`   Tipo de Excepción : ${error.name}`);
        console.log(`   Mensaje del Motor : ${error.message}`);
    }
}

// Ejecutamos la prueba de aislamiento
probarAislamientoEval();


// ==============================================================================
// BLOQUE 8: PALABRAS RESERVADAS PARA ES6+ Y SINTAXIS OBSOLETAS
// ==============================================================================
imprimirSeparador(8, "PROTECCIÓN DE PALABRAS RESERVADAS (ES6+) Y OCTALES");

// Explicación didáctica:
// Para garantizar compatibilidad hacia adelante con ES6+, el Modo Estricto prohíbe usar como
// nombres de variables o argumentos: implements, interface, let, package, private, protected, public, static, yield.
// Además, prohíbe números octales antiguos con cero a la izquierda (ej. 015) porque causaban errores graves.

// ❌ Ejemplos de líneas prohibidas que arrojarían SyntaxError al compilar:
// let private = true;       // SyntaxError: Unexpected strict mode reserved word
// let interface = "Ethernet"; // SyntaxError: Unexpected strict mode reserved word
// const octalViejo = 015;    // SyntaxError: Octal literals are not allowed in strict mode.

// ✅ Forma moderna y correcta en ES6+:
const esPrivado = true;
const nombreInterfaz = "Ethernet";

// Si realmente necesitamos un valor octal, usamos el prefijo '0o' introducido en ES6:
const numeroOctalModerno = 0o15; // 0o15 en base 8 equivale a 13 en decimal base 10
const numeroDecimalNormal = 15;  // Quince decimal normal

console.log("✅ [SINTAXIS LIMPIA] Nombres descriptivos permitidos:", { esPrivado, nombreInterfaz });
console.log("✅ [OCTAL VÁLIDO] Número octal 0o15 en decimal:", numeroOctalModerno);
console.log("✅ [DECIMAL VÁLIDO] Número decimal normal:", numeroDecimalNormal);


// ==============================================================================
// BLOQUE 9: PROHIBICIÓN DE PARÁMETROS DUPLICADOS EN FUNCIONES
// ==============================================================================
imprimirSeparador(9, "PROHIBICIÓN DE PARÁMETROS DUPLICADOS");

// Explicación didáctica:
// En Sloppy Mode, escribir 'function sumar(a, b, a)' era legal; el segundo 'a' pisaba al primero.
// En Modo Estricto, el parser lanza un SyntaxError inmediato impidiendo nombres repetidos.

// ❌ Línea que arrojaría SyntaxError en tiempo de parseo:
// function sumarInsegura(a, b, a) { return a + b + a; }

// ✅ Forma profesional: Todos los parámetros poseen identificadores únicos y semánticos
function sumarValoresUnicos(primerOperando, segundoOperando, tercerOperando) {
    // Suma aritmética de los tres parámetros claramente diferenciados
    return primerOperando + segundoOperando + tercerOperando;
}

// Ejecutamos la función con 3 valores
const totalSumado = sumarValoresUnicos(10, 20, 30);
console.log("✅ [PARÁMETROS ÚNICOS] Suma calculada con parámetros bien nombrados:", totalSumado);


// ==============================================================================
// BLOQUE 10: MODO ESTRICTO AUTOMÁTICO EN CLASES Y MÓDULOS ES6
// ==============================================================================
imprimirSeparador(10, "MODO ESTRICTO NATIVO EN CLASES Y MÓDULOS ES6");

// Explicación didáctica:
// En el estándar de JavaScript moderno (ES6 en adelante), todo el código dentro del cuerpo
// de una clase o de un módulo ES (archivos con import/export) es ESTRICTO AUTOMÁTICAMENTE,
// incluso si nunca escribes "use strict".

class GestorSeguridad {
    // Constructor de la clase
    constructor(modulo) {
        // Inicializamos la propiedad de la instancia
        this.modulo = modulo;
    }

    // Método que demuestra el comportamiento estricto automático
    probarComportamiento() {
        try {
            // Intentamos asignar una variable sin declarar dentro de la clase
            fugaDeVariable = "Esto fallará sin necesidad de 'use strict' explícito";
        } catch (error) {
            console.log("🤖 [ESTRICTO AUTOMÁTICO] La clase ejecutó modo estricto nativamente:");
            console.log(`   Tipo de Excepción : ${error.name}`);
            console.log(`   Mensaje del Motor : ${error.message}`);
        }
    }
}

// Instanciamos la clase y probamos el método
const seguridad = new GestorSeguridad("Autenticación Central");
seguridad.probarComportamiento();


// ==============================================================================
// BLOQUE 11: CASO DE ESTUDIO REAL - REFACTORIZACIÓN DE CÓDIGO LEGADO
// ==============================================================================
imprimirSeparador(11, "CASO DE ESTUDIO REAL: REFACTORIZACIÓN PROFESIONAL");

// Explicación didáctica:
// Simulamos un pedido de comercio electrónico que antes estaba escrito en código antiguo
// con parámetros duplicados, palabras reservadas y números octales obsoletos.
// Aquí se presenta su versión limpia, robusta y 100% compliant con Modo Estricto:

function procesarPedidoProfesional(idPedido, precioBase, unidadesCompradas, tipoEnvio) {
    // 1. Declaración con 'const' para asegurar inmutabilidad de la tasa de impuesto
    const porcentajeIva = 0.19;

    // 2. Renombramos la variable evitando la palabra reservada 'package'
    const descripcionPaquete = tipoEnvio || "Envío Estándar Terrestre";

    // 3. Reemplazamos el octal confuso (ej. 015) por el valor decimal explícito (13)
    const descuentoFidelidad = 13;

    // Calculamos el subtotal de los artículos
    const subtotal = precioBase * unidadesCompradas;

    // Calculamos el impuesto correspondiente
    const impuestoCalculado = subtotal * porcentajeIva;

    // Calculamos el monto final aplicando el descuento
    const totalNeto = (subtotal + impuestoCalculado) - descuentoFidelidad;

    // Retornamos un objeto de factura profesional e inmutable
    const facturaResultado = {
        id: idPedido,
        paquete: descripcionPaquete,
        subtotal: subtotal.toFixed(2),
        iva: impuestoCalculado.toFixed(2),
        descuento: descuentoFidelidad.toFixed(2),
        totalPagar: totalNeto.toFixed(2)
    };

    // Congelamos el resultado para impedir alteraciones externas accidentales
    return Object.freeze(facturaResultado);
}

// Ejecutamos la función de pedido refactorizada
const facturaEmitida = procesarPedidoProfesional(4089, 45.50, 2, "Envío Express Certificado");

// Imprimimos el objeto estructurado
console.log("📦 [FACTURA GENERADA LIMPIAMENTE]:\n", facturaEmitida);

// Intentamos alterar la factura emitida para comprobar su inmutabilidad
try {
    facturaEmitida.totalPagar = "0.00";
} catch (error) {
    console.log("🔒 [INTEGRIDAD FINANCIERA] La factura está blindada con Object.freeze():");
    console.log(`   ${error.name}: ${error.message}`);
}

// ==============================================================================
// RESUMEN FINAL DEL LABORATORIO
// ==============================================================================
console.log("\n" + "=".repeat(78));
console.log("🎉 LABORATORIO COMPLETADO CON ÉXITO");
console.log("=".repeat(78));
console.log("Has recorrido todos los aspectos técnicos y de seguridad del Modo Estricto.");
console.log("Recuerda: En desarrollo moderno (React, Node ESM, Vite), ¡ya estás en Modo Estricto!");
console.log("=".repeat(78) + "\n");
