# 🚦 Guía Completa de Estructuras Condicionales

Las estructuras condicionales controlan el flujo de ejecución de un programa permitiendo tomar decisiones según si una expresión es verdadera (*truthy*) o falsa (*falsy*).

---

## 1. Bloques `if`, `else if` y `else`

Evalúan condiciones booleanas en orden secuencial. En cuanto una rama resulta verdadera, se ejecuta y el resto se omite.

```javascript
const nota = 85;

if (nota >= 90) {
    console.log("Excelente (A)");
} else if (nota >= 70) {
    console.log("Aprobado (B)");
} else {
    console.log("Necesita mejorar");
}
```

---

## 2. Truthy y Falsy

En JavaScript, cualquier valor puede evaluarse dentro de un `if` como booleano mediante coerción implícita.

### Los únicos valores *Falsy* en JavaScript:
1. `false`
2. `0`, `-0` y `0n` (`BigInt` cero)
3. `""`, `''`, `` `` `` (string vacío)
4. `null`
5. `undefined`
6. `NaN`

### Valores *Truthy* (todo lo demás):
`"0"`, `"false"`, `" "`, `[]` (array vacío), `{}` (objeto vacío), `function() {}`, cualquier número distinto de `0` o `NaN`.

```javascript
const carrito = [];
if (carrito) {
    // ⚠️ Entra aquí porque [] es truthy, ¡aunque esté vacío!
}
if (carrito.length > 0) {
    // ✅ Forma correcta de verificar si un array tiene elementos
}
```

---

## 3. Cláusulas de Guarda (*Early Return*)

En lugar de anidar múltiples `if` uno dentro de otro (el antipatrón "pirámide de la muerte" o *arrow code*), valida primero los casos de error o salida y retorna inmediatamente:

```javascript
// ❌ Difícil de leer (anidamiento profundo)
function procesarPago(usuario, monto) {
    if (usuario) {
        if (usuario.activo) {
            if (monto > 0) {
                return `Pago de $${monto} procesado.`;
            }
        }
    }
    return "No se pudo procesar.";
}

// ✅ Limpio y profesional (Cláusulas de guarda)
function procesarPagoLimpio(usuario, monto) {
    if (!usuario) return "Usuario requerido.";
    if (!usuario.activo) return "Usuario inactivo.";
    if (monto <= 0) return "El monto debe ser mayor a 0.";

    return `Pago de $${monto} procesado.`;
}
```

---

## 4. Sentencia `switch`

Ideal cuando comparas **una misma expresión** contra múltiples valores exactos (usa comparación estricta `===` internamente).

```javascript
const rol = "editor";

switch (rol) {
    case "admin":
        console.log("Acceso total");
        break;
    case "editor":
    case "moderador": // Agrupación de casos (fall-through intencional)
        console.log("Acceso de edición");
        break;
    default:
        console.log("Acceso de solo lectura");
}
```

> **Tip de Scope en `switch`:** Si declaras variables con `let` o `const` dentro de un `case`, envuelve el bloque del `case` en llaves `{ ... }` para evitar colisiones de nombres con otros casos.

### Alternativa moderna: Diccionario / Objeto de mapeo
Para mapeos directos de clave-valor, un objeto o `Map` suele ser más conciso y extensible que un `switch`:

```javascript
const permisosPorRol = {
    admin: "Acceso total",
    editor: "Acceso de edición",
    invitado: "Solo lectura",
};

const mensaje = permisosPorRol[rol] ?? "Rol desconocido";
```

---

## 5. Operador Ternario (`? :`)

Es una **expresión** (devuelve un valor) pensada para asignaciones simples en una sola línea:

```javascript
const edad = 19;
const tarifa = edad >= 18 ? 15 : 8;
```

---

## ⚠️ Errores Comunes

* **Olvidar el `break` en un `switch`:** Provoca *fall-through* involuntario, ejecutando todos los casos siguientes hasta encontrar un `break` o el final del bloque.
* **Usar `=` en lugar de `===`:** `if (activo = true)` asigna en lugar de comparar.
* **Evaluar arrays u objetos vacíos directamente con `if (arr)`:** `[]` y `{}` siempre son *truthy*. Usa `arr.length > 0` u `Object.keys(obj).length > 0`.
* **Anidar ternarios:** `a ? b : c ? d : e` hace el código ilegible; usa `if / else if / else`.

## ✅ Buenas Prácticas

* Usa **cláusulas de guarda** (*early return*) al inicio de las funciones para mantener el código plano.
* Reserva el operador ternario para decisiones binarias cortas que devuelven un valor.
* Usa un objeto diccionario o `Map` cuando un `switch` solo sirve para devolver un valor por cada clave.

---

## Hoja de Trucos (Cheatsheet) — Condicionales

| Estructura | Cuándo usarla | Ejemplo |
| :--- | :--- | :--- |
| **`if / else if / else`** | Rangos numéricos o condiciones complejas | `if (x > 10 && ok) { ... }` |
| **Cláusula de guarda** | Validar precondiciones al inicio de funciones | `if (!user) return;` |
| **Ternario `? :`** | Asignar uno de dos valores en línea | `const estado = ok ? "ON" : "OFF";` |
| **`switch`** | Múltiples valores exactos con lógica distinta | `switch (codigo) { case 200: ... break; }` |
| **Objeto / `Map`** | Mapeo directo clave → valor sin lógica extra | `const label = mapa[estado] ?? "Otro";` |
