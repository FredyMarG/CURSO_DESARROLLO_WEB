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

"use strict";

// Función auxiliar para imprimir divisores pedagógicos en la consola
function imprimirSeparador(numeroBloque, titulo) {
    console.log("\n" + "=".repeat(78));
    console.log(`📌 BLOQUE ${numeroBloque}: ${titulo}`);
    console.log("=".repeat(78));
}

// ==============================================================================
// COMPATIBILIDAD UNIVERSAL: SIMULADOR DE FILEREADER PARA NODE.JS Y NAVEGADORES
// ==============================================================================
// En navegadores existe window.FileReader de forma nativa. Para garantizar que
// este archivo pueda ejecutarse limpiamente tanto en Node.js como en navegadores
// (incluso bajo protocolo file:///), proveemos un simulador de alta fidelidad.
class SimuladorBlob {
    constructor(partes = [], options = {}) {
        this.type = options.type || "";
        this.name = options.name || "archivo.bin";
        
        // Unimos el contenido como texto o búfer
        let contenidoStr = "";
        for (const parte of partes) {
            if (typeof parte === "string") {
                contenidoStr += parte;
            } else if (parte instanceof Uint8Array || Buffer.isBuffer(parte)) {
                contenidoStr += parte.toString();
            } else if (parte instanceof SimuladorBlob) {
                contenidoStr += parte._raw;
            }
        }
        this._raw = contenidoStr;
        this.size = Buffer.byteLength(this._raw, "utf-8");
    }
}

class SimuladorFile extends SimuladorBlob {
    constructor(partes = [], nombre = "documento.txt", options = {}) {
        super(partes, { ...options, name: nombre });
        this.name = nombre;
        this.lastModified = Date.now();
    }
}

class SimuladorFileReader {
    constructor() {
        this.EMPTY = 0;
        this.LOADING = 1;
        this.DONE = 2;
        this.readyState = this.EMPTY;
        
        this.result = null;
        this.error = null;
        this._listeners = {};
        this._abortado = false;
    }

    addEventListener(event, callback) {
        if (!this._listeners[event]) this._listeners[event] = [];
        this._listeners[event].push(callback);
    }

    removeEventListener(event, callback) {
        if (!this._listeners[event]) return;
        this._listeners[event] = this._listeners[event].filter(fn => fn !== callback);
    }

    _despachar(event, data = {}) {
        const evtObj = { target: this, type: event, ...data };
        if (this[`on${event}`]) this[`on${event}`](evtObj);
        if (this._listeners[event]) {
            this._listeners[event].forEach(fn => fn(evtObj));
        }
    }

    abort() {
        if (this.readyState === this.LOADING) {
            this._abortado = true;
            this.readyState = this.DONE;
            this.result = null;
            this._despachar("abort");
            this._despachar("loadend");
        }
    }

    readAsText(blob, encoding = "UTF-8") {
        if (this.readyState === this.LOADING) {
            throw new Error("InvalidStateError: La instancia ya está ejecutando una lectura activa.");
        }

        this.readyState = this.LOADING;
        this._abortado = false;
        this._despachar("loadstart");

        // Simulación asíncrona de progreso y entrega
        const total = blob.size || 1024;
        const pasos = 3;
        let pasoActual = 1;

        const intervalo = setInterval(() => {
            if (this._abortado) {
                clearInterval(intervalo);
                return;
            }

            const cargado = Math.min(total, Math.round((pasoActual / pasos) * total));
            this._despachar("progress", {
                lengthComputable: true,
                loaded: cargado,
                total: total
            });

            if (cargado >= total) {
                clearInterval(intervalo);
                this.readyState = this.DONE;

                const finalizar = (texto) => {
                    this.result = texto;
                    this._despachar("load");
                    this._despachar("loadend");
                };

                if (typeof blob.text === "function") {
                    blob.text().then(txt => finalizar(txt)).catch(err => {
                        this.error = err;
                        this._despachar("error");
                        this._despachar("loadend");
                    });
                } else {
                    finalizar(blob._raw || String(blob));
                }
            }
            pasoActual++;
        }, 30);
    }

    readAsDataURL(blob) {
        if (this.readyState === this.LOADING) {
            throw new Error("InvalidStateError: La instancia ya está ejecutando una lectura activa.");
        }

        this.readyState = this.LOADING;
        this._abortado = false;
        this._despachar("loadstart");

        setTimeout(() => {
            if (this._abortado) return;

            const finalizar = (base64Str) => {
                const mime = blob.type || "application/octet-stream";
                this.result = `data:${mime};base64,${base64Str}`;
                this.readyState = this.DONE;

                this._despachar("progress", {
                    lengthComputable: true,
                    loaded: blob.size || 1024,
                    total: blob.size || 1024
                });
                this._despachar("load");
                this._despachar("loadend");
            };

            if (typeof blob.arrayBuffer === "function") {
                blob.arrayBuffer().then(buf => {
                    finalizar(Buffer.from(buf).toString("base64"));
                }).catch(err => {
                    this.error = err;
                    this._despachar("error");
                    this._despachar("loadend");
                });
            } else {
                finalizar(Buffer.from(blob._raw || "datos_binarios").toString("base64"));
            }
        }, 50);
    }
}

// Exponemos el lector adecuado para el entorno
const ReaderClass = (typeof globalThis.FileReader !== "undefined") ? globalThis.FileReader : SimuladorFileReader;
const BlobClass = (typeof globalThis.Blob !== "undefined") ? globalThis.Blob : SimuladorBlob;
const FileClass = (typeof globalThis.File !== "undefined") ? globalThis.File : SimuladorFile;

// ==============================================================================
// BLOQUE 1: INTRODUCCIÓN A LA FILEREADER API
// ==============================================================================
imprimirSeparador(1, "INTRODUCCIÓN A LA FILEREADER API Y LECTURA EN CLIENTE");

console.log("La FileReader API de HTML5 permite leer de forma asíncrona archivos del usuario");
console.log("almacenados en su disco duro local utilizando objetos de tipo File o Blob.");
console.log("\nVentajas clave del procesamiento en el cliente:");
console.log("1. Cero consumo de ancho de banda: No se envían megabytes al servidor.");
console.log("2. Respuesta en milisegundos: Ideal para previsualizaciones instantáneas.");
console.log("3. Máxima privacidad: El archivo nunca abandona la máquina del usuario.");
console.log(`\nEstado del entorno:`);
console.log("- Clase constructora disponible:", typeof ReaderClass);
console.log("- Soporte de Blob nativo/simulado:", typeof BlobClass);

// ==============================================================================
// BLOQUE 2: OBJETOS FILE Y BLOB FRENTE AL SERVIDOR TRADICIONAL
// ==============================================================================
imprimirSeparador(2, "OBJETOS FILE Y BLOB VS. SERVIDOR TRADICIONAL");

console.log("1. ¿Qué es un 'Blob' (Binary Large Object)?");
console.log("   Representa un trozo de datos crudos inmutables de longitud fija.");
console.log("   Ejemplo: new Blob(['Hola mundo'], { type: 'text/plain' });");

console.log("\n2. ¿Qué es un 'File'?");
console.log("   Es una subclase específica de Blob que añade metadatos del sistema operativo:");
console.log("   - file.name: Nombre del archivo ('presupuesto.xlsx')");
console.log("   - file.size: Tamaño en bytes (1048576 = 1 MB)");
console.log("   - file.type: Tipo MIME ('application/pdf', 'image/png')");
console.log("   - file.lastModified: Timestamp de última edición");

const archivoEjemplo = new FileClass(["Contenido de prueba"], "informe.txt", { type: "text/plain" });
console.log("\nInspección de un objeto File:");
console.log("- Nombre:", archivoEjemplo.name);
console.log("- Tamaño:", archivoEjemplo.size, "bytes");
console.log("- Tipo MIME:", archivoEjemplo.type);

// ==============================================================================
// BLOQUE 3: LECTURA TEXTUAL CON readAsText()
// ==============================================================================
imprimirSeparador(3, "LECTURA DE CONTENIDO TEXTUAL CON readAsText()");

console.log("El método 'readAsText(blob[, encoding])' interpreta los bytes del archivo");
console.log("como una cadena de texto (string).");
console.log("Parámetros: blob (File/Blob), encoding (opcional, por defecto 'UTF-8').");
console.log("\n-> Ejecutando lectura asíncrona de un documento JSON...");

const jsonMock = new FileClass([
    '{\n  "curso": "JS Master Level",\n  "modulo": "FileReader",\n  "nivel": "Avanzado"\n}'
], "curso.json", { type: "application/json" });

const lectorTexto = new ReaderClass();

lectorTexto.addEventListener("load", () => {
    console.log("✅ [readAsText completado] Contenido extraído:");
    console.log(lectorTexto.result);
});

lectorTexto.readAsText(jsonMock, "UTF-8");

// ==============================================================================
// BLOQUE 4: CODIFICACIÓN BASE64 CON readAsDataURL()
// ==============================================================================
setTimeout(() => {
    imprimirSeparador(4, "CODIFICACIÓN EN DATA URL CON readAsDataURL()");

    console.log("El método 'readAsDataURL(blob)' transforma los bytes binarios del archivo");
    console.log("en una cadena de caracteres codificada en Base64 con el esquema 'data:'.");
    console.log("\nPropósito principal:");
    console.log("Asignar el resultado directamente a elementos gráficos del DOM:");
    console.log("  miImagen.src = reader.result;");

    const imgMock = new FileClass(["BINARIO_FOTO_PNG"], "avatar.png", { type: "image/png" });
    const lectorImagen = new ReaderClass();

    lectorImagen.addEventListener("load", () => {
        console.log("✅ [readAsDataURL completado] URI generada:");
        console.log(lectorImagen.result);
    });

    lectorImagen.readAsDataURL(imgMock);
}, 120);

// ==============================================================================
// BLOQUE 5: ANATOMÍA DE UNA DATA URI
// ==============================================================================
setTimeout(() => {
    imprimirSeparador(5, "ANATOMÍA DE UNA DATA URI");

    console.log("Una Data URI es una cadena autocontenida que encapsula los datos:");
    console.log("  data:[<mediatype>][;base64],<datos>");
    console.log("\nDesglose de partes:");
    console.log("1. 'data:'             -> Esquema identificador del protocolo.");
    console.log("2. 'image/png'         -> Tipo MIME del recurso incrustado.");
    console.log("3. ';base64'           -> Indicador de codificación en Base64.");
    console.log("4. 'iVBORw0KGgoAAA...' -> Carga binaria codificada en 64 caracteres ASCII.");
    console.log("\nImpacto en peso:");
    console.log("Base64 aumenta el peso del archivo un 33% adicional respecto al binario crudo.");
}, 240);

// ==============================================================================
// BLOQUE 6: CASO PRÁCTICO 1: GALERÍA DINÁMICA MULTIARCHIVO
// ==============================================================================
setTimeout(() => {
    imprimirSeparador(6, "CASO PRÁCTICO 1: GALERÍA DINÁMICA MULTIARCHIVO");

    console.log("Permite seleccionar múltiples imágenes mediante <input type='file' multiple>.");
    console.log("Para procesarlas de forma concurrente, iteramos sobre cada archivo:");

    const fotos = [
        new FileClass(["pixel1"], "foto_playa.jpg", { type: "image/jpeg" }),
        new FileClass(["pixel2"], "foto_montana.png", { type: "image/png" })
    ];

    console.log(`Procesando colección de ${fotos.length} imágenes...`);

    fotos.forEach((foto, idx) => {
        const lectorGaleria = new ReaderClass();
        lectorGaleria.addEventListener("load", () => {
            console.log(`🖼️ [Miniatura ${idx + 1}] Creada para: ${foto.name} | DataURL: ${lectorGaleria.result.slice(0, 35)}...`);
        });
        lectorGaleria.readAsDataURL(foto);
    });
}, 360);

// ==============================================================================
// BLOQUE 7: ITERACIÓN PARALELA: REGLA DE UNA INSTANCIA POR ARCHIVO
// ==============================================================================
setTimeout(() => {
    imprimirSeparador(7, "REGLA DE ORO: UNA INSTANCIA DE FILEREADER POR ARCHIVO");

    console.log("⚠️ ERROR CRÍTICO COMÚN EN ENTREVISTAS:");
    console.log("Intentar reutilizar una misma variable 'reader' dentro de un bucle 'forEach':");
    console.log(`
const reader = new FileReader(); // ❌ ERROR
archivos.forEach(file => {
    reader.readAsDataURL(file); // Lanzará: InvalidStateError
});
`);
    console.log("👉 EXPLICACIÓN TÉCNICA:");
    console.log("Un FileReader es una máquina de estados (EMPTY -> LOADING -> DONE).");
    console.log("No puede procesar dos flujos asíncronos en paralelo simultáneamente.");
    console.log("Solución correcta: 'new FileReader()' dentro del cuerpo de la iteración.");
}, 480);

// ==============================================================================
// BLOQUE 8: CASO PRÁCTICO 2: INTEGRACIÓN CON DRAG & DROP
// ==============================================================================
setTimeout(() => {
    imprimirSeparador(8, "CASO PRÁCTICO 2: INTEGRACIÓN CON DRAG & DROP");

    console.log("La verdadera potencia interactiva surge con los eventos de arrastre nativos:");
    console.log("1. Eventos 'dragover' y 'drop':");
    console.log("   DEBES invocar 'e.preventDefault()' en ambos para evitar que el navegador");
    console.log("   abandone tu aplicación y abra el archivo en una pestaña nueva.");
    console.log("2. Extracción de archivos:");
    console.log("   const archivos = e.dataTransfer.files; // Colección FileList");
    console.log("3. Comprobación y lectura:");
    console.log("   Determinar mediante 'file.type' si leer con readAsText o readAsDataURL.");
}, 600);

// ==============================================================================
// BLOQUE 9: EL CICLO DE VIDA DE EVENTOS DE FILEREADER
// ==============================================================================
setTimeout(() => {
    imprimirSeparador(9, "EL CICLO DE VIDA DE EVENTOS DE FILEREADER");

    console.log("FileReader emite 6 eventos durante su ciclo de ejecución:");
    console.log("1. 'loadstart' -> Se inicia el proceso de lectura (e.loaded = 0).");
    console.log("2. 'progress'  -> Emisión periódica de bytes leídos (e.loaded / e.total).");
    console.log("3. 'load'      -> Lectura completada con éxito (datos en reader.result).");
    console.log("4. 'error'     -> Fallo de lectura o permisos (detalle en reader.error).");
    console.log("5. 'abort'     -> Lectura cancelada por el usuario (reader.abort()).");
    console.log("6. 'loadend'   -> Finalización formal absoluta (siempre se dispara al final).");
}, 720);

// ==============================================================================
// BLOQUE 10: MONITOREO DE BYTES Y CÁLCULO DE PROGRESO
// ==============================================================================
setTimeout(() => {
    imprimirSeparador(10, "MONITOREO DE BYTES Y CÁLCULO DE PROGRESO");

    console.log("En archivos pesados, la experiencia de usuario (UX) exige una barra de carga:");
    console.log("Estructura del cálculo porcentual:");
    console.log(`
reader.addEventListener("progress", (e) => {
    if (e.lengthComputable) {
        const porcentaje = Math.round((e.loaded / e.total) * 100);
        barra.style.width = porcentaje + "%";
    }
});`);

    const archivoPesadoMock = new FileClass(["X".repeat(5000)], "video_render.mp4", { type: "video/mp4" });
    const lectorProgreso = new ReaderClass();

    lectorProgreso.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            console.log(`📊 [Progreso en Vivo] ${pct}% (${e.loaded} de ${e.total} bytes leídos)`);
        }
    });

    lectorProgreso.readAsText(archivoPesadoMock);
}, 840);

// ==============================================================================
// BLOQUE 11: CANCELACIÓN ASÍNCRONA CON reader.abort()
// ==============================================================================
setTimeout(() => {
    imprimirSeparador(11, "CANCELACIÓN ASÍNCRONA CON reader.abort()");

    console.log("El método 'abort()' detiene de inmediato cualquier operación de lectura activa.");
    console.log("Útil cuando el usuario cancela la carga de un archivo erróneo o demasiado pesado.");

    const archivoParaAbortar = new FileClass(["DATOS_A_CANCELAR"], "archivo_largo.bin");
    const lectorAbortable = new ReaderClass();

    lectorAbortable.addEventListener("loadstart", () => {
        console.log("▶ Iniciando lectura para abortar...");
        setTimeout(() => {
            console.log("🛑 Ejecutando lectorAbortable.abort()...");
            lectorAbortable.abort();
        }, 15);
    });

    lectorAbortable.addEventListener("abort", () => {
        console.log("⚠️ [Evento abort] La operación fue cancelada con éxito.");
    });

    lectorAbortable.addEventListener("loadend", () => {
        console.log("🏁 [Evento loadend] Recursos liberados tras la cancelación.");
    });

    lectorAbortable.readAsText(archivoParaAbortar);
}, 980);

// ==============================================================================
// BLOQUE 12: ANALOGÍA 1 DEL MUNDO REAL: EL TRADUCTOR EN CABINA 🎙️
// ==============================================================================
setTimeout(() => {
    imprimirSeparador(12, "ANALOGÍA 1: EL TRADUCTOR EN CABINA 🎙️ (readAsText vs readAsDataURL)");

    console.log("Imagina que tienes una carta sellada escrita en otro idioma:\n");
    console.log("1. 'readAsText()':");
    console.log("   Un traductor abre la carta y te la lee en voz alta en español.");
    console.log("   El resultado final es texto directo, entendible por un ser humano.");

    console.log("\n2. 'readAsDataURL()':");
    console.log("   Toman una fotografía de la carta y la traducen a un telegrama en código");
    console.log("   Morse en una sola línea continua. Ninguna persona se sienta a leerlo,");
    console.log("   sino que se lo entregas a otra máquina (un <img>) para que lo pinte de inmediato.");
}, 1120);

// ==============================================================================
// BLOQUE 13: ANALOGÍA 2 DEL MUNDO REAL: LA BÁSCULA DEL CAMIÓN DE GRANOS 🚚
// ==============================================================================
setTimeout(() => {
    imprimirSeparador(13, "ANALOGÍA 2: LA BÁSCULA DEL CAMIÓN DE GRANOS 🚚 (progress y loadend)");

    console.log("Imagina un camión tolva descargando grano en un silo agrícola:\n");
    console.log("1. 'progress':");
    console.log("   Es la báscula de pesaje que va indicando tonelada por tonelada cuánto grano ha caído,");
    console.log("   permitiendo saber en todo momento qué porcentaje del camión se ha vaciado.");

    console.log("\n2. 'loadend':");
    console.log("   Es el pitido de la compuerta que se cierra. No importa si el camión se descargó");
    console.log("   por completo ('load'), si se atascó ('error') o si el conductor se marchó ('abort'),");
    console.log("   la compuerta siempre se cierra al final y el proceso queda cerrado formalmente.");
}, 1240);

// ==============================================================================
// BLOQUE 14: BUENAS PRÁCTICAS EN APLICACIONES REALES
// ==============================================================================
setTimeout(() => {
    imprimirSeparador(14, "BUENAS PRÁCTICAS EN APLICACIONES REALES");

    console.log("1. Suscribir escuchadores ANTES de invocar el método de lectura:");
    console.log("   Evita condiciones de carrera registrando 'load', 'progress' y 'error' previamente.");

    console.log("\n2. Validar tamaño y tipo MIME antes de leer:");
    console.log("   if (file.size > 5 * 1024 * 1024) return alert('Máximo 5 MB');");
    console.log("   Cargar archivos gigantescos con readAsDataURL puede agotar la memoria RAM.");

    console.log("\n3. Alternativa moderna: URL.createObjectURL(blob):");
    console.log("   Si solo necesitas mostrar una imagen sin manipular su cadena Base64,");
    console.log("   'URL.createObjectURL(file)' es instantáneo y consume muchísima menos memoria.");
}, 1360);

// ==============================================================================
// BLOQUE 15: ERRORES COMUNES Y CÓMO EVITARLOS
// ==============================================================================
setTimeout(() => {
    imprimirSeparador(15, "ERRORES COMUNES Y CÓMO EVITARLOS");

    console.log("1. Intentar acceder a 'reader.result' fuera de los eventos:");
    console.log("   Como la lectura es asíncrona, llamar a 'reader.result' inmediatamente");
    console.log("   después de 'reader.readAsText()' devolverá null.");

    console.log("\n2. Confundir la lectura en cliente con la subida al servidor:");
    console.log("   FileReader NO sube nada por internet. Opera 100% en local.");
    console.log("   Para subirlo a un backend, debes usar 'fetch()' con FormData o multipart.");
}, 1480);

// ==============================================================================
// BLOQUE 16: RESOLUCIÓN DE LOS 3 RETOS PRÁCTICOS
// ==============================================================================
setTimeout(() => {
    imprimirSeparador(16, "RESOLUCIÓN DE LOS 3 RETOS PRÁCTICOS DEL MÓDULO");

    console.log("--- RETO NIVEL 1: Lector y Validador JSON Seguro con try / catch ---");
    function validarJSON(archivo) {
        const lector = new ReaderClass();
        lector.addEventListener("load", () => {
            try {
                const parseado = JSON.parse(lector.result);
                console.log("[Reto 1] JSON verificado con éxito:", parseado);
            } catch (err) {
                console.error("[Reto 1] ❌ Error sintáctico en JSON:", err.message);
            }
        });
        lector.readAsText(archivo, "UTF-8");
    }
    validarJSON(new FileClass(['{"usuario":"admin","activo":true}'], "datos.json"));

    console.log("\n--- RETO NIVEL 2: Discriminación de Tipo MIME en Drag & Drop ---");
    function procesarArchivoDrop(archivo) {
        const lector = new ReaderClass();
        if (archivo.type.startsWith("image/")) {
            lector.addEventListener("load", () => {
                console.log(`[Reto 2] 🖼️ Imagen lista para galería: ${archivo.name}`);
            });
            lector.readAsDataURL(archivo);
        } else {
            lector.addEventListener("load", () => {
                console.log(`[Reto 2] 📄 Documento de texto leído: ${archivo.name}`);
            });
            lector.readAsText(archivo, "UTF-8");
        }
    }
    procesarArchivoDrop(new FileClass(["texto plano"], "notas.txt", { type: "text/plain" }));
    procesarArchivoDrop(new FileClass(["binario_img"], "foto.png", { type: "image/png" }));

    console.log("\n--- RETO NIVEL 3: Clase Gestora de Lectura con Progreso y Abort ---");
    class GestorLectura {
        constructor(archivo) {
            this.archivo = archivo;
            this.lector = new ReaderClass();
            this.lector.addEventListener("progress", (e) => {
                if (e.lengthComputable) {
                    console.log(`[Reto 3] 📊 Progreso: ${Math.round((e.loaded / e.total) * 100)}%`);
                }
            });
            this.lector.addEventListener("load", () => {
                console.log("[Reto 3] ✅ Lectura concluida satisfactoriamente");
            });
            this.lector.addEventListener("abort", () => {
                console.log("[Reto 3] 🛑 Lectura abortada por el usuario");
            });
        }
        iniciar() { this.lector.readAsText(this.archivo); }
        abortar() { this.lector.abort(); }
    }

    const tarea = new GestorLectura(new FileClass(["DATOS_LARGOS"], "bundle.js"));
    tarea.iniciar();

    setTimeout(() => {
        console.log("\n" + "=".repeat(78));
        console.log("🎉 ¡MÓDULO DE LA FILEREADER API COMPLETADO CON ÉXITO!");
        console.log("=".repeat(78) + "\n");
    }, 150);
}, 1600);
