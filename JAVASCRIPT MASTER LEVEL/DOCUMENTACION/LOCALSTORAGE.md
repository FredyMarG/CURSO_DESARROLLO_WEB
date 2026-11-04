# GUÍA — Almacenamiento Web: LocalStorage y SessionStorage

> **Nivel:** Desde principiante hasta avanzado (Junior → Semi Senior)
> **Objetivo:** Comprender los mecanismos de persistencia de datos en el navegador, dominar la API de Web Storage (`setItem`, `getItem`, `removeItem`, `clear`), aprender a serializar datos complejos y descubrir cómo implementar la persistencia de preferencias del usuario en producción.

---

# 📚 Temario

1. ¿Qué es el Almacenamiento Web (Web Storage)?
2. Diferencias clave: LocalStorage vs. SessionStorage
3. Métodos fundamentales y anatomía de la API
4. Manejo de tipos de datos: El problema de la conversión implícita
5. Analogía del mundo real
6. Diagrama de flujo de decisión
7. Buenas prácticas y limitaciones
8. Errores comunes
9. Ejercicios prácticos
10. Solucionario paso a paso
11. Resumen

---

# ¿Qué es el Almacenamiento Web?

El **Web Storage** (Almacenamiento Web) es una API nativa de los navegadores modernos que permite a las aplicaciones web guardar datos de manera local en el dispositivo del usuario, bajo un formato de **clave-valor** (key-value).

A diferencia de las antiguas Cookies, el Web Storage está diseñado específicamente para el desarrollo web de Frontend: no se envía automáticamente al servidor en cada petición HTTP, ofrece una capacidad de almacenamiento mucho mayor (entre 5MB y 10MB según el navegador) y cuenta con una interfaz de JavaScript sumamente limpia y fácil de utilizar.

---

# Diferencias clave: LocalStorage vs. SessionStorage

Aunque ambos comparten exactamente los mismos métodos y propiedades, difieren drásticamente en su ciclo de vida y persistencia:

| Característica | LocalStorage 💾 | SessionStorage ⏱️ |
| :--- | :--- | :--- |
| **Persistencia** | Permanente. No expira al cerrar la pestaña o el navegador. | Temporal. Se destruye inmediatamente al cerrar la pestaña. |
| **Ámbito (Scope)** | Compartido entre todas las pestañas/ventanas con el mismo origen (protocolo, dominio y puerto). | Aislado por pestaña. Abrir la misma URL en otra pestaña crea una sesión nueva y vacía. |
| **Capacidad** | Generalmente hasta **5MB - 10MB**. | Generalmente hasta **5MB**. |
| **Casos de uso** | Preferencias de tema (oscuro/claro), tokens de sesión (JWT), idioma elegido, carrito de compras. | Datos de un formulario multipaso, estados temporales de una sola sesión de navegación. |

---

# Métodos fundamentales y anatomía de la API

La API de Web Storage es idéntica tanto para `localStorage` como para `sessionStorage`. Utiliza los siguientes cuatro métodos principales para gestionar la información:

### 1. Guardar datos: `setItem(clave, valor)`
Inserta un par clave-valor. Si la clave ya existe, actualiza su valor.
```javascript
localStorage.setItem("usuario", "Carlos");
```

### 2. Leer datos: `getItem(clave)`
Recupera el valor asociado a la clave. Si la clave no existe, devuelve `null`.
```javascript
const usuario = localStorage.getItem("usuario");
console.log(usuario); // Imprime: "Carlos"
```

### 3. Eliminar un elemento específico: `removeItem(clave)`
Borra la clave y su valor asociado del almacenamiento.
```javascript
localStorage.removeItem("usuario");
```

### 4. Vaciar todo el almacenamiento: `clear()`
Elimina **todas** las claves y valores guardados por el sitio web actual.
```javascript
localStorage.clear();
```

---

# Manejo de tipos de datos: JSON.stringify y JSON.parse

El protocolo de Web Storage **solo almacena cadenas de texto (strings)**. Si intentas guardar un objeto, un array o un booleano directamente, JavaScript invocará el método `.toString()` de forma implícita, rompiendo tus datos.

### ❌ El error de la conversión implícita:
```javascript
const configuracion = { tema: "oscuro", volumen: 80 };
localStorage.setItem("config", configuracion);

console.log(localStorage.getItem("config")); // Imprime: "[object Object]" (¡Datos perdidos!)
```

### ✅ La solución profesional (Serialización):
Para guardar estructuras de datos complejas, debes transformarlas a texto plano usando `JSON.stringify()` al guardar, y devolverlas a su estado original con `JSON.parse()` al leer.

```javascript
const configuracion = { tema: "oscuro", volumen: 80 };

// 1. Convertimos el objeto a string antes de guardar
localStorage.setItem("config", JSON.stringify(configuracion));

// 2. Recuperamos el string y lo transformamos de vuelta a un objeto JS
const configGuardada = JSON.parse(localStorage.getItem("config"));
console.log(configGuardada.tema); // Imprime: "oscuro"
```

---

# Analogía del mundo real: El archivador del escritorio 📂

Imagina que estás trabajando en tu oficina:

```
1. Tu escritorio de trabajo representa la Memoria RAM (las variables de JavaScript). Cuando te vas a dormir, el escritorio se limpia.
2. LocalStorage es como un archivador metálico en el rincón de tu oficina. Lo que guardes ahí se quedará guardado para siempre, incluso si apagas la luz y cierras la oficina durante las vacaciones.
3. SessionStorage es como un bloc de notas temporal sobre tu escritorio que usas para un cliente específico. Mientras atiendas a ese cliente (la pestaña abierta), el bloc mantiene sus notas; en cuanto el cliente se va y tiras el papel (cierras la pestaña), esa información desaparece.
```

---

# Diagrama de flujo de decisión

```
                ¿Necesitas guardar datos en el cliente?
                                  │
                                  ▼
               ¿Deben persistir al cerrar el navegador?
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼ SÍ                                              ▼ NO
  [ Usar LocalStorage ]                             [ Usar SessionStorage ]
         │                                                 │
         ├─────────────────────────<───────────────────────┘
         ▼
    ¿El dato es un Objeto o Array?
         │
         ├─────────────────────────┬───────────────────────┐
         ▼ SÍ                      │                       ▼ NO
[ Serializar con JSON.stringify ]  │              [ Guardar valor directo ]
         │                         │                       │
         ▼                         │                       ▼
 [ Guardar con .setItem() ] <──────┴─────────────── [ Guardar con .setItem() ]
```

---

# Buenas prácticas y limitaciones

✅ **Envuelve `JSON.parse` en un `try...catch`:** Si por algún motivo el contenido del almacenamiento se corrompe o es modificado externamente y no es un JSON válido, tu aplicación lanzará un error crítico y se romperá.

```javascript
const cargarAjustes = () => {
    try {
        const datos = localStorage.getItem("ajustes");
        return datos ? JSON.parse(datos) : null;
    } catch (error) {
        console.error("Error al parsear los datos de almacenamiento:", error);
        return null;
    }
};
```

✅ **Verifica la existencia antes de usar un dato:** Recuerda que `.getItem()` devuelve `null` si la clave no existe. Siempre define valores por defecto.

❌ **No guardes información confidencial:** Nunca almacenes contraseñas, números de tarjetas de crédito o datos médicos en Web Storage. Cualquier script de JavaScript ejecutado en tu sitio (incluyendo librerías externas o ataques XSS) puede leer esta información fácilmente mediante `localStorage.getItem()`.

---

# Errores comunes

### ❌ Asumir que los booleanos o números regresan con su tipo original
Dado que todo se transforma a texto, el valor `"false"` o el número `"0"` se recuperan como strings. En JavaScript, cualquier string no vacío es evaluado como verdadero (*truthy*).

```javascript
localStorage.setItem("estaLogueado", false);

// ❌ ERROR: El string "false" evalúa como true en un condicional
if (localStorage.getItem("estaLogueado")) {
    console.log("¡Bienvenido!"); // Se ejecutará erróneamente
}
```

### ❌ Intentar guardar datos sin límite en dispositivos móviles
Aunque el límite teórico en computadoras de escritorio suele ser de 5MB a 10MB, algunos navegadores móviles restringen severamente el espacio o eliminan el `localStorage` si el dispositivo se queda sin memoria de almacenamiento general.

---

# Ejercicios

## Nivel 1
Escribe un script que guarde una clave llamada `token` con el valor `"xyz123"` en el `sessionStorage`. Luego, recupera dicho valor, muéstralo en la consola del navegador y finalmente elimínalo de forma selectiva sin borrar el resto de elementos del almacenamiento.

## Nivel 2
Crea una función llamada `guardarHistorial` que reciba un array de strings (por ejemplo, búsquedas recientes de un usuario). La función debe almacenar dicho array en el `localStorage` de manera correcta bajo la clave `"busquedas"`. Crea también una función complementaria llamada `obtenerHistorial` que retorne el array original desde el almacenamiento (si no existe nada guardado, debe retornar un array vacío `[]`).

## Nivel 3 (Ejemplo de uso en producción: Sistema de Idioma)
Desarrolla un sistema básico para gestionar las preferencias de idioma de una aplicación web. Debes programar un objeto o conjunto de funciones que realicen lo siguiente:
1. Una función `cambiarIdioma(nuevoIdioma)` que guarde la preferencia en `localStorage`.
2. Una función `inicializarIdioma()` que verifique si ya existe un idioma guardado previamente por el usuario. Si existe, debe retornarlo; si no existe, debe guardar y retornar por defecto el idioma `"es"` (Español).

---

# Solucionario paso a paso

## Solución Nivel 1: Uso de SessionStorage

```javascript
// 1. Guardamos el token en la sesión temporal
sessionStorage.setItem("token", "xyz123");

// 2. Recuperamos el valor y lo imprimimos
const miToken = sessionStorage.getItem("token");
console.log("El token recuperado es:", miToken); // Imprime: xyz123

// 3. Eliminamos el token de forma específica
sessionStorage.removeItem("token");
```

## Solución Nivel 2: Guardar y recuperar Estructuras Complejas (Arrays)

```javascript
const guardarHistorial = (listaBusquedas) => {
    // Convertimos el array a una cadena JSON texto plano
    const arraySerializado = JSON.stringify(listaBusquedas);
    localStorage.setItem("busquedas", arraySerializado);
};

const obtenerHistorial = () => {
    const datosRaw = localStorage.getItem("busquedas");
    
    // Si datosRaw es null (no existe la clave), retornamos el array vacío []
    if (!datosRaw) {
        return [];
    }

    try {
        // Convertimos la cadena de texto de vuelta a un array de JavaScript
        return JSON.parse(datosRaw);
    } catch (error) {
        console.error("Historial corrupto, reseteando...", error);
        return [];
    }
};

// Pruebas:
guardarHistorial(["cursos js", "fetch api", "flexbox css"]);
console.log(obtenerHistorial()); // Imprime: ["cursos js", "fetch api", "flexbox css"]
```

## Solución Nivel 3: Sistema de Preferencia de Idioma

```javascript
// Llave de configuración global
const IDIOMA_KEY = "app_lang";

/**
 * Guarda la elección del usuario de forma permanente
 */
const cambiarIdioma = (nuevoIdioma) => {
    localStorage.setItem(IDIOMA_KEY, nuevoIdioma);
    console.log(`Idioma cambiado con éxito a: ${nuevoIdioma}`);
    
    // Aquí se ejecutaría la lógica para renderizar los textos de la interfaz (i18n)
};

/**
 * Determina el idioma inicial al cargar la aplicación
 */
const inicializarIdioma = () => {
    const idiomaGuardado = localStorage.getItem(IDIOMA_KEY);

    if (idiomaGuardado) {
        console.log(`Idioma cargado desde la configuración del usuario: ${idiomaGuardado}`);
        return idiomaGuardado;
    }

    // Configuración por defecto si el usuario entra por primera vez
    const idiomaPorDefecto = "es";
    localStorage.setItem(IDIOMA_KEY, idiomaPorDefecto);
    console.log(`Primera visita. Configurando idioma por defecto: ${idiomaPorDefecto}`);
    return idiomaPorDefecto;
};

// --- Ejemplo de flujo de ejecución al iniciar la App ---
const idiomaActual = inicializarIdioma(); // Imprime: "Primera visita..." y guarda "es"

// El usuario decide cambiar el idioma en la interfaz a inglés
cambiarIdioma("en"); // Imprime: "Idioma cambiado con éxito a: en"

// Si el usuario refresca la pantalla o vuelve días después:
const idiomaAlRecargar = inicializarIdioma(); // Imprime: "Idioma cargado desde la configuración del usuario: en"
```

---

# Resumen

* **`localStorage`** guarda información sin fecha de expiración, mientras que **`sessionStorage`** la borra de inmediato en cuanto se cierra la pestaña del navegador.
* Los métodos fundamentales son idénticos para ambos componentes: `.setItem()`, `.getItem()`, `.removeItem()` y `.clear()`.
* **Web Storage solo entiende strings**. El uso de `JSON.stringify()` y `JSON.parse()` es indispensable para manipular objetos y arrays sin corromperlos.
* Por motivos de **seguridad**, nunca debe utilizarse para almacenar credenciales críticas, tokens vulnerables a robo de identidad o información sensible de los usuarios.
