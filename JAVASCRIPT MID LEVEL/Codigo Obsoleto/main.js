// Guía Interactiva — Código Obsoleto vs Estándar Moderno

const temas = {
    var: {
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
    substr: {
        old: `const texto = "JavaScript";
// Deprecated (segundo parámetro es longitud)
const parte = texto.substr(4, 6);`,
        modern: `const texto = "JavaScript";
// Estándar (inicio y fin)
const parte = texto.slice(4, 10);`,
        note: "String.prototype.substr() está marcado como legado en ECMAScript; usa slice()."
    },
    escape: {
        old: `// Obsoleto: no soporta bien UTF-8
const mal = escape("Diseño & JS 🚀");`,
        modern: `// Estándar UTF-8 seguro para URLs
const bien = encodeURIComponent("Diseño & JS 🚀");`,
        note: "escape() y unescape() están obsoletos. Usa encodeURIComponent() / decodeURIComponent()."
    },
    clone: {
        old: `// Pierde Date, Map, Set y falla con circulares
const copia = JSON.parse(JSON.stringify(obj));`,
        modern: `// Copia profunda nativa moderna
const copia = structuredClone(obj);`,
        note: "structuredClone() preserva Date, Map, Set, RegExp y referencias circulares."
    }
};

const oldCode = document.getElementById("oldCode");
const newCode = document.getElementById("newCode");
const topicNote = document.getElementById("topicNote");
const topicButtons = document.getElementById("topicButtons");
const uriInput = document.getElementById("uriInput");
const uriOutput = document.getElementById("uriOutput");

function renderTopic(key) {
    const t = temas[key];
    oldCode.textContent = t.old;
    newCode.textContent = t.modern;
    topicNote.textContent = t.note;

    topicButtons.querySelectorAll("button").forEach((b) => {
        b.classList.toggle("primary", b.dataset.topic === key);
    });
}

topicButtons.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-topic]");
    if (btn) renderTopic(btn.dataset.topic);
});

function updateUriDemo() {
    const val = uriInput.value;
    const moderno = encodeURIComponent(val);
    uriOutput.textContent = `encodeURIComponent("${val}") → "${moderno}"`;
}

uriInput.addEventListener("input", updateUriDemo);
renderTopic("var");
updateUriDemo();
