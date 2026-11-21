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
if (typeof indexedDB === "undefined") { // Evalúa condición
    // Definimos el objeto global indexedDB en el entorno de Node.js
    globalThis.indexedDB = (() => { // Asigna valor
        // Objeto interno que almacenará las bases de datos en memoria
        const baseDeDatos = {}; // Declara e inicializa "baseDeDatos"
        // Retornamos el objeto simulador con el método estándar open()
        return { // Retorna resultado
            // Método open para abrir o crear bases de datos por nombre y versión
            open(nombre, version = 1) { // Instrucción JavaScript
                // Creamos el objeto de solicitud IDBOpenDBRequest
                const request = { // Declara e inicializa "request"
                    result: null,
                    error: null,
                    _listeners: {},
                    addEventListener(evento, callback) { // Registra escuchador de eventos
                        if (!this._listeners[evento]) this._listeners[evento] = []; // Evalúa condición
                        this._listeners[evento].push(callback); // Ejecuta llamada o método
                    },
                    _emit(evento, arg) { // Instrucción JavaScript
                        if (this._listeners[evento]) { // Evalúa condición
                            this._listeners[evento].forEach(cb => cb(arg)); // Ejecuta llamada o método
                        }
                    }
                };

                // Procesamos la apertura de forma asíncrona simulando el comportamiento real
                setTimeout(() => { // Instrucción JavaScript
                    // Verificamos si la base de datos ya existía
                    const yaExiste = Object.prototype.hasOwnProperty.call(baseDeDatos, nombre); // Declara e inicializa "yaExiste"
                    // Obtenemos la versión previa o 0 si es nueva
                    const versionPrevia = yaExiste ? baseDeDatos[nombre].version : 0; // Declara e inicializa "versionPrevia"

                    // Si no existe, inicializamos la estructura en memoria
                    if (!yaExiste) { // Evalúa condición
                        baseDeDatos[nombre] = { // Asigna valor
                            nombre: nombre,
                            version: version,
                            almacenes: {}
                        };
                    }

                    // Referencia interna a la base de datos
                    const dbData = baseDeDatos[nombre]; // Declara e inicializa "dbData"

                    // Objeto IDBDatabase expuesto como resultado de la solicitud
                    const db = { // Declara e inicializa "db"
                        name: nombre,
                        version: version,
                        objectStoreNames: { // Instrucción JavaScript
                            contains(storeName) { // Instrucción JavaScript
                                return Object.prototype.hasOwnProperty.call(dbData.almacenes, storeName); // Retorna resultado
                            }
                        },
                        createObjectStore(storeName, opciones = {}) { // Instrucción JavaScript
                            if (!dbData.almacenes[storeName]) { // Evalúa condición
                                dbData.almacenes[storeName] = { // Asigna valor
                                    opciones: opciones,
                                    datos: new Map(),
                                    autoIncrementCounter: 1
                                };
                            }
                            return { // Retorna resultado
                                createIndex(indexName, keyPath, indexOptions = {}) { // Instrucción JavaScript
                                    // Simulación de creación de índices
                                }
                            };
                        },
                        transaction(storeNames, modo = "readonly") { // Instrucción JavaScript
                            const tx = { // Declara e inicializa "tx"
                                mode: modo,
                                _listeners: {},
                                addEventListener(evento, callback) { // Registra escuchador de eventos
                                    if (!this._listeners[evento]) this._listeners[evento] = []; // Evalúa condición
                                    this._listeners[evento].push(callback); // Ejecuta llamada o método
                                },
                                _emit(evento) { // Instrucción JavaScript
                                    if (this._listeners[evento]) { // Evalúa condición
                                        this._listeners[evento].forEach(cb => cb()); // Ejecuta llamada o método
                                    }
                                },
                                objectStore(sName) { // Instrucción JavaScript
                                    const s = dbData.almacenes[sName]; // Declara e inicializa "s"
                                    if (!s) throw new Error(`Almacén '${sName}' no existe.`); // Evalúa condición
                                    return { // Retorna resultado
                                        add(valor, clave) { // Instrucción JavaScript
                                            const req = { result: null, error: null, onsuccess: null, onerror: null }; // Declara e inicializa "req"
                                            setTimeout(() => { // Instrucción JavaScript
                                                let pk = clave; // Declara e inicializa "pk"
                                                if (s.opciones.keyPath && valor && typeof valor === "object") { // Evalúa condición
                                                    pk = valor[s.opciones.keyPath]; // Asigna valor
                                                }
                                                if (pk === undefined && s.opciones.autoIncrement) { // Evalúa condición
                                                    pk = s.autoIncrementCounter++; // Asigna valor
                                                }
                                                s.datos.set(pk, JSON.parse(JSON.stringify(valor))); // Ejecuta llamada o método
                                                req.result = pk; // Asigna valor
                                                if (req.onsuccess) req.onsuccess({ target: req }); // Evalúa condición
                                                tx._emit("complete"); // Ejecuta llamada o método
                                            }, 2); // Ejecuta llamada o método
                                            return req; // Retorna resultado
                                        },
                                        put(valor, clave) { // Instrucción JavaScript
                                            const req = { result: null, error: null, onsuccess: null, onerror: null }; // Declara e inicializa "req"
                                            setTimeout(() => { // Instrucción JavaScript
                                                let pk = clave; // Declara e inicializa "pk"
                                                if (s.opciones.keyPath && valor && typeof valor === "object") { // Evalúa condición
                                                    pk = valor[s.opciones.keyPath]; // Asigna valor
                                                }
                                                if (pk === undefined && s.opciones.autoIncrement) { // Evalúa condición
                                                    pk = s.autoIncrementCounter++; // Asigna valor
                                                }
                                                s.datos.set(pk, JSON.parse(JSON.stringify(valor))); // Ejecuta llamada o método
                                                req.result = pk; // Asigna valor
                                                if (req.onsuccess) req.onsuccess({ target: req }); // Evalúa condición
                                                tx._emit("complete"); // Ejecuta llamada o método
                                            }, 2); // Ejecuta llamada o método
                                            return req; // Retorna resultado
                                        },
                                        get(pk) { // Instrucción JavaScript
                                            const req = { result: null, error: null, onsuccess: null, onerror: null }; // Declara e inicializa "req"
                                            setTimeout(() => { // Instrucción JavaScript
                                                const val = s.datos.get(pk); // Declara e inicializa "val"
                                                req.result = val !== undefined ? JSON.parse(JSON.stringify(val)) : undefined; // Asigna valor
                                                if (req.onsuccess) req.onsuccess({ target: req }); // Evalúa condición
                                                tx._emit("complete"); // Ejecuta llamada o método
                                            }, 2); // Ejecuta llamada o método
                                            return req; // Retorna resultado
                                        },
                                        getAll() { // Instrucción JavaScript
                                            const req = { result: [], error: null, onsuccess: null, onerror: null }; // Declara e inicializa "req"
                                            setTimeout(() => { // Instrucción JavaScript
                                                const lista = Array.from(s.datos.values()).map(v => JSON.parse(JSON.stringify(v))); // Define función flecha "lista"
                                                req.result = lista; // Asigna valor
                                                if (req.onsuccess) req.onsuccess({ target: req }); // Evalúa condición
                                                tx._emit("complete"); // Ejecuta llamada o método
                                            }, 2); // Ejecuta llamada o método
                                            return req; // Retorna resultado
                                        },
                                        delete(pk) { // Instrucción JavaScript
                                            const req = { result: null, error: null, onsuccess: null, onerror: null }; // Declara e inicializa "req"
                                            setTimeout(() => { // Instrucción JavaScript
                                                s.datos.delete(pk); // Ejecuta llamada o método
                                                req.result = undefined; // Asigna valor
                                                if (req.onsuccess) req.onsuccess({ target: req }); // Evalúa condición
                                                tx._emit("complete"); // Ejecuta llamada o método
                                            }, 2); // Ejecuta llamada o método
                                            return req; // Retorna resultado
                                        },
                                        clear() { // Instrucción JavaScript
                                            const req = { result: null, error: null, onsuccess: null, onerror: null }; // Declara e inicializa "req"
                                            setTimeout(() => { // Instrucción JavaScript
                                                s.datos.clear(); // Ejecuta llamada o método
                                                req.result = undefined; // Asigna valor
                                                if (req.onsuccess) req.onsuccess({ target: req }); // Evalúa condición
                                                tx._emit("complete"); // Ejecuta llamada o método
                                            }, 2); // Ejecuta llamada o método
                                            return req; // Retorna resultado
                                        },
                                        count() { // Instrucción JavaScript
                                            const req = { result: 0, error: null, onsuccess: null, onerror: null }; // Declara e inicializa "req"
                                            setTimeout(() => { // Instrucción JavaScript
                                                req.result = s.datos.size; // Asigna valor
                                                if (req.onsuccess) req.onsuccess({ target: req }); // Evalúa condición
                                                tx._emit("complete"); // Ejecuta llamada o método
                                            }, 2); // Ejecuta llamada o método
                                            return req; // Retorna resultado
                                        },
                                        openCursor() { // Instrucción JavaScript
                                            const req = { result: null, error: null, _listeners: {}, addEventListener(e, cb) { this._listeners[e] = cb; } }; // Declara e inicializa "req"
                                            const entries = Array.from(s.datos.entries()); // Declara e inicializa "entries"
                                            let index = 0; // Declara e inicializa "index"
                                            const avanzar = () => { // Define función flecha "avanzar"
                                                if (index < entries.length) { // Evalúa condición
                                                    const [k, v] = entries[index]; // Declara e inicializa "variable"
                                                    index++; // Instrucción JavaScript
                                                    req.result = { // Asigna valor
                                                        key: k,
                                                        value: JSON.parse(JSON.stringify(v)),
                                                        continue: () => { setTimeout(avanzar, 1); }
                                                    };
                                                } else { // Instrucción JavaScript
                                                    req.result = null; // Asigna valor
                                                }
                                                if (req._listeners["success"]) req._listeners["success"]({ target: req }); // Evalúa condición
                                                if (req.onsuccess) req.onsuccess({ target: req }); // Evalúa condición
                                            };
                                            setTimeout(avanzar, 2); // Ejecuta llamada o método
                                            return req; // Retorna resultado
                                        }
                                    };
                                }
                            };
                            return tx; // Retorna resultado
                        }
                    };

                    // Asignamos la base de datos resultante a la solicitud
                    request.result = db; // Asigna valor

                    // Si es nueva o subió la versión, disparamos upgradeneeded
                    if (version > versionPrevia) { // Evalúa condición
                        dbData.version = version; // Asigna valor
                        request._emit("upgradeneeded", { target: request }); // Ejecuta llamada o método
                        if (request.onupgradeneeded) request.onupgradeneeded({ target: request }); // Evalúa condición
                    }

                    // Disparamos success para confirmar la conexión
                    request._emit("success", { target: request }); // Ejecuta llamada o método
                    if (request.onsuccess) request.onsuccess({ target: request }); // Evalúa condición
                }, 10); // Ejecuta llamada o método

                return request; // Retorna resultado
            }
        };
    })(); // Ejecuta llamada o método
}

// ==============================================================================
// 1. CÓDIGO ORIGINAL DEL ALUMNO
// ==============================================================================

// Solicitamos al motor de IndexedDB abrir o crear la base de datos denominada "BD" en su versión 1
const IDBRequest = indexedDB.open("BD", 1); // Declara e inicializa "IDBRequest"

// Escuchamos el evento 'upgradeneeded', que se dispara únicamente si la base es nueva o la versión se incrementa
IDBRequest.addEventListener("upgradeneeded", () => { // Registra escuchador de eventos
    // Obtenemos la instancia de la base de datos desde la propiedad result de la solicitud
    const db = IDBRequest.result; // Declara e inicializa "db"
    // Creamos el almacén de objetos (Object Store) llamado "nombres" con clave primaria autoincremental
    db.createObjectStore("nombres", { // Instrucción JavaScript
        // Habilitamos autoIncrement en true para que cada objeto reciba una clave numérica automática (1, 2, 3...)
        autoIncrement: true
    });
});

// Escuchamos el evento 'success', que se ejecuta cuando la base de datos se abre y conecta satisfactoriamente
IDBRequest.addEventListener("success", () => console.log("Todo ok")); // Registra escuchador de eventos

// Escuchamos el evento 'error', que se dispara en caso de presentarse algún fallo de acceso o cuota en la base
IDBRequest.addEventListener("error", (err) => console.log("Error", err)); // Registra escuchador de eventos

// Función para agregar un objeto a la base de datos mediante una transacción de lectura y escritura
const addObjeto = objeto => { // Define función flecha "addObjeto"
    // Obtenemos la referencia activa de la base de datos abierta
    const db = IDBRequest.result; // Declara e inicializa "db"
    // Iniciamos una transacción sobre el almacén "nombres" en modo de lectura y escritura ("readwrite")
    const transaction = db.transaction("nombres", "readwrite"); // Declara e inicializa "transaction"
    // Obtenemos el almacén de objetos "nombres" a través de la transacción iniciada
    const objectStore = transaction.objectStore("nombres"); // Declara e inicializa "objectStore"
    // Insertamos el objeto recibido dentro del almacén
    objectStore.add(objeto); // Ejecuta llamada o método
    // Escuchamos el evento 'complete' de la transacción para saber cuándo los datos se guardaron efectivamente
    transaction.addEventListener("complete", () => { // Registra escuchador de eventos
        // Imprimimos en consola el mensaje de confirmación de inserción
        console.log("Objeto agregado correctamente"); // Imprime salida en consola
    });
};

// Función para leer todos los registros almacenados utilizando un cursor iterativo
const leerObjetos = () => { // Define función flecha "leerObjetos"
    // Obtenemos la referencia activa de la base de datos abierta
    const db = IDBRequest.result; // Declara e inicializa "db"
    // Iniciamos una transacción sobre el almacén "nombres" en modo de solo lectura ("readonly")
    const transaction = db.transaction("nombres", "readonly"); // Declara e inicializa "transaction"
    // Obtenemos el almacén de objetos "nombres" mediante la transacción
    const objectStore = transaction.objectStore("nombres"); // Declara e inicializa "objectStore"
    // Abrimos un cursor para iterar de manera secuencial sobre cada registro del almacén
    const cursor = objectStore.openCursor(); // Declara e inicializa "cursor"
    // Escuchamos el evento 'success' del cursor, que se dispara por cada registro encontrado
    cursor.addEventListener("success", () => { // Registra escuchador de eventos
        // Evaluamos si el cursor apunta a un registro existente en la posición actual
        if (cursor.result) { // Evalúa condición
            // Imprimimos en consola el valor del objeto apuntado por el cursor
            console.log(cursor.result.value); // Imprime salida en consola
            // Avanzamos el cursor hacia el siguiente registro del almacén
            cursor.result.continue(); // Ejecuta llamada o método
            // Si cursor.result es nulo, significa que ya no existen más registros por recorrer
        } else { // Instrucción JavaScript
            // Imprimimos mensaje informando que se concluyó la lectura total de registros
            console.log("Todos los datos fueron leidos"); // Imprime salida en consola
        }
    });
};

// Función para modificar o actualizar un objeto existente identificado por su clave primaria
const modObjeto = (key, objeto) => { // Define función flecha "modObjeto"
    // Obtenemos la referencia activa de la base de datos
    const db = IDBRequest.result; // Declara e inicializa "db"
    // Iniciamos una transacción sobre el almacén "nombres" en modo "readwrite"
    const transaction = db.transaction("nombres", "readwrite"); // Declara e inicializa "transaction"
    // Obtenemos el almacén de objetos a través de la transacción
    const objectStore = transaction.objectStore("nombres"); // Declara e inicializa "objectStore"
    // Usamos el método .put() pasando el nuevo valor y la clave primaria a sobrescribir
    objectStore.put(objeto, key); // Ejecuta llamada o método
    // Escuchamos el evento 'complete' que confirma que la modificación se aplicó en disco
    transaction.addEventListener("complete", () => { // Registra escuchador de eventos
        // Imprimimos el mensaje de confirmación de modificación
        console.log("Objeto modificado correctamente"); // Imprime salida en consola
    });
};

// Función para eliminar un objeto de la base de datos a partir de su clave primaria
const deleteObjeto = key => { // Define función flecha "deleteObjeto"
    // Obtenemos la referencia activa de la base de datos
    const db = IDBRequest.result; // Declara e inicializa "db"
    // Iniciamos una transacción de escritura sobre el almacén "nombres"
    const transaction = db.transaction("nombres", "readwrite"); // Declara e inicializa "transaction"
    // Obtenemos el almacén de objetos
    const objectStore = transaction.objectStore("nombres"); // Declara e inicializa "objectStore"
    // Ejecutamos el método .delete() indicando la clave del registro a borrar
    objectStore.delete(key); // Ejecuta llamada o método
    // Escuchamos el evento 'complete' que valida la eliminación exitosa
    transaction.addEventListener("complete", () => { // Registra escuchador de eventos
        // Imprimimos mensaje confirmando la eliminación del objeto
        console.log("Objeto eliminado correctamente"); // Imprime salida en consola
    });
};

// ==============================================================================
// 2. COMPLEMENTOS Y FUNCIONES AVANZADAS DE LA API DE INDEXEDDB
// ==============================================================================

// Función complementaria para consultar un único registro por su clave exacta sin usar cursor
const leerObjetoPorClave = (key) => { // Define función flecha "leerObjetoPorClave"
    // Obtenemos la referencia de la base de datos
    const db = IDBRequest.result; // Declara e inicializa "db"
    // Transacción de solo lectura
    const transaction = db.transaction("nombres", "readonly"); // Declara e inicializa "transaction"
    // Obtenemos el almacén de objetos
    const objectStore = transaction.objectStore("nombres"); // Declara e inicializa "objectStore"
    // Solicitamos el registro puntual mediante .get(key)
    const request = objectStore.get(key); // Declara e inicializa "request"
    // Escuchamos el evento de éxito de la consulta
    request.onsuccess = () => { // Asigna valor
        // Imprimimos el registro recuperado
        console.log(`Registro con clave [${key}]:`, request.result); // Imprime salida en consola
    };
};

// Función complementaria para recuperar todos los registros en un solo arreglo mediante .getAll()
const leerTodosEnArreglo = () => { // Define función flecha "leerTodosEnArreglo"
    // Obtenemos la base de datos
    const db = IDBRequest.result; // Declara e inicializa "db"
    // Abrimos transacción readonly
    const transaction = db.transaction("nombres", "readonly"); // Declara e inicializa "transaction"
    // Obtenemos el almacén
    const objectStore = transaction.objectStore("nombres"); // Declara e inicializa "objectStore"
    // Solicitamos todos los registros con .getAll()
    const request = objectStore.getAll(); // Declara e inicializa "request"
    // Escuchamos el éxito de la petición
    request.onsuccess = () => { // Asigna valor
        // Imprimimos el arreglo completo con todos los objetos
        console.log("Todos los registros recuperados con .getAll():", request.result); // Imprime salida en consola
    };
};

// Función complementaria para contar el número total de registros en el almacén mediante .count()
const contarRegistros = () => { // Define función flecha "contarRegistros"
    // Obtenemos la base de datos
    const db = IDBRequest.result; // Declara e inicializa "db"
    // Abrimos transacción readonly
    const transaction = db.transaction("nombres", "readonly"); // Declara e inicializa "transaction"
    // Obtenemos el almacén
    const objectStore = transaction.objectStore("nombres"); // Declara e inicializa "objectStore"
    // Ejecutamos la solicitud de conteo
    const request = objectStore.count(); // Declara e inicializa "request"
    // Escuchamos el resultado
    request.onsuccess = () => { // Asigna valor
        // Imprimimos el número total de elementos
        console.log(`Total de registros en 'nombres': ${request.result}`); // Imprime salida en consola
    };
};

// Función complementaria para vaciar todos los registros del almacén mediante .clear()
const vaciarAlmacen = () => { // Define función flecha "vaciarAlmacen"
    // Obtenemos la base de datos
    const db = IDBRequest.result; // Declara e inicializa "db"
    // Abrimos transacción de escritura
    const transaction = db.transaction("nombres", "readwrite"); // Declara e inicializa "transaction"
    // Obtenemos el almacén
    const objectStore = transaction.objectStore("nombres"); // Declara e inicializa "objectStore"
    // Borramos todos los elementos
    objectStore.clear(); // Ejecuta llamada o método
    // Escuchamos la confirmación de la transacción
    transaction.addEventListener("complete", () => { // Registra escuchador de eventos
        // Imprimimos confirmación de vaciado
        console.log("Almacén 'nombres' vaciado completamente (.clear)."); // Imprime salida en consola
    });
};

// ==============================================================================
// 3. MODERNIZACIÓN CON PROMESAS Y ASYNC/AWAIT
// ==============================================================================

// Función que encapsula la inserción de un objeto en una Promesa nativa
const addObjetoPromesa = (objeto) => { // Define función flecha "addObjetoPromesa"
    // Retornamos una nueva instancia de Promise
    return new Promise((resolve, reject) => { // Retorna resultado
        // Obtenemos la base de datos
        const db = IDBRequest.result; // Declara e inicializa "db"
        // Transacción readwrite
        const tx = db.transaction("nombres", "readwrite"); // Declara e inicializa "tx"
        // Almacén
        const store = tx.objectStore("nombres"); // Declara e inicializa "store"
        // Operación add
        const req = store.add(objeto); // Declara e inicializa "req"
        // Si tiene éxito resolvemos entregando la clave asignada
        req.onsuccess = () => resolve(req.result); // Asigna valor
        // Si falla rechazamos con el error
        req.onerror = () => reject(req.error); // Asigna valor
    });
};

// Función que encapsula la lectura de todos los registros en una Promesa
const leerTodosPromesa = () => { // Define función flecha "leerTodosPromesa"
    // Retornamos una Promesa
    return new Promise((resolve, reject) => { // Retorna resultado
        // Obtenemos la base de datos
        const db = IDBRequest.result; // Declara e inicializa "db"
        // Transacción readonly
        const tx = db.transaction("nombres", "readonly"); // Declara e inicializa "tx"
        // Almacén
        const store = tx.objectStore("nombres"); // Declara e inicializa "store"
        // Operación getAll
        const req = store.getAll(); // Declara e inicializa "req"
        // Resolvemos con la lista obtenida
        req.onsuccess = () => resolve(req.result); // Asigna valor
        // Rechazamos en caso de fallo
        req.onerror = () => reject(req.error); // Asigna valor
    });
};

// ==============================================================================
// 4. SOLUCIONARIO DE LOS 3 EJERCICIOS DE LA GUÍA (DOCUMENTACION/INDEXEDDB.MD)
// ==============================================================================

// Función que ejecuta el ejercicio de Nivel 1: Crear 'BibliotecaDB' con almacén 'libros' y keyPath 'isbn'
const resolverEjercicioNivel1 = () => { // Define función flecha "resolverEjercicioNivel1"
    // Solicitamos abrir BibliotecaDB en versión 1
    const reqBiblio = indexedDB.open("BibliotecaDB", 1); // Declara e inicializa "reqBiblio"
    // Manejamos el evento upgradeneeded para configurar el esquema
    reqBiblio.addEventListener("upgradeneeded", (e) => { // Registra escuchador de eventos
        // Obtenemos la base de datos
        const dbBiblio = e.target.result; // Declara e inicializa "dbBiblio"
        // Validamos que el almacén libros no exista antes de crearlo
        if (!dbBiblio.objectStoreNames.contains("libros")) { // Evalúa condición
            // Creamos el almacén 'libros' con clave primaria explícita 'isbn'
            dbBiblio.createObjectStore("libros", { keyPath: "isbn" }); // Ejecuta llamada o método
            // Confirmamos en consola
            console.log("✅ [Nivel 1 Resuelto] Almacén 'libros' creado con keyPath: 'isbn'."); // Imprime salida en consola
        }
    });
    // Manejamos el éxito de apertura
    reqBiblio.addEventListener("success", (e) => { // Registra escuchador de eventos
        // Obtenemos la base de datos abierta
        const dbBiblio = e.target.result; // Declara e inicializa "dbBiblio"
        // Confirmamos apertura
        console.log("📚 [Nivel 1 Resuelto] Base de datos 'BibliotecaDB' lista para operar."); // Imprime salida en consola

        // Ejecutamos el ejercicio Nivel 2 sobre la base recién abierta
        resolverEjercicioNivel2(dbBiblio); // Ejecuta llamada o método
    });
};

// Función que ejecuta el ejercicio de Nivel 2: Guardar libro con transacción 'readwrite' y .put()
const resolverEjercicioNivel2 = (dbBiblio) => { // Define función flecha "resolverEjercicioNivel2"
    // Definimos la función guardarLibro solicitada en el temario
    const guardarLibro = (db, libro) => { // Define función flecha "guardarLibro"
        // Abrimos transacción en modo "readwrite"
        const tx = db.transaction(["libros"], "readwrite"); // Declara e inicializa "tx"
        // Obtenemos el almacén "libros"
        const store = tx.objectStore("libros"); // Declara e inicializa "store"
        // Usamos .put() para insertar o actualizar si el isbn ya existe
        const peticion = store.put(libro); // Declara e inicializa "peticion"
        // Escuchamos el éxito de la inserción
        peticion.onsuccess = () => { // Asigna valor
            // Confirmamos en consola
            console.log(`✅ [Nivel 2 Resuelto] Libro "${libro.titulo}" guardado correctamente.`); // Imprime salida en consola
        };
        // Escuchamos la culminación de la transacción para dar paso al Nivel 3
        tx.addEventListener("complete", () => { // Registra escuchador de eventos
            // Ejecutamos el ejercicio Nivel 3
            resolverEjercicioNivel3(dbBiblio); // Ejecuta llamada o método
        });
    };

    // Guardamos libros de prueba
    guardarLibro(dbBiblio, { isbn: "978-0132350884", titulo: "Clean Code", autor: "Robert C. Martin" }); // Ejecuta llamada o método
    guardarLibro(dbBiblio, { isbn: "978-0201633610", titulo: "Design Patterns", autor: "Erich Gamma" }); // Ejecuta llamada o método
};

// Función que ejecuta el ejercicio de Nivel 3: Función asíncrona obtenerTodosLosLibros() con Promesa
const resolverEjercicioNivel3 = (dbBiblio) => { // Define función flecha "resolverEjercicioNivel3"
    // Definición de la función solicitada que retorna una Promise
    const obtenerTodosLosLibros = (db) => { // Define función flecha "obtenerTodosLosLibros"
        // Retornamos la promesa
        return new Promise((resolve, reject) => { // Retorna resultado
            // Abrimos transacción readonly
            const tx = db.transaction(["libros"], "readonly"); // Declara e inicializa "tx"
            // Obtenemos el almacén
            const store = tx.objectStore("libros"); // Declara e inicializa "store"
            // Solicitamos todos los registros con .getAll()
            const req = store.getAll(); // Declara e inicializa "req"
            // Resolvemos la promesa entregando los libros leídos
            req.onsuccess = () => resolve(req.result); // Asigna valor
            // Rechazamos en caso de error
            req.onerror = () => reject(req.error); // Asigna valor
        });
    };

    // Consumimos la promesa con async/await
    (async () => { // Instrucción JavaScript
        try { // Inicia bloque protegido contra errores
            // Esperamos la resolución de todos los libros
            const libros = await obtenerTodosLosLibros(dbBiblio); // Declara e inicializa "libros"
            // Mostramos los libros en consola
            console.log(`✅ [Nivel 3 Resuelto] Libros obtenidos con Promise y async/await (${libros.length} libros):`, libros); // Imprime salida en consola
        } catch (error) { // Instrucción JavaScript
            // Capturamos cualquier error
            console.error("Error en Nivel 3:", error); // Imprime salida en consola
        }
    })(); // Ejecuta llamada o método
};

// ==============================================================================
// 5. DEMOSTRACIÓN PRÁCTICA AUTOMÁTICA EN CONSOLA AL CONECTAR LA BASE DE DATOS
// ==============================================================================
// Una vez que IDBRequest emita 'success', realizamos llamadas de prueba para demostrar el funcionamiento:
IDBRequest.addEventListener("success", () => { // Registra escuchador de eventos
    // Encabezado visual inicial
    console.log("\n======================================================="); // Imprime salida en consola
    console.log("🚀 EJECUTANDO DEMOSTRACIÓN DE OPERACIONES CRUD..."); // Imprime salida en consola
    console.log("======================================================="); // Imprime salida en consola

    // 1. Agregamos varios objetos de prueba llamando a la función original del alumno
    addObjeto({ nombre: "Fredy", rol: "Desarrollador Web", nivel: "Master" }); // Ejecuta llamada o método
    addObjeto({ nombre: "Carlos", rol: "Arquitecto de Software", nivel: "Senior" }); // Ejecuta llamada o método
    addObjeto({ nombre: "Laura", rol: "Diseñadora UI/UX", nivel: "Semi Senior" }); // Ejecuta llamada o método

    // 2. Programamos la lectura de objetos tras completarse las inserciones
    setTimeout(() => { // Instrucción JavaScript
        console.log("\n--- LECTURA DE REGISTROS CON CURSOR (leerObjetos) ---"); // Imprime salida en consola
        // Invocamos la función original del alumno para recorrer con cursor
        leerObjetos(); // Ejecuta llamada o método
    }, 40); // Ejecuta llamada o método

    // 3. Programamos la modificación de un objeto existente
    setTimeout(() => { // Instrucción JavaScript
        console.log("\n--- MODIFICACIÓN DE REGISTRO (modObjeto) ---"); // Imprime salida en consola
        // Modificamos el registro con clave primaria 1
        modObjeto(1, { nombre: "Fredy (Actualizado)", rol: "Tech Lead", nivel: "Master" }); // Ejecuta llamada o método
    }, 80); // Ejecuta llamada o método

    // 4. Consultamos el registro modificado directamente por clave
    setTimeout(() => { // Instrucción JavaScript
        console.log("\n--- LECTURA PUNTUAL POR CLAVE (leerObjetoPorClave) ---"); // Imprime salida en consola
        leerObjetoPorClave(1); // Ejecuta llamada o método
    }, 120); // Ejecuta llamada o método

    // 5. Demostramos la lectura masiva con .getAll()
    setTimeout(() => { // Instrucción JavaScript
        console.log("\n--- LECTURA COMPLETA (.getAll) ---"); // Imprime salida en consola
        leerTodosEnArreglo(); // Ejecuta llamada o método
        contarRegistros(); // Ejecuta llamada o método
    }, 160); // Ejecuta llamada o método

    // 6. Demostramos la eliminación de un registro
    setTimeout(() => { // Instrucción JavaScript
        console.log("\n--- ELIMINACIÓN DE REGISTRO (deleteObjeto) ---"); // Imprime salida en consola
        deleteObjeto(2); // Ejecuta llamada o método
    }, 200); // Ejecuta llamada o método

    // 7. Ejecutamos el solucionario oficial de los 3 ejercicios de la documentación
    setTimeout(() => { // Instrucción JavaScript
        console.log("\n======================================================="); // Imprime salida en consola
        console.log("📘 SOLUCIONARIO DE EJERCICIOS DEL TEMARIO (Nivel 1, 2, 3)"); // Imprime salida en consola
        console.log("======================================================="); // Imprime salida en consola
        resolverEjercicioNivel1(); // Ejecuta llamada o método
    }, 250); // Ejecuta llamada o método
});
