/**
 * ==============================================================================
 * JAVASCRIPT MASTER LEVEL: PROTOTIPOS & HERENCIA PROTOTÍPICA
 * Archivo: main.js
 * Ejemplos Prácticos, Experimentación y Mutación de la Cadena de Prototipos
 * Documentación pedagógica línea por línea de cada concepto evaluado
 * ==============================================================================
 */

// ==============================================================================
// BLOQUE 1: CREACIÓN DE OBJETO LITERAL E INSPECCIÓN DEL PROTOTIPO RAÍZ
// ==============================================================================

// Declaramos una variable llamada 'miObjeto' usando 'let' para almacenar un objeto literal
let miObjeto = {
    // Definimos una clave de propiedad llamada "propiedad" cuyo valor asociado es la cadena "datos"
    // Esta es una "propiedad propia" (own property), porque reside directamente en este objeto y no en su prototipo
    "propiedad": "datos"
};

// Imprimimos en la consola del navegador el prototipo directo de 'miObjeto'
// Object.getPrototypeOf(miObjeto) es el método estándar y moderno de ECMAScript para leer el enlace [[Prototype]]
// Todo objeto creado con la sintaxis literal {} hereda automáticamente de Object.prototype
console.log("Prototipo inicial del objeto:", Object.getPrototypeOf(miObjeto));


// ==============================================================================
// BLOQUE 2: ARRAYS Y SU PROPIA CADENA DE PROTOTIPOS NATIVA
// ==============================================================================

// Declaramos un arreglo (Array) llamado 'variable' con tres elementos de distintos tipos: un string, un number y null
let variable = ["pedro", 234, null];

// Los arreglos en JavaScript también son objetos especiales.
// Su cadena de prototipos por defecto es:
// variable ──> Array.prototype (donde viven .push(), .map(), .filter(), etc.) ──> Object.prototype ──> null
console.log("Prototipo del array 'variable':", Object.getPrototypeOf(variable));
// Comprobamos que el prototipo de 'variable' es exactamente Array.prototype:
console.log("¿variable hereda de Array.prototype?:", Object.getPrototypeOf(variable) === Array.prototype);


// ==============================================================================
// BLOQUE 3: CLASES ES6 Y AZÚCAR SINTÁCTICO SOBRE PROTOTIPOS
// ==============================================================================

// Declaramos una clase llamada 'Objeto'
// En JavaScript, la palabra clave 'class' NO crea clases basadas en copias (como en Java o C#).
// Es azúcar sintáctico (Syntactic Sugar) que por debajo crea una función constructora y manipula su .prototype
class Objeto {
    // El constructor es la función que se ejecuta al instanciar con el operador 'new'
    constructor(){
        // En este ejemplo el constructor está vacío, no inicializa propiedades propias en la instancia
    }

    // Definimos el método 'hablar' dentro del cuerpo de la clase
    // IMPORTANTE: Este método NO se copia en cada instancia.
    // JavaScript lo almacena físicamente una sola vez en: Objeto.prototype.hablar
    hablar(){
        // Al invocarse, imprime por consola el mensaje "hola"
        console.log("hola");
    }
}


// ==============================================================================
// BLOQUE 4: INSTANCIACIÓN DE LA CLASE
// ==============================================================================

// Instanciamos la clase 'Objeto' usando el operador 'new' y guardamos el resultado en la variable 'objeto'
// El operador 'new' realiza 4 pasos fundamentales internamente:
//   1. Crea un nuevo objeto vacío en memoria: {}
//   2. Vincula el [[Prototype]] del nuevo objeto a Objeto.prototype
//   3. Ejecuta el constructor enlazando 'this' al nuevo objeto creado
//   4. Retorna el nuevo objeto
let objeto = new Objeto();

// Verificamos que el prototipo de esta instancia apunta directamente al prototipo de la clase:
console.log("¿objeto hereda de Objeto.prototype?:", Object.getPrototypeOf(objeto) === Objeto.prototype); // true


// ==============================================================================
// BLOQUE 5: CREACIÓN DE UN ARRAY VACÍO
// ==============================================================================

// Declaramos un nuevo arreglo vacío llamado 'arr'
// Inicialmente, 'arr' es una instancia de Array y tiene acceso a métodos como .push(), .pop(), .slice(), etc.
let arr = [];


// ==============================================================================
// BLOQUE 6: MUTACIÓN MANUAL DE LA CADENA DE PROTOTIPOS (__proto__)
// ==============================================================================

// Asignamos 'objeto' directamente como el prototipo de 'arr' modificando su propiedad __proto__
// ¿QUÉ SUCEDE AQUÍ INTERNAMENTE?:
// Rompemos la cadena de prototipos por defecto de 'arr' (que apuntaba a Array.prototype)
// y ahora redirigimos su enlace [[Prototype]] para que apunte directamente a 'objeto'.
// 
// La nueva cadena de prototipos para 'arr' queda estructurada así:
// [ arr ] (Instancia Array)
//    │
//    ▼ [[Prototype]]
// [ objeto ] (Instancia de la clase Objeto)
//    │
//    ▼ [[Prototype]]
// [ Objeto.prototype ] (Contiene el método hablar())
//    │
//    ▼ [[Prototype]]
// [ Object.prototype ] (Contiene toString(), hasOwnProperty(), etc.)
//    │
//    ▼ [[Prototype]]
// [ null ] (Fin de la cadena)
arr.__proto__ = objeto;


// ==============================================================================
// BLOQUE 7: DELEGACIÓN Y RESOLUCIÓN EN LA CADENA DE PROTOTIPOS
// ==============================================================================

// Invocamos el método hablar() desde el array 'arr'
// ¿CÓMO RESUELVE JAVASCRIPT ESTA LLAMADA PASO A PASO?:
// 1. Busca si 'hablar' existe directamente dentro de 'arr' ──> NO existe.
// 2. Sube a través de su prototipo (arr.__proto__ = objeto) y busca 'hablar' en 'objeto' ──> NO existe como propiedad propia de 'objeto'.
// 3. Sube al prototipo de 'objeto' (objeto.__proto__ = Objeto.prototype) y busca 'hablar' ──> ¡SÍ EXISTE!
// 4. Ejecuta Objeto.prototype.hablar() e imprime: "hola"
arr.hablar();


// ==============================================================================
// BLOQUE 8: NOTA TÉCNICA PEDAGÓGICA Y BUENAS PRÁCTICAS
// ==============================================================================
// NOTA SOBRE arr.__proto__:
// Aunque usar '__proto__' funciona para experimentar y entender la delegación, en código
// profesional de producción se desaconseja modificar __proto__ directamente en caliente porque:
// 1. Desoptimiza el motor de JavaScript (V8 en Chrome/Node), ralentizando el acceso a propiedades.
// 2. Al cambiar el prototipo de 'arr', este array pierde acceso directo a los métodos de Array.prototype (.map, .filter).
//
// FORMA MODERNA ESTÁNDAR RECOMENDADA:
// Si necesitas crear un objeto con un prototipo específico desde su nacimiento, usa Object.create():
// const miDelegado = Object.create(objeto);
// miDelegado.hablar(); // "hola"
