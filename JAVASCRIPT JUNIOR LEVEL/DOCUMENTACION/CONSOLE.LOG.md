# 🚀 Guía Completa de la Consola en JavaScript (`console`)

La **API `console`** es tu panel de diagnóstico en tiempo real dentro de las DevTools del navegador y Node.js. Dominar sus métodos te permite inspeccionar datos, medir rendimiento y detectar errores mucho más rápido que con simples `console.log()` sueltos.

---

## 1. Niveles de Registro (*Logging*)

| Método | Uso | Apariencia en DevTools |
| :--- | :--- | :--- |
| `console.log(...)` | Salida general de depuración | Texto estándar |
| `console.info(...)` | Mensajes informativos | Icono/estilo informativo |
| `console.warn(...)` | Advertencias no críticas | Fondo amarillo + triángulo ⚠️ |
| `console.error(...)` | Errores críticos + *stack trace* | Fondo rojo + icono ❌ |
| `console.assert(cond, msg)` | Imprime error **solo si `cond` es falsa** | Igual que `error` cuando falla |

```javascript
console.assert(edad >= 18, "Error: El usuario debe ser mayor de edad", { edad });
```

---

## 2. Inspección Estructurada: `table`, `dir` y `trace`

### `console.table(datos, columnas?)`
Convierte arrays de objetos u objetos planos en una tabla ordenable e increíblemente legible:

```javascript
const usuarios = [
    { id: 1, nombre: "Ana", rol: "Admin" },
    { id: 2, nombre: "Luis", rol: "Editor" },
];
console.table(usuarios, ["nombre", "rol"]);
```

### `console.dir(objeto)`
Muestra la representación interactiva de propiedades JS de un objeto (muy útil para inspeccionar nodos del DOM en lugar de ver su HTML).

### `console.trace(etiqueta?)`
Imprime la **pila de llamadas** (*stack trace*) exacta que llevó hasta esa línea de código, ideal para saber qué función llamó a otra.

---

## 3. Agrupación, Contadores y Temporizadores

### Agrupar mensajes: `group` / `groupCollapsed` / `groupEnd`
```javascript
console.groupCollapsed("📦 Carga de Perfil"); // Inicia colapsado
console.log("Usuario:", "Carlos");
console.log("Permisos:", ["read", "write"]);
console.groupEnd();
```

### Contar ejecuciones: `count` / `countReset`
```javascript
function procesarClick() {
    console.count("Botón Guardar"); // "Botón Guardar: 1", "Botón Guardar: 2"...
}
```

### Medir rendimiento: `time` / `timeLog` / `timeEnd`
```javascript
console.time("bucle-millon");
let suma = 0;
for (let i = 0; i < 1_000_000; i++) suma += i;
console.timeEnd("bucle-millon"); // "bucle-millon: 2.45 ms"
```

---

## 4. Placeholders y Estilos CSS (`%c`)

Puedes formatear mensajes usando especificadores de formato y estilos CSS directamente en la consola del navegador:

| Placeholder | Tipo |
| :--- | :--- |
| `%s` | String |
| `%d` / `%i` | Entero |
| `%f` | Flotante |
| `%o` / `%O` | Objeto interactivo |
| `%c` | Aplica estilos CSS al texto siguiente |

```javascript
console.log(
    "%c ¡SISTEMA LISTO! %c Versión %s ",
    "background: #10b981; color: #052e16; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
    "color: #94a3b8; font-style: italic;",
    "v2.4.0"
);
```

---

## ⚠️ Errores Comunes

* **Dejar `console.log()` con datos sensibles en producción:** Expone tokens, correos o lógica interna a cualquier usuario que abra DevTools.
* **Imprimir objetos mutables y confiar en la vista previa colapsada:** En DevTools, al expandir un objeto con la flecha `▶`, el navegador lee su estado **actual**, no el que tenía en el instante del `console.log`. Usa `console.log(structuredClone(obj))` si necesitas una foto exacta de ese momento.
* **Olvidar cerrar `console.group()` con `console.groupEnd()`:** Todos los logs posteriores quedarán anidados dentro del grupo.

## ✅ Buenas Prácticas

* Usa `{ variable }` al imprimir: `console.log({ precio, descuento })` muestra automáticamente el nombre y el valor de cada variable.
* Prefiere `console.table()` para arrays de objetos y `console.time()` para comparar el rendimiento de dos algoritmos.
* Usa `console.warn` y `console.error` para poder filtrar mensajes por nivel en la barra de DevTools.

---

## Hoja de Trucos (Cheatsheet) — `console`

| Método | Propósito | Ejemplo |
| :--- | :--- | :--- |
| `console.log({ a, b })` | Inspeccionar variables con su nombre | `console.log({ usuario, total })` |
| `console.table(arr)` | Ver arrays/objetos como tabla | `console.table(productos)` |
| `console.warn()` / `error()` | Advertencias (amarillo) / Errores (rojo) | `console.error("Fallo de red")` |
| `console.assert(cond, msg)` | Loguea error solo si `cond` es falsa | `console.assert(id > 0, "ID inválido")` |
| `console.group()` / `groupEnd()` | Agrupar logs relacionados | `console.group("API"); ... console.groupEnd()` |
| `console.time()` / `timeEnd()` | Medir tiempo de ejecución | `console.time("t"); ... console.timeEnd("t")` |
| `console.count(label)` | Contar cuántas veces pasa por ahí | `console.count("render")` |
| `console.trace()` | Mostrar pila de llamadas (*stack trace*) | `console.trace("Origen")` |
| `%c` | Aplicar CSS en consola del navegador | `console.log("%cHola", "color: cyan")` |
