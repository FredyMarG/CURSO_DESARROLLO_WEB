// Guía Interactiva — Switch y Tablas Lookup

const httpCodeSelect = document.getElementById("httpCodeSelect"); // Declara e inicializa variable local
const simularSinBreak = document.getElementById("simularSinBreak"); // Declara e inicializa variable local
const httpOutput = document.getElementById("httpOutput"); // Declara e inicializa variable local
const notaRange = document.getElementById("notaRange"); // Declara e inicializa variable local
const notaValor = document.getElementById("notaValor"); // Declara e inicializa variable local
const notaOutput = document.getElementById("notaOutput"); // Declara e inicializa variable local

function evaluarHttp() { // Define función reutilizable
    const codigo = Number(httpCodeSelect.value); // Declara e inicializa variable local
    const fallThrough = simularSinBreak.checked; // Declara e inicializa variable local
    const pasos = []; // Declara e inicializa variable local
    let clase = "ok"; // Declara e inicializa variable local

    switch (codigo) { // Evalúa múltiples casos
        case 200:
        case 201:
        case 204:
            pasos.push(`Familia 2xx (${codigo}): Operación exitosa.`);
            if (!fallThrough) break; // Evalúa condición lógica
        case 401:
        case 404:
            pasos.push(`Familia 4xx (${codigo}): Error del cliente.`);
            clase = fallThrough ? "warn" : "warn";
            if (!fallThrough) break; // Evalúa condición lógica
        case 500:
            pasos.push(`Familia 5xx (${codigo}): Error interno del servidor.`);
            clase = fallThrough ? "warn" : "err";
            if (!fallThrough) break; // Evalúa condición lógica
        default:
            pasos.push("Rama default: Código no contemplado.");
            if (!fallThrough) clase = "err"; // Evalúa condición lógica
    }

    httpOutput.className = `output ${clase}`;
    httpOutput.textContent = pasos.join(" → "); // Actualiza contenido en el DOM
}

function evaluarNota() { // Define función reutilizable
    const nota = Number(notaRange.value); // Declara e inicializa variable local
    notaValor.textContent = nota; // Actualiza contenido en el DOM
    let letra; // Declara e inicializa variable local
    let clase = "ok"; // Declara e inicializa variable local

    switch (true) { // Evalúa múltiples casos
        case nota >= 90:
            letra = "A (Sobresaliente)";
            break;
        case nota >= 80:
            letra = "B (Muy bien)";
            break;
        case nota >= 70:
            letra = "C (Aprobado)";
            clase = "warn";
            break;
        default:
            letra = "F (Reprobado)";
            clase = "err";
    }

    notaOutput.className = `output ${clase}`;
    notaOutput.textContent = `Resultado con switch(true): ${letra}`; // Actualiza contenido en el DOM
}

httpCodeSelect.addEventListener("change", evaluarHttp);
simularSinBreak.addEventListener("change", evaluarHttp);
notaRange.addEventListener("input", evaluarNota);

evaluarHttp();
evaluarNota();

