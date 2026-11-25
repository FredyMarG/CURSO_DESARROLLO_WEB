# GUÍA DE ESTUDIO — Formularios HTML5 y Validación CSS

**Curso:** CURSO_DESARROLLO_WEB  
**Nivel:** HTML y CSS Intermedio  
**Objetivo:** Construir formularios web accesibles, semánticos y con validación nativa HTML5 + estilos dinámicos CSS (`:valid`, `:invalid`, `:focus-within`, `:placeholder-shown`) listos para conectarse con JavaScript y Node.js.

---

## 1. Anatomía de `<form>`, `action`, `method` y `name`

El elemento `<form>` agrupa controles de entrada para enviarlos o procesarlos con JavaScript:
- `action`: URL destino (si se procesa en servidor tradicional).
- `method`: `"GET"` (parámetros visibles en URL) o `"POST"` (datos en el cuerpo de la petición).
- `name`: **imprescindible** en cada `<input>`, `<select>` o `<textarea>` para que `FormData` o el backend identifiquen el campo.

---

## 2. Tipos de `<input>` modernos en HTML5

| Tipo | Para qué sirve | Ventaja extra |
|---|---|---|
| `type="email"` | Correos electrónicos | Valida formato `@` y teclado con `@` en móviles |
| `type="password"` | Contraseñas | Oculta los caracteres al escribir |
| `type="number"` | Cantidades o edades | Soporta `min`, `max` y `step` |
| `type="date"` / `type="time"` | Fechas y horas | Selector nativo del navegador |
| `type="tel"` / `type="url"` | Teléfonos y URLs | Teclado numérico / validación de protocolo `https://` |
| `type="checkbox"` / `type="radio"` | Selección múltiple o única | `radio` agrupa opciones compartiendo el mismo `name` |

---

## 3. Accesibilidad obligatoria: `<label>`, `for`, `<fieldset>` y `<legend>`

Nunca uses solo `placeholder` como etiqueta: desaparece al escribir y rompe lectores de pantalla.
- Vincula siempre `<label for="correo">` con `<input id="correo">`.
- Al hacer clic en el `<label>`, el cursor enfoca automáticamente el campo.
- Agrupa opciones relacionadas (como radios o dirección) dentro de `<fieldset>` + `<legend>`.

---

## 4. Validación nativa sin JavaScript

| Atributo | Qué valida | Ejemplo |
|---|---|---|
| `required` | Campo obligatorio (no vacío) | `<input required>` |
| `minlength` / `maxlength` | Longitud mínima y máxima de texto | `minlength="8"` |
| `min` / `max` | Rango numérico o de fechas | `min="18" max="99"` |
| `pattern` | Expresión regular HTML5 | `pattern="[A-Za-z0-9]{4,12}"` |
| `autocomplete` | Autocompletado seguro del navegador | `autocomplete="email"` |

---

## 5. Pseudoclases CSS para estados de validación

CSS puede reaccionar en tiempo real al estado del campo sin escribir una sola línea de JavaScript:

```css
/* Evita marcar rojo antes de que el usuario empiece a escribir */
input:not(:placeholder-shown):invalid {
  border-color: #f43f5e;
  box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.2);
}

input:not(:placeholder-shown):valid {
  border-color: #10b981;
}

/* Resalta todo el contenedor cuando un input interno tiene foco */
.campo:focus-within label {
  color: #38bdf8;
}
```

---

## 6. Conectar con JavaScript (`preventDefault` y `FormData`)

```js
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(form));
  console.log(datos);
});
```

---

## ✅ Checklist de dominio del módulo

- [ ] Usar `<label for="...">` vinculado al `id` de cada campo.
- [ ] Elegir el `type` semántico correcto (`email`, `number`, `date`, `password`, `radio`).
- [ ] Aplicar validación nativa con `required`, `minlength`, `min`/`max` y `pattern`.
- [ ] Estilizar estados con `:valid`, `:invalid`, `:not(:placeholder-shown)` y `:focus-within`.
- [ ] Extraer todos los campos con `new FormData(form)`.


---

## Validación Nativa HTML5 y Pseudoclases CSS

HTML5 valida campos sin necesidad de JavaScript mediante atributos declarativos y los combina con pseudoclases CSS modernas:

| Atributo | Qué valida | Ejemplo |
| :--- | :--- | :--- |
| `required` | Campo obligatorio | `<input type="text" required>` |
| `minlength` / `maxlength` | Longitud de texto | `<input minlength="6" maxlength="20">` |
| `min` / `max` / `step` | Rango numérico o de fecha | `<input type="number" min="1" max="10" step="1">` |
| `pattern` | Expresión regular | `<input pattern="[A-Za-z0-9]{4,12}" title="4 a 12 caracteres">` |
| `autocomplete` | Autocompletado del navegador | `autocomplete="email"` / `"current-password"` |

### Estilos modernos con `:user-valid` y `:user-invalid`
A diferencia de `:invalid` (que marca rojo desde que carga la página vacía), `:user-invalid` solo se activa **después de que el usuario interactuó** con el campo:

```css
input:user-invalid {
  border-color: #ef4444;
  outline: 2px solid rgba(239, 68, 68, 0.25);
}

input:user-valid {
  border-color: #10b981;
}
```

---

## Agrupación Semántica y Controles Avanzados

- **`<fieldset>` y `<legend>`:** Agrupan controles relacionados (por ejemplo, dirección de envío o método de pago) para lectores de pantalla.
- **`<datalist>`:** Ofrece sugerencias de autocompletado permitiendo escribir libremente otros valores.
- **`<textarea>`:** Campo multilínea (`rows`, `cols`, `resize: vertical` en CSS).

```html
<fieldset>
  <legend>Preferencias de contacto</legend>
  <label for="ciudad">Ciudad</label>
  <input id="ciudad" name="ciudad" list="ciudades" required>
  <datalist id="ciudades">
    <option value="Bogotá"></option>
    <option value="Madrid"></option>
    <option value="Ciudad de México"></option>
  </datalist>
</fieldset>
```

---

## Procesamiento en JavaScript con `FormData`

```js
const form = document.querySelector('#registroForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const datos = new FormData(form);
  const payload = Object.fromEntries(datos.entries());
  console.log(payload);
});
```

---

## ❌ Errores Comunes en Formularios

1. **Omitir el atributo `name`:** El campo se ve en pantalla pero no se envía en `GET`, `POST` ni aparece en `FormData`.
2. **Usar `placeholder` en lugar de `<label>`:** Desaparece al escribir y rompe la accesibilidad para lectores de pantalla.
3. **Confiar solo en la validación del navegador:** La validación HTML/JS mejora la UX, pero el servidor **siempre** debe revalidar los datos.
4. **Olvidar `enctype="multipart/form-data"`** cuando se envían archivos (`<input type="file">`) sin AJAX.

---

## ✅ Buenas Prácticas Profesionales

- Asocia cada control con `<label for="id">` o envuélvelo dentro del `<label>`.
- Usa tipos específicos (`email`, `tel`, `url`, `search`, `date`) para activar el teclado adecuado en móviles.
- Muestra mensajes de error claros junto al campo usando `aria-describedby` y `role="alert"`.
- Usa `:user-invalid` en lugar de `:invalid` para no frustrar al usuario antes de escribir.

---

## Hoja de Trucos (Cheatsheet) — Formularios HTML5

| Elemento / Atributo | Uso Principal |
| :--- | :--- |
| `<form action="/api" method="POST">` | Contenedor y destino del envío |
| `<label for="x">` + `id="x"` | Etiqueta accesible vinculada al control |
| `name="campo"` | Clave del dato al enviar el formulario |
| `required` / `pattern` / `min` / `max` | Validación declarativa nativa |
| `<fieldset>` + `<legend>` | Agrupación semántica de campos |
| `<select>` / `<datalist>` | Opciones cerradas vs sugerencias abiertas |
| `new FormData(form)` | Captura rápida de todos los campos y archivos en JS |
| `:user-valid` / `:user-invalid` | Feedback visual tras interacción real |
