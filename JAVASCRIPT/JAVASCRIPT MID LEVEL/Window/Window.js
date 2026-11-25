// Guía Interactiva — Objeto Window y <dialog> Moderno

let ventanaHija = null; // Declara e inicializa variable local
const winStatus = document.getElementById("winStatus"); // Declara e inicializa variable local
const modernDialog = document.getElementById("modernDialog"); // Declara e inicializa variable local
const dialogNameInput = document.getElementById("dialogNameInput"); // Declara e inicializa variable local
const modalResult = document.getElementById("modalResult"); // Declara e inicializa variable local

document.getElementById("btnOpenWin").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    ventanaHija = window.open("", "ventanaDemo", "width=400,height=300");
    if (!ventanaHija) { // Evalúa condición lógica
        winStatus.textContent = "El navegador bloqueó la ventana emergente."; // Actualiza contenido en el DOM
        return; // Retorna el resultado de la función
    }
    ventanaHija.document.body.innerHTML =
        "<h2 style='font-family:sans-serif;padding:20px'>Ventana controlada por JS</h2>";
    winStatus.className = "output ok";
    winStatus.textContent = "Ventana abierta (ventana.closed === false)."; // Actualiza contenido en el DOM
});

document.getElementById("btnCheckWin").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    if (!ventanaHija) { // Evalúa condición lógica
        winStatus.textContent = "No has abierto ninguna ventana todavía."; // Actualiza contenido en el DOM
        return; // Retorna el resultado de la función
    }
    winStatus.className = "output";
    winStatus.textContent = `Estado actual: ventana.closed === ${ventanaHija.closed}`; // Actualiza contenido en el DOM
});

document.getElementById("btnCloseWin").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    if (ventanaHija && !ventanaHija.closed) { // Evalúa condición lógica
        ventanaHija.close();
        winStatus.className = "output";
        winStatus.textContent = `Ventana cerrada (ventana.closed === ${ventanaHija.closed}).`; // Actualiza contenido en el DOM
    } else {
        winStatus.textContent = "La ventana ya estaba cerrada."; // Actualiza contenido en el DOM
    }
});

document.getElementById("btnShowModal").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    dialogNameInput.value = "";
    modernDialog.showModal();
});

document.getElementById("btnCancelDialog").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    modernDialog.close("cancelado");
});

modernDialog.addEventListener("close", () => { // Registra escuchador de evento en el DOM
    if (modernDialog.returnValue === "confirmado") { // Evalúa condición lógica
        modalResult.className = "output ok";
        modalResult.textContent = `Modal confirmado por: ${dialogNameInput.value.trim()}`; // Actualiza contenido en el DOM
    } else {
        modalResult.className = "output";
        modalResult.textContent = "Modal cerrado/cancelado sin bloquear el hilo."; // Actualiza contenido en el DOM
    }
});

document.getElementById("btnPrint").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    window.print();
});

