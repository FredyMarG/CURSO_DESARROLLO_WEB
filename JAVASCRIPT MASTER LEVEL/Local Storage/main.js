/**
 * ==============================================================================
 * 💾 JAVASCRIPT MASTER LEVEL: MÓDULO COMPLETO DE LOCALSTORAGE Y SESSIONSTORAGE
 * ==============================================================================
 * Archivo: main.js
 * Propósito: Guía práctica ejecutable, comentada y explicada línea por línea al 100%
 * Ejecución: Directamente en la consola del navegador o en terminal con 'node main.js'
 * 
 * TEMARIO DEL MÓDULO (DOCUMENTACION/LOCALSTORAGE.md):
 * 1. ¿Qué es el Almacenamiento Web (Web Storage) y por qué supera a las Cookies?
 * 2. Primer contacto práctico: Guardar y leer con setItem("nombre", "Fredy") y getItem()
 * 3. Diferencias clave: LocalStorage (Permanente) vs. SessionStorage (Temporal por pestaña)
 * 4. Anatomía de los 4 métodos fundamentales: setItem(), getItem(), removeItem() y clear()
 * 5. El problema de la conversión implícita a texto: "[object Object]"
 * 6. Solución profesional: Serialización con JSON.stringify() y Parseo con JSON.parse()
 * 7. Analogía del mundo real: El Escritorio (RAM), el Archivador (Local) y el Bloc (Session) 📂
 * 8. Diagrama de flujo de decisión de persistencia en el cliente
 * 9. Buena práctica 1: Envolver JSON.parse() en un bloque try...catch contra datos corruptos
 * 10. Buena práctica 2: Verificar existencia (null) y valores por defecto
 * 11. Limitaciones de seguridad: Por qué jamás guardar contraseñas ni datos sensibles (XSS)
 * 12. Error común 1: Asumir que booleanos ("false") o números ("0") conservan su tipo original
 * 13. Error común 2: Límites de cuota de almacenamiento (5MB - 10MB y QuotaExceededError)
 * 14. Resolución paso a paso del Ejercicio Nivel 1 (Token en SessionStorage)
 * 15. Resolución paso a paso de los Ejercicios Nivel 2 (Historial) y Nivel 3 (Sistema de Idioma)
 * 16. Resumen maestro y chuleta técnica
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
// COMPATIBILIDAD UNIVERSAL (NAVEGADOR NATIVO + SIMULADOR SI SE EJECUTA EN NODE.JS)
// ==============================================================================
// En el navegador existen 'window.localStorage' y 'window.sessionStorage' de forma nativa.
// Para que este archivo también pueda ejecutarse con 'node main.js' en la terminal sin errores,
// creamos un almacenamiento en memoria compatible si 'localStorage' no está definido en el entorno:
function crearStorageCompatible() {
    const almacen = {};
    return {
        setItem(clave, valor) {
            // Web Storage convierte siempre la clave y el valor a cadena de texto (String)
            almacen[String(clave)] = String(valor);
        },
        getItem(clave) {
            // Si la clave existe devuelve su string; si no existe, devuelve estrictamente null
            return Object.prototype.hasOwnProperty.call(almacen, String(clave))
                ? almacen[String(clave)]
                : null;
        },
        removeItem(clave) {
            delete almacen[String(clave)];
        },
        clear() {
            for (const k of Object.keys(almacen)) {
                delete almacen[k];
            }
        },
        get length() {
            return Object.keys(almacen).length;
        }
    };
}

// Si estamos en Node.js (donde no existe window.localStorage), inyectamos el simulador en globalThis
if (typeof globalThis.localStorage === "undefined") {
    globalThis.localStorage = crearStorageCompatible();
}
if (typeof globalThis.sessionStorage === "undefined") {
    globalThis.sessionStorage = crearStorageCompatible();
}


// ==============================================================================
// BLOQUE 1: ¿QUÉ ES EL ALMACENAMIENTO WEB (WEB STORAGE)?
// ==============================================================================
imprimirSeparador(1, "¿QUÉ ES EL ALMACENAMIENTO WEB (WEB STORAGE)?");

// Web Storage es una API nativa de los navegadores modernos que permite guardar datos
// localmente en el dispositivo del usuario bajo un formato de CLAVE-VALOR (key-value).
// Ventajas frente a las antiguas Cookies:
// 1. No viaja al servidor en cada petición HTTP (mayor velocidad y menor consumo de red).
// 2. Capacidad muy superior: entre 5MB y 10MB por origen (frente a los apenas 4KB de una Cookie).
// 3. Interfaz nativa en JavaScript limpia y directa (.setItem, .getItem, .removeItem, .clear).

console.log("Formato de almacenamiento        : Pares Clave-Valor (Key-Value) en texto (String)");
console.log("Capacidad frente a Cookies       : Web Storage (5MB - 10MB) vs. Cookies (4KB)");
console.log("Tráfico de red HTTP              : 0 bytes (los datos permanecen 100% en el cliente)");


// ==============================================================================
// BLOQUE 2: PRIMER CONTACTO PRÁCTICO (GUARDAR Y LEER EN LOCALSTORAGE)
// ==============================================================================
imprimirSeparador(2, "PRIMER CONTACTO: GUARDAR Y LEER CON setItem() Y getItem()");

// Guardamos la clave "nombre" con el valor "Fredy" dentro del almacenamiento local:
localStorage.setItem("nombre", "Fredy");

// Inspeccionamos el objeto localStorage completo:
console.log("Estado actual de localStorage    :", localStorage);

// Recuperamos el valor asociado a la clave "nombre" y lo guardamos en una variable:
let nombre = localStorage.getItem("nombre");
console.log("Valor recuperado de 'nombre'     :", nombre); // Imprime: "Fredy"


// ==============================================================================
// BLOQUE 3: DIFERENCIAS CLAVE: LOCALSTORAGE 💾 VS. SESSIONSTORAGE ⏱️
// ==============================================================================
imprimirSeparador(3, "DIFERENCIAS CLAVE: LOCALSTORAGE VS. SESSIONSTORAGE");

// Ambos objetos comparten exactamente los mismos métodos, pero difieren en su ciclo de vida:
const comparativaStorage = [
    {
        criterio: "Persistencia",
        localStorage: "Permanente (no expira al cerrar pestaña o navegador)",
        sessionStorage: "Temporal (se destruye al cerrar la pestaña)"
    },
    {
        criterio: "Ámbito (Scope)",
        localStorage: "Compartido entre todas las pestañas del mismo origen",
        sessionStorage: "Aislado en la pestaña actual donde fue creado"
    },
    {
        criterio: "Capacidad",
        localStorage: "Generalmente de 5MB a 10MB",
        sessionStorage: "Generalmente hasta 5MB"
    },
    {
        criterio: "Casos de uso",
        localStorage: "Tema oscuro/claro, idioma, carrito de compras",
        sessionStorage: "Formularios multipaso, estado de una sola pestaña"
    }
];

comparativaStorage.forEach(fila => {
    console.log(`[${fila.criterio.padEnd(14)}] -> Local: ${fila.localStorage}`);
    console.log(`${" ".repeat(19)}Session: ${fila.sessionStorage}`);
});


// ==============================================================================
// BLOQUE 4: LOS 4 MÉTODOS FUNDAMENTALES DE LA API WEB STORAGE
// ==============================================================================
imprimirSeparador(4, "ANATOMÍA DE LOS 4 MÉTODOS: setItem, getItem, removeItem, clear");

// 1. setItem(clave, valor): Crea una nueva entrada o sobrescribe el valor si la clave ya existe
localStorage.setItem("usuario", "Carlos");
console.log("1. Tras setItem('usuario', 'Carlos') ->", localStorage.getItem("usuario"));

// 2. getItem(clave): Lee el valor asociado; si la clave NO existe, retorna estrictamente null
console.log("2. getItem('clave_inexistente')      ->", localStorage.getItem("clave_inexistente")); // null

// 3. removeItem(clave): Elimina únicamente la clave indicada sin afectar a las demás
localStorage.removeItem("usuario");
console.log("3. Tras removeItem('usuario')        ->", localStorage.getItem("usuario")); // null
console.log("   ¿Sigue existiendo 'nombre'?       ->", localStorage.getItem("nombre"));  // "Fredy"

// 4. clear(): Vacía por completo todas las claves guardadas en ese almacenamiento
// (Lo demostramos sobre sessionStorage para conservar 'nombre' en localStorage)
sessionStorage.setItem("pasoActual", "2");
sessionStorage.clear();
console.log("4. Tras sessionStorage.clear()       -> pasoActual:", sessionStorage.getItem("pasoActual"));


// ==============================================================================
// BLOQUE 5: EL PROBLEMA DE LA CONVERSIÓN IMPLÍCITA ("[object Object]")
// ==============================================================================
imprimirSeparador(5, "EL PROBLEMA DE GUARDAR OBJETOS SIN SERIALIZAR");

// ⚠️ REGLA TÉCNICA FUNDAMENTAL:
// Web Storage SOLO almacena cadenas de texto (strings).
// Si pasas un objeto literal directamente a setItem(), JavaScript ejecuta internamente
// 'configuracion.toString()', lo cual devuelve la inútil cadena "[object Object]".

const configuracion = { tema: "oscuro", volumen: 80 };

// ❌ Forma incorrecta (conversión implícita destructiva):
localStorage.setItem("config_rota", configuracion);
console.log("❌ Objeto guardado sin stringify  :", localStorage.getItem("config_rota")); // "[object Object]"


// ==============================================================================
// BLOQUE 6: LA SOLUCIÓN PROFESIONAL (JSON.stringify Y JSON.parse)
// ==============================================================================
imprimirSeparador(6, "SOLUCIÓN PROFESIONAL: JSON.stringify() Y JSON.parse()");

// ✅ Para guardar objetos o arrays sin perder su estructura:
// Paso 1: Convertimos el objeto JS a cadena JSON con JSON.stringify() antes de guardar:
localStorage.setItem("config", JSON.stringify(configuracion));
console.log("1. Cadena JSON almacenada        :", localStorage.getItem("config"));

// Paso 2: Al leer con getItem(), reconstruimos el objeto JS con JSON.parse():
const configGuardada = JSON.parse(localStorage.getItem("config"));
console.log("2. Objeto JS reconstruido (tema) :", configGuardada.tema);
console.log("3. Propiedad numérica (volumen)  :", configGuardada.volumen, `(tipo: ${typeof configGuardada.volumen})`);


// ==============================================================================
// BLOQUE 7: ANALOGÍA DEL MUNDO REAL: EL ARCHIVADOR DEL ESCRITORIO 📂
// ==============================================================================
imprimirSeparador(7, "ANALOGÍA DEL MUNDO REAL: EL ARCHIVADOR DE OFICINA 📂");

console.log(`
📂 METÁFORA DE LA OFICINA DE TRABAJO:
1. El Escritorio de Trabajo (Memoria RAM / Variables de JS):
   - Mientras trabajas, tienes papeles sobre la mesa. Pero al recargar la página o apagar
     la computadora, el escritorio se limpia por completo.
2. El Archivador Metálico en el Rincón (localStorage 💾):
   - Lo que guardes bajo llave en el archivador permanecerá intacto para siempre, incluso
     si apagas la luz, cierras la oficina y vuelves semanas después.
3. El Bloc de Notas Temporal por Cliente (sessionStorage ⏱️):
   - Mientras atiendes a un cliente en una ventana (pestaña abierta), el bloc conserva tus apuntes;
     en cuanto el cliente se retira y cierras esa pestaña, la hoja se desecha inmediatamente.
`);


// ==============================================================================
// BLOQUE 8: DIAGRAMA DE FLUJO DE DECISIÓN
// ==============================================================================
imprimirSeparador(8, "DIAGRAMA DE FLUJO DE DECISIÓN DE ALMACENAMIENTO");

console.log(`
                 ¿Necesitas guardar datos en el cliente?
                                   │
                                   ▼
                ¿Deben persistir al cerrar el navegador?
                                   │
          ┌────────────────────────┴────────────────────────┐
          ▼ SÍ                                              ▼ NO
   [ Usar LocalStorage ]                             [ Usar SessionStorage ]
          │                                                 │
          ├─────────────────────────<───────────────────────┘
          ▼
     ¿El dato es un Objeto o Array?
          │
          ├─────────────────────────┬───────────────────────┐
          ▼ SÍ                      │                       ▼ NO
 [ Serializar con JSON.stringify ]  │              [ Guardar valor directo ]
          │                         │                       │
          ▼                         │                       ▼
  [ Guardar con .setItem() ] <──────┴─────────────── [ Guardar con .setItem() ]
`);


// ==============================================================================
// BLOQUE 9: BUENA PRÁCTICA 1: ENVOLVER JSON.parse EN UN BLOQUE try...catch
// ==============================================================================
imprimirSeparador(9, "BUENA PRÁCTICA 1: PROTEGER JSON.parse() CON try...catch");

// Si un usuario o extensión modifica manualmente el valor en DevTools dejando un JSON
// mal formado (ej. "{tema: oscuro"), JSON.parse() lanzará un SyntaxError que detendrá toda la web.
// Por ello, toda lectura de JSON desde Web Storage debe protegerse con try...catch:

const cargarAjustesSeguros = (clave) => {
    try {
        const datos = localStorage.getItem(clave);
        // Si la clave existe la parseamos; si es null devolvemos null sin error
        return datos ? JSON.parse(datos) : null;
    } catch (error) {
        console.warn(`⚠️ Alerta: El contenido de '${clave}' no es un JSON válido. Retornando null.`);
        return null;
    }
};

// Simulamos un dato corrupto en localStorage:
localStorage.setItem("ajustes_corruptos", "{json_invalido_sin_cerrar");
console.log("Lectura de clave válida ('config')           :", cargarAjustesSeguros("config"));
console.log("Lectura de clave corrupta protegida con catch:", cargarAjustesSeguros("ajustes_corruptos"));


// ==============================================================================
// BLOQUE 10: BUENA PRÁCTICA 2: VERIFICAR EXISTENCIA Y VALORES POR DEFECTO
// ==============================================================================
imprimirSeparador(10, "BUENA PRÁCTICA 2: VALORES POR DEFECTO ANTE 'null'");

// Como getItem() devuelve 'null' cuando una clave aún no ha sido guardada, debemos
// combinarlo con el operador de coalescencia nula (??) o el operador lógico OR (||):

const temaPreferido = localStorage.getItem("tema_inexistente") ?? "claro";
console.log("Tema aplicado con respaldo por defecto       :", temaPreferido);


// ==============================================================================
// BLOQUE 11: LIMITACIONES DE SEGURIDAD: PELIGRO DE GUARDAR DATOS SENSIBLES
// ==============================================================================
imprimirSeparador(11, "SEGURIDAD: ¿QUÉ NO SE DEBE GUARDAR NUNCA EN WEB STORAGE?");

// ❌ NUNCA almacenes en localStorage ni sessionStorage:
// - Contraseñas en texto plano o hashes.
// - Números de tarjetas de crédito o códigos CVV.
// - Historiales médicos o datos personales confidenciales.
// ¿Por qué?: Cualquier script de JavaScript en la página (incluyendo paquetes npm de terceros
// o un ataque XSS - Cross-Site Scripting) puede ejecutar 'localStorage.getItem()' y robarlos.

console.log("❌ Prohibido guardar en Storage  : Contraseñas, tarjetas bancarias, datos médicos sensibles");
console.log("✅ Seguro guardar en Storage     : Tema visual (dark/light), idioma ('es'/'en'), UI colapsada");


// ==============================================================================
// BLOQUE 12: ERROR COMÚN 1: BOOLEANOS ("false") Y NÚMEROS ("0") COMO STRINGS
// ==============================================================================
imprimirSeparador(12, "ERROR COMÚN 1: LA TRAMPA DEL STRING 'false' (TRUTHY)");

// Cuando guardas el booleano 'false', se almacena como la cadena de texto '"false"'.
// En JavaScript, cualquier string que no esté vacío ("") es evaluado como TRUTHY (verdadero) en un 'if'.

localStorage.setItem("estaLogueado", false);
const valorCrudo = localStorage.getItem("estaLogueado");

console.log("Valor devuelto por getItem()     :", JSON.stringify(valorCrudo), `(tipo: ${typeof valorCrudo})`);

// ❌ Evaluación condicional errónea directa:
if (valorCrudo) {
    console.log("❌ Trampa con if (valorCrudo)    : ¡Entró al if aunque era 'false' porque un string no vacío es truthy!");
}

// ✅ Solución 1: Comparar explícitamente contra el string "true"
const esLogueadoComparacion = valorCrudo === "true";
// ✅ Solución 2: Usar JSON.parse(valorCrudo) para recuperar el booleano real false
const esLogueadoParseado = JSON.parse(valorCrudo);

console.log("✅ Solución con === 'true'       :", esLogueadoComparacion);
console.log("✅ Solución con JSON.parse()     :", esLogueadoParseado, `(tipo: ${typeof esLogueadoParseado})`);


// ==============================================================================
// BLOQUE 13: ERROR COMÚN 2: LÍMITE DE ESPACIO Y DISPOSITIVOS MÓVILES
// ==============================================================================
imprimirSeparador(13, "ERROR COMÚN 2: LÍMITES DE CAPACIDAD (QUOTA EXCEEDED)");

// Aunque el límite habitual es de 5MB a 10MB por dominio, si intentamos almacenar
// imágenes en Base64 o catálogos gigantescos, el navegador lanzará 'QuotaExceededError'.
// Además, en móviles con poca memoria libre, el sistema operativo puede vaciar el almacenamiento.

console.log("Límite típico por origen (Origin): 5 MB a 10 MB máximo");
console.log("Excepción al superar el límite   : DOMException: QuotaExceededError");


// ==============================================================================
// BLOQUE 14: RESOLUCIÓN EJERCICIO NIVEL 1 (USO DE SESSIONSTORAGE)
// ==============================================================================
imprimirSeparador(14, "RESOLUCIÓN EJERCICIO NIVEL 1 (JUNIOR): SESSIONSTORAGE");

// Enunciado Nivel 1:
// Escribe un script que guarde una clave llamada 'token' con el valor "xyz123" en el
// sessionStorage. Luego, recupera dicho valor, muéstralo en la consola del navegador
// y finalmente elimínalo de forma selectiva sin borrar el resto de elementos.

// 1. Guardamos el token en la sesión temporal:
sessionStorage.setItem("token", "xyz123");

// 2. Recuperamos el valor y lo mostramos en consola:
const miToken = sessionStorage.getItem("token");
console.log("1. El token recuperado es        :", miToken); // Imprime: "xyz123"

// 3. Eliminamos el token de forma selectiva con removeItem():
sessionStorage.removeItem("token");
console.log("2. Tras removeItem('token')      :", sessionStorage.getItem("token")); // Imprime: null


// ==============================================================================
// BLOQUE 15: RESOLUCIÓN EJERCICIOS NIVEL 2 (HISTORIAL) Y NIVEL 3 (IDIOMA)
// ==============================================================================
imprimirSeparador(15, "RESOLUCIÓN EJERCICIOS NIVEL 2 (ARRAYS) Y NIVEL 3 (IDIOMA)");

// --- EJERCICIO NIVEL 2 (Semi-Senior): Guardar y recuperar un Array de búsquedas ---
console.log("--- EJERCICIO NIVEL 2: Historial de Búsquedas con JSON ---");

const guardarHistorial = (listaBusquedas) => {
    // Convertimos el array a una cadena JSON de texto plano
    const arraySerializado = JSON.stringify(listaBusquedas);
    localStorage.setItem("busquedas", arraySerializado);
};

const obtenerHistorial = () => {
    const datosRaw = localStorage.getItem("busquedas");

    // Si datosRaw es null (no existe la clave), retornamos un array vacío []
    if (!datosRaw) {
        return [];
    }

    try {
        // Convertimos la cadena de texto de vuelta a un Array real de JavaScript
        return JSON.parse(datosRaw);
    } catch (error) {
        console.error("Historial corrupto, reseteando...", error);
        return [];
    }
};

// Probamos las funciones del Nivel 2:
guardarHistorial(["cursos js", "fetch api", "flexbox css"]);
const historialRecuperado = obtenerHistorial();
console.log("Historial recuperado (Array real):", historialRecuperado, "| ¿Es Array?:", Array.isArray(historialRecuperado));


// --- EJERCICIO NIVEL 3 (Avanzado / Producción): Sistema de Preferencia de Idioma ---
console.log("\n--- EJERCICIO NIVEL 3: Sistema de Preferencias de Idioma en Producción ---");

// Llave de configuración global
const IDIOMA_KEY = "app_lang";

// Limpiamos previamente la clave para demostrar el flujo completo desde la primera visita:
localStorage.removeItem(IDIOMA_KEY);

/**
 * Guarda la elección de idioma del usuario de forma permanente
 */
const cambiarIdioma = (nuevoIdioma) => {
    localStorage.setItem(IDIOMA_KEY, nuevoIdioma);
    console.log(`Idioma cambiado con éxito a      : ${nuevoIdioma}`);
};

/**
 * Determina el idioma inicial al cargar la aplicación
 */
const inicializarIdioma = () => {
    const idiomaGuardado = localStorage.getItem(IDIOMA_KEY);

    if (idiomaGuardado) {
        console.log(`Idioma cargado del usuario       : ${idiomaGuardado}`);
        return idiomaGuardado;
    }

    // Configuración por defecto si el usuario entra por primera vez
    const idiomaPorDefecto = "es";
    localStorage.setItem(IDIOMA_KEY, idiomaPorDefecto);
    console.log(`Primera visita. Idioma defecto   : ${idiomaPorDefecto}`);
    return idiomaPorDefecto;
};

// Simulamos el flujo de producción paso a paso:
const idiomaInicial = inicializarIdioma(); // Primera visita -> guarda y retorna "es"
cambiarIdioma("en");                       // El usuario cambia el idioma a Inglés ("en")
const idiomaAlRecargar = inicializarIdioma(); // Al recargar la app -> recupera "en"


// ==============================================================================
// BLOQUE 16: RESUMEN MAESTRO Y CHULETA TÉCNICA
// ==============================================================================
imprimirSeparador(16, "RESUMEN MAESTRO DE LOCALSTORAGE Y SESSIONSTORAGE");

console.log(`
RESUMEN TÉCNICO:
1. localStorage persiste de forma permanente en el navegador; sessionStorage muere al cerrar la pestaña.
2. Los 4 métodos universales son: .setItem(k, v), .getItem(k), .removeItem(k) y .clear().
3. Web Storage SOLO almacena strings: guardar un objeto sin serializar produce "[object Object]".
4. Usa siempre JSON.stringify() antes de guardar objetos/arrays y JSON.parse() (dentro de try...catch) al leerlos.
5. Cuidado con los booleanos: "false" en string es evaluado como truthy en un if; usa JSON.parse() o === "true".
6. Seguridad ante todo: nunca guardes contraseñas, tarjetas ni datos sensibles en Web Storage.
`);
console.log("==============================================================================");
console.log("🎯 [FIN DEL LABORATORIO]: Módulo de LocalStorage y SessionStorage completado.");
console.log("==============================================================================\n");
