/**
 * EJERCICIO: validación de edad y horario para entrar a una fiesta.
 */

let anos = document.getElementById("edad"),
    msg = document.getElementById("msg"),
    hora = document.getElementById("hora"),
    sol = document.getElementById("sol"),
    mainSol = document.getElementById("main-sol");
    free = false
    
/**
 * Pregunta edad y hora; aplica reglas de entrada y marca el primer ingreso gratis tras las 02:00.
 */
    const validarCliente = () => {
        let edad = parseInt(prompt("¿Cuál es tu edad?"));
        anos.innerHTML = `Tienes ${edad} años`; // Actualiza contenido en el DOM

    if (edad >= 18) {

        let time = parseFloat(prompt("¿Qué hora es?"));
        hora.innerHTML = `Son las ${time}:00 AM`; // Actualiza contenido en el DOM

        if (time < 0.5) {
            msg.innerHTML = `Es muy temprano, debes esperar a la hora de entrada`; // Actualiza contenido en el DOM
        } 
        else if (time < 2) { // Evalúa condición alternativa
            msg.innerHTML = `Puedes entrar, pero debes pagar la entrada`; // Actualiza contenido en el DOM
        } 
        else if (time >= 2 && time < 7 && !free) { // Evalúa condición alternativa
            msg.innerHTML = `Puedes entrar gratis porque eres la primera persona después de las 02:00 AM`; // Actualiza contenido en el DOM
            free = true;
        }

    } else {
        msg.innerHTML = `Eres menor de edad, no puedes pasar`; // Actualiza contenido en el DOM
        hora.innerHTML = ""
    }
};

sol.addEventListener("click", ()=>{
    mainSol.style.display = "block"
})