/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: WEB WORKERS API
 * ARCHIVO: main.js
 * Guía teórica, simulador universal en Node.js y ejemplos prácticos paso a paso
 * Documentación pedagógica LÍNEA POR LÍNEA al 100%
 * ============================================================================
 */

// Activamos el modo estricto de ECMAScript para evitar errores silenciosos y variables globales accidentales
"use strict";

/* ==========================================================================
   0. ADAPTADOR UNIVERSAL PARA EJECUCIÓN EN NAVEGADOR Y NODE.JS
   ========================================================================== */
// Detectamos si nos encontramos en un navegador web real con soporte nativo para Worker
const esEntornoNavegador = typeof window !== "undefined" && typeof window.Worker !== "undefined";

// Creamos un simulador en memoria de Dedicated Worker para ejecutar la guía en Node.js sin errores
class WorkerSimulado {
    // El constructor recibe la ruta del script y un objeto opcional de configuración
    constructor(scriptURL, options = {}) {
        // Guardamos la ruta del archivo del worker
        this.scriptURL = scriptURL;
        // Guardamos el tipo de script ("classic" por defecto o "module")
        this.type = options.type || "classic";
        // Guardamos la política de credenciales ("same-origin", "omit", "include")
        this.credentials = options.credentials || "same-origin";
        // Guardamos el nombre identificativo del worker para depuración
        this.name = options.name || "worker-sin-nombre";
        // Indicador de si el worker sigue vivo o ya fue terminado con terminate()
        this._activo = true;
        // Manejador de mensajes recibidos desde el worker (equivalente a worker.onmessage)
        this.onmessage = null;
        // Manejador de errores ocurridos dentro del worker (equivalente a worker.onerror)
        this.onerror = null;
    }

    // Método equivalente a worker.postMessage(datos) que envía una copia al hilo secundario
    postMessage(datos) {
        // Si el worker ya fue terminado, no procesamos ningún mensaje
        if (!this._activo) return;
        // Mostramos en consola el envío desde el hilo principal
        console.log(`   📤 [Hilo Principal -> '${this.name}'] postMessage(${JSON.stringify(datos)})`);

        // Simulamos el procesamiento en segundo plano y el retorno de la respuesta
        if (datos && datos.accion === "calcular") {
            // Calculamos la suma solicitada
            let suma = 0;
            for (let i = 0; i < datos.iteraciones; i++) {
                suma += i;
            }
            // Invocamos el manejador onmessage del hilo principal con la propiedad e.data
            if (typeof this.onmessage === "function") {
                this.onmessage({ data: suma });
            }
        }
    }

    // Método equivalente a worker.terminate() para destruir el hilo inmediatamente
    terminate() {
        // Marcamos el worker como inactivo
        this._activo = false;
        // Confirmamos la liberación de memoria en consola
        console.log(`   🛑 [terminate()] Worker '${this.name}' finalizado y memoria liberada.`);
    }
}

// Seleccionamos la clase nativa en el navegador o el simulador en Node.js
const WorkerAPI = esEntornoNavegador ? window.Worker : WorkerSimulado;

/* ==========================================================================
   UTILIDAD DE IMPRESIÓN PEDAGÓGICA EN CONSOLA
   ========================================================================== */
// Función auxiliar para imprimir títulos ordenados en consola
function imprimirTitulo(numero, titulo) {
    // Línea divisoria superior
    console.log("\n" + "=".repeat(78));
    // Título numerado del bloque
    console.log(`📌 BLOQUE ${numero}: ${titulo}`);
    // Línea divisoria inferior
    console.log("=".repeat(78));
}

/* ==========================================================================
   BLOQUE 1: ¿QUÉ SON LOS WEB WORKERS Y POR QUÉ SON NECESARIOS?
   ========================================================================== */
// Imprimimos la cabecera del primer bloque
imprimirTitulo(1, "¿QUÉ SON LOS WEB WORKERS? (SINGLE-THREAD VS MULTIHILO)");

// Explicamos el problema del hilo único y la solución de los Web Workers
console.log("⚠️ Problema del Hilo Único (Main Thread):");
console.log("   - JavaScript ejecuta lógica, eventos de clic y renderizado de UI en un solo hilo.");
console.log("   - Una tarea pesada (ej. bucle de millones de iteraciones) congela toda la página.");
console.log("\n✅ Solución con Web Workers:");
console.log("   - Crean hilos secundarios reales del sistema operativo en segundo plano.");
console.log("   - La interfaz de usuario permanece fluida y respondiendo a clics en todo momento.");

/* ==========================================================================
   BLOQUE 2: TIPOS DE WEB WORKERS
   ========================================================================== */
// Imprimimos la cabecera del segundo bloque
imprimirTitulo(2, "TIPOS DE WEB WORKERS: DEDICATED, SERVICE Y ABSTRACT WORKER");

// Detallamos los tres conceptos principales de la especificación
console.log("1. ⚙️ Dedicated Worker: Pertenece exclusivamente a la pestaña que lo instanció.");
console.log("2. 🌐 Service Worker  : Proxy de red programable (caché offline, PWAs y Push).");
console.log("3. 🧱 Abstract Worker : Interfaz base de la que heredan Worker y SharedWorker.");

/* ==========================================================================
   BLOQUE 3: EL CONSTRUCTOR Worker(url, options) Y COMUNICACIÓN
   ========================================================================== */
// Imprimimos la cabecera del tercer bloque
imprimirTitulo(3, "CONSTRUCTOR new Worker(url, options), postMessage Y onmessage");

// Definimos las opciones recomendadas del constructor
const opcionesWorker = {
    // type: "classic" (script estándar) o "module" (permite import/export de ES Modules)
    type: "classic",
    // credentials: política de cookies/cabeceras ("same-origin", "omit", "include")
    credentials: "same-origin",
    // name: identificador legible en las herramientas de desarrollo (DevTools)
    name: "procesador-matematico"
};

// En Node.js ejecutamos una demostración completa de mensajería y terminación
if (!esEntornoNavegador) {
    // Instanciamos el worker simulado pasando archivo y opciones
    const miWorker = new WorkerAPI("worker.js", opcionesWorker);

    // Registramos el receptor de respuestas desde el hilo secundario
    miWorker.onmessage = (e) => {
        // Leemos la información devuelta dentro de e.data
        console.log(`   📥 [onmessage] Respuesta recibida del worker: ${e.data}`);
    };

    // Enviamos una carga de trabajo mediante postMessage()
    miWorker.postMessage({ accion: "calcular", iteraciones: 100000 });

    // Finalizamos el worker inmediatamente cuando ya no se necesita
    miWorker.terminate();
} else {
    // En el navegador mostramos en consola la referencia al laboratorio interactivo
    console.log("ℹ️ En el navegador, prueba el Worker real en el Laboratorio de la Diapositiva 9.");
}

/* ==========================================================================
   BLOQUE 4: POLÍTICA DE ORIGEN CRUZADO (Same-Origin) Y LIMITACIONES
   ========================================================================== */
// Imprimimos la cabecera del cuarto bloque
imprimirTitulo(4, "POLÍTICA SAME-ORIGIN Y LIMITACIONES DEL HILO SECUNDARIO");

// Enumeramos las reglas estrictas de seguridad del navegador
console.log("1. 🔒 Mismo Origen: El script 'worker.js' debe pertenecer al mismo dominio, protocolo y puerto.");
console.log("2. 🚫 Sin protocolo file://: Abrir index.html con doble clic bloquea el Worker (usa localhost).");
console.log("3. 🧩 Sin acceso al DOM: Dentro de un Worker NO existen 'document', 'window' ni 'parent'.");

/* ==========================================================================
   BLOQUE 5: ANALOGÍAS DEL MUNDO REAL
   ========================================================================== */
// Imprimimos la cabecera del quinto bloque
imprimirTitulo(5, "ANALOGÍAS DEL MUNDO REAL: EL CHEF Y EL CORREO NEUMÁTICO");

// Describimos las dos analogías pedagógicas
console.log("👨‍🍳 1. El Chef Principal y el Ayudante de Cocina:");
console.log("   - El Chef (Main Thread) atiende a los clientes en la barra sin detenerse.");
console.log("   - Pica 50kg de cebolla delegándolo por la ventanilla (postMessage) al Ayudante (Worker).");
console.log("\n📬 2. La Oficina de Correo Neumático:");
console.log("   - Hilo principal y worker viven en salas aisladas y se envían copias por cápsulas.");

/* ==========================================================================
   BLOQUE 6: COMUNICACIÓN AVANZADA (addEventListener VS onmessage Y self.close)
   ========================================================================== */
// Imprimimos la cabecera del sexto bloque
imprimirTitulo(6, "COMUNICACIÓN AVANZADA: addEventListener('message') Y self.close()");

// Explicamos la diferencia entre asignar .onmessage y registrar con addEventListener
console.log("📡 Diferencia entre .onmessage y addEventListener('message'):");
console.log("   • worker.onmessage = fn -> Solo permite UN manejador; una nueva asignación lo sobrescribe.");
console.log("   • worker.addEventListener('message', fn) -> Permite múltiples escuchadores independientes.");
console.log("   • self.close() -> Cierra el worker desde su propio código interno tras terminar su labor.");

/* ==========================================================================
   BLOQUE 7: MANEJO DE ERRORES (onerror Y messageerror)
   ========================================================================== */
// Imprimimos la cabecera del séptimo bloque
imprimirTitulo(7, "MANEJO DE ERRORES: worker.onerror Y messageerror");

// Explicamos cómo capturar fallos silenciosos en el hilo secundario
console.log("🛡️ Captura obligatoria de errores en producción:");
console.log("   1. worker.onerror = (err) => { ... }");
console.log("      ↳ Expone err.message (texto), err.filename (archivo) y err.lineno (línea exacta).");
console.log("   2. worker.addEventListener('messageerror', (e) => { ... })");
console.log("      ↳ Se dispara si falla el Structured Clone Algorithm (ej. intentar enviar una función).");

// En Node.js demostramos cómo el hilo principal captura un error simulado del worker
if (!esEntornoNavegador) {
    // Instanciamos un worker de prueba para errores
    const workerConError = new WorkerAPI("worker-fallo.js", { name: "worker-seguro" });
    // Registramos el manejador oficial de errores
    workerConError.onerror = (error) => {
        // Mostramos el mensaje de error capturado sin romper la aplicación principal
        console.log(`   ❌ [onerror capturado] ${error.message} (archivo: ${error.filename})`);
    };
    // Simulamos manualmente un error interno en el hilo secundario
    workerConError.onerror({ message: "ReferenceError: document is not defined", filename: "worker.js" });
    // Terminamos la instancia de prueba
    workerConError.terminate();
}

/* ==========================================================================
   BLOQUE 8: TRANSFERABLE OBJECTS (ArrayBuffer) PARA MÁXIMO RENDIMIENTO
   ========================================================================== */
// Imprimimos la cabecera del octavo bloque
imprimirTitulo(8, "TRANSFERABLE OBJECTS: MOVER MEMORIA EN 0 MS SIN COPIAR");

// Explicamos la diferencia entre clonar datos y transferir la propiedad de la memoria
console.log("⚡ Structured Clone (por defecto): worker.postMessage(datos)");
console.log("   - Copia el objeto completo. Un ArrayBuffer de 100 MB tarda varios ms y duplica la RAM.");
console.log("\n🚀 Transferable Objects: worker.postMessage(buffer, [buffer])");
console.log("   - Transfiere la propiedad del bloque de memoria al Worker en ~0 ms sin copiar bytes.");
console.log("   - Tras transferirse, el buffer original en el emisor queda vacío (byteLength === 0).");

// Demostración real en memoria de un ArrayBuffer (funciona igual en Node.js y navegador)
const bufferPesado = new ArrayBuffer(1024 * 1024); // Reservamos 1 MB en memoria
console.log(`   📦 Tamaño antes de transferir: ${bufferPesado.byteLength} bytes`);

/* ==========================================================================
   BLOQUE 9: WORKERS DINÁMICOS EN LÍNEA CON BLOB Y URL.createObjectURL()
   ========================================================================== */
// Imprimimos la cabecera del noveno bloque
imprimirTitulo(9, "WORKERS DINÁMICOS CON Blob Y URL.createObjectURL()");

// Explicamos cómo crear un worker sin archivo físico separado
console.log("🧩 ¿Cuándo usar un Blob Worker?");
console.log("   - Útil en librerías de un solo archivo o para evitar errores CORS en entornos locales.");
console.log("   - Patrón estándar:");
console.log("     const blob = new Blob([codigoWorker], { type: 'application/javascript' });");
console.log("     const url = URL.createObjectURL(blob);");
console.log("     const worker = new Worker(url);");
console.log("     URL.revokeObjectURL(url); // Buena práctica para liberar memoria tras instanciar");

/* ==========================================================================
   BLOQUE 10: EJERCICIOS PRÁCTICOS Y SOLUCIONARIO (NIVEL 1, 2 Y 3)
   ========================================================================== */
// Imprimimos la cabecera del décimo bloque
imprimirTitulo(10, "SOLUCIONARIO OFICIAL: EJERCICIOS NIVEL 1, NIVEL 2 Y NIVEL 3");

// --- NIVEL 1: Enviar un número al worker y calcular su cuadrado ---
console.log("📘 [NIVEL 1] Calcular el cuadrado de un número en segundo plano:");
if (!esEntornoNavegador) {
    // Creamos un worker dedicado para el ejercicio 1
    const workerN1 = new WorkerAPI("worker-nivel1.js", { name: "nivel-1-cuadrado" });
    // Sobrescribimos postMessage solo para este ejemplo puntual
    workerN1.onmessage = (e) => console.log(`   ↳ Cuadrado calculado: ${e.data}`);
    // Simulamos el envío y respuesta del cálculo
    const numero = 25;
    console.log(`   ↳ Enviando número: ${numero}`);
    workerN1.onmessage({ data: numero * numero });
    workerN1.terminate();
}

// --- NIVEL 2: Procesar una lista grande de datos con medición de rendimiento ---
console.log("\n📗 [NIVEL 2] Filtrar y contar elementos pares en 1,000,000 de registros:");
// Medimos el tiempo usando performance.now()
const inicioN2 = performance.now();
let paresEncontrados = 0;
// Simulamos el recorrido que ejecutaría el worker en segundo plano
for (let i = 1; i <= 1_000_000; i++) {
    if (i % 2 === 0) paresEncontrados++;
}
const duracionN2 = (performance.now() - inicioN2).toFixed(2);
console.log(`   ↳ Números pares encontrados: ${paresEncontrados.toLocaleString("es-ES")} en ${duracionN2} ms`);

// --- NIVEL 3: Arquitectura segura con validación de soporte y manejo de errores ---
console.log("\n📙 [NIVEL 3] Función segura crearWorkerSeguro(ruta, onSuccess, onError):");
// Definimos una función reutilizable lista para producción
function crearWorkerSeguro(ruta, onSuccess, onError) {
    // Verificamos si el entorno soporta Worker
    if (typeof WorkerAPI === "undefined") {
        console.log("   ⚠️ Este entorno no soporta Web Workers.");
        return null;
    }
    // Instanciamos el worker con un nombre descriptivo
    const instancia = new WorkerAPI(ruta, { name: "worker-produccion" });
    // Asignamos el callback de éxito
    instancia.onmessage = (e) => onSuccess(e.data, instancia);
    // Asignamos el callback de error
    instancia.onerror = (err) => onError(err, instancia);
    // Retornamos la instancia para que el código padre pueda enviar mensajes
    return instancia;
}
// Probamos la función auxiliar en consola
const wSeguro = crearWorkerSeguro(
    "worker.js",
    (res, inst) => { console.log(`   ↳ [Éxito Nivel 3] Respuesta: ${res}`); inst.terminate(); },
    (err, inst) => { console.log(`   ↳ [Error Nivel 3] ${err.message}`); inst.terminate(); }
);
if (wSeguro && !esEntornoNavegador) {
    wSeguro.postMessage({ accion: "calcular", iteraciones: 1000 });
}

/* ==========================================================================
   BLOQUE 11: BUENAS PRÁCTICAS Y RESUMEN TÉCNICO FINAL
   ========================================================================== */
// Imprimimos la cabecera del bloque final
imprimirTitulo(11, "BUENAS PRÁCTICAS Y RESUMEN TÉCNICO");

// Listamos los puntos esenciales
console.log("1. ✅ Usa 'worker.onerror' y 'messageerror' para capturar fallos dentro del hilo secundario.");
console.log("2. ✅ Llama a 'worker.terminate()' (o 'self.close()') cuando el worker termine su tarea.");
console.log("3. ✅ Considera Transferable Objects (ArrayBuffer) para mover grandes archivos sin copiarlos.");
console.log("4. ✅ Usa 'Blob' + 'URL.createObjectURL()' si necesitas crear workers dinámicos sin archivo externo.");
console.log("5. ❌ Nunca intentes usar document.querySelector() ni window dentro de 'worker.js'.");
console.log("=".repeat(78));
console.log("🎓 ¡Módulo de Web Workers API completado con éxito al 100%!");
console.log("=".repeat(78));
