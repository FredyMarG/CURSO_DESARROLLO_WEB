/**
 * MANEJO DEL OBJETO GLOBAL 'WINDOW'
 * Contiene métodos para controlar la ventana del navegador y la interacción con el usuario.
 */
// METODOS DE APERTURA Y CIERRE
let url = "https://youtube.com"

// 📚 Carga un recurso en un nuevo contexto de navegación (pestaña o ventana) o uno existente
let ventana = window.open(url)

// 📚 Cierra la ventana referenciada (normalmente solo permitido para ventanas abiertas vía script)
ventana.close()

// 📚 Propiedad de solo lectura que devuelve 'true' si la ventana referenciada está cerrada
console.log(ventana.closed);

// 📚 Detiene la carga del documento actual (equivalente al botón 'Detener' o 'X' del navegador)
window.stop()

// METODOS DE INTERACCION CON EL USUARIO

// 📚 Muestra un cuadro de diálogo de alerta con un mensaje y un botón de OK. Detiene la ejecución del script
alert("alert")

// 📚 Abre el diálogo de impresión para imprimir el documento actual
print()

// 📚 Muestra un diálogo con mensaje y un campo de texto. Devuelve el texto ingresado o 'null' si se cancela
prompt("dame un dato")

// 📚 Muestra un diálogo con botones de Aceptar y Cancelar. Devuelve 'true' o 'false' según la elección
confirm("quieres continuar?")
