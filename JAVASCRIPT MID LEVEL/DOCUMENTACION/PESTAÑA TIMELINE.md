# GUÍA — PESTAÑA TIMELINE / PERFORMANCE EN DEVTOOLS

---

# 📚 TEMARIO

1. ¿Qué es la pestaña Timeline/Performance?

2. Diferencia entre Timeline y Performance

3. ¿Para qué sirve realmente?

4. Qué mide esta herramienta

5. Anatomía completa de la interfaz

6. Uso y grabación

   * Iniciar grabación
   * Detener grabación
   * Recargar mientras graba
   * Analizar interacción

7. Screenshots y grabación

8. Controls

9. Overview

   * FPS
   * CPU
   * NET

10. Main Thread

11. Flame Chart

12. Call Stack

13. Details

14. Eventos importantes

15. Long Tasks

16. Renderizado y pintura

17. Layout y Reflow

18. Sugerencias de grabación

19. Detectar problemas de rendimiento

20. Casos prácticos reales

21. Errores comunes

22. Buenas prácticas

23. Flujo profesional de análisis

24. Ejercicios prácticos

25. Resumen final

---

# 🌐 ¿QUÉ ES LA PESTAÑA TIMELINE / PERFORMANCE?

En versiones antiguas de DevTools esta herramienta se llamaba:

```text
Timeline
```

Actualmente normalmente aparece como:

```text
Performance
```

---

# 🧠 DEFINICIÓN SIMPLE

La pestaña Performance permite grabar y analizar cómo trabaja una página web internamente.

---

# 🧠 DEFINICIÓN PROFESIONAL

La pestaña Performance es una herramienta de profiling y análisis temporal que registra la ejecución del navegador, incluyendo CPU, renderizado, JavaScript, eventos, frames y actividad de red para detectar problemas de rendimiento.

---

# 🚀 ¿PARA QUÉ SIRVE REALMENTE?

Performance sirve para descubrir:

✅ Por qué una página está lenta.
✅ Qué scripts consumen CPU.
✅ Qué eventos bloquean.
✅ Qué animaciones tienen lag.
✅ Qué partes renderizan demasiado.

---

# 🧠 ¿QUÉ MIDE ESTA HERRAMIENTA?

Performance analiza MUCHÍSIMAS cosas.

Ejemplo:

✅ FPS
✅ CPU
✅ Red
✅ JavaScript
✅ Rendering
✅ Paint
✅ Layout
✅ Memory
✅ Eventos

---

# 🔬 ¿QUÉ SIGNIFICA “PERFORMANCE”?

Performance significa:

```text
Qué tan eficientemente funciona una página web.
```

---

# 🐢 EJEMPLO DE MAL PERFORMANCE

Una página puede sentirse lenta porque:

✅ JavaScript bloquea.
✅ Hay demasiados cálculos.
✅ El renderizado tarda mucho.
✅ Las imágenes son pesadas.
✅ Hay demasiados eventos.

Performance ayuda a encontrar exactamente dónde ocurre.

---

# 🧩 INTERFAZ DE PERFORMANCE

La pestaña normalmente está dividida así:

```text
┌─────────────────────────────┐
│ Controls                    │
├─────────────────────────────┤
│ Overview                    │
│ FPS | CPU | NET             │
├─────────────────────────────┤
│ Flame Chart / Main Thread   │
├─────────────────────────────┤
│ Details                     │
└─────────────────────────────┘
```

---

# 🎬 USO Y GRABACIÓN

Aquí comienza el análisis real.

---

# 🔴 INICIAR GRABACIÓN

Botón:

```text
● Record
```

Comienza a registrar actividad.

---

# ⏹️ DETENER GRABACIÓN

Botón:

```text
■ Stop
```

Detiene captura y genera reporte.

---

# 🔄 RECARGAR MIENTRAS GRABA

Botón:

```text
Reload and Record
```

Hace:

1. Recarga página.
2. Graba desde el inicio.
3. Captura carga completa.

---

# 🧠 ¿POR QUÉ ES IMPORTANTE?

Porque muchos problemas ocurren DURANTE la carga inicial.

Ejemplo:

✅ JS pesado.
✅ CSS bloqueante.
✅ APIs lentas.

---

# 🖱️ ANALIZAR INTERACCIONES

Puedes grabar:

✅ Scroll.
✅ Clicks.
✅ Inputs.
✅ Menús.
✅ Animaciones.

Muy útil para debugging visual.

---

# 📸 SCREENSHOTS Y GRABACIÓN

Performance puede capturar screenshots automáticos.

---

# 🧠 ¿QUÉ HACE?

Mientras grabas:

```text
DevTools toma mini capturas de pantalla
```

---

# 🎞️ ¿PARA QUÉ SIRVE?

Permite relacionar:

```text
Qué estaba viendo el usuario
↓
Qué hacía el navegador internamente
```

---

# 🧪 EJEMPLO REAL

Problema:

```text
La animación se congela
```

Los screenshots permiten ver:

✅ Exactamente cuándo ocurrió.
✅ Qué frame se congeló.

---

# 🎛️ CONTROLS

La sección Controls contiene herramientas importantes.

---

# 🔴 RECORD

Graba actividad.

---

# ⏹️ STOP

Detiene grabación.

---

# 🔄 RELOAD

Recarga y graba automáticamente.

---

# ⚙️ SETTINGS

Permite configurar:

✅ Screenshots.
✅ Memory.
✅ CPU throttling.

---

# 🐢 CPU THROTTLING

Simula CPU lenta.

Ejemplo:

```text
4x slowdown
```

---

# 🧠 ¿PARA QUÉ SIRVE?

Permite probar:

✅ Celulares.
✅ Dispositivos lentos.
✅ Performance real.

---

# 📊 OVERVIEW

Overview es la parte superior del reporte.

---

# 🧠 ¿QUÉ MUESTRA?

Muestra gráficas generales de:

✅ FPS
✅ CPU
✅ NET

---

# 🎮 FPS

FPS significa:

```text
Frames Per Second
```

---

# 🧠 DEFINICIÓN SIMPLE

Mide cuántos cuadros por segundo renderiza la página.

---

# 🧠 DEFINICIÓN PROFESIONAL

FPS representa la frecuencia de renderizado visual del navegador y determina qué tan fluida se percibe una animación o interacción.

---

# 🚀 FPS IDEAL

Normalmente:

```text
60 FPS
```

Se considera fluido.

---

# 🐢 FPS BAJO

Si baja mucho:

```text
La página se siente trabada
```

---

# 🔥 CAUSAS DE FPS BAJO

✅ JavaScript pesado.
✅ Layout excesivo.
✅ Renderizado complejo.
✅ Animaciones malas.

---

# 🧠 CPU

Muestra cuánto trabaja el procesador.

---

# ⚡ CPU ALTA

Significa:

```text
El navegador está trabajando demasiado
```

---

# 🔥 ¿QUÉ PUEDE CONSUMIR CPU?

✅ Loops pesados.
✅ Renderizados.
✅ Eventos.
✅ Animaciones.

---

# 🌐 NET

Muestra actividad de red.

---

# 🧠 ¿QUÉ ANALIZA?

✅ Requests.
✅ Descargas.
✅ APIs.
✅ Recursos.

---

# 🧵 MAIN THREAD

Es el hilo principal del navegador.

---

# 🧠 DEFINICIÓN SIMPLE

Es donde ocurre casi todo el trabajo importante.

---

# 🧠 DEFINICIÓN PROFESIONAL

El Main Thread es el hilo principal de ejecución del navegador encargado de procesar JavaScript, renderizado, layout y eventos de interfaz.

---

# ⚠️ PROBLEMA IMPORTANTE

Si el Main Thread se bloquea:

```text
La página se congela
```

---

# 🔥 FLAME CHART

Una de las herramientas más profesionales.

---

# 🧠 ¿QUÉ ES?

Es una visualización temporal de ejecución.

Muestra:

✅ Funciones.
✅ Eventos.
✅ Tiempo consumido.
✅ Jerarquía de llamadas.

---

# 🧠 DEFINICIÓN PROFESIONAL

El Flame Chart es una representación gráfica de la pila de ejecución donde el ancho de cada bloque representa el tiempo consumido por una tarea.

---

# 🔥 ¿POR QUÉ SE LLAMA FLAME?

Porque visualmente parece fuego:

```text
▇▇▇▇▇▇
 ▇▇▇▇
  ▇▇
```

---

# 📏 ¿QUÉ SIGNIFICA EL ANCHO?

Mientras más ancho:

```text
Más tiempo consumió
```

---

# 🧪 EJEMPLO REAL

```javascript
for(let i=0;i<999999999;i++){}
```

Generará una barra enorme.

---

# 🧠 ¿PARA QUÉ SIRVE?

Permite detectar:

✅ Funciones lentas.
✅ Bloqueos.
✅ Loops pesados.
✅ Reflows.

---

# 📋 DETAILS

Cuando seleccionas un evento aparece información detallada.

---

# 🔬 INFORMACIÓN OFRECIDA

Details puede mostrar:

✅ Tipo de evento.
✅ Duración.
✅ Archivo.
✅ Función.
✅ Stack.

---

# 🧪 EJEMPLO

```text
click → 120ms
```

Significa:

```text
Ese click tardó demasiado
```

---

# ⚡ EVENTOS IMPORTANTES

---

# 🖱️ CLICK

Eventos de mouse.

---

# ⌨️ INPUT

Eventos de escritura.

---

# 🎨 PAINT

Cuando el navegador dibuja.

---

# 📐 LAYOUT

Cuando recalcula posiciones.

---

# 🧠 LONG TASKS

Tareas largas que bloquean el navegador.

---

# 🧠 DEFINICIÓN SIMPLE

Son tareas que duran demasiado tiempo.

---

# ⚠️ CONSECUENCIA

Provocan:

✅ Lag.
✅ Congelamientos.
✅ Scroll trabado.

---

# 🎨 RENDERIZADO Y PINTURA

El navegador debe:

1. Calcular posiciones.
2. Dibujar elementos.
3. Pintarlos.

---

# 📐 LAYOUT Y REFLOW

---

# 🧠 ¿QUÉ ES LAYOUT?

Calcular tamaños y posiciones.

---

# 🧠 ¿QUÉ ES REFLOW?

Recalcular layout nuevamente.

---

# ⚠️ MUCHOS REFLOWS = MAL PERFORMANCE

Porque el navegador trabaja demasiado.

---

# 🎯 SUGERENCIAS DE GRABACIÓN

Muy importante para obtener datos reales.

---

# ✅ GRABA POCO TIEMPO

No grabes minutos enteros.

Lo ideal:

```text
5-20 segundos
```

---

# ✅ HAZ UNA ACCIÓN ESPECÍFICA

Ejemplo:

✅ Abrir menú.
✅ Hacer scroll.
✅ Dar click.

---

# ✅ CIERRA PROGRAMAS PESADOS

Para obtener datos reales.

---

# ✅ USA CPU THROTTLING

Especialmente para móviles.

---

# ✅ ANALIZA UN PROBLEMA A LA VEZ

No intentes analizar todo simultáneamente.

---

# 🐛 DETECTAR PROBLEMAS DE RENDIMIENTO

---

# 🧪 CASO 1 — SCROLL LENTO

Proceso:

1. Grabar scroll.
2. Revisar FPS.
3. Revisar Main Thread.
4. Encontrar tarea pesada.

---

# 🧪 CASO 2 — ANIMACIÓN TRABADA

Proceso:

1. Grabar animación.
2. Revisar Flame Chart.
3. Revisar Paint.
4. Detectar render excesivo.

---

# 🧪 CASO 3 — CLICK CON LAG

Proceso:

1. Grabar click.
2. Revisar evento.
3. Revisar duración.
4. Encontrar función lenta.

---

# ❌ ERRORES COMUNES

---

# ❌ GRABAR DEMASIADO TIEMPO

Genera reportes gigantes.

---

# ❌ IGNORAR EL FLAME CHART

Ahí suelen estar los problemas reales.

---

# ❌ ANALIZAR SIN FILTRAR

Puede ser abrumador.

---

# ❌ NO USAR SCREENSHOTS

Ayudan muchísimo visualmente.

---

# ✅ BUENAS PRÁCTICAS

---

## ✅ Analiza tareas largas primero

Suelen ser el mayor problema.

---

## ✅ Observa FPS constantemente

Es clave para UX.

---

## ✅ Aprende Flame Chart profundamente

Es obligatorio profesionalmente.

---

## ✅ Usa grabaciones cortas

Más fáciles de analizar.

---

# 🚀 FLUJO PROFESIONAL DE ANÁLISIS

---

## PASO 1

Abrir Performance.

---

## PASO 2

Iniciar grabación.

---

## PASO 3

Realizar acción.

---

## PASO 4

Detener grabación.

---

## PASO 5

Revisar FPS.

---

## PASO 6

Revisar Flame Chart.

---

## PASO 7

Encontrar tareas pesadas.

---

# 🧪 EJERCICIOS PRÁCTICOS

---

# 🧪 EJERCICIO 1

Graba una página cargando.

Analiza:

✅ FPS
✅ CPU
✅ NET

---

# 🧪 EJERCICIO 2

Haz scroll mientras grabas.

Observa:

✅ Frames.
✅ Main Thread.

---

# 🧪 EJERCICIO 3

Activa screenshots.

Relaciona frames con eventos.

---

# 🧪 EJERCICIO 4

Encuentra una tarea larga.

Analiza duración.

---

# 🧪 EJERCICIO 5

Usa CPU throttling.

Compara rendimiento.

---

# 🏁 RESUMEN FINAL

La pestaña Timeline/Performance es:

✅ Un analizador temporal.
✅ Un profiler.
✅ Un debugger de rendimiento.
✅ Un monitor visual.
✅ Una herramienta profesional de optimización.

Dominarla significa:

🔥 Detectar problemas reales de rendimiento.
🔥 Encontrar bloqueos.
🔥 Optimizar animaciones.
🔥 Mejorar UX.
🔥 Pensar como ingeniero frontend profesional.

---

# 🎯 LO MÁS IMPORTANTE QUE DEBES DOMINAR

## Nivel Junior

✅ Grabar.
✅ Revisar FPS.
✅ Revisar CPU.

---

## Nivel Intermedio

✅ Flame Chart.
✅ Main Thread.
✅ Long Tasks.

---

## Nivel Profesional

✅ Profiling profundo.
✅ Optimización de rendering.
✅ Reflows.
✅ Performance móvil.
✅ Debugging avanzado de rendimiento.
