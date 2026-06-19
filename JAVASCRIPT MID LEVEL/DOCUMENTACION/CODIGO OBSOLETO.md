# GUÍA — Código obsoleto en JavaScript

> **Nivel:** Intermedio - Profesional

> **Objetivo:** Aprender a identificar código obsoleto (deprecated), comprender sus consecuencias y adoptar las alternativas modernas recomendadas por los estándares actuales del desarrollo web.

---

# Índice

1. Introducción
2. ¿Qué significa trabajar de manera obsoleta?
3. ¿Cuándo algo se vuelve obsoleto?
4. ¿Qué significa `Deprecated`?
5. Código inútil
6. Código no recomendado
7. Código con Bugs o Fallos
8. Está por ser reemplazado
9. ¿Por qué existen mejores formas de hacerlo?
10. Efectos negativos del código obsoleto
11. Uso excesivo de recursos
12. Código innecesariamente largo
13. Impacto en el SEO
14. ¿Cómo verificar si algo está obsoleto?
15. Verificar mediante estándares oficiales
16. Métodos transformadores de cadenas obsoletos o no recomendados
17. Alternativas modernas
18. Comparaciones
19. Errores comunes
20. Casos prácticos
21. Debugging
22. Optimización
23. Buenas prácticas
24. Ejercicios
25. Resumen final

---

# 1. Introducción

JavaScript es un lenguaje que evoluciona constantemente.

Lo que hace algunos años era considerado una práctica correcta, hoy puede representar problemas de:

* Rendimiento.
* Seguridad.
* Compatibilidad.
* Mantenimiento.
* Escalabilidad.

Un error muy común en los desarrolladores principiantes es pensar:

> "Si funciona, entonces está bien."

Eso es incorrecto.

Un desarrollador profesional no solamente escribe código que funciona, sino código que pueda mantenerse y evolucionar con el tiempo.

---

# 2. ¿Qué significa trabajar de manera obsoleta?

Trabajar de manera obsoleta significa utilizar herramientas, métodos, propiedades, clases, funciones o metodologías antiguas cuando existen alternativas modernas más eficientes.

No significa que el código deje de funcionar inmediatamente.

Significa que:

* Ha perdido relevancia.
* Existen mejores alternativas.
* Puede desaparecer en el futuro.
* Presenta limitaciones.

---

## Analogía del mundo real

Imagina dos personas.

Persona A:

```text
Usa un teléfono de hace 20 años.
```

Persona B:

```text
Usa un smartphone moderno.
```

Ambos pueden hacer llamadas.

Sin embargo, uno posee:

* Mayor velocidad.
* Más herramientas.
* Más seguridad.

Lo mismo ocurre en programación.

---

# 3. ¿Cuándo algo se vuelve obsoleto?

Una tecnología se vuelve obsoleta cuando cumple una o varias de estas condiciones.

## Existen alternativas mejores

Ejemplo:

Antes:

```javascript
var nombre = "Fredy";
```

Ahora:

```javascript
const nombre = "Fredy";
```

o

```javascript
let nombre = "Fredy";
```

---

## Tiene problemas de seguridad

Puede permitir vulnerabilidades.

---

## Consume demasiados recursos

Puede consumir:

* CPU.
* RAM.
* Tiempo de procesamiento.

---

## Es difícil de mantener

Otros desarrolladores tendrán dificultades para comprenderlo.

---

## Los estándares dejan de recomendarlo

Los organismos oficiales dejan de promover su uso.

---

# 4. ¿Qué significa `Deprecated`?

`Deprecated` significa:

> Desaprobado, desaconsejado o marcado para dejar de utilizarse.

No significa:

```text
❌ Está roto.
```

Significa:

```text
⚠️ Todavía funciona, pero ya no deberías utilizarlo.
```

---

## Ciclo de vida de una tecnología

```text
Nueva
 ↓

Popular
 ↓

Deprecated
 ↓

Obsoleta
 ↓

Eliminada
```

---

## Ejemplo

```javascript
texto.big();
```

Todavía puede funcionar.

Sin embargo, ya no se recomienda utilizarlo.

---

# 5. Código inútil

El código inútil realiza operaciones innecesarias.

---

## Ejemplo incorrecto

```javascript
let numero = Number(parseInt("25"));
```

---

## Ejemplo correcto

```javascript
let numero = parseInt("25");
```

o

```javascript
let numero = Number("25");
```

---

# 6. Código no recomendado

El código no recomendado no está prohibido.

Simplemente existen mejores alternativas.

---

## Ejemplo

Evitar:

```javascript
document.write("Hola");
```

Utilizar:

```javascript
document.getElementById("mensaje").textContent = "Hola";
```

---

# 7. Código con Bugs o Fallos

El código antiguo puede producir errores inesperados.

---

## Ejemplo

```javascript
0 == false
```

Resultado:

```javascript
true
```

Porque JavaScript convierte los tipos automáticamente.

---

Utilizar:

```javascript
0 === false
```

Resultado:

```javascript
false
```

---

# 8. Está por ser reemplazado

Muchas tecnologías antiguas continúan existiendo únicamente por compatibilidad.

---

## Ejemplo

Antes:

```javascript
XMLHttpRequest
```

Ahora:

```javascript
fetch()
```

---

### Código antiguo

```javascript
const xhr = new XMLHttpRequest();

xhr.open("GET", "usuarios.json");

xhr.onload = function () {

 console.log(xhr.responseText);

};

xhr.send();
```

---

### Código moderno

```javascript
fetch("usuarios.json")
 .then(respuesta => respuesta.json())
 .then(datos => console.log(datos));
```

---

# 9. ¿Por qué existen mejores formas de hacerlo?

La evolución tecnológica busca:

```text
Menos código
     ↓

Más claridad
     ↓

Menos errores
     ↓

Mayor rendimiento
```

---

# 10. Efectos negativos del código obsoleto

El código obsoleto puede afectar:

* Métodos.
* Funciones.
* Propiedades.
* Clases.
* Objetos.
* Librerías.

---

# 11. Uso excesivo de recursos

Puede consumir demasiada memoria.

## Ejemplo

Incorrecto:

```javascript
for(let i=0;i<100000;i++){

 document.querySelector("#titulo");

}
```

Correcto:

```javascript
const titulo = document.querySelector("#titulo");

for(let i=0;i<100000;i++){

}
```

---

# 12. Código innecesariamente largo

Incorrecto:

```javascript
let persona = new Object();

persona.nombre = "Fredy";

persona.edad = 25;
```

---

Correcto:

```javascript
const persona = {

 nombre:"Fredy",

 edad:25

};
```

---

# 13. Impacto en el SEO

SEO significa:

```text
Search Engine Optimization
```

Es la optimización para motores de búsqueda.

---

## Consecuencias

El código obsoleto puede:

* Hacer más lenta la página.
* Aumentar el tiempo de carga.
* Empeorar la experiencia del usuario.
* Reducir el posicionamiento.

---

# 14. ¿Cómo verificar si algo está obsoleto?

Hazte estas preguntas.

## ¿Existe una forma más moderna?

---

## ¿Está marcado como Deprecated?

---

## ¿La documentación oficial lo recomienda?

---

## ¿Consume demasiados recursos?

---

## ¿Complica el mantenimiento?

---

# 15. Verificar mediante estándares oficiales

Fuentes confiables:

* MDN Web Docs.
* ECMAScript.
* W3C.
* WHATWG.

Nunca utilices únicamente tutoriales antiguos.

---

# 16. Métodos transformadores de cadenas obsoletos o no recomendados

Todos pertenecen a:

```javascript
String.prototype
```

---

## ¿Por qué no se recomiendan?

Porque mezclan:

```text
JavaScript
     +
HTML
     +
Presentación visual
```

Esto rompe la separación de responsabilidades.

---

# big()

Genera:

```html
<big>
```

```javascript
texto.big();
```

Resultado:

```html
<big>Hola</big>
```

---

# blink()

Genera:

```html
<blink>
```

```javascript
texto.blink();
```

Resultado:

```html
<blink>Hola</blink>
```

---

# bold()

Genera:

```html
<b>
```

```javascript
texto.bold();
```

Resultado:

```html
<b>Hola</b>
```

---

# fixed()

Genera:

```html
<tt>
```

```javascript
texto.fixed();
```

Resultado:

```html
<tt>Hola</tt>
```

---

# fontcolor()

Genera:

```html
<font color="">
```

```javascript
texto.fontcolor("red");
```

Resultado:

```html
<font color="red">Hola</font>
```

---

# fontsize()

Genera:

```html
<font size="">
```

```javascript
texto.fontsize(7);
```

Resultado:

```html
<font size="7">Hola</font>
```

---

# italics()

Genera:

```html
<i>
```

```javascript
texto.italics();
```

Resultado:

```html
<i>Hola</i>
```

---

# anchor()

Genera:

```html
<a>
```

Sin `href`.

```javascript
texto.anchor("inicio");
```

Resultado:

```html
<a name="inicio">Hola</a>
```

---

# link()

Genera:

```html
<a href="">
```

```javascript
texto.link("https://google.com");
```

Resultado:

```html
<a href="https://google.com">Hola</a>
```

---

# small()

Genera:

```html
<small>
```

```javascript
texto.small();
```

Resultado:

```html
<small>Hola</small>
```

---

# strike()

Genera:

```html
<strike>
```

```javascript
texto.strike();
```

Resultado:

```html
<strike>Hola</strike>
```

---

# sub()

Genera:

```html
<sub>
```

```javascript
texto.sub();
```

Resultado:

```html
<sub>Hola</sub>
```

---

# sup()

Genera:

```html
<sup>
```

```javascript
texto.sup();
```

Resultado:

```html
<sup>Hola</sup>
```

---

# 17. Alternativas modernas

❌ Evitar:

```javascript
texto.bold();
```

---

✅ Utilizar:

HTML

```html
<strong>Hola</strong>
```

o

```html
<span class="negrita">Hola</span>
```

CSS

```css
.negrita{

 font-weight: bold;

}
```

---

# 18. Comparaciones

| Código antiguo   | Código moderno |
| ---------------- | -------------- |
| var              | let / const    |
| XMLHttpRequest   | fetch          |
| ==               | ===            |
| document.write() | textContent    |
| Callback Hell    | async/await    |
| texto.bold()     | HTML + CSS     |

---

# 19. Errores comunes

❌ Pensar:

> Si funciona, está bien.

❌ No actualizar dependencias.

❌ No revisar documentación oficial.

❌ Utilizar tutoriales de hace 10 años.

---

# 20. Casos prácticos

## Caso 1

Código antiguo:

```javascript
document.write("Bienvenido");
```

Código moderno:

```javascript
document.getElementById("saludo").textContent = "Bienvenido";
```

---

## Caso 2

Código antiguo:

```javascript
var usuario = "Fredy";
```

Código moderno:

```javascript
const usuario = "Fredy";
```

---

# 21. Debugging

Preguntas importantes:

```text
¿Existe una alternativa moderna?

¿Está marcado como Deprecated?

¿Lo recomienda MDN?

¿Consume demasiados recursos?

¿Complica el mantenimiento?
```

---

# 22. Optimización

Objetivos:

```text
Menos líneas
Más claridad
Menos memoria
Más velocidad
Menos errores
```

---

# 23. Buenas prácticas

Siempre:

✅ Utilizar const.

✅ Utilizar let.

✅ Utilizar fetch().

✅ Utilizar async/await.

✅ Actualizar dependencias.

✅ Revisar documentación oficial.

✅ Separar HTML, CSS y JavaScript.

---

# 24. Ejercicios

## Ejercicio 1

Identifica lo obsoleto.

```javascript
document.write("Hola");

let texto = "Hola";

texto.big();
```

---

## Ejercicio 2

Convierte:

```javascript
var nombre = "Fredy";
```

a una versión moderna.

---

## Ejercicio 3

Reemplaza:

```javascript
XMLHttpRequest
```

por:

```javascript
fetch()
```

---

# 25. Resumen final

El código obsoleto no siempre deja de funcionar, pero deja de ser una buena práctica.

Un desarrollador profesional debe:

* Identificar código deprecated.
* Actualizar metodologías.
* Seguir los estándares oficiales.
* Priorizar el rendimiento.
* Reducir errores.
* Escribir código mantenible.

---

# Regla de oro

> Si existe una forma más segura, más rápida, más sencilla y más mantenible de hacer algo, probablemente la forma antigua ya está en proceso de quedar obsoleta.

Y recuerda:

> El código que funciona hoy no siempre será el código correcto para mañana.
