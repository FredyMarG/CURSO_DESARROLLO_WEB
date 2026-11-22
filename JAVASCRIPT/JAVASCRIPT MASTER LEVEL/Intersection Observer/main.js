/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: INTERSECTION OBSERVER API
 * ARCHIVO: main.js
 * Guía teórica, simulador universal en Node.js y ejemplos prácticos paso a paso
 * Documentación pedagógica LÍNEA POR LÍNEA al 100%
 * ============================================================================
 */

// Activamos el modo estricto de ECMAScript para asegurar código limpio y evitar errores silenciosos
"use strict";

/* ==========================================================================
   0. ADAPTADOR / SIMULADOR UNIVERSAL PARA NODE.JS Y NAVEGADORES
   ========================================================================== */
// Detectamos si nos encontramos en Node.js (donde no existe window ni IntersectionObserver nativo)
const esEntornoNavegador = typeof window !== "undefined" && typeof window.IntersectionObserver !== "undefined";

// Definimos la clase simulada de IntersectionObserver para poder ejecutar la guía en Node.js sin errores
class IntersectionObserverSimulado {
    // El constructor recibe obligatoriamente el callback y opcionalmente el objeto options
    constructor(callback, options = {}) {
        // Guardamos la función callback que se invocará cuando cambie la intersección
        this.callback = callback;
        // Guardamos el elemento raíz (por defecto null, que representa el viewport completo)
        this.root = options.root || null;
        // Guardamos el margen de expansión o contracción alrededor del root
        this.rootMargin = options.rootMargin || "0px";
        // Guardamos el umbral o arreglo de umbrales de visibilidad (por defecto 0)
        this.threshold = options.threshold !== undefined ? options.threshold : 0;
        // Lista interna de elementos del DOM simulados actualmente bajo vigilancia
        this._observados = new Set();
    }

    // Método para añadir un elemento objetivo a la lista de vigilancia del observador
    observe(target) {
        // Añadimos el elemento al conjunto de elementos vigilados
        this._observados.add(target);
        // Simulamos la evaluación inicial obligatoria que realiza el navegador al empezar a observar
        const entradaInicial = {
            // Referencia al elemento observado
            target: target,
            // Estado booleano inicial de intersección simulado desde la propiedad del objeto
            isIntersecting: Boolean(target._simVisible),
            // Porcentaje numérico de visibilidad entre 0.0 y 1.0
            intersectionRatio: target._simVisible ? 1.0 : 0.0,
            // Marca de tiempo simulada del momento de la medición
            time: Date.now()
        };
        // Invocamos el callback entregando el arreglo de entradas y la referencia a este observador
        this.callback([entradaInicial], this);
    }

    // Método para detener la vigilancia sobre un elemento específico y liberar recursos
    unobserve(target) {
        // Eliminamos el elemento del conjunto de elementos observados
        this._observados.delete(target);
    }

    // Método para detener por completo la vigilancia sobre TODOS los elementos asociados
    disconnect() {
        // Vaciamos por completo el conjunto de elementos observados
        this._observados.clear();
    }

    // Método auxiliar exclusivo del simulador para emular que un elemento entra o sale de pantalla
    _simularCruce(target, estaVisible, ratio = 1.0) {
        // Si el elemento ya no está siendo observado (por unobserve o disconnect), no disparamos nada
        if (!this._observados.has(target)) return;
        // Actualizamos el estado simulado del elemento
        target._simVisible = estaVisible;
        // Construimos el objeto IntersectionObserverEntry sintético
        const entry = {
            // Elemento que cruzó el umbral
            target: target,
            // Booleano indicando si está entrando (true) o saliendo (false)
            isIntersecting: estaVisible,
            // Proporción visible del elemento
            intersectionRatio: estaVisible ? ratio : 0.0,
            // Marca de tiempo
            time: Date.now()
        };
        // Disparamos el callback del usuario exactamente como lo hace el motor C++ del navegador
        this.callback([entry], this);
    }
}

// Seleccionamos la implementación nativa si estamos en el navegador, o el simulador si estamos en Node.js
const IOClass = esEntornoNavegador ? window.IntersectionObserver : IntersectionObserverSimulado;

/* ==========================================================================
   UTILIDAD DE IMPRESIÓN PEDAGÓGICA EN CONSOLA
   ========================================================================== */
// Función auxiliar para imprimir títulos de bloque bien formateados en consola
function imprimirTitulo(numero, titulo) {
    // Imprimimos una línea divisoria superior
    console.log("\n" + "=".repeat(78));
    // Imprimimos el número y título del bloque
    console.log(`📌 BLOQUE ${numero}: ${titulo}`);
    // Imprimimos la línea divisoria inferior
    console.log("=".repeat(78));
}

/* ==========================================================================
   BLOQUE 1: ¿QUÉ ES Y PARA QUÉ SIRVE INTERSECTION OBSERVER?
   ========================================================================== */
// Imprimimos la cabecera del primer bloque temático
imprimirTitulo(1, "¿QUÉ ES Y POR QUÉ REEMPLAZA AL EVENTO 'scroll'?");

// Explicamos en consola la diferencia arquitectónica respecto al enfoque tradicional
console.log("⚠️ Enfoque Antiguo (window.addEventListener('scroll')):");
console.log("   - Se dispara decenas de veces por segundo al mover la rueda del ratón.");
console.log("   - Exige llamar a el.getBoundingClientRect(), forzando recálculos de Layout (Reflow).");
console.log("   - Bloquea el hilo principal de JavaScript y provoca saltos visuales (jank).");
console.log("\n✅ Enfoque Moderno (IntersectionObserver API):");
console.log("   - Es 100% asíncrono: el navegador vigila las intersecciones fuera del hilo principal.");
console.log("   - No consume CPU entre desplazamientos; solo notifica al cruzar el umbral.");
console.log("   - Ideal para Lazy Loading, Scroll Infinito, Animaciones y Control de Video.");

/* ==========================================================================
   BLOQUE 2: EL CONSTRUCTOR Y EL MÉTODO .observe()
   ========================================================================== */
// Imprimimos la cabecera del segundo bloque
imprimirTitulo(2, "EL CONSTRUCTOR new IntersectionObserver() Y .observe()");

// Creamos un elemento real del DOM en el navegador o un objeto simulado en Node.js
const elementoDemo = esEntornoNavegador
    ? Object.assign(document.createElement("div"), { id: "caja-objetivo" })
    : { id: "caja-objetivo", tagName: "DIV", _simVisible: false, classList: new Set() };

// Definimos una función callback sencilla que recibe las entradas y la instancia del observador
const callbackBasico = (entries, observer) => {
    // Recorremos el arreglo de entradas notificadas en este ciclo
    entries.forEach((entry) => {
        // Mostramos el identificador del elemento y su estado de intersección
        console.log(`👁️ Evaluando elemento '${entry.target.id}' -> isIntersecting: ${entry.isIntersecting}`);
    });
};

// Instanciamos el observador pasando el callback y un objeto de opciones vacío
const observadorBasico = new IOClass(callbackBasico, {});

// Indicamos al observador que comience a vigilar nuestro elemento objetivo
observadorBasico.observe(elementoDemo);

// Si estamos en el simulador de Node.js, emulamos que el usuario hace scroll y el elemento entra en pantalla
if (!esEntornoNavegador) {
    // Simulamos la entrada del elemento al viewport con 100% de visibilidad
    observadorBasico._simularCruce(elementoDemo, true, 1.0);
}

/* ==========================================================================
   BLOQUE 3: ANATOMÍA DE 'entries' Y LA PROPIEDAD 'isIntersecting'
   ========================================================================== */
// Imprimimos la cabecera del tercer bloque
imprimirTitulo(3, "ANATOMÍA DE 'IntersectionObserverEntry' Y 'isIntersecting'");

// Explicamos las propiedades más importantes de cada objeto entry recibido en el callback
console.log("🔍 Propiedades clave dentro de cada 'entry':");
console.log("   1. entry.isIntersecting (Boolean): true si está dentro de la zona vigilada, false si salió.");
console.log("   2. entry.intersectionRatio (Number): porcentaje visible entre 0.0 (0%) y 1.0 (100%).");
console.log("   3. entry.target (Element): referencia directa al nodo HTML que cruzó el umbral.");
console.log("   4. observer (2do parámetro): referencia a la propia instancia para llamar a .unobserve().");

// Creamos un elemento real del DOM en navegador o simulado en Node.js para alternar su visibilidad
const targetTarjeta = esEntornoNavegador
    ? Object.assign(document.createElement("article"), { id: "tarjeta-animada" })
    : { id: "tarjeta-animada", _simVisible: false, visible: false };

// Callback que reacciona tanto a la entrada como a la salida del área visible
const callbackVisibilidad = (entries) => {
    // Iteramos sobre cada entrada reportada
    entries.forEach((entry) => {
        // Comprobamos obligatoriamente la propiedad booleana isIntersecting
        if (entry.isIntersecting) {
            // Marcamos el elemento como visible
            if (!esEntornoNavegador) entry.target.visible = true;
            // Informamos en consola la entrada
            console.log(`   ✨ [ENTRÓ] '${entry.target.id}' es visible (${Math.round(entry.intersectionRatio * 100)}%).`);
        } else {
            // Marcamos el elemento como oculto fuera del viewport
            if (!esEntornoNavegador) entry.target.visible = false;
            // Informamos en consola la salida
            console.log(`   🌑 [SALIÓ] '${entry.target.id}' dejó de ser visible.`);
        }
    });
};

// Creamos el observador con el callback de visibilidad
const observadorTarjeta = new IOClass(callbackVisibilidad);
// Iniciamos la vigilancia (esto dispara la evaluación inicial: false)
observadorTarjeta.observe(targetTarjeta);

// En Node.js simulamos entrada y luego salida de la tarjeta
if (!esEntornoNavegador) {
    // El usuario baja el scroll y la tarjeta entra al 75%
    observadorTarjeta._simularCruce(targetTarjeta, true, 0.75);
    // El usuario sigue bajando y la tarjeta sale por arriba
    observadorTarjeta._simularCruce(targetTarjeta, false, 0.0);
}

/* ==========================================================================
   BLOQUE 4: CONFIGURACIÓN AVANZADA DE 'options' (root, rootMargin, threshold)
   ========================================================================== */
// Imprimimos la cabecera del cuarto bloque
imprimirTitulo(4, "CONFIGURACIÓN DE 'options': root, rootMargin y threshold");

// Definimos un objeto options completo siguiendo las especificaciones W3C
const opcionesAvanzadas = {
    // root: null indica que se usa la ventana completa del navegador (viewport) como marco
    root: null,
    // rootMargin: "0px 0px 200px 0px" expande la detección 200px hacia abajo para precargar antes de ver
    rootMargin: "0px 0px 200px 0px",
    // threshold: arreglo de hitos para disparar el callback al 0%, 25%, 50%, 75% y 100% de visibilidad
    threshold: [0, 0.25, 0.5, 0.75, 1.0]
};

// Mostramos la configuración en consola
console.log("⚙️ Objeto de configuración avanzado:", opcionesAvanzadas);
console.log("   • root: Elemento contenedor padre con scroll o null para todo el viewport.");
console.log("   • rootMargin: Margen estilo CSS; positivo (+) anticipa la carga, negativo (-) la retrasa.");
console.log("   • threshold: 0 = apenas 1px entra | 0.5 = mitad visible | 1.0 = 100% visible.");

/* ==========================================================================
   BLOQUE 5: MÉTODOS DE CONTROL DEL CICLO DE VIDA (unobserve y disconnect)
   ========================================================================== */
// Imprimimos la cabecera del quinto bloque
imprimirTitulo(5, "MÉTODOS DE CONTROL: observe(), unobserve() y disconnect()");

// Creamos un elemento real del DOM en el navegador (o simulado en Node.js) para demostrar unobserve()
const bannerUnico = esEntornoNavegador
    ? Object.assign(document.createElement("div"), { id: "banner-promocional" })
    : { id: "banner-promocional", _simVisible: false };

// Creamos un observador de un solo disparo (One-shot Observer)
const observadorUnico = new IOClass((entries, observer) => {
    // Recorremos las entradas
    entries.forEach((entry) => {
        // Si el elemento aún no es visible, no hacemos nada
        if (!entry.isIntersecting) return;
        // Ejecutamos la lógica deseada una única vez
        console.log(`   🚀 [ACCIÓN ÚNICA] '${entry.target.id}' apareció en pantalla. Animación ejecutada.`);
        // Dejamos de observar este elemento inmediatamente para ahorrar memoria y CPU
        observer.unobserve(entry.target);
        // Confirmamos en consola la liberación del recurso
        console.log(`   🧹 [MEMORIA LIBERADA] observer.unobserve('${entry.target.id}') ejecutado.`);
    });
});

// Iniciamos la observación
observadorUnico.observe(bannerUnico);

// En Node.js simulamos dos cruces para demostrar que el segundo ya NO se dispara tras unobserve()
if (!esEntornoNavegador) {
    // Primer cruce: dispara la acción y ejecuta unobserve()
    observadorUnico._simularCruce(bannerUnico, true, 1.0);
    // Segundo cruce: no produce salida porque el observador ya dejó de vigilarlo
    observadorUnico._simularCruce(bannerUnico, false, 0.0);
    // Finalmente desconectamos cualquier resto del observador
    observadorUnico.disconnect();
    // Confirmamos el cierre global
    console.log("   🔌 observer.disconnect() ejecutado: instancia completamente detenida.");
}

/* ==========================================================================
   BLOQUE 6: ANALOGÍAS DEL MUNDO REAL
   ========================================================================== */
// Imprimimos la cabecera del sexto bloque
imprimirTitulo(6, "ANALOGÍAS DEL MUNDO REAL: SENSOR DE PUERTA Y MARCO DE FOTO");

// Describimos las dos analogías pedagógicas de la guía
console.log("🚪 1. El Sensor Infrarrojo de una Puerta Automática:");
console.log("   - El sensor (IntersectionObserver) permanece en reposo hasta que alguien entra en su zona.");
console.log("   - El 'rootMargin' positivo es el alcance previo para abrir la puerta antes de chocar.");
console.log("\n🖼️ 2. El Marco de una Fotografía:");
console.log("   - 'root' es el marco físico; 'isIntersecting' es true cuando la foto asoma por el cristal.");
console.log("   - 'threshold: 1.0' exige que la foto encaje al 100% dentro del marco para contar como visible.");

/* ==========================================================================
   BLOQUE 7: PROYECTO INTEGRADOR: LAZY LOADING DE IMÁGENES
   ========================================================================== */
// Imprimimos la cabecera del séptimo bloque
imprimirTitulo(7, "PROYECTO INTEGRADOR: LAZY LOADING DE IMÁGENES DE ALTA CALIDAD");

// Función auxiliar para construir cada elemento de imagen compatible tanto con el DOM del navegador como con Node.js
const crearImagenLazy = (id, urlReal) => {
    // Si estamos en el navegador, creamos un nodo <img> real del DOM para que observe() sea válido
    if (esEntornoNavegador) {
        const img = document.createElement("img");
        img.id = id;
        img.dataset.src = urlReal;
        return img;
    }
    // En Node.js retornamos un objeto plano simulado equivalente
    return { id, src: "placeholder.jpg", dataset: { src: urlReal }, _simVisible: false };
};

// Simulamos una galería de 3 imágenes cuyo atributo data-src guarda la URL pesada real
const galeriaSimulada = [
    crearImagenLazy("img-1", "https://cdn.ejemplo.com/paisaje-hd-1.jpg"),
    crearImagenLazy("img-2", "https://cdn.ejemplo.com/paisaje-hd-2.jpg"),
    crearImagenLazy("img-3", "https://cdn.ejemplo.com/paisaje-hd-3.jpg")
];

// 1. Configuramos el observador para precargar la imagen 150px antes de que entre al viewport
const opcionesLazy = {
    // Usamos el viewport del navegador como raíz
    root: null,
    // Margen inferior positivo de 150px para anticipar la descarga de red
    rootMargin: "0px 0px 150px 0px",
    // Con que el 10% (0.1) asome en la zona ampliada, disparamos la carga
    threshold: 0.1
};

// 2. Definimos la función encargada de reemplazar el placeholder por la imagen real
const cargarImagenDiferida = (entries, observer) => {
    // Recorremos cada imagen que haya cambiado de estado
    entries.forEach((entry) => {
        // Regla de oro: ignoramos el evento si la imagen está saliendo o aún no entra
        if (!entry.isIntersecting) return;

        // Obtenemos la referencia a la etiqueta <img>
        const img = entry.target;
        // Transferimos la URL real de alta resolución desde data-src hacia src
        img.src = img.dataset.src;
        // Notificamos en consola la descarga bajo demanda
        console.log(`   🖼️ [LAZY LOAD] '${img.id}' cargada bajo demanda -> ${img.src}`);
        // Detenemos la vigilancia de esta imagen ya que no necesita volver a cargarse
        observer.unobserve(img);
    });
};

// 3. Instanciamos un ÚNICO observador reutilizable para todas las imágenes (Buena práctica)
const observadorLazy = new IOClass(cargarImagenDiferida, opcionesLazy);

// 4. Registramos cada imagen en el observador mediante un bucle
galeriaSimulada.forEach((imagen) => observadorLazy.observe(imagen));

// En Node.js simulamos que el usuario hace scroll progresivamente descubriendo las 2 primeras fotos
if (!esEntornoNavegador) {
    // El usuario baja hasta la imagen 1
    observadorLazy._simularCruce(galeriaSimulada[0], true, 0.25);
    // El usuario baja hasta la imagen 2 (la imagen 3 sigue sin descargarse ahorrando datos)
    observadorLazy._simularCruce(galeriaSimulada[1], true, 0.5);
    // Verificamos el estado de la tercera imagen
    console.log(`   ⏳ '${galeriaSimulada[2].id}' sigue esperando fuera de pantalla (src: ${galeriaSimulada[2].src}).`);
}

/* ==========================================================================
   BLOQUE 8: RESUMEN TÉCNICO Y BUENAS PRÁCTICAS
   ========================================================================== */
// Imprimimos la cabecera del bloque final
imprimirTitulo(8, "RESUMEN TÉCNICO Y RECOMENDACIONES DE PRODUCCIÓN");

// Listamos los puntos esenciales del módulo
console.log("1. 🎯 Reutiliza una sola instancia de IntersectionObserver para observar múltiples tarjetas.");
console.log("2. 🛡️ Valida siempre 'if (entry.isIntersecting)' para evitar ejecuciones dobles al salir.");
console.log("3. 🧹 Llama a 'observer.unobserve(entry.target)' en tareas de un solo disparo (Lazy Load).");
console.log("4. ⚠️ Evita 'threshold: 1.0' en elementos más altos que la pantalla o nunca se dispararán.");
console.log("=".repeat(78));
console.log("🎓 ¡Módulo de Intersection Observer API completado con éxito al 100%!");
console.log("=".repeat(78));
