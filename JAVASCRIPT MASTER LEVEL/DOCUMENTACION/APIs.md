# GUÍA — Las APIs en el Desarrollo Web (Consumo con Fetch)

> **Nivel:** Desde principiante hasta avanzado (Junior → Semi Senior)
> **Objetivo:** Comprender la arquitectura de comunicación entre cliente y servidor mediante APIs REST, dominar la sintaxis moderna de `fetch()` con `async/await` y aprender cuándo y cómo manejar respuestas, cabeceras y errores de red de forma profesional.

---

# 📚 Temario

1. Definición de una API
2. Sintaxis básica y anatomía de una petición
3. Evaluación y conversión implícita (JSON)
4. Comparativa: `XMLHttpRequest` tradicional vs. `fetch()` moderno
5. Analogía del mundo real
6. Diagrama de flujo de decisión
7. Buenas prácticas
8. Errores comunes
9. Ejercicios
10. Solucionario paso a paso
11. Resumen

---

# ¿Qué es una API?

Una **API** (*Application Programming Interface* o Interfaz de Programación de Aplicaciones) es un conjunto de reglas y protocolos que permite que **dos aplicaciones diferentes se comuniquen entre sí**. En el desarrollo web, se utiliza comúnmente para que el *Frontend* (navegador) solicite o envíe datos al *Backend* (servidor).

A diferencia de una base de datos local o estática, una API web (especialmente bajo el estándar **REST**) funciona mediante el ciclo de **Petición-Respuesta HTTP**. Esto significa que el cliente realiza una llamada a una dirección específica y el servidor **procesa y devuelve datos estructurados** (generalmente en formato JSON), permitiendo construir aplicaciones dinámicas y conectadas en tiempo real.

---

# Sintaxis básica y anatomía de una petición

La sintaxis moderna en JavaScript para interactuar con una API utiliza la función nativa `fetch()` combinada con un objeto de configuración:

```javascript
fetch(endpoint, { metodo, cabeceras, cuerpo });
```

### 🔍 Desglose de los elementos clave:
1. **Endpoint (URL):** La dirección única a la que apuntamos para acceder a un recurso específico (ej. `https://api.tienda.com/productos`).
2. **Método HTTP (`method`):** Define la intención de la acción. Los principales son `GET` (leer), `POST` (crear), `PUT`/`PATCH` (actualizar) y `DELETE` (eliminar).
3. **Cabeceras (`headers`):** Metadatos adicionales enviados en la petición, como el tipo de contenido (`Content-Type: application/json`) o credenciales de autorización (`Authorization`).
4. **Cuerpo (`body`):** Los datos reales que enviamos al servidor (usado en `POST` o `PUT`), convertidos previamente a cadena de texto JSON.
5. **Respuesta (`Response`):** El paquete que devuelve el servidor, el cual incluye un código de estado HTTP (ej. `200 OK`, `404 Not Found`, `500 Server Error`) y los datos solicitados.

---

# Evaluación y conversión implícita (JSON)

Debido a que `fetch()` devuelve una **Promesa** que se resuelve con los encabezados de la respuesta antes de descargar todo el contenido, necesitamos un segundo paso asíncrono (`.json()`) para extraer y convertir el texto plano en un objeto JavaScript utilizable.

```javascript
const obtenerUsuario = async () => {
    // 1. Realizamos la petición al endpoint
    const respuesta = await fetch("https://jsonplaceholder.typicode.com/users/1");
    
    // 2. Transformamos el flujo de datos JSON en un objeto de JavaScript
    const usuario = await respuesta.json();

    console.log(usuario.name); // Imprime: "Leanne Graham"
};

obtenerUsuario();
```

---

# Comparativa: `XMLHttpRequest` vs. `fetch()` Moderno

Para entender la evolución del lenguaje y la reducción de código repetitivo (*boilerplate*), observemos cómo se realiza una petición HTTP con el enfoque antiguo frente al estándar moderno:

### Estructura tradicional (`XMLHttpRequest`)
```javascript
const xhr = new XMLHttpRequest();
xhr.open("GET", "https://api.ejemplo.com/datos");

xhr.onload = function() {
    if (xhr.status === 200) {
        const datos = JSON.parse(xhr.responseText);
        console.log(datos);
    } else {
        console.error("Error en la petición");
    }
};

xhr.send();
```

### Estructura moderna (`fetch` con `async/await`)
```javascript
// Código limpio, secuencial y fácil de leer
const cargarDatos = async () => {
    const res = await fetch("https://api.ejemplo.com/datos");
    const datos = await res.json();
    console.log(datos);
};
```

---

# Analogía del mundo real: El camarero en un restaurante 🍽️

Imagina que estás sentado en la mesa de un restaurante con el menú en la mano:

```
1. Tú eres el Cliente (Frontend) y la Cocina es el Servidor (Backend) donde están los ingredientes (Base de Datos).
2. No puedes entrar directamente a la cocina por seguridad; necesitas un intermediario: el Camarero (la API).
3. Le haces un pedido específico al camarero (Petición HTTP / Request).
4. El camarero lleva la orden a la cocina, espera a que esté lista y regresa a tu mesa con tu plato servido (Respuesta HTTP / JSON).

Si pides algo que no existe en el menú, el camarero vuelve y te dice: "Lo siento, no tenemos ese plato" (Error 404 Not Found).
```

---

# Diagrama de flujo de decisión

```
             [ Enviar Petición fetch(url) ]
                           │
                           ▼
             [ Recibir Objeto Response ]
                           │
              ┌────────────┴────────────┐
              ▼ ¿response.ok === true?  ▼ ¿response.ok === false?
         (Status 200-299)          (Status 400-599)
              │                         │
              ▼                         ▼
    [ Extraer res.json() ]     [ Lanzar throw new Error() ]
              │                         │
              ▼                         ▼
    [ Usar Datos en App ]      [ Capturar en bloque catch ]
```

---

# Buenas prácticas

✅ **Valida siempre `response.ok`:** `fetch()` solo rechaza una promesa si se cae el internet o falla el DNS. Si el servidor devuelve un error `404` o `500`, `fetch()` lo considera exitoso; debes verificar `response.ok` manualmente.

✅ **Envuelve tus llamadas en bloques `try...catch`:** Las operaciones de red son propensas a fallos externos. Maneja siempre los errores para evitar que tu aplicación se rompa silenciosamente.

```javascript
const obtenerProductos = async () => {
    try {
        const res = await fetch("https://api.tienda.com/items");
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("No se pudieron cargar los productos:", error.message);
    }
};
```

✅ **Oculta tus credenciales (API Keys):** Nunca escribas llaves secretas directamente en el código del navegador. Utiliza variables de entorno (`.env`) desde un servidor intermedio.

---

# Errores comunes

### ❌ Olvidar el `await` al convertir a `.json()`
El método `.json()` también es asíncrono y devuelve una Promesa. Si olvidas colocar `await` delante de él, obtendrás `Promise { <pending> }` en lugar de tus datos.

```javascript
// ❌ EVITAR ESTO: 'datos' será una promesa pendiente, no el objeto real
const res = await fetch("https://api.ejemplo.com/usuarios");
const datos = res.json(); 
console.log(datos); // Imprime: Promise { <pending> }
```

### ❌ Enviar objetos planos en el `body` sin serializar
El protocolo HTTP transmite texto, no objetos nativos de JavaScript. Enviar un objeto directamente en una petición `POST` sin usar `JSON.stringify()` ni declarar la cabecera `Content-Type` hará que el servidor rechace o malinterprete los datos.

```javascript
// ❌ INCORRECTO: El servidor recibirá "[object Object]"
await fetch("https://api.ejemplo.com/usuarios", {
    method: "POST",
    body: { nombre: "Carlos" } 
});
```

---

# Ejercicios

## Nivel 1
Escribe una función asíncrona llamada `obtenerClima` que realice una petición `GET` a la URL `"https://api.clima.com/hoy"`. Convierte la respuesta a formato JSON y guarda el resultado en una constante llamada `datosClima`, imprimiéndola por consola.

## Nivel 2
Optimiza y corrige el siguiente bloque de código agregando manejo de errores con `try...catch` y verificando que `respuesta.ok` sea verdadero antes de procesar el JSON. Si no es `ok`, lanza un error con el mensaje `"Recurso no encontrado"`:
```javascript
const buscarPokemon = async (nombre) => {
    const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
    const data = await respuesta.json();
    console.log(data.name);
};
```

## Nivel 3
Crea una función flecha asíncrona llamada `crearPublicacion` que reciba dos parámetros: `titulo` y `contenido`. La función debe enviar una petición `POST` a `"https://jsonplaceholder.typicode.com/posts"`, configurando los `headers` con `"Content-Type": "application/json"` y enviando en el `body` un objeto serializado con ambas propiedades. Finalmente, debe retornar el objeto JSON devuelto por el servidor.

---

# Solucionario paso a paso

## Solución Nivel 1: Petición `GET` básica

### 🎯 Objetivo
Realizar una consulta simple utilizando `async/await` y desempaquetar el cuerpo de la respuesta mediante `.json()`.

```javascript
const obtenerClima = async () => {
    // 1. Esperamos a que el servidor responda a nuestra solicitud GET (método por defecto)
    const respuesta = await fetch("https://api.clima.com/hoy");
    
    // 2. Esperamos la conversión del flujo de datos JSON a un objeto de JavaScript
    const datosClima = await respuesta.json();
    
    // 3. Mostramos el resultado final en consola
    console.log(datosClima);
};

obtenerClima();
```

> **💡 Nota clave:** Recuerda que tanto `fetch()` como `.json()` son métodos asíncronos que devuelven Promesas, por lo que **ambos** requieren la palabra reservada `await`.

## Solución Nivel 2: Manejo de errores con `try...catch` y `response.ok`

### 🎯 Objetivo
Proteger la aplicación frente a caídas de red y errores de estado HTTP (como un `404 Not Found` cuando un Pokémon no existe).

```javascript
const buscarPokemon = async (nombre) => {
    try {
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
        
        // Validamos si el código de estado HTTP NO está en el rango 200-299
        if (!respuesta.ok) {
            throw new Error("Recurso no encontrado");
        }
        
        const data = await respuesta.json();
        console.log(data.name);
    } catch (error) {
        // Captura tanto fallos de red como el error personalizado que lanzamos arriba
        console.error("Hubo un problema con la petición:", error.message);
    }
};

// Pruebas:
buscarPokemon("pikachu");    // Imprime: "pikachu"
buscarPokemon("noexiste123"); // Imprime: "Hubo un problema con la petición: Recurso no encontrado"
```

> **💡 Nota clave:** Al lanzar `throw new Error(...)`, la ejecución salta inmediatamente al bloque `catch`, evitando que el programa intente ejecutar `respuesta.json()` sobre una respuesta fallida.

## Solución Nivel 3: Petición `POST` con `headers` y `body`

### 🎯 Objetivo
Enviar información nueva hacia un servidor configurando los metadatos de la petición y serializando el objeto de JavaScript a texto plano JSON.

```javascript
const crearPublicacion = async (titulo, contenido) => {
    try {
        const respuesta = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST", // Especificamos que vamos a crear un recurso
            headers: {
                // Indicamos al servidor que le estamos enviando texto en formato JSON
                "Content-Type": "application/json"
            },
            // Convertimos el objeto de JS a una cadena de texto JSON válida
            body: JSON.stringify({
                titulo: titulo,
                contenido: contenido
            })
        });

        if (!respuesta.ok) {
            throw new Error(`Error al crear la publicación: ${respuesta.status}`);
        }

        // Convertimos y retornamos la respuesta del servidor (que suele incluir el ID asignado)
        const publicacionCreada = await respuesta.json();
        return publicacionCreada;

    } catch (error) {
        console.error(error.message);
        return null;
    }
};

// Ejemplo de uso:
crearPublicacion("Aprendiendo APIs", "El uso de fetch es muy poderoso.")
    .then(resultado => console.log("Respuesta del servidor:", resultado));
```

> **💡 Nota clave:** En JavaScript moderno (ES6+), cuando el nombre de la propiedad de un objeto coincide exactamente con el nombre de la variable (`titulo: titulo`), puedes abreviarlo simplemente escribiendo `JSON.stringify({ titulo, contenido })`.

---

# Resumen

* **Una API** es el puente de comunicación que permite intercambiar información entre el cliente y el servidor mediante peticiones HTTP.
* **`fetch()` junto con `async/await`** es el estándar moderno en JavaScript para consumir APIs de manera asíncrona y legible.
* **La conversión a `.json()` es obligatoria y asíncrona**, y siempre debe ir acompañada de la validación `response.ok` dentro de un bloque `try...catch` para garantizar un software robusto.
