// Guía Interactiva — Código Obsoleto vs Estándar Moderno

const temas = { // Declara e inicializa "temas"
    var: { // Instrucción JavaScript
        old: `for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 10);
}
// Imprime: 3, 3, 3 (scope de función)`,
        modern: `for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 10);
}
// Imprime: 0, 1, 2 (scope de bloque)`,
        note: "Usa const por defecto y let cuando necesites reasignar. Evita var."
    },
    substr: { // Instrucción JavaScript
        old: `const texto = "JavaScript";
// Deprecated (segundo parámetro es longitud)
const parte = texto.substr(4, 6);`,
        modern: `const texto = "JavaScript";
// Estándar (inicio y fin)
const parte = texto.slice(4, 10);`,
        note: "String.prototype.substr() está marcado como legado en ECMAScript; usa slice()."
    },
    escape: { // Instrucción JavaScript
        old: `// Obsoleto: no soporta bien UTF-8
const mal = escape("Diseño & JS 🚀");`,
        modern: `// Estándar UTF-8 seguro para URLs
const bien = encodeURIComponent("Diseño & JS 🚀");`,
        note: "escape() y unescape() están obsoletos. Usa encodeURIComponent() / decodeURIComponent()."
    },
    clone: { // Instrucción JavaScript
        old: `// Pierde Date, Map, Set y falla con circulares
const copia = JSON.parse(JSON.stringify(obj));`,
        modern: `// Copia profunda nativa moderna
const copia = structuredClone(obj);`,
        note: "structuredClone() preserva Date, Map, Set, RegExp y referencias circulares."
    }
};

const oldCode = document.getElementById("oldCode"); // Obtiene referencia DOM para "oldCode"
const newCode = document.getElementById("newCode"); // Obtiene referencia DOM para "newCode"
const topicNote = document.getElementById("topicNote"); // Obtiene referencia DOM para "topicNote"
const topicButtons = document.getElementById("topicButtons"); // Obtiene referencia DOM para "topicButtons"
const uriInput = document.getElementById("uriInput"); // Obtiene referencia DOM para "uriInput"
const uriOutput = document.getElementById("uriOutput"); // Obtiene referencia DOM para "uriOutput"

function renderTopic(key) { // Declara función
    const t = temas[key]; // Declara e inicializa "t"
    oldCode.textContent = t.old; // Actualiza contenido en el DOM
    newCode.textContent = t.modern; // Actualiza contenido en el DOM
    topicNote.textContent = t.note; // Actualiza contenido en el DOM

    topicButtons.querySelectorAll("button").forEach((b) => { // Instrucción JavaScript
        b.classList.toggle("primary", b.dataset.topic === key); // Modifica clases CSS del elemento
    });
}

topicButtons.addEventListener("click", (e) => { // Registra escuchador de eventos
    const btn = e.target.closest("button[data-topic]"); // Declara e inicializa "btn"
    if (btn) renderTopic(btn.dataset.topic); // Evalúa condición
});

function updateUriDemo() { // Declara función
    const val = uriInput.value; // Declara e inicializa "val"
    const moderno = encodeURIComponent(val); // Declara e inicializa "moderno"
    uriOutput.textContent = `encodeURIComponent("${val}") → "${moderno}"`; // Actualiza contenido en el DOM
}

uriInput.addEventListener("input", updateUriDemo); // Registra escuchador de eventos
renderTopic("var"); // Ejecuta llamada o método
updateUriDemo(); // Ejecuta llamada o método
