// FUNCION DE ASERCIÓN SI LA CONDICIÓN ES FALSA, SE MUESTRA UN MENSAJE DE ERROR EN LA CONSOLA DE LO CONTRARIO NO SE MUESTRA NADA EN LA CONSOLA
console.assert(5 < 4) // Aserción fallida, se muestra un mensaje de error en la consola
console.assert(5 > 4) // Aserción exitosa, no se muestra ningún mensaje en la consola

// FUNCIONES DE REGISTRO DE MENSAJES EN LA CONSOLA

console.clear() // limpia la consola
console.error("Mensaje de error") //Mensaje de error
console.info("Mensaje de información") //Mensaje de información
console.log("Mensaje Normal") //Mensaje Normal
console.table([{ name: "Alice", age: 30 }, { name: "Bob", age: 25 }]) // despliega los datos en formato de tabla, con cada objeto representado como una fila y sus propiedades como columnas
console.warn("Mensaje de Alerta") // Mensaje de Alerta
console.dir({ name: "Alice", age: 30 }) // despliega una lista interactiva de las propiedades del objeto especificado

// FUNCIONES DE CONTEO Y TEMPORIZACIÓN

console.count() // muestra el número de veces que se ha llamado a count() con el mismo label
console.count() // muestra el número de veces que se ha llamado a count() con el mismo label 2
console.countReset() // reinicia el contador para el label especificado
console.count() // muestra el número de veces que se ha llamado a count() con el mismo label 1

// FUNCIONES DE AGRUPACIÓN DE MENSAJES

console.group("Grupo 1") // inicia un nuevo grupo de mensajes en la consola
console.log("Mensaje dentro del Grupo 1") // mensaje dentro del Grupo 1
console.log("Otro mensaje dentro del Grupo 1") // otro mensaje dentro del Grupo 1
console.group("Subgrupo 1.1") // inicia un nuevo subgrupo dentro del Grupo 1
console.log("Mensaje dentro del Subgrupo 1.1") // mensaje dentro del Subgrupo 1.1
console.log("Otro mensaje dentro del subgrupo 1.1");
console.groupEnd() // finaliza el grupo actual
console.groupEnd() // finaliza el grupo actual
console.groupCollapsed("Grupo 1") // inicia un nuevo grupo colapsado en la consola
console.log("Mensaje dentro del Grupo 1") // mensaje dentro del Grupo 1
console.log("Otro mensaje dentro del Grupo 1") // otro mensaje dentro del Grupo 1
console.groupEnd() // finaliza el grupo actual

// FUNCIONES DE TEMPORIZACIÓN

console.time("Tiempo de ejecución") // inicia un temporizador con el nombre especificado
console.timeLog("Tiempo de ejecución") // muestra el tiempo transcurrido desde que se inició el temporizador
console.timeLog("Tiempo de ejecución") // muestra el tiempo transcurrido desde que se inició el temporizador
console.timeEnd("Tiempo de ejecución") // finaliza el temporizador y muestra el tiempo total transcurrido