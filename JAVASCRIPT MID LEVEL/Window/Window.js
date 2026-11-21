// Guía Interactiva — Objeto Window y <dialog> Moderno

let ventanaHija = null; // Declara e inicializa "ventanaHija"
const winStatus = document.getElementById("winStatus"); // Obtiene referencia DOM para "winStatus"
const modernDialog = document.getElementById("modernDialog"); // Obtiene referencia DOM para "modernDialog"
const dialogNameInput = document.getElementById("dialogNameInput"); // Obtiene referencia DOM para "dialogNameInput"
const modalResult = document.getElementById("modalResult"); // Obtiene referencia DOM para "modalResult"

document.getElementById("btnOpenWin").addEventListener("click", () => { // Registra escuchador de eventos
    ventanaHija = window.open("", "ventanaDemo", "width=400,height=300"); // Asigna valor
    if (!ventanaHija) { // Evalúa condición
        winStatus.textContent = "El navegador bloqueó la ventana emergente."; // Actualiza contenido en el DOM
        return; // Retorna resultado
    }
    ventanaHija.document.body.innerHTML =
        "<h2 style='font-family:sans-serif;padding:20px'>Ventana controlada por JS</h2>"; // Instrucción JavaScript
    winStatus.className = "output ok"; // Asigna valor
    winStatus.textContent = "Ventana abierta (ventana.closed === false)."; // Actualiza contenido en el DOM
});

document.getElementById("btnCheckWin").addEventListener("click", () => { // Registra escuchador de eventos
    if (!ventanaHija) { // Evalúa condición
        winStatus.textContent = "No has abierto ninguna ventana todavía."; // Actualiza contenido en el DOM
        return; // Retorna resultado
    }
    winStatus.className = "output"; // Asigna valor
    winStatus.textContent = `Estado actual: ventana.closed === ${ventanaHija.closed}`; // Actualiza contenido en el DOM
});

document.getElementById("btnCloseWin").addEventListener("click", () => { // Registra escuchador de eventos
    if (ventanaHija && !ventanaHija.closed) { // Evalúa condición
        ventanaHija.close(); // Ejecuta llamada o método
        winStatus.className = "output"; // Asigna valor
        winStatus.textContent = `Ventana cerrada (ventana.closed === ${ventanaHija.closed}).`; // Actualiza contenido en el DOM
    } else { // Instrucción JavaScript
        winStatus.textContent = "La ventana ya estaba cerrada."; // Actualiza contenido en el DOM
    }
});

document.getElementById("btnShowModal").addEventListener("click", () => { // Registra escuchador de eventos
    dialogNameInput.value = ""; // Asigna valor
    modernDialog.showModal(); // Ejecuta llamada o método
});

document.getElementById("btnCancelDialog").addEventListener("click", () => { // Registra escuchador de eventos
    modernDialog.close("cancelado"); // Ejecuta llamada o método
});

modernDialog.addEventListener("close", () => { // Registra escuchador de eventos
    if (modernDialog.returnValue === "confirmado") { // Evalúa condición
        modalResult.className = "output ok"; // Asigna valor
        modalResult.textContent = `Modal confirmado por: ${dialogNameInput.value.trim()}`; // Actualiza contenido en el DOM
    } else { // Instrucción JavaScript
        modalResult.className = "output"; // Asigna valor
        modalResult.textContent = "Modal cerrado/cancelado sin bloquear el hilo."; // Actualiza contenido en el DOM
    }
});

document.getElementById("btnPrint").addEventListener("click", () => { // Registra escuchador de eventos
    window.print(); // Ejecuta llamada o método
});
