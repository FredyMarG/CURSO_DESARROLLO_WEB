// Activamos el modo estricto de ECMAScript para garantizar código limpio y prevenir fallos silenciosos
"use strict";

// Verificamos si nos encontramos en el entorno del navegador con acceso al DOM
if (typeof document !== "undefined") {

    // Seleccionamos la zona interactiva de arrastre del DOM usando su clase CSS '.zona-arrastre'
    const zona = document.querySelector(".zona-arrastre");

    // Seleccionamos el contenedor donde se inyectará el resultado final usando su clase '.resultado'
    const result = document.querySelector(".resultado");

    // Seleccionamos el elemento de la barra de carga usando su clase CSS '.barra-de-carga'
    const barraDeCarga = document.querySelector(".barra-de-carga");

    // Seleccionamos el contenedor pista de la barra de carga usando la clase '.contenedor-barra'
    const contenedorBarra = document.querySelector(".contenedor-barra");

    // Seleccionamos la etiqueta de texto del porcentaje usando la clase '.porcentaje-carga'
    const porcentajeCarga = document.querySelector(".porcentaje-carga");

    // Variable global que almacena el porcentaje numérico actual procesado (0 a 100)
    let porcentajeActual = 0;

    // Variable que almacena el identificador de requestAnimationFrame para gestionar la animación
    let animacionFrameId = null;

    // Definimos función de animación para solicitar frames de forma segura y compatible
    const pedirFrame = typeof requestAnimationFrame !== "undefined"
        ? requestAnimationFrame
        : (callback) => setTimeout(callback, 16);

    // Definimos función para cancelar frames de forma segura
    const cancelarFrame = typeof cancelAnimationFrame !== "undefined"
        ? cancelAnimationFrame
        : (id) => clearTimeout(id);

    // Escuchamos el evento 'dragover' que se dispara continuamente mientras el archivo se mueve sobre la zona
    zona.addEventListener("dragover", (e) => {
        // Prevenimos el comportamiento por defecto del navegador para permitir el soltado del archivo
        e.preventDefault();
        // Llamamos a changeStyle para cambiar el color del borde y texto a gris oscuro (#444)
        changeStyle(e.target, "#444");
    });

    // Escuchamos el evento 'dragleave' que se dispara cuando el archivo arrastrado sale del área de la zona
    zona.addEventListener("dragleave", (e) => {
        // Prevenimos el comportamiento por defecto del navegador
        e.preventDefault();
        // Llamamos a changeStyle para restaurar el borde y texto a su color original (#888)
        changeStyle(e.target, "#888");
    });

    // Escuchamos el evento 'drop' que se dispara en el momento en que el usuario suelta el archivo
    zona.addEventListener("drop", (e) => {
        // Prevenimos que el navegador abra el archivo directamente en una nueva pestaña
        e.preventDefault();
        // Restauramos el estilo visual de la zona de arrastre a su color gris original (#888)
        changeStyle(e.target, "#888");

        // Obtenemos el archivo soltado accediendo a la primera posición de files en dataTransfer
        const ar = e.dataTransfer.files[0];

        // Validamos que exista un archivo válido antes de continuar
        if (!ar) return;

        // Comprobamos si el archivo soltado es una imagen por su tipo MIME o extensión
        if (ar.type.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(ar.name)) {
            // Si es imagen, llamamos a cargarImg para procesarla y mostrar la fotografía
            cargarImg(ar);
        // Comprobamos si el archivo soltado es un video por su tipo MIME o extensión
        } else if (ar.type.startsWith("video/") || /\.(mp4|webm|ogg|mov|mkv|avi)$/i.test(ar.name)) {
            // Si es video, llamamos a cargarVideo para reproducir el contenido multimedia
            cargarVideo(ar);
        // Si no corresponde a imagen ni video, asumimos que es un documento de texto
        } else {
            // Llamamos a cargarArchivo para leer e imprimir el contenido textual plano
            cargarArchivo(ar);
        }
    });

    // Función que altera dinámicamente el color del texto y del borde de 4px de la zona de arrastre
    const changeStyle = (obj, col) => {
        // Asignamos el color recibido a la propiedad color de texto
        obj.style.color = col;
        // Asignamos el borde discontinuo (dashed) de 4px con el color indicado
        obj.style.border = `4px dashed ${col}`;
    };

    // Función que anima el avance de la barra y el porcentaje con una transición ultra fluida
    const animarPorcentaje = (objetivo, callbackFinal) => {
        // Si hay una animación en curso, la cancelamos para actualizar con el nuevo valor objetivo
        if (animacionFrameId) {
            cancelarFrame(animacionFrameId);
        }

        // Definimos la función iterativa que actualiza el porcentaje paso a paso
        const paso = () => {
            // Verificamos si aún no alcanzamos el porcentaje objetivo
            if (porcentajeActual < objetivo) {
                // Calculamos un incremento suave y proporcional al trecho que falta
                const incremento = Math.max(1, Math.ceil((objetivo - porcentajeActual) * 0.12));
                // Sumamos el incremento calculado al porcentaje acumulado
                porcentajeActual += incremento;

                // Evitamos sobrepasar el porcentaje objetivo
                if (porcentajeActual > objetivo) {
                    porcentajeActual = objetivo;
                }

                // Actualizamos el ancho visual de la barra de carga en el DOM
                if (barraDeCarga) {
                    barraDeCarga.style.width = `${porcentajeActual}%`;
                }

                // Mostramos el porcentaje numérico en tiempo real en la etiqueta central
                if (porcentajeCarga) {
                    porcentajeCarga.textContent = `${porcentajeActual}%`;
                }

                // Si aún falta por llegar al objetivo, pedimos el siguiente frame de animación
                if (porcentajeActual < objetivo) {
                    animacionFrameId = pedirFrame(paso);
                // Si llegamos con precisión al objetivo final
                } else {
                    // Ejecutamos el callback final si fue provisto
                    if (typeof callbackFinal === "function") {
                        callbackFinal();
                    }
                }
            // En caso de que ya se encuentre en el objetivo exacto o mayor
            } else {
                // Fijamos el ancho exacto en el elemento de la barra
                if (barraDeCarga) barraDeCarga.style.width = `${objetivo}%`;
                // Fijamos el texto exacto en la etiqueta de porcentaje
                if (porcentajeCarga) porcentajeCarga.textContent = `${objetivo}%`;
                // Ejecutamos la función de cierre si fue especificada
                if (typeof callbackFinal === "function") callbackFinal();
            }
        };

        // Arrancamos el primer frame de la transición animada
        animacionFrameId = pedirFrame(paso);
    };

    // Función que vincula los eventos de la FileReader API con la barra de carga en el DOM
    const actualizarBarra = (reader, ar) => {
        // Si no existen los elementos requeridos de la barra, salimos de la función
        if (!barraDeCarga && !porcentajeCarga) return;

        // Escuchamos el evento 'loadstart' que se dispara en el instante exacto en que inicia la lectura
        reader.addEventListener("loadstart", () => {
            // Mostramos el contenedor pista de la barra activando la clase CSS '.activo'
            if (contenedorBarra) {
                contenedorBarra.classList.add("activo");
            }
            // Reiniciamos el acumulador de porcentaje a cero
            porcentajeActual = 0;
            // Reiniciamos el ancho visual de la barra en 0%
            if (barraDeCarga) {
                barraDeCarga.style.width = "0%";
                // Restauramos el gradiente tecnológico predeterminado
                barraDeCarga.style.background = "";
            }
            // Mostramos el porcentaje inicial claramente en 0%
            if (porcentajeCarga) {
                porcentajeCarga.textContent = "0%";
            }
        });

        // Escuchamos el evento 'progress' que se emite periódicamente mientras se transfieren los bytes
        reader.addEventListener("progress", (e) => {
            // Calculamos el porcentaje de carga redondeado usando los bytes cargados (e.loaded) y el total (ar.size)
            let carga = Math.round((e.loaded / ar.size) * 100);
            // Animamos con transición el ancho de la barra y el número de porcentaje en tiempo real
            animarPorcentaje(carga);
        });

        // Escuchamos el evento 'loadend' que se dispara cuando la lectura concluye definitivamente
        reader.addEventListener("loadend", () => {
            // Animamos de forma fluida hasta el 100% garantizando que la transición sea visible
            animarPorcentaje(100, () => {
                // Al llegar al 100%, mostramos con orgullo el porcentaje y mensaje de completado
                if (porcentajeCarga) {
                    porcentajeCarga.textContent = "100% - ¡Carga Completa!";
                }
                // Cambiamos el color de la barra a un gradiente de éxito verde esmeralda
                if (barraDeCarga) {
                    barraDeCarga.style.background = "linear-gradient(90deg, #10b981, #06b6d4)";
                }
                // Cambiamos temporalmente el borde de la zona de arrastre a verde para confirmar éxito
                changeStyle(zona, "#10b981");
                // Configuramos un temporizador de 1.4 segundos para restaurar el borde de la zona a gris
                setTimeout(() => {
                    // Restauramos el borde de la zona de arrastre a su color original (#888)
                    changeStyle(zona, "#888");
                }, 1400);
            });
        });
    };

    // Función encargada de leer y mostrar archivos de texto plano (.txt, .json, .csv, etc.)
    const cargarArchivo = (ar) => {
        // Instanciamos un nuevo lector FileReader dedicado al archivo de texto
        const reader = new FileReader();

        // Conectamos la barra de carga para monitorear el progreso del archivo textual
        actualizarBarra(reader, ar);

        // Registramos el evento 'load' que se ejecuta cuando el archivo ha terminado de leerse
        reader.addEventListener("load", (e) => {
            // Limpiamos contenidos anteriores e inyectamos el texto leído en el contenedor resultado
            result.textContent = e.currentTarget.result;
        });

        // Iniciamos la lectura del archivo interpretando sus bytes como texto con codificación UTF-8
        reader.readAsText(ar);
    };

    // Función encargada de leer y renderizar imágenes locales
    const cargarImg = (ar) => {
        // Instanciamos un nuevo lector FileReader dedicado a la imagen
        const reader = new FileReader();

        // Conectamos la barra de carga para monitorear el progreso de la imagen
        actualizarBarra(reader, ar);

        // Registramos el evento 'load' que se ejecuta cuando la lectura de la imagen termina
        reader.addEventListener("load", (e) => {
            // Generamos una URL temporal en memoria que apunta al archivo local (Blob)
            let url = URL.createObjectURL(ar);
            // Creamos un nuevo elemento <img> en el documento
            let img = document.createElement("IMG");
            // Asignamos la URL generada al atributo src de la imagen
            img.setAttribute("src", url);
            // Limpiamos el contenedor para evitar que se superponga con textos o imágenes previas
            result.textContent = "";
            // Insertamos la nueva imagen como hijo dentro del contenedor resultado
            result.appendChild(img);
        });

        // Iniciamos la lectura asíncrona de la imagen codificándola en formato Data URL (Base64)
        reader.readAsDataURL(ar);
    };

    // Función encargada de leer y reproducir videos locales
    const cargarVideo = (ar) => {
        // Instanciamos un nuevo lector FileReader dedicado al procesamiento binario del video
        const reader = new FileReader();

        // Conectamos la barra de carga para monitorear el progreso de lectura del video
        actualizarBarra(reader, ar);

        // Registramos el evento 'load' que se dispara cuando los bytes binarios están listos
        reader.addEventListener("load", (e) => {
            // Creamos un objeto Blob a partir del ArrayBuffer binario con su tipo MIME correspondiente
            let video = new Blob([new Uint8Array(e.currentTarget.result)], { type: ar.type || "video/mp4" });
            // Generamos una URL en memoria que apunta directamente al Blob del video
            let url = URL.createObjectURL(video);
            // Creamos un nuevo elemento <video> en el documento
            let vid = document.createElement("VIDEO");
            // Asignamos la URL generada al atributo src del reproductor de video
            vid.setAttribute("src", url);
            // Habilitamos los controles nativos de reproducción (play, pausa, barra de tiempo, volumen)
            vid.setAttribute("controls", "true");
            // Limpiamos cualquier texto o imagen anterior dentro del contenedor de resultado
            result.textContent = "";
            // Insertamos el elemento video dentro del contenedor resultado
            result.appendChild(vid);
            // Iniciamos la reproducción automática del video
            vid.play();
        });

        // Leemos el archivo de video como un ArrayBuffer binario para máxima eficiencia de memoria
        reader.readAsArrayBuffer(ar);
    };

// Si el script se ejecuta en un entorno sin DOM (como Node.js desde la terminal)
} else {
    // Mostramos un mensaje informativo indicando que el código no posee errores de sintaxis
    console.log("ℹ️ [Drag & Drop File Reader] Código con barra de carga ejecutado en Node.js sin errores de sintaxis.");
}
