# Guía Maestra de JavaScript: Variables, Tipos y Motor de Ejecución

Esta guía combina los fundamentos de declaración con el comportamiento interno del motor de JavaScript (V8/SpiderMonkey) y las tendencias del estándar ECMAScript.

---

## 1. Declaración de Variables y Evolución (ES6+)
JavaScript ha evolucionado de un tipado débil permisivo a estructuras más sólidas.

*   **`const`**: Crea una referencia constante en memoria. No permite reasignación ni declaración sin inicializar. **Uso recomendado:** 80% de tus variables deberían ser constantes para evitar efectos secundarios.
*   **`let`**: Introducido en ES6. Permite reasignar valores y posee **Scope de Bloque**. Ideal para bucles `for` y contadores.
*   **`var`**: Legado (Legacy). Posee **Scope de Función** y permite la redeclaración, lo que suele causar errores lógicos en aplicaciones grandes. **Evitar su uso en desarrollo moderno.**

---

## 2. Tipos de Datos y Valores Especiales

### A. Tipos Primitivos (Inmutables)
1.  **String**: Cadenas de texto. Soporta *Template Literals* (backticks `` ` ``) para interpolación: `` `Hola ${nombre}` ``.
2.  **Number**: Formato IEEE 754 (64 bits). Maneja enteros y flotantes.
3.  **Boolean**: `true` o `false`.
4.  **BigInt**: Para enteros que exceden el límite de `Number.MAX_SAFE_INTEGER`.
5.  **Symbol**: Identificadores únicos para propiedades de objetos.

### B. Valores Especiales y Curiosidades
*   **`undefined`**: Asignado por el motor de JS a variables declaradas pero no inicializadas.
*   **`null`**: Asignación intencional de "vacío". *Nota: `typeof null` es `"object"` (error histórico).*
*   **`NaN` (Not a Number)**: Resultado de operaciones matemáticas imposibles. Su tipo sigue siendo `Number`.
*   **`prompt()`**: Captura datos del usuario. **Retorno:** Siempre un `String` (o `null` si se cancela). Requiere conversión manual: `Number(valor)`.

---

## 3. El Motor de JS: Scope y Hoisting

### Alcance (Scope)
Determina la visibilidad de las variables:
*   **Global**: Accesible en todo el script/ventana.
*   **Function**: Limitado al cuerpo de la función (característico de `var`).
*   **Block `{}`**: Las variables solo existen dentro de las llaves (característico de `let` y `const`).

### Hoisting (Elevación)
Comportamiento donde el intérprete "mueve" las declaraciones al inicio:
*   **`var`**: Se eleva e inicializa como `undefined`.
*   **`let` / `const`**: Se elevan pero entran en la **Temporal Dead Zone (TDZ)**. Acceder a ellas antes de su línea de código lanza un `ReferenceError`.
*   **Funciones**: Las declaraciones de función (`function nombre() {}`) se elevan completamente.

---

## 4. Ecosistema y Buenas Prácticas (2025-2026)
Para entornos profesionales, el JS puro se complementa con:

1.  **TypeScript**: Añade tipado estático para detectar errores antes de la ejecución.
2.  **Modo Estricto (`"use strict"`)**: Previene errores comunes (como crear variables globales accidentales).
3.  **Asincronía**: Uso de `async/await` y Promesas para manejar datos externos sin bloquear el hilo principal.
4.  **Estandarización**: Seguimiento de **ECMAScript (ES2025/2026)** para usar las últimas funciones del lenguaje.

---

## 5. Ejemplo de Implementación Segura

```javascript
"use strict";

const solicitarDatos = () => {
    const entrada = prompt("Ingresa un número para elevar al cuadrado:");

    if (entrada === null) return console.log("Operación cancelada.");

    const numero = Number(entrada);

    if (isNaN(numero)) {
        console.error("Error: La entrada no es un número válido.");
    } else {
        const resultado = numero ** 2; // Operador de exponente (ES7)
        console.log(`El resultado de ${numero}² es: ${resultado}`);
    }
};

solicitarDatos();
