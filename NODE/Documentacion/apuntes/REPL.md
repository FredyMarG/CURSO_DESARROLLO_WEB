# GUÍA COMPLETA — REPL de Node.js

> **Nivel:** Principiante a intermedio (con prácticas avanzadas)  
> **Módulo:** Nivel 1 — Fundamentos de Node.js  
> **Objetivo:** Dominar el entorno interactivo REPL de Node.js para ejecutar JavaScript sin crear archivos, inspeccionar objetos, probar expresiones, experimentar con módulos y depurar ideas antes de incorporarlas a `CURSO_DESARROLLO_WEB`.  
> **Requisitos:** Node.js instalado, terminal de Windows, PowerShell o terminal integrada de VS Code.  
> **Modalidad:** Totalmente offline; los ejemplos principales no requieren instalar paquetes.

---

# Definición

**REPL** significa **Read–Eval–Print–Loop** (Leer–Evaluar–Imprimir–Repetir). Es un entorno interactivo integrado en Node.js. Permite escribir una expresión JavaScript, ejecutarla inmediatamente y ver el resultado sin guardar un archivo `.js`.

Por ejemplo, en la terminal:

```powershell
node
```

Aparece un indicador parecido a este:

```text
Welcome to Node.js vXX.X.X.
Type ".help" for more information.
>
```

Escribe:

```javascript
2 + 3
```

Obtendrás:

```text
5
```

**Importante:** `>` representa el indicador del REPL; no necesitas escribirlo. Los mensajes exactos de bienvenida pueden variar según la versión instalada.

---

# Principales usos

### 1. Aprender JavaScript rápidamente 📚

Comprueba cómo funcionan operadores, tipos de datos, cadenas, arreglos y funciones.

### 2. Probar ideas antes de escribir archivos 🧪

Experimenta con una función de cálculo o transformación de datos y después trasládala al proyecto.

### 3. Inspeccionar objetos y módulos 🔍

Consulta propiedades, métodos y resultados de módulos integrados en Node.js.

### 4. Depurar cálculos pequeños 🛠️

Reproduce un error de forma aislada, cambia una entrada y observa qué ocurre.

### 5. Trabajar sin conexión 📴

REPL funciona localmente: no necesita navegador, servidor remoto ni Internet.

---

# Iniciar y salir del REPL

## Iniciar desde Windows o VS Code

1. Abre VS Code.
2. Selecciona **Terminal → Nueva terminal**.
3. Comprueba que Node.js está instalado:

```powershell
node -v
```

4. Inicia REPL:

```powershell
node
```

5. Escribe:

```javascript
"Hola desde Node.js"
```

6. Sal con:

```text
.exit
```

También puedes presionar **Ctrl+C dos veces**. En algunos entornos, **Ctrl+D** cierra la sesión.

> Si `node` no se reconoce, revisa la instalación de Node.js y la variable PATH antes de continuar.

---

# Cómo funciona Read–Eval–Print–Loop

| Fase | Nombre | Acción |
|---|---|---|
| R | Read | Lee lo que escribes. |
| E | Eval | Evalúa la expresión como JavaScript. |
| P | Print | Muestra el resultado evaluado. |
| L | Loop | Espera la siguiente instrucción. |

Ejemplo:

```javascript
const precio = 12000
precio * 2
```

Salida de la segunda instrucción:

```text
24000
```

Las declaraciones como `const precio = 12000` pueden mostrar `undefined`, porque la declaración no produce un valor útil para imprimir. **Eso no significa que haya ocurrido un error.**

---

# Expresiones, variables y funciones

## 1. Operaciones matemáticas

```javascript
10 + 5
20 / 4
2 ** 3
17 % 5
```

Resultados esperados: `15`, `5`, `8` y `2`.

## 2. Variables

```javascript
let estudiantes = 5
estudiantes += 2
estudiantes
```

Resultado: `7`.

```javascript
const plataforma = "CURSO_DESARROLLO_WEB"
plataforma.toLowerCase()
```

Resultado: `'curso_desarrollo_web'`.

**Precaución:** una variable declarada con `const` no se puede reasignar. Si vuelves a declarar el mismo identificador con `const` o `let` en la misma sesión, puede aparecer un error de declaración duplicada. Utiliza un nombre nuevo o reinicia el REPL.

## 3. Funciones

```javascript
function saludar(nombre) {
  return `Bienvenido, ${nombre}`;
}

saludar("Ana")
```

Resultado: `'Bienvenido, Ana'`.

## 4. Funciones flecha

```javascript
const calcularAvance = (completados, total) =>
  total === 0 ? 0 : (completados / total) * 100;

calcularAvance(3, 5)
```

Resultado: `60`.

**Explicación:** el operador ternario evita dividir por cero cuando `total` vale `0`.

---

# Objetos, arreglos y métodos

## Arreglos

```javascript
const temas = ["Node.js", "Express", "PostgreSQL"]
temas.length
temas.includes("Express")
temas.map(tema => tema.toUpperCase())
```

Resultados: `3`, `true` y un arreglo con los nombres en mayúsculas.

## Objetos

```javascript
const curso = {
  id: 1,
  nombre: "Fundamentos de Node.js",
  nivel: "Principiante",
  activo: true
}

curso.nombre
Object.keys(curso)
```

Prueba cambiar `curso.activo = false` y vuelve a consultar `curso`.

## Filtrado

```javascript
const lecciones = [
  { titulo: "REPL", completada: true },
  { titulo: "npm", completada: false },
  { titulo: "Módulos", completada: true }
];

lecciones.filter(leccion => leccion.completada)
```

El resultado contiene solamente las lecciones completadas.

---

# Comandos especiales del REPL

Los comandos que comienzan con punto **no son funciones JavaScript**: son órdenes especiales del entorno interactivo.

| Comando | Función |
|---|---|
| `.help` | Muestra ayuda de los comandos REPL. |
| `.exit` | Cierra la sesión. |
| `.clear` | Reinicia el contexto de evaluación de la sesión. |
| `.break` | Cancela una expresión incompleta. |
| `.save archivo.js` | Guarda la entrada de la sesión en un archivo. |
| `.load archivo.js` | Carga y evalúa un archivo JavaScript. |
| `.editor` | Abre el modo de edición multilínea. |

## Ejemplo de `.save`

```javascript
const mensaje = "Aprendiendo REPL"
mensaje.toUpperCase()
```

Después escribe:

```text
.save practica-repl.js
```

El archivo se guarda respecto al directorio de trabajo actual. Revisa su contenido antes de usarlo como programa independiente: el historial puede incluir expresiones de prueba.

## Ejemplo de `.load`

Primero crea un archivo `saludo.js`:

```javascript
function bienvenida(nombre) {
  return `Hola, ${nombre}`;
}
```

En REPL escribe:

```text
.load saludo.js
```

Luego:

```javascript
bienvenida("Lorena")
```

## Modo `.editor`

```text
.editor
```

Escribe varias líneas de JavaScript. En la interfaz habitual del REPL, **Ctrl+D** ejecuta el bloque y **Ctrl+C** cancela la edición. Consulta `.help` si tu versión muestra instrucciones distintas.

---

# Historial, autocompletado y multilínea

- **Flecha arriba/abajo:** recupera entradas anteriores.
- **Tab:** puede sugerir o completar nombres y propiedades.
- **Expresiones incompletas:** REPL suele mostrar un indicador de continuación hasta que cierres llaves, paréntesis o cadenas.
- **`.break`:** permite abandonar una entrada incompleta.

Prueba:

```javascript
function doble(numero) {
  return numero * 2;
}
```

No necesitas escribir toda la función en una sola línea.

---

# Variables y módulos disponibles

Node.js proporciona objetos como `process`, `console` y `Buffer` en su entorno de ejecución.

```javascript
process.version
process.platform
process.cwd()
Buffer.from("Hola").toString("hex")
```

Para explorar un módulo integrado, puedes usar:

```javascript
const os = require("node:os")
os.platform()
os.cpus().length
```

**Nota importante:** el REPL interactivo tradicional permite `require()` para experimentar con módulos CommonJS. Esto no significa que `require()` funcione automáticamente dentro de cualquier archivo configurado como ES Module (`"type": "module"`). En esos archivos se utiliza habitualmente `import`.

Para experimentar con importación dinámica:

```javascript
const moduloOS = await import("node:os")
moduloOS.platform()
```

---

# Promesas y `await` interactivo

En versiones modernas de Node.js, el REPL estándar admite **`await` de nivel superior**.

```javascript
const esperar = ms => new Promise(resolve => setTimeout(resolve, ms))
await esperar(500)
"Medio segundo después"
```

Prueba una operación asíncrona real con un módulo nativo:

```javascript
const fs = await import("node:fs/promises")
await fs.writeFile("nota-repl.txt", "Aprendí REPL", "utf8")
await fs.readFile("nota-repl.txt", "utf8")
```

Resultado de la lectura: `'Aprendí REPL'`.

**Advertencia:** este ejemplo crea un archivo en el directorio de trabajo actual. Comprueba `process.cwd()` antes de ejecutarlo. Si estás trabajando en un repositorio importante, hazlo en una carpeta de prácticas.

---

# Diferencias entre REPL, archivo `.js` y consola del navegador

| Característica | REPL de Node.js | `node app.js` | Consola del navegador |
|---|---|---|---|
| Ejecución interactiva | Sí | No, ejecuta un programa | Sí |
| Requiere guardar archivo | No | Sí | No |
| Acceso a APIs nativas de Node | Sí | Sí | No |
| Acceso directo al DOM de una página | No | No | Sí |
| Ideal para | Experimentos rápidos | Aplicaciones y scripts | Depuración frontend |

REPL **no reemplaza** un proyecto organizado con archivos, módulos y pruebas. Úsalo para investigar comportamientos antes de escribir una implementación mantenible.

---

# Analogías del mundo real

### 1. La calculadora de bolsillo 🧮

REPL se parece a una calculadora: introduces una operación y ves el resultado inmediatamente. Un archivo `.js`, en cambio, se parece a una hoja de instrucciones preparada para ejecutar muchas operaciones de forma repetible.

### 2. La mesa de pruebas del taller 🔧

Antes de instalar una pieza en una máquina completa, un técnico la prueba de manera aislada. REPL permite probar pequeñas funciones antes de integrarlas en la aplicación.

---

# Diagrama de flujo del REPL

```text
           [Iniciar: node]
                  |
                  v
         [READ: leer entrada]
                  |
                  v
       [EVAL: ejecutar JavaScript]
                  |
                  v
       [PRINT: mostrar resultado]
                  |
                  v
       [LOOP: esperar otra entrada]
                  |
             ¿.exit?
             /    \
           No      Sí
           |        |
           +----> [Salir]
           |
           +------> READ
```

---

# Buenas prácticas y errores comunes

## ✅ Buenas prácticas

- Usa REPL para explorar funciones pequeñas, no para mantener una aplicación completa.
- Comprueba tu versión con `node -v` cuando un ejemplo dependa de características recientes.
- Anota en un `.md` las expresiones que funcionen y el motivo.
- Usa carpetas de prueba cuando ejecutes operaciones sobre archivos.
- Convierte los experimentos útiles en funciones reutilizables y pruebas automatizadas.

## ❌ Errores comunes

### 1. Escribir `node app.js` dentro del REPL

`node app.js` es un comando de terminal, no una expresión JavaScript. Primero sal con `.exit` y ejecútalo en PowerShell.

### 2. Confundir `undefined` con una excepción

`undefined` puede ser el resultado normal de una declaración. Un error real normalmente incluye un tipo como `ReferenceError`, `TypeError` o `SyntaxError`.

### 3. Volver a declarar una variable `const`

```javascript
const numero = 10
const numero = 20 // Error: identificador ya declarado
```

Usa otro nombre o reinicia el contexto.

### 4. Creer que `document` existe en Node.js

El objeto `document` pertenece al DOM del navegador; no está disponible automáticamente en el REPL de Node.js.

### 5. Guardar datos sensibles en el historial

Evita introducir contraseñas, claves de API y tokens reales. Las entradas de REPL pueden conservarse en el historial local.

---

# Laboratorio guiado: explorador de datos de cursos

**Objetivo:** practicar expresiones, arreglos, objetos, filtros y cálculos usando REPL.

## Paso 1. Preparar la terminal

Crea una carpeta de prácticas y ábrela en VS Code:

```powershell
mkdir practica-repl
cd practica-repl
node
```

## Paso 2. Crear datos simulados

```javascript
const cursos = [
  { id: 1, nombre: "Node.js", lecciones: 26, completadas: 5 },
  { id: 2, nombre: "JavaScript", lecciones: 20, completadas: 20 },
  { id: 3, nombre: "HTML", lecciones: 15, completadas: 10 }
]
```

## Paso 3. Contar cursos

```javascript
cursos.length
```

Resultado: `3`.

## Paso 4. Buscar un curso

```javascript
cursos.find(curso => curso.id === 1)
```

## Paso 5. Calcular porcentaje

```javascript
const porcentaje = curso =>
  curso.lecciones === 0 ? 0 : Math.round(curso.completadas / curso.lecciones * 100);

porcentaje(cursos[0])
```

Resultado: `19` (redondeado).

## Paso 6. Filtrar cursos finalizados

```javascript
cursos.filter(curso => curso.completadas === curso.lecciones)
```

Resultado: el curso de JavaScript.

## Paso 7. Obtener resumen

```javascript
cursos.map(curso => ({
  nombre: curso.nombre,
  progreso: `${porcentaje(curso)}%`
}))
```

## Paso 8. Guardar tu sesión

```text
.save practica-catalogo.js
```

Revisa el archivo generado, conserva las expresiones útiles y documenta tus resultados.

---

# Proyecto integrador — Prototipo interactivo de catálogo educativo

**Contexto:** antes de desarrollar una API REST, necesitamos comprobar que nuestra lógica para administrar cursos y progreso funciona.

## Requisitos funcionales

1. Mantener una colección de cursos en memoria.
2. Agregar cursos con `id`, `nombre` y `lecciones`.
3. Buscar un curso por su identificador.
4. Actualizar el número de lecciones completadas.
5. Calcular el porcentaje de avance.
6. Listar los cursos finalizados.
7. Evitar valores negativos y avances mayores que el total.

## Implementación de referencia

Copia el siguiente bloque en `.editor` o en un archivo `catalogo.js` para cargarlo con `.load`:

```javascript
const catalogo = [];

function agregarCurso(id, nombre, lecciones) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("El ID debe ser un entero positivo");
  }
  if (!nombre || typeof nombre !== "string") {
    throw new Error("El nombre es obligatorio");
  }
  if (!Number.isInteger(lecciones) || lecciones <= 0) {
    throw new Error("Las lecciones deben ser un entero positivo");
  }
  if (catalogo.some(curso => curso.id === id)) {
    throw new Error("El ID ya existe");
  }

  const curso = { id, nombre, lecciones, completadas: 0 };
  catalogo.push(curso);
  return curso;
}

function registrarAvance(id, completadas) {
  const curso = catalogo.find(item => item.id === id);
  if (!curso) throw new Error("Curso no encontrado");
  if (!Number.isInteger(completadas) ||
      completadas < 0 ||
      completadas > curso.lecciones) {
    throw new Error("Avance fuera del rango permitido");
  }

  curso.completadas = completadas;
  return curso;
}

function calcularProgreso(curso) {
  return Math.round(curso.completadas / curso.lecciones * 100);
}

function cursosFinalizados() {
  return catalogo.filter(curso =>
    curso.completadas === curso.lecciones
  );
}
```

## Prueba del proyecto

```javascript
agregarCurso(1, "Node.js", 26)
agregarCurso(2, "JavaScript", 20)
registrarAvance(1, 13)
registrarAvance(2, 20)
calcularProgreso(catalogo[0])
cursosFinalizados()
```

**Resultados esperados:**

- El avance de Node.js es `50`.
- JavaScript aparece en la lista de cursos finalizados.
- Un ID duplicado genera un error controlado.
- Un avance mayor al total genera un error controlado.

## ¿Cómo se integra en CURSO_DESARROLLO_WEB?

Este proyecto es un **prototipo en memoria**, no una base de datos. En módulos posteriores podremos trasladar estas funciones a servicios backend, conectarlas con MySQL o PostgreSQL y exponerlas mediante rutas HTTP. No modifica tu plataforma actual.

---

# Ejercicios

## Nivel 1 — Básico

1. Inicia el REPL.
2. Calcula `15 * 4`.
3. Declara una variable con el nombre de tu plataforma.
4. Convierte ese nombre a mayúsculas.
5. Consulta la versión de Node.js con `process.version`.
6. Cierra el REPL correctamente.

## Nivel 2 — Intermedio

1. Crea un arreglo de cinco temas de Node.js.
2. Filtra los temas cuyo nombre tenga más de seis caracteres.
3. Crea una función que reciba el total de clases y las clases completadas.
4. Devuelve el porcentaje de avance con dos decimales.
5. Prueba qué ocurre cuando el total es cero y resuelve ese caso.

## Nivel 3 — Avanzado

1. Amplía el catálogo del proyecto integrador para permitir eliminar cursos.
2. Impide eliminar un curso que no exista sin mostrar un mensaje descriptivo.
3. Agrega una función para obtener el promedio de progreso de todos los cursos.
4. Define el resultado del promedio cuando el catálogo esté vacío.
5. Documenta las pruebas realizadas y sus resultados.

---

# Solucionario paso a paso

## Solución Nivel 1

```javascript
15 * 4
const plataforma = "CURSO_DESARROLLO_WEB"
plataforma.toUpperCase()
process.version
```

Para salir, escribe `.exit`. El resultado de la multiplicación es `60`.

## Solución Nivel 2

```javascript
const temas = ["REPL", "Express", "Promesas", "HTTP", "Módulos"];

const temasLargos = temas.filter(tema => tema.length > 6);

function avance(completadas, total) {
  if (!Number.isFinite(completadas) ||
      !Number.isFinite(total) ||
      total <= 0 ||
      completadas < 0 ||
      completadas > total) {
    return null;
  }
  return Number(((completadas / total) * 100).toFixed(2));
}

temasLargos
avance(7, 12)
avance(3, 0)
```

El porcentaje de `7` sobre `12` es aproximadamente `58.33`. Para un total de `0`, la función devuelve `null`, que en este ejercicio significa que no puede calcularse un porcentaje válido.

## Solución Nivel 3

Continúa desde el proyecto integrador:

```javascript
function eliminarCurso(id) {
  const indice = catalogo.findIndex(curso => curso.id === id);
  if (indice === -1) {
    throw new Error("No existe un curso con ese ID");
  }
  return catalogo.splice(indice, 1)[0];
}

function promedioProgreso() {
  if (catalogo.length === 0) return 0;
  const suma = catalogo.reduce(
    (total, curso) => total + calcularProgreso(curso), 0
  );
  return Number((suma / catalogo.length).toFixed(2));
}
```

Pruebas sugeridas:

```javascript
promedioProgreso()
eliminarCurso(1)
promedioProgreso()
```

Prueba también `eliminarCurso(999)` y explica el error. En este diseño, un catálogo vacío tiene promedio `0` por convención; otra aplicación podría representar la ausencia de datos con `null`.

---

# Evaluación de conocimientos

Responde sin consultar la guía:

1. ¿Qué significa cada letra de REPL?
2. ¿En qué se diferencia REPL de ejecutar `node app.js`?
3. ¿Qué comando permite ver la ayuda?
4. ¿Qué hace `.load archivo.js`?
5. ¿Qué hace `.save archivo.js`?
6. ¿Por qué `undefined` no implica necesariamente un error?
7. ¿Cómo consultarías la versión de Node.js dentro de REPL?
8. ¿Qué sucede al declarar dos veces la misma variable con `const`?
9. ¿Para qué sirve `await` en una operación asíncrona?
10. ¿Por qué conviene trasladar un prototipo REPL a archivos y pruebas?

**Criterio de aprobación:** responde correctamente al menos 8 de 10 preguntas y completa el proyecto con sus casos de error.

### Respuestas breves de comprobación

1. Read, Eval, Print, Loop.
2. REPL ejecuta entradas interactivas; `node app.js` ejecuta un archivo.
3. `.help`.
4. Carga y evalúa el contenido del archivo.
5. Guarda las entradas de la sesión en un archivo.
6. Algunas expresiones o declaraciones no producen un valor que mostrar.
7. `process.version`.
8. Se produce un error de declaración duplicada en el mismo contexto.
9. Permite esperar el resultado de una promesa.
10. Para organizar, reproducir, probar y mantener el código.

---

# Hoja de trucos (Cheatsheet)

| Comando o expresión | Propósito |
|---|---|
| `node` | Inicia el REPL. |
| `.help` | Muestra la ayuda. |
| `.exit` | Cierra el REPL. |
| `.break` | Cancela una entrada incompleta. |
| `.clear` | Reinicia el contexto. |
| `.editor` | Abre edición multilínea. |
| `.save archivo.js` | Guarda entradas de la sesión. |
| `.load archivo.js` | Carga y ejecuta un archivo. |
| `process.version` | Consulta la versión de Node.js. |
| `process.cwd()` | Muestra el directorio de trabajo. |
| `require("node:os")` | Carga un módulo nativo desde el REPL CommonJS. |
| `await import("node:fs/promises")` | Importa dinámicamente un módulo. |
| `Ctrl+C` dos veces | Sale del REPL en la interfaz habitual. |

---

# Resumen técnico

- **REPL** permite experimentar con JavaScript en Node.js sin crear previamente archivos.
- El ciclo **Read–Eval–Print–Loop** lee, evalúa, muestra y repite.
- Los comandos con punto administran la sesión interactiva.
- Puedes probar funciones, objetos, arreglos, módulos nativos y operaciones asíncronas.
- REPL no tiene el DOM del navegador y no reemplaza una aplicación estructurada.
- El proyecto integrador muestra cómo validar la lógica de un catálogo educativo antes de convertirlo en un backend real.

---

# Checklist de aprendizaje

- [ ] Sé iniciar y cerrar REPL.
- [ ] Comprendo el ciclo Read–Eval–Print–Loop.
- [ ] Puedo usar variables, funciones, objetos y arreglos.
- [ ] Conozco los comandos especiales más importantes.
- [ ] Sé usar `.load` y `.save`.
- [ ] Distingo REPL, Node.js ejecutando archivos y la consola del navegador.
- [ ] Completé los ejercicios de tres niveles.
- [ ] Ejecuté y comprobé el proyecto integrador.
- [ ] Documenté los errores y sus soluciones.

**Siguiente tema sugerido:** npm y `package.json`, o el siguiente tema que corresponda en el índice definitivo del Nivel 1.
