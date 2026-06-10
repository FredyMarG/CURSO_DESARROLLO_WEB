/**
 * GUÍA DE MANEJO DE EXCEPCIONES EN JAVASCRIPT
 * Este script demuestra el flujo de control mediante try, catch, finally
 * y la capacidad de lanzar excepciones personalizadas.
 */

// 1. Estructura básica Try-Catch
// Se utiliza para envolver código que puede fallar (como variables no definidas).
try {
    // Intentamos acceder a una variable que no existe (ReferenceError)
    fhjsjsj;
} catch (error) {
    console.log("Ocurrió un error de referencia");
}

// 2. Lógica interna en el bloque Catch
// El bloque catch es un entorno de ejecución normal donde podemos aplicar lógica.
try {
    asjfjgj; // Provoca error
} catch (error) {
    // Ejemplo de validación lógica dentro del manejo de la excepción
    if (3 > 5) {
        console.log("Ocurrió un error de referencia");
    } else {
        console.log("Error capturado, pero la condición lógica resultó en 'nada'");
    }
}

/**
 * 3. El comportamiento crítico de 'finally'
 * El bloque finally SIEMPRE se ejecuta, independientemente de si hubo error o no.
 * NOTA: Si finally retorna un valor, sobrescribirá cualquier return previo del try o catch.
 * 
 * @returns {number} Retornará 3 debido a la prioridad de finally sobre try.
 */
const pruebaTry = () => {
    try {
        return 1; // Se prepara el retorno 1
    } catch (e) {
        return 2;
    } finally {
        // Este bloque se ejecuta justo antes de que la función termine.
        // Al tener un return aquí, invalida el 'return 1' del bloque try.
        return 3;
    }
};

console.log(`Resultado de pruebaTry: ${pruebaTry()}`);

// 4. Lanzamiento de excepciones personalizadas (Throw)
// En JS podemos lanzar no solo objetos Error, sino cualquier tipo de dato (objetos, strings, etc).
try {
    // Lanzamos un objeto literal como excepción
    throw {
        error: "Nombre del error",
        info: "Información adicional sobre la falla"
    };
} catch (error) {
    // El parámetro 'error' recibe exactamente lo que lanzamos arriba
    console.log("Excepción personalizada capturada:");
    console.log(error);
}

// 5. Lanzamiento de colecciones (Arrays)
// Al igual que con objetos, podemos lanzar arrays y procesarlos por índice dentro del catch.
try {
    // Lanzamos un array de strings como error
    throw ["pedro", "jorge"];
} catch (e) {
    // El parámetro 'e' ahora es el array, por lo que podemos acceder a sus posiciones
    console.log(`Usuario capturado en la excepción: ${e[1]}`); // Imprime "jorge"
}