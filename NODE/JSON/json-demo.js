// Importa y parsea automáticamente el archivo JSON local en CommonJS (Node.js lo convierte en objeto JS).
// Nota: curso.json NO lleva comentarios (// o /* */) porque el estándar JSON (RFC 8259) no los permite.
const curso = require('./curso.json');

// Accedemos a las propiedades del objeto importado desde curso.json
console.log(curso.titulo);    // string: "Aprende Node.js"
console.log(curso.numVistas); // number: 45642
console.log(curso.temas);     // array: ["Javascript", "Node.js"]

// Objeto literal de JavaScript que vamos a convertir a texto JSON y luego volver a parsear
const infoCurso = {
    titulo: 'Aprende Node.js',
    numVistas: 45642,
    numLikes: 21123,
    temas: [
        'Javascript',
        'Node.js'
    ],
    esPublico: true
};

// Serialización: convierte el objeto JS en una cadena de texto JSON (formato intercambio/red)
// (opcionalmente puedes pasar null, 2 como 2.º y 3.º argumento para indentarlo)
const infoCursoJSON = JSON.stringify(infoCurso);
console.log(infoCursoJSON);
console.log(typeof infoCursoJSON); // "string"

// Deserialización: convierte la cadena JSON de vuelta en un objeto JS (con try/catch por seguridad)
try {
    const infoCursoObjeto = JSON.parse(infoCursoJSON);
    console.log(infoCursoObjeto);
    console.log(typeof infoCursoObjeto); // "object"
} catch (error) {
    // Captura SyntaxError si la cadena no cumple la sintaxis estricta de JSON
    console.error('Error al parsear JSON:', error.message);
}
