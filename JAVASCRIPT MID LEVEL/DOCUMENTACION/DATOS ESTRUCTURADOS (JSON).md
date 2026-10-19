# GUÍA — Datos Estructurados (JSON)

> **Nivel:** Desde principiante hasta avanzado (Junior → Semi Senior)
> **Objetivo:** Comprender qué es el formato JSON, sus reglas estrictas de sintaxis, y cómo transformar datos entre texto y objetos utilizando la serialización y deserialización en JavaScript.

---

# 📚 Temario

1. ¿Qué es JSON?
2. Definición, Usos y Sintaxis
3. El viaje de los datos: Red vs. Memoria
4. Serialización con `JSON.stringify()`
5. Deserialización con `JSON.parse()`
6. ¿Qué es un JSON Polyfill?
7. Analogía del mundo real
8. Diagrama de flujo conceptual
9. Buenas prácticas
10. Errores comunes (SyntaxError)
11. Ejercicios
12. Resumen

---

# ¿Qué es JSON?

JSON significa **JavaScript Object Notation** (Notación de Objetos de JavaScript). Aunque nació inspirado en la sintaxis de JavaScript, hoy en día es un formato de texto **completamente independiente del lenguaje**. 

Casi cualquier lenguaje de programación moderno (Python, Java, PHP, C#) puede leer y generar texto en formato JSON.

---

# Definición, Usos y Sintaxis

### ¿Para qué se usa?
JSON es el estándar de oro en la web para **intercambiar datos**. Se utiliza principalmente para enviar información desde un servidor hacia un navegador web, o entre diferentes aplicaciones a través de APIs HTTP.

### Reglas Estrictas de Sintaxis
A diferencia de un objeto literal de JavaScript, JSON tiene reglas muy rígidas. Si rompes una sola de estas reglas, el archivo quedará corrupto:

1. **Comillas dobles obligatorias:** Todas las propiedades (claves) y los valores de tipo texto *deben* envolverse en comillas dobles (`" propiedad "` / `" valor "`). Las comillas simples (`'`) son ilegales.
2. **Tipos de datos limitados:** JSON solo acepta los siguientes valores de datos:
   * Cadenas de texto (`strings`)
   * Números (`numbers`)
   * Objetos (`JSON objects`)
   * Arreglos (`arrays`)
   * Booleanos (`true` / `false`)
   * Valores nulos (`null`)
3. **Prohibido funciones y datos especiales:** No puedes guardar funciones, métodos, variables, fechas nativas (Date), `BigInt` ni `undefined` dentro de un JSON.
4. **Sin comas colgantes:** El último elemento de un objeto o de un arreglo **no** debe tener una coma al final.

### Comparación visual:

**Objeto JavaScript (Flexible):**
```javascript
const usuario = {
    nombre: 'Carlos', // Comillas simples y sin comillas en la clave
    edad: 28,
    activo: true, // Coma al final permitida
};
```

**Formato JSON (Estricto):**
```json
{
    "nombre": "Carlos",
    "edad": 28,
    "activo": true
}
```

---

# El viaje de los datos: Red vs. Memoria

Para entender por qué transformamos los datos, debemos entender cómo viajan:

*   **En la Memoria (JavaScript):** Los datos viven como estructuras complejas de objetos y arreglos interconectados. Los programas pueden leerlos y modificarlos instantáneamente, pero no se pueden enviar así a través de un cable de internet.
*   **En la Red (JSON):** Internet solo entiende de texto plano (una cadena de caracteres). Por lo tanto, antes de enviar un objeto por la red, debemos "aplanarlo" y convertirlo en texto.

---

# Serialización con `JSON.stringify()`

> **Definición:** La serialización es el proceso de convertir un objeto o valor de JavaScript en una cadena de texto plana con formato JSON.

Para lograr esto en JavaScript, utilizamos el método estático `JSON.stringify()`.

```javascript
const persona = {
    nombre: "Ana",
    roles: ["admin", "editor"],
    edad: 32
};

// Serializamos el objeto para poder enviarlo
const cadenaJSON = JSON.stringify(persona);

console.log(typeof cadenaJSON); // "string"
console.log(cadenaJSON); 
// Resultado: '{"nombre":"Ana","roles":["admin","editor"],"edad":32}'
```

---

# Deserialización con `JSON.parse()`

> **Definición:** La deserialización es el proceso inverso. Toma una cadena de texto plana que tiene una estructura JSON válida y la reconstruye en un objeto o valor nativo de JavaScript en la memoria.

Para esto utilizamos el método estático `JSON.parse()`.

```javascript
const respuestaDelServidor = '{"id": 101, "completado": true}';

// Deserializamos el texto para poder usarlo en nuestro código
const tarea = JSON.parse(respuestaDelServidor);

console.log(typeof tarea); // "object"
console.log(tarea.id);      // 101
console.log(tarea.completado); // true
```

---

# ¿Qué es un JSON Polyfill?

Hoy en día, el objeto global `JSON` y sus métodos (`parse()` y `stringify()`) están integrados de forma nativa en todos los navegadores modernos y entornos de ejecución. Sin embargo, esto no siempre fue así.

### El origen del Polyfill
Un **Polyfill** es un fragmento de código (normalmente una biblioteca de JavaScript) que se utiliza para proveer una funcionalidad moderna en navegadores antiguos que no la soportan de manera nativa.

*   Antes de que se estandarizara la especificación global de JavaScript (ECMAScript 5), los navegadores viejos (como Internet Explorer 7 o inferiores) no sabían qué era el objeto `JSON`.
*   Para solucionar esto, los desarrolladores de la época incluían un archivo script externo (como el famoso `json2.js` creado por Douglas Crockford) que actuaba como un **JSON Polyfill**.
*   **¿Cómo funcionaba?** El script verificaba: *"¿Existe el objeto nativo JSON en el navegador?"*. Si no existía, el Polyfill creaba un objeto manual llamado `JSON` en el espacio global de la ventana y programaba las funciones de parseo a nivel lógico analizando el texto caracter por caracter.

Hoy en día, gracias a los estándares modernos establecidos, el ecosistema utiliza polyfills avanzados para características de vanguardia (como parámetros específicos del contexto de revividores en entornos legacy de `core-js`), pero los métodos base de JSON están disponibles universalmente.

---

# Analogía de la mudanza de una casa 📦

Imagina que tienes una mesa de madera hermosa en tu sala (Objeto en Memoria). Quieres enviársela a un amigo que vive en otra ciudad por correo (Enviar por la Red).

```
1. No puedes meter la mesa armada directamente en un sobre postal.
2. Desarmas la mesa pieza por pieza y la metes en una caja plana de cartón.
   --> Esto es SERIALIZAR (JSON.stringify()).
3. Envías la caja plana por el camión de correo hacia el destino.
   --> Este es el viaje del texto plano JSON por el internet.
4. Tu amigo recibe la caja de cartón, la abre y vuelve a armar la mesa usando los tornillos.
   --> Esto es DESERIALIZAR (JSON.parse()).
```

---

# Diagrama de flujo conceptual

```
Objeto Complejo (Memoria)
       │
       ▼
 ┌───────────────┐
 │ JSON.stringify│  <─── Convierte el objeto a Texto plano
 └───────┬───────┘
         │
         ▼
 Cadena de texto JSON (Listo para viajar por la Red)
         │
         ▼
 ┌───────────────┐
 │  JSON.parse   │  <─── Reconstruye el texto a objeto nativo
 └───────┬───────┘
         │
         ▼
 Nuevo Objeto (Memoria)
```

---

# Buenas prácticas

✅ **Valida tu JSON antes de parsearlo:** Si recibes datos de una fuente externa inestable, introduce el método `JSON.parse()` dentro de un bloque `try/catch` para evitar que tu aplicación se detenga por completo si el texto viene corrupto.

✅ **Evita serializar referencias circulares:** Si un objeto `A` apunta a un objeto `B`, y el objeto `B` apunta de vuelta al objeto `A`, `JSON.stringify()` fallará catastróficamente arrojando un error de tipo `TypeError`.

✅ **Usa las opciones de formateo para depurar:** Puedes pasar parámetros adicionales a `JSON.stringify(objeto, null, 2)` para que el texto plano resultante se imprima de forma ordenada, indentada y legible para los ojos humanos en la consola.

---

# Errores comunes (SyntaxError)

Cuando `JSON.parse()` recibe una cadena de texto que no cumple perfectamente con las reglas de la gramática JSON, detendrá la ejecución del programa lanzando un **`SyntaxError`**.

### 1. El uso de comillas simples en las claves
```javascript
// ❌ INCORRECTO: Lanzará un SyntaxError
JSON.parse("{'nombre': 'Luis'}"); 

//  CORRECTO
JSON.parse('{"nombre": "Luis"}'); 
```

### 2. Comas colgantes al final del objeto
```javascript
// ❌ INCORRECTO: La coma después del 25 rompe las reglas de JSON
JSON.parse('{"nombre": "Luis", "edad": 25, }'); 

//  CORRECTO
JSON.parse('{"nombre": "Luis", "edad": 25}'); 
```

### 3. Olvidar poner comillas en las propiedades
```javascript
// ❌ INCORRECTO: La clave 'nombre' carece de comillas
JSON.parse('{nombre: "Luis"}'); 
```

---

# Ejercicios

## Nivel 1
Escribe manualmente un archivo de texto plano con extensión `.json` que guarde la información de tu perfil de desarrollador (nombre, tecnologías que dominas como un arreglo, y un sub-objeto con tus redes sociales). Valida que sea un JSON estrictamente válido.

## Nivel 2
Crea una función en JavaScript llamada `clonarObjeto(obj)` que reciba un objeto cualquiera y devuelva una copia exacta y profunda de él, utilizando únicamente los métodos de serialización y deserialización que aprendiste en esta guía.

## Nivel 3
Simula la recepción de una respuesta de API corrupta usando una cadena de texto mal formateada (por ejemplo, omitiendo una comilla doble). Escribe un bloque `try/catch` capaz de interceptar el `SyntaxError`, mostrando un mensaje amigable en la consola que diga `"Error: Los datos del servidor están dañados"`.

---

# Resumen

*   **JSON** es un formato de texto plano universal para el intercambio de datos, estrictamente basado en comillas dobles y tipos de datos primitivos.
*   **`JSON.stringify()`** realiza la **serialización**: transforma estructuras vivas de memoria en strings planos aptos para viajar por la red.
*   **`JSON.parse()`** realiza la **deserialización**: toma un string con formato JSON válido y lo reconstruye en un objeto de JavaScript utilizable.
*   Cualquier fallo de formato al usar `.parse()` disparará un **`SyntaxError`** que debe ser controlado.
*   Históricamente se usaban **JSON Polyfills** para dotar de soporte de parseo nativo a los navegadores que carecían de estas herramientas globales.
