/**
 * ==============================================================================
 * 🎨 EJERCICIO PRÁCTICO: TEXTURIZADOR INTERACTIVO CON LA API DE DRAG & DROP
 * ==============================================================================
 * Archivo: main.js
 * Propósito: Permitir arrastrar cualquiera de las miniaturas (.textura1, .textura2,
 *            .textura3), transferir su identificador numérico mediante el objeto
 *            nativo 'e.dataTransfer' y aplicar dinámicamente la textura sobre la
 *            zona receptora ('.zona').
 * Documentación pedagógica detallada línea por línea.
 * ==============================================================================
 */

// ==============================================================================
// 1. DIRECTIVA DE MODO ESTRICTO Y SELECCIÓN DE ELEMENTOS DEL DOM
// ==============================================================================

// Activamos el modo estricto para garantizar código seguro y prevenir variables no declaradas
"use strict";

// Seleccionamos la zona receptora ('.zona') donde se soltarán y aplicarán las texturas
const zona = document.querySelector(".zona");

// Seleccionamos el contenedor padre ('.texturas') que agrupa todas las miniaturas arrastrables
const hijos = document.querySelector(".texturas");

// Seleccionamos los elementos auxiliares de la interfaz (píldora de estado y botón de reinicio)
const estadoTransfer = document.getElementById("estadoTransfer");
const btnResetZona = document.getElementById("btnResetZona");


// ==============================================================================
// 2. FUNCIÓN PARA CARGAR EL DATO EN dataTransfer (cambiarTextura)
// ==============================================================================

// Declaramos 'cambiarTextura' antes del bucle 'for' por buena práctica de orden de declaración.
// Esta función recibe el número de textura 'n' (1, 2 o 3) y el objeto del evento 'e':
const cambiarTextura = (n, e) => {
    // Almacenamos el índice 'n' bajo la clave "textura" dentro del contenedor temporal e.dataTransfer
    e.dataTransfer.setData("textura", n);

    // Añadimos la clase visual '.arrastrando' a la miniatura que el usuario acaba de sujetar
    e.currentTarget.classList.add("arrastrando");

    // Actualizamos la píldora superior para mostrar en vivo qué valor viaja dentro de dataTransfer
    if (estadoTransfer) {
        estadoTransfer.textContent = `dragstart ➔ e.dataTransfer.setData("textura", "${n}")`;
    }

    // Registramos en consola el inicio del transporte de la textura
    console.log(`[dragstart] Transportando textura #${n} en e.dataTransfer`);
};


// ==============================================================================
// 3. REGISTRO DINÁMICO DE EVENTOS DEL OBJETO EN CADA MINIATURA (.textura1..N)
// ==============================================================================

// Recorremos dinámicamente todos los hijos de '.texturas' desde 1 hasta 'hijos.children.length':
for (let i = 1; i <= hijos.children.length; i++) {
    // Seleccionamos cada miniatura específica usando plantillas literales (`.textura1`, `.textura2`, etc.)
    const miniatura = document.querySelector(`.textura${i}`);

    // Garantizamos por código que el atributo HTML 'draggable="true"' esté activo en el div
    miniatura.draggable = true;

    // 1. Evento 'dragstart': Se dispara en el instante en que el usuario comienza a arrastrar la miniatura
    miniatura.addEventListener("dragstart", (e) => cambiarTextura(i, e));

    // 2. Evento 'dragend': Se dispara cuando termina el arrastre (se haya soltado dentro o fuera de la zona)
    miniatura.addEventListener("dragend", (e) => {
        // Quitamos la clase '.arrastrando' para devolverle el 100% de opacidad a la miniatura
        e.currentTarget.classList.remove("arrastrando");
        // Quitamos el resaltado temporal de la zona por si el usuario canceló el arrastre
        zona.classList.remove("zona-activa");
    });
}


// ==============================================================================
// 4. EVENTOS DE LA ZONA RECEPTORA (dragenter, dragover, dragleave Y drop)
// ==============================================================================

// 1. Evento 'dragenter': Se activa cuando el cursor entra por primera vez en los límites de '.zona'
zona.addEventListener("dragenter", (e) => {
    e.preventDefault();
    // Iluminamos el borde del lienzo añadiendo la clase '.zona-activa'
    zona.classList.add("zona-activa");
    zona.setAttribute("data-mensaje", "¡Suelta aquí para aplicar la textura!");
});

// 2. Evento 'dragover': Se ejecuta continuamente mientras el cursor flota encima de '.zona'
zona.addEventListener("dragover", (e) => {
    // ✅ OBLIGATORIO: Por defecto el navegador prohíbe soltar elementos en un <div>;
    // invocar e.preventDefault() desbloquea la zona para permitir que se dispare el evento 'drop'.
    e.preventDefault();
});

// 3. Evento 'dragleave': Se activa si el cursor sale de '.zona' sin haber soltado la textura
zona.addEventListener("dragleave", () => {
    // Removemos el borde iluminado cian
    zona.classList.remove("zona-activa");

    // Restauramos el texto orientativo según haya o no una textura previamente aplicada
    const tieneTextura = zona.classList.contains("zona-aplicada");
    zona.setAttribute(
        "data-mensaje",
        tieneTextura ? "Arrastra otra miniatura para cambiar la textura" : "Arrastra y suelta una textura aquí"
    );
});

// 4. Evento 'drop': Se dispara cuando el usuario suelta el clic del ratón dentro de '.zona'
zona.addEventListener("drop", (e) => {
    // Prevenimos el comportamiento por defecto del navegador (evita abrir imágenes/archivos como URL)
    e.preventDefault();

    // Extraemos el número de textura que fue guardado durante 'dragstart' bajo la clave "textura"
    let n = e.dataTransfer.getData("textura");

    // Validamos que 'n' exista (por si el usuario arrastró un texto o elemento externo ajeno)
    if (!n) return;

    // ⚠️ Nota técnica clave:
    // Usamos 'style.backgroundImage' en lugar del atajo 'style.background' para NO sobrescribir
    // ni perder las propiedades 'background-size: cover' y 'background-repeat: no-repeat' del CSS:
    zona.style.backgroundImage = `url("img/textura${n}.jpg")`;

    // Actualizamos las clases de estado visual de la zona receptora
    zona.classList.remove("zona-activa");
    zona.classList.add("zona-aplicada");
    zona.setAttribute("data-mensaje", `✅ Textura ${n} aplicada (img/textura${n}.jpg)`);

    // Marcamos visualmente en la galería superior cuál es la miniatura activa actual
    Array.from(hijos.children).forEach((el, idx) => {
        el.classList.toggle("textura-activa", idx + 1 === Number(n));
    });

    // Actualizamos la píldora superior confirmando la lectura exitosa con getData()
    if (estadoTransfer) {
        estadoTransfer.textContent = `drop ➔ e.dataTransfer.getData("textura") === "${n}" ✅`;
    }

    console.log(`[drop] Textura #${n} aplicada con éxito: url("img/textura${n}.jpg")`);
});


// ==============================================================================
// 5. BOTÓN PARA REINICIAR EL LIENZO EN CUALQUIER MOMENTO
// ==============================================================================

if (btnResetZona) {
    btnResetZona.addEventListener("click", () => {
        // Limpiamos la imagen de fondo en línea y las clases de estado
        zona.style.backgroundImage = "none";
        zona.classList.remove("zona-activa", "zona-aplicada");
        zona.setAttribute("data-mensaje", "Arrastra y suelta una textura aquí");

        // Quitamos el indicador de textura activa de las miniaturas superiores
        Array.from(hijos.children).forEach((el) => el.classList.remove("textura-activa"));

        // Restauramos la píldora informativa superior
        if (estadoTransfer) {
            estadoTransfer.textContent = `e.dataTransfer.getData("textura") ➔ esperando arrastre...`;
        }

        console.log("[reset] Lienzo .zona restaurado a su estado inicial.");
    });
}
