// 🌐 Objeto Location: Control de la URL actual

// Retorna o establece la URL completa de la página actual. Si le asignas un valor, el navegador redirigirá a esa nueva dirección.
document.write(window.location.href + "<br>")

// Devuelve únicamente el nombre del dominio (host) del servidor, excluyendo el protocolo y el puerto (ej: "www.google.com").
document.write(window.location.hostname +"<br>");

// Retorna la ruta jerárquica de la página después del dominio, incluyendo la barra inicial (ej: "/search/images").
document.write(window.location.pathname + "<br>");

// Devuelve el protocolo web de la URL actual, incluyendo los dos puntos finales (comúnmente "http:" o "https:").
document.write(window.location.protocol + "<br>");

// Método que carga un nuevo documento en la ventana actual. A diferencia de 'replace', este sí guarda la página anterior en el historial de navegación.
document.write(window.location.assign());