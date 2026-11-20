// Activamos el modo estricto de ECMAScript para asegurar código limpio y libre de fallos silenciosos
"use strict";

// Verificamos si nos encontramos en el entorno del navegador web con acceso al DOM
if (typeof document !== "undefined") {

    // Solicitamos al motor de IndexedDB abrir o crear la base de datos denominada "BD" en su versión 1
    const IDBRequest = indexedDB.open("BD", 1);

    // Escuchamos el evento 'upgradeneeded', que se dispara únicamente si la base es nueva o la versión se incrementa
    IDBRequest.addEventListener("upgradeneeded", () => {
        // Obtenemos la instancia de la base de datos desde la propiedad result de la solicitud
        const db = IDBRequest.result;
        // Creamos el almacén de objetos (Object Store) llamado "nombres" con clave primaria autoincremental
        db.createObjectStore("nombres", {
            // Habilitamos autoIncrement en true para que cada objeto reciba una clave numérica automática (1, 2, 3...)
            autoIncrement: true
        });
    });

    // Escuchamos el evento 'success', que se ejecuta cuando la base de datos se abre y conecta satisfactoriamente
    IDBRequest.addEventListener("success", () => {
        // Invocamos la lectura de los objetos para poblar la lista visual inicial
        leerObjetos();
    });

    // Escuchamos el evento 'error', que se dispara en caso de presentarse algún fallo de acceso o cuota en la base
    IDBRequest.addEventListener("error", (err) => console.log("Error", err));

    // Seleccionamos el campo de entrada de texto del formulario por su id 'name'
    const nameInput = document.getElementById("name");
    // Seleccionamos el botón para añadir nuevos nombres por su id 'add'
    const addBtn = document.getElementById("add");

    // Función auxiliar que maneja la acción de añadir un nuevo nombre a la base de datos
    const manejarNuevoNombre = () => {
        // Obtenemos el texto ingresado eliminando espacios sobrantes al inicio y al final
        let nombre = nameInput.value.trim();
        // Validamos que el campo no se encuentre vacío
        if (nombre.length > 0) {
            // Verificamos si existe algún elemento en pantalla con cambios pendientes de guardar (.posible)
            if (document.querySelector(".posible")) {
                // Consultamos al usuario mediante confirmación si desea proceder sin guardar
                if (confirm("Hay elementos sin guardar: ¿Quieres continuar?")) {
                    // Guardamos el nuevo objeto en IndexedDB
                    addObjeto({ nombre });
                    // Limpiamos el valor del campo de texto
                    nameInput.value = "";
                    // Restauramos el foco en el campo para seguir escribiendo cómodamente
                    nameInput.focus();
                }
            // Si no hay elementos pendientes de guardar, procedemos de forma directa
            } else {
                // Guardamos el objeto en la base de datos
                addObjeto({ nombre });
                // Limpiamos el campo de texto
                nameInput.value = "";
                // Restauramos el foco
                nameInput.focus();
            }
        }
    };

    // Escuchamos el clic sobre el botón 'Añadir' para ejecutar la función de nuevo nombre
    addBtn.addEventListener("click", manejarNuevoNombre);

    // Permitimos agregar nombres presionando la tecla 'Enter' directamente en el campo de texto
    nameInput.addEventListener("keydown", (e) => {
        // Evaluamos si la tecla presionada fue 'Enter'
        if (e.key === "Enter") {
            // Prevenimos cualquier comportamiento por defecto
            e.preventDefault();
            // Ejecutamos la lógica de añadir nombre
            manejarNuevoNombre();
        }
    });

    // Función para agregar un objeto a la base de datos mediante una transacción de lectura y escritura
    const addObjeto = objeto => {
        // Obtenemos la referencia activa de la base de datos abierta
        const db = IDBRequest.result;
        // Iniciamos una transacción sobre el almacén "nombres" en modo de lectura y escritura ("readwrite")
        const transaction = db.transaction("nombres", "readwrite");
        // Obtenemos el almacén de objetos "nombres" a través de la transacción iniciada
        const objectStore = transaction.objectStore("nombres");
        // Insertamos el objeto recibido dentro del almacén
        objectStore.add(objeto);
        // Escuchamos el evento 'complete' de la transacción para saber cuándo los datos se guardaron efectivamente
        transaction.addEventListener("complete", () => {
            // Imprimimos en consola el mensaje de confirmación de inserción
            console.log("Objeto agregado correctamente");
            // Refrescamos la lista en pantalla para reflejar inmediatamente el nuevo registro
            leerObjetos();
        });
    };

    // Función para leer todos los registros almacenados utilizando un cursor iterativo
    const leerObjetos = () => {
        // Obtenemos la referencia activa de la base de datos abierta
        const db = IDBRequest.result;
        // Iniciamos una transacción sobre el almacén "nombres" en modo de solo lectura ("readonly")
        const transaction = db.transaction("nombres", "readonly");
        // Obtenemos el almacén de objetos "nombres" mediante la transacción
        const objectStore = transaction.objectStore("nombres");
        // Abrimos un cursor para iterar de manera secuencial sobre cada registro del almacén
        const cursor = objectStore.openCursor();
        // Creamos un DocumentFragment para optimizar las inserciones en el DOM y evitar repintados excesivos
        const fragment = document.createDocumentFragment();
        // Seleccionamos el contenedor de la lista de nombres
        const contenedorNombres = document.querySelector(".nombres");
        // Limpiamos los elementos visuales previos del contenedor
        contenedorNombres.innerHTML = "";
        // Contador local para verificar si existen registros o la base está vacía
        let cantidadRegistros = 0;

        // Escuchamos el evento 'success' del cursor, que se dispara por cada registro encontrado
        cursor.addEventListener("success", () => {
            // Evaluamos si el cursor apunta a un registro existente en la posición actual
            if (cursor.result) {
                // Incrementamos el contador de registros
                cantidadRegistros++;
                // Imprimimos en consola el valor del objeto apuntado por el cursor
                console.log(cursor.result.value);
                // Construimos el nodo visual HTML correspondiente pasando la clave (key) y el valor (value)
                let elemento = nombresHTMl(cursor.result.key, cursor.result.value);
                // Insertamos el elemento en el fragmento en memoria
                fragment.appendChild(elemento);
                // Avanzamos el cursor hacia el siguiente registro del almacén
                cursor.result.continue();
            // Si cursor.result es nulo, significa que ya no existen más registros por recorrer
            } else {
                // Si se encontró al menos un registro
                if (cantidadRegistros > 0) {
                    // Inyectamos el fragmento con todos los nombres en el DOM
                    contenedorNombres.appendChild(fragment);
                // Si la base de datos se encuentra vacía
                } else {
                    // Mostramos un mensaje discreto invitando al usuario a registrar su primer nombre
                    contenedorNombres.innerHTML = `<div class="mensaje-vacio">No hay nombres registrados todavía. ¡Añade uno arriba!</div>`;
                }
            }
        });
    };

    // Función para modificar o actualizar un objeto existente identificado por su clave primaria
    const modObjeto = (key, objeto) => {
        // Obtenemos la referencia activa de la base de datos
        const db = IDBRequest.result;
        // Iniciamos una transacción sobre el almacén "nombres" en modo "readwrite"
        const transaction = db.transaction("nombres", "readwrite");
        // Obtenemos el almacén de objetos a través de la transacción
        const objectStore = transaction.objectStore("nombres");
        // Usamos el método .put() pasando el nuevo valor y la clave primaria a sobrescribir
        objectStore.put(objeto, key);
        // Escuchamos el evento 'complete' que confirma que la modificación se aplicó en disco
        transaction.addEventListener("complete", () => {
            // Imprimimos el mensaje de confirmación de modificación
            console.log("Objeto modificado correctamente");
        });
    };

    // Función para eliminar un objeto de la base de datos a partir de su clave primaria
    const deleteObjeto = key => {
        // Obtenemos la referencia activa de la base de datos
        const db = IDBRequest.result;
        // Iniciamos una transacción de escritura sobre el almacén "nombres"
        const transaction = db.transaction("nombres", "readwrite");
        // Obtenemos el almacén de objetos
        const objectStore = transaction.objectStore("nombres");
        // Ejecutamos el método .delete() indicando la clave del registro a borrar
        objectStore.delete(key);
        // Escuchamos el evento 'complete' que valida la eliminación exitosa
        transaction.addEventListener("complete", () => {
            // Imprimimos mensaje confirmando la eliminación del objeto
            console.log("Objeto eliminado correctamente");
            // Verificamos si ya no quedan elementos visibles en la lista
            const contenedorNombres = document.querySelector(".nombres");
            // Si el contenedor quedó vacío tras borrar
            if (contenedorNombres.children.length === 0) {
                // Mostramos el mensaje de lista vacía
                contenedorNombres.innerHTML = `<div class="mensaje-vacio">No hay nombres registrados todavía. ¡Añade uno arriba!</div>`;
            }
        });
    };

    // Función encargada de crear el elemento visual en el DOM para cada nombre
    const nombresHTMl = (id, name) => {
        // Creamos el contenedor principal de la fila
        const container = document.createElement("DIV");
        // Creamos el título h2 que mostrará el nombre editable
        const h2 = document.createElement("h2");
        // Creamos el contenedor de botones de opciones
        const options = document.createElement("DIV");
        // Creamos el botón para guardar cambios
        const saveButton = document.createElement("button");
        // Creamos el botón para eliminar el registro
        const deleteButton = document.createElement("button");

        // Asignamos la clase 'nombre' al contenedor de la fila
        container.classList.add("nombre");
        // Asignamos la clase 'options' al grupo de botones
        options.classList.add("options");
        // Asignamos la clase 'imposible' al botón de guardar (estado inicial inactivo)
        saveButton.classList.add("imposible");
        // Asignamos la clase 'delete' al botón de eliminar
        deleteButton.classList.add("delete");

        // Definimos el texto del botón guardar
        saveButton.textContent = "Guardar";
        // Definimos el texto del botón eliminar
        deleteButton.textContent = "Eliminar";
        // Asignamos el valor del nombre al h2
        h2.textContent = name.nombre;
        // Habilitamos la edición inline del texto mediante el atributo contenteditable
        h2.setAttribute("contenteditable", "true");
        // Desactivamos el corrector ortográfico rojo para evitar subrayados molestos
        h2.setAttribute("spellcheck", "false");

        // Añadimos el botón de guardar al grupo de opciones
        options.appendChild(saveButton);
        // Añadimos el botón de eliminar al grupo de opciones
        options.appendChild(deleteButton);

        // Añadimos el encabezado h2 al contenedor de la fila
        container.appendChild(h2);
        // Añadimos el grupo de opciones al contenedor de la fila
        container.appendChild(options);

        // Función que habilita el botón guardar cuando el usuario modifica el texto
        const activarGuardado = () => {
            // Reemplazamos la clase 'imposible' por 'posible' para activar el estilo interactivo
            saveButton.classList.replace("imposible", "posible");
        };

        // Escuchamos el evento 'keyup' mientras el usuario escribe en el h2
        h2.addEventListener("keyup", activarGuardado);
        // Escuchamos también el evento 'input' para capturar borrados o pegados de texto
        h2.addEventListener("input", activarGuardado);

        // Escuchamos el clic sobre el botón de guardar
        saveButton.addEventListener("click", () => {
            // Verificamos si el botón se encuentra en estado activo ('posible')
            if (saveButton.classList.contains("posible")) {
                // Obtenemos el texto editado sin espacios residuales
                const nuevoNombre = h2.textContent.trim();
                // Si el nombre no está vacío
                if (nuevoNombre.length > 0) {
                    // Actualizamos el registro en IndexedDB
                    modObjeto(id, { nombre: nuevoNombre });
                    // Volvemos a colocar el botón en estado inactivo 'imposible'
                    saveButton.classList.replace("posible", "imposible");
                // Si el usuario intentó dejarlo en blanco
                } else {
                    // Indicamos visualmente sin bloquear con alert() y restauramos el nombre original
                    console.warn("El nombre no puede quedar vacío.");
                    h2.textContent = name.nombre;
                    h2.style.outline = "2px solid #ef4444";
                    setTimeout(() => { h2.style.outline = ""; }, 1200);
                    // Desactivamos el botón
                    saveButton.classList.replace("posible", "imposible");
                }
            }
        });

        // Escuchamos el clic sobre el botón de eliminar
        deleteButton.addEventListener("click", () => {
            // Eliminamos el registro de la base de datos usando su id (key)
            deleteObjeto(id);
            // Removemos de forma inmediata el elemento visual del DOM
            container.remove();
        });

        // Retornamos el nodo del contenedor completo listo para agregarse al fragmento
        return container;
    };

// Si el script se ejecuta en un entorno sin DOM (como Node.js desde la terminal)
} else {
    // Mostramos un mensaje informativo indicando que el código no posee errores de sintaxis
    console.log("ℹ️ [IndexedDB Ejercicio] Código ejecutado en Node.js sin errores de sintaxis.");
}
