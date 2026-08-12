// Definimos un objeto literal constante para simular un conjunto de datos estáticos
const objeto = {
    // Primera propiedad del objeto con clave y valor tipo cadena
    propiedad1: "valor1",
    // Segunda propiedad con su respectivo valor asignado
    propiedad2: "valor2",
    // Tercera propiedad con su respectivo valor asignado
    propiedad3: "valor3"
}; // Fin del objeto de prueba

// Declaramos una función flecha constante que simula una consulta de red asíncrona
const obtenerInformacion = (text) => {
    // Retorna una nueva promesa ejecutora con callbacks resolve y reject
    return new Promise((resolve, reject) => {
        // Ejecuta un temporizador para simular un retraso de procesamiento
        setTimeout(() => {
            // Resuelve la promesa devolviendo el texto recibido
            resolve(text);
        }, 1000); // Demora la resolución por 1000 milisegundos (1 segundo)
    }); // Fin de la promesa
}; // Fin de la función

// Declaramos una función asíncrona usando la palabra clave async
const mostrarData = async () => {
    // await pausa la ejecución secuencial esperando a que se resuelva la primera promesa
    data1 = await obtenerInformacion("1: Fredy");
    // await pausa de nuevo la ejecución esperando la resolución de la segunda promesa
    data2 = await obtenerInformacion("2: Mery");
    // await pausa una tercera vez esperando la resolución de la última promesa
    data3 = await obtenerInformacion("3: Gato");

    // Imprime en la consola el valor resuelto almacenado en data1
    console.log(data1);
    // Imprime en la consola el valor resuelto almacenado en data2
    console.log(data2);
    // Imprime en la consola el valor resuelto almacenado en data3
    console.log(data3);
}; // Fin de la función asíncrona

// Ejecutamos la función asíncrona para iniciar el flujo secuencial en la consola
mostrarData();


// ===================================================================
// LÓGICA DE INTERACCIÓN CON EL DOM (DASHBOARD INTERACTIVO DE ASYNC/AWAIT)
// ===================================================================

// Definimos la clase Persona que servirá como plantilla de modelado de datos
class Persona {
    // Constructor de inicialización para instanciar propiedades de Persona
    constructor(nombre, instagram) {
        // Asigna el parámetro nombre a la propiedad del objeto instanciado
        this.nombre = nombre;
        // Asigna el parámetro instagram a la propiedad del objeto instanciado
        this.instagram = instagram;
    } // Fin del constructor
} // Fin de la clase

// Base de datos simulada en memoria mediante una matriz bidimensional
const data = [
    // Primer registro de usuario
    ['fredy', '@fredy'],
    // Segundo registro de usuario
    ['ana', '@ana'],
    // Tercer registro de usuario
    ['luis', '@luis']
]; // Fin de la matriz

// Creamos una colección de objetos tipo Persona
const personas = [];
// Bucle iterativo para rellenar la colección instanciando clases
for (let i = 0; i < data.length; i++) {
    // Asigna un objeto nuevo instanciado por cada registro de la matriz
    personas[i] = new Persona(data[i][0], data[i][1]);
} // Fin del bucle

// Función auxiliar declarada como asíncrona (async) para buscar una persona
const obtenerPersona = async (id) => {
    // await pausa la ejecución durante 1.2 segundos para simular tiempo de consulta en la red
    await new Promise((resolve) => setTimeout(resolve, 1200));
    // Evalúa si la persona buscada por ID no está registrada en el array
    if (personas[id] == undefined) {
        // Lanza (throw) una excepción que equivale a rechazar la Promesa
        throw "No se ha encontrado la persona";
    } // Fin de la condición
    // Retorna el objeto persona encontrado, lo cual resuelve implícitamente la Promesa
    return personas[id];
}; // Fin de la función asíncrona

// Función auxiliar declarada como asíncrona (async) para extraer el instagram
const obtenerInstagram = async (id) => {
    // await pausa la ejecución durante 1.2 segundos simulando la consulta asíncrona
    await new Promise((resolve) => setTimeout(resolve, 1200));
    // Evalúa si la propiedad instagram de la persona no está definida
    if (personas[id].instagram == undefined) {
        // Lanza una excepción indicando que la búsqueda falló
        throw "No se ha encontrado el Instagram";
    } // Fin de la condición
    // Retorna la cadena de instagram, resolviendo implícitamente la Promesa
    return personas[id].instagram;
}; // Fin de la función asíncrona

// Registramos el evento DOMContentLoaded para iniciar la lógica al renderizar el documento
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SECCIÓN DE CONTROL DE PESTAÑAS (TABS) ---
    // Referencia al botón selector de la pestaña de Función Async
    const tabSingle = document.getElementById('tabSingle');
    // Referencia al botón selector de la pestaña de Secuencia Await
    const tabChain = document.getElementById('tabChain');
    // Referencia al contenedor de contenido de la primera pestaña
    const singleTabContent = document.getElementById('single-tab');
    // Referencia al contenedor de contenido de la segunda pestaña
    const chainTabContent = document.getElementById('chain-tab');

    // Función auxiliar reutilizable para intercambiar la visibilidad de los paneles
    const switchTab = (activeBtn, activeContent, inactiveBtn, inactiveContent) => {
        // Agrega la clase active al botón pulsado para iluminarlo
        activeBtn.classList.add('active');
        // Remueve la clase hidden del panel activo para mostrar su contenido
        activeContent.classList.remove('hidden');
        // Remueve la clase active del botón inactivo para apagarlo
        inactiveBtn.classList.remove('active');
        // Agrega la clase hidden al panel inactivo para ocultarlo
        inactiveContent.classList.add('hidden');
    }; // Fin de la función

    // Escuchador de clic en la pestaña de Función Async
    tabSingle.addEventListener('click', () => {
        // Invoca el cambio de visualización dando prioridad a la pestaña individual
        switchTab(tabSingle, singleTabContent, tabChain, chainTabContent);
    }); // Fin del evento

    // Escuchador de clic en la pestaña de Secuencia Await
    tabChain.addEventListener('click', () => {
        // Invoca el cambio de visualización dando prioridad a la pestaña secuencial
        switchTab(tabChain, chainTabContent, tabSingle, singleTabContent);
        // Resalta la fila seleccionada actualmente en el visor de datos en tiempo real
        updateSelectedRow(document.getElementById('chainUserSelect').value);
    }); // Fin del evento

    // --- 2. SECCIÓN DE LA DEMO 1: FUNCIÓN ASÍNCRONA INDIVIDUAL ---
    // Referencia al botón de ejecución para la prueba individual
    const runPromiseBtn = document.getElementById('runPromiseBtn');
    // Referencia al selector de retraso del temporizador
    const delaySelect = document.getElementById('delaySelect');
    // Referencia al selector del comportamiento de la resolución
    const behaviorSelect = document.getElementById('behaviorSelect');
    // Referencia al indicador circular de estado visual
    const promiseIndicator = document.getElementById('promiseIndicator');
    // Referencia al texto descriptivo del estado actual
    const promiseStateText = document.getElementById('promiseStateText');
    // Referencia a la barra de carga de progreso interno
    const progressBar = document.getElementById('progressBar');
    // Referencia al texto contenedor del resultado del retorno
    const resultText = document.getElementById('result');
    // Referencia al pie de nota del log del panel
    const demoNote = document.getElementById('demoNote');

    // Variable global para almacenar el identificador de cuadros de animación
    let animationFrameId;

    // Función que implementa animación suave de la barra mediante requestAnimationFrame
    const animateProgressBar = (duration, onComplete) => {
        // Inicializa la variable de tiempo de referencia de inicio en nulo
        let startTime = null;
        // Función interna recursiva por cada cuadro de fotograma
        const step = (timestamp) => {
            // Si es el primer cuadro, guarda la marca de tiempo inicial
            if (!startTime) startTime = timestamp;
            // Calcula los milisegundos transcurridos desde el inicio
            const elapsed = timestamp - startTime;
            // Calcula el porcentaje lineal completado limitándolo al 100%
            const progress = Math.min((elapsed / duration) * 100, 100);
            // Modifica la anchura de la barra CSS con el porcentaje calculado
            progressBar.style.width = `${progress}%`;

            // Si no ha culminado el tiempo asignado, solicita el siguiente fotograma
            if (elapsed < duration) {
                // Llama de forma recursiva a requestAnimationFrame
                animationFrameId = requestAnimationFrame(step);
            } else {
                // Al finalizar ejecuta el callback si está definido
                if (onComplete) onComplete();
            } // Fin de evaluación de progreso
        }; // Fin del ciclo de fotograma
        // Cancela cualquier animación previa para evitar colisiones
        cancelAnimationFrame(animationFrameId);
        // Resetea el ancho de la barra al 0%
        progressBar.style.width = '0%';
        // Inicia el ciclo solicitando el primer cuadro de animación
        animationFrameId = requestAnimationFrame(step);
    }; // Fin de la función

    // Asigna el controlador de eventos clic utilizando una función asíncrona (async)
    runPromiseBtn.addEventListener('click', async () => {
        // Deshabilita el botón de ejecución para evitar llamadas múltiples simultáneas
        runPromiseBtn.disabled = true;

        // Cambia la clase del indicador al estado visual de carga (pendiente)
        promiseIndicator.className = 'promise-indicator state-pending';
        // Aplica el color amarillo correspondiente al texto del estado
        promiseStateText.className = 'state-pending-text';
        // Modifica el texto informativo para indicar que está procesando la llamada
        promiseStateText.textContent = 'Procesando await (Pending)...';
        // Reinicia la barra de progreso a cero
        progressBar.style.width = '0%';
        // Aplica color amarillo al texto de resultados
        resultText.className = 'pending';
        // Establece el mensaje de espera en la caja de resultados
        resultText.textContent = 'Pausado en expresión await...';
        // Actualiza el pie de nota para reportar el inicio de la función
        demoNote.textContent = 'Estado: await pausó la ejecución';

        // Obtiene el valor numérico entero del retraso seleccionado
        const delay = parseInt(delaySelect.value);
        // Obtiene la opción de comportamiento seleccionada
        const behavior = behaviorSelect.value;

        // Variable lógica para determinar el éxito de la operación
        let shouldResolve = true;
        // Evalúa si se forzó un rechazo de la promesa
        if (behavior === 'reject') {
            // Cambia la variable a falso
            shouldResolve = false;
        // Evalúa si el resultado se definirá de manera aleatoria
        } else if (behavior === 'random') {
            // Elige éxito si el número aleatorio es mayor o igual a 0.5
            shouldResolve = Math.random() >= 0.5;
        } // Fin de evaluación de comportamiento

        // Definimos una Promesa simulada que resuelve o rechaza según corresponda
        const simulacionPromesa = () => {
            // Retorna la instancia de Promesa
            return new Promise((resolve, reject) => {
                // Configura el temporizador asíncrono
                setTimeout(() => {
                    // Evalúa el resultado lógico de la simulación
                    if (shouldResolve) {
                        // Resuelve con mensaje de éxito
                        resolve("¡Retorno exitoso desde async function! ⚡");
                    } else {
                        // Rechaza con mensaje de error
                        reject("Error capturado: la operación asíncrona falló. ❌");
                    } // Fin de evaluación
                }, delay); // Aplica el delay seleccionado
            }); // Fin de promesa
        }; // Fin del helper

        // Dispara la animación de carga de la barra de progreso
        animateProgressBar(delay);

        // Bloque try/catch para controlar el flujo asíncrono de manera lineal (tema principal)
        try {
            // await detiene la ejecución del bloque esperando la resolución de la promesa
            const mensajeRetornado = await simulacionPromesa();
            // Si tiene éxito, actualiza el indicador visual a completado
            promiseIndicator.className = 'promise-indicator state-fulfilled';
            // Aplica el color verde al texto informativo
            promiseStateText.className = 'state-fulfilled-text';
            // Escribe el estado exitoso
            promiseStateText.textContent = 'Resuelta (Fulfilled)';
            // Aplica clase de éxito al contenedor del resultado
            resultText.className = 'fulfilled';
            // Escribe el mensaje de éxito retornado por la función
            resultText.textContent = mensajeRetornado;
            // Actualiza la nota informando la duración total del proceso
            demoNote.textContent = `Operación resuelta en ${delay}ms`;
        } catch (error) {
            // Si el await devuelve un rechazo, el bloque catch captura el error
            promiseIndicator.className = 'promise-indicator state-rejected';
            // Aplica el color rojo al texto informativo
            promiseStateText.className = 'state-rejected-text';
            // Escribe el estado fallido
            promiseStateText.textContent = 'Rechazada (Rejected)';
            // Aplica clase de fallo al contenedor del resultado
            resultText.className = 'rejected';
            // Escribe la causa del error atrapado
            resultText.textContent = error;
            // Actualiza la nota informando la duración del proceso fallido
            demoNote.textContent = `Operación rechazada en ${delay}ms`;
        } finally {
            // Habilita nuevamente el botón de control al terminar el flujo
            runPromiseBtn.disabled = false;
        } // Fin del bloque try/catch
    }); // Fin del evento clic

    // --- 3. SECCIÓN DE LA DEMO 2: SECUENCIA DE PASOS CON AWAIT (CHAINING) ---
    // Referencia al botón para iniciar la secuencia secuencial
    const runChainBtn = document.getElementById('runChainBtn');
    // Referencia al selector del ID de usuario a consultar
    const chainUserSelect = document.getElementById('chainUserSelect');
    // Referencia al contenedor de texto del resultado final
    const chainResult = document.getElementById('chainResult');
    // Referencia al pie de nota de estado de la consulta secuencial
    const chainDemoNote = document.getElementById('chainDemoNote');

    // Referencias a los contenedores y estados de los círculos del Timeline de la interfaz
    // Elemento contenedor del paso 1
    const step1Circle = document.getElementById('step1Circle');
    // Texto descriptivo de estado del paso 1
    const step1Status = document.getElementById('step1Status');
    // Elemento contenedor del paso 2
    const step2Circle = document.getElementById('step2Circle');
    // Texto descriptivo de estado del paso 2
    const step2Status = document.getElementById('step2Status');

    // Función auxiliar para resaltar visualmente la fila de base de datos activa
    const updateSelectedRow = (selectedId) => {
        // Bucle iterativo sobre los IDs de filas del HTML
        for (let i = 0; i <= 3; i++) {
            // Obtiene la fila HTML correspondiente
            const row = document.getElementById(`db-row-${i}`);
            // Remueve la clase de selección de fila si existe
            if (row) row.classList.remove('selected-row');
        } // Fin del bucle
        // Obtiene la fila que coincide con el ID seleccionado
        const activeRow = document.getElementById(`db-row-${selectedId}`);
        // Si existe, le añade la clase selected-row para iluminarla
        if (activeRow) activeRow.classList.add('selected-row');
    }; // Fin de la función

    // Escuchador de cambios en el selector para actualizar el resaltado de filas
    chainUserSelect.addEventListener('change', (e) => {
        // Ejecuta la función auxiliar enviando el valor del selector seleccionado
        updateSelectedRow(e.target.value);
    }); // Fin del evento

    // Asigna el evento clic para ejecutar la secuencia de consultas usando async/await
    runChainBtn.addEventListener('click', async () => {
        // Extrae el ID numérico entero seleccionado
        const idConsulta = parseInt(chainUserSelect.value);
        // Deshabilita el botón de ejecución secuencial durante el proceso
        runChainBtn.disabled = true;

        // Restablece el círculo indicador del paso 1 al estado de espera
        step1Circle.className = 'step-circle state-idle';
        // Restablece el texto de estado del paso 1
        step1Status.className = 'step-status-text state-idle-text';
        // Cambia el texto a su valor inicial
        step1Status.textContent = 'Esperando...';

        // Restablece el círculo indicador del paso 2 al estado de espera
        step2Circle.className = 'step-circle state-idle';
        // Restablece el texto de estado del paso 2
        step2Status.className = 'step-status-text state-idle-text';
        // Cambia el texto a su valor inicial
        step2Status.textContent = 'Esperando...';

        // Aplica color de carga al texto de resultados de secuencia
        chainResult.className = 'pending';
        // Muestra mensaje de carga general
        chainResult.textContent = 'Ejecutando secuencia lineal con await...';
        // Actualiza el pie de nota indicando la ejecución del paso 1
        chainDemoNote.textContent = 'Estado de la secuencia: Esperando Paso 1';

        // Pone el indicador del paso 1 en modo de carga (pulsante)
        step1Circle.className = 'step-circle state-pending';
        // Pone el texto del paso 1 en color amarillo
        step1Status.className = 'step-status-text state-pending-text';
        // Informa que se está ejecutando la llamada de búsqueda de Persona
        step1Status.textContent = 'Consultando Persona (await)...';

        // Bloque try/catch que demuestra el control secuencial con await (tema principal)
        try {
            // Ejecutamos y esperamos de forma asíncrona el resultado de obtenerPersona (contiene retardo interno)
            const persona = await obtenerPersona(idConsulta);
            
            // Paso 1 Exitoso: actualizamos indicador visual del paso 1 a verde
            step1Circle.className = 'step-circle state-fulfilled';
            // Cambia el color del texto a verde
            step1Status.className = 'step-status-text state-fulfilled-text';
            // Reporta que se encontró a la persona con su nombre
            step1Status.textContent = `Completado. Persona: ${persona.nombre}`;
            
            // Actualiza la nota general para avisar que avanza al Paso 2
            chainDemoNote.textContent = 'Estado de la secuencia: Esperando Paso 2';

            // Pone el indicador del paso 2 en modo de carga (pulsante)
            step2Circle.className = 'step-circle state-pending';
            // Cambia el color del texto del paso 2 a amarillo
            step2Status.className = 'step-status-text state-pending-text';
            // Informa que se está ejecutando la llamada de obtención de Instagram
            step2Status.textContent = 'Consultando Instagram (await)...';

            // Ejecutamos y esperamos de forma asíncrona el resultado de obtenerInstagram (contiene retardo interno)
            const instagram = await obtenerInstagram(idConsulta);

            // Paso 2 Exitoso: actualizamos el indicador a verde
            step2Circle.className = 'step-circle state-fulfilled';
            // Cambia el color del texto a verde
            step2Status.className = 'step-status-text state-fulfilled-text';
            // Reporta que se encontró la red social
            step2Status.textContent = `Completado. Instagram: ${instagram}`;

            // Pone el color de éxito en la caja de resultados
            chainResult.className = 'fulfilled';
            // Muestra el perfil recuperado de manera clara
            chainResult.textContent = `¡Secuencia completada! Perfil: @${instagram.replace('@', '')}`;
            // Actualiza la nota indicando que toda la secuencia se completó correctamente
            chainDemoNote.textContent = 'Estado de la secuencia: Resuelta (Fulfilled)';
        } catch (error) {
            // El bloque catch captura el rechazo en CUALQUIERA de las operaciones await anteriores
            chainResult.className = 'rejected';
            // Escribe el mensaje de error capturado
            chainResult.textContent = `Secuencia falló: "${error}"`;
            // Actualiza el pie de nota para reportar el rechazo
            chainDemoNote.textContent = 'Estado de la secuencia: Rechazada (Rejected)';

            // Evalúa en qué paso se quedó la ejecución para aplicar el estado de error (color rojo)
            if (step1Status.textContent.includes('Consultando Persona')) {
                // Si falló en la consulta de Persona, marca el paso 1 como rechazado
                step1Circle.className = 'step-circle state-rejected';
                // Cambia el color del texto del paso 1 a rojo
                step1Status.className = 'step-status-text state-rejected-text';
                // Escribe el error en el paso 1
                step1Status.textContent = `Error: ${error}`;
            } else {
                // Si el paso 1 funcionó, significa que falló en el paso 2 de Instagram
                step2Circle.className = 'step-circle state-rejected';
                // Cambia el color del texto del paso 2 a rojo
                step2Status.className = 'step-status-text state-rejected-text';
                // Escribe el error en el paso 2
                step2Status.textContent = `Error: ${error}`;
            } // Fin de evaluación de fallo
        } finally {
            // Habilita nuevamente el botón de control al terminar toda la secuencia
            runChainBtn.disabled = false;
        } // Fin del bloque try/catch
    }); // Fin del evento clic
}); // Fin de la escucha del DOMContentLoaded
