// DevTools Lab — Pestaña Application

const keyInput = document.getElementById("keyInput");
const valInput = document.getElementById("valInput");
const storageView = document.getElementById("storageView");

function renderStorage() {
    const localData = {};
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        localData[k] = localStorage.getItem(k);
    }

    const sessionData = {};
    for (let i = 0; i < sessionStorage.length; i++) {
        const k = sessionStorage.key(i);
        sessionData[k] = sessionStorage.getItem(k);
    }

    storageView.textContent =
        `localStorage:\n${JSON.stringify(localData, null, 2)}\n\n` +
        `sessionStorage:\n${JSON.stringify(sessionData, null, 2)}`;
}

document.getElementById("btnSaveLocal").addEventListener("click", () => {
    const k = keyInput.value.trim();
    if (!k) return;
    localStorage.setItem(k, valInput.value);
    renderStorage();
});

document.getElementById("btnSaveSession").addEventListener("click", () => {
    const k = keyInput.value.trim();
    if (!k) return;
    sessionStorage.setItem(k, valInput.value);
    renderStorage();
});

document.getElementById("btnClearStorage").addEventListener("click", () => {
    localStorage.clear();
    sessionStorage.clear();
    renderStorage();
});

renderStorage();
