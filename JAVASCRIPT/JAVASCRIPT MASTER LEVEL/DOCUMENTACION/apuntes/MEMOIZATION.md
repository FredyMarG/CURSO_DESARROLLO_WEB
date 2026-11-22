# GUÍA COMPLETA — Memoización (*Memoization*) en JavaScript

> **Nivel:** Desde intermedio hasta avanzado (Semi Senior → Senior)  
> **Objetivo:** Dominar el patrón de optimización **Memoization** en JavaScript combinando *Closures*, diccionarios de caché (`Map`, `WeakMap` u objetos) y funciones puras para evitar recalcular operaciones costosas repetidas y reducir drásticamente los tiempos de ejecución.

---

# ¿Qué es la Memoización (*Memoization*)?

La **memoización** es una técnica de optimización que consiste en **almacenar en memoria (caché) el resultado de una función costosa** asociado a los argumentos con los que fue invocada.

Cuando la función vuelve a llamarse más adelante con **exactamente los mismos argumentos**, en lugar de ejecutar todo el cálculo nuevamente, retorna de inmediato el resultado previamente guardado.

* **Cache Hit (Acierto de caché):** El resultado ya existe en memoria y se devuelve en tiempo constante $O(1)$.
* **Cache Miss (Fallo de caché):** Es la primera vez que se solicitan esos argumentos; se ejecuta la función original y se guarda su resultado para futuras llamadas.

---

# Requisitos fundamentales: Funciones Puras e Idempotencia

Para que la memoización sea segura y no introduzca errores ocultos, la función optimizada **debe ser una Función Pura**:

1. **Determinista:** Para las mismas entradas, siempre debe devolver exactamente la misma salida.
2. **Sin efectos secundarios (*Side Effects*):** No debe modificar variables externas, bases de datos, ni depender del reloj (`Date.now()`) o aleatoriedad (`Math.random()`).

```javascript
// ✅ PURA (Ideal para memoizar): siempre 2 + 3 === 5
const sumar = (a, b) => a + b;

// ❌ IMPURA (NUNCA memoizar): depende del tiempo o azar
const obtenerHora = () => Date.now();
const numeroAleatorio = (max) => Math.floor(Math.random() * max);
```

---

# Anatomía interna: *Closures* + Caché (`Map` vs `{}`)

La memoización en JavaScript se construye combinando dos pilares del lenguaje:
* **Un *Closure* (Cierre):** Permite que la función interna recuerde y conserve su propio diccionario `cache` privado entre múltiples llamadas.
* **Un almacén de caché (`Map` recomendado):** `Map` permite usar cualquier tipo de clave (números, cadenas, booleanos, objetos), conserva el orden de inserción y ofrece `.has()`, `.get()`, `.set()` y `.size`.

```javascript
const memoizarSimple = (fn) => {
    const cache = new Map(); // Privado gracias al Closure

    return (arg) => {
        if (cache.has(arg)) {
            return cache.get(arg); // ⚡ Cache Hit
        }
        const resultado = fn(arg); // 🐢 Cache Miss
        cache.set(arg, resultado);
        return resultado;
    };
};
```

---

# Memoización de múltiples argumentos (`...args`)

Cuando una función recibe varios parámetros (ej. `calcular(10, 20, "iva")`), necesitamos convertir la lista de argumentos en una **clave única** para consultarla en el `Map`.

```javascript
const memoize = (fn) => {
    const cache = new Map();

    return (...args) => {
        // Generamos una clave única combinando todos los argumentos
        const clave = JSON.stringify(args);

        if (cache.has(clave)) {
            return cache.get(clave);
        }

        const resultado = fn(...args);
        cache.set(clave, resultado);
        return resultado;
    };
};
```

> **Nota técnica:** `JSON.stringify(args)` distingue correctamente entre tipos (`"5"` vs `5`), aunque tiene limitaciones si pasas funciones, `undefined` o referencias circulares.

---

# El ejemplo clásico: Fibonacci Recursivo ($O(2^n)$ vs $O(n)$)

Calcular el término `n` de Fibonacci de forma recursiva tradicional repite millones de veces las mismas sumas, creciendo exponencialmente ($O(2^n)$). Con memoización, cada subproblema se calcula **una sola vez** ($O(n)$):

```javascript
// 🐢 Sin memoización: calcular fibonacci(42) tarda varios segundos
const fibLento = (n) => (n <= 1 ? n : fibLento(n - 1) + fibLento(n - 2));

// ⚡ Con memoización: calcular fibonacci(42) tarda ~0.05 milisegundos
const fibRapido = memoize((n) => {
    if (n <= 1) return n;
    return fibRapido(n - 1) + fibRapido(n - 2);
});
```

---

# Gestión de memoria: Caché con Límite y `WeakMap`

Guardar absolutamente todo para siempre puede provocar una **fuga de memoria (*Memory Leak*)** en aplicaciones de larga duración.

### 1. Caché con límite máximo (Evicción simple)
Aprovechando que `Map` mantiene el orden de inserción, si superamos el límite máximo (`maxSize`), eliminamos la entrada más antigua (`cache.keys().next().value`):
```javascript
if (cache.size >= maxSize) {
    const claveMasAntigua = cache.keys().next().value;
    cache.delete(claveMasAntigua);
}
```

### 2. `WeakMap` cuando las claves son Objetos
Si tu función recibe objetos grandes del DOM o modelos de datos como único argumento, usar **`WeakMap`** permite que el *Garbage Collector* libere automáticamente la memoria cuando ese objeto deja de existir en el resto de la aplicación.

---

# Analogías del mundo real

### 1. El Estudiante con Post-its en su Cuaderno 📝
* Si te preguntan cuánto es `347 × 892`, la primera vez haces toda la multiplicación a mano y anotas `347 × 892 = 309,524` en una nota adhesiva (*Cache Miss*).
* Si cinco minutos después te hacen exactamente la misma pregunta, simplemente miras tu nota adhesiva y respondes en medio segundo (*Cache Hit*).

### 2. La Cafetería con Recetas Precalculadas ☕
* En lugar de pesar desde cero los gramos exactos cada vez que piden un pedido estándar repetido, el barista consulta su tabla de medidas ya calculadas para servir al instante.

---

# Diagrama de flujo (*Cache Hit* vs *Cache Miss*)

```
       [ Llamada: fnMemoizada(...args) ]
                       │
                       ▼
       [ Generar clave única de args ]
                       │
                       ▼
          ¿Existe 'clave' en caché?
                       │
          ┌────────────┴────────────┐
          ▼ SÍ (Cache Hit)          ▼ NO (Cache Miss)
  [ Leer cache.get(clave) ]   [ Ejecutar fn(...args) ]
          │                         │
          │                         ▼
          │                 [ Guardar en cache.set() ]
          │                         │
          └────────────┬────────────┘
                       ▼
           [ Retornar resultado final ]
```

---

# Buenas prácticas y errores comunes

### ✅ Buenas Prácticas
* **Memoiza únicamente cálculos costosos o frecuentes:** No envuelvas funciones triviales como `a + b` porque generar la clave y consultar el `Map` cuesta más que la suma misma.
* **Define un límite de caché (`maxSize`):** Especialmente en servidores Node.js o SPAs que permanecen abiertas horas.
* **Usa funciones puras:** Garantiza que el resultado dependa exclusivamente de sus parámetros.

### ❌ Errores Comunes
* **Memoizar funciones con efectos secundarios o estado externo:** Si una función lee una variable global mutable o `new Date()`, la caché devolverá resultados obsoletos.
* **Olvidar que en recursividad la llamada interna debe apuntar a la versión memoizada:** Si dentro de `fib` llamas a una función interna no memoizada, perderás el beneficio de la caché en los subproblemas.

---

# Proyecto Integrador: `memoize(fn)` Genérica con Métricas

Implementación profesional lista para producción que soporta múltiples argumentos, límite máximo de caché (`maxSize`) y estadísticas de aciertos y fallos:

```javascript
const crearMemoizer = (fn, { maxSize = 100 } = {}) => {
    const cache = new Map();
    const stats = { hits: 0, misses: 0 };

    const memoized = (...args) => {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            stats.hits++;
            return cache.get(key);
        }

        stats.misses++;
        const result = fn(...args);

        if (cache.size >= maxSize) {
            const oldestKey = cache.keys().next().value;
            cache.delete(oldestKey);
        }

        cache.set(key, result);
        return result;
    };

    memoized.getStats = () => ({ ...stats, size: cache.size });
    memoized.clear = () => {
        cache.clear();
        stats.hits = 0;
        stats.misses = 0;
    };

    return memoized;
};
```

---

# Ejercicios

## Nivel 1
Crea una función memoizada `cuadradoMemo` que calcule `n * n` e imprima `"Calculando..."` únicamente cuando ocurra un *Cache Miss*. Pruébala llamando dos veces con `5` y verifica que la segunda vez no imprime `"Calculando..."`.

## Nivel 2
Implementa una función `memoizarSuma` que acepte múltiples argumentos (`a, b, c`) usando `JSON.stringify(args)` como clave dentro de un `Map`.

## Nivel 3
Construye una función `factorialMemo` recursiva utilizando un `Map` externo o *closure* que calcule factoriales eficientemente y devuelva también el tamaño actual de su caché.

---

# Solucionario paso a paso

## Solución Nivel 1
```javascript
const memoizar = (fn) => {
    const cache = new Map();
    return (n) => {
        if (cache.has(n)) return cache.get(n);
        const res = fn(n);
        cache.set(n, res);
        return res;
    };
};

const cuadradoMemo = memoizar((n) => {
    console.log("Calculando...");
    return n * n;
});

console.log(cuadradoMemo(5)); // Imprime "Calculando..." y 25
console.log(cuadradoMemo(5)); // Solo imprime 25 (desde caché)
```

## Solución Nivel 2
```javascript
const memoizarMulti = (fn) => {
    const cache = new Map();
    return (...args) => {
        const clave = JSON.stringify(args);
        if (cache.has(clave)) return cache.get(clave);
        const res = fn(...args);
        cache.set(clave, res);
        return res;
    };
};

const sumarTres = memoizarMulti((a, b, c) => a + b + c);
console.log(sumarTres(10, 20, 30)); // 60 (Miss)
console.log(sumarTres(10, 20, 30)); // 60 (Hit)
```

## Solución Nivel 3
```javascript
const crearFactorialMemo = () => {
    const cache = new Map();
    const factorial = (n) => {
        if (n <= 1) return 1;
        if (cache.has(n)) return cache.get(n);
        const res = n * factorial(n - 1);
        cache.set(n, res);
        return res;
    };
    factorial.cacheSize = () => cache.size;
    return factorial;
};

const fact = crearFactorialMemo();
console.log("6! =", fact(6), "| Entradas en caché:", fact.cacheSize());
```

---

# Resumen técnico y Hoja de Trucos (Cheatsheet)

| Concepto / Estructura | Propósito | Ventaja / Nota |
| :--- | :--- | :--- |
| **Closure + `Map`** | Base de toda memoización en JS | Mantiene la caché privada y permite claves de cualquier tipo |
| **Cache Hit / Miss** | Acierto vs Fallo en caché | Convierte recomputaciones $O(2^n)$ en lecturas $O(1)$ |
| **Función Pura** | Requisito indispensable | Mismas entradas = misma salida sin efectos secundarios |
| **`JSON.stringify(args)`** | Clave para múltiples argumentos | Distingue tipos y orden de parámetros |
| **`maxSize` (LRU simple)** | Evita fugas de memoria | Elimina la entrada más antigua con `cache.keys().next().value` |
| **`WeakMap`** | Caché con claves tipo Objeto | Permite recolección de basura automática (*Garbage Collection*) |
