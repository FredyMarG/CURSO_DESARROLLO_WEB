// 📚 Screen 

// Accede al objeto global 'screen' para obtener las especificaciones del hardware de visualización (resolución total, área disponible y profundidad de color).
console.log(window.screen);


// Propiedad de solo lectura que devuelve la distancia horizontal (en píxeles) desde el borde izquierdo de la pantalla física hasta el borde de la ventana del navegador.
console.log(window.screenLeft)


// Propiedad de solo lectura que devuelve la distancia vertical (en píxeles) desde el borde superior de la pantalla física hasta el borde de la ventana del navegador.
console.log(window.screenTop);

// Estándar de la W3C que funciona como alias de screenLeft; identifica la coordenada X de la ventana respecto al monitor.
console.log(window.screenX);

// Estándar de la W3C que funciona como alias de screenTop; identifica la coordenada Y de la ventana respecto al monitor.
console.log(window.screenY);

// 📚 Scroll

// Retorna la cantidad de píxeles que el contenido del documento se ha desplazado horizontalmente hacia la derecha.
console.log(window.scrollX);

// Retorna la cantidad de píxeles que el contenido del documento se ha desplazado verticalmente hacia abajo.
console.log(window.scrollY);

// Desplaza el documento a una coordenada absoluta (x, y) específica; en este caso, mueve la vista a 0px horizontales y 100px verticales.
window.scroll(0,100);

// Mueve la ventana a una posición específica del documento basándose en coordenadas absolutas. Es funcionalmente idéntico a scroll().
window.scrollTo(0,100)


// Desplaza el contenido del documento una cantidad de píxeles relativa a su posición actual (suma los píxeles indicados al scroll que ya tiene el usuario).
window.scrollBy(0,100)

document.write("El scroll x es: " + window.scrollX + " y el scroll y es: " + window.scrollY);



