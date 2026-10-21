// ===================================================================
// ARCHIVO: main.js — LABORATORIO INTERACTIVO DE LA LIBRERIA AXIOS
// JavaScript Mid Level — Curso de Desarrollo Web
// Tematica: Cliente HTTP basado en Promesas, Metodos Shorthand y Errores
// ===================================================================

// -------------------------------------------------------------------
// CONFIGURACION GLOBAL DE LA API REST PUBLICA DE PRUEBAS
// -------------------------------------------------------------------

// Declaramos la URL base oficial de JSONPlaceholder para las peticiones de prueba
const API_BASE = 'https://jsonplaceholder.typicode.com'; // Servidor REST publico y gratuito para simulaciones de desarrollo

// -------------------------------------------------------------------
// DEMOSTRACIONES DIDACTICAS EN CONSOLA (Se ejecutan al cargar el archivo)
// Muestran el comportamiento real de Axios en la consola del desarrollador (F12)
// -------------------------------------------------------------------

// --- Demostracion 1: axios.get() — Lectura directa con parseo automatico de JSON ---
// Declaramos una funcion asincrona para demostrar como axios.get entrega datos listos
const demoAxiosGet = async () => {
    // Imprimimos un encabezado con estilo violeta oficial de Axios en la consola del navegador
    console.log('%c[AXIOS GET] Demostracion 1: axios.get() con parseo automatico', 'background:#5a29e4; color:#ffffff; font-weight:bold; padding:4px 8px; border-radius:4px;');
    try {
        // Ejecutamos axios.get pasando la ruta del recurso; Axios resuelve una promesa enriquecida
        const respuesta = await axios.get(`${API_BASE}/posts/1`); // Peticion HTTP GET al post con ID 1
        // Imprimimos los datos recibidos directamente en response.data sin llamar a .json()
        console.log('%c[AXIOS GET] response.data (Objeto JS ya parseado):', 'color:#34d399; font-weight:bold;', respuesta.data);
        // Imprimimos el codigo numerico de estado devuelto por el servidor
        console.log('%c[AXIOS GET] response.status:', 'color:#38bdf8;', respuesta.status); // Debe imprimir 200
        // Imprimimos el texto descriptivo del codigo de estado
        console.log('%c[AXIOS GET] response.statusText:', 'color:#a78bfa;', respuesta.statusText); // Debe imprimir "OK"
    } catch (error) {
        // Capturamos cualquier excepcion ocurrida durante la peticion
        console.error('[AXIOS GET] Error capturado:', error.message); // Muestra el mensaje de error
    }
}; // Fin de la funcion demoAxiosGet

// --- Demostracion 2: axios.post() — Envio de objetos con serializacion automatica ---
// Declaramos una funcion asincrona para demostrar como axios.post serializa objetos sin JSON.stringify
const demoAxiosPost = async () => {
    // Imprimimos un encabezado con estilo indigo en la consola
    console.log('%c[AXIOS POST] Demostracion 2: axios.post() con serializacion automatica', 'background:#4338ca; color:#ffffff; font-weight:bold; padding:4px 8px; border-radius:4px;');
    // Definimos un objeto literal puro de JavaScript que queremos enviar al servidor
    const nuevoArticulo = { // Objeto con las propiedades del nuevo articulo a crear
        title: 'Dominando la Libreria Axios en JS', // Titulo de la publicacion
        body: 'Axios serializa este objeto a JSON y envia Content-Type automaticamente', // Contenido descriptivo
        userId: 1 // Identificador del autor
    }; // Fin de la definicion del objeto
    try {
        // Invocamos axios.post pasando la URL y el objeto directamente como segundo argumento
        const respuesta = await axios.post(`${API_BASE}/posts`, nuevoArticulo); // Axios serializa a JSON en segundo plano
        // Imprimimos el recurso creado con el ID asignado por el servidor
        console.log('%c[AXIOS POST] Recurso creado exitosamente (HTTP 201):', 'color:#34d399; font-weight:bold;', respuesta.data);
        // Imprimimos el codigo de estado devuelto
        console.log('%c[AXIOS POST] response.status:', 'color:#38bdf8;', respuesta.status); // Debe imprimir 201 (Created)
    } catch (error) {
        // En caso de fallo, reportamos el error
        console.error('[AXIOS POST] Error al crear recurso:', error.message); // Mensaje de error
    }
}; // Fin de la funcion demoAxiosPost

// --- Demostracion 3: axios.put() — Actualizacion completa de recursos ---
// Declaramos una funcion asincrona para demostrar la actualizacion con el verbo PUT
const demoAxiosPut = async () => {
    // Imprimimos un encabezado con estilo ambar en la consola
    console.log('%c[AXIOS PUT] Demostracion 3: axios.put() para actualizar recurso', 'background:#d97706; color:#ffffff; font-weight:bold; padding:4px 8px; border-radius:4px;');
    // Definimos el objeto con los datos modificados del recurso
    const articuloModificado = { // Objeto con nuevos valores
        id: 1, // ID del recurso a modificar
        title: 'Articulo Actualizado con Axios PUT', // Nuevo titulo
        body: 'El contenido ha sido renovado mediante el metodo shorthand axios.put()', // Nuevo cuerpo
        userId: 1 // ID del usuario
    }; // Fin del objeto modificado
    try {
        // Invocamos axios.put pasando el endpoint del recurso y los nuevos datos
        const respuesta = await axios.put(`${API_BASE}/posts/1`, articuloModificado); // Ejecuta peticion HTTP PUT
        // Mostramos el resultado de la actualizacion
        console.log('%c[AXIOS PUT] Recurso actualizado (HTTP 200):', 'color:#34d399; font-weight:bold;', respuesta.data);
    } catch (error) {
        // Reportamos cualquier fallo en la peticion PUT
        console.error('[AXIOS PUT] Error al actualizar recurso:', error.message); // Mensaje de error
    }
}; // Fin de la funcion demoAxiosPut

// --- Demostracion 4: axios.delete() — Eliminacion de recursos ---
// Declaramos una funcion asincrona para demostrar la eliminacion con el verbo DELETE
const demoAxiosDelete = async () => {
    // Imprimimos un encabezado con estilo rojo en la consola
    console.log('%c[AXIOS DELETE] Demostracion 4: axios.delete() para borrar recurso', 'background:#dc2626; color:#ffffff; font-weight:bold; padding:4px 8px; border-radius:4px;');
    try {
        // Invocamos axios.delete pasando el endpoint especifico del recurso a eliminar
        const respuesta = await axios.delete(`${API_BASE}/posts/1`); // Ejecuta peticion HTTP DELETE
        // Mostramos la confirmacion de eliminacion
        console.log('%c[AXIOS DELETE] Recurso eliminado correctamente (HTTP 200):', 'color:#34d399; font-weight:bold;', respuesta.status, respuesta.statusText);
    } catch (error) {
        // Reportamos fallo en la eliminacion
        console.error('[AXIOS DELETE] Error al eliminar recurso:', error.message); // Mensaje de error
    }
}; // Fin de la funcion demoAxiosDelete

// --- Demostracion 5: Catch automatico en errores HTTP (diferencia critica vs Fetch) ---
// Declaramos una funcion asincrona que demuestra como un error 404 es rechazado automaticamente
const demoAxiosErrorCatch = async () => {
    // Imprimimos un encabezado de error en consola
    console.log('%c[AXIOS ERROR] Demostracion 5: Rechazo automatico y catch en error 404', 'background:#991b1b; color:#ffffff; font-weight:bold; padding:4px 8px; border-radius:4px;');
    try {
        // Solicitamos deliberadamente un recurso inexistente para provocar un codigo 404
        await axios.get(`${API_BASE}/ruta-que-no-existe-en-el-servidor`); // Servidor responde 404 Not Found
        // Esta linea NUNCA se ejecuta porque Axios rechaza automaticamente codigos fuera de 2xx
        console.log('Esta linea nunca se ejecutara porque Axios salta directo al catch()'); // Nota pedagogica
    } catch (error) {
        // El control de flujo entra DIRECTAMENTE al catch sin comprobar if (!res.ok) como en Fetch
        console.log('%c[AXIOS ERROR] Codigo de estado HTTP del error:', 'color:#f87171; font-weight:bold;', error.response ? error.response.status : 'Sin respuesta');
        // Imprimimos el mensaje del error devuelto por Axios
        console.log('%c[AXIOS ERROR] error.message:', 'color:#fbbf24;', error.message);
        // Explicamos pedagogicamente la ventaja en la consola
        console.log('%c[AXIOS ERROR] NOTA: En Fetch, este 404 NO habria llegado al catch. Con Axios, SI.', 'color:#a78bfa; font-style:italic;');
    }
}; // Fin de la funcion demoAxiosErrorCatch

// Ejecutamos las 5 demostraciones en secuencia para poblar la consola al cargar el script
demoAxiosGet(); // Ejecuta la prueba GET
demoAxiosPost(); // Ejecuta la prueba POST
demoAxiosPut(); // Ejecuta la prueba PUT
demoAxiosDelete(); // Ejecuta la prueba DELETE
demoAxiosErrorCatch(); // Ejecuta la prueba de captura automatica de errores

// ===================================================================
// LOGICA INTERACTIVA DEL DOM Y LABORATORIO VISUAL
// Se inicializa una vez que el documento HTML ha sido parseado
// ===================================================================
document.addEventListener('DOMContentLoaded', () => { // Callback ejecutado cuando el DOM esta listo

    // ---------------------------------------------------------------
    // 1. SISTEMA DE NAVEGACION POR PESTANAS (TABS)
    // ---------------------------------------------------------------
    const tabBtns = document.querySelectorAll('.tab-btn'); // Selecciona todos los botones de pestana
    const tabContents = document.querySelectorAll('.tab-content'); // Selecciona todos los paneles de contenido

    // Iteramos sobre cada boton de pestana para agregar el escuchador de eventos de clic
    tabBtns.forEach(btn => { // Para cada boton en la lista
        btn.addEventListener('click', () => { // Escucha el evento click
            // Removemos la clase 'active' de todos los botones para desmarcarlos visualmente
            tabBtns.forEach(b => b.classList.remove('active')); // Limpia el estado activo
            // Ocultamos todos los paneles agregando la clase 'hidden'
            tabContents.forEach(c => c.classList.add('hidden')); // Oculta todos los paneles
            // Marcamos como activo el boton presionado
            btn.classList.add('active'); // Activa el boton clickeado
            // Obtenemos el identificador del panel de destino desde el atributo data-target
            const targetId = btn.dataset.target; // Lee el ID correspondiente (shorthand-tab o config-tab)
            // Buscamos el elemento de panel correspondiente por su ID
            const targetPanel = document.getElementById(targetId); // Referencia al panel en el DOM
            // Hacemos visible el panel seleccionado removiendo la clase 'hidden'
            if (targetPanel) targetPanel.classList.remove('hidden'); // Muestra el panel correspondiente
        }); // Fin del evento click de pestana
    }); // Fin de la iteracion de botones de pestana

    // ---------------------------------------------------------------
    // 2. UTILIDAD: REGISTRO DE LOGS EN TERMINALES VIRTUALES
    // ---------------------------------------------------------------
    // Funcion para insertar lineas coloreadas en las terminales virtuales de la interfaz
    const logToTerminal = (terminalId, message, type = 'log') => { // Recibe el ID de la terminal, mensaje y tipo
        const terminal = document.getElementById(terminalId); // Busca el contenedor de la terminal
        if (!terminal) return; // Si no existe el elemento, termina la ejecucion
        const line = document.createElement('div'); // Crea un nuevo div para la linea de log
        line.className = `terminal-line ${type}`; // Aplica la clase de color segun el tipo (success, error, warning, info)
        // Inyecta el caracter del prompt y el mensaje de log formateado
        line.innerHTML = `<span class="terminal-prompt">&#9658;</span> ${message}`; // Inserta el prompt y el texto
        terminal.appendChild(line); // Agrega la linea al final del cuerpo de la terminal
        terminal.scrollTop = terminal.scrollHeight; // Realiza desplazamiento automatico hacia la linea mas reciente
    }; // Fin de la funcion logToTerminal

    // ---------------------------------------------------------------
    // 3. UTILIDAD: ANIMACION FLUIDA DE LA BARRA DE PROGRESO
    // ---------------------------------------------------------------
    // Funcion que anima la barra de progreso desde 0% hasta 100% durante el tiempo de latencia especificado
    const animateProgressBar = (barId, durationMs) => { // Recibe el ID de la barra y la duracion en milisegundos
        const bar = document.getElementById(barId); // Obtiene el elemento de la barra de progreso
        if (!bar) return Promise.resolve(); // Si no existe, retorna una promesa resuelta de inmediato
        bar.style.width = '0%'; // Reinicia el ancho a cero al iniciar la animacion
        const steps = 60; // Define la resolucion de la animacion en 60 fotogramas
        const stepDuration = durationMs / steps; // Calcula el tiempo de espera por cada fotograma
        const increment = 100 / steps; // Calcula el porcentaje de avance por fotograma
        // Retornamos una promesa que se resuelve cuando la barra completa el 100% de su recorrido
        return new Promise(resolve => { // Promesa contenedora del temporizador
            let currentWidth = 0; // Ancho actual en progreso
            const interval = setInterval(() => { // Intervalo repetitivo por fotograma
                currentWidth += increment; // Incrementa el ancho
                bar.style.width = `${Math.min(currentWidth, 100)}%`; // Actualiza el estilo CSS de ancho limitando a 100%
                if (currentWidth >= 100) { // Si alcanzo la totalidad del carril
                    clearInterval(interval); // Detiene el intervalo
                    resolve(); // Resuelve la promesa de finalizacion
                } // Fin de la comprobacion del 100%
            }, stepDuration); // Intervalo con el tiempo calculado
        }); // Fin de la promesa de animacion
    }; // Fin de la funcion animateProgressBar

    // ---------------------------------------------------------------
    // 4. UTILIDAD: ACTUALIZACION EN VIVO DEL INSPECTOR DE RESPONSE
    // ---------------------------------------------------------------
    // Funcion para actualizar las tarjetas del inspector del objeto response con datos reales
    const updateResponseInspector = (respuesta) => { // Recibe el objeto response completo de Axios
        const liveData = document.getElementById('livePropData'); // Tarjeta de datos
        const liveStatus = document.getElementById('livePropStatus'); // Tarjeta de status
        const liveStatusText = document.getElementById('livePropStatusText'); // Tarjeta de statusText
        const liveHeaders = document.getElementById('livePropHeaders'); // Tarjeta de cabeceras
        const liveConfig = document.getElementById('livePropConfig'); // Tarjeta de configuracion

        if (liveData) { // Si existe la tarjeta de datos
            // Determinamos si los datos son un arreglo o un objeto individual
            const isArr = Array.isArray(respuesta.data); // Booleano si es un array
            liveData.textContent = isArr ? `Array [${respuesta.data.length} elementos]` : `Objeto {${Object.keys(respuesta.data).join(', ')}}`; // Texto descriptivo
            liveData.style.color = '#34d399'; // Verde brillante de datos listos
        } // Fin de datos

        if (liveStatus) { // Si existe la tarjeta de status
            liveStatus.textContent = `${respuesta.status}`; // Inyecta el codigo numerico HTTP
            liveStatus.style.color = respuesta.status >= 200 && respuesta.status < 300 ? '#34d399' : '#f87171'; // Verde si 2xx, rojo si no
        } // Fin de status

        if (liveStatusText) { // Si existe la tarjeta de statusText
            liveStatusText.textContent = respuesta.statusText || 'OK'; // Inyecta el texto del status
            liveStatusText.style.color = '#38bdf8'; // Azul cian
        } // Fin de statusText

        if (liveHeaders) { // Si existe la tarjeta de cabeceras
            const cType = respuesta.headers['content-type'] || 'application/json'; // Obtiene el content-type
            liveHeaders.textContent = cType.split(';')[0]; // Muestra el tipo MIME principal
            liveHeaders.style.color = '#c4b5fd'; // Lavanda
        } // Fin de headers

        if (liveConfig) { // Si existe la tarjeta de configuracion interna
            liveConfig.textContent = `${(respuesta.config.method || 'get').toUpperCase()} ${respuesta.config.url}`; // Muestra verbo y URL solicitada
            liveConfig.style.color = '#a78bfa'; // Violeta claro
        } // Fin de config
    }; // Fin de la funcion updateResponseInspector

    // Funcion para reiniciar el inspector al estado de espera
    const resetResponseInspector = () => { // Restablece los textos por defecto
        const liveData = document.getElementById('livePropData'); // Tarjeta de datos
        const liveStatus = document.getElementById('livePropStatus'); // Tarjeta de status
        const liveStatusText = document.getElementById('livePropStatusText'); // Tarjeta de statusText
        const liveHeaders = document.getElementById('livePropHeaders'); // Tarjeta de headers
        const liveConfig = document.getElementById('livePropConfig'); // Tarjeta de config

        if (liveData) { liveData.textContent = 'Procesando...'; liveData.style.color = '#fbbf24'; } // Estado pendiente
        if (liveStatus) { liveStatus.textContent = '...'; liveStatus.style.color = '#fbbf24'; } // Estado pendiente
        if (liveStatusText) { liveStatusText.textContent = '...'; liveStatusText.style.color = '#94a3b8'; } // Estado pendiente
        if (liveHeaders) { liveHeaders.textContent = '...'; liveHeaders.style.color = '#94a3b8'; } // Estado pendiente
        if (liveConfig) { liveConfig.textContent = '...'; liveConfig.style.color = '#94a3b8'; } // Estado pendiente
    }; // Fin de la funcion resetResponseInspector

    // ---------------------------------------------------------------
    // 5. INTERACTIVIDAD DE LA TABLA DE ENDPOINTS (FILAS CLICKEABLES)
    // ---------------------------------------------------------------
    const rowsMap = [ // Mapeo entre identificadores de fila y el valor del selector
        { rowId: 'row-get-posts', value: 'get-posts' }, // Fila GET /posts
        { rowId: 'row-get-user', value: 'get-user' }, // Fila GET /users/1
        { rowId: 'row-post-article', value: 'post-article' }, // Fila POST /posts
        { rowId: 'row-put-article', value: 'put-article' }, // Fila PUT /posts/1
        { rowId: 'row-delete-article', value: 'delete-article' } // Fila DELETE /posts/1
    ]; // Fin del mapeo de filas

    // Asignamos el evento click a cada fila de la tabla de endpoints
    rowsMap.forEach(item => { // Para cada par fila-valor
        const rowEl = document.getElementById(item.rowId); // Busca el elemento de la fila
        if (rowEl) { // Si la fila existe en el DOM
            rowEl.addEventListener('click', () => { // Escucha el clic sobre la fila
                const methodSelect = document.getElementById('axiosMethodSelect'); // Obtiene el selector de metodo
                if (methodSelect) { // Si el selector existe
                    methodSelect.value = item.value; // Sincroniza el selector con la fila clickeada
                    // Resaltamos visualmente la fila seleccionada
                    document.querySelectorAll('.db-table tbody tr').forEach(r => r.classList.remove('selected-row')); // Limpia seleccion previa
                    rowEl.classList.add('selected-row'); // Agrega la clase de fila seleccionada
                    logToTerminal('axiosTerminal', `Endpoint seleccionado desde la tabla: ${item.value}`, 'info'); // Registra en terminal
                } // Fin de la sincronizacion
            }); // Fin del evento de clic
        } // Fin de la comprobacion de existencia
    }); // Fin de la asignacion de filas clickeables

    // ---------------------------------------------------------------
    // 6. PESTANA 1: LOGICA DEL BOTON "EJECUTAR CON AXIOS()"
    // ---------------------------------------------------------------
    const runAxiosBtn = document.getElementById('runAxiosBtn'); // Boton de ejecucion de la primera pestana
    const axiosMethodSelect = document.getElementById('axiosMethodSelect'); // Selector de metodo/endpoint
    const axiosDelaySelect = document.getElementById('axiosDelaySelect'); // Selector de latencia
    const axiosIndicator = document.getElementById('axiosIndicator'); // Circulo indicador de estado
    const axiosStateText = document.getElementById('axiosStateText'); // Texto descriptivo de estado
    const axiosResult = document.getElementById('axiosResult'); // Contenedor del JSON de resultado
    const axiosNote = document.getElementById('axiosNote'); // Nota informativa del resultado
    const axiosCodePreview = document.getElementById('axiosCodePreview'); // Bloque de vista previa de codigo

    if (runAxiosBtn) { // Verificamos que el boton existe en el documento
        runAxiosBtn.addEventListener('click', async () => { // Callback asincrono al presionar el boton
            const metodo = axiosMethodSelect.value; // Obtiene el valor seleccionado (get-posts, post-article, etc.)
            const delay = parseInt(axiosDelaySelect.value); // Parsea la latencia en milisegundos

            // Deshabilitamos el boton mientras la peticion este en vuelo para evitar llamadas duplicadas
            runAxiosBtn.disabled = true; // Deshabilita el boton
            runAxiosBtn.textContent = 'Enviando peticion HTTP... \u23F3'; // Muestra estado de carga en el texto

            // Cambiamos el monitor visual al estado pendiente (amarillo pulsante)
            axiosIndicator.className = 'promise-indicator state-pending'; // Clase de estado pendiente
            axiosStateText.className = 'state-pending-text'; // Texto en color ambar
            axiosStateText.textContent = 'axios() enviando solicitud y esperando respuesta...'; // Mensaje de estado

            // Reiniciamos los valores del inspector de respuesta en vivo
            resetResponseInspector(); // Pone los campos en estado de procesamiento

            // Resaltamos la fila correspondiente en la tabla de endpoints
            document.querySelectorAll('.db-table tbody tr').forEach(r => r.classList.remove('selected-row')); // Limpia
            const activeRowItem = rowsMap.find(item => item.value === metodo); // Busca la fila correspondiente
            if (activeRowItem) { // Si existe
                const activeRow = document.getElementById(activeRowItem.rowId); // Obtiene el elemento
                if (activeRow) activeRow.classList.add('selected-row'); // Marca la fila como seleccionada
            } // Fin del resaltado de fila

            // Registramos el inicio de la peticion en la terminal virtual
            logToTerminal('axiosTerminal', `Iniciando peticion con Axios (${metodo}) con latencia simulada de ${delay}ms...`, 'warning'); // Log

            // Iniciamos la animacion de la barra de progreso
            animateProgressBar('axiosProgressBar', delay); // Anima durante el tiempo de latencia

            // Pausamos la ejecucion durante la latencia configurada para emular la red real
            await new Promise(r => setTimeout(r, delay)); // Espera simulada

            try { // Bloque try para ejecutar la llamada con la libreria Axios
                let respuesta; // Variable para almacenar el objeto response devuelto por Axios
                let codigoGenerado = ''; // Variable para almacenar el fragmento de codigo correspondiente

                // Ejecutamos la peticion segun el metodo seleccionado por el estudiante
                if (metodo === 'get-posts') { // Opcion: GET /posts
                    respuesta = await axios.get(`${API_BASE}/posts`); // Llamada a axios.get()
                    codigoGenerado = `// 1. axios.get() — Lectura de datos con JSON parseado automaticamente\nconst respuesta = await axios.get('${API_BASE}/posts');\n\nconsole.log(respuesta.data);       // Array con 100 publicaciones — SIN llamar a .json()\nconsole.log(respuesta.status);     // 200 (OK)\nconsole.log(respuesta.statusText); // "OK"\nconsole.log(respuesta.headers);    // Cabeceras enviadas por el servidor`; // Codigo didactico
                } else if (metodo === 'get-user') { // Opcion: GET /users/1
                    respuesta = await axios.get(`${API_BASE}/users/1`); // Llamada a axios.get() de usuario
                    codigoGenerado = `// 2. axios.get() — Objeto individual directamente utilizable\nconst respuesta = await axios.get('${API_BASE}/users/1');\n\n// Acceso directo a propiedades del objeto devuelto en response.data\nconsole.log(respuesta.data.name);  // "${respuesta.data.name}"\nconsole.log(respuesta.data.email); // "${respuesta.data.email}"\nconsole.log(respuesta.status);     // 200`; // Codigo didactico
                } else if (metodo === 'post-article') { // Opcion: POST /posts
                    const nuevoArticulo = { title: 'Articulo Nuevo con Axios', body: 'Serializado transparentemente', userId: 1 }; // Objeto literal de datos
                    respuesta = await axios.post(`${API_BASE}/posts`, nuevoArticulo); // Llamada a axios.post() pasando objeto directo
                    codigoGenerado = `// 3. axios.post() — Envio de datos con serializacion automatica a JSON\nconst nuevoArticulo = {\n    title: 'Articulo Nuevo con Axios',\n    body: 'Serializado transparentemente',\n    userId: 1\n};\n\n// Axios serializa el objeto y agrega la cabecera Content-Type: application/json\nconst respuesta = await axios.post('${API_BASE}/posts', nuevoArticulo);\nconsole.log(respuesta.status); // 201 (Created)\nconsole.log(respuesta.data);   // Recurso con nuevo ID: ${respuesta.data.id || 101}`; // Codigo didactico
                } else if (metodo === 'put-article') { // Opcion: PUT /posts/1
                    const datosActualizados = { id: 1, title: 'Articulo Actualizado', body: 'Contenido modificado con PUT', userId: 1 }; // Datos de reemplazo
                    respuesta = await axios.put(`${API_BASE}/posts/1`, datosActualizados); // Llamada a axios.put()
                    codigoGenerado = `// 4. axios.put() — Actualizacion completa de recursos existentes\nconst datos = { id: 1, title: 'Articulo Actualizado', body: '...', userId: 1 };\nconst respuesta = await axios.put('${API_BASE}/posts/1', datos);\n\nconsole.log(respuesta.status); // 200 (OK)\nconsole.log(respuesta.data);   // Recurso modificado reflejado`; // Codigo didactico
                } else if (metodo === 'delete-article') { // Opcion: DELETE /posts/1
                    respuesta = await axios.delete(`${API_BASE}/posts/1`); // Llamada a axios.delete()
                    codigoGenerado = `// 5. axios.delete() — Eliminacion de recursos por su endpoint\nconst respuesta = await axios.delete('${API_BASE}/posts/1');\n\nconsole.log(respuesta.status);     // 200 (OK)\nconsole.log(respuesta.statusText); // "OK"`; // Codigo didactico
                } // Fin de la seleccion de metodo

                // Marcamos el monitor visual como completado exitosamente (verde esmeralda)
                axiosIndicator.className = 'promise-indicator state-fulfilled'; // Indicador verde
                axiosStateText.className = 'state-fulfilled-text'; // Texto verde
                axiosStateText.textContent = `axios() completado exitosamente — HTTP ${respuesta.status} ${respuesta.statusText}`; // Mensaje de exito

                // Preparamos una vista previa formateada del JSON recibido
                const dataPreview = JSON.stringify( // Serializamos para desplegar con indentacion
                    Array.isArray(respuesta.data) ? respuesta.data.slice(0, 3) : respuesta.data, // Si es un array, mostramos los primeros 3 elementos
                    null, // Sin funcion de reemplazo
                    2 // Indentacion de 2 espacios
                ); // Fin de la serializacion

                // Inyectamos el resultado en la caja de resultados
                axiosResult.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                        <span style="color:#34d399; font-weight:700;">&#10004; response.data (JSON ya parseado):</span>
                        <span style="color:#64748b; font-size:0.8rem;">${Array.isArray(respuesta.data) ? respuesta.data.length + ' elementos totales' : 'Objeto unico'}</span>
                    </div>
                    <pre style="color:#c4b5fd; font-size:0.82rem; margin:0; background:rgba(0,0,0,0.3); padding:0.8rem; border-radius:10px; border:1px solid rgba(255,255,255,0.05);">${dataPreview}${Array.isArray(respuesta.data) && respuesta.data.length > 3 ? '\n  ... (mostrando 3 de ' + respuesta.data.length + ')' : ''}</pre>
                `; // Inserta el bloque de JSON formateado

                // Inyectamos una nota explicativa sobre el estado HTTP y la ventaja de Axios
                axiosNote.innerHTML = `
                    <span style="color:#94a3b8; font-size:0.85rem;">
                        Estado HTTP: <strong style="color:#38bdf8;">${respuesta.status} ${respuesta.statusText}</strong> &bull;
                        Metodo: <code style="color:#a78bfa;">${metodo.toUpperCase().split('-')[0]}</code> &bull;
                        <em style="color:#34d399;">Datos entregados directamente en response.data sin fase intermedia .json()</em>
                    </span>
                `; // Inserta la nota explicativa

                // Actualizamos el bloque de codigo generado con el ejemplo JavaScript real
                axiosCodePreview.textContent = codigoGenerado; // Despliega el codigo en el bloque pre

                // Actualizamos las tarjetas del inspector en vivo con las propiedades de response
                updateResponseInspector(respuesta); // Llena el inspector con los datos reales

                // Registramos los logs de exito en la terminal virtual
                logToTerminal('axiosTerminal', `HTTP ${respuesta.status} ${respuesta.statusText} recibido del servidor`, 'success'); // Log de status
                logToTerminal('axiosTerminal', `response.data entregado y parseado automaticamente por Axios`, 'success'); // Log de datos

            } catch (error) { // Capturamos cualquier error ocurrido
                // Marcamos el monitor visual como fallido (rojo)
                axiosIndicator.className = 'promise-indicator state-rejected'; // Indicador rojo
                axiosStateText.className = 'state-rejected-text'; // Texto rojo
                axiosStateText.textContent = `Error en peticion: ${error.message}`; // Mensaje de fallo

                // Inyectamos el error en la caja de resultados
                axiosResult.innerHTML = `<span style="color:#f87171; font-weight:700;">&#10008; Error capturado:</span> <span style="color:#cbd5e1;">${error.message}</span>`; // Muestra el mensaje
                axiosNote.innerHTML = `<span style="color:#64748b; font-size:0.85rem;">Revisa la conexion de red o la consola de desarrollo (F12) para ver la traza completa.</span>`; // Nota

                // Registramos el error en la terminal virtual
                logToTerminal('axiosTerminal', `ERROR: ${error.message}`, 'error'); // Log de error

            } finally { // Bloque que se ejecuta invariablemente al culminar
                // Restauramos el boton de ejecucion a su estado inicial
                runAxiosBtn.disabled = false; // Habilita el boton nuevamente
                runAxiosBtn.textContent = 'Ejecutar con axios() \u26A1'; // Restaura el texto original
            } // Fin del bloque finally
        }); // Fin del evento click
    } // Fin de la verificacion del boton de la primera pestana

    // ---------------------------------------------------------------
    // 7. PESTANA 2: LOGICA DEL BOTON "PROBAR CON AXIOS.CREATE()"
    // ---------------------------------------------------------------
    const runConfigBtn = document.getElementById('runConfigBtn'); // Boton de la segunda pestana
    const errorScenarioSelect = document.getElementById('errorScenarioSelect'); // Selector de escenarios
    const timeoutSelect = document.getElementById('timeoutSelect'); // Selector de timeout
    const configIndicator = document.getElementById('configIndicator'); // Indicador de la segunda pestana
    const configStateText = document.getElementById('configStateText'); // Texto de estado de la segunda pestana
    const configResult = document.getElementById('configResult'); // Caja de resultado de configuracion
    const configNote = document.getElementById('configNote'); // Nota de configuracion
    const configCodePreview = document.getElementById('configCodePreview'); // Bloque de codigo de configuracion

    // Funcion auxiliar para actualizar el estado visual de cada paso en la linea de tiempo
    const actualizarPaso = (stepId, statusId, estado, texto) => { // Recibe identificadores y estado
        const stepEl = document.getElementById(stepId); // Obtiene el circulo del paso
        const statusEl = document.getElementById(statusId); // Obtiene el texto del estado
        if (stepEl) stepEl.className = `step-circle ${estado}`; // Actualiza la clase CSS del circulo
        if (statusEl) { // Si existe el texto
            statusEl.textContent = texto; // Modifica el texto
            // Asigna el color segun el estado del paso
            statusEl.style.color = estado === 'state-fulfilled' ? '#34d399' // Verde para completado
                : estado === 'state-rejected' ? '#f87171' // Rojo para error
                : estado === 'state-pending' ? '#fbbf24' // Ambar para en progreso
                : '#94a3b8'; // Gris para en espera
        } // Fin de actualizacion de texto
    }; // Fin de la funcion actualizarPaso

    if (runConfigBtn) { // Verificamos la existencia del boton de configuracion
        runConfigBtn.addEventListener('click', async () => { // Evento click asincrono
            const escenario = errorScenarioSelect.value; // Lee el escenario seleccionado (ok, 404, create, params, timeout)
            const timeout = parseInt(timeoutSelect.value); // Lee el valor de timeout configurado

            // Deshabilitamos el boton mientras se ejecutan las fases
            runConfigBtn.disabled = true; // Deshabilita el boton
            runConfigBtn.textContent = 'Creando instancia y ejecutando... \u23F3'; // Texto de carga

            // Reiniciamos los 3 pasos de la linea de tiempo al estado inicial
            actualizarPaso('cfgStep1', 'cfgStep1Status', 'state-idle', 'En espera'); // Reinicia paso 1
            actualizarPaso('cfgStep2', 'cfgStep2Status', 'state-idle', 'En espera'); // Reinicia paso 2
            actualizarPaso('cfgStep3', 'cfgStep3Status', 'state-idle', 'En espera'); // Reinicia paso 3

            // Configuramos el monitor visual en estado pendiente
            configIndicator.className = 'promise-indicator state-pending'; // Indicador ambar
            configStateText.className = 'state-pending-text'; // Texto ambar
            configStateText.textContent = 'Iniciando configuracion con axios.create()...'; // Mensaje de progreso

            // --- FASE 1: Creacion de la instancia reutilizable ---
            actualizarPaso('cfgStep1', 'cfgStep1Status', 'state-pending', 'Creando instancia...'); // Paso 1 en progreso
            logToTerminal('configTerminal', `Ejecutando: axios.create({ baseURL: '${API_BASE}', timeout: ${timeout}ms })`, 'info'); // Log
            await new Promise(r => setTimeout(r, 450)); // Pausa breve para efecto escalonado visual
            actualizarPaso('cfgStep1', 'cfgStep1Status', 'state-fulfilled', 'Instancia creada'); // Paso 1 completado

            // --- FASE 2: Disparo de la peticion con la instancia ---
            actualizarPaso('cfgStep2', 'cfgStep2Status', 'state-pending', 'Enviando peticion...'); // Paso 2 en progreso
            configStateText.textContent = `Instancia enviando peticion al escenario "${escenario}"...`; // Actualiza mensaje
            animateProgressBar('configProgressBar', 1000); // Anima la barra de progreso de la segunda pestana
            logToTerminal('configTerminal', `Disparando peticion de escenario: "${escenario}" (timeout limite: ${timeout}ms)`, 'warning'); // Log
            await new Promise(r => setTimeout(r, 1000)); // Espera la finalizacion de la animacion

            // Instanciamos el cliente Axios personalizado con la configuracion elegida
            const api = axios.create({ // Crea la instancia reutilizable
                baseURL: API_BASE, // URL raiz de la API que se concatenara a todas las rutas relativas
                timeout: timeout, // Tiempo maximo de espera en milisegundos antes de abortar la peticion
                headers: { // Cabeceras personalizadas enviadas en cada peticion de la instancia
                    'X-Custom-Client': 'Axios-Lab-Didactico', // Cabecera identificadora de la aplicacion
                    'Accept': 'application/json' // Indicamos al servidor que aceptamos respuestas en JSON
                } // Fin de cabeceras
            }); // Fin de la creacion de la instancia

            let codigoEscenario = ''; // Variable para almacenar el codigo de ejemplo a desplegar

            try { // Bloque try para comprobar el comportamiento de resolucion o rechazo de Axios
                let respuesta; // Almacenara el objeto de respuesta exitosa

                if (escenario === 'ok') { // Escenario 1: Peticion exitosa GET /posts/1
                    respuesta = await api.get('/posts/1'); // Solo pasamos la ruta relativa '/posts/1'
                    codigoEscenario = `// 1. Instancia reutilizable con axios.create()\nconst api = axios.create({\n    baseURL: '${API_BASE}',\n    timeout: ${timeout},\n    headers: { 'Accept': 'application/json' }\n});\n\n// No necesitas repetir la URL base; Axios la concatena automaticamente\nconst respuesta = await api.get('/posts/1'); // URL final: ${API_BASE}/posts/1\nconsole.log(respuesta.status); // 200 (OK)\nconsole.log(respuesta.data);   // JSON ya parseado en response.data`; // Codigo didactico
                } else if (escenario === '404') { // Escenario 2: Error 404 (catch automatico)
                    // Solicitamos una ruta deliberadamente invalida para forzar un error HTTP 404
                    respuesta = await api.get('/recurso-inexistente-para-demostrar-el-catch-404'); // Ruta no existente
                    codigoEscenario = `// 2. Catch automatico en Axios (Diferencia clave frente a Fetch)\nconst api = axios.create({ baseURL: '${API_BASE}' });\n\ntry {\n    // El servidor respondera con un 404 Not Found\n    const respuesta = await api.get('/ruta-que-no-existe');\n} catch (error) {\n    // Axios salta DIRECTAMENTE aqui sin chequear res.ok\n    console.log(error.response.status); // 404\n    console.log(error.message);         // "Request failed with status code 404"\n}`; // Codigo didactico
                } else if (escenario === 'create') { // Escenario 3: Creacion con POST (HTTP 201)
                    const payload = { title: 'Creado con axios.create()', body: 'Instancia personalizada', userId: 1 }; // Datos
                    respuesta = await api.post('/posts', payload); // Disparo de POST con la instancia
                    codigoEscenario = `// 3. Creacion de recursos mediante la instancia configurada\nconst api = axios.create({ baseURL: '${API_BASE}', timeout: ${timeout} });\n\nconst payload = { title: 'Nuevo Recurso', body: '...', userId: 1 };\nconst respuesta = await api.post('/posts', payload);\n\nconsole.log(respuesta.status); // 201 (Created)\nconsole.log(respuesta.data);   // Recurso generado con id asignado`; // Codigo didactico
                } else if (escenario === 'params') { // Escenario 4: Query parameters limpios
                    respuesta = await api.get('/posts', { params: { userId: 1 } }); // Axios construye ?userId=1
                    codigoEscenario = `// 4. Parametros de consulta limpios con la propiedad "params"\nconst api = axios.create({ baseURL: '${API_BASE}' });\n\n// Axios construye automaticamente la query string: /posts?userId=1\nconst respuesta = await api.get('/posts', {\n    params: { userId: 1 }\n});\n\nconsole.log(respuesta.data.length); // Retorna solo publicaciones con userId = 1`; // Codigo didactico
                } else if (escenario === 'timeout') { // Escenario 5: Timeout simulado
                    // Creamos una instancia con timeout ultra estricto de 1ms para forzar la expiracion
                    const apiTimeout = axios.create({ baseURL: API_BASE, timeout: 1 }); // Timeout de 1 milisegundo
                    respuesta = await apiTimeout.get('/posts/1'); // Se abortara de inmediato
                    codigoEscenario = `// 5. Control de tiempo limite (timeout) en axios.create()\nconst api = axios.create({\n    baseURL: '${API_BASE}',\n    timeout: 1 // 1ms provocara la cancelacion automatica de la peticion\n});\n\ntry {\n    await api.get('/posts/1');\n} catch (error) {\n    // Axios aborta la conexion y entrega un error de timeout\n    console.log(error.code);    // "ECONNABORTED"\n    console.log(error.message); // "timeout of 1ms exceeded"\n}`; // Codigo didactico
                } // Fin de escenarios

                // Si no salto al catch, la peticion fue exitosa (codigos 2xx)
                actualizarPaso('cfgStep2', 'cfgStep2Status', 'state-fulfilled', 'Peticion exitosa'); // Paso 2 completado
                actualizarPaso('cfgStep3', 'cfgStep3Status', 'state-fulfilled', 'response.data listo'); // Paso 3 completado

                configIndicator.className = 'promise-indicator state-fulfilled'; // Indicador verde
                configStateText.className = 'state-fulfilled-text'; // Texto verde
                configStateText.textContent = `Peticion exitosa con axios.create() — HTTP ${respuesta.status} ${respuesta.statusText}`; // Mensaje de exito

                // Desplegamos el resultado
                const dataPreview = JSON.stringify(Array.isArray(respuesta.data) ? respuesta.data.slice(0, 2) : respuesta.data, null, 2); // Vista previa
                configResult.innerHTML = `
                    <div style="color:#34d399; font-weight:700; margin-bottom:0.4rem;">&#10004; Respuesta exitosa de la instancia:</div>
                    <pre style="color:#c4b5fd; font-size:0.82rem; margin:0; background:rgba(0,0,0,0.3); padding:0.8rem; border-radius:10px;">${dataPreview}</pre>
                `; // Inserta resultado
                configNote.innerHTML = `<span style="color:#94a3b8; font-size:0.85rem;">Instancia de Axios gestiono la URL base <code>${API_BASE}</code> y entrego los datos listos.</span>`; // Nota informativa

                configCodePreview.textContent = codigoEscenario; // Despliega el codigo fuente generado
                logToTerminal('configTerminal', `Respuesta exitosa recibida: HTTP ${respuesta.status} ${respuesta.statusText}`, 'success'); // Log en terminal
                logToTerminal('configTerminal', `Instancia reutilizable operando con exito.`, 'success'); // Log adicional

            } catch (error) { // Si el servidor respondio con 4xx/5xx o expiro el timeout, Axios salta DIRECTAMENTE AQUI
                actualizarPaso('cfgStep2', 'cfgStep2Status', 'state-rejected', 'Peticion fallo'); // Paso 2 marcado como fallido
                actualizarPaso('cfgStep3', 'cfgStep3Status', 'state-rejected', 'catch(error) automatico'); // Paso 3 marcado con catch automatico

                configIndicator.className = 'promise-indicator state-rejected'; // Indicador rojo
                configStateText.className = 'state-rejected-text'; // Texto rojo
                configStateText.textContent = `Axios rechazo la promesa y salto al catch() — ${error.response ? 'HTTP ' + error.response.status : error.message}`; // Mensaje

                // Desplegamos los detalles del error capturado automaticamente
                configResult.innerHTML = `
                    <div style="color:#f87171; font-weight:700; margin-bottom:0.4rem;">&#128680; Error capturado automaticamente en el catch():</div>
                    <pre style="color:#f87171; font-size:0.82rem; margin:0; background:rgba(239,68,68,0.1); padding:0.8rem; border-radius:10px; border:1px solid rgba(239,68,68,0.25);">
Mensaje: ${error.message}
Codigo de estado: ${error.response ? error.response.status + ' (' + (error.response.statusText || 'Error HTTP') + ')' : 'Sin respuesta del servidor (Error de red / Timeout)'}
Ruta solicitada: ${error.config ? error.config.baseURL + error.config.url : 'No disponible'}
                    </pre>
                `; // Muestra el detalle del error

                configNote.innerHTML = `
                    <span style="color:#fbbf24; font-size:0.85rem;">
                        &#128161; <strong>Diferencia con Fetch:</strong> En Fetch un 404 NO entra al catch; tendrias que escribir <code>if (!res.ok) throw new Error()</code>. En Axios, cualquier codigo no-2xx es rechazado por defecto.
                    </span>
                `; // Inserta la leccion didactica

                // Asignamos el codigo de ejemplo representativo si no habia sido asignado
                configCodePreview.textContent = codigoEscenario || `// Manejo automatico de errores en Axios\ntry {\n    const api = axios.create({ baseURL: '${API_BASE}' });\n    await api.get('/ruta-invalida');\n} catch (error) {\n    // Axios entrega los detalles del error en el objeto error.response\n    console.error('Codigo HTTP:', error.response.status); // 404\n    console.error('Mensaje:', error.message);\n}`; // Codigo de ejemplo

                // Registramos los logs de error en la terminal
                logToTerminal('configTerminal', `CATCH AUTOMATICO DISPARADO: ${error.message}`, 'error'); // Log de error
                if (error.response) { // Si el servidor llego a responder con un codigo
                    logToTerminal('configTerminal', `error.response.status = ${error.response.status}`, 'warning'); // Log de status
                } // Fin de comprobacion de response
                logToTerminal('configTerminal', `Flujo de control protegido con exito en el bloque catch().`, 'info'); // Log de resumen

            } finally { // Bloque finally para re-habilitar la interfaz
                runConfigBtn.disabled = false; // Habilita el boton de configuracion
                runConfigBtn.textContent = 'Probar con axios.create() \u{1F527}'; // Restaura el texto original del boton
            } // Fin del bloque finally
        }); // Fin del evento click del boton de configuracion
    } // Fin de la verificacion del boton de configuracion

}); // Fin del evento DOMContentLoaded