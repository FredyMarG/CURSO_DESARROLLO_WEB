let anos = document.getElementById("edad"),
    msg = document.getElementById("msg"),
    hora = document.getElementById("hora"),
    sol = document.getElementById("sol"),
    mainSol = document.getElementById("main-sol");
    free = false
    
    const validarCliente = () => {
        let edad = parseInt(prompt("¿Cuál es tu edad?"));
        anos.innerHTML = `Tienes ${edad} años`;

    if (edad >= 18) {

        let time = parseFloat(prompt("¿Qué hora es?"));
        hora.innerHTML = `Son las ${time}:00 AM`;

        if (time < 0.5) {
            msg.innerHTML = `Es muy temprano, debes esperar a la hora de entrada`;
        } 
        else if (time < 2) {
            msg.innerHTML = `Puedes entrar, pero debes pagar la entrada`;
        } 
        else if (time >= 2 && time < 7 && !free) {
            msg.innerHTML = `Puedes entrar gratis porque eres la primera persona después de las 02:00 AM`;
            free = true;
        }

    } else {
        msg.innerHTML = `Eres menor de edad, no puedes pasar`;
        hora.innerHTML = ""
    }
};

sol.addEventListener("click", ()=>{
    mainSol.style.display = "block"
})