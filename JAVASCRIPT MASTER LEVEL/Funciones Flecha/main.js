/**
 * ==============================================================================
 * ⚡ JAVASCRIPT MASTER LEVEL: MÓDULO INTEGRAL DE FUNCIONES FLECHA & CONCEPTOS AVANZADOS
 * ==============================================================================
 * Archivo: main.js
 * Propósito: Guía práctica ejecutable, comentada y explicada línea por línea al 100%
 * Ejecución: En terminal con 'node main.js' o directamente en la consola del navegador
 * 
 * TEMARIO DEL MÓDULO (DOCUMENTACION/FUNCIONES FLECHA.md - 23 BLOQUES):
 * 1. ¿Por qué aparecieron las Funciones Flecha? (ES6, verbosidad y rescate de 'this')
 * 2. Sintaxis compacta y retornos implícitos (cuerpo de una sola expresión)
 * 3. Reglas de parámetros: cuándo usar y omitir paréntesis
 * 4. Retorno de objetos literales: solución a la ambigüedad con paréntesis ({})
 * 5. Comportamiento de 'this' contextual (Ámbito Léxico vs. 'this' Dinámico)
 * 6. Modos estrictos ("use strict") y su impacto en las funciones flecha
 * 7. Comportamiento con los métodos call(), apply() y bind()
 * 8. Restricciones: por qué no deben usarse como métodos de objetos
 * 9. Restricciones: la ausencia del método interno [[Construct]] y fallo con 'new'
 * 10. Ausencia del objeto 'arguments' y la propiedad '.prototype'
 * 11. Restricciones sintácticas: saltos de línea prohibidos y ausencia de 'yield'
 * 12. Orden de precedencia y parseo en el motor de JavaScript
 * 13. Funciones Recursivas (Recursividad y condición base en funciones flecha)
 * 14. Cláusulas o Cierres (Closures y encapsulación de variables privadas)
 * 15. Parámetros por defecto: validación antigua (pre-ES6) vs. actual (ES6+)
 * 16. Parámetros Rest (...param): captura dinámica en Arrays nativos
 * 17. Desestructuración de Arrays y Objetos (clave, posicional y omisión)
 * 18. Desestructuración en Parámetros de Funciones (funciones desestructuradoras)
 * 19. Analogías del mundo real: el espejo 🪞 y el archivador automatizado 🗂️
 * 20. Diagrama de flujo de resolución del contexto 'this'
 * 21. Buenas prácticas y errores comunes en producción
 * 22. Ejercicios prácticos integradores resueltos (Niveles 1, 2 y 3)
 * 23. Resumen técnico integral
 * ==============================================================================
 */

// Activamos el modo estricto en todo el archivo para forzar buenas prácticas y consistencia
"use strict";

// Función utilitaria para imprimir encabezados visuales y pedagógicos en la consola
function imprimirSeparador(numeroBloque, titulo) {
    // Imprime un salto de línea inicial para aislar visualmente el bloque
    console.log("\n" + "=".repeat(78));
    // Imprime el identificador de bloque con su descripción técnica
    console.log(`📌 BLOQUE ${numeroBloque}: ${titulo}`);
    // Imprime una línea divisoria de cierre
    console.log("=".repeat(78));
}


// ==============================================================================
// BLOQUE 1: ¿POR QUÉ APARECIERON LAS FUNCIONES FLECHA? (ES6 - 2015)
// ==============================================================================
imprimirSeparador(1, "¿POR QUÉ APARECIERON LAS FUNCIONES FLECHA?");

// 1. Reducción de verbosidad excesiva: elimina 'function' y 'return' en operaciones cortas
// 2. Eliminación de problemas con 'this': conserva el ámbito léxico de su entorno padre

// Ejemplo con función tradicional previa a ES6:
const duplicarTradicional = function(numero) {
    // Requiere llaves de bloque y retorno explícito
    return numero * 2;
};

// Ejemplo con función flecha moderna de ES6:
const duplicarFlecha = numero => numero * 2;

console.log("Resultado Función Tradicional :", duplicarTradicional(5)); // Imprime 10
console.log("Resultado Función Flecha      :", duplicarFlecha(5));      // Imprime 10


// ==============================================================================
// BLOQUE 2: SINTAXIS COMPACTA Y RETORNOS IMPLÍCITOS
// ==============================================================================
imprimirSeparador(2, "SINTAXIS COMPACTA Y RETORNO IMPLÍCITO");

// Regla: Si el cuerpo tiene UNA SOLA EXPRESIÓN, se omiten {} y 'return'.
// El motor de JavaScript evalúa la expresión y la retorna automáticamente.

const calcularIva = precio => precio * 0.19;
const formatearSaludo = nombre => `Bienvenido, ${nombre.toUpperCase()}!`;

// Si hay múltiples sentencias, se requieren llaves {} y 'return' explícito:
const calcularPrecioFinal = (precio, descuento) => {
    // Calculamos el subtotal restando el descuento
    const subtotal = precio - descuento;
    // Agregamos el impuesto correspondiente
    const totalConImpuesto = subtotal * 1.19;
    // Al abrir llaves {}, el return es obligatorio
    return totalConImpuesto;
};

console.log("IVA calculado implícitamente  :", calcularIva(100));
console.log("Saludo formateado             :", formatearSaludo("Fredy"));
console.log("Cálculo con bloque explícito  :", calcularPrecioFinal(200, 20));


// ==============================================================================
// BLOQUE 3: REGLAS DE PARÁMETROS (PARÉNTESIS OPCIONALES Y OBLIGATORIOS)
// ==============================================================================
imprimirSeparador(3, "REGLAS DE PARÁMETROS (CUÁNDO USAR PARÉNTESIS)");

// 3.1 CERO PARÁMETROS ➔ Paréntesis () obligatorios
const obtenerTimestamp = () => Date.now();
console.log("0 parámetros ()               :", obtenerTimestamp());

// 3.2 UN SOLO PARÁMETRO ➔ Paréntesis () opcionales
const elevarAlCuadrado = x => x * x;
console.log("1 parámetro sin ()            :", elevarAlCuadrado(8));

// 3.3 DOS O MÁS PARÁMETROS ➔ Paréntesis () obligatorios
const calcularArea = (base, altura) => (base * altura) / 2;
console.log("2+ parámetros (base, altura)  :", calcularArea(10, 5));


// ==============================================================================
// BLOQUE 4: RETORNO DE OBJETOS LITERALES Y AMBIGÜEDAD DE LLAVES ({})
// ==============================================================================
imprimirSeparador(4, "RETORNO DE OBJETOS LITERALES ({})");

// En JS, las llaves {} se usan para bloques de código y para objetos literales.
// Si escribes: const crear = id => { id: id }; -> JS lo interpreta como un bloque vacío con etiqueta
// Solución: Envolver el objeto literal entre paréntesis ({ ... })

const crearUsuario = (id, nombre, rol) => ({
    // Asignamos la propiedad id
    id: id,
    // Asignamos la propiedad nombre
    nombre: nombre,
    // Asignamos la propiedad rol
    rol: rol,
    // Asignamos fecha de alta en el sistema
    fechaRegistro: new Date().toLocaleDateString()
});

console.log("Objeto retornado con ({})     :", crearUsuario(101, "Fredy", "Arquitecto"));


// ==============================================================================
// BLOQUE 5: EL COMPORTAMIENTO DE 'this' CONTEXTUAL (ÁMBITO LÉXICO)
// ==============================================================================
imprimirSeparador(5, "COMPORTAMIENTO DE 'this' (ÁMBITO LÉXICO)");

// Las funciones flecha NO TIENEN su propio 'this'.
// Heredan 'this' del ámbito donde fueron DECLARADAS (lexical scope).

const monitorServidor = {
    nombreHost: "Cluster-Produccion-01",
    latidos: 0,

    iniciarMonitoreo() {
        console.log(`[OK] Monitoreando servidor: ${this.nombreHost}`);

        // La función flecha mantiene el 'this' de 'iniciarMonitoreo' (monitorServidor):
        const registrarPing = () => {
            this.latidos++;
            console.log(`  -> Ping #${this.latidos} recibido para host: ${this.nombreHost}`);
        };

        registrarPing();
        registrarPing();
    }
};

monitorServidor.iniciarMonitoreo();


// ==============================================================================
// BLOQUE 6: MODOS ESTRICTOS ("use strict") Y SU IMPACTO EN 'this'
// ==============================================================================
imprimirSeparador(6, "MODOS ESTRICTOS Y SU IMPACTO EN 'this'");

// En modo estricto, una función tradicional suelta en ámbito global tiene 'this = undefined'.
function tradicionalGlobal() {
    return this;
}

// Una función flecha ignora la regla de 'this = undefined' del modo estricto,
// porque busca el 'this' léxico del entorno padre (objeto global / window).
const flechaGlobal = () => this;

console.log("Tradicional en strict global  :", tradicionalGlobal()); // undefined
console.log("Flecha en entorno global      :", typeof flechaGlobal());   // 'object'


// ==============================================================================
// BLOQUE 7: COMPORTAMIENTO CON call(), apply() Y bind()
// ==============================================================================
imprimirSeparador(7, "COMPORTAMIENTO CON call(), apply() Y bind()");

// En funciones flecha: EL PRIMER ARGUMENTO (contexto 'this') ES IGNORADO.
// Los argumentos normales de datos se transmiten sin problemas.

const contextoInyectado = { apodo: "Usuario_VIP" };

const operacionFlecha = (a, b) => {
    // Verificamos si this fue alterado por call
    const nombreEncontrado = this ? this.apodo : undefined;
    return {
        contextoDetectado: nombreEncontrado,
        total: a + b
    };
};

const resultadoInyeccion = operacionFlecha.call(contextoInyectado, 15, 25);
console.log("Resultado con .call()         :", resultadoInyeccion);
console.log("-> Nótese: contextoDetectado es undefined (call NO pudo cambiar 'this').");


// ==============================================================================
// BLOQUE 8: RESTRICCIONES: POR QUÉ NO SIRVEN COMO MÉTODOS DE OBJETOS
// ==============================================================================
imprimirSeparador(8, "RESTRICCIONES: NO USAR COMO MÉTODOS DE OBJETOS");

// ❌ Antipatrón: Usar función flecha como método de objeto literal
const autoErroneo = {
    marca: "Tesla",
    // Captura el 'this' exterior global, no el objeto autoErroneo
    obtenerMarca: () => `Auto: ${this ? this.marca : "indefinido"}`
};

console.log("Método flecha en objeto       :", autoErroneo.obtenerMarca()); // Auto: undefined

// ✅ Solución: Método abreviado de ES6 (función tradicional interna con this dinámico)
const autoCorrecto = {
    marca: "Tesla",
    obtenerMarca() {
        return `Auto: ${this.marca}`;
    }
};

console.log("Método ES6 abreviado          :", autoCorrecto.obtenerMarca()); // Auto: Tesla


// ==============================================================================
// BLOQUE 9: RESTRICCIONES: AUSENCIA DEL CONSTRUCTOR ('new') Y [[Construct]]
// ==============================================================================
imprimirSeparador(9, "RESTRICCIONES: AUSENCIA DE 'new' Y [[Construct]]");

// Las funciones flecha carecen del método interno [[Construct]].
// Invocarlas con 'new' arroja un TypeError inmediato.

const CreadorUsuario = (nombre) => {
    this.nombre = nombre;
};

try {
    const usuario = new CreadorUsuario("Ana");
} catch (error) {
    console.log("❌ [EXCEPCIÓN CAPTURADA AL INSTANCIAR CON 'new']:");
    console.log(`   Tipo de Error     : ${error.name}`);
    console.log(`   Mensaje del Motor : ${error.message}`);
    console.log("   Explicación       : Las funciones flecha no poseen [[Construct]] ni pueden ser llamadas con new.");
}


// ==============================================================================
// BLOQUE 10: AUSENCIA DE 'arguments' Y DE '.prototype'
// ==============================================================================
imprimirSeparador(10, "AUSENCIA DE 'arguments' Y '.prototype'");

// 1. No tienen objeto arguments (se debe usar Rest ...args)
// 2. Su propiedad .prototype es estrictamente undefined
const funcionPrueba = () => {};
console.log("Propiedad prototype de flecha :", funcionPrueba.prototype); // undefined


// ==============================================================================
// BLOQUE 11: RESTRICCIONES SINTÁCTICAS (SALTOS DE LÍNEA Y YIELD)
// ==============================================================================
imprimirSeparador(11, "RESTRICCIONES SINTÁCTICAS: SALTOS DE LÍNEA Y YIELD");

// 1. Prohibido salto de línea entre parámetros y => (arroja SyntaxError)
// 2. Prohibido 'yield' en su cuerpo (no existen funciones flecha generadoras)
// Salto válido: estrictamente DESPUÉS de la flecha:
const multiplicacionLarga = (a, b) => 
    a * b;
console.log("Salto de línea válido (después):", multiplicacionLarga(6, 7));


// ==============================================================================
// BLOQUE 12: ORDEN DE PRECEDENCIA Y PARSEO EN EL MOTOR JS
// ==============================================================================
imprimirSeparador(12, "ORDEN DE PRECEDENCIA Y PARSEO EN EL MOTOR JS");

// La flecha '=>' tiene precedencia baja. Los parámetros de la izquierda se agrupan
// por completo antes de unirse al cuerpo ejecutable de la derecha.
const fabricaDeRespuestas = (esAdmin) => esAdmin ? () => "Acceso Total" : () => "Acceso Restringido";
console.log("Parseo con ternario (Admin)   :", fabricaDeRespuestas(true)());
console.log("Parseo con ternario (Lector)  :", fabricaDeRespuestas(false)());


// ==============================================================================
// BLOQUE 13: FUNCIONES RECURSIVAS (RECURSIVIDAD EN FUNCIONES FLECHA)
// ==============================================================================
imprimirSeparador(13, "FUNCIONES RECURSIVAS (RECURSIVIDAD)");

// Toda función recursiva requiere:
// 1. Condición base de parada (para evitar Stack Overflow).
// 2. Llamada a sí misma con un subproblema menor.
// Al asignarse a una constante, la función flecha puede referenciar su propio identificador:

const factorial = n => {
    // Condición base: si n es 1 o menor, el factorial es 1
    if (n <= 1) return 1;
    // Llamada recursiva: n multiplicado por el factorial de n - 1
    return n * factorial(n - 1);
};

console.log("Factorial de 5 con flecha     :", factorial(5));  // 120
console.log("Factorial de 6 con flecha     :", factorial(6));  // 720


// ==============================================================================
// BLOQUE 14: CLÁUSULAS O CIERRES (CLOSURES)
// ==============================================================================
imprimirSeparador(14, "CLÁUSULAS O CIERRES (CLOSURES)");

// Un closure permite a una función interna recordar y acceder a las variables
// de su entorno léxico externo, incluso después de que la función externa haya finalizado.

const crearContador = () => {
    // Variable privada encapsulada dentro del closure
    let cuentaPrivada = 0;

    return {
        // Incrementa la variable privada
        incrementar: () => ++cuentaPrivada,
        // Decrementa la variable privada
        decrementar: () => --cuentaPrivada,
        // Devuelve el valor actual sin exponer la variable directa
        obtenerValor: () => cuentaPrivada
    };
};

const contadorA = crearContador();
console.log("Closure - Incremento 1        :", contadorA.incrementar()); // 1
console.log("Closure - Incremento 2        :", contadorA.incrementar()); // 2
console.log("Closure - Valor Protegido     :", contadorA.obtenerValor()); // 2


// ==============================================================================
// BLOQUE 15: PARÁMETROS POR DEFECTO (VALIDACIÓN ANTIGUA VS. ACTUAL)
// ==============================================================================
imprimirSeparador(15, "PARÁMETROS POR DEFECTO: ANTIGUO VS. ES6+");

// 1. Forma antigua (pre-ES6): comprobaciones manuales con || o typeof
function configurarServidorAntiguo(puerto, timeout) {
    puerto = puerto || 8080;
    timeout = (typeof timeout !== "undefined") ? timeout : 5000;
    return `[Antiguo] Puerto: ${puerto}, Timeout: ${timeout}ms`;
}

// 2. Forma moderna (ES6+): asignación directa en la firma de la función flecha
const configurarServidorModerno = (puerto = 8080, timeout = 5000) => 
    `[Moderno] Puerto: ${puerto}, Timeout: ${timeout}ms`;

console.log(configurarServidorAntiguo());
console.log(configurarServidorModerno());
console.log(configurarServidorModerno(3000, 10000));


// ==============================================================================
// BLOQUE 16: PARÁMETROS REST (...param)
// ==============================================================================
imprimirSeparador(16, "PARÁMETROS REST (...param)");

// El parámetro Rest (...param) captura un número indefinido de argumentos
// y los empaqueta en un Array nativo legítimo (con .map, .filter, .reduce, etc.).
// Regla: El parámetro Rest debe ser SIEMPRE el último parámetro de la firma.

const calcularTotalConImpuesto = (tasaImpuesto, ...precios) => {
    // Verificamos que 'precios' sea un Array auténtico
    const subtotal = precios.reduce((acumulado, p) => acumulado + p, 0);
    const impuesto = subtotal * tasaImpuesto;
    return {
        subtotal: subtotal,
        impuesto: impuesto,
        total: subtotal + impuesto
    };
};

console.log("Cálculo con Rest (...precios) :", calcularTotalConImpuesto(0.19, 10, 25, 45, 120));


// ==============================================================================
// BLOQUE 17: DESESTRUCTURACIÓN DE ARRAYS Y OBJETOS
// ==============================================================================
imprimirSeparador(17, "DESESTRUCTURACIÓN DE ARRAYS Y OBJETOS");

// 1. Desestructuración de Objetos (por nombre de clave / llave)
const configuracionUsuario = {
    tema: "dark",
    idioma: "es",
    nivelAcceso: "Admin"
};

// Extracción directa con renombramiento y valores por defecto:
const { tema, idioma, nivelAcceso: rol, zonaHoraria = "UTC-5" } = configuracionUsuario;
console.log(`Desestructuración Objeto      : Tema: ${tema}, Rol: ${rol}, Zona: ${zonaHoraria}`);

// 2. Desestructuración de Arrays (por posición ordinal)
const coordenadasGPS = [4.6097, -74.0817, 2600]; // Latitud, Longitud, Altitud
const [latitud, longitud] = coordenadasGPS;
const [, , altitud] = coordenadasGPS; // Omisión de elementos con coma vacía
console.log(`Desestructuración Array       : Lat: ${latitud}, Lon: ${longitud}, Alt: ${altitud}m`);


// ==============================================================================
// BLOQUE 18: DESESTRUCTURACIÓN EN PARÁMETROS DE FUNCIONES
// ==============================================================================
imprimirSeparador(18, "DESESTRUCTURACIÓN EN PARÁMETROS DE FUNCIONES");

// En lugar de recibir un objeto y descomponerlo en el cuerpo,
// declaramos las propiedades deseadas directamente en la firma del parámetro:

const productoInventario = {
    id: 902,
    nombre: "Teclado Mecánico RGB",
    precio: 85,
    stock: 14
};

const procesarEnvio = ({ nombre, precio, stock }) => 
    `Envío confirmado: ${nombre} ($${precio} USD). Unidades restantes en bodega: ${stock}`;

console.log("Función Desestructuradora     :", procesarEnvio(productoInventario));


// ==============================================================================
// BLOQUE 19: ANALOGÍAS DEL MUNDO REAL
// ==============================================================================
imprimirSeparador(19, "ANALOGÍAS DEL MUNDO REAL");

console.log(`
1. EL ESPEJO REFLECTANTE 🪞 (Para el contexto 'this'):
   - Función Tradicional: Es una CÁMARA CON FLASH PROPIO 📷. Genera su propia luz
     contextual al dispararse, según cómo y dónde sea invocada.
   - Función Flecha: Es un ESPEJO PLANO EMPOTRADO 🪞. No tiene luz propia; refleja
     fielmente la iluminación del cuarto donde fue instalado (ámbito léxico).

2. EL ARCHIVADOR AUTOMATIZADO 🗂️ (Para la Desestructuración):
   - Sin desestructuración: Te entregan una caja llena de expedientes y tú debes
     buscar y extraer uno a uno manualmente.
   - Con desestructuración en parámetros: Un asistente robótico te entrega en mano
     únicamente los 3 documentos exactos que necesitas, desechando la caja vacía.
`);


// ==============================================================================
// BLOQUE 20: DIAGRAMA DE FLUJO DEL CONTEXTO 'this'
// ==============================================================================
imprimirSeparador(20, "DIAGRAMA DE FLUJO DE RESOLUCIÓN DE 'this'");

console.log(`
┌────────────────────────────────────────────────────────┐
│ ¿En qué ámbito léxico fue declarada la Función Flecha? │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ Captura de forma fija e inmutable el 'this' del padre  │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ ¿Se invoca mediante .call(), .apply() o .bind()?       │
│ ➔ El primer argumento de contexto es TOTALMENTE IGNORADO│
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ Ejecuta el cuerpo usando siempre el 'this' original    │
└────────────────────────────────────────────────────────┘
`);


// ==============================================================================
// BLOQUE 21: BUENAS PRÁCTICAS Y ERRORES COMUNES EN PRODUCCIÓN
// ==============================================================================
imprimirSeparador(21, "BUENAS PRÁCTICAS Y ERRORES COMUNES");

// 1. Asignar siempre funciones flecha a constantes (const) para depurar stack traces
// 2. Usar funciones flecha para callbacks de arrays (.map, .filter, .reduce)
// 3. En listeners del DOM, usar función tradicional si requieres 'this = elemento',
//    o usar función flecha con (e) => e.currentTarget.
console.log("✅ Buenas prácticas: Asignar a const, usar en callbacks y usar Rest en vez de arguments.");
console.log("❌ Error común evitado: No usar funciones flecha como métodos directos de objetos literales.");


// ==============================================================================
// BLOQUE 22: EJERCICIOS PRÁCTICOS INTEGRADORES RESUELTOS
// ==============================================================================
imprimirSeparador(22, "RESOLUCIÓN DE LOS 3 EJERCICIOS INTEGRADORES");

// --- EJERCICIO 1: Nivel Junior ---
// calcularAreaCirculo en una línea con retorno implícito y sin paréntesis innecesarios:
console.log("--- EJERCICIO 1 (Junior): calcularAreaCirculo ---");
const calcularAreaCirculo = radio => Math.PI * radio * radio;
console.log("Área para radio 5             :", calcularAreaCirculo(5));

// --- EJERCICIO 2: Nivel Semi-Senior ---
// crearCarrito con closure, lista privada, agregarProducto({ nombre, precio }) y obtenerTotal()
console.log("\n--- EJERCICIO 2 (Semi Senior): crearCarrito con Closure & Desestructuración ---");
const crearCarrito = () => {
    // Array privado protegido por el entorno léxico del closure
    const lista = [];

    return {
        // Método que recibe un objeto y desestructura nombre y precio en su firma
        agregarProducto: ({ nombre, precio }) => {
            lista.push({ nombre, precio });
            console.log(`  + Producto agregado: ${nombre} ($${precio})`);
        },
        // Calcula el total acumulado usando reduce funcional
        obtenerTotal: () => lista.reduce((total, prod) => total + prod.precio, 0),
        // Permite inspeccionar la cantidad de artículos
        obtenerCantidad: () => lista.length
    };
};

const miCarrito = crearCarrito();
miCarrito.agregarProducto({ nombre: "Monitor 4K", precio: 350 });
miCarrito.agregarProducto({ nombre: "Mouse Ergonómico", precio: 60 });
miCarrito.agregarProducto({ nombre: "Cable HDMI", precio: 15 });
console.log("Total acumulado del carrito   : $" + miCarrito.obtenerTotal());

// --- EJERCICIO 3: Nivel Avanzado / Master ---
// Script que fuerza contexto con .call() y simultáneamente intenta instanciar con new,
// capturando errores con try/catch e imprimiendo el diagnóstico técnico.
console.log("\n--- EJERCICIO 3 (Avanzado): Forzar call() e Instanciar con new ---");
const ServicioApi = (url) => {
    this.url = url;
};

// 1. Intento con .call()
const contextoForzado = { url: "https://servidor-falso.com" };
ServicioApi.call(contextoForzado, "https://api.real.com");
console.log("Prueba .call()                : El contexto fue ignorado exitosamente.");

// 2. Intento con 'new'
try {
    const instancia = new ServicioApi("https://api.real.com");
} catch (error) {
    console.log("✅ Excepción técnica capturada con try/catch:");
    console.log(`   Nombre de la Excepción    : ${error.name}`);
    console.log(`   Mensaje del Motor V8      : ${error.message}`);
    console.log(`   ¿Posee .prototype?        : ${ServicioApi.prototype}`);
    console.log("   Diagnóstico Técnico       : Las funciones flecha no implementan [[Construct]],");
    console.log("                               por lo que no pueden ser instanciadas como constructores.");
}


// ==============================================================================
// BLOQUE 23: RESUMEN TÉCNICO INTEGRAL
// ==============================================================================
imprimirSeparador(23, "RESUMEN TÉCNICO INTEGRAL");

console.log(`
RESUMEN EJECUTIVO DE CONCEPTOS DOMINADOS:
1. Sintaxis compacta: 'param => expresion' (retorno implícito sin llaves ni return).
2. Objetos literales: '() => ({ a: 1 })' (los paréntesis resuelven la ambigüedad).
3. 'this' Léxico: Heredan el contexto de su entorno de declaración permanentemente.
4. 'call/apply/bind': Ignoran el primer parámetro de contexto 'this'.
5. Sin Constructor: Carecen de [[Construct]] y arrojan TypeError si se usa 'new'.
6. Sin 'arguments' ni 'prototype': Utilizar Rest (...args) para recibir Arrays reales.
7. Recursividad: Perfectamente válida si se nombra la función flecha con const.
8. Closures: Ideales para factorías de funciones y protección de variables privadas.
9. Parámetros por Defecto: Valores de respaldo limpios en la firma (x = 10).
10. Desestructuración: Extracción directa en parámetros '({ nombre, precio }) => ...'.
`);
console.log("==============================================================================");
console.log("🎯 [FIN DEL MÓDULO]: Todos los 23 bloques ejecutados y explicados con éxito.");
console.log("==============================================================================\n");
