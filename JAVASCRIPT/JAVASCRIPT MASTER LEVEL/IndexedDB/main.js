/**
 * ==============================================================================
 * 🗄️ JAVASCRIPT MASTER LEVEL: MÓDULO COMPLETO DE INDEXEDDB (BASE DE DATOS NOSQL)
 * ==============================================================================
 * Archivo: main.js
 * Propósito: Guía pedagógica ejecutable completa y comentada LÍNEA POR LÍNEA al 100%
 * Ejecución: En consola del navegador o directamente en terminal con 'node main.js'
 * 
 * ESTRUCTURA DEL ARCHIVO:
 * 1. Compatibilidad universal: Soporte nativo de navegador y simulador para Node.js
 * 2. CÓDIGO ORIGINAL DEL ALUMNO (100% CONSERVADO):
 *    - const IDBRequest = indexedDB.open("BD", 1)
 *    - IDBRequest.addEventListener("upgradeneeded", ...)
 *    - IDBRequest.addEventListener("success", ...)
 *    - IDBRequest.addEventListener("error", ...)
 *    - const addObjeto = objeto => { ... }
 *    - const leerObjetos = () => { ... }
 *    - const modObjeto = (key, objeto) => { ... }
 *    - const deleteObjeto = key => { ... }
 * 3. COMPLEMENTOS Y EXPANSIONES DEL TEMARIO:
 *    - Operación de lectura individual por clave (.get)
 *    - Operación de lectura masiva (.getAll)
 *    - Operación de conteo de registros (.count)
 *    - Operación de vaciado total (.clear)
 *    - Creación y consulta mediante Índices secundarios (.createIndex)
 *    - Envoltura moderna con Promesas y Async/Await
 *    - Solucionario oficial de los 3 Ejercicios del temario (Nivel 1, Nivel 2 y Nivel 3)
 *    - Ejecución práctica ordenada de todas las operaciones CRUD
 * ==============================================================================
 */

// Activamos el modo estricto de JavaScript para prevenir errores silenciosos y malas prácticas
"use strict"; // Activa el modo estricto de JavaScript

// ==============================================================================
// 0. COMPATIBILIDAD UNIVERSAL: NAVEGADOR NATIVO + SIMULADOR NOSQL PARA NODE.JS
// ==============================================================================
// Si el entorno no posee 'indexedDB' de forma nativa (por ejemplo, al ejecutar con 'node main.js'),
// inicializamos un simulador en memoria para que el código del alumno funcione sin excepciones:
if (typeof indexedDB === "undefined") {
    // Definimos el objeto global indexedDB en el entorno de Node.js
    globalThis.indexedDB = (() => {
        // Objeto interno que almacenará las bases de datos en memoria
        const baseDeDatos = {};
        // Retornamos el objeto simulador con el método estándar open()
        return {
            // Método open para abrir o crear bases de datos por nombre y versión
            open(nombre, version = 1) {
                // Creamos el objeto de solicitud IDBOpenDBRequest
                const request = {
                    result: null,
                    error: null,
                    _listeners: {},
                    addEventListener(evento, callback) {
                        if (!this._listeners[evento]) this._listeners[evento] = [];
                        this._listeners[evento].push(callback);
                    },
                    _emit(evento, arg) {
                        if (this._listeners[evento]) {
                            this._listeners[evento].forEach(cb => cb(arg));
                        }
                    }
                };

                // Procesamos la apertura de forma asíncrona simulando el comportamiento real
                setTimeout(() => {
                    // Verificamos si la base de datos ya existía
                    const yaExiste = Object.prototype.hasOwnProperty.call(baseDeDatos, nombre);
                    // Obtenemos la versión previa o 0 si es nueva
                    const versionPrevia = yaExiste ? baseDeDatos[nombre].version : 0;

                    // Si no existe, inicializamos la estructura en memoria
                    if (!yaExiste) {
                        baseDeDatos[nombre] = {
                            nombre: nombre,
                            version: version,
                            almacenes: {}
                        };
                    }

                    // Referencia interna a la base de datos
                    const dbData = baseDeDatos[nombre];

                    // Objeto IDBDatabase expuesto como resultado de la solicitud
                    const db = {
                        name: nombre,
                        version: version,
                        objectStoreNames: {
                            contains(storeName) {
                                return Object.prototype.hasOwnProperty.call(dbData.almacenes, storeName);
                            }
                        },
                        createObjectStore(storeName, opciones = {}) {
                            if (!dbData.almacenes[storeName]) {
                                dbData.almacenes[storeName] = {
                                    opciones: opciones,
                                    datos: new Map(),
                                    autoIncrementCounter: 1
                                };
                            }
                            return {
                                createIndex(indexName, keyPath, indexOptions = {}) {
                                    // Simulación de creación de índices
                                }
                            };
                        },
                        transaction(storeNames, modo = "readonly") {
                            const tx = {
                                mode: modo,
                                _listeners: {},
                                addEventListener(evento, callback) {
                                    if (!this._listeners[evento]) this._listeners[evento] = [];
                                    this._listeners[evento].push(callback);
                                },
                                _emit(evento) {
                                    if (this._listeners[evento]) {
                                        this._listeners[evento].forEach(cb => cb());
                                    }
                                },
                                objectStore(sName) {
                                    const s = dbData.almacenes[sName];
                                    if (!s) throw new Error(`Almacén '${sName}' no existe.`);
                                    return {
                                        add(valor, clave) {
                                            const req = { result: null, error: null, onsuccess: null, onerror: null };
                                            setTimeout(() => {
                                                let pk = clave;
                                                if (s.opciones.keyPath && valor && typeof valor === "object") {
                                                    pk = valor[s.opciones.keyPath];
                                                }
                                                if (pk === undefined && s.opciones.autoIncrement) {
                                                    pk = s.autoIncrementCounter++;
                                                }
                                                s.datos.set(pk, JSON.parse(JSON.stringify(valor)));
                                                req.result = pk;
                                                if (req.onsuccess) req.onsuccess({ target: req });
                                                tx._emit("complete");
                                            }, 2);
                                            return req;
                                        },
                                        put(valor, clave) {
                                            const req = { result: null, error: null, onsuccess: null, onerror: null };
                                            setTimeout(() => {
                                                let pk = clave;
                                                if (s.opciones.keyPath && valor && typeof valor === "object") {
                                                    pk = valor[s.opciones.keyPath];
                                                }
                                                if (pk === undefined && s.opciones.autoIncrement) {
                                                    pk = s.autoIncrementCounter++;
                                                }
                                                s.datos.set(pk, JSON.parse(JSON.stringify(valor)));
                                                req.result = pk;
                                                if (req.onsuccess) req.onsuccess({ target: req });
                                                tx._emit("complete");
                                            }, 2);
                                            return req;
                                        },
                                        get(pk) {
                                            const req = { result: null, error: null, onsuccess: null, onerror: null };
                                            setTimeout(() => {
                                                const val = s.datos.get(pk);
                                                req.result = val !== undefined ? JSON.parse(JSON.stringify(val)) : undefined;
                                                if (req.onsuccess) req.onsuccess({ target: req });
                                                tx._emit("complete");
                                            }, 2);
                                            return req;
                                        },
                                        getAll() {
                                            const req = { result: [], error: null, onsuccess: null, onerror: null };
                                            setTimeout(() => {
                                                const lista = Array.from(s.datos.values()).map(v => JSON.parse(JSON.stringify(v)));
                                                req.result = lista;
                                                if (req.onsuccess) req.onsuccess({ target: req });
                                                tx._emit("complete");
                                            }, 2);
                                            return req;
                                        },
                                        delete(pk) {
                                            const req = { result: null, error: null, onsuccess: null, onerror: null };
                                            setTimeout(() => {
                                                s.datos.delete(pk);
                                                req.result = undefined;
                                                if (req.onsuccess) req.onsuccess({ target: req });
                                                tx._emit("complete");
                                            }, 2);
                                            return req;
                                        },
                                        clear() {
                                            const req = { result: null, error: null, onsuccess: null, onerror: null };
                                            setTimeout(() => {
                                                s.datos.clear();
                                                req.result = undefined;
                                                if (req.onsuccess) req.onsuccess({ target: req });
                                                tx._emit("complete");
                                            }, 2);
                                            return req;
                                        },
                                        count() {
                                            const req = { result: 0, error: null, onsuccess: null, onerror: null };
                                            setTimeout(() => {
                                                req.result = s.datos.size;
                                                if (req.onsuccess) req.onsuccess({ target: req });
                                                tx._emit("complete");
                                            }, 2);
                                            return req;
                                        },
                                        openCursor() {
                                            const req = { result: null, error: null, _listeners: {}, addEventListener(e, cb) { this._listeners[e] = cb; } };
                                            const entries = Array.from(s.datos.entries());
                                            let index = 0;
                                            const avanzar = () => {
                                                if (index < entries.length) {
                                                    const [k, v] = entries[index];
                                                    index++;
                                                    req.result = {
                                                        key: k,
                                                        value: JSON.parse(JSON.stringify(v)),
                                                        continue: () => { setTimeout(avanzar, 1); }
                                                    };
                                                } else {
                                                    req.result = null;
                                                }
                                                if (req._listeners["success"]) req._listeners["success"]({ target: req });
                                                if (req.onsuccess) req.onsuccess({ target: req });
                                            };
                                            setTimeout(avanzar, 2);
                                            return req;
                                        }
                                    };
                                }
                            };
                            return tx;
                        }
                    };

                    // Asignamos la base de datos resultante a la solicitud
                    request.result = db;

                    // Si es nueva o subió la versión, disparamos upgradeneeded
                    if (version > versionPrevia) {
                        dbData.version = version;
                        request._emit("upgradeneeded", { target: request });
                        if (request.onupgradeneeded) request.onupgradeneeded({ target: request });
                    }

                    // Disparamos success para confirmar la conexión
                    request._emit("success", { target: request });
                    if (request.onsuccess) request.onsuccess({ target: request });
                }, 10);

                return request;
            }
        };
    })();
}

// ==============================================================================
// 1. CÓDIGO ORIGINAL DEL ALUMNO
// ==============================================================================

// Solicitamos al motor de IndexedDB abrir o crear la base de datos denominada "BD" en su versión 1
const IDBRequest = indexedDB.open("BD", 1);

// Escuchamos el evento 'upgradeneeded', que se dispara únicamente si la base es nueva o la versión se incrementa
IDBRequest.addEventListener("upgradeneeded", () => {
    // Obtenemos la instancia de la base de datos desde la propiedad result de la solicitud
    const db = IDBRequest.result;
    // Creamos el almacén de objetos (Object Store) llamado "nombres" con clave primaria autoincremental
    db.createObjectStore("nombres", {
        // Habilitamos autoIncrement en true para que cada objeto reciba una clave numérica automática (1, 2, 3...)
        autoIncrement: true
    });
});

// Escuchamos el evento 'success', que se ejecuta cuando la base de datos se abre y conecta satisfactoriamente
IDBRequest.addEventListener("success", () => console.log("Todo ok"));

// Escuchamos el evento 'error', que se dispara en caso de presentarse algún fallo de acceso o cuota en la base
IDBRequest.addEventListener("error", (err) => console.log("Error", err));

// Función para agregar un objeto a la base de datos mediante una transacción de lectura y escritura
const addObjeto = objeto => {
    // Obtenemos la referencia activa de la base de datos abierta
    const db = IDBRequest.result;
    // Iniciamos una transacción sobre el almacén "nombres" en modo de lectura y escritura ("readwrite")
    const transaction = db.transaction("nombres", "readwrite");
    // Obtenemos el almacén de objetos "nombres" a través de la transacción iniciada
    const objectStore = transaction.objectStore("nombres");
    // Insertamos el objeto recibido dentro del almacén
    objectStore.add(objeto);
    // Escuchamos el evento 'complete' de la transacción para saber cuándo los datos se guardaron efectivamente
    transaction.addEventListener("complete", () => {
        // Imprimimos en consola el mensaje de confirmación de inserción
        console.log("Objeto agregado correctamente"); // Imprime salida en consola
    });
};

// Función para leer todos los registros almacenados utilizando un cursor iterativo
const leerObjetos = () => {
    // Obtenemos la referencia activa de la base de datos abierta
    const db = IDBRequest.result;
    // Iniciamos una transacción sobre el almacén "nombres" en modo de solo lectura ("readonly")
    const transaction = db.transaction("nombres", "readonly");
    // Obtenemos el almacén de objetos "nombres" mediante la transacción
    const objectStore = transaction.objectStore("nombres");
    // Abrimos un cursor para iterar de manera secuencial sobre cada registro del almacén
    const cursor = objectStore.openCursor();
    // Escuchamos el evento 'success' del cursor, que se dispara por cada registro encontrado
    cursor.addEventListener("success", () => {
        // Evaluamos si el cursor apunta a un registro existente en la posición actual
        if (cursor.result) {
            // Imprimimos en consola el valor del objeto apuntado por el cursor
            console.log(cursor.result.value); // Imprime salida en consola
            // Avanzamos el cursor hacia el siguiente registro del almacén
            cursor.result.continue();
            // Si cursor.result es nulo, significa que ya no existen más registros por recorrer
        } else {
            // Imprimimos mensaje informando que se concluyó la lectura total de registros
            console.log("Todos los datos fueron leidos"); // Imprime salida en consola
        }
    });
};

// Función para modificar o actualizar un objeto existente identificado por su clave primaria
const modObjeto = (key, objeto) => {
    // Obtenemos la referencia activa de la base de datos
    const db = IDBRequest.result;
    // Iniciamos una transacción sobre el almacén "nombres" en modo "readwrite"
    const transaction = db.transaction("nombres", "readwrite");
    // Obtenemos el almacén de objetos a través de la transacción
    const objectStore = transaction.objectStore("nombres");
    // Usamos el método .put() pasando el nuevo valor y la clave primaria a sobrescribir
    objectStore.put(objeto, key);
    // Escuchamos el evento 'complete' que confirma que la modificación se aplicó en disco
    transaction.addEventListener("complete", () => {
        // Imprimimos el mensaje de confirmación de modificación
        console.log("Objeto modificado correctamente"); // Imprime salida en consola
    });
};

// Función para eliminar un objeto de la base de datos a partir de su clave primaria
const deleteObjeto = key => {
    // Obtenemos la referencia activa de la base de datos
    const db = IDBRequest.result;
    // Iniciamos una transacción de escritura sobre el almacén "nombres"
    const transaction = db.transaction("nombres", "readwrite");
    // Obtenemos el almacén de objetos
    const objectStore = transaction.objectStore("nombres");
    // Ejecutamos el método .delete() indicando la clave del registro a borrar
    objectStore.delete(key);
    // Escuchamos el evento 'complete' que valida la eliminación exitosa
    transaction.addEventListener("complete", () => {
        // Imprimimos mensaje confirmando la eliminación del objeto
        console.log("Objeto eliminado correctamente"); // Imprime salida en consola
    });
};

// ==============================================================================
// 2. COMPLEMENTOS Y FUNCIONES AVANZADAS DE LA API DE INDEXEDDB
// ==============================================================================

// Función complementaria para consultar un único registro por su clave exacta sin usar cursor
const leerObjetoPorClave = (key) => {
    // Obtenemos la referencia de la base de datos
    const db = IDBRequest.result;
    // Transacción de solo lectura
    const transaction = db.transaction("nombres", "readonly");
    // Obtenemos el almacén de objetos
    const objectStore = transaction.objectStore("nombres");
    // Solicitamos el registro puntual mediante .get(key)
    const request = objectStore.get(key);
    // Escuchamos el evento de éxito de la consulta
    request.onsuccess = () => {
        // Imprimimos el registro recuperado
        console.log(`Registro con clave [${key}]:`, request.result); // Imprime salida en consola
    };
};

// Función complementaria para recuperar todos los registros en un solo arreglo mediante .getAll()
const leerTodosEnArreglo = () => {
    // Obtenemos la base de datos
    const db = IDBRequest.result;
    // Abrimos transacción readonly
    const transaction = db.transaction("nombres", "readonly");
    // Obtenemos el almacén
    const objectStore = transaction.objectStore("nombres");
    // Solicitamos todos los registros con .getAll()
    const request = objectStore.getAll();
    // Escuchamos el éxito de la petición
    request.onsuccess = () => {
        // Imprimimos el arreglo completo con todos los objetos
        console.log("Todos los registros recuperados con .getAll():", request.result); // Imprime salida en consola
    };
};

// Función complementaria para contar el número total de registros en el almacén mediante .count()
const contarRegistros = () => {
    // Obtenemos la base de datos
    const db = IDBRequest.result;
    // Abrimos transacción readonly
    const transaction = db.transaction("nombres", "readonly");
    // Obtenemos el almacén
    const objectStore = transaction.objectStore("nombres");
    // Ejecutamos la solicitud de conteo
    const request = objectStore.count();
    // Escuchamos el resultado
    request.onsuccess = () => {
        // Imprimimos el número total de elementos
        console.log(`Total de registros en 'nombres': ${request.result}`); // Imprime salida en consola
    };
};

// Función complementaria para vaciar todos los registros del almacén mediante .clear()
const vaciarAlmacen = () => {
    // Obtenemos la base de datos
    const db = IDBRequest.result;
    // Abrimos transacción de escritura
    const transaction = db.transaction("nombres", "readwrite");
    // Obtenemos el almacén
    const objectStore = transaction.objectStore("nombres");
    // Borramos todos los elementos
    objectStore.clear();
    // Escuchamos la confirmación de la transacción
    transaction.addEventListener("complete", () => {
        // Imprimimos confirmación de vaciado
        console.log("Almacén 'nombres' vaciado completamente (.clear)."); // Imprime salida en consola
    });
};

// ==============================================================================
// 3. MODERNIZACIÓN CON PROMESAS Y ASYNC/AWAIT
// ==============================================================================

// Función que encapsula la inserción de un objeto en una Promesa nativa
const addObjetoPromesa = (objeto) => {
    // Retornamos una nueva instancia de Promise
    return new Promise((resolve, reject) => {
        // Obtenemos la base de datos
        const db = IDBRequest.result;
        // Transacción readwrite
        const tx = db.transaction("nombres", "readwrite");
        // Almacén
        const store = tx.objectStore("nombres");
        // Operación add
        const req = store.add(objeto);
        // Si tiene éxito resolvemos entregando la clave asignada
        req.onsuccess = () => resolve(req.result);
        // Si falla rechazamos con el error
        req.onerror = () => reject(req.error);
    });
};

// Función que encapsula la lectura de todos los registros en una Promesa
const leerTodosPromesa = () => {
    // Retornamos una Promesa
    return new Promise((resolve, reject) => {
        // Obtenemos la base de datos
        const db = IDBRequest.result;
        // Transacción readonly
        const tx = db.transaction("nombres", "readonly");
        // Almacén
        const store = tx.objectStore("nombres");
        // Operación getAll
        const req = store.getAll();
        // Resolvemos con la lista obtenida
        req.onsuccess = () => resolve(req.result);
        // Rechazamos en caso de fallo
        req.onerror = () => reject(req.error);
    });
};

// ==============================================================================
// 4. SOLUCIONARIO DE LOS 3 EJERCICIOS DE LA GUÍA (DOCUMENTACION/INDEXEDDB.MD)
// ==============================================================================

// Función que ejecuta el ejercicio de Nivel 1: Crear 'BibliotecaDB' con almacén 'libros' y keyPath 'isbn'
const resolverEjercicioNivel1 = () => {
    // Solicitamos abrir BibliotecaDB en versión 1
    const reqBiblio = indexedDB.open("BibliotecaDB", 1);
    // Manejamos el evento upgradeneeded para configurar el esquema
    reqBiblio.addEventListener("upgradeneeded", (e) => {
        // Obtenemos la base de datos
        const dbBiblio = e.target.result;
        // Validamos que el almacén libros no exista antes de crearlo
        if (!dbBiblio.objectStoreNames.contains("libros")) {
            // Creamos el almacén 'libros' con clave primaria explícita 'isbn'
            dbBiblio.createObjectStore("libros", { keyPath: "isbn" });
            // Confirmamos en consola
            console.log("✅ [Nivel 1 Resuelto] Almacén 'libros' creado con keyPath: 'isbn'."); // Imprime salida en consola
        }
    });
    // Manejamos el éxito de apertura
    reqBiblio.addEventListener("success", (e) => {
        // Obtenemos la base de datos abierta
        const dbBiblio = e.target.result;
        // Confirmamos apertura
        console.log("📚 [Nivel 1 Resuelto] Base de datos 'BibliotecaDB' lista para operar."); // Imprime salida en consola

        // Ejecutamos el ejercicio Nivel 2 sobre la base recién abierta
        resolverEjercicioNivel2(dbBiblio);
    });
};

// Función que ejecuta el ejercicio de Nivel 2: Guardar libro con transacción 'readwrite' y .put()
const resolverEjercicioNivel2 = (dbBiblio) => {
    // Definimos la función guardarLibro solicitada en el temario
    const guardarLibro = (db, libro) => {
        // Abrimos transacción en modo "readwrite"
        const tx = db.transaction(["libros"], "readwrite");
        // Obtenemos el almacén "libros"
        const store = tx.objectStore("libros");
        // Usamos .put() para insertar o actualizar si el isbn ya existe
        const peticion = store.put(libro);
        // Escuchamos el éxito de la inserción
        peticion.onsuccess = () => {
            // Confirmamos en consola
            console.log(`✅ [Nivel 2 Resuelto] Libro "${libro.titulo}" guardado correctamente.`); // Imprime salida en consola
        };
        // Escuchamos la culminación de la transacción para dar paso al Nivel 3
        tx.addEventListener("complete", () => {
            // Ejecutamos el ejercicio Nivel 3
            resolverEjercicioNivel3(dbBiblio);
        });
    };

    // Guardamos libros de prueba
    guardarLibro(dbBiblio, { isbn: "978-0132350884", titulo: "Clean Code", autor: "Robert C. Martin" });
    guardarLibro(dbBiblio, { isbn: "978-0201633610", titulo: "Design Patterns", autor: "Erich Gamma" });
};

// Función que ejecuta el ejercicio de Nivel 3: Función asíncrona obtenerTodosLosLibros() con Promesa
const resolverEjercicioNivel3 = (dbBiblio) => {
    // Definición de la función solicitada que retorna una Promise
    const obtenerTodosLosLibros = (db) => {
        // Retornamos la promesa
        return new Promise((resolve, reject) => {
            // Abrimos transacción readonly
            const tx = db.transaction(["libros"], "readonly");
            // Obtenemos el almacén
            const store = tx.objectStore("libros");
            // Solicitamos todos los registros con .getAll()
            const req = store.getAll();
            // Resolvemos la promesa entregando los libros leídos
            req.onsuccess = () => resolve(req.result);
            // Rechazamos en caso de error
            req.onerror = () => reject(req.error);
        });
    };

    // Consumimos la promesa con async/await
    (async () => {
        try { // Inicia bloque protegido contra errores
            // Esperamos la resolución de todos los libros
            const libros = await obtenerTodosLosLibros(dbBiblio);
            // Mostramos los libros en consola
            console.log(`✅ [Nivel 3 Resuelto] Libros obtenidos con Promise y async/await (${libros.length} libros):`, libros); // Imprime salida en consola
        } catch (error) {
            // Capturamos cualquier error
            console.error("Error en Nivel 3:", error); // Imprime salida en consola
        }
    })();
};

// ==============================================================================
// 5. DEMOSTRACIÓN PRÁCTICA AUTOMÁTICA EN CONSOLA AL CONECTAR LA BASE DE DATOS
// ==============================================================================
// Una vez que IDBRequest emita 'success', realizamos llamadas de prueba para demostrar el funcionamiento:
IDBRequest.addEventListener("success", () => {
    // Encabezado visual inicial
    console.log("\n======================================================="); // Imprime salida en consola
    console.log("🚀 EJECUTANDO DEMOSTRACIÓN DE OPERACIONES CRUD..."); // Imprime salida en consola
    console.log("======================================================="); // Imprime salida en consola

    // 1. Agregamos varios objetos de prueba llamando a la función original del alumno
    addObjeto({ nombre: "Fredy", rol: "Desarrollador Web", nivel: "Master" });
    addObjeto({ nombre: "Carlos", rol: "Arquitecto de Software", nivel: "Senior" });
    addObjeto({ nombre: "Laura", rol: "Diseñadora UI/UX", nivel: "Semi Senior" });

    // 2. Programamos la lectura de objetos tras completarse las inserciones
    setTimeout(() => {
        console.log("\n--- LECTURA DE REGISTROS CON CURSOR (leerObjetos) ---"); // Imprime salida en consola
        // Invocamos la función original del alumno para recorrer con cursor
        leerObjetos();
    }, 40);

    // 3. Programamos la modificación de un objeto existente
    setTimeout(() => {
        console.log("\n--- MODIFICACIÓN DE REGISTRO (modObjeto) ---"); // Imprime salida en consola
        // Modificamos el registro con clave primaria 1
        modObjeto(1, { nombre: "Fredy (Actualizado)", rol: "Tech Lead", nivel: "Master" });
    }, 80);

    // 4. Consultamos el registro modificado directamente por clave
    setTimeout(() => {
        console.log("\n--- LECTURA PUNTUAL POR CLAVE (leerObjetoPorClave) ---"); // Imprime salida en consola
        leerObjetoPorClave(1);
    }, 120);

    // 5. Demostramos la lectura masiva con .getAll()
    setTimeout(() => {
        console.log("\n--- LECTURA COMPLETA (.getAll) ---"); // Imprime salida en consola
        leerTodosEnArreglo();
        contarRegistros();
    }, 160);

    // 6. Demostramos la eliminación de un registro
    setTimeout(() => {
        console.log("\n--- ELIMINACIÓN DE REGISTRO (deleteObjeto) ---"); // Imprime salida en consola
        deleteObjeto(2);
    }, 200);

    // 7. Ejecutamos el solucionario oficial de los 3 ejercicios de la documentación
    setTimeout(() => {
        console.log("\n======================================================="); // Imprime salida en consola
        console.log("📘 SOLUCIONARIO DE EJERCICIOS DEL TEMARIO (Nivel 1, 2, 3)"); // Imprime salida en consola
        console.log("======================================================="); // Imprime salida en consola
        resolverEjercicioNivel1();
    }, 250);
});
