/**
 * ==============================================================================
 * 📁 EJERCICIO PRÁCTICO: DRAG & DROP FILE READER
 * ==============================================================================
 * Archivo: main.js
 * Propósito: Capturar archivos mediante eventos nativos de arrastre y soltado
 *            (Drag & Drop), discriminar automáticamente entre archivos de texto
 *            e imágenes, y leerlos con la FileReader API usando el método adecuado
 *            (readAsDataURL para imágenes o archivos no textuales, y readAsText para texto).
 * Documentación pedagógica detallada línea por línea al 100%.
 * ==============================================================================
 */

// Activamos el modo estricto de ECMAScript para forzar buenas prácticas y prevenir variables globales accidentales
"use strict";

// ==============================================================================
// 1. COMPATIBILIDAD UNIVERSAL: COMPROBACIÓN DE ENTORNO (DOM NAVEGADOR VS. NODE.JS)
// ==============================================================================

// Verificamos si el objeto global 'document' existe en el entorno actual
if (typeof document !== "undefined") {

    // ==============================================================================
    // 2. SELECCIÓN Y CACHÉ DE ELEMENTOS DEL DOM
    // ==============================================================================

    // Seleccionamos la zona de arrastre principal (.zona-arrastre) mediante querySelector
    const zona = document.querySelector(".zona-arrastre");

    // Seleccionamos el contenedor donde se inyectará el resultado (.resultado)
    const result = document.querySelector(".resultado");

    // Seleccionamos el input file oculto para permitir también selección mediante clic
    const inputArchivo = document.getElementById("inputArchivo");

    // Seleccionamos el botón de prueba para cargar texto demo
    const btnDemoTexto = document.getElementById("btnDemoTexto");

    // Seleccionamos el botón de prueba para cargar imagen demo
    const btnDemoImg = document.getElementById("btnDemoImg");

    // Seleccionamos el botón para limpiar la pantalla
    const btnLimpiar = document.getElementById("btnLimpiar");

    // Seleccionamos la etiqueta donde se muestra la insignia del método utilizado
    const badgeTipo = document.getElementById("badgeTipo");

    // Seleccionamos la etiqueta donde se muestra el nombre del archivo activo
    const nombreArchivo = document.getElementById("nombreArchivo");

    // Seleccionamos la etiqueta donde se muestra el tamaño en bytes/KB
    const tamanoArchivo = document.getElementById("tamanoArchivo");


    // ==============================================================================
    // 3. FUNCIÓN AUXILIAR DE CAMBIO VISUAL DE ESTILO: changeStyle(obj, col)
    // ==============================================================================

    // Función que recibe un elemento del DOM y un color para actualizar su borde y apariencia
    const changeStyle = (obj, col) => {
        // Si no se proporcionó un elemento válido, salimos inmediatamente para evitar errores
        if (!obj) return;

        // Asignamos el color recibido a la propiedad de color de texto del elemento
        obj.style.color = col;

        // Asignamos el borde discontinuo (dashed) con el color indicado
        obj.style.border = `4px dashed ${col}`;

        // Si el color es el tono de reposo (ej: '#888'), removemos la clase 'dragover'
        if (col === "#888" || col === "default") {
            // Removemos la clase de resaltado
            obj.classList.remove("dragover");
        // Si el color es el tono activo de arrastre (ej: '#444' o un acento)
        } else {
            // Añadimos la clase de resaltado para activar sombras y resplandores en CSS
            obj.classList.add("dragover");
        }
    };


    // ==============================================================================
    // 4. FUNCIÓN AUXILIAR DE FORMATEO DE BYTES A CADENA LEGIBLE
    // ==============================================================================

    // Función flecha que transforma un número entero de bytes en B, KB o MB
    const formatearBytes = (bytes) => {
        // Si el tamaño es menor a 1024 bytes, lo mostramos como bytes directos
        if (bytes < 1024) return `${bytes} B`;
        // Si es menor a 1 MB (1048576 bytes), calculamos su valor en KB con un decimal
        if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
        // Si supera o iguala 1 MB, calculamos su valor en MB con dos decimales
        return `${(bytes / 1048576).toFixed(2)} MB`;
    };


    // ==============================================================================
    // 5. FUNCIÓN DE ACTUALIZACIÓN DE METADATOS EN LA INTERFAZ
    // ==============================================================================

    // Función que actualiza la píldora informativa superior con los datos del archivo
    const actualizarMetadatosUI = (metodo, nombre, tamano) => {
        // Si existe el elemento badge del tipo, actualizamos su contenido de texto
        if (badgeTipo) badgeTipo.textContent = metodo;
        // Si existe el elemento del nombre, mostramos el nombre del archivo
        if (nombreArchivo) nombreArchivo.textContent = nombre;
        // Si existe el elemento del tamaño, mostramos la cadena formateada
        if (tamanoArchivo) tamanoArchivo.textContent = formatearBytes(tamano);
    };


    // ==============================================================================
    // 6. FUNCIÓN PARA CARGAR Y RENDERIZAR DOCUMENTOS DE TEXTO: cargarArchivo(ar)
    // ==============================================================================

    // Función que lee archivos de texto (.txt, .json, .csv, .md, código) con readAsText()
    const cargarArchivo = (ar) => {
        // Instanciamos un nuevo lector FileReader dedicado para esta lectura
        const reader = new FileReader();

        // BUENA PRÁCTICA FUNDAMENTAL:
        // Suscribimos el escuchador 'load' ANTES de iniciar la lectura para evitar condiciones de carrera
        reader.addEventListener("load", (e) => {
            // Obtenemos el texto decodificado almacenado en e.currentTarget.result
            const contenidoTexto = e.currentTarget.result;

            // Limpiamos cualquier contenido anterior en el contenedor de resultados
            result.innerHTML = "";

            // Creamos un contenedor semántico para envolver el texto
            const contenedorTexto = document.createElement("div");
            // Asignamos la clase CSS correspondiente
            contenedorTexto.className = "contenedor-texto";

            // Creamos una barra superior para el documento con su nombre y tipo
            const headerTexto = document.createElement("div");
            // Asignamos la clase del header
            headerTexto.className = "header-texto";
            // Inyectamos el nombre del documento con un icono ilustrativo
            headerTexto.innerHTML = `<span>📄 Documento: <strong>${ar.name}</strong></span><span>Codificación: UTF-8</span>`;

            // Creamos la etiqueta <pre> para respetar saltos de línea y espacios en blanco
            const pre = document.createElement("pre");
            // Asignamos la clase del visor de código
            pre.className = "visor-codigo";

            // Creamos la etiqueta semántica <code>
            const code = document.createElement("code");
            // Inyectamos el contenido textual de forma segura mediante textContent (evita inyecciones XSS)
            code.textContent = contenidoTexto;

            // Ensamblamos la etiqueta code dentro de pre
            pre.appendChild(code);
            // Ensamblamos el header dentro del contenedor de texto
            contenedorTexto.appendChild(headerTexto);
            // Ensamblamos el pre dentro del contenedor de texto
            contenedorTexto.appendChild(pre);

            // Inyectamos el visor de texto completo dentro de .resultado
            result.appendChild(contenedorTexto);

            // Actualizamos la barra de metadatos indicando el método readAsText()
            actualizarMetadatosUI("readAsText()", ar.name, ar.size);
        });

        // Suscribimos un escuchador para capturar posibles errores de lectura
        reader.addEventListener("error", () => {
            // Mostramos mensaje de error en la consola
            console.error(`Error al leer el archivo textual: ${ar.name}`);
        });

        // Iniciamos la lectura asíncrona del archivo interpretando los bytes como texto en codificación UTF-8
        reader.readAsText(ar, "UTF-8");
    };


    // ==============================================================================
    // 7. FUNCIÓN PARA CARGAR Y RENDERIZAR IMÁGENES: cargarImg(ar)
    // ==============================================================================

    // Función que lee imágenes o archivos no textuales con readAsDataURL()
    const cargarImg = (ar) => {
        // Instanciamos un nuevo lector FileReader dedicado exclusivamente a la imagen
        const reader = new FileReader();

        // BUENA PRÁCTICA FUNDAMENTAL:
        // Suscribimos el escuchador 'load' ANTES de iniciar la lectura
        reader.addEventListener("load", (e) => {
            // Obtenemos la cadena Data URI codificada en Base64 desde e.currentTarget.result
            const dataUrl = e.currentTarget.result;

            // Limpiamos el contenedor de resultados previo
            result.innerHTML = "";

            // Creamos un contenedor semántico <figure> para la imagen
            const figure = document.createElement("figure");
            // Asignamos la clase de estilo de imagen
            figure.className = "contenedor-imagen";

            // Creamos el elemento <img> nativo
            const img = document.createElement("img");
            // Asignamos la cadena Base64 al atributo src de la imagen
            img.src = dataUrl;
            // Asignamos el nombre del archivo al atributo alt por accesibilidad
            img.alt = ar.name;
            // Activamos carga diferida nativa
            img.loading = "lazy";

            // Creamos el pie de imagen <figcaption> con la información del archivo
            const caption = document.createElement("figcaption");
            // Asignamos la clase del pie de imagen
            caption.className = "caption-imagen";
            // Inyectamos el nombre y tamaño formateado
            caption.textContent = `🖼️ ${ar.name} (${formatearBytes(ar.size)})`;

            // Insertamos la imagen y el pie de imagen dentro de la figura
            figure.appendChild(img);
            figure.appendChild(caption);

            // Insertamos la figura completa dentro del contenedor .resultado
            result.appendChild(figure);

            // Actualizamos la barra de metadatos indicando el método readAsDataURL()
            actualizarMetadatosUI("readAsDataURL()", ar.name, ar.size);
        });

        // Suscribimos un escuchador para capturar errores de lectura
        reader.addEventListener("error", () => {
            // Mostramos mensaje de error en la consola
            console.error(`Error al leer el archivo como imagen: ${ar.name}`);
        });

        // Iniciamos la lectura asíncrona transformando los bytes del archivo a Data URI Base64
        reader.readAsDataURL(ar);
    };


    // ==============================================================================
    // 8. DISCRIMINACIÓN INTELIGENTE DE ARCHIVO (REQUERIMIENTO PRINCIPAL)
    // ==============================================================================

    // Función que evalúa el tipo de archivo y decide si cargar la imagen o el texto
    const procesarArchivo = (file) => {
        // Si no se proporcionó ningún archivo (ej. selección cancelada), salimos inmediatamente
        if (!file) return;

        // Comprobamos si el tipo MIME comienza por 'image/' (ej. 'image/png', 'image/jpeg', 'image/webp')
        const tieneMimeImagen = file.type && file.type.startsWith("image/");

        // Comprobamos por extensión en caso de que el sistema operativo no reporte el tipo MIME
        const tieneExtensionImagen = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|avif)$/i.test(file.name);

        // Determinamos si es una imagen válida mediante MIME o extensión
        const esImagen = tieneMimeImagen || tieneExtensionImagen;

        // Comprobamos si el archivo es estrictamente un documento de texto plano o código legible
        const esTexto = file.type && (
            file.type.startsWith("text/") ||
            file.type.includes("json") ||
            file.type.includes("csv") ||
            file.type.includes("xml") ||
            file.type.includes("javascript")
        ) || /\.(txt|json|csv|md|js|ts|html|css|py|sql|xml|log|yaml|yml)$/i.test(file.name);

        // REGLA DE ORO DEL REQUERIMIENTO DEL USUARIO:
        // "haz que si es un archivo diferente a texto o es imagen cargue la imagen y no el texto"
        // 1. Si es una imagen O si es un archivo DIFERENTE a texto:
        if (esImagen || !esTexto) {
            // Ejecutamos cargarImg() con readAsDataURL para previsualizar la imagen y JAMÁS volcar texto binario crudo
            cargarImg(file);
        // 2. Si es estrictamente un archivo de texto plano:
        } else {
            // Ejecutamos cargarArchivo() con readAsText() para extraer y mostrar el código o texto
            cargarArchivo(file);
        }
    };


    // ==============================================================================
    // 9. REGISTRO DE EVENTOS DRAG & DROP EN LA ZONA (.zona-arrastre)
    // ==============================================================================

    // Escuchador del evento 'dragenter': se dispara cuando el archivo arrastrado entra a la zona
    zona.addEventListener("dragenter", (e) => {
        // Prevenimos el comportamiento por defecto del navegador
        e.preventDefault();
        // Detenemos la propagación
        e.stopPropagation();
        // Cambiamos el estilo de la zona aplicando color oscuro y clase activa
        changeStyle(e.target, "#444");
    });

    // Escuchador del evento 'dragover': se dispara continuamente mientras el archivo se mueva sobre la zona
    zona.addEventListener("dragover", (e) => {
        // INDISPENSABLE: Prevenimos el comportamiento por defecto para permitir soltar el archivo
        e.preventDefault();
        // Detenemos la propagación
        e.stopPropagation();
        // Mantenemos el estilo activo en la zona de arrastre
        changeStyle(e.target, "#444");
    });

    // Escuchador del evento 'dragleave': se dispara cuando el archivo arrastrado abandona la zona
    zona.addEventListener("dragleave", (e) => {
        // Prevenimos el comportamiento por defecto
        e.preventDefault();
        // Detenemos la propagación
        e.stopPropagation();
        // Restauramos el estilo original de reposo de la zona
        changeStyle(e.target, "#888");
    });

    // Escuchador del evento 'drop': se dispara cuando el usuario suelta el archivo dentro de la zona
    zona.addEventListener("drop", (e) => {
        // INDISPENSABLE: Prevenimos que el navegador abra el archivo en una nueva pestaña
        e.preventDefault();
        // Detenemos la propagación
        e.stopPropagation();
        // Restauramos el estilo visual de la zona
        changeStyle(e.target, "#888");

        // Obtenemos el primer archivo soltado desde la colección e.dataTransfer.files
        const archivoSoltado = e.dataTransfer.files[0];

        // Procesamos el archivo aplicando la discriminación entre imagen y texto
        procesarArchivo(archivoSoltado);
    });

    // Permitimos que al hacer clic sobre la zona de arrastre se abra también el explorador de archivos
    zona.addEventListener("click", () => {
        // Si existe el input file oculto, invocamos su método click() nativo
        if (inputArchivo) inputArchivo.click();
    });


    // ==============================================================================
    // 10. REGISTRO DE EVENTOS DEL INPUT FILE Y BOTONES DE ACCIÓN
    // ==============================================================================

    // Si existe el input file oculto, escuchamos el evento 'change'
    if (inputArchivo) {
        inputArchivo.addEventListener("change", (e) => {
            // Obtenemos el archivo seleccionado por el usuario en el explorador
            const archivoSeleccionado = e.target.files[0];
            // Procesamos el archivo con la misma lógica inteligente
            procesarArchivo(archivoSeleccionado);
            // Reseteamos el valor del input para permitir volver a seleccionar el mismo archivo
            inputArchivo.value = "";
        });
    }

    // Botón para probar la carga de un archivo de texto demo
    if (btnDemoTexto) {
        btnDemoTexto.addEventListener("click", () => {
            // Creamos un archivo simulado de texto plano usando el constructor File
            const archivoTextoDemo = new File([
                "// ==========================================\n" +
                "// DEMO: ARCHIVO DE CONFIGURACIÓN - APP.JSON\n" +
                "// ==========================================\n" +
                "{\n" +
                '  "curso": "JavaScript Master Level",\n' +
                '  "tema": "Drag & Drop con FileReader API",\n' +
                '  "metodo": "readAsText()",\n' +
                '  "estado": "Completado con éxito"\n' +
                "}"
            ], "configuracion_demo.json", { type: "application/json" });

            // Procesamos el archivo de texto simulado
            procesarArchivo(archivoTextoDemo);
        });
    }

    // Botón para probar la carga de una imagen demo
    if (btnDemoImg) {
        btnDemoImg.addEventListener("click", () => {
            // Creamos una imagen vectorial SVG de alta definición en Base64
            const svgString = '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380">' +
                '<defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">' +
                '<stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#06b6d4"/>' +
                '</linearGradient></defs>' +
                '<rect width="600" height="380" rx="16" fill="#0f172a"/>' +
                '<circle cx="300" cy="160" r="70" fill="url(#g)"/>' +
                '<text x="300" y="185" text-anchor="middle" font-size="64">🖼️</text>' +
                '<text x="300" y="280" text-anchor="middle" fill="#f8fafc" font-family="sans-serif" font-size="20" font-weight="bold">Imagen de Prueba Drag &amp; Drop</text>' +
                '<text x="300" y="315" text-anchor="middle" fill="#06b6d4" font-family="monospace" font-size="14">Cargada con FileReader.readAsDataURL()</text>' +
                '</svg>';

            // Instanciamos un objeto File simulado con tipo MIME de imagen SVG
            const archivoImgDemo = new File([svgString], "imagen_prueba_demo.svg", { type: "image/svg+xml" });

            // Procesamos la imagen simulada
            procesarArchivo(archivoImgDemo);
        });
    }

    // Botón para limpiar el resultado y restablecer el estado inicial
    if (btnLimpiar) {
        btnLimpiar.addEventListener("click", () => {
            // Restauramos el mensaje inicial en el contenedor .resultado
            result.innerHTML = `
                <div class="estado-inicial">
                    <span class="icono-estado">⏳</span>
                    <p>El contenido del archivo leído aparecerá aquí...</p>
                    <small>Suelta una imagen (.png, .jpg, .svg, .webp) o un documento (.txt, .json, .csv, .md, .js)</small>
                </div>
            `;
            // Restablecemos los metadatos de la barra superior
            actualizarMetadatosUI("Esperando archivo", "Ningún archivo cargado", 0);
            // Si el input file tenía valor, lo limpiamos
            if (inputArchivo) inputArchivo.value = "";
        });
    }

// Fin de la comprobación del entorno del navegador
} else {
    // Si se ejecuta en un entorno sin DOM como Node.js, emitimos un mensaje informativo sin arrojar error
    console.log("ℹ️ [Drag & Drop FileReader] Archivo cargado en Node.js sin errores de sintaxis.");
}
