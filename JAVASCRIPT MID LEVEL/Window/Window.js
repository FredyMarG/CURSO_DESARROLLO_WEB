// Guía Interactiva — Objeto Window y <dialog> Moderno

let ventanaHija = null;
const winStatus = document.getElementById("winStatus");
const modernDialog = document.getElementById("modernDialog");
const dialogNameInput = document.getElementById("dialogNameInput");
const modalResult = document.getElementById("modalResult");

document.getElementById("btnOpenWin").addEventListener("click", () => {
    ventanaHija = window.open("", "ventanaDemo", "width=400,height=300");
    if (!ventanaHija) {
        winStatus.textContent = "El navegador bloqueó la ventana emergente.";
        return;
    }
    ventanaHija.document.body.innerHTML =
        "<h2 style='font-family:sans-serif;padding:20px'>Ventana controlada por JS</h2>";
    winStatus.className = "output ok";
    winStatus.textContent = "Ventana abierta (ventana.closed === false).";
});

document.getElementById("btnCheckWin").addEventListener("click", () => {
    if (!ventanaHija) {
        winStatus.textContent = "No has abierto ninguna ventana todavía.";
        return;
    }
    winStatus.className = "output";
    winStatus.textContent = `Estado actual: ventana.closed === ${ventanaHija.closed}`;
});

document.getElementById("btnCloseWin").addEventListener("click", () => {
    if (ventanaHija && !ventanaHija.closed) {
        ventanaHija.close();
        winStatus.className = "output";
        winStatus.textContent = `Ventana cerrada (ventana.closed === ${ventanaHija.closed}).`;
    } else {
        winStatus.textContent = "La ventana ya estaba cerrada.";
    }
});

document.getElementById("btnShowModal").addEventListener("click", () => {
    dialogNameInput.value = "";
    modernDialog.showModal();
});

document.getElementById("btnCancelDialog").addEventListener("click", () => {
    modernDialog.close("cancelado");
});

modernDialog.addEventListener("close", () => {
    if (modernDialog.returnValue === "confirmado") {
        modalResult.className = "output ok";
        modalResult.textContent = `Modal confirmado por: ${dialogNameInput.value.trim()}`;
    } else {
        modalResult.className = "output";
        modalResult.textContent = "Modal cerrado/cancelado sin bloquear el hilo.";
    }
});

document.getElementById("btnPrint").addEventListener("click", () => {
    window.print();
});
