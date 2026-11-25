// DevTools Lab — Pestaña Performance (Timeline)

const perfOutput = document.getElementById("perfOutput"); // Declara e inicializa variable local
const perfBox = document.getElementById("perfBox"); // Declara e inicializa variable local

let animating = false; // Declara e inicializa variable local
let rafId = null; // Declara e inicializa variable local
let angle = 0; // Declara e inicializa variable local

function tick() { // Define función reutilizable
    if (!animating) return; // Evalúa condición lógica
    angle = (angle + 4) % 360;
    const x = Math.sin((angle * Math.PI) / 180) * 90 + 90; // Declara e inicializa variable local
    perfBox.style.transform = `translateX(${x.toFixed(1)}px)`;
    rafId = requestAnimationFrame(tick);
}

document.getElementById("btnAnimate").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    animating = !animating;
    if (animating) { // Evalúa condición lógica
        perfOutput.textContent = "Animación rAF activa usando transform (sin Reflow)."; // Actualiza contenido en el DOM
        tick();
    } else {
        cancelAnimationFrame(rafId);
        perfOutput.textContent = "Animación detenida."; // Actualiza contenido en el DOM
    }
});

document.getElementById("btnLongTask").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    const t0 = performance.now(); // Declara e inicializa variable local
    // Bloqueo intencional de ~120 ms para observar un Long Task rojo en Flame Chart
    while (performance.now() - t0 < 120) { // Ejecuta bucle mientras se cumpla la condición
        // Trabajo síncrono bloqueante
    }
    const duracion = (performance.now() - t0).toFixed(2); // Declara e inicializa variable local
    perfOutput.textContent =
        `Long Task completada en ${duracion} ms (> 50 ms).\n` +
        "Graba en DevTools → Performance para ver el bloque marcado en rojo.";
});

