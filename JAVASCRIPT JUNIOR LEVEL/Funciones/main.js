/** Manejo de eventos y eliminación de listeners */
const button = document.querySelector(".button");
button.addEventListener("click", saludar);

/**
 * Saluda y se auto-elimina como listener para ejecutarse solo una vez.
 */
function saludar() {
    alert("Hola!");
    button.removeEventListener("click", saludar);
}

/**
 * Listener persistente para monitorear el objetivo del clic.
 */
button.addEventListener("click", (e)=>{
    console.log(e.target);
});