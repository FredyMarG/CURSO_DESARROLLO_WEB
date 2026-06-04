/**
 * GUÍA DE EVENTOS DE MOUSE EN JAVASCRIPT
 * Este script demuestra el funcionamiento de los principales eventos de interacción 
 * con el puntero sobre un elemento del DOM.
 */

const btn = document.getElementById("btn");

/**
 * dblclick: Se dispara tras dos clics rápidos en el mismo elemento.
 */
btn.addEventListener("dblclick", function() {
    alert("¡Has hecho doble clic en el botón!");
});

/**
 * mouseover: Se dispara cuando el puntero entra al elemento o a uno de sus hijos.
 * Nota: Este evento "burbujea" (se propaga hacia los padres).
 */
btn.addEventListener("mouseover", function() {
    console.log("¡El mouse está sobre el botón (mouseover)!");
});

/**
 * mouseout: Se dispara cuando el puntero sale del elemento o entra en un elemento hijo.
 */
btn.addEventListener("mouseout", function() {
    console.log("¡El mouse ha salido del botón o entró a un hijo (mouseout)!");
});

/**
 * mousedown: Ocurre en el momento exacto en que se presiona un botón del mouse.
 */
btn.addEventListener("mousedown", function() {
    console.log("¡Has presionado el botón!");
});

/**
 * mouseup: Ocurre cuando el usuario suelta el botón del mouse que estaba presionado.
 */
btn.addEventListener("mouseup", function() {
    console.log("¡Has liberado el botón!");
});

/**
 * contextmenu: Se dispara justo antes de abrir el menú contextual (clic derecho).
 * e.preventDefault(): Cancela el menú por defecto del navegador.
 */
btn.addEventListener("contextmenu", function(e) {
    e.preventDefault();
    alert("¡Has hecho clic derecho en el botón!");
});

/**
 * mousemove: Se ejecuta constantemente mientras el puntero se desplaza sobre el elemento.
 * clientX/clientY: Devuelven la posición X e Y del mouse respecto a la ventana.
 */
btn.addEventListener("mousemove", function(e) {
    console.log(`¡El mouse se mueve sobre el botón! Coordenadas: (${e.clientX}, ${e.clientY})`);
});

/**
 * wheel: Se activa al girar la rueda del mouse o usar el scroll del trackpad sobre el elemento.
 * e.deltaY: Indica la dirección del desplazamiento (positivo hacia abajo, negativo hacia arriba).
 */
btn.addEventListener("wheel", function(e) {
    console.log(`¡Has usado la rueda del mouse sobre el botón! Delta: ${e.deltaY}`);
});

/**
 * mouseenter: Similar a mouseover, pero NO burbujea. Solo se activa al entrar al elemento padre.
 */
btn.addEventListener("mouseenter", function() {
    console.log("¡El mouse ha entrado en el área del botón!");
});

/**
 * mouseleave: Similar a mouseout, pero NO burbujea. Solo se activa al salir del elemento padre.
 */
btn.addEventListener("mouseleave", function() {
    console.log("¡El mouse ha salido del área del botón!");
});

/**
 * auxclick: Se dispara al hacer clic con un botón no primario (ej. el botón central/rueda).
 */
btn.addEventListener("auxclick", function() {
    console.log("¡Has hecho clic en el botón con el mouse auxiliar!");
});
