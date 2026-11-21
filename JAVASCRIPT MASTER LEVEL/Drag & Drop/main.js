/**
 * ==============================================================================
 * 🖐️ JAVASCRIPT MASTER LEVEL: MÓDULO COMPLETO DE LA API DE DRAG & DROP
 * ==============================================================================
 * Archivo: main.js
 * Propósito: Guía práctica ejecutable, comentada y explicada línea por línea al 100%
 * Ejecución: Directamente en la consola del navegador o en terminal con 'node main.js'
 * 
 * TEMARIO DEL MÓDULO (DOCUMENTACION/DRAG & DROP.md):
 * 1. Introducción a la API nativa de Drag & Drop vs. cálculo manual de coordenadas
 * 2. Configuración inicial en HTML: El atributo obligatorio 'draggable="true"'
 * 3. Primer contacto práctico: Eventos de '.circulo' (Objeto) y '.cuadrado' (Zona)
 * 4. Eventos del Objeto Emisor: dragstart, drag y dragend
 * 5. Eventos de la Zona Receptora: dragenter, dragover (dragmove), dragleave y drop
 * 6. El rol crítico de 'e.preventDefault()' en dragover y drop
 * 7. Manipulación de datos con la propiedad 'e.dataTransfer'
 * 8. Inserción con 'setData(formato, valor)' y extracción con 'getData(formato)'
 * 9. Analogías del mundo real: El Camión de Mudanzas 🚚 y el Tapete de Bienvenida 🚪
 * 10. Diagrama de flujo del ciclo de vida de arrastre
 * 11. Buena práctica 1: Cancelar siempre el comportamiento por defecto en dragover
 * 12. Buena práctica 2: Usar clases CSS (classList) en lugar de estilos en línea
 * 13. Error común: Intentar leer getData() fuera del evento drop (aislamiento de seguridad)
 * 14. Proyecto Integrador Paso a Paso: Implementación de un Texturizador Interactivo
 * 15. Resolución de los 3 Retos Prácticos del Módulo (Niveles 1, 2 y 3)
 * 16. Resumen técnico y chuleta maestra
 * ==============================================================================
 */

// Activamos el modo estricto para garantizar código limpio y sin fallos silenciosos
"use strict"; // Activa el modo estricto de JavaScript

// Función auxiliar para imprimir divisores elegantes y pedagógicos en la consola
function imprimirSeparador(numeroBloque, titulo) { // Declara función
    // Imprime un salto de línea inicial para separar del bloque previo
    console.log("\n" + "=".repeat(78)); // Imprime salida en consola
    // Imprime el número del bloque y el título descriptivo en mayúsculas
    console.log(`📌 BLOQUE ${numeroBloque}: ${titulo}`); // Imprime salida en consola
    // Imprime la línea divisoria inferior de cierre
    console.log("=".repeat(78)); // Imprime salida en consola
}

// ==============================================================================
// COMPATIBILIDAD UNIVERSAL (DOM Y SIMULADOR DE EVENTOS DRAG & DROP PARA NODE.JS)
// ==============================================================================
// Para que este archivo pueda ejecutarse tanto en el navegador como en la terminal
// con 'node main.js', creamos una clase simuladora de elementos DOM y de 'dataTransfer':
class DataTransferSimulado { // Define clase
    constructor() { // Instrucción JavaScript
        // Almacén interno clave-valor para custodiar los formatos MIME durante el viaje
        this._almacen = {}; // Asigna valor
        // Fase actual del ciclo para emular las reglas de seguridad del navegador
        this._faseActual = "dragstart"; // Asigna valor
    }

    // Guarda información durante el evento dragstart
    setData(formato, valor) { // Instrucción JavaScript
        this._almacen[String(formato)] = String(valor); // Ejecuta llamada o método
    }

    // Extrae la información custodiada (protegida en eventos intermedios como dragover)
    getData(formato) { // Instrucción JavaScript
        if (this._faseActual !== "drop" && this._faseActual !== "dragstart") { // Evalúa condición
            return ""; // Retorna resultado
        }
        return Object.prototype.hasOwnProperty.call(this._almacen, String(formato))
            ? this._almacen[String(formato)]
            : ""; // Instrucción JavaScript
    }
}

class NodoDOMSimulado { // Define clase
    constructor(tagName, className = "", id = "", dataset = {}) { // Instrucción JavaScript
        this.tagName = tagName.toUpperCase(); // Asigna valor
        this.className = className; // Asigna valor
        this.id = id; // Asigna valor
        this.draggable = true; // Asigna valor
        this.dataset = { ...dataset }; // Asigna valor
        this.style = { opacity: "1", backgroundImage: "" }; // Asigna valor
        this.innerText = ""; // Asigna valor
        this._clases = new Set(className ? className.split(/\s+/) : []); // Asigna valor
        this._listeners = {}; // Asigna valor
    }

    get classList() { // Instrucción JavaScript
        const self = this; // Declara e inicializa "self"
        return { // Retorna resultado
            add(clase) { // Instrucción JavaScript
                self._clases.add(clase); // Ejecuta llamada o método
                self.className = Array.from(self._clases).join(" "); // Asigna valor
            },
            remove(clase) { // Instrucción JavaScript
                self._clases.delete(clase); // Ejecuta llamada o método
                self.className = Array.from(self._clases).join(" "); // Asigna valor
            },
            contains(clase) { // Instrucción JavaScript
                return self._clases.has(clase); // Retorna resultado
            }
        };
    }

    addEventListener(tipoEvento, callback) { // Registra escuchador de eventos
        if (!this._listeners[tipoEvento]) { // Evalúa condición
            this._listeners[tipoEvento] = []; // Asigna valor
        }
        this._listeners[tipoEvento].push(callback); // Ejecuta llamada o método
    }

    dispatchEventSimulado(tipoEvento, dataTransferCompartido) { // Instrucción JavaScript
        if (dataTransferCompartido) { // Evalúa condición
            dataTransferCompartido._faseActual = tipoEvento; // Asigna valor
        }
        let defaultPrevenido = false; // Declara e inicializa "defaultPrevenido"
        const evento = { // Declara e inicializa "evento"
            type: tipoEvento,
            target: this,
            currentTarget: this,
            dataTransfer: dataTransferCompartido || new DataTransferSimulado(),
            preventDefault() { // Instrucción JavaScript
                defaultPrevenido = true; // Asigna valor
            },
            get defaultPrevented() { // Instrucción JavaScript
                return defaultPrevenido; // Retorna resultado
            }
        };
        const lista = this._listeners[tipoEvento] || []; // Declara e inicializa "lista"
        lista.forEach(fn => fn(evento)); // Ejecuta llamada o método
        return evento; // Retorna resultado
    }

    querySelector() { // Instrucción JavaScript
        return this; // Retorna resultado
    }
}


// ==============================================================================
// BLOQUE 1: INTRODUCCIÓN A LA API NATIVA DE DRAG & DROP
// ==============================================================================
imprimirSeparador(1, "INTRODUCCIÓN A LA API NATIVA DE DRAG & DROP"); // Ejecuta llamada o método

// La API de Drag & Drop (Arrastrar y Soltar) de HTML5 proporciona soporte nativo
// para interactuar con elementos mediante gestos del ratón o pantallas táctiles.
// Antes de HTML5 era obligatorio calcular coordenadas ('clientX', 'clientY') con
// eventos de ratón redundantes; hoy contamos con 7 eventos arquitectónicos y un
// contenedor de transferencia de datos integrado ('e.dataTransfer').

console.log("Enfoque antiguo (Pre-HTML5)      : Cálculo manual de clientX/clientY en mousemove"); // Imprime salida en consola
console.log("Estándar moderno (API Nativa)    : 7 eventos de ciclo de vida + objeto dataTransfer"); // Imprime salida en consola
console.log("Capacidad de transferencia       : Entre componentes del DOM o desde el sistema operativo"); // Imprime salida en consola


// ==============================================================================
// BLOQUE 2: CONFIGURACIÓN INICIAL: EL ATRIBUTO 'draggable="true"'
// ==============================================================================
imprimirSeparador(2, "CONFIGURACIÓN INICIAL: EL ATRIBUTO draggable='true'"); // Ejecuta llamada o método

// Por defecto en HTML, únicamente las imágenes (<img>) y los enlaces (<a href="...">)
// son arrastrables de manera nativa.
// Para que un elemento personalizado (como un <div>) pueda iniciar el ciclo de arrastre,
// es estrictamente obligatorio declarar el atributo 'draggable="true"' en su etiqueta HTML:
// <div id="objeto-textura" draggable="true">Arrástrame</div>

console.log("Elementos arrastrables de fábrica: Imágenes (<img>) y Enlaces (<a href='...'>)"); // Imprime salida en consola
console.log("Requisito en un <div> o <span>   : Declarar explícitamente draggable=\"true\" en HTML"); // Imprime salida en consola


// ==============================================================================
// BLOQUE 3: PRIMER CONTACTO PRÁCTICO (.circulo Y .cuadrado)
// ==============================================================================
imprimirSeparador(3, "PRIMER CONTACTO PRÁCTICO: EVENTOS DE .circulo Y .cuadrado"); // Ejecuta llamada o método

// Reproducimos y ejecutamos la estructura base con '.circulo' (objeto que se arrastra)
// y '.cuadrado' (zona receptora), escuchando los 7 eventos fundamentales del ciclo:
const circulo = new NodoDOMSimulado("div", "circulo", "nodo-circulo"); // Declara e inicializa "circulo"
const cuadrado = new NodoDOMSimulado("div", "cuadrado", "nodo-cuadrado"); // Declara e inicializa "cuadrado"

// --- Eventos en el objeto (.circulo) ---
circulo.addEventListener("dragstart", e => { // Registra escuchador de eventos
    console.log("1. [dragstart] -> Drag Start en .circulo"); // Imprime salida en consola
    // Guardamos la clase del elemento arrastrado dentro de dataTransfer
    e.dataTransfer.setData("text-plain", e.target.className); // Ejecuta llamada o método
    console.log("   [setData]   -> Guardado en 'text-plain':", e.dataTransfer.getData("text-plain")); // Imprime salida en consola
});

circulo.addEventListener("drag", e => { // Registra escuchador de eventos
    console.log("2. [drag]      -> Drag (moviendo .circulo en pantalla)"); // Imprime salida en consola
});

circulo.addEventListener("dragend", e => { // Registra escuchador de eventos
    console.log("7. [dragend]   -> Drag End (fin del ciclo de arrastre)"); // Imprime salida en consola
});

// --- Eventos en la zona receptora (.cuadrado) ---
cuadrado.addEventListener("dragenter", e => { // Registra escuchador de eventos
    console.log("3. [dragenter] -> Drag Enter (el cursor entró a .cuadrado)"); // Imprime salida en consola
});

cuadrado.addEventListener("dragover", e => { // Registra escuchador de eventos
    // Obligatorio prevenir el comportamiento por defecto para permitir el evento 'drop'
    e.preventDefault(); // Ejecuta llamada o método
    console.log("4. [dragover]  -> Drag Over (e.preventDefault() ejecutado ✅)"); // Imprime salida en consola
});

cuadrado.addEventListener("dragleave", e => { // Registra escuchador de eventos
    console.log("5. [dragleave] -> Drag Leave (si el cursor sale de .cuadrado)"); // Imprime salida en consola
});

cuadrado.addEventListener("drop", e => { // Registra escuchador de eventos
    e.preventDefault(); // Ejecuta llamada o método
    console.log("6. [drop]      -> Drop en .cuadrado | Dato recibido:", e.dataTransfer.getData("text-plain")); // Imprime salida en consola
});

// Disparamos la secuencia completa para verificar el funcionamiento en consola:
const dtInicial = new DataTransferSimulado(); // Declara e inicializa "dtInicial"
circulo.dispatchEventSimulado("dragstart", dtInicial); // Ejecuta llamada o método
circulo.dispatchEventSimulado("drag", dtInicial); // Ejecuta llamada o método
cuadrado.dispatchEventSimulado("dragenter", dtInicial); // Ejecuta llamada o método
cuadrado.dispatchEventSimulado("dragover", dtInicial); // Ejecuta llamada o método
cuadrado.dispatchEventSimulado("dragleave", dtInicial); // Ejecuta llamada o método
cuadrado.dispatchEventSimulado("drop", dtInicial); // Ejecuta llamada o método
circulo.dispatchEventSimulado("dragend", dtInicial); // Ejecuta llamada o método


// ==============================================================================
// BLOQUE 4: EVENTOS DEL OBJETO (EL ELEMENTO QUE SE ARRASTRA)
// ==============================================================================
imprimirSeparador(4, "LOS 3 EVENTOS DEL OBJETO EMISOR (dragstart, drag, dragend)"); // Ejecuta llamada o método

// Los eventos del objeto gestionan exclusivamente el estado del elemento que el usuario
// ha seleccionado y está desplazando por la pantalla:
// 1. dragstart: Se dispara en el milisegundo exacto en que comienza el arrastre.
//               Es el único momento válido para inicializar la carga con setData().
// 2. drag     : Se ejecuta continuamente a alta frecuencia mientras dura el desplazamiento.
// 3. dragend  : Se dispara al finalizar la operación (ya sea por un drop exitoso o por
//               cancelación con la tecla Esc). Se usa para restaurar opacidades o clases.

const objetoTextura = new NodoDOMSimulado("div", "textura", "objeto-textura"); // Declara e inicializa "objetoTextura"

objetoTextura.addEventListener("dragstart", () => { // Registra escuchador de eventos
    objetoTextura.style.opacity = "0.5"; // Asigna valor
    console.log("Evento [dragstart] -> Inicio del arrastre | Opacidad reducida a:", objetoTextura.style.opacity); // Imprime salida en consola
});

objetoTextura.addEventListener("dragend", () => { // Registra escuchador de eventos
    objetoTextura.style.opacity = "1"; // Asigna valor
    console.log("Evento [dragend]   -> Fin del arrastre    | Opacidad restaurada a:", objetoTextura.style.opacity); // Imprime salida en consola
});

objetoTextura.dispatchEventSimulado("dragstart"); // Ejecuta llamada o método
objetoTextura.dispatchEventSimulado("dragend"); // Ejecuta llamada o método


// ==============================================================================
// BLOQUE 5: EVENTOS DE ZONA (EL CONTENEDOR QUE RECIBE EL OBJETO)
// ==============================================================================
imprimirSeparador(5, "LOS 4 EVENTOS DE LA ZONA RECEPTORA (DROP ZONE)"); // Ejecuta llamada o método

// Los eventos de zona controlan los contenedores destinados a recibir objetos arrastrados:
const resumenEventosZona = [
    { // Instrucción JavaScript
        evento: "dragenter",
        momento: "Cuando el cursor entra por primera vez en los límites de la zona",
        uso: "Iluminar o resaltar visualmente la zona receptora (.classList.add)"
    },
    { // Instrucción JavaScript
        evento: "dragover (dragmove)",
        momento: "Se ejecuta repetidamente mientras el objeto flota sobre la zona",
        uso: "Invocar obligatoriamente e.preventDefault() para permitir el drop"
    },
    { // Instrucción JavaScript
        evento: "dragleave",
        momento: "Cuando el cursor sale de los límites de la zona sin soltar",
        uso: "Limpiar las clases de resaltado visual (.classList.remove)"
    },
    { // Instrucción JavaScript
        evento: "drop",
        momento: "Cuando el usuario suelta el botón del ratón sobre la zona habilitada",
        uso: "Leer los datos con e.dataTransfer.getData() y aplicar la lógica final"
    }
];

resumenEventosZona.forEach(item => { // Instrucción JavaScript
    console.log(`[${item.evento.padEnd(19)}] -> ${item.momento}`); // Imprime salida en consola
    console.log(`${" ".repeat(23)}Acción: ${item.uso}`); // Imprime salida en consola
});


// ==============================================================================
// BLOQUE 6: EL ROL CRÍTICO DE 'e.preventDefault()' EN dragover Y drop
// ==============================================================================
imprimirSeparador(6, "POR QUÉ ES OBLIGATORIO e.preventDefault() EN dragover"); // Ejecuta llamada o método

// ⚠️ NOTA CRÍTICA DE LA API NATIVA:
// Por defecto, los navegadores prohíben soltar elementos dentro de contenedores genéricos (<div>).
// Si olvidas llamar a 'e.preventDefault()' dentro del evento 'dragover', el puntero mostrará
// un icono de prohibido (🚫) y el evento 'drop' JAMÁS se disparará.

const zonaDestino = new NodoDOMSimulado("div", "drop-zone", "zona-destino"); // Declara e inicializa "zonaDestino"

zonaDestino.addEventListener("dragover", (e) => { // Registra escuchador de eventos
    e.preventDefault(); // ✅ OBLIGATORIO: Desbloquea la zona para permitir el evento 'drop'
});

zonaDestino.addEventListener("drop", (e) => { // Registra escuchador de eventos
    e.preventDefault(); // ✅ Evita que el navegador abra archivos o enlaces arrastrados como URL
    console.log("Estado de zonaDestino en drop    : ¡Objeto depositado con éxito! ✅"); // Imprime salida en consola
});

const evOver = zonaDestino.dispatchEventSimulado("dragover"); // Declara e inicializa "evOver"
console.log("¿Se invocó preventDefault() en dragover?:", evOver.defaultPrevented); // Imprime salida en consola
zonaDestino.dispatchEventSimulado("drop"); // Ejecuta llamada o método


// ==============================================================================
// BLOQUE 7: MANIPULACIÓN DE DATOS CON LA PROPIEDAD 'dataTransfer'
// ==============================================================================
imprimirSeparador(7, "EL MOTOR DE LA API: EL OBJETO e.dataTransfer"); // Ejecuta llamada o método

// El objeto 'dataTransfer' se expone de forma nativa dentro del evento de arrastre ('e.dataTransfer').
// Actúa como una caja de seguridad o contenedor temporal en memoria encargado de custodiar
// la información durante el viaje del objeto desde el nodo emisor hasta la zona receptora.

console.log("Propiedad nativa del evento      : e.dataTransfer"); // Imprime salida en consola
console.log("Método de escritura (dragstart)  : e.dataTransfer.setData(formato, valor)"); // Imprime salida en consola
console.log("Método de lectura (drop)         : e.dataTransfer.getData(formato)"); // Imprime salida en consola


// ==============================================================================
// BLOQUE 8: INSERCIÓN CON setData() Y EXTRACCIÓN CON getData()
// ==============================================================================
imprimirSeparador(8, "INSERCIÓN CON setData() Y EXTRACCIÓN CON getData()"); // Ejecuta llamada o método

// 1. setData(formato, valor): Almacena la información durante 'dragstart'.
//    Recibe dos strings: el tipo MIME (ej. 'text/plain', 'text/url-pattern') y el valor.
// 2. getData(formato): Recupera la información en el evento 'drop' usando exactamente el mismo formato.

const dtTransaccion = new DataTransferSimulado(); // Declara e inicializa "dtTransaccion"

// Fase 1: Al iniciar el arrastre (dragstart)
dtTransaccion._faseActual = "dragstart"; // Asigna valor
dtTransaccion.setData("text/plain", "objeto-textura-01"); // Ejecuta llamada o método
dtTransaccion.setData("text/url-pattern", "url('madera.jpg')"); // Ejecuta llamada o método
console.log("1. [dragstart] setData('text/plain')       -> Guardado 'objeto-textura-01'"); // Imprime salida en consola
console.log("2. [dragstart] setData('text/url-pattern') -> Guardado \"url('madera.jpg')\""); // Imprime salida en consola

// Fase 2: Al soltar en la zona receptora (drop)
dtTransaccion._faseActual = "drop"; // Asigna valor
const idRecuperado = dtTransaccion.getData("text/plain"); // Declara e inicializa "idRecuperado"
const patronRecuperado = dtTransaccion.getData("text/url-pattern"); // Declara e inicializa "patronRecuperado"
console.log("3. [drop]      getData('text/plain')       ->", idRecuperado); // Imprime salida en consola
console.log("4. [drop]      getData('text/url-pattern') ->", patronRecuperado); // Imprime salida en consola


// ==============================================================================
// BLOQUE 9: ANALOGÍAS DEL MUNDO REAL (CAMIÓN DE MUDANZAS Y TAPETE DE TIENDA)
// ==============================================================================
imprimirSeparador(9, "ANALOGÍAS DEL MUNDO REAL: CAMIÓN 🚚 Y TAPETE DE TIENDA 🚪"); // Ejecuta llamada o método

console.log(`
🚚 ANALOGÍA 1: EL CAMIÓN DE MUDANZAS (dataTransfer)
  - setData() representa el momento en que cargas las cajas con tus pertenencias en el
    camión en tu casa de origen (dragstart). No puedes meter más cajas a mitad de la autopista.
  - getData() representa la apertura de las compuertas del camión para descargar las cajas
    únicamente cuando este ya ha estacionado de forma segura en tu nuevo hogar (drop).

🚪 ANALOGÍA 2: EL TAPETE DE BIENVENIDA DE UNA TIENDA (dragenter y dragleave)
  - Cuando das el primer paso dentro de la tienda llevando un paquete, suena una campana de
    aviso y se ilumina el mostrador (dragenter).
  - Si decides dar marcha atrás y salir del local sin entregar nada, la campana deja de sonar
    y la tienda vuelve a su estado visual original (dragleave).
`);


// ==============================================================================
// BLOQUE 10: DIAGRAMA DE FLUJO DEL CICLO DE ARRASTRE
// ==============================================================================
imprimirSeparador(10, "DIAGRAMA DE FLUJO DEL CICLO DE ARRASTRE"); // Ejecuta llamada o método

console.log(`
   [ Objeto con draggable="true" ]
                  │
                  ▼
         ( Evento dragstart )  ──► Se define la carga útil con e.dataTransfer.setData()
                  │
                  ▼
         ( Evento drag )       ──► Ciclo continuo de movimiento en pantalla
                  │
                  ▼
     ¿Entra en Zona de Destino?
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
    [ SÍ ]                [ NO ] ──► ( Evento dragend ) ──► Cancela la operación
        │
        ▼
   ( Evento dragenter )        ──► Ilumina visualmente la zona receptora
        │
        ▼
   ( Evento dragmove / dragover ) ──► Ejecuta e.preventDefault() para desbloquear la zona
        │
        ▼
    ¿Se suelta el objeto?
        │
        ├───────────────────┐
        ▼                   ▼
    [ SÍ ]                [ NO ] ──► ( Evento dragleave ) ──► Restaura interfaz original
        │
        ▼
    ( Evento drop )            ──► Recupera datos con e.dataTransfer.getData() y aplica cambios
`);


// ==============================================================================
// BLOQUE 11: BUENA PRÁCTICA 1: CANCELAR SIEMPRE EL EVENTO POR DEFECTO EN dragover
// ==============================================================================
imprimirSeparador(11, "BUENA PRÁCTICA 1: e.preventDefault() SIEMPRE EN dragover"); // Ejecuta llamada o método

console.log("✅ Regla obligatoria en cualquier zona receptora:"); // Imprime salida en consola
console.log("   zona.addEventListener('dragover', (e) => e.preventDefault());"); // Registra escuchador de eventos
console.log("   Sin esta línea, el navegador bloquea el contenedor y el evento 'drop' nunca ocurre."); // Imprime salida en consola


// ==============================================================================
// BLOQUE 12: BUENA PRÁCTICA 2: USAR CLASES CSS (classList) PARA ESTADOS VISUALES
// ==============================================================================
imprimirSeparador(12, "BUENA PRÁCTICA 2: GESTIÓN DE ESTADOS VISUALES CON classList"); // Ejecuta llamada o método

// En lugar de escribir múltiples estilos inline en JavaScript, añade y remueve clases CSS:
const zonaConClases = new NodoDOMSimulado("div", "drop-zone", "zona-clases"); // Declara e inicializa "zonaConClases"

zonaConClases.addEventListener("dragenter", ({ target }) => target.classList.add("zona-activa")); // Registra escuchador de eventos
zonaConClases.addEventListener("dragleave", ({ target }) => target.classList.remove("zona-activa")); // Registra escuchador de eventos

zonaConClases.dispatchEventSimulado("dragenter"); // Ejecuta llamada o método
console.log("Clases tras dragenter            :", zonaConClases.className); // Imprime salida en consola
zonaConClases.dispatchEventSimulado("dragleave"); // Ejecuta llamada o método
console.log("Clases tras dragleave            :", zonaConClases.className); // Imprime salida en consola


// ==============================================================================
// BLOQUE 13: ERROR COMÚN: INTENTAR LEER getData() FUERA DEL EVENTO drop
// ==============================================================================
imprimirSeparador(13, "ERROR COMÚN: LEER getData() FUERA DEL EVENTO drop"); // Ejecuta llamada o método

// ❌ Por motivos estrictos de seguridad de los navegadores, los datos guardados en
// 'dataTransfer' están aislados y protegidos contra lectura durante los eventos
// intermedios ('drag', 'dragenter', 'dragover', 'dragleave').
// Si intentas ejecutar 'e.dataTransfer.getData()' dentro de 'dragover', devolverá "".

const dtProtegido = new DataTransferSimulado(); // Declara e inicializa "dtProtegido"
dtProtegido._faseActual = "dragstart"; // Asigna valor
dtProtegido.setData("text/plain", "dato-secreto-123"); // Ejecuta llamada o método

dtProtegido._faseActual = "dragover"; // Asigna valor
console.log("❌ Lectura de getData() en dragover :", JSON.stringify(dtProtegido.getData("text/plain")), "(Vacío por seguridad)"); // Imprime salida en consola

dtProtegido._faseActual = "drop"; // Asigna valor
console.log("✅ Lectura de getData() en drop     :", JSON.stringify(dtProtegido.getData("text/plain")), "(Lectura permitida)"); // Imprime salida en consola


// ==============================================================================
// BLOQUE 14: PROYECTO INTEGRADOR: IMPLEMENTACIÓN DE UN TEXTURIZADOR
// ==============================================================================
imprimirSeparador(14, "PROYECTO INTEGRADOR: EL TEXTURIZADOR INTERACTIVO"); // Ejecuta llamada o método

// Implementamos el Texturizador completo de la guía oficial utilizando JavaScript moderno,
// retornos implícitos y desestructuración de parámetros ({ dataTransfer, target }):

const texturas = [
    new NodoDOMSimulado("div", "textura", "textura-madera", { url: "url('madera.jpg')" }),
    new NodoDOMSimulado("div", "textura", "textura-metal", { url: "url('metal.jpg')" })
];
const lienzo = new NodoDOMSimulado("div", "drop-zone", "canvas-destino"); // Declara e inicializa "lienzo"
lienzo.innerText = "Arrastra una textura aquí para aplicarla al modelo"; // Asigna valor

// 1. Configurar comportamiento de las texturas (Origen)
texturas.forEach(textura => { // Instrucción JavaScript
    textura.addEventListener("dragstart", ({ dataTransfer, target }) => { // Registra escuchador de eventos
        // Guardamos el ID del elemento y la URL de su atributo personalizado data-url
        dataTransfer.setData("text/plain", target.id); // Ejecuta llamada o método
        dataTransfer.setData("text/url-pattern", target.dataset.url); // Ejecuta llamada o método
        target.classList.add("arrastrando"); // Modifica clases CSS del elemento
    });

    textura.addEventListener("dragend", ({ target }) => target.classList.remove("arrastrando")); // Registra escuchador de eventos
});

// 2. Configurar comportamiento del Lienzo (Destino)
lienzo.addEventListener("dragenter", ({ target }) => target.classList.add("zona-activa")); // Registra escuchador de eventos
lienzo.addEventListener("dragleave", ({ target }) => target.classList.remove("zona-activa")); // Registra escuchador de eventos

// Habilitar de forma obligatoria la recepción anulando la restricción nativa
lienzo.addEventListener("dragover", (e) => e.preventDefault()); // Registra escuchador de eventos

lienzo.addEventListener("drop", (e) => { // Registra escuchador de eventos
    e.preventDefault(); // Detiene aperturas colaterales de enlaces o imágenes en el navegador

    const { dataTransfer, target } = e; // Declara e inicializa "variable"
    const rutaImagen = dataTransfer.getData("text/url-pattern"); // Declara e inicializa "rutaImagen"

    if (rutaImagen) { // Evalúa condición
        // Aplicamos la textura directamente al fondo de la zona receptora
        target.style.backgroundImage = rutaImagen; // Asigna valor
        target.querySelector("p").innerText = "¡Textura Aplicada Correctamente!"; // Instrucción JavaScript
    }

    target.classList.remove("zona-activa"); // Modifica clases CSS del elemento
});

// Simulamos arrastrar la textura de madera y soltarla en el lienzo:
const dtTextura = new DataTransferSimulado(); // Declara e inicializa "dtTextura"
texturas[0].dispatchEventSimulado("dragstart", dtTextura); // Ejecuta llamada o método
console.log("1. Miniatura en dragstart (clases):", texturas[0].className); // Imprime salida en consola
lienzo.dispatchEventSimulado("dragenter", dtTextura); // Ejecuta llamada o método
lienzo.dispatchEventSimulado("dragover", dtTextura); // Ejecuta llamada o método
lienzo.dispatchEventSimulado("drop", dtTextura); // Ejecuta llamada o método
texturas[0].dispatchEventSimulado("dragend", dtTextura); // Ejecuta llamada o método

console.log("2. Fondo aplicado en el lienzo    :", lienzo.style.backgroundImage); // Imprime salida en consola
console.log("3. Texto actualizado del lienzo   :", lienzo.innerText); // Imprime salida en consola


// ==============================================================================
// BLOQUE 15: RESOLUCIÓN DE LOS 3 RETOS PRÁCTICOS DEL MÓDULO
// ==============================================================================
imprimirSeparador(15, "RESOLUCIÓN DE LOS 3 RETOS PRÁCTICOS (NIVELES 1, 2 Y 3)"); // Ejecuta llamada o método

// --- RETO NIVEL 1 (Junior): Control de opacidad y carga en el objeto emisor ---
console.log("--- RETO NIVEL 1 (Junior): Eventos del Objeto Emisor ---"); // Imprime salida en consola
const nodoReto1 = new NodoDOMSimulado("div", "circulo", "circulo-reto-1"); // Declara e inicializa "nodoReto1"
const dtReto1 = new DataTransferSimulado(); // Declara e inicializa "dtReto1"

nodoReto1.addEventListener("dragstart", (e) => { // Registra escuchador de eventos
    nodoReto1.style.opacity = "0.5"; // Asigna valor
    e.dataTransfer.setData("text/plain", e.target.className); // Ejecuta llamada o método
});
nodoReto1.addEventListener("dragend", () => { // Registra escuchador de eventos
    nodoReto1.style.opacity = "1"; // Asigna valor
});

nodoReto1.dispatchEventSimulado("dragstart", dtReto1); // Ejecuta llamada o método
console.log("En dragstart -> Opacidad:", nodoReto1.style.opacity, "| Dato:", dtReto1.getData("text/plain")); // Imprime salida en consola
nodoReto1.dispatchEventSimulado("dragend", dtReto1); // Ejecuta llamada o método
console.log("En dragend   -> Opacidad restaurada a:", nodoReto1.style.opacity); // Imprime salida en consola

// --- RETO NIVEL 2 (Semi-Senior): Control completo de la zona receptora ---
console.log("\n--- RETO NIVEL 2 (Semi-Senior): Zona Receptora Habilitada ---"); // Imprime salida en consola
const zonaReto2 = new NodoDOMSimulado("div", "cuadrado", "cuadrado-reto-2"); // Declara e inicializa "zonaReto2"
zonaReto2.addEventListener("dragenter", ({ target }) => target.classList.add("zona-activa")); // Registra escuchador de eventos
zonaReto2.addEventListener("dragleave", ({ target }) => target.classList.remove("zona-activa")); // Registra escuchador de eventos
zonaReto2.addEventListener("dragover", (e) => e.preventDefault()); // Registra escuchador de eventos
zonaReto2.addEventListener("drop", (e) => { // Registra escuchador de eventos
    e.preventDefault(); // Ejecuta llamada o método
    const claseRecibida = e.dataTransfer.getData("text/plain"); // Declara e inicializa "claseRecibida"
    e.target.classList.remove("zona-activa"); // Modifica clases CSS del elemento
    console.log("En drop      -> Elemento recibido en zona:", claseRecibida, "| Clases:", e.target.className); // Imprime salida en consola
});

zonaReto2.dispatchEventSimulado("dragenter", dtReto1); // Ejecuta llamada o método
zonaReto2.dispatchEventSimulado("dragover", dtReto1); // Ejecuta llamada o método
zonaReto2.dispatchEventSimulado("drop", dtReto1); // Ejecuta llamada o método

// --- RETO NIVEL 3 (Producción): Texturizador aplicando Metal ---
console.log("\n--- RETO NIVEL 3 (Producción): Texturizador Aplicando Metal ---"); // Imprime salida en consola
const dtMetal = new DataTransferSimulado(); // Declara e inicializa "dtMetal"
texturas[1].dispatchEventSimulado("dragstart", dtMetal); // Ejecuta llamada o método
lienzo.dispatchEventSimulado("dragover", dtMetal); // Ejecuta llamada o método
lienzo.dispatchEventSimulado("drop", dtMetal); // Ejecuta llamada o método
texturas[1].dispatchEventSimulado("dragend", dtMetal); // Ejecuta llamada o método
console.log("Nueva textura aplicada al lienzo :", lienzo.style.backgroundImage); // Imprime salida en consola


// ==============================================================================
// BLOQUE 16: RESUMEN TÉCNICO Y CHULETA MAESTRA
// ==============================================================================
imprimirSeparador(16, "RESUMEN TÉCNICO DE LA API DE DRAG & DROP"); // Ejecuta llamada o método

console.log(`
RESUMEN TÉCNICO:
1. El ciclo de vida del arrastre se divide en dos frentes: el objeto emisor (dragstart, drag, dragend)
   y la zona receptora (dragenter, dragover/dragmove, dragleave, drop).
2. El atributo draggable="true" es obligatorio en HTML para habilitar el arrastre en elementos personalizados.
3. El método e.preventDefault() debe invocarse obligatoriamente en el evento 'dragover' de la zona destino
   para desbloquear la recepción y permitir que se dispare el evento 'drop'.
4. El objeto e.dataTransfer garantiza la integridad transaccional mediante setData(formato, valor) en
   'dragstart' y getData(formato) exclusivamente en el evento 'drop'.
`);
console.log("=============================================================================="); // Imprime salida en consola
console.log("🎯 [FIN DEL LABORATORIO]: Módulo de Drag & Drop completado."); // Imprime salida en consola
console.log("==============================================================================\n"); // Imprime salida en consola
