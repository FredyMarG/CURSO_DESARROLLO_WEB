// DevTools Lab — Pestaña Performance (Timeline)

const perfOutput = document.getElementById("perfOutput"); // Obtiene referencia DOM para "perfOutput"
const perfBox = document.getElementById("perfBox"); // Obtiene referencia DOM para "perfBox"

let animating = false; // Declara e inicializa "animating"
let rafId = null; // Declara e inicializa "rafId"
let angle = 0; // Declara e inicializa "angle"

function tick() { // Declara función
    if (!animating) return; // Evalúa condición
    angle = (angle + 4) % 360; // Asigna valor
    const x = Math.sin((angle * Math.PI) / 180) * 90 + 90; // Declara e inicializa "x"
    perfBox.style.transform = `translateX(${x.toFixed(1)}px)`; // Asigna valor
    rafId = requestAnimationFrame(tick); // Asigna valor
}

document.getElementById("btnAnimate").addEventListener("click", () => { // Registra escuchador de eventos
    animating = !animating; // Asigna valor
    if (animating) { // Evalúa condición
        perfOutput.textContent = "Animación rAF activa usando transform (sin Reflow)."; // Actualiza contenido en el DOM
        tick(); // Ejecuta llamada o método
    } else { // Instrucción JavaScript
        cancelAnimationFrame(rafId); // Ejecuta llamada o método
        perfOutput.textContent = "Animación detenida."; // Actualiza contenido en el DOM
    }
});

document.getElementById("btnLongTask").addEventListener("click", () => { // Registra escuchador de eventos
    const t0 = performance.now(); // Declara e inicializa "t0"
    // Bloqueo intencional de ~120 ms para observar un Long Task rojo en Flame Chart
    while (performance.now() - t0 < 120) { // Inicia bucle de iteración
        // Trabajo síncrono bloqueante
    }
    const duracion = (performance.now() - t0).toFixed(2); // Declara e inicializa "duracion"
    perfOutput.textContent =
        `Long Task completada en ${duracion} ms (> 50 ms).\n` +
        "Graba en DevTools → Performance para ver el bloque marcado en rojo."; // Instrucción JavaScript
});
