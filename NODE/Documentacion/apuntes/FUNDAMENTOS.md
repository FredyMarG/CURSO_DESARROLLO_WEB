# GUÍA COMPLETA — Fundamentos de Node.js

> **Nivel:** Principiante → Intermedio (base para Junior)  
> **Módulo:** 01 — Introducción al backend y Node.js  
> **Objetivo:** Comprender qué es Node.js, para qué sirve, cómo se relaciona con JavaScript y el navegador, cómo funciona una aplicación cliente-servidor y cómo ejecutar el primer programa y servidor HTTP. Aplicaremos lo aprendido al proyecto **CURSO_DESARROLLO_WEB**.

---

# 📚 Temario

1. Definición: ¿Qué es Node.js?
2. ¿Qué es el backend y cómo se diferencia del frontend?
3. Principales usos de Node.js
4. JavaScript en el navegador vs. JavaScript en Node.js
5. Arquitectura cliente-servidor y ciclo de una petición HTTP
6. Componentes fundamentales: V8, entorno de ejecución, APIs y Event Loop
7. Node.js, npm, paquetes y `package.json`
8. Preparar el entorno de trabajo en Windows
9. Primer programa con Node.js
10. Primer servidor HTTP con Node.js
11. Analogías del mundo real
12. Diagrama de flujo
13. Buenas prácticas y errores comunes
14. Proyecto integrador: API de bienvenida para CURSO_DESARROLLO_WEB
15. Resumen técnico
16. Ejercicios por niveles
17. Solucionario paso a paso
18. Hoja de trucos (Cheatsheet)
19. Evaluación y criterios de aprobación

---

# Definición

**Node.js** es un **entorno de ejecución de JavaScript** que permite ejecutar código JavaScript **fuera del navegador**. Se utiliza frecuentemente para construir servidores web, APIs, herramientas de consola, procesos automáticos y aplicaciones en tiempo real.

Node.js **no es** un lenguaje de programación: el lenguaje sigue siendo **JavaScript**. Tampoco es un framework como Express. Node.js proporciona un entorno con capacidades para trabajar con archivos, red, procesos y otras funciones del sistema.

```javascript
// archivo: saludo.js
console.log('¡Hola desde Node.js!');
```

Para ejecutarlo, abre una terminal en la carpeta del archivo y escribe:

```powershell
node saludo.js
```

**Resultado esperado:**

```text
¡Hola desde Node.js!
```

**Explicación línea por línea:**

- `console` es un objeto disponible para escribir información en la terminal.
- `.log()` muestra el mensaje que recibe.
- `'¡Hola desde Node.js!'` es una cadena de texto (*string*).
- `node saludo.js` pide al ejecutable de Node.js que interprete y ejecute el archivo.

> **Importante:** Ejecutar JavaScript con Node.js no convierte automáticamente una página HTML en un servidor. Son tareas diferentes que aprenderemos a conectar.

---

# ¿Qué es el backend y cómo se diferencia del frontend?

El **frontend** es la parte con la que interactúa el usuario: páginas, formularios, botones, menús y contenido visual. Normalmente utiliza HTML, CSS y JavaScript en el navegador.

El **backend** procesa solicitudes, aplica reglas de negocio, valida datos, gestiona usuarios y se comunica con bases de datos u otros servicios.

| Aspecto | Frontend | Backend |
| :--- | :--- | :--- |
| Dónde suele ejecutarse | Navegador | Servidor |
| Responsabilidad | Interfaz y experiencia de usuario | Lógica, datos y servicios |
| Tecnologías habituales | HTML, CSS, JavaScript | Node.js, PHP, Python, Java, etc. |
| Ejemplo en la plataforma | Mostrar un catálogo de cursos | Guardar el progreso del estudiante |
| Seguridad | No se confían secretos al navegador | Puede proteger credenciales y validar permisos |

**Ejemplo aplicado:** un estudiante pulsa «Completar lección» en `CURSO_DESARROLLO_WEB`.

1. El frontend detecta el clic.
2. Envía una solicitud al backend.
3. El backend comprueba qué estudiante está autenticado y si puede registrar el avance.
4. El backend guarda el resultado en la base de datos.
5. Devuelve una respuesta.
6. El frontend actualiza el progreso visible.

> **Regla clave:** Nunca debemos confiar en que una validación hecha únicamente en el navegador sea suficiente para proteger datos o permisos.

---

# Principales usos

### 1. APIs REST 🌐

Una API permite que el frontend consulte y modifique información mediante rutas como `GET /api/cursos` o `POST /api/progreso`.

### 2. Aplicaciones web con backend 🖥️

Node.js puede servir contenido, gestionar sesiones y conectar interfaces con datos persistentes.

### 3. Automatización y herramientas de consola ⚙️

Podemos crear scripts para ordenar archivos, generar documentación Markdown o revisar recursos de la plataforma.

### 4. Comunicación en tiempo real 💬

Con tecnologías como WebSocket se pueden implementar chats, notificaciones y actualizaciones en vivo.

### 5. Integraciones y servicios externos 🔌

Node.js puede consumir APIs, procesar archivos y comunicarse con sistemas de correo o pagos.

---

# JavaScript en el navegador vs. JavaScript en Node.js

Aunque ambos ejecutan JavaScript, sus APIs disponibles no son idénticas.

| Operación | Navegador | Node.js |
| :--- | :--- | :--- |
| Mostrar mensajes con `console.log()` | Sí | Sí |
| Manipular HTML con `document` | Sí | No de forma nativa |
| Acceder a `window` | Sí | No |
| Leer archivos del servidor con `node:fs` | No | Sí |
| Crear un servidor HTTP con `node:http` | No | Sí |
| Usar `fetch()` | Sí | Sí, en versiones modernas de Node.js |

**Ejemplo que no funciona directamente en Node.js:**

```javascript
document.querySelector('h1').textContent = 'Hola';
```

**¿Por qué?** `document` pertenece al entorno del navegador. Node.js no dispone de un documento HTML del navegador por defecto.

**Ejemplo de una capacidad nativa de Node.js:**

```javascript
const os = require('node:os');
console.log('Sistema operativo:', os.platform());
```

`require('node:os')` carga un módulo incorporado que permite consultar información del sistema operativo.

---

# Arquitectura cliente-servidor y HTTP

En una aplicación web, un **cliente** envía una **petición HTTP** y un **servidor** devuelve una **respuesta HTTP**.

Una petición suele contener:

- **Método:** por ejemplo, `GET` para solicitar información.
- **Ruta:** por ejemplo, `/api/cursos`.
- **Cabeceras:** metadatos como el formato aceptado.
- **Cuerpo:** datos enviados cuando corresponde, por ejemplo en `POST`.

Una respuesta suele contener:

- **Código de estado:** `200` (correcto), `404` (no encontrado), `500` (error interno), entre otros.
- **Cabeceras:** por ejemplo, `Content-Type: application/json`.
- **Cuerpo:** contenido HTML, JSON, texto u otro formato.

**Ejemplo:**

```http
GET /api/saludo HTTP/1.1
Host: localhost:3000
```

Respuesta posible:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{"mensaje":"Bienvenido al curso de Node.js"}
```

**`localhost`** representa el equipo donde estás ejecutando el servidor. El **puerto `3000`** identifica el servicio de ejemplo dentro de ese equipo.

---

# Componentes fundamentales de Node.js

### 1. Motor V8

Es el motor que ejecuta JavaScript. Node.js utiliza V8, desarrollado originalmente para Chromium.

### 2. APIs nativas

Módulos como `node:fs`, `node:path` y `node:http` ofrecen capacidades de archivos, rutas y red.

### 3. Event Loop

Coordina la ejecución de callbacks y permite que muchas operaciones de entrada/salida se gestionen sin bloquear el hilo principal de JavaScript mientras esperan resultados. **No significa que todo el código se ejecute en paralelo**.

### 4. libuv

Es una biblioteca utilizada por Node.js para gestionar mecanismos de entrada/salida, el bucle de eventos y determinadas tareas mediante un grupo de hilos.

### 5. Proceso de Node.js

Cuando ejecutas `node archivo.js`, se inicia un proceso del sistema operativo. El objeto global `process` permite consultar información y controlar aspectos de su ejecución.

```javascript
console.log('Versión de Node.js:', process.version);
console.log('Directorio actual:', process.cwd());
```

> **Profundización futura:** Promesas, `async/await`, colas de tareas, Event Loop y concurrencia se estudiarán detalladamente en el módulo de arquitectura interna.

---

# Node.js, npm y package.json

**npm** es el gestor de paquetes que suele instalarse junto con Node.js. Permite instalar dependencias y ejecutar scripts del proyecto.

**`package.json`** describe el proyecto: nombre, versión, scripts y dependencias, entre otros datos.

```powershell
node -v
npm -v
npm init -y
```

**Explicación:**

- `node -v` muestra la versión de Node.js instalada.
- `npm -v` muestra la versión de npm.
- `npm init -y` crea un `package.json` con respuestas predeterminadas.

Ejemplo de `package.json` para nuestros laboratorios:

```json
{
  "name": "fundamentos-nodejs",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "node servidor.js"
  }
}
```

Ahora `npm start` ejecutará `node servidor.js`.

> **Nota:** En este primer laboratorio usaremos módulos incorporados de Node.js y no necesitaremos instalar Express ni ninguna base de datos.

---

# Preparar el entorno en Windows

**Requisitos:** Node.js, npm, Visual Studio Code y una terminal (PowerShell o la integrada en VS Code).

1. Abre Visual Studio Code.
2. Abre una carpeta de trabajo para los ejercicios.
3. Abre **Terminal → Nuevo terminal**.
4. Verifica la instalación:

```powershell
node -v
npm -v
```

5. Crea el directorio del primer laboratorio:

```powershell
mkdir fundamentos-nodejs
cd fundamentos-nodejs
npm init -y
```

**Resultado esperado:** se crea el archivo `package.json`.

**Consejo:** para proyectos que se desplegarán en producción, suele ser preferible utilizar una versión **LTS** de Node.js, por su ciclo de soporte.

---

# Primer programa con Node.js

Crea el archivo `index.js`:

```javascript
const nombreCurso = 'Fundamentos de Node.js';
const totalModulos = 26;

function presentarCurso(nombre, cantidad) {
  return `Bienvenido a ${nombre}. El programa tiene ${cantidad} módulos.`;
}

console.log(presentarCurso(nombreCurso, totalModulos));
```

Ejecuta:

```powershell
node index.js
```

**Explicación paso a paso:**

1. `const nombreCurso` declara una variable cuyo identificador no se reasignará.
2. `const totalModulos` guarda un número.
3. `function presentarCurso(...)` define una función reutilizable.
4. `return` devuelve el texto construido.
5. Las comillas invertidas permiten interpolar variables mediante `${...}`.
6. `console.log(...)` imprime el resultado.

**Salida esperada:**

```text
Bienvenido a Fundamentos de Node.js. El programa tiene 26 módulos.
```

---

# Primer servidor HTTP con Node.js

Crea `servidor.js`:

```javascript
const http = require('node:http');

const PUERTO = 3000;

const servidor = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('¡Hola! Este mensaje viene desde un servidor Node.js.');
});

servidor.listen(PUERTO, () => {
  console.log(`Servidor disponible en http://localhost:${PUERTO}`);
});
```

Ejecuta:

```powershell
node servidor.js
```

Abre `http://localhost:3000` en tu navegador.

**Explicación línea por línea:**

- `require('node:http')`: importa el módulo HTTP incluido en Node.js.
- `PUERTO`: define el puerto de escucha.
- `http.createServer(...)`: crea el servidor y registra la función que atenderá cada petición.
- `req`: representa la petición recibida.
- `res`: representa la respuesta que construiremos.
- `res.writeHead(200, ...)`: establece el código HTTP y las cabeceras.
- `res.end(...)`: envía el contenido y finaliza la respuesta.
- `servidor.listen(...)`: inicia la escucha de conexiones en el puerto indicado.

Para detener el servidor, vuelve a la terminal y presiona **Ctrl + C**.

> **Observación:** Este primer servidor responde lo mismo para cualquier ruta. Aprenderemos a diferenciar rutas y métodos más adelante.

---

# Analogías del mundo real

### 1. Restaurante: cliente y servidor 🍽️

- El **cliente** es quien pide comida.
- La **petición HTTP** es el pedido.
- El **servidor** es la cocina que procesa la solicitud.
- La **respuesta HTTP** es el plato entregado, acompañado de un estado que indica si fue posible prepararlo.

### 2. Biblioteca: frontend, backend y base de datos 📚

- El **frontend** es el mostrador donde el usuario solicita un libro.
- El **backend** es el bibliotecario que comprueba las reglas de préstamo.
- La **base de datos** es el catálogo que registra libros y préstamos.

### 3. Recepción de solicitudes: Event Loop 📥

Una recepción puede registrar múltiples solicitudes y continuar atendiendo mientras ciertas tareas externas avanzan. Esta analogía ayuda a entender la espera no bloqueante, aunque el funcionamiento real del Event Loop tiene reglas técnicas específicas.

---

# Diagrama de flujo de una petición

```text
┌───────────────────────────────┐
│ Estudiante abre la plataforma │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ Frontend realiza petición    │
│ GET /api/bienvenida           │
└───────────────┬───────────────┘
                │ HTTP
                ▼
┌───────────────────────────────┐
│ Servidor Node.js recibe req  │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ Comprueba método y ruta      │
└───────────────┬───────────────┘
                │
       ┌────────┴─────────┐
       ▼                  ▼
   [Coincide]        [No coincide]
       │                  │
       ▼                  ▼
 [200 + JSON]        [404 + JSON]
       │                  │
       └────────┬─────────┘
                ▼
┌───────────────────────────────┐
│ Navegador recibe la respuesta│
└───────────────────────────────┘
```

---

# Buenas prácticas y errores comunes

### ✅ Buenas prácticas

- **Nombra los archivos con claridad:** `servidor.js`, `index.js` y `README.md` son fáciles de identificar.
- **Separa responsabilidades:** no mezcles toda la lógica de la aplicación en un único archivo cuando crezca.
- **Comprueba el estado HTTP:** una respuesta exitosa debe usar códigos coherentes.
- **Usa `Content-Type` adecuado:** para JSON, `application/json; charset=utf-8`.
- **Protege datos sensibles:** nunca publiques contraseñas, tokens ni archivos `.env` con secretos.
- **Controla errores:** las operaciones de red y archivos pueden fallar.
- **Aprende a leer la terminal:** los mensajes de error son parte del proceso de aprendizaje.

### ❌ Errores comunes

- **Confundir Node.js con JavaScript:** JavaScript es el lenguaje; Node.js es un entorno de ejecución.
- **Intentar usar `document` en Node.js:** esa API pertenece al navegador.
- **Olvidar iniciar el servidor:** visitar `localhost:3000` sin un proceso escuchando produce un error de conexión.
- **Tener el puerto ocupado:** otro proceso puede estar utilizando `3000`; cambia el puerto o detén el proceso anterior.
- **Confundir ruta con archivo:** `/api/bienvenida` es una ruta HTTP; no tiene que existir un archivo con ese nombre.
- **Creer que el backend sustituye al frontend:** ambos cumplen funciones distintas y se complementan.

---

# Proyecto integrador: API de bienvenida para CURSO_DESARROLLO_WEB

## Objetivo

Construir una pequeña API con Node.js **sin dependencias externas**. Devolverá información del curso y permitirá comprobar el funcionamiento de rutas, métodos, respuestas JSON y códigos HTTP.

> **Alcance:** este proyecto se desarrolla de forma aislada para no modificar todavía los archivos existentes de `CURSO_DESARROLLO_WEB`. Su integración visual se hará después de revisar el código real del portal.

## Estructura

```text
proyecto-01-api-bienvenida/
├── package.json
├── servidor.js
└── README.md
```

## Paso 1. Crear el proyecto

```powershell
mkdir proyecto-01-api-bienvenida
cd proyecto-01-api-bienvenida
npm init -y
```

En `package.json`, agrega o modifica el script `start`:

```json
"scripts": {
  "start": "node servidor.js"
}
```

**Atención:** el fragmento anterior se coloca dentro del objeto JSON existente; no reemplaza todo el archivo.

## Paso 2. Crear `servidor.js`

```javascript
const http = require('node:http');

const PUERTO = 3000;

const cursos = [
  { id: 1, nombre: 'HTML y CSS', nivel: 'Fundamentos' },
  { id: 2, nombre: 'JavaScript', nivel: 'Fundamentos' },
  { id: 3, nombre: 'Node.js', nivel: 'Principiante a avanzado' }
];

const servidor = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'GET' && url.pathname === '/api/bienvenida') {
    res.writeHead(200);
    res.end(JSON.stringify({
      mensaje: 'Bienvenido a CURSO_DESARROLLO_WEB',
      moduloActual: 'Fundamentos de Node.js'
    }));
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/cursos') {
    res.writeHead(200);
    res.end(JSON.stringify({ total: cursos.length, cursos }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
});

servidor.listen(PUERTO, () => {
  console.log(`API lista en http://localhost:${PUERTO}`);
});
```

## Paso 3. Entender el código

| Fragmento | Función |
| :--- | :--- |
| `require('node:http')` | Importa el módulo HTTP nativo. |
| `cursos` | Simula datos de un catálogo; todavía no es una base de datos. |
| `http.createServer()` | Define cómo se atienden las peticiones. |
| `req.method` | Permite comprobar el método HTTP. |
| `new URL(...).pathname` | Obtiene la ruta solicitada sin sus parámetros de consulta. |
| `res.setHeader(...)` | Indica que se enviará JSON. |
| `res.writeHead(200)` | Establece una respuesta correcta. |
| `JSON.stringify(...)` | Convierte un objeto JavaScript en texto JSON. |
| `return` | Evita que la función continúe y envíe otra respuesta. |
| `res.writeHead(404)` | Indica que no se encontró la ruta. |
| `listen(PUERTO)` | Inicia el servidor. |

## Paso 4. Ejecutar y probar

```powershell
npm start
```

Abre estas direcciones en el navegador:

1. `http://localhost:3000/api/bienvenida`
2. `http://localhost:3000/api/cursos`
3. `http://localhost:3000/api/no-existe`

**Resultados esperados:**

Para `/api/bienvenida`:

```json
{
  "mensaje": "Bienvenido a CURSO_DESARROLLO_WEB",
  "moduloActual": "Fundamentos de Node.js"
}
```

Para `/api/cursos`:

```json
{
  "total": 3,
  "cursos": [
    { "id": 1, "nombre": "HTML y CSS", "nivel": "Fundamentos" },
    { "id": 2, "nombre": "JavaScript", "nivel": "Fundamentos" },
    { "id": 3, "nombre": "Node.js", "nivel": "Principiante a avanzado" }
  ]
}
```

Para `/api/no-existe`:

```json
{ "error": "Ruta no encontrada" }
```

## Paso 5. Validar con PowerShell

En una segunda terminal, con el servidor activo:

```powershell
Invoke-RestMethod http://localhost:3000/api/bienvenida
Invoke-RestMethod http://localhost:3000/api/cursos
```

Para comprobar el estado `404`, utiliza:

```powershell
try {
  Invoke-WebRequest http://localhost:3000/api/no-existe
} catch {
  $_.Exception.Response.StatusCode.value__
}
```

Debería mostrar `404`.

## Retos del proyecto

1. Agrega una ruta `GET /api/estado` que devuelva `{ "activo": true }`.
2. Añade un cuarto curso al arreglo `cursos`.
3. Agrega una propiedad `version` a la respuesta de bienvenida.
4. Investiga cómo distinguir una petición `POST` de una `GET`.
5. Explica por qué esta API todavía no guarda información permanentemente.

**Criterio de finalización:** las tres rutas iniciales funcionan, los códigos de estado son correctos y puedes explicar cada parte del servidor sin consultar la solución.

---

# Resumen técnico

- **Node.js** ejecuta JavaScript fuera del navegador.
- **Backend** es la capa que procesa reglas, solicitudes y datos.
- **Frontend** presenta la interfaz al usuario.
- **HTTP** conecta clientes y servidores mediante peticiones y respuestas.
- **V8** ejecuta JavaScript; **libuv** y el **Event Loop** participan en la gestión de operaciones asíncronas.
- **npm** gestiona paquetes y scripts; **`package.json`** describe el proyecto.
- **`node:http`** permite crear servidores sin instalar frameworks.
- **`JSON.stringify()`** transforma objetos en texto JSON para enviarlos por HTTP.

---

# Ejercicios

## Nivel 1 — Reconocimiento

1. Explica con tus palabras qué es Node.js.
2. Indica tres diferencias entre frontend y backend.
3. Ejecuta `node -v` y `npm -v`.
4. Crea `hola.js` y muestra tu nombre y el módulo que estás estudiando.

## Nivel 2 — Aplicación

1. Crea una función `describirModulo(nombre, numero)` que devuelva una frase.
2. Crea un servidor que responda `Hola, estudiante` en el puerto `3001`.
3. Explica qué hacen `req`, `res` y `res.end()`.
4. Devuelve una respuesta JSON con el nombre del curso.

## Nivel 3 — Desafío

1. Crea dos rutas: `/api/saludo` y `/api/version`.
2. Devuelve `404` para cualquier ruta desconocida.
3. Modifica la API del proyecto para responder `GET /api/cursos?categoria=backend` mostrando la categoría recibida. No necesitas filtrar todavía.
4. Documenta los pasos de instalación y ejecución en un archivo `README.md`.

---

# Solucionario paso a paso

## Solución Nivel 1 — Primer archivo

```javascript
// hola.js
const estudiante = 'Tu nombre';
const modulo = 'Fundamentos de Node.js';
console.log(`${estudiante} está estudiando ${modulo}.`);
```

Ejecuta `node hola.js` y verifica el mensaje.

## Solución Nivel 2 — Función y servidor

```javascript
function describirModulo(nombre, numero) {
  return `Módulo ${numero}: ${nombre}`;
}

console.log(describirModulo('Fundamentos de Node.js', 1));
```

Servidor básico:

```javascript
const http = require('node:http');

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ mensaje: 'Hola, estudiante' }));
}).listen(3001, () => {
  console.log('Servidor listo en http://localhost:3001');
});
```

**Comprueba:** al abrir `http://localhost:3001`, el navegador muestra el JSON.

## Solución Nivel 3 — Rutas y parámetros

```javascript
const http = require('node:http');

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'GET' && url.pathname === '/api/saludo') {
    res.writeHead(200);
    return res.end(JSON.stringify({ mensaje: 'Hola' }));
  }

  if (req.method === 'GET' && url.pathname === '/api/version') {
    res.writeHead(200);
    return res.end(JSON.stringify({ version: '1.0.0' }));
  }

  if (req.method === 'GET' && url.pathname === '/api/cursos') {
    const categoria = url.searchParams.get('categoria');
    res.writeHead(200);
    return res.end(JSON.stringify({ categoria }));
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'No encontrado' }));
}).listen(3002, () => console.log('Servidor en puerto 3002'));
```

**Prueba:** `http://localhost:3002/api/cursos?categoria=backend` debe devolver `{"categoria":"backend"}`.

---

# Hoja de trucos (Cheatsheet)

| Concepto / comando | Propósito | Ejemplo |
| :--- | :--- | :--- |
| `node -v` | Ver versión de Node.js | `node -v` |
| `npm -v` | Ver versión de npm | `npm -v` |
| `node archivo.js` | Ejecutar JavaScript | `node index.js` |
| `npm init -y` | Crear `package.json` | `npm init -y` |
| `npm start` | Ejecutar el script `start` | `npm start` |
| `require('node:http')` | Cargar módulo HTTP | `const http = require('node:http')` |
| `http.createServer()` | Crear servidor | `http.createServer((req, res) => {})` |
| `res.writeHead()` | Establecer estado y cabeceras | `res.writeHead(200)` |
| `res.end()` | Finalizar respuesta | `res.end('Hola')` |
| `JSON.stringify()` | Convertir objeto a JSON | `JSON.stringify({ ok: true })` |
| `req.method` | Leer método HTTP | `req.method === 'GET'` |
| `new URL()` | Interpretar una URL | `new URL(req.url, 'http://localhost')` |
| `Ctrl + C` | Detener servidor en terminal | Teclado |

---

# Evaluación y criterios de aprobación

**Preguntas de autoevaluación:**

1. ¿Node.js es un lenguaje, un navegador o un entorno de ejecución?
2. ¿Por qué un archivo que usa `document` puede fallar en Node.js?
3. ¿Cuál es la diferencia entre `GET` y `POST`?
4. ¿Para qué sirve `package.json`?
5. ¿Qué representa `localhost:3000`?
6. ¿Qué indica el estado HTTP `404`?
7. ¿Qué función cumple `res.end()`?
8. ¿Por qué no conviene guardar contraseñas en el frontend?
9. ¿Qué diferencia existe entre datos guardados en un arreglo y datos persistidos en una base de datos?
10. ¿Qué relación tiene este módulo con la futura integración de Node.js en `CURSO_DESARROLLO_WEB`?

**Rúbrica sugerida:**

| Componente | Peso |
| :--- | ---: |
| Comprensión conceptual | 25 % |
| Ejercicios prácticos | 25 % |
| Proyecto integrador funcional | 40 % |
| Documentación y explicación del código | 10 % |

**Aprobación recomendada:** 80 % o más, y proyecto integrador funcionando.

**Lista de verificación:**

- [ ] Puedo explicar qué es Node.js.
- [ ] Distingo frontend, backend y base de datos.
- [ ] Entiendo el ciclo básico de una petición HTTP.
- [ ] Sé ejecutar archivos JavaScript desde la terminal.
- [ ] Puedo iniciar y detener un servidor HTTP.
- [ ] Sé devolver JSON y un código `404`.
- [ ] Completé los ejercicios.
- [ ] Terminé y documenté la API de bienvenida.

---

# Próximo módulo

**Módulo 02 — Instalación y entorno de desarrollo:** profundizaremos en versiones LTS, configuración de Visual Studio Code, npm, scripts, terminal, Git y organización profesional del entorno de trabajo.

> **Integración con la plataforma:** este archivo es material didáctico autónomo. Antes de modificar el portal existente, revisaremos sus archivos reales para adaptar la navegación, estilos y enlaces sin romper las secciones actuales.
