# GUÍA — El Objeto Date en JavaScript

> **Nivel:** Desde principiante hasta avanzado (Junior → Semi Senior)
> **Objetivo:** Comprender el funcionamiento del objeto nativo `Date` en JavaScript, dominar sus métodos de extracción de tiempo y evitar las trampas clásicas de indexación y métodos obsoletos.

---

# 📚 Temario

1. Definición del Objeto Date
2. Sintaxis básica y anatomía de métodos
3. Extracción y formateo práctico
4. Comparativa: Métodos obsoletos / erróneos vs. Estándar moderno
5. Analogía del mundo real
6. Diagrama de flujo de extracción
7. Buenas prácticas
8. Errores comunes
9. Ejercicios
10. Solucionario paso a paso
11. Resumen

---

# ¿Qué es el Objeto Date?

El objeto **`Date`** es una herramienta nativa en JavaScript que permite trabajar con fechas y horas. Internamente, almacena un número entero que representa los milisegundos transcurridos desde el **1 de enero de 1970 a las 00:00:00 UTC** (conocido como *Unix Epoch*).

A diferencia de otros tipos de datos primitivos, para utilizar `Date` y acceder a sus métodos de lectura es obligatorio **instanciarlo** mediante la palabra reservada `new Date()`. Una vez creado el objeto, podemos extraer el año, mes, día, hora, minutos y segundos mediante métodos específicos (*getters*).

---

# Sintaxis básica y anatomía de métodos

Para extraer fragmentos específicos de una fecha, primero creamos la instancia y luego invocamos los métodos correspondientes:

```javascript
const ahora = new Date();
```

### 🔍 Desglose de los métodos de extracción (Getters):
1. **`getDate()`:** Devuelve el día del mes en formato numérico (`1` al `31`).
2. **`getDay()`:** Devuelve el día de la semana (`0` para Domingo hasta `6` para Sábado). *(Nota: En apuntes suele confundirse con `getDays()`, pero en JS es singular).*
3. **`getMonth()`:** Devuelve el mes del año indexado desde cero (`0` para Enero hasta `11` para Diciembre).
4. **`getFullYear()`:** Devuelve el año completo en 4 dígitos (ej. `2026`). *(Reemplaza al antiguo y obsoleto `getYear()`).*
5. **`getHours()`:** Devuelve la hora en formato militar de 24 horas (`0` a `23`).
6. **`getMinutes()`:** Devuelve los minutos actuales (`0` a `59`).
7. **`getSeconds()`:** Devuelve los segundos actuales (`0` a `59`).

---

# Extracción y formateo práctico

Al combinar estos métodos podemos desglosar cualquier marca temporal en variables legibles para mostrarlas en la interfaz de usuario o guardarlas en registros:

```javascript
const fechaActual = new Date();

const diaMes = fechaActual.getDate();
const mes = fechaActual.getMonth() + 1; // Se suma 1 porque Enero es 0
const anio = fechaActual.getFullYear();

const horas = fechaActual.getHours();
const minutos = fechaActual.getMinutes();
const segundos = fechaActual.getSeconds();

console.log(`Fecha: ${diaMes}/${mes}/${anio} - Hora: ${horas}:${minutos}:${segundos}`);
```

---

# Comparativa: Código con trampas vs. Estándar moderno

En tu imagen de referencia aparecen `getDays()` y `getYear()`. Es fundamental conocer la diferencia entre lo que suele aparecer en apuntes antiguos y cómo lo ejecuta realmente el motor de JavaScript moderno:

### Enfoque propenso a errores / Obsoleto (`getYear` y `getDays`)
```javascript
const fecha = new Date("2026-10-29T14:30:00");

// ❌ ERROR: getDays() en plural no existe, lanzará TypeError
// const diaSemana = fecha.getDays(); 

// ⚠️ OBSOLETO: getYear() resta 1900 al año actual (Efecto Y2K)
const anioIncorrecto = fecha.getYear(); // Devuelve 126 en lugar de 2026

// ⚠️ CONFUSO: getMonth() sin sumar 1 muestra Octubre como mes 9
const mesCrudo = fecha.getMonth(); // Devuelve 9
```

### Estándar moderno y seguro (`getFullYear` y `getDay`)
```javascript
const fecha = new Date("2026-10-29T14:30:00");

// ✅ CORRECTO: En singular, devuelve de 0 (Dom) a 6 (Sáb)
const diaSemana = fecha.getDay(); 

// ✅ CORRECTO: Devuelve el año completo de 4 dígitos
const anioCorrecto = fecha.getFullYear(); // Devuelve 2026

// ✅ CORRECTO: Ajustado para lectura humana (1 a 12)
const mesReal = fecha.getMonth() + 1; // Devuelve 10
```

---

# Analogía del mundo real: El Reloj Astronómico de pared 🕰️

Imagina que tienes un reloj mecánico antiguo con múltiples esferas e indicadores en tu pared:

```
1. La instancia (new Date()) es como tomar una fotografía instantánea del reloj en este preciso milisegundo; las agujas en la foto quedan congeladas.
2. Llamar a getHours(), getMinutes() o getSeconds() es simplemente mirar la aguja de las horas, los minutos o el segundero dentro de esa foto.
3. Llamar a getMonth() o getDay() es mirar las rueditas del calendario que empiezan a contar desde la posición 0 en lugar de la posición 1.
```

---

# Diagrama de flujo de extracción

```
                     [ new Date() ]
               (Instancia de Tiempo Actual)
                            │
       ┌────────────────────┼────────────────────┐
       ▼                    ▼                    ▼
[ Calendario ]      [ Día de Semana ]       [ Reloj 24h ]
 ├─ getDate() (1-31)  └─ getDay() (0-6)      ├─ getHours() (0-23)
 ├─ getMonth() (0-11)                        ├─ getMinutes() (0-59)
 └─ getFullYear() (YYYY)                     └─ getSeconds() (0-59)
```

---

# Buenas prácticas

✅ **Usa siempre `getFullYear()` en lugar de `getYear()`:** `getYear()` es un método heredado de los años 90 que devuelve el año actual menos 1900 (para el año 2026 devuelve `126`). Está oficialmente desaprobado (*deprecated*).

✅ **Usa `padStart(2, "0")` al construir relojes digitales:** Los métodos como `getMinutes()` o `getSeconds()` devuelven números simples (ej. `5` en lugar de `05`). Formatearlos garantiza que un reloj se vea como `14:05:09` y no como `14:5:9`.

```javascript
const min = String(new Date().getMinutes()).padStart(2, "0");
```

✅ **Apóyate en arreglos para nombrar meses y días:** Como `getDay()` y `getMonth()` empiezan en `0`, coinciden exactamente con los índices de un Array en JavaScript.

```javascript
const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const hoyNombre = dias[new Date().getDay()];
```

---

# Errores comunes

### ❌ Confundir `getDate()` con `getDay()` (o escribir `getDays()`)
Es el tropiezo número uno en entrevistas y pruebas técnicas:
* **`getDate()`** te da el número del calendario (ej. `29` de octubre).
* **`getDay()`** (sin "s" al final) te da el día de la semana (`0` al `6`).
* **`getDays()`** (con "s") no existe en el estándar de JavaScript y rompe el programa con un `TypeError`.

```javascript
const hoy = new Date();
// ❌ INCORRECTO: Intentar obtener el día del mes con getDay()
console.log(`Hoy es el día ${hoy.getDay()} del mes`); // Imprime un número del 0 al 6
```

### ❌ Olvidar que `getMonth()` empieza en 0
En JavaScript los meses van del `0` (Enero) al `11` (Diciembre). Si muestras el resultado directamente al usuario sin sumarle `1`, el mes estará desfasado.

```javascript
// ❌ INCORRECTO: En diciembre imprimirá "Mes: 11"
console.log("Mes: " + new Date(2026, 11, 25).getMonth());
```

---

# Ejercicios

## Nivel 1
Crea una instancia de la fecha actual guardada en una constante `hoy`. Extrae el día del mes, el mes (ajustado del 1 al 12) y el año completo de 4 dígitos, e imprime en consola una cadena con el formato `"DD/MM/YYYY"`.

## Nivel 2
Escribe una función llamada `obtenerNombreDia` que reciba un objeto `Date` como parámetro. Utilizando el método `getDay()` y un arreglo con los días de la semana, la función debe retornar el nombre del día en español (teniendo en cuenta que `0` es `"Domingo"`).

## Nivel 3
Crea una función flecha llamada `relojDigital` que tome la hora actual del sistema (`getHours()`, `getMinutes()`, `getSeconds()`) y devuelva un string con el formato exacto `"HH:MM:SS"`, asegurándote de que los números menores a 10 lleven un cero a la izquierda (por ejemplo, `"08:05:09"`).

---

# Solucionario paso a paso

### Solución Nivel 1
```javascript
const hoy = new Date();

const dia = hoy.getDate();
const mes = hoy.getMonth() + 1; // Sumamos 1 porque enero es 0
const anio = hoy.getFullYear(); // Evitamos getYear() para obtener los 4 dígitos

const fechaFormateada = `${dia}/${mes}/${anio}`;
console.log(fechaFormateada);
```
> **Nota clave:** Usamos `getFullYear()` para evitar el problema del año de 2/3 dígitos de `getYear()`, y sumamos `1` al resultado de `getMonth()`.

### Solución Nivel 2
```javascript
function obtenerNombreDia(fecha) {
    // El índice 0 corresponde obligatoriamente a Domingo
    const diasSemana = [
        "Domingo", 
        "Lunes", 
        "Martes", 
        "Miércoles", 
        "Jueves", 
        "Viernes", 
        "Sábado"
    ];
    
    const indiceDia = fecha.getDay();
    return diasSemana[indiceDia];
}

// Prueba:
const miFecha = new Date();
console.log("Hoy es:", obtenerNombreDia(miFecha));
```
> **Nota clave:** Como `getDay()` retorna valores de `0` a `6`, encaja de forma nativa con los índices de un Array sin necesidad de restar ni sumar nada.

### Solución Nivel 3
```javascript
const relojDigital = () => {
    const ahora = new Date();
    
    const horas = String(ahora.getHours()).padStart(2, "0");
    const minutos = String(ahora.getMinutes()).padStart(2, "0");
    const segundos = String(ahora.getSeconds()).padStart(2, "0");
    
    return `${horas}:${minutos}:${segundos}`;
};

console.log(relojDigital()); // Ejemplo de salida: "14:05:09"
```
> **Nota clave:** Convertimos cada número a `String` para poder aplicar el método `.padStart(2, "0")`, el cual rellena con un `"0"` a la izquierda si el texto mide menos de 2 caracteres.

---

# Resumen

* **El objeto `Date`** requiere instanciarse con `new Date()` para poder invocar sus métodos de extracción de fecha y hora.
* **Cuidado con los nombres de métodos:** en JavaScript real se escribe **`getDay()`** (en singular, no `getDays()`) para el día de la semana, y se debe usar **`getFullYear()`** en lugar del obsoleto `getYear()`.
* **Atención a la indexación en cero:** tanto `getMonth()` (`0-11`) como `getDay()` (`0-6`) comienzan a contar desde cero, mientras que `getDate()` (`1-31`) empieza desde uno.
