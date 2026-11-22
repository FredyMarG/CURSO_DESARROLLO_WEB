# 🔗 Guía Completa de Concatenación y Template Literals

La concatenación e interpolación permiten construir cadenas de texto dinámicas combinando strings, variables y expresiones. En JavaScript moderno, elegir la técnica correcta mejora la legibilidad y previene vulnerabilidades de seguridad como XSS.

---

## 1. Métodos para Unir Cadenas

### A. Template Literals (Estándar moderno ES6+)
Utilizan comillas invertidas o *backticks* (`` ` ``) e interpolación `${expresión}`. Son la forma recomendada en el 99% de los casos.

```javascript
const nombre = "Sofía";
const precio = 25;
const cantidad = 3;

// Interpolación de variables y expresiones JavaScript
const resumen = `Cliente: ${nombre} | Total con IVA: $${(precio * cantidad * 1.16).toFixed(2)}`;
console.log(resumen);
```

**Ventajas clave:**
* Permiten **cadenas multilínea** reales sin usar `\n` ni `+`:
  ```javascript
  const tarjeta = `
      Usuario: ${nombre}
      Estado: Activo
  `;
  ```
* Evalúan cualquier expresión válida dentro de `${...}` (operadores ternarios, llamadas a funciones, cálculos).

### B. El Operador Suma (`+`) y `+=`
El método clásico. Une cadenas literalmente sin añadir espacios automáticos.

```javascript
let saludo = "Hola, " + "mundo";
saludo += "!"; // "Hola, mundo!"
```

> **Cuidado con la precedencia:** `console.log("Suma: " + 5 + 3)` devuelve `"Suma: 53"` porque evalúa de izquierda a derecha (`"Suma: 5" + 3`). Usa paréntesis: `"Suma: " + (5 + 3)`.

### C. Método `String.prototype.concat()`
Une una o más cadenas y devuelve un nuevo string sin modificar el original. Es menos legible que los *Template Literals*.

```javascript
const frase = "Aprender ".concat("JavaScript ", "moderno");
```

### D. `Array.prototype.join()` para listas
Cuando necesitas unir muchos fragmentos o elementos de una lista con un separador consistente, `join()` es mucho más limpio y eficiente que un bucle con `+=`:

```javascript
const etiquetas = ["HTML", "CSS", "JavaScript"];
console.log(etiquetas.join(" • ")); // "HTML • CSS • JavaScript"
```

---

## 2. Caracteres de Escape

Dentro de comillas normales (`'...'` o `"..."`), ciertos caracteres requieren una barra invertida `\` para representarse:

| Secuencia | Significado | Ejemplo |
| :--- | :--- | :--- |
| `\n` | Salto de línea | `"Línea 1\nLínea 2"` |
| `\t` | Tabulación | `"Col1\tCol2"` |
| `\"` o `\'` | Comilla literal dentro del mismo tipo de comilla | `'Es \'genial\''` |
| `\\` | Barra invertida literal | `"C:\\Users\\Dev"` |
| `` \` `` | Backtick literal dentro de un Template Literal | `` `Usa \`backticks\`` `` |

---

## 3. Tagged Templates (Introducción)

Un *Tagged Template* es una función que procesa un *Template Literal* antes de producir el string final. Es la base de librerías populares como `styled-components` o sanitizadores de HTML/SQL:

```javascript
function destacar(textos, ...valores) {
    return textos.reduce((acc, texto, i) => {
        const valor = valores[i] !== undefined ? `[${valores[i]}]` : "";
        return acc + texto + valor;
    }, "");
}

const lenguaje = "JavaScript";
const version = "ES2025";
console.log(destacar`Dominando ${lenguaje} en su versión ${version}`);
// "Dominando [JavaScript] en su versión [ES2025]"
```

---

## 4. Seguridad: Prevención de XSS (`textContent` vs `innerHTML`)

Un error crítico al concatenar datos ingresados por el usuario e insertarlos en el DOM es usar `innerHTML`:

```javascript
const inputUsuario = '<img src=x onerror="alert(\'XSS\')">';

// ❌ PELIGROSO: El navegador interpreta las etiquetas y ejecuta el script malicioso
contenedor.innerHTML = `<p>Hola ${inputUsuario}</p>`;

// ✅ SEGURO: textContent trata toda la cadena como texto plano literal
const parrafo = document.createElement("p");
parrafo.textContent = `Hola ${inputUsuario}`;
contenedor.append(parrafo);
```

---

## ⚠️ Errores Comunes

* **Usar comillas simples o dobles en lugar de backticks:** `'Hola ${nombre}'` imprime literalmente `${nombre}` en pantalla.
* **Olvidar que `+` mezcla suma y concatenación:** `"Total: " + 10 + 5` da `"Total: 105"`.
* **Inyectar texto de usuario con `innerHTML`:** Abre la puerta a ataques *Cross-Site Scripting (XSS)*.

## ✅ Buenas Prácticas

* Usa **Template Literals** (`` `...` ``) siempre que interpoles variables o escribas textos multilínea.
* Usa `Array.prototype.join()` cuando concatenes listas dinámicas de elementos.
* Usa `textContent` (nunca `innerHTML`) al mostrar texto dinámico proveniente de usuarios o APIs externas.

---

## Hoja de Trucos (Cheatsheet) — Concatenación

| Técnica | Sintaxis | Mejor uso |
| :--- | :--- | :--- |
| **Template Literal** | `` `Hola ${nombre}` `` | Estándar para interpolar variables y multilínea |
| **Operador `+`** | `"Hola " + nombre` | Uniones muy simples de 2 literales |
| **Asignación `+=`** | `texto += " más"` | Acumulación incremental |
| **`Array.join()`** | `["a", "b"].join(", ")` | Unir arrays con separador |
| **`String.concat()`** | `"a".concat("b", "c")` | Encadenamiento funcional (poco frecuente) |
| **Inserción segura DOM** | `el.textContent = \`Hola ${user}\`` | Evita ataques XSS al mostrar datos |
