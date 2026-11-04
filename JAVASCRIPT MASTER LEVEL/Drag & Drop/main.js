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
"use strict";

// Función auxiliar para imprimir divisores elegantes y pedagógicos en la consola
function imprimirSeparador(numeroBloque, titulo) {
    // Imprime un salto de línea inicial para separar del bloque previo
    console.log("\n" + "=".repeat(78));
    // Imprime el número del bloque y el título descriptivo en mayúsculas
    console.log(`📌 BLOQUE ${numeroBloque}: ${titulo}`);
    // Imprime la línea divisoria inferior de cierre
    console.log("=".repeat(78));
}

// ==============================================================================
// COMPATIBILIDAD UNIVERSAL (DOM Y SIMULADOR DE EVENTOS DRAG & DROP PARA NODE.JS)
// ==============================================================================
// Para que este archivo pueda ejecutarse tanto en el navegador como en la terminal
// con 'node main.js', creamos una clase simuladora de elementos DOM y de 'dataTransfer':
class DataTransferSimulado {
    constructor() {
        // Almacén interno clave-valor para custodiar los formatos MIME durante el viaje
        this._almacen = {};
        // Fase actual del ciclo para emular las reglas de seguridad del navegador
        this._faseActual = "dragstart";
    }

    // Guarda información durante el evento dragstart
    setData(formato, valor) {
        this._almacen[String(formato)] = String(valor);
    }

    // Extrae la información custodiada (protegida en eventos intermedios como dragover)
    getData(formato) {
        if (this._faseActual !== "drop" && this._faseActual !== "dragstart") {
            return "";
        }
        return Object.prototype.hasOwnProperty.call(this._almacen, String(formato))
            ? this._almacen[String(formato)]
            : "";
    }
}

class NodoDOMSimulado {
    constructor(tagName, className = "", id = "", dataset = {}) {
        this.tagName = tagName.toUpperCase();
        this.className = className;
        this.id = id;
        this.draggable = true;
        this.dataset = { ...dataset };
        this.style = { opacity: "1", backgroundImage: "" };
        this.innerText = "";
        this._clases = new Set(className ? className.split(/\s+/) : []);
        this._listeners = {};
    }

    get classList() {
        const self = this;
        return {
            add(clase) {
                self._clases.add(clase);
                self.className = Array.from(self._clases).join(" ");
            },
            remove(clase) {
                self._clases.delete(clase);
                self.className = Array.from(self._clases).join(" ");
            },
            contains(clase) {
                return self._clases.has(clase);
            }
        };
    }

    addEventListener(tipoEvento, callback) {
        if (!this._listeners[tipoEvento]) {
            this._listeners[tipoEvento] = [];
        }
        this._listeners[tipoEvento].push(callback);
    }

    dispatchEventSimulado(tipoEvento, dataTransferCompartido) {
        if (dataTransferCompartido) {
            dataTransferCompartido._faseActual = tipoEvento;
        }
        let defaultPrevenido = false;
        const evento = {
            type: tipoEvento,
            target: this,
            currentTarget: this,
            dataTransfer: dataTransferCompartido || new DataTransferSimulado(),
            preventDefault() {
                defaultPrevenido = true;
            },
            get defaultPrevented() {
                return defaultPrevenido;
            }
        };
        const lista = this._listeners[tipoEvento] || [];
        lista.forEach(fn => fn(evento));
        return evento;
    }

    querySelector() {
        return this;
    }
}


// ==============================================================================
// BLOQUE 1: INTRODUCCIÓN A LA API NATIVA DE DRAG & DROP
// ==============================================================================
imprimirSeparador(1, "INTRODUCCIÓN A LA API NATIVA DE DRAG & DROP");

// La API de Drag & Drop (Arrastrar y Soltar) de HTML5 proporciona soporte nativo
// para interactuar con elementos mediante gestos del ratón o pantallas táctiles.
// Antes de HTML5 era obligatorio calcular coordenadas ('clientX', 'clientY') con
// eventos de ratón redundantes; hoy contamos con 7 eventos arquitectónicos y un
// contenedor de transferencia de datos integrado ('e.dataTransfer').

console.log("Enfoque antiguo (Pre-HTML5)      : Cálculo manual de clientX/clientY en mousemove");
console.log("Estándar moderno (API Nativa)    : 7 eventos de ciclo de vida + objeto dataTransfer");
console.log("Capacidad de transferencia       : Entre componentes del DOM o desde el sistema operativo");


// ==============================================================================
// BLOQUE 2: CONFIGURACIÓN INICIAL: EL ATRIBUTO 'draggable="true"'
// ==============================================================================
imprimirSeparador(2, "CONFIGURACIÓN INICIAL: EL ATRIBUTO draggable='true'");

// Por defecto en HTML, únicamente las imágenes (<img>) y los enlaces (<a href="...">)
// son arrastrables de manera nativa.
// Para que un elemento personalizado (como un <div>) pueda iniciar el ciclo de arrastre,
// es estrictamente obligatorio declarar el atributo 'draggable="true"' en su etiqueta HTML:
// <div id="objeto-textura" draggable="true">Arrástrame</div>

console.log("Elementos arrastrables de fábrica: Imágenes (<img>) y Enlaces (<a href='...'>)");
console.log("Requisito en un <div> o <span>   : Declarar explícitamente draggable=\"true\" en HTML");


// ==============================================================================
// BLOQUE 3: PRIMER CONTACTO PRÁCTICO (.circulo Y .cuadrado)
// ==============================================================================
imprimirSeparador(3, "PRIMER CONTACTO PRÁCTICO: EVENTOS DE .circulo Y .cuadrado");

// Reproducimos y ejecutamos la estructura base con '.circulo' (objeto que se arrastra)
// y '.cuadrado' (zona receptora), escuchando los 7 eventos fundamentales del ciclo:
const circulo = new NodoDOMSimulado("div", "circulo", "nodo-circulo");
const cuadrado = new NodoDOMSimulado("div", "cuadrado", "nodo-cuadrado");

// --- Eventos en el objeto (.circulo) ---
circulo.addEventListener("dragstart", e => {
    console.log("1. [dragstart] -> Drag Start en .circulo");
    // Guardamos la clase del elemento arrastrado dentro de dataTransfer
    e.dataTransfer.setData("text-plain", e.target.className);
    console.log("   [setData]   -> Guardado en 'text-plain':", e.dataTransfer.getData("text-plain"));
});

circulo.addEventListener("drag", e => {
    console.log("2. [drag]      -> Drag (moviendo .circulo en pantalla)");
});

circulo.addEventListener("dragend", e => {
    console.log("7. [dragend]   -> Drag End (fin del ciclo de arrastre)");
});

// --- Eventos en la zona receptora (.cuadrado) ---
cuadrado.addEventListener("dragenter", e => {
    console.log("3. [dragenter] -> Drag Enter (el cursor entró a .cuadrado)");
});

cuadrado.addEventListener("dragover", e => {
    // Obligatorio prevenir el comportamiento por defecto para permitir el evento 'drop'
    e.preventDefault();
    console.log("4. [dragover]  -> Drag Over (e.preventDefault() ejecutado ✅)");
});

cuadrado.addEventListener("dragleave", e => {
    console.log("5. [dragleave] -> Drag Leave (si el cursor sale de .cuadrado)");
});

cuadrado.addEventListener("drop", e => {
    e.preventDefault();
    console.log("6. [drop]      -> Drop en .cuadrado | Dato recibido:", e.dataTransfer.getData("text-plain"));
});

// Disparamos la secuencia completa para verificar el funcionamiento en consola:
const dtInicial = new DataTransferSimulado();
circulo.dispatchEventSimulado("dragstart", dtInicial);
circulo.dispatchEventSimulado("drag", dtInicial);
cuadrado.dispatchEventSimulado("dragenter", dtInicial);
cuadrado.dispatchEventSimulado("dragover", dtInicial);
cuadrado.dispatchEventSimulado("dragleave", dtInicial);
cuadrado.dispatchEventSimulado("drop", dtInicial);
circulo.dispatchEventSimulado("dragend", dtInicial);


// ==============================================================================
// BLOQUE 4: EVENTOS DEL OBJETO (EL ELEMENTO QUE SE ARRASTRA)
// ==============================================================================
imprimirSeparador(4, "LOS 3 EVENTOS DEL OBJETO EMISOR (dragstart, drag, dragend)");

// Los eventos del objeto gestionan exclusivamente el estado del elemento que el usuario
// ha seleccionado y está desplazando por la pantalla:
// 1. dragstart: Se dispara en el milisegundo exacto en que comienza el arrastre.
//               Es el único momento válido para inicializar la carga con setData().
// 2. drag     : Se ejecuta continuamente a alta frecuencia mientras dura el desplazamiento.
// 3. dragend  : Se dispara al finalizar la operación (ya sea por un drop exitoso o por
//               cancelación con la tecla Esc). Se usa para restaurar opacidades o clases.

const objetoTextura = new NodoDOMSimulado("div", "textura", "objeto-textura");

objetoTextura.addEventListener("dragstart", () => {
    objetoTextura.style.opacity = "0.5";
    console.log("Evento [dragstart] -> Inicio del arrastre | Opacidad reducida a:", objetoTextura.style.opacity);
});

objetoTextura.addEventListener("dragend", () => {
    objetoTextura.style.opacity = "1";
    console.log("Evento [dragend]   -> Fin del arrastre    | Opacidad restaurada a:", objetoTextura.style.opacity);
});

objetoTextura.dispatchEventSimulado("dragstart");
objetoTextura.dispatchEventSimulado("dragend");


// ==============================================================================
// BLOQUE 5: EVENTOS DE ZONA (EL CONTENEDOR QUE RECIBE EL OBJETO)
// ==============================================================================
imprimirSeparador(5, "LOS 4 EVENTOS DE LA ZONA RECEPTORA (DROP ZONE)");

// Los eventos de zona controlan los contenedores destinados a recibir objetos arrastrados:
const resumenEventosZona = [
    {
        evento: "dragenter",
        momento: "Cuando el cursor entra por primera vez en los límites de la zona",
        uso: "Iluminar o resaltar visualmente la zona receptora (.classList.add)"
    },
    {
        evento: "dragover (dragmove)",
        momento: "Se ejecuta repetidamente mientras el objeto flota sobre la zona",
        uso: "Invocar obligatoriamente e.preventDefault() para permitir el drop"
    },
    {
        evento: "dragleave",
        momento: "Cuando el cursor sale de los límites de la zona sin soltar",
        uso: "Limpiar las clases de resaltado visual (.classList.remove)"
    },
    {
        evento: "drop",
        momento: "Cuando el usuario suelta el botón del ratón sobre la zona habilitada",
        uso: "Leer los datos con e.dataTransfer.getData() y aplicar la lógica final"
    }
];

resumenEventosZona.forEach(item => {
    console.log(`[${item.evento.padEnd(19)}] -> ${item.momento}`);
    console.log(`${" ".repeat(23)}Acción: ${item.uso}`);
});


// ==============================================================================
// BLOQUE 6: EL ROL CRÍTICO DE 'e.preventDefault()' EN dragover Y drop
// ==============================================================================
imprimirSeparador(6, "POR QUÉ ES OBLIGATORIO e.preventDefault() EN dragover");

// ⚠️ NOTA CRÍTICA DE LA API NATIVA:
// Por defecto, los navegadores prohíben soltar elementos dentro de contenedores genéricos (<div>).
// Si olvidas llamar a 'e.preventDefault()' dentro del evento 'dragover', el puntero mostrará
// un icono de prohibido (🚫) y el evento 'drop' JAMÁS se disparará.

const zonaDestino = new NodoDOMSimulado("div", "drop-zone", "zona-destino");

zonaDestino.addEventListener("dragover", (e) => {
    e.preventDefault(); // ✅ OBLIGATORIO: Desbloquea la zona para permitir el evento 'drop'
});

zonaDestino.addEventListener("drop", (e) => {
    e.preventDefault(); // ✅ Evita que el navegador abra archivos o enlaces arrastrados como URL
    console.log("Estado de zonaDestino en drop    : ¡Objeto depositado con éxito! ✅");
});

const evOver = zonaDestino.dispatchEventSimulado("dragover");
console.log("¿Se invocó preventDefault() en dragover?:", evOver.defaultPrevented);
zonaDestino.dispatchEventSimulado("drop");


// ==============================================================================
// BLOQUE 7: MANIPULACIÓN DE DATOS CON LA PROPIEDAD 'dataTransfer'
// ==============================================================================
imprimirSeparador(7, "EL MOTOR DE LA API: EL OBJETO e.dataTransfer");

// El objeto 'dataTransfer' se expone de forma nativa dentro del evento de arrastre ('e.dataTransfer').
// Actúa como una caja de seguridad o contenedor temporal en memoria encargado de custodiar
// la información durante el viaje del objeto desde el nodo emisor hasta la zona receptora.

console.log("Propiedad nativa del evento      : e.dataTransfer");
console.log("Método de escritura (dragstart)  : e.dataTransfer.setData(formato, valor)");
console.log("Método de lectura (drop)         : e.dataTransfer.getData(formato)");


// ==============================================================================
// BLOQUE 8: INSERCIÓN CON setData() Y EXTRACCIÓN CON getData()
// ==============================================================================
imprimirSeparador(8, "INSERCIÓN CON setData() Y EXTRACCIÓN CON getData()");

// 1. setData(formato, valor): Almacena la información durante 'dragstart'.
//    Recibe dos strings: el tipo MIME (ej. 'text/plain', 'text/url-pattern') y el valor.
// 2. getData(formato): Recupera la información en el evento 'drop' usando exactamente el mismo formato.

const dtTransaccion = new DataTransferSimulado();

// Fase 1: Al iniciar el arrastre (dragstart)
dtTransaccion._faseActual = "dragstart";
dtTransaccion.setData("text/plain", "objeto-textura-01");
dtTransaccion.setData("text/url-pattern", "url('madera.jpg')");
console.log("1. [dragstart] setData('text/plain')       -> Guardado 'objeto-textura-01'");
console.log("2. [dragstart] setData('text/url-pattern') -> Guardado \"url('madera.jpg')\"");

// Fase 2: Al soltar en la zona receptora (drop)
dtTransaccion._faseActual = "drop";
const idRecuperado = dtTransaccion.getData("text/plain");
const patronRecuperado = dtTransaccion.getData("text/url-pattern");
console.log("3. [drop]      getData('text/plain')       ->", idRecuperado);
console.log("4. [drop]      getData('text/url-pattern') ->", patronRecuperado);


// ==============================================================================
// BLOQUE 9: ANALOGÍAS DEL MUNDO REAL (CAMIÓN DE MUDANZAS Y TAPETE DE TIENDA)
// ==============================================================================
imprimirSeparador(9, "ANALOGÍAS DEL MUNDO REAL: CAMIÓN 🚚 Y TAPETE DE TIENDA 🚪");

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
imprimirSeparador(10, "DIAGRAMA DE FLUJO DEL CICLO DE ARRASTRE");

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
imprimirSeparador(11, "BUENA PRÁCTICA 1: e.preventDefault() SIEMPRE EN dragover");

console.log("✅ Regla obligatoria en cualquier zona receptora:");
console.log("   zona.addEventListener('dragover', (e) => e.preventDefault());");
console.log("   Sin esta línea, el navegador bloquea el contenedor y el evento 'drop' nunca ocurre.");


// ==============================================================================
// BLOQUE 12: BUENA PRÁCTICA 2: USAR CLASES CSS (classList) PARA ESTADOS VISUALES
// ==============================================================================
imprimirSeparador(12, "BUENA PRÁCTICA 2: GESTIÓN DE ESTADOS VISUALES CON classList");

// En lugar de escribir múltiples estilos inline en JavaScript, añade y remueve clases CSS:
const zonaConClases = new NodoDOMSimulado("div", "drop-zone", "zona-clases");

zonaConClases.addEventListener("dragenter", ({ target }) => target.classList.add("zona-activa"));
zonaConClases.addEventListener("dragleave", ({ target }) => target.classList.remove("zona-activa"));

zonaConClases.dispatchEventSimulado("dragenter");
console.log("Clases tras dragenter            :", zonaConClases.className);
zonaConClases.dispatchEventSimulado("dragleave");
console.log("Clases tras dragleave            :", zonaConClases.className);


// ==============================================================================
// BLOQUE 13: ERROR COMÚN: INTENTAR LEER getData() FUERA DEL EVENTO drop
// ==============================================================================
imprimirSeparador(13, "ERROR COMÚN: LEER getData() FUERA DEL EVENTO drop");

// ❌ Por motivos estrictos de seguridad de los navegadores, los datos guardados en
// 'dataTransfer' están aislados y protegidos contra lectura durante los eventos
// intermedios ('drag', 'dragenter', 'dragover', 'dragleave').
// Si intentas ejecutar 'e.dataTransfer.getData()' dentro de 'dragover', devolverá "".

const dtProtegido = new DataTransferSimulado();
dtProtegido._faseActual = "dragstart";
dtProtegido.setData("text/plain", "dato-secreto-123");

dtProtegido._faseActual = "dragover";
console.log("❌ Lectura de getData() en dragover :", JSON.stringify(dtProtegido.getData("text/plain")), "(Vacío por seguridad)");

dtProtegido._faseActual = "drop";
console.log("✅ Lectura de getData() en drop     :", JSON.stringify(dtProtegido.getData("text/plain")), "(Lectura permitida)");


// ==============================================================================
// BLOQUE 14: PROYECTO INTEGRADOR: IMPLEMENTACIÓN DE UN TEXTURIZADOR
// ==============================================================================
imprimirSeparador(14, "PROYECTO INTEGRADOR: EL TEXTURIZADOR INTERACTIVO");

// Implementamos el Texturizador completo de la guía oficial utilizando JavaScript moderno,
// retornos implícitos y desestructuración de parámetros ({ dataTransfer, target }):

const texturas = [
    new NodoDOMSimulado("div", "textura", "textura-madera", { url: "url('madera.jpg')" }),
    new NodoDOMSimulado("div", "textura", "textura-metal", { url: "url('metal.jpg')" })
];
const lienzo = new NodoDOMSimulado("div", "drop-zone", "canvas-destino");
lienzo.innerText = "Arrastra una textura aquí para aplicarla al modelo";

// 1. Configurar comportamiento de las texturas (Origen)
texturas.forEach(textura => {
    textura.addEventListener("dragstart", ({ dataTransfer, target }) => {
        // Guardamos el ID del elemento y la URL de su atributo personalizado data-url
        dataTransfer.setData("text/plain", target.id);
        dataTransfer.setData("text/url-pattern", target.dataset.url);
        target.classList.add("arrastrando");
    });

    textura.addEventListener("dragend", ({ target }) => target.classList.remove("arrastrando"));
});

// 2. Configurar comportamiento del Lienzo (Destino)
lienzo.addEventListener("dragenter", ({ target }) => target.classList.add("zona-activa"));
lienzo.addEventListener("dragleave", ({ target }) => target.classList.remove("zona-activa"));

// Habilitar de forma obligatoria la recepción anulando la restricción nativa
lienzo.addEventListener("dragover", (e) => e.preventDefault());

lienzo.addEventListener("drop", (e) => {
    e.preventDefault(); // Detiene aperturas colaterales de enlaces o imágenes en el navegador

    const { dataTransfer, target } = e;
    const rutaImagen = dataTransfer.getData("text/url-pattern");

    if (rutaImagen) {
        // Aplicamos la textura directamente al fondo de la zona receptora
        target.style.backgroundImage = rutaImagen;
        target.querySelector("p").innerText = "¡Textura Aplicada Correctamente!";
    }

    target.classList.remove("zona-activa");
});

// Simulamos arrastrar la textura de madera y soltarla en el lienzo:
const dtTextura = new DataTransferSimulado();
texturas[0].dispatchEventSimulado("dragstart", dtTextura);
console.log("1. Miniatura en dragstart (clases):", texturas[0].className);
lienzo.dispatchEventSimulado("dragenter", dtTextura);
lienzo.dispatchEventSimulado("dragover", dtTextura);
lienzo.dispatchEventSimulado("drop", dtTextura);
texturas[0].dispatchEventSimulado("dragend", dtTextura);

console.log("2. Fondo aplicado en el lienzo    :", lienzo.style.backgroundImage);
console.log("3. Texto actualizado del lienzo   :", lienzo.innerText);


// ==============================================================================
// BLOQUE 15: RESOLUCIÓN DE LOS 3 RETOS PRÁCTICOS DEL MÓDULO
// ==============================================================================
imprimirSeparador(15, "RESOLUCIÓN DE LOS 3 RETOS PRÁCTICOS (NIVELES 1, 2 Y 3)");

// --- RETO NIVEL 1 (Junior): Control de opacidad y carga en el objeto emisor ---
console.log("--- RETO NIVEL 1 (Junior): Eventos del Objeto Emisor ---");
const nodoReto1 = new NodoDOMSimulado("div", "circulo", "circulo-reto-1");
const dtReto1 = new DataTransferSimulado();

nodoReto1.addEventListener("dragstart", (e) => {
    nodoReto1.style.opacity = "0.5";
    e.dataTransfer.setData("text/plain", e.target.className);
});
nodoReto1.addEventListener("dragend", () => {
    nodoReto1.style.opacity = "1";
});

nodoReto1.dispatchEventSimulado("dragstart", dtReto1);
console.log("En dragstart -> Opacidad:", nodoReto1.style.opacity, "| Dato:", dtReto1.getData("text/plain"));
nodoReto1.dispatchEventSimulado("dragend", dtReto1);
console.log("En dragend   -> Opacidad restaurada a:", nodoReto1.style.opacity);

// --- RETO NIVEL 2 (Semi-Senior): Control completo de la zona receptora ---
console.log("\n--- RETO NIVEL 2 (Semi-Senior): Zona Receptora Habilitada ---");
const zonaReto2 = new NodoDOMSimulado("div", "cuadrado", "cuadrado-reto-2");
zonaReto2.addEventListener("dragenter", ({ target }) => target.classList.add("zona-activa"));
zonaReto2.addEventListener("dragleave", ({ target }) => target.classList.remove("zona-activa"));
zonaReto2.addEventListener("dragover", (e) => e.preventDefault());
zonaReto2.addEventListener("drop", (e) => {
    e.preventDefault();
    const claseRecibida = e.dataTransfer.getData("text/plain");
    e.target.classList.remove("zona-activa");
    console.log("En drop      -> Elemento recibido en zona:", claseRecibida, "| Clases:", e.target.className);
});

zonaReto2.dispatchEventSimulado("dragenter", dtReto1);
zonaReto2.dispatchEventSimulado("dragover", dtReto1);
zonaReto2.dispatchEventSimulado("drop", dtReto1);

// --- RETO NIVEL 3 (Producción): Texturizador aplicando Metal ---
console.log("\n--- RETO NIVEL 3 (Producción): Texturizador Aplicando Metal ---");
const dtMetal = new DataTransferSimulado();
texturas[1].dispatchEventSimulado("dragstart", dtMetal);
lienzo.dispatchEventSimulado("dragover", dtMetal);
lienzo.dispatchEventSimulado("drop", dtMetal);
texturas[1].dispatchEventSimulado("dragend", dtMetal);
console.log("Nueva textura aplicada al lienzo :", lienzo.style.backgroundImage);


// ==============================================================================
// BLOQUE 16: RESUMEN TÉCNICO Y CHULETA MAESTRA
// ==============================================================================
imprimirSeparador(16, "RESUMEN TÉCNICO DE LA API DE DRAG & DROP");

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
console.log("==============================================================================");
console.log("🎯 [FIN DEL LABORATORIO]: Módulo de Drag & Drop completado.");
console.log("==============================================================================\n");
