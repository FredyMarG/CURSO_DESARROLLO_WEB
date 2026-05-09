# Operadores en JavaScript: Lógica y Asignación

Esta guía detalla cómo manipular valores y controlar el flujo de datos mediante operadores.

---

## 1. Operadores de Asignación
Se utilizan para asignar valores a las variables. Los operadores compuestos (shorthand) permiten realizar una operación aritmética y una asignación en un solo paso.


| Operador | Nombre | Ejemplo | Equivalente a |
| :--- | :--- | :--- | :--- |
| `=` | Asignación simple | `x = 10` | `x = 10` |
| `+=` | Asignación de suma | `x += 5` | `x = x + 5` |
| `-=` | Asignación de resta | `x -= 2` | `x = x - 2` |
| `*=` | Asignación de multiplicación | `x *= 3` | `x = x * 3` |
| `/=` | Asignación de división | `x /= 2` | `x = x / 2` |
| `%=` | Asignación de residuo | `x %= 3` | `x = x % 3` |
| `**=` | Asignación de exponente | `x **= 2` | `x = x ** 2` |

---

## 2. Operadores Lógicos
Permiten evaluar múltiples condiciones y devolver un valor booleano (`true` o `false`) o realizar cortocircuitos.

### A. AND Lógico (`&&`)
Devuelve `true` solo si **ambos** operandos son verdaderos.
*   *Ejemplo:* `(5 > 3 && 10 < 20)` -> `true`

### B. OR Lógico (`||`)
Devuelve `true` si **al menos uno** de los operandos es verdadero.
*   *Ejemplo:* `(5 > 10 || 10 < 20)` -> `true`

### C. NOT Lógico (`!`)
Invierte el valor lógico. Lo que es `true` pasa a ser `false` y viceversa.
*   *Ejemplo:* `!(5 > 10)` -> `true`

### D. Nullish Coalescing (`??`) - *ES2020*
Devuelve el valor de la derecha solo si el de la izquierda es `null` o `undefined`. Es más seguro que `||` para valores como `0` o `""`.
*   *Ejemplo:* `let nombre = null ?? "Invitado"` -> `"Invitado"`

---

## 3. Operadores de Comparación
Es vital distinguir entre la comparación simple y la estricta.

*   **Igualdad Estricta (`===`)**: Compara valor y **tipo de dato**. (Recomendado).
*   **Igualdad Débil (`==`)**: Compara solo valor, realizando conversión de tipos automática (coerción). (Evitar).
*   **Diferente de (`!==`)**: Compara si los valores y tipos no son iguales.
*   **Relacionales**: `>`, `<`, `>=`, `<=`.

---

## 4. Ejemplo Práctico Combinado

```javascript
"use strict";

let score = 50;
const nivelMaximo = 100;
const tienePaseEspecial = true;
const nombreUsuario = prompt("Tu nombre:") ?? "Jugador 1";

// Asignación compuesta (bono por inicio)
score += 10; 

// Lógica de acceso: 
// El usuario entra si tiene el puntaje suficiente O si tiene un pase especial.
const puedeAcceder = (score >= nivelMaximo) || tienePaseEspecial;

if (puedeAcceder && score > 0) {
    console.log(`Bienvenido, ${nombreUsuario}. Tu puntaje actual es ${score}.`);
} else {
    console.log("Acceso denegado.");
}
