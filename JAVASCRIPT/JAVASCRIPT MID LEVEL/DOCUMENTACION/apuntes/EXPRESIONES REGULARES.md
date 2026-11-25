# GUÍA DE ESTUDIO — Expresiones Regulares (`RegExp`) en JavaScript

**Curso:** CURSO_DESARROLLO_WEB  
**Nivel:** JavaScript Mid Level  
**Objetivo:** Dominar las **Expresiones Regulares (`RegExp`)** en JavaScript para validar formatos (emails, contraseñas, fechas, slugs), buscar coincidencias con `test()`/`match()`/`matchAll()` y transformar textos con `replace()`/`replaceAll()`.

---

## 1. ¿Qué es una Expresión Regular (`RegExp`)?

Una **Expresión Regular** es un patrón de búsqueda que describe un conjunto de cadenas de texto. En JavaScript se puede crear de dos formas:
- **Literal (recomendada si el patrón es fijo):** `/^[a-z0-9]+$/i`
- **Constructor (útil si el patrón es dinámico desde una variable):** `new RegExp('^' + palabra, 'i')`

---

## 2. Banderas (*Flags*) esenciales

| Flag | Significado | Ejemplo |
|---|---|---|
| `g` | Global: busca **todas** las coincidencias, no solo la primera | `/\d+/g` |
| `i` | Insensible a mayúsculas y minúsculas (*case-insensitive*) | `/node/i` |
| `m` | Multilínea: `^` y `$` aplican al inicio/fin de cada línea | `/^error/gm` |
| `u` | Unicode completo (necesario para emojis y `\p{L}`) | `/\p{L}+/gu` |

---

## 3. Clases de caracteres, anclas y cuantificadores

| Token | Qué coincide |
|---|---|
| `\d` / `\D` | Dígito (`0–9`) / No dígito |
| `\w` / `\W` | Letra, número o `_` / Lo contrario |
| `\s` / `\S` | Espacio, tab o salto de línea / No espacio |
| `^` y `$` | Inicio y fin exacto de la cadena (clave para validar formularios) |
| `+`, `*`, `?` | 1 o más, 0 o más, 0 o 1 (opcional) |
| `{n,m}` | Entre `n` y `m` repeticiones exactas (ej. `\d{4}`) |
| `[abc]` / `[^abc]` | Cualquiera de `a, b, c` / Cualquiera EXCEPTO `a, b, c` |

---

## 4. Métodos principales en JS (`RegExp` y `String`)

```js
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// 1) Validar (devuelve true / false)
console.log(regexEmail.test('ana@curso.dev')); // true

// 2) Extraer grupos nombrados con match()
const fecha = '2026-11-25'.match(/^(?<anio>\d{4})-(?<mes>\d{2})-(?<dia>\d{2})$/);
console.log(fecha?.groups); // { anio: '2026', mes: '11', dia: '25' }

// 3) Reemplazar múltiples coincidencias
const slug = 'Curso   Node JS!'.trim().toLowerCase().replace(/\s+/g, '-');
```

> **Trampa clásica:** Si usas la bandera `g` junto con `.test()`, `regex.lastIndex` avanza en cada llamada y puede alternar `true`/`false`. Para validar con `.test()`, **no uses la bandera `g`**.

---

## ✅ Checklist de dominio del módulo

- [ ] Diferenciar literal `/patrón/flags` vs `new RegExp()`.
- [ ] Usar anclas `^` y `$` al validar entradas completas.
- [ ] Aplicar `\d`, `\w`, `\s`, `+`, `*`, `?` y `{n,m}`.
- [ ] Extraer datos con grupos de captura `(...)` y grupos nombrados `(?<nombre>...)`.
- [ ] Evitar la trampa de `lastIndex` al usar `.test()` con el flag `g`.


---

## Banderas (Flags) Esenciales

| Flag | Significado | Ejemplo |
| :--- | :--- | :--- |
| `g` | Búsqueda global (todas las coincidencias) | `/js/g` |
| `i` | Insensible a mayúsculas/minúsculas | `/hola/i` |
| `m` | Multilínea (`^` y `$` por cada línea) | `/^item/gm` |
| `s` | DotAll (`.` también coincide con `\n`) | `/<a>.*<\/a>/s` |
| `u` | Unicode completo (emojis, acentos `\p{L}`) | `/\p{L}+/gu` |

---

## Cuantificadores, Anclas y Grupos

| Patrón | Significado | Ejemplo |
| :--- | :--- | :--- |
| `^` / `$` | Inicio y fin de cadena/línea | `/^\d{4}$/` |
| `+` / `*` / `?` | 1+, 0+, 0 o 1 repetición | `/colou?r/` |
| `{n,m}` | Entre `n` y `m` repeticiones | `/\d{2,4}/` |
| `+?` / `*?` | Cuantificador perezoso (*lazy*) | `/".*?"/` |
| `(abc)` / `(?:abc)` | Grupo de captura vs no captura | `/(?:https?):\/\/([^/]+)/` |
| `(?<nombre>...)` | Grupo nombrado | `/(?<year>\d{4})-(?<month>\d{2})/` |
| `(?=...)` / `(?!...)` | Lookahead positivo y negativo | `/\d+(?=€)/` |

---

## Métodos Modernos en JavaScript

```js
// 1. Validar formato rápido
const esEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test('ana@dev.com');

// 2. Iterar todas las capturas con matchAll()
const texto = 'ID: #104, ID: #208';
for (const m of texto.matchAll(/#(?<id>\d+)/g)) {
  console.log(m.groups.id); // "104", "208"
}

// 3. Reemplazo dinámico con función
const censurado = 'Tel: 3001234567'.replace(/\d(?=\d{4})/g, '*'); // Tel: ******4567
```

---

## ❌ Errores Comunes con RegEx

1. **Reutilizar una RegEx con flag `g` usando `.test()`:** El puntero interno `lastIndex` avanza y alterna `true`/`false` en llamadas seguidas. Quita `g` si solo validas con `.test()`.
2. **Olvidar escapar caracteres especiales:** `.` `+` `*` `?` `(` `)` `[` `]` deben escaparse con `\` cuando buscas el carácter literal (ej. `\.com`).
3. **Catastrophic Backtracking:** Cuantificadores anidados como `(a+)+` sobre entradas largas pueden congelar el hilo principal (ReDoS).
4. **Parsear HTML complejo con RegEx:** Usa `DOMParser` o el DOM nativo para HTML arbitrario.

---

## ✅ Buenas Prácticas

- Usa grupos nombrados `(?<clave>...)` para que tus patrones sean legibles y fáciles de mantener.
- Prefiere cuantificadores acotados (`{1,50}`) frente a `.*` sin límites en entradas de usuario.
- Comenta patrones complejos o usa `RegExp.escape()` / utilidades de sanitización si construyes `new RegExp(inputUsuario)` desde texto dinámico.

---

## Hoja de Trucos (Cheatsheet) — Expresiones Regulares

| Elemento | Descripción |
| :--- | :--- |
| `\d` / `\D` | Dígito `[0-9]` / No dígito |
| `\w` / `\W` | Alfanumérico `[A-Za-z0-9_]` / No alfanumérico |
| `\s` / `\S` | Espacio en blanco / No espacio |
| `\b` | Límite de palabra |
| `regex.test(str)` | Devuelve `true` o `false` |
| `str.matchAll(regex)` | Iterador con todas las coincidencias y grupos (`g` requerido) |
| `str.replaceAll(regex, fn)` | Reemplaza todas las coincidencias |
