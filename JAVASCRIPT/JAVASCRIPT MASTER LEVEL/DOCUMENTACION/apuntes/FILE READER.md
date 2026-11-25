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


---

## Alternativa Moderna con Promesas (`File` / `Blob` API)

Además de los eventos clásicos de `FileReader`, los navegadores modernos permiten leer archivos directamente con `async/await`:

```js
inputFile.addEventListener('change', async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validación previa de tipo y tamaño (máx 2 MB)
  if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) {
    alert('Solo imágenes menores a 2 MB');
    return;
  }

  // Para previsualizar imágenes es más rápido createObjectURL que DataURL
  const previewUrl = URL.createObjectURL(file);
  imgPreview.src = previewUrl;
  imgPreview.onload = () => URL.revokeObjectURL(previewUrl);
});
```

### Lectura directa de texto o binarios
```js
const texto = await file.text();            // Reemplaza readAsText
const buffer = await file.arrayBuffer();    // Reemplaza readAsArrayBuffer
```

---

## ❌ Errores Comunes con FileReader

1. **Leer archivos enormes con `readAsDataURL()`:** Convierte a Base64 (aumenta ~33% el tamaño en RAM) y puede bloquear la pestaña; usa `URL.createObjectURL(file)` para previsualizaciones de imagen/video.
2. **No liberar `ObjectURL` con `URL.revokeObjectURL()`:** Provoca fugas de memoria en SPAs si el usuario carga muchos archivos.
3. **No validar `file.type` ni `file.size`:** Confiar solo en `accept="image/*"` del HTML no impide que el usuario seleccione cualquier archivo.
4. **Intentar leer `reader.result` de forma síncrona:** La lectura es asíncrona; solo existe dentro del evento `load` (o tras `await`).

---

## ✅ Buenas Prácticas

- Usa `URL.createObjectURL(file)` para vistas previas multimedia y `await file.text()` para JSON/CSV/TXT.
- Muestra barras de progreso usando `reader.onprogress` (`e.loaded / e.total`) para archivos pesados.
- Maneja siempre `reader.onerror` y `reader.onabort` para notificar fallos de permisos o cancelaciones.
