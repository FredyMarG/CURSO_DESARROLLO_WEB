// ===================================================================
// DEMOSTRACIÓN DIDÁCTICA EN CONSOLA — FETCH API Y AXIOS EN JAVASCRIPT
// ===================================================================

// Definimos un conjunto de datos en memoria para simular el servidor remoto
const baseDatosServidor = {
    // Lista de usuarios registrados en el servidor simulado
    usuarios: [
        // Registro 0 inicial con sus datos de perfil
        { id: 1, nombre: "Fredy", especialidad: "Desarrollo Frontend", nivel: "Mid" },
        // Registro 1 inicial con sus datos de perfil
        { id: 2, nombre: "Ana", especialidad: "Arquitectura Cloud", nivel: "Senior" }
    ], // Fin de la lista de usuarios
    // Texto plano simulado para probar el lector response.text()
    terminosTexto: "TÉRMINOS Y CONDICIONES:\n1. El uso de esta API Fetch es libre.\n2. Axios simplifica el código.",
    // Contador autoincremental para nuevos registros
    siguienteId: 3
}; // Fin del objeto de base de datos

// 1. DEMOSTRACIÓN DE FETCH NATIVO EN DOS PASOS
const demoFetchNativo = async () => {
    // Encabezado estilizado en consola para guiar al estudiante
    console.info("%c[FETCH API] 1. Iniciando petición con fetch nativo...", "color: #38bdf8; font-weight: bold;");

    try {
        // Paso 1: fetch devuelve una Promesa con el objeto Response (llegan cabeceras)
        const response = await fetch("https://jsonplaceholder.typicode.com/users/1");

        // Regla clave: Validamos si el estatus HTTP está en el rango exitoso (200 - 299)
        if (!response.ok) {
            // Si el estatus es 404 o 500, lanzamos manualmente un error para ir al catch
            throw new Error(`Fallo HTTP: ${response.status} ${response.statusText}`);
        } // Fin de validación

        // Paso 2: Invocamos al lector adecuado del cuerpo (.json() devuelve otra Promesa)
        const usuario = await response.json();
        // Imprime en consola los datos parseados con éxito
        console.log("%c[FETCH ÉXITO] Datos deserializados con response.json():", "color: #34d399; font-weight: bold;", usuario);
    } catch (error) {
        // Captura fallos de red o la excepción lanzada manualmente si response.ok fue falso
        console.error("%c[FETCH CATCH]", "color: #f87171; font-weight: bold;", error.message);
    } // Fin del bloque try/catch
}; // Fin de la función

// 2. DEMOSTRACIÓN DE AXIOS (LIBRERÍA EXTERNA AUTOMATIZADA)
const demoAxios = async () => {
    // Encabezado informativo en consola
    console.info("%c[AXIOS] 2. Iniciando petición con la biblioteca Axios...", "color: #c084fc; font-weight: bold;");

    try {
        // Si Axios está disponible globalmente desde el CDN
        if (typeof axios !== "undefined") {
            // Axios procesa la petición y entrega el JSON listo directamente en .data
            const respuesta = await axios.get("https://jsonplaceholder.typicode.com/users/1");
            // Imprime en consola demostrando que no se requirió hacer .json()
            console.log("%c[AXIOS ÉXITO] Datos disponibles directamente en response.data:", "color: #c084fc; font-weight: bold;", respuesta.data);
        } else {
            // Mensaje de respaldo si no hay conexión a internet para el CDN
            console.log("[AXIOS SIMULADO] response.data parseado automáticamente sin paso adicional.");
        } // Fin de comprobación
    } catch (error) {
        // En Axios, los errores 404 y 500 caen automáticamente aquí sin verificar response.ok
        console.error("%c[AXIOS CATCH AUTOMÁTICO]", "color: #f87171; font-weight: bold;", error.message);
    } // Fin del bloque try/catch
}; // Fin de la función

// Ejecución de demostración inicial para la consola de DevTools (F12)
demoFetchNativo();
demoAxios();


// ===================================================================
// LÓGICA DE INTERACCIÓN CON EL DOM — DASHBOARD DE FETCH Y AXIOS
// ===================================================================

// Registramos el evento DOMContentLoaded para inicializar la lógica cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {

    // --- 1. CONTROL DEL SISTEMA DE PESTAÑAS (TABS) ---
    // Referencia al botón selector de la pestaña de Fetch API
    const tabFetch = document.getElementById("tabFetch");
    // Referencia al botón selector de la pestaña de Axios
    const tabAxios = document.getElementById("tabAxios");
    // Referencia al panel de contenido de la pestaña de Fetch API
    const fetchTabContent = document.getElementById("fetch-tab");
    // Referencia al panel de contenido de la pestaña de Axios
    const axiosTabContent = document.getElementById("axios-tab");

    // Función auxiliar para alternar visibilidad entre los paneles
    const switchTab = (activeBtn, activeContent, inactiveBtn, inactiveContent) => {
        // Agrega la clase active al botón presionado para iluminarlo
        activeBtn.classList.add("active");
        // Muestra el panel correspondiente quitando la clase hidden
        activeContent.classList.remove("hidden");
        // Apaga el botón inactivo
        inactiveBtn.classList.remove("active");
        // Oculta el panel inactivo agregando la clase hidden
        inactiveContent.classList.add("hidden");
    }; // Fin de la función

    // Escuchador de clic para activar la pestaña de Fetch API
    tabFetch.addEventListener("click", () => {
        // Realiza el intercambio visual hacia la pestaña de Fetch
        switchTab(tabFetch, fetchTabContent, tabAxios, axiosTabContent);
    }); // Fin del evento

    // Escuchador de clic para activar la pestaña de Axios
    tabAxios.addEventListener("click", () => {
        // Realiza el intercambio visual hacia la pestaña de Axios
        switchTab(tabAxios, axiosTabContent, tabFetch, fetchTabContent);
    }); // Fin del evento


    // --- 2. UTILIDAD: REGISTRO EN LA CONSOLA TERMINAL VIRTUAL ---
    // Referencia al cuerpo de la terminal virtual de depuración de red
    const networkTerminal = document.getElementById("networkTerminal");

    // Función auxiliar para insertar mensajes estilizados en la terminal virtual
    const logToTerminal = (mensaje, tipo = "log") => {
        // Si el elemento terminal no está disponible, finaliza
        if (!networkTerminal) return;
        // Crea un nuevo elemento div para contener la línea del mensaje
        const linea = document.createElement("div");
        // Asigna las clases de formato y color según el tipo (info, success, error, warning, log)
        linea.className = `terminal-line ${tipo}`;
        // Formatea el cursor terminal '>' junto al mensaje recibido
        linea.innerHTML = `<span class="terminal-prompt">&gt;</span>${mensaje}`;
        // Agrega la línea al final del cuerpo de la terminal
        networkTerminal.appendChild(linea);
        // Desplaza automáticamente el scroll al fondo para mantener visible la última entrada
        networkTerminal.scrollTop = networkTerminal.scrollHeight;
    }; // Fin de la función


    // --- 3. SECCIÓN DEMO 1: SIMULADOR DE FETCH API Y LECTORES DE CUERPO ---
    // Referencia al selector del lector y endpoint a probar
    const fetchReaderSelect = document.getElementById("fetchReaderSelect");
    // Referencia al selector del tiempo de latencia simulado
    const fetchDelaySelect = document.getElementById("fetchDelaySelect");
    // Referencia al botón principal para ejecutar la llamada con fetch
    const runFetchBtn = document.getElementById("runFetchBtn");
    // Referencia al círculo indicador de estado visual de la petición
    const promiseIndicator = document.getElementById("promiseIndicator");
    // Referencia al texto descriptivo del estado actual de la petición
    const promiseStateText = document.getElementById("promiseStateText");
    // Referencia a la barra interna de progreso animada
    const progressBar = document.getElementById("progressBar");
    // Referencia al elemento de salida para presentar el resultado procesado
    const resultText = document.getElementById("result");
    // Referencia a la nota secundaria informativa de las dos fases
    const demoNote = document.getElementById("demoNote");
    // Referencia al contenedor de vista previa de imagen para blob
    const blobPreviewContainer = document.getElementById("blobPreviewContainer");
    // Referencia a la etiqueta de imagen para previsualizar el Blob
    const blobImagePreview = document.getElementById("blobImagePreview");

    // Variable global para controlar la animación de la barra de progreso
    let animationFrameId;

    // Función para animar progresivamente la barra de carga según la duración
    const animateProgressBar = (duration, onComplete) => {
        // Variable para registrar la marca de tiempo de partida
        let startTime = null;
        // Bucle ejecutado en cada cuadro de renderizado
        const step = (timestamp) => {
            // Asigna la marca de tiempo en el primer fotograma
            if (!startTime) startTime = timestamp;
            // Calcula los milisegundos transcurridos
            const elapsed = timestamp - startTime;
            // Calcula el porcentaje completado limitándolo al 100%
            const progress = Math.min((elapsed / duration) * 100, 100);
            // Aplica el porcentaje al ancho de la barra CSS
            progressBar.style.width = `${progress}%`;

            // Si aún no culminó el tiempo estipulado
            if (elapsed < duration) {
                // Solicita el siguiente fotograma al navegador
                animationFrameId = requestAnimationFrame(step);
            } else {
                // Ejecuta la función de devolución (callback) al finalizar
                if (onComplete) onComplete();
            } // Fin de comprobación
        }; // Fin de la función step
        // Cancela animaciones previas para evitar superposiciones
        cancelAnimationFrame(animationFrameId);
        // Reinicia la barra al 0%
        progressBar.style.width = "0%";
        // Inicia el bucle solicitando el primer cuadro
        animationFrameId = requestAnimationFrame(step);
    }; // Fin de la función

    // Escuchador de clic en el botón de ejecución de Fetch API
    runFetchBtn.addEventListener("click", async () => {
        // Deshabilita el botón mientras se ejecuta la petición
        runFetchBtn.disabled = true;
        // Oculta la vista previa de blob si estaba visible
        blobPreviewContainer.style.display = "none";

        // Lee el tipo de lector y endpoint seleccionado
        const opcionLector = fetchReaderSelect.value;
        // Lee la latencia seleccionada
        const latencia = parseInt(fetchDelaySelect.value);

        // Actualiza el indicador visual a estado pendiente (amarillo)
        promiseIndicator.className = "promise-indicator state-pending";
        promiseStateText.className = "state-pending-text";
        promiseStateText.textContent = `Fase 1: Esperando cabeceras de red (${latencia} ms)...`;

        // Aplica color de carga a la caja de resultados
        resultText.className = "pending";
        resultText.textContent = "Paso 1: Solicitud en tránsito esperando objeto Response...";
        demoNote.textContent = "Fase 1: fetch() en curso | Cabeceras no recibidas aún";

        // Registra en la terminal virtual el inicio de la llamada Fetch
        logToTerminal(`[FETCH] fetch("${opcionLector === 'error404' ? '/api/no-existe' : '/api/recurso'}")`, "info");

        // Dispara la animación de progreso visual
        animateProgressBar(latencia);

        // Simula la espera de red para la llegada de las cabeceras (Fase 1)
        await new Promise((resolve) => setTimeout(resolve, Math.max(latencia * 0.6, 200)));

        // Si la opción seleccionada es error 404
        if (opcionLector === "error404") {
            // Demuestra que Fetch resuelve con response.ok === false y NO entra al catch
            promiseIndicator.className = "promise-indicator state-rejected";
            promiseStateText.className = "state-rejected-text";
            promiseStateText.textContent = "Fase 1 completada con Status 404 (response.ok = false)";

            resultText.className = "rejected";
            resultText.textContent = `¡OJO DE DESARROLLADOR!\nEl servidor respondió con código 404 Not Found.\n\nEn Fetch nativo, ¡ESTO NO VA AL CATCH!\nDebes validar obligatoriamente:\nif (!response.ok) { throw new Error('Error 404'); }`;
            demoNote.textContent = `Status: 404 | response.ok: false | La promesa se resolvió (no fue rechazada)`;

            logToTerminal(`[FETCH 404] response.ok es FALSE. Fetch NO rechaza la promesa en 404.`, "error");
            runFetchBtn.disabled = false;
            return;
        } // Fin de evaluación de 404

        // Fase 1 completada exitosamente: Cabeceras y status 200 recibidos
        promiseStateText.textContent = "Fase 2: Cabeceras recibidas (200 OK). Leyendo el cuerpo...";
        demoNote.textContent = "Fase 1: OK (200) | Fase 2: Ejecutando lector del Body Mixin...";

        // Simula la descarga y lectura del cuerpo (Fase 2)
        await new Promise((resolve) => setTimeout(resolve, Math.max(latencia * 0.4, 200)));

        // Cambia el indicador a resuelto exitoso (verde)
        promiseIndicator.className = "promise-indicator state-fulfilled";
        promiseStateText.className = "state-fulfilled-text";
        promiseStateText.textContent = `Fase 2 completada: Cuerpo leído con .${opcionLector}()`;

        resultText.className = "fulfilled";

        // Procesa la salida según el lector seleccionado
        if (opcionLector === "json") {
            // Simula response.json()
            resultText.textContent = JSON.stringify(baseDatosServidor.usuarios, null, 2);
            demoNote.textContent = `Lector: response.json() | Retorna: Objeto/Array JavaScript nativo`;
            logToTerminal(`[FETCH BODY] response.json() resolvió la colección de usuarios.`, "success");
        } else if (opcionLector === "text") {
            // Simula response.text()
            resultText.textContent = baseDatosServidor.terminosTexto;
            demoNote.textContent = `Lector: response.text() | Retorna: string plano de texto`;
            logToTerminal(`[FETCH BODY] response.text() entregó la cadena de texto plano.`, "success");
        } else if (opcionLector === "blob") {
            // Simula response.blob() y generación de URL con URL.createObjectURL
            resultText.textContent = `Objeto Blob recibido:\n{\n  size: 24580 bytes,\n  type: "image/svg+xml"\n}\nURL generada: blob:http://localhost/8a92-f01e`;
            demoNote.textContent = `Lector: response.blob() | Objeto binario convertido con URL.createObjectURL()`;

            // Creamos un gráfico SVG dinámico en memoria simulando la imagen descargada
            const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#0284c7"/><text x="50" y="55" font-size="28" text-anchor="middle" fill="#ffffff" font-family="sans-serif">⚡</text></svg>`;
            const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
            const blobUrl = URL.createObjectURL(svgBlob);

            // Muestra la imagen en la interfaz
            blobImagePreview.src = blobUrl;
            blobPreviewContainer.style.display = "block";

            logToTerminal(`[FETCH BODY] response.blob() procesó el archivo binario multimedia.`, "success");
        } // Fin de evaluación de lectores

        // Habilita nuevamente el botón
        runFetchBtn.disabled = false;
    }); // Fin del evento runFetchBtn


    // --- 4. SECCIÓN DEMO 2: SIMULADOR CARA A CARA (FETCH VS AXIOS) ---
    // Referencia al selector del escenario comparativo
    const compareScenarioSelect = document.getElementById("compareScenarioSelect");
    // Referencia al botón para probar con Fetch
    const runCompareFetchBtn = document.getElementById("runCompareFetchBtn");
    // Referencia al botón para probar con Axios
    const runCompareAxiosBtn = document.getElementById("runCompareAxiosBtn");
    // Referencia a la caja de salida comparativa
    const compareResult = document.getElementById("compareResult");
    // Referencia a la nota de diagnóstico de comparación
    const compareDemoNote = document.getElementById("compareDemoNote");

    // Escuchador de clic para probar con Fetch Nativo
    runCompareFetchBtn.addEventListener("click", async () => {
        // Deshabilita los botones durante la prueba
        runCompareFetchBtn.disabled = true;
        runCompareAxiosBtn.disabled = true;

        const escenario = compareScenarioSelect.value;
        compareResult.className = "pending";
        compareResult.textContent = "Ejecutando con Fetch Nativo...";

        logToTerminal(`[PRUEBA FETCH] Iniciando escenario: ${escenario}`, "info");

        // Simula la latencia de red
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (escenario === "get-success") {
            // Caso de éxito GET con Fetch
            compareResult.className = "fulfilled";
            compareResult.textContent = `[FETCH - 200 OK]\n1. const res = await fetch('/api/usuarios');\n2. if (!res.ok) throw ...;\n3. const data = await res.json(); // Segundo await obligatorio!\n\nResultado: ${JSON.stringify(baseDatosServidor.usuarios[0])}`;
            compareDemoNote.textContent = `Fetch: Requiere 2 pasos (llegada de Response y llamada await res.json())`;
            logToTerminal(`[FETCH OK] Requiere llamar a .json() para acceder a los datos.`, "success");
        } else if (escenario === "get-404") {
            // Caso 404 con Fetch
            compareResult.className = "rejected";
            compareResult.textContent = `[FETCH - 404 NOT FOUND]\nFetch NO lanza error automáticamente en 404!\nEntra al bloque try como si nada hubiera fallado.\nDebes escribir manualmente:\nif (!res.ok) {\n    throw new Error('Recurso no encontrado');\n}`;
            compareDemoNote.textContent = `Fetch: No rechaza la promesa en códigos 4xx/5xx`;
            logToTerminal(`[FETCH ADVERTENCIA] Código 404 recibido pero no cayó al catch directo.`, "warning");
        } else {
            // Caso POST con Fetch
            compareResult.className = "fulfilled";
            compareResult.textContent = `[FETCH - POST]\nRequiere configurar headers y serializar a mano:\nawait fetch('/api/usuarios', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify(nuevoUsuario)\n});`;
            compareDemoNote.textContent = `Fetch: Obliga a usar JSON.stringify() y configurar Content-Type`;
            logToTerminal(`[FETCH POST] Objeto serializado con JSON.stringify manualmente.`, "log");
        } // Fin de evaluación de escenarios

        // Habilita los botones
        runCompareFetchBtn.disabled = false;
        runCompareAxiosBtn.disabled = false;
    }); // Fin del evento runCompareFetchBtn

    // Escuchador de clic para probar con Axios
    runCompareAxiosBtn.addEventListener("click", async () => {
        // Deshabilita los botones durante la prueba
        runCompareFetchBtn.disabled = true;
        runCompareAxiosBtn.disabled = true;

        const escenario = compareScenarioSelect.value;
        compareResult.className = "pending";
        compareResult.textContent = "Ejecutando con biblioteca Axios...";

        logToTerminal(`[PRUEBA AXIOS] Iniciando escenario: ${escenario}`, "info");

        // Simula la latencia de red
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (escenario === "get-success") {
            // Caso de éxito GET con Axios
            compareResult.className = "fulfilled";
            compareResult.textContent = `[AXIOS - 200 OK]\n1. const res = await axios.get('/api/usuarios');\n// ¡Listo en un solo paso! Los datos ya vienen parseados:\nconsole.log(res.data);\n\nResultado: ${JSON.stringify(baseDatosServidor.usuarios[0])}`;
            compareDemoNote.textContent = `Axios: Transforma el JSON automáticamente directo en res.data`;
            logToTerminal(`[AXIOS OK] Datos disponibles inmediatamente en res.data.`, "success");
        } else if (escenario === "get-404") {
            // Caso 404 con Axios
            compareResult.className = "rejected";
            compareResult.textContent = `[AXIOS - 404 NOT FOUND]\n¡Axios sí arroja una excepción automática al catch!\n\ntry {\n    await axios.get('/api/no-existe');\n} catch (error) {\n    // Cae aquí automáticamente sin condicionales extras!\n    console.log(error.response.status); // 404\n}`;
            compareDemoNote.textContent = `Axios: Arroja automáticamente al catch cualquier estatus fuera de 2xx`;
            logToTerminal(`[AXIOS CATCH] Error 404 capturado de forma automática en el catch.`, "error");
        } else {
            // Caso POST con Axios
            compareResult.className = "fulfilled";
            compareResult.textContent = `[AXIOS - POST]\nPasa el objeto JavaScript directo, ¡Axios lo serializa por ti!:\n\nawait axios.post('/api/usuarios', nuevoUsuario);\n// No necesitas JSON.stringify ni cabeceras manuales!`;
            compareDemoNote.textContent = `Axios: Serializa a JSON y configura Content-Type automáticamente`;
            logToTerminal(`[AXIOS POST] Objeto JS enviado directamente sin JSON.stringify manual.`, "success");
        } // Fin de evaluación de escenarios

        // Habilita los botones
        runCompareFetchBtn.disabled = false;
        runCompareAxiosBtn.disabled = false;
    }); // Fin del evento runCompareAxiosBtn

}); // Fin del listener DOMContentLoaded

fetch("https://reqres.in/api/users",{
    method: "POST",
    body: {"nombre": "Fredy", "apellido" : "Martinez"},
    headers: {"Content-type": "application/json"}
})
    .then(res=>res.json())
    .then(res=>console.log(res))

const imagen = document.querySelector(".imagen")

fetch("diferencia.jpg")
    .then(res =>res.blob())
    .then(img =>imagen.src = URL.createObjectURL(img))