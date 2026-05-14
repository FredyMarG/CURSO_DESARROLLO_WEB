/**
 * 💾 APPLICATION TAB LABORATORY
 * Gestión de persistencia: LocalStorage y SessionStorage.
 */

// 1. Definición de llaves para el almacenamiento
const LLAVE_TEMA = "theme_preference";
const VALOR_TEMA = "dark_modern_pro";

// 2. Escritura en LocalStorage (Persiste tras cerrar el navegador)
// Verifica esto en: Application -> Storage -> Local Storage
localStorage.setItem(LLAVE_TEMA, VALOR_TEMA);

// 3. Escritura en SessionStorage (Solo dura esta pestaña abierta)
// Verifica esto en: Application -> Storage -> Session Storage
sessionStorage.setItem("pestaña_activa", "true");

// 4. Lectura y log para confirmación
console.log("Valor recuperado de Application:", localStorage.getItem(LLAVE_TEMA));