# GUÍA — Almacenamiento en el Navegador con IndexedDB

> **Nivel:** Desde principiante hasta avanzado (Junior → Semi Senior)
> **Objetivo:** Comprender la arquitectura de bases de datos NoSQL en el navegador mediante IndexedDB, dominar su ciclo de vida basado en eventos y transacciones, y aprender a guardar, consultar, actualizar y eliminar grandes volúmenes de datos de forma persistente y asíncrona.

---

# 📚 Temario

1. Definición de IndexedDB
2. Sintaxis básica y anatomía de una operación
3. Operaciones CRUD y Transacciones
4. Comparativa: `localStorage` tradicional vs. `IndexedDB` moderno
5. Analogía del mundo real
6. Diagrama de flujo de decisión
7. Buenas prácticas
8. Errores comunes
9. Ejercicios
10. Solucionario paso a paso
11. Resumen

---

# ¿Qué es IndexedDB?

**IndexedDB** es una base de datos transaccional orientada a objetos (NoSQL) integrada directamente en los navegadores web modernos. Permite almacenar **grandes cantidades de datos estructurados** (incluyendo archivos y objetos complejos como *Blobs*) de forma persistente en el dispositivo del usuario.

A diferencia de opciones simples como `localStorage` o las *Cookies*, IndexedDB funciona de manera **completamente asíncrona** para no bloquear el hilo principal de la interfaz de usuario. Esto la convierte en la herramienta estándar para aplicaciones web progresivas (**PWA**), aplicaciones con soporte *offline* y plataformas que requieren alto rendimiento local.

---

# Sintaxis básica y anatomía de una operación

La API nativa de IndexedDB se basa en solicitudes (*requests*) y eventos (`onsuccess`, `onerror`, `onupgradeneeded`). El punto de partida siempre es abrir una conexión con la base de datos:

```javascript
const solicitud = indexedDB.open("NombreBaseDatos", 1);
```

### 🔍 Desglose de los elementos clave:
1. **Base de Datos (`IDBDatabase`):** El contenedor principal identificado por un nombre único y un número de versión entero (ej. `1`, `2`).
2. **Almacén de Objetos (`Object Store`):** Equivalente a una "tabla" en SQL o una "colección" en MongoDB. Aquí se guardan los registros.
3. **Clave Primaria (`keyPath`):** La propiedad única que identifica cada objeto dentro del almacén (ej. `id`, `email`) o un generador automático (`autoIncrement: true`).
4. **Índices (`Index`):** Permiten realizar búsquedas rápidas por propiedades distintas a la clave primaria (ej. buscar usuarios por `nombre` o `categoria`).
5. **Transacción (`IDBTransaction`):** Un envoltorio seguro para leer o escribir datos. Si algo falla dentro de ella, todos los cambios se revierten automáticamente (`rollback`).

---

# Operaciones CRUD y Transacciones

Para interactuar con los datos una vez abierta la base de datos, siempre debemos iniciar una transacción indicando el almacén y el modo (`"readonly"` o `"readwrite"`).

```javascript
// 1. Abrimos o creamos la base de datos
const request = indexedDB.open("TiendaDB", 1);

// 2. Se ejecuta SOLO si la base de datos es nueva o sube de versión
request.onupgradeneeded = (event) => {
    const db = event.target.result;
    // Creamos el almacén "productos" con clave primaria "id"
    db.createObjectStore("productos", { keyPath: "id" });
};

// 3. Se ejecuta cuando la conexión está lista para operar
request.onsuccess = (event) => {
    const db = event.target.result;
    
    // Iniciamos transacción de lectura/escritura
    const transaccion = db.transaction(["productos"], "readwrite");
    const almacen = transaccion.objectStore("productos");
    
    // Guardamos un objeto JavaScript nativo (sin convertir a string)
    almacen.add({ id: 1, nombre: "Teclado Mecánico", precio: 85 });
    
    console.log("Producto guardado con éxito");
};
```

---

# Comparativa: `localStorage` vs. `IndexedDB`

Para entender cuándo elegir cada tecnología de almacenamiento en el navegador, observemos sus diferencias arquitectónicas:

### Estructura tradicional (`localStorage`)
```javascript
// Síncrono: bloquea la pantalla si los datos son muy grandes
// Solo acepta cadenas de texto (requiere JSON.stringify / JSON.parse)
const usuario = { id: 1, nombre: "Ana" };
localStorage.setItem("usuario", JSON.stringify(usuario));

const recuperado = JSON.parse(localStorage.getItem("usuario"));
console.log(recuperado.nombre);
```

### Estructura moderna (`IndexedDB`)
```javascript
// Asíncrono: no congela la interfaz de usuario
// Soporta cientos de Megabytes y guarda objetos nativos directamente
const tx = db.transaction(["usuarios"], "readonly");
const req = tx.objectStore("usuarios").get(1);

req.onsuccess = () => {
    console.log(req.result.nombre); // Imprime: "Ana"
};
```

| Característica | `localStorage` | `IndexedDB` |
| :--- | :--- | :--- |
| **Capacidad** | Limitada (~5 MB a 10 MB) | Muy amplia (cientos de MB o GB según disco) |
| **Ejecución** | Síncrona (bloqueante) | Asíncrona (no bloqueante) |
| **Tipos de datos** | Solo texto (`String`) | Objetos, Arrays, `Date`, `Blob`, `File` |
| **Búsquedas** | Solo por clave exacta | Claves primarias, índices y rangos |

---

# Analogía del mundo real: La bóveda de un banco 🏦

Imagina que necesitas guardar documentos y objetos de valor en un banco:

```
1. Tú eres la Aplicación Web (Frontend) y la Bóveda es IndexedDB.
2. No puedes entrar y tirar cajas al azar; primero pides abrir una cuenta y defines los estantes (Evento onupgradeneeded y createObjectStore).
3. Cada vez que quieres guardar o sacar algo, llenas un formulario de seguridad con un guardia (Transacción: readonly o readwrite).
4. Si ocurre un problema a mitad del trámite, el guardia cancela toda la operación para que nada se pierda ni quede a medias (Rollback automático).
5. Cuando el trámite termina, el guardia te entrega tus objetos intactos sin necesidad de que los hayas desarmado antes (Almacenamiento de objetos nativos).
```

---

# Diagrama de flujo de decisión

```
           [ indexedDB.open("MiDB", version) ]
                            │
           ┌────────────────┴────────────────┐
           ▼ ¿Es nueva o subió de versión?   ▼ ¿Ya existe en esa versión?
    [ Evento: onupgradeneeded ]              │
           │                                 │
           ▼                                 │
    [ createObjectStore() ]                  │
           │                                 │
           └────────────────┬────────────────┘
                            ▼
                 [ Evento: onsuccess ]
                            │
                            ▼
          [ db.transaction(store, modo) ]
                            │
                            ▼
         [ Ejecutar add / get / put / delete ]
```

---

# Buenas prácticas

✅ **Crea los almacenes únicamente en `onupgradeneeded`:** Es el único lugar permitido por el navegador para crear o modificar la estructura (`createObjectStore` o `createIndex`). Intentar hacerlo en `onsuccess` lanzará un error.

✅ **Usa transacciones `"readonly"` siempre que no modifiques datos:** Las transacciones de solo lectura permiten que el navegador ejecute múltiples consultas en paralelo, mejorando notablemente el rendimiento.

✅ **Envuelve IndexedDB en Promesas (o usa librerías como `idb`):** La API nativa usa *callbacks* antiguos (`onsuccess`/`onerror`). En proyectos reales, encapsular las peticiones en `new Promise()` te permite usar `async/await` de forma limpia.

```javascript
const obtenerPorId = (db, storeName, id) => {
    return new Promise((resolve, reject) => {
        const tx = db.transaction([storeName], "readonly");
        const req = tx.objectStore(storeName).get(id);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
};
```

---

# Errores comunes

### ❌ Intentar insertar registros con clave duplicada usando `.add()`
El método `.add()` falla si ya existe un registro con el mismo `id` (lanzando un `ConstraintError`). Si deseas insertar un registro nuevo **o sobrescribirlo** si ya existe, debes utilizar `.put()`.

```javascript
// ❌ EVITAR SI EL ID YA EXISTE: Lanzará ConstraintError
almacen.add({ id: 1, nombre: "Mouse" });

// ✅ CORRECTO PARA CREAR O ACTUALIZAR: Sobrescribe si el id 1 ya existe
almacen.put({ id: 1, nombre: "Mouse Gamer" });
```

### ❌ Olvidar incrementar el número de versión al cambiar la estructura
Si ya creaste `"MiDB"` en versión `1` y luego agregas código para crear un segundo `ObjectStore` sin subir el número a `2`, el evento `onupgradeneeded` nunca se disparará y tu nuevo almacén no existirá.

```javascript
// ❌ INCORRECTO: Si la v1 ya existe en el navegador, onupgradeneeded se ignora
const request = indexedDB.open("MiDB", 1);

// ✅ CORRECTO: Subir a versión 2 fuerza la actualización de estructura
const request = indexedDB.open("MiDB", 2);
```

---

# Ejercicios

## Nivel 1
Escribe el código necesario para abrir una base de datos llamada `"BibliotecaDB"` en su versión `1`. Dentro del evento correspondiente, crea un almacén de objetos llamado `"libros"` cuya clave primaria (`keyPath`) sea `"isbn"`.

## Nivel 2
Completa y corrige el siguiente bloque de código para guardar un objeto `{ isbn: "978-3", titulo: "Clean Code" }` dentro del almacén `"libros"`. Asegúrate de usar el modo de transacción correcto y manejar el evento `onsuccess` de la solicitud de guardado:
```javascript
const guardarLibro = (db, libro) => {
    const tx = db.transaction(["libros"], "readonly"); // <-- Revisar modo
    const store = tx.objectStore("libros");
    // Agrega aquí la operación de inserción/actualización y su confirmación
};
```

## Nivel 3
Crea una función asíncrona llamada `obtenerTodosLosLibros(db)` que retorne una `Promise`. Dentro de ella, abre una transacción `"readonly"` sobre el almacén `"libros"`, utiliza el método `.getAll()` para recuperar todos los registros y resuelve la promesa con el arreglo obtenido (o recházala si ocurre un error).

---

# Solucionario paso a paso

## Solución Nivel 1: Inicialización y creación de `ObjectStore`

### 🎯 Objetivo
Abrir la conexión con IndexedDB y definir el esquema inicial dentro del evento `onupgradeneeded`.

```javascript
// 1. Solicitamos abrir la base de datos en versión 1
const solicitud = indexedDB.open("BibliotecaDB", 1);

// 2. Definimos la estructura cuando se crea por primera vez
solicitud.onupgradeneeded = (evento) => {
    const db = evento.target.result;
    
    // Creamos el almacén "libros" identificando cada registro por su "isbn"
    if (!db.objectStoreNames.contains("libros")) {
        db.createObjectStore("libros", { keyPath: "isbn" });
    }
};

solicitud.onsuccess = () => {
    console.log("Base de datos BibliotecaDB lista para usar.");
};

solicitud.onerror = (evento) => {
    console.error("Error al abrir IndexedDB:", evento.target.error);
};
```

> **💡 Nota clave:** Verificar `!db.objectStoreNames.contains("libros")` es una excelente medida preventiva cuando manejas múltiples migraciones de versiones (`v1` → `v2` → `v3`).

## Solución Nivel 2: Transacción de escritura con `.put()`

### 🎯 Objetivo
Corregir el modo de la transacción a `"readwrite"` y persistir el objeto de forma segura.

```javascript
const guardarLibro = (db, libro) => {
    // 1. Cambiamos a "readwrite" porque vamos a modificar datos
    const tx = db.transaction(["libros"], "readwrite");
    const store = tx.objectStore("libros");
    
    // 2. Usamos .put() para insertar o actualizar si el ISBN ya existía
    const peticion = store.put(libro);
    
    peticion.onsuccess = () => {
        console.log(`Libro "${libro.titulo}" guardado correctamente.`);
    };
    
    peticion.onerror = () => {
        console.error("No se pudo guardar el libro:", peticion.error);
    };
};

// Ejemplo de uso:
// guardarLibro(db, { isbn: "978-3", titulo: "Clean Code" });
```

> **💡 Nota clave:** Si dejas la transacción en `"readonly"` e intentas ejecutar `.add()` o `.put()`, el navegador lanzará inmediatamente una excepción `ReadOnlyError`.

## Solución Nivel 3: Modernizando IndexedDB con Promesas y `async/await`

### 🎯 Objetivo
Convertir la API basada en eventos de IndexedDB en una función compatible con `async/await` mediante `new Promise()`.

```javascript
const obtenerTodosLosLibros = (db) => {
    return new Promise((resolve, reject) => {
        // 1. Iniciamos transacción de solo lectura
        const tx = db.transaction(["libros"], "readonly");
        const store = tx.objectStore("libros");
        
        // 2. Solicitamos todos los registros del almacén
        const peticion = store.getAll();
        
        // 3. Resolvemos o rechazamos la promesa según el resultado
        peticion.onsuccess = () => {
            resolve(peticion.result);
        };
        
        peticion.onerror = () => {
            reject(peticion.error);
        };
    });
};

// Ejemplo de uso moderno con async/await:
const mostrarCatalogo = async (db) => {
    try {
        const listaLibros = await obtenerTodosLosLibros(db);
        console.log("Catálogo completo:", listaLibros);
    } catch (error) {
        console.error("Error al leer el catálogo:", error);
    }
};
```

> **💡 Nota clave:** Encapsular operaciones en Promesas te permite combinar IndexedDB con `fetch()` de manera natural, por ejemplo, para guardar en caché local los datos descargados desde una API REST.

---

# Resumen

* **IndexedDB** es una base de datos NoSQL asíncrona en el navegador ideal para guardar grandes volúmenes de objetos nativos y archivos de forma persistente.
* **Su arquitectura gira en torno a eventos y transacciones:** La estructura se define en `onupgradeneeded` y las operaciones se ejecutan dentro de transacciones `"readonly"` o `"readwrite"`.
* **Encapsular las solicitudes en `Promise`** permite integrar IndexedDB con la sintaxis moderna de `async/await`, facilitando su combinación con `fetch()` para aplicaciones *offline-first*.


---

# Conceptos Complementarios: Índices Secundarios (`createIndex`) y Cursores (`openCursor`)

### 1. Búsquedas rápidas por otro campo (`createIndex`)
Dentro de `onupgradeneeded`, puedes crear índices para buscar sin recorrer toda la base:
```javascript
const store = db.createObjectStore("usuarios", { keyPath: "id", autoIncrement: true });
store.createIndex("por_email", "email", { unique: true });

// Luego, en una transacción de lectura:
const index = tx.objectStore("usuarios").index("por_email");
const req = index.get("ana@ejemplo.com");
```

### 2. Recorrer registros uno a uno (`openCursor`)
```javascript
store.openCursor().onsuccess = (e) => {
    const cursor = e.target.result;
    if (cursor) {
        console.log(cursor.key, cursor.value);
        cursor.continue(); // Avanza al siguiente registro
    }
};
```

---

# Hoja de Trucos (Cheatsheet)

| Método / Evento | Uso Principal |
| :--- | :--- |
| `indexedDB.open(nombre, version)` | Abre o crea la base de datos |
| `onupgradeneeded` | Único lugar permitido para `createObjectStore()` y `createIndex()` |
| `db.transaction([store], modo)` | Inicia transacción `"readonly"` o `"readwrite"` |
| `store.add()` / `put()` / `get()` / `delete()` | Operaciones CRUD sobre el almacén |
| `store.getAll()` | Obtiene todos los registros en un arreglo |
