/**
 * ==============================================================================
 * 🕰️ JAVASCRIPT MASTER LEVEL: MÓDULO COMPLETO DEL OBJETO DATE EN JAVASCRIPT
 * ==============================================================================
 * Archivo: main.js
 * Propósito: Guía práctica ejecutable, comentada y explicada línea por línea al 100%
 * Ejecución: En terminal con 'node main.js' o directamente en la consola del navegador
 * 
 * TEMARIO DEL MÓDULO (DOCUMENTACION/OBJETO DATE.md):
 * 1. Definición del Objeto Date y concepto de Unix Epoch (1 de enero de 1970 UTC)
 * 2. Instanciación obligatoria con 'new Date()' vs. invocación directa 'Date()'
 * 3. Anatomía de los 7 métodos de extracción (Getters de Calendario y Tiempo)
 * 4. Extracción de Calendario: getDate() (1-31) vs. getDay() (0-6) vs. getMonth() (0-11)
 * 5. Extracción del Año: getFullYear() (4 dígitos) vs. el obsoleto getYear() (Efecto Y2K)
 * 6. Extracción de Reloj: getHours() (0-23), getMinutes() (0-59) y getSeconds() (0-59)
 * 7. Extracción y formateo práctico combinado (Fecha y Hora legibles)
 * 8. Comparativa técnica: Código con trampas (getDays / getYear) vs. Estándar moderno
 * 9. Analogía del mundo real: El Reloj Astronómico de pared 🕰️
 * 10. Diagrama de flujo de extracción temporal
 * 11. Buenas prácticas: Formateo de relojes digitales con String.prototype.padStart(2, "0")
 * 12. Buenas prácticas: Arreglos indexados en cero para nombres de días y meses
 * 13. Errores comunes: Confundir getDate() con getDay() o invocar getDays() (TypeError)
 * 14. Errores comunes: Olvidar sumar +1 a getMonth() en formatos numéricos
 * 15. Resolución completa y paso a paso de los 3 Ejercicios del curso (Niveles 1, 2 y 3)
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
// BLOQUE 1: DEFINICIÓN DEL OBJETO DATE Y EL CONCEPTO DE UNIX EPOCH
// ==============================================================================
imprimirSeparador(1, "DEFINICIÓN DEL OBJETO DATE Y UNIX EPOCH");

// El objeto 'Date' es una herramienta nativa en JavaScript para trabajar con fechas y horas.
// Internamente, almacena un único número entero que representa los milisegundos transcurridos
// desde el 1 de enero de 1970 a las 00:00:00 UTC (conocido como 'Unix Epoch').

const instanteActual = new Date();
console.log("Instancia actual (new Date())    :", instanteActual.toString());
console.log("Milisegundos desde Unix Epoch    :", instanteActual.getTime(), "ms");
console.log("Fecha origen Unix Epoch (0 ms)   :", new Date(0).toUTCString());


// ==============================================================================
// BLOQUE 2: INSTANCIACIÓN CON 'new Date()' VS. LLAMADA SIN 'new'
// ==============================================================================
imprimirSeparador(2, "INSTANCIACIÓN OBLIGATORIA CON 'new Date()'");

// A diferencia de los tipos primitivos, para utilizar 'Date' y acceder a sus métodos
// de lectura (getters) es OBLIGATORIO instanciarlo con la palabra reservada 'new'.
// Si olvidas 'new' y escribes 'Date()', JavaScript devuelve simplemente un string
// estático que carece de métodos como .getDate() o .getFullYear().

const objetoFechaReal = new Date();
const cadenaFechaSimple = Date(); // Sin 'new'

console.log("Tipo con 'new Date()'            :", typeof objetoFechaReal, "| ¿Es instancia Date?:", objetoFechaReal instanceof Date);
console.log("Tipo con 'Date()' (sin new)      :", typeof cadenaFechaSimple, "| ¿Posee .getFullYear?:", typeof cadenaFechaSimple.getFullYear);


// ==============================================================================
// BLOQUE 3: ANATOMÍA DE LOS 7 MÉTODOS DE EXTRACCIÓN (GETTERS)
// ==============================================================================
imprimirSeparador(3, "ANATOMÍA DE LOS 7 MÉTODOS GETTERS DE DATE");

// Creamos una fecha fija de demostración para inspeccionar cada método con precisión:
// Jueves, 29 de Octubre de 2026 a las 14:30:45
const fechaDemo = new Date("2026-10-29T14:30:45");

console.log("Fecha de prueba instanciada      :", "2026-10-29T14:30:45");
console.log("1. getDate()     [Día del mes]   :", fechaDemo.getDate(),     "-> Rango: 1 al 31");
console.log("2. getDay()      [Día semana]    :", fechaDemo.getDay(),      "-> Rango: 0 (Domingo) al 6 (Sábado)");
console.log("3. getMonth()    [Mes index 0]   :", fechaDemo.getMonth(),    "-> Rango: 0 (Enero) al 11 (Diciembre)");
console.log("4. getFullYear() [Año 4 dígitos] :", fechaDemo.getFullYear(), "-> Estándar moderno (ej. 2026)");
console.log("5. getHours()    [Hora 24h]      :", fechaDemo.getHours(),    "-> Rango: 0 a 23");
console.log("6. getMinutes()  [Minutos]       :", fechaDemo.getMinutes(),  "-> Rango: 0 a 59");
console.log("7. getSeconds()  [Segundos]      :", fechaDemo.getSeconds(),  "-> Rango: 0 a 59");


// ==============================================================================
// BLOQUE 4: EXTRACCIÓN DE CALENDARIO (INDEXACIÓN EN 1 VS. INDEXACIÓN EN 0)
// ==============================================================================
imprimirSeparador(4, "CALENDARIO: getDate() (1-31) VS. getMonth() (0-11) VS. getDay() (0-6)");

// Es vital distinguir qué métodos comienzan a contar desde 1 y cuáles desde 0:
// - getDate()  empieza en 1 (el día 1 del mes es 1).
// - getMonth() empieza en 0 (Enero es 0, Febrero es 1, ..., Octubre es 9, Diciembre es 11).
// - getDay()   empieza en 0 (Domingo es 0, Lunes es 1, ..., Jueves es 4, Sábado es 6).

console.log("Día del mes con getDate()        :", fechaDemo.getDate(), "(Empieza en 1)");
console.log("Mes crudo con getMonth()         :", fechaDemo.getMonth(), "(Octubre es 9 porque Enero es 0)");
console.log("Mes humano con getMonth() + 1    :", fechaDemo.getMonth() + 1, "(Octubre ajustado a 10)");
console.log("Día semana con getDay()          :", fechaDemo.getDay(), "(Jueves es 4 porque Domingo es 0)");


// ==============================================================================
// BLOQUE 5: EXTRACCIÓN DEL AÑO: getFullYear() VS. EL OBSOLETO getYear()
// ==============================================================================
imprimirSeparador(5, "AÑO COMPLETO: getFullYear() VS. OBSOLETO getYear()");

// En apuntes antiguos suele aparecer 'getYear()'.
// ⚠️ 'getYear()' es un método obsoleto de los años 90 que devuelve (año - 1900).
// Para el año 2026, 'getYear()' devuelve 126 (el famoso problema del Efecto Y2K).
// ✅ Siempre debemos utilizar 'getFullYear()', que retorna el año completo de 4 dígitos (2026).

console.log("⚠️ Método obsoleto getYear()     :", fechaDemo.getYear(), "(2026 - 1900 = 126 ❌)");
console.log("✅ Método moderno getFullYear()  :", fechaDemo.getFullYear(), "(4 dígitos completos ✅)");


// ==============================================================================
// BLOQUE 6: EXTRACCIÓN DE RELOJ: HORAS, MINUTOS Y SEGUNDOS
// ==============================================================================
imprimirSeparador(6, "EXTRACCIÓN DE TIEMPO (RELOJ DE 24 HORAS)");

// Los métodos horarios utilizan el formato militar de 24 horas:
// - getHours()   -> 0 (medianoche) hasta 23 (11 PM)
// - getMinutes() -> 0 hasta 59
// - getSeconds() -> 0 hasta 59

console.log("Hora militar (getHours)          :", fechaDemo.getHours(), "horas (2:00 PM)");
console.log("Minutos (getMinutes)             :", fechaDemo.getMinutes(), "minutos");
console.log("Segundos (getSeconds)            :", fechaDemo.getSeconds(), "segundos");


// ==============================================================================
// BLOQUE 7: EXTRACCIÓN Y FORMATEO PRÁCTICO COMBINADO
// ==============================================================================
imprimirSeparador(7, "EXTRACCIÓN Y FORMATEO PRÁCTICO COMBINADO");

// Ejemplo oficial del temario desglosando la marca temporal en variables legibles:
const fechaActual = new Date();

const diaMes = fechaActual.getDate();
const mes = fechaActual.getMonth() + 1; // Se suma 1 porque Enero es 0
const anio = fechaActual.getFullYear();

const horas = fechaActual.getHours();
const minutos = fechaActual.getMinutes();
const segundos = fechaActual.getSeconds();

console.log(`Fecha: ${diaMes}/${mes}/${anio} - Hora: ${horas}:${minutos}:${segundos}`);


// ==============================================================================
// BLOQUE 8: COMPARATIVA: CÓDIGO CON TRAMPAS VS. ESTÁNDAR MODERNO
// ==============================================================================
imprimirSeparador(8, "COMPARATIVA: TRAMPAS DE APUNTES VS. ESTÁNDAR MODERNO");

// En apuntes o pizarras suele escribirse por error 'getDays()' (en plural) y 'getYear()'.
// Comprobemos qué ocurre realmente en el motor V8 de JavaScript:

const fechaComparativa = new Date("2026-10-29T14:30:00");

// 1. Intentar invocar fecha.getDays() en plural:
try {
    // @ts-ignore - Demostración pedagógica del error al usar plural getDays()
    fechaComparativa.getDays();
} catch (error) {
    console.log("❌ Trampa 1: fecha.getDays()     ->", `${error.name}: ${error.message} (No existe en plural)`);
}

console.log("⚠️ Trampa 2: fecha.getYear()     ->", fechaComparativa.getYear(), "(Devuelve 126 en lugar de 2026)");
console.log("⚠️ Trampa 3: fecha.getMonth()    ->", fechaComparativa.getMonth(), "(Muestra Octubre como mes 9)");

console.log("\n--- Equivalentes en el Estándar Moderno Seguro ---");
console.log("✅ Correcto: fecha.getDay()      ->", fechaComparativa.getDay(), "(En singular: 4 = Jueves)");
console.log("✅ Correcto: fecha.getFullYear() ->", fechaComparativa.getFullYear(), "(4 dígitos reales: 2026)");
console.log("✅ Correcto: getMonth() + 1      ->", fechaComparativa.getMonth() + 1, "(Octubre ajustado: 10)");


// ==============================================================================
// BLOQUE 9: ANALOGÍA DEL MUNDO REAL: EL RELOJ ASTRONÓMICO DE PARED 🕰️
// ==============================================================================
imprimirSeparador(9, "ANALOGÍA DEL MUNDO REAL: EL RELOJ ASTRONÓMICO 🕰️");

console.log(`
🕰️ METÁFORA DEL RELOJ ASTRONÓMICO DE PARED:
1. La Instancia (new Date()):
   - Es como tomar una FOTOGRAFÍA INSTANTÁNEA del reloj en este preciso milisegundo.
   - Las agujas dentro de la foto quedan congeladas en ese instante exacto.
2. Llamar a getHours(), getMinutes() o getSeconds():
   - Es simplemente mirar la aguja de las horas, los minutos o el segundero dentro de esa foto.
3. Llamar a getMonth() o getDay():
   - Es mirar las rueditas mecánicas del calendario que empiezan a contar desde la posición 0
     en lugar de la posición 1.
`);


// ==============================================================================
// BLOQUE 10: DIAGRAMA DE FLUJO DE EXTRACCIÓN TEMPORAL
// ==============================================================================
imprimirSeparador(10, "DIAGRAMA DE FLUJO DE EXTRACCIÓN");

console.log(`
                      [ new Date() ]
                (Instancia de Tiempo Actual)
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
 [ Calendario ]      [ Día de Semana ]       [ Reloj 24h ]
  ├─ getDate() (1-31)  └─ getDay() (0-6)      ├─ getHours() (0-23)
  ├─ getMonth() (0-11)                        ├─ getMinutes() (0-59)
  └─ getFullYear() (YYYY)                     └─ getSeconds() (0-59)
`);


// ==============================================================================
// BLOQUE 11: BUENA PRÁCTICA: FORMATEO CON .padStart(2, "0")
// ==============================================================================
imprimirSeparador(11, "BUENA PRÁCTICA: RELOJES DIGITALES CON .padStart(2, '0')");

// Los métodos como getHours(), getMinutes() o getSeconds() devuelven números enteros
// simples (ej. 8, 5, 9). Si los concatenamos directamente, un reloj se ve como "8:5:9"
// en lugar de "08:05:09".
// Al convertir el número a String y aplicar .padStart(2, "0"), garantizamos siempre 2 dígitos:

const fechaTemprano = new Date("2026-10-05T08:05:09");
const sinPad = `${fechaTemprano.getHours()}:${fechaTemprano.getMinutes()}:${fechaTemprano.getSeconds()}`;
const conPad = `${String(fechaTemprano.getHours()).padStart(2, "0")}:${String(fechaTemprano.getMinutes()).padStart(2, "0")}:${String(fechaTemprano.getSeconds()).padStart(2, "0")}`;

console.log("Hora sin formatear (⚠️)          :", sinPad); // "8:5:9"
console.log("Hora con .padStart(2, '0') (✅)  :", conPad); // "08:05:09"


// ==============================================================================
// BLOQUE 12: BUENA PRÁCTICA: ARREGLOS PARA NOMBRAR MESES Y DÍAS
// ==============================================================================
imprimirSeparador(12, "BUENA PRÁCTICA: ARREGLOS INDEXADOS EN CERO");

// Como getDay() (0-6) y getMonth() (0-11) comienzan en 0, coinciden de manera
// exacta y natural con los índices de un Array en JavaScript:

const nombresDias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const nombresMeses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

console.log("Día de la semana en texto        :", nombresDias[fechaDemo.getDay()], `(Índice ${fechaDemo.getDay()})`);
console.log("Nombre del mes en texto          :", nombresMeses[fechaDemo.getMonth()], `(Índice ${fechaDemo.getMonth()})`);


// ==============================================================================
// BLOQUE 13: ERRORES COMUNES: CONFUNDIR getDate() CON getDay()
// ==============================================================================
imprimirSeparador(13, "ERROR COMÚN 1: CONFUNDIR getDate() CON getDay()");

// Es el tropiezo número uno en entrevistas y evaluaciones técnicas:
// - getDate() devuelve el número de día del calendario (1 al 31).
// - getDay()  devuelve el índice del día de la semana (0 al 6).

console.log("❌ Incorrecto para día del mes   :", `Hoy es el día ${fechaDemo.getDay()} del mes (usó getDay)`);
console.log("✅ Correcto para día del mes     :", `Hoy es el día ${fechaDemo.getDate()} del mes (usó getDate)`);


// ==============================================================================
// BLOQUE 14: ERRORES COMUNES: OLVIDAR SUMAR +1 A getMonth()
// ==============================================================================
imprimirSeparador(14, "ERROR COMÚN 2: OLVIDAR QUE getMonth() EMPIEZA EN 0");

// En JavaScript, Navidad (25 de diciembre) tiene el mes 11 en el motor interno:
const navidad = new Date(2026, 11, 25);
console.log("❌ Navidad sin sumar +1 al mes   :", `${navidad.getDate()}/${navidad.getMonth()}/${navidad.getFullYear()} (Parece noviembre)`);
console.log("✅ Navidad sumando +1 al mes     :", `${navidad.getDate()}/${navidad.getMonth() + 1}/${navidad.getFullYear()} (25/12/2026)`);


// ==============================================================================
// BLOQUE 15: RESOLUCIÓN PASO A PASO DE LOS 3 EJERCICIOS DEL TEMARIO
// ==============================================================================
imprimirSeparador(15, "RESOLUCIÓN PASO A PASO DE LOS 3 EJERCICIOS OFICIALES");

// --- EJERCICIO 1 (Nivel 1 — Junior): Fecha en formato "DD/MM/YYYY" ---
// Enunciado: Crea una instancia de la fecha actual guardada en una constante 'hoy'.
// Extrae el día del mes, el mes (ajustado del 1 al 12) y el año completo de 4 dígitos,
// e imprime en consola una cadena con el formato "DD/MM/YYYY".
console.log("--- EJERCICIO 1 (Nivel 1): Fecha Formateada DD/MM/YYYY ---");

const hoy = new Date();
const dia = hoy.getDate();
const mesAjustado = hoy.getMonth() + 1; // Sumamos 1 porque Enero es 0
const anioCompleto = hoy.getFullYear(); // Evitamos getYear() para obtener los 4 dígitos

const fechaFormateada = `${dia}/${mesAjustado}/${anioCompleto}`;
console.log("Resultado Ejercicio 1 (DD/MM/YYYY):", fechaFormateada);


// --- EJERCICIO 2 (Nivel 2 — Semi-Senior): Función obtenerNombreDia(fecha) ---
// Enunciado: Escribe una función llamada 'obtenerNombreDia' que reciba un objeto 'Date'
// como parámetro. Utilizando el método 'getDay()' y un arreglo con los días de la semana,
// la función debe retornar el nombre del día en español (teniendo en cuenta que 0 es "Domingo").
console.log("\n--- EJERCICIO 2 (Nivel 2): Función obtenerNombreDia(fecha) ---");

function obtenerNombreDia(fecha) {
    // El índice 0 corresponde obligatoriamente a "Domingo"
    const diasSemana = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado"
    ];

    const indiceDia = fecha.getDay();
    return diasSemana[indiceDia];
}

const miFechaPrueba = new Date();
console.log("Hoy es                           :", obtenerNombreDia(miFechaPrueba));
console.log("Prueba con 2026-10-29 (Jueves)   :", obtenerNombreDia(new Date("2026-10-29T12:00:00")));


// --- EJERCICIO 3 (Nivel 3 — Avanzado): Función flecha relojDigital() ---
// Enunciado: Crea una función flecha llamada 'relojDigital' que tome la hora actual del
// sistema (getHours(), getMinutes(), getSeconds()) y devuelva un string con el formato
// exacto "HH:MM:SS", asegurándote de que los números menores a 10 lleven un cero a la
// izquierda (por ejemplo, "08:05:09").
console.log("\n--- EJERCICIO 3 (Nivel 3): Función Flecha relojDigital() ---");

const relojDigital = (fechaReferencia = new Date()) => {
    const horasStr = String(fechaReferencia.getHours()).padStart(2, "0");
    const minutosStr = String(fechaReferencia.getMinutes()).padStart(2, "0");
    const segundosStr = String(fechaReferencia.getSeconds()).padStart(2, "0");

    return `${horasStr}:${minutosStr}:${segundosStr}`;
};

console.log("Hora actual en Reloj Digital     :", relojDigital());
console.log("Prueba con 08:05:09 (padStart)   :", relojDigital(new Date("2026-10-29T08:05:09")));


// ==============================================================================
// BLOQUE 16: RESUMEN MAESTRO Y CHULETA TÉCNICA
// ==============================================================================
imprimirSeparador(16, "RESUMEN MAESTRO DEL OBJETO DATE");

console.log(`
RESUMEN TÉCNICO:
1. Instanciación: Es obligatorio usar 'new Date()' para crear un objeto con métodos de tiempo.
2. Día del mes vs. Día de semana:
   - 'getDate()' devuelve el día del calendario (1 al 31).
   - 'getDay()' (en singular, NO existe getDays) devuelve el día de la semana (0 = Domingo a 6 = Sábado).
3. Meses indexados en cero: 'getMonth()' devuelve de 0 (Enero) a 11 (Diciembre); suma +1 para formato numérico.
4. Año de 4 dígitos: Usa siempre 'getFullYear()' (ej. 2026) y nunca el obsoleto 'getYear()' (que resta 1900).
5. Formateo profesional: Usa 'String(valor).padStart(2, "0")' para asegurar dos dígitos ("08:05:09").
`);
console.log("==============================================================================");
console.log("🎯 [FIN DEL LABORATORIO]: Módulo de El Objeto Date completado con éxito.");
console.log("==============================================================================\n");
