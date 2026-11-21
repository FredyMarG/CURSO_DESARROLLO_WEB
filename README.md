# 🚀 Curso Completo de Desarrollo Web Frontend (HTML5, CSS3 & JavaScript)

Repositorio integral e interactivo de aprendizaje y práctica progresiva de desarrollo web frontend. Combina **documentación técnica en Markdown**, **diapositivas interactivas**, **laboratorios en vivo**, **retos prácticos de código**, **quizzes** y **consola integrada en el navegador**, todo unificado bajo una interfaz moderna de temas neón dinámicos.

---

## ✨ Características Principales

- **Portal Central Unificado (`index.html`)**: Buscador, catálogo completo y acceso directo a los 4 niveles del curso, documentación y ejercicios.
- **Interfaz Interactiva Unificada (`RESOURCES COURSE/`)**:
  - **5 temas de color dinámicos** (*Cyan, Purple, Emerald, Amber, Rose*) intercambiables en tiempo real desde la barra superior.
  - **Carrusel de teoría interactiva** con ejemplos de código y tablas comparativas limpias.
  - **Laboratorio en vivo + Reto Práctico del Módulo + Quiz + Consola integrada** en cada lección.
- **Favicons SVG personalizados por módulo**: Cada una de las 206 páginas `.html` cuenta con un ícono acorde a su temática.
- **Código documentado línea a línea**: Todos los archivos `.js` (129) y `.css` (124) cuentan con comentarios explicativos en español.

---

## 📂 Estructura del Proyecto

```text
CURSO_DESARROLLO_WEB/
├── index.html                    # Portal principal con catálogo y navegación global
├── README.md                     # Documentación general del repositorio
├── RESOURCES COURSE/             # Motor visual, catálogo, temas neón y retos compartidos
│   ├── app.js                    # Lógica y catálogo del portal principal
│   ├── style.css                 # Estilos del portal principal
│   ├── course-polish.js/.css     # Transformador unificado (HTML/CSS, Mid, Master) + Retos
│   ├── junior-theme.js           # Selector de 5 temas neón y estilos de tabla para Junior
│   └── ejercicios-neon.js/.css   # Interfaz neón unificada para ejercicios prácticos
├── HTML y CSS/                   # 10 módulos principales + 8 guías .md + sub-módulos y proyectos
├── JAVASCRIPT JUNIOR LEVEL/      # 13 módulos + 14 guías .md + 12 ejercicios
├── JAVASCRIPT MID LEVEL/         # 19 módulos + 25 guías .md + 7 ejercicios
└── JAVASCRIPT MASTER LEVEL/      # 24 módulos + 24 guías .md + 8 ejercicios
```

---

## 📚 Contenido por Nivel

### 1. [HTML y CSS](./HTML%20y%20CSS)
- **Documentación (`HTML y CSS/Documentacion/`):** 8 guías técnicas actualizadas (HTML Living Standard, CSS moderno, Flexbox, Grid & `subgrid`, Responsive Design & Container Queries, Animaciones, Funciones Avanzadas como `color-mix()`/`clamp()`, y Hosting/Edge).
- **Módulos y Sub-módulos organizados:** `HTML BASICO` (Enlaces, Formularios, Imágenes, Listas, Títulos y Párrafos), `HTML avanzado` (Accesibilidad, Audio/Video, HTML Semántico, Tablas, Details/Summary, etc.), `CSS BASICO` (incluye ejercicio `Tarjeta de presentacion`), `CSS avanzado` (BEM, Display, Position, Pseudoclases, Pseudoelementos, Transiciones, Ventana Modal), `Flexbox`, `Grid`, `Animaciones`, `Funciones Avanzadas`, `Responsive Design` y `PROYECTOS` (Accordion, Chatbox, Flipper Card 3D, Sidebar Menu, One View Page y Web Pages).

### 2. [JavaScript Junior Level](./JAVASCRIPT%20JUNIOR%20LEVEL)
- **Documentación (`JAVASCRIPT JUNIOR LEVEL/DOCUMENTACION/`):** 14 guías actualizadas a ES2023–ES2025 (`VARIABLES.md`, `OPERADORES.md`, `CONCATENACION.md`, `CONDICIONALES.md`, `ARRAYS.md`, `ARRAYS_METHODS.md`, `BUCLES.md`, `CADENAS.md`, `METODOS DE CADENA.md`, `FUNCIONES.md`, `MATH.md`, `CONSOLE.LOG.md`, `POO.md`, `DOM.md`).
- **Práctica:** 13 laboratorios interactivos con salida visual en el DOM, selector de tema dinámico y 12 ejercicios resueltos en `EJERCICIOS/`.

### 3. [JavaScript Mid Level](./JAVASCRIPT%20MID%20LEVEL)
- **Documentación (`JAVASCRIPT MID LEVEL/DOCUMENTACION/`):** 25 guías técnicas (Callbacks, Promesas, Async/Await, Fetch, Axios, AJAX, JSON, HTTP, Eventos, Try-Catch, Temporizadores, Window/Location/Screen/Resize, Código Obsoleto y pestañas de Chrome DevTools).
- **Práctica:** 19 módulos interactivos con laboratorio, reto práctico y quiz, más 7 ejercicios en `EJERCICIOS/`.

### 4. [JavaScript Master Level](./JAVASCRIPT%20MASTER%20LEVEL)
- **Documentación (`JAVASCRIPT MASTER LEVEL/DOCUMENTACION/`):** 24 guías avanzadas sobre Web APIs y fundamentos profundos (`APIs`, `Cache`, `Canvas`, `Cookies`, `Drag & Drop`, `File Reader`, `Funciones Flecha`, `Geolocalización`, `Historial`, `IndexedDB`, `Intersection Observer`, `LocalStorage`, `MatchMedia`, `Memoization`, `Modo Estricto`, `Objeto Date`, `Objeto Navigator`, `Objeto Screen`, `Notifications`, `Operador Ternario`, `Prototipos`, `Service Workers`, `Visibility Change`, `Web Workers`).
- **Práctica:** 24 módulos interactivos y 8 ejercicios avanzados en `EJERCICIOS/` (incluyendo `Uso de Cookies`, `Drag & Drop File Reader`, `IndexedDB`, `Intersection Objects Lazyload`, `Galería Dinámica`, `Local Storage`, `Reloj` y `Texturizador`).

---

## 🛠️ Cómo Ejecutar en Local

1. Clona o descarga este repositorio.
2. Para la mayoría de módulos basta con abrir [index.html](./index.html) en tu navegador.
3. **Recomendado (para módulos con `Fetch`, `Ajax`, `Cache`, `Cookies` o `Service Workers`):** inicia un servidor HTTP local desde la carpeta raíz:
   - Con **VS Code**: extensión **Live Server** → *Open with Live Server* sobre `index.html`.
   - Con **Node.js**:
     ```bash
     npx serve .
     ```
   - Con **Python**:
     ```bash
     python -m http.server 8080
     ```
