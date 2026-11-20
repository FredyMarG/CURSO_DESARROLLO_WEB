// Guía Interactiva — Switch y Tablas Lookup

const httpCodeSelect = document.getElementById("httpCodeSelect");
const simularSinBreak = document.getElementById("simularSinBreak");
const httpOutput = document.getElementById("httpOutput");
const notaRange = document.getElementById("notaRange");
const notaValor = document.getElementById("notaValor");
const notaOutput = document.getElementById("notaOutput");

function evaluarHttp() {
    const codigo = Number(httpCodeSelect.value);
    const fallThrough = simularSinBreak.checked;
    const pasos = [];
    let clase = "ok";

    switch (codigo) {
        case 200:
        case 201:
        case 204:
            pasos.push(`Familia 2xx (${codigo}): Operación exitosa.`);
            if (!fallThrough) break;
        case 401:
        case 404:
            pasos.push(`Familia 4xx (${codigo}): Error del cliente.`);
            clase = fallThrough ? "warn" : "warn";
            if (!fallThrough) break;
        case 500:
            pasos.push(`Familia 5xx (${codigo}): Error interno del servidor.`);
            clase = fallThrough ? "warn" : "err";
            if (!fallThrough) break;
        default:
            pasos.push("Rama default: Código no contemplado.");
            if (!fallThrough) clase = "err";
    }

    httpOutput.className = `output ${clase}`;
    httpOutput.textContent = pasos.join(" → ");
}

function evaluarNota() {
    const nota = Number(notaRange.value);
    notaValor.textContent = nota;
    let letra;
    let clase = "ok";

    switch (true) {
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
    notaOutput.textContent = `Resultado con switch(true): ${letra}`;
}

httpCodeSelect.addEventListener("change", evaluarHttp);
simularSinBreak.addEventListener("change", evaluarHttp);
notaRange.addEventListener("input", evaluarNota);

evaluarHttp();
evaluarNota();
