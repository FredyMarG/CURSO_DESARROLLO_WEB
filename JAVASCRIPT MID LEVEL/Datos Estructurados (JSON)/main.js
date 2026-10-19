// ===================================================================
// DEMOSTRACIÓN DIDÁCTICA EN CONSOLA — DATOS ESTRUCTURADOS (JSON) EN JS
// ===================================================================

// Definimos un objeto literal en memoria con diversos tipos de datos en JavaScript
const usuarioDemo = {
    // Clave numérica o identificador del usuario
    id: 101,
    // Propiedad de tipo cadena de texto
    nombre: "Fredy",
    // Propiedad numérica que almacena la edad
    edad: 26,
    // Propiedad lógica o booleana
    activo: true,
    // Lista o arreglo de cadenas de texto representando habilidades
    habilidades: ["JavaScript", "HTML", "CSS"],
    // Objeto anidado para representar configuración de usuario
    preferencias: {
        // Opción de configuración con valor de texto
        tema: "oscuro",
        // Opción numérica de porcentaje de zoom
        zoom: 100
    }, // Fin del objeto anidado
    // Propiedad con valor nulo intencional
    ultimoAcceso: null,
    // Función que NO formará parte del estándar JSON al serializarse
    saludar: function() { return "¡Hola!"; },
    // Propiedad con valor indefinido que tampoco es admitida en JSON
    datoIndefinido: undefined
}; // Fin del objeto literal de prueba

// Función asíncrona demostrativa que ilustra la serialización y deserialización
const demoJSONConsola = async () => {
    // Encabezado estilizado en consola para guiar al estudiante
    console.info("%c[JSON LAB] Inicializando laboratorio de Datos Estructurados...", "color: #818cf8; font-weight: bold;");

    // Imprime el tipo de dato y la estructura original del objeto en la memoria
    console.log("%c1. Objeto JavaScript original en memoria (typeof: %s):", "color: #38bdf8; font-weight: bold;", typeof usuarioDemo, usuarioDemo);

    // 1. SERIALIZACIÓN: Convertimos el objeto en memoria a texto plano JSON
    const jsonSerializado = JSON.stringify(usuarioDemo, null, 2);
    // Imprime la cadena de texto resultante y demuestra que es de tipo string
    console.log("%c2. Cadena JSON serializada con JSON.stringify() (typeof: %s):", "color: #fbbf24; font-weight: bold;", typeof jsonSerializado);
    // Muestra el texto JSON con indentación legible en la consola
    console.log(jsonSerializado);
    // Aviso de que las funciones y valores undefined fueron descartados automáticamente
    console.warn("[JSON INFO] Observa cómo la función 'saludar' y 'datoIndefinido' fueron eliminados al serializar.");

    // 2. DESERIALIZACIÓN: Reconstruimos el objeto JavaScript a partir de la cadena de texto
    try {
        // Transforma la cadena de texto JSON a un nuevo objeto JavaScript vivo
        const objetoDeserializado = JSON.parse(jsonSerializado);
        // Imprime el objeto reconstruido y su respectivo tipo
        console.log("%c3. Objeto reconstruido con JSON.parse() (typeof: %s):", "color: #34d399; font-weight: bold;", typeof objetoDeserializado, objetoDeserializado);
    } catch (error) {
        // En caso de que la cadena no cumpla con la sintaxis estricta, captura el error
        console.error("%c[SYNTAX ERROR]", "color: #f87171; font-weight: bold;", error.message);
    } // Fin del bloque try/catch
}; // Fin de la función

// Ejecución inicial para mostrar los resultados en la consola de desarrollo (F12)
demoJSONConsola();


// ===================================================================
// LÓGICA DE INTERACCIÓN CON EL DOM — DASHBOARD DE JSON
// ===================================================================

// Registramos el evento DOMContentLoaded para iniciar la lógica al estar el DOM listo
document.addEventListener("DOMContentLoaded", () => {

    // --- 1. CONTROL DE PESTAÑAS (TABS) ---
    // Referencia al botón selector de la pestaña de Métodos
    const tabMethods = document.getElementById("tabMethods");
    // Referencia al botón selector de la pestaña de Validación
    const tabValidation = document.getElementById("tabValidation");
    // Referencia al contenedor del contenido de la pestaña de Métodos
    const methodsTabContent = document.getElementById("methods-tab");
    // Referencia al contenedor del contenido de la pestaña de Validación
    const validationTabContent = document.getElementById("validation-tab");

    // Función auxiliar para alternar la visibilidad de los paneles interactivos
    const switchTab = (activeBtn, activeContent, inactiveBtn, inactiveContent) => {
        // Añade la clase active al botón pulsado para resaltarlo
        activeBtn.classList.add("active");
        // Muestra el contenido del panel activo retirando la clase hidden
        activeContent.classList.remove("hidden");
        // Quita el resaltado del botón inactivo
        inactiveBtn.classList.remove("active");
        // Oculta el panel inactivo agregando la clase hidden
        inactiveContent.classList.add("hidden");
    }; // Fin de la función

    // Escuchador de clic para activar la pestaña de Métodos JSON
    tabMethods.addEventListener("click", () => {
        // Cambia la visualización hacia el panel de Métodos
        switchTab(tabMethods, methodsTabContent, tabValidation, validationTabContent);
    }); // Fin del evento

    // Escuchador de clic para activar la pestaña de Validación y Reglas
    tabValidation.addEventListener("click", () => {
        // Cambia la visualización hacia el panel de Validación
        switchTab(tabValidation, validationTabContent, tabMethods, methodsTabContent);
    }); // Fin del evento


    // --- 2. UTILIDAD: REGISTRO EN LA CONSOLA TERMINAL VIRTUAL ---
    // Referencia al cuerpo de la terminal virtual de depuración de JSON
    const jsonTerminal = document.getElementById("jsonTerminal");

    // Función auxiliar para insertar mensajes estilizados en la terminal virtual
    const logToTerminal = (mensaje, tipo = "log") => {
        // Si el elemento terminal no está disponible, finaliza la ejecución
        if (!jsonTerminal) return;
        // Crea un nuevo elemento div para contener la línea del mensaje
        const linea = document.createElement("div");
        // Asigna las clases de formato según el tipo (info, success, error, warning, log)
        linea.className = `terminal-line ${tipo}`;
        // Formatea el prompt terminal y el texto del log
        linea.innerHTML = `<span class="terminal-prompt">&gt;</span>${mensaje}`;
        // Agrega la línea al cuerpo de la terminal
        jsonTerminal.appendChild(linea);
        // Desplaza el scroll automáticamente hasta el final para ver la última entrada
        jsonTerminal.scrollTop = jsonTerminal.scrollHeight;
    }; // Fin de la función


    // --- 3. SECCIÓN DEMO 1: SIMULADOR DE JSON.STRINGIFY Y JSON.PARSE ---
    // Referencia al selector de la operación JSON a realizar
    const operationSelect = document.getElementById("operationSelect");
    // Referencia al selector del conjunto de datos de prueba
    const dataSelect = document.getElementById("dataSelect");
    // Referencia al selector del tiempo de retardo simulado
    const delaySelect = document.getElementById("delaySelect");
    // Referencia al botón principal para ejecutar la conversión JSON
    const runJsonBtn = document.getElementById("runJsonBtn");
    // Referencia al círculo indicador de estado visual
    const promiseIndicator = document.getElementById("promiseIndicator");
    // Referencia al texto de estado informativo de la conversión
    const promiseStateText = document.getElementById("promiseStateText");
    // Referencia a la barra interna de progreso animada
    const progressBar = document.getElementById("progressBar");
    // Referencia al elemento de salida para presentar el resultado
    const resultText = document.getElementById("result");
    // Referencia a la nota secundaria informativa de tipo y longitud
    const demoNote = document.getElementById("demoNote");

    // Diccionario con las estructuras de datos de prueba predefinidas
    const conjuntosDatos = {
        // Estructura de perfil de usuario estándar
        user: {
            nombre: "Fredy",
            rol: "Desarrollador Web",
            experienciaAnos: 4,
            activo: true,
            tecnologias: ["JS", "CSS", "HTML", "Node.js"]
        },
        // Estructura de carrito de compras con listas y números decimales
        cart: {
            ordenId: 8092,
            cliente: "Ana",
            items: [
                { producto: "Monitor 4K", precio: 299.99, cantidad: 1 },
                { producto: "Teclado Mecánico", precio: 89.50, cantidad: 2 }
            ],
            total: 478.99,
            cuponAplicado: null
        },
        // Estructura con tipos incompatibles en JSON (funciones y undefined)
        incompatible: {
            titulo: "Objeto Especial",
            calcular: function() { return 10 * 10; },
            propiedadIndefinida: undefined,
            fechaCreacion: new Date().toISOString(),
            autorizado: true
        },
        // Cadena con comillas simples que provocará un SyntaxError en JSON.parse
        malformed: "{ 'nombre': 'Luis', 'edad': 28, 'valido': false }"
    }; // Fin del diccionario de datos

    // Variable global para controlar la animación de la barra mediante requestAnimationFrame
    let animationFrameId;

    // Función para animar progresivamente la barra de carga
    const animateProgressBar = (duration, onComplete) => {
        // Variable para registrar la marca de tiempo inicial
        let startTime = null;
        // Bucle ejecutado en cada cuadro de renderizado
        const step = (timestamp) => {
            // Asigna la marca de tiempo de partida en el primer fotograma
            if (!startTime) startTime = timestamp;
            // Calcula los milisegundos transcurridos
            const elapsed = timestamp - startTime;
            // Calcula el porcentaje completado limitándolo a 100%
            const progress = Math.min((elapsed / duration) * 100, 100);
            // Actualiza el ancho de la barra CSS
            progressBar.style.width = `${progress}%`;

            // Si aún no transcurrió el tiempo total estipulado
            if (elapsed < duration) {
                // Solicita el siguiente cuadro de animación
                animationFrameId = requestAnimationFrame(step);
            } else {
                // Al finalizar ejecuta el callback si fue suministrado
                if (onComplete) onComplete();
            } // Fin de la comprobación
        }; // Fin de la función step
        // Cancela animaciones previas para evitar conflictos
        cancelAnimationFrame(animationFrameId);
        // Reinicia la anchura de la barra al 0%
        progressBar.style.width = "0%";
        // Inicia el ciclo solicitando el primer cuadro
        animationFrameId = requestAnimationFrame(step);
    }; // Fin de la función

    // Escuchador de clic en el botón de ejecución de transformación JSON
    runJsonBtn.addEventListener("click", async () => {
        // Deshabilita el botón durante el procesamiento para evitar pulsaciones múltiples
        runJsonBtn.disabled = true;

        // Lee la operación seleccionada
        const operacion = operationSelect.value;
        // Lee el conjunto de datos elegido
        const claveDato = dataSelect.value;
        // Convierte el valor de retardo a número entero
        const retardo = parseInt(delaySelect.value);

        // Obtiene la estructura seleccionada desde el diccionario
        const datoSeleccionado = conjuntosDatos[claveDato];

        // Cambia el indicador visual a estado pendiente (amarillo)
        promiseIndicator.className = "promise-indicator state-pending";
        // Aplica el color amarillo al texto de estado
        promiseStateText.className = "state-pending-text";
        // Informa que se está ejecutando la conversión
        promiseStateText.textContent = `Procesando ${operacion} (Pending)...`;
        // Aplica estilo de espera al texto de resultados
        resultText.className = "pending";
        // Muestra mensaje temporal de procesamiento
        resultText.textContent = "Procesando transformación de datos estructurados...";
        // Actualiza la nota secundaria con el estado en curso
        demoNote.textContent = `Operación: ${operacion} | Procesando conjunto: '${claveDato}'`;

        // Registra en la terminal el inicio de la operación
        logToTerminal(`[TRANSFORMACIÓN] Iniciando ${operacion} sobre conjunto '${claveDato}'...`, "info");

        // Dispara la animación de progreso visual
        animateProgressBar(retardo);

        // Simula la pausa asíncrona de procesamiento
        await new Promise((resolve) => setTimeout(resolve, retardo));

        // Estructura try/catch para ejecutar de forma segura la transformación
        try {
            // Variable que almacenará la salida de la transformación
            let salidaTransformada = "";
            // Variable que almacenará el tipo de dato final resultante
            let tipoFinal = "";
            // Variable que almacenará la cantidad de caracteres generados
            let longitud = 0;

            // Evalúa el tipo de operación solicitada
            if (operacion === "stringify") {
                // Serializa el objeto a cadena de texto compacta en una sola línea
                salidaTransformada = JSON.stringify(datoSeleccionado);
                // Determina el tipo de dato resultante
                tipoFinal = typeof salidaTransformada;
                // Calcula la cantidad de caracteres de la cadena
                longitud = salidaTransformada.length;

                // Registra en la terminal la serialización exitosa
                logToTerminal(`[JSON.stringify] Objeto serializado con éxito (${longitud} caracteres).`, "success");
            } else if (operacion === "pretty") {
                // Serializa el objeto aplicando una sangría de 2 espacios para formato legible
                salidaTransformada = JSON.stringify(datoSeleccionado, null, 2);
                // Determina el tipo de dato resultante
                tipoFinal = typeof salidaTransformada;
                // Calcula la longitud de la cadena formateada
                longitud = salidaTransformada.length;

                // Registra en la terminal la serialización con sangría
                logToTerminal(`[JSON.stringify PRETTY] Formateado a 2 espacios (${longitud} caracteres).`, "success");
            } else if (operacion === "parse") {
                // Prepara una cadena de texto JSON válida a partir del objeto
                const cadenaFuente = (typeof datoSeleccionado === "string") ? datoSeleccionado : JSON.stringify(datoSeleccionado);
                // Deserializa la cadena para instanciar un objeto JavaScript
                const objetoGenerado = JSON.parse(cadenaFuente);
                // Formatea el objeto para su presentación visual clara
                salidaTransformada = JSON.stringify(objetoGenerado, null, 2);
                // Determina el tipo resultante
                tipoFinal = typeof objetoGenerado;
                // Calcula el número de propiedades del objeto generado
                longitud = Object.keys(objetoGenerado).length;

                // Registra en la terminal la deserialización exitosa
                logToTerminal(`[JSON.parse] Texto deserializado a objeto vivo (${longitud} claves).`, "success");
            } else if (operacion === "parse-error") {
                // Intenta parsear intencionalmente una cadena mal formada con comillas simples
                logToTerminal(`[INTENTO PARSE] Intentando parsear JSON con comillas simples...`, "warning");
                // Lanza SyntaxError porque JSON exige obligatoriamente comillas dobles
                JSON.parse("{ 'invalido': true }");
            } // Fin de evaluación de operaciones

            // Marca el indicador visual en estado resuelto exitosamente (verde)
            promiseIndicator.className = "promise-indicator state-fulfilled";
            // Aplica color verde al texto descriptivo
            promiseStateText.className = "state-fulfilled-text";
            // Informa que la transformación culminó con éxito
            promiseStateText.textContent = `Operación completada con éxito (Fulfilled)`;
            // Aplica clase de estilo exitoso al bloque de resultado
            resultText.className = "fulfilled";
            // Inserta la salida formateada en la caja de resultados
            resultText.textContent = salidaTransformada;
            // Actualiza la nota secundaria con el typeof resultante y metadatos
            demoNote.textContent = `typeof resultado: "${tipoFinal}" | Tamaño: ${longitud} unidades | Sintaxis: Válida`;
        } catch (error) {
            // Captura errores de sintaxis al deserializar cadenas no válidas
            promiseIndicator.className = "promise-indicator state-rejected";
            // Aplica color rojo al texto descriptivo
            promiseStateText.className = "state-rejected-text";
            // Informa que ocurrió una excepción durante el procesamiento
            promiseStateText.textContent = `Error de Sintaxis capturado (SyntaxError)`;
            // Aplica clase de estilo de error al bloque de resultados
            resultText.className = "rejected";
            // Muestra el mensaje detallado del error capturado
            resultText.textContent = `Capturado en catch: "${error.message}"\n\nCausa: JSON requiere obligatoriamente comillas dobles ("clave") en todas sus propiedades.`;
            // Actualiza la nota secundaria con la advertencia técnica
            demoNote.textContent = `Tipo: SyntaxError | El texto no cumple las especificaciones estrictas de JSON`;

            // Registra el error en la terminal virtual
            logToTerminal(`[SYNTAX ERROR] ${error.message}`, "error");
        } finally {
            // Habilita nuevamente el botón de control al terminar el flujo
            runJsonBtn.disabled = false;
        } // Fin del bloque try/catch/finally
    }); // Fin del evento runJsonBtn


    // --- 4. SECCIÓN DEMO 2: SIMULADOR DE VALIDACIÓN SINTÁCTICA PASO A PASO ---
    // Referencia al selector del caso de validación
    const validationSelect = document.getElementById("validationSelect");
    // Referencia al botón para ejecutar la validación paso a paso
    const runValidationBtn = document.getElementById("runValidationBtn");
    // Referencia al círculo indicador del paso 1
    const step1Circle = document.getElementById("step1Circle");
    // Referencia al texto de estado del paso 1
    const step1Status = document.getElementById("step1Status");
    // Referencia al círculo indicador del paso 2
    const step2Circle = document.getElementById("step2Circle");
    // Referencia al texto de estado del paso 2
    const step2Status = document.getElementById("step2Status");
    // Referencia al círculo indicador del paso 3
    const step3Circle = document.getElementById("step3Circle");
    // Referencia al texto de estado del paso 3
    const step3Status = document.getElementById("step3Status");
    // Referencia al texto de resultado global de la validación
    const valResult = document.getElementById("valResult");
    // Referencia a la nota secundaria de diagnóstico de validación
    const valDemoNote = document.getElementById("valDemoNote");

    // Función auxiliar para resaltar la fila correspondiente en la tabla comparativa
    const resaltarFilaTabla = (indiceFila) => {
        // Itera sobre las filas de la tabla de matriz de tipos
        for (let i = 0; i <= 3; i++) {
            // Obtiene la fila HTML correspondiente
            const fila = document.getElementById(`db-row-${i}`);
            // Si la fila existe en el DOM
            if (fila) {
                // Si coincide con el índice objetivo, la resalta en color índigo
                if (i === indiceFila) {
                    fila.classList.add("selected-row");
                } else {
                    fila.classList.remove("selected-row");
                } // Fin de condición
            } // Fin de verificación
        } // Fin del bucle
    }; // Fin de la función

    // Escuchador de clic en el botón de validación paso a paso
    runValidationBtn.addEventListener("click", async () => {
        // Deshabilita el botón durante el análisis para evitar colisiones
        runValidationBtn.disabled = true;

        // Lee la opción seleccionada para la prueba de validación
        const caso = validationSelect.value;

        // Reinicia el paso 1 a estado de carga (amarillo)
        step1Circle.className = "step-circle state-pending";
        step1Status.className = "step-status-text state-pending-text";
        step1Status.textContent = "Analizando comillas en claves...";

        // Reinicia el paso 2 a estado inactivo (gris)
        step2Circle.className = "step-circle state-idle";
        step2Status.className = "step-status-text state-idle-text";
        step2Status.textContent = "En espera...";

        // Reinicia el paso 3 a estado inactivo (gris)
        step3Circle.className = "step-circle state-idle";
        step3Status.className = "step-status-text state-idle-text";
        step3Status.textContent = "En espera...";

        // Aplica color de carga a la caja de resultados
        valResult.className = "pending";
        valResult.textContent = "Ejecutando inspección léxica y sintáctica del fragmento...";
        valDemoNote.textContent = "Fase 1: Verificando comillas dobles en las claves";

        // Registra el inicio del diagnóstico en la terminal
        logToTerminal(`[VALIDADOR] Iniciando análisis para el caso: '${caso}'...`, "info");

        // Pausa de 700ms para simular el análisis de la Fase 1
        await new Promise((resolve) => setTimeout(resolve, 700));

        // Evalúa si el caso falla en la Fase 1 (comillas simples o sin comillas)
        if (caso === "single-quotes" || caso === "unquoted-keys") {
            // Marca el paso 1 como rechazado (rojo)
            step1Circle.className = "step-circle state-rejected";
            step1Status.className = "step-status-text state-rejected-text";
            step1Status.textContent = "Fallo: Las claves deben usar comillas dobles obligatoriamente.";

            // Resalta la fila de Strings en la tabla
            resaltarFilaTabla(0);

            // Muestra mensaje de error en la caja de resultados
            valResult.className = "rejected";
            valResult.textContent = `Error Léxico: Se detectaron claves no válidas (${caso === "single-quotes" ? "comillas simples" : "sin comillas"}). En JSON solo se permiten comillas dobles ("clave").`;
            valDemoNote.textContent = "Diagnóstico: Falló en Fase 1 | Rechazado antes de parsear";

            // Registra el error en la terminal virtual
            logToTerminal(`[ERROR LÉXICO] Claves inválidas. Se requieren comillas dobles.`, "error");

            // Habilita el botón y finaliza el flujo
            runValidationBtn.disabled = false;
            return;
        } // Fin de evaluación de la Fase 1

        // Si pasó la Fase 1, marca el paso 1 como exitoso (verde)
        step1Circle.className = "step-circle state-fulfilled";
        step1Status.className = "step-status-text state-fulfilled-text";
        step1Status.textContent = "Completado: Claves delimitadas por comillas dobles.";

        // Inicia la Fase 2: Verificación de comas y tipos
        step2Circle.className = "step-circle state-pending";
        step2Status.className = "step-status-text state-pending-text";
        step2Status.textContent = "Verificando ausencia de comas finales (trailing commas)...";
        valDemoNote.textContent = "Fase 2: Analizando comas excedentes y compatibilidad de tipos";

        // Pausa de 700ms para simular el análisis de la Fase 2
        await new Promise((resolve) => setTimeout(resolve, 700));

        // Evalúa si el caso falla en la Fase 2 por trailing comma
        if (caso === "trailing-comma") {
            // Marca el paso 2 como rechazado (rojo)
            step2Circle.className = "step-circle state-rejected";
            step2Status.className = "step-status-text state-rejected-text";
            step2Status.textContent = "Fallo: Coma final no permitida (Trailing comma).";

            // Resalta la fila de arrays/objetos en la tabla
            resaltarFilaTabla(2);

            // Muestra mensaje de error en la caja de resultados
            valResult.className = "rejected";
            valResult.textContent = "Error Sintáctico: Coma excedente al final del objeto. JSON prohíbe comas después del último elemento.";
            valDemoNote.textContent = "Diagnóstico: Falló en Fase 2 | Coma al final detectada";

            // Registra el error en la terminal virtual
            logToTerminal(`[ERROR SINTÁCTICO] Trailing comma no permitida en JSON.`, "error");

            // Habilita el botón y finaliza el flujo
            runValidationBtn.disabled = false;
            return;
        } // Fin de evaluación de la Fase 2

        // Si pasó la Fase 2, marca el paso 2 como exitoso (verde)
        step2Circle.className = "step-circle state-fulfilled";
        step2Status.className = "step-status-text state-fulfilled-text";
        step2Status.textContent = "Completado: Sin comas finales y tipos correctos.";

        // Inicia la Fase 3: Deserialización con JSON.parse()
        step3Circle.className = "step-circle state-pending";
        step3Status.className = "step-status-text state-pending-text";
        step3Status.textContent = "Ejecutando JSON.parse() en bloque try...catch...";
        valDemoNote.textContent = "Fase 3: Deserializando cadena a objeto de memoria";

        // Pausa de 600ms para la Fase 3
        await new Promise((resolve) => setTimeout(resolve, 600));

        // Marca el paso 3 como exitoso (verde)
        step3Circle.className = "step-circle state-fulfilled";
        step3Status.className = "step-status-text state-fulfilled-text";
        step3Status.textContent = "Completado: Objeto JavaScript instanciado con éxito.";

        // Resalta la fila de tipos válidos
        resaltarFilaTabla(1);

        // Muestra resultado exitoso en la caja de resultados
        valResult.className = "fulfilled";
        valResult.textContent = "¡JSON 100% Válido! La estructura cumple con la especificación RFC 8259 y fue deserializada sin errores.";
        valDemoNote.textContent = "Diagnóstico: Todas las fases aprobadas | Listo para transmisión de red o persistencia";

        // Registra el éxito total en la terminal virtual
        logToTerminal(`[DIAGNÓSTICO EXITOSO] Fragmento JSON validado y parseado correctamente.`, "success");

        // Habilita nuevamente el botón de validación
        runValidationBtn.disabled = false;
    }); // Fin del evento runValidationBtn

    // Resalta por defecto la fila 0 de la tabla comparativa al cargar la aplicación
    resaltarFilaTabla(0);
}); // Fin del escuchador DOMContentLoaded

// ===================================================================
// EJEMPLOS PRÁCTICOS: OBJETO DESERIALIZADO Y OBJETO SERIALIZADO
// ===================================================================

// --- 1. EJEMPLO DE OBJETO DESERIALIZADO (OBJETO NATIVO EN MEMORIA) ---
// Un objeto deserializado es una estructura de datos viva en la memoria de JavaScript (tipo "object")
const objetoDeserializado = {
    // Primera propiedad del objeto nativo con clave y valor tipo cadena
    variable1: "PEDRO",
    // Segunda propiedad del objeto nativo con clave y valor tipo cadena
    variable2: "JORGE"
}; // Fin del objeto nativo deserializado

// Imprime en consola el tipo de dato del objeto en memoria para verificar que es "object"
console.log("1. Tipo de dato del objetoDeserializado:", typeof objetoDeserializado);
// Demuestra el acceso directo a una propiedad del objeto mediante notación de punto
console.log("   Valor de variable1:", objetoDeserializado.variable1);
// Imprime en consola el objeto completo estructurado
console.log("   Contenido del objeto en memoria:", objetoDeserializado);


// --- 2. PROCESO DE SERIALIZACIÓN (DE OBJETO NATIVO A TEXTO JSON) ---
// JSON.stringify() transforma el objeto de memoria en una cadena de texto plana (serialización)
const objetoSerializado = JSON.stringify(objetoDeserializado);

// Imprime en consola el tipo de dato de la variable serializada para demostrar que es "string"
console.log("2. Tipo de dato del objetoSerializado:", typeof objetoSerializado);
// Muestra la cadena de texto resultante con formato estándar JSON (con sus comillas dobles)
console.log("   Cadena JSON serializada:", objetoSerializado);
// Demuestra que al ser una cadena de texto plana ya NO se puede acceder a propiedades con punto
console.log("   Intento de acceso a variable1 en string (undefined):", objetoSerializado.variable1);


// --- 3. EJEMPLO DE OBJETO SERIALIZADO (CADENA JSON PLANA RECIBIDA DE LA RED) ---
// Un objeto serializado es texto plano empaquetado para ser transmitido por HTTP o guardado en disco
const cadenaJSONExterna = '{"curso":"JavaScript","nivel":"Medio","estudiante":"Fredy"}';

// Imprime en consola el tipo de dato de la cadena recibida demostrando que es "string"
console.log("3. Tipo de dato de cadenaJSONExterna recibida:", typeof cadenaJSONExterna);
// Muestra la cadena de texto tal como viaja a través del protocolo HTTP
console.log("   Texto plano recibido:", cadenaJSONExterna);


// --- 4. PROCESO DE DESERIALIZACIÓN (DE TEXTO JSON A OBJETO NATIVO VIVO) ---
// JSON.parse() reconstruye un objeto JavaScript interactivo a partir de la cadena de texto plano
const nuevoObjetoDeserializado = JSON.parse(cadenaJSONExterna);

// Imprime en consola el tipo de dato tras el parseo confirmando que vuelve a ser "object"
console.log("4. Tipo de dato tras deserializar (JSON.parse):", typeof nuevoObjetoDeserializado);
// Demuestra que ahora sí podemos acceder a las propiedades del objeto con notación de punto
console.log("   Propiedad estudiante recuperada:", nuevoObjetoDeserializado.estudiante);
// Accede a la propiedad del curso recuperada
console.log("   Propiedad curso recuperada:", nuevoObjetoDeserializado.curso);
// Muestra en consola el objeto reconstruido completo y listo para ser utilizado en el programa
console.log("   Objeto vivo reconstruido en memoria:", nuevoObjetoDeserializado);