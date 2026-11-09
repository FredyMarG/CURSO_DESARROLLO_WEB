/**
 * ==============================================================================
 * 🖼️ EJERCICIO PRÁCTICO: GALERÍA DINÁMICA CON FILEREADER API
 * ==============================================================================
 * Archivo: main.js
 * Propósito: Procesar imágenes locales en el cliente mediante FileReader.readAsDataURL(),
 *            renderizarlas en una cuadrícula mosaico interactiva (Bento Grid),
 *            integrar soporte completo de Drag & Drop y visor modal (Lightbox).
 * Documentación pedagógica detallada línea por línea al 100%.
 * ==============================================================================
 */

// Activamos el modo estricto de ECMAScript para evitar errores silenciosos y variables no declaradas
"use strict";

// ==============================================================================
// 1. COMPATIBILIDAD UNIVERSAL (NAVEGADOR DOM & ENTORNO NODE.JS)
// ==============================================================================
// Evaluamos si el script se está ejecutando dentro de un navegador con acceso al DOM
if (typeof document !== "undefined") {

    // ==============================================================================
    // 2. SELECCIÓN Y CACHÉ DE ELEMENTOS DEL DOM
    // ==============================================================================

    // Seleccionamos el input nativo de tipo file con el identificador original "archivo"
    const archivo = document.getElementById("archivo");

    // Seleccionamos el contenedor principal donde se inyectan dinámicamente las fotos
    const resultado = document.querySelector(".resultado");

    // Seleccionamos la zona interactiva de arrastre y soltado (Drag & Drop)
    const zonaDrop = document.getElementById("zonaDrop");

    // Seleccionamos el botón para abrir el explorador de archivos local
    const btnSeleccionar = document.getElementById("btnSeleccionar");

    // Seleccionamos el botón para cargar imágenes de demostración vectoriales
    const btnCargarDemo = document.getElementById("btnCargarDemo");

    // Seleccionamos el botón para vaciar la galería por completo
    const btnLimpiar = document.getElementById("btnLimpiar");

    // Seleccionamos el elemento de texto que muestra el número total de fotos cargadas
    const contadorFotos = document.getElementById("contadorFotos");

    // Seleccionamos el elemento de texto que muestra el peso total acumulado en KB o MB
    const tamanoTotal = document.getElementById("tamanoTotal");

    // Seleccionamos el mensaje ilustrativo de estado vacío
    const estadoVacio = document.getElementById("estadoVacio");

    // Seleccionamos el contenedor del modal Lightbox de pantalla completa
    const modalLightbox = document.getElementById("modalLightbox");

    // Seleccionamos la etiqueta img dentro del modal Lightbox
    const imgLightbox = document.getElementById("imgLightbox");

    // Seleccionamos la etiqueta de texto para el nombre de la foto en el modal
    const nombreLightbox = document.getElementById("nombreLightbox");

    // Seleccionamos la etiqueta de texto para el peso de la foto en el modal
    const tamanoLightbox = document.getElementById("tamanoLightbox");

    // Seleccionamos el botón de cierre del modal Lightbox
    const btnCerrarModal = document.getElementById("btnCerrarModal");


    // ==============================================================================
    // 3. ESTADO GLOBAL EN MEMORIA DE LA GALERÍA
    // ==============================================================================

    // Arreglo en memoria para llevar el registro de las fotos activas en la galería
    const coleccionFotos = [];


    // ==============================================================================
    // 4. FUNCIONES AUXILIARES DE FORMATEO Y ESTADÍSTICAS
    // ==============================================================================

    // Función flecha para formatear una cantidad de bytes en una cadena legible (B, KB, MB)
    const formatearBytes = (bytes) => {
        // Si el tamaño es menor a 1024 bytes, lo expresamos en bytes simples
        if (bytes < 1024) return `${bytes} B`;
        // Si el tamaño es menor a 1 Megabyte (1024 * 1024), lo convertimos a Kilobytes
        if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
        // Si supera o iguala 1 Megabyte, lo convertimos a Megabytes con 2 decimales
        return `${(bytes / 1048576).toFixed(2)} MB`;
    };

    // Función flecha para recalcular y actualizar los contadores numéricos de la interfaz
    const actualizarMetricasUI = () => {
        // Actualizamos el número de fotos reflejando la longitud del arreglo en memoria
        if (contadorFotos) contadorFotos.textContent = coleccionFotos.length;

        // Calculamos la sumatoria del peso acumulado de todas las imágenes cargadas
        const bytesTotales = coleccionFotos.reduce((acumulado, foto) => acumulado + foto.tamano, 0);

        // Actualizamos el texto del peso total formateado
        if (tamanoTotal) tamanoTotal.textContent = formatearBytes(bytesTotales);

        // Si la galería no tiene fotos, mostramos el mensaje de estado vacío
        if (coleccionFotos.length === 0) {
            // Mostramos el mensaje informativo
            if (estadoVacio) estadoVacio.style.display = "block";
        } else {
            // Si ya hay al menos una foto, ocultamos el mensaje de estado vacío
            if (estadoVacio) estadoVacio.style.display = "none";
        }
    };


    // ==============================================================================
    // 5. APERTURA Y CONTROL DEL VISOR LIGHTBOX
    // ==============================================================================

    // Función flecha para abrir el modal Lightbox con la imagen seleccionada a gran resolución
    const abrirLightbox = (dataUrl, nombre, tamanoFormateado) => {
        // Inyectamos la URL en Base64 en el atributo src de la imagen del modal
        imgLightbox.src = dataUrl;
        // Asignamos el nombre del archivo al texto informativo del modal
        nombreLightbox.textContent = nombre;
        // Asignamos el tamaño del archivo al texto del modal
        tamanoLightbox.textContent = tamanoFormateado;
        // Agregamos la clase 'activo' para activar el display flex y las animaciones CSS
        modalLightbox.classList.add("activo");
    };

    // Función flecha para cerrar el modal Lightbox
    const cerrarLightbox = () => {
        // Removemos la clase 'activo' para ocultar el modal
        modalLightbox.classList.remove("activo");
        // Vaciamos el atributo src para liberar memoria
        imgLightbox.src = "";
    };


    // ==============================================================================
    // 6. FUNCIÓN DE RENDERIZADO DINÁMICO DE TARJETA EN LA CUADRÍCULA
    // ==============================================================================

    // Función que recibe los datos de una foto y construye su nodo DOM de forma segura
    const renderizarTarjetaFoto = (fotoObjeto) => {
        // Creamos un contenedor semántico <figure> para la tarjeta de la foto
        const tarjeta = document.createElement("figure");
        // Asignamos la clase CSS principal de la tarjeta para aplicar el Grid y bordes
        tarjeta.className = "tarjeta-foto";
        // Asignamos un atributo de datos con el identificador único de la foto
        tarjeta.dataset.id = fotoObjeto.id;

        // Creamos el elemento <img> nativo
        const img = document.createElement("img");
        // Asignamos la cadena Base64 generada por FileReader en el atributo src
        img.src = fotoObjeto.dataUrl;
        // Asignamos el nombre de la foto como texto alternativo por accesibilidad
        img.alt = fotoObjeto.nombre;
        // Activamos la carga diferida nativa del navegador para mejorar el rendimiento
        img.loading = "lazy";

        // Creamos la capa superpuesta (overlay) que contendrá los metadatos y botones
        const overlay = document.createElement("div");
        // Asignamos la clase del overlay
        overlay.className = "tarjeta-overlay";

        // Creamos el contenedor de texto de información
        const info = document.createElement("div");
        // Asignamos la clase de información
        info.className = "tarjeta-info";

        // Creamos la etiqueta con el nombre del archivo
        const spanNombre = document.createElement("span");
        // Asignamos la clase del nombre
        spanNombre.className = "tarjeta-nombre";
        // Asignamos el texto del nombre
        spanNombre.textContent = fotoObjeto.nombre;

        // Creamos la etiqueta con el tamaño del archivo
        const spanTamano = document.createElement("span");
        // Asignamos la clase del tamaño
        spanTamano.className = "tarjeta-tamano";
        // Asignamos el tamaño formateado
        spanTamano.textContent = formatearBytes(fotoObjeto.tamano);

        // Agregamos el nombre y el tamaño dentro del contenedor de información
        info.appendChild(spanNombre);
        info.appendChild(spanTamano);

        // Creamos el botón individual para remover esta foto de la cuadrícula
        const btnEliminar = document.createElement("button");
        // Asignamos el tipo botón para evitar envíos de formularios accidentales
        btnEliminar.type = "button";
        // Asignamos la clase de estilo para el botón de eliminar
        btnEliminar.className = "btn-eliminar-foto";
        // Asignamos el símbolo visual ✕
        btnEliminar.innerHTML = "✕";
        // Asignamos un título accesible
        btnEliminar.title = "Eliminar esta imagen de la galería";

        // Manejador del evento clic en el botón de eliminar
        btnEliminar.addEventListener("click", (evento) => {
            // Detenemos la propagación para evitar que se abra el modal Lightbox al hacer clic en eliminar
            evento.stopPropagation();
            // Animamos la salida de la tarjeta reduciendo su escala y opacidad
            tarjeta.style.transform = "scale(0.8)";
            tarjeta.style.opacity = "0";
            // Esperamos 250 milisegundos a que concluya la transición CSS
            setTimeout(() => {
                // Removemos el nodo de la tarjeta del DOM
                tarjeta.remove();
                // Buscamos el índice de la foto en nuestro arreglo global en memoria
                const index = coleccionFotos.findIndex(f => f.id === fotoObjeto.id);
                // Si existe en el arreglo, la removemos con splice
                if (index !== -1) coleccionFotos.splice(index, 1);
                // Actualizamos los contadores de la interfaz
                actualizarMetricasUI();
            }, 250);
        });

        // Insertamos la información y el botón de eliminar dentro del overlay
        overlay.appendChild(info);
        overlay.appendChild(btnEliminar);

        // Insertamos la imagen y el overlay dentro de la tarjeta figure
        tarjeta.appendChild(img);
        tarjeta.appendChild(overlay);

        // Registramos el evento de clic sobre la tarjeta para abrir el visor Lightbox
        tarjeta.addEventListener("click", () => {
            // Abrimos el modal con la imagen en alta definición
            abrirLightbox(fotoObjeto.dataUrl, fotoObjeto.nombre, formatearBytes(fotoObjeto.tamano));
        });

        // Inyectamos la tarjeta dentro del contenedor .resultado sin destruir los nodos previos
        resultado.appendChild(tarjeta);
    };


    // ==============================================================================
    // 7. FUNCIÓN PRINCIPAL DE LECTURA ASÍNCRONA: leerArchivo (FILEREADER API)
    // ==============================================================================

    // Declaramos la función principal 'leerArchivo' que procesa la lista de archivos seleccionados
    const leerArchivo = (ar) => {
        // Si no se proporcionó ninguna lista o está vacía, salimos inmediatamente
        if (!ar || ar.length === 0) return;

        // Convertimos el objeto FileList en un Array nativo para poder iterarlo con métodos funcionales
        const archivosArray = Array.from(ar);

        // Iteramos sobre cada archivo recibido usando un bucle for tradicional
        for (let i = 0; i < archivosArray.length; i++) {
            // Extraemos la referencia del archivo actual en una constante
            const file = archivosArray[i];

            // Validamos que el archivo sea efectivamente una imagen comprobando su tipo MIME
            if (!file.type.startsWith("image/")) {
                // Registramos una advertencia en la consola indicando que se omitió el archivo no válido
                console.warn(`[Galería] Se omitió '${file.name}' porque no es una imagen válida (${file.type || "desconocido"}).`);
                // Continuamos con el siguiente archivo del bucle
                continue;
            }

            // REGLA FUNDAMENTAL DE FILEREADER:
            // Instanciamos un objeto FileReader ÚNICO e INDEPENDIENTE para cada archivo individual
            const reader = new FileReader();

            // BUENA PRÁCTICA ESENCIAL:
            // Suscribimos el evento 'load' ANTES de iniciar la lectura para evitar condiciones de carrera
            reader.addEventListener("load", (e) => {
                // Obtenemos la cadena codificada en Base64 desde el resultado del lector
                const dataUrl = e.currentTarget.result;

                // Creamos un objeto que encapsula los metadatos de la imagen procesada
                const nuevaFoto = {
                    // Generamos un identificador único combinando timestamp y número aleatorio
                    id: `foto_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                    // Nombre original del archivo proporcionado por el sistema operativo
                    nombre: file.name,
                    // Tamaño en bytes del archivo
                    tamano: file.size,
                    // Tipo MIME de la imagen (ej: 'image/jpeg', 'image/png')
                    tipo: file.type,
                    // Cadena Data URI en Base64 lista para ser asignada al src
                    dataUrl: dataUrl
                };

                // Añadimos el objeto de la foto al arreglo de control en memoria
                coleccionFotos.push(nuevaFoto);

                // Renderizamos la nueva tarjeta en la cuadrícula Bento Grid
                renderizarTarjetaFoto(nuevaFoto);

                // Actualizamos las métricas de conteo y tamaño acumulado
                actualizarMetricasUI();
            });

            // Suscribimos un escuchador para capturar errores de lectura (ej. permisos de archivo)
            reader.addEventListener("error", () => {
                // Informamos del fallo en la consola
                console.error(`[Galería] Error al leer el archivo '${file.name}'.`);
            });

            // Iniciamos la lectura asíncrona transformando los bytes binarios a Data URL (Base64)
            reader.readAsDataURL(file);
        }
    };


    // ==============================================================================
    // 8. REGISTRO DE EVENTOS EN EL INPUT FILE ORIGINAL (#archivo)
    // ==============================================================================

    // Escuchamos el evento 'change' en el input de tipo file original del ejercicio
    archivo.addEventListener("change", (e) => {
        // Pasamos la colección de archivos seleccionados (e.target.files) a la función leerArchivo
        leerArchivo(e.target.files);
        // Reseteamos el valor del input para permitir volver a seleccionar los mismos archivos si se desea
        archivo.value = "";
    });


    // ==============================================================================
    // 9. EVENTOS DE LOS BOTONES DE ACCIÓN Y DRAG & DROP
    // ==============================================================================

    // Al hacer clic en el botón personalizado "📁 Seleccionar Fotos", disparamos el input file oculto
    if (btnSeleccionar) {
        btnSeleccionar.addEventListener("click", () => {
            // Invocamos el método click() del input nativo
            archivo.click();
        });
    }

    // Al hacer clic en el área de la zona drop, también permitimos abrir el selector
    if (zonaDrop) {
        zonaDrop.addEventListener("click", () => {
            // Abrimos el explorador
            archivo.click();
        });

        // Prevenimos el comportamiento por defecto en todos los eventos de arrastre
        ["dragenter", "dragover", "dragleave", "drop"].forEach(nombreEvento => {
            zonaDrop.addEventListener(nombreEvento, (e) => {
                // Evitamos que el navegador intente abrir el archivo en la ventana actual
                e.preventDefault();
                // Detenemos la propagación del evento
                e.stopPropagation();
            });
        });

        // Al entrar con un archivo arrastrado, añadimos la clase visual 'dragover'
        zonaDrop.addEventListener("dragenter", () => {
            zonaDrop.classList.add("dragover");
        });

        // Mientras el archivo se mueva por encima, aseguramos la clase 'dragover'
        zonaDrop.addEventListener("dragover", () => {
            zonaDrop.classList.add("dragover");
        });

        // Al salir del área de arrastre, removemos la clase de resaltado visual
        zonaDrop.addEventListener("dragleave", () => {
            zonaDrop.classList.remove("dragover");
        });

        // Al soltar los archivos en la zona de aterrizaje
        zonaDrop.addEventListener("drop", (e) => {
            // Removemos el resaltado visual
            zonaDrop.classList.remove("dragover");
            // Extraemos los archivos soltados desde la propiedad e.dataTransfer.files
            const archivosArrastrados = e.dataTransfer.files;
            // Procesamos los archivos arrastrados con nuestra función principal
            leerArchivo(archivosArrastrados);
        });
    }

    // Botón para limpiar toda la galería
    if (btnLimpiar) {
        btnLimpiar.addEventListener("click", () => {
            // Si la galería ya estaba vacía, no hacemos nada
            if (coleccionFotos.length === 0) return;

            // Vaciamos el contenedor del DOM
            resultado.innerHTML = "";
            // Vaciamos el arreglo en memoria reiniciando su longitud a cero
            coleccionFotos.length = 0;
            // Actualizamos las métricas numéricas y mostramos el estado vacío
            actualizarMetricasUI();
            // Registramos la acción en la consola
            console.log("[Galería] Galería limpiada por completo.");
        });
    }

    // Botón para cargar fotos de demostración generadas en vectores SVG DataURL
    if (btnCargarDemo) {
        btnCargarDemo.addEventListener("click", () => {
            // Colección de imágenes demo con colores y temáticas variadas
            const demos = [
                {
                    nombre: "paisaje_montana.svg",
                    tamano: 2450,
                    colorFondo: "#1e1b4b",
                    colorDetalle: "#6366f1",
                    icono: "🏔️",
                    titulo: "Montañas Nevadas"
                },
                {
                    nombre: "playa_tropical.svg",
                    tamano: 1890,
                    colorFondo: "#083344",
                    colorDetalle: "#06b6d4",
                    icono: "🏖️",
                    titulo: "Playa Tropical"
                },
                {
                    nombre: "bosque_mistico.svg",
                    tamano: 3120,
                    colorFondo: "#064e3b",
                    colorDetalle: "#10b981",
                    icono: "🌲",
                    titulo: "Bosque Místico"
                },
                {
                    nombre: "puesta_sol.svg",
                    tamano: 2280,
                    colorFondo: "#451a03",
                    colorDetalle: "#f59e0b",
                    icono: "🌅",
                    titulo: "Atardecer Dorado"
                },
                {
                    nombre: "galaxia_profunda.svg",
                    tamano: 4100,
                    colorFondo: "#3b0764",
                    colorDetalle: "#d946ef",
                    icono: "🌌",
                    titulo: "Nebulosa Espacial"
                },
                {
                    nombre: "ciudad_futuro.svg",
                    tamano: 3640,
                    colorFondo: "#0f172a",
                    colorDetalle: "#38bdf8",
                    icono: "🏙️",
                    titulo: "Ciudad Futurista"
                }
            ];

            // Iteramos sobre las fotos de demostración
            demos.forEach(demo => {
                // Generamos un archivo SVG en formato Data URI codificado
                const svgDataUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="${encodeURIComponent(demo.colorFondo)}"/><circle cx="300" cy="180" r="90" fill="${encodeURIComponent(demo.colorDetalle)}" opacity="0.4"/><text x="300" y="210" text-anchor="middle" font-size="70">${demo.icono}</text><text x="300" y="320" text-anchor="middle" fill="%23f8fafc" font-family="sans-serif" font-size="22" font-weight="bold">${encodeURIComponent(demo.titulo)}</text></svg>`;

                // Creamos el objeto descriptor
                const fotoDemo = {
                    id: `demo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                    nombre: demo.nombre,
                    tamano: demo.tamano,
                    tipo: "image/svg+xml",
                    dataUrl: svgDataUrl
                };

                // Añadimos al arreglo en memoria
                coleccionFotos.push(fotoDemo);
                // Renderizamos la tarjeta en la cuadrícula
                renderizarTarjetaFoto(fotoDemo);
            });

            // Actualizamos contadores y ocultamos el estado vacío
            actualizarMetricasUI();
            // Notificamos en consola
            console.log(`[Galería] ${demos.length} fotos de demostración inyectadas con éxito.`);
        });
    }


    // ==============================================================================
    // 10. EVENTOS DEL VISOR MODAL LIGHTBOX
    // ==============================================================================

    // Al hacer clic en el botón de cerrar ✕
    if (btnCerrarModal) {
        btnCerrarModal.addEventListener("click", () => {
            // Cerramos el modal
            cerrarLightbox();
        });
    }

    // Al hacer clic en el fondo semitransparente oscuro (fuera de la foto)
    if (modalLightbox) {
        modalLightbox.addEventListener("click", (e) => {
            // Verificamos si el clic ocurrió exactamente en el fondo overlay y no en la foto
            if (e.target === modalLightbox) {
                // Cerramos el modal
                cerrarLightbox();
            }
        });
    }

    // Evento de teclado para cerrar el modal al pulsar la tecla Escape
    window.addEventListener("keydown", (e) => {
        // Comprobamos si la tecla presionada es 'Escape'
        if (e.key === "Escape" && modalLightbox && modalLightbox.classList.contains("activo")) {
            // Cerramos el modal
            cerrarLightbox();
        }
    });

    // Inicializamos las métricas al cargar la página por primera vez
    actualizarMetricasUI();

// Fin de la comprobación del entorno del navegador
} else {
    // Si se ejecuta en Node.js, informamos que el módulo DOM está listo y libre de errores
    console.log("ℹ️ [Galería Dinámica] Script cargado en entorno Node.js sin errores de sintaxis.");
}
