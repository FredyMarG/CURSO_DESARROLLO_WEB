const contenedor = document.querySelector(".contenedor");
const fragmento = document.createDocumentFragment();

// for (let i = 0; i < 20; i++) {
//     const item = document.createElement("li")
//     item.innerHTML = "Este es un item de la lista"
//     fragmento.appendChild(item)
// }
// contenedor.appendChild(fragmento)

/************* 👤 OBTENCION Y MODIFICACION DE CHILDS */

//con first child me trae el primer hijo mientras que con first element child me trae el elemento que es el primer hijo
// const primerHijo = contenedor.firstElementChild;
// console.log(primerHijo);


// con last child me trae el ultimo hijo mientras que con last element child me trae el elemento que es el ultimo hijo
// const ultimoHijo = contenedor.lastElementChild;
// console.log(ultimoHijo);

// me trae el nodelist de todos los elementos del html
// const hijos = contenedor.childNodes;
// console.log(hijos);

// me trae el nodelist de todos los elementos del html
// for (const hijo of hijos) {
//     console.log(hijo);
// }
// me trae los nodos de los hijos del html
// const hijos2 = contenedor.children;
// for (const hijo of hijos2) {
//     console.log(hijo);
// }

/****************** // 👤 METODOS DE CHILDS (HIJOS) */

const parrafo = document.createElement("P").innerHTML = "Parrafo"
const h2Nuevo = document.createElement("H2")
h2Nuevo.innerHTML = "Titulo 2"
const h2Antiguo = document.querySelector("h2");
// 🚨 replace child me reemplaza algun elemento de los hijos
contenedor.replaceChild(h2Nuevo, h2Antiguo)

// 🚨 remove child me elimina un hijo de un elemento padre
//contenedor.removeChild(h2Nuevo)

// 🚨 Has chilnode me verifica si el elemento tiene hijos o no 
let respuesta = h2Nuevo.hasChildNodes();
if (respuesta) {
    document.write("El elemento tiene hijos");
} else {
    document.write("El elemento NO tiene hijos");
}

/****************** 🧑‍💼 METODOS DE PADRE */

let res = contenedor.parentElement;
console.log(res);

/***************  🙌 METODOS DE HERMANOS (SIBLINGS)  */
// 📚 PreviousSibling me muestra el elemento anterior pero solo lo que hay (text)
console.log(h2Nuevo.previousSibling);

// 📚 nextSiblings me muestra el elemento siguiente pero solo lo que hay (text)
console.log(h2Nuevo.nextSibling);

// 📚 previousElementSibling  me muestra el elemento anterior al elemento actual
console.log(h2Nuevo.previousElementSibling);

// 📚 nextElementSibling me muestra el elemento siguiente al elemento actual
console.log(h2Nuevo.nextElementSibling);