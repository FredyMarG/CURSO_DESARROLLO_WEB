const result = document.getElementById("resultado");

//Materias es un objeto que contiene cada materia como clave y un objeto con asistencias, promedio y trabajos como valor
const materias = {
    fisica: {asistencias: 0, promedio: 0, trabajos: 0},
    matematica: {asistencias: 0, promedio: 0, trabajos: 0},
    logica: {asistencias: 0, promedio: 0, trabajos: 0},
    quimica: {asistencias: 0, promedio: 0, trabajos: 0},
    calculo: {asistencias: 0, promedio: 0, trabajos: 0},
    programacion: {asistencias: 0, promedio: 0, trabajos: 0},
    biologia: {asistencias: 0, promedio: 0, trabajos: 0},
    bd: {asistencias: 0, promedio: 0, trabajos: 0},
    algebra: {asistencias: 0, promedio: 0, trabajos: 0}
};



// 🔥 consola dinámica
// Esta función se encarga de renderizar el estado actual de las materias en la consola, mostrando claramente qué requisitos se cumplen y cuáles no a partir de los datos proporcionados en el HTML.
function renderConsola() {
    // Limpiar consola para evitar saturación de mensajes
    console.clear();

    // El objecto "materias" se recorre con Object.entries para obtener el nombre de cada materia y sus datos asociados (asistencias, promedio, trabajos).
    Object.entries(materias).forEach(([nombre, data]) => {

        // Se utiliza console.group para agrupar los mensajes relacionados con cada materia bajo un título que es el nombre de la materia. Esto mejora la legibilidad y organización de la información en la consola.
        console.group(`📘 ${nombre}`);

        // Para cada criterio (asistencias, promedio, trabajos), se evalúa si cumple con el requisito mínimo. Se muestra un mensaje con un ícono de check (✔) si se cumple o una cruz (✘) si no se cumple. Además, se aplica un estilo de color verde para los criterios cumplidos y rojo para los que no se cumplen, utilizando CSS en la consola.
        console.log(

            // El mensaje se construye utilizando un operador ternario para decidir qué texto mostrar y qué color aplicar según si el criterio se cumple o no.
            data.asistencias >= 90 ? "%c✅ Asistencia OK" : "%c❌ Asistencia baja",`color:${data.asistencias >= 90 ? "green" : "red"}; margin-left: 20px; font-weight: bold;`
        );

        // Se repite el mismo patrón para el promedio y los trabajos, evaluando cada uno contra su respectivo umbral (promedio >= 7 y trabajos >= 3) y aplicando estilos similares para indicar visualmente el estado de cada criterio.
        console.log(

            // Para el promedio, se verifica si es mayor o igual a 7 para determinar si está aprobado o no, mostrando el mensaje correspondiente con el estilo adecuado.
            data.promedio >= 7 ? "%c✅ Promedio OK" : "%c❌ Promedio bajo",
            `color:${data.promedio >= 7 ? "green" : "red"}; margin-left: 20px; font-weight: bold;`
        );

        console.log(

            // Para los trabajos, se verifica si se han entregado al menos 3 de los 4 trabajos requeridos, mostrando el mensaje correspondiente con el estilo adecuado.
            data.trabajos >= 3 ? "%c✅ Trabajos OK" : "%c❌ Trabajos incompletos",
            `color:${data.trabajos >= 3 ? "green" : "red"}; margin-left: 20px; font-weight: bold;`
        );

        // Finalmente, se cierra el grupo de mensajes para esa materia con console.groupEnd, lo que ayuda a mantener la consola organizada y fácil de leer.
        console.groupEnd();
    });
    // Al finalizar el recorrido de todas las materias, se muestra una tabla resumen con el estado actual de todas las materias utilizando console.table, lo que proporciona una vista estructurada y clara de los datos ingresados.
    console.table(materias);
}

// 🔄 UI dinámica

// Se recorre el objeto "materias" utilizando Object.entries para obtener el nombre de cada materia y sus datos asociados.
Object.entries(materias).forEach(([nombre, data]) => {

    // Se crea un elemento div para representar la fila de cada materia, y se le asigna la clase "fila" para aplicar estilos específicos a esta sección de la interfaz.
    const fila = document.createElement("div");

    // Se asigna la clase "fila" al div creado, lo que permite aplicar estilos CSS definidos para esta clase, como diseño, colores y espaciado, asegurando que cada fila de materia tenga una apariencia consistente y organizada en la interfaz de usuario.
    fila.classList.add("fila");

    // El contenido HTML de cada fila se construye utilizando una plantilla literal, que incluye el nombre de la materia, tres campos de entrada para las asistencias, el promedio y los trabajos, y un span para mostrar el estado (aprobado o reprobado). Cada campo de entrada tiene atributos específicos para limitar los valores que el usuario puede ingresar, como el tipo de dato, el paso, el rango mínimo y máximo, y un placeholder para guiar al usuario sobre qué información debe ingresar.
    fila.innerHTML = `
        <span class="main-span">📘<span class="nombre">${nombre}</span></span>
        <input type="number" step="0.01" min="0" max="100" placeholder="Asistencia (0% - 100%)">
        <input type="number" step="0.01" min="0" max="10" placeholder="Promedio (0 - 10)">
        <input type="number" step="1" min="0" max="4" placeholder="Trabajos (0 - 4)">
        <span class="estado"></span>
    `;

    // Se seleccionan los elementos de entrada y el span de estado dentro de la fila utilizando querySelectorAll y querySelector, respectivamente. Esto permite acceder a estos elementos para agregarles funcionalidad y actualizar su contenido dinámicamente en función de los datos ingresados por el usuario.
    const inputs = fila.querySelectorAll("input");
    const estado = fila.querySelector(".estado");

    // 🔥 validadores

    // La función limitarDecimales se encarga de limitar el número de decimales de un valor numérico a un máximo especificado (por defecto, 2 decimales). Esto es útil para asegurar que los valores ingresados por el usuario se mantengan dentro de un formato adecuado y no tengan más decimales de los necesarios, lo que puede mejorar la legibilidad y evitar errores en los cálculos posteriores.
    function limitarDecimales(valor, maxDecimales = 2) {
        return Number(parseFloat(valor || 0).toFixed(maxDecimales));
    }

    // La función soloEnteros se encarga de convertir un valor a un número entero, eliminando cualquier parte decimal. Esto es útil para campos donde solo se permiten números enteros, como la cantidad de trabajos entregados, asegurando que el usuario no pueda ingresar valores decimales en ese campo específico.
    function soloEnteros(valor) {
        return Math.floor(Number(valor || 0));
    }

    // La función actualizar se encarga de leer los valores ingresados por el usuario en los campos de entrada, aplicar las validaciones correspondientes (limitar decimales para asistencias y promedio, y convertir a enteros para trabajos)
    function actualizar() {

        // Se obtienen los valores de asistencias, promedio y trabajos desde los campos de entrada, aplicando las funciones de validación para asegurar que los datos sean correctos y estén en el formato adecuado antes de ser utilizados para actualizar el estado de la materia.
        let asistencias = limitarDecimales(inputs[0].value, 2);
        let promedio = limitarDecimales(inputs[1].value, 2);
        let trabajos = soloEnteros(inputs[2].value);

        // 💥 forzar visualmente el valor corregido
        // Después de aplicar las validaciones, se actualizan los valores en los campos de entrada para reflejar cualquier corrección realizada por las funciones de validación. Esto proporciona una retroalimentación visual inmediata al usuario sobre los valores que ha ingresado y cómo han sido ajustados para cumplir con los requisitos establecidos.
        inputs[0].value = asistencias;
        inputs[1].value = promedio;
        inputs[2].value = trabajos;

        // guardar
        // Los valores validados se asignan al objeto "data" correspondiente a la materia actual, actualizando así el estado de la materia con los datos ingresados por el usuario. Esto permite que la función renderConsola pueda acceder a estos datos actualizados para mostrar el estado correcto de cada materia en la consola.
        data.asistencias = asistencias;
        data.promedio = promedio;
        data.trabajos = trabajos;

        // estado UI
        // Se evalúan los criterios de aprobación para la materia (asistencias >= 90%, promedio >= 7, trabajos >= 3) y se actualiza el contenido del span de estado para mostrar si la materia está aprobada o reprobada. Además, se aplican clases CSS a la fila y al estado para cambiar su apariencia visual según si se cumplen o no los requisitos, proporcionando una indicación clara y visual del estado de cada materia en la interfaz de usuario.
        if (asistencias >= 90 && promedio >= 7 && trabajos >= 3) {
            estado.textContent = "✅ Aprobado";
            estado.className = "estado aprobado";
            fila.className = "fila aprobado";
        } else {
            estado.textContent = "❌ Reprobado";
            estado.className = "estado reprobado";
            fila.className = "fila reprobado";
        }

        // Finalmente, se llama a la función renderConsola para actualizar la consola con el estado actual de todas las materias cada vez que se realiza un cambio en los campos de entrada, asegurando que la información mostrada en la consola esté siempre sincronizada con los datos ingresados por el usuario.
        renderConsola();
    }

    // ✅ listeners
    // Se agrega un event listener de tipo "input" a cada campo de entrada para que la función actualizar se ejecute cada vez que el usuario realice un cambio en cualquiera de los campos. Esto permite que la interfaz de usuario y la consola se actualicen dinámicamente en tiempo real a medida que el usuario ingresa o modifica los datos, proporcionando una experiencia interactiva y responsiva.
    inputs.forEach(inp => {
        inp.addEventListener("input", actualizar);
    });

    // Se llama a la función actualizar inicialmente para establecer el estado inicial de la materia en la interfaz de usuario y en la consola, asegurando que todo esté sincronizado desde el principio incluso antes de que el usuario realice cualquier cambio.
    actualizar();

    // Finalmente, se agrega la fila creada para la materia al contenedor de resultados en la interfaz de usuario, lo que permite que cada materia tenga su propia sección visual donde el usuario puede ingresar los datos y ver el estado correspondiente.
    result.appendChild(fila);
});