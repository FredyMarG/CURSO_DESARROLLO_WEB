/** 
 * Lógica para la generación dinámica, renderizado optimizado y selección de llaves en el DOM.
 * 
 * FLUJO:
 * 1. Selecciona contenedores.
 * 2. Genera datos aleatorios (modelo y precio).
 * 3. Crea elementos HTML en memoria usando un Fragmento (Rendimiento).
 * 4. Inyecta todo al DOM en una sola operación.
 */

const contenedor = document.querySelector(".flex-container"),
      boton = document.querySelector(".send-button")
let botonAntiguo = boton.value
boton.value = botonAntiguo.toUpperCase()

/**
 * Genera la estructura de datos visual (HTML) de una llave individual.
 *
 * @param {string} nombre - Nombre descriptivo de la llave (ej. "Llave 1").
 * @param {string} modelo - Identificador único o número de serie del modelo.
 * @param {string} precio - Valor comercial de la llave formateado como string.
 * @returns {string[]} Arreglo con HTML para imagen, nombre, modelo y precio.
 */
function crearLLave(nombre, modelo, precio) {
    /**
     * Se define la imagen. Nota: Se asume que 'llave.jpg' reside en la raíz del proyecto.
     * @type {string}
     */
    const img = `<img class="llave-img" src="llave.jpg" alt="Llave">`

    /** @type {string} Título de la tarjeta */
    nombre = `<h2>${nombre}</h2>`

    /** 
     * Encabezado de nivel 3 para el modelo. 
     * Se asigna el ID dinámicamente para que sea fácilmente identificable.
     * @type {string} 
     */
    modelo = `<h3 id="${modelo}">${modelo}</h3>`

    /** @type {string} Párrafo con el precio resaltado */
    precio = `<p>Precio: <b>${precio}</b></p>`

    return [img, nombre, modelo, precio]
}

/**
 * Escribe el identificador numérico de la llave seleccionada en el campo oculto del formulario.
 * @param {string} number - Valor del modelo capturado de la tarjeta seleccionada.
 */
const changeHidden = (number)=>{
    document.querySelector(".key-data").value = number
}

/** 
 * OPTIMIZACIÓN: El DocumentFragment actúa como un "piso falso". 
 * Construimos todo sobre él y luego lo "pegamos" al DOM real de golpe. 
 */
let fragment = document.createDocumentFragment()

for (let i = 1; i <= 20; i++) {
    // Generación de identificador único entre 0 y 9999
    let modeloRandom = Math.floor(Math.random() * 10000)

    // Generación de precio con rango dinámico y redondeo a 2 decimales
    let precioRandom = (Math.random() * 10 + 30).toFixed(2)
    
    let llave = crearLLave(`Llave ${i}`, `Modelo ${modeloRandom}`, `$${precioRandom}`)

    let div = document.createElement("div")

    // Closure: Cada div recuerda su 'modeloRandom' específico gracias al ámbito del bucle.
    div.addEventListener("click", ()=>{
        changeHidden(`Modelo ${modeloRandom}`)
    })

    /**
     * ACCESIBILIDAD (A11y):
     * ACCESIBILIDAD: El tabIndex hace que el DIV (que no es interactivo por defecto) 
     * sea detectable por lectores de pantalla y navegable con la tecla TAB.
     */
    div.tabIndex = i
    div.classList.add(`item-${i}`,`flex-item`)

    // Inyección de piezas de la llave.
    // Nota: innerHTML es rápido aquí, pero en apps con inputs de usuario usaríamos nodos.
    div.innerHTML = llave[0] + llave[1] + llave[2] + llave[3]

    fragment.appendChild(div)
}

contenedor.appendChild(fragment)
