/**
 * ==============================================================================
 * 📁 JAVASCRIPT MASTER LEVEL: MÓDULO COMPLETO DE FILEREADER API
 * ==============================================================================
 * Archivo: main.js
 * Propósito: Guía práctica ejecutable, comentada y explicada línea por línea al 100%
 * Ejecución: Directamente en la consola del navegador o en terminal con 'node main.js'
 * 
 * TEMARIO DEL MÓDULO (DOCUMENTACION/FILE READER.md):
 * 1. Introducción a la FileReader API y lectura asíncrona en el cliente
 * 2. Diferenciación arquitectónica: Objetos File y Blob frente al servidor tradicional
 * 3. Lectura de contenido textual mediante 'readAsText(blob[, encoding])'
 * 4. Codificación en Data URL y Base64 mediante 'readAsDataURL(blob)'
 * 5. Anatomía de una Data URI: data:[<mediatype>][;base64],<datos>
 * 6. Caso Práctico 1: Carga y renderizado dinámico de galería multiarchivo
 * 7. Iteración paralela de FileList: Regla de una instancia única de FileReader por archivo
 * 8. Caso Práctico 2: Integración nativa con Drag & Drop (e.dataTransfer.files)
 * 9. El ciclo de vida de eventos: loadstart, progress, load, error, abort y loadend
 * 10. Monitoreo de bytes y cálculo porcentual: e.lengthComputable, e.loaded y e.total
 * 11. Cancelación asíncrona de lecturas en curso mediante 'reader.abort()'
 * 12. Analogía 1 del Mundo Real: El Traductor en Cabina 🎙️ (readAsText vs. readAsDataURL)
 * 13. Analogía 2 del Mundo Real: La Báscula del Camión de Granos 🚚 (progress y loadend)
 * 14. Buenas prácticas: Validación previa de tipo MIME, tamaño y alternativa URL.createObjectURL()
 * 15. Errores comunes: Excepción InvalidStateError por concurrencia y confusión con subida HTTP
 * 16. Resolución comentada de los 3 Retos Prácticos del Módulo (Nivel 1, Nivel 2 y Nivel 3)
 * ==============================================================================
 */

// Activamos el modo estricto de ECMAScript para prevenir errores de sintaxis y variables globales accidentales
"use strict";

// Definición de función pedagógica para delimitar visualmente cada bloque temático en la consola
function imprimirSeparador(numeroBloque, titulo) {
    // Imprime un salto de línea inicial y una línea horizontal divisoria de 78 caracteres de longitud
    console.log("\n" + "=".repeat(78));
    // Imprime el número del bloque formateado junto a su título descriptivo en mayúsculas
    console.log(`📌 BLOQUE ${numeroBloque}: ${titulo}`);
    // Imprime una línea horizontal de cierre idéntica a la superior
    console.log("=".repeat(78));
}

// ==============================================================================
// COMPATIBILIDAD UNIVERSAL: SIMULADOR DE FILEREADER PARA NODE.JS Y NAVEGADORES
// ==============================================================================
// En navegadores web, window.FileReader, window.Blob y window.File existen de forma nativa.
// Para permitir que este script se ejecute con total fidelidad en Node.js mediante 'node main.js'
// o en navegadores bajo el protocolo 'file:///', creamos clases simuladoras respetando la especificación W3C:

// Declaración de la clase SimuladorBlob que emula un Binary Large Object inmutable
class SimuladorBlob {
    // Constructor que recibe un arreglo de fragmentos y un objeto opcional de configuración
    constructor(partes = [], options = {}) {
        // Asignación del tipo MIME suministrado o string vacío por defecto
        this.type = options.type || "";
        // Asignación de nombre simbólico del archivo
        this.name = options.name || "archivo.bin";
        
        // Variable acumuladora para consolidar el contenido textual o binario de las partes
        let contenidoStr = "";
        // Iteramos sobre cada una de las partes suministradas en el arreglo
        for (const parte of partes) {
            // Si la parte es una cadena de texto estándar
            if (typeof parte === "string") {
                // Concatenamos directamente el string
                contenidoStr += parte;
            // Si la parte es un arreglo de bytes tipados o un Buffer de Node.js
            } else if (parte instanceof Uint8Array || (typeof Buffer !== "undefined" && Buffer.isBuffer(parte))) {
                // Convertimos el búfer binario a su representación textual UTF-8
                contenidoStr += parte.toString();
            // Si la parte es otra instancia de Blob simulado
            } else if (parte instanceof SimuladorBlob) {
                // Extraemos su contenido crudo interno
                contenidoStr += parte._raw;
            }
        }
        // Asignamos el contenido crudo procesado a la propiedad interna _raw
        this._raw = contenidoStr;
        // Calculamos el tamaño real en bytes utilizando Buffer en Node o cálculo por longitud de caracteres
        this.size = (typeof Buffer !== "undefined") ? Buffer.byteLength(this._raw, "utf-8") : this._raw.length;
    }
}

// Declaración de la clase SimuladorFile que hereda de SimuladorBlob añadiendo metadatos de sistema operativo
class SimuladorFile extends SimuladorBlob {
    // Constructor que recibe las partes, el nombre del archivo y opciones opcionales
    constructor(partes = [], nombre = "documento.txt", options = {}) {
        // Invocamos el constructor padre pasándole las partes y el nombre en el objeto options
        super(partes, { ...options, name: nombre });
        // Nombre del archivo expuesto públicamente según la especificación W3C
        this.name = nombre;
        // Marca de tiempo Unix de la última fecha de modificación del archivo
        this.lastModified = Date.now();
    }
}

// Declaración de la clase SimuladorFileReader que implementa la máquina de estados de FileReader
class SimuladorFileReader {
    // Constructor que inicializa los estados y propiedades del lector
    constructor() {
        // Constante de estado 0: El lector ha sido instanciado pero no ha iniciado ninguna lectura
        this.EMPTY = 0;
        // Constante de estado 1: La lectura está en progreso en segundo plano
        this.LOADING = 1;
        // Constante de estado 2: La operación ha finalizado (con éxito, error o cancelación)
        this.DONE = 2;
        // Estado actual del lector, inicialmente en EMPTY (0)
        this.readyState = this.EMPTY;
        
        // Propiedad que almacenará el resultado final de la lectura (string o Data URL)
        this.result = null;
        // Propiedad que almacenará el objeto de error si la lectura falla
        this.error = null;
        // Diccionario interno de escuchadores de eventos registrados mediante addEventListener
        this._listeners = {};
        // Bandera booleana interna para registrar si la operación fue abortada por el usuario
        this._abortado = false;
    }

    // Método para registrar funciones callback ante eventos específicos
    addEventListener(event, callback) {
        // Si no existe un arreglo para este evento, lo creamos vacío
        if (!this._listeners[event]) this._listeners[event] = [];
        // Insertamos el callback al arreglo de oyentes del evento
        this._listeners[event].push(callback);
    }

    // Método para eliminar funciones callback previamente registradas
    removeEventListener(event, callback) {
        // Si no hay oyentes registrados para el evento, salimos de inmediato
        if (!this._listeners[event]) return;
        // Filtramos el arreglo conservando solo los callbacks diferentes al suministrado
        this._listeners[event] = this._listeners[event].filter(fn => fn !== callback);
    }

    // Método interno auxiliar para despachar eventos a los listeners y a las propiedades on<evento>
    _despachar(event, data = {}) {
        // Construimos el objeto de evento con referencia a la instancia target y propiedades adicionales
        const evtObj = { target: this, type: event, ...data };
        // Si existe un manejador asignado directamente por propiedad (ej: reader.onload = fn), lo ejecutamos
        if (this[`on${event}`]) this[`on${event}`](evtObj);
        // Si existen escuchadores agregados con addEventListener, los iteramos y ejecutamos
        if (this._listeners[event]) {
            // Invocamos cada callback pasándole el objeto de evento construido
            this._listeners[event].forEach(fn => fn(evtObj));
        }
    }

    // Método abort() para cancelar inmediatamente una lectura en curso
    abort() {
        // Solo podemos abortar si el lector está en estado LOADING (1)
        if (this.readyState === this.LOADING) {
            // Marcamos la bandera de aborto como verdadera
            this._abortado = true;
            // Transicionamos el estado inmediatamente a DONE (2)
            this.readyState = this.DONE;
            // El resultado de una operación abortada debe ser estrictamente null según la norma
            this.result = null;
            // Despachamos el evento 'abort' a los escuchadores
            this._despachar("abort");
            // Despachamos el evento 'loadend' que siempre señala la terminación formal del ciclo
            this._despachar("loadend");
        }
    }

    // Método readAsText para leer el contenido interpretándolo como una cadena string UTF-8
    readAsText(blob, encoding = "UTF-8") {
        // Si el lector ya se encuentra en estado de lectura activa, lanzamos la excepción InvalidStateError
        if (this.readyState === this.LOADING) {
            // Lanzamiento formal del error según el estándar W3C
            throw new Error("InvalidStateError: La instancia ya está ejecutando una lectura activa.");
        }

        // Cambiamos el estado a LOADING (1)
        this.readyState = this.LOADING;
        // Reiniciamos la bandera de cancelación
        this._abortado = false;
        // Despachamos el primer evento del ciclo de vida: 'loadstart'
        this._despachar("loadstart");

        // Calculamos el tamaño total en bytes del blob
        const total = blob.size || 1024;
        // Definimos el número de pasos progresivos para simular la emisión del evento 'progress'
        const pasos = 3;
        // Contador del paso actual de avance
        let pasoActual = 1;

        // Configuramos un intervalo asíncrono para emitir los pulsos de lectura de bytes
        const intervalo = setInterval(() => {
            // Si la operación fue cancelada con abort(), detenemos el temporizador y salimos
            if (this._abortado) {
                // Limpieza del intervalo
                clearInterval(intervalo);
                // Salida inmediata
                return;
            }

            // Calculamos la porción de bytes leídos hasta el paso actual
            const cargado = Math.min(total, Math.round((pasoActual / pasos) * total));
            // Despachamos el evento 'progress' con las métricas requeridas por el estándar
            this._despachar("progress", {
                // Indica que el tamaño total del archivo es conocido y computable
                lengthComputable: true,
                // Cantidad acumulada de bytes transferidos hasta el momento
                loaded: cargado,
                // Tamaño total en bytes del archivo
                total: total
            });

            // Si hemos alcanzado la totalidad de los bytes
            if (cargado >= total) {
                // Detenemos el intervalo de avance
                clearInterval(intervalo);
                // Actualizamos el estado formalmente a DONE (2)
                this.readyState = this.DONE;

                // Función interna para asignar el resultado y despachar load y loadend
                const finalizar = (texto) => {
                    // Almacenamos el contenido leído en la propiedad result
                    this.result = texto;
                    // Despachamos el evento 'load' indicando éxito en la lectura
                    this._despachar("load");
                    // Despachamos el evento 'loadend' indicando conclusión del proceso
                    this._despachar("loadend");
                };

                // Si el objeto blob posee el método nativo text() de la API Fetch/Blob
                if (typeof blob.text === "function") {
                    // Resolvemos la promesa nativa de texto
                    blob.text().then(txt => finalizar(txt)).catch(err => {
                        // Si ocurre un error, lo registramos en la propiedad error
                        this.error = err;
                        // Despachamos el evento de fallo 'error'
                        this._despachar("error");
                        // Despachamos el cierre definitivo 'loadend'
                        this._despachar("loadend");
                    });
                // Si es nuestro SimuladorBlob, leemos la propiedad interna _raw
                } else {
                    // Invocamos finalizar con el texto almacenado en _raw
                    finalizar(blob._raw || String(blob));
                }
            }
            // Incrementamos el contador de paso
            pasoActual++;
        }, 30); // Intervalo de 30 milisegundos entre eventos progress
    }

    // Método readAsDataURL para leer el contenido y codificarlo como URI en Base64
    readAsDataURL(blob) {
        // Verificamos que la instancia no esté ocupada en otra lectura simultánea
        if (this.readyState === this.LOADING) {
            // Error normativo si se intenta reutilizar la misma instancia al mismo tiempo
            throw new Error("InvalidStateError: La instancia ya está ejecutando una lectura activa.");
        }

        // Marcamos el estado como LOADING
        this.readyState = this.LOADING;
        // Reseteamos bandera de aborto
        this._abortado = false;
        // Disparamos evento inicial loadstart
        this._despachar("loadstart");

        // Configuramos un temporizador asíncrono para simular el procesamiento de Base64
        setTimeout(() => {
            // Si la operación fue abortada previamente, no realizamos nada
            if (this._abortado) return;

            // Función interna para consolidar la Data URI final
            const finalizar = (base64Str) => {
                // Determinamos el tipo MIME o usamos un fallback genérico octet-stream
                const mime = blob.type || "application/octet-stream";
                // Construimos la Data URI con el formato: data:[mediatype];base64,<datos>
                this.result = `data:${mime};base64,${base64Str}`;
                // Marcamos el estado como DONE (2)
                this.readyState = this.DONE;

                // Emitimos el evento progress completado al 100%
                this._despachar("progress", {
                    // Tamaño computable
                    lengthComputable: true,
                    // Bytes cargados igual al total
                    loaded: blob.size || 1024,
                    // Total de bytes
                    total: blob.size || 1024
                });
                // Disparamos el evento de éxito load
                this._despachar("load");
                // Disparamos el evento de finalización absoluta loadend
                this._despachar("loadend");
            };

            // Si el objeto blob posee el método arrayBuffer() de la API de streams
            if (typeof blob.arrayBuffer === "function") {
                // Obtenemos el búfer binario de forma asíncrona
                blob.arrayBuffer().then(buf => {
                    // Convertimos el búfer a string Base64 con Buffer en Node
                    finalizar(Buffer.from(buf).toString("base64"));
                }).catch(err => {
                    // Asignación de error en fallo
                    this.error = err;
                    // Despacho de error
                    this._despachar("error");
                    // Despacho de loadend
                    this._despachar("loadend");
                });
            // Si es un Blob simulado, usamos su texto interno codificado en Base64
            } else {
                // Conversión de _raw a Base64
                finalizar(Buffer.from(blob._raw || "datos_binarios").toString("base64"));
            }
        }, 50); // Simulación con 50 milisegundos de latencia
    }
}

// Determinamos la clase de FileReader a emplear: nativa si existe en window, o el simulador en Node
const ReaderClass = (typeof globalThis.FileReader !== "undefined") ? globalThis.FileReader : SimuladorFileReader;
// Determinamos la clase de Blob a emplear: nativa si existe, o el simulador
const BlobClass = (typeof globalThis.Blob !== "undefined") ? globalThis.Blob : SimuladorBlob;
// Determinamos la clase de File a emplear: nativa si existe, o el simulador
const FileClass = (typeof globalThis.File !== "undefined") ? globalThis.File : SimuladorFile;

// ==============================================================================
// BLOQUE 1: INTRODUCCIÓN A LA FILEREADER API
// ==============================================================================
// Llamada a la función divisora para identificar el primer bloque temático
imprimirSeparador(1, "INTRODUCCIÓN A LA FILEREADER API Y LECTURA EN CLIENTE");

// Explicación didáctica sobre el propósito de la API
console.log("La FileReader API de HTML5 permite leer de forma asíncrona archivos del usuario");
// Detalle sobre el origen local de los archivos procesados
console.log("almacenados en su disco duro local utilizando objetos de tipo File o Blob.");
// Encabezado de beneficios
console.log("\nVentajas clave del procesamiento en el cliente:");
// Ventaja 1: Reducción drástica del ancho de banda de red
console.log("1. Cero consumo de ancho de banda: No se envían megabytes al servidor.");
// Ventaja 2: Alta velocidad de respuesta para previsualizaciones
console.log("2. Respuesta en milisegundos: Ideal para previsualizaciones instantáneas.");
// Ventaja 3: Garantía de privacidad local
console.log("3. Máxima privacidad: El archivo nunca abandona la máquina del usuario.");
// Encabezado de estado
console.log(`\nEstado del entorno:`);
// Impresión del tipo de dato de la clase constructora disponible en el runtime actual
console.log("- Clase constructora disponible:", typeof ReaderClass);
// Impresión del tipo de dato del constructor de Blob disponible
console.log("- Soporte de Blob nativo/simulado:", typeof BlobClass);

// ==============================================================================
// BLOQUE 2: OBJETOS FILE Y BLOB FRENTE AL SERVIDOR TRADICIONAL
// ==============================================================================
// Llamada a la función divisora para el bloque 2
imprimirSeparador(2, "OBJETOS FILE Y BLOB VS. SERVIDOR TRADICIONAL");

// Explicación de qué constituye un Blob
console.log("1. ¿Qué es un 'Blob' (Binary Large Object)?");
// Definición de inmutabilidad y almacenamiento de bytes crudos
console.log("   Representa un trozo de datos crudos inmutables de longitud fija.");
// Ejemplo sintáctico de instanciación de un Blob
console.log("   Ejemplo: new Blob(['Hola mundo'], { type: 'text/plain' });");

// Explicación de qué constituye un File
console.log("\n2. ¿Qué es un 'File'?");
// Explicación de la herencia de File respecto a Blob
console.log("   Es una subclase específica de Blob que añade metadatos del sistema operativo:");
// Detalle de la propiedad file.name
console.log("   - file.name: Nombre del archivo ('presupuesto.xlsx')");
// Detalle de la propiedad file.size
console.log("   - file.size: Tamaño en bytes (1048576 = 1 MB)");
// Detalle de la propiedad file.type
console.log("   - file.type: Tipo MIME ('application/pdf', 'image/png')");
// Detalle de la propiedad file.lastModified
console.log("   - file.lastModified: Timestamp de última edición");

// Instanciación de un objeto File de prueba con contenido de texto plano
const archivoEjemplo = new FileClass(["Contenido de prueba"], "informe.txt", { type: "text/plain" });
// Encabezado de inspección
console.log("\nInspección de un objeto File:");
// Impresión del nombre del archivo de prueba
console.log("- Nombre:", archivoEjemplo.name);
// Impresión del tamaño en bytes del archivo
console.log("- Tamaño:", archivoEjemplo.size, "bytes");
// Impresión del tipo MIME detectado
console.log("- Tipo MIME:", archivoEjemplo.type);

// ==============================================================================
// BLOQUE 3: LECTURA TEXTUAL CON readAsText()
// ==============================================================================
// Llamada a la función divisora para el bloque 3
imprimirSeparador(3, "LECTURA DE CONTENIDO TEXTUAL CON readAsText()");

// Explicación del funcionamiento de readAsText
console.log("El método 'readAsText(blob[, encoding])' interpreta los bytes del archivo");
// Aclaración sobre el tipo de dato entregado (string)
console.log("como una cadena de texto (string).");
// Explicación de los parámetros admitidos por el método
console.log("Parámetros: blob (File/Blob), encoding (opcional, por defecto 'UTF-8').");
// Aviso de inicio de la prueba práctica
console.log("\n-> Ejecutando lectura asíncrona de un documento JSON...");

// Creación de un archivo simulado con sintaxis JSON formateada
const jsonMock = new FileClass([
    '{\n  "curso": "JS Master Level",\n  "modulo": "FileReader",\n  "nivel": "Avanzado"\n}'
], "curso.json", { type: "application/json" });

// Instanciación de un nuevo lector FileReader para procesar el JSON
const lectorTexto = new ReaderClass();

// Registro del escuchador 'load' que se activará cuando la lectura culmine con éxito
lectorTexto.addEventListener("load", () => {
    // Mensaje de éxito informando que el método concluyó
    console.log("✅ [readAsText completado] Contenido extraído:");
    // Imprimimos el resultado textual disponible en la propiedad reader.result
    console.log(lectorTexto.result);
});

// Iniciamos la lectura asíncrona del archivo pasando el blob y la codificación UTF-8
lectorTexto.readAsText(jsonMock, "UTF-8");

// ==============================================================================
// BLOQUE 4: CODIFICACIÓN BASE64 CON readAsDataURL()
// ==============================================================================
// Configuramos un temporizador para encadenar las salidas pedagógicas ordenadamente en consola
setTimeout(() => {
    // Encabezado divisor del bloque 4
    imprimirSeparador(4, "CODIFICACIÓN EN DATA URL CON readAsDataURL()");

    // Explicación técnica del método readAsDataURL
    console.log("El método 'readAsDataURL(blob)' transforma los bytes binarios del archivo");
    // Detalle sobre la conversión a Base64 y el prefijo data:
    console.log("en una cadena de caracteres codificada en Base64 con el esquema 'data:'.");
    // Explicación del caso de uso fundamental
    console.log("\nPropósito principal:");
    // Ejemplo de asignación a elemento img del DOM
    console.log("Asignar el resultado directamente a elementos gráficos del DOM:");
    // Demostración de asignación directa
    console.log("  miImagen.src = reader.result;");

    // Instanciación de un archivo simulado con tipo MIME de imagen PNG
    const imgMock = new FileClass(["BINARIO_FOTO_PNG"], "avatar.png", { type: "image/png" });
    // Instanciación de un nuevo lector independiente para procesar la imagen
    const lectorImagen = new ReaderClass();

    // Registro del escuchador de éxito 'load'
    lectorImagen.addEventListener("load", () => {
        // Mensaje de éxito de generación de la URI
        console.log("✅ [readAsDataURL completado] URI generada:");
        // Impresión de la cadena Base64 generada en reader.result
        console.log(lectorImagen.result);
    });

    // Invocación del método de codificación en Data URL
    lectorImagen.readAsDataURL(imgMock);
}, 120);

// ==============================================================================
// BLOQUE 5: ANATOMÍA DE UNA DATA URI
// ==============================================================================
// Temporizador para el bloque 5
setTimeout(() => {
    // Encabezado divisor del bloque 5
    imprimirSeparador(5, "ANATOMÍA DE UNA DATA URI");

    // Explicación de la estructura del estándar RFC 2397
    console.log("Una Data URI es una cadena autocontenida que encapsula los datos:");
    // Esquema canónico de la URI
    console.log("  data:[<mediatype>][;base64],<datos>");
    // Encabezado de desglose de componentes
    console.log("\nDesglose de partes:");
    // Componente 1: Esquema identificador
    console.log("1. 'data:'             -> Esquema identificador del protocolo.");
    // Componente 2: Tipo MIME del recurso
    console.log("2. 'image/png'         -> Tipo MIME del recurso incrustado.");
    // Componente 3: Calificador de codificación
    console.log("3. ';base64'           -> Indicador de codificación en Base64.");
    // Componente 4: Carga útil codificada
    console.log("4. 'iVBORw0KGgoAAA...' -> Carga binaria codificada en 64 caracteres ASCII.");
    // Explicación del sobrecoste de almacenamiento
    console.log("\nImpacto en peso:");
    // Advertencia sobre el incremento del 33%
    console.log("Base64 aumenta el peso del archivo un 33% adicional respecto al binario crudo.");
}, 240);

// ==============================================================================
// BLOQUE 6: CASO PRÁCTICO 1: GALERÍA DINÁMICA MULTIARCHIVO
// ==============================================================================
// Temporizador para el bloque 6
setTimeout(() => {
    // Encabezado divisor del bloque 6
    imprimirSeparador(6, "CASO PRÁCTICO 1: GALERÍA DINÁMICA MULTIARCHIVO");

    // Explicación del uso del atributo multiple en inputs
    console.log("Permite seleccionar múltiples imágenes mediante <input type='file' multiple>.");
    // Estrategia de iteración concurrente
    console.log("Para procesarlas de forma concurrente, iteramos sobre cada archivo:");

    // Arreglo de archivos de prueba que simulan una selección múltiple del usuario
    const fotos = [
        // Archivo 1: Imagen JPEG
        new FileClass(["pixel1"], "foto_playa.jpg", { type: "image/jpeg" }),
        // Archivo 2: Imagen PNG
        new FileClass(["pixel2"], "foto_montana.png", { type: "image/png" })
    ];

    // Log informativo sobre la cantidad de archivos a procesar
    console.log(`Procesando colección de ${fotos.length} imágenes...`);

    // Iteración funcional sobre cada archivo de la lista
    fotos.forEach((foto, idx) => {
        // REGLA CLAVE: Instanciamos un lector ÚNICO e INDEPENDIENTE por cada archivo individual
        const lectorGaleria = new ReaderClass();
        // Registramos el manejador load para este lector en particular
        lectorGaleria.addEventListener("load", () => {
            // Imprimimos la confirmación de la miniatura generada con un fragmento de su Data URL
            console.log(`🖼️ [Miniatura ${idx + 1}] Creada para: ${foto.name} | DataURL: ${lectorGaleria.result.slice(0, 35)}...`);
        });
        // Iniciamos la lectura de este archivo específico
        lectorGaleria.readAsDataURL(foto);
    });
}, 360);

// ==============================================================================
// BLOQUE 7: ITERACIÓN PARALELA: REGLA DE UNA INSTANCIA POR ARCHIVO
// ==============================================================================
// Temporizador para el bloque 7
setTimeout(() => {
    // Encabezado divisor del bloque 7
    imprimirSeparador(7, "REGLA DE ORO: UNA INSTANCIA DE FILEREADER POR ARCHIVO");

    // Alerta sobre el error conceptual más extendido
    console.log("⚠️ ERROR CRÍTICO COMÚN EN ENTREVISTAS:");
    // Demostración del anti-patrón de reutilizar la variable reader
    console.log("Intentar reutilizar una misma variable 'reader' dentro de un bucle 'forEach':");
    // Código erróneo ilustrativo
    console.log(`
const reader = new FileReader(); // ❌ ERROR
archivos.forEach(file => {
    reader.readAsDataURL(file); // Lanzará: InvalidStateError
});
`);
    // Encabezado de explicación teórica
    console.log("👉 EXPLICACIÓN TÉCNICA:");
    // Explicación de la máquina de estados finita
    console.log("Un FileReader es una máquina de estados (EMPTY -> LOADING -> DONE).");
    // Imposibilidad de manejar dos lecturas concurrentes en la misma instancia
    console.log("No puede procesar dos flujos asíncronos en paralelo simultáneamente.");
    // Regla de solución recomendada
    console.log("Solución correcta: 'new FileReader()' dentro del cuerpo de la iteración.");
}, 480);

// ==============================================================================
// BLOQUE 8: CASO PRÁCTICO 2: INTEGRACIÓN CON DRAG & DROP
// ==============================================================================
// Temporizador para el bloque 8
setTimeout(() => {
    // Encabezado divisor del bloque 8
    imprimirSeparador(8, "CASO PRÁCTICO 2: INTEGRACIÓN CON DRAG & DROP");

    // Introducción a la combinación con eventos de arrastre
    console.log("La verdadera potencia interactiva surge con los eventos de arrastre nativos:");
    // Paso 1: Cancelación de comportamiento por defecto
    console.log("1. Eventos 'dragover' y 'drop':");
    // Explicación de la necesidad de preventDefault
    console.log("   DEBES invocar 'e.preventDefault()' en ambos para evitar que el navegador");
    // Aclaración sobre el riesgo de navegación de pestaña
    console.log("   abandone tu aplicación y abra el archivo en una pestaña nueva.");
    // Paso 2: Origen de los datos arrastrados
    console.log("2. Extracción de archivos:");
    // Muestra de la propiedad dataTransfer.files
    console.log("   const archivos = e.dataTransfer.files; // Colección FileList");
    // Paso 3: Validación y enrutamiento por tipo
    console.log("3. Comprobación y lectura:");
    // Enrutamiento de métodos según file.type
    console.log("   Determinar mediante 'file.type' si leer con readAsText o readAsDataURL.");
}, 600);

// ==============================================================================
// BLOQUE 9: EL CICLO DE VIDA DE EVENTOS DE FILEREADER
// ==============================================================================
// Temporizador para el bloque 9
setTimeout(() => {
    // Encabezado divisor del bloque 9
    imprimirSeparador(9, "EL CICLO DE VIDA DE EVENTOS DE FILEREADER");

    // Introducción a los 6 eventos del ciclo
    console.log("FileReader emite 6 eventos durante su ciclo de ejecución:");
    // Evento 1: loadstart
    console.log("1. 'loadstart' -> Se inicia el proceso de lectura (e.loaded = 0).");
    // Evento 2: progress
    console.log("2. 'progress'  -> Emisión periódica de bytes leídos (e.loaded / e.total).");
    // Evento 3: load
    console.log("3. 'load'      -> Lectura completada con éxito (datos en reader.result).");
    // Evento 4: error
    console.log("4. 'error'     -> Fallo de lectura o permisos (detalle en reader.error).");
    // Evento 5: abort
    console.log("5. 'abort'     -> Lectura cancelada por el usuario (reader.abort()).");
    // Evento 6: loadend
    console.log("6. 'loadend'   -> Finalización formal absoluta (siempre se dispara al final).");
}, 720);

// ==============================================================================
// BLOQUE 10: MONITOREO DE BYTES Y CÁLCULO DE PROGRESO
// ==============================================================================
// Temporizador para el bloque 10
setTimeout(() => {
    // Encabezado divisor del bloque 10
    imprimirSeparador(10, "MONITOREO DE BYTES Y CÁLCULO DE PROGRESO");

    // Justificación de UX para archivos grandes
    console.log("En archivos pesados, la experiencia de usuario (UX) exige una barra de carga:");
    // Fórmula matemática de cálculo
    console.log("Estructura del cálculo porcentual:");
    // Código de ejemplo
    console.log(`
reader.addEventListener("progress", (e) => {
    if (e.lengthComputable) {
        const porcentaje = Math.round((e.loaded / e.total) * 100);
        barra.style.width = porcentaje + "%";
    }
});`);

    // Creación de un archivo simulado con 5000 bytes para demostrar el evento progress
    const archivoPesadoMock = new FileClass(["X".repeat(5000)], "video_render.mp4", { type: "video/mp4" });
    // Instanciación de lector para monitoreo
    const lectorProgreso = new ReaderClass();

    // Registro del escuchador progress
    lectorProgreso.addEventListener("progress", (e) => {
        // Verificamos que la longitud sea computable
        if (e.lengthComputable) {
            // Cálculo del porcentaje entero redondeado
            const pct = Math.round((e.loaded / e.total) * 100);
            // Log en consola reflejando los bytes transferidos y el porcentaje
            console.log(`📊 [Progreso en Vivo] ${pct}% (${e.loaded} de ${e.total} bytes leídos)`);
        }
    });

    // Iniciamos la lectura para disparar los eventos progress
    lectorProgreso.readAsText(archivoPesadoMock);
}, 840);

// ==============================================================================
// BLOQUE 11: CANCELACIÓN ASÍNCRONA CON reader.abort()
// ==============================================================================
// Temporizador para el bloque 11
setTimeout(() => {
    // Encabezado divisor del bloque 11
    imprimirSeparador(11, "CANCELACIÓN ASÍNCRONA CON reader.abort()");

    // Explicación de la función abort()
    console.log("El método 'abort()' detiene de inmediato cualquier operación de lectura activa.");
    // Casos de uso prácticos de cancelación
    console.log("Útil cuando el usuario cancela la carga de un archivo erróneo o demasiado pesado.");

    // Archivo de prueba para demostrar el aborto
    const archivoParaAbortar = new FileClass(["DATOS_A_CANCELAR"], "archivo_largo.bin");
    // Lector dedicado a la prueba de abort
    const lectorAbortable = new ReaderClass();

    // Escuchador loadstart para programar la cancelación
    lectorAbortable.addEventListener("loadstart", () => {
        // Aviso de inicio
        console.log("▶ Iniciando lectura para abortar...");
        // Simulamos que a los 15 ms el usuario hace clic en un botón de cancelar
        setTimeout(() => {
            // Mensaje de acción
            console.log("🛑 Ejecutando lectorAbortable.abort()...");
            // Invocamos el método de cancelación
            lectorAbortable.abort();
        }, 15);
    });

    // Escuchador del evento abort
    lectorAbortable.addEventListener("abort", () => {
        // Mensaje confirmando la captura del evento abort
        console.log("⚠️ [Evento abort] La operación fue cancelada con éxito.");
    });

    // Escuchador del evento loadend
    lectorAbortable.addEventListener("loadend", () => {
        // Mensaje confirmando que loadend se dispara incluso tras abortar
        console.log("🏁 [Evento loadend] Recursos liberados tras la cancelación.");
    });

    // Iniciamos la lectura
    lectorAbortable.readAsText(archivoParaAbortar);
}, 980);

// ==============================================================================
// BLOQUE 12: ANALOGÍA 1 DEL MUNDO REAL: EL TRADUCTOR EN CABINA 🎙️
// ==============================================================================
// Temporizador para el bloque 12
setTimeout(() => {
    // Encabezado divisor del bloque 12
    imprimirSeparador(12, "ANALOGÍA 1: EL TRADUCTOR EN CABINA 🎙️ (readAsText vs readAsDataURL)");

    // Metáfora introductoria
    console.log("Imagina que tienes una carta sellada escrita en otro idioma:\n");
    // Caso 1: readAsText
    console.log("1. 'readAsText()':");
    // Explicación de la traducción a voz humana
    console.log("   Un traductor abre la carta y te la lee en voz alta en español.");
    // Conclusión del formato legible
    console.log("   El resultado final es texto directo, entendible por un ser humano.");

    // Caso 2: readAsDataURL
    console.log("\n2. 'readAsDataURL()':");
    // Explicación de la fotografía en Morse
    console.log("   Toman una fotografía de la carta y la traducen a un telegrama en código");
    // Destino no humano del mensaje
    console.log("   Morse en una sola línea continua. Ninguna persona se sienta a leerlo,");
    // Consumo directo por la máquina
    console.log("   sino que se lo entregas a otra máquina (un <img>) para que lo pinte de inmediato.");
}, 1120);

// ==============================================================================
// BLOQUE 13: ANALOGÍA 2 DEL MUNDO REAL: LA BÁSCULA DEL CAMIÓN DE GRANOS 🚚
// ==============================================================================
// Temporizador para el bloque 13
setTimeout(() => {
    // Encabezado divisor del bloque 13
    imprimirSeparador(13, "ANALOGÍA 2: LA BÁSCULA DEL CAMIÓN DE GRANOS 🚚 (progress y loadend)");

    // Metáfora de la descarga de granos
    console.log("Imagina un camión tolva descargando grano en un silo agrícola:\n");
    // Analogía para el evento progress
    console.log("1. 'progress':");
    // Medición continua de toneladas
    console.log("   Es la báscula de pesaje que va indicando tonelada por tonelada cuánto grano ha caído,");
    // Monitoreo del porcentaje vaciado
    console.log("   permitiendo saber en todo momento qué porcentaje del camión se ha vaciado.");

    // Analogía para el evento loadend
    console.log("\n2. 'loadend':");
    // El cierre definitivo de la compuerta
    console.log("   Es el pitido de la compuerta que se cierra. No importa si el camión se descargó");
    // Disparo garantizado en todos los escenarios
    console.log("   por completo ('load'), si se atascó ('error') o si el conductor se marchó ('abort'),");
    // Conclusión de recursos desocupados
    console.log("   la compuerta siempre se cierra al final y el proceso queda cerrado formalmente.");
}, 1240);

// ==============================================================================
// BLOQUE 14: BUENAS PRÁCTICAS EN APLICACIONES REALES
// ==============================================================================
// Temporizador para el bloque 14
setTimeout(() => {
    // Encabezado divisor del bloque 14
    imprimirSeparador(14, "BUENAS PRÁCTICAS EN APLICACIONES REALES");

    // Buena práctica 1: Orden de suscripción
    console.log("1. Suscribir escuchadores ANTES de invocar el método de lectura:");
    // Explicación del riesgo de race condition
    console.log("   Evita condiciones de carrera registrando 'load', 'progress' y 'error' previamente.");

    // Buena práctica 2: Validación defensiva previa
    console.log("\n2. Validar tamaño y tipo MIME antes de leer:");
    // Código de ejemplo de validación
    console.log("   if (file.size > 5 * 1024 * 1024) return alert('Máximo 5 MB');");
    // Advertencia sobre memoria RAM
    console.log("   Cargar archivos gigantescos con readAsDataURL puede agotar la memoria RAM.");

    // Buena práctica 3: Alternativa createObjectURL
    console.log("\n3. Alternativa moderna: URL.createObjectURL(blob):");
    // Comparativa de eficiencia y consumo de recursos
    console.log("   Si solo necesitas mostrar una imagen sin manipular su cadena Base64,");
    // Rendimiento superior
    console.log("   'URL.createObjectURL(file)' es instantáneo y consume muchísima menos memoria.");
}, 1360);

// ==============================================================================
// BLOQUE 15: ERRORES COMUNES Y CÓMO EVITARLOS
// ==============================================================================
// Temporizador para el bloque 15
setTimeout(() => {
    // Encabezado divisor del bloque 15
    imprimirSeparador(15, "ERRORES COMUNES Y CÓMO EVITARLOS");

    // Error 1: Lectura sincrónica errónea
    console.log("1. Intentar acceder a 'reader.result' fuera de los eventos:");
    // Explicación del desfase temporal de asincronía
    console.log("   Como la lectura es asíncrona, llamar a 'reader.result' inmediatamente");
    // Consecuencia: resultado null
    console.log("   después de 'reader.readAsText()' devolverá null.");

    // Error 2: Confundir lectura local con transporte de red
    console.log("\n2. Confundir la lectura en cliente con la subida al servidor:");
    // Aclaración sobre el alcance local de FileReader
    console.log("   FileReader NO sube nada por internet. Opera 100% en local.");
    // Requisito de fetch para persistencia
    console.log("   Para subirlo a un backend, debes usar 'fetch()' con FormData o multipart.");
}, 1480);

// ==============================================================================
// BLOQUE 16: RESOLUCIÓN DE LOS 3 RETOS PRÁCTICOS
// ==============================================================================
// Temporizador para el bloque 16 final
setTimeout(() => {
    // Encabezado divisor del bloque 16
    imprimirSeparador(16, "RESOLUCIÓN DE LOS 3 RETOS PRÁCTICOS DEL MÓDULO");

    // --- RETO 1: Validador JSON Seguro ---
    console.log("--- RETO NIVEL 1: Lector y Validador JSON Seguro con try / catch ---");
    // Definición de la función de validación
    function validarJSON(archivo) {
        // Instanciación de lector
        const lector = new ReaderClass();
        // Escuchador de carga
        lector.addEventListener("load", () => {
            // Bloque seguro try
            try {
                // Parseo del texto JSON
                const parseado = JSON.parse(lector.result);
                // Reporte de validación exitosa
                console.log("[Reto 1] JSON verificado con éxito:", parseado);
            // Captura de excepción en caso de sintaxis corrompida
            } catch (err) {
                // Notificación de error sintáctico
                console.error("[Reto 1] ❌ Error sintáctico en JSON:", err.message);
            }
        });
        // Inicio de lectura de texto
        lector.readAsText(archivo, "UTF-8");
    }
    // Ejecución de prueba con JSON válido
    validarJSON(new FileClass(['{"usuario":"admin","activo":true}'], "datos.json"));

    // --- RETO 2: Discriminación de Tipo MIME ---
    console.log("\n--- RETO NIVEL 2: Discriminación de Tipo MIME en Drag & Drop ---");
    // Definición de la función de procesamiento según tipo
    function procesarArchivoDrop(archivo) {
        // Instancia de lector
        const lector = new ReaderClass();
        // Si el archivo es una imagen
        if (archivo.type.startsWith("image/")) {
            // Escuchador para renderizar en galería
            lector.addEventListener("load", () => {
                // Log de imagen procesada como DataURL
                console.log(`[Reto 2] 🖼️ Imagen lista para galería: ${archivo.name}`);
            });
            // Leemos como DataURL
            lector.readAsDataURL(archivo);
        // Si el archivo es texto o código
        } else {
            // Escuchador para renderizar en bloque de texto
            lector.addEventListener("load", () => {
                // Log de texto plano leído
                console.log(`[Reto 2] 📄 Documento de texto leído: ${archivo.name}`);
            });
            // Leemos como texto plano
            lector.readAsText(archivo, "UTF-8");
        }
    }
    // Prueba con archivo de texto
    procesarArchivoDrop(new FileClass(["texto plano"], "notas.txt", { type: "text/plain" }));
    // Prueba con archivo de imagen
    procesarArchivoDrop(new FileClass(["binario_img"], "foto.png", { type: "image/png" }));

    // --- RETO 3: Clase Gestora con Progreso y Abort ---
    console.log("\n--- RETO NIVEL 3: Clase Gestora de Lectura con Progreso y Abort ---");
    // Declaración de clase orientada a objetos para gestionar cargas complejas
    class GestorLectura {
        // Constructor que recibe el archivo a gestionar
        constructor(archivo) {
            // Asignación de propiedad archivo
            this.archivo = archivo;
            // Instanciación de lector asociado
            this.lector = new ReaderClass();
            // Escuchador de avance de bytes
            this.lector.addEventListener("progress", (e) => {
                // Verificación de computabilidad
                if (e.lengthComputable) {
                    // Cálculo porcentual
                    console.log(`[Reto 3] 📊 Progreso: ${Math.round((e.loaded / e.total) * 100)}%`);
                }
            });
            // Escuchador de conclusión con éxito
            this.lector.addEventListener("load", () => {
                // Reporte de finalización satisfactoria
                console.log("[Reto 3] ✅ Lectura concluida satisfactoriamente");
            });
            // Escuchador de cancelación
            this.lector.addEventListener("abort", () => {
                // Reporte de aborto
                console.log("[Reto 3] 🛑 Lectura abortada por el usuario");
            });
        }
        // Método público para iniciar la lectura
        iniciar() { this.lector.readAsText(this.archivo); }
        // Método público para cancelar la lectura
        abortar() { this.lector.abort(); }
    }

    // Instanciación del gestor con un archivo de prueba
    const tarea = new GestorLectura(new FileClass(["DATOS_LARGOS"], "bundle.js"));
    // Iniciamos la tarea de lectura
    tarea.iniciar();

    // Mensaje de cierre final de la suite formativa
    setTimeout(() => {
        // Línea divisoria de fin
        console.log("\n" + "=".repeat(78));
        // Mensaje de felicitación
        console.log("🎉 ¡MÓDULO DE LA FILEREADER API COMPLETADO CON ÉXITO!");
        // Cierre visual
        console.log("=".repeat(78) + "\n");
    }, 150);
}, 1600);
