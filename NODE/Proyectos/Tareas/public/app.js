/**
 * CLIENTE WEB EN EL NAVEGADOR (public/app.js)
 * - Detecta automáticamente si está corriendo bajo src/server.js (/api/tareas):
 *   · Modo Node.js (localhost:3000): persiste en data/tareas.json y data/eventos.ndjson reales.
 *   · Modo Demo (portal estático / file://): simula la misma persistencia con localStorage.
 * - Renderiza las tareas usando createElement + textContent para evitar inyección HTML (XSS)
 *   y actualiza en vivo los visores JSON y NDJSON de la columna derecha.
 */
// IIFE (función autoejecutable) para encapsular variables y evitar colisiones en window
(function () {
  // Referencias a los elementos del DOM manipulados por la interfaz
  const form = document.getElementById('taskForm');             // Formulario para crear tareas
  const input = document.getElementById('taskInput');           // Campo de texto de la descripción
  const listEl = document.getElementById('taskList');           // Lista <ul> donde se pintan las tareas
  const errorBox = document.getElementById('errorBox');         // Contenedor de mensajes de error
  const jsonPreview = document.getElementById('jsonPreview');   // Visor derecho de tareas.json
  const ndjsonPreview = document.getElementById('ndjsonPreview'); // Visor derecho de eventos.ndjson
  const modeBadge = document.getElementById('modeBadge');       // Pill superior de modo activo
  const serverHint = document.getElementById('serverHint');     // Nota informativa bajo la lista

  // Claves de localStorage usadas únicamente cuando NO hay servidor Node.js activo (Modo Demo)
  const LS_TAREAS = 'curso_node_tareas_demo';
  const LS_EVENTOS = 'curso_node_eventos_demo';
  // Bandera que indica si estamos conectados a src/server.js (true) o en modo navegador (false)
  let useNodeApi = false;

  // Comprueba si el servidor HTTP de Node.js (src/server.js) está respondiendo en /api/tareas
  async function detectBackend() {
    // Si se abrió con doble clic (file://), no hay backend HTTP disponible
    if (location.protocol === 'file:') return false;
    try {
      const res = await fetch('/api/tareas', { method: 'GET' });
      const ct = res.headers.get('content-type') || '';
      // Verificamos status 200 y que devuelva JSON real (no un 404 HTML de otro servidor)
      return res.ok && ct.includes('application/json');
    } catch {
      return false;
    }
  }

  // --- Helpers del Modo Demo (almacenan en localStorage simulando tareas.json y eventos.ndjson) ---
  function demoReadTareas() {
    return JSON.parse(localStorage.getItem(LS_TAREAS) || '[]');
  }
  function demoSaveTareas(tareas) {
    localStorage.setItem(LS_TAREAS, JSON.stringify(tareas));
  }
  function demoReadEventos() {
    return JSON.parse(localStorage.getItem(LS_EVENTOS) || '[]');
  }
  function demoPushEvento(evento) {
    const ev = demoReadEventos();
    ev.push({ ts: new Date().toISOString(), ...evento });
    localStorage.setItem(LS_EVENTOS, JSON.stringify(ev));
  }

  // Obtiene en paralelo la lista de tareas y el historial de eventos (desde Node o Demo)
  async function apiListar() {
    if (useNodeApi) {
      const [tRes, eRes] = await Promise.all([fetch('/api/tareas'), fetch('/api/eventos')]);
      return { tareas: await tRes.json(), eventos: await eRes.json() };
    }
    return { tareas: demoReadTareas(), eventos: demoReadEventos() };
  }

  // Crea una nueva tarea enviando POST /api/tareas a Node.js o guardando en localStorage
  async function apiCrear(descripcion) {
    if (useNodeApi) {
      const res = await fetch('/api/tareas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcion }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo crear la tarea');
      return data;
    }
    const limpia = String(descripcion || '').trim();
    if (!limpia) throw new Error('La descripción es requerida');
    const tareas = demoReadTareas();
    const nueva = {
      id: crypto.randomUUID(),
      descripcion: limpia,
      completada: false,
      creadoEn: new Date().toISOString(),
    };
    tareas.push(nueva);
    demoSaveTareas(tareas);
    demoPushEvento({ tipo: 'tarea:creada', id: nueva.id, descripcion: nueva.descripcion });
    return nueva;
  }

  // Marca como completada la tarea indicada (PATCH /api/tareas/:id en Node.js)
  async function apiCompletar(id) {
    if (useNodeApi) {
      const res = await fetch(`/api/tareas/${encodeURIComponent(id)}`, { method: 'PATCH' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo completar');
      return data;
    }
    const tareas = demoReadTareas();
    const t = tareas.find((item) => item.id === id);
    if (!t) throw new Error('Tarea no encontrada');
    t.completada = true;
    demoSaveTareas(tareas);
    demoPushEvento({ tipo: 'tarea:completada', id: t.id });
  }

  // Elimina la tarea indicada (DELETE /api/tareas/:id en Node.js)
  async function apiEliminar(id) {
    if (useNodeApi) {
      const res = await fetch(`/api/tareas/${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo eliminar');
      return data;
    }
    const restantes = demoReadTareas().filter((item) => item.id !== id);
    demoSaveTareas(restantes);
    demoPushEvento({ tipo: 'tarea:eliminada', id });
  }

  // Dibuja la lista de tareas en el DOM y actualiza los visores derechos de JSON y NDJSON
  async function render() {
    const { tareas, eventos } = await apiListar();
    // Limpiamos la lista actual antes de re-renderizar
    listEl.innerHTML = '';

    if (tareas.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'hint';
      empty.textContent = '📭 No hay tareas todavía. Agrega una arriba.';
      listEl.appendChild(empty);
    } else {
      for (const t of tareas) {
        // Creamos el contenedor <li> de cada tarea
        const li = document.createElement('li');
        li.className = 'task-item';

        // Bloque izquierdo: texto de la tarea + ID corto y fecha legible
        const info = document.createElement('div');
        info.className = 'task-info';

        const desc = document.createElement('span');
        desc.className = `task-desc${t.completada ? ' done' : ''}`;
        desc.textContent = `${t.completada ? '✅' : '⏳'} ${t.descripcion}`;

        const meta = document.createElement('span');
        meta.className = 'task-meta';
        meta.textContent = `id: ${t.id.slice(0, 8)} · ${new Date(t.creadoEn).toLocaleString()}`;

        info.append(desc, meta);

        // Bloque derecho: botones de acción (Completar solo si sigue pendiente, y Eliminar)
        const btns = document.createElement('div');
        btns.className = 'task-btns';

        if (!t.completada) {
          const btnDone = document.createElement('button');
          btnDone.className = 'mini-btn btn-done';
          btnDone.textContent = 'Completar';
          btnDone.onclick = async () => {
            errorBox.textContent = '';
            await apiCompletar(t.id);
            await render();
          };
          btns.appendChild(btnDone);
        }

        const btnDel = document.createElement('button');
        btnDel.className = 'mini-btn btn-del';
        btnDel.textContent = 'Eliminar';
        btnDel.onclick = async () => {
          errorBox.textContent = '';
          await apiEliminar(t.id);
          await render();
        };
        btns.appendChild(btnDel);

        li.append(info, btns);
        listEl.appendChild(li);
      }
    }

    // Actualizamos los visores derechos con el formato exacto de tareas.json y eventos.ndjson
    jsonPreview.textContent = JSON.stringify(tareas, null, 2);
    ndjsonPreview.textContent = eventos.length
      ? eventos.map((e) => JSON.stringify(e)).join('\n')
      : '(sin eventos)';
  }

  // Maneja el envío del formulario sin recargar la página
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.textContent = '';
    try {
      await apiCrear(input.value);
      input.value = '';
      await render();
    } catch (err) {
      errorBox.textContent = `❌ ${err.message}`;
    }
  });

  // Arranque inicial: detecta si existe el servidor Node.js y configura enlaces/textos
  (async function init() {
    useNodeApi = await detectBackend();
    if (useNodeApi) {
      // Desde http://localhost:3000 usamos rutas absolutas servidas por src/server.js
      document.getElementById('btnProjects').href = '/index.html?filter=proyectos';
      document.getElementById('btnPortal').href = '/index.html';
      modeBadge.textContent = '🟢 Conectado a Node.js (data/ real)';
      serverHint.innerHTML = 'Guardando en <code>data/tareas.json</code> y <code>data/eventos.ndjson</code> mediante <code>src/server.js</code>.';
    } else {
      modeBadge.textContent = '🟡 Modo Demo Navegador';
      serverHint.innerHTML = 'Para guardar en disco real con Node.js, ejecuta <code>npm run web</code> en <code>NODE/Proyectos/Tareas</code> y abre <code>http://localhost:3000</code>.';
    }
    await render();
  })();
})();
