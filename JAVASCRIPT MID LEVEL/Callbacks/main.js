// -------------------------------------------------------------------
// Este archivo demuestra cómo funcionan las callbacks en JavaScript.
// Una callback es una función que se pasa como argumento a otra
// función y luego se ejecuta cuando la acción principal termina.
// -------------------------------------------------------------------

// -------------------------------------------------------------------
// 1) FUNCION PRINCIPAL QUE RECIBE UNA CALLBACK
// -------------------------------------------------------------------
// Aquí creamos una función llamada procesarNombre.
// Esta función recibe dos parámetros:
// - nombre: el valor que queremos usar
// - callback: otra función que se ejecutará después
//
// La idea es simple: "haz algo con nombre y luego ejecuta la función
// que me pasaron".
function procesarNombre(nombre, callback) {
    // Ejecutamos la callback y le enviamos el nombre.
    callback(nombre);
}

// -------------------------------------------------------------------
// 2) CALLBACK TRADICIONAL
// -------------------------------------------------------------------
// Esta función no se ejecuta todavía directamente.
// Solo se usará como ejemplo para mostrar cómo se pasa una función
// como argumento.
function mostrarNombre(nombre) {
    // Mostramos el nombre en la consola.
    console.log(`Hola, ${nombre}`);
}

// -------------------------------------------------------------------
// 3) PRIMERA LLAMADA A LA FUNCIÓN PRINCIPAL
// -------------------------------------------------------------------
// Aquí le pasamos "Pedro" como nombre y mostrarNombre como callback.
// Esto significa:
// 1. procesarNombre recibe el nombre
// 2. dentro de ella se ejecuta callback(nombre)
// 3. como callback es mostrarNombre, entonces se ejecuta mostrarNombre("Pedro")
procesarNombre("Pedro", mostrarNombre);

// -------------------------------------------------------------------
// 4) SEGUNDA LLAMADA CON CALLBACK FLECHA
// -------------------------------------------------------------------
// Aquí usamos una función flecha como callback.
// Una función flecha es otra forma corta de escribir una función.
procesarNombre("Ana", (nombre) => {
    // Mostramos un mensaje distinto en la consola.
    console.log(`Nombre recibido: ${nombre}`);
});

// -------------------------------------------------------------------
// 5) SELECCIONAMOS ELEMENTOS DEL HTML
// -------------------------------------------------------------------
// document.getElementById() permite acceder a elementos del HTML por su id.
// En este caso, vamos a usar:
// - boton: el botón que activará la demo
// - resultado: el párrafo donde aparecerá el mensaje final
// - estado: el párrafo donde mostraremos si la callback está ejecutándose
const boton = document.getElementById("runCallback");
const resultado = document.getElementById("result");
const estado = document.getElementById("demoNote");

// -------------------------------------------------------------------
// 6) EVENTO CLICK DEL BOTÓN
// -------------------------------------------------------------------
// addEventListener() sirve para escuchar un evento.
// En este caso, escuchamos el evento "click" del botón.
// Cuando el usuario haga clic, ejecutamos la función que está dentro.
boton.addEventListener("click", () => {
    // Antes de ejecutar la callback, cambiamos el texto del estado.
    estado.textContent = "Estado: ejecutando callback...";

    // Llamamos a procesarNombre con un nuevo nombre y otra callback.
    procesarNombre("JavaScript", (nombre) => {
        // Mostramos el resultado en la página.
        resultado.textContent = `Callback ejecutada con: ${nombre}`;

        // Cambiamos el estado para indicar que terminó correctamente.
        estado.textContent = `Estado: callback finalizada para ${nombre}`;
    });
});

// -------------------------------------------------------------------
// 7) EJEMPLO EXTRA CON CLASES Y CALLBACKS ANIDADAS
// -------------------------------------------------------------------
// Este bloque sirve para practicar otro uso de callbacks.
// No cambia la interfaz, pero ayuda a entender cómo se pueden combinar
// funciones, clases y datos.
class Persona {
    constructor(nombre, instagram) {
        // Guardamos los datos dentro del objeto.
        this.nombre = nombre;
        this.instagram = instagram;
    }
}

// -------------------------------------------------------------------
// 8) ARRAY DE DATOS DE EJEMPLO
// -------------------------------------------------------------------
// Aquí creamos una lista simulada con nombres e Instagram.
const data = [
    ["Fredy", "@Fredyleo30_10"],
    ["Robertico", "@Robertico"],
    ["RancioRamirez", "@RancioRamirez"],
    ["Camilo Nesa", "@Milanesa"]
];

// -------------------------------------------------------------------
// 9) CREAMOS LOS OBJETOS PERSONA A PARTIR DEL ARRAY
// -------------------------------------------------------------------
// Recorremos el arreglo con un for y por cada elemento creamos una nueva
// instancia de la clase Persona.
const personas = [];

for (let i = 0; i < data.length; i++) {
    personas[i] = new Persona(data[i][0], data[i][1]);
}

// -------------------------------------------------------------------
// 10) FUNCIÓN PARA OBTENER UNA PERSONA CON CALLBACK
// -------------------------------------------------------------------
// Esta función busca una persona en el arreglo usando el id.
// Si la encuentra, llama a la callback con null (sin error) y los datos.
// Si no la encuentra, llama a la callback con un mensaje de error.
const obtenerPersona = (id, cb) => {
    if (personas[id] === undefined) {
        cb("No se ha encontrado la persona");
    } else {
        cb(null, personas[id], id);
    }
};

// -------------------------------------------------------------------
// 11) FUNCIÓN PARA OBTENER EL INSTAGRAM CON CALLBACK
// -------------------------------------------------------------------
// Similar a la anterior, pero ahora busca el Instagram de la persona.
const obtenerInstagram = (id, cb) => {
    if (personas[id] === undefined || personas[id].instagram === undefined) {
        cb("No se ha encontrado el instagram");
    } else {
        cb(null, personas[id].instagram);
    }
};

// -------------------------------------------------------------------
// 12) CALLBACK ANIDADA (UNA DENTRO DE OTRA)
// -------------------------------------------------------------------
// Primero buscamos una persona.
// Si existe, entonces buscamos su Instagram.
// Esto muestra cómo las callbacks pueden encadenarse.
obtenerPersona(1, (err, persona, id) => {
    if (err) {
        // Si hay error, lo mostramos en consola.
        console.log(err);
    } else {
        // Mostramos el nombre de la persona.
        console.log(persona.nombre);

        // Ahora usamos el id para obtener el Instagram.
        obtenerInstagram(id, (error, instagram) => {
            if (error) {
                console.log(error);
            } else {
                console.log(instagram);
            }
        });
    }
});