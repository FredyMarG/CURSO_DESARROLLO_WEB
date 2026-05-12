# GUÍA — PESTAÑA CONSOLE EN DEVTOOLS

---

# 📚 TEMARIO

1. ¿Qué es la pestaña Console?

2. ¿Para qué sirve realmente?

3. Cómo funciona internamente

4. Anatomía completa de la interfaz

5. Funcionamiento de la consola

6. Entrada y salida de datos

7. Ejecución de JavaScript en tiempo real

8. Apilamiento de mensajes

9. Tipos de mensajes

10. Show timestamps

11. Borrar historial

12. Conservar historial

13. Guardar historial

14. Elección del contexto de ejecución

15. Filtrado de resultados

16. Filtros por nivel de gravedad

    * Todos
    * Error
    * Warnings
    * Info
    * Logs
    * Debugs

17. Métodos de console

18. Stack traces

19. Mensajes interactivos

20. Objetos en consola

21. Errores comunes

22. Debugging profesional

23. Casos prácticos reales

24. Buenas prácticas

25. Flujo profesional de debugging

26. Ejercicios prácticos

27. Resumen final

---

# 🌐 ¿QUÉ ES LA PESTAÑA CONSOLE?

La pestaña Console es una herramienta que permite:

✅ Ver mensajes.
✅ Ver errores.
✅ Ejecutar JavaScript.
✅ Debuggear aplicaciones.

Todo en tiempo real.

---

# 🧠 DEFINICIÓN SIMPLE

La consola es un panel donde puedes comunicarte directamente con el navegador usando JavaScript.

---

# 🧠 DEFINICIÓN PROFESIONAL

La pestaña Console es una interfaz interactiva de debugging y ejecución que permite inspeccionar mensajes del navegador, errores, advertencias y ejecutar código JavaScript dinámicamente dentro del contexto de una página web.

---

# 🚀 ¿PARA QUÉ SIRVE REALMENTE?

Console es una de las herramientas más importantes del desarrollo web.

Se usa para:

✅ Encontrar errores.
✅ Probar código.
✅ Inspeccionar variables.
✅ Ver logs.
✅ Ejecutar pruebas rápidas.
✅ Debuggear aplicaciones.

---

# ⚙️ FUNCIONAMIENTO DE LA CONSOLA

La consola está conectada directamente con:

```text
Motor JavaScript del navegador
```

---

# 🧠 ¿QUÉ SIGNIFICA ESO?

Significa que cualquier código que escribas:

```javascript
2 + 2
```

Es ejecutado inmediatamente.

---

# ⚡ EJEMPLO

Escribes:

```javascript
alert("Hola")
```

El navegador ejecuta:

```text
Una alerta real
```

---

# 🔬 ¿CÓMO FUNCIONA INTERNAMENTE?

La consola:

1. Recibe código.
2. Lo envía al motor JavaScript.
3. El motor lo interpreta.
4. Devuelve el resultado.

---

# 🧩 INTERFAZ DE CONSOLE

La pestaña normalmente está dividida así:

```text
┌──────────────────────────────┐
│ Barra superior               │
│ Filtros | Contexto | Opciones│
├──────────────────────────────┤
│ Historial de mensajes        │
│                              │
│ Logs                         │
│ Errors                       │
│ Warnings                     │
├──────────────────────────────┤
│ Línea de ejecución           │
│ >                            │
└──────────────────────────────┘
```

---

# ⌨️ EJECUCIÓN DE JAVASCRIPT EN TIEMPO REAL

Puedes ejecutar:

✅ Variables.
✅ Funciones.
✅ DOM.
✅ Loops.
✅ Fetch.

---

# 🧪 EJEMPLO

```javascript
document.body.style.background = "black"
```

Resultado:

```text
La página cambia instantáneamente
```

---

# 📚 APILAMIENTO DE MENSAJES

La consola guarda mensajes en orden cronológico.

---

# 🧠 ¿QUÉ SIGNIFICA “APILAMIENTO”?

Significa que los mensajes se acumulan uno debajo del otro.

Ejemplo:

```text
[LOG] Hola
[WARN] Advertencia
[ERROR] Error detectado
```

---

# 🧠 ¿POR QUÉ ES IMPORTANTE?

Porque permite:

✅ Ver secuencia de ejecución.
✅ Entender flujo.
✅ Detectar dónde ocurrió un error.

---

# 📌 MENSAJES AGRUPADOS

La consola puede agrupar mensajes repetidos.

Ejemplo:

```text
"Error" x100
```

---

# 🕒 SHOW TIMESTAMPS

Opción:

```text
Show timestamps
```

---

# 🧠 ¿QUÉ HACE?

Muestra la hora exacta de cada mensaje.

Ejemplo:

```text
12:30:01 [LOG] Inicio
12:30:02 [ERROR] Fallo API
```

---

# 🚀 ¿PARA QUÉ SIRVE?

Muy útil para:

✅ Debugging.
✅ Performance.
✅ Analizar secuencias.

---

# 🗑️ BORRAR HISTORIAL

Botón:

```text
Clear console
```

---

# 🧠 ¿QUÉ HACE?

Elimina todos los mensajes visibles.

---

# 🚀 ¿POR QUÉ ES ÚTIL?

Permite:

✅ Empezar debugging limpio.
✅ Ver solo errores nuevos.

---

# ♻️ CONSERVAR HISTORIAL

Opción:

```text
Preserve log
```

---

# 🧠 ¿QUÉ HACE?

Evita que la consola se limpie al recargar.

---

# ⚠️ SIN PRESERVE LOG

Al recargar:

```text
La consola se limpia
```

---

# ✅ CON PRESERVE LOG

Los mensajes permanecen.

Muy útil para:

✅ Login.
✅ Redirects.
✅ Errores rápidos.

---

# 💾 GUARDAR HISTORIAL

Puedes exportar mensajes.

Opciones:

```text
Save as...
Copy console
```

---

# 🧠 ¿PARA QUÉ SIRVE?

Muy útil para:

✅ Compartir bugs.
✅ Guardar errores.
✅ Documentar debugging.

---

# 🌍 ELECCIÓN DEL CONTEXTO DE EJECUCIÓN

Muy importante profesionalmente.

---

# 🧠 ¿QUÉ ES EL CONTEXTO?

Es el entorno donde se ejecuta el código.

---

# 🧪 EJEMPLO

Una página puede tener:

✅ Página principal.
✅ iframes.
✅ extensiones.

Cada uno tiene su propio contexto.

---

# 🔄 CAMBIAR CONTEXTO

Dropdown:

```text
top
iframe
extension
```

---

# 🧠 ¿POR QUÉ ES IMPORTANTE?

Porque una variable puede existir en un frame pero no en otro.

---

# 🔍 FILTRADO DE RESULTADOS DE CONSOLE

Muy importante cuando hay MUCHOS mensajes.

---

# 🔎 BARRA DE FILTRO

Puedes escribir:

```text
error
```

Y mostrar solo mensajes relacionados.

---

# 🔎 FILTRAR POR PALABRAS CLAVE

Ejemplo:

```text
api
```

Mostrará:

```text
Logs relacionados con API
```

---

# 🚦 FILTROS POR NIVEL DE GRAVEDAD

La consola clasifica mensajes por importancia.

---

# 🌐 TODOS

Muestra todo.

---

# ❌ ERROR

Errores graves.

---

# 🧠 DEFINICIÓN

Errores que rompen ejecución o provocan fallos.

---

# 🧪 EJEMPLO

```javascript
usuario.nombre
```

Cuando:

```javascript
usuario = undefined
```

---

# ⚠️ WARNINGS

Advertencias.

---

# 🧠 DEFINICIÓN

Problemas potenciales que NO necesariamente rompen la aplicación.

---

# 🧪 EJEMPLO

```text
Deprecated API
```

---

# ℹ️ INFO

Mensajes informativos.

---

# 🧠 DEFINICIÓN

Mensajes que ayudan a entender el estado de la aplicación.

---

# 🧪 EJEMPLO

```javascript
console.info("Usuario autenticado")
```

---

# 📜 LOGS

Mensajes normales.

---

# 🧠 DEFINICIÓN

Mensajes generales de debugging.

---

# 🧪 EJEMPLO

```javascript
console.log("Hola")
```

---

# 🐞 DEBUGS

Mensajes especializados para debugging.

---

# 🧠 DEFINICIÓN

Mensajes técnicos detallados usados para análisis profundo.

---

# 🧪 EJEMPLO

```javascript
console.debug(usuario)
```

---

# 🛠️ MÉTODOS DE CONSOLE

La consola tiene MUCHOS métodos.

---

# 📜 console.log()

Mensaje normal.

---

# ❌ console.error()

Mensaje de error.

---

# ⚠️ console.warn()

Advertencia.

---

# ℹ️ console.info()

Información.

---

# 🐞 console.debug()

Debugging avanzado.

---

# 📊 console.table()

Muestra datos como tabla.

---

# 🧪 EJEMPLO

```javascript
console.table([
  {nombre:"Fredy",edad:20},
  {nombre:"Ana",edad:22}
])
```

---

# 📦 OBJETOS EN CONSOLA

La consola permite expandir objetos.

---

# 🧪 EJEMPLO

```javascript
console.log(window)
```

Puedes explorar:

✅ Métodos.
✅ Variables.
✅ Propiedades.

---

# 🧵 STACK TRACES

Muy importantes para debugging.

---

# 🧠 DEFINICIÓN SIMPLE

Muestran el camino del error.

---

# 🧠 DEFINICIÓN PROFESIONAL

Un stack trace es una representación de la cadena de llamadas de funciones que condujo a un error o ejecución específica.

---

# 🧪 EJEMPLO

```text
main()
 ↓
login()
 ↓
api()
 ↓
ERROR
```

---

# 💬 MENSAJES INTERACTIVOS

La consola no solo muestra texto.

Puede mostrar:

✅ Objetos.
✅ Arrays.
✅ Elementos DOM.
✅ Eventos.

---

# 🐛 DEBUGGING PROFESIONAL

---

# 🧪 CASO 1 — ERROR JAVASCRIPT

Proceso:

1. Abrir consola.
2. Filtrar errores.
3. Revisar stack trace.
4. Encontrar línea.
5. Corregir bug.

---

# 🧪 CASO 2 — API FALLA

Proceso:

1. Revisar logs.
2. Revisar response.
3. Revisar warnings.
4. Encontrar problema.

---

# 🧪 CASO 3 — LOGIN FALLA

Proceso:

1. Activar Preserve Log.
2. Hacer login.
3. Revisar redirect.
4. Detectar error.

---

# ❌ ERRORES COMUNES

---

# ❌ NO LIMPIAR CONSOLA

Puede dificultar debugging.

---

# ❌ IGNORAR WARNINGS

Muchos bugs comienzan como warnings.

---

# ❌ USAR SOLO console.log()

Existen métodos más organizados.

---

# ❌ NO USAR PRESERVE LOG

Puede ocultar errores importantes.

---

# ✅ BUENAS PRÁCTICAS

---

## ✅ Usa filtros constantemente

Ahorran muchísimo tiempo.

---

## ✅ Aprende stack traces

Es obligatorio profesionalmente.

---

## ✅ Usa console.table()

Muy útil con arrays.

---

## ✅ Usa diferentes niveles de log

Hace debugging más profesional.

---

# 🚀 FLUJO PROFESIONAL DE DEBUGGING

---

## PASO 1

Abrir Console.

---

## PASO 2

Limpiar historial.

---

## PASO 3

Activar Preserve Log.

---

## PASO 4

Ejecutar acción.

---

## PASO 5

Filtrar errores.

---

## PASO 6

Revisar stack trace.

---

## PASO 7

Corregir problema.

---

# 🧪 EJERCICIOS PRÁCTICOS

---

# 🧪 EJERCICIO 1

Ejecuta:

```javascript
2 + 2
```

---

# 🧪 EJERCICIO 2

Prueba:

```javascript
console.warn("Advertencia")
```

---

# 🧪 EJERCICIO 3

Activa:

```text
Show timestamps
```

Observa mensajes.

---

# 🧪 EJERCICIO 4

Activa:

```text
Preserve log
```

Recarga página.

---

# 🧪 EJERCICIO 5

Usa:

```javascript
console.table([
  {nombre:"A"},
  {nombre:"B"}
])
```

---

# 🏁 RESUMEN FINAL

La pestaña Console es:

✅ Un ejecutor JavaScript.
✅ Un debugger.
✅ Un visor de errores.
✅ Un monitor de logs.
✅ Una herramienta profesional de análisis.

Dominarla significa:

🔥 Encontrar errores más rápido.
🔥 Entender ejecución JavaScript.
🔥 Debuggear aplicaciones reales.
🔥 Analizar logs profesionalmente.
🔥 Pensar como desarrollador frontend/backend real.

---

# 🎯 LO MÁS IMPORTANTE QUE DEBES DOMINAR

## Nivel Junior

✅ console.log.
✅ Errores.
✅ Filtros.

---

## Nivel Intermedio

✅ Preserve Log.
✅ Stack traces.
✅ Contextos.

---

## Nivel Profesional

✅ Debugging avanzado.
✅ Logs estructurados.
✅ Performance debugging.
✅ Consola interactiva.
✅ Análisis profundo de ejecución.
