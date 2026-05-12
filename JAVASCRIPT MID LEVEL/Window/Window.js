/**
 * MANEJO DEL OBJETO GLOBAL 'WINDOW'
 * Contiene métodos para controlar la ventana del navegador y la interacción con el usuario.
 */
// METODOS DE APERTURA Y CIERRE
let url = "https://youtube.com"

/** Abre un nuevo contexto de navegación (pestaña/ventana) */
const ventana = window.open(url)

/** Intenta cerrar la ventana referenciada (solo permitido si fue abierta por script) */
ventana.close()

console.log(ventana.closed);
window.stop() // Detiene la carga de red del documento

// METODOS DE INTERACCION CON EL USUARIO

// 📚 Muestra un cuadro de diálogo de alerta con un mensaje y un botón de OK. Detiene la ejecución del script
alert("alert")

// 📚 Abre el diálogo de impresión para imprimir el documento actual
print()

// 📚 Muestra un diálogo con mensaje y un campo de texto. Devuelve el texto ingresado o 'null' si se cancela
prompt("dame un dato")

// 📚 Muestra un diálogo con botones de Aceptar y Cancelar. Devuelve 'true' o 'false' según la elección
confirm("quieres continuar?")
