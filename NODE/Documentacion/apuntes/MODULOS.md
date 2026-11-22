# GUÍA COMPLETA — Módulos en Node.js

> **Nivel:** Principiante a avanzado (Junior → Semi Senior)  
> **Módulo:** Nivel 1 — Fundamentos de Node.js  
> **Objetivo:** Comprender cómo dividir aplicaciones Node.js en módulos reutilizables, dominar CommonJS y ECMAScript Modules (ESM), importar módulos nativos y externos, resolver rutas, identificar errores frecuentes y organizar el código de `CURSO_DESARROLLO_WEB`.  
> **Requisitos:** JavaScript básico, terminal, Node.js instalado y VS Code.  
> **Modalidad:** Offline. Todos los laboratorios y el proyecto principal utilizan únicamente Node.js nativo.

---

# Definición

Un **módulo** es un archivo o unidad de código que encapsula una responsabilidad y permite exponer funciones, constantes, clases u objetos para utilizarlos desde otros archivos. En Node.js, los módulos facilitan dividir una aplicación en piezas pequeñas, reutilizables y comprobables.

Ejemplo de organización:

```text
mi-app/
├── package.json
├── app.js
├── matematicas.js
└── usuarios.js
```

Sin módulos, una aplicación puede terminar con cientos o miles de líneas en un único archivo. Con módulos, cada archivo puede tener un propósito definido.

**Conceptos importantes:**
- **Exportar:** hacer disponible un valor para otros módulos.
- **Importar:** utilizar desde otro archivo un valor exportado.
- **Encapsular:** mantener los detalles internos fuera de la interfaz pública.
- **Dependencia:** módulo o paquete que otro módulo necesita.
- **API pública del módulo:** conjunto de funciones, objetos o clases que exporta.

---

# Principales usos

### 1. Organizar proyectos grandes 🗂️

Separar rutas HTTP, lógica de negocio, validaciones y acceso a datos.

### 2. Reutilizar código ♻️

Utilizar la misma función de validación en varios servicios sin copiarla.

### 3. Facilitar las pruebas 🧪

Probar `calcularProgreso()` sin iniciar un servidor o conectarse a una base de datos.

### 4. Mejorar el mantenimiento 🔧

Modificar una regla en un archivo sin editar todas las pantallas o rutas.

### 5. Incorporar herramientas externas 📦

Importar paquetes npm como Express o controladores de bases de datos una vez instalados.

---

# Tipos de módulos en Node.js

| Tipo | Ejemplo | Procedencia |
|---|---|---|
| Nativo o integrado | `node:fs`, `node:path` | Viene con Node.js |
| Local | `./servicios/cursos.js` | Lo escribes tú |
| Externo | `express` | Paquete instalado, habitualmente con npm |

**Importante:** «nativo/local/externo» describe el origen. **CommonJS/ESM** describe el sistema de módulos. Son clasificaciones distintas.

---

# CommonJS (`require` y `module.exports`)

CommonJS es un sistema histórico de módulos ampliamente utilizado en Node.js.

## 1. Exportar una función

Archivo `operaciones.cjs`:

```javascript
function sumar(a, b) {
  return a + b;
}

module.exports = { sumar };
```

Archivo `app.cjs`:

```javascript
const { sumar } = require("./operaciones.cjs");

console.log(sumar(4, 6)); // 10
```

Ejecuta:

```powershell
node app.cjs
```

### Explicación

1. `sumar` se define dentro del módulo.
2. `module.exports` determina el valor que otro archivo recibirá.
3. `require("./operaciones.cjs")` carga el módulo local.
4. La desestructuración `{ sumar }` obtiene la propiedad exportada.
5. `console.log()` imprime el resultado.

## 2. Exportar directamente una función

```javascript
// saludar.cjs
module.exports = function saludar(nombre) {
  return `Hola, ${nombre}`;
};
```

```javascript
// app.cjs
const saludar = require("./saludar.cjs");
console.log(saludar("Ana"));
```

## 3. `exports` frente a `module.exports`

En un módulo CommonJS, `exports` comienza como una referencia al mismo objeto que `module.exports`.

Esto funciona:

```javascript
exports.saludar = nombre => `Hola ${nombre}`;
```

Esto **no** cambia el valor exportado:

```javascript
exports = { saludar: nombre => `Hola ${nombre}` };
```

Para reemplazar completamente el valor exportado, utiliza:

```javascript
module.exports = { saludar: nombre => `Hola ${nombre}` };
```

---

# ECMAScript Modules (ESM): `import` y `export`

ESM es el sistema estándar de módulos de JavaScript y una opción recomendable para proyectos nuevos.

## Paso 1. Configurar el proyecto

Archivo `package.json`:

```json
{
  "name": "practica-modulos",
  "version": "1.0.0",
  "private": true,
  "type": "module"
}
```

La propiedad `"type": "module"` hace que los archivos `.js` de ese ámbito se interpreten como ESM.

## Paso 2. Crear un módulo

Archivo `matematicas.js`:

```javascript
export function sumar(a, b) {
  return a + b;
}

export const PI = 3.14159;
```

## Paso 3. Importarlo

Archivo `app.js`:

```javascript
import { sumar, PI } from "./matematicas.js";

console.log(sumar(5, 7)); // 12
console.log(PI);
```

Ejecuta:

```powershell
node app.js
```

**Atención:** en importaciones ESM locales de Node.js normalmente debes escribir la extensión del archivo (`.js`, `.mjs`, etc.).

---

# Exportaciones nombradas y por defecto

## Exportaciones nombradas

```javascript
// usuario.js
export const rol = "estudiante";

export function crearUsuario(nombre) {
  return { nombre, rol };
}
```

```javascript
// app.js
import { rol, crearUsuario } from "./usuario.js";
console.log(crearUsuario("Laura"));
```

Puedes renombrar al importar:

```javascript
import { crearUsuario as registrar } from "./usuario.js";
```

## Exportación por defecto

```javascript
// formatear.js
export default function formatear(texto) {
  return texto.trim().toUpperCase();
}
```

```javascript
// app.js
import formatearTexto from "./formatear.js";
console.log(formatearTexto("  node js  "));
```

El nombre de una importación por defecto lo elige quien importa.

## Importar todo como un espacio de nombres

```javascript
import * as operaciones from "./matematicas.js";

console.log(operaciones.sumar(2, 3));
```

**Regla:** un módulo ESM puede tener múltiples exportaciones nombradas, pero como máximo una exportación por defecto.

---

# Diferencias entre CommonJS y ESM

| Característica | CommonJS | ESM |
|---|---|---|
| Importación habitual | `require()` | `import` |
| Exportación habitual | `module.exports` | `export` |
| Extensión inequívoca | `.cjs` | `.mjs` |
| `.js` | Depende de la configuración del paquete | Depende de la configuración del paquete |
| Carga | Tradicionalmente síncrona con `require` | Enlace y evaluación bajo semántica ESM |
| Importación dinámica | `import()` disponible | `import()` disponible |
| Top-level `await` | No en CommonJS | Sí en ESM |
| `__dirname` | Disponible | Usar alternativas ESM |
| `require` global del módulo | Disponible | No disponible directamente |

**¿Cuál elegir?** Para nuestros ejemplos nuevos utilizaremos **ESM** con `"type": "module"`. También aprenderemos CommonJS porque aparece en proyectos existentes, bibliotecas y documentación.

---

# `package.json` y extensiones

Node.js interpreta módulos según la extensión y la configuración del paquete:

- `.mjs`: ESM.
- `.cjs`: CommonJS.
- `.js`: depende del contexto de paquete y de las reglas de detección aplicables a la versión de Node.js.

Para evitar ambigüedades, define explícitamente `"type": "module"` o `"type": "commonjs"` en `package.json`.

Ejemplo de proyecto:

```text
proyecto/
├── package.json        # "type": "module"
├── app.js              # ESM
├── utilidad.mjs        # ESM
└── legado.cjs          # CommonJS
```

**No confundas:** `npm init -y` crea un archivo `package.json`, pero no garantiza por sí mismo que tu proyecto quede configurado como ESM. Verifica o agrega la propiedad `"type"`.

---

# Resolución de módulos y rutas

## 1. Ruta relativa

```javascript
import { sumar } from "./utils/matematicas.js";
```

`./` indica que la ruta comienza en la carpeta del archivo que importa.

```javascript
import { validar } from "../validaciones/usuario.js";
```

`../` sube una carpeta.

## 2. Paquete externo

```javascript
import express from "express";
```

Este ejemplo requiere que el paquete `express` esté instalado en el proyecto.

## 3. Módulo nativo

```javascript
import { readFile } from "node:fs/promises";
```

El prefijo `node:` indica que se trata de un módulo integrado de Node.js.

## 4. Errores de resolución

- Ruta relativa incorrecta.
- Extensión omitida en una importación ESM local.
- Paquete npm no instalado.
- Nombre de archivo escrito con distinta capitalización.
- Importación de un valor que no fue exportado.

---

# Módulos nativos útiles

## `node:os`

```javascript
import os from "node:os";

console.log(os.platform());
console.log(os.arch());
```

## `node:path`

```javascript
import path from "node:path";

const ruta = path.join("datos", "cursos.json");
console.log(ruta);
```

`path.join()` construye rutas según las reglas de la plataforma. En Windows suele utilizar `\` como separador.

## `node:fs/promises`

```javascript
import { writeFile, readFile } from "node:fs/promises";

await writeFile("saludo.txt", "Hola Node.js", "utf8");
const texto = await readFile("saludo.txt", "utf8");
console.log(texto);
```

Este ejemplo crea un archivo local; ejecútalo en una carpeta de práctica.

---

# Módulos externos y npm

Los módulos externos se distribuyen como paquetes. Por ejemplo, Express no viene incluido con Node.js.

Con Internet disponible:

```powershell
npm init -y
npm install express
```

Después:

```javascript
import express from "express";
```

Para estudiar sin conexión, debes instalar los paquetes con anticipación y conservar las dependencias necesarias. **Los laboratorios principales de esta guía no requieren npm install.**

Un paquete puede publicar interfaces CommonJS, ESM o ambas; revisa su documentación para importarlo correctamente.

---

# Importación dinámica (`import()`)

La importación estática se declara normalmente al inicio del módulo:

```javascript
import { sumar } from "./matematicas.js";
```

La importación dinámica se evalúa en tiempo de ejecución y devuelve una promesa:

```javascript
const modulo = await import("./matematicas.js");
console.log(modulo.sumar(3, 4));
```

## ¿Cuándo usarla?

- Cuando una funcionalidad es opcional.
- Cuando necesitas cargar un módulo bajo una condición.
- Cuando quieres diferir el trabajo de cargar código.

```javascript
const usarReporte = true;

if (usarReporte) {
  const { generarReporte } = await import("./reporte.js");
  generarReporte();
}
```

**Nota:** para ejecutar este ejemplo debes crear `reporte.js` con una exportación `generarReporte`. La importación dinámica no elimina la necesidad de que el archivo exista.

---

# Caché de módulos y estado compartido

Node.js normalmente reutiliza instancias de módulos cargados, aunque los detalles difieren entre CommonJS y ESM.

Archivo `contador.js`:

```javascript
let valor = 0;

export function incrementar() {
  valor += 1;
  return valor;
}

export function consultar() {
  return valor;
}
```

Archivo `app.js`:

```javascript
import { incrementar } from "./contador.js";
import { consultar } from "./contador.js";

console.log(incrementar()); // 1
console.log(incrementar()); // 2
console.log(consultar());   // 2
```

Ambas importaciones comparten el estado de la misma instancia del módulo.

**Precaución:** compartir estado mutable globalmente puede complicar las pruebas y producir comportamientos inesperados. En aplicaciones reales, conviene definir claramente quién administra ese estado.

---

# Rutas del archivo actual: CommonJS y ESM

## CommonJS

```javascript
// rutas.cjs
console.log(__filename);
console.log(__dirname);
```

## ESM

En ESM puedes utilizar `import.meta.url`:

```javascript
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const archivoActual = fileURLToPath(import.meta.url);
const carpetaActual = dirname(archivoActual);

console.log(archivoActual);
console.log(carpetaActual);
```

En versiones modernas de Node.js también existen propiedades como `import.meta.dirname` e `import.meta.filename`, pero el ejemplo con `fileURLToPath()` resulta útil para entender el mecanismo y mantener compatibilidad con más versiones.

**Diferencia clave:** `process.cwd()` devuelve el directorio de trabajo desde el cual se inició el proceso, que no necesariamente coincide con la carpeta del módulo.

---

# Dependencias circulares

Una dependencia circular ocurre cuando:

```text
A importa B
B importa A
```

En ciertos casos pueden observarse valores aún no inicializados o resultados inesperados, especialmente si ambos módulos ejecutan lógica inmediatamente durante su carga.

**Ejemplo conceptual:**

```text
cursos.js  ──importa──> estudiantes.js
    ^                         |
    |                         |
    └────────importa──────────┘
```

**Cómo reducir el problema:**
1. Identifica la responsabilidad compartida.
2. Extrae esa responsabilidad a un tercer módulo.
3. Haz que ambos módulos dependan del tercero, no uno del otro.

```text
cursos.js ──> reglas.js <── estudiantes.js
```

---

# Diseño modular y separación de responsabilidades

Una estructura sencilla para una API educativa:

```text
src/
├── app.js
├── rutas/
│   └── cursos.routes.js
├── controladores/
│   └── cursos.controller.js
├── servicios/
│   └── cursos.service.js
├── repositorios/
│   └── cursos.repository.js
└── utilidades/
    └── validaciones.js
```

- **Rutas:** asocian solicitudes con operaciones.
- **Controladores:** interpretan entradas y preparan respuestas.
- **Servicios:** contienen reglas de negocio.
- **Repositorios:** encapsulan el acceso a datos.
- **Utilidades:** funciones reutilizables que no dependen de la lógica principal.

No necesitas aplicar todas estas capas a un script pequeño. La arquitectura debe responder a la complejidad real.

---

# Analogías del mundo real

### 1. Piezas de LEGO 🧱

Cada módulo es una pieza con conexiones definidas. Puedes sustituir una pieza sin reconstruir todo el modelo, siempre que mantengas las conexiones esperadas.

### 2. Departamentos de una empresa 🏢

Cada departamento tiene una responsabilidad: ventas, inventario, contabilidad. Un módulo bien diseñado funciona de forma parecida y ofrece servicios claros a otros módulos.

### 3. Biblioteca de herramientas 🧰

No necesitas fabricar un destornillador cada vez que montas algo. Un módulo reusable proporciona una herramienta que puedes utilizar desde varios lugares.

---

# Diagrama de flujo de importación

```text
            [app.js]
                |
                v
   [import { listarCursos } ...]
                |
                v
     [Resolver ruta del módulo]
                |
          ¿Existe y carga?
           /           \
         No             Sí
         |              |
 [Error de módulo]      v
                  [Evaluar módulo]
                         |
                         v
                 [Obtener exportación]
                         |
                         v
                 [Ejecutar función]
                         |
                         v
                   [Resultado]
```

**Nota:** este diagrama es conceptual; la resolución, el enlace y la evaluación real de ESM tienen reglas más específicas.

---

# Buenas prácticas y errores comunes

## ✅ Buenas prácticas

- Prefiere nombres de archivos descriptivos: `cursos.service.js`, `validaciones.js`.
- Mantén una responsabilidad principal por módulo.
- Exporta solo lo que otros archivos realmente necesitan.
- Evita efectos secundarios innecesarios al importar.
- Usa `node:` para identificar claramente los módulos integrados.
- En ESM local, escribe las extensiones de archivo.
- Utiliza rutas relativas correctas y prueba el proyecto en Windows y, cuando sea posible, Linux.
- Configura explícitamente `"type": "module"` para los proyectos ESM.
- Mantén las credenciales fuera del código y del repositorio.
- Escribe pruebas para las funciones de negocio.

## ❌ Errores comunes

### 1. `require is not defined in ES module scope`

Causa: ejecutar `require()` directamente dentro de un archivo ESM.

Solución habitual:

```javascript
import os from "node:os";
```

O conserva código CommonJS en un archivo `.cjs`.

### 2. `Cannot find module` o `ERR_MODULE_NOT_FOUND`

Causas: ruta incorrecta, archivo inexistente, extensión omitida o dependencia no instalada.

### 3. `does not provide an export named ...`

Causa: importar una exportación nombrada que no existe.

### 4. Confundir `exports` con `module.exports`

Reasignar `exports = ...` no sustituye la exportación de CommonJS.

### 5. Ejecutar un módulo que no hace nada visible

Un archivo que solo exporta funciones puede terminar sin imprimir nada. Eso es normal: debes importarlo y llamar a sus funciones.

---

# Laboratorio guiado paso a paso — Crear módulos ESM

**Objetivo:** separar cálculos de progreso y validaciones de la aplicación principal.

## Paso 1. Crear el proyecto

En PowerShell:

```powershell
mkdir laboratorio-modulos
cd laboratorio-modulos
npm init -y
```

Edita `package.json` y agrega `"type": "module"`:

```json
{
  "name": "laboratorio-modulos",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "node app.js",
    "test": "node --test"
  }
}
```

**Nota:** `npm init -y` funciona localmente si npm ya está instalado; no descarga dependencias.

## Paso 2. Crear la estructura

```text
laboratorio-modulos/
├── package.json
├── app.js
└── src/
    ├── progreso.js
    └── validaciones.js
```

## Paso 3. Crear `src/validaciones.js`

```javascript
export function validarEnteroNoNegativo(valor, nombre) {
  if (!Number.isInteger(valor) || valor < 0) {
    throw new TypeError(`${nombre} debe ser un entero no negativo`);
  }
}
```

## Paso 4. Crear `src/progreso.js`

```javascript
import { validarEnteroNoNegativo } from "./validaciones.js";

export function calcularPorcentaje(completadas, total) {
  validarEnteroNoNegativo(completadas, "completadas");
  validarEnteroNoNegativo(total, "total");

  if (total === 0) return 0;
  if (completadas > total) {
    throw new RangeError("El avance no puede superar el total");
  }

  return Number(((completadas / total) * 100).toFixed(2));
}
```

## Paso 5. Crear `app.js`

```javascript
import { calcularPorcentaje } from "./src/progreso.js";

console.log("Progreso del curso:", calcularPorcentaje(7, 10), "%");
```

## Paso 6. Ejecutar

```powershell
npm start
```

Salida esperada:

```text
Progreso del curso: 70 %
```

## Paso 7. Probar un error

Modifica temporalmente:

```javascript
console.log(calcularPorcentaje(11, 10));
```

Se producirá un `RangeError`. Después restaura la llamada válida.

## Paso 8. Escribir una prueba

Archivo `src/progreso.test.js`:

```javascript
import test from "node:test";
import assert from "node:assert/strict";
import { calcularPorcentaje } from "./progreso.js";

test("calcula el progreso", () => {
  assert.equal(calcularPorcentaje(7, 10), 70);
});

test("evita avances superiores al total", () => {
  assert.throws(
    () => calcularPorcentaje(11, 10),
    RangeError
  );
});

test("devuelve cero cuando no hay lecciones", () => {
  assert.equal(calcularPorcentaje(0, 0), 0);
});
```

Ejecuta:

```powershell
npm test
```

**Criterio de aceptación:** las tres pruebas deben pasar y `npm start` debe mostrar el porcentaje correcto.

---

# Proyecto integrador — Gestor modular de cursos de CURSO_DESARROLLO_WEB

Vamos a construir una aplicación de consola que permita registrar cursos, listarlos, actualizar el progreso y obtener estadísticas. Se organiza por módulos y guarda datos en un archivo JSON.

## Estructura

```text
gestor-modular-cursos/
├── package.json
├── app.js
├── datos/
│   └── cursos.json       # Se crea al guardar
└── src/
    ├── almacenamiento.js
    ├── cursos.js
    └── estadisticas.js
```

## 1. `package.json`

```json
{
  "name": "gestor-modular-cursos",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "node app.js"
  }
}
```

## 2. `src/almacenamiento.js`

```javascript
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const carpetaActual = dirname(fileURLToPath(import.meta.url));
const archivo = join(carpetaActual, "..", "datos", "cursos.json");

export async function leerCursos() {
  try {
    const contenido = await readFile(archivo, "utf8");
    return JSON.parse(contenido);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

export async function guardarCursos(cursos) {
  await mkdir(dirname(archivo), { recursive: true });
  await writeFile(archivo, JSON.stringify(cursos, null, 2), "utf8");
}
```

## 3. `src/cursos.js`

```javascript
import { leerCursos, guardarCursos } from "./almacenamiento.js";

export async function agregarCurso(id, nombre, total) {
  const cursos = await leerCursos();

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("ID inválido");
  }
  if (typeof nombre !== "string" || !nombre.trim()) {
    throw new Error("Nombre obligatorio");
  }
  if (!Number.isInteger(total) || total <= 0) {
    throw new Error("El total debe ser positivo");
  }
  if (cursos.some(curso => curso.id === id)) {
    throw new Error("Ya existe un curso con ese ID");
  }

  const curso = { id, nombre: nombre.trim(), total, completadas: 0 };
  cursos.push(curso);
  await guardarCursos(cursos);
  return curso;
}

export async function listarCursos() {
  return leerCursos();
}

export async function actualizarProgreso(id, completadas) {
  const cursos = await leerCursos();
  const curso = cursos.find(item => item.id === id);

  if (!curso) throw new Error("Curso no encontrado");
  if (!Number.isInteger(completadas) ||
      completadas < 0 ||
      completadas > curso.total) {
    throw new Error("Progreso inválido");
  }

  curso.completadas = completadas;
  await guardarCursos(cursos);
  return curso;
}
```

## 4. `src/estadisticas.js`

```javascript
export function resumenCursos(cursos) {
  const totalCursos = cursos.length;
  const finalizados = cursos.filter(
    curso => curso.completadas === curso.total
  ).length;

  const progresoPromedio = totalCursos === 0
    ? 0
    : Number((
        cursos.reduce(
          (suma, curso) => suma + (curso.completadas / curso.total) * 100,
          0
        ) / totalCursos
      ).toFixed(2));

  return { totalCursos, finalizados, progresoPromedio };
}
```

## 5. `app.js`

```javascript
import {
  agregarCurso,
  listarCursos,
  actualizarProgreso
} from "./src/cursos.js";

import { resumenCursos } from "./src/estadisticas.js";

async function iniciar() {
  const [comando, ...argumentos] = process.argv.slice(2);

  switch (comando) {
    case "agregar": {
      const [id, nombre, total] = argumentos;
      console.log(await agregarCurso(Number(id), nombre, Number(total)));
      break;
    }

    case "listar":
      console.table(await listarCursos());
      break;

    case "avance": {
      const [id, completadas] = argumentos;
      console.log(await actualizarProgreso(Number(id), Number(completadas)));
      break;
    }

    case "resumen":
      console.log(resumenCursos(await listarCursos()));
      break;

    default:
      console.log(
        'Comandos:\n' +
        '  node app.js agregar 1 "Node.js" 26\n' +
        '  node app.js listar\n' +
        '  node app.js avance 1 5\n' +
        '  node app.js resumen'
      );
  }
}

iniciar().catch(error => {
  console.error("Error:", error.message);
  process.exitCode = 1;
});
```

## 6. Ejecutar el proyecto

Desde la carpeta `gestor-modular-cursos`:

```powershell
node app.js agregar 1 "Node.js" 26
node app.js agregar 2 "JavaScript" 20
node app.js listar
node app.js avance 1 13
node app.js resumen
```

**Resultado esperado del resumen:**

```text
{
  totalCursos: 2,
  finalizados: 0,
  progresoPromedio: 25
}
```

El proyecto funciona sin conexión y no necesita dependencias externas.

## 7. Pruebas manuales

1. Intenta agregar un ID duplicado.
2. Intenta registrar un total de lecciones negativo.
3. Intenta actualizar un curso inexistente.
4. Intenta registrar más lecciones completadas que el total.
5. Cierra la terminal, vuelve a ejecutar `listar` y verifica que los datos persisten.

**Limitación consciente:** este es un proyecto educativo con almacenamiento JSON. No implementa bloqueo de escrituras concurrentes, autenticación ni transacciones; esas necesidades se abordarán con bases de datos y arquitectura de servicios.

---

# Ejercicios

## Nivel 1 — Básico

1. Crea un archivo `saludos.js` con dos funciones exportadas.
2. Importa ambas funciones desde `app.js`.
3. Ejecuta el programa con Node.js.
4. Repite el ejemplo usando CommonJS con archivos `.cjs`.
5. Explica por qué el módulo no necesita imprimir nada al ser importado.

## Nivel 2 — Intermedio

1. Crea un módulo `precios.js` que exporte `calcularSubtotal`, `calcularIVA` y `calcularTotal`.
2. Valida que los precios sean números finitos y no negativos.
3. Importa las funciones con alias.
4. Crea pruebas con `node:test`.
5. Explica qué ocurre si omites la extensión `.js` en una importación local ESM.

## Nivel 3 — Avanzado

1. Añade al gestor modular de cursos el comando `eliminar ID`.
2. Crea un módulo `validaciones.js` para reutilizar reglas.
3. Agrega el comando `buscar ID`.
4. Implementa al menos cuatro pruebas automatizadas de funciones puras.
5. Separa lógica de negocio y lectura/escritura de archivos cuando sea posible.
6. Documenta la estructura de dependencias entre módulos.

---

# Solucionario paso a paso

## Solución Nivel 1

Archivo `saludos.js`:

```javascript
export function saludar(nombre) {
  return `Hola, ${nombre}`;
}

export function despedir(nombre) {
  return `Hasta pronto, ${nombre}`;
}
```

Archivo `app.js`:

```javascript
import { saludar, despedir } from "./saludos.js";

console.log(saludar("Ana"));
console.log(despedir("Ana"));
```

Versión CommonJS, `saludos.cjs`:

```javascript
function saludar(nombre) {
  return `Hola, ${nombre}`;
}

function despedir(nombre) {
  return `Hasta pronto, ${nombre}`;
}

module.exports = { saludar, despedir };
```

Archivo `app.cjs`:

```javascript
const { saludar, despedir } = require("./saludos.cjs");
console.log(saludar("Ana"));
console.log(despedir("Ana"));
```

Un módulo puede definir y exportar funciones sin invocarlas; la aplicación decide cuándo utilizarlas.

## Solución Nivel 2

Archivo `precios.js`:

```javascript
function validarPrecio(valor) {
  if (!Number.isFinite(valor) || valor < 0) {
    throw new TypeError("El precio debe ser un número válido no negativo");
  }
}

export function calcularSubtotal(precio, cantidad) {
  validarPrecio(precio);
  if (!Number.isInteger(cantidad) || cantidad < 0) {
    throw new TypeError("Cantidad inválida");
  }
  return precio * cantidad;
}

export function calcularIVA(subtotal, tasa = 0.19) {
  validarPrecio(subtotal);
  validarPrecio(tasa);
  return subtotal * tasa;
}

export function calcularTotal(subtotal, tasa = 0.19) {
  return subtotal + calcularIVA(subtotal, tasa);
}
```

Archivo `app.js`:

```javascript
import {
  calcularSubtotal as subtotal,
  calcularIVA as iva,
  calcularTotal as total
} from "./precios.js";

const base = subtotal(10000, 2);
console.log({ base, impuesto: iva(base), total: total(base) });
```

Archivo `precios.test.js`:

```javascript
import test from "node:test";
import assert from "node:assert/strict";
import { calcularSubtotal, calcularTotal } from "./precios.js";

test("calcula subtotal", () => {
  assert.equal(calcularSubtotal(10000, 2), 20000);
});

test("calcula total", () => {
  assert.equal(calcularTotal(20000), 23800);
});

test("rechaza precio negativo", () => {
  assert.throws(() => calcularSubtotal(-1, 2), TypeError);
});
```

Ejecuta `node --test`. La tasa `0.19` es solo un ejemplo matemático y no constituye asesoría tributaria.

## Solución Nivel 3

Agrega a `src/cursos.js`:

```javascript
export async function eliminarCurso(id) {
  const cursos = await leerCursos();
  const indice = cursos.findIndex(curso => curso.id === id);
  if (indice === -1) throw new Error("Curso no encontrado");

  const [eliminado] = cursos.splice(indice, 1);
  await guardarCursos(cursos);
  return eliminado;
}

export async function buscarCurso(id) {
  const cursos = await leerCursos();
  return cursos.find(curso => curso.id === id) ?? null;
}
```

Después importa estas funciones en `app.js` y agrega dos casos al `switch`:

```javascript
case "buscar":
  console.log(await buscarCurso(Number(argumentos[0])));
  break;

case "eliminar":
  console.log(await eliminarCurso(Number(argumentos[0])));
  break;
```

**Refactorización sugerida:** crea `src/validaciones.js` y mueve allí las comprobaciones de identificadores, nombres, totales y avances. Para las pruebas, extrae las transformaciones de arreglos a funciones puras que no dependan de `fs`.

**Criterio de solución:** cada comando debe mostrar el resultado esperado y fallar con mensajes claros ante entradas inválidas.

---

# Evaluación de conocimientos

Responde sin consultar la guía:

1. ¿Qué es un módulo en Node.js?
2. ¿Cuál es la diferencia entre módulos locales, nativos y externos?
3. ¿Qué hace `module.exports`?
4. ¿En qué se diferencian `require()` e `import`?
5. ¿Para qué sirve `"type": "module"`?
6. ¿Qué extensión identifica inequívocamente un archivo CommonJS?
7. ¿Qué extensión identifica inequívocamente un archivo ESM?
8. ¿Por qué suele escribirse `.js` al importar archivos ESM locales?
9. ¿Qué diferencia existe entre exportación nombrada y por defecto?
10. ¿Qué devuelve `import()` dinámico?
11. ¿Qué representa `process.cwd()`?
12. ¿Qué es una dependencia circular?
13. ¿Por qué es importante separar validación, negocio y persistencia?
14. ¿Qué riesgos presenta un módulo con estado mutable compartido?
15. ¿Cómo comprobarías que un módulo funciona sin iniciar toda la aplicación?

**Criterio de aprobación:** 12 respuestas correctas de 15, laboratorio funcional y proyecto con pruebas manuales.

## Respuestas de comprobación

1. Unidad de código que encapsula y expone funcionalidades.
2. Origen del módulo: propio, integrado o instalado.
3. Define el valor exportado por CommonJS.
4. Pertenecen a sistemas de módulos distintos, con reglas de carga diferentes.
5. Configura archivos `.js` del paquete como ESM.
6. `.cjs`.
7. `.mjs`.
8. Por las reglas de resolución de Node.js.
9. La nombrada se importa por su nombre exportado; la predeterminada admite un nombre local elegido.
10. Una promesa que resuelve al espacio de nombres del módulo.
11. Directorio de trabajo del proceso.
12. Dos o más módulos dependen circularmente entre sí.
13. Reduce acoplamiento y facilita mantenimiento y pruebas.
14. Cambios inesperados entre consumidores y pruebas difíciles de aislar.
15. Con pruebas unitarias y entradas/salidas controladas.

---

# Hoja de trucos (Cheatsheet)

| Sintaxis | Uso |
|---|---|
| `module.exports = valor` | Exportar desde CommonJS |
| `require("./archivo.cjs")` | Importar desde CommonJS |
| `export const x = 1` | Exportación nombrada ESM |
| `export function f() {}` | Exportar función ESM |
| `export default f` | Exportación por defecto ESM |
| `import { x } from "./x.js"` | Importación nombrada ESM |
| `import f from "./f.js"` | Importación por defecto ESM |
| `import * as mod from "./x.js"` | Importar espacio de nombres |
| `await import("./x.js")` | Importación dinámica |
| `import { readFile } from "node:fs/promises"` | Importar módulo nativo |
| `"type": "module"` | Tratar `.js` como ESM en el paquete |
| `.mjs` | Extensión ESM explícita |
| `.cjs` | Extensión CommonJS explícita |
| `import.meta.url` | URL del módulo ESM actual |
| `process.cwd()` | Directorio de trabajo |
| `node --test` | Ejecutar pruebas con el test runner nativo |

---

# Resumen técnico

- **Los módulos** permiten dividir aplicaciones en componentes con responsabilidades claras.
- **CommonJS** usa principalmente `require()` y `module.exports`.
- **ESM** usa `import` y `export`; lo utilizaremos en nuestros proyectos nuevos.
- Los módulos pueden ser **nativos**, **locales** o **externos**.
- La configuración de `package.json` y las extensiones determinan cómo se interpretan los archivos.
- Las importaciones deben respetar las rutas y los nombres exportados.
- La modularidad facilita las pruebas, la reutilización y la evolución del proyecto.
- El gestor modular de cursos demuestra cómo combinar almacenamiento, reglas de negocio y estadísticas sin dependencias externas.

---

# Checklist de aprendizaje

- [ ] Comprendo qué es un módulo.
- [ ] Distingo CommonJS de ESM.
- [ ] Sé exportar e importar funciones.
- [ ] Conozco las exportaciones nombradas y por defecto.
- [ ] Entiendo el papel de `package.json`.
- [ ] Puedo importar módulos nativos.
- [ ] Puedo resolver rutas relativas.
- [ ] Sé identificar errores de importación.
- [ ] Completé el laboratorio guiado.
- [ ] Ejecuté el gestor modular de cursos.
- [ ] Resolví los ejercicios de los tres niveles.
- [ ] Superé la evaluación.

**Siguiente tema sugerido:** módulos nativos de Node.js (`fs`, `path`, `os`, `events`, `crypto`) y gestión de archivos.
