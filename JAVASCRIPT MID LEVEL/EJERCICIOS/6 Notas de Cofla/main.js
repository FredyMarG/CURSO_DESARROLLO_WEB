const materiasHTML = document.querySelector(".materias");
const button = document.querySelector("#aceptar");
const solucion = document.querySelector("#solucion");

const materias = [
    {
        nombre: "Fisica 4",
        nota: 7
    },
    {
        nombre: "Calculo 4",
        nota: 8
    },
    {
        nombre: "Base de Datos 4",
        nota: 9
    },
    {
        nombre: "Matemáticas Discretas 3",
        nota: 7
    },
    {
        nombre: "Programación 4",
        nota: 8
    }
]
const obtenerMateria = (id)=>{
    return new Promise((resolve, reject)=>{
        materia = materias[id]
        if(materia == undefined)reject("La materia no existe")
        else setTimeout(()=>{resolve(materia)}, Math.random()*1400)
    })
}

const devolverMaterias = async () =>{
    let materia = []
    for(let i = 0; i < materias.length; i++){
        materia[i] = await obtenerMateria(i)
        let newHtmlcode = `<div class="materia">
                <div class="nombre">${materia[i].nombre}</div>
                <div class="nota">${materia[i].nota}</div>
            </div>`
        materiasHTML.innerHTML += newHtmlcode;
    }
}

button.addEventListener("click", async ()=>{
    solucion.classList.add("mostrar");
    await devolverMaterias()
})