/**
 * ==============================================================================
 * 🌐 JAVASCRIPT MASTER LEVEL: MÓDULO COMPLETO DE LAS APIs EN EL DESARROLLO WEB
 * ==============================================================================
 * Archivo: main.js
 * Propósito: Guía práctica ejecutable, comentada y explicada línea por línea al 100%
 * Ejecución: En terminal con 'node main.js' o directamente en la consola del navegador
 * 
 * TEMARIO DEL MÓDULO (DOCUMENTACION/APIs.md):
 * 1. Definición de API (Application Programming Interface)
 * 2. Interfaz de Código (API) vs. Interfaz de Usuario (UI)
 * 3. Sintaxis básica de Fetch API y anatomía de una petición HTTP
 * 4. Desglose de los 4 componentes: Endpoint, Método HTTP, Headers y Body
 * 5. Métodos / Verbos HTTP estándar (GET, POST, PUT, PATCH, DELETE)
 * 6. Formato de datos estándar: JSON (Serialización con stringify y Parseo con parse)
 * 7. Comparativa técnica y arquitectónica: API RESTful vs. APIs basadas en SOAP
 * 8. Analogía del mundo real: El camarero en el restaurante 🍽️
 * 9. Diagrama de flujo de decisión HTTP (Códigos 2xx vs. 4xx / 5xx)
 * 10. Buenas prácticas: Validación explícita de 'response.ok' y códigos de estado
 * 11. Buenas prácticas: Uso de variables de entorno (.env) para credenciales
 * 12. Errores comunes: Exposición de API Keys confidenciales en el Front-end
 * 13. Errores comunes: Ignorar la naturaleza asíncrona de las Promesas (fetch sin await)
 * 14. Peticiones completas con async/await, try...catch y cabeceras HTTP
 * 15. Resolución completa de los 3 Ejercicios del curso (Niveles 1, 2 y 3)
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
// SIMULADOR LOCAL DE RED (MOCK FETCH) PARA EJECUCIÓN 100% SEGURA SIN INTERNET
// ==============================================================================
// Como las rutas del temario ('api.ejemplo.com', 'api.ficticia.com') son dominios
// pedagógicos ficticios, creamos un simulador local de respuestas HTTP que emula
// fielmente el objeto Response de Fetch API (status, ok, statusText, json()).
function fetchSimulado(url, opciones = {}) {
    // Extraemos el método HTTP configurado o asignamos 'GET' por defecto
    const metodo = (opciones.method || "GET").toUpperCase();

    // Retornamos una Promesa que resuelve un objeto Response simulado
    return new Promise((resolve) => {
        // Simulamos una ruta con error 404 si la URL incluye '/no-existe'
        if (url.includes("/no-existe")) {
            resolve({
                ok: false,
                status: 404,
                statusText: "Not Found",
                url: url,
                json: async () => ({ error: "Recurso no encontrado en el servidor" })
            });
            return;
        }

        // Si es una petición POST, devolvemos estado 201 (Created) y el cuerpo enviado
        if (metodo === "POST") {
            const cuerpoRecibido = opciones.body ? JSON.parse(opciones.body) : {};
            resolve({
                ok: true,
                status: 201,
                statusText: "Created",
                url: url,
                json: async () => ({
                    mensaje: "Recurso creado exitosamente",
                    idGenerado: 101,
                    datosGuardados: cuerpoRecibido
                })
            });
            return;
        }

        // Por defecto, para peticiones GET exitosas devolvemos estado 200 (OK)
        resolve({
            ok: true,
            status: 200,
            statusText: "OK",
            url: url,
            json: async () => ({
                id: 42,
                nombre: "Ana López",
                rol: "Desarrolladora",
                activo: true,
                endpointConsultado: url
            })
        });
    });
}


// ==============================================================================
// BLOQUE 1: DEFINICIÓN DE API (APPLICATION PROGRAMMING INTERFACE)
// ==============================================================================
imprimirSeparador(1, "DEFINICIÓN DE API (APPLICATION PROGRAMMING INTERFACE)");

// Una API es un conjunto de reglas, protocolos y definiciones que permite que
// diferentes aplicaciones de software se comuniquen e intercambien datos entre sí.
// Actúa como un puente o intermediario: tu aplicación solicita datos o servicios
// a un servidor externo sin necesidad de conocer cómo está programado por dentro.

const definicionAPI = {
    siglas: "API (Application Programming Interface)",
    traduccion: "Interfaz de Programación de Aplicaciones",
    rolPrincipal: "Puente o intermediario estandarizado entre dos sistemas de software",
    beneficioClave: "Abstracción total: consumes el servicio sin conocer la base de datos interna"
};

console.log("Concepto fundamental de API      :", definicionAPI.siglas);
console.log("Rol en la arquitectura web       :", definicionAPI.rolPrincipal);
console.log("Ventaja de ingeniería            :", definicionAPI.beneficioClave);


// ==============================================================================
// BLOQUE 2: INTERFAZ DE CÓDIGO (API) VS. INTERFAZ DE USUARIO (UI)
// ==============================================================================
imprimirSeparador(2, "INTERFAZ DE CÓDIGO (API) VS. INTERFAZ DE USUARIO (UI)");

// 1. UI (User Interface): Conecta a un ser humano con una máquina mediante botones,
//    formularios, colores y pantallas visuales.
// 2. API (Application Programming Interface): Conecta una máquina (código) con otra
//    máquina (servidor) mediante peticiones estructuradas y datos en formato JSON.

console.log("Interfaz de Usuario (UI)         : Humano  <──(Botones / Pantallas)──> Aplicación");
console.log("Interfaz de Programación (API)   : Código  <──(Peticiones HTTP/JSON)─> Servidor");


// ==============================================================================
// BLOQUE 3: SINTAXIS BÁSICA Y ANATOMÍA DE UNA PETICIÓN HTTP
// ==============================================================================
imprimirSeparador(3, "SINTAXIS BÁSICA Y ANATOMÍA DE UNA PETICIÓN");

// En JavaScript moderno, la función nativa 'fetch()' inicia una petición HTTP hacia
// una URL específica llamada Endpoint y retorna una Promesa (Promise):
//
// fetch('https://api.ejemplo.com/v1/usuarios/42')
//   .then(response => response.json())
//   .then(data => console.log(data));

console.log("Ejemplo de sintaxis nativa Fetch :");
console.log(`  fetch('https://api.ejemplo.com/v1/usuarios/42')`);
console.log(`    .then(response => response.json())`);
console.log(`    .then(data => console.log(data));`);


// ==============================================================================
// BLOQUE 4: DESGLOSE DE LOS 4 COMPONENTES DE UNA PETICIÓN HTTP
// ==============================================================================
imprimirSeparador(4, "LOS 4 COMPONENTES DE UNA PETICIÓN HTTP");

// Toda petición HTTP profesional hacia una API se compone de 4 elementos esenciales:
// 1. Endpoint (Ruta): La URL única que apunta al recurso (ej. 'https://api.ejemplo.com/v1/usuarios/42').
// 2. Método HTTP (Verbo): Define la operación que deseamos realizar (GET, POST, PUT, PATCH, DELETE).
// 3. Headers (Cabeceras): Metadatos clave-valor (tipo de contenido JSON, tokens de autorización, etc.).
// 4. Body (Cuerpo): La carga útil de datos enviada al servidor (usada en POST, PUT y PATCH).

const peticionAnatomia = {
    endpoint: "https://api.ejemplo.com/v1/usuarios/42",
    method: "PUT",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer token_ejemplo_seguro"
    },
    body: JSON.stringify({
        nombre: "Ana López",
        rol: "Senior Developer"
    })
};

console.log("1. Endpoint (Ruta del recurso)   :", peticionAnatomia.endpoint);
console.log("2. Método HTTP (Acción)          :", peticionAnatomia.method);
console.log("3. Headers (Metadatos)           :", JSON.stringify(peticionAnatomia.headers));
console.log("4. Body (Cuerpo serializado)     :", peticionAnatomia.body);


// ==============================================================================
// BLOQUE 5: MÉTODOS / VERBOS HTTP ESTÁNDAR (CRUD EN REST)
// ==============================================================================
imprimirSeparador(5, "MÉTODOS (VERBOS) HTTP ESTÁNDAR");

// Los verbos HTTP representan las operaciones CRUD (Create, Read, Update, Delete):
const verbosHTTP = [
    { verbo: "GET",    operacionCRUD: "Read (Leer)",              llevaBody: "No",  proposito: "Solicitar u obtener datos de un recurso" },
    { verbo: "POST",   operacionCRUD: "Create (Crear)",           llevaBody: "Sí",  proposito: "Enviar información para crear un nuevo recurso" },
    { verbo: "PUT",    operacionCRUD: "Update (Reemplazar)",      llevaBody: "Sí",  proposito: "Actualizar o reemplazar un recurso existente completo" },
    { verbo: "PATCH",  operacionCRUD: "Update (Parcial)",         llevaBody: "Sí",  proposito: "Modificar parcialmente campos específicos de un recurso" },
    { verbo: "DELETE", operacionCRUD: "Delete (Eliminar)",        llevaBody: "No",  proposito: "Eliminar un recurso del servidor" }
];

verbosHTTP.forEach(item => {
    console.log(`Verbo [${item.verbo.padEnd(6)}] -> ${item.operacionCRUD.padEnd(20)} | ¿Body?: ${item.llevaBody} | ${item.proposito}`);
});


// ==============================================================================
// BLOQUE 6: FORMATO DE DATOS ESTÁNDAR: JSON
// ==============================================================================
imprimirSeparador(6, "FORMATO DE DATOS ESTÁNDAR: JSON");

// JSON (JavaScript Object Notation) es el formato universal de intercambio de datos en la web.
// Reglas clave de JSON:
// - Las claves (keys) SIEMPRE deben ir entre comillas dobles "".
// - Soporta strings, números, booleanos (true/false), null, arrays [] y objetos {}.
// - No permite funciones, valores 'undefined' ni comentarios.

// 1. Objeto nativo en memoria de JavaScript:
const usuarioObjetoJS = {
    id: 42,
    nombre: "Ana López",
    rol: "Desarrolladora",
    activo: true
};

// 2. Serialización (Objeto JS -> Cadena de texto JSON para enviar por la red):
const textoJSONEnviado = JSON.stringify(usuarioObjetoJS);
console.log("Objeto serializado (stringify)   :", textoJSONEnviado);
console.log("Tipo de dato tras stringify      :", typeof textoJSONEnviado); // "string"

// 3. Parseo o Deserialización (Cadena JSON recibida -> Objeto JS manipulable):
const objetoRecuperado = JSON.parse(textoJSONEnviado);
console.log("Objeto parseado (JSON.parse)     :", objetoRecuperado.nombre, "-", objetoRecuperado.rol);
console.log("¿Está activo? (booleano real)    :", objetoRecuperado.activo === true);


// ==============================================================================
// BLOQUE 7: COMPARATIVA: API RESTful VS. APIs BASADAS EN SOAP
// ==============================================================================
imprimirSeparador(7, "COMPARATIVA: API RESTful VS. SOAP");

console.log(`
🏛️ ARQUITECTURA RESTful (Representational State Transfer):
  - Estilo arquitectónico ligero basado en recursos identificables por URLs claras.
  - Utiliza los métodos nativos del protocolo HTTP (GET, POST, PUT, PATCH, DELETE).
  - Formato estrella: JSON (ligero, rápido de parsear y nativo en JavaScript).
  - Caso de uso ideal: Aplicaciones web modernas, apps móviles, microservicios y APIs públicas.

🏢 PROTOCOLO SOAP (Simple Object Access Protocol):
  - Protocolo estricto y pesado basado en estándares formales independientes del transporte.
  - Depende exclusivamente del formato XML (verboso y con etiquetas de apertura/cierre).
  - Requiere contratos rígidos mediante esquemas WSDL (Web Services Description Language).
  - Caso de uso ideal: Sistemas bancarios heredados (legacy), pasarelas financieras o entornos corporativos cerrados.
`);


// ==============================================================================
// BLOQUE 8: ANALOGÍA DEL MUNDO REAL: EL CAMARERO EN EL RESTAURANTE 🍽️
// ==============================================================================
imprimirSeparador(8, "ANALOGÍA DEL MUNDO REAL: EL CAMARERO 🍽️");

console.log(`
🍽️ METÁFORA DEL CAMARERO EN EL RESTAURANTE:
1. El Cliente (Tú en la mesa)  ──> Es el Front-end (Navegador / App Móvil) que necesita datos.
2. La Cocina (Almacén y Chef)  ──> Es el Back-end (Servidor y Base de Datos) donde se procesa todo.
3. El Camarero (Intermediario) ──> Es la API:
   - Toma tu pedido en la mesa (Petición HTTP / Request).
   - Lleva la orden a la cocina y valida que el platillo exista.
   - Regresa a tu mesa con el plato listo para consumir (Respuesta HTTP / JSON Response).

Conclusión: Tú no necesitas entrar a la cocina ni saber cómo se encendieron las estufas;
el camarero (API) gestiona el intercambio de forma segura, ordenada y estandarizada.
`);


// ==============================================================================
// BLOQUE 9: DIAGRAMA DE FLUJO DE DECISIÓN HTTP
// ==============================================================================
imprimirSeparador(9, "DIAGRAMA DE FLUJO DE DECISIÓN HTTP");

console.log(`
                [ Cliente envía Petición HTTP ]
                               │
                ┌──────────────┴──────────────┐
                ▼ ¿Código de estado 2xx?       ▼ ¿Código de estado 4xx/5xx?
         [ Respuesta Exitosa ]          [ Error en Petición / Servidor ]
                │                              │
                ▼                              ▼
       [ Procesar JSON ]             [ Capturar en bloque catch ]
                │                              │
                └──────────────┬──────────────┘
                               ▼
                   [ Renderizar en Pantalla ]
`);


// ==============================================================================
// BLOQUE 10: BUENAS PRÁCTICAS: VALIDAR SIEMPRE 'response.ok'
// ==============================================================================
imprimirSeparador(10, "BUENA PRÁCTICA 1: VALIDAR SIEMPRE 'response.ok'");

// ⚠️ DATO TÉCNICO CRÍTICO DE FETCH:
// En JavaScript, 'fetch()' SOLO rechaza la promesa automáticamente si ocurre un fallo
// físico de red (ej. cable desconectado, sin Wi-Fi o fallo de DNS).
// Si el servidor responde con un error HTTP 404 (No encontrado) o 500 (Error interno),
// ¡la promesa de fetch SE RESUELVE SIN ENTRAR AL CATCH!
// Por eso es obligatorio verificar 'if (!response.ok)' antes de llamar a 'response.json()'.

function verificarRespuestaHTTP(respuestaSimulada) {
    // response.ok es true únicamente cuando el código HTTP está entre 200 y 299 (2xx)
    if (!respuestaSimulada.ok) {
        return `❌ Error HTTP detectado: Estado ${respuestaSimulada.status} (${respuestaSimulada.statusText})`;
    }
    return `✅ Respuesta válida: Estado ${respuestaSimulada.status} (${respuestaSimulada.statusText})`;
}

console.log("Prueba con respuesta 200 OK      :", verificarRespuestaHTTP({ ok: true, status: 200, statusText: "OK" }));
console.log("Prueba con respuesta 404 Error   :", verificarRespuestaHTTP({ ok: false, status: 404, statusText: "Not Found" }));


// ==============================================================================
// BLOQUE 11: BUENAS PRÁCTICAS: VARIABLES DE ENTORNO (.env)
// ==============================================================================
imprimirSeparador(11, "BUENA PRÁCTICA 2: VARIABLES DE ENTORNO (.env)");

// Nunca se deben escribir claves privadas (API Keys), tokens secretos ni contraseñas
// directamente en el código fuente ("hardcoding").
// En su lugar, se leen desde variables de entorno configuradas en archivos '.env'
// (ignorados en Git mediante .gitignore).

// Simulamos la lectura segura desde 'process.env' en Node.js con valor de respaldo:
const apiKeySegura = (typeof process !== "undefined" && process.env && process.env.REACT_APP_MI_API_KEY)
    ? process.env.REACT_APP_MI_API_KEY
    : "CLAVE_CARGADA_DESDE_ENTORNO_SEGURO";

console.log("Lectura desde variable de entorno:", apiKeySegura);


// ==============================================================================
// BLOQUE 12: ERROR COMÚN 1: EXPONER API KEYS EN EL CLIENTE (FRONT-END)
// ==============================================================================
imprimirSeparador(12, "ERROR COMÚN 1: EXPONER API KEYS EN EL FRONT-END");

// ❌ ANTIPATRÓN DE SEGURIDAD:
// const urlInsegura = "https://api.privada.com/data?key=12345_SECRET_KEY_EXPOSED";
// Cualquier usuario que abra la pestaña 'Network' (Red) en las DevTools del navegador
// verá la URL completa y podrá robar tu clave privada para consumir tu cuota o tus datos.

// ✅ SOLUCIÓN ARQUITECTÓNICA:
// El Front-end debe llamar a tu propio servidor Back-end o función Serverless (/api/datos),
// y es tu servidor privado quien añade la API Key de forma oculta antes de hablar con el proveedor externo.

console.log("❌ Incorrecto (Cliente directo)  : Front-end ──(API Key visible en DevTools)──> API Externa");
console.log("✅ Correcto (Proxy/Back-end)     : Front-end ──> Tu Servidor (inyecta API Key) ──> API Externa");


// ==============================================================================
// BLOQUE 13: ERROR COMÚN 2: NO MANEJAR LA ASINCRONÍA ADECUADAMENTE
// ==============================================================================
imprimirSeparador(13, "ERROR COMÚN 2: OLVIDAR AWAIT / .THEN() EN LLAMADAS ASÍNCRONAS");

// ❌ ERROR FRECUENTE:
// Intentar acceder a las propiedades de los datos inmediatamente sin esperar a que
// la Promesa de red se resuelva:
const promesaPendiente = fetchSimulado("https://api.ejemplo.com/usuarios");

// Como 'promesaPendiente' es un objeto Promise (no el JSON final), '.nombre' no existe aún:
console.log("Acceso síncrono sin 'await' (❌) :", promesaPendiente.nombre); // Imprime: undefined
console.log("¿Qué contiene realmente?         :", promesaPendiente instanceof Promise ? "Un objeto Promise pendiente" : typeof promesaPendiente);


// ==============================================================================
// BLOQUE 14: EJECUCIÓN ASÍNCRONA COMPLETA Y RESOLUCIÓN DE LOS 3 EJERCICIOS
// ==============================================================================
imprimirSeparador(14, "RESOLUCIÓN DE LOS 3 EJERCICIOS OFICIALES DEL CURSO");

// --- EJERCICIO 1 (Nivel 1 — Junior): Diseño de Endpoints RESTful ---
// Enunciado: Diseña conceptualmente las rutas (Endpoints) utilizando el estándar RESTful
// para un sistema de biblioteca escolar. Escribe la URL y el método HTTP necesario para:
// 1. Obtener la lista completa de libros.
// 2. Registrar un libro nuevo en el catálogo.
console.log("--- EJERCICIO 1 (Nivel 1): Diseño de Endpoints RESTful (Biblioteca Escolar) ---");

const disenoBibliotecaREST = {
    obtenerListaLibros: {
        metodoHTTP: "GET",
        endpoint: "https://api.bibliotecaescolar.edu/v1/libros",
        descripcion: "Retorna un arreglo JSON con todos los libros del catálogo (Código 200 OK)"
    },
    registrarLibroNuevo: {
        metodoHTTP: "POST",
        endpoint: "https://api.bibliotecaescolar.edu/v1/libros",
        headers: { "Content-Type": "application/json" },
        bodyEjemplo: { titulo: "Cien años de soledad", autor: "Gabriel García Márquez", isbn: "978-0307474728" },
        descripcion: "Crea un nuevo libro en la colección usando el mismo sustantivo en plural (Código 201 Created)"
    }
};

console.log("1. Obtener lista completa        :", `${disenoBibliotecaREST.obtenerListaLibros.metodoHTTP} ${disenoBibliotecaREST.obtenerListaLibros.endpoint}`);
console.log("2. Registrar un libro nuevo      :", `${disenoBibliotecaREST.registrarLibroNuevo.metodoHTTP} ${disenoBibliotecaREST.registrarLibroNuevo.endpoint}`);
console.log("   Cuerpo (Body) a enviar en POST:", JSON.stringify(disenoBibliotecaREST.registrarLibroNuevo.bodyEjemplo));


// --- EJERCICIO 2 (Nivel 2 — Semi-Senior): Optimización con async/await y validación ---
// Enunciado: Corrige y optimiza el siguiente fragmento agregando el manejo correcto de
// asincronía (async/await) y la validación de errores para asegurar que la respuesta
// del servidor sea correcta antes de transformar el cuerpo a JSON:
// function conseguirDatos() {
//     let respuesta = fetch("https://api.ejemplo.com/perfil");
//     let usuario = respuesta.json();
//     return usuario;
// }

// Declaramos la función corregida con la palabra clave 'async'
async function conseguirDatos(clienteFetch = fetchSimulado) {
    try {
        // 1. Esperamos con 'await' a que el servidor responda a la petición HTTP
        const respuesta = await clienteFetch("https://api.ejemplo.com/perfil");

        // 2. Validamos explícitamente que el código de estado sea exitoso (200-299)
        if (!respuesta.ok) {
            throw new Error(`Error HTTP al obtener perfil: Estado ${respuesta.status} (${respuesta.statusText})`);
        }

        // 3. Esperamos con 'await' la conversión asíncrona del cuerpo a objeto JSON
        const usuario = await respuesta.json();

        // 4. Retornamos el objeto de usuario ya procesado
        return usuario;
    } catch (error) {
        // Capturamos cualquier fallo de red o error HTTP lanzado manualmente
        console.error("Fallo capturado en conseguirDatos():", error.message);
        return null;
    }
}


// --- EJERCICIO 3 (Nivel 3 — Avanzado): Petición POST con Headers y Body JSON ---
// Enunciado: Escribe una función utilizando la API nativa 'fetch' que envíe una petición
// de tipo 'POST' hacia la ruta 'https://api.ficticia.com/productos'. La función debe mandar
// en el cuerpo un objeto JSON con las propiedades 'nombre: "Teclado Mecánico"' y 'precio: 85'.
// Asegúrate de incluir la cabecera (Header) correspondiente para indicar contenido JSON.

async function registrarProducto(clienteFetch = fetchSimulado) {
    // Definimos el Endpoint de destino solicitado en el enunciado
    const url = "https://api.ficticia.com/productos";

    // Definimos el objeto de datos con las propiedades requeridas
    const nuevoProducto = {
        nombre: "Teclado Mecánico",
        precio: 85
    };

    try {
        // Ejecutamos la petición configurando method, headers y body serializado
        const response = await clienteFetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevoProducto)
        });

        // Verificamos si la creación fue exitosa (código 200 o 201 Created)
        if (!response.ok) {
            throw new Error(`No se pudo crear el producto. Código HTTP: ${response.status}`);
        }

        // Extraemos la respuesta JSON del servidor
        const resultado = await response.json();
        return resultado;
    } catch (error) {
        console.error("Error al registrar producto:", error.message);
        return null;
    }
}


// ==============================================================================
// BLOQUE 15: DEMOSTRACIÓN EN VIVO DE LAS FUNCIONES ASÍNCRONAS (EJERCICIOS 2 Y 3)
// ==============================================================================
async function ejecutarLaboratorioAsincrono() {
    imprimirSeparador(15, "EJECUCIÓN ASÍNCRONA EN VIVO (EJERCICIOS 2 Y 3)");

    console.log("--- Ejecutando Ejercicio 2: conseguirDatos() con async/await ---");
    const perfilUsuario = await conseguirDatos();
    console.log("Usuario obtenido exitosamente    :", JSON.stringify(perfilUsuario));

    console.log("\n--- Ejecutando Ejercicio 3: registrarProducto() con POST y JSON ---");
    const confirmacionPost = await registrarProducto();
    console.log("Respuesta del servidor (201)     :", JSON.stringify(confirmacionPost));

    // ==============================================================================
    // BLOQUE 16: RESUMEN MAESTRO Y CHULETA TÉCNICA
    // ==============================================================================
    imprimirSeparador(16, "RESUMEN MAESTRO DE LAS APIs EN EL DESARROLLO WEB");

    console.log(`
RESUMEN TÉCNICO:
1. Una API (Application Programming Interface) es una interfaz de código que comunica sistemas a través de la red.
2. Anatomía HTTP: Endpoint (URL), Método (GET, POST, PUT, PATCH, DELETE), Headers (metadatos) y Body (carga útil).
3. JSON es el estándar universal de intercambio: 'JSON.stringify()' serializa a texto y 'JSON.parse()' / 'response.json()' convierte a objeto JS.
4. RESTful utiliza recursos en URLs y verbos HTTP con JSON; SOAP es un protocolo rígido basado en XML y WSDL.
5. REGLA DE ORO DE FETCH: Validar siempre 'if (!response.ok)' porque los estados 404 o 500 no disparan el catch por sí solos.
6. SEGURIDAD: Jamás exponer API Keys privadas en el Front-end; utilizar variables de entorno (.env) en un servidor intermediario.
`);
    console.log("==============================================================================");
    console.log("🎯 [FIN DEL LABORATORIO]: Módulo de APIs en el Desarrollo Web completado.");
    console.log("==============================================================================\n");
}

// Iniciamos el laboratorio asíncrono final
ejecutarLaboratorioAsincrono();
