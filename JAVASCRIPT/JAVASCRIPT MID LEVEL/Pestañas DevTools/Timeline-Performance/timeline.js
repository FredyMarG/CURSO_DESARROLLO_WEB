// DevTools Lab — Pestaña Performance (Timeline)

const perfOutput = document.getElementById("perfOutput");
const perfBox = document.getElementById("perfBox");

let animating = false;
let rafId = null;
let angle = 0;

function tick() {
    if (!animating) return;
    angle = (angle + 4) % 360;
    const x = Math.sin((angle * Math.PI) / 180) * 90 + 90;
    perfBox.style.transform = `translateX(${x.toFixed(1)}px)`;
    rafId = requestAnimationFrame(tick);
}

document.getElementById("btnAnimate").addEventListener("click", () => {
    animating = !animating;
    if (animating) {
        perfOutput.textContent = "Animación rAF activa usando transform (sin Reflow)."; // Actualiza contenido en el DOM
        tick();
    } else {
        cancelAnimationFrame(rafId);
        perfOutput.textContent = "Animación detenida."; // Actualiza contenido en el DOM
    }
});

document.getElementById("btnLongTask").addEventListener("click", () => {
    const t0 = performance.now();
    // Bloqueo intencional de ~120 ms para observar un Long Task rojo en Flame Chart
    while (performance.now() - t0 < 120) {
        // Trabajo síncrono bloqueante
    }
    const duracion = (performance.now() - t0).toFixed(2);
    perfOutput.textContent =
        `Long Task completada en ${duracion} ms (> 50 ms).\n` +
        "Graba en DevTools → Performance para ver el bloque marcado en rojo.";
});
