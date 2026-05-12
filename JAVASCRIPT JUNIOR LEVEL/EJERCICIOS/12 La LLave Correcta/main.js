/** Lógica para la generación dinámica y selección de llaves en el DOM */
const contenedor = document.querySelector(".flex-container"),
      boton = document.querySelector(".send-button")
let botonAntiguo = boton.value
boton.value = botonAntiguo.toUpperCase()

let contador = 0

/**
 * Genera la estructura HTML de una llave.
 *
 * @param {string} nombre - Nombre visible de la llave.
 * @param {string} modelo - Identificador del modelo de llave.
 * @param {string} precio - Precio de la llave.
 * @returns {string[]} Arreglo con HTML para imagen, nombre, modelo y precio.
 */
function crearLLave(nombre, modelo, precio) {
    // Incrementa el contador cada vez que se crea una llave.
    contador++

    // Se crea una cadena HTML para la imagen de la llave.
    // El archivo debe existir en la misma carpeta y llamarse "llave.jpg".
    const img = `<img class="llave-img" src="llave.jpg" alt="Llave">`

    // Se crea una cadena HTML para el nombre de la llave.
    nombre = `<h2>${nombre}</h2>`

    // Se crea una cadena HTML para el modelo.
    // Se usa el atributo id con el valor del modelo para poder identificarlo en el DOM.
    modelo = `<h3 id="${modelo}">${modelo}</h3>`

    // Se crea una cadena HTML para el precio, con el valor en negrita.
    precio = `<p>Precio: <b>${precio}</b></p>`

    // Retorna un arreglo con las cuatro piezas de contenido HTML.
    return [img, nombre, modelo, precio]
}

/**
 * Escribe el identificador numérico de la llave seleccionada en el campo oculto del formulario.
 * @param {number} number - Valor del modelo (aleatorio) asociado a la tarjeta clicada.
 */
const changeHidden = (number)=>{
    document.querySelector(".key-data").value = number
}

// Crea un fragmento de documento para agregar múltiples elementos al DOM de una vez.
// Esto mejora el rendimiento porque evita reflujo y repintado en cada inserción.
let fragment = document.createDocumentFragment()

// Bucle para generar 20 llaves de ejemplo.
for (let i = 1; i <= 20; i++) {
    // Genera un número aleatorio para el modelo.
    // Math.random() devuelve un valor entre 0 y 1, luego se multiplica y se redondea hacia abajo.
    let modeloRandom = Math.floor(Math.random() * 10000)

    // Genera un precio aleatorio entre 30 y 40, con dos decimales.
    let precioRandom = (Math.random() * 10 + 30).toFixed(2)

    // Llama a la función crearLLave para obtener el contenido HTML de esa llave.
    // El nombre se construye con el número de iteración, el modelo con el número aleatorio,
    // y el precio se formatea como cadena con símbolo de dólar.
    let llave = crearLLave(`Llave ${i}`, `Modelo ${modeloRandom}`, `$${precioRandom}`)

    // Crea un elemento <div> que contendrá la llave completa.
    let div = document.createElement("div")

    div.addEventListener("click", ()=>{
        changeHidden(modeloRandom)
    })

    /**
     * TABINDEX - Atributo de accesibilidad para la navegación por teclado
     * El tabindex define el orden en el que los elementos pueden recibir el foco
     * cuando el usuario presiona la tecla TAB. En este caso:
     * - div.tabIndex = i   →  Asigna un valor positivo (1 al 20)
     * VALORES DE TABINDEX:
     * • tabindex="0"       → El elemento puede recibir foco en su orden natural en el HTML
     * • tabindex="-1"      → El elemento NO recibe foco con TAB (solo accesible por JavaScript)
     * • tabindex="1..32767"→ Valores positivos definen orden explícito de navegación
     *                         Un tabindex de 1 recibe foco ANTES que tabindex de 2, etc.
     * 
     * EN ESTE CÓDIGO:
     * Se asigna tabindex = i (donde i va de 1 a 20), lo que significa:
     * - Primera tarjeta: tabindex="1" (recibe foco primero al presionar TAB)
     * - Segunda tarjeta: tabindex="2" (recibe foco segundo)
     * - ... y así sucesivamente hasta la tarjeta 20
     * 
     * IMPLICACIÓN:
     * El usuario puede navegar entre las tarjetas presionando TAB para avanzar
     * y SHIFT+TAB para retroceder, mejorando la accesibilidad del sitio.
     */
    div.tabIndex = i

    // Añade clases para estilo y para poder identificar cada item.
    div.classList.add(`item-${i}`,`flex-item`)

    // Combina el HTML que devolvió crearLLave en el interior del div.
    div.innerHTML = llave[0] + llave[1] + llave[2] + llave[3]

    // Agrega el div al fragmento. No se inserta aún en el DOM principal.
    fragment.appendChild(div)
}

// Una vez que todas las llaves están creadas en el fragmento, se agrega todo de una sola vez al contenedor.
// Esto inserta las 20 tarjetas en el DOM con una sola operación.
contenedor.appendChild(fragment)
