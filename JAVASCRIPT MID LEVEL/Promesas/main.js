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
let nombre = 'fredy';

// 2. Creación de la Promesa (new Promise)
// El constructor recibe una función ejecutora con dos callbacks:
//   - resolve: Se invoca si la promesa se cumple con éxito.
//   - reject: Se invoca si la promesa falla.
const promesa = new Promise((resolve, reject) => {
    
    // Al crearse la promesa, entra en estado "PENDIENTE" (Pending)

    if (nombre !== 'fredy') {
        // Si el nombre es incorrecto, rechazamos la promesa.
        // Esto cambia el estado a "RECHAZADA" (Rejected).
        reject("El nombre no es Fredy");
    } else {
        // Si el nombre es correcto, resolvemos la promesa con éxito.
        // Esto cambia el estado a "RESUELTA" (Fulfilled) y envía el valor.
        resolve(nombre);
    }

});

// 3. Consumo de la Promesa
// Escuchamos el resultado de la promesa usando .then() y .catch():
promesa
    // .then() se ejecuta si la promesa es RESUELTA con éxito.
    // El parámetro "resultado" recibe el valor que pasamos en resolve(nombre).
    .then((resultado) => {
        console.log(resultado); // Imprime: 'fredy'
    })
    // .catch() se ejecuta si la promesa es RECHAZADA por un error.
    // El parámetro "e" recibe el mensaje que pasamos en reject().
    .catch((e) => {
        console.log(e); // Imprime el error si la validación falla
    });

// ===================================================================
// EJEMPLO PRÁCTICO: ENCADENAMIENTO DE PROMESAS (PROMISE CHAINING)
// ===================================================================

// 4. Definición de la clase Persona que servirá como nuestro modelo de datos.
class Persona {
    constructor(nombre, instagram) {
        this.nombre = nombre;
        this.instagram = instagram;
    }
}

// 5. Datos simulados (Base de Datos en memoria)
const data = [
    ['fredy', '@fredy'],
    ['ana', '@ana'],
    ['luis', '@luis'],
];

// Creamos un array de instancias de la clase Persona a partir de la matriz de datos
const personas = [];
for (let i = 0; i < data.length; i++) {
    personas[i] = new Persona(data[i][0], data[i][1]);
}

// 6. Función para obtener una Persona por su ID (índice del array)
// Retorna una promesa para simular una consulta asíncrona a una base de datos.
const obtenerPersona = (id) => {
    return new Promise((res, rej) => {
        // Si el elemento no existe en el índice indicado, rechazamos la promesa
        if (personas[id] == undefined) {
            rej("No se ha encontrado la persona");
        } else { 
            // Si existe, resolvemos la promesa enviando el objeto de la persona
            res(personas[id]); 
        }
    });
};

// 7. Función para obtener el Instagram de una Persona por su ID
// También retorna una promesa que resuelve con el handle de instagram.
const obtenerInstagram = (id) => {
    return new Promise((res, rej) => {
        // Si la propiedad instagram no existe o no está definida, rechazamos la promesa
        if (personas[id].instagram == undefined) {
            rej("No se ha encontrado el Instagram");
        } else { 
            // Si existe, resolvemos la promesa enviando el instagram de la persona
            res(personas[id].instagram); 
        }
    });
};

// 8. Consumo de Promesas Encadenadas (Promise Chaining)
// El encadenamiento nos ayuda a evitar el "Callback Hell" (anidación excesiva).
let id = 2;

obtenerPersona(id)
    // Primer .then(): Se ejecuta cuando obtenerPersona se resuelve correctamente.
    .then((persona) => {
        console.log(persona.nombre); // Imprime el nombre de la persona encontrada
        
        // Retornamos una nueva promesa (obtenerInstagram) dentro del .then()
        // Esto permite encadenar el siguiente .then() al mismo nivel.
        return obtenerInstagram(id);
    })
    // Segundo .then(): Recibe el resultado de la promesa retornada en el paso anterior.
    .then((instagram) => {
        console.log(instagram); // Imprime el instagram obtenido
    })
    // Un único .catch(): Captura cualquier error que ocurra en CUALQUIERA
    // de las promesas de la cadena anterior (ya sea obtenerPersona u obtenerInstagram).
    .catch((err) => {
        console.log(err); // Muestra el mensaje de error correspondiente
    });

// ===================================================================
// LÓGICA DE INTERACCIÓN CON EL DOM (DASHBOARD INTERACTIVO)
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CONTROL DE PESTAÑAS (TABS) ---
    const tabSingle = document.getElementById('tabSingle');
    const tabChain = document.getElementById('tabChain');
    const singleTabContent = document.getElementById('single-tab');
    const chainTabContent = document.getElementById('chain-tab');

    const switchTab = (activeBtn, activeContent, inactiveBtn, inactiveContent) => {
        activeBtn.classList.add('active');
        activeContent.classList.remove('hidden');
        inactiveBtn.classList.remove('active');
        inactiveContent.classList.add('hidden');
    };

    tabSingle.addEventListener('click', () => {
        switchTab(tabSingle, singleTabContent, tabChain, chainTabContent);
    });

    tabChain.addEventListener('click', () => {
        switchTab(tabChain, chainTabContent, tabSingle, singleTabContent);
        // Resalta la fila inicial seleccionada al entrar a la pestaña
        updateSelectedRow(document.getElementById('chainUserSelect').value);
    });

    // --- 2. DEMO 1: PROMESA ÚNICA ---
    const runPromiseBtn = document.getElementById('runPromiseBtn');
    const delaySelect = document.getElementById('delaySelect');
    const behaviorSelect = document.getElementById('behaviorSelect');
    const promiseIndicator = document.getElementById('promiseIndicator');
    const promiseStateText = document.getElementById('promiseStateText');
    const progressBar = document.getElementById('progressBar');
    const resultText = document.getElementById('result');
    const demoNote = document.getElementById('demoNote');

    let animationFrameId;

    const animateProgressBar = (duration, onComplete) => {
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min((elapsed / duration) * 100, 100);
            progressBar.style.width = `${progress}%`;

            if (elapsed < duration) {
                animationFrameId = requestAnimationFrame(step);
            } else {
                if (onComplete) onComplete();
            }
        };
        cancelAnimationFrame(animationFrameId);
        progressBar.style.width = '0%';
        animationFrameId = requestAnimationFrame(step);
    };

    runPromiseBtn.addEventListener('click', () => {
        // Deshabilitar botón temporalmente durante la ejecución
        runPromiseBtn.disabled = true;

        // Resetear interfaz a estado PENDIENTE
        promiseIndicator.className = 'promise-indicator state-pending';
        promiseStateText.className = 'state-pending-text';
        promiseStateText.textContent = 'Pendiente (Pending)...';
        progressBar.style.width = '0%';
        resultText.className = 'pending';
        resultText.textContent = 'Esperando resolución de la promesa...';
        demoNote.textContent = 'Estado: Operación asíncrona iniciada';

        const delay = parseInt(delaySelect.value);
        const behavior = behaviorSelect.value;

        // Determinar el resultado (éxito o fracaso)
        let shouldResolve = true;
        if (behavior === 'reject') {
            shouldResolve = false;
        } else if (behavior === 'random') {
            shouldResolve = Math.random() >= 0.5;
        }

        // Crear la Promesa interactiva
        const promesaInteractiva = new Promise((resolve, reject) => {
            setTimeout(() => {
                if (shouldResolve) {
                    resolve("¡Promesa Resuelta con éxito! 🎉");
                } else {
                    reject("La promesa ha sido rechazada por el servidor. ❌");
                }
            }, delay);
        });

        // Animar la barra de progreso paralelamente
        animateProgressBar(delay);

        // Consumir la Promesa
        promesaInteractiva
            .then((mensaje) => {
                promiseIndicator.className = 'promise-indicator state-fulfilled';
                promiseStateText.className = 'state-fulfilled-text';
                promiseStateText.textContent = 'Resuelta (Fulfilled)';
                resultText.className = 'fulfilled';
                resultText.textContent = mensaje;
                demoNote.textContent = `Operación completada en ${delay}ms`;
            })
            .catch((error) => {
                promiseIndicator.className = 'promise-indicator state-rejected';
                promiseStateText.className = 'state-rejected-text';
                promiseStateText.textContent = 'Rechazada (Rejected)';
                resultText.className = 'rejected';
                resultText.textContent = error;
                demoNote.textContent = `Operación falló en ${delay}ms`;
            })
            .finally(() => {
                runPromiseBtn.disabled = false;
            });
    });

    // --- 3. DEMO 2: ENCADENAMIENTO DE PROMESAS (CHAINING) ---
    const runChainBtn = document.getElementById('runChainBtn');
    const chainUserSelect = document.getElementById('chainUserSelect');
    const chainResult = document.getElementById('chainResult');
    const chainDemoNote = document.getElementById('chainDemoNote');

    // Pasos del Timeline
    const step1Circle = document.getElementById('step1Circle');
    const step1Status = document.getElementById('step1Status');
    const step2Circle = document.getElementById('step2Circle');
    const step2Status = document.getElementById('step2Status');

    // Función para resaltar la fila seleccionada de la base de datos
    const updateSelectedRow = (selectedId) => {
        // Limpiar selecciones previas
        for (let i = 0; i <= 3; i++) {
            const row = document.getElementById(`db-row-${i}`);
            if (row) row.classList.remove('selected-row');
        }
        // Resaltar la fila correspondiente (si existe)
        const activeRow = document.getElementById(`db-row-${selectedId}`);
        if (activeRow) activeRow.classList.add('selected-row');
    };

    chainUserSelect.addEventListener('change', (e) => {
        updateSelectedRow(e.target.value);
    });

    // Ejecución de la consulta encadenada interactiva
    runChainBtn.addEventListener('click', () => {
        const idConsulta = parseInt(chainUserSelect.value);
        runChainBtn.disabled = true;

        // Resetear visualización de pasos
        step1Circle.className = 'step-circle state-idle';
        step1Status.className = 'step-status-text state-idle-text';
        step1Status.textContent = 'Esperando...';

        step2Circle.className = 'step-circle state-idle';
        step2Status.className = 'step-status-text state-idle-text';
        step2Status.textContent = 'Esperando...';

        chainResult.className = 'pending';
        chainResult.textContent = 'Consultando secuencia de promesas...';
        chainDemoNote.textContent = 'Estado de la cadena: Ejecutando Paso 1';

        // Iniciamos Paso 1
        step1Circle.className = 'step-circle state-pending';
        step1Status.className = 'step-status-text state-pending-text';
        step1Status.textContent = 'Consultando Persona (id)...';

        // Simulación con retrasos artificiales (1.2 segundos por promesa) para visualización
        new Promise((resolve) => setTimeout(resolve, 1200))
            .then(() => {
                // Ejecutamos la promesa real de búsqueda de persona
                return obtenerPersona(idConsulta);
            })
            .then((persona) => {
                // Paso 1 Exitoso
                step1Circle.className = 'step-circle state-fulfilled';
                step1Status.className = 'step-status-text state-fulfilled-text';
                step1Status.textContent = `Completado. Persona: ${persona.nombre}`;
                
                chainDemoNote.textContent = 'Estado de la cadena: Ejecutando Paso 2';

                // Iniciamos Paso 2
                step2Circle.className = 'step-circle state-pending';
                step2Status.className = 'step-status-text state-pending-text';
                step2Status.textContent = 'Buscando Instagram...';

                return new Promise((resolve) => setTimeout(resolve, 1200))
                    .then(() => {
                        // Ejecutamos la promesa real de instagram
                        return obtenerInstagram(idConsulta);
                    });
            })
            .then((instagram) => {
                // Paso 2 Exitoso
                step2Circle.className = 'step-circle state-fulfilled';
                step2Status.className = 'step-status-text state-fulfilled-text';
                step2Status.textContent = `Completado. Instagram: ${instagram}`;

                chainResult.className = 'fulfilled';
                chainResult.textContent = `¡Consulta completada! Se encontró el perfil: @${instagram.replace('@', '')}`;
                chainDemoNote.textContent = 'Estado de la cadena: Todo resuelto (Fulfilled)';
            })
            .catch((error) => {
                // Captura el error en cualquier paso de la cadena
                chainResult.className = 'rejected';
                chainResult.textContent = `Cadena falló: "${error}"`;
                chainDemoNote.textContent = 'Estado de la cadena: Error / Rechazada (Rejected)';

                // Identificamos dónde falló para pintar el estado visual correcto
                if (step1Status.textContent.includes('Consultando Persona')) {
                    // Falló en obtenerPersona (Paso 1)
                    step1Circle.className = 'step-circle state-rejected';
                    step1Status.className = 'step-status-text state-rejected-text';
                    step1Status.textContent = `Error: ${error}`;
                } else {
                    // Falló en obtenerInstagram (Paso 2)
                    step2Circle.className = 'step-circle state-rejected';
                    step2Status.className = 'step-status-text state-rejected-text';
                    step2Status.textContent = `Error: ${error}`;
                }
            })
            .finally(() => {
                runChainBtn.disabled = false;
            });
    });
});