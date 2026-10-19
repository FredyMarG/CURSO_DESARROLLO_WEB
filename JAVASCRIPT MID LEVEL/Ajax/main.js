// ===================================================================
// DEMOSTRACIÓN DIDÁCTICA EN CONSOLA — AJAX Y XMLHTTPREQUEST EN JAVASCRIPT
// ===================================================================

// Definimos un conjunto de datos en memoria para simular el servidor remoto
const baseDatosAjax = {
    // Lista de usuarios registrados en el servidor ficticio
    usuarios: [
        // Registro 0 inicial con sus datos de perfil
        { id: 0, nombre: "Fredy", correo: "fredy@correo.com", rol: "Desarrollador Web" },
        // Registro 1 inicial con sus datos de perfil
        { id: 1, nombre: "Ana", correo: "ana@correo.com", rol: "Arquitecta Cloud" }
    ], // Fin de la lista de usuarios
    // Contador autoincremental para nuevos IDs asignados
    siguienteId: 2
}; // Fin del objeto de base de datos

// Función demostrativa que emula una petición AJAX con XMLHttpRequest clásico
const demoAjaxClasico = (url, metodo = "GET") => {
    // Encabezado estilizado en consola para guiar al estudiante
    console.info(`%c[AJAX INICIO] Preparando XMLHttpRequest a: ${url}...`, "color: #818cf8; font-weight: bold;");

    // 1. Instanciamos el objeto XMLHttpRequest tradicional
    const xhr = new XMLHttpRequest();
    // Imprime el estado inicial (readyState 0: UNSENT)
    console.log("[XHR readyState 0: UNSENT] Objeto instanciado en memoria.");

    // 2. Configuramos la petición con método y ruta destino (readyState 1: OPENED)
    xhr.open(metodo, url, true);
    // Imprime el estado tras abrir la conexión
    console.log("[XHR readyState 1: OPENED] Conexión configurada con método " + metodo);

    // 3. Registramos el escuchador del evento readystatechange (Forma Clásica)
    xhr.onreadystatechange = function() {
        // Imprime en consola cada transición de estado por la que transita el objeto
        console.log(`[XHR readyState ${xhr.readyState}] Transición de estado detectada.`);

        // Evaluamos si el estado alcanzó la fase final 4 (DONE)
        if (xhr.readyState === 4) {
            // Evaluamos si el código de estado HTTP es 200 (OK)
            if (xhr.status === 200) {
                // Mensaje en verde indicando que los datos llegaron con éxito
                console.log("%c[AJAX 200 OK] Respuesta recibida con éxito:", "color: #34d399; font-weight: bold;");
                // Muestra la propiedad responseText simulada
                console.log(xhr.responseText || baseDatosAjax.usuarios);
            } else {
                // Mensaje en rojo en caso de que el código no sea exitoso
                console.error(`[AJAX ERROR] Falló la petición con código de estado: ${xhr.status}`);
            } // Fin de validación de status
        } // Fin de evaluación de readyState
    }; // Fin de onreadystatechange

    // 4. Simulamos el disparo físico del envío de la petición por la red
    console.log("[XHR readyState 2: HEADERS_RECEIVED] Disparando xhr.send()...");
}; // Fin de la función

// Ejecución inicial de demostración para estudiantes que abran la consola (F12)
demoAjaxClasico("https://api.ejemplo.com/usuarios", "GET");


// ===================================================================
// LÓGICA DE INTERACCIÓN CON EL DOM — DASHBOARD DE AJAX Y XMLHTTPREQUEST
// ===================================================================

// Registramos el evento DOMContentLoaded para inicializar la lógica cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {

    // --- 1. CONTROL DEL SISTEMA DE PESTAÑAS (TABS) ---
    // Referencia al botón selector de la pestaña de readyState
    const tabReadyState = document.getElementById("tabReadyState");
    // Referencia al botón selector de la pestaña de FormData
    const tabFormData = document.getElementById("tabFormData");
    // Referencia al panel de contenido de la pestaña de readyState
    const readyStateTabContent = document.getElementById("readystate-tab");
    // Referencia al panel de contenido de la pestaña de FormData
    const formDataTabContent = document.getElementById("formdata-tab");

    // Función auxiliar para alternar visibilidad entre los paneles
    const switchTab = (activeBtn, activeContent, inactiveBtn, inactiveContent) => {
        // Agrega la clase active al botón presionado para iluminarlo
        activeBtn.classList.add("active");
        // Muestra el panel correspondiente quitando la clase hidden
        activeContent.classList.remove("hidden");
        // Apaga el botón que quedó inactivo
        inactiveBtn.classList.remove("active");
        // Oculta el panel inactivo agregando la clase hidden
        inactiveContent.classList.add("hidden");
    }; // Fin de la función

    // Escuchador de clic para activar la pestaña de readyState
    tabReadyState.addEventListener("click", () => {
        // Realiza el intercambio visual hacia la pestaña de readyState
        switchTab(tabReadyState, readyStateTabContent, tabFormData, formDataTabContent);
    }); // Fin del evento

    // Escuchador de clic para activar la pestaña de FormData
    tabFormData.addEventListener("click", () => {
        // Realiza el intercambio visual hacia la pestaña de FormData
        switchTab(tabFormData, formDataTabContent, tabReadyState, readyStateTabContent);
    }); // Fin del evento


    // --- 2. UTILIDAD: REGISTRO EN LA CONSOLA TERMINAL VIRTUAL DE RED ---
    // Referencia al cuerpo de la terminal virtual de depuración de AJAX
    const ajaxTerminal = document.getElementById("ajaxTerminal");

    // Función auxiliar para insertar mensajes estilizados en la terminal virtual
    const logToTerminal = (mensaje, tipo = "log") => {
        // Si el elemento terminal no está disponible, finaliza
        if (!ajaxTerminal) return;
        // Crea un nuevo elemento div para contener la línea del mensaje
        const linea = document.createElement("div");
        // Asigna las clases de formato y color según el tipo (info, success, error, warning, log)
        linea.className = `terminal-line ${tipo}`;
        // Formatea el cursor terminal '>' junto al mensaje recibido
        linea.innerHTML = `<span class="terminal-prompt">&gt;</span>${mensaje}`;
        // Agrega la línea al final del cuerpo de la terminal
        ajaxTerminal.appendChild(linea);
        // Desplaza automáticamente el scroll al fondo para mantener visible la última entrada
        ajaxTerminal.scrollTop = ajaxTerminal.scrollHeight;
    }; // Fin de la función


    // --- 3. SECCIÓN DEMO 1: SIMULADOR DE READYSTATE Y EVENTOS XHR ---
    // Referencia al selector del endpoint o caso de prueba AJAX
    const ajaxEndpointSelect = document.getElementById("ajaxEndpointSelect");
    // Referencia al selector de técnica de captura (onload vs onreadystatechange)
    const eventSelect = document.getElementById("eventSelect");
    // Referencia al selector del tiempo de latencia simulado
    const ajaxDelaySelect = document.getElementById("ajaxDelaySelect");
    // Referencia al botón principal para enviar la petición AJAX
    const sendAjaxBtn = document.getElementById("sendAjaxBtn");
    // Referencia al círculo indicador de estado visual de la petición
    const promiseIndicator = document.getElementById("promiseIndicator");
    // Referencia al texto descriptivo del estado actual de la petición
    const promiseStateText = document.getElementById("promiseStateText");
    // Referencia a la barra interna de progreso animada
    const progressBar = document.getElementById("progressBar");
    // Referencia al contenedor de resultados de texto de la petición
    const resultText = document.getElementById("result");
    // Referencia a la nota secundaria informativa del ciclo XHR
    const demoNote = document.getElementById("demoNote");

    // Referencias a los elementos del timeline de readyState
    const step1Circle = document.getElementById("step1Circle");
    const step1Status = document.getElementById("step1Status");
    const step2Circle = document.getElementById("step2Circle");
    const step2Status = document.getElementById("step2Status");
    const step3Circle = document.getElementById("step3Circle");
    const step3Status = document.getElementById("step3Status");

    // Variable global para controlar la animación de la barra de progreso
    let animationFrameId;

    // Función para animar progresivamente la barra de carga según la duración
    const animateProgressBar = (duration, onComplete) => {
        // Variable para registrar la marca de tiempo de partida
        let startTime = null;
        // Bucle ejecutado en cada cuadro de animación
        const step = (timestamp) => {
            // Asigna la marca de tiempo en el primer fotograma
            if (!startTime) startTime = timestamp;
            // Calcula los milisegundos transcurridos
            const elapsed = timestamp - startTime;
            // Calcula el porcentaje lineal limitándolo al 100%
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

    // Escuchador de clic en el botón de envío de petición AJAX
    sendAjaxBtn.addEventListener("click", async () => {
        // Deshabilita el botón mientras la petición está en curso
        sendAjaxBtn.disabled = true;

        // Lee los valores configurados en los selectores
        const caso = ajaxEndpointSelect.value;
        const tecnicaEvento = eventSelect.value;
        const latencia = parseInt(ajaxDelaySelect.value);

        // Reinicia visualmente el estado del paso 1 (OPENED)
        step1Circle.className = "step-circle state-pending";
        step1Status.className = "step-status-text state-pending-text";
        step1Status.textContent = "Ejecutando xhr.open()...";

        // Reinicia el paso 2 a reposo
        step2Circle.className = "step-circle state-idle";
        step2Status.className = "step-status-text state-idle-text";
        step2Status.textContent = "En espera de envío...";

        // Reinicia el paso 3 a reposo
        step3Circle.className = "step-circle state-idle";
        step3Status.className = "step-status-text state-idle-text";
        step3Status.textContent = "En espera de culminación...";

        // Actualiza el indicador global a estado pendiente (amarillo)
        promiseIndicator.className = "promise-indicator state-pending";
        promiseStateText.className = "state-pending-text";
        promiseStateText.textContent = `Procesando petición AJAX (${tecnicaEvento})...`;

        // Aplica color de carga a la caja de resultados
        resultText.className = "pending";
        resultText.textContent = `Mensajero enviado a la red (latencia: ${latencia} ms)...`;
        demoNote.textContent = `Evento activo: ${tecnicaEvento} | readyState: 1 (OPENED)`;

        // Registra en la terminal el inicio de la llamada
        logToTerminal(`[XHR INICIALIZADO] const xhr = new XMLHttpRequest();`, "log");
        logToTerminal(`[XHR OPEN] xhr.open("${caso.startsWith("post") ? "POST" : "GET"}", "/api/recurso", true);`, "info");

        // Dispara la animación de progreso visual
        animateProgressBar(latencia);

        // Fase 1: Pausa de 400ms para simular la fase OPENED
        await new Promise((resolve) => setTimeout(resolve, 400));

        // Culmina el paso 1 exitosamente
        step1Circle.className = "step-circle state-fulfilled";
        step1Status.className = "step-status-text state-fulfilled-text";
        step1Status.textContent = "Conexión abierta: readyState 1 (OPENED)";

        // Fase 2: Inicia envío y descarga (HEADERS_RECEIVED & LOADING)
        step2Circle.className = "step-circle state-pending";
        step2Status.className = "step-status-text state-pending-text";
        step2Status.textContent = "Transmitiendo datos: xhr.send()...";
        demoNote.textContent = `Evento: ${tecnicaEvento} | readyState: 2 (HEADERS_RECEIVED) ➡️ 3 (LOADING)`;

        // Registra el envío en la terminal
        logToTerminal(`[XHR SEND] xhr.send() — Solicitud física transmitida.`, "warning");

        // Pausa simulando la descarga de los paquetes de datos
        const tiempoDescarga = Math.max(latencia - 400, 300);
        await new Promise((resolve) => setTimeout(resolve, tiempoDescarga));

        // Culmina el paso 2 exitosamente
        step2Circle.className = "step-circle state-fulfilled";
        step2Status.className = "step-status-text state-fulfilled-text";
        step2Status.textContent = "Cabeceras recibidas y cuerpo descargado (readyState 3)";

        // Fase 3: Operación completada (DONE) y validación de status
        step3Circle.className = "step-circle state-pending";
        step3Status.className = "step-status-text state-pending-text";
        step3Status.textContent = "Comprobando xhr.status en estado 4 (DONE)...";

        // Pausa breve antes de disparar el evento final
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Evaluamos el caso seleccionado para emitir la respuesta correspondiente
        if (caso === "get-error") {
            // Caso de error 404
            step3Circle.className = "step-circle state-rejected";
            step3Status.className = "step-status-text state-rejected-text";
            step3Status.textContent = "Error: readyState 4 (DONE) con status 404 Not Found";

            promiseIndicator.className = "promise-indicator state-rejected";
            promiseStateText.className = "state-rejected-text";
            promiseStateText.textContent = `Petición fallida: Status 404 Not Found`;

            resultText.className = "rejected";
            resultText.textContent = `Error 404: El recurso solicitado no existe en el servidor.\n\nCapturado mediante: ${tecnicaEvento === "onload" ? "xhr.onload (evaluando xhr.status !== 200)" : "xhr.onreadystatechange (readyState 4 && status !== 200)"}`;
            demoNote.textContent = `readyState: 4 (DONE) | Status: 404 | Captura controlada`;

            logToTerminal(`[XHR STATUS 404] Not Found: Recurso no encontrado.`, "error");
        } else if (caso === "post-json") {
            // Caso de creación exitosa con código 201
            step3Circle.className = "step-circle state-fulfilled";
            step3Status.className = "step-status-text state-fulfilled-text";
            step3Status.textContent = "Completado: readyState 4 (DONE) con status 201 Created";

            promiseIndicator.className = "promise-indicator state-fulfilled";
            promiseStateText.className = "state-fulfilled-text";
            promiseStateText.textContent = `Respuesta recibida: Status 201 Created`;

            const nuevoUsuarioPost = {
                mensaje: "Usuario creado exitosamente mediante POST",
                idGenerado: baseDatosAjax.siguienteId++,
                datosEnviados: { nombre: "Carlos Slim", correo: "carlos@correo.com" },
                cabeceraUsada: "Content-Type: application/json;charset=UTF-8"
            };

            resultText.className = "fulfilled";
            resultText.textContent = JSON.stringify(nuevoUsuarioPost, null, 2);
            demoNote.textContent = `readyState: 4 (DONE) | Status: 201 Created | Técnica: ${tecnicaEvento}`;

            logToTerminal(`[XHR STATUS 201] Created: Recurso registrado en el servidor.`, "success");
        } else if (caso === "get-user-1") {
            // Caso de detalle de usuario individual (200 OK)
            step3Circle.className = "step-circle state-fulfilled";
            step3Status.className = "step-status-text state-fulfilled-text";
            step3Status.textContent = "Completado: readyState 4 (DONE) con status 200 OK";

            promiseIndicator.className = "promise-indicator state-fulfilled";
            promiseStateText.className = "state-fulfilled-text";
            promiseStateText.textContent = `Respuesta recibida: Status 200 OK`;

            resultText.className = "fulfilled";
            resultText.textContent = JSON.stringify(baseDatosAjax.usuarios[1], null, 2);
            demoNote.textContent = `readyState: 4 (DONE) | Status: 200 OK | Técnica: ${tecnicaEvento}`;

            logToTerminal(`[XHR STATUS 200] OK: Detalle de usuario 1 recibido.`, "success");
        } else {
            // Caso por defecto: Lista completa de usuarios (200 OK)
            step3Circle.className = "step-circle state-fulfilled";
            step3Status.className = "step-status-text state-fulfilled-text";
            step3Status.textContent = "Completado: readyState 4 (DONE) con status 200 OK";

            promiseIndicator.className = "promise-indicator state-fulfilled";
            promiseStateText.className = "state-fulfilled-text";
            promiseStateText.textContent = `Respuesta recibida: Status 200 OK`;

            resultText.className = "fulfilled";
            resultText.textContent = JSON.stringify(baseDatosAjax.usuarios, null, 2);
            demoNote.textContent = `readyState: 4 (DONE) | Status: 200 OK | Técnica: ${tecnicaEvento}`;

            logToTerminal(`[XHR STATUS 200] OK: Colección de usuarios recuperada con éxito.`, "success");
        } // Fin de evaluación de casos

        // Habilita nuevamente el botón de control al culminar la prueba
        sendAjaxBtn.disabled = false;
    }); // Fin del evento sendAjaxBtn


    // --- 4. SECCIÓN DEMO 2: SIMULADOR DE FORMDATA Y ACTUALIZACIÓN EN VIVO DEL DOM ---
    // Referencia al campo de nombre del formulario
    const inputNombre = document.getElementById("inputNombre");
    // Referencia al campo de correo del formulario
    const inputCorreo = document.getElementById("inputCorreo");
    // Referencia al selector de rol o especialidad
    const inputRol = document.getElementById("inputRol");
    // Referencia al botón para emitir el formulario con FormData
    const sendFormDataBtn = document.getElementById("sendFormDataBtn");
    // Referencia al cuerpo de la tabla del servidor en tiempo real
    const ajaxDbTableBody = document.getElementById("ajaxDbTableBody");
    // Referencia al resultado del envío del formulario
    const formResult = document.getElementById("formResult");
    // Referencia a la nota de diagnóstico de FormData
    const formDemoNote = document.getElementById("formDemoNote");

    // Escuchador de clic en el botón de envío de formulario con FormData
    sendFormDataBtn.addEventListener("click", async () => {
        // Valida que los campos no estén vacíos
        const nombreValor = inputNombre.value.trim();
        const correoValor = inputCorreo.value.trim();
        const rolValor = inputRol.value;

        if (!nombreValor || !correoValor) {
            alert("Por favor completa el nombre y el correo antes de enviar.");
            return;
        } // Fin de validación

        // Deshabilita el botón mientras se procesa la llamada AJAX
        sendFormDataBtn.disabled = true;

        // Aplica color de carga al resultado
        formResult.className = "pending";
        formResult.textContent = "Empaquetando campos en objeto FormData y transmitiendo por POST...";
        formDemoNote.textContent = "Enviando FormData: El navegador calcula el boundary de multipart/form-data";

        // Registra en la terminal la instanciación de FormData
        logToTerminal(`[FORMDATA] const formData = new FormData(formulario);`, "log");
        logToTerminal(`[FORMDATA APPEND] nombre: "${nombreValor}", correo: "${correoValor}", rol: "${rolValor}"`, "info");
        logToTerminal(`[XHR POST] xhr.open("POST", "/api/usuarios", true); xhr.send(formData);`, "warning");

        // Simula la latencia de procesamiento de red (900 ms)
        await new Promise((resolve) => setTimeout(resolve, 900));

        // Creamos el nuevo registro en la base de datos en memoria
        const nuevoId = baseDatosAjax.siguienteId++;
        const nuevoUsuario = {
            id: nuevoId,
            nombre: nombreValor,
            correo: correoValor,
            rol: rolValor
        };
        // Agregamos el nuevo registro al array de usuarios del servidor
        baseDatosAjax.usuarios.push(nuevoUsuario);

        // Creamos una nueva fila en el DOM para demostrar que AJAX actualiza la UI sin recargar
        const nuevaFila = document.createElement("tr");
        nuevaFila.id = `ajax-row-${nuevoId}`;
        nuevaFila.className = "selected-row";
        nuevaFila.innerHTML = `
            <td>${nuevoId}</td>
            <td>${nombreValor}</td>
            <td>${correoValor}</td>
            <td>${rolValor}</td>
        `;

        // Agrega la fila a la tabla visible en pantalla
        ajaxDbTableBody.appendChild(nuevaFila);

        // Aplica estilo verde de éxito al resultado
        formResult.className = "fulfilled";
        formResult.textContent = `¡Registro exitoso mediante AJAX y FormData! Usuario ID ${nuevoId} incorporado a la tabla sin recargar la página.`;
        formDemoNote.textContent = `Status: 201 Created | No se recargó la página | Content-Type gestionado automáticamente`;

        // Registra el éxito total en la terminal virtual
        logToTerminal(`[FORMDATA ÉXITO] 201 Created: Usuario ID ${nuevoId} insertado dinámicamente en el DOM.`, "success");

        // Limpia los campos del formulario para el siguiente registro
        inputNombre.value = "";
        inputCorreo.value = "";

        // Habilita nuevamente el botón
        sendFormDataBtn.disabled = false;
    }); // Fin del evento sendFormDataBtn

}); // Fin del listener DOMContentLoaded
