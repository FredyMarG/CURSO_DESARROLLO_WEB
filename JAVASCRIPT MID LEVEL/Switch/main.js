// Guía Interactiva — Switch y Tablas Lookup

const httpCodeSelect = document.getElementById("httpCodeSelect"); // Obtiene referencia DOM para "httpCodeSelect"
const simularSinBreak = document.getElementById("simularSinBreak"); // Obtiene referencia DOM para "simularSinBreak"
const httpOutput = document.getElementById("httpOutput"); // Obtiene referencia DOM para "httpOutput"
const notaRange = document.getElementById("notaRange"); // Obtiene referencia DOM para "notaRange"
const notaValor = document.getElementById("notaValor"); // Obtiene referencia DOM para "notaValor"
const notaOutput = document.getElementById("notaOutput"); // Obtiene referencia DOM para "notaOutput"

function evaluarHttp() { // Declara función
    const codigo = Number(httpCodeSelect.value); // Declara e inicializa "codigo"
    const fallThrough = simularSinBreak.checked; // Declara e inicializa "fallThrough"
    const pasos = []; // Declara e inicializa "pasos"
    let clase = "ok"; // Declara e inicializa "clase"

    switch (codigo) { // Evalúa múltiples casos
        case 200:
        case 201:
        case 204:
            pasos.push(`Familia 2xx (${codigo}): Operación exitosa.`); // Ejecuta llamada o método
            if (!fallThrough) break; // Evalúa condición
        case 401:
        case 404:
            pasos.push(`Familia 4xx (${codigo}): Error del cliente.`); // Ejecuta llamada o método
            clase = fallThrough ? "warn" : "warn"; // Asigna valor
            if (!fallThrough) break; // Evalúa condición
        case 500:
            pasos.push(`Familia 5xx (${codigo}): Error interno del servidor.`); // Ejecuta llamada o método
            clase = fallThrough ? "warn" : "err"; // Asigna valor
            if (!fallThrough) break; // Evalúa condición
        default:
            pasos.push("Rama default: Código no contemplado."); // Ejecuta llamada o método
            if (!fallThrough) clase = "err"; // Evalúa condición
    }

    httpOutput.className = `output ${clase}`; // Asigna valor
    httpOutput.textContent = pasos.join(" → "); // Actualiza contenido en el DOM
}

function evaluarNota() { // Declara función
    const nota = Number(notaRange.value); // Declara e inicializa "nota"
    notaValor.textContent = nota; // Actualiza contenido en el DOM
    let letra; // Declara e inicializa "letra"
    let clase = "ok"; // Declara e inicializa "clase"

    switch (true) { // Evalúa múltiples casos
        case nota >= 90:
            letra = "A (Sobresaliente)"; // Asigna valor
            break; // Instrucción JavaScript
        case nota >= 80:
            letra = "B (Muy bien)"; // Asigna valor
            break; // Instrucción JavaScript
        case nota >= 70:
            letra = "C (Aprobado)"; // Asigna valor
            clase = "warn"; // Asigna valor
            break; // Instrucción JavaScript
        default:
            letra = "F (Reprobado)"; // Asigna valor
            clase = "err"; // Asigna valor
    }

    notaOutput.className = `output ${clase}`; // Asigna valor
    notaOutput.textContent = `Resultado con switch(true): ${letra}`; // Actualiza contenido en el DOM
}

httpCodeSelect.addEventListener("change", evaluarHttp); // Registra escuchador de eventos
simularSinBreak.addEventListener("change", evaluarHttp); // Registra escuchador de eventos
notaRange.addEventListener("input", evaluarNota); // Registra escuchador de eventos

evaluarHttp(); // Ejecuta llamada o método
evaluarNota(); // Ejecuta llamada o método
