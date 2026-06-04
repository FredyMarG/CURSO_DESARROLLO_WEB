// Seleccionamos el elemento del DOM con la clase '.input-prueba' y lo almacenamos en una constante.
const input = document.querySelector('.input-prueba');

/* 
 * Evento 'keydown': Se dispara en el instante en que el usuario presiona una tecla.
 * Es el primero en ejecutarse y detecta todas las teclas, incluidas las de control (Ctrl, Shift, Alt).
 */
input.addEventListener('keydown', (event) => {
    console.log('Tecla presionada:', event.key);
});

/* 
 * Evento 'keypress': (Nota: Está en desuso o 'deprecated'). 
 * Tradicionalmente se usaba para detectar teclas que producen caracteres alfanuméricos.
 */
input.addEventListener('keypress', (event) => {
    console.log('Tecla presionada (keypress):', event.key);
});

/* 
 * Evento 'keyup': Se dispara cuando el usuario suelta la tecla.
 * Es ideal para realizar validaciones después de que el carácter ya ha sido ingresado en el campo.
 */
input.addEventListener('keyup', (event) => {
    console.log('Tecla liberada:', event.key);
});

// Nota técnica: Las siguientes líneas intentan asignar funciones a propiedades personalizadas.
// Para que 'keydown' funcione como manejador directo debería ser 'onkeydown'.
input.keydown = (event) => {
    console.log('Tecla presionada (keydown):', event.key);
};

// 'repeat' es una propiedad booleana del objeto KeyboardEvent, no un evento del elemento.
input.repeat = (event) => {
    console.log('Tecla repetida:', event.key);
};