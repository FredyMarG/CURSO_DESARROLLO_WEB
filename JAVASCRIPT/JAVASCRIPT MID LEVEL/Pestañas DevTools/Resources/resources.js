// DevTools Lab — Pestaña Sources (Debugging)

const sourcesOutput = document.getElementById("sourcesOutput");

function aplicarDescuento(precio, porcentaje) {
    return precio - precio * (porcentaje / 100);
}

function calcularTotal() {
    let acumulado = 0;
    for (let i = 1; i <= 10; i++) {
        // Ideal para practicar Conditional Breakpoint: i === 5
        acumulado += aplicarDescuento(i * 10, 10);
    }
    return acumulado;
}

document.getElementById("btnRunLoop").addEventListener("click", () => {
    const total = calcularTotal();
    sourcesOutput.textContent = `calcularTotal() completado.\nResultado final: $${total.toFixed(2)}`; // Actualiza contenido en el DOM
});

document.getElementById("btnDebugger").addEventListener("click", () => {
    const contexto = { usuario: "dev", paso: "inspección manual" };
    // Si DevTools está abierto, esta sentencia pausa aquí automáticamente:
    debugger;
    sourcesOutput.textContent = `Ejecución reanudada tras debugger; (${JSON.stringify(contexto)})`; // Actualiza contenido en el DOM
});
