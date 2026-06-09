// 1. Ámbito Global/Script:
// Se declara 'nombre' en el nivel superior. Esta variable es accesible 
// por cualquier bloque hijo, a menos que sea "sombreada".
let nombre = "Juan";

/**
 * 2. Bloque de Código (Block Scope):
 * Las llaves crean un contexto léxico independiente para 'let' y 'const'.
 */
{
    // Shadowing: Declaramos una nueva variable con el mismo identificador.
    // Esta variable 'nombre' es TOTALMENTE distinta a la de afuera y solo
    // vive dentro de estas llaves.
    let nombre = "Pedro";
    
    // El motor de JS busca la variable más cercana en la cadena de ámbitos.
    alert(nombre); // Salida: "Pedro"
}

// 3. Retorno al flujo principal:
// Una vez que el control de flujo sale del bloque de llaves, la variable 
// local "Pedro" es eliminada de la memoria (Garbage Collected).
// Aquí volvemos a acceder a la variable del ámbito superior.
alert(nombre); // Salida: "Juan"