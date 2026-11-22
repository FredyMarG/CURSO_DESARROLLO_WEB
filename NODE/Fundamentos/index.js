// ============================================================================
// MÓDULO 01: FUNDAMENTOS DE NODE.JS — PRIMER PROGRAMA EN CONSOLA
// Ejecutar en terminal con: node index.js
// ============================================================================

// Declaramos una constante con el nombre del módulo actual
const curso = "Fundamentos de Node.js";
// Declaramos una constante numérica con el nivel del módulo
const nivel = 1;
// Declaramos el total de módulos planificados en la ruta de Node.js
const totalModulos = 26;

// Definimos una función reutilizable para construir el mensaje de bienvenida
function presentarCurso(nombre, cantidad) {
  // Retornamos un template string interpolando el nombre y la cantidad de módulos
  return `Bienvenido a ${nombre}. El programa tiene ${cantidad} módulos.`;
} // Fin de la función presentarCurso

// Imprimimos el saludo inicial del proyecto en la terminal
console.log("Bienvenido a CURSO_DESARROLLO_WEB");
// Imprimimos el nombre del curso almacenado en la constante
console.log("Curso:", curso);
// Imprimimos el nivel actual del módulo
console.log("Nivel:", nivel);
// Invocamos la función presentarCurso y mostramos su resultado en consola
console.log(presentarCurso(curso, totalModulos));

// Definimos una función para saludar de forma personalizada usando template strings
function saludar(nombre) {
  // Retornamos el saludo interpolando el parámetro nombre
  return `hola ${nombre}`;
} // Fin de la función saludar

// Consultamos la versión exacta de Node.js desde el objeto global process
console.log("Node.js:", process.version);
// Consultamos el directorio de trabajo actual donde se ejecuta el proceso
console.log("Directorio actual:", process.cwd());

// Invocamos la función saludar pasando "Fredy" como argumento y lo mostramos en consola
console.log(saludar("Fredy"));