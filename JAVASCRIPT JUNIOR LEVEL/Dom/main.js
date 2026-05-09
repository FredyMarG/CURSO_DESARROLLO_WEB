
//************************ 🧹 METODO DE SELECCION DE ELEMENTOS************** */
// ℹ️ getelementsbytagname es para obtener una colección de elementos por su etiqueta
// let parrafo = document.getElementsByTagName("p");
// ℹ️ getelementbyid es para obtener un elemento por su id
// let parrafo2 = document.getElementById("parrafo");
// ℹ️ queryselector es para obtener el primer elemento que coincida con el selector CSS
// let parrafo3 = document.querySelector("p");
// ℹ️ queryselectorall es para obtener todos los elementos que coincidan con el selector CSS
// let parrafo4 = document.querySelectorAll("p");
// ℹ️ getelementsbyclassname es para obtener una colección de elementos por su clase
// let parrafo5 = document.getElementsByClassName("parrafo");

//******************* 📦 METODOS DE ATRIBUTOS DE UN ELEMENTO ****************** */

//********************** 🌐 METODOS DE ATRIBUTOS GLOBALES   */
// ℹ️ setattribute es para establecer un atributo y su valor a un elemento
// const rangoEtario = document.querySelector(".rangoEtario");
// rangoEtario.setAttribute("type", "color");

// ℹ️ getattribute es para obtener el valor de un atributo de un elemento
// rangoEtario.getAttribute("type"); 

// rangoEtario.removeAttribute("type");

const titulo = document.querySelector(".titulo");

// ℹ️ contenteditable es un atributo que permite editar el contenido de un elemento
titulo.setAttribute("contentEditable", "false");

// ℹ️ dir es un atributo que indica la dirección del texto en un elemento, puede ser "ltr" (de izquierda a derecha) o "rtl" (de derecha a izquierda)
titulo.setAttribute("DIR", "ltr");

// ℹ️ hidden es un atributo booleano que oculta un elemento cuando se establece en true y lo muestra cuando se establece en false o se elimina el atributo
titulo.setAttribute("hidden", "true");
titulo.removeAttribute("hidden");

// ℹ️ Tabindex es un atributo que indica el orden de tabulación de un elemento, puede ser un número entero o -1 para excluirlo del orden de tabulación
titulo.setAttribute("tabindex", "0");

// ℹ️ title es un atributo que proporciona información adicional sobre un elemento, se muestra como un tooltip cuando el usuario pasa el mouse sobre el elemento
titulo.setAttribute("title", "titulo normal");

//******************* 📜 METODOS DE ATRIBUTOS DE UN INPUT */
const input = document.querySelector(".input-normal");
// 🚨  value es un atributo que representa el valor actual de un elemento, como el texto ingresado en un campo de entrada 
input.value = "Valor cambiado";

// 🚨 Type es un atributo que indica el tipo de un elemento de formulario
input.type = "file";

// 🚨 accept es un atributo que especifica los tipos de archivos que el usuario puede seleccionar
input.accept = "image/png, image/jpeg";


input.type = "text";

// 🚨 form es un atributo que especifica el id del formulario al que pertenece un elemento de formulario, como un campo de entrada o un botón
input.form = "formulario";

// 🚨 minlength es un atributo que especifica la longitud mínima de un valor en un campo de entrada
input.minlength = "5";

// 🚨 maxlength es un atributo que especifica la longitud máxima de un valor en un campo de entrada
input.maxlength = "100";

// 🚨 placeholder es un atributo que proporciona un texto de sugerencia en un campo de entrada cuando está vacío
input.placeholder = "Ingrese su nombre";

// 🚨 required es un atributo booleano que indica que un campo de entrada debe ser completado antes de enviar el formulario
input.required = true;

//************************  🎨 PROPIEDAD STYLE ***************/
let elemento = document.querySelector(".style");

// elemento.style.backgroundColor = "#48e";
// elemento.style.padding = "10px";
// elemento.style.borderRadius = "5px";

//************************* 🏗️ CLASES, CLASSLIST Y SUS METODOS *****************/

// 💡 classList es una propiedad que devuelve una colección de las clases de un elemento, y tiene métodos para agregar, eliminar, alternar y verificar clases

// 🚨 add es un método de classList que agrega una o más clases a un elemento
elemento.classList.add("grande");

// 🚨 remove es un método de classList que elimina una o más clases de un elemento
elemento.classList.remove("grande");

//🚨 item es un método de classList que devuelve la clase en el índice especificado
let item = elemento.classList.item(2);
console.log(item);

// 🚨 contains es un método de classList que verifica si un elemento tiene una clase específica, devuelve true o false
let contiene = elemento.classList.contains("rojo");
console.log(contiene);

// 🚨 toggle es un método de classList que alterna la presencia de una clase en un elemento, si la clase está presente la elimina, y si no está presente la agrega y si tiene true igual la va a dejar 
elemento.classList.toggle("grande", false);

// 🚨 replace es un método de classList que reemplaza una clase por otra en un elemento
elemento.classList.replace("style", "chico")

//********************* 🔄 OBTENCION Y MODIFICACION DE ELEMENTOS********/

// 🚨 textContent → Maneja SOLO texto plano, ignora HTML y es el más seguro/rápido.
elemento.textContent;

// 🚨 innerText → Obtiene únicamente el texto VISIBLE en pantalla respetando estilos CSS.
elemento.innerText;

// 🚨 innerHTML → Lee o inserta HTML real; interpreta etiquetas y puede crear elementos dinámicamente.
elemento.innerHTML;