const contenedor = document.querySelector(".contenedor");
const fragmento = document.createDocumentFragment();

// for (let i = 0; i < 20; i++) {
//     const item = document.createElement("li")
//     item.innerHTML = "Este es un item de la lista"
//     fragmento.appendChild(item)
// }
// contenedor.appendChild(fragmento)


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

const parrafo = document.createElement("P").innerHTML = "Parrafo"
const h2Nuevo = document.createElement("H2")
h2Nuevo.innerHTML = "Titulo 2"
const h2Antiguo = document.querySelector("h2");
// 🚨 replace child me reemplaza algun elemento de los hijos
contenedor.replaceChild(h2Nuevo, h2Antiguo)

// 🚨 remove child me elimina un hijo de un elemento padre
contenedor.removeChild(h2Nuevo)

// 🚨 Has chilnode
let respuesta = h2Nuevo.hasChildNodes();
if (respuesta) {
    document.write("El elemento tiene hijos");
} else {
    document.write("El elemento NO tiene hijos");
}


