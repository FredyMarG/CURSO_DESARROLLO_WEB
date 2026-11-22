# GUÍA COMPLETA — FileReader API en JavaScript

> **Nivel:** Desde principiante hasta avanzado (Junior → Semi Senior)  
> **Objetivo:** Dominar el procesamiento asíncrono de archivos locales en el cliente mediante el objeto nativo `FileReader`, comprendiendo la lectura en texto plano (`readAsText`), la codificación en Base64 (`readAsDataURL`), el ciclo de vida de sus eventos de carga (`progress`, `loadend`) y su integración con interfaces dinámicas y la API de Drag & Drop.

# Conceptos Complementarios: `readAsArrayBuffer()`, `abort()` y Alternativas Modernas

### 1. Lectura binaria con `readAsArrayBuffer()` y cancelación con `abort()`
* **`reader.readAsArrayBuffer(file)`:** Lee archivos binarios crudos (audio, PDF, binarios) para procesarlos con `Uint8Array` o enviarlos a un Web Worker.
* **`reader.abort()`:** Cancela inmediatamente una lectura pesada en curso y dispara el evento `abort`.

### 2. Alternativas modernas más concisas (ES2020+)
Hoy en día, para casos simples, existen métodos directos sobre `File` / `Blob` que evitan crear un `FileReader`:
```javascript
// Leer texto moderno en una sola línea (Promesa)
const texto = await archivo.text();

// Vista previa instantánea de imagen/video sin codificar a Base64
const urlTemporal = URL.createObjectURL(archivo);
img.src = urlTemporal;
```
*(Recuerda liberar `URL.revokeObjectURL(urlTemporal)` cuando ya no necesites la vista previa).*

---

# Ejercicios

## Nivel 1
Escucha el evento `change` de un `<input type="file" id="input-txt">` y lee el contenido de un archivo `.txt` usando `FileReader.readAsText()`, mostrándolo en consola al terminar (`load`).

## Nivel 2
Lee una imagen seleccionada con `readAsDataURL()` y asígnala como `src` de una etiqueta `<img id="preview">`, validando primero que `archivo.type.startsWith("image/")`.

## Nivel 3
Implementa un lector con seguimiento de progreso (`progress`) que actualice el porcentaje `Math.round((e.loaded / e.total) * 100)` en pantalla mientras carga un archivo grande.

---

# Solucionario paso a paso

## Solución Nivel 1
```javascript
document.getElementById("input-txt").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => console.log(reader.result));
    reader.readAsText(file);
});
```

## Solución Nivel 2
```javascript
const previsualizarImagen = (file) => {
    if (!file.type.startsWith("image/")) return console.warn("No es una imagen");
    const reader = new FileReader();
    reader.onload = () => {
        document.getElementById("preview").src = reader.result;
    };
    reader.readAsDataURL(file);
};
```

## Solución Nivel 3
```javascript
const leerConProgreso = (file, barraEl) => {
    const reader = new FileReader();
    reader.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            barraEl.style.width = `${pct}%`;
        }
    });
    reader.readAsDataURL(file);
};
```

---

# Hoja de Trucos (Cheatsheet)

| Método / Evento | Propósito | Resultado |
| :--- | :--- | :--- |
| `readAsText(file)` | Lee archivos de texto/JSON/CSV | String en `reader.result` |
| `readAsDataURL(file)` | Codifica imágenes/medios en Base64 | Data URL lista para `src` |
| `readAsArrayBuffer(file)` | Lee bytes binarios crudos | `ArrayBuffer` |
| `progress` / `load` / `error` | Eventos del ciclo de lectura | Porcentaje, éxito o fallo |
