/**
 * ==============================================================================
 * ⚡ JAVASCRIPT MASTER LEVEL: MÓDULO COMPLETO DE FUNCIONES FLECHA (ARROW FUNCTIONS)
 * ==============================================================================
 * Archivo: main.js
 * Propósito: Guía práctica ejecutable, comentada y explicada línea por línea al 100%
 * Ejecución: En terminal con 'node main.js' o directamente en la consola del navegador
 * 
 * TEMARIO DEL MÓDULO (DOCUMENTACION/FUNCIONES FLECHA.md):
 * 1. ¿Por qué aparecieron las Funciones Flecha? (ES6, verbosidad y rescate de 'this')
 * 2. Sintaxis compacta y retornos implícitos (cuerpo de una sola expresión)
 * 3. Reglas de parámetros: cuándo usar y omitir paréntesis
 * 4. Retorno de objetos literales: solución a la ambigüedad con paréntesis ({})
 * 5. Comportamiento de 'this' contextual (Ámbito Léxico vs. 'this' Dinámico)
 * 6. Modos estrictos ("use strict") y su impacto en las funciones flecha
 * 7. Comportamiento con los métodos call(), apply() y bind()
 * 8. Restricciones: por qué no deben usarse como métodos de objetos
 * 9. Restricciones: la ausencia del método interno [[Construct]] y fallo con 'new'
 * 10. Ausencia del objeto 'arguments' y la propiedad '.prototype' (uso de ...rest)
 * 11. Restricciones sintácticas: saltos de línea prohibidos y ausencia de 'yield'
 * 12. Orden de precedencia y parseo en el motor de JavaScript
 * 13. Analogía del mundo real: el espejo reflectante 🪞 vs. la cámara con flash 📷
 * 14. Diagrama de flujo de resolución del contexto 'this'
 * 15. Buenas prácticas recomendadas en producción
 * 16. Errores comunes y trampas típicas (DOM listeners y contexto)
 * 17. Solución detallada a los 3 Retos de Evaluación (Junior, Semi-Senior, Master)
 * 18. Resumen maestro y chuleta técnica para entrevistas
 * ==============================================================================
 */

// Activamos el modo estricto en el archivo para garantizar buenas prácticas de ES5/ES6
"use strict";

// Función auxiliar para imprimir encabezados limpios y delimitadores en la consola
function imprimirSeparador(numeroBloque, titulo) {
    // Imprime un salto de línea inicial para separar del bloque previo
    console.log("\n" + "=".repeat(78));
    // Imprime el número del bloque y el título descriptivo en mayúsculas
    console.log(`📌 BLOQUE ${numeroBloque}: ${titulo}`);
    // Imprime la línea divisoria inferior de cierre
    console.log("=".repeat(78));
}


// ==============================================================================
// BLOQUE 1: ¿POR QUÉ APARECIERON LAS FUNCIONES FLECHA? (ES6 - 2015)
// ==============================================================================
imprimirSeparador(1, "¿POR QUÉ APARECIERON LAS FUNCIONES FLECHA?");

// 1. Reducción de verbosidad: adiós a escribir 'function' y 'return' en callbacks cortos
// 2. Eliminación de trucos antiguos para 'this' como 'var self = this;' o '.bind(this)'

// Demostración comparativa de sintaxis:
// Forma tradicional previa a ES6:
const duplicarTradicional = function(numero) {
    // Requiere la palabra clave 'return' explícita
    return numero * 2;
};

// Forma moderna con función flecha (Arrow Function):
const duplicarFlecha = numero => numero * 2;

// Ejecutamos ambas implementaciones para comparar sus resultados
console.log("Resultado Función Tradicional :", duplicarTradicional(5)); // Imprime 10
console.log("Resultado Función Flecha      :", duplicarFlecha(5));      // Imprime 10


// ==============================================================================
// BLOQUE 2: SINTAXIS COMPACTA Y RETORNOS IMPLÍCITOS
// ==============================================================================
imprimirSeparador(2, "SINTAXIS COMPACTA Y RETORNO IMPLÍCITO");

// Regla de Oro: Si el cuerpo de la función tiene UNA SOLA EXPRESIÓN,
// se pueden omitir las llaves {} y la palabra clave 'return'.
// JavaScript evalúa la expresión y retorna automáticamente el resultado.

// Ejemplo A: Retorno implícito de una operación aritmética
const calcularIva = precio => precio * 0.19;

// Ejemplo B: Retorno implícito de una plantilla de texto (template literal)
const formatearMensaje = texto => `[SISTEMA]: ${texto.toUpperCase()}`;

// Ejemplo C: Con bloque explícito (cuando hay más de una sentencia se requieren llaves y return)
const calcularPrecioTotal = (precio, descuento) => {
    // Sentencia 1: calculamos el valor rebajado
    const precioConDescuento = precio - descuento;
    // Sentencia 2: sumamos el impuesto
    const totalFinal = precioConDescuento * 1.19;
    // Al abrir llaves {}, el 'return' explícito es OBLIGATORIO
    return totalFinal;
};

console.log("IVA de $1000 con retorno implícito :", calcularIva(1000));
console.log("Mensaje formateado                 :", formatearMensaje("pedido completado"));
console.log("Precio total con bloque explícito  :", calcularPrecioTotal(100, 10));


// ==============================================================================
// BLOQUE 3: REGLAS DE PARÁMETROS (CUÁNDO USAR Y OMITIR PARÉNTESIS)
// ==============================================================================
imprimirSeparador(3, "REGLAS DE PARÁMETROS (PARÉNTESIS)");

// Regla 3.1: CERO PARÁMETROS ➔ Los paréntesis () son OBLIGATORIOS
const obtenerFechaActual = () => new Date().toISOString().split("T")[0];
console.log("Cero parámetros ()          :", obtenerFechaActual());

// Regla 3.2: EXACTAMENTE UN PARÁMETRO ➔ Los paréntesis () son OPCIONALES
const cuadrado = x => x * x;
console.log("Un parámetro sin paréntesis :", cuadrado(9));

// Regla 3.3: DOS O MÁS PARÁMETROS ➔ Los paréntesis () son OBLIGATORIOS
const multiplicar = (a, b) => a * b;
console.log("Dos parámetros (a, b)       :", multiplicar(7, 8));

// Regla 3.4: Parámetros con valores por defecto o destructuración ➔ Requieren ()
const saludarUsuario = ({ nombre, rol } = { nombre: "Invitado", rol: "Lector" }) => 
    `Hola ${nombre}, tu rol asignado es [${rol}].`;
console.log("Con destructuración en ()   :", saludarUsuario({ nombre: "Fredy", rol: "Admin" }));


// ==============================================================================
// BLOQUE 4: RETORNO DE OBJETOS LITERALES Y LA AMBIGÜEDAD DE LAS LLAVES
// ==============================================================================
imprimirSeparador(4, "RETORNO DE OBJETOS LITERALES Y AMBIGÜEDAD DE LLAVES");

// Problema técnico: En JavaScript, las llaves {} se usan tanto para bloques de código
// como para declarar objetos literales.
// Si escribes: const crear = (id) => { id: id };
// JavaScript interpreta { id: id } como un bloque de código con una etiqueta 'id:', y retorna undefined.

// Solución: Envolver el objeto entre paréntesis ({ ... })
const crearUsuario = (id, nombre, email) => ({
    // Definimos la propiedad 'id'
    id: id,
    // Definimos la propiedad 'nombre'
    nombre: nombre,
    // Definimos la propiedad 'email'
    email: email,
    // Marcamos la fecha de creación del objeto
    creadoEn: new Date().toLocaleDateString()
});

const nuevoUsuario = crearUsuario(101, "Fredy Martínez", "fredy@dev.com");
console.log("Objeto retornado implícitamente con ({}) :", nuevoUsuario);


// ==============================================================================
// BLOQUE 5: EL COMPORTAMIENTO DE 'this' CONTEXTUAL (ÁMBITO LÉXICO)
// ==============================================================================
imprimirSeparador(5, "EL COMPORTAMIENTO DE 'this' (ÁMBITO LÉXICO)");

// Concepto clave: Las funciones flecha NO TIENEN su propio 'this'.
// Heredan 'this' del ámbito donde fueron DECLARADAS (ámbito léxico / lexical scope).
// En cambio, las funciones tradicionales crean su propio 'this' según CÓMO SE INVOCAN.

const gestorTemporizador = {
    nombreServicio: "Servicio de Monitoreo",
    latidos: 0,

    iniciarConFlecha: function() {
        // En esta función tradicional, 'this' apunta al objeto 'gestorTemporizador'
        console.log(`[OK] Iniciando ${this.nombreServicio}...`);

        // Dentro de una función flecha, 'this' sigue siendo 'gestorTemporizador':
        const emitirLatido = () => {
            this.latidos++;
            console.log(`  -> Latido #${this.latidos} emitido para: ${this.nombreServicio}`);
        };

        // Ejecutamos manualmente el callback
        emitirLatido();
        emitirLatido();
    }
};

gestorTemporizador.iniciarConFlecha();


// ==============================================================================
// BLOQUE 6: MODOS ESTRICTOS ("use strict") Y SU IMPACTO EN 'this'
// ==============================================================================
imprimirSeparador(6, "MODOS ESTRICTOS Y SU IMPACTO EN 'this'");

// En modo estricto, una función tradicional suelta tiene 'this = undefined'.
function funcionTradicionalSuelta() {
    return this;
}

// En cambio, una función flecha ignora las restricciones de modo estricto sobre 'this',
// porque busca el 'this' de su entorno padre (en el ámbito global, el objeto global).
const funcionFlechaSuelta = () => this;

console.log("Tradicional en strict mode :", funcionTradicionalSuelta()); // undefined
console.log("Flecha en el entorno global :", typeof funcionFlechaSuelta()); // 'object' (global/module.exports/window)


// ==============================================================================
// BLOQUE 7: COMPORTAMIENTO CON call(), apply() Y bind()
// ==============================================================================
imprimirSeparador(7, "COMPORTAMIENTO CON call(), apply() Y bind()");

// En funciones tradicionales, call/apply/bind permiten inyectar un 'this' arbitrario.
// En funciones flecha: EL PRIMER ARGUMENTO (contexto) ES TOTALMENTE IGNORADO.
// Los argumentos subsiguientes se transmiten normalmente.

const contextoInyectado = {
    etiqueta: "Contexto Forzado"
};

const flechaSuma = (a, b) => {
    // Intentamos imprimir this.etiqueta
    const valorThis = this ? this.etiqueta : undefined;
    return {
        contextoDetectado: valorThis,
        suma: a + b
    };
};

// Invocamos usando .call() pasando 'contextoInyectado' como primer parámetro
const resultadoCall = flechaSuma.call(contextoInyectado, 15, 25);
console.log("Resultado de call() en Arrow Function:", resultadoCall);
console.log("-> Nótese cómo 'contextoDetectado' es undefined: ignoró el contexto inyectado.");


// ==============================================================================
// BLOQUE 8: RESTRICCIÓN: POR QUÉ NO SIRVEN COMO MÉTODOS DE OBJETOS
// ==============================================================================
imprimirSeparador(8, "RESTRICCIÓN: NO USAR COMO MÉTODOS DE OBJETOS");

// Antipatrón muy común: Usar una función flecha como método de un objeto literal
const vehiculoErroneo = {
    modelo: "Tesla Model 3",
    // ❌ ERROR: La función flecha captura el 'this' léxico exterior (global), no el objeto vehiculoErroneo
    describir: () => `Vehículo: ${this ? this.modelo : "indefinido"}`
};

console.log("Llamada con método flecha :", vehiculoErroneo.describir()); // "Vehículo: undefined"

// ✅ Solución: Usar la sintaxis de método abreviado de ES6 (función tradicional interna)
const vehiculoCorrecto = {
    modelo: "Tesla Model 3",
    describir() {
        // 'this' apunta correctamente a 'vehiculoCorrecto'
        return `Vehículo: ${this.modelo}`;
    }
};

console.log("Llamada con método ES6    :", vehiculoCorrecto.describir()); // "Vehículo: Tesla Model 3"


// ==============================================================================
// BLOQUE 9: RESTRICCIÓN: LA AUSENCIA DEL CONSTRUCTOR (new) Y [[Construct]]
// ==============================================================================
imprimirSeparador(9, "RESTRICCIÓN: AUSENCIA DEL CONSTRUCTOR ('new')");

// Las funciones flecha NO poseen el método interno [[Construct]].
// Si intentas usar 'new' con una función flecha, JavaScript lanza un TypeError inmediato.

const CreadorUsuarioFlecha = (nombre) => {
    this.nombre = nombre;
};

try {
    // Intentamos instanciar la función flecha
    const usuarioNuevo = new CreadorUsuarioFlecha("Carlos");
} catch (error) {
    console.log("❌ [ERROR DETECTADO AL USAR 'new' CON ARROW FUNCTION]:");
    console.log(`   Tipo de Excepción : ${error.name}`);
    console.log(`   Mensaje del Motor : ${error.message}`);
    console.log("   💡 Diagnóstico    : Las funciones flecha carecen de [[Construct]] y no son instanciables.");
}


// ==============================================================================
// BLOQUE 10: AUSENCIA DE 'arguments' Y DE '.prototype' (USO DE REST ...args)
// ==============================================================================
imprimirSeparador(10, "AUSENCIA DE 'arguments' Y '.prototype'");

// 1. Ausencia del objeto 'arguments':
// Las funciones flecha no generan el objeto 'arguments'.
// En su lugar, se debe utilizar el parámetro Rest (...args) de ES6.

const procesarValoresRest = (...valores) => {
    // 'valores' es un Array nativo real, no un objeto similar a un array
    console.log("Parámetros recibidos con Rest (...valores):", valores);
    return valores.reduce((acumulado, num) => acumulado + num, 0);
};

console.log("Suma total dinámica con Rest              :", procesarValoresRest(10, 20, 30, 40));

// 2. Ausencia de '.prototype':
// Como no pueden ser constructoras de prototipos, su propiedad prototype es undefined
const funcionEjemplo = () => {};
console.log("¿Las funciones flecha tienen prototype?   :", funcionEjemplo.prototype); // undefined


// ==============================================================================
// BLOQUE 11: RESTRICCIONES SINTÁCTICAS (SALTOS DE LÍNEA Y YIELD)
// ==============================================================================
imprimirSeparador(11, "RESTRICCIONES SINTÁCTICAS: SALTOS DE LÍNEA Y YIELD");

// 1. Prohibido salto de línea entre parámetros y la flecha '=>':
// const malo = (a, b)
// => a + b; // ❌ Provoca SyntaxError: Unexpected token '=>'

// Si el cuerpo es extenso, el salto de línea va DESPUÉS de la flecha:
const calcularOperacionLarga = (base, exponente) => 
    Math.pow(base, exponente);

console.log("Salto de línea válido (después de '=>')   :", calcularOperacionLarga(2, 8));

// 2. Prohibido 'yield':
// Una función flecha no puede usar 'yield' dentro de su cuerpo.
// Es imposible crear funciones generadoras flecha (*=> no existe).


// ==============================================================================
// BLOQUE 12: ORDEN DE PRECEDENCIA Y PARSEO EN EL MOTOR JS
// ==============================================================================
imprimirSeparador(12, "ORDEN DE PRECEDENCIA Y PARSEO EN EL MOTOR JS");

// La flecha '=>' tiene una precedencia muy baja en la gramática de JavaScript.
// Esto garantiza que la expresión de parámetros de la izquierda sea agrupada primero
// antes de vincularse al cuerpo de la derecha.

// Si usamos operadores ternarios o lógicos combinados con funciones flecha,
// conviene agrupar con paréntesis explícitos para evitar confusiones de lectura:
const autenticar = (esAdmin) => esAdmin ? () => "Acceso Total" : () => "Acceso Limitado";

const permisoAdmin = autenticar(true)();
const permisoLector = autenticar(false)();
console.log("Permiso Administrador                     :", permisoAdmin);
console.log("Permiso Lector                            :", permisoLector);


// ==============================================================================
// BLOQUE 13: ANALOGÍA DEL MUNDO REAL: EL ESPEJO REFLECTANTE 🪞
// ==============================================================================
imprimirSeparador(13, "ANALOGÍA DEL MUNDO REAL: EL ESPEJO REFLECTANTE");

console.log(`
🪞 METÁFORA DEL CONTEXTO 'this':
1. Función Tradicional: Es una CÁMARA CON FLASH PROPIO 📷.
   Al dispararse, genera su propia luz y altera la iluminación de la sala
   dependiendo de cómo sea invocada.
2. Función Flecha: Es un ESPEJO PLANO EMPOTRADO 🪞.
   No tiene luz propia. Refleja fielmente la luz del entorno donde fue instalado
   (ámbito léxico). Si la habitación cambia de color, el espejo solo muestra
   lo que ya estaba allí.
`);


// ==============================================================================
// BLOQUE 14: DIAGRAMA DE FLUJO DEL CONTEXTO 'this'
// ==============================================================================
imprimirSeparador(14, "DIAGRAMA DE FLUJO DE RESOLUCIÓN DE 'this'");

console.log(`
┌────────────────────────────────────────────────────────┐
│ ¿En qué ámbito fue declarada la Función Flecha?        │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ Captura el 'this' del padre en el momento de creación  │
│ (Lexical Scope permanente e inmutable)                 │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ ¿Se invoca con .call(), .apply() o .bind()?            │
│ ➔ El argumento de contexto 'this' es IGNORADO          │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ Ejecuta el cuerpo usando siempre el 'this' capturado   │
└────────────────────────────────────────────────────────┘
`);


// ==============================================================================
// BLOQUE 15: BUENAS PRÁCTICAS EN PRODUCCIÓN
// ==============================================================================
imprimirSeparador(15, "BUENAS PRÁCTICAS EN PRODUCCIÓN");

// 1. Ideales para métodos de arrays: .map, .filter, .reduce, .find
const numeros = [10, 25, 40, 55, 70];
const mayoresQueTreinta = numeros.filter(n => n > 30);
console.log("Filtrado funcional con Arrow Function    :", mayoresQueTreinta);

// 2. Asignar siempre a constantes (const) para rastrear nombres en stack traces
const formatearMoneda = (monto) => `$${monto.toFixed(2)}`;
console.log("Función flecha nombrada asignada a const  :", formatearMoneda(45.5));

// 3. Usar retorno implícito solo si cabe en una línea clara y legible


// ==============================================================================
// BLOQUE 16: ERRORES COMUNES (EVENT LISTENERS DEL DOM)
// ==============================================================================
imprimirSeparador(16, "ERRORES COMUNES: EVENT LISTENERS DEL DOM");

// En el navegador:
// boton.addEventListener('click', () => {
//    this.classList.toggle('activo'); // ❌ ERROR: 'this' es window, no el botón
// });
// 
// Solución correcta:
// boton.addEventListener('click', (evento) => {
//    evento.currentTarget.classList.toggle('activo'); // ✅ Seguro y explícito
// });
console.log("ℹ️ En listeners del DOM: usar el parámetro del evento (e.currentTarget) o función tradicional.");


// ==============================================================================
// BLOQUE 17: RESOLUCIÓN DE LOS 3 RETOS DE EVALUACIÓN
// ==============================================================================
imprimirSeparador(17, "RESOLUCIÓN DE LOS 3 RETOS DE EVALUACIÓN");

// --- RETO 1 (Nivel Junior): Función de área de círculo en una línea ---
console.log("--- RETO 1: calcularAreaCirculo (Retorno implícito sin paréntesis innecesarios) ---");
const calcularAreaCirculo = radio => Math.PI * radio * radio;
console.log("Área de círculo con radio 5               :", calcularAreaCirculo(5));

// --- RETO 2 (Nivel Semi-Senior): Objeto tienda con this léxico en map ---
console.log("\n--- RETO 2: Objeto tienda con this léxico en .map() ---");
const tienda = {
    precioBase: 100,
    descuentos: [0.10, 0.20, 0.30],
    
    // Método tradicional para que 'this' apunte al objeto tienda
    aplicarDescuentos() {
        // La función flecha dentro de .map hereda 'this' de aplicarDescuentos (la tienda)
        return this.descuentos.map(descuento => {
            const ahorro = this.precioBase * descuento;
            const precioFinal = this.precioBase - ahorro;
            return {
                descuento: `${descuento * 100}%`,
                precioFinal: precioFinal
            };
        });
    }
};
console.log("Descuentos calculados con this léxico     :", tienda.aplicarDescuentos());

// --- RETO 3 (Nivel Master): Instanciación con new y captura técnica ---
console.log("\n--- RETO 3: Intento de instanciación con new e inspección técnica ---");
const ServicioAPI = (url) => {
    this.url = url;
};

try {
    // Provocamos la excepción intencional
    const api = new ServicioAPI("https://api.servidor.com");
} catch (err) {
    console.log("✅ Excepción capturada exitosamente con try/catch:");
    console.log(`   Nombre del Error  : ${err.name}`);
    console.log(`   Mensaje Oficial   : ${err.message}`);
    console.log("   Explicación Técnica: Las funciones flecha no implementan la interfaz [[Construct]]");
    console.log("                        de la especificación ECMAScript; por ello su .prototype es undefined");
    console.log(`   ¿Tiene .prototype?: ${ServicioAPI.prototype}`);
}


// ==============================================================================
// BLOQUE 18: RESUMEN MAESTRO Y CONCLUSIONES
// ==============================================================================
imprimirSeparador(18, "RESUMEN MAESTRO DEL MÓDULO");

console.log(`
RESUMEN EJECUTIVO DE FUNCIONES FLECHA:
1. Sintaxis compacta: 'param => expresion' (retorno implícito sin llaves ni return).
2. Objetos literales: Siempre envolver con paréntesis: '() => ({ a: 1 })'.
3. 'this' Léxico: No tienen 'this' propio; heredan el del entorno circundante.
4. 'call', 'apply', 'bind': Ignoran el primer argumento de contexto 'this'.
5. Métodos de objeto: No usarlas como métodos si necesitas acceder a propiedades del objeto.
6. 'new': No son constructores, no tienen [[Construct]], lanzan TypeError con 'new'.
7. 'arguments' y 'prototype': No existen en funciones flecha; usar rest (...args).
8. DOM Listeners: Preferir función tradicional o 'evento.currentTarget'.
`);
console.log("==============================================================================");
console.log("🎯 [FIN DEL LABORATORIO]: Módulo de Funciones Flecha completado con éxito.");
console.log("==============================================================================\n");
