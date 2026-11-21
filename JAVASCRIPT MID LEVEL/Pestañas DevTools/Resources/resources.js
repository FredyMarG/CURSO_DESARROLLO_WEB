// DevTools Lab — Pestaña Sources (Debugging)

const sourcesOutput = document.getElementById("sourcesOutput"); // Obtiene referencia DOM para "sourcesOutput"

function aplicarDescuento(precio, porcentaje) { // Declara función
    return precio - precio * (porcentaje / 100); // Retorna resultado
}

function calcularTotal() { // Declara función
    let acumulado = 0; // Declara e inicializa "acumulado"
    for (let i = 1; i <= 10; i++) { // Inicia bucle de iteración
        // Ideal para practicar Conditional Breakpoint: i === 5
        acumulado += aplicarDescuento(i * 10, 10); // Ejecuta llamada o método
    }
    return acumulado; // Retorna resultado
}

document.getElementById("btnRunLoop").addEventListener("click", () => { // Registra escuchador de eventos
    const total = calcularTotal(); // Declara e inicializa "total"
    sourcesOutput.textContent = `calcularTotal() completado.\nResultado final: $${total.toFixed(2)}`; // Actualiza contenido en el DOM
});

document.getElementById("btnDebugger").addEventListener("click", () => { // Registra escuchador de eventos
    const contexto = { usuario: "dev", paso: "inspección manual" }; // Declara e inicializa "contexto"
    // Si DevTools está abierto, esta sentencia pausa aquí automáticamente:
    debugger; // Instrucción JavaScript
    sourcesOutput.textContent = `Ejecución reanudada tras debugger; (${JSON.stringify(contexto)})`; // Actualiza contenido en el DOM
});
