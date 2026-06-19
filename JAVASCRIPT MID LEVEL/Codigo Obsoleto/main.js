/**
 * ⚠️ LABORATORIO INTERACTIVO: JAVASCRIPT CÓDIGO OBSOLETO Y ESTÁNDARES MODERNOS
 * 
 * Este script gestiona la interactividad de la interfaz del usuario. Su propósito es:
 * 1. Capturar la entrada de texto y procesarla mediante métodos de String obsoletos (String.prototype.*).
 * 2. Mostrar la salida de HTML sin procesar generada por estos métodos.
 * 3. Renderizar el resultado en el DOM y compararlo con el enfoque moderno usando HTML semántico/CSS.
 * 4. Simular paso a paso en una consola embebida la diferencia entre XMLHttpRequest y Fetch API.
 * 5. Emitir advertencias de deprecación reales en la consola de desarrollo del navegador.
 */

// Garantiza que el script se ejecute únicamente cuando todo el árbol DOM esté completamente cargado y parseado
document.addEventListener("DOMContentLoaded", () => {
    
    // -------------------------------------------------------------
    // 1. SELECTORES DEL DOM (Identificadores de elementos de la interfaz)
    // -------------------------------------------------------------
    const textInput = document.getElementById("textInput"); // Input de texto donde el usuario introduce los datos de prueba
    const methodButtons = document.querySelectorAll(".btn-method"); // Colección de todos los botones de métodos obsoletos de string
    const resultPanel = document.getElementById("stringResultPanel"); // Panel contenedor de resultados comparativos (inicialmente oculto)
    
    const legacyHtmlString = document.getElementById("legacyHtmlString"); // Etiqueta code para mostrar el HTML crudo generado por el método obsoleto
    const legacyPreview = document.getElementById("legacyPreview"); // Contenedor para renderizar visualmente el HTML generado por el método obsoleto
    
    const modernCodeString = document.getElementById("modernCodeString"); // Etiqueta code para el código sugerido de la alternativa moderna (HTML/CSS)
    const modernPreview = document.getElementById("modernPreview"); // Contenedor para previsualizar visualmente la alternativa moderna renderizada

    const btnXhr = document.getElementById("btnXhr"); // Botón para simular XMLHttpRequest
    const btnFetch = document.getElementById("btnFetch"); // Botón para simular Fetch API
    const consoleOutput = document.getElementById("consoleOutput"); // Cuerpo de la terminal simulada en la interfaz
    const clearConsole = document.getElementById("clearConsole"); // Enlace/botón para limpiar los mensajes de la terminal simulada

    // -------------------------------------------------------------
    // 2. PROCESAMIENTO DE MÉTODOS DE STRING OBSOLETOS (String.prototype)
    // -------------------------------------------------------------
    
    // Itera por cada botón de método y asigna un escuchador de evento de clic
    methodButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Remueve la clase de resalte activo 'active' de todos los botones para resetear el estado visual
            methodButtons.forEach(btn => btn.classList.remove("active"));
            
            // Asigna la clase 'active' al botón actualmente presionado por el usuario
            button.classList.add("active");

            // Obtiene el nombre del método String a probar desde el atributo personalizado 'data-method'
            const method = button.getAttribute("data-method");
            
            // Obtiene el valor del texto del input; si está vacío, asigna un texto por defecto
            const value = textInput.value || "Texto de ejemplo";

            // Ejecuta el analizador comparativo para el método seleccionado con el texto ingresado
            procesarMetodoObsoleto(method, value);
        });
    });

    /**
     * Ejecuta el método deprecado de String de forma dinámica y genera su contraparte semántica moderna.
     * @param {string} method - Nombre del método a invocar (e.g. 'bold', 'strike')
     * @param {string} text - Contenido del string a manipular
     */
    function procesarMetodoObsoleto(method, text) {
        let legacyHtml = ""; // Variable para almacenar el string HTML retornado por el método obsoleto
        let modernHtml = ""; // Variable para almacenar el equivalente en HTML moderno / CSS
        let modernEquivalentCode = ""; // Variable para almacenar la descripción del código moderno recomendado

        // Evalúa el nombre del método para aplicar la lógica obsoleta y diseñar el reemplazo moderno
        switch (method) {
            case "bold":
                legacyHtml = text.bold(); // Método obsoleto: Envuelve la cadena en etiquetas <b>...</b>
                modernHtml = `<strong>${text}</strong>`; // Alternativa recomendada: HTML semántico <strong>
                modernEquivalentCode = `// HTML Semántico\n<strong>${text}</strong>\n\n/* O mediante CSS */\nfont-weight: bold;`;
                break;
            case "italics":
                legacyHtml = text.italics(); // Método obsoleto: Envuelve en etiquetas <i>...</i>
                modernHtml = `<em>${text}</em>`; // Alternativa recomendada: HTML semántico <em>
                modernEquivalentCode = `// HTML Semántico\n<em>${text}</em>\n\n/* O mediante CSS */\nfont-style: italic;`;
                break;
            case "strike":
                legacyHtml = text.strike(); // Método obsoleto: Envuelve en etiquetas <strike>...</strike>
                modernHtml = `<s>${text}</s>`; // Alternativa recomendada: HTML semántico <s>
                modernEquivalentCode = `// HTML Semántico\n<s>${text}</s>\n\n/* O mediante CSS */\ntext-decoration: line-through;`;
                break;
            case "big":
                legacyHtml = text.big(); // Método obsoleto: Envuelve en etiquetas <big>...</big> (ya no existen en HTML5)
                modernHtml = `<span style="font-size: 1.25em;">${text}</span>`; // Alternativa: Escala mediante CSS em/rem
                modernEquivalentCode = `<!-- Alternativa CSS en tag span -->\n<span style="font-size: 1.25em;">${text}</span>`;
                break;
            case "small":
                legacyHtml = text.small(); // Envuelve en etiquetas <small>...</small> de forma no recomendada por JS
                modernHtml = `<small>${text}</small>`; // HTML semántico directo en plantilla
                modernEquivalentCode = `// HTML Semántico\n<small>${text}</small>\n\n/* O mediante CSS */\nfont-size: 0.8em;`;
                break;
            case "blink":
                legacyHtml = text.blink(); // Método obsoleto: Envuelve en <blink>...</blink> (obsoleto desde Netscape)
                modernHtml = `<span class="modern-blink">${text}</span>`; // Alternativa: Animación CSS controlada por opacidades
                modernEquivalentCode = `/* CSS Animado para efecto parpadeo */\nanimation: modernBlink 1.5s ease-in-out infinite alternate;\n\n@keyframes modernBlink {\n  from { opacity: 0.2; }\n  to { opacity: 1; }\n}`;
                break;
            case "fixed":
                legacyHtml = text.fixed(); // Método obsoleto: Envuelve en la etiqueta de teletipo <tt>...</tt>
                modernHtml = `<code>${text}</code>`; // Alternativa: Etiqueta semántica de código <code>
                modernEquivalentCode = `// HTML Semántico (Monospace)\n<code>${text}</code>\n\n/* O mediante CSS */\nfont-family: monospace;`;
                break;
            case "sub":
                legacyHtml = text.sub(); // Método obsoleto: Genera etiquetas HTML de subíndice <sub>
                modernHtml = `<sub>${text}</sub>`; // Escribir la etiqueta HTML de subíndice directamente en el layout
                modernEquivalentCode = `// HTML Semántico\n<sub>${text}</sub>\n\n/* O mediante CSS */\nvertical-align: sub;\nfont-size: smaller;`;
                break;
            case "sup":
                legacyHtml = text.sup(); // Método obsoleto: Genera etiquetas HTML de superíndice <sup>
                modernHtml = `<sup>${text}</sup>`; // Escribir la etiqueta HTML de superíndice directamente en el layout
                modernEquivalentCode = `// HTML Semántico\n<sup>${text}</sup>\n\n/* O mediante CSS */\nvertical-align: super;\nfont-size: smaller;`;
                break;
            case "fontcolor":
                legacyHtml = text.fontcolor("red"); // Método obsoleto: Genera <font color="red">...</font>
                modernHtml = `<span style="color: #ef4444;">${text}</span>`; // Alternativa: CSS Inline o de hoja de estilos
                modernEquivalentCode = `<!-- Aplicar color con CSS moderno -->\n<span style="color: #ef4444;">${text}</span>`;
                break;
            case "fontsize":
                legacyHtml = text.fontsize(7); // Método obsoleto: Genera <font size="7">...</font>
                modernHtml = `<span style="font-size: 2rem;">${text}</span>`; // Alternativa: Propiedad font-size con medidas responsivas
                modernEquivalentCode = `<!-- Escalar fuentes de forma semántica con CSS -->\n<span style="font-size: 2rem;">${text}</span>`;
                break;
            case "link":
                legacyHtml = text.link("https://developer.mozilla.org"); // Método obsoleto: Genera <a name="inicio"> sin href moderno
                modernHtml = `<a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer">${text}</a>`; // HTML5 robusto con seguridad rel
                modernEquivalentCode = `<!-- Enlace con atributos de seguridad modernos -->\n<a href="https://developer.mozilla.org"\n   target="_blank"\n   rel="noopener noreferrer">\n   ${text}\n</a>`;
                break;
            default:
                legacyHtml = text;
                modernHtml = text;
                modernEquivalentCode = "Sin equivalencias.";
        }

        // Emite una advertencia formal con console.warn() para advertir al desarrollador en DevTools (F12)
        console.warn(
            `[DEPRECATED WARNING] El método String.prototype.${method}() está obsoleto.\n` +
            `HTML generado por JS: ${legacyHtml}\n` +
            `Consecuencia: Mezcla lógica con presentación. Usa alternativas semánticas modernas.`
        );

        // Actualiza el texto plano del HTML generado legadamente en el panel izquierdo de la pantalla
        legacyHtmlString.textContent = legacyHtml;
        
        // Renderiza el HTML crudo en el DOM para ver visualmente el resultado de la etiqueta obsoleta
        legacyPreview.innerHTML = legacyHtml;

        // Escribe la sintaxis moderna recomendada en el panel derecho de la pantalla
        modernCodeString.textContent = modernEquivalentCode;
        
        // Renderiza el marcado semántico/estilizado moderno en el DOM para comparar el resultado visual
        modernPreview.innerHTML = modernHtml;

        // Elimina la clase 'hidden' para hacer visible el contenedor de resultados si estaba oculto
        resultPanel.classList.remove("hidden");
    }

    // -------------------------------------------------------------
    // 3. COMPARACIÓN DE APIS DE RED (XMLHttpRequest vs Fetch API)
    // -------------------------------------------------------------
    
    /**
     * Escribe logs decorados dinámicamente en el simulador de consola de red.
     * @param {string} text - Cadena de texto con el log a imprimir
     * @param {string} type - Tipo de mensaje (para mapear estilos CSS correspondientes)
     */
    function logToTerminal(text, type = "system-msg") {
        const span = document.createElement("span"); // Crea un nuevo nodo de tipo span
        span.className = type; // Aplica la clase (por ejemplo, 'success-msg', 'error-msg')
        span.innerHTML = text; // Inserta el log (admite marcas HTML sencillas como saltos de línea)
        consoleOutput.appendChild(span); // Agrega el log al final de la consola simulada
        consoleOutput.scrollTop = consoleOutput.scrollHeight; // Auto-scrollea la terminal hacia el final del texto
    }

    // Event listener para limpiar el simulador de consola y restablecer su mensaje inicial
    clearConsole.addEventListener("click", () => {
        consoleOutput.innerHTML = '<span class="system-msg">> Consola limpia. Esperando petición...</span>';
    });

    // Simulación del comportamiento y flujo de configuración de XMLHttpRequest
    btnXhr.addEventListener("click", () => {
        logToTerminal("<br>> [XHR] Iniciando XMLHttpRequest...", "warn-msg");
        logToTerminal("> [XHR] Instanciando objeto: const xhr = new XMLHttpRequest()", "info-msg");
        logToTerminal("> [XHR] Configurando canal de red: xhr.open('GET', 'data.json')", "info-msg");
        
        // Emite una advertencia de deprecación real sobre XMLHttpRequest en la consola del navegador
        console.warn("[DEPRECATED WARNING] Se inició una petición de red mediante XMLHttpRequest. XMLHttpRequest está obsoleto para desarrollo general. Migra a fetch() para soporte de Promesas.");

        logToTerminal("> [XHR] Agregando event listeners: xhr.onload, xhr.onerror...", "info-msg");
        logToTerminal("> [XHR] Enviando petición al servidor remoto: xhr.send()", "info-msg");

        // Simula la latencia asíncrona de respuesta del servidor (800ms)
        setTimeout(() => {
            logToTerminal("> [XHR] Evento 'load' gatillado con éxito. status: 200 OK", "success-msg");
            
            // JSON simulado de respuesta
            const responseData = {
                status: "success",
                data: "Información legada cargada",
                engine: "XMLHttpRequest v1"
            };

            logToTerminal(`> [XHR] Respuesta del Servidor (Texto plano): ${JSON.stringify(responseData)}`, "success-msg");
            logToTerminal("> [XHR] Requiere conversión manual: const data = JSON.parse(xhr.responseText)", "info-msg");
            logToTerminal("⚠️ NOTA: XMLHttpRequest no soporta Promesas. Puede ocasionar Callback Hell si se encadenan múltiples llamadas de red.", "error-msg");
        }, 800);
    });

    // Simulación del comportamiento y flujo moderno basado en promesas de Fetch API
    btnFetch.addEventListener("click", () => {
        logToTerminal("<br>> [Fetch] Iniciando fetch('data.json')...", "success-msg");
        logToTerminal("> [Fetch] Retorna una Promesa nativa (Promise). Permite encadenamiento limpio (.then, .catch)", "info-msg");
        logToTerminal("> [Fetch] Enviando HTTP Request mediante el motor estándar del navegador...", "info-msg");

        // Simula la latencia asíncrona de respuesta del servidor para Fetch (500ms)
        setTimeout(() => {
            logToTerminal("> [Fetch] Promesa de petición resuelta exitosamente (Response obtenida).", "success-msg");
            logToTerminal("> [Fetch] Parseando body como JSON mediante otra promesa: response.json()", "info-msg");
            
            // Simula la latencia asíncrona de parseo del cuerpo a JSON (300ms)
            setTimeout(() => {
                const responseData = {
                    status: "success",
                    data: "Información moderna cargada",
                    engine: "Fetch standard API"
                };

                logToTerminal(`> [Fetch] Datos obtenidos y parseados: ${JSON.stringify(responseData)}`, "success-msg");
                logToTerminal("💡 VENTAJA: Puede ser simplificado aún más usando la sintaxis de async/await para simular código síncrono ultra legible.", "info-msg");
            }, 300);
        }, 500);
    });
});

