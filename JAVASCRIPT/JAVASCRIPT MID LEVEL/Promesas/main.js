// ===================================================================
// EXPLICACIÓN DE PROMESAS EN JAVASCRIPT
// ===================================================================
// Una promesa es un objeto que representa el éxito o fracaso
// eventual de una operación. Tiene 3 estados:
//   - Pendiente (Pending): Estado inicial, no se ha completado.
//   - Resuelta (Fulfilled): Operación exitosa (se llama a resolve).
//   - Rechazada (Rejected): Operación fallida (se llama a reject).
// ===================================================================

// 1. Declaración de una variable de prueba
// Este valor lo usaremos dentro de la promesa para evaluar la condición.
let nombre = 'fredy'; // Declara e inicializa "nombre"

// 2. Creación de la Promesa (new Promise)
// El constructor recibe una función ejecutora con dos callbacks:
//   - resolve: Se invoca si la promesa se cumple con éxito.
//   - reject: Se invoca si la promesa falla.
const promesa = new Promise((resolve, reject) => { // Define función flecha "promesa"
    
    // Al crearse la promesa, entra en estado "PENDIENTE" (Pending)

    if (nombre !== 'fredy') { // Evalúa condición
        // Si el nombre es incorrecto, rechazamos la promesa.
        // Esto cambia el estado a "RECHAZADA" (Rejected).
        reject("El nombre no es Fredy"); // Ejecuta llamada o método
    } else { // Instrucción JavaScript
        // Si el nombre es correcto, resolvemos la promesa con éxito.
        // Esto cambia el estado a "RESUELTA" (Fulfilled) y envía el valor.
        resolve(nombre); // Ejecuta llamada o método
    }

});

// 3. Consumo de la Promesa
// Escuchamos el resultado de la promesa usando .then() y .catch():
promesa
    // .then() se ejecuta si la promesa es RESUELTA con éxito.
    // El parámetro "resultado" recibe el valor que pasamos en resolve(nombre).
    .then((resultado) => { // Instrucción JavaScript
        console.log(resultado); // Imprime: 'fredy'
    })
    // .catch() se ejecuta si la promesa es RECHAZADA por un error.
    // El parámetro "e" recibe el mensaje que pasamos en reject().
    .catch((e) => { // Instrucción JavaScript
        console.log(e); // Imprime el error si la validación falla
    });

// ===================================================================
// EJEMPLO PRÁCTICO: ENCADENAMIENTO DE PROMESAS (PROMISE CHAINING)
// ===================================================================

// 4. Definición de la clase Persona que servirá como nuestro modelo de datos.
class Persona { // Define clase
    constructor(nombre, instagram) { // Instrucción JavaScript
        this.nombre = nombre; // Asigna valor
        this.instagram = instagram; // Asigna valor
    }
}

// 5. Datos simulados (Base de Datos en memoria)
const data = [
    ['fredy', '@fredy'],
    ['ana', '@ana'],
    ['luis', '@luis'],
];

// Creamos un array de instancias de la clase Persona a partir de la matriz de datos
const personas = []; // Declara e inicializa "personas"
for (let i = 0; i < data.length; i++) { // Inicia bucle de iteración
    personas[i] = new Persona(data[i][0], data[i][1]); // Asigna valor
}

// 6. Función para obtener una Persona por su ID (índice del array)
// Retorna una promesa para simular una consulta asíncrona a una base de datos.
const obtenerPersona = (id) => { // Define función flecha "obtenerPersona"
    return new Promise((res, rej) => { // Retorna resultado
        // Si el elemento no existe en el índice indicado, rechazamos la promesa
        if (personas[id] == undefined) { // Evalúa condición
            rej("No se ha encontrado la persona"); // Ejecuta llamada o método
        } else {  // Instrucción JavaScript
            // Si existe, resolvemos la promesa enviando el objeto de la persona
            res(personas[id]);  // Ejecuta llamada o método
        }
    });
};

// 7. Función para obtener el Instagram de una Persona por su ID
// También retorna una promesa que resuelve con el handle de instagram.
const obtenerInstagram = (id) => { // Define función flecha "obtenerInstagram"
    return new Promise((res, rej) => { // Retorna resultado
        // Si la propiedad instagram no existe o no está definida, rechazamos la promesa
        if (personas[id].instagram == undefined) { // Evalúa condición
            rej("No se ha encontrado el Instagram"); // Ejecuta llamada o método
        } else {  // Instrucción JavaScript
            // Si existe, resolvemos la promesa enviando el instagram de la persona
            res(personas[id].instagram);  // Ejecuta llamada o método
        }
    });
};

// 8. Consumo de Promesas Encadenadas (Promise Chaining)
// El encadenamiento nos ayuda a evitar el "Callback Hell" (anidación excesiva).
let id = 2; // Declara e inicializa "id"

obtenerPersona(id)
    // Primer .then(): Se ejecuta cuando obtenerPersona se resuelve correctamente.
    .then((persona) => { // Instrucción JavaScript
        console.log(persona.nombre); // Imprime el nombre de la persona encontrada
        
        // Retornamos una nueva promesa (obtenerInstagram) dentro del .then()
        // Esto permite encadenar el siguiente .then() al mismo nivel.
        return obtenerInstagram(id); // Retorna resultado
    })
    // Segundo .then(): Recibe el resultado de la promesa retornada en el paso anterior.
    .then((instagram) => { // Instrucción JavaScript
        console.log(instagram); // Imprime el instagram obtenido
    })
    // Un único .catch(): Captura cualquier error que ocurra en CUALQUIERA
    // de las promesas de la cadena anterior (ya sea obtenerPersona u obtenerInstagram).
    .catch((err) => { // Instrucción JavaScript
        console.log(err); // Muestra el mensaje de error correspondiente
    });

// ===================================================================
// LÓGICA DE INTERACCIÓN CON EL DOM (DASHBOARD INTERACTIVO)
// ===================================================================

document.addEventListener('DOMContentLoaded', () => { // Registra escuchador de eventos
    
    // --- 1. CONTROL DE PESTAÑAS (TABS) ---
    const tabSingle = document.getElementById('tabSingle'); // Obtiene referencia DOM para "tabSingle"
    const tabChain = document.getElementById('tabChain'); // Obtiene referencia DOM para "tabChain"
    const singleTabContent = document.getElementById('single-tab'); // Obtiene referencia DOM para "singleTabContent"
    const chainTabContent = document.getElementById('chain-tab'); // Obtiene referencia DOM para "chainTabContent"

    const switchTab = (activeBtn, activeContent, inactiveBtn, inactiveContent) => { // Define función flecha "switchTab"
        activeBtn.classList.add('active'); // Modifica clases CSS del elemento
        activeContent.classList.remove('hidden'); // Modifica clases CSS del elemento
        inactiveBtn.classList.remove('active'); // Modifica clases CSS del elemento
        inactiveContent.classList.add('hidden'); // Modifica clases CSS del elemento
    };

    tabSingle.addEventListener('click', () => { // Registra escuchador de eventos
        switchTab(tabSingle, singleTabContent, tabChain, chainTabContent); // Ejecuta llamada o método
    });

    tabChain.addEventListener('click', () => { // Registra escuchador de eventos
        switchTab(tabChain, chainTabContent, tabSingle, singleTabContent); // Ejecuta llamada o método
        // Resalta la fila inicial seleccionada al entrar a la pestaña
        updateSelectedRow(document.getElementById('chainUserSelect').value); // Ejecuta llamada o método
    });

    // --- 2. DEMO 1: PROMESA ÚNICA ---
    const runPromiseBtn = document.getElementById('runPromiseBtn'); // Obtiene referencia DOM para "runPromiseBtn"
    const delaySelect = document.getElementById('delaySelect'); // Obtiene referencia DOM para "delaySelect"
    const behaviorSelect = document.getElementById('behaviorSelect'); // Obtiene referencia DOM para "behaviorSelect"
    const promiseIndicator = document.getElementById('promiseIndicator'); // Obtiene referencia DOM para "promiseIndicator"
    const promiseStateText = document.getElementById('promiseStateText'); // Obtiene referencia DOM para "promiseStateText"
    const progressBar = document.getElementById('progressBar'); // Obtiene referencia DOM para "progressBar"
    const resultText = document.getElementById('result'); // Obtiene referencia DOM para "resultText"
    const demoNote = document.getElementById('demoNote'); // Obtiene referencia DOM para "demoNote"

    let animationFrameId; // Declara e inicializa "animationFrameId"

    const animateProgressBar = (duration, onComplete) => { // Define función flecha "animateProgressBar"
        let startTime = null; // Declara e inicializa "startTime"
        const step = (timestamp) => { // Define función flecha "step"
            if (!startTime) startTime = timestamp; // Evalúa condición
            const elapsed = timestamp - startTime; // Declara e inicializa "elapsed"
            const progress = Math.min((elapsed / duration) * 100, 100); // Declara e inicializa "progress"
            progressBar.style.width = `${progress}%`; // Asigna valor

            if (elapsed < duration) { // Evalúa condición
                animationFrameId = requestAnimationFrame(step); // Asigna valor
            } else { // Instrucción JavaScript
                if (onComplete) onComplete(); // Evalúa condición
            }
        };
        cancelAnimationFrame(animationFrameId); // Ejecuta llamada o método
        progressBar.style.width = '0%'; // Asigna valor
        animationFrameId = requestAnimationFrame(step); // Asigna valor
    };

    runPromiseBtn.addEventListener('click', () => { // Registra escuchador de eventos
        // Deshabilitar botón temporalmente durante la ejecución
        runPromiseBtn.disabled = true; // Asigna valor

        // Resetear interfaz a estado PENDIENTE
        promiseIndicator.className = 'promise-indicator state-pending'; // Asigna valor
        promiseStateText.className = 'state-pending-text'; // Asigna valor
        promiseStateText.textContent = 'Pendiente (Pending)...'; // Actualiza contenido en el DOM
        progressBar.style.width = '0%'; // Asigna valor
        resultText.className = 'pending'; // Asigna valor
        resultText.textContent = 'Esperando resolución de la promesa...'; // Actualiza contenido en el DOM
        demoNote.textContent = 'Estado: Operación asíncrona iniciada'; // Actualiza contenido en el DOM

        const delay = parseInt(delaySelect.value); // Declara e inicializa "delay"
        const behavior = behaviorSelect.value; // Declara e inicializa "behavior"

        // Determinar el resultado (éxito o fracaso)
        let shouldResolve = true; // Declara e inicializa "shouldResolve"
        if (behavior === 'reject') { // Evalúa condición
            shouldResolve = false; // Asigna valor
        } else if (behavior === 'random') { // Instrucción JavaScript
            shouldResolve = Math.random() >= 0.5; // Asigna valor
        }

        // Crear la Promesa interactiva
        const promesaInteractiva = new Promise((resolve, reject) => { // Define función flecha "promesaInteractiva"
            setTimeout(() => { // Instrucción JavaScript
                if (shouldResolve) { // Evalúa condición
                    resolve("¡Promesa Resuelta con éxito! 🎉"); // Ejecuta llamada o método
                } else { // Instrucción JavaScript
                    reject("La promesa ha sido rechazada por el servidor. ❌"); // Ejecuta llamada o método
                }
            }, delay); // Ejecuta llamada o método
        });

        // Animar la barra de progreso paralelamente
        animateProgressBar(delay); // Ejecuta llamada o método

        // Consumir la Promesa
        promesaInteractiva
            .then((mensaje) => { // Instrucción JavaScript
                promiseIndicator.className = 'promise-indicator state-fulfilled'; // Asigna valor
                promiseStateText.className = 'state-fulfilled-text'; // Asigna valor
                promiseStateText.textContent = 'Resuelta (Fulfilled)'; // Actualiza contenido en el DOM
                resultText.className = 'fulfilled'; // Asigna valor
                resultText.textContent = mensaje; // Actualiza contenido en el DOM
                demoNote.textContent = `Operación completada en ${delay}ms`; // Actualiza contenido en el DOM
            })
            .catch((error) => { // Instrucción JavaScript
                promiseIndicator.className = 'promise-indicator state-rejected'; // Asigna valor
                promiseStateText.className = 'state-rejected-text'; // Asigna valor
                promiseStateText.textContent = 'Rechazada (Rejected)'; // Actualiza contenido en el DOM
                resultText.className = 'rejected'; // Asigna valor
                resultText.textContent = error; // Actualiza contenido en el DOM
                demoNote.textContent = `Operación falló en ${delay}ms`; // Actualiza contenido en el DOM
            })
            .finally(() => { // Instrucción JavaScript
                runPromiseBtn.disabled = false; // Asigna valor
            });
    });

    // --- 3. DEMO 2: ENCADENAMIENTO DE PROMESAS (CHAINING) ---
    const runChainBtn = document.getElementById('runChainBtn'); // Obtiene referencia DOM para "runChainBtn"
    const chainUserSelect = document.getElementById('chainUserSelect'); // Obtiene referencia DOM para "chainUserSelect"
    const chainResult = document.getElementById('chainResult'); // Obtiene referencia DOM para "chainResult"
    const chainDemoNote = document.getElementById('chainDemoNote'); // Obtiene referencia DOM para "chainDemoNote"

    // Pasos del Timeline
    const step1Circle = document.getElementById('step1Circle'); // Obtiene referencia DOM para "step1Circle"
    const step1Status = document.getElementById('step1Status'); // Obtiene referencia DOM para "step1Status"
    const step2Circle = document.getElementById('step2Circle'); // Obtiene referencia DOM para "step2Circle"
    const step2Status = document.getElementById('step2Status'); // Obtiene referencia DOM para "step2Status"

    // Función para resaltar la fila seleccionada de la base de datos
    const updateSelectedRow = (selectedId) => { // Define función flecha "updateSelectedRow"
        // Limpiar selecciones previas
        for (let i = 0; i <= 3; i++) { // Inicia bucle de iteración
            const row = document.getElementById(`db-row-${i}`); // Obtiene referencia DOM para "row"
            if (row) row.classList.remove('selected-row'); // Evalúa condición
        }
        // Resaltar la fila correspondiente (si existe)
        const activeRow = document.getElementById(`db-row-${selectedId}`); // Obtiene referencia DOM para "activeRow"
        if (activeRow) activeRow.classList.add('selected-row'); // Evalúa condición
    };

    chainUserSelect.addEventListener('change', (e) => { // Registra escuchador de eventos
        updateSelectedRow(e.target.value); // Ejecuta llamada o método
    });

    // Ejecución de la consulta encadenada interactiva
    runChainBtn.addEventListener('click', () => { // Registra escuchador de eventos
        const idConsulta = parseInt(chainUserSelect.value); // Declara e inicializa "idConsulta"
        runChainBtn.disabled = true; // Asigna valor

        // Resetear visualización de pasos
        step1Circle.className = 'step-circle state-idle'; // Asigna valor
        step1Status.className = 'step-status-text state-idle-text'; // Asigna valor
        step1Status.textContent = 'Esperando...'; // Actualiza contenido en el DOM

        step2Circle.className = 'step-circle state-idle'; // Asigna valor
        step2Status.className = 'step-status-text state-idle-text'; // Asigna valor
        step2Status.textContent = 'Esperando...'; // Actualiza contenido en el DOM

        chainResult.className = 'pending'; // Asigna valor
        chainResult.textContent = 'Consultando secuencia de promesas...'; // Actualiza contenido en el DOM
        chainDemoNote.textContent = 'Estado de la cadena: Ejecutando Paso 1'; // Actualiza contenido en el DOM

        // Iniciamos Paso 1
        step1Circle.className = 'step-circle state-pending'; // Asigna valor
        step1Status.className = 'step-status-text state-pending-text'; // Asigna valor
        step1Status.textContent = 'Consultando Persona (id)...'; // Actualiza contenido en el DOM

        // Simulación con retrasos artificiales (1.2 segundos por promesa) para visualización
        new Promise((resolve) => setTimeout(resolve, 1200))
            .then(() => { // Instrucción JavaScript
                // Ejecutamos la promesa real de búsqueda de persona
                return obtenerPersona(idConsulta); // Retorna resultado
            })
            .then((persona) => { // Instrucción JavaScript
                // Paso 1 Exitoso
                step1Circle.className = 'step-circle state-fulfilled'; // Asigna valor
                step1Status.className = 'step-status-text state-fulfilled-text'; // Asigna valor
                step1Status.textContent = `Completado. Persona: ${persona.nombre}`; // Actualiza contenido en el DOM
                
                chainDemoNote.textContent = 'Estado de la cadena: Ejecutando Paso 2'; // Actualiza contenido en el DOM

                // Iniciamos Paso 2
                step2Circle.className = 'step-circle state-pending'; // Asigna valor
                step2Status.className = 'step-status-text state-pending-text'; // Asigna valor
                step2Status.textContent = 'Buscando Instagram...'; // Actualiza contenido en el DOM

                return new Promise((resolve) => setTimeout(resolve, 1200))
                    .then(() => { // Instrucción JavaScript
                        // Ejecutamos la promesa real de instagram
                        return obtenerInstagram(idConsulta); // Retorna resultado
                    });
            })
            .then((instagram) => { // Instrucción JavaScript
                // Paso 2 Exitoso
                step2Circle.className = 'step-circle state-fulfilled'; // Asigna valor
                step2Status.className = 'step-status-text state-fulfilled-text'; // Asigna valor
                step2Status.textContent = `Completado. Instagram: ${instagram}`; // Actualiza contenido en el DOM

                chainResult.className = 'fulfilled'; // Asigna valor
                chainResult.textContent = `¡Consulta completada! Se encontró el perfil: @${instagram.replace('@', '')}`; // Actualiza contenido en el DOM
                chainDemoNote.textContent = 'Estado de la cadena: Todo resuelto (Fulfilled)'; // Actualiza contenido en el DOM
            })
            .catch((error) => { // Instrucción JavaScript
                // Captura el error en cualquier paso de la cadena
                chainResult.className = 'rejected'; // Asigna valor
                chainResult.textContent = `Cadena falló: "${error}"`; // Actualiza contenido en el DOM
                chainDemoNote.textContent = 'Estado de la cadena: Error / Rechazada (Rejected)'; // Actualiza contenido en el DOM

                // Identificamos dónde falló para pintar el estado visual correcto
                if (step1Status.textContent.includes('Consultando Persona')) { // Evalúa condición
                    // Falló en obtenerPersona (Paso 1)
                    step1Circle.className = 'step-circle state-rejected'; // Asigna valor
                    step1Status.className = 'step-status-text state-rejected-text'; // Asigna valor
                    step1Status.textContent = `Error: ${error}`; // Actualiza contenido en el DOM
                } else { // Instrucción JavaScript
                    // Falló en obtenerInstagram (Paso 2)
                    step2Circle.className = 'step-circle state-rejected'; // Asigna valor
                    step2Status.className = 'step-status-text state-rejected-text'; // Asigna valor
                    step2Status.textContent = `Error: ${error}`; // Actualiza contenido en el DOM
                }
            })
            .finally(() => { // Instrucción JavaScript
                runChainBtn.disabled = false; // Asigna valor
            });
    });
});